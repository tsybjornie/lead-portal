/**
 * Trades / Execution Layer
 * The physical reality engine - where tools, labour, and cash meet the site
 * 
 * Rule: If it involves tools, labour, noise, dust, or risk on site  it lives here.
 */

import { Jurisdiction } from './core';

// ============================================================
// MASTER TRADE CATEGORIES (Non-Negotiable)
// ============================================================

export type TradeCategory =
    | 'preliminaries'      // Site setup, protection, mobilization
    | 'demolition'         // Hacking, removal, disposal
    | 'masonry'            // Brickwork, plastering, screeding, waterproofing
    | 'carpentry'          // Cabinets, wardrobes, built-ins (geoarbitrage zone)
    | 'metalworks'         // Steel, aluminium, railings
    | 'glassworks'         // Tempered, laminated, mirrors
    | 'ceiling'            // Gypsum, feature ceilings, access panels
    | 'flooring'           // Tiles, vinyl, timber, stone
    | 'painting'           // Paint, texture, feature finishes
    | 'electrical'         // Wiring, lighting, power, data
    | 'plumbing'           // Piping, sanitary, drainage
    | 'aircon'             // AC installation, piping, trunking
    | 'waterproofing'      // Bathrooms, balconies, roofs
    | 'design_submissions' // Design, drawings, permits, project management
    | 'cleaning';          // Post-construction, handover

// ============================================================
// MEASUREMENT TYPES
// ============================================================

export type MeasurementType =
    | 'area'               // sqft / sqm  mm²
    | 'linear'             // lm  mm
    | 'unit'               // per piece
    | 'point'              // per electrical/plumbing point
    | 'lump_sum'           // fixed price
    | 'per_day'            // time-based
    | 'per_system';        // per AC system, etc.

// ============================================================
// TRADE PROFILE
// ============================================================

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type GeoarbitrageLevel = 'none' | 'low' | 'moderate' | 'high';

export interface TradeProfile {
    category: TradeCategory;
    displayName: string;
    description: string;

    // Measurement
    primaryMeasurement: MeasurementType;
    alternativeMeasurement?: MeasurementType;

    // Risk & Margin
    riskLevel: RiskLevel;
    variationProne: boolean;              // Likely to have scope changes?

    // Jurisdiction Sensitivity
    sgComplexity: 'standard' | 'elevated' | 'high';    // SG regulatory burden
    myComplexity: 'standard' | 'elevated' | 'high';

    // Geoarbitrage
    geoarbitragePotential: GeoarbitrageLevel;
    fabricationOffshorable: boolean;      // Can fabrication be done overseas?

    // Margin Guidance
    marginFloorSG: number;                // Minimum margin for SG
    marginFloorMY: number;                // Minimum margin for MY
    marginTargetSG: number;               // Target margin for SG
    marginTargetMY: number;               // Target margin for MY

    // Buffer Guidance
    bufferMinimum: number;                // Minimum cost buffer %
    bufferRecommended: number;            // Recommended cost buffer %

    // Sub-trades (if applicable)
    subTrades?: string[];

    // Warnings
    commonMistakes: string[];
    neverFree: string[];                  // Things that should never be given free
}

// ============================================================
// MASTER TRADE PROFILES
// ============================================================

export const TRADE_PROFILES: Record<TradeCategory, TradeProfile> = {
    preliminaries: {
        category: 'preliminaries',
        displayName: 'Preliminaries & Site Setup',
        description: 'Site protection, temporary services, initial mobilization',
        primaryMeasurement: 'lump_sum',
        alternativeMeasurement: 'area',
        riskLevel: 'low',
        variationProne: false,
        sgComplexity: 'elevated',
        myComplexity: 'standard',
        geoarbitragePotential: 'none',
        fabricationOffshorable: false,
        marginFloorSG: 0.30,
        marginFloorMY: 0.25,
        marginTargetSG: 0.20,
        marginTargetMY: 0.35,
        bufferMinimum: 0.05,
        bufferRecommended: 0.10,
        subTrades: ['floor_protection', 'lift_protection', 'temp_power', 'barricades', 'mobilization'],
        commonMistakes: ['Forgetting lift booking fees', 'Under-sizing protection materials'],
        neverFree: ['Site protection', 'Temporary power', 'Initial mobilization'],
    },

    demolition: {
        category: 'demolition',
        displayName: 'Demolition & Disposal',
        description: 'Wall hacking, floor removal, ceiling removal, licensed disposal',
        primaryMeasurement: 'area',
        alternativeMeasurement: 'lump_sum',
        riskLevel: 'high',                        // Upgraded: hidden conditions + compliance
        variationProne: true,
        sgComplexity: 'high',                     // UPGRADED: Permits required in SG
        myComplexity: 'standard',
        geoarbitragePotential: 'none',
        fabricationOffshorable: false,
        marginFloorSG: 0.40,                      // RAISED: High margin for SG compliance
        marginFloorMY: 0.20,
        marginTargetSG: 0.20,                     // Flat 20% margin
        marginTargetMY: 0.30,
        bufferMinimum: 0.15,
        bufferRecommended: 0.20,
        subTrades: ['wall_hacking', 'floor_removal', 'ceiling_removal', 'cart_away', 'licensed_disposal', 'permit_coordination'],
        commonMistakes: [
            'Hidden services damage',
            'Underestimating disposal costs',
            'Unknown wall thickness',
            'Missing permit fees (SG)',
            'Using unlicensed disposal (SG)',
            'Prior hidden rubble discovery',
            'Structural elements hit without PE',
        ],
        neverFree: [
            'Cart-away',
            'Licensed disposal fees',
            'Permit admin fees (SG)',
            'PE endorsement (if structural)',
            'Excess rubble beyond allowance',
            'Reinstatement',
        ],
    },

    masonry: {
        category: 'masonry',
        displayName: 'Masonry & Tiling',
        description: 'Brickwork, plastering, screeding, tiling, waterproofing',
        primaryMeasurement: 'area',
        riskLevel: 'moderate',
        variationProne: true,
        sgComplexity: 'elevated',
        myComplexity: 'standard',
        geoarbitragePotential: 'low',
        fabricationOffshorable: false,
        marginFloorSG: 0.25,
        marginFloorMY: 0.18,
        marginTargetSG: 0.20,
        marginTargetMY: 0.28,
        bufferMinimum: 0.08,
        bufferRecommended: 0.12,
        subTrades: ['brickwork', 'plastering', 'screeding', 'tiling', 'waterproofing_wet'],
        commonMistakes: ['Curing time delays', 'Rework from uneven surfaces', 'Material wastage'],
        neverFree: ['Re-plastering', 'Additional coats', 'Thickness upgrades'],
    },

    carpentry: {
        category: 'carpentry',
        displayName: 'Carpentry & Joinery',
        description: 'Cabinets, wardrobes, feature walls, built-ins',
        primaryMeasurement: 'linear',
        alternativeMeasurement: 'unit',
        riskLevel: 'moderate',
        variationProne: true,
        sgComplexity: 'standard',
        myComplexity: 'standard',
        geoarbitragePotential: 'high',          // MAJOR GEOARBITRAGE ZONE
        fabricationOffshorable: true,            // Fabricate MY, install SG
        marginFloorSG: 0.30,
        marginFloorMY: 0.20,
        marginTargetSG: 0.20,                    // Flat 20% margin
        marginTargetMY: 0.30,
        bufferMinimum: 0.10,
        bufferRecommended: 0.15,
        subTrades: ['cabinets', 'wardrobes', 'feature_walls', 'built_ins', 'countertops'],
        commonMistakes: ['Dimension errors', 'Material mismatch', 'Installation damage', 'Scope creep'],
        neverFree: ['Design revisions after approval', 'Hardware upgrades', 'Additional shelving'],
    },

    metalworks: {
        category: 'metalworks',
        displayName: 'Metalwork',
        description: 'Mild steel, stainless steel, aluminium, railings, frames',
        primaryMeasurement: 'linear',
        alternativeMeasurement: 'unit',
        riskLevel: 'moderate',
        variationProne: false,
        sgComplexity: 'standard',
        myComplexity: 'standard',
        geoarbitragePotential: 'moderate',
        fabricationOffshorable: true,
        marginFloorSG: 0.28,
        marginFloorMY: 0.22,
        marginTargetSG: 0.20,
        marginTargetMY: 0.32,
        bufferMinimum: 0.12,
        bufferRecommended: 0.18,
        subTrades: ['mild_steel', 'stainless_steel', 'aluminium', 'railings', 'frames'],
        commonMistakes: ['Fabrication tolerance issues', 'Rust/finish problems', 'Site measurement errors'],
        neverFree: ['Custom finishes', 'Rush fabrication', 'Re-coating'],
    },

    glassworks: {
        category: 'glassworks',
        displayName: 'Glass & Mirrors',
        description: 'Tempered glass, laminated glass, mirrors',
        primaryMeasurement: 'area',
        riskLevel: 'high',                       // Breakage risk
        variationProne: false,
        sgComplexity: 'standard',
        myComplexity: 'standard',
        geoarbitragePotential: 'low',
        fabricationOffshorable: false,           // Too fragile to transport far
        marginFloorSG: 0.30,
        marginFloorMY: 0.25,
        marginTargetSG: 0.20,
        marginTargetMY: 0.35,
        bufferMinimum: 0.15,                     // HIGH BUFFER - breakage
        bufferRecommended: 0.20,
        subTrades: ['tempered_glass', 'laminated_glass', 'mirrors', 'shower_screens'],
        commonMistakes: ['Breakage during transport', 'Re-measurement errors', 'Delivery damage'],
        neverFree: ['Replacement glass', 'Re-measurement visits', 'Rush orders'],
    },

    ceiling: {
        category: 'ceiling',
        displayName: 'Ceilings',
        description: 'Gypsum ceilings, feature ceilings, access panels',
        primaryMeasurement: 'area',
        riskLevel: 'low',
        variationProne: false,
        sgComplexity: 'standard',
        myComplexity: 'standard',
        geoarbitragePotential: 'none',
        fabricationOffshorable: false,
        marginFloorSG: 0.25,
        marginFloorMY: 0.20,
        marginTargetSG: 0.20,
        marginTargetMY: 0.28,
        bufferMinimum: 0.08,
        bufferRecommended: 0.12,
        subTrades: ['gypsum_ceiling', 'feature_ceiling', 'access_panels', 'cove_lighting'],
        commonMistakes: ['M&E coordination failures', 'Rework from hidden services'],
        neverFree: ['Access panels', 'Complex profiles', 'Cove lighting troughs'],
    },

    flooring: {
        category: 'flooring',
        displayName: 'Flooring',
        description: 'Tiles, vinyl, timber, marble, stone',
        primaryMeasurement: 'area',
        riskLevel: 'moderate',
        variationProne: false,
        sgComplexity: 'standard',
        myComplexity: 'standard',
        geoarbitragePotential: 'low',
        fabricationOffshorable: false,
        marginFloorSG: 0.25,
        marginFloorMY: 0.20,
        marginTargetSG: 0.20,
        marginTargetMY: 0.28,
        bufferMinimum: 0.10,
        bufferRecommended: 0.15,
        subTrades: ['tiles', 'vinyl', 'timber', 'marble', 'stone', 'epoxy'],
        commonMistakes: ['Wastage underestimate', 'Material damage', 'Alignment issues', 'Supplier price changes'],
        neverFree: ['Additional wastage', 'Pattern matching', 'Subfloor prep'],
    },

    painting: {
        category: 'painting',
        displayName: 'Painting & Surface Finishes',
        description: 'Painting, texture finishes, feature coatings',
        primaryMeasurement: 'area',
        riskLevel: 'low',
        variationProne: true,                    // Colour changes!
        sgComplexity: 'standard',
        myComplexity: 'standard',
        geoarbitragePotential: 'none',
        fabricationOffshorable: false,
        marginFloorSG: 0.25,
        marginFloorMY: 0.20,
        marginTargetSG: 0.20,
        marginTargetMY: 0.28,
        bufferMinimum: 0.08,
        bufferRecommended: 0.12,
        subTrades: ['emulsion', 'texture_finish', 'feature_coating', 'wood_stain', 'varnish'],
        commonMistakes: ['Touch-up scope creep', 'Colour approval delays', 'Multiple coats needed'],
        neverFree: ['Colour changes after approval', 'Additional coats', 'Touch-ups from other trades'],
    },

    electrical: {
        category: 'electrical',
        displayName: 'Electrical',
        description: 'Wiring, lighting, power points, data, AV',
        primaryMeasurement: 'point',
        riskLevel: 'moderate',
        variationProne: true,                    // "Add one more point"
        sgComplexity: 'high',                    // Compliance-heavy
        myComplexity: 'elevated',
        geoarbitragePotential: 'none',
        fabricationOffshorable: false,
        marginFloorSG: 0.30,
        marginFloorMY: 0.22,
        marginTargetSG: 0.20,
        marginTargetMY: 0.32,
        bufferMinimum: 0.10,
        bufferRecommended: 0.15,
        subTrades: ['wiring', 'lighting', 'power_points', 'data_points', 'av_systems', 'db_board'],
        commonMistakes: ['Scope creep (extra points)', 'Compliance failures (SG)', 'Hidden wiring damage'],
        neverFree: ['Additional points', 'Relocation of points', 'Smart home integration'],
    },

    plumbing: {
        category: 'plumbing',
        displayName: 'Plumbing & Sanitary',
        description: 'Piping, sanitary fittings, drainage',
        primaryMeasurement: 'point',
        riskLevel: 'high',                       // Leaks = disaster
        variationProne: false,
        sgComplexity: 'elevated',
        myComplexity: 'standard',
        geoarbitragePotential: 'none',
        fabricationOffshorable: false,
        marginFloorSG: 0.28,
        marginFloorMY: 0.22,
        marginTargetSG: 0.20,
        marginTargetMY: 0.30,
        bufferMinimum: 0.12,
        bufferRecommended: 0.18,
        subTrades: ['piping', 'sanitary_fittings', 'drainage', 'water_heater', 'pump'],
        commonMistakes: ['Hidden leaks', 'Rework from poor installation', 'Fixture compatibility'],
        neverFree: ['Leak rectification', 'Fixture relocation', 'Additional points'],
    },

    aircon: {
        category: 'aircon',
        displayName: 'Air-Conditioning & Ventilation',
        description: 'FCU installation, piping, trunking, commissioning',
        primaryMeasurement: 'per_system',
        alternativeMeasurement: 'unit',
        riskLevel: 'moderate',
        variationProne: false,
        sgComplexity: 'high',                    // BCA compliance
        myComplexity: 'standard',
        geoarbitragePotential: 'none',
        fabricationOffshorable: false,
        marginFloorSG: 0.25,
        marginFloorMY: 0.20,
        marginTargetSG: 0.20,
        marginTargetMY: 0.28,
        bufferMinimum: 0.10,
        bufferRecommended: 0.15,
        subTrades: ['fcu_installation', 'piping', 'trunking', 'commissioning', 'chemical_wash'],
        commonMistakes: ['Coordination issues', 'Access constraints', 'Trunking routing'],
        neverFree: ['System relocation', 'Additional outlets', 'Premium trunking'],
    },

    waterproofing: {
        category: 'waterproofing',
        displayName: 'Waterproofing & Insulation',
        description: 'Bathrooms, balconies, roofs, insulation',
        primaryMeasurement: 'area',
        riskLevel: 'critical',                   // Failure = catastrophic
        variationProne: false,
        sgComplexity: 'elevated',
        myComplexity: 'standard',
        geoarbitragePotential: 'none',
        fabricationOffshorable: false,
        marginFloorSG: 0.35,                     // HIGH - risk pricing
        marginFloorMY: 0.28,
        marginTargetSG: 0.20,
        marginTargetMY: 0.38,
        bufferMinimum: 0.15,
        bufferRecommended: 0.20,
        subTrades: ['bathroom_waterproofing', 'balcony_waterproofing', 'roof_waterproofing', 'insulation'],
        commonMistakes: ['Inadequate coverage', 'Curing time shortcuts', 'Penetration failures'],
        neverFree: ['Extended warranty', 'Additional coats', 'Flood test'],
    },

    cleaning: {
        category: 'cleaning',
        displayName: 'Final Cleaning & Handover',
        description: 'Post-construction cleaning, debris removal, final polish',
        primaryMeasurement: 'lump_sum',
        alternativeMeasurement: 'area',
        riskLevel: 'low',
        variationProne: false,
        sgComplexity: 'standard',
        myComplexity: 'standard',
        geoarbitragePotential: 'none',
        fabricationOffshorable: false,
        marginFloorSG: 0.25,
        marginFloorMY: 0.20,
        marginTargetSG: 0.20,
        marginTargetMY: 0.30,
        bufferMinimum: 0.05,
        bufferRecommended: 0.10,
        subTrades: ['debris_removal', 'rough_cleaning', 'final_cleaning', 'polish'],
        commonMistakes: ['Underestimating scope', 'Multiple cleaning rounds needed'],
        neverFree: ['Post-handover cleaning', 'Specialty surface cleaning'],
    },

    design_submissions: {
        category: 'design_submissions',
        displayName: 'Design & Submissions',
        description: 'Space planning, drawings, 3D renders, BCA/HDB submissions, project management',
        primaryMeasurement: 'lump_sum',
        riskLevel: 'low',
        variationProne: true,
        sgComplexity: 'high',
        myComplexity: 'elevated',
        geoarbitragePotential: 'none',
        fabricationOffshorable: false,
        marginFloorSG: 0.40,
        marginFloorMY: 0.30,
        marginTargetSG: 0.20,
        marginTargetMY: 0.45,
        bufferMinimum: 0.05,
        bufferRecommended: 0.10,
        subTrades: ['space_planning', 'working_drawings', '3d_renders', 'permit_submissions', 'project_management', 'material_sourcing'],
        commonMistakes: ['Under-quoting design time', 'Permit delays not factored', 'Unlimited revision scope'],
        neverFree: ['3D renders', 'Permit re-submissions', 'Design revisions after approval', 'Site supervision'],
    },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getTradeProfile(category: TradeCategory): TradeProfile {
    return TRADE_PROFILES[category];
}

export function getMarginFloor(category: TradeCategory, jurisdiction: Jurisdiction): number {
    const profile = TRADE_PROFILES[category];
    return jurisdiction === 'SG' ? profile.marginFloorSG : profile.marginFloorMY;
}

export function getMarginTarget(category: TradeCategory, jurisdiction: Jurisdiction): number {
    const profile = TRADE_PROFILES[category];
    return jurisdiction === 'SG' ? profile.marginTargetSG : profile.marginTargetMY;
}

export function getRecommendedBuffer(category: TradeCategory): number {
    return TRADE_PROFILES[category].bufferRecommended;
}

export function isGeoarbitrageCandidate(category: TradeCategory): boolean {
    const profile = TRADE_PROFILES[category];
    return profile.fabricationOffshorable || profile.geoarbitragePotential === 'high';
}

export function getVariationProneTrades(): TradeCategory[] {
    return Object.entries(TRADE_PROFILES)
        .filter(([_, profile]) => profile.variationProne)
        .map(([category, _]) => category as TradeCategory);
}

export function getHighRiskTrades(): TradeCategory[] {
    return Object.entries(TRADE_PROFILES)
        .filter(([_, profile]) => profile.riskLevel === 'high' || profile.riskLevel === 'critical')
        .map(([category, _]) => category as TradeCategory);
}

// ============================================================
// TRADE ITEM (Links Trade to Quote Line Item)
// ============================================================

export interface TradeItem {
    id: string;
    tradeCategory: TradeCategory;
    subTrade?: string;

    // Description
    name: string;
    description?: string;
    specifications?: string;

    // Measurement
    measurementType: MeasurementType;
    quantity: number;
    unit: string;
    dimensions?: {
        length?: number;    // mm
        width?: number;     // mm
        height?: number;    // mm
        thickness?: number; // mm
    };

    // Supplier / Subcontractor
    supplierId?: string;
    supplierName?: string;

    // Costing
    baseCost: number;
    bufferPercent: number;
    adjustedCost: number;       // baseCost × (1 + buffer)

    // Pricing
    marginPercent: number;
    sellingPrice: number;

    // Jurisdiction
    jurisdiction: Jurisdiction;

    // Flags
    requiresApproval: boolean;   // Below margin floor?
    isBelowFloor: boolean;
    warnings: string[];
}
