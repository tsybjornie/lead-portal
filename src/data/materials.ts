import { Currency, MeasurementType } from '@/types/core';

export interface MaterialCost {
    id: string; // MAT-001
    name: string;
    supplierId: string;
    baseCost: number;
    currency: Currency;
    measurementUnit: MeasurementType;
    lastUpdated: string;
}

export const MATERIAL_COSTS: MaterialCost[] = [
    // WOODWORKS MY (Reliable)
    {
        id: 'MAT-PLY-18',
        name: 'Plywood 18mm (General Grade)',
        supplierId: 'SUP-001',
        baseCost: 42.00, // RM
        currency: 'MYR',
        measurementUnit: 'Unit', // Per Sheet (4x8)
        lastUpdated: '2025-12-01'
    },
    {
        id: 'MAT-LAM-WHT',
        name: 'Laminate (Solid White)',
        supplierId: 'SUP-001',
        baseCost: 85.00, // RM
        currency: 'MYR',
        measurementUnit: 'Unit', // Per Sheet
        lastUpdated: '2025-12-15'
    },

    // MEGASTEEL SG (Expensive)
    {
        id: 'MAT-STEEL-BOX',
        name: 'Stainless Steel Box Section (20x20)',
        supplierId: 'SUP-002',
        baseCost: 25.00, // SGD
        currency: 'SGD',
        measurementUnit: 'Linear', // Per Meter
        lastUpdated: '2026-01-10'
    },

    // CHEAPTILES (Volatile)
    {
        id: 'MAT-TILE-600',
        name: 'Ceramic Tile 600x600 (Beige)',
        supplierId: 'SUP-003',
        baseCost: 12.50, // RM
        currency: 'MYR',
        measurementUnit: 'Area', // Per Sqft (approx)
        lastUpdated: '2025-11-20'
    }
];
