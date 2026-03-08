/**
 * Material Bridge — Encyclopedia → Quote Auto-Fill
 * Converts encyclopedia entries into quote line items with override support
 */

import type { MaterialEntry, SupplierInfo, MaterialSelection } from '@/data/encyclopedia/core';
import type { UniversalQuoteLine, MeasurementUnit } from '@/types/quote';
import { detectMeasurementUnit, recalculateQuoteLine } from '@/types/quote';

// ============================================================
// COST PARSING
// ============================================================

/**
 * Parse a cost string like "$12 — $18/sqft" into a numeric value
 * Takes the midpoint of ranges, strips currency symbols
 */
export function parseCostString(costStr: string): { value: number; unit: string } {
    if (!costStr) return { value: 0, unit: 'unit' };

    // Remove currency symbols and trim
    const cleaned = costStr.replace(/[$$S$MYR€£¥]/g, '').trim();

    // Extract unit (after /)
    const unitMatch = cleaned.match(/\/\s*(.+)$/);
    const unit = unitMatch ? unitMatch[1].trim() : 'unit';

    // Extract number(s)
    const numbers = cleaned.replace(/\/.*$/, '').match(/[\d,.]+/g);
    if (!numbers || numbers.length === 0) return { value: 0, unit };

    const parsed = numbers.map(n => parseFloat(n.replace(/,/g, '')));

    // If range (e.g. "12 — 18"), take midpoint
    if (parsed.length >= 2) {
        return { value: (parsed[0] + parsed[1]) / 2, unit };
    }

    return { value: parsed[0], unit };
}

/**
 * Map encyclopedia unit strings to MeasurementUnit
 */
function mapUnit(unit: string): MeasurementUnit {
    const normalized = unit.toLowerCase().trim();
    if (normalized.includes('sqft') || normalized.includes('sqm') || normalized.includes('sq')) return 'AreaSqMm';
    if (normalized.includes('lm') || normalized.includes('lin') || normalized.includes('ft')) return 'LinearMm';
    if (normalized.includes('cu')) return 'VolumeCuMm';
    if (normalized.includes('lump')) return 'LumpSum';
    return 'Unit';
}

/**
 * Map encyclopedia category to quote main category
 */
function mapToMainCategory(tradeCategory: string): string {
    const map: Record<string, string> = {
        'natural stone': 'Tiling',
        'marble': 'Tiling',
        'granite': 'Tiling',
        'tiles': 'Tiling',
        'wood': 'Carpentry',
        'carpentry': 'Carpentry',
        'cabinetry': 'Carpentry',
        'paint': 'Painting',
        'wallpaper': 'Painting',
        'wall finishes': 'Painting',
        'electrical': 'Electrical',
        'plumbing': 'Plumbing',
        'lighting': 'Electrical',
        'furniture': 'Furniture',
        'appliances': 'Appliances',
        'glass': 'Glass & Mirrors',
        'flooring': 'Flooring',
    };

    const key = tradeCategory.toLowerCase();
    for (const [pattern, category] of Object.entries(map)) {
        if (key.includes(pattern)) return category;
    }
    return 'Miscellaneous';
}

// ============================================================
// ENCYCLOPEDIA → QUOTE LINE
// ============================================================

/**
 * Convert an encyclopedia entry + supplier into a UniversalQuoteLine
 */
export function encyclopediaToQuoteLine(
    entry: MaterialEntry,
    supplier: SupplierInfo | undefined,
    quantity: number,
    room: string,
    lineNumber: number = 1,
): UniversalQuoteLine {
    // Parse cost from supplier or entry
    let costPerUnit = 0;
    let sellingPerUnit = 0;
    let unit: MeasurementUnit = 'Unit';

    if (supplier) {
        const costParsed = parseCostString(supplier.costPrice);
        const retailParsed = parseCostString(supplier.retailPrice);
        costPerUnit = costParsed.value;
        sellingPerUnit = retailParsed.value || costPerUnit * (1 + (supplier.designerMarkup || 20) / 100);
        unit = mapUnit(costParsed.unit);
    } else if (entry.referenceCostPerUnit) {
        costPerUnit = entry.referenceCostPerUnit;
        sellingPerUnit = costPerUnit * 1.2; // Default 20% markup
        unit = entry.referenceUnit ? mapUnit(entry.referenceUnit) : detectMeasurementUnit(entry.category || '');
    }

    const line: UniversalQuoteLine = {
        id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        lineNumber,
        mainCategory: mapToMainCategory(entry.category || ''),
        subCategory: room,
        taskDescription: `Supply & install ${entry.name}${entry.origin ? ` (${entry.origin})` : ''}`,
        internalCostRate: costPerUnit,
        sellingRate: sellingPerUnit,
        measurementUnit: unit,
        quantity: quantity,
        displayQuantity: quantity,
        lineTotal: 0,
        lineCost: 0,
        margin: 0,
        vendorId: supplier?.supplierName,
        vendorName: supplier ? `${supplier.supplierName} — ${supplier.supplierCity || supplier.supplierCountry}` : undefined,
        internalRemarks: supplier?.notes,
        type: 'ITEM',
    };

    return recalculateQuoteLine(line);
}

// ============================================================
// ENCYCLOPEDIA → MATERIAL SELECTION
// ============================================================

/**
 * Create a MaterialSelection from an encyclopedia entry
 */
export function encyclopediaToSelection(
    entry: MaterialEntry,
    supplier: SupplierInfo | undefined,
    room: string,
    quantity: string,
    tradeCategory: string,
): Omit<MaterialSelection, 'id'> {
    let costTotal = 0;
    let retailTotal = 0;
    let referenceCost = 0;

    if (supplier) {
        const costParsed = parseCostString(supplier.costPrice);
        const retailParsed = parseCostString(supplier.retailPrice);
        referenceCost = costParsed.value;

        const qtyNum = parseFloat(quantity) || 0;
        costTotal = costParsed.value * qtyNum;
        retailTotal = (retailParsed.value || costParsed.value * (1 + (supplier.designerMarkup || 20) / 100)) * qtyNum;
    } else if (entry.referenceCostPerUnit) {
        referenceCost = entry.referenceCostPerUnit;
        const qtyNum = parseFloat(quantity) || 0;
        costTotal = referenceCost * qtyNum;
        retailTotal = costTotal * 1.2;
    }

    return {
        tradeCategory,
        materialType: entry.category || tradeCategory,
        selectedItem: entry.name,
        selectedSupplier: supplier,
        room,
        quantity,
        costTotal,
        retailTotal,
        designerProfit: retailTotal - costTotal,
        status: 'draft',
        referenceCost,
    };
}

// ============================================================
// OVERRIDE SYSTEM
// ============================================================

/**
 * Apply a cost override to a MaterialSelection
 * Keeps the reference price and records the actual supplier quote
 */
export function applyOverride(
    selection: MaterialSelection,
    actualCostPerUnit: number,
    note: string,
): MaterialSelection {
    const referenceCost = selection.referenceCost || 0;
    const variance = referenceCost > 0
        ? ((actualCostPerUnit - referenceCost) / referenceCost) * 100
        : 0;

    const qtyNum = parseFloat(selection.quantity || '0') || 0;
    const newCostTotal = actualCostPerUnit * qtyNum;
    const markup = selection.selectedSupplier?.designerMarkup || 20;
    const newRetailTotal = newCostTotal * (1 + markup / 100);

    return {
        ...selection,
        overrideCost: actualCostPerUnit,
        costVariance: Math.round(variance * 10) / 10, // 1 decimal place
        overrideNote: note,
        overrideAt: new Date().toISOString(),
        costTotal: newCostTotal,
        retailTotal: newRetailTotal,
        designerProfit: newRetailTotal - newCostTotal,
    };
}

/**
 * Apply a cost override to a UniversalQuoteLine
 */
export function applyQuoteLineOverride(
    line: UniversalQuoteLine,
    actualCostPerUnit: number,
): UniversalQuoteLine {
    return recalculateQuoteLine({
        ...line,
        internalCostRate: actualCostPerUnit,
    });
}

// ============================================================
// VARIANCE REPORTING
// ============================================================

export interface VarianceEntry {
    selectionId: string;
    itemName: string;
    room: string;
    referenceCost: number;
    actualCost: number;
    variance: number; // % difference
    note?: string;
}

export interface VarianceReport {
    entries: VarianceEntry[];
    averageVariance: number; // Average % across all overridden items
    totalReferenceCost: number;
    totalActualCost: number;
    totalSavings: number; // Positive = saved, negative = overspent
}

/**
 * Generate a variance report from material selections that have overrides
 */
export function getVarianceReport(selections: MaterialSelection[]): VarianceReport {
    const overridden = selections.filter(s => s.overrideCost !== undefined && s.referenceCost !== undefined);

    const entries: VarianceEntry[] = overridden.map(s => ({
        selectionId: s.id,
        itemName: s.selectedItem,
        room: s.room || 'Unassigned',
        referenceCost: s.referenceCost!,
        actualCost: s.overrideCost!,
        variance: s.costVariance || 0,
        note: s.overrideNote,
    }));

    const totalReferenceCost = overridden.reduce((sum, s) => {
        const qty = parseFloat(s.quantity || '0') || 0;
        return sum + (s.referenceCost || 0) * qty;
    }, 0);

    const totalActualCost = overridden.reduce((sum, s) => {
        const qty = parseFloat(s.quantity || '0') || 0;
        return sum + (s.overrideCost || 0) * qty;
    }, 0);

    const averageVariance = entries.length > 0
        ? entries.reduce((sum, e) => sum + e.variance, 0) / entries.length
        : 0;

    return {
        entries,
        averageVariance: Math.round(averageVariance * 10) / 10,
        totalReferenceCost,
        totalActualCost,
        totalSavings: totalReferenceCost - totalActualCost,
    };
}

// ============================================================
// SEARCH HELPERS
// ============================================================

/**
 * Category definitions for the encyclopedia search UI
 */
export const ENCYCLOPEDIA_CATEGORIES = [
    { key: 'all', label: 'All Materials', icon: '🔍' },
    { key: 'stone', label: 'Natural Stone', icon: '🪨' },
    { key: 'wood', label: 'Wood Species', icon: '🪵' },
    { key: 'tiles', label: 'Tiles', icon: '🔲' },
    { key: 'paint', label: 'Paint & Finishes', icon: '🎨' },
    { key: 'cabinetry', label: 'Cabinetry', icon: '🗄️' },
    { key: 'countertops', label: 'Countertops', icon: '🔳' },
    { key: 'wallpaper', label: 'Wallpaper', icon: '🖼️' },
    { key: 'metal', label: 'Metals', icon: '⚙️' },
    { key: 'lighting', label: 'Lighting', icon: '💡' },
    { key: 'furniture', label: 'Furniture', icon: '🪑' },
    { key: 'craft', label: 'Craft Heritage', icon: '🏺' },
    { key: 'soft', label: 'Soft Furnishing', icon: '🪟' },
    { key: 'wall', label: 'Wall Finishes', icon: '🧱' },
] as const;

export type EncyclopediaCategory = typeof ENCYCLOPEDIA_CATEGORIES[number]['key'];
