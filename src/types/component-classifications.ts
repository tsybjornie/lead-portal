/**
 * 6-Dimensional Material Classification System
 * 
 * Every material in the component library is classified along 6 dimensions:
 * Water resistance, Fire rating, Rust resistance, Acoustic performance,
 * VOC/Health emission, and Stain resistance.
 * 
 * These classifications drive:
 * - Zone compliance (e.g., bathroom needs W4+ materials)
 * - Health scoring (VOC/formaldehyde warnings)
 * - Maintenance guide generation
 * - Material alternatives suggestion
 */

import { TradeCategory } from './trades';

// ============================================================
// DIMENSION 1: WATER RESISTANCE
// ============================================================

export type WaterRating = 'W1' | 'W2' | 'W3' | 'W4' | 'W5';

export const WATER_RATING_LABELS: Record<WaterRating, string> = {
    W1: 'Dry areas only  no moisture contact',
    W2: 'Occasional splash  wiping OK',
    W3: 'Moisture resistant  MR grade',
    W4: 'Wet areas  bathroom/kitchen OK',
    W5: 'Fully waterproof  submersible',
};

/** Minimum water rating required per zone */
export const ZONE_WATER_REQUIREMENTS: Record<string, WaterRating> = {
    bathroom: 'W4',
    shower: 'W5',
    kitchen: 'W3',
    kitchen_backsplash: 'W4',
    balcony: 'W4',
    outdoor: 'W5',
    bedroom: 'W1',
    living: 'W1',
    study: 'W1',
    service_yard: 'W4',
    bomb_shelter: 'W1',
};

// ============================================================
// DIMENSION 2: FIRE RATING
// ============================================================

export type FireRating = 'none' | 'FR30' | 'FR60' | 'FR120';

export const FIRE_RATING_LABELS: Record<FireRating, string> = {
    none: 'No fire rating',
    FR30: '30 min fire resistance  HDB main door standard',
    FR60: '60 min fire resistance  commercial / condo',
    FR120: '120 min fire resistance  structural / escape route',
};

// ============================================================
// DIMENSION 3: RUST RESISTANCE
// ============================================================

export type RustRating = 'R1' | 'R2' | 'R3' | 'R4' | 'R5';

export const RUST_RATING_LABELS: Record<RustRating, string> = {
    R1: 'Rusts fast  untreated mild steel',
    R2: 'Slow rust  powder coated mild steel',
    R3: 'Resistant  chrome plated (no acid cleaners!)',
    R4: 'Very resistant  PVD coated / brushed nickel',
    R5: 'Rust-proof  SS316, marine grade',
};

// ============================================================
// DIMENSION 4: ACOUSTIC RATING (Sound Transmission Class)
// ============================================================

export interface AcousticRating {
    stc: number;       // Sound Transmission Class (0-60+)
    label: string;     // e.g. "Normal speech audible" 
}

export const ACOUSTIC_BENCHMARKS = {
    poor: { stc: 20, label: 'Loud speech clearly heard' },
    fair: { stc: 30, label: 'Loud speech audible but muffled' },
    good: { stc: 35, label: 'Loud speech faintly heard' },
    excellent: { stc: 40, label: 'Most sounds blocked' },
    studio: { stc: 50, label: 'Studio-grade isolation' },
} as const;

// ============================================================
// DIMENSION 5: VOC / HEALTH (Formaldehyde)
// ============================================================

export type FormaldehydeClass = 'E0' | 'E1' | 'E2' | 'NAF';

export type VOCLevel = 'zero' | 'low' | 'medium' | 'high';

export interface VOCRating {
    level: VOCLevel;
    formaldehydeClass?: FormaldehydeClass;  // For wood-based products
    description: string;
}

export const FORMALDEHYDE_LIMITS: Record<FormaldehydeClass, { mgPerL: number; label: string }> = {
    NAF: { mgPerL: 0, label: 'No Added Formaldehyde' },
    E0: { mgPerL: 0.5, label: '0.5 mg/L  Singapore Green Label' },
    E1: { mgPerL: 1.5, label: '1.5 mg/L  Standard acceptable' },
    E2: { mgPerL: 5.0, label: '5.0 mg/L  ️ Not recommended for bedrooms' },
};

// ============================================================
// DIMENSION 6: STAIN RESISTANCE
// ============================================================

export type StainRating = 1 | 2 | 3 | 4 | 5;

export const STAIN_RATING_LABELS: Record<StainRating, string> = {
    1: 'Very porous  stains easily (marble, limestone)',
    2: 'Porous  needs sealing (concrete, terrazzo)',
    3: 'Moderate  some stains removable (wood, laminate)',
    4: 'Resistant  most stains wipe off (quartz, porcelain)',
    5: 'Stain-proof  nothing sticks (Fenix, epoxy grout)',
};

// ============================================================
// COMPOSITE CLASSIFICATION
// ============================================================

export interface MaterialClassification {
    water: WaterRating;
    fire: FireRating;
    rust: RustRating;
    acoustic: AcousticRating;
    voc: VOCRating;
    stain: StainRating;
}

// ============================================================
// COMPONENT LIBRARY ITEM (extends PricelistItem concept)
// ============================================================

export type MaterialOrigin =
    | 'SG' | 'MY' | 'CN' | 'JP' | 'KR' | 'TW' | 'IL'
    | 'IT' | 'ES' | 'DE' | 'US' | 'IN' | 'TH' | 'ID'
    | 'SEA' | 'EU' | 'global';

export type PriceTier = 'budget' | 'standard' | 'premium' | 'luxury';

export interface DualPrice {
    sgd: number;
    myr: number;
}

export interface ComponentLibraryItem {
    id: string;
    name: string;
    category: TradeCategory;
    subCategory: string;
    description: string;

    // 6D Classification
    classification: MaterialClassification;

    // Pricing (dual market)
    materialCost: DualPrice;
    labourCost: DualPrice;
    unit: string;
    tier: PriceTier;

    // Material identity
    brand?: string;
    origin: MaterialOrigin;

    // Compliance 
    complianceNotes?: string[];   // e.g. "HDB bomb shelter  no modifications"
    incompatibleWith?: string[];   // e.g. "acid cleaners" for chrome
    maintenanceNotes?: string;     // auto-generated maintenance guide text

    // Alternatives
    alternativeIds?: string[];     // IDs of alternative components (budget  premium)

    lastUpdated: string;
}

// ============================================================
// QUERY HELPERS 
// ============================================================

/** Check if a material meets zone water requirements */
export function meetsWaterRequirement(
    materialWater: WaterRating,
    zone: string
): { passes: boolean; required: WaterRating; message?: string } {
    const required = ZONE_WATER_REQUIREMENTS[zone] || 'W1';
    const waterOrder: WaterRating[] = ['W1', 'W2', 'W3', 'W4', 'W5'];
    const materialIdx = waterOrder.indexOf(materialWater);
    const requiredIdx = waterOrder.indexOf(required);
    const passes = materialIdx >= requiredIdx;

    return {
        passes,
        required,
        message: passes
            ? undefined
            : `️ This material is rated ${materialWater} but zone "${zone}" requires ${required} minimum. ${WATER_RATING_LABELS[required]}.`,
    };
}

/** Get health warning for VOC rating */
export function getHealthWarning(voc: VOCRating, room: string): string | null {
    if (voc.formaldehydeClass === 'E2') {
        if (['bedroom', 'nursery', 'master_bedroom'].includes(room)) {
            return ` HEALTH WARNING: E2 formaldehyde (${FORMALDEHYDE_LIMITS.E2.mgPerL}mg/L) in enclosed ${room}. May exceed WHO guideline of 0.1mg/m³. Recommend upgrading to E0 or E1.`;
        }
        return `️ E2 board has higher formaldehyde emission. Consider E1 or E0 for enclosed spaces.`;
    }
    if (voc.level === 'high') {
        return `️ High VOC material. Ensure adequate ventilation during and after installation. Allow 2-4 weeks off-gassing before occupancy.`;
    }
    return null;
}

/** Get maintenance incompatibility warning */
export function getIncompatibilityWarning(item: ComponentLibraryItem): string[] {
    const warnings: string[] = [];

    // Chrome + acid warning
    if (item.classification.rust === 'R3' && item.incompatibleWith?.includes('acid_cleaners')) {
        warnings.push(' Do NOT use acid-based cleaners (vinegar, citric acid) on chrome finishes. Use mild soap only.');
    }

    // Marble + acid warning  
    if (item.classification.stain <= 2 && item.subCategory.includes('marble')) {
        warnings.push(' Marble is acid-sensitive. Lemon juice, vinegar, and tomato sauce WILL etch the surface permanently.');
    }

    // Laminate door in bathroom warning
    if (item.classification.water === 'W1' && item.subCategory.includes('door')) {
        warnings.push('️ W1-rated door. NOT suitable for bathroom use  will swell with moisture.');
    }

    return warnings;
}
