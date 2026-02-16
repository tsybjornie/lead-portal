export type Jurisdiction = 'MY' | 'SG' | 'CROSS_BORDER';
export type Currency = 'MYR' | 'SGD';
export type MeasurementType = 'Linear' | 'Area' | 'Volume' | 'Unit' | 'Point';
export type ComponentType = 'Supply' | 'Fabrication' | 'Installation';
export type ReliabilityScore = 'A' | 'B' | 'C' | 'F';

// --- THE MILLIMETER DIRECTIVE ---
// All "number" types in costs referring to dimensions MUST be in mm, mm2, mm3
export type Millimeter = number;
export type SquareMillimeter = number;
export type CubicMillimeter = number;

// --- SUPPLIER DATA CORE ---
export interface Supplier {
    id: string;
    name: string;
    jurisdiction: Jurisdiction;
    reliability: ReliabilityScore;
    paymentTerms: string;
    hiddenPainFields?: {
        typicalExtrasHistory?: string;
        transportIssues?: string;
    };
}

export interface SupplierCostRecord {
    supplierId: string;
    itemId: string;

    // Raw Cost (Verification Layer)
    baseCost: number;
    currency: Currency;
    measurementUnit: MeasurementType; // Must match Item's type

    lastUpdated: string; // ISO Date
    validityDays: number;

    logistics: {
        model: 'Included' | 'FlatRate' | 'PerUnit' | 'PerTrip';
        cost: number;
    }
}

// --- PRICING ENGINE SCHEMA ---
export interface PricingStrategy {
    // Layer 1: Base
    baseCost: number;

    // Layer 2: Shock Absorbers
    volatilityBuffer: number; // % (e.g. 0.15)
    logisticsAdder: number;   // Flat or Unit based

    // Computed Layer: Adjusted Cost
    // adjustedCost = (baseCost * (1+buffer)) + logistics

    // Layer 3: Profit
    targetMargin: number; // % (e.g. 0.35)

    // Layer 4: Execution Risk (Jurisdiction specific)
    executionRiskFactor: number; // Multiplier (e.g. 1.05)

    currency: Currency;
}

export interface ComponentPricing {
    strategy: PricingStrategy;
    jurisdiction: Jurisdiction;
    source?: {
        supplierId: string;
        isVerified: boolean;
        isStale?: boolean;
    };
}

// --- MAIN ITEM SCHEMA ---
export interface CostItem {
    id: string;
    name: string;
    category: string; // For Buffer Matrix Lookup
    measurementType: MeasurementType;

    // The Composite Split
    components: {
        supply?: ComponentPricing;
        fabrication?: ComponentPricing;
        installation?: ComponentPricing;
    };

    exclusions: string[];
}
