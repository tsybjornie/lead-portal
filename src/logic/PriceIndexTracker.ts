/**
 * PriceIndexTracker.ts
 *
 * Captures real cost data from every completed project.
 * Over time, this becomes Roof's proprietary "Price Oracle" —
 * the PropertyGuru equivalent for renovation costs.
 */

// ============================================================
// PRICE SNAPSHOT (Captured after every completed project)
// ============================================================

export interface PriceSnapshot {
    id: string;
    trade: string;                    // e.g. "Carpentry", "Painting", "Tiling"
    unit: string;                     // e.g. "sqft", "linear ft", "point"
    actualCostPerUnit: number;        // What was actually paid
    materialCostPerUnit: number;      // Material component
    labourCostPerUnit: number;        // Labour component
    region: string;                   // e.g. "Punggol", "Tampines", "Bukit Timah"
    propertyType: 'HDB' | 'Condo' | 'Landed' | 'Commercial';
    projectId: string;
    capturedAt: string;               // ISO date
    quarter: string;                  // e.g. "2026-Q1"
}

// ============================================================
// PRICE INDEX (Aggregated from snapshots)
// ============================================================

export interface PriceIndex {
    trade: string;
    unit: string;
    currentAvg: number;
    previousAvg: number;             // Last quarter
    changePercent: number;           // +8% or -3%
    trend: 'UP' | 'DOWN' | 'STABLE';
    sampleSize: number;              // How many data points
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    lastUpdated: string;
    breakdown: {
        materialAvg: number;
        labourAvg: number;
    };
    byRegion?: Record<string, number>;       // Region → avg cost
    byPropertyType?: Record<string, number>; // Property type → avg cost
}

// ============================================================
// DEMO DATA (Seeded for first launch, refined by real projects)
// ============================================================

export const SEED_INDEX: PriceIndex[] = [
    {
        trade: 'Carpentry',
        unit: 'linear ft',
        currentAvg: 95,
        previousAvg: 88,
        changePercent: 8.0,
        trend: 'UP',
        sampleSize: 142,
        confidence: 'HIGH',
        lastUpdated: '2026-03-01',
        breakdown: { materialAvg: 35, labourAvg: 60 },
        byRegion: { 'Punggol': 98, 'Tampines': 92, 'Bukit Timah': 110 },
        byPropertyType: { 'HDB': 90, 'Condo': 100, 'Landed': 115 },
    },
    {
        trade: 'Painting',
        unit: 'sqft',
        currentAvg: 1.80,
        previousAvg: 1.75,
        changePercent: 2.9,
        trend: 'STABLE',
        sampleSize: 318,
        confidence: 'HIGH',
        lastUpdated: '2026-03-01',
        breakdown: { materialAvg: 0.55, labourAvg: 1.25 },
    },
    {
        trade: 'Tiling (Floor)',
        unit: 'sqft',
        currentAvg: 8.50,
        previousAvg: 8.00,
        changePercent: 6.3,
        trend: 'UP',
        sampleSize: 207,
        confidence: 'HIGH',
        lastUpdated: '2026-03-01',
        breakdown: { materialAvg: 3.50, labourAvg: 5.00 },
    },
    {
        trade: 'Electrical',
        unit: 'point',
        currentAvg: 38,
        previousAvg: 35,
        changePercent: 8.6,
        trend: 'UP',
        sampleSize: 89,
        confidence: 'MEDIUM',
        lastUpdated: '2026-03-01',
        breakdown: { materialAvg: 12, labourAvg: 26 },
    },
    {
        trade: 'Plumbing',
        unit: 'point',
        currentAvg: 115,
        previousAvg: 110,
        changePercent: 4.5,
        trend: 'UP',
        sampleSize: 64,
        confidence: 'MEDIUM',
        lastUpdated: '2026-03-01',
        breakdown: { materialAvg: 30, labourAvg: 85 },
    },
    {
        trade: 'Epoxy Grouting',
        unit: 'sqft',
        currentAvg: 1.80,
        previousAvg: 1.88,
        changePercent: -4.3,
        trend: 'DOWN',
        sampleSize: 53,
        confidence: 'MEDIUM',
        lastUpdated: '2026-03-01',
        breakdown: { materialAvg: 0.40, labourAvg: 1.40 },
    },
];

// ============================================================
// FUNCTIONS
// ============================================================

/**
 * Ingests a completed project's actual costs into the index
 */
export function ingestPriceSnapshot(
    snapshots: PriceSnapshot[],
    existingIndex: PriceIndex[]
): PriceIndex[] {
    const updated = [...existingIndex];

    for (const snap of snapshots) {
        const idx = updated.findIndex(i => i.trade === snap.trade);
        if (idx >= 0) {
            const entry = updated[idx];
            // Weighted rolling average
            const totalSamples = entry.sampleSize + 1;
            entry.previousAvg = entry.currentAvg;
            entry.currentAvg = ((entry.currentAvg * entry.sampleSize) + snap.actualCostPerUnit) / totalSamples;
            entry.currentAvg = Math.round(entry.currentAvg * 100) / 100;
            entry.sampleSize = totalSamples;
            entry.changePercent = Math.round(((entry.currentAvg - entry.previousAvg) / entry.previousAvg) * 1000) / 10;
            entry.trend = entry.changePercent > 3 ? 'UP' : entry.changePercent < -3 ? 'DOWN' : 'STABLE';
            entry.lastUpdated = new Date().toISOString();
            entry.confidence = totalSamples > 100 ? 'HIGH' : totalSamples > 30 ? 'MEDIUM' : 'LOW';
        }
    }

    return updated;
}

/**
 * Returns a human-readable summary for the ID's dashboard
 */
export function getMarketSummary(index: PriceIndex[]): string {
    const rising = index.filter(i => i.trend === 'UP').map(i => i.trade);
    const falling = index.filter(i => i.trend === 'DOWN').map(i => i.trade);

    let summary = '';
    if (rising.length) summary += `📈 Rising: ${rising.join(', ')}. `;
    if (falling.length) summary += `📉 Falling: ${falling.join(', ')}. `;
    if (!rising.length && !falling.length) summary = '📊 All trades stable this quarter.';

    return summary.trim();
}
