import { MATERIAL_COSTS, MaterialCost } from '@/data/materials';

// --- TYPES ---
export interface InvoiceLineItem {
    description: string;
    detectedSupplierId: string; // e.g. "SUP-001"
    matchedMaterialId?: string; // e.g. "MAT-PLY-18"
    unitCost: number;
    quantity: number;
}

export interface InvoiceData {
    id: string;
    supplierName: string;
    date: string;
    items: InvoiceLineItem[];
}

export interface CostUpdateRecommendation {
    materialId: string;
    materialName: string;
    oldCost: number;
    newCost: number;
    driftPercent: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

// --- MOCK LLM: "Invoice Parser" ---
// In real life, this calls OpenAI/Anthropic with an image
export async function parseInvoice(file: any): Promise<InvoiceData> {
    // SIMULATED LATENCY
    await new Promise(resolve => setTimeout(resolve, 1500));

    // MOCK RESPONSE (Simulating a WoodWorks Invoice)
    return {
        id: "INV-2026-001",
        supplierName: "WoodWorks MY",
        date: "2026-01-28",
        items: [
            {
                description: "18mm Plywood Sheet (4x8) - General",
                detectedSupplierId: "SUP-001",
                matchedMaterialId: "MAT-PLY-18",
                unitCost: 45.50, // UP from 42.00
                quantity: 50
            },
            {
                description: "White Laminate Type A",
                detectedSupplierId: "SUP-001",
                matchedMaterialId: "MAT-LAM-WHT",
                unitCost: 85.00, // NO CHANGE
                quantity: 20
            }
        ]
    };
}

// --- LOGIC ENGINE: "The Auditor" ---
export function detectCostDrift(invoice: InvoiceData): CostUpdateRecommendation[] {
    const recommendations: CostUpdateRecommendation[] = [];

    invoice.items.forEach(item => {
        if (!item.matchedMaterialId) return;

        const dbRecord = MATERIAL_COSTS.find(m => m.id === item.matchedMaterialId);
        if (!dbRecord) return;

        const delta = item.unitCost - dbRecord.baseCost;
        // Float precision handling
        if (Math.abs(delta) < 0.01) return; // No significant change

        const driftPercent = (delta / dbRecord.baseCost) * 100;

        let severity: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
        if (Math.abs(driftPercent) > 5) severity = 'MEDIUM';
        if (Math.abs(driftPercent) > 15) severity = 'HIGH';

        recommendations.push({
            materialId: dbRecord.id,
            materialName: dbRecord.name,
            oldCost: dbRecord.baseCost,
            newCost: item.unitCost,
            driftPercent,
            severity
        });
    });

    return recommendations;
}
