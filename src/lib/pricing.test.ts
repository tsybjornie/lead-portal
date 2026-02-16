import { convertToMm, ONE_FOOT_IN_MM } from '@/lib/units';
import { createPricingStrategy, calculateSellingPrice, analyzeProfit } from '@/lib/pricing';
import { QUIET_MONEY_MODULES } from '@/data/modules-services';

describe('THE LOGIC CORE', () => {

    describe('1. Millimeter Prime Directive', () => {
        test('Converts Feet to MM with exact precision', () => {
            const ft = 10;
            const mm = convertToMm(ft, 'ft');
            expect(mm).toBe(3048);
            expect(convertToMm(1, 'ft')).toBe(ONE_FOOT_IN_MM);
        });

        test('Rejects negative dimensions', () => {
            expect(() => convertToMm(-5, 'ft')).toThrow();
        });
    });

    describe('2. Pricing Engine (Shock Absorber)', () => {
        test('Calculates Adjusted Cost correctly (Base + Buffer + Logistics)', () => {
            const strategy = createPricingStrategy(
                100, 'SGD', 'Carpentry', 'A', 'MY', false
            );
            // Mocking the values returned from Knowledge Base for control
            strategy.baseCost = 100;
            strategy.volatilityBuffer = 0.10; // 10%
            strategy.logisticsAdder = 0;      // 0

            // Adjusted = 100 * 1.10 + 0 = 110
            // Burdened (Execution Risk) = 110 * 1.15 (MY Risk) = 126.5
            // Selling (Margin 0.25) = 126.5 / 0.75 = 168.666...

            const analysis = analyzeProfit(strategy);

            expect(analysis.adjustedCost).toBeCloseTo(110);
            expect(analysis.sellingPrice).toBeCloseTo(168.67, 1);
            expect(analysis.grossProfit).toBeGreaterThan(0);
        });
    });

    describe('3. Quiet Money (Service Modules)', () => {
        test('Town Council (SG) follows Cost + Profit logic', () => {
            const tcSg = QUIET_MONEY_MODULES.find(m => m.id === 'SVC-TC-SG');
            if (!tcSg?.components.supply) throw new Error("Missing TC SG Component");

            const strategy = tcSg.components.supply.strategy;
            const price = calculateSellingPrice(strategy);

            // Base: 2000
            // Risk Uplift (Execution): 1.25 -> 2500
            // Margin: 50% -> 2500 / 0.5 = 5000

            expect(strategy.baseCost).toBe(2000);
            expect(price).toBe(5000);
            expect(strategy.targetMargin).toBe(0.50);
        });

        test('Sourcing (Item) has high risk coverage', () => {
            const sourceMsg = QUIET_MONEY_MODULES.find(m => m.id === 'SVC-SOURCE-ITEM');
            if (!sourceMsg?.components.supply) throw new Error("Missing Sourcing Strategy");

            const strategy = sourceMsg.components.supply.strategy;

            // Base 300 * 1.20 (Risk) = 360
            // Selling = 360 / (1 - 0.50) = 720

            const price = calculateSellingPrice(strategy);
            expect(price).toBeCloseTo(720);
        });

        test('Assembly (Item) applies correct margin for Handyman work', () => {
            const assemblyItem = QUIET_MONEY_MODULES.find(m => m.id === 'SVC-ASSEMBLY-ITEM');
            if (!assemblyItem?.components.installation) throw new Error("Missing Assembly Strategy");

            const strategy = assemblyItem.components.installation.strategy;

            // Base: 120
            // Risk: 1.25 -> 150
            // Margin: 0.45 -> 150 / 0.55 = 272.72...

            const price = calculateSellingPrice(strategy);
            expect(price).toBeCloseTo(272.73, 1);
            expect(strategy.targetMargin).toBe(0.45);
        });

        test('Design (BOQ) applies High Margin for Liability', () => {
            const boqItem = QUIET_MONEY_MODULES.find(m => m.id === 'SVC-DESIGN-BOQ');
            if (!boqItem?.components.supply) throw new Error("Missing BOQ Strategy");

            const strategy = boqItem.components.supply.strategy;

            // Base: 1200
            // Risk: 1.30 -> 1560
            // Margin: 0.60 -> 1560 / 0.40 = 3900

            const price = calculateSellingPrice(strategy);
            expect(price).toBeCloseTo(3900, 0);
            expect(strategy.targetMargin).toBe(0.60);
        });
    });

});
