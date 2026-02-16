import { convertToMm, formatMmToFeet } from '../lib/units';
import { createPricingStrategy, calculateSellingPrice, analyzeProfit } from '../lib/pricing';
import { QUIET_MONEY_MODULES } from '../data/modules-services';

console.log("--- 1. MILLIMETER TRUTH ---");
const ftInput = 10;
const mm = convertToMm(ftInput, 'ft');
console.log(`Input: ${ftInput} ft`);
console.log(`Output: ${mm} mm`);
console.log(`Check: ${mm === 3048}`);

console.log("\n--- 2. PRICING ENGINE (SHOCK ABSORBER) ---");
const strategy = createPricingStrategy(
    100, // Base Cost
    'SGD',
    'Carpentry',
    'B', // Average Reliability
    'MY', // MY Jurisdiction
    false // Not Import
);
const analysis = analyzeProfit(strategy);
console.log("Strategy:", JSON.stringify(strategy, null, 2));
console.log("Analysis:", JSON.stringify(analysis, null, 2));
console.log(`Check: Selling Price > Adjusted Cost (${analysis.sellingPrice > analysis.adjustedCost})`);

console.log("\n--- 3. QUIET MONEY (SERVICES) ---");
const permit = QUIET_MONEY_MODULES.find(m => m.id === 'SVC-PERMIT-SG');
if (permit && permit.components.supply) {
    const permitPrice = calculateSellingPrice(permit.components.supply.strategy);
    console.log(`Permit (SG) Base: ${permit.components.supply.strategy.baseCost}`);
    console.log(`Permit (SG) Selling: ${permitPrice.toFixed(2)}`);
    console.log(`Margin Protected: ${permitPrice > 2000}`);
}
