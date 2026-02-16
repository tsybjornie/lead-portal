/**
 * Singapore Demolition Compliance Module
 * 
 * CRITICAL: Singapore demolition is regulated, even for "small" renovation works.
 * There is no casual hacking. This module encodes the legal requirements.
 * 
 * Regulators:
 * - BCA (Building and Construction Authority)
 * - HDB / URA / MCST (for residential strata)
 * - Town Council (for common areas)
 * - PE (Professional Engineer) for structural elements
 */

// ============================================================
// DEMOLITION PERMIT TYPES
// ============================================================

export type DemolitionScope =
    | 'non_structural'      // Interior hacking, no load-bearing
    | 'structural'          // Involves load-bearing elements
    | 'heavy';              // Full floor/building demo

export type PropertyType =
    | 'hdb'                 // HDB flat
    | 'condo'               // Private strata
    | 'landed'              // Landed property
    | 'commercial';         // Commercial/industrial

export interface DemolitionPermitRequirements {
    scope: DemolitionScope;
    propertyType: PropertyType;

    // Required permits/approvals
    requiresRenovationPermit: boolean;
    requiresBCAPermit: boolean;
    requiresPESubmission: boolean;
    requiresMCSTApproval: boolean;
    requiresHDBApproval: boolean;
    requiresTownCouncilApproval: boolean;

    // Documentation required
    requiredDocuments: string[];

    // Typical processing time (days)
    typicalProcessingDays: number;

    // Estimated permit costs
    estimatedPermitCost: {
        min: number;
        max: number;
    };
}

// ============================================================
// PERMIT REQUIREMENTS MATRIX
// ============================================================

export function getDemolitionPermitRequirements(
    scope: DemolitionScope,
    propertyType: PropertyType
): DemolitionPermitRequirements {
    const base: DemolitionPermitRequirements = {
        scope,
        propertyType,
        requiresRenovationPermit: true,
        requiresBCAPermit: scope === 'structural' || scope === 'heavy',
        requiresPESubmission: scope === 'structural' || scope === 'heavy',
        requiresMCSTApproval: propertyType === 'condo',
        requiresHDBApproval: propertyType === 'hdb',
        requiresTownCouncilApproval: propertyType === 'condo' || propertyType === 'hdb',
        requiredDocuments: [],
        typicalProcessingDays: 7,
        estimatedPermitCost: { min: 0, max: 0 },
    };

    // Non-structural interior works
    if (scope === 'non_structural') {
        base.requiredDocuments = [
            'Renovation permit application',
            'Approved hacking scope (marked floor plan)',
            'Work schedule',
            'Contractor insurance',
        ];
        base.typicalProcessingDays = propertyType === 'hdb' ? 3 : 5;
        base.estimatedPermitCost = { min: 200, max: 500 };
    }

    // Structural works
    if (scope === 'structural') {
        base.requiredDocuments = [
            'BCA demolition permit application',
            'PE submission (structural assessment)',
            'Method statement',
            'Safety plan',
            'Insurance & indemnity',
            'Approved hacking scope',
            'Contractor license verification',
        ];
        base.typicalProcessingDays = 14;
        base.estimatedPermitCost = { min: 2000, max: 8000 };
    }

    // Heavy demolition
    if (scope === 'heavy') {
        base.requiredDocuments = [
            'Full BCA demolition permit',
            'PE structural submission',
            'Detailed method statement',
            'Traffic management plan',
            'Dust & noise mitigation plan',
            'Environmental clearance',
            'Insurance & indemnity (enhanced)',
        ];
        base.typicalProcessingDays = 30;
        base.estimatedPermitCost = { min: 5000, max: 20000 };
    }

    // Property-specific additions
    if (propertyType === 'hdb') {
        base.requiredDocuments.push('HDB renovation application');
    }
    if (propertyType === 'condo') {
        base.requiredDocuments.push('MCST approval form');
        base.requiredDocuments.push('Deposit receipt');
    }

    return base;
}

// ============================================================
// LICENSED DISPOSAL REQUIREMENTS
// ============================================================

export interface DisposalRequirements {
    // All disposal must be via licensed facilities
    mustUseLicensedCollector: true;

    // Approved routes
    approvedFacilities: string[];

    // Tracking
    requiresDisposalReceipt: boolean;
    requiresWeighbridge: boolean;

    // Pricing model
    pricingBasis: 'per_ton' | 'per_load';

    // Typical costs
    typicalCostPerTon: {
        concrete: number;
        mixed: number;
        hazardous: number;
    };
}

export const SG_DISPOSAL_REQUIREMENTS: DisposalRequirements = {
    mustUseLicensedCollector: true,
    approvedFacilities: [
        'NEA-approved construction waste collectors',
        'Tuas disposal facilities',
        'Licensed recycling yards (concrete, metal)',
        'Semakau-linked transfer systems',
    ],
    requiresDisposalReceipt: true,
    requiresWeighbridge: true,
    pricingBasis: 'per_ton',
    typicalCostPerTon: {
        concrete: 80,      // SGD per ton
        mixed: 120,        // SGD per ton
        hazardous: 300,    // SGD per ton (asbestos, etc.)
    },
};

// ============================================================
// MANDATORY CONTRACT CLAUSES (SG)
// ============================================================

export const SG_DEMOLITION_CLAUSES = {
    disposalEstimate: {
        id: 'sg_demo_disposal_estimate',
        text: 'Disposal costs are based on estimated volume/tonnage. Actual tonnage will be determined by licensed weighbridge.',
        mandatory: true,
    },
    excessRubble: {
        id: 'sg_demo_excess_rubble',
        text: 'Excess debris beyond the estimated allowance is subject to variation at prevailing disposal rates.',
        mandatory: true,
    },
    licensedDisposal: {
        id: 'sg_demo_licensed_disposal',
        text: 'All demolition waste will be disposed of via NEA-licensed facilities only. Disposal receipts will be provided.',
        mandatory: true,
    },
    priorWorks: {
        id: 'sg_demo_prior_works',
        text: 'The Contractor accepts no responsibility for undocumented prior works or hidden conditions discovered during demolition.',
        mandatory: true,
    },
    workHours: {
        id: 'sg_demo_work_hours',
        text: 'Work hours and noise-generating activities are subject to authority approval and building management regulations.',
        mandatory: true,
    },
    structuralDiscovery: {
        id: 'sg_demo_structural',
        text: 'If structural elements are discovered during demolition, work will stop pending PE assessment. Additional PE fees apply.',
        mandatory: true,
    },
    permitDelay: {
        id: 'sg_demo_permit_delay',
        text: 'Delays in permit approval are not the responsibility of the Contractor. Timeline adjustments may apply.',
        mandatory: true,
    },
};

// ============================================================
// TONNAGE ESTIMATION HELPERS
// ============================================================

export interface TonnageEstimate {
    wallArea: number;       // sqft
    wallThickness: number;  // mm
    floorArea: number;      // sqft
    floorThickness: number; // mm
    estimatedTons: number;
    bufferTons: number;
    totalAllowance: number;
}

export function estimateDemolitionTonnage(
    wallAreaSqft: number,
    wallThicknessMm: number,
    floorAreaSqft: number,
    floorThicknessMm: number,
    bufferPercent: number = 0.15
): TonnageEstimate {
    // Convert sqft to sqm (1 sqft = 0.0929 sqm)
    const wallAreaSqm = wallAreaSqft * 0.0929;
    const floorAreaSqm = floorAreaSqft * 0.0929;

    // Convert mm to m
    const wallThicknessM = wallThicknessMm / 1000;
    const floorThicknessM = floorThicknessMm / 1000;

    // Volume in cubic meters
    const wallVolume = wallAreaSqm * wallThicknessM;
    const floorVolume = floorAreaSqm * floorThicknessM;

    // Concrete density ~2.4 tons per cubic meter
    const concreteDensity = 2.4;

    const wallTons = wallVolume * concreteDensity;
    const floorTons = floorVolume * concreteDensity;
    const estimatedTons = wallTons + floorTons;
    const bufferTons = estimatedTons * bufferPercent;
    const totalAllowance = estimatedTons + bufferTons;

    return {
        wallArea: wallAreaSqft,
        wallThickness: wallThicknessMm,
        floorArea: floorAreaSqft,
        floorThickness: floorThicknessMm,
        estimatedTons: Math.round(estimatedTons * 100) / 100,
        bufferTons: Math.round(bufferTons * 100) / 100,
        totalAllowance: Math.round(totalAllowance * 100) / 100,
    };
}

// ============================================================
// COST CALCULATION FOR SG DEMOLITION
// ============================================================

export interface SGDemolitionCostBreakdown {
    // Labour
    demolitionLabour: number;

    // Logistics
    cartAway: number;

    // Disposal
    disposalFees: number;
    disposalTonnageAllowance: number;

    // Compliance
    permitFees: number;
    peFees: number;           // 0 if non-structural
    adminCoordination: number;

    // Buffers
    complianceBuffer: number;
    hiddenConditionBuffer: number;

    // Totals
    totalCost: number;
    recommendedMargin: number;
    sellingPrice: number;
}

export function calculateSGDemolitionCost(params: {
    areaSqft: number;
    scope: DemolitionScope;
    propertyType: PropertyType;
    estimatedTonnage: number;
    labourRatePerSqft?: number;
    cartAwayRatePerTon?: number;
}): SGDemolitionCostBreakdown {
    const {
        areaSqft,
        scope,
        propertyType,
        estimatedTonnage,
        labourRatePerSqft = 8,      // SGD per sqft
        cartAwayRatePerTon = 50,    // SGD per ton
    } = params;

    // Labour cost
    const demolitionLabour = areaSqft * labourRatePerSqft;

    // Cart-away cost
    const cartAway = estimatedTonnage * cartAwayRatePerTon;

    // Disposal fees (licensed)
    const disposalFees = estimatedTonnage * SG_DISPOSAL_REQUIREMENTS.typicalCostPerTon.mixed;
    const disposalTonnageAllowance = estimatedTonnage;

    // Permit requirements
    const permitReqs = getDemolitionPermitRequirements(scope, propertyType);

    // Compliance costs
    const permitFees = (permitReqs.estimatedPermitCost.min + permitReqs.estimatedPermitCost.max) / 2;
    const peFees = scope === 'structural' || scope === 'heavy' ? 3000 : 0;
    const adminCoordination = 500; // Flat admin fee

    // Buffers
    const subtotal = demolitionLabour + cartAway + disposalFees + permitFees + peFees + adminCoordination;
    const complianceBuffer = subtotal * 0.10;
    const hiddenConditionBuffer = subtotal * 0.15;

    const totalCost = subtotal + complianceBuffer + hiddenConditionBuffer;
    const recommendedMargin = 0.50; // 50% margin for SG demolition
    const sellingPrice = totalCost / (1 - recommendedMargin);

    return {
        demolitionLabour,
        cartAway,
        disposalFees,
        disposalTonnageAllowance,
        permitFees,
        peFees,
        adminCoordination,
        complianceBuffer,
        hiddenConditionBuffer,
        totalCost: Math.round(totalCost * 100) / 100,
        recommendedMargin,
        sellingPrice: Math.round(sellingPrice * 100) / 100,
    };
}

// ============================================================
// VALIDATION: CHECK IF QUOTE IS COMPLIANT
// ============================================================

export interface DemolitionComplianceCheck {
    isCompliant: boolean;
    warnings: string[];
    errors: string[];
    missingClauses: string[];
}

export function validateSGDemolitionQuote(quote: {
    jurisdiction: string;
    hasDisposalLine: boolean;
    hasCartAwayLine: boolean;
    hasPermitLine: boolean;
    includedClauses: string[];
    marginPercent: number;
}): DemolitionComplianceCheck {
    const warnings: string[] = [];
    const errors: string[] = [];
    const missingClauses: string[] = [];

    if (quote.jurisdiction !== 'SG') {
        return { isCompliant: true, warnings: [], errors: [], missingClauses: [] };
    }

    // Check required line items
    if (!quote.hasDisposalLine) {
        errors.push('Missing licensed disposal fee line item');
    }
    if (!quote.hasCartAwayLine) {
        errors.push('Missing cart-away line item');
    }
    if (!quote.hasPermitLine) {
        warnings.push('Consider adding permit/admin fee line item');
    }

    // Check margin
    if (quote.marginPercent < 0.40) {
        errors.push(`Margin ${(quote.marginPercent * 100).toFixed(0)}% is below SG demolition floor of 40%`);
    } else if (quote.marginPercent < 0.50) {
        warnings.push(`Margin ${(quote.marginPercent * 100).toFixed(0)}% is below recommended 50% for SG demolition`);
    }

    // Check mandatory clauses
    const mandatoryClauses = Object.values(SG_DEMOLITION_CLAUSES)
        .filter(c => c.mandatory)
        .map(c => c.id);

    for (const clauseId of mandatoryClauses) {
        if (!quote.includedClauses.includes(clauseId)) {
            const clause = Object.values(SG_DEMOLITION_CLAUSES).find(c => c.id === clauseId);
            if (clause) {
                missingClauses.push(clauseId);
            }
        }
    }

    if (missingClauses.length > 0) {
        warnings.push(`Missing ${missingClauses.length} mandatory contract clauses`);
    }

    return {
        isCompliant: errors.length === 0,
        warnings,
        errors,
        missingClauses,
    };
}
