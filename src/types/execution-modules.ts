/**
 * Comprehensive Execution Modules
 * 
 * This file consolidates all execution-layer domain knowledge:
 * - HDB Noisy Works Permit (SG)
 * - Access, Scaffold & Temporary Works
 * - Wall Levelling & Surface Preparation
 * - MEP Sequencing (First Fix / Second Fix)
 * 
 * RULE: If it involves regulatory permission, physical access,
 * surface tolerance, or trade sequencing  it lives here.
 */

import { Jurisdiction } from './core';
import { TradeCategory } from './trades';
import { PropertyContext } from './site-protection';

// ============================================================
// HDB NOISY WORKS PERMIT (SINGAPORE ONLY)
// ============================================================

export interface HDBNoisyWorksPermit {
    id: string;
    quoteId: string;

    // Scope of noisy works
    noisyTrades: TradeCategory[];
    declaredScope: string[];

    // Permit details
    permitStatus: 'not_applied' | 'pending' | 'approved' | 'rejected' | 'expired';
    approvedHours: {
        weekday: { start: string; end: string };
        saturday: { start: string; end: string };
        sundayPH: 'not_allowed' | 'restricted' | 'allowed';
    };
    approvedDuration: number;  // days
    validFrom?: string;
    validTo?: string;

    // Pricing
    baseCost: number;
    riskUplift: number;
    margin: number;
    sellingPrice: number;
}

export const HDB_NOISY_WORKS_TRIGGERS: TradeCategory[] = [
    'demolition',
    'masonry',
    'flooring',   // tile removal
];

export const HDB_NOISY_WORKS_CLAUSES = {
    approvedHours: {
        id: 'hdb_noisy_hours',
        text: 'Noisy works are permitted only during HDB-approved hours. No work outside approved periods.',
        mandatory: true,
    },
    scopeLimited: {
        id: 'hdb_noisy_scope',
        text: 'Permit validity is tied to the approved scope only. Additional or extended noisy works require new approval.',
        mandatory: true,
    },
    delayLiability: {
        id: 'hdb_noisy_delay',
        text: 'Delays due to authority conditions or permit rejection are not the Contractor\'s liability.',
        mandatory: true,
    },
    clientScope: {
        id: 'hdb_noisy_client',
        text: 'Client is responsible for accuracy of declared scope provided for permit application.',
        mandatory: true,
    },
    scopeChange: {
        id: 'hdb_noisy_variation',
        text: 'Scope changes after permit approval may require resubmission and additional permit fees.',
        mandatory: true,
    },
};

export function requiresHDBNoisyPermit(
    jurisdiction: Jurisdiction,
    propertyContext: PropertyContext,
    trades: TradeCategory[]
): boolean {
    if (jurisdiction !== 'SG' || propertyContext !== 'hdb') {
        return false;
    }
    return trades.some(t => HDB_NOISY_WORKS_TRIGGERS.includes(t));
}

export function calculateHDBPermitCost(params: {
    riskLevel: 'low' | 'moderate' | 'high';
}): { baseCost: number; riskUplift: number; margin: number; sellingPrice: number } {
    const baseCost = 350;  // Base admin cost
    const riskMultiplier = params.riskLevel === 'high' ? 1.5 : params.riskLevel === 'moderate' ? 1.2 : 1.0;
    const riskUplift = baseCost * (riskMultiplier - 1);
    const margin = 0.50;  // 50% margin for compliance work
    const totalCost = baseCost + riskUplift;
    const sellingPrice = totalCost / (1 - margin);

    return {
        baseCost,
        riskUplift,
        margin,
        sellingPrice: Math.round(sellingPrice * 100) / 100,
    };
}

// ============================================================
// ACCESS, SCAFFOLD & TEMPORARY WORKS
// ============================================================

export type AccessType =
    | 'ladder'
    | 'a_frame'
    | 'scaffold_standard'
    | 'scaffold_staircase'
    | 'scaffold_external'
    | 'scissor_lift'
    | 'boom_lift'
    | 'mewp'
    | 'rope_access';

export type AccessOwnership = 'owned' | 'rented';

export interface AccessModuleProfile {
    type: AccessType;
    displayName: string;
    clientFacingName: string;

    // Ownership
    typicalOwnership: AccessOwnership;

    // Applicability
    maxHeight: number;           // meters
    suitableFor: string[];
    notSuitableFor: string[];

    // Pricing
    pricingBasis: 'per_day' | 'per_week' | 'lump_sum' | 'per_setup';
    includesSetup: boolean;
    includesDismantling: boolean;
    includesTransport: boolean;

    // Duration
    typicalDurationWeeks: number;

    // Margins
    marginFloorSG: number;
    marginFloorMY: number;
    marginTargetSG: number;
    marginTargetMY: number;

    // Buffer
    bufferMinimum: number;
    bufferRecommended: number;

    // Compliance (SG)
    requiresCertifiedOperator: boolean;
    requiresPermitToWork: boolean;

    // Productivity penalty
    productivityMultiplier: number;  // 1.0 = normal, 1.3 = 30% slower
}

export const ACCESS_PROFILES: Record<AccessType, AccessModuleProfile> = {
    ladder: {
        type: 'ladder',
        displayName: 'Ladder Access',
        clientFacingName: 'Standard Ladder Access',
        typicalOwnership: 'owned',
        maxHeight: 3,
        suitableFor: ['touch-ups', 'light fixtures', 'minor works'],
        notSuitableFor: ['heavy equipment', 'extended duration', 'overhead work'],
        pricingBasis: 'lump_sum',
        includesSetup: true,
        includesDismantling: true,
        includesTransport: true,
        typicalDurationWeeks: 4,
        marginFloorSG: 0.25,
        marginFloorMY: 0.20,
        marginTargetSG: 0.35,
        marginTargetMY: 0.28,
        bufferMinimum: 0.05,
        bufferRecommended: 0.10,
        requiresCertifiedOperator: false,
        requiresPermitToWork: false,
        productivityMultiplier: 1.0,
    },

    a_frame: {
        type: 'a_frame',
        displayName: 'A-Frame Platform',
        clientFacingName: 'A-Frame Platform Access',
        typicalOwnership: 'owned',
        maxHeight: 4,
        suitableFor: ['ceiling work', 'painting', 'electrical'],
        notSuitableFor: ['heavy loads', 'uneven surfaces', 'long duration'],
        pricingBasis: 'lump_sum',
        includesSetup: true,
        includesDismantling: true,
        includesTransport: true,
        typicalDurationWeeks: 4,
        marginFloorSG: 0.28,
        marginFloorMY: 0.22,
        marginTargetSG: 0.38,
        marginTargetMY: 0.30,
        bufferMinimum: 0.08,
        bufferRecommended: 0.12,
        requiresCertifiedOperator: false,
        requiresPermitToWork: false,
        productivityMultiplier: 1.1,
    },

    scaffold_standard: {
        type: 'scaffold_standard',
        displayName: 'Standard Scaffold',
        clientFacingName: 'Scaffold Works',
        typicalOwnership: 'rented',
        maxHeight: 10,
        suitableFor: ['wall works', 'ceiling', 'facade', 'multi-level'],
        notSuitableFor: ['tight spaces', 'irregular geometry'],
        pricingBasis: 'per_week',
        includesSetup: false,
        includesDismantling: false,
        includesTransport: false,
        typicalDurationWeeks: 8,
        marginFloorSG: 0.35,
        marginFloorMY: 0.25,
        marginTargetSG: 0.45,
        marginTargetMY: 0.35,
        bufferMinimum: 0.12,
        bufferRecommended: 0.18,
        requiresCertifiedOperator: true,
        requiresPermitToWork: true,
        productivityMultiplier: 1.2,
    },

    scaffold_staircase: {
        type: 'scaffold_staircase',
        displayName: 'Staircase Scaffold (Specialised)',
        clientFacingName: 'Specialised Staircase Scaffold & Access Works',
        typicalOwnership: 'rented',
        maxHeight: 8,
        suitableFor: ['staircase walls', 'sloped walls', 'void areas'],
        notSuitableFor: ['standard flat walls'],
        pricingBasis: 'per_setup',
        includesSetup: false,
        includesDismantling: false,
        includesTransport: false,
        typicalDurationWeeks: 6,
        marginFloorSG: 0.45,               // HIGH - complexity
        marginFloorMY: 0.32,
        marginTargetSG: 0.55,
        marginTargetMY: 0.42,
        bufferMinimum: 0.15,
        bufferRecommended: 0.22,
        requiresCertifiedOperator: true,
        requiresPermitToWork: true,
        productivityMultiplier: 1.5,       // 50% slower - critical!
    },

    scaffold_external: {
        type: 'scaffold_external',
        displayName: 'External Facade Scaffold',
        clientFacingName: 'External Scaffold & Facade Access',
        typicalOwnership: 'rented',
        maxHeight: 30,
        suitableFor: ['facade works', 'external painting', 'window installation'],
        notSuitableFor: ['interior works'],
        pricingBasis: 'per_week',
        includesSetup: false,
        includesDismantling: false,
        includesTransport: false,
        typicalDurationWeeks: 12,
        marginFloorSG: 0.40,
        marginFloorMY: 0.30,
        marginTargetSG: 0.50,
        marginTargetMY: 0.40,
        bufferMinimum: 0.15,
        bufferRecommended: 0.20,
        requiresCertifiedOperator: true,
        requiresPermitToWork: true,
        productivityMultiplier: 1.3,
    },

    scissor_lift: {
        type: 'scissor_lift',
        displayName: 'Scissor Lift',
        clientFacingName: 'Scissor Lift Access',
        typicalOwnership: 'rented',
        maxHeight: 12,
        suitableFor: ['flat surfaces', 'ceiling work', 'MEP installation'],
        notSuitableFor: ['uneven ground', 'outdoor rough terrain'],
        pricingBasis: 'per_day',
        includesSetup: true,
        includesDismantling: true,
        includesTransport: false,
        typicalDurationWeeks: 2,
        marginFloorSG: 0.30,
        marginFloorMY: 0.22,
        marginTargetSG: 0.40,
        marginTargetMY: 0.32,
        bufferMinimum: 0.10,
        bufferRecommended: 0.15,
        requiresCertifiedOperator: true,
        requiresPermitToWork: true,
        productivityMultiplier: 1.1,
    },

    boom_lift: {
        type: 'boom_lift',
        displayName: 'Boom Lift / Cherry Picker',
        clientFacingName: 'Boom Lift Access',
        typicalOwnership: 'rented',
        maxHeight: 20,
        suitableFor: ['high ceilings', 'atriums', 'external reach'],
        notSuitableFor: ['confined spaces', 'indoor low ceiling'],
        pricingBasis: 'per_day',
        includesSetup: true,
        includesDismantling: true,
        includesTransport: false,
        typicalDurationWeeks: 1,
        marginFloorSG: 0.32,
        marginFloorMY: 0.25,
        marginTargetSG: 0.42,
        marginTargetMY: 0.35,
        bufferMinimum: 0.12,
        bufferRecommended: 0.18,
        requiresCertifiedOperator: true,
        requiresPermitToWork: true,
        productivityMultiplier: 1.15,
    },

    mewp: {
        type: 'mewp',
        displayName: 'MEWP (Mobile Elevating Work Platform)',
        clientFacingName: 'MEWP Access Equipment',
        typicalOwnership: 'rented',
        maxHeight: 15,
        suitableFor: ['general elevated work', 'flexible positioning'],
        notSuitableFor: ['very high work', 'heavy loads'],
        pricingBasis: 'per_day',
        includesSetup: true,
        includesDismantling: true,
        includesTransport: false,
        typicalDurationWeeks: 2,
        marginFloorSG: 0.30,
        marginFloorMY: 0.22,
        marginTargetSG: 0.40,
        marginTargetMY: 0.32,
        bufferMinimum: 0.10,
        bufferRecommended: 0.15,
        requiresCertifiedOperator: true,
        requiresPermitToWork: true,
        productivityMultiplier: 1.1,
    },

    rope_access: {
        type: 'rope_access',
        displayName: 'Rope Access (Industrial)',
        clientFacingName: 'Industrial Rope Access',
        typicalOwnership: 'owned',
        maxHeight: 100,
        suitableFor: ['high-rise facade', 'confined spaces', 'inspection'],
        notSuitableFor: ['heavy equipment', 'prolonged work'],
        pricingBasis: 'per_day',
        includesSetup: true,
        includesDismantling: true,
        includesTransport: true,
        typicalDurationWeeks: 1,
        marginFloorSG: 0.50,               // Very high - specialist
        marginFloorMY: 0.40,
        marginTargetSG: 0.60,
        marginTargetMY: 0.50,
        bufferMinimum: 0.20,
        bufferRecommended: 0.25,
        requiresCertifiedOperator: true,
        requiresPermitToWork: true,
        productivityMultiplier: 0.8,       // Actually faster for some work
    },
};

export const ACCESS_CLAUSES = {
    durationBased: {
        id: 'access_duration',
        text: 'Access equipment costs are based on the assumed duration stated. Extensions due to delays are chargeable at prevailing rates.',
        mandatory: true,
    },
    idleTime: {
        id: 'access_idle',
        text: 'Idle time due to site restrictions, client delays, or other trades is chargeable.',
        mandatory: true,
    },
    methodChange: {
        id: 'access_method',
        text: 'Access method may change subject to site conditions. Alternative access requirements will be quoted accordingly.',
        mandatory: true,
    },
    variation: {
        id: 'access_variation',
        text: 'Additional access requirements beyond scope are treated as a variation.',
        mandatory: true,
    },
    safety: {
        id: 'access_safety',
        text: 'Access equipment selection is based on safety requirements. Client requests that compromise safety will be declined.',
        mandatory: true,
    },
};

// ============================================================
// WALL LEVELLING & SURFACE PREPARATION
// ============================================================

export type WallFinishTier = 'tier_1_patch' | 'tier_2_skim' | 'tier_3_level';

export interface WallFinishProfile {
    tier: WallFinishTier;
    displayName: string;
    clientFacingName: string;
    description: string;

    // What's included
    includes: string[];

    // Expectation
    expectation: string;
    toleranceDescription: string;

    // Pricing
    ratePerSqftSG: number;
    ratePerSqftMY: number;

    // Margins
    marginFloorSG: number;
    marginFloorMY: number;
    marginTargetSG: number;
    marginTargetMY: number;

    // Buffer
    bufferMinimum: number;
    bufferRecommended: number;

    // Labour multiplier
    labourMultiplier: number;

    // Access requirement
    requiresAccessUpgrade: boolean;
}

export const WALL_FINISH_PROFILES: Record<WallFinishTier, WallFinishProfile> = {
    tier_1_patch: {
        tier: 'tier_1_patch',
        displayName: 'Tier 1: Make Good / Patch Repair',
        clientFacingName: 'Wall Patch & Make Good Works',
        description: 'Localised repairs for small defects, cracks, and nail holes',
        includes: [
            'Small defect repair',
            'Crack filling',
            'Nail hole filling',
            'Surface touch-up',
        ],
        expectation: 'Acceptable under normal lighting',
        toleranceDescription: 'Minor undulations acceptable. Not for feature walls or critical lighting.',
        ratePerSqftSG: 2.50,
        ratePerSqftMY: 1.50,
        marginFloorSG: 0.28,
        marginFloorMY: 0.22,
        marginTargetSG: 0.38,
        marginTargetMY: 0.30,
        bufferMinimum: 0.08,
        bufferRecommended: 0.12,
        labourMultiplier: 1.0,
        requiresAccessUpgrade: false,
    },

    tier_2_skim: {
        tier: 'tier_2_skim',
        displayName: 'Tier 2: Skim Coat / Surface Smoothing',
        clientFacingName: 'Wall Skim Coat & Surface Preparation',
        description: 'Standard residential quality for new finishes and repaint works',
        includes: [
            'Thin skim coat application',
            'Surface sanding',
            'Dust removal',
            'Primer-ready preparation',
        ],
        expectation: 'Visually flat at normal viewing distance',
        toleranceDescription: 'Suitable for standard residential. Minor imperfections may be visible under critical lighting.',
        ratePerSqftSG: 4.50,
        ratePerSqftMY: 2.80,
        marginFloorSG: 0.32,
        marginFloorMY: 0.25,
        marginTargetSG: 0.42,
        marginTargetMY: 0.35,
        bufferMinimum: 0.10,
        bufferRecommended: 0.15,
        labourMultiplier: 1.2,
        requiresAccessUpgrade: false,
    },

    tier_3_level: {
        tier: 'tier_3_level',
        displayName: 'Tier 3: Full Levelling / Straightening',
        clientFacingName: 'Premium Wall Levelling & Straightening',
        description: 'High-specification levelling for feature walls and critical lighting conditions',
        includes: [
            'Thicker plaster application',
            'Multiple passes with guide rules',
            'Straight edge correction',
            'Extended drying time',
            'Fine sanding to specification',
        ],
        expectation: 'Flat under critical lighting (wall washers, LEDs)',
        toleranceDescription: 'Industry-standard flatness tolerance. Suitable for feature walls and decorative lighting.',
        ratePerSqftSG: 8.00,
        ratePerSqftMY: 5.00,
        marginFloorSG: 0.40,
        marginFloorMY: 0.32,
        marginTargetSG: 0.50,
        marginTargetMY: 0.42,
        bufferMinimum: 0.15,
        bufferRecommended: 0.20,
        labourMultiplier: 1.8,
        requiresAccessUpgrade: true,       // More time = more access
    },
};

export const WALL_FINISH_CLAUSES = {
    tolerance: {
        id: 'wall_tolerance',
        text: 'Surface flatness is subject to industry tolerances and visual perception under normal lighting. Critical lighting, wall washers, or close-range inspection may reveal minor undulations unless premium levelling works are specified.',
        mandatory: true,
    },
    tierUpgrade: {
        id: 'wall_tier',
        text: 'Finish quality tier must be selected before works commence. Upgrade requests after commencement are subject to variation.',
        mandatory: true,
    },
    staircase: {
        id: 'wall_staircase',
        text: 'Staircase and void walls are automatically priced at premium levelling tier due to visibility and access requirements.',
        mandatory: true,
    },
    rework: {
        id: 'wall_rework',
        text: 'Touch-ups and rework due to damage from other trades are not included and will be quoted separately.',
        mandatory: true,
    },
};

export function getWallFinishTier(
    isStaircase: boolean,
    hasCriticalLighting: boolean,
    isFeatureWall: boolean
): WallFinishTier {
    // Auto-upgrade logic
    if (isStaircase || hasCriticalLighting || isFeatureWall) {
        return 'tier_3_level';
    }
    return 'tier_2_skim';  // Default for new finishes
}

// ============================================================
// MEP SEQUENCING (FIRST FIX / SECOND FIX)
// ============================================================

export type MEPPhase = 'first_fix' | 'temporary' | 'second_fix' | 'testing';

export type MEPTrade = 'electrical' | 'plumbing';

export interface MEPPhaseProfile {
    phase: MEPPhase;
    displayName: string;
    clientFacingName: string;
    description: string;

    // What's included
    includes: string[];

    // What's NOT included
    excludes: string[];

    // Timing
    typicalRoofOrder: number;  // 1 = first
    dependsOn: MEPPhase[];

    // Margins
    marginFloorSG: number;
    marginFloorMY: number;
    marginTargetSG: number;
    marginTargetMY: number;

    // Mobilisation
    mobilisationIncluded: boolean;
}

export const MEP_PHASE_PROFILES: Record<MEPTrade, Record<MEPPhase, MEPPhaseProfile>> = {
    electrical: {
        first_fix: {
            phase: 'first_fix',
            displayName: 'Electrical First Fix (Rough-In)',
            clientFacingName: 'Electrical  First Fix & Concealed Works',
            description: 'Concealed wiring, conduit installation, point relocation before wall closure',
            includes: [
                'Conduit installation',
                'Concealed wiring',
                'Point relocation',
                'DB preparation',
                'Embedded trunking',
            ],
            excludes: [
                'Switches & sockets',
                'Light fittings',
                'Final connections',
                'Testing',
            ],
            typicalRoofOrder: 1,
            dependsOn: [],
            marginFloorSG: 0.30,
            marginFloorMY: 0.22,
            marginTargetSG: 0.40,
            marginTargetMY: 0.32,
            mobilisationIncluded: true,
        },
        temporary: {
            phase: 'temporary',
            displayName: 'Temporary Power Setup',
            clientFacingName: 'Temporary Power & Distribution',
            description: 'Temporary power supply during renovation works',
            includes: [
                'Temporary DB setup',
                'Temporary sockets',
                'Site lighting',
                'Dismantling on completion',
            ],
            excludes: [
                'Running costs / electricity',
                'Extended duration',
            ],
            typicalRoofOrder: 1,
            dependsOn: [],
            marginFloorSG: 0.35,
            marginFloorMY: 0.25,
            marginTargetSG: 0.45,
            marginTargetMY: 0.35,
            mobilisationIncluded: true,
        },
        second_fix: {
            phase: 'second_fix',
            displayName: 'Electrical Second Fix (Final Installation)',
            clientFacingName: 'Electrical  Second Fix & Final Installation',
            description: 'Installation of switches, sockets, light fittings, and connections',
            includes: [
                'Switch & socket installation',
                'Light fitting installation',
                'Final connections',
                'Label & marking',
            ],
            excludes: [
                'Fittings (unless supplied)',
                'Testing & commissioning',
            ],
            typicalRoofOrder: 3,
            dependsOn: ['first_fix'],
            marginFloorSG: 0.30,
            marginFloorMY: 0.22,
            marginTargetSG: 0.40,
            marginTargetMY: 0.32,
            mobilisationIncluded: true,
        },
        testing: {
            phase: 'testing',
            displayName: 'Electrical Testing & Commissioning',
            clientFacingName: 'Electrical Testing & Compliance',
            description: 'System testing, commissioning, and compliance documentation',
            includes: [
                'Circuit testing',
                'Earth continuity test',
                'Insulation test',
                'Polarity check',
                'Certification',
            ],
            excludes: [
                'Rectification works',
                'Third-party testing fees',
            ],
            typicalRoofOrder: 4,
            dependsOn: ['second_fix'],
            marginFloorSG: 0.35,
            marginFloorMY: 0.25,
            marginTargetSG: 0.45,
            marginTargetMY: 0.35,
            mobilisationIncluded: true,
        },
    },
    plumbing: {
        first_fix: {
            phase: 'first_fix',
            displayName: 'Plumbing First Fix (Rough-In)',
            clientFacingName: 'Plumbing  First Fix & Concealed Works',
            description: 'Concealed piping, rerouting, and drain work before floor/wall closure',
            includes: [
                'Concealed piping',
                'Pipe rerouting',
                'Drain relocation',
                'Inlet preparation',
                'Outlet preparation',
            ],
            excludes: [
                'Sanitary fittings',
                'Taps & mixers',
                'Final connections',
                'Leak testing',
            ],
            typicalRoofOrder: 1,
            dependsOn: [],
            marginFloorSG: 0.32,
            marginFloorMY: 0.24,
            marginTargetSG: 0.42,
            marginTargetMY: 0.34,
            mobilisationIncluded: true,
        },
        temporary: {
            phase: 'temporary',
            displayName: 'Temporary Water Supply',
            clientFacingName: 'Temporary Water & Connection',
            description: 'Temporary water supply during renovation works',
            includes: [
                'Temporary tap point',
                'Hose connection',
                'Dismantling on completion',
            ],
            excludes: [
                'Water costs',
                'Extended duration',
            ],
            typicalRoofOrder: 1,
            dependsOn: [],
            marginFloorSG: 0.35,
            marginFloorMY: 0.25,
            marginTargetSG: 0.45,
            marginTargetMY: 0.35,
            mobilisationIncluded: true,
        },
        second_fix: {
            phase: 'second_fix',
            displayName: 'Plumbing Second Fix (Final Installation)',
            clientFacingName: 'Plumbing  Second Fix & Final Installation',
            description: 'Installation of sanitary fittings, taps, mixers, and connections',
            includes: [
                'Sanitary fitting installation',
                'Tap & mixer installation',
                'Final connections',
                'Silicone sealing',
            ],
            excludes: [
                'Fittings (unless supplied)',
                'Leak testing',
            ],
            typicalRoofOrder: 3,
            dependsOn: ['first_fix'],
            marginFloorSG: 0.32,
            marginFloorMY: 0.24,
            marginTargetSG: 0.42,
            marginTargetMY: 0.34,
            mobilisationIncluded: true,
        },
        testing: {
            phase: 'testing',
            displayName: 'Plumbing Testing & Commissioning',
            clientFacingName: 'Plumbing Testing & Leak Check',
            description: 'Pressure testing, leak checks, and system commissioning',
            includes: [
                'Pressure test',
                'Leak check all joints',
                'Flow test',
                'Drain test',
            ],
            excludes: [
                'Rectification works',
                'Access panels (if sealed)',
            ],
            typicalRoofOrder: 4,
            dependsOn: ['second_fix'],
            marginFloorSG: 0.35,
            marginFloorMY: 0.25,
            marginTargetSG: 0.45,
            marginTargetMY: 0.35,
            mobilisationIncluded: true,
        },
    },
};

export const MEP_CLAUSES = {
    phasing: {
        id: 'mep_phasing',
        text: 'MEP works are priced as separate phases (First Fix, Second Fix, Testing). Each phase represents a separate site mobilisation.',
        mandatory: true,
    },
    mobilisation: {
        id: 'mep_mobilisation',
        text: 'Each MEP phase includes one mobilisation. Additional site visits due to coordination issues, client delays, or other trades are chargeable.',
        mandatory: true,
    },
    temporary: {
        id: 'mep_temporary',
        text: 'Temporary power/water is a separate module. Duration extensions beyond stated period are chargeable.',
        mandatory: true,
    },
    fittings: {
        id: 'mep_fittings',
        text: 'Installation costs are separate from fitting supply unless explicitly stated as inclusive.',
        mandatory: true,
    },
    testing: {
        id: 'mep_testing',
        text: 'Testing and commissioning is a separate scope. Rectification of defects discovered during testing is chargeable.',
        mandatory: true,
    },
};

export function getMEPPhasesForQuote(
    trade: MEPTrade,
    hasDemolition: boolean,
    hasRerouting: boolean,
    requiresTemporary: boolean
): MEPPhase[] {
    const phases: MEPPhase[] = [];

    // First fix if there's demolition or rerouting
    if (hasDemolition || hasRerouting) {
        phases.push('first_fix');
    }

    // Temporary if explicitly required
    if (requiresTemporary) {
        phases.push('temporary');
    }

    // Second fix always
    phases.push('second_fix');

    // Testing always
    phases.push('testing');

    return phases;
}

// ============================================================
// PRODUCTIVITY MULTIPLIERS
// ============================================================

export interface ProductivityContext {
    isStaircase: boolean;
    isVoid: boolean;
    hasScaffold: boolean;
    accessType?: AccessType;
    wallTier?: WallFinishTier;
}

export function getProductivityMultiplier(context: ProductivityContext): number {
    // Use additive model to prevent extreme compounding
    let adjustment = 0;

    if (context.isStaircase) {
        adjustment += 0.5;  // Staircase = +50% time
    }

    if (context.isVoid) {
        adjustment += 0.3;  // Void = +30% time
    }

    if (context.hasScaffold && context.accessType) {
        const accessProfile = ACCESS_PROFILES[context.accessType];
        adjustment += (accessProfile.productivityMultiplier - 1);  // Add only the penalty portion
    }

    if (context.wallTier === 'tier_3_level') {
        adjustment += (WALL_FINISH_PROFILES.tier_3_level.labourMultiplier - 1);  // Add only the penalty portion
    }

    // Cap at 2.5x to prevent unreasonable penalties
    return Math.min(Math.round((1 + adjustment) * 100) / 100, 2.5);
}
