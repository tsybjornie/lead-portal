/**
 * CSV Parser for Vendor Pricelist Import
 * Expects columns: Item Description, Unit, Rate
 */

export interface ParsedPricelistItem {
    description: string;
    unit: string;
    rate: number;
    category?: string;
    vendorName?: string;
}

export interface ParseResult {
    success: boolean;
    items: ParsedPricelistItem[];
    errors: string[];
    warnings: string[];
}

/**
 * Parse CSV content into pricelist items
 * Flexible column detection: looks for 'description', 'item', 'unit', 'rate', 'price'
 */
export function parseCSV(csvContent: string): ParseResult {
    const result: ParseResult = {
        success: false,
        items: [],
        errors: [],
        warnings: []
    };

    const lines = csvContent.trim().split('\n').map(line => line.trim()).filter(Boolean);

    if (lines.length < 2) {
        result.errors.push('CSV must have at least a header row and one data row');
        return result;
    }

    // Parse header row
    const header = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());

    // Detect column indices
    const descCol = findColumn(header, ['description', 'item', 'item description', 'name', 'work item']);
    const unitCol = findColumn(header, ['unit', 'uom', 'measurement']);
    const rateCol = findColumn(header, ['rate', 'price', 'cost', 'unit price', 'unit rate', 'amount']);
    const catCol = findColumn(header, ['category', 'cat', 'type', 'section']);

    if (descCol === -1) {
        result.errors.push('Could not find description column. Expected: "Description", "Item", or "Name"');
    }
    if (rateCol === -1) {
        result.errors.push('Could not find rate/price column. Expected: "Rate", "Price", or "Cost"');
    }

    if (result.errors.length > 0) {
        return result;
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);

        const description = values[descCol]?.trim() || '';
        const unit = unitCol >= 0 ? (values[unitCol]?.trim() || 'Per Unit') : 'Per Unit';
        const rateStr = values[rateCol]?.trim() || '0';
        const rate = parseFloat(rateStr.replace(/[^0-9.-]/g, ''));
        const category = catCol >= 0 ? values[catCol]?.trim() : undefined;

        if (!description) {
            result.warnings.push(`Row ${i + 1}: Empty description, skipped`);
            continue;
        }

        if (isNaN(rate) || rate <= 0) {
            result.warnings.push(`Row ${i + 1}: Invalid rate "${rateStr}", defaulting to 0`);
        }

        result.items.push({
            description,
            unit: normalizeUnit(unit),
            rate: isNaN(rate) ? 0 : rate,
            category
        });
    }

    result.success = result.items.length > 0;
    return result;
}

/**
 * Parse a single CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

/**
 * Find column index by checking multiple possible names
 */
function findColumn(header: string[], possibleNames: string[]): number {
    for (const name of possibleNames) {
        const idx = header.findIndex(h => h.includes(name));
        if (idx >= 0) return idx;
    }
    return -1;
}

/**
 * Normalize unit strings to standard format
 */
function normalizeUnit(unit: string): string {
    const lower = unit.toLowerCase();

    if (lower.includes('sqm') || lower.includes('sq m') || lower.includes('m2') || lower.includes('m²')) {
        return 'sqm';
    }
    if (lower.includes('sqft') || lower.includes('sq ft') || lower.includes('ft2') || lower.includes('ft²')) {
        return 'sqft';
    }
    if (lower.includes('lm') || lower.includes('linear') || lower.includes('metre') || lower.includes('meter')) {
        return 'm';
    }
    if (lower.includes('ft') && !lower.includes('sq')) {
        return 'ft';
    }
    if (lower.includes('pc') || lower.includes('unit') || lower.includes('ea') || lower.includes('each')) {
        return 'unit';
    }
    if (lower.includes('lot') || lower.includes('lump')) {
        return 'lot';
    }

    return unit;
}

/**
 * Generate sample CSV for download
 */
export function generateSampleCSV(): string {
    return `Category,Item Description,Unit,Rate
Kitchen Carpentry,Base cabinet with soft-close,LM,450
Kitchen Carpentry,Upper wall cabinet,LM,380
Kitchen Carpentry,Quartz countertop 15mm,LM,280
Tiling,Floor tiles (porcelain),SQM,85
Tiling,Wall tiles,SQM,75
Plumbing,Mixer tap installation,Unit,180
Electrical,Power point,Unit,120`;
}
