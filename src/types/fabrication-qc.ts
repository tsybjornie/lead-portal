/**
 * Fabrication QC  Factory-to-Site Verification Chain
 * 
 * For trades that fabricate offsite (carpentry in JB, glass panels, metalworks),
 * there are 3 mandatory checkpoints before installation can proceed.
 * Each checkpoint blocks the next stage.
 * 
 * Lives in: Roof (vendor ops) + Roof (spec comparison)
 */

import { TradeCategory } from './trades';

// ============================================================
// FABRICATION ORDER  Tracks an offsite fabrication job
// ============================================================

export type FabricationStatus =
    | 'order_placed'        // PO sent to vendor/factory
    | 'in_production'       // Factory working on it
    | 'factory_qc'          // Factory QC photos uploaded, awaiting designer review
    | 'factory_approved'    // Designer approved factory QC
    | 'factory_rejected'    // Designer rejected  needs rework
    | 'in_transit'          // Shipped to site
    | 'delivered'           // Arrived at site
    | 'delivery_inspected'  // Designer inspected on-site
    | 'delivery_rejected'   // Wrong item / damaged  send back
    | 'ready_to_install'    // Cleared for installation
    | 'installing'          // Being installed
    | 'installed'           // Installation complete
    | 'post_install_checked'; // Workmanship checklist done

export interface FabricationOrder {
    id: string;
    projectId: string;
    trade: TradeCategory;
    vendorId: string;
    vendorName: string;

    // What's being fabricated (links to elevation elements)
    items: FabricationItem[];

    // Where
    factoryLocation?: string;        // "JB Factory", "Woodlands Workshop"
    siteAddress: string;

    // Timing
    orderedAt: string;
    estimatedCompletionAt?: string;
    actualCompletionAt?: string;
    deliveryDate?: string;
    installationDate?: string;

    // Status
    status: FabricationStatus;

    // QC Checkpoints
    factoryQC?: FactoryQCCheckpoint;
    deliveryInspection?: DeliveryInspection;
    postInstallCheck?: PostInstallCheck;

    // Cost
    totalCost: number;
    depositPaid: number;
    balanceDue: number;
}

export interface FabricationItem {
    id: string;
    elevationElementId?: string;     // Links to ElevationElement
    name: string;
    description: string;

    // Spec from elevation
    materialCode?: string;
    materialName?: string;
    colour?: string;
    finish?: string;
    dimensions: {
        width?: number;
        height?: number;
        depth?: number;
    };
    quantity: number;

    // Per-item QC
    factoryQCPassed?: boolean;
    deliveryCheckPassed?: boolean;
    installCheckPassed?: boolean;
}

// ============================================================
// CHECKPOINT 1: FACTORY QC
// Vendor uploads photos from workshop before shipping
// ============================================================

export interface FactoryQCPhoto {
    url: string;
    caption: string;                 // "Front view with measurement"
    itemId: string;                  // Which fabrication item
    timestamp: string;
    geoTag?: { lat: number; lng: number }; // Proves it's from the factory
}

export interface FactoryQCCheckpoint {
    id: string;
    fabricationOrderId: string;

    // Vendor uploads
    photos: FactoryQCPhoto[];
    vendorNotes?: string;
    submittedBy: string;             // Vendor/factory worker name
    submittedAt: string;

    // Checklist  vendor self-checks
    materialCodeCorrect: boolean;
    dimensionsWithinTolerance: boolean; // ±2mm for carpentry, ±1mm for glass
    finishMatchesSample: boolean;
    hardwareInstalled: boolean;
    noVisibleDefects: boolean;

    // Designer review
    designerReviewedAt?: string;
    designerApproved: boolean;
    designerNotes?: string;
    rejectionReasons?: string[];     // If rejected

    // Auto-comparison
    specMismatches: SpecMismatch[];  // System auto-flags discrepancies
}

export interface SpecMismatch {
    itemId: string;
    field: string;                   // "colour", "dimension.width", "materialCode"
    expected: string;
    actual: string;
    severity: 'warning' | 'critical';
}

// ============================================================
// CHECKPOINT 2: DELIVERY INSPECTION
// Designer checks items on-site before installation begins
// ============================================================

export interface DeliveryInspection {
    id: string;
    fabricationOrderId: string;

    // Per-item inspection
    itemChecks: DeliveryItemCheck[];

    // Overall
    allItemsReceived: boolean;
    damagedItems: string[];          // Item IDs
    missingItems: string[];
    wrongItems: string[];            // Item IDs where spec doesn't match

    // Photos
    photos: string[];                // Evidence photos

    // Sign-off
    inspectedBy: string;             // Designer name
    inspectedAt: string;
    passed: boolean;
    notes?: string;

    // If rejected
    returnToFactory: boolean;        // Send back for rework?
    partialAcceptance: boolean;      // Accept some, reject others?
    acceptedItemIds: string[];
    rejectedItemIds: string[];
}

export interface DeliveryItemCheck {
    itemId: string;
    itemName: string;

    // Visual checks
    colourMatchesSample: boolean;
    noScratchesOrDents: boolean;
    dimensionsCorrect: boolean;      // Spot-check with tape measure
    hardwarePresent: boolean;

    // Measured dimensions (for comparison)
    measuredWidth?: number;          // mm  compared to spec
    measuredHeight?: number;
    measuredDepth?: number;

    passed: boolean;
    notes?: string;
    photos: string[];
}

// ============================================================
// CHECKPOINT 3: POST-INSTALLATION CHECK
// After installation  workmanship verification
// ============================================================

export interface PostInstallCheck {
    id: string;
    fabricationOrderId: string;

    // Links to workmanship checklist (from scorecards.ts)
    workmanshipReportId?: string;

    // Installation-specific checks
    alignmentCorrect: boolean;       // Level, plumb, square
    gapsAcceptable: boolean;         // <1mm for carpentry, <0.5mm for glass
    functionalTestPassed: boolean;   // Doors open/close, drawers slide
    sealingComplete: boolean;        // Silicone, edge sealing
    cleanedAfterInstall: boolean;    // Protective film removed, area cleaned

    // Photos
    beforePhotos: string[];
    afterPhotos: string[];

    // Sign-off chain
    vendorConfirmed: boolean;
    vendorConfirmedAt?: string;
    designerApproved: boolean;
    designerApprovedAt?: string;
    clientAccepted: boolean;
    clientAcceptedAt?: string;

    // Result
    passed: boolean;
    defectsFound: string[];          // Links to Defect IDs (defects-ratings.ts)
    notes?: string;
}

// ============================================================
// HELPERS
// ============================================================

/** Check if fabrication order can proceed to next stage */
export function canProceedToNextStage(order: FabricationOrder): { canProceed: boolean; reason?: string } {
    switch (order.status) {
        case 'factory_qc':
            if (!order.factoryQC?.designerApproved) {
                return { canProceed: false, reason: 'Designer must review and approve factory QC photos before shipping' };
            }
            return { canProceed: true };

        case 'delivered':
            if (!order.deliveryInspection?.passed) {
                return { canProceed: false, reason: 'Designer must inspect delivered items before installation begins' };
            }
            return { canProceed: true };

        case 'installed':
            if (!order.postInstallCheck?.passed) {
                return { canProceed: false, reason: 'Post-installation workmanship check required before sign-off' };
            }
            return { canProceed: true };

        default:
            return { canProceed: true };
    }
}

/** Get fabrication progress percentage */
export function getFabricationProgress(status: FabricationStatus): number {
    const progressMap: Record<FabricationStatus, number> = {
        order_placed: 10,
        in_production: 25,
        factory_qc: 40,
        factory_approved: 50,
        factory_rejected: 35,
        in_transit: 60,
        delivered: 65,
        delivery_inspected: 70,
        delivery_rejected: 60,
        ready_to_install: 75,
        installing: 85,
        installed: 95,
        post_install_checked: 100,
    };
    return progressMap[status];
}

/** Acceptable dimension tolerance per trade (mm) */
export const DIMENSION_TOLERANCE: Partial<Record<TradeCategory, number>> = {
    carpentry: 2,        // ±2mm
    glassworks: 1,       // ±1mm  glass is precision
    metalworks: 1.5,     // ±1.5mm
};

/** Check if measured dimension is within tolerance */
export function isDimensionWithinTolerance(
    expected: number,
    measured: number,
    trade: TradeCategory
): { pass: boolean; deviation: number; tolerance: number } {
    const tolerance = DIMENSION_TOLERANCE[trade] || 3;
    const deviation = Math.abs(expected - measured);
    return {
        pass: deviation <= tolerance,
        deviation,
        tolerance,
    };
}
