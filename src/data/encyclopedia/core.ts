// Material Encyclopedia — Core Types & Interfaces

// ============================================================
// MATERIAL ENCYCLOPEDIA — World's Most Complete Design Reference
// Shared data source for Sequence (browse) and Dispatch (spec)
// ============================================================

// ── TYPES ──

export interface SupplierInfo {
    supplierName: string; // Who carries it
    supplierCountry: string; // Where supplier is based
    supplierCity?: string; // City if relevant
    costPrice: string; // Trade/wholesale price (designer sees this)
    retailPrice: string; // Client-facing price
    unit: string; // per sqft, per sqm, per sheet, per pc, per lin.m
    designerMarkup: number; // Markup percentage (e.g. 15 = 15%)
    leadTime: string; // e.g. "3-5 days", "4-6 weeks (import)"
    moq?: string; // Minimum order quantity if applicable
    shipping?: string; // e.g. "Local pickup", "Sea freight 6-8 weeks"
    installRate?: string; // Installation cost per unit
    installUnit?: string; // e.g. "per sqft", "per panel"
    notes?: string; // Special notes (fragile, requires specialist, etc.)
}

export interface MaterialEntry {
    name: string;
    origin?: string;
    priceTier?: string; // $ to $$$$$
    characteristics?: string;
    janka?: number; // For wood
    hardness?: string;
    category?: string;
    imageUrl?: string; // Visual reference image
    referenceCostPerUnit?: number; // Parsed numeric cost for auto-fill
    referenceUnit?: string; // e.g. 'sqft', 'sheet', 'lm'
    // Supplier & Pricing (populated when connected to vendor network)
    suppliers?: SupplierInfo[]; // Can have multiple suppliers
    primarySupplier?: SupplierInfo; // Default/recommended supplier
}

export interface MotifEntry {
    name: string;
    origin: string;
    description: string;
    region: string;
    usedIn?: string;
}

export interface MaterialSelection {
    id: string; // Unique selection ID
    tradeCategory: string; // e.g. "Natural Stone", "Carpentry"
    materialType: string; // e.g. "Marble", "Teak"
    selectedItem: string; // e.g. "Calacatta Oro"
    selectedSupplier?: SupplierInfo;
    room?: string; // e.g. "Master Bathroom"
    quantity?: string; // e.g. "42 sqft"
    costTotal?: number; // Calculated cost price
    retailTotal?: number; // Calculated retail (with markup)
    designerProfit?: number; // retailTotal - costTotal
    notes?: string;
    status: 'draft' | 'quoted' | 'approved' | 'ordered' | 'delivered' | 'installed';

    // Override tracking (reference vs actual supplier quote)
    referenceCost?: number; // Encyclopedia reference price per unit
    overrideCost?: number; // Actual supplier quote price per unit
    costVariance?: number; // % difference: (override - reference) / reference
    overrideNote?: string; // Reason/source: e.g. "Stone Amperor quote #12345"
    overrideAt?: string; // ISO timestamp of override
}
