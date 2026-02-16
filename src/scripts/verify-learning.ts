import { parseInvoice, detectCostDrift } from '../lib/ai/cost-learning';

async function runTest() {
    console.log("--- 1. UPLOADING INVOICE (SIMULATED) ---");
    const invoice = await parseInvoice("dummy.pdf");
    console.log(`Parsed Invoice: ${invoice.id} from ${invoice.supplierName}`);
    console.log(`Line Items: ${invoice.items.length}`);

    console.log("\n--- 2. DETECTING COST DRIFT ---");
    const recommendations = detectCostDrift(invoice);

    if (recommendations.length === 0) {
        console.error("FAIL: No drift detected. Expected Plywood price hike.");
    } else {
        recommendations.forEach(rec => {
            console.log(`[ALERT] ${rec.materialName} (${rec.materialId})`);
            console.log(`Old: ${rec.oldCost.toFixed(2)} -> New: ${rec.newCost.toFixed(2)}`);
            console.log(`Drift: ${rec.driftPercent.toFixed(2)}% [${rec.severity}]`);
        });
        console.log("SUCCESS: Drift detected correctly.");
    }
}

runTest();
