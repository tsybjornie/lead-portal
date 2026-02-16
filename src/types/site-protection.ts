/**
 * Site Protection & Preliminaries Module
 * 
 * RULE: If it prevents damage, complaints, fines, or stop-work orders — it is billable.
 * 
 * This is NOT "miscellaneous". This is mandatory risk control.
 * Must be explicit, priced, and enforceable.
 */

import { Jurisdiction } from './core';

// ============================================================
// PROTECTION CATEGORIES
// ============================================================

export type ProtectionCategory =
    | 'lift_protection'
    | 'floor_protection'
    | 'wall_protection'
    | 'dust_containment'
    | 'noise_control'
    | 'hoarding_barricades'
    | 'temporary_services'
    | 'protection_removal';

export type PropertyContext =
    | 'hdb'
    | 'condo'
    | 'landed'
    | 'commercial'
    | 'industrial';

// ============================================================
// PROTECTION MODULE PROFILES
// ============================================================

export interface ProtectionModuleProfile {
    category: ProtectionCategory;
    displayName: string;
    clientFacingName: string;
    description: string;

    // What's included
    inclusions: string[];

    // Pricing
    pricingBasis: 'per_unit' | 'per_area' | 'per_linear' | 'lump_sum' | 'per_day';
    unitName?: string;

    // Jurisdiction requirements
    sgRequired: 'mandatory' | 'recommended' | 'optional';
    myRequired: 'mandatory' | 'recommended' | 'optional';

    // Margin guidance
    marginFloorSG: number;
    marginFloorMY: number;
    marginTargetSG: number;
    marginTargetMY: number;

    // Buffer for risk
    bufferMinimum: number;
    bufferRecommended: number;

    // Duration-based?
    isDurationBased: boolean;
    defaultDurationWeeks?: number;

    // "Never free" items
    neverFree: string[];

    // Warnings
    commonDisputes: string[];
}

// ============================================================
// MASTER PROTECTION PROFILES
// ============================================================

export const PROTECTION_PROFILES: Record<ProtectionCategory, ProtectionModuleProfile> = {
    lift_protection: {
        category: 'lift_protection',
        displayName: 'Lift Protection',
        clientFacingName: 'Lift Protection & Restoration Works',
        description: 'Protection of lifts during renovation works including padding, films, and restoration',
        inclusions: [
            'Lift wall padding',
            'Door edge protection',
            'Control panel covering',
            'Floor lining inside lift',
            'Installation & removal',
        ],
        pricingBasis: 'per_unit',
        unitName: 'lift',
        sgRequired: 'mandatory',           // MCST requirement
        myRequired: 'recommended',
        marginFloorSG: 0.40,               // High margin - penalty risk
        marginFloorMY: 0.25,
        marginTargetSG: 0.55,
        marginTargetMY: 0.35,
        bufferMinimum: 0.10,
        bufferRecommended: 0.15,
        isDurationBased: true,
        defaultDurationWeeks: 8,
        neverFree: [
            'Lift protection materials',
            'Installation labour',
            'Removal & restoration',
            'Extended duration',
            'Damage repairs',
        ],
        commonDisputes: [
            'Damage discovered after removal',
            'Protection removed early by others',
            'Extended project duration',
        ],
    },

    floor_protection: {
        category: 'floor_protection',
        displayName: 'Floor Protection',
        clientFacingName: 'Floor Protection Works',
        description: 'Protection of existing floor finishes during renovation',
        inclusions: [
            'Corrugated sheets / boards',
            'Protective films',
            'Edge taping',
            'Multi-layer protection for high traffic areas',
        ],
        pricingBasis: 'per_area',
        unitName: 'sqft',
        sgRequired: 'mandatory',
        myRequired: 'recommended',
        marginFloorSG: 0.35,
        marginFloorMY: 0.25,
        marginTargetSG: 0.45,
        marginTargetMY: 0.35,
        bufferMinimum: 0.10,
        bufferRecommended: 0.15,
        isDurationBased: true,
        defaultDurationWeeks: 8,
        neverFree: [
            'Protection materials',
            'High traffic area upgrades',
            'Extended duration',
            'Replacement of damaged protection',
            'Removal & cleaning',
        ],
        commonDisputes: [
            'Scratches under protection',
            'Protection removed early',
            'Damage from heavy equipment',
            'Duration extensions',
        ],
    },

    wall_protection: {
        category: 'wall_protection',
        displayName: 'Wall & Surface Protection',
        clientFacingName: 'Wall & Surface Protection Works',
        description: 'Protection of walls, corners, door frames, and glass during works',
        inclusions: [
            'Wall corner guards',
            'Door frame protection',
            'Glass protection films',
            'Feature wall covering',
        ],
        pricingBasis: 'lump_sum',
        sgRequired: 'recommended',
        myRequired: 'optional',
        marginFloorSG: 0.30,
        marginFloorMY: 0.22,
        marginTargetSG: 0.40,
        marginTargetMY: 0.32,
        bufferMinimum: 0.08,
        bufferRecommended: 0.12,
        isDurationBased: true,
        defaultDurationWeeks: 8,
        neverFree: [
            'Corner guards',
            'Door frame protection',
            'Glass protection',
            'Removal & cleanup',
        ],
        commonDisputes: [
            'Scratches discovered post-removal',
            'Protection inadequate for scope',
            'Damage from other trades',
        ],
    },

    dust_containment: {
        category: 'dust_containment',
        displayName: 'Dust & Containment Protection',
        clientFacingName: 'Dust Control & Containment Measures',
        description: 'Dust barriers, sealing, and containment to prevent spread to common areas',
        inclusions: [
            'Plastic sheeting barriers',
            'Temporary hoarding at entry',
            'Sealing of openings',
            'Negative pressure fans (heavy works)',
            'Daily dust control',
        ],
        pricingBasis: 'lump_sum',
        sgRequired: 'mandatory',           // MCST + NEA compliance
        myRequired: 'recommended',
        marginFloorSG: 0.45,               // HIGH - regulatory risk
        marginFloorMY: 0.25,
        marginTargetSG: 0.60,              // Risk pricing justified
        marginTargetMY: 0.35,
        bufferMinimum: 0.15,
        bufferRecommended: 0.20,
        isDurationBased: true,
        defaultDurationWeeks: 8,
        neverFree: [
            'Dust barriers',
            'Sealing materials',
            'Negative pressure equipment',
            'Daily maintenance',
            'Compliance documentation',
        ],
        commonDisputes: [
            'Dust complaints from neighbours',
            'MCST stop-work orders',
            'NEA fines',
            'Additional containment required',
        ],
    },

    noise_control: {
        category: 'noise_control',
        displayName: 'Noise & Vibration Control',
        clientFacingName: 'Noise & Vibration Management',
        description: 'Work scheduling, temporary enclosures, and vibration control measures',
        inclusions: [
            'Work hour compliance management',
            'Temporary sound enclosures',
            'Staggered noisy works scheduling',
            'Vibration monitoring (if required)',
        ],
        pricingBasis: 'lump_sum',
        sgRequired: 'mandatory',
        myRequired: 'recommended',
        marginFloorSG: 0.35,
        marginFloorMY: 0.20,
        marginTargetSG: 0.45,
        marginTargetMY: 0.30,
        bufferMinimum: 0.10,
        bufferRecommended: 0.15,
        isDurationBased: false,
        neverFree: [
            'Work hour coordination',
            'Sound barriers',
            'Scheduling management',
            'Compliance documentation',
        ],
        commonDisputes: [
            'Noise complaints',
            'Work hour violations',
            'Extended noisy works duration',
        ],
    },

    hoarding_barricades: {
        category: 'hoarding_barricades',
        displayName: 'Temporary Hoarding & Barricades',
        clientFacingName: 'Site Hoarding & Safety Barricades',
        description: 'Hoarding boards, safety signage, and access control at site perimeter',
        inclusions: [
            'Hoarding boards',
            'Safety signage',
            'Access control measures',
            'Perimeter fencing',
        ],
        pricingBasis: 'per_linear',
        unitName: 'lm',
        sgRequired: 'mandatory',           // BCA / MCST requirement
        myRequired: 'recommended',
        marginFloorSG: 0.35,
        marginFloorMY: 0.25,
        marginTargetSG: 0.45,
        marginTargetMY: 0.35,
        bufferMinimum: 0.10,
        bufferRecommended: 0.15,
        isDurationBased: true,
        defaultDurationWeeks: 8,
        neverFree: [
            'Hoarding materials',
            'Installation',
            'Safety signage',
            'Removal & disposal',
        ],
        commonDisputes: [
            'Extended duration',
            'Damage to hoarding',
            'Additional access points required',
        ],
    },

    temporary_services: {
        category: 'temporary_services',
        displayName: 'Temporary Services',
        clientFacingName: 'Temporary Power, Water & Lighting',
        description: 'Temporary power, water, and lighting connections during works',
        inclusions: [
            'Temporary power setup',
            'Temporary water connection',
            'Temporary lighting',
            'Distribution boards',
        ],
        pricingBasis: 'lump_sum',
        sgRequired: 'mandatory',
        myRequired: 'mandatory',
        marginFloorSG: 0.30,
        marginFloorMY: 0.25,
        marginTargetSG: 0.40,
        marginTargetMY: 0.35,
        bufferMinimum: 0.10,
        bufferRecommended: 0.15,
        isDurationBased: true,
        defaultDurationWeeks: 8,
        neverFree: [
            'Setup costs',
            'Equipment hire',
            'Running costs',
            'Removal',
        ],
        commonDisputes: [
            'Extended duration charges',
            'Power consumption disputes',
            'Equipment damage',
        ],
    },

    protection_removal: {
        category: 'protection_removal',
        displayName: 'Protection Removal & Restoration',
        clientFacingName: 'Site Restoration & Handover Prep',
        description: 'Removal of all protections, cleaning, and minor touch-ups',
        inclusions: [
            'Removal of all protections',
            'Cleaning of residues',
            'Minor touch-ups',
            'Final inspection preparation',
        ],
        pricingBasis: 'lump_sum',
        sgRequired: 'mandatory',
        myRequired: 'mandatory',
        marginFloorSG: 0.30,
        marginFloorMY: 0.25,
        marginTargetSG: 0.40,
        marginTargetMY: 0.35,
        bufferMinimum: 0.08,
        bufferRecommended: 0.12,
        isDurationBased: false,
        neverFree: [
            'Removal labour',
            'Residue cleaning',
            'Touch-up materials',
            'Disposal of protection materials',
        ],
        commonDisputes: [
            'Scope of touch-ups',
            'Damage discovered during removal',
            'Cleaning standards',
        ],
    },
};

// ============================================================
// PROTECTION PACKAGES (Bundles)
// ============================================================

export type ProtectionPackageTier = 'basic' | 'enhanced' | 'high_risk';

export interface ProtectionPackage {
    tier: ProtectionPackageTier;
    name: string;
    description: string;
    includedModules: ProtectionCategory[];
    applicableContexts: PropertyContext[];
    marginMultiplier: number;      // Applied on top of individual margins
}

export const PROTECTION_PACKAGES: Record<ProtectionPackageTier, ProtectionPackage> = {
    basic: {
        tier: 'basic',
        name: 'Basic Protection Package',
        description: 'Essential protection for landed properties and low-risk sites',
        includedModules: [
            'floor_protection',
            'temporary_services',
            'protection_removal',
        ],
        applicableContexts: ['landed'],
        marginMultiplier: 1.0,
    },

    enhanced: {
        tier: 'enhanced',
        name: 'Enhanced Protection Package',
        description: 'Standard protection for condos and commercial with MCST requirements',
        includedModules: [
            'lift_protection',
            'floor_protection',
            'wall_protection',
            'dust_containment',
            'hoarding_barricades',
            'temporary_services',
            'protection_removal',
        ],
        applicableContexts: ['condo', 'commercial'],
        marginMultiplier: 1.1,
    },

    high_risk: {
        tier: 'high_risk',
        name: 'High-Risk Protection Package',
        description: 'Comprehensive protection for high-scrutiny buildings (hospitals, offices, premium condos)',
        includedModules: [
            'lift_protection',
            'floor_protection',
            'wall_protection',
            'dust_containment',
            'noise_control',
            'hoarding_barricades',
            'temporary_services',
            'protection_removal',
        ],
        applicableContexts: ['condo', 'commercial', 'industrial'],
        marginMultiplier: 1.2,
    },
};

// ============================================================
// AUTO-ADD RULES
// ============================================================

export interface AutoAddRule {
    id: string;
    name: string;
    conditions: {
        jurisdiction?: Jurisdiction;
        propertyContext?: PropertyContext[];
        hasDemolition?: boolean;
        hasWetWorks?: boolean;
    };
    requiredModules: ProtectionCategory[];
    priority: 'mandatory' | 'recommended';
}

export const AUTO_ADD_RULES: AutoAddRule[] = [
    {
        id: 'sg_condo_base',
        name: 'Singapore Condo Base Requirements',
        conditions: {
            jurisdiction: 'SG',
            propertyContext: ['condo'],
        },
        requiredModules: [
            'lift_protection',
            'floor_protection',
            'dust_containment',
            'hoarding_barricades',
            'temporary_services',
            'protection_removal',
        ],
        priority: 'mandatory',
    },
    {
        id: 'sg_hdb_base',
        name: 'Singapore HDB Base Requirements',
        conditions: {
            jurisdiction: 'SG',
            propertyContext: ['hdb'],
        },
        requiredModules: [
            'floor_protection',
            'dust_containment',
            'temporary_services',
            'protection_removal',
        ],
        priority: 'mandatory',
    },
    {
        id: 'sg_demolition',
        name: 'Singapore Demolition Works',
        conditions: {
            jurisdiction: 'SG',
            hasDemolition: true,
        },
        requiredModules: [
            'dust_containment',
            'noise_control',
        ],
        priority: 'mandatory',
    },
    {
        id: 'sg_commercial',
        name: 'Singapore Commercial Requirements',
        conditions: {
            jurisdiction: 'SG',
            propertyContext: ['commercial'],
        },
        requiredModules: [
            'lift_protection',
            'floor_protection',
            'dust_containment',
            'noise_control',
            'hoarding_barricades',
            'temporary_services',
            'protection_removal',
        ],
        priority: 'mandatory',
    },
    {
        id: 'my_condo',
        name: 'Malaysia Condo Recommendations',
        conditions: {
            jurisdiction: 'MY',
            propertyContext: ['condo'],
        },
        requiredModules: [
            'lift_protection',
            'floor_protection',
            'dust_containment',
            'temporary_services',
            'protection_removal',
        ],
        priority: 'recommended',
    },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getProtectionProfile(category: ProtectionCategory): ProtectionModuleProfile {
    return PROTECTION_PROFILES[category];
}

export function getRequiredModules(
    jurisdiction: Jurisdiction,
    propertyContext: PropertyContext,
    hasDemolition: boolean = false,
    hasWetWorks: boolean = false
): { mandatory: ProtectionCategory[]; recommended: ProtectionCategory[] } {
    const mandatory: Set<ProtectionCategory> = new Set();
    const recommended: Set<ProtectionCategory> = new Set();

    for (const rule of AUTO_ADD_RULES) {
        const { conditions, requiredModules, priority } = rule;

        // Check if rule applies
        let applies = true;

        if (conditions.jurisdiction && conditions.jurisdiction !== jurisdiction) {
            applies = false;
        }
        if (conditions.propertyContext && !conditions.propertyContext.includes(propertyContext)) {
            applies = false;
        }
        if (conditions.hasDemolition !== undefined && conditions.hasDemolition !== hasDemolition) {
            applies = false;
        }
        if (conditions.hasWetWorks !== undefined && conditions.hasWetWorks !== hasWetWorks) {
            applies = false;
        }

        if (applies) {
            for (const module of requiredModules) {
                if (priority === 'mandatory') {
                    mandatory.add(module);
                } else {
                    recommended.add(module);
                }
            }
        }
    }

    // Remove from recommended if already mandatory
    for (const m of mandatory) {
        recommended.delete(m);
    }

    return {
        mandatory: Array.from(mandatory),
        recommended: Array.from(recommended),
    };
}

export function getRecommendedPackage(
    jurisdiction: Jurisdiction,
    propertyContext: PropertyContext
): ProtectionPackageTier {
    if (jurisdiction === 'SG') {
        if (propertyContext === 'commercial' || propertyContext === 'industrial') {
            return 'high_risk';
        }
        if (propertyContext === 'condo') {
            return 'enhanced';
        }
        return 'basic';
    }

    // Malaysia
    if (propertyContext === 'condo' || propertyContext === 'commercial') {
        return 'enhanced';
    }
    return 'basic';
}

// ============================================================
// MANDATORY CONTRACT CLAUSES
// ============================================================

export const PROTECTION_CLAUSES = {
    scopeDefined: {
        id: 'prot_scope_defined',
        text: 'Protection scope is as specified in this quotation. Areas not listed are excluded from protection coverage.',
        mandatory: true,
    },
    durationLimited: {
        id: 'prot_duration_limited',
        text: 'Protection is provided for the duration stated. Extended project duration beyond the stated period will incur additional protection charges.',
        mandatory: true,
    },
    damageExclusion: {
        id: 'prot_damage_exclusion',
        text: 'The Contractor is not liable for damage to areas not covered by specified protections, or damage caused by third parties, the Client, or other trades.',
        mandatory: true,
    },
    removalIncluded: {
        id: 'prot_removal_included',
        text: 'Protection removal and basic cleanup is included. Any damage discovered during removal will be documented and may require separate remediation.',
        mandatory: true,
    },
    extraProtection: {
        id: 'prot_extra_variation',
        text: 'Additional protection beyond the specified scope, or protection for areas not originally included, will be quoted as a variation.',
        mandatory: true,
    },
    earlyRemoval: {
        id: 'prot_early_removal',
        text: 'If protections are removed early at the Client\'s request, the Contractor is not liable for subsequent damage to those areas.',
        mandatory: true,
    },
};

// ============================================================
// COST CALCULATION
// ============================================================

export interface ProtectionCostItem {
    category: ProtectionCategory;
    description: string;
    quantity: number;
    unit: string;
    unitCost: number;
    subtotal: number;
    buffer: number;
    adjustedCost: number;
    margin: number;
    sellingPrice: number;
}

export interface ProtectionCostSummary {
    items: ProtectionCostItem[];
    totalCost: number;
    totalSellingPrice: number;
    overallMargin: number;
    durationWeeks: number;
    missingMandatory: ProtectionCategory[];
    clientFacingTotal: number;
    clientFacingDescription: string;
}

export function calculateProtectionCosts(params: {
    jurisdiction: Jurisdiction;
    propertyContext: PropertyContext;
    selectedModules: ProtectionCategory[];
    durationWeeks: number;
    unitCounts: {
        lifts?: number;
        floorAreaSqft?: number;
        wallLinearM?: number;
        hoardingLinearM?: number;
    };
    customRates?: Partial<Record<ProtectionCategory, number>>;
}): ProtectionCostSummary {
    const { jurisdiction, propertyContext, selectedModules, durationWeeks, unitCounts, customRates } = params;

    // Get mandatory modules to check compliance
    const { mandatory } = getRequiredModules(jurisdiction, propertyContext);
    const missingMandatory = mandatory.filter(m => !selectedModules.includes(m));

    // Default rates (SGD)
    const defaultRates: Record<ProtectionCategory, number> = jurisdiction === 'SG' ? {
        lift_protection: 450,           // per lift
        floor_protection: 1.80,         // per sqft
        wall_protection: 350,           // lump sum base
        dust_containment: 800,          // lump sum base
        noise_control: 400,             // lump sum
        hoarding_barricades: 25,        // per lm
        temporary_services: 600,        // lump sum base
        protection_removal: 400,        // lump sum base
    } : {
        lift_protection: 250,
        floor_protection: 1.20,
        wall_protection: 200,
        dust_containment: 400,
        noise_control: 200,
        hoarding_barricades: 15,
        temporary_services: 350,
        protection_removal: 250,
    };

    const items: ProtectionCostItem[] = [];

    for (const category of selectedModules) {
        const profile = PROTECTION_PROFILES[category];
        const rate = customRates?.[category] ?? defaultRates[category];

        let quantity = 1;
        let unit = 'set';

        switch (category) {
            case 'lift_protection':
                quantity = unitCounts.lifts ?? 1;
                unit = 'lift';
                break;
            case 'floor_protection':
                quantity = unitCounts.floorAreaSqft ?? 500;
                unit = 'sqft';
                break;
            case 'hoarding_barricades':
                quantity = unitCounts.hoardingLinearM ?? 10;
                unit = 'lm';
                break;
            default:
                quantity = 1;
                unit = 'set';
        }

        // Duration multiplier for duration-based items
        const durationMultiplier = profile.isDurationBased
            ? Math.max(1, durationWeeks / (profile.defaultDurationWeeks || 8))
            : 1;

        const subtotal = rate * quantity * durationMultiplier;
        const bufferPercent = profile.bufferRecommended;
        const buffer = subtotal * bufferPercent;
        const adjustedCost = subtotal + buffer;
        const marginPercent = jurisdiction === 'SG' ? profile.marginTargetSG : profile.marginTargetMY;
        const sellingPrice = adjustedCost / (1 - marginPercent);

        items.push({
            category,
            description: profile.clientFacingName,
            quantity,
            unit,
            unitCost: rate,
            subtotal,
            buffer,
            adjustedCost,
            margin: marginPercent,
            sellingPrice: Math.round(sellingPrice * 100) / 100,
        });
    }

    const totalCost = items.reduce((sum, item) => sum + item.adjustedCost, 0);
    const totalSellingPrice = items.reduce((sum, item) => sum + item.sellingPrice, 0);
    const overallMargin = totalSellingPrice > 0 ? (totalSellingPrice - totalCost) / totalSellingPrice : 0;

    return {
        items,
        totalCost: Math.round(totalCost * 100) / 100,
        totalSellingPrice: Math.round(totalSellingPrice * 100) / 100,
        overallMargin: Math.round(overallMargin * 1000) / 1000,
        durationWeeks,
        missingMandatory,
        clientFacingTotal: Math.round(totalSellingPrice * 100) / 100,
        clientFacingDescription: 'Site Protection, Safeguards & Compliance Works',
    };
}
