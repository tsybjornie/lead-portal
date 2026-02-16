import { Supplier, ReliabilityScore, Jurisdiction } from '../types/core';

// --- THE BLACK BOOK (Suppliers) ---
export const SUPPLIERS: Record<string, Supplier> = {
    'SUP-001': {
        id: 'SUP-001',
        name: 'WoodWorks MY', // Reliable strategy partner
        jurisdiction: 'MY',
        reliability: 'A',
        paymentTerms: '50% Deposit',
        hiddenPainFields: {
            transportIssues: 'None. Owns truck fleet.',
        }
    },
    'SUP-002': {
        id: 'SUP-002',
        name: 'MegaSteel SG', // Expensive but necessary
        jurisdiction: 'SG',
        reliability: 'A',
        paymentTerms: '30 days net',
    },
    'SUP-003': {
        id: 'SUP-003',
        name: 'CheapTiles Warehouse', // Volatile
        jurisdiction: 'MY',
        reliability: 'C',
        paymentTerms: 'Cash on Delivery',
        hiddenPainFields: {
            typicalExtrasHistory: 'Often charges asking for unloading fee on site',
            transportIssues: 'Unreliable timing',
        }
    },
    'SUP-004': {
        id: 'SUP-004',
        name: 'LuxStone Import', // High margin, high risk
        jurisdiction: 'CROSS_BORDER', // Imported
        reliability: 'B',
        paymentTerms: '100% before shipping',
        hiddenPainFields: {
            transportIssues: 'Customs delay common (add 1 week)',
        }
    }
};

// --- THE SHIELD (Buffer Rules) ---
export interface BufferRule {
    category: string;
    reliability: ReliabilityScore;
    isImport: boolean;
    bufferPercent: number;
}

export const BUFFER_MATRIX: BufferRule[] = [
    // Base MY Rules
    { category: 'Carpentry', reliability: 'A', isImport: false, bufferPercent: 0.10 },
    { category: 'Carpentry', reliability: 'B', isImport: false, bufferPercent: 0.15 },
    { category: 'Carpentry', reliability: 'C', isImport: false, bufferPercent: 0.20 },

    // Stone / Wet Works (Higher Risk)
    { category: 'Stone', reliability: 'A', isImport: false, bufferPercent: 0.12 },
    { category: 'Stone', reliability: 'C', isImport: false, bufferPercent: 0.25 },

    // Imports (High Volatility)
    { category: 'Lighting', reliability: 'A', isImport: true, bufferPercent: 0.20 },
    { category: 'Furniture', reliability: 'B', isImport: true, bufferPercent: 0.30 },

    // Default fallback
    { category: 'General', reliability: 'A', isImport: false, bufferPercent: 0.10 },
];

export function getVolatilityBuffer(category: string, reliability: ReliabilityScore, isImport: boolean): number {
    const rule = BUFFER_MATRIX.find(r =>
        r.category === category &&
        r.reliability === reliability &&
        r.isImport === isImport
    );

    if (rule) return rule.bufferPercent;

    // Fallback Logic
    if (isImport) return 0.25; // Default Import Fear
    if (reliability === 'C') return 0.20; // Default Bad Supplier Fear
    return 0.12; // Default Safety
}
