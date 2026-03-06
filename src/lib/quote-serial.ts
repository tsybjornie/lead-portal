/**
 * Quote Serial Number Generator
 * 
 * Format: YYYYMMDD/FIRM/DESIGNER/CLIENT/QO1
 * Example: 20260302/VIN/D01/C001/QO1
 * 
 * Post-sign VOs: 20260302/VIN/D01/C001/VO1
 */

export interface QuoteSerialParts {
    date: string;        // YYYYMMDD
    firmCode: string;    // 3-char firm abbreviation
    designerCode: string; // D01, D02...
    clientCode: string;  // C001, C002...
    docType: 'QO' | 'VO';
    version: number;
}

/**
 * Generate a quote serial number
 * 
 * @param firmName - company name (e.g. "Vinterior Pte Ltd")
 * @param designerIndex - designer number (1-based)
 * @param clientIndex - client number (1-based)
 * @param docType - QO (quote original) or VO (variation order)
 * @param version - version number (1-based)
 * @param date - optional date override (defaults to today)
 */
export function generateQuoteSerial(
    firmName: string,
    designerIndex: number,
    clientIndex: number,
    docType: 'QO' | 'VO',
    version: number,
    date?: Date
): string {
    const d = date || new Date();
    const dateStr = d.getFullYear().toString() +
        (d.getMonth() + 1).toString().padStart(2, '0') +
        d.getDate().toString().padStart(2, '0');

    const firmCode = abbreviateFirm(firmName);
    const designerCode = `D${designerIndex.toString().padStart(2, '0')}`;
    const clientCode = `C${clientIndex.toString().padStart(3, '0')}`;
    const versionStr = `${docType}${version}`;

    return `${dateStr}/${firmCode}/${designerCode}/${clientCode}/${versionStr}`;
}

/**
 * Parse a quote serial number back to parts
 */
export function parseQuoteSerial(serial: string): QuoteSerialParts | null {
    const parts = serial.split('/');
    if (parts.length !== 5) return null;

    const [date, firmCode, designerCode, clientCode, versionPart] = parts;
    const docType = versionPart.startsWith('VO') ? 'VO' : 'QO';
    const version = parseInt(versionPart.replace(/^(QO|VO)/, ''), 10);

    return {
        date,
        firmCode,
        designerCode,
        clientCode,
        docType,
        version: isNaN(version) ? 1 : version,
    };
}

/**
 * Get display-friendly short form: VIN/C001/QO1
 */
export function getShortSerial(serial: string): string {
    const parts = serial.split('/');
    if (parts.length !== 5) return serial;
    return `${parts[1]}/${parts[3]}/${parts[4]}`;
}

/**
 * Abbreviate company name to 3 chars
 * "Vinterior Pte Ltd"  "VIN"
 * "ABC Design Studio"  "ABC"
 * "李氏设计"  "LSD" (fallback to initials)
 */
function abbreviateFirm(name: string): string {
    // Remove common suffixes
    const cleaned = name
        .replace(/\b(pte|ltd|sdn|bhd|inc|llc|co|company|design|studio|group)\b/gi, '')
        .trim();

    // Try first word, first 3 chars
    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return 'XXX';

    if (words[0].length >= 3) {
        return words[0].substring(0, 3).toUpperCase();
    }

    // Fallback: first char of each word
    return words.map(w => w[0]).join('').substring(0, 3).toUpperCase().padEnd(3, 'X');
}
