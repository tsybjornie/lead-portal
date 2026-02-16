import { Millimeter, SquareMillimeter, MeasurementType } from '@/types/core';

// --- THE SACRED CONSTANTS (DO NOT TOUCH) ---
// "These numbers are sacred. No rounding. Ever."
export const ONE_FOOT_IN_MM = 304.8;
export const ONE_SQFT_IN_MM2 = 92903.04;
export const ONE_METER_IN_MM = 1000;
export const ONE_SQM_IN_MM2 = 1000000;

// --- TYPE GUARDS & CONVERSION ---

/**
 * The "Input Layer" -> "Machine World" Converter.
 * Takes human input (ft, m, mm) and strictly outputs Millimeters.
 */
export function convertToMm(value: number, inputUnit: 'mm' | 'm' | 'ft' | 'in'): Millimeter {
    if (value < 0) throw new Error("Negative dimensions are impossible.");

    switch (inputUnit) {
        case 'mm': return value;
        case 'm': return value * ONE_METER_IN_MM;
        case 'ft': return value * ONE_FOOT_IN_MM;
        case 'in': return value * (ONE_FOOT_IN_MM / 12); // = 25.4
        default: throw new Error(`Unknown linear unit: ${inputUnit}`);
    }
}

/**
 * The "Input Layer" -> "Machine World" Converter for AREA.
 */
export function convertToMm2(value: number, inputUnit: 'mm2' | 'm2' | 'sqft'): SquareMillimeter {
    if (value < 0) throw new Error("Negative area is impossible.");

    switch (inputUnit) {
        case 'mm2': return value;
        case 'm2': return value * ONE_SQM_IN_MM2;
        case 'sqft': return value * ONE_SQFT_IN_MM2;
        default: throw new Error(`Unknown area unit: ${inputUnit}`);
    }
}

// --- DISPLAY "SKINS" (Machine World -> Human View) ---

export function formatMmToFeet(mm: Millimeter): string {
    const ft = mm / ONE_FOOT_IN_MM;
    return ft.toFixed(2) + " ft";
}

export function formatMm2ToSqft(mm2: SquareMillimeter): string {
    const sqft = mm2 / ONE_SQFT_IN_MM2;
    return sqft.toFixed(2) + " sqft";
}

/**
 * SAFETY CHECK: Flags suspicious dimensions
 * "Flag dimensions outside realistic bounds"
 */
export function validateDimension(mm: Millimeter, type: 'Door' | 'Cabinet' | 'Room'): string | null {
    // Example heuristics
    if (type === 'Door' && mm > 3000) return "WARNING: Door height > 3000mm is unusual.";
    if (type === 'Door' && mm < 1000) return "WARNING: Door height < 1000mm is unusual.";
    return null;
}
