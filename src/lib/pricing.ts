import {
    PricingStrategy,
    Currency,
    Jurisdiction,
    ComponentPricing
} from '@/types/core';

// --- THE 4-LAYER SHOCK ABSORBER LOGIC ---

/**
 * Calculates the internal 'True Cost' before profit.
 * Formula: Adjusted Cost = (Base * (1 + Volatility)) + Logistics
 */
export function calculateAdjustedCost(strategy: PricingStrategy): number {
    const bufferedCost = strategy.baseCost * (1 + strategy.volatilityBuffer);
    const totalCost = bufferedCost + strategy.logisticsAdder;
    return totalCost;
}

/**
 * Calculates the final Selling Price.
 * Formula: Selling = (AdjustedCost * RiskFactor) / (1 - TargetMargin)
 */
export function calculateSellingPrice(strategy: PricingStrategy): number {
    const adjustedCost = calculateAdjustedCost(strategy);
    const burdenedCost = adjustedCost * strategy.executionRiskFactor;

    // Prevent divide by zero if margin is 100% (impossible but safe math)
    if (strategy.targetMargin >= 1) throw new Error("Margin cannot be 100% or more.");

    const sellingPrice = burdenedCost / (1 - strategy.targetMargin);
    return sellingPrice;
}

/**
 * The "Geo-Arbitrage" Profit Analyzer.
 * Returns the breakdown of where money is made.
 */
export function analyzeProfit(strategy: PricingStrategy) {
    const adjustedCost = calculateAdjustedCost(strategy);
    const sellingPrice = calculateSellingPrice(strategy);
    const grossProfit = sellingPrice - adjustedCost;

    return {
        adjustedCost,
        sellingPrice,
        grossProfit,
        marginPercent: grossProfit / sellingPrice
    };
}

// --- FACTORY: Creates a Pricing Strategy from Static Data ---
// This acts as the "Link" between Static Truth (DB) and Reasoning (CPU)

import { getVolatilityBuffer } from '@/data/knowledge-base';

export function createPricingStrategy(
    baseCost: number,
    currency: Currency,
    category: string,
    supplierReliability: 'A' | 'B' | 'C' | 'F',
    jurisdiction: Jurisdiction,
    isImport: boolean
): PricingStrategy {

    // 1. Pull Rules (Static Truth)
    const volatilityBuffer = getVolatilityBuffer(category, supplierReliability, isImport);

    // 2. Define Logistics (Should come from a Logic Table, hardcoded for MVP)
    let logisticsAdder = 0;
    if (isImport) logisticsAdder += 50; // +$50 flat import friction
    if (jurisdiction === 'CROSS_BORDER') logisticsAdder += 100; // Freight

    // 3. Define Execution Risk & Margin (The Strategy)
    // MY = Efficiency (Low Margin, High Risk Buffer)
    // SG = Brand (High Margin, Low Risk Buffer)
    let targetMargin = 0.30;
    let executionRiskFactor = 1.10;

    if (jurisdiction === 'SG') {
        targetMargin = 0.45; // Brand Premium
        executionRiskFactor = 1.05; // Lower execution risk
    } else if (jurisdiction === 'MY') {
        targetMargin = 0.25; // Volume play
        executionRiskFactor = 1.15; // Higher on-site variance
    }

    return {
        baseCost,
        volatilityBuffer,
        logisticsAdder,
        targetMargin,
        executionRiskFactor,
        currency
    };
}

/**
 * Calculates the final price for a CostItem based on target jurisdiction.
 * Dynamically adjusts Margin & Risk based on where it's being sold (SG vs MY).
 */
export function calculateItemPrice(item: any, jurisdiction: Jurisdiction): number {
    // 1. Get Component (Priority: Supply -> Installation -> Fabrication)
    const component = item.components?.supply || item.components?.installation || item.components?.fabrication;
    if (!component || !component.strategy) return 0;

    // 2. Clone Strategy (Ephemeral adjustment)
    const strategy = { ...component.strategy };

    // 3. Apply Jurisdiction Logic (The Pricing Engine)
    if (jurisdiction === 'SG') {
        strategy.targetMargin = 0.45; // Brand Premium
        strategy.executionRiskFactor = 1.05;
    } else {
        // MY
        strategy.targetMargin = 0.25; // Volume play
        strategy.executionRiskFactor = 1.15;
    }

    // 4. Calculate
    return calculateSellingPrice(strategy);
}
