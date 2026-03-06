/**
 * Compliance Engine
 * 
 * This is the enforcement layer that:
 * 1. Bundles SG authority permits into smart Compliance Packs
 * 2. Validates quotes for compliance and rejects unsafe configurations
 * 3. Automatically selects appropriate access methods
 * 
 * RULE: The system protects you from optimism and shortcuts.
 */

import { Jurisdiction } from './core';
import { TradeCategory, TRADE_PROFILES } from './trades';
import { PropertyContext, ProtectionCategory, PROTECTION_PROFILES, getRequiredModules } from './site-protection';
import {
    AccessType, ACCESS_PROFILES,
    WallFinishTier, WALL_FINISH_PROFILES,
    MEPPhase, MEPTrade, getMEPPhasesForQuote,
    requiresHDBNoisyPermit, calculateHDBPermitCost,
    getProductivityMultiplier, ProductivityContext
} from './execution-modules';
import {
    DemolitionScope, validateSGDemolitionQuote,
    SG_DEMOLITION_CLAUSES, getDemolitionPermitRequirements
} from './sg-demolition';

// ============================================================
// COMPLIANCE PACK (BUNDLED SG PERMITS)
// ============================================================

export type CompliancePackTier = 'essential' | 'standard' | 'comprehensive';

export interface CompliancePackItem {
    id: string;
    name: string;
    description: string;
    applicableTo: PropertyContext[];
    baseCost: number;
    margin: number;
    mandatory: boolean;
}

export interface CompliancePack {
    tier: CompliancePackTier;
    name: string;
    description: string;
    applicableJurisdiction: Jurisdiction;
    applicableContexts: PropertyContext[];
    items: CompliancePackItem[];
    totalBaseCost: number;
    bundleDiscount: number;           // % discount for bundling
    sellingPrice: number;
    mandatoryClauses: string[];
}

export const SG_COMPLIANCE_ITEMS: Record<string, CompliancePackItem> = {
    hdb_noisy_permit: {
        id: 'hdb_noisy_permit',
        name: 'HDB Noisy Works Permit',
        description: 'Application and coordination for HDB noisy works approval',
        applicableTo: ['hdb'],
        baseCost: 350,
        margin: 0.50,
        mandatory: true,
    },
    mcst_renovation_permit: {
        id: 'mcst_renovation_permit',
        name: 'MCST Renovation Permit',
        description: 'Management approval, deposit coordination, and access arrangement',
        applicableTo: ['condo'],
        baseCost: 400,
        margin: 0.45,
        mandatory: true,
    },
    bca_demolition_permit: {
        id: 'bca_demolition_permit',
        name: 'BCA Demolition Permit',
        description: 'Authority approval for demolition works (if structural)',
        applicableTo: ['hdb', 'condo', 'landed', 'commercial'],
        baseCost: 800,
        margin: 0.50,
        mandatory: false,  // Only if structural
    },
    pe_endorsement: {
        id: 'pe_endorsement',
        name: 'Professional Engineer Endorsement',
        description: 'PE assessment and certification for structural works',
        applicableTo: ['hdb', 'condo', 'landed', 'commercial'],
        baseCost: 3000,
        margin: 0.40,
        mandatory: false,  // Only if structural
    },
    town_council_approval: {
        id: 'town_council_approval',
        name: 'Town Council Approval',
        description: 'Coordination with Town Council for common area access',
        applicableTo: ['hdb', 'condo'],
        baseCost: 200,
        margin: 0.45,
        mandatory: false,  // Only needed if accessing common areas (corridors, lift lobbies)
    },
    nea_disposal_compliance: {
        id: 'nea_disposal_compliance',
        name: 'NEA Licensed Disposal',
        description: 'Licensed waste disposal documentation and receipts',
        applicableTo: ['hdb', 'condo', 'landed', 'commercial'],
        baseCost: 150,
        margin: 0.40,
        mandatory: true,
    },
    work_at_height_permit: {
        id: 'work_at_height_permit',
        name: 'Work at Height Permit',
        description: 'MOM-compliant permit for elevated works',
        applicableTo: ['hdb', 'condo', 'landed', 'commercial'],
        baseCost: 250,
        margin: 0.45,
        mandatory: false,  // Only if height work
    },
    fire_safety_cert: {
        id: 'fire_safety_cert',
        name: 'Fire Safety Certification',
        description: 'SCDF compliance for fire safety modifications',
        applicableTo: ['commercial'],
        baseCost: 500,
        margin: 0.45,
        mandatory: false,  // Only if fire systems affected
    },
};

export const SG_COMPLIANCE_PACKS: Record<CompliancePackTier, Omit<CompliancePack, 'items' | 'totalBaseCost' | 'sellingPrice'>> = {
    essential: {
        tier: 'essential',
        name: 'Essential Compliance Pack',
        description: 'Basic permits for simple residential works',
        applicableJurisdiction: 'SG',
        applicableContexts: ['landed'],
        bundleDiscount: 0.05,
        mandatoryClauses: [
            'sg_demo_disposal_estimate',
            'sg_demo_licensed_disposal',
            'sg_demo_prior_works',
        ],
    },
    standard: {
        tier: 'standard',
        name: 'Standard Compliance Pack',
        description: 'Full permit suite for HDB and condo renovations',
        applicableJurisdiction: 'SG',
        applicableContexts: ['hdb', 'condo'],
        bundleDiscount: 0.10,
        mandatoryClauses: [
            'sg_demo_disposal_estimate',
            'sg_demo_licensed_disposal',
            'sg_demo_prior_works',
            'sg_demo_work_hours',
            'hdb_noisy_hours',
            'hdb_noisy_scope',
        ],
    },
    comprehensive: {
        tier: 'comprehensive',
        name: 'Comprehensive Compliance Pack',
        description: 'Full regulatory coverage including PE and structural permits',
        applicableJurisdiction: 'SG',
        applicableContexts: ['hdb', 'condo', 'commercial'],
        bundleDiscount: 0.15,
        mandatoryClauses: Object.keys(SG_DEMOLITION_CLAUSES),
    },
};

export function buildCompliancePack(params: {
    propertyContext: PropertyContext;
    hasDemolition: boolean;
    isStructural: boolean;
    hasHeightWork: boolean;
    hasFireSystems: boolean;
}): CompliancePack {
    const { propertyContext, hasDemolition, isStructural, hasHeightWork, hasFireSystems } = params;

    // Determine tier
    let tier: CompliancePackTier = 'essential';
    if (propertyContext === 'hdb' || propertyContext === 'condo') {
        tier = isStructural ? 'comprehensive' : 'standard';
    } else if (propertyContext === 'commercial') {
        tier = 'comprehensive';
    }

    const packTemplate = SG_COMPLIANCE_PACKS[tier];
    const items: CompliancePackItem[] = [];

    // Add applicable items
    for (const item of Object.values(SG_COMPLIANCE_ITEMS)) {
        if (!item.applicableTo.includes(propertyContext)) continue;

        // Conditional items
        if (item.id === 'bca_demolition_permit' && !isStructural) continue;
        if (item.id === 'pe_endorsement' && !isStructural) continue;
        if (item.id === 'work_at_height_permit' && !hasHeightWork) continue;
        if (item.id === 'fire_safety_cert' && !hasFireSystems) continue;
        if (item.id === 'hdb_noisy_permit' && propertyContext !== 'hdb') continue;
        if (item.id === 'mcst_renovation_permit' && propertyContext !== 'condo') continue;
        if (item.id === 'nea_disposal_compliance' && !hasDemolition) continue;

        items.push(item);
    }

    // Calculate totals
    const totalBaseCost = items.reduce((sum, item) => sum + item.baseCost, 0);
    const discountedCost = totalBaseCost * (1 - packTemplate.bundleDiscount);
    const avgMargin = items.length > 0
        ? items.reduce((sum, item) => sum + item.margin, 0) / items.length
        : 0.45;
    const sellingPrice = discountedCost / (1 - avgMargin);

    return {
        ...packTemplate,
        items,
        totalBaseCost,
        sellingPrice: Math.round(sellingPrice * 100) / 100,
    };
}

// ============================================================
// AUTO-COMPLIANCE VALIDATION ENGINE
// ============================================================

export type ComplianceViolationSeverity = 'error' | 'warning' | 'info';

export interface ComplianceViolation {
    id: string;
    severity: ComplianceViolationSeverity;
    category: string;
    message: string;
    remedy: string;
    autoFixAvailable: boolean;
    autoFixAction?: string;
}

export interface ComplianceValidationResult {
    isValid: boolean;
    canProceed: boolean;           // Can submit quote (warnings only)
    mustFix: boolean;              // Has errors that block submission
    violations: ComplianceViolation[];
    suggestedAdditions: string[];  // Modules to auto-add
    overrideRequired: boolean;     // Needs explicit override to proceed
}

export interface QuoteForValidation {
    jurisdiction: Jurisdiction;
    propertyContext: PropertyContext;
    trades: TradeCategory[];
    hasProtection: {
        lift: boolean;
        floor: boolean;
        dust: boolean;
        hoarding: boolean;
    };
    hasPermits: {
        hdbNoisy: boolean;
        mcstRenovation: boolean;
        bcaDemolition: boolean;
    };
    hasAccess: {
        type?: AccessType;
        heightRequired: number;  // meters
    };
    hasMEP: {
        electrical: MEPPhase[];
        plumbing: MEPPhase[];
    };
    wallFinish?: {
        tier: WallFinishTier;
        hasStaircase: boolean;
        hasCriticalLighting: boolean;
    };
    margins: {
        overall: number;
        demolition?: number;
    };
    includedClauses: string[];
}

export function validateQuoteCompliance(quote: QuoteForValidation): ComplianceValidationResult {
    const violations: ComplianceViolation[] = [];
    const suggestedAdditions: string[] = [];

    // ============================================================
    // SINGAPORE-SPECIFIC CHECKS
    // ============================================================
    if (quote.jurisdiction === 'SG') {

        // --- HDB Noisy Permit ---
        if (quote.propertyContext === 'hdb') {
            const needsNoisyPermit = quote.trades.some(t =>
                ['demolition', 'masonry', 'flooring'].includes(t)
            );
            if (needsNoisyPermit && !quote.hasPermits.hdbNoisy) {
                violations.push({
                    id: 'sg_hdb_noisy_missing',
                    severity: 'error',
                    category: 'Permit',
                    message: 'HDB Noisy Works Permit is required but not included',
                    remedy: 'Add HDB Noisy Works Permit module',
                    autoFixAvailable: true,
                    autoFixAction: 'add_hdb_noisy_permit',
                });
                suggestedAdditions.push('HDB Noisy Works Permit');
            }
        }

        // --- Condo MCST Permit ---
        if (quote.propertyContext === 'condo' && !quote.hasPermits.mcstRenovation) {
            violations.push({
                id: 'sg_mcst_missing',
                severity: 'error',
                category: 'Permit',
                message: 'MCST Renovation Permit is required for condo works',
                remedy: 'Add MCST Renovation Permit module',
                autoFixAvailable: true,
                autoFixAction: 'add_mcst_permit',
            });
            suggestedAdditions.push('MCST Renovation Permit');
        }

        // --- Lift Protection (Condo) ---
        if (quote.propertyContext === 'condo' && !quote.hasProtection.lift) {
            violations.push({
                id: 'sg_condo_lift_protection',
                severity: 'error',
                category: 'Protection',
                message: 'Lift protection is mandatory for condo renovations',
                remedy: 'Add Lift Protection module',
                autoFixAvailable: true,
                autoFixAction: 'add_lift_protection',
            });
            suggestedAdditions.push('Lift Protection');
        }

        // --- Dust Containment (Demolition) ---
        if (quote.trades.includes('demolition') && !quote.hasProtection.dust) {
            violations.push({
                id: 'sg_dust_containment_missing',
                severity: 'error',
                category: 'Protection',
                message: 'Dust containment is required for demolition works in Singapore',
                remedy: 'Add Dust Containment module',
                autoFixAvailable: true,
                autoFixAction: 'add_dust_containment',
            });
            suggestedAdditions.push('Dust Containment');
        }

        // --- Demolition Margin Floor ---
        if (quote.trades.includes('demolition') && quote.margins.demolition !== undefined) {
            if (quote.margins.demolition < 0.40) {
                violations.push({
                    id: 'sg_demolition_margin_floor',
                    severity: 'error',
                    category: 'Margin',
                    message: `Demolition margin (${(quote.margins.demolition * 100).toFixed(0)}%) is below SG floor of 40%`,
                    remedy: 'Increase demolition margin to at least 40%',
                    autoFixAvailable: false,
                });
            } else if (quote.margins.demolition < 0.50) {
                violations.push({
                    id: 'sg_demolition_margin_target',
                    severity: 'warning',
                    category: 'Margin',
                    message: `Demolition margin (${(quote.margins.demolition * 100).toFixed(0)}%) is below SG target of 50%`,
                    remedy: 'Consider increasing demolition margin to 50%',
                    autoFixAvailable: false,
                });
            }
        }

        // --- Licensed Disposal ---
        if (quote.trades.includes('demolition')) {
            const hasDisposalClause = quote.includedClauses.includes('sg_demo_licensed_disposal');
            if (!hasDisposalClause) {
                violations.push({
                    id: 'sg_disposal_clause_missing',
                    severity: 'warning',
                    category: 'Clause',
                    message: 'Licensed disposal clause not included in quote terms',
                    remedy: 'Add mandatory SG disposal clause',
                    autoFixAvailable: true,
                    autoFixAction: 'add_disposal_clause',
                });
            }
        }
    }

    // ============================================================
    // ACCESS CHECKS (ALL JURISDICTIONS)
    // ============================================================

    // --- Height vs Access Type ---
    if (quote.hasAccess.heightRequired > 3) {
        if (!quote.hasAccess.type) {
            violations.push({
                id: 'access_not_specified',
                severity: 'error',
                category: 'Access',
                message: `Work requires access above 3m but no access equipment specified`,
                remedy: 'Add appropriate access equipment (scaffold/lift)',
                autoFixAvailable: true,
                autoFixAction: 'suggest_access',
            });
        } else {
            const accessProfile = ACCESS_PROFILES[quote.hasAccess.type];
            if (quote.hasAccess.heightRequired > accessProfile.maxHeight) {
                violations.push({
                    id: 'access_insufficient_height',
                    severity: 'error',
                    category: 'Access',
                    message: `${accessProfile.displayName} max height (${accessProfile.maxHeight}m) insufficient for required ${quote.hasAccess.heightRequired}m`,
                    remedy: 'Select access equipment with adequate height rating',
                    autoFixAvailable: true,
                    autoFixAction: 'upgrade_access',
                });
            }
        }
    }

    // --- Ladder Safety Check ---
    if (quote.hasAccess.type === 'ladder' && quote.hasAccess.heightRequired > 3) {
        violations.push({
            id: 'ladder_unsafe_height',
            severity: 'error',
            category: 'Access',
            message: 'Ladder access is unsafe for work above 3m',
            remedy: 'Use scaffold or elevated work platform',
            autoFixAvailable: true,
            autoFixAction: 'upgrade_access',
        });
    }

    // ============================================================
    // WALL FINISH CHECKS
    // ============================================================
    if (quote.wallFinish) {
        // Staircase requires Tier 3
        if (quote.wallFinish.hasStaircase && quote.wallFinish.tier !== 'tier_3_level') {
            violations.push({
                id: 'wall_staircase_tier',
                severity: 'error',
                category: 'Wall Finish',
                message: 'Staircase walls require Tier 3 (Premium Levelling)',
                remedy: 'Upgrade wall finish to Tier 3 for staircase areas',
                autoFixAvailable: true,
                autoFixAction: 'upgrade_wall_tier',
            });
        }

        // Critical lighting requires Tier 3
        if (quote.wallFinish.hasCriticalLighting && quote.wallFinish.tier !== 'tier_3_level') {
            violations.push({
                id: 'wall_lighting_tier',
                severity: 'warning',
                category: 'Wall Finish',
                message: 'Critical lighting conditions recommend Tier 3 finish',
                remedy: 'Consider upgrading to Tier 3 for feature walls with wall washers',
                autoFixAvailable: true,
                autoFixAction: 'upgrade_wall_tier',
            });
        }
    }

    // ============================================================
    // MEP SEQUENCING CHECKS
    // ============================================================

    // Electrical has rerouting but no first fix
    if (quote.trades.includes('electrical')) {
        const hasDemolition = quote.trades.includes('demolition');
        if (hasDemolition && !quote.hasMEP.electrical.includes('first_fix')) {
            violations.push({
                id: 'mep_electrical_first_fix',
                severity: 'error',
                category: 'MEP',
                message: 'Electrical First Fix is required when demolition is included',
                remedy: 'Add Electrical First Fix phase',
                autoFixAvailable: true,
                autoFixAction: 'add_electrical_first_fix',
            });
            suggestedAdditions.push('Electrical First Fix');
        }

        // Has second fix but no testing
        if (quote.hasMEP.electrical.includes('second_fix') && !quote.hasMEP.electrical.includes('testing')) {
            violations.push({
                id: 'mep_electrical_testing',
                severity: 'warning',
                category: 'MEP',
                message: 'Electrical Testing & Commissioning should be included',
                remedy: 'Add Electrical Testing phase',
                autoFixAvailable: true,
                autoFixAction: 'add_electrical_testing',
            });
        }
    }

    // Plumbing has rerouting but no first fix
    if (quote.trades.includes('plumbing')) {
        const hasDemolition = quote.trades.includes('demolition');
        if (hasDemolition && !quote.hasMEP.plumbing.includes('first_fix')) {
            violations.push({
                id: 'mep_plumbing_first_fix',
                severity: 'error',
                category: 'MEP',
                message: 'Plumbing First Fix is required when demolition is included',
                remedy: 'Add Plumbing First Fix phase',
                autoFixAvailable: true,
                autoFixAction: 'add_plumbing_first_fix',
            });
            suggestedAdditions.push('Plumbing First Fix');
        }
    }

    // ============================================================
    // FLOOR PROTECTION
    // ============================================================
    if (!quote.hasProtection.floor && quote.trades.length > 2) {
        violations.push({
            id: 'floor_protection_missing',
            severity: 'warning',
            category: 'Protection',
            message: 'Floor protection recommended for multi-trade works',
            remedy: 'Add Floor Protection module',
            autoFixAvailable: true,
            autoFixAction: 'add_floor_protection',
        });
    }

    // ============================================================
    // COMPILE RESULT
    // ============================================================
    const errors = violations.filter(v => v.severity === 'error');
    const warnings = violations.filter(v => v.severity === 'warning');

    return {
        isValid: errors.length === 0,
        canProceed: errors.length === 0,
        mustFix: errors.length > 0,
        violations,
        suggestedAdditions,
        overrideRequired: errors.length > 0,
    };
}

// ============================================================
// ACCESS DECISION LOGIC
// ============================================================

export interface AccessDecisionInput {
    workType: string;                // e.g., 'ceiling', 'wall', 'facade'
    heightRequired: number;          // meters
    durationDays: number;
    isInterior: boolean;
    isStaircase: boolean;
    isVoid: boolean;
    surfaceType: 'flat' | 'sloped' | 'irregular';
    loadRequired: 'light' | 'moderate' | 'heavy';
    jurisdiction: Jurisdiction;
}

export interface AccessDecision {
    recommendedType: AccessType;
    alternativeType?: AccessType;
    reasoning: string;
    productivityMultiplier: number;
    estimatedCostRange: { min: number; max: number };
    warnings: string[];
}

export function decideAccessMethod(input: AccessDecisionInput): AccessDecision {
    const {
        heightRequired, durationDays, isInterior, isStaircase,
        isVoid, surfaceType, loadRequired, jurisdiction
    } = input;

    const warnings: string[] = [];
    let recommendedType: AccessType;
    let alternativeType: AccessType | undefined;
    let reasoning: string;

    // ============================================================
    // DECISION TREE
    // ============================================================

    // STAIRCASE / VOID  Always specialised scaffold
    if (isStaircase || isVoid) {
        recommendedType = 'scaffold_staircase';
        reasoning = 'Staircase/void areas require specialised scaffold configuration due to non-level base and extended sightlines';
        warnings.push('Productivity penalty of 1.5x will be applied to downstream trades');
        warnings.push('Extended rental duration likely due to access complexity');
    }
    // LOW HEIGHT (3m)  Ladder or A-frame
    else if (heightRequired <= 3) {
        if (durationDays <= 3 && loadRequired === 'light') {
            recommendedType = 'ladder';
            reasoning = 'Short duration, low height, light work  basic ladder access sufficient';
        } else {
            recommendedType = 'a_frame';
            alternativeType = 'ladder';
            reasoning = 'Extended duration or moderate load  A-frame platform recommended for stability';
        }
    }
    // MEDIUM HEIGHT (3-6m)  A-frame, scaffold, or scissor lift
    else if (heightRequired <= 6) {
        if (durationDays <= 5 && isInterior && surfaceType === 'flat') {
            recommendedType = 'scissor_lift';
            alternativeType = 'scaffold_standard';
            reasoning = 'Short duration interior work on flat surface  scissor lift efficient';
        } else {
            recommendedType = 'scaffold_standard';
            alternativeType = 'scissor_lift';
            reasoning = 'Extended duration or irregular surface  scaffold provides stable platform';
        }
    }
    // HIGH HEIGHT (6-12m)  Scaffold or boom lift
    else if (heightRequired <= 12) {
        if (durationDays <= 3 && loadRequired === 'light') {
            recommendedType = 'boom_lift';
            alternativeType = 'scaffold_standard';
            reasoning = 'Short duration, light work at height  boom lift for quick access';
        } else {
            recommendedType = 'scaffold_standard';
            alternativeType = 'scissor_lift';
            reasoning = 'Extended work at height  scaffold for sustained platform access';
        }
    }
    // VERY HIGH (12-20m)  Boom lift or external scaffold
    else if (heightRequired <= 20) {
        if (isInterior) {
            recommendedType = 'boom_lift';
            reasoning = 'High interior work  boom lift required (check floor load capacity)';
            warnings.push('Verify floor can support boom lift weight');
        } else {
            recommendedType = 'scaffold_external';
            alternativeType = 'boom_lift';
            reasoning = 'External high work  external scaffold for sustained access';
        }
    }
    // EXTREME HEIGHT (>20m)  External scaffold or rope access
    else {
        if (durationDays <= 2 && loadRequired === 'light') {
            recommendedType = 'rope_access';
            reasoning = 'Short duration inspection/light work at extreme height  rope access specialist';
            warnings.push('Requires certified rope access technicians');
        } else {
            recommendedType = 'scaffold_external';
            reasoning = 'Extended work at extreme height  external scaffold required';
            warnings.push('Significant mobilisation and rental cost');
        }
    }

    // ============================================================
    // COMPLIANCE WARNINGS
    // ============================================================
    const accessProfile = ACCESS_PROFILES[recommendedType];

    if (accessProfile.requiresCertifiedOperator && jurisdiction === 'SG') {
        warnings.push('Certified operator required (SG MOM compliance)');
    }

    if (accessProfile.requiresPermitToWork && jurisdiction === 'SG') {
        warnings.push('Work-at-height permit required');
    }

    if (accessProfile.typicalOwnership === 'rented') {
        warnings.push('Rental equipment - idle time and extensions are chargeable');
    }

    // ============================================================
    // CALCULATE COSTS
    // ============================================================
    const productivityMultiplier = accessProfile.productivityMultiplier;

    // Rough cost estimation (SGD for SG, adjusted for MY)
    const jurisdictionMultiplier = jurisdiction === 'SG' ? 1.0 : 0.6;
    const baseDailyCost = {
        ladder: 20,
        a_frame: 35,
        scaffold_standard: 150,
        scaffold_staircase: 250,
        scaffold_external: 400,
        scissor_lift: 250,
        boom_lift: 350,
        mewp: 280,
        rope_access: 800,
    };

    const dailyCost = (baseDailyCost[recommendedType] || 200) * jurisdictionMultiplier;
    const setupCost = accessProfile.includesSetup ? 0 : dailyCost * 2;

    const minCost = Math.round((dailyCost * durationDays + setupCost) * 0.8);
    const maxCost = Math.round((dailyCost * durationDays + setupCost) * 1.4);

    return {
        recommendedType,
        alternativeType,
        reasoning,
        productivityMultiplier,
        estimatedCostRange: { min: minCost, max: maxCost },
        warnings,
    };
}

// ============================================================
// SMART AUTO-ADD ENGINE
// ============================================================

export interface QuoteAutoAdditions {
    protectionModules: ProtectionCategory[];
    complianceItems: string[];
    accessType?: AccessType;
    mepPhases: {
        electrical: MEPPhase[];
        plumbing: MEPPhase[];
    };
    wallFinishUpgrade?: WallFinishTier;
    productivityMultipliers: { area: string; multiplier: number }[];
    mandatoryClauses: string[];
    estimatedAdditions: number;      // SGD
}

export function calculateAutoAdditions(params: {
    jurisdiction: Jurisdiction;
    propertyContext: PropertyContext;
    trades: TradeCategory[];
    areas: { name: string; isStaircase: boolean; isVoid: boolean; heightM: number }[];
    hasDemolition: boolean;
    hasRerouting: boolean;
    durationWeeks: number;
}): QuoteAutoAdditions {
    const { jurisdiction, propertyContext, trades, areas, hasDemolition, hasRerouting, durationWeeks } = params;

    const protectionModules: ProtectionCategory[] = [];
    const complianceItems: string[] = [];
    const mandatoryClauses: string[] = [];
    const productivityMultipliers: { area: string; multiplier: number }[] = [];
    let estimatedAdditions = 0;

    // ============================================================
    // PROTECTION MODULES
    // ============================================================
    const { mandatory: mandatoryProtection, recommended: recommendedProtection } =
        getRequiredModules(jurisdiction, propertyContext, hasDemolition, trades.includes('masonry'));

    protectionModules.push(...mandatoryProtection);

    // Add estimated costs for protection
    for (const mod of mandatoryProtection) {
        const profile = PROTECTION_PROFILES[mod];
        const rate = jurisdiction === 'SG' ?
            (profile.marginTargetSG / (1 - profile.marginTargetSG)) * 1000 :
            (profile.marginTargetMY / (1 - profile.marginTargetMY)) * 600;
        estimatedAdditions += rate;
    }

    // ============================================================
    // COMPLIANCE ITEMS (SG)
    // ============================================================
    if (jurisdiction === 'SG') {
        if (propertyContext === 'hdb' && hasDemolition) {
            complianceItems.push('hdb_noisy_permit');
            mandatoryClauses.push('hdb_noisy_hours', 'hdb_noisy_scope', 'hdb_noisy_delay');
            estimatedAdditions += 700;  // Permit selling price
        }

        if (propertyContext === 'condo') {
            complianceItems.push('mcst_renovation_permit');
            estimatedAdditions += 730;
        }

        if (hasDemolition) {
            complianceItems.push('nea_disposal_compliance');
            mandatoryClauses.push(...Object.keys(SG_DEMOLITION_CLAUSES));
            estimatedAdditions += 250;
        }
    }

    // ============================================================
    // MEP PHASES
    // ============================================================
    const mepPhases = {
        electrical: [] as MEPPhase[],
        plumbing: [] as MEPPhase[],
    };

    if (trades.includes('electrical')) {
        mepPhases.electrical = getMEPPhasesForQuote('electrical', hasDemolition, hasRerouting, hasDemolition);
    }
    if (trades.includes('plumbing')) {
        mepPhases.plumbing = getMEPPhasesForQuote('plumbing', hasDemolition, hasRerouting, hasDemolition);
    }

    // ============================================================
    // WALL FINISH & PRODUCTIVITY
    // ============================================================
    let wallFinishUpgrade: WallFinishTier | undefined;

    for (const area of areas) {
        if (area.isStaircase || area.isVoid) {
            wallFinishUpgrade = 'tier_3_level';

            const context: ProductivityContext = {
                isStaircase: area.isStaircase,
                isVoid: area.isVoid,
                hasScaffold: area.heightM > 3,
                accessType: area.isStaircase ? 'scaffold_staircase' : 'scaffold_standard',
                wallTier: 'tier_3_level',
            };

            const multiplier = getProductivityMultiplier(context);
            productivityMultipliers.push({ area: area.name, multiplier });
        }
    }

    // ============================================================
    // ACCESS
    // ============================================================
    let accessType: AccessType | undefined;
    // Filter out invalid height values
    const validHeights = areas.map(a => a.heightM).filter(h => typeof h === 'number' && !isNaN(h) && h > 0);
    const maxHeight = validHeights.length > 0 ? Math.max(...validHeights) : 0;

    if (maxHeight > 3) {
        const hasStaircase = areas.some(a => a.isStaircase);
        const decision = decideAccessMethod({
            workType: 'general',
            heightRequired: maxHeight,
            durationDays: durationWeeks * 5,
            isInterior: true,
            isStaircase: hasStaircase,
            isVoid: areas.some(a => a.isVoid),
            surfaceType: hasStaircase ? 'sloped' : 'flat',
            loadRequired: 'moderate',
            jurisdiction,
        });

        accessType = decision.recommendedType;
        estimatedAdditions += decision.estimatedCostRange.min;
    }

    return {
        protectionModules,
        complianceItems,
        accessType,
        mepPhases,
        wallFinishUpgrade,
        productivityMultipliers,
        mandatoryClauses,
        estimatedAdditions: Math.round(estimatedAdditions),
    };
}
