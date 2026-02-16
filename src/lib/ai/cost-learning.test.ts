import { parseInvoice, detectCostDrift } from '@/lib/ai/cost-learning';

describe('AI COST LEARNING ENGINE', () => {

    test('1. Invoice Parser (Mock) returns structured data', async () => {
        const invoice = await parseInvoice("dummy.file");
        expect(invoice.id).toBe("INV-2026-001");
        expect(invoice.items.length).toBe(2);
        expect(invoice.items[0].description).toContain("Plywood");
    });

    test('2. Drift Detector identifies price hikes correctly', async () => {
        const invoice = await parseInvoice("dummy.file");
        const recommendations = detectCostDrift(invoice);

        // Expect 1 recommendation (Plywood) because Laminate didn't change
        expect(recommendations.length).toBe(1);

        const rec = recommendations[0];
        expect(rec.materialName).toContain("Plywood");
        expect(rec.oldCost).toBe(42.00);
        expect(rec.newCost).toBe(45.50);

        // (3.5 / 42) * 100 = 8.33%
        expect(rec.driftPercent).toBeCloseTo(8.33, 1);
        expect(rec.severity).toBe('MEDIUM');
    });

});
