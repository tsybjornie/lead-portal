/**
 * Budget Optimizer Engine
 * Takes a generated quote and a target budget, then intelligently
 * adjusts material tiers and optional items to fit within the budget.
 * 
 * Works like a minimart: trade prices (cost) are fixed floors,
 * but materials can be swapped to cheaper tiers to reduce the total.
 */

import { GeneratedTradeSection, GeneratedLineItem } from './auto-quote';

// ============================================================
// MATERIAL TIER SYSTEM
// ============================================================

export type MaterialTier = 'budget' | 'standard' | 'premium' | 'luxury';

export interface MaterialOption {
    tier: MaterialTier;
    label: string;           // e.g. "Ceramic tiles (300×300)"
    brand?: string;          // e.g. "Niro Granite"
    materialRate: number;    // cost per unit (material only)
    description: string;     // plain English
}

/**
 * Material options per line item type.
 * Each key matches a rate key from auto-quote.ts RATES table.
 */
export const MATERIAL_OPTIONS: Record<string, MaterialOption[]> = {
    // Tiling
    'wall_tiling': [
        { tier: 'budget', label: 'Ceramic 300×300mm', materialRate: 4, description: 'Basic ceramic wall tiles, limited colour range' },
        { tier: 'standard', label: 'Porcelain 300×600mm', materialRate: 8, description: 'Glazed porcelain, good variety. Most popular choice.' },
        { tier: 'premium', label: 'Rectified porcelain 600×600mm', materialRate: 14, description: 'Precision-cut edges, minimal grout lines, modern look' },
        { tier: 'luxury', label: 'Italian marble-look 600×1200mm', materialRate: 22, description: 'Large-format, marble-effect porcelain, imported' },
    ],
    'floor_tiling': [
        { tier: 'budget', label: 'Homogeneous 300×300mm', materialRate: 5, description: 'Durable, basic look, non-slip options available' },
        { tier: 'standard', label: 'Porcelain 600×600mm', materialRate: 10, description: 'Good balance of quality and cost' },
        { tier: 'premium', label: 'Rectified porcelain 600×600mm', materialRate: 16, description: 'Clean lines, minimal grout, many finishes' },
        { tier: 'luxury', label: 'Natural stone / large-format 800×800mm', materialRate: 28, description: 'Premium imported tiles or natural stone' },
    ],

    // Flooring
    'vinyl_flooring': [
        { tier: 'budget', label: 'PVC click vinyl 3mm', brand: 'Budget', materialRate: 1.5, description: 'Basic vinyl plank, limited patterns' },
        { tier: 'standard', label: 'SPC click-lock 4mm', brand: 'Korean SPC', materialRate: 3, description: 'Rigid core, water-resistant, good variety. Most popular.' },
        { tier: 'premium', label: 'SPC 5mm + cork underlay', brand: 'Swiss Krono', materialRate: 5, description: 'Thicker, quieter, premium wood textures' },
        { tier: 'luxury', label: 'European engineered timber 14mm', brand: 'Kährs', materialRate: 12, description: 'Real wood top layer, 10-year warranty' },
    ],

    // Countertops
    'countertop_quartz': [
        { tier: 'budget', label: 'Solid surface', brand: 'Hi-Macs', materialRate: 60, description: 'Acrylic solid surface, seamless joints, limited patterns' },
        { tier: 'standard', label: 'Quartz 15mm', brand: 'Caesarstone', materialRate: 140, description: 'Engineered quartz, wide colour range, stain-resistant' },
        { tier: 'premium', label: 'Quartz 20mm', brand: 'Silestone', materialRate: 200, description: 'Thicker quartz, integrated backsplash option' },
        { tier: 'luxury', label: 'Sintered stone 12mm', brand: 'Dekton', materialRate: 320, description: 'Ultra-compact surface, heat/scratch-proof, premium look' },
    ],

    // Cabinets
    'base_cabinet': [
        { tier: 'budget', label: 'Particle board + melamine (LPL)', materialRate: 140, description: 'Particle board carcass, melamine (low-pressure laminate) doors, ABS edge banding' },
        { tier: 'standard', label: 'Marine plywood + HPL', brand: 'Lamitak/Formica', materialRate: 220, description: '18mm marine plwd, HPL (high-pressure laminate) doors, PUR edge, Blum hinges' },
        { tier: 'premium', label: 'Marine plywood + acrylic/lacquer', materialRate: 300, description: 'Acrylic or spray-lacquer doors, laser edge (zero-joint), soft-close throughout' },
        { tier: 'luxury', label: 'Solid wood + lacquer spray', materialRate: 450, description: 'Solid hardwood frame, 2K lacquer spray finish, Hettich/Blum hardware, custom design' },
    ],
    'upper_cabinet': [
        { tier: 'budget', label: 'Particle board + melamine (LPL)', materialRate: 110, description: 'Particle board, melamine face, ABS edge' },
        { tier: 'standard', label: 'Marine plywood + HPL', brand: 'Lamitak/Formica', materialRate: 170, description: '18mm marine plywood, HPL face, PUR edge' },
        { tier: 'premium', label: 'Marine plywood + acrylic', materialRate: 240, description: 'High-gloss acrylic face, laser edge' },
        { tier: 'luxury', label: 'Solid wood + lacquer spray', materialRate: 380, description: 'Solid hardwood, custom, 2K lacquer' },
    ],
    'wardrobe': [
        { tier: 'budget', label: 'Particle board + melamine + basic slide', materialRate: 160, description: 'Particle board carcass, melamine face, bottom-roller sliding doors, ABS edge' },
        { tier: 'standard', label: 'Plywood + HPL + aluminium slide', materialRate: 260, description: '18mm plywood, HPL face, top-hung aluminium frame sliding, PUR edge, Blum hinges' },
        { tier: 'premium', label: 'Plywood + veneer/leather + soft-close', materialRate: 380, description: 'Real wood veneer or leather-wrapped doors, Blum Tandem runners, laser edge' },
        { tier: 'luxury', label: 'Walk-in system + glass/lacquer doors', materialRate: 550, description: 'Modular walk-in with glass panels, LED strip lighting, Hettich accessories, 2K lacquer' },
    ],

    // Painting
    'painting': [
        { tier: 'budget', label: '2-coat emulsion', brand: 'Nippon Matex', materialRate: 0.50, description: 'Basic vinyl matt paint, limited colours' },
        { tier: 'standard', label: '1 sealer + 2 coats', brand: 'Nippon / Dulux', materialRate: 0.80, description: 'Sealer + 2 coats, washable, large colour range' },
        { tier: 'premium', label: 'Odourless premium', brand: 'Dulux Ambiance', materialRate: 1.20, description: 'Low-VOC, anti-bacterial, premium finish' },
        { tier: 'luxury', label: 'Textured / limewash', brand: 'Jotun Lady', materialRate: 2.50, description: 'Artisan textured finish, limewash or Venetian plaster effect' },
    ],

    // Aircon
    'aircon_system': [
        { tier: 'budget', label: 'Midea inverter', brand: 'Midea', materialRate: 1200, description: 'Budget inverter, 5-tick, basic features' },
        { tier: 'standard', label: 'Daikin inverter', brand: 'Daikin', materialRate: 2000, description: 'Reliable Japanese brand, 5-tick, good warranty' },
        { tier: 'premium', label: 'Mitsubishi Starmex', brand: 'Mitsubishi', materialRate: 2600, description: 'Premium quiet operation, advanced filtration' },
        { tier: 'luxury', label: 'Daikin ceiling cassette', brand: 'Daikin', materialRate: 3800, description: 'Concealed ceiling-mounted, 360° airflow' },
    ],

    // WC
    'wc': [
        { tier: 'budget', label: 'Floor-mounted WC + exposed cistern', materialRate: 180, description: 'Basic floor-mounted toilet' },
        { tier: 'standard', label: 'Wall-hung WC + concealed cistern (Geberit)', materialRate: 350, description: 'Modern wall-hung, easy cleaning' },
        { tier: 'premium', label: 'Rimless wall-hung + soft-close', brand: 'Kohler', materialRate: 550, description: 'Rimless flush, hygienic, premium brand' },
        { tier: 'luxury', label: 'Smart bidet toilet', brand: 'TOTO Washlet', materialRate: 1200, description: 'Integrated bidet, heated seat, auto-flush' },
    ],

    // Shower screen
    'shower_screen': [
        { tier: 'budget', label: 'Shower curtain + rod', materialRate: 30, description: 'Simple shower curtain setup' },
        { tier: 'standard', label: '10mm tempered glass, fixed panel', materialRate: 250, description: 'Frameless fixed panel, SS brackets' },
        { tier: 'premium', label: '10mm glass, swing door', materialRate: 400, description: 'Frameless swing door, full enclosure' },
        { tier: 'luxury', label: 'Nano-coated glass sliding system', materialRate: 650, description: 'Easy-clean nano coating, premium hardware' },
    ],

    // Vanity
    'vanity_basin': [
        { tier: 'budget', label: 'PVC vanity + ceramic basin', materialRate: 150, description: 'Water-resistant PVC cabinet' },
        { tier: 'standard', label: 'Plywood vanity + ceramic basin', materialRate: 250, description: 'Laminate plywood cabinet, undermount basin' },
        { tier: 'premium', label: 'Solid surface + vessel basin', materialRate: 400, description: 'Solid surface top, designer vessel basin' },
        { tier: 'luxury', label: 'Custom marble + branded basin', brand: 'Grohe/Duravit', materialRate: 800, description: 'Natural marble top, European designer basin' },
    ],

    // Doors
    'bedroom_door': [
        { tier: 'budget', label: 'Hollow-core laminate door', materialRate: 180, description: 'Standard HDB door replacement' },
        { tier: 'standard', label: 'Semi-solid laminate door', materialRate: 280, description: 'Better sound insulation, various finishes' },
        { tier: 'premium', label: 'Solid core veneer door', materialRate: 420, description: 'Real wood veneer, premium feel and sound insulation' },
        { tier: 'luxury', label: 'Solid hardwood door', materialRate: 700, description: 'Full solid timber, custom design' },
    ],
};

// ============================================================
// BUDGET PRIORITY SYSTEM
// ============================================================

/**
 * Priority ranking: which items to downgrade first when budget is tight.
 * Lower number = downgrade first (least impact on daily use).
 * Higher number = protect last (most impact).
 */
const ITEM_PRIORITY: Record<string, number> = {
    // Downgrade first (cosmetic / nice-to-have)
    'feature_wall': 10,
    'tv_console': 15,
    'painting': 20,
    'ceiling_paint': 20,
    'shoe_cabinet': 25,

    // Middle tier (functional but flexible material)
    'vinyl_flooring': 30,
    'tile_flooring': 30,
    'wall_tiling': 35,
    'floor_tiling': 35,
    'bedroom_door': 40,
    'wardrobe': 45,

    // High priority (core kitchen  used daily)
    'base_cabinet': 50,
    'upper_cabinet': 50,
    'countertop_quartz': 55,

    // Protect last (structural / safety / comfort)
    'wc': 60,
    'vanity_basin': 60,
    'shower_screen': 60,
    'aircon_system': 65,
    'waterproofing': 90,  // never downgrade
    'hack_floor': 90,
    'hack_wall': 90,
    'rewiring': 90,
};

// ============================================================
// OPTIMIZER
// ============================================================

export interface BudgetResult {
    sections: GeneratedTradeSection[];
    originalTotal: number;
    optimizedTotal: number;
    budget: number;
    fitsInBudget: boolean;
    savingsBreakdown: BudgetSaving[];
    removedItems: string[];
    downgradedItems: DowngradeInfo[];
    warnings: string[];
}

export interface BudgetSaving {
    category: string;
    description: string;
    saved: number;
}

export interface DowngradeInfo {
    itemDescription: string;
    fromTier: MaterialTier;
    toTier: MaterialTier;
    fromLabel: string;
    toLabel: string;
    savedPerUnit: number;
    totalSaved: number;
}

function getItemTypeKey(description: string): string | null {
    const desc = description.toLowerCase();
    if (desc.includes('wall til')) return 'wall_tiling';
    if (desc.includes('floor til') && (desc.includes('bathroom') || desc.includes('porcelain'))) return 'floor_tiling';
    if (desc.includes('vinyl') || desc.includes('spc')) return 'vinyl_flooring';
    if (desc.includes('countertop') || desc.includes('quartz')) return 'countertop_quartz';
    if (desc.includes('base cabinet')) return 'base_cabinet';
    if (desc.includes('upper') && desc.includes('cabinet')) return 'upper_cabinet';
    if (desc.includes('wardrobe') && !desc.includes('fitting')) return 'wardrobe';
    if (desc.includes('painting') && !desc.includes('ceiling')) return 'painting';
    if (desc.includes('ceiling paint')) return 'painting';
    if (desc.includes('aircon')) return 'aircon_system';
    if (desc.includes('toilet') || desc.includes('wc')) return 'wc';
    if (desc.includes('shower screen')) return 'shower_screen';
    if (desc.includes('vanity')) return 'vanity_basin';
    if (desc.includes('bedroom door') || desc.includes('master bedroom door')) return 'bedroom_door';
    return null;
}

function getCurrentTier(item: GeneratedLineItem, typeKey: string): MaterialTier {
    const options = MATERIAL_OPTIONS[typeKey];
    if (!options) return 'standard';

    // Find the closest matching tier by material rate
    let closest: MaterialOption = options[1]; // default to standard
    let minDiff = Infinity;
    for (const opt of options) {
        const diff = Math.abs(opt.materialRate - item.materialCost);
        if (diff < minDiff) {
            minDiff = diff;
            closest = opt;
        }
    }
    return closest.tier;
}

function getQuantity(item: GeneratedLineItem): number {
    const d = item.dimensions;
    if (d.quantity && d.quantity > 0) return d.quantity;
    if (d.lengthFt && d.widthFt) return d.lengthFt * d.widthFt;
    if (d.area && d.area > 0) return d.area;
    return 0;
}

/**
 * Optional items that can be removed entirely to save budget.
 * These are nice-to-haves, not essential for a functional renovation.
 */
const REMOVABLE_ITEMS = [
    'feature wall',
    'tv console',
    'shoe cabinet',
    'backsplash',
];

export function optimizeBudget(
    sections: GeneratedTradeSection[],
    targetBudget: number
): BudgetResult {
    const originalTotal = sections.reduce((s, sec) => s + sec.subtotalSelling, 0);
    const warnings: string[] = [];
    const savingsBreakdown: BudgetSaving[] = [];
    const removedItems: string[] = [];
    const downgradedItems: DowngradeInfo[] = [];

    // Deep clone sections
    let optimized = JSON.parse(JSON.stringify(sections)) as GeneratedTradeSection[];

    // If already under budget, just return
    if (originalTotal <= targetBudget) {
        return {
            sections: optimized,
            originalTotal,
            optimizedTotal: originalTotal,
            budget: targetBudget,
            fitsInBudget: true,
            savingsBreakdown: [],
            removedItems: [],
            downgradedItems: [],
            warnings: [' Your quote already fits within the budget!'],
        };
    }

    const deficit = originalTotal - targetBudget;
    let totalSaved = 0;

    //  STEP 1: Downgrade materials (sorted by priority  lowest first) 
    interface DowngradeCandidate {
        sectionIdx: number;
        itemIdx: number;
        typeKey: string;
        currentTier: MaterialTier;
        priority: number;
        item: GeneratedLineItem;
    }

    const candidates: DowngradeCandidate[] = [];
    for (let si = 0; si < optimized.length; si++) {
        for (let ii = 0; ii < optimized[si].items.length; ii++) {
            const item = optimized[si].items[ii];
            const typeKey = getItemTypeKey(item.description);
            if (!typeKey || !MATERIAL_OPTIONS[typeKey]) continue;

            const currentTier = getCurrentTier(item, typeKey);
            const priority = ITEM_PRIORITY[typeKey] || 50;

            candidates.push({
                sectionIdx: si,
                itemIdx: ii,
                typeKey,
                currentTier,
                priority,
                item,
            });
        }
    }

    // Sort by priority (lowest first = downgrade first)
    candidates.sort((a, b) => a.priority - b.priority);

    const tierOrder: MaterialTier[] = ['luxury', 'premium', 'standard', 'budget'];

    for (const cand of candidates) {
        if (totalSaved >= deficit) break;

        const options = MATERIAL_OPTIONS[cand.typeKey];
        const currentIdx = tierOrder.indexOf(cand.currentTier);
        if (currentIdx >= tierOrder.length - 1) continue; // already budget tier

        // Try each lower tier
        for (let ti = currentIdx + 1; ti < tierOrder.length; ti++) {
            if (totalSaved >= deficit) break;

            const targetTier = tierOrder[ti];
            const targetOption = options.find(o => o.tier === targetTier);
            const currentOption = options.find(o => o.tier === cand.currentTier);
            if (!targetOption || !currentOption) continue;

            const qty = getQuantity(cand.item);
            const rateDiff = currentOption.materialRate - targetOption.materialRate;
            if (rateDiff <= 0) continue;

            const savedOnCost = qty * rateDiff;
            // Calculate selling price saving (factor in margin)
            const margin = cand.item.margin;
            const savedOnSelling = savedOnCost / (1 - margin);

            // Apply the downgrade
            const updatedItem = optimized[cand.sectionIdx].items[cand.itemIdx];
            updatedItem.materialCost = targetOption.materialRate;
            updatedItem.unitRate = targetOption.materialRate + updatedItem.labourCost;
            updatedItem.costPrice = qty * updatedItem.unitRate;
            updatedItem.sellingPrice = updatedItem.costPrice / (1 - margin);

            totalSaved += savedOnSelling;

            downgradedItems.push({
                itemDescription: updatedItem.description.split('  ')[0],
                fromTier: cand.currentTier,
                toTier: targetTier,
                fromLabel: currentOption.label,
                toLabel: targetOption.label,
                savedPerUnit: rateDiff,
                totalSaved: savedOnSelling,
            });

            savingsBreakdown.push({
                category: optimized[cand.sectionIdx].displayName,
                description: `${updatedItem.description.split('  ')[0]}: ${currentOption.label}  ${targetOption.label}`,
                saved: savedOnSelling,
            });

            cand.currentTier = targetTier;
        }
    }

    //  STEP 2: Remove optional items if still over budget 
    if (totalSaved < deficit) {
        for (let si = 0; si < optimized.length; si++) {
            if (totalSaved >= deficit) break;

            optimized[si].items = optimized[si].items.filter(item => {
                if (totalSaved >= deficit) return true;

                const desc = item.description.toLowerCase();
                const isRemovable = REMOVABLE_ITEMS.some(r => desc.includes(r));
                if (isRemovable) {
                    totalSaved += item.sellingPrice;
                    removedItems.push(item.description.split('  ')[0]);
                    savingsBreakdown.push({
                        category: optimized[si].displayName,
                        description: `Removed: ${item.description.split('  ')[0]}`,
                        saved: item.sellingPrice,
                    });
                    return false;
                }
                return true;
            });
        }
    }

    //  STEP 3: Recalculate section totals 
    optimized = optimized
        .map(section => {
            const subtotalCost = section.items.reduce((s, i) => s + i.costPrice, 0);
            const subtotalSelling = section.items.reduce((s, i) => s + i.sellingPrice, 0);
            const overallMargin = subtotalSelling > 0 ? (subtotalSelling - subtotalCost) / subtotalSelling : 0;
            return { ...section, subtotalCost, subtotalSelling, overallMargin };
        })
        .filter(section => section.items.length > 0);

    const optimizedTotal = optimized.reduce((s, sec) => s + sec.subtotalSelling, 0);
    const fitsInBudget = optimizedTotal <= targetBudget;

    if (!fitsInBudget) {
        const stillOver = optimizedTotal - targetBudget;
        warnings.push(
            `️ Even after downgrading all materials to budget tier and removing optional items, the quote is still S$${stillOver.toLocaleString('en-US', { maximumFractionDigits: 0 })} over budget. The current scope may need to be reduced (e.g. fewer wardrobes, skip aircon).`
        );
    }

    return {
        sections: optimized,
        originalTotal,
        optimizedTotal,
        budget: targetBudget,
        fitsInBudget,
        savingsBreakdown,
        removedItems,
        downgradedItems,
        warnings,
    };
}

/**
 * Generate a budget comparison showing what you get at different budget levels.
 */
export function generateBudgetTiers(
    sections: GeneratedTradeSection[]
): { tier: MaterialTier; label: string; total: number; description: string }[] {
    const tiers: MaterialTier[] = ['budget', 'standard', 'premium', 'luxury'];
    const results: { tier: MaterialTier; label: string; total: number; description: string }[] = [];

    for (const tier of tiers) {
        let cloned = JSON.parse(JSON.stringify(sections)) as GeneratedTradeSection[];

        for (const section of cloned) {
            for (const item of section.items) {
                const typeKey = getItemTypeKey(item.description);
                if (!typeKey || !MATERIAL_OPTIONS[typeKey]) continue;

                const option = MATERIAL_OPTIONS[typeKey].find(o => o.tier === tier);
                if (!option) continue;

                const qty = getQuantity(item);
                item.materialCost = option.materialRate;
                item.unitRate = option.materialRate + item.labourCost;
                item.costPrice = qty * item.unitRate;
                item.sellingPrice = item.costPrice / (1 - item.margin);
            }
        }

        cloned = cloned.map(section => {
            const subtotalCost = section.items.reduce((s, i) => s + i.costPrice, 0);
            const subtotalSelling = section.items.reduce((s, i) => s + i.sellingPrice, 0);
            return { ...section, subtotalCost, subtotalSelling };
        });

        const total = cloned.reduce((s, sec) => s + sec.subtotalSelling, 0);

        const labels: Record<MaterialTier, string> = {
            budget: ' Budget',
            standard: ' Standard',
            premium: ' Premium',
            luxury: ' Luxury',
        };

        const descs: Record<MaterialTier, string> = {
            budget: 'Basic materials, gets the job done. Particle board, basic tiles, budget aircon.',
            standard: 'Good quality materials, most popular. Marine plywood, porcelain tiles, Daikin aircon.',
            premium: 'High-end materials, premium brands. Acrylic cabinets, large-format tiles, Mitsubishi aircon.',
            luxury: 'Top-tier everything. Solid wood, natural stone, smart toilet, Dekton countertops.',
        };

        results.push({ tier, label: labels[tier], total, description: descs[tier] });
    }

    return results;
}
