/**
 * Auto Quote Generator v2
 * Corrected market rates, proper bathroom dimensions,
 * missing line items, owner-supplied materials support.
 */

import { TradeCategory, TRADE_PROFILES } from '@/types/trades';
import { Jurisdiction } from '@/types/core';
import { ParsedPrompt } from './prompt-parser';

// ============================================================
// TYPES
// ============================================================

type MeasurementUnit =
    | 'sqft' | 'sqm'
    | 'lm' | 'm' | 'mm'
    | 'cu.m'
    | 'pcs' | 'set' | 'lot' | 'nos' | 'unit' | 'pair' | 'panel' | 'leaf'
    | 'kg' | 'ton'
    | 'roll' | 'sheet' | 'bag' | 'litre'
    | 'day' | 'hr' | 'trip'
    | 'ls';

export interface GeneratedDimensions {
    lengthFt?: number;
    widthFt?: number;
    heightFt?: number;
    area?: number;
    quantity?: number;
    unit: MeasurementUnit;
}

export interface GeneratedLineItem {
    id: string;
    description: string;
    dimensions: GeneratedDimensions;
    unitRate: number;
    costPrice: number;
    margin: number;
    sellingPrice: number;
    isStaircase?: boolean;
    productivityMultiplier: number;
    // --- NEW: owner-supplied & cost split ---
    materialCost: number;   // material portion of unitRate
    labourCost: number;     // labour portion of unitRate
    isOwnerSupplied: boolean; // if true, client provides material  only labour is charged
}

export interface GeneratedTradeSection {
    id: string;
    category: TradeCategory;
    displayName: string;
    items: GeneratedLineItem[];
    subtotalCost: number;
    subtotalSelling: number;
    overallMargin: number;
    isExpanded: boolean;
}

export interface AutoQuoteResult {
    sections: GeneratedTradeSection[];
    totalCost: number;
    totalSelling: number;
    overallMargin: number;
    itemCount: number;
    tradeCount: number;
    warnings: string[];
    suggestions: string[];
}

// ============================================================
// UTILITIES
// ============================================================

const generateId = (): string => `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

function calculateItemPrice(costPrice: number, margin: number): number {
    const safeMargin = Math.min(Math.max(margin, 0), 0.95);
    const sellingPrice = costPrice / (1 - safeMargin);
    return isNaN(sellingPrice) ? 0 : sellingPrice;
}

function createLineItem(
    description: string,
    quantity: number,
    materialRate: number,
    labourRate: number,
    unit: MeasurementUnit,
    margin: number,
    isOwnerSupplied: boolean = false
): GeneratedLineItem {
    const effectiveRate = isOwnerSupplied ? labourRate : (materialRate + labourRate);
    const costPrice = quantity * effectiveRate;
    const sellingPrice = calculateItemPrice(costPrice, margin);

    return {
        id: generateId(),
        description,
        dimensions: { quantity, unit },
        unitRate: effectiveRate,
        costPrice,
        margin,
        sellingPrice,
        productivityMultiplier: 1.0,
        materialCost: materialRate,
        labourCost: labourRate,
        isOwnerSupplied,
    };
}

function recalculateSection(section: GeneratedTradeSection): GeneratedTradeSection {
    const subtotalCost = section.items.reduce((sum, i) => sum + i.costPrice, 0);
    const subtotalSelling = section.items.reduce((sum, i) => sum + i.sellingPrice, 0);
    const overallMargin = subtotalSelling > 0
        ? (subtotalSelling - subtotalCost) / subtotalSelling
        : 0;
    return { ...section, subtotalCost, subtotalSelling, overallMargin };
}

// ============================================================
// CORRECTED RATES (SGD  actual vendor/sub-con costs)
// Split into material + labour for owner-supplied toggle
// ============================================================

interface RateEntry {
    material: number;  // supply cost per unit
    labour: number;    // install/workmanship cost per unit
    unit: MeasurementUnit;
}

const RATES: Record<string, RateEntry> = {
    //  Preliminaries 
    'site_protection': { material: 80, labour: 120, unit: 'lot' },   // $200 lot
    'lift_protection': { material: 50, labour: 100, unit: 'lot' },   // $150 lot

    //  Demolition (2025 SG rates: ~$4-6/sqft) 
    'hack_floor': { material: 0, labour: 4.80, unit: 'sqft' },      // tiling.sg ref
    'hack_wall': { material: 0, labour: 4.50, unit: 'sqft' },       // tiling.sg ref
    'debris_disposal': { material: 0, labour: 500, unit: 'lot' },   // 4-room HDB ~$500-800

    //  Masonry / Tiling 
    'wall_tiling': { material: 5, labour: 6, unit: 'sqft' },        // ~$11/sqft incl tile
    'floor_tiling': { material: 6, labour: 6, unit: 'sqft' },       // ~$12/sqft incl tile
    'screeding': { material: 1.50, labour: 2.50, unit: 'sqft' },    // ~$4/sqft

    //  Waterproofing 
    'waterproofing': { material: 3, labour: 4, unit: 'sqft' },      // ~$7/sqft

    //  Carpentry ($150/ft selling = ~$100-110/ft cost) 
    'base_cabinet': { material: 60, labour: 40, unit: 'lm' },       //  $150/ft at ~35% margin
    'upper_cabinet': { material: 55, labour: 35, unit: 'lm' },      //  $135/ft at ~35% margin
    'countertop_quartz': { material: 65, labour: 35, unit: 'lm' },  // quartz S$100-160/ft
    'wardrobe': { material: 60, labour: 40, unit: 'lm' },           //  $150/ft at ~35% margin
    'wardrobe_fittings': { material: 150, labour: 100, unit: 'lot' },// internal fittings per wardrobe
    'feature_wall': { material: 15, labour: 15, unit: 'sqft' },     // ~$30/sqft  $45 selling
    'tv_console': { material: 60, labour: 40, unit: 'lm' },         //  $150/ft at ~35% margin
    'shoe_cabinet': { material: 60, labour: 40, unit: 'lm' },       //  $150/ft at ~35% margin

    //  Flooring 
    'vinyl_flooring': { material: 2.50, labour: 1.60, unit: 'sqft' },// ~$4.10-5/sqft S&I
    'tile_flooring': { material: 6, labour: 6, unit: 'sqft' },      // ~$12/sqft

    //  Painting (4-room HDB whole house ~$1,200-1,500) 
    'painting': { material: 0.50, labour: 0.80, unit: 'sqft' },     // ~$1.30/sqft
    'ceiling_paint': { material: 0.30, labour: 0.50, unit: 'sqft' },// ~$0.80/sqft

    //  Electrical (4-room rewire ~$3,500-4,500) 
    'rewiring': { material: 800, labour: 1200, unit: 'lot' },       // DB + mains ~$2,000
    'power_point': { material: 20, labour: 45, unit: 'pcs' },       // ~$65/pt  $90 selling
    'light_point': { material: 15, labour: 30, unit: 'pcs' },       // ~$45/pt  $60 selling

    //  Plumbing & Sanitary 
    'sink_install': { material: 100, labour: 80, unit: 'pcs' },     // supply + install
    'mixer_tap': { material: 60, labour: 35, unit: 'pcs' },         // ~$95  $130 selling
    'wc': { material: 280, labour: 140, unit: 'pcs' },              // toilet bowl S$400-700
    'vanity_basin': { material: 180, labour: 80, unit: 'pcs' },     // basin + cabinet S$250-400
    'shower_screen': { material: 200, labour: 80, unit: 'pcs' },    // fixed+swing S$320-480
    'shower_set': { material: 80, labour: 60, unit: 'pcs' },        // rain shower set S$140-200
    'bathroom_mirror': { material: 50, labour: 30, unit: 'pcs' },   // mirror + install
    'bathroom_accessories': { material: 50, labour: 40, unit: 'lot' },// towel rack etc per bathroom
    'floor_trap': { material: 12, labour: 25, unit: 'pcs' },        // S$37/pc
    'exhaust_fan': { material: 35, labour: 25, unit: 'pcs' },       // S$60/pc

    //  Doors 
    'bedroom_door': { material: 200, labour: 120, unit: 'pcs' },    // laminate S$320-450
    'bathroom_door': { material: 150, labour: 100, unit: 'pcs' },   // aluminium/PVC S$250-350

    //  Metalworks 
    'window_grille': { material: 60, labour: 50, unit: 'pcs' },     // aluminium grille ~$110/pc

    //  Aircon (System 4 = ~S$3,500-5,000) 
    'aircon_system': { material: 2200, labour: 800, unit: 'set' },   // system 4 all-in ~$3,000 cost

    //  Ceiling 
    'ceiling_gypsum': { material: 1.50, labour: 2.50, unit: 'sqft' },// ~$4/sqft gypsum

    //  Design & Submissions 
    'space_planning': { material: 0, labour: 500, unit: 'lot' },     // included in package
    'working_drawings': { material: 0, labour: 800, unit: 'lot' },   // basic drawings
    'permit_submissions': { material: 150, labour: 350, unit: 'lot' },// HDB submission
    'site_supervision': { material: 0, labour: 300, unit: 'lot' },   // site visits

    //  Cleaning 
    'post_reno_clean': { material: 30, labour: 250, unit: 'lot' },   // post-reno deep clean
};

// ============================================================
// ROOM DIMENSIONS  properly separated
// ============================================================

interface RoomDimensions {
    bathroomFloor: number;      // sqft per bathroom (floor only)
    bathroomWall: number;       // sqft per bathroom (wall only, minus openings)
    kitchenFloor: number;       // sqft
    kitchenBacksplash: number;  // sqft (strip between cabinets)
    bedroomWidth: number;       // mm (wardrobe wall-to-wall)
    livingArea: number;         // sqft (living + dining)
    totalPaintArea: number;     // sqft (all walls + ceilings)
    totalFloorArea: number;     // sqft (excludes bathrooms/kitchen)
    numBedrooms: number;
    numBathrooms: number;
    numWindows: number;
}

function getDefaultDimensions(parsed: ParsedPrompt): RoomDimensions {
    const isHdb = parsed.propertyType === 'hdb';

    // HDB actual floor areas (sqm  sqft conversion: ×10.76)
    const hdbSizes: Record<string, { total: number; bath: number; kitchen: number; living: number; bedWidth: number; windows: number }> = {
        '2-room': { total: 484, bath: 32, kitchen: 45, living: 160, bedWidth: 2200, windows: 3 },
        '3-room': { total: 700, bath: 36, kitchen: 55, living: 190, bedWidth: 2400, windows: 5 },
        '4-room': { total: 968, bath: 38, kitchen: 65, living: 215, bedWidth: 2700, windows: 7 },
        '5-room': { total: 1184, bath: 40, kitchen: 75, living: 250, bedWidth: 2800, windows: 8 },
        'executive': { total: 1400, bath: 42, kitchen: 85, living: 280, bedWidth: 3000, windows: 10 },
        'unknown': { total: 968, bath: 38, kitchen: 65, living: 215, bedWidth: 2700, windows: 7 },
    };

    const condoMultiplier = 1.15; // condos slightly larger per room
    const sz = hdbSizes[parsed.roomSize] || hdbSizes['4-room'];

    const bathroomFloor = isHdb ? sz.bath : Math.round(sz.bath * condoMultiplier);
    // Wall area = perimeter × height - openings. Typical HDB bath: ~6ft × 6.5ft × 8ft ceiling
    // Perimeter = (6+6.5)×2 = 25ft, × 8ft height = 200 sqft, minus ~25 sqft for door/window = ~175 sqft
    const bathroomWall = isHdb ? Math.round(bathroomFloor * 4.5) : Math.round(bathroomFloor * 4.2);

    const kitchenFloor = isHdb ? sz.kitchen : Math.round(sz.kitchen * condoMultiplier);
    // Backsplash: kitchen run length × 2ft height strip
    const kitchenRun = isHdb ? 3 : 4; // meters
    const kitchenBacksplash = Math.round(kitchenRun * 3.28 * 2); // lm to ft × 2ft high

    const livingArea = isHdb ? sz.living : Math.round(sz.living * condoMultiplier);

    // Floor area for vinyl/tiling = total minus bathrooms minus kitchen
    const totalFloorArea = isHdb ? sz.total : Math.round(sz.total * condoMultiplier);
    const usableFloorArea = totalFloorArea - (bathroomFloor * parsed.rooms.bathrooms) - kitchenFloor;

    // Paint area: all walls + ceilings  total floor area × 3.5 (walls) + floor area (ceiling)
    const totalPaintArea = Math.round(totalFloorArea * 3.2);

    return {
        bathroomFloor,
        bathroomWall,
        kitchenFloor,
        kitchenBacksplash,
        bedroomWidth: isHdb ? sz.bedWidth : Math.round(sz.bedWidth * condoMultiplier),
        livingArea,
        totalPaintArea,
        totalFloorArea: usableFloorArea,
        numBedrooms: parsed.rooms.bedrooms,
        numBathrooms: parsed.rooms.bathrooms,
        numWindows: isHdb ? sz.windows : Math.round(sz.windows * 0.8),
    };
}

// ============================================================
// SECTION GENERATORS
// ============================================================

function R(key: string): RateEntry {
    return RATES[key] || { material: 0, labour: 0, unit: 'lot' };
}

function generatePreliminaries(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];
    const r = R('site_protection');
    items.push(createLineItem(
        'Floor & corridor protection  Lay thick plastic sheeting and cardboard over all floors and shared corridors to prevent scratches and dust during construction. Supply + install.',
        1, r.material, r.labour, r.unit, margin
    ));

    if (parsed.propertyType === 'hdb' || parsed.propertyType === 'condo') {
        const r2 = R('lift_protection');
        items.push(createLineItem(
            'Lift protection & management booking  Install padded plywood panels inside the service lift. Includes management booking fee and removal after project.',
            1, r2.material, r2.labour, r2.unit, margin
        ));
    }
    return items;
}

function generateDemolition(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];
    const rf = R('hack_floor');
    const rw = R('hack_wall');

    if (parsed.scope.hackBathrooms || parsed.scope.fullReno) {
        for (let i = 1; i <= parsed.rooms.bathrooms; i++) {
            const label = parsed.rooms.bathrooms === 1 ? 'Bathroom' : (i === 1 ? 'Common bathroom' : 'Master bathroom');
            items.push(createLineItem(
                `${label}  Hack and remove all floor tiles down to concrete base. Jackhammer work + debris removal. ~${dims.bathroomFloor} sqft.`,
                dims.bathroomFloor, rf.material, rf.labour, rf.unit, margin
            ));
            items.push(createLineItem(
                `${label}  Hack and remove all wall tiles floor to ceiling. Careful removal near pipes. ~${dims.bathroomWall} sqft.`,
                dims.bathroomWall, rw.material, rw.labour, rw.unit, margin
            ));
        }
    }

    if (parsed.scope.hackKitchen || parsed.scope.fullReno) {
        items.push(createLineItem(
            `Kitchen  Hack and remove floor tiles. Jackhammer + debris removal. ~${dims.kitchenFloor} sqft.`,
            dims.kitchenFloor, rf.material, rf.labour, rf.unit, margin
        ));
    }

    if (items.length > 0) {
        const rd = R('debris_disposal');
        items.push(createLineItem(
            'Debris disposal  Truck hacked tiles, cement, and waste to licensed disposal facility. Labour + transport + disposal fees.',
            1, rd.material, rd.labour, rd.unit, margin
        ));
    }
    return items;
}

function generateMasonry(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];
    const rft = R('floor_tiling');
    const rwt = R('wall_tiling');
    const rs = R('screeding');

    if (parsed.scope.newTiling || parsed.scope.hackBathrooms) {
        for (let i = 1; i <= parsed.rooms.bathrooms; i++) {
            const label = parsed.rooms.bathrooms === 1 ? 'Bathroom' : (i === 1 ? 'Common bathroom' : 'Master bathroom');
            items.push(createLineItem(
                `${label} floor tiling  Supply and lay porcelain tiles (300×600mm, non-slip). Includes adhesive, grouting, slope to floor trap. Material: porcelain tiles. ~${dims.bathroomFloor} sqft.`,
                dims.bathroomFloor, rft.material, rft.labour, rft.unit, margin
            ));
            items.push(createLineItem(
                `${label} wall tiling  Supply and lay ceramic wall tiles (300×600mm, glazed) floor to ceiling. Includes adhesive, grouting, and edge trims. Material: ceramic tiles. ~${dims.bathroomWall} sqft.`,
                dims.bathroomWall, rwt.material, rwt.labour, rwt.unit, margin
            ));
        }
    }

    if (parsed.scope.kitchenCabinets) {
        items.push(createLineItem(
            `Kitchen backsplash  Supply and lay tiles between base and upper cabinets (~600mm strip). Includes adhesive, grouting. Material: ceramic/porcelain. ~${dims.kitchenBacksplash} sqft.`,
            dims.kitchenBacksplash, rft.material, rft.labour, rft.unit, margin
        ));
    }

    if (parsed.scope.hackBathrooms || parsed.scope.fullReno) {
        const screedArea = dims.bathroomFloor * parsed.rooms.bathrooms;
        items.push(createLineItem(
            `Bathroom floor screeding  Cement screed (~25mm thick) over concrete base for level surface with drainage slope. Material: cement + sand. ~${screedArea} sqft.`,
            screedArea, rs.material, rs.labour, rs.unit, margin
        ));
    }
    return items;
}

function generateWaterproofing(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];
    const r = R('waterproofing');

    for (let i = 1; i <= parsed.rooms.bathrooms; i++) {
        const label = parsed.rooms.bathrooms === 1 ? 'Bathroom' : (i === 1 ? 'Common bathroom' : 'Master bathroom');
        // Waterproof area = floor + 150mm up walls  floor area + 10%
        const wpArea = Math.round(dims.bathroomFloor * 1.1);
        items.push(createLineItem(
            `${label} waterproofing  2-coat liquid membrane (Sika/Mapei) over floor and 150mm up walls. Includes 48-hour ponding test. ~${wpArea} sqft.`,
            wpArea, r.material, r.labour, r.unit, margin
        ));
    }
    return items;
}

function generateCarpentry(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];

    if (parsed.scope.kitchenCabinets) {
        const kitchenRun = parsed.propertyType === 'hdb' ? 3 : 4;
        const rbc = R('base_cabinet');
        const ruc = R('upper_cabinet');

        items.push(createLineItem(
            `Kitchen base cabinets  18mm marine plywood carcass, melamine laminate doors, Blum soft-close hinges. H: 820mm, D: 580mm. Length: ${kitchenRun}m. Factory fabrication + install.`,
            kitchenRun, rbc.material, rbc.labour, rbc.unit, margin
        ));
        items.push(createLineItem(
            `Kitchen upper wall cabinets  18mm plywood carcass, melamine laminate doors, Blum soft-close. H: 600mm, D: 300mm. Length: ${kitchenRun}m. Fabrication + wall mounting.`,
            kitchenRun, ruc.material, ruc.labour, ruc.unit, margin
        ));

        if (parsed.scope.kitchenCountertop) {
            const rct = R('countertop_quartz');
            items.push(createLineItem(
                `Kitchen countertop  15mm quartz stone (Caesarstone or equiv). Includes sink cutout, polished edges, silicone sealing. Length: ${kitchenRun}m, D: 580mm.`,
                kitchenRun, rct.material, rct.labour, rct.unit, margin
            ));
        }
    }

    if (parsed.scope.wardrobes > 0) {
        const widthLm = dims.bedroomWidth / 1000;
        const rw = R('wardrobe');
        const rwf = R('wardrobe_fittings');

        for (let i = 1; i <= parsed.scope.wardrobes; i++) {
            const label = parsed.scope.wardrobes === 1 ? 'Bedroom wardrobe' : (i === 1 ? 'Master bedroom wardrobe' : `Bedroom ${i} wardrobe`);
            items.push(createLineItem(
                `${label}  Full-height built-in, 18mm plywood, melamine laminate, 2-panel sliding doors (aluminium frame). H: 2400mm, D: 600mm, W: ${widthLm}m (wall-to-wall). Factory fab + install.`,
                widthLm, rw.material, rw.labour, rw.unit, margin
            ));
            items.push(createLineItem(
                `${label} internal fittings  2 drawers (soft-close runners), trouser rack, 3-tier shelving, hanging rod. 18mm plywood + melamine.`,
                1, rwf.material, rwf.labour, rwf.unit, margin
            ));
        }
    }

    // Shoe cabinet (always included for HDB/condo)
    if (parsed.propertyType === 'hdb' || parsed.propertyType === 'condo') {
        const rsc = R('shoe_cabinet');
        items.push(createLineItem(
            'Shoe cabinet  Built-in at entrance. 18mm plywood, laminate finish, soft-close doors, ventilation slots. ~1.2m wide × 400mm deep × 1.2m tall.',
            1, rsc.material, rsc.labour, rsc.unit, margin
        ));
    }

    if (parsed.scope.featureWall) {
        const rfw = R('feature_wall');
        items.push(createLineItem(
            'Living room feature wall  9mm plywood backing + wood veneer or textured laminate. Concealed wiring channel for TV cables. ~8 sqft.',
            8, rfw.material, rfw.labour, rfw.unit, margin
        ));
    }

    if (parsed.scope.tvConsole) {
        const rtv = R('tv_console');
        items.push(createLineItem(
            'TV console  18mm plywood, laminate finish. 2 soft-close drawers, open shelving, cable holes. ~2m × 400mm × 500mm.',
            2, rtv.material, rtv.labour, rtv.unit, margin
        ));
    }
    return items;
}

function generateFlooring(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];

    if (parsed.scope.vinylFlooring) {
        const rooms: string[] = [];
        if (parsed.rooms.living) rooms.push('living room');
        if (parsed.rooms.bedrooms > 0) rooms.push(`${parsed.rooms.bedrooms} bedroom(s)`);
        if (rooms.length === 0) rooms.push('living room & bedrooms');

        const rv = R('vinyl_flooring');
        items.push(createLineItem(
            `Vinyl plank flooring (${rooms.join(' + ')})  4mm SPC click-lock, no glue. Includes underlay foam, edge trims, quarter-round skirting. Material: Korean/European SPC vinyl planks. ~${dims.totalFloorArea} sqft.`,
            dims.totalFloorArea, rv.material, rv.labour, rv.unit, margin
        ));
    }

    if (parsed.scope.tileFlooring) {
        const rt = R('tile_flooring');
        items.push(createLineItem(
            `Floor tiling (living + bedrooms)  Porcelain 600×600mm, adhesive, grouting, 2mm spacers. ~${dims.totalFloorArea} sqft.`,
            dims.totalFloorArea, rt.material, rt.labour, rt.unit, margin
        ));
    }
    return items;
}

function generatePainting(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];
    const rp = R('painting');

    items.push(createLineItem(
        `Whole house painting  1 coat sealer + 2 coats emulsion (Nippon/Dulux). Wall prep, patching, masking, cleanup. Up to 3 colour choices. ~${dims.totalPaintArea} sqft.`,
        dims.totalPaintArea, rp.material, rp.labour, rp.unit, margin
    ));

    // Ceiling painting (separate)
    const ceilingArea = Math.round(dims.totalFloorArea * 0.9);
    const rc = R('ceiling_paint');
    items.push(createLineItem(
        `Ceiling painting  1 coat flat/matte white ceiling paint. Roller application + edge cutting. ~${ceilingArea} sqft.`,
        ceilingArea, rc.material, rc.labour, rc.unit, margin
    ));
    return items;
}

function generateElectrical(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];

    if (parsed.scope.fullRewiring) {
        const rr = R('rewiring');
        items.push(createLineItem(
            'Full house rewiring  Replace all wiring from DB box. PVC-insulated copper cables (2.5mm² power, 1.5mm² lighting). New circuit breakers, wall chasing, patching. Licensed electrician.',
            1, rr.material, rr.labour, rr.unit, margin
        ));
    }

    const kitchenPts = parsed.scope.kitchenCabinets ? 4 : 0;
    const bedroomPts = parsed.rooms.bedrooms * 2;
    const livingPts = parsed.rooms.living ? 4 : 0;
    const totalPts = kitchenPts + bedroomPts + livingPts;

    if (totalPts > 0) {
        const breakdown: string[] = [];
        if (kitchenPts > 0) breakdown.push(`${kitchenPts} kitchen`);
        if (bedroomPts > 0) breakdown.push(`${bedroomPts} bedrooms`);
        if (livingPts > 0) breakdown.push(`${livingPts} living`);

        const rpp = R('power_point');
        items.push(createLineItem(
            `Power points (13A twin)  ${totalPts} outlets: ${breakdown.join(', ')}. Legrand/Schneider faceplates, back box, wiring. Licensed electrician.`,
            totalPts, rpp.material, rpp.labour, rpp.unit, margin
        ));
    }

    if (parsed.scope.lightingInstall) {
        const lightCount = Math.max(parsed.rooms.bedrooms * 2 + 6, 10);
        const rl = R('light_point');
        items.push(createLineItem(
            `LED downlights  ${lightCount}× recessed 9W warm white (Philips/Osram). Includes driver, wiring, ceiling cutout.`,
            lightCount, rl.material, rl.labour, rl.unit, margin
        ));
    }
    return items;
}

function generatePlumbing(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];

    if (parsed.scope.kitchenCabinets) {
        const rsi = R('sink_install');
        items.push(createLineItem(
            'Kitchen sink  304 stainless steel single-bowl (~750×450mm) + pull-out mixer tap. Hot/cold supply, waste pipe, silicone seal. Plumber.',
            1, rsi.material, rsi.labour, rsi.unit, margin
        ));
    }

    for (let i = 1; i <= parsed.rooms.bathrooms; i++) {
        const label = parsed.rooms.bathrooms === 1 ? 'Bathroom' : (i === 1 ? 'Common bathroom' : 'Master bathroom');

        const rmt = R('mixer_tap');
        items.push(createLineItem(
            `${label} mixer taps (×2)  Chrome-plated brass, 1 basin + 1 shower. Supply lines + leak test. Plumber.`,
            2, rmt.material, rmt.labour, rmt.unit, margin
        ));

        const rwc = R('wc');
        items.push(createLineItem(
            `${label} toilet (WC)  Wall-hung bowl + concealed cistern (Geberit). Mounting frame, flush plate, waste pipe. Plumber.`,
            1, rwc.material, rwc.labour, rwc.unit, margin
        ));

        const rss = R('shower_set');
        items.push(createLineItem(
            `${label} shower set  Rain shower head (200mm) + handheld shower on slide bar. Chrome finish. Plumber.`,
            1, rss.material, rss.labour, rss.unit, margin
        ));

        const rft = R('floor_trap');
        items.push(createLineItem(
            `${label} floor trap  Stainless steel anti-odour floor trap replacement. Plumber.`,
            1, rft.material, rft.labour, rft.unit, margin
        ));

        if (parsed.scope.vanity) {
            const rvb = R('vanity_basin');
            items.push(createLineItem(
                `${label} vanity basin  Ceramic basin (~600mm wide) + PVC/plywood cabinet, laminate finish. Water inlet + waste outlet. Plumber.`,
                1, rvb.material, rvb.labour, rvb.unit, margin
            ));
        }

        if (parsed.scope.showerScreen) {
            const rsc = R('shower_screen');
            items.push(createLineItem(
                `${label} shower screen  10mm tempered safety glass, frameless fixed panel (~900×1900mm). SS brackets + silicone. Glazier.`,
                1, rsc.material, rsc.labour, rsc.unit, margin
            ));
        }

        // Always include mirror + accessories
        const rbm = R('bathroom_mirror');
        items.push(createLineItem(
            `${label} mirror  Wall-mounted bevelled mirror (~600×800mm) with concealed fixings.`,
            1, rbm.material, rbm.labour, rbm.unit, margin
        ));

        const rba = R('bathroom_accessories');
        items.push(createLineItem(
            `${label} accessories set  Towel rack, soap dish, robe hook, toilet roll holder. Stainless steel, wall-mounted.`,
            1, rba.material, rba.labour, rba.unit, margin
        ));

        const ref = R('exhaust_fan');
        items.push(createLineItem(
            `${label} exhaust fan  Ceiling-mounted ventilation fan with ducting to exterior. Wired to light switch.`,
            1, ref.material, ref.labour, ref.unit, margin
        ));
    }
    return items;
}

function generateDoors(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];
    const rbd = R('bedroom_door');
    const rbathd = R('bathroom_door');

    // Bedroom doors
    for (let i = 1; i <= parsed.rooms.bedrooms; i++) {
        const label = parsed.rooms.bedrooms === 1 ? 'Bedroom door' : (i === 1 ? 'Master bedroom door' : `Bedroom ${i} door`);
        items.push(createLineItem(
            `${label}  Laminate hollow-core door with frame and Everite lock set. Supply + install.`,
            1, rbd.material, rbd.labour, rbd.unit, margin
        ));
    }

    // Bathroom doors
    for (let i = 1; i <= parsed.rooms.bathrooms; i++) {
        const label = parsed.rooms.bathrooms === 1 ? 'Bathroom door' : (i === 1 ? 'Common bathroom door' : 'Master bathroom door');
        items.push(createLineItem(
            `${label}  Aluminium bi-fold or swing door with ventilation louvers. Supply + install.`,
            1, rbathd.material, rbathd.labour, rbathd.unit, margin
        ));
    }
    return items;
}

function generateMetalworks(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];

    if (parsed.propertyType === 'hdb') {
        const rwg = R('window_grille');
        items.push(createLineItem(
            `Window grilles (${dims.numWindows} windows)  Mild steel vertical bar grilles, powder-coated black/white. HDB-compliant design. Supply + install.`,
            dims.numWindows, rwg.material, rwg.labour, rwg.unit, margin
        ));
    }
    return items;
}

function generateAircon(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];
    const fcuCount = Math.max(parsed.rooms.bedrooms + (parsed.rooms.living ? 1 : 0), 1);
    const roomList: string[] = [];
    if (parsed.rooms.living) roomList.push('1 living');
    if (parsed.rooms.bedrooms > 0) roomList.push(`${parsed.rooms.bedrooms} bedroom(s)`);

    const ra = R('aircon_system');
    items.push(createLineItem(
        `Aircon system (${fcuCount}-unit multi-split)  1 outdoor + ${fcuCount} indoor FCU (${roomList.join(', ')}). Copper piping, condensate drain, trunking, electrical. Daikin/Mitsubishi/Midea inverter. Gas charge + commissioning.`,
        fcuCount, ra.material, ra.labour, ra.unit, margin
    ));
    return items;
}

function generateCeiling(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];
    const rc = R('ceiling_gypsum');

    items.push(createLineItem(
        `False ceiling (living & dining)  9mm gypsum board on galvanised steel framing. L-box/cove detail for LED strip. Skim-coat + sand smooth. ~${dims.livingArea} sqft.`,
        dims.livingArea, rc.material, rc.labour, rc.unit, margin
    ));
    return items;
}

function generateCleaning(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const r = R('post_reno_clean');
    return [
        createLineItem(
            'Post-renovation deep cleaning  Vacuum, mop, wipe cabinets (inside + outside), clean glass/mirrors, remove cement stains, clean fixtures, remove protective covers. Crew of 2-3, ~4-6 hours.',
            1, r.material, r.labour, r.unit, margin
        ),
    ];
}

function generateDesignSubmissions(parsed: ParsedPrompt, dims: RoomDimensions, margin: number): GeneratedLineItem[] {
    const items: GeneratedLineItem[] = [];
    const isFullReno = parsed.scope.fullReno;
    const tradeCount = parsed.trades.length;

    // Space planning (always included)
    const sp = R('space_planning');
    items.push(createLineItem(
        'Space planning & conceptual layout  Initial site measurement, 2D floor plan with furniture layout, 1 round of revision. Includes consultation on spatial flow, storage planning, and electrical point mapping.',
        1, sp.material, sp.labour, sp.unit, margin
    ));

    // Working drawings (for larger scopes)
    if (isFullReno || tradeCount >= 5) {
        const wd = R('working_drawings');
        items.push(createLineItem(
            'Working drawings package  Detailed construction drawings for carpentry (elevations + sections), electrical layout, plumbing layout, ceiling plan. Used by site team for accurate execution.',
            1, wd.material, wd.labour, wd.unit, margin
        ));
    }

    // Permit submissions (SG HDB requires this)
    if (parsed.jurisdiction === 'SG' && (parsed.scope.hackBathrooms || parsed.scope.hackKitchen || parsed.scope.fullRewiring)) {
        const ps = R('permit_submissions');
        items.push(createLineItem(
            'HDB renovation permit submission  Online application via HDB portal, upload of renovation scope, contractor license details, and floor plans. Includes permit fee and admin handling. Processing: ~3 working days.',
            1, ps.material, ps.labour, ps.unit, margin
        ));
    }

    // Site supervision (for larger scopes)
    if (isFullReno || tradeCount >= 6) {
        const ss = R('site_supervision');
        const visits = isFullReno ? 10 : 6;
        items.push(createLineItem(
            `Project management & site supervision  ${visits} scheduled site visits over renovation period. Coordinate trade sequencing, verify workmanship against drawings, manage material deliveries, handle defect flagging.`,
            visits, ss.material, ss.labour, ss.unit, margin
        ));
    }

    return items;
}

// ============================================================
// MAIN GENERATOR
// ============================================================

const SECTION_GENERATORS: Partial<Record<TradeCategory, (p: ParsedPrompt, d: RoomDimensions, m: number) => GeneratedLineItem[]>> = {
    preliminaries: generatePreliminaries,
    demolition: generateDemolition,
    masonry: generateMasonry,
    waterproofing: generateWaterproofing,
    carpentry: generateCarpentry,
    flooring: generateFlooring,
    painting: generatePainting,
    electrical: generateElectrical,
    plumbing: generatePlumbing,
    aircon: generateAircon,
    ceiling: generateCeiling,
    design_submissions: generateDesignSubmissions,
    cleaning: generateCleaning,
};

// Additional generators for trades not in the main set
const EXTRA_GENERATORS: Record<string, (p: ParsedPrompt, d: RoomDimensions, m: number) => GeneratedLineItem[]> = {
    doors: generateDoors,
    metalworks: generateMetalworks,
};

const TRADE_ORDER: TradeCategory[] = [
    'design_submissions', 'preliminaries', 'demolition', 'masonry', 'waterproofing',
    'carpentry', 'metalworks', 'glassworks', 'ceiling',
    'flooring', 'painting', 'electrical', 'plumbing',
    'aircon', 'cleaning',
];

export function generateAutoQuote(parsed: ParsedPrompt): AutoQuoteResult {
    const dims = getDefaultDimensions(parsed);
    const allWarnings = [...parsed.warnings];
    const allSuggestions = [...parsed.suggestions];

    const sortedTrades = [...parsed.trades].sort(
        (a, b) => TRADE_ORDER.indexOf(a) - TRADE_ORDER.indexOf(b)
    );

    // Ensure doors are included if we have bedrooms/bathrooms
    if (!sortedTrades.includes('carpentry') && (parsed.rooms.bedrooms > 0 || parsed.rooms.bathrooms > 0)) {
        // Doors will be added as a sub-section of carpentry
    }

    const sections: GeneratedTradeSection[] = [];

    for (const trade of sortedTrades) {
        const profile = TRADE_PROFILES[trade];
        const margin = parsed.jurisdiction === 'SG'
            ? profile.marginTargetSG
            : profile.marginTargetMY;

        const generator = SECTION_GENERATORS[trade];
        let items = generator ? generator(parsed, dims, margin) : [];

        // Add doors into carpentry section
        if (trade === 'carpentry') {
            const doorItems = generateDoors(parsed, dims, margin);
            items = [...items, ...doorItems];
        }

        // Add metalworks items
        if (trade === 'metalworks') {
            const metalItems = generateMetalworks(parsed, dims, margin);
            items = [...items, ...metalItems];
        }

        if (items.length === 0) continue;

        const section: GeneratedTradeSection = {
            id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            category: trade,
            displayName: profile.displayName,
            items,
            subtotalCost: 0,
            subtotalSelling: 0,
            overallMargin: 0,
            isExpanded: true,
        };

        sections.push(recalculateSection(section));
    }

    // If metalworks not in trades but HDB, add it
    if (parsed.propertyType === 'hdb' && !sortedTrades.includes('metalworks')) {
        const profile = TRADE_PROFILES['metalworks'];
        const margin = parsed.jurisdiction === 'SG' ? profile.marginTargetSG : profile.marginTargetMY;
        const metalItems = generateMetalworks(parsed, dims, margin);
        if (metalItems.length > 0) {
            const section: GeneratedTradeSection = {
                id: `section-${Date.now()}-metal`,
                category: 'metalworks',
                displayName: profile.displayName,
                items: metalItems,
                subtotalCost: 0,
                subtotalSelling: 0,
                overallMargin: 0,
                isExpanded: true,
            };
            sections.push(recalculateSection(section));
        }
    }

    const totalCost = sections.reduce((sum, s) => sum + s.subtotalCost, 0);
    const totalSelling = sections.reduce((sum, s) => sum + s.subtotalSelling, 0);
    const overallMargin = totalSelling > 0 ? (totalSelling - totalCost) / totalSelling : 0;
    const itemCount = sections.reduce((sum, s) => sum + s.items.length, 0);

    return {
        sections,
        totalCost,
        totalSelling,
        overallMargin,
        itemCount,
        tradeCount: sections.length,
        warnings: allWarnings,
        suggestions: allSuggestions,
    };
}
