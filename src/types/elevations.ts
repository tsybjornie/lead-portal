/**
 * Elevation Data Model  Trade-Specific Instruction Packs
 * 
 * Every wall/zone gets an elevation drawing with fingerprinted specs.
 * Each trade receives ONLY the elements relevant to them.
 * No ambiguity, no telephone games  exact material codes and quantities.
 * 
 * Lives in: Roof (Drawing Inventory)
 * Feeds into: Roof (quotation line items), Roof (task cards)
 */

import { TradeCategory } from './trades';

// ============================================================
// ELEVATION ELEMENT  A single item on an elevation drawing
// ============================================================

export interface ElevationElement {
    id: string;
    trade: TradeCategory;

    // What it is
    name: string;                    // e.g. "TV Console", "Basin Tap"
    description?: string;

    // Exact material specification  no "something like walnut"
    materialCode?: string;           // Links to ComponentLibraryItem.id
    materialName?: string;           // e.g. "Formica FY-8843 Walnut Bliss"
    brand?: string;                  // e.g. "Formica", "Blum", "Grohe"
    colour?: string;                 // e.g. "Walnut Bliss", "Matt White"
    finish?: string;                 // e.g. "Matte", "Gloss", "Satin"

    // Dimensions in mm
    dimensions: {
        width?: number;
        height?: number;
        depth?: number;
        thickness?: number;
    };

    // Position on elevation
    position: {
        fromLeft?: number;           // Distance from left wall in mm
        fromFloor?: number;          // Distance from floor in mm
    };

    // Hardware specs (for carpentry)
    hardware?: {
        hingeType?: string;          // e.g. "Blum Blumotion 71B3550"
        runnerType?: string;         // e.g. "Blum Tandembox 500mm"
        handleType?: string;         // e.g. "Brushed brass T-bar 160mm"
        lockType?: string;
    };

    // Quantity
    quantity: number;
    unit: string;                    // sqft, pcs, lm, etc.

    // Cost linkage
    estimatedCost?: number;          // Auto-calculated from component library

    // Accountability
    specifiedBy: string;             // Designer who specified this
    specifiedAt: string;             // ISO date
    approvedByClient: boolean;       // Client signed off?
    approvedAt?: string;

    // Substitution control
    substitutionAllowed: boolean;    // Can vendor use an alternative?
    substitutionNotes?: string;      // If yes, what's acceptable

    // Status
    status: 'draft' | 'approved' | 'ordered' | 'installed' | 'inspected';
}

// ============================================================
// ELEVATION  One wall view in a zone
// ============================================================

export type WallFacing = 'north' | 'south' | 'east' | 'west' | 'A' | 'B' | 'C' | 'D';

export interface Elevation {
    id: string;
    zone: string;                    // e.g. "Living Room", "Kitchen"
    wall: WallFacing;                // Which wall
    label?: string;                  // e.g. "TV Feature Wall", "Kitchen Backsplash"

    // Wall dimensions
    wallWidth: number;               // mm
    wallHeight: number;              // mm

    // All elements on this elevation
    elements: ElevationElement[];

    // Design file URL (from Roof drawing)
    drawingUrl?: string;
    drawingVersion: number;          // Track revisions

    // Accountability
    createdBy: string;
    createdAt: string;
    lastModifiedBy: string;
    lastModifiedAt: string;

    // Sign-off
    designerApproved: boolean;
    clientApproved: boolean;
    vendorAcknowledged: boolean;     // Read receipt from vendor
    vendorAcknowledgedAt?: string;
}

// ============================================================
// TRADE ELEVATION PACK  Filtered view per trade
// ============================================================

export interface TradeElevationPack {
    trade: TradeCategory;
    tradeName: string;               // Display name
    projectId: string;
    vendorId?: string;
    vendorName?: string;

    // Only the elevations/elements relevant to this trade
    elevations: Elevation[];

    // Summary
    totalElements: number;
    totalEstimatedCost: number;

    // Pack status
    generatedAt: string;
    acknowledgedByVendor: boolean;
    acknowledgedAt?: string;

    // Change tracking
    changeOrders: ChangeOrder[];
}

// ============================================================
// CHANGE ORDER  Any deviation from approved elevation
// ============================================================

export type ChangeOrderReason =
    | 'client_request'          // Client changed their mind
    | 'designer_error'          // Designer specified wrong item
    | 'vendor_error'            // Vendor used wrong material
    | 'site_condition'          // Existing condition prevents original spec
    | 'material_unavailable'    // Specified material out of stock
    | 'budget_adjustment';      // Cost savings requested

export interface ChangeOrder {
    id: string;
    elevationId: string;
    elementId: string;
    reason: ChangeOrderReason;
    description: string;

    // What changed
    originalSpec: string;
    newSpec: string;
    costImpact: number;          // Positive = more expensive, negative = savings

    // Who
    requestedBy: string;
    approvedBy?: string;
    approvedAt?: string;

    // Accountability: WHO caused this?
    attributedTo: 'designer' | 'vendor' | 'client' | 'site';

    createdAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

// ============================================================
// HELPERS
// ============================================================

/** Generate a trade-specific elevation pack from full project elevations */
export function generateTradeElevationPack(
    elevations: Elevation[],
    trade: TradeCategory,
    tradeName: string,
    projectId: string,
): TradeElevationPack {
    // Filter to only elevations with elements for this trade
    const filtered = elevations
        .map(elev => ({
            ...elev,
            elements: elev.elements.filter(e => e.trade === trade),
        }))
        .filter(elev => elev.elements.length > 0);

    const totalElements = filtered.reduce((s, e) => s + e.elements.length, 0);
    const totalCost = filtered.reduce(
        (s, e) => s + e.elements.reduce((es, el) => es + (el.estimatedCost || 0), 0),
        0
    );

    return {
        trade,
        tradeName,
        projectId,
        elevations: filtered,
        totalElements,
        totalEstimatedCost: totalCost,
        generatedAt: new Date().toISOString(),
        acknowledgedByVendor: false,
        changeOrders: [],
    };
}

/** Check if a material spec is complete (no blanks) */
export function isElementComplete(element: ElevationElement): { complete: boolean; missing: string[] } {
    const missing: string[] = [];
    if (!element.materialCode && !element.materialName) missing.push('material');
    if (!element.dimensions.width && !element.dimensions.height) missing.push('dimensions');
    if (element.trade === 'carpentry' && !element.hardware?.hingeType) {
        // Carpentry needs hardware spec
        if (element.name.toLowerCase().includes('cabinet') || element.name.toLowerCase().includes('wardrobe')) {
            missing.push('hardware (hinges/runners)');
        }
    }
    if (!element.colour && !element.finish) missing.push('colour/finish');

    return { complete: missing.length === 0, missing };
}

/** Count spec completeness across all elevations */
export function getElevationCompleteness(elevations: Elevation[]): number {
    const allElements = elevations.flatMap(e => e.elements);
    if (allElements.length === 0) return 0;
    const complete = allElements.filter(e => isElementComplete(e).complete).length;
    return Math.round((complete / allElements.length) * 100);
}
