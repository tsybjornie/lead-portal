/**
 * Types Index
 * Re-export all types for clean imports
 */

// Core types
export * from './core';

// Company settings
export * from './company';

// Quote lifecycle
export * from './quote';

// Trades / Execution layer - Types
export type {
    TradeCategory,
    TradeProfile,
    RiskLevel,
    GeoarbitrageLevel,
    TradeItem,
} from './trades';

// Note: MeasurementType from trades.ts is renamed to TradeMeasurementType to avoid conflict with core.ts
export type { MeasurementType as TradeMeasurementType } from './trades';

// Trades / Execution layer - Values (constants and functions)
export {
    TRADE_PROFILES,
    getTradeProfile,
    getMarginFloor,
    getMarginTarget,
    getRecommendedBuffer,
    isGeoarbitrageCandidate,
    getVariationProneTrades,
    getHighRiskTrades,
} from './trades';

// Commission & Claims
export * from './commission';

// Singapore-Specific Compliance
export * from './sg-demolition';

// Site Protection & Preliminaries
export * from './site-protection';

// Execution Modules (Access, MEP, Wall Finish, HDB Permit)
export * from './execution-modules';

// Compliance Engine (Validation, Auto-Add, Access Decision)
export * from './compliance-engine';

// Team Performance (Admin Dashboard)
export * from './team-performance';

// Reviews & Quality (Customer, Vendor, Defects)
export * from './reviews';

// Subscription & Access Control
export * from './subscription';
