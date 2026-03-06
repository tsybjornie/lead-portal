/**
 * Commission & Claims Types
 * Designer earnings visibility and progress billing
 */

// ============================================================
// COMMISSION STRUCTURE
// ============================================================

export type CommissionType =
    | 'percentage_of_value'    // % of total project value
    | 'percentage_of_margin'   // % of margin (profit)
    | 'flat_fee'               // Fixed amount per project
    | 'tiered';                // Based on thresholds

export interface CommissionTier {
    minValue: number;
    maxValue: number;
    rate: number;              // Percentage or fixed based on parent type
}

export interface CommissionStructure {
    id: string;
    name: string;
    type: CommissionType;

    // For percentage types
    rate?: number;             // e.g., 0.05 = 5%

    // For tiered structures
    tiers?: CommissionTier[];

    // For flat fee
    flatAmount?: number;

    // Conditions
    minProjectValue?: number;  // Minimum project value to qualify
    applicableCategories?: string[];  // Only applies to certain trades

    // Jurisdiction-specific
    jurisdiction?: 'SG' | 'MY';
}

export interface DesignerCommission {
    id: string;
    designerId: string;
    designerName: string;
    quoteId: string;
    quoteNumber: string;

    // Calculation basis
    projectValue: number;
    projectMargin: number;
    commissionStructureId: string;

    // Earnings
    commissionAmount: number;

    // Status
    status: 'pending' | 'earned' | 'paid' | 'cancelled';

    // Tracking
    earnedAt?: string;         // When the project was accepted/completed
    paidAt?: string;

    // Breakdown (for transparency)
    breakdown: {
        category: string;
        value: number;
        margin: number;
        commissionEarned: number;
    }[];

    createdAt: string;
    updatedAt: string;
}

// ============================================================
// PROGRESS CLAIMS (Billing Milestones)
// ============================================================

export type ClaimStatus =
    | 'draft'
    | 'submitted'
    | 'approved'
    | 'invoiced'
    | 'paid'
    | 'disputed'
    | 'voided';

export interface ProgressClaim {
    id: string;
    quoteId: string;
    quoteNumber: string;
    claimNumber: string;       // PC-001, PC-002

    // Payment Term Reference
    paymentTermId: string;
    paymentTermStage: string;  // e.g., "Upon Confirmation"
    paymentPercentage: number; // e.g., 20

    // Amounts
    baseAmount: number;        // Based on percentage of quote
    adjustments: ClaimAdjustment[];
    totalAmount: number;

    // Variation Impact
    variationIds: string[];    // Variations included in this claim
    variationDelta: number;    // Additional amount from variations

    // Status
    status: ClaimStatus;

    // Workflow
    submittedAt?: string;
    submittedBy?: string;
    approvedAt?: string;
    approvedBy?: string;
    invoicedAt?: string;
    invoiceNumber?: string;
    paidAt?: string;
    paymentReference?: string;

    // Notes
    notes?: string;
    clientNotes?: string;

    createdAt: string;
    updatedAt: string;
}

export interface ClaimAdjustment {
    id: string;
    description: string;
    amount: number;            // Can be positive or negative
    type: 'retention' | 'deduction' | 'addition' | 'variation';
}

// ============================================================
// DESIGNER DASHBOARD DATA
// ============================================================

export interface DesignerQuoteSummary {
    quoteId: string;
    quoteNumber: string;
    clientName: string;
    projectName: string;
    status: string;

    // Financial
    totalValue: number;
    totalMargin: number;
    marginPercentage: number;

    // Commission
    commissionEarned: number;
    commissionStatus: 'pending' | 'earned' | 'paid';

    // Claims
    claims: {
        total: number;
        submitted: number;
        approved: number;
        paid: number;
    };
    claimProgress: number;     // 0-100%
    amountBilled: number;
    amountPaid: number;
    amountOutstanding: number;

    // Dates
    createdAt: string;
    acceptedAt?: string;
}

export interface DesignerDashboardStats {
    // Quote Stats
    totalQuotes: number;
    activeQuotes: number;
    completedQuotes: number;
    conversionRate: number;    // sent  accepted

    // Financial Stats
    totalProjectValue: number;
    totalMarginGenerated: number;
    averageMargin: number;

    // Commission Stats
    totalCommissionEarned: number;
    commissionPending: number;
    commissionPaid: number;

    // Claims Stats
    totalClaimed: number;
    totalPaid: number;
    totalOutstanding: number;

    // By Jurisdiction
    byJurisdiction: {
        SG: { value: number; margin: number; commission: number };
        MY: { value: number; margin: number; commission: number };
    };

    // Monthly Trend (last 6 months)
    monthlyTrend: {
        month: string;
        value: number;
        margin: number;
        commission: number;
    }[];
}

// ============================================================
// DEFAULT COMMISSION STRUCTURES
// ============================================================

export const DEFAULT_COMMISSION_STRUCTURES: CommissionStructure[] = [
    {
        id: 'standard-sg',
        name: 'Singapore Standard',
        type: 'percentage_of_margin',
        rate: 0.10,  // 10% of margin
        minProjectValue: 10000,
        jurisdiction: 'SG',
    },
    {
        id: 'standard-my',
        name: 'Malaysia Standard',
        type: 'percentage_of_margin',
        rate: 0.12,  // 12% of margin (higher due to lower base margins)
        minProjectValue: 5000,
        jurisdiction: 'MY',
    },
    {
        id: 'senior-designer',
        name: 'Senior Designer',
        type: 'tiered',
        tiers: [
            { minValue: 0, maxValue: 50000, rate: 0.08 },
            { minValue: 50001, maxValue: 100000, rate: 0.10 },
            { minValue: 100001, maxValue: Infinity, rate: 0.12 },
        ],
    },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function calculateCommission(
    structure: CommissionStructure,
    projectValue: number,
    projectMargin: number
): number {
    switch (structure.type) {
        case 'flat_fee':
            return structure.flatAmount ?? 0;

        case 'percentage_of_value':
            return projectValue * (structure.rate ?? 0);

        case 'percentage_of_margin':
            return projectMargin * (structure.rate ?? 0);

        case 'tiered':
            if (!structure.tiers) return 0;
            const tier = structure.tiers.find(
                t => projectValue >= t.minValue && projectValue <= t.maxValue
            );
            return tier ? projectMargin * tier.rate : 0;

        default:
            return 0;
    }
}

export function generateClaimNumber(existingCount: number): string {
    return `PC-${String(existingCount + 1).padStart(3, '0')}`;
}

export function calculateClaimAmount(
    quoteTotal: number,
    paymentPercentage: number,
    adjustments: ClaimAdjustment[]
): { baseAmount: number; adjustmentsTotal: number; totalAmount: number } {
    const baseAmount = (quoteTotal * paymentPercentage) / 100;
    const adjustmentsTotal = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
    return {
        baseAmount,
        adjustmentsTotal,
        totalAmount: baseAmount + adjustmentsTotal,
    };
}

export function getClaimProgress(claims: ProgressClaim[]): number {
    const paidPercentage = claims
        .filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + c.paymentPercentage, 0);
    return paidPercentage;
}
