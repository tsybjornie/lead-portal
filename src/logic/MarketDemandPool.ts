/**
 * MarketDemandPool.ts
 *
 * Real-time Demand-Supply tracker for the Singapore renovation market.
 * Every quote = demand signal. Every available vendor = supply signal.
 * When demand > supply → prices rise. When supply > demand → prices soften.
 *
 * This is Roof's moat. No one else sees every quote and every dispatch.
 */

// ============================================================
// DEMAND SIGNAL (From every quote entering the system)
// ============================================================

export interface DemandSignal {
    id: string;
    trade: string;                     // "Carpentry", "Painting", etc.
    region: string;                    // "Punggol", "Tampines", etc.
    propertyType: 'HDB' | 'Condo' | 'Landed';
    quantityMm?: number;              // For linear trades (mm)
    quantitySqm?: number;             // For area trades (sqm)
    quantityPoints?: number;          // For point-based trades
    requestedStartDate: string;       // When client wants work to begin
    projectId: string;
    createdAt: string;
    status: 'OPEN' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';
}

// ============================================================
// SUPPLY SIGNAL (From every vendor on the platform)
// ============================================================

export interface SupplySignal {
    vendorId: string;
    trade: string;
    regions: string[];                 // Where they're willing to work
    availableFrom: string;             // Earliest available date
    capacityPerWeek: number;          // Hours or units they can handle
    karmaTier: 'GOLD' | 'SILVER' | 'BRONZE' | 'RISK';
    currentBookings: number;          // Active jobs right now
    maxConcurrentJobs: number;        // How many jobs they can run at once
    lastActiveAt: string;
}

// ============================================================
// MARKET PULSE (Aggregated live view)
// ============================================================

export interface MarketPulse {
    trade: string;
    region: string;
    openDemand: number;                // Jobs waiting for vendors
    availableSupply: number;           // Vendors available
    ratio: number;                     // demand / supply (>1 = tight market)
    pressureLevel: 'SURPLUS' | 'BALANCED' | 'TIGHT' | 'CRITICAL';
    suggestedRate: number;             // Dynamic rate based on D/S
    baseRate: number;                  // Normal benchmark rate
    surgeMultiplier: number;           // 1.0 = normal, 1.2 = +20% surge
    insight: string;                   // Human-readable summary
}

// ============================================================
// MARKET ENGINE
// ============================================================

/**
 * Calculates the market pulse for a given trade + region
 */
export function calculateMarketPulse(
    trade: string,
    region: string,
    demands: DemandSignal[],
    supplies: SupplySignal[],
    baseRate: number
): MarketPulse {
    const openDemand = demands.filter(
        d => d.trade === trade && d.region === region && d.status === 'OPEN'
    ).length;

    const availableSupply = supplies.filter(
        s => s.trade === trade &&
            s.regions.includes(region) &&
            s.currentBookings < s.maxConcurrentJobs
    ).length;

    const ratio = availableSupply > 0 ? openDemand / availableSupply : 99;

    let pressureLevel: MarketPulse['pressureLevel'];
    let surgeMultiplier: number;

    if (ratio <= 0.5) {
        pressureLevel = 'SURPLUS';
        surgeMultiplier = 0.9;  // Prices soften 10%
    } else if (ratio <= 1.5) {
        pressureLevel = 'BALANCED';
        surgeMultiplier = 1.0;
    } else if (ratio <= 3.0) {
        pressureLevel = 'TIGHT';
        surgeMultiplier = 1.15; // +15% surge
    } else {
        pressureLevel = 'CRITICAL';
        surgeMultiplier = 1.30; // +30% surge
    }

    const suggestedRate = Math.round(baseRate * surgeMultiplier * 100) / 100;

    const insightMap: Record<MarketPulse['pressureLevel'], string> = {
        SURPLUS: `${trade} in ${region}: Supply exceeds demand. Good time to book — rates are soft.`,
        BALANCED: `${trade} in ${region}: Market is balanced. Standard rates apply.`,
        TIGHT: `${trade} in ${region}: High demand. Consider scheduling 2-3 weeks out for better rates.`,
        CRITICAL: `${trade} in ${region}: Critical shortage. BTO wave detected. Rates elevated +${Math.round((surgeMultiplier - 1) * 100)}%.`,
    };

    return {
        trade,
        region,
        openDemand,
        availableSupply,
        ratio: Math.round(ratio * 100) / 100,
        pressureLevel,
        suggestedRate,
        baseRate,
        surgeMultiplier,
        insight: insightMap[pressureLevel],
    };
}

// ============================================================
// DEMO: SEED DATA  
// ============================================================

export const SEED_DEMAND: DemandSignal[] = [
    { id: 'd1', trade: 'Carpentry', region: 'Punggol', propertyType: 'HDB', quantityMm: 12000, requestedStartDate: '2026-03-15', projectId: 'p1', createdAt: '2026-03-01', status: 'OPEN' },
    { id: 'd2', trade: 'Carpentry', region: 'Punggol', propertyType: 'HDB', quantityMm: 8500, requestedStartDate: '2026-03-20', projectId: 'p2', createdAt: '2026-03-02', status: 'OPEN' },
    { id: 'd3', trade: 'Carpentry', region: 'Punggol', propertyType: 'HDB', quantityMm: 15000, requestedStartDate: '2026-03-18', projectId: 'p3', createdAt: '2026-03-03', status: 'OPEN' },
    { id: 'd4', trade: 'Painting', region: 'Tampines', propertyType: 'HDB', quantitySqm: 85, requestedStartDate: '2026-03-10', projectId: 'p4', createdAt: '2026-03-01', status: 'OPEN' },
    { id: 'd5', trade: 'Tiling (Floor)', region: 'Bukit Timah', propertyType: 'Condo', quantitySqm: 120, requestedStartDate: '2026-04-01', projectId: 'p5', createdAt: '2026-03-05', status: 'OPEN' },
];

export const SEED_SUPPLY: SupplySignal[] = [
    { vendorId: 'v1', trade: 'Carpentry', regions: ['Punggol', 'Sengkang'], availableFrom: '2026-03-10', capacityPerWeek: 40, karmaTier: 'GOLD', currentBookings: 2, maxConcurrentJobs: 3, lastActiveAt: '2026-03-05' },
    { vendorId: 'v2', trade: 'Carpentry', regions: ['Punggol', 'Tampines'], availableFrom: '2026-03-20', capacityPerWeek: 40, karmaTier: 'SILVER', currentBookings: 3, maxConcurrentJobs: 3, lastActiveAt: '2026-03-04' },
    { vendorId: 'v3', trade: 'Painting', regions: ['Tampines', 'Bedok', 'Pasir Ris'], availableFrom: '2026-03-08', capacityPerWeek: 60, karmaTier: 'GOLD', currentBookings: 1, maxConcurrentJobs: 4, lastActiveAt: '2026-03-05' },
    { vendorId: 'v4', trade: 'Tiling (Floor)', regions: ['Bukit Timah', 'Novena', 'Newton'], availableFrom: '2026-03-15', capacityPerWeek: 30, karmaTier: 'SILVER', currentBookings: 1, maxConcurrentJobs: 2, lastActiveAt: '2026-03-03' },
];
