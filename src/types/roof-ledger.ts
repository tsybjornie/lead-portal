/**
 * Roof Ledger  Payment Tracking & Stripe Connect Sync
 * 
 * Architecture:
 *   Client pays  Stripe processes  Webhook fires  Roof Ledger records
 *   Milestone approved  Roof triggers payout  Stripe pays firm  Ledger updated
 * 
 * Stripe Connect: handles money (collection, holding, payout)
 * Roof Ledger: handles context (why, who, what milestone, commission)
 */

// ============================================================
// STRIPE CONNECT  FIRM ACCOUNTS
// ============================================================

export type ConnectedAccountStatus = 'pending' | 'active' | 'restricted' | 'disabled';

export interface ConnectedFirm {
    firmId: string;
    firmName: string;
    stripeAccountId: string;              // acct_xxx from Stripe Connect
    status: ConnectedAccountStatus;
    bankLinked: boolean;
    kycComplete: boolean;
    payoutsEnabled: boolean;
    defaultCurrency: 'SGD' | 'MYR';
    commissionRate: number;               // 0.01 = 1%, 0.02 = 2%
    totalPaidOut: number;
    totalCommissionEarned: number;
    connectedAt: string;
    lastPayoutAt?: string;
    uen?: string;                         // SG company registration
    bcaLicence?: string;                  // BCA licence number
}

// ============================================================
// LEDGER ENTRIES  Every money movement
// ============================================================

export type LedgerEntryType =
    | 'client_payment'        // Client pays deposit/milestone
    | 'firm_payout'           // Roof releases to firm
    | 'vendor_payout'         // ID firm pays Vendor via Roof
    | 'worker_payout'         // Vendor/ID pays Worker via Roof
    | 'commission_earned'     // Your 2% cut
    | 'refund_to_client'      // Dispute/cancellation refund
    | 'vo_payment'            // Variation order payment
    | 'mcst_deposit'          // Condo/commercial MCST deposit
    | 'mcst_refund'           // MCST deposit returned
    | 'penalty_deduction'     // Late/defect penalty
    | 'retention_release';    // Final retention payout

export type LedgerStatus = 'pending' | 'completed' | 'failed' | 'disputed' | 'refunded';

export interface LedgerEntry {
    id: string;                           // led_xxx
    projectId: string;
    firmId: string;
    clientId: string;
    milestoneId?: string;
    type: LedgerEntryType;
    status: LedgerStatus;

    // Tiered Metadata
    payoutTier?: 1 | 2 | 3;               // 1: Client->ID, 2: ID->Vendor, 3: Vendor->Worker
    parentEntryId?: string;               // Links sub-payouts to client payment
    isReserved?: boolean;                 // true if funds held for this specific sub-payout
    reservationUnlockedBy?: string;        // ID of IFC/Photo verification that unlocked this
    unlockedAt?: string;

    // Money
    grossAmount: number;                  // What client paid
    gst: number;                          // 9% GST
    commissionAmount: number;             // Your cut
    commissionGst: number;               // GST on your commission
    netToFirm: number;                   // What firm receives
    stripeFee: number;                   // Stripe's processing fee
    netToRoof: number;                    // Commission minus Stripe fee

    // Stripe references
    stripePaymentIntentId?: string;       // pi_xxx
    stripeTransferId?: string;            // tr_xxx
    stripePayoutId?: string;              // po_xxx
    stripeChargeId?: string;              // ch_xxx
    paymentMethod?: 'card' | 'paynow' | 'grabpay' | 'bank_transfer';

    // Context
    description: string;
    triggeredBy: string;                  // Who approved the payment
    qualityGateStatus?: 'passed' | 'waived' | 'pending';
    linkedDocuments: string[];            // Quote ID, contract ID, VO ID

    // Timestamps
    createdAt: string;
    processedAt?: string;
    paidOutAt?: string;
    disputedAt?: string;
    resolvedAt?: string;
}

// ============================================================
// PROJECT FINANCIAL SUMMARY  Aggregated view
// ============================================================

export interface ProjectFinancials {
    projectId: string;
    projectAddress: string;
    clientId: string;
    clientName: string;
    firmId: string;
    firmName: string;
    designerId: string;
    designerName: string;

    // Contract
    contractValue: number;
    contractGst: number;
    totalWithGst: number;
    approvedVOs: number;                  // Total VO value
    revisedContractValue: number;         // Original + VOs

    // Payment status
    totalPaidByClient: number;
    totalReleasedToFirm: number;
    totalHeldInEscrow: number;            // Paid but not released
    totalReservedForVendors: number;      // Funds earmarked for vendors/workers
    totalVendorPayouts: number;           // Actual paid out to vendors
    totalWorkerPayouts: number;           // Actual paid out to workers
    totalCommissionEarned: number;
    retentionHeld: number;
    retentionPercentage: number;

    // Milestones
    milestonesTotal: number;
    milestonesPaid: number;
    milestonesDue: number;
    nextMilestone?: {
        name: string;
        amount: number;
        trigger: string;
    };

    // Dates
    contractSignedAt: string;
    firstPaymentAt: string;
    lastPaymentAt?: string;
    estimatedCompletionAt: string;
    handoverAt?: string;
}

// ============================================================
// PLATFORM DASHBOARD  What YOU see as Roof operator
// ============================================================

export interface PlatformMetrics {
    period: 'today' | 'week' | 'month' | 'quarter' | 'year';

    // Volume
    gmv: number;                          // Gross Merchandise Value (total client payments)
    totalTransactions: number;
    averageProjectValue: number;

    // Revenue
    totalCommission: number;              // Your cut
    totalStripeFees: number;              // Cost of processing
    netRevenue: number;                   // Commission - Stripe fees
    commissionRate: number;               // Effective rate

    // Cash flow
    escrowBalance: number;                // Currently held
    pendingPayouts: number;               // Approved but not yet sent
    pendingApprovals: number;             // Milestones awaiting client sign-off

    // Health
    activeProjects: number;
    activeFirms: number;
    activeClients: number;
    disputeRate: number;                  // % of milestones disputed
    averageApprovalTime: number;          // Hours to approve milestone
    onTimeRate: number;                   // % of projects on schedule
}

// ============================================================
// STRIPE WEBHOOK EVENTS  What triggers ledger updates
// ============================================================

export type WebhookEventType =
    | 'payment_intent.succeeded'
    | 'payment_intent.payment_failed'
    | 'charge.refunded'
    | 'transfer.created'
    | 'payout.paid'
    | 'payout.failed'
    | 'account.updated';                  // Firm account status change

export interface WebhookLog {
    id: string;
    stripeEventId: string;               // evt_xxx
    eventType: WebhookEventType;
    firmId?: string;
    projectId?: string;
    ledgerEntryId?: string;              // Linked ledger entry created
    payload: Record<string, unknown>;
    processedAt: string;
    status: 'processed' | 'failed' | 'ignored';
    error?: string;
}

// ============================================================
// VARIATION ORDER TRACKING
// ============================================================

export type VOStatus = 'draft' | 'submitted' | 'client_reviewing' | 'approved' | 'rejected' | 'paid';

export interface VariationOrder {
    id: string;                          // vo_xxx
    projectId: string;
    firmId: string;
    clientId: string;
    submittedBy: string;                 // Designer who submitted

    title: string;
    description: string;
    reason: 'client_request' | 'site_condition' | 'design_change' | 'material_change' | 'regulatory';

    // Financials
    originalQuotedItem?: string;         // What was in original quote
    additionalCost: number;
    gst: number;
    totalWithGst: number;

    // Approval
    status: VOStatus;
    clientApprovalAt?: string;
    clientSignature?: string;
    supportingPhotos: string[];

    // Payment
    ledgerEntryId?: string;
    paidAt?: string;

    createdAt: string;
    updatedAt: string;
}

// ============================================================
// HELPERS  Ledger calculations
// ============================================================

const GST_RATE = 0.09;

export function calculateLedgerEntry(
    grossAmount: number,
    commissionRate: number,
    paymentMethod: LedgerEntry['paymentMethod'] = 'paynow',
): Pick<LedgerEntry, 'grossAmount' | 'gst' | 'commissionAmount' | 'commissionGst' | 'netToFirm' | 'stripeFee' | 'netToRoof'> {
    const gst = Math.round(grossAmount * GST_RATE);
    const commissionAmount = Math.round(grossAmount * commissionRate);
    const commissionGst = Math.round(commissionAmount * GST_RATE);

    // Stripe fee rates (SG)
    const stripeFeeRates: Record<string, { percent: number; fixed: number }> = {
        card: { percent: 0.034, fixed: 0.50 },
        paynow: { percent: 0.004, fixed: 0 },
        grabpay: { percent: 0.034, fixed: 0.50 },
        bank_transfer: { percent: 0.004, fixed: 0 },
    };

    const rate = stripeFeeRates[paymentMethod || 'paynow'];
    const stripeFee = Math.round((grossAmount * rate.percent + rate.fixed) * 100) / 100;
    const netToFirm = grossAmount - commissionAmount;
    const netToRoof = commissionAmount - stripeFee;

    return { grossAmount, gst, commissionAmount, commissionGst, netToFirm, stripeFee, netToRoof };
}

export function createLedgerEntry(
    projectId: string,
    firmId: string,
    clientId: string,
    type: LedgerEntryType,
    amount: number,
    commissionRate: number,
    options: {
        milestoneId?: string;
        paymentMethod?: LedgerEntry['paymentMethod'];
        description?: string;
        triggeredBy?: string;
        stripePaymentIntentId?: string;
    } = {},
): LedgerEntry {
    const calc = calculateLedgerEntry(amount, commissionRate, options.paymentMethod);
    return {
        id: `led_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        projectId,
        firmId,
        clientId,
        milestoneId: options.milestoneId,
        type,
        status: 'pending',
        ...calc,
        stripePaymentIntentId: options.stripePaymentIntentId,
        paymentMethod: options.paymentMethod || 'paynow',
        description: options.description || '',
        triggeredBy: options.triggeredBy || 'system',
        linkedDocuments: [],
        createdAt: new Date().toISOString(),
    };
}

/** Calculate project financial summary from ledger entries */
export function getProjectFinancials(
    entries: LedgerEntry[],
    contractValue: number,
    vos: VariationOrder[],
): Pick<ProjectFinancials, 'totalPaidByClient' | 'totalReleasedToFirm' | 'totalHeldInEscrow' | 'totalCommissionEarned' | 'approvedVOs' | 'revisedContractValue'> {
    const payments = entries.filter(e => e.type === 'client_payment' && e.status === 'completed');
    const payouts = entries.filter(e => e.type === 'firm_payout' && e.status === 'completed');

    const totalPaidByClient = payments.reduce((s, e) => s + e.grossAmount, 0);
    const totalReleasedToFirm = payouts.reduce((s, e) => s + e.netToFirm, 0);
    const totalHeldInEscrow = totalPaidByClient - totalReleasedToFirm;
    const totalCommissionEarned = payments.reduce((s, e) => s + e.commissionAmount, 0);
    const approvedVOs = vos.filter(v => v.status === 'approved' || v.status === 'paid').reduce((s, v) => s + v.additionalCost, 0);
    const revisedContractValue = contractValue + approvedVOs;

    return { totalPaidByClient, totalReleasedToFirm, totalHeldInEscrow, totalCommissionEarned, approvedVOs, revisedContractValue };
}

// ============================================================
// VENDOR / SUBCON PAYMENT LAYER  Firm  Vendor via Roof
// ============================================================

export type VendorCategory =
    | 'material_supplier'      // Timber, tiles, stone, hardware
    | 'subcontractor'          // Electrician, plumber, painter
    | 'furniture_supplier'     // Sofa, dining, beds
    | 'lighting_supplier'      // Lights, fixtures
    | 'appliance_supplier'     // Aircon, kitchen appliances
    | 'glass_metal'            // Glass, aluminium, steel
    | 'soft_furnishing'        // Curtains, blinds, upholstery
    | 'overseas_supplier';     // JB/China sourcing

export interface ConnectedVendor {
    vendorId: string;
    vendorName: string;
    stripeAccountId: string;              // Vendor's Stripe Connect account
    category: VendorCategory;
    status: ConnectedAccountStatus;
    country: 'SG' | 'MY' | 'CN' | 'TW' | 'TH';
    vendorFeeRate: number;                // 0.01 = 1% (charged to vendor)
    totalPaidOut: number;
    totalFeeEarned: number;
    connectedAt: string;
    uen?: string;                         // SG business registration
    ssm?: string;                         // MY business registration
    bankLinked: boolean;
    payoutsEnabled: boolean;
}

export type PurchaseOrderStatus = 'draft' | 'submitted' | 'vendor_confirmed' | 'mobilized' | 'delivered' | 'inspected' | 'paid' | 'disputed' | 'rescinded';

export interface PurchaseOrder {
    id: string;                           // po_xxx
    projectId: string;
    firmId: string;
    vendorId: string;
    milestoneId?: string;                 // Which milestone this PO belongs to
    isRescueMission?: boolean;            // Triggers 3x Karma and Instant Payout
    rescueIncentiveAmount?: number;       // Bonus drawn from previous vendor's forfeiture
    rescueBounty?: number;                // Direct ID margin top-up
    isFeeWaived?: boolean;                // Roof waives commission (e.g. 2%)
    inventoryAuditId?: string;            // Link to the "Ground Zero" snapshot
    materialsLeftBehind?: string[];       // e.g. ["5kg Glue", "20m Laminate"]

    // Items
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        category: VendorCategory;
    }[];

    // Financials
    subtotal: number;
    gst: number;
    totalAmount: number;
    vendorFee: number;                    // 1% charged to vendor
    netToVendor: number;                  // Total - vendor fee

    // Status
    status: PurchaseOrderStatus;
    orderedBy: string;                    // Designer who ordered
    deliveryAddress: string;
    expectedDeliveryDate: string;
    actualDeliveryDate?: string;
    deliveryConfirmedBy?: string;         // Site supervisor / designer
    deliveryPhotos: string[];
    mobilizationPhotos?: string[];        // Photo of tools/materials on site
    mobilizationVerifiedAt?: string;

    // Payment & Reservation
    payoutSchedule: {
        prepFee: number;                  // 10% on signature
        mobilizationDeposit: number;     // 40% on verified photo
        completionBalance: number;       // 50% on inspection
    };
    ledgerEntryId?: string;
    paidAt?: string;
    isFunded?: boolean;                   // true if client has paid the milestone this PO belongs to
    fundingReservedAt?: string;

    createdAt: string;
    updatedAt: string;
}

// ============================================================
// DUAL COMMISSION MODEL  Revenue from both sides
// ============================================================

export interface DualCommission {
    projectId: string;

    // Layer 1: Client  Firm (2%)
    clientPayment: number;
    firmCommissionRate: number;            // 0.02 = 2%
    firmCommissionAmount: number;

    // Layer 2: Firm  Vendor (1%)
    vendorPayments: number;               // Total paid to vendors
    vendorFeeRate: number;                // 0.01 = 1%
    vendorFeeAmount: number;

    // Combined
    totalRoofRevenue: number;             // Layer 1 + Layer 2
    effectiveRate: number;                // Total revenue / client payment
    stripeFees: number;
    netRevenue: number;
}

export function calculateDualCommission(
    clientPayment: number,
    vendorPayments: number,
    firmCommissionRate: number = 0.02,
    vendorFeeRate: number = 0.01,
): DualCommission {
    const firmCommissionAmount = Math.round(clientPayment * firmCommissionRate);
    const vendorFeeAmount = Math.round(vendorPayments * vendorFeeRate);
    const totalRoofRevenue = firmCommissionAmount + vendorFeeAmount;
    // Estimate Stripe fees (PayNow assumed)
    const stripeFees = Math.round((clientPayment + vendorPayments) * 0.004);
    const netRevenue = totalRoofRevenue - stripeFees;
    const effectiveRate = clientPayment > 0 ? totalRoofRevenue / clientPayment : 0;

    return {
        projectId: '',
        clientPayment,
        firmCommissionRate,
        firmCommissionAmount,
        vendorPayments,
        vendorFeeRate,
        vendorFeeAmount,
        totalRoofRevenue,
        effectiveRate,
        stripeFees,
        netRevenue,
    };
}

/** Calculate platform-wide metrics from all ledger entries */
export function getPlatformMetrics(
    entries: LedgerEntry[],
    period: PlatformMetrics['period'] = 'month',
): Pick<PlatformMetrics, 'gmv' | 'totalTransactions' | 'totalCommission' | 'totalStripeFees' | 'netRevenue'> {
    const now = new Date();
    const periodMs: Record<string, number> = {
        today: 86400000,
        week: 604800000,
        month: 2592000000,
        quarter: 7776000000,
        year: 31536000000,
    };

    const cutoff = new Date(now.getTime() - (periodMs[period] || periodMs.month));
    const filtered = entries.filter(e =>
        e.type === 'client_payment' &&
        e.status === 'completed' &&
        new Date(e.createdAt) >= cutoff
    );

    return {
        gmv: filtered.reduce((s, e) => s + e.grossAmount, 0),
        totalTransactions: filtered.length,
        totalCommission: filtered.reduce((s, e) => s + e.commissionAmount, 0),
        totalStripeFees: filtered.reduce((s, e) => s + e.stripeFee, 0),
        netRevenue: filtered.reduce((s, e) => s + e.netToRoof, 0),
    };
}
