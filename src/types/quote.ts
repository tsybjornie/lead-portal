/**
 * Quote Lifecycle Types
 * The backbone for variations, kill-switches, and margin protection
 */

// ============================================================
// QUOTE STATUS - STATE MACHINE
// ============================================================

export type QuoteStatus =
    | 'draft'              // Being built by designer
    | 'pending_review'     // Awaiting admin approval (margin check)
    | 'sent'               // Sent to client
    | 'accepted'           // Client signed/accepted
    | 'in_progress'        // Work has started
    | 'variation_pending'  // Has unapproved variations
    | 'completed'          // Project finished
    | 'cancelled'          // Quote killed
    | 'expired';           // Past validity date

// Client Risk Taxonomy (The "Karen" Markers)
export type RiskTrait =
    | 'serial_scope_creep'       // Constantly asks for "small changes" for free
    | 'payment_friction'           // Delays progress claims consistently
    | 'communication_aggression'   // Abusive or 24/7 harassment
    | 'undefined_expectations'    // Refuses to sign off on mocks/samples
    | 'site_access_blocker'       // Repeatedly denies access to workers
    | 'retail_price_shopper';    // Tries to poach workers at retail rates

// Valid state transitions
export const QUOTE_TRANSITIONS: Record<QuoteStatus, QuoteStatus[]> = {
    draft: ['pending_review', 'cancelled'],
    pending_review: ['draft', 'sent', 'cancelled'],  // Can go back to draft if rejected
    sent: ['accepted', 'expired', 'cancelled'],
    accepted: ['in_progress', 'cancelled'],
    in_progress: ['variation_pending', 'completed', 'cancelled'],
    variation_pending: ['in_progress', 'cancelled'],  // Returns to in_progress after approval
    completed: [],  // Terminal state
    cancelled: [],  // Terminal state
    expired: ['draft'],  // Can be revised into new draft
};

// ============================================================
// QUOTE LINE ITEM
// ============================================================

export type LineItemStatus = 'active' | 'removed' | 'modified';

export interface QuoteLineItem {
    id: string;                          // Unique identifier
    lineNumber: number;                  // Display order (1, 2, 3...)

    // Item Reference
    itemId: string;                      // Links to CostItem
    itemName: string;                    // Snapshot of name at time of quote
    category: string;                    // Snapshot of category
    description?: string;                // Additional description

    // Quantities & Pricing
    quantity: number;
    unit: string;                        // sqft, unit, lm, etc.
    unitCost: number;                    // Our cost
    unitPrice: number;                   // Client price
    totalCost: number;                   // quantity × unitCost
    totalPrice: number;                  // quantity × unitPrice
    margin: number;                      // (price - cost) / price

    // Variation Tracking
    status: LineItemStatus;
    originalLineItemId?: string;         // If this is a variation, links to original
    variationId?: string;                // Which variation order modified this

    // IFC (Issued For Coordination) & Accountability
    assignedToTeamMember?: string;       // User ID of the person responsible for this line
    ifcStatus?: 'IFC_OPEN' | 'IFC_RESOLVED' | 'IFC_STALLED';
    ifcDueDate?: string;                 // ISO date
    lastActionAt?: string;               // Tracks "freeloaders" (time since last update)
    responseDebtHours?: number;          // Calculated: now - lastActionAt

    // Technical Resume & End Result (Verified Portfolio)
    methodologyUsed?: string;            // e.g., "Laser alignment", "Manual winging"
    toolingVerified?: string[];          // e.g., ["Laser Level", "Wet Saw"]
    technicalAnomalies?: string[];        // e.g., ["Perfect mitre", "Uneven jointing"]
    endResultVerified?: boolean;         // Has the FINAL outcome been signed off?
    endResultPhotos?: string[];          // Specifically final "Hero" shots
    isTechnicalMasterpiece?: boolean;     // Flag for high-end portfolio highlight
    reviewerNotes?: string;
    verifiedAt?: string;

    // Masked Identity (Privacy)
    publicAlias?: string;                // e.g., "Master Carpenter #42" for client view

    // 360 Mutual Accountability
    idToWorkerReview?: {
        techAdherenceRating: number;      // Was the methodology followed?
        toolingRating: number;            // Were the right tools used?
        comment?: string;
    };
    workerToIdReview?: {
        specClarityRating: number;        // Were drawings/instructions clear?
        siteReadinessRating: number;      // Was site ready for work?
        comment?: string;
    };
    proToClientReview?: {
        paymentPromptnessRating: number;  // Did client pay on time?
        requirementClarityRating: number; // Did client keep changing mind?
        respectSafetyRating: number;      // Site conduct
        comment?: string;
    };

    // Metadata
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// QUOTE ENTITY
// ============================================================

export interface Quote {
    id: string;                          // Unique identifier (UUID)
    quoteNumber: string;                 // Human-readable (QT-2024-001)
    revision: number;                    // Version number (R1, R2, R3...)

    // Status
    status: QuoteStatus;

    // Client & Project
    clientId: string;
    clientName: string;                  // Snapshot
    projectName: string;
    projectAddress: string;

    // Jurisdiction & Currency
    jurisdiction: 'SG' | 'MY';
    currency: 'SGD' | 'MYR';

    // Financial Summary
    totalCost: number;
    totalPrice: number;
    totalMargin: number;                 // As percentage

    // Line Items
    lineItems: QuoteLineItem[];

    // Adjustments (Site surcharges, defects allowance, etc.)
    adjustments: QuoteAdjustment[];

    // Variations (linked, not embedded)
    variationIds: string[];

    // Validity
    validUntil: string;                  // ISO date
    escalationClause?: string;           // If prices change after validity

    // Ownership
    createdBy: string;                   // Designer ID
    assignedTo?: string;                 // Account manager
    approvedBy?: string;                 // Admin who approved

    // Risk Governance
    riskTraits?: RiskTrait[];            // Internal-only markers for pros
    systemGuardrailsActive?: string[];    // e.g., ["MANDATORY_ESCROW", "SIGNATURE_REQUIRED_FOR_ALL"]

    // Internal Karma (Build it Back)
    internalKarmaScore?: number;           // 0-1000 (Internal Only)
    riskRecoveryProgress?: number;        // Count of successful projects since last flag

    // Client Engagement Signals (The "Mating Phase" Tracker)
    clientEngagement?: {
        firstViewedAt?: string;           // When client first opened the quote
        lastViewedAt?: string;            // Most recent view
        totalViewCount?: number;          // How many times they've opened it
        timeSpentSeconds?: number;        // Total time spent reviewing
        sectionHeatmap?: Record<string, number>; // Section -> seconds spent
        shortlistPosition?: number;       // null = not shortlisted, 1-3 = position
        shortlistTotal?: number;          // How many IDs the client is comparing
        commitmentLevel?: 'just_looking' | 'engaged' | 'shortlisted' | 'deciding' | 'committed';
        budgetDeclared?: boolean;         // Did client reveal their budget range?
        siteVisitBooked?: boolean;        // Did they book a physical site visit?
        expiresAt?: string;               // Auto-expire date (7 days from send)
    };

    // Timestamps
    createdAt: string;
    updatedAt: string;
    sentAt?: string;
    acceptedAt?: string;
    completedAt?: string;
}

// ============================================================
// ADJUSTMENTS (Site surcharges, allowances, etc.)
// ============================================================

export type AdjustmentType =
    | 'site_access'        // High floor, restricted hours, etc.
    | 'defects_allowance'  // Warranty/callback buffer
    | 'delay_charge'       // Client-induced delay
    | 'demob_remob'        // Stop-start penalty
    | 'mock_up'            // Prototype/sample costs
    | 'financing'          // Payment risk buffer
    | 'discount'           // Approved discount
    | 'custom';            // Other

export interface QuoteAdjustment {
    id: string;
    type: AdjustmentType;
    name: string;
    description?: string;

    // Value
    isPercentage: boolean;               // true = % of subtotal, false = fixed
    value: number;                       // The percentage or fixed amount
    calculatedAmount: number;            // Actual $ impact

    // Control
    isVisible: boolean;                  // Show on client quote?
    requiresApproval: boolean;           // Needs admin sign-off?
    approvedBy?: string;

    // Metadata
    notes?: string;
    createdAt: string;
}

// ============================================================
// VARIATION ORDER
// ============================================================

export type VariationStatus =
    | 'draft'
    | 'pending_client'     // Sent to client for approval
    | 'pending_internal'   // Awaiting admin approval (if below margin)
    | 'approved'
    | 'rejected';

export interface Variation {
    id: string;
    variationNumber: string;             // VO-001, VO-002
    quoteId: string;                     // Parent quote

    // Status
    status: VariationStatus;

    // What Changed
    reason: string;                      // Why this variation exists
    requestedBy: string;                 // Client or internal

    // Line Items (the changes)
    addedItems: QuoteLineItem[];
    modifiedItems: QuoteLineItem[];      // These link to original via originalLineItemId
    removedItemIds: string[];            // IDs of removed items

    // Financial Impact
    previousTotal: number;
    newTotal: number;
    deltaAmount: number;                 // + or - change
    deltaMargin: number;                 // Impact on margin %

    // Approval Chain
    clientApprovedAt?: string;
    clientApprovedBy?: string;
    internalApprovedAt?: string;
    internalApprovedBy?: string;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// AUDIT LOG
// ============================================================

export type AuditAction =
    | 'quote_created'
    | 'quote_updated'
    | 'quote_sent'
    | 'quote_accepted'
    | 'quote_rejected'
    | 'quote_expired'
    | 'quote_cancelled'
    | 'variation_created'
    | 'variation_approved'
    | 'variation_rejected'
    | 'margin_override'        // Someone forced below-floor margin
    | 'discount_applied'
    | 'item_added'
    | 'item_removed'
    | 'item_modified';

export interface AuditEntry {
    id: string;
    timestamp: string;

    // What
    action: AuditAction;
    quoteId: string;
    variationId?: string;
    lineItemId?: string;

    // Who
    actorId: string;
    actorName: string;
    actorRole: 'designer' | 'admin' | 'system';

    // Details
    description: string;
    previousValue?: string;              // JSON stringified
    newValue?: string;                   // JSON stringified

    // Privacy
    publicAlias?: string;                // Masked actor name for client audit logs

    // Cross-Role Accountability
    mutualRatingImpact?: {
        targetUserId: string;
        targetUserRole: string;
        coordinationScore?: number;       // For Designers
        technicalityScore?: number;       // For Workers/Vendors
        clientHealthScore?: number;       // For Clients
    };

    // Risk Flags
    isMarginViolation: boolean;          // Did this break margin floor?
    requiresReview: boolean;             // Should admin see this?
}

// ============================================================
// KILL-SWITCH RULES
// ============================================================

export interface MarginRule {
    id: string;
    name: string;

    // Scope
    jurisdiction?: 'SG' | 'MY';          // null = applies to all
    category?: string;                   // null = applies to all categories

    // Thresholds
    marginFloor: number;                 // Minimum margin % (e.g., 0.25 = 25%)
    marginWarning: number;               // Warning threshold (e.g., 0.30 = 30%)

    // Behavior
    allowOverride: boolean;              // Can designer override with approval?
    requiresAdminApproval: boolean;      // If overridden, needs admin sign-off

    // Message
    warningMessage: string;
    blockMessage: string;
}

export const DEFAULT_MARGIN_RULES: MarginRule[] = [
    {
        id: 'sg-default',
        name: 'Singapore Default',
        jurisdiction: 'SG',
        marginFloor: 0.25,
        marginWarning: 0.30,
        allowOverride: true,
        requiresAdminApproval: true,
        warningMessage: 'Margin is below 30%. Consider adjusting pricing.',
        blockMessage: 'Cannot proceed: Margin below 25% floor. Requires admin override.',
    },
    {
        id: 'my-default',
        name: 'Malaysia Default',
        jurisdiction: 'MY',
        marginFloor: 0.20,
        marginWarning: 0.25,
        allowOverride: true,
        requiresAdminApproval: true,
        warningMessage: 'Margin is below 25%. Consider adjusting pricing.',
        blockMessage: 'Cannot proceed: Margin below 20% floor. Requires admin override.',
    },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function canTransition(from: QuoteStatus, to: QuoteStatus): boolean {
    return QUOTE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isTerminalStatus(status: QuoteStatus): boolean {
    return status === 'completed' || status === 'cancelled';
}

export function calculateQuoteTotals(lineItems: QuoteLineItem[], adjustments: QuoteAdjustment[]): {
    totalCost: number;
    totalPrice: number;
    totalMargin: number;
    adjustmentTotal: number;
} {
    const itemCost = lineItems.filter(i => i.status === 'active').reduce((sum, i) => sum + i.totalCost, 0);
    const itemPrice = lineItems.filter(i => i.status === 'active').reduce((sum, i) => sum + i.totalPrice, 0);

    const adjustmentTotal = adjustments.reduce((sum, a) => sum + a.calculatedAmount, 0);

    const totalCost = itemCost;
    const totalPrice = itemPrice + adjustmentTotal;
    const totalMargin = totalPrice > 0 ? (totalPrice - totalCost) / totalPrice : 0;

    return { totalCost, totalPrice, totalMargin, adjustmentTotal };
}

export function generateQuoteNumber(jurisdiction: 'SG' | 'MY'): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `QT-${jurisdiction}-${year}-${random}`;
}

export function generateVariationNumber(existingCount: number): string {
    return `VO-${String(existingCount + 1).padStart(3, '0')}`;
}

// ============================================================
// UNIVERSAL QUOTE LINE (NEW - For Redesigned QuoteBuilder)
// Supports both Cabinetry (Linear) and Area-Based Quotes
// ============================================================

// Measurement Units (Internal storage is always in mm/sqmm/cumm)
export type MeasurementUnit =
    | 'Unit'           // Per piece (handles, hinges)
    | 'LinearMm'       // For cabinetry (stored as mm, displayed as ft/m)
    | 'AreaSqMm'       // For tiling (stored as sqmm, displayed as sqft/sqm)
    | 'VolumeCuMm'     // For concrete (stored as cumm)
    | 'LumpSum';       // Fixed price items

// Display system for unit conversion
export type DisplaySystem = 'imperial' | 'metric';

// User-friendly INPUT units (what the user types in)
export type LinearInputUnit = 'mm' | 'cm' | 'm' | 'ft';
export type AreaInputUnit = 'sqmm' | 'sqcm' | 'sqm' | 'sqft';
export type VolumeInputUnit = 'cumm' | 'cucm' | 'cum' | 'cuft';

// Conversion factors TO mm (base unit)
export const LINEAR_TO_MM: Record<LinearInputUnit, number> = {
    'mm': 1,
    'cm': 10,
    'm': 1000,
    'ft': 304.8
};

// Conversion factors TO sqmm (base unit)
export const AREA_TO_SQMM: Record<AreaInputUnit, number> = {
    'sqmm': 1,
    'sqcm': 100,
    'sqm': 1000000,
    'sqft': 92903.04
};

// Conversion factors TO cumm (base unit)
export const VOLUME_TO_CUMM: Record<VolumeInputUnit, number> = {
    'cumm': 1,
    'cucm': 1000,
    'cum': 1000000000,
    'cuft': 28316846.6
};

// Universal Quote Line - The core building block for redesigned QuoteBuilder
export interface UniversalQuoteLine {
    id: string;
    lineNumber: number;

    // === USER INPUTS (Saved by User) ===
    // 3-tier hierarchy: Category  Sub-Category  Task Description
    mainCategory: string;       // Work type: "Demolition", "Masonry", "Carpentry", "Electrical"
    subCategory: string;        // Location: "Master Bedroom", "Kitchen", "Living Room"
    taskDescription: string;    // Specific work: "Remove wardrobe", "Build wardrobe"

    // === PRICING CORE ===
    internalCostRate: number;   // Cost per unit/measurement (internal, not shown to client)
    sellingRate: number;        // Rate shown to client (after margin applied)
    measurementUnit: MeasurementUnit;
    quantity: number;           // In the base unit (mm, sqmm, etc.)
    displayQuantity: number;    // Human-friendly (ft, sqft, etc.)

    // === DERIVED ===
    lineTotal: number;          // displayQuantity * sellingRate
    lineCost: number;           // displayQuantity * internalCostRate
    margin: number;             // (lineTotal - lineCost) / lineTotal

    // === SOURCING ===
    vendorId?: string;
    vendorName?: string;

    // === INTERNAL NOTES ===
    internalRemarks?: string;   // Not shown on client quote

    // === IFC & ACCOUNTABILITY ===
    assignedToTeamMember?: string;
    ifcStatus?: 'IFC_OPEN' | 'IFC_RESOLVED' | 'IFC_STALLED';
    lastActionAt?: string;

    // === LINE TYPE ===
    type: 'ITEM' | 'HEADING' | 'REMARK';
}

// Category presets for auto-detection
export const CATEGORY_MEASUREMENT_DEFAULTS: Record<string, MeasurementUnit> = {
    // Cabinetry (Linear)
    'carpentry': 'LinearMm',
    'cabinets': 'LinearMm',
    'upper_cabinets': 'LinearMm',
    'lower_cabinets': 'LinearMm',
    'wardrobe': 'LinearMm',
    'kitchen': 'LinearMm',

    // Area-Based
    'tiling': 'AreaSqMm',
    'flooring': 'AreaSqMm',
    'wetworks': 'AreaSqMm',
    'painting': 'AreaSqMm',
    'plaster': 'AreaSqMm',
    'wallpaper': 'AreaSqMm',

    // Volume-Based
    'concrete': 'VolumeCuMm',
    'screed': 'VolumeCuMm',

    // Unit-Based (Default)
    'electrical': 'Unit',
    'plumbing': 'Unit',
    'fixtures': 'Unit',
    'hardware': 'Unit',
};

// Main categories (work type)
export const MAIN_CATEGORIES = [
    'Demolition',
    'Masonry',
    'Carpentry',
    'Electrical',
    'Plumbing',
    'Painting',
    'Tiling',
    'Flooring',
    'Ceiling',
    'Glass & Mirrors',
    'Doors & Windows',
    'Air-Con',
    'Appliances',
    'Furniture',
    'Cleaning',
    'Miscellaneous'
] as const;

// Sub-categories (locations)
export const LOCATION_PRESETS = [
    'Master Bedroom',
    'Bedroom 2',
    'Bedroom 3',
    'Living Room',
    'Kitchen',
    'Dry Kitchen',
    'Wet Kitchen',
    'Master Bathroom',
    'Common Bathroom',
    'Guest Bathroom',
    'Dining Area',
    'Study Room',
    'Balcony',
    'Yard / Service Area',
    'Bomb Shelter',
    'Storeroom',
    'Entrance / Foyer',
    'Corridor',
    'Whole Unit'
] as const;

/**
 * Detect the best measurement unit based on category name
 */
export function detectMeasurementUnit(category: string): MeasurementUnit {
    const normalized = category.toLowerCase().replace(/[\s-]/g, '_');

    // Check for exact match first
    if (CATEGORY_MEASUREMENT_DEFAULTS[normalized]) {
        return CATEGORY_MEASUREMENT_DEFAULTS[normalized];
    }

    // Check for partial matches
    for (const [key, unit] of Object.entries(CATEGORY_MEASUREMENT_DEFAULTS)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return unit;
        }
    }

    // Default to Unit
    return 'Unit';
}

/**
 * Get display label for measurement unit
 */
export function getMeasurementLabel(unit: MeasurementUnit, system: DisplaySystem = 'imperial'): string {
    switch (unit) {
        case 'LinearMm':
            return system === 'imperial' ? 'per ft' : 'per m';
        case 'AreaSqMm':
            return system === 'imperial' ? 'per sqft' : 'per sqm';
        case 'VolumeCuMm':
            return system === 'imperial' ? 'per cuft' : 'per cum';
        case 'LumpSum':
            return 'lump sum';
        case 'Unit':
        default:
            return 'per unit';
    }
}

/**
 * Format quantity with unit for display
 */
export function formatQuantityWithUnit(
    quantity: number,
    unit: MeasurementUnit,
    system: DisplaySystem = 'imperial'
): string {
    let displayQty: number;
    let suffix: string;

    switch (unit) {
        case 'LinearMm':
            if (system === 'imperial') {
                displayQty = quantity / 304.8;
                suffix = 'ft';
            } else {
                displayQty = quantity / 1000;
                suffix = 'm';
            }
            break;
        case 'AreaSqMm':
            if (system === 'imperial') {
                displayQty = quantity / 92903.04;
                suffix = 'sqft';
            } else {
                displayQty = quantity / 1000000;
                suffix = 'sqm';
            }
            break;
        case 'VolumeCuMm':
            if (system === 'imperial') {
                displayQty = quantity / 28316846.6;
                suffix = 'cuft';
            } else {
                displayQty = quantity / 1000000000;
                suffix = 'cum';
            }
            break;
        case 'LumpSum':
            return 'Lump Sum';
        case 'Unit':
        default:
            displayQty = quantity;
            suffix = quantity === 1 ? 'unit' : 'units';
    }

    return `${displayQty.toFixed(2)} ${suffix}`;
}

/**
 * Create a new empty quote line with defaults
 */
export function createEmptyQuoteLine(lineNumber: number): UniversalQuoteLine {
    return {
        id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        lineNumber,
        mainCategory: '',
        subCategory: '',
        taskDescription: '',
        internalCostRate: 0,
        sellingRate: 0,
        measurementUnit: 'Unit',
        quantity: 0,
        displayQuantity: 0,
        lineTotal: 0,
        lineCost: 0,
        margin: 0,
        type: 'ITEM'
    };
}

/**
 * Recalculate derived fields for a quote line
 */
export function recalculateQuoteLine(line: UniversalQuoteLine): UniversalQuoteLine {
    const lineCost = line.displayQuantity * line.internalCostRate;
    const lineTotal = line.displayQuantity * line.sellingRate;
    const margin = lineTotal > 0 ? (lineTotal - lineCost) / lineTotal : 0;

    return {
        ...line,
        lineCost,
        lineTotal,
        margin
    };
}

