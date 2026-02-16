/**
 * Prompt Parser Engine
 * Maps natural language renovation descriptions to structured trade intents.
 * No LLM required — uses keyword matching against existing trade/template data.
 */

import { TradeCategory } from '@/types/trades';

// ============================================================
// TYPES
// ============================================================

export type PropertyType = 'hdb' | 'condo' | 'landed' | 'commercial';
export type RoomSize = '2-room' | '3-room' | '4-room' | '5-room' | 'executive' | 'unknown';

export interface RoomDetection {
    kitchen: boolean;
    bathrooms: number;         // 0, 1, 2, 3
    bedrooms: number;          // 0, 1, 2, 3, 4, 5
    living: boolean;
    dining: boolean;
    balcony: boolean;
    studyRoom: boolean;
    storeRoom: boolean;
    entryway: boolean;
}

export interface DetectedScope {
    hackBathrooms: boolean;
    hackKitchen: boolean;
    newTiling: boolean;
    newWaterproofing: boolean;
    kitchenCabinets: boolean;
    kitchenCountertop: boolean;
    wardrobes: number;         // how many wardrobes
    featureWall: boolean;
    tvConsole: boolean;
    fullRepaint: boolean;
    ceilingWorks: boolean;
    vinylFlooring: boolean;
    tileFlooring: boolean;
    fullRewiring: boolean;
    lightingInstall: boolean;
    aircon: boolean;
    plumbing: boolean;
    showerScreen: boolean;
    vanity: boolean;
    cleaning: boolean;
    fullReno: boolean;
}

export interface ParsedPrompt {
    rawInput: string;
    propertyType: PropertyType;
    roomSize: RoomSize;
    jurisdiction: 'SG' | 'MY';
    rooms: RoomDetection;
    scope: DetectedScope;
    trades: TradeCategory[];
    matchedTemplateIds: string[];
    warnings: string[];
    suggestions: string[];
    confidence: number;        // 0 to 1 — how many keywords matched
    budget?: number;           // target budget in dollars (if specified)
}

// ============================================================
// KEYWORD RULES
// ============================================================

interface KeywordRule {
    keywords: string[];
    trade?: TradeCategory;
    scopeFlags?: Partial<DetectedScope>;
    roomFlags?: Partial<RoomDetection>;
}

const KEYWORD_RULES: KeywordRule[] = [
    // --- DEMOLITION ---
    { keywords: ['hack', 'hacking', 'demolish', 'demolition', 'tear down', 'remove tiles', 'strip'], trade: 'demolition' },

    // --- BATHROOM SCOPE ---
    { keywords: ['hack bathroom', 'hack toilet', 'hack both bathroom', 'hack 2 bathroom'], scopeFlags: { hackBathrooms: true } },
    { keywords: ['bathroom', 'toilet', 'shower', 'wc'], roomFlags: { bathrooms: 1 } },
    { keywords: ['both bathroom', '2 bathroom', 'two bathroom', 'both toilet', '2 toilet'], roomFlags: { bathrooms: 2 } },
    { keywords: ['3 bathroom', 'three bathroom', '3 toilet'], roomFlags: { bathrooms: 3 } },

    // --- KITCHEN ---
    { keywords: ['kitchen', 'cabinet', 'cabinets', 'kitchen cabinet'], trade: 'carpentry', scopeFlags: { kitchenCabinets: true }, roomFlags: { kitchen: true } },
    { keywords: ['quartz', 'countertop', 'counter top', 'tabletop'], scopeFlags: { kitchenCountertop: true } },

    // --- BEDROOM / WARDROBE ---
    { keywords: ['wardrobe', 'wardrobes', 'built-in wardrobe', 'built in wardrobe'], trade: 'carpentry' },
    { keywords: ['bedroom', 'master bedroom', 'room'], roomFlags: { bedrooms: 1 } },
    { keywords: ['3 wardrobe', 'three wardrobe', '3 bedroom', 'three bedroom', '3 room wardrobe'], roomFlags: { bedrooms: 3 } },
    { keywords: ['2 wardrobe', 'two wardrobe', '2 bedroom', 'two bedroom'], roomFlags: { bedrooms: 2 } },
    { keywords: ['4 bedroom', 'four bedroom', '4 wardrobe'], roomFlags: { bedrooms: 4 } },

    // --- LIVING ROOM ---
    { keywords: ['living room', 'living', 'lounge'], roomFlags: { living: true } },
    { keywords: ['feature wall', 'tv wall', 'accent wall'], trade: 'carpentry', scopeFlags: { featureWall: true }, roomFlags: { living: true } },
    { keywords: ['tv console', 'tv cabinet', 'media console'], trade: 'carpentry', scopeFlags: { tvConsole: true }, roomFlags: { living: true } },

    // --- TILING ---
    { keywords: ['tile', 'tiles', 'tiling', 'retile', 're-tile'], trade: 'masonry', scopeFlags: { newTiling: true } },

    // --- WATERPROOFING ---
    { keywords: ['waterproof', 'waterproofing', 'membrane'], trade: 'waterproofing', scopeFlags: { newWaterproofing: true } },

    // --- PAINTING ---
    { keywords: ['paint', 'repaint', 'painting', 'full paint', 'full repaint', 'whole house paint'], trade: 'painting', scopeFlags: { fullRepaint: true } },

    // --- FLOORING ---
    { keywords: ['vinyl', 'vinyl flooring', 'vinyl plank'], trade: 'flooring', scopeFlags: { vinylFlooring: true } },
    { keywords: ['floor tile', 'floor tiling', 'marble floor', 'porcelain floor'], trade: 'flooring', scopeFlags: { tileFlooring: true } },
    { keywords: ['flooring', 'floor', 'laminate', 'timber floor'], trade: 'flooring' },

    // --- ELECTRICAL ---
    { keywords: ['electrical', 'rewiring', 'rewire', 'wiring', 'full rewiring'], trade: 'electrical', scopeFlags: { fullRewiring: true } },
    { keywords: ['lighting', 'lights', 'downlight', 'spot light', 'led'], trade: 'electrical', scopeFlags: { lightingInstall: true } },

    // --- PLUMBING ---
    { keywords: ['plumbing', 'pipe', 'piping', 'water point'], trade: 'plumbing', scopeFlags: { plumbing: true } },
    { keywords: ['shower screen'], scopeFlags: { showerScreen: true } },
    { keywords: ['vanity', 'basin', 'sink'], scopeFlags: { vanity: true } },

    // --- AIRCON ---
    { keywords: ['aircon', 'air con', 'air-con', 'air conditioning', 'ac'], trade: 'aircon', scopeFlags: { aircon: true } },

    // --- CEILING ---
    { keywords: ['ceiling', 'false ceiling', 'cove ceiling', 'cove light'], trade: 'ceiling', scopeFlags: { ceilingWorks: true } },

    // --- METALWORKS ---
    { keywords: ['railing', 'gate', 'grille', 'metal', 'steel'], trade: 'metalworks' },

    // --- GLASS ---
    { keywords: ['glass', 'mirror', 'glass door', 'glass partition'], trade: 'glassworks' },

    // --- CLEANING ---
    { keywords: ['cleaning', 'clean up', 'post-reno clean', 'handover'], trade: 'cleaning', scopeFlags: { cleaning: true } },

    // --- FULL RENO ---
    { keywords: ['full reno', 'full renovation', 'whole house', 'complete renovation', 'gut reno', 'everything'], scopeFlags: { fullReno: true } },

    // --- DESIGN & SUBMISSIONS ---
    { keywords: ['design', 'drawings', 'permits', '3d render', 'site supervision', 'space planning'], trade: 'design_submissions' },
];

// Property type detection
const PROPERTY_RULES: { keywords: string[]; type: PropertyType }[] = [
    { keywords: ['hdb', 'bto', 'resale hdb', 'resale flat'], type: 'hdb' },
    { keywords: ['condo', 'condominium', 'apartment', 'apt'], type: 'condo' },
    { keywords: ['landed', 'terrace', 'semi-d', 'semi-detached', 'bungalow', 'detached'], type: 'landed' },
    { keywords: ['commercial', 'office', 'retail', 'shop', 'f&b', 'restaurant'], type: 'commercial' },
];

// Room size detection  
const SIZE_RULES: { keywords: string[]; size: RoomSize }[] = [
    { keywords: ['2-room', '2 room', 'two room', '2rm'], size: '2-room' },
    { keywords: ['3-room', '3 room', 'three room', '3rm'], size: '3-room' },
    { keywords: ['4-room', '4 room', 'four room', '4rm'], size: '4-room' },
    { keywords: ['5-room', '5 room', 'five room', '5rm'], size: '5-room' },
    { keywords: ['executive', 'ea', 'exec'], size: 'executive' },
];

// ============================================================
// PARSER FUNCTION
// ============================================================

export function parsePrompt(input: string): ParsedPrompt {
    const lower = input.toLowerCase().trim();
    const matchedKeywordsCount = { total: 0, matched: 0 };

    // --- Detect property type ---
    let propertyType: PropertyType = 'condo'; // default
    for (const rule of PROPERTY_RULES) {
        for (const kw of rule.keywords) {
            if (lower.includes(kw)) {
                propertyType = rule.type;
                break;
            }
        }
    }

    // --- Detect room size ---
    let roomSize: RoomSize = 'unknown';
    for (const rule of SIZE_RULES) {
        for (const kw of rule.keywords) {
            if (lower.includes(kw)) {
                roomSize = rule.size;
                break;
            }
        }
    }

    // --- Detect jurisdiction ---
    let jurisdiction: 'SG' | 'MY' = 'SG'; // default
    if (lower.includes('malaysia') || lower.includes(' my ') || lower.includes('kl') || lower.includes('johor') || lower.includes('penang')) {
        jurisdiction = 'MY';
    }

    // --- Initialize scope and rooms ---
    const scope: DetectedScope = {
        hackBathrooms: false,
        hackKitchen: false,
        newTiling: false,
        newWaterproofing: false,
        kitchenCabinets: false,
        kitchenCountertop: false,
        wardrobes: 0,
        featureWall: false,
        tvConsole: false,
        fullRepaint: false,
        ceilingWorks: false,
        vinylFlooring: false,
        tileFlooring: false,
        fullRewiring: false,
        lightingInstall: false,
        aircon: false,
        plumbing: false,
        showerScreen: false,
        vanity: false,
        cleaning: false,
        fullReno: false,
    };

    const rooms: RoomDetection = {
        kitchen: false,
        bathrooms: 0,
        bedrooms: 0,
        living: false,
        dining: false,
        balcony: false,
        studyRoom: false,
        storeRoom: false,
        entryway: false,
    };

    const tradesSet = new Set<TradeCategory>();
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // --- Run keyword rules (longer phrases first for greedy matching) ---
    const sortedRules = [...KEYWORD_RULES].sort((a, b) => {
        const maxA = Math.max(...a.keywords.map(k => k.length));
        const maxB = Math.max(...b.keywords.map(k => k.length));
        return maxB - maxA; // longest first
    });

    for (const rule of sortedRules) {
        matchedKeywordsCount.total++;
        let matched = false;

        for (const kw of rule.keywords) {
            if (lower.includes(kw)) {
                matched = true;
                matchedKeywordsCount.matched++;

                if (rule.trade) tradesSet.add(rule.trade);
                if (rule.scopeFlags) {
                    Object.assign(scope, rule.scopeFlags);
                }
                if (rule.roomFlags) {
                    if (rule.roomFlags.bathrooms !== undefined) {
                        rooms.bathrooms = Math.max(rooms.bathrooms, rule.roomFlags.bathrooms);
                    }
                    if (rule.roomFlags.bedrooms !== undefined) {
                        rooms.bedrooms = Math.max(rooms.bedrooms, rule.roomFlags.bedrooms);
                    }
                    if (rule.roomFlags.kitchen) rooms.kitchen = true;
                    if (rule.roomFlags.living) rooms.living = true;
                    if (rule.roomFlags.dining) rooms.dining = true;
                    if (rule.roomFlags.balcony) rooms.balcony = true;
                }
                break; // one match per rule is enough
            }
        }
    }

    // --- Detect wardrobe count from prompt ---
    const wardrobeCountMatch = lower.match(/(\d+)\s*(?:wardrobe|wardrobes)/);
    if (wardrobeCountMatch) {
        scope.wardrobes = parseInt(wardrobeCountMatch[1], 10);
    } else if (lower.includes('wardrobe') || lower.includes('wardrobes')) {
        // Default to bedroom count, or 1
        scope.wardrobes = rooms.bedrooms > 0 ? rooms.bedrooms : 1;
    }

    // --- Infer room size → bedroom count if not explicitly set ---
    if (rooms.bedrooms === 0 && roomSize !== 'unknown') {
        const sizeMap: Record<RoomSize, number> = {
            '2-room': 1, '3-room': 2, '4-room': 3, '5-room': 4, 'executive': 4, 'unknown': 0
        };
        rooms.bedrooms = sizeMap[roomSize];
    }

    // --- Infer room size → bathroom count if not explicitly set ---
    if (rooms.bathrooms === 0) {
        if (rooms.bedrooms >= 3) rooms.bathrooms = 2;
        else if (rooms.bedrooms >= 1) rooms.bathrooms = 1;
    }

    // --- Smart inference: auto-add related trades ---

    // If bathrooms are being hacked, they need waterproofing and tiling
    if (scope.hackBathrooms) {
        tradesSet.add('demolition');
        if (!scope.newWaterproofing) {
            scope.newWaterproofing = true;
            tradesSet.add('waterproofing');
            suggestions.push('Auto-added waterproofing — required after bathroom hacking');
        }
        if (!scope.newTiling) {
            scope.newTiling = true;
            tradesSet.add('masonry');
            suggestions.push('Auto-added tiling — required after bathroom hacking');
        }
        // Plumbing is almost always needed for bathroom reno
        if (!scope.plumbing) {
            scope.plumbing = true;
            tradesSet.add('plumbing');
            suggestions.push('Auto-added plumbing — usually required for bathroom reno');
        }
    }

    // If kitchen cabinets, suggest countertop
    if (scope.kitchenCabinets && !scope.kitchenCountertop) {
        suggestions.push('💡 Consider adding a countertop (quartz/granite) to the kitchen scope');
    }

    // If any demolition or tiling, add preliminaries
    if (tradesSet.has('demolition') || tradesSet.has('masonry')) {
        tradesSet.add('preliminaries');
    }

    // If significant work, add cleaning
    if (tradesSet.size >= 3 && !scope.cleaning) {
        scope.cleaning = true;
        tradesSet.add('cleaning');
        suggestions.push('Auto-added final cleaning — standard for projects with 3+ trades');
    }

    // Full reno → load everything
    if (scope.fullReno) {
        const fullRenoTrades: TradeCategory[] = [
            'design_submissions', 'preliminaries', 'demolition', 'masonry', 'carpentry',
            'flooring', 'painting', 'electrical', 'plumbing',
            'waterproofing', 'cleaning'
        ];
        fullRenoTrades.forEach(t => tradesSet.add(t));
        scope.hackBathrooms = true;
        scope.hackKitchen = true;
        scope.kitchenCabinets = true;
        scope.fullRepaint = true;
        scope.fullRewiring = true;
        scope.newTiling = true;
        scope.newWaterproofing = true;
        if (rooms.bedrooms > 0) scope.wardrobes = rooms.bedrooms;
        rooms.kitchen = true;
        rooms.living = true;
    }

    // --- Match templates ---
    const matchedTemplateIds: string[] = [];

    if (scope.kitchenCabinets) matchedTemplateIds.push('kitchen-standard-sg');
    if (scope.hackBathrooms || rooms.bathrooms > 0) matchedTemplateIds.push('bathroom-basic-sg');
    if (scope.wardrobes > 0 || rooms.bedrooms > 0) matchedTemplateIds.push('bedroom-wardrobes-sg');
    if (scope.featureWall || scope.tvConsole) matchedTemplateIds.push('living-feature-wall-sg');
    if (scope.fullReno) matchedTemplateIds.push('full-reno-3br-sg');

    // --- Warnings ---
    if (scope.hackBathrooms && !scope.showerScreen) {
        warnings.push('⚠️ No shower screen specified — you may want to include one');
    }
    if (scope.wardrobes > 0 && !scope.lightingInstall) {
        suggestions.push('💡 Consider adding LED strip lighting for wardrobes');
    }

    // --- Detect budget ---
    let budget: number | undefined;
    // Match patterns like "$50k", "50k budget", "budget 50000", "$60,000"
    const budgetPatterns = [
        /\$\s*(\d+)\s*k/i,                    // $50k
        /budget\s*(?:of)?\s*\$?\s*(\d+)\s*k/i, // budget 50k, budget of $50k
        /(\d+)\s*k\s*budget/i,                  // 50k budget
        /\$\s*([\d,]+)/,                          // $50,000
        /budget\s*(?:of)?\s*\$?\s*([\d,]+)/i,   // budget of 50000
        /([\d,]+)\s*budget/i,                     // 50000 budget
    ];
    for (const pattern of budgetPatterns) {
        const match = lower.match(pattern);
        if (match) {
            const raw = match[1].replace(/,/g, '');
            let amount = parseFloat(raw);
            if (pattern.source.includes('k')) amount *= 1000;
            if (amount >= 1000 && amount <= 1000000) {
                budget = amount;
            }
            break;
        }
    }

    // Auto-add design_submissions for significant projects
    if (tradesSet.size >= 4 && !tradesSet.has('design_submissions')) {
        tradesSet.add('design_submissions');
        suggestions.push('Auto-added Design & Submissions — recommended for projects with 4+ trades');
    }

    // --- Confidence ---
    const confidence = matchedKeywordsCount.total > 0
        ? Math.min(matchedKeywordsCount.matched / Math.max(matchedKeywordsCount.total * 0.15, 1), 1)
        : 0;

    return {
        rawInput: input,
        propertyType,
        roomSize,
        jurisdiction,
        rooms,
        scope,
        trades: Array.from(tradesSet),
        matchedTemplateIds,
        warnings,
        suggestions,
        confidence,
        budget,
    };
}
