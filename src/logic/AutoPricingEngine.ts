/**
 * AutoPricingEngine.ts
 *
 * Millimetre-Precision Pricing Engine.
 * All internal calculations use METRIC units (mm, sqm).
 * Display layer converts to feet/sqft for user readability.
 * 
 * Why mm? Eliminates rounding buffers. A 2,400mm cabinet costs
 * exactly what 2,400mm costs, not what "8 feet" costs.
 */

// ============================================================
// UNIT CONVERSION (Internal: metric | Display: imperial)
// ============================================================

export const CONVERSIONS = {
    MM_TO_FEET: 0.00328084,
    FEET_TO_MM: 304.8,
    SQM_TO_SQFT: 10.7639,
    SQFT_TO_SQM: 0.092903,
    LINEAR_FT_TO_MM: 304.8,
    MM_TO_LINEAR_FT: 0.00328084,
};

export function mmToFeet(mm: number): number { return Math.round(mm * CONVERSIONS.MM_TO_FEET * 100) / 100; }
export function feetToMm(ft: number): number { return Math.round(ft * CONVERSIONS.FEET_TO_MM); }
export function sqmToSqft(sqm: number): number { return Math.round(sqm * CONVERSIONS.SQM_TO_SQFT * 100) / 100; }
export function sqftToSqm(sqft: number): number { return Math.round(sqft * CONVERSIONS.SQFT_TO_SQM * 10000) / 10000; }

// ============================================================
// MATERIAL CATALOG (Known, Fixed Prices)
// ============================================================

export interface CatalogItem {
    id: string;
    name: string;
    brand: string;
    category: 'paint' | 'tile' | 'electrical' | 'plumbing' | 'hardware' | 'laminate' | 'lighting' | 'countertop' | 'aircon' | 'glass' | 'curtain' | 'wallpaper' | 'flooring' | 'adhesive' | 'furniture' | 'fixture' | 'decor' | 'appliance';
    unit: string;
    pricePerUnit: number;
    coveragePerUnit?: number;
    supplier?: string;
}

export const MATERIAL_CATALOG: CatalogItem[] = [
    // PAINT
    { id: 'paint-001', name: 'Odourless All-in-1 (5L)', brand: 'Nippon', category: 'paint', unit: 'litre', pricePerUnit: 13.60, coveragePerUnit: 100 },
    { id: 'paint-002', name: 'Pentalite (5L)', brand: 'Dulux', category: 'paint', unit: 'litre', pricePerUnit: 10.40, coveragePerUnit: 120 },
    { id: 'paint-003', name: 'Jotashield (5L)', brand: 'Jotun', category: 'paint', unit: 'litre', pricePerUnit: 15.80, coveragePerUnit: 90 },
    { id: 'paint-004', name: 'Wash & Wear (5L)', brand: 'Nippon', category: 'paint', unit: 'litre', pricePerUnit: 22.50, coveragePerUnit: 100 },
    { id: 'paint-005', name: 'Ambiance All (5L)', brand: 'Dulux', category: 'paint', unit: 'litre', pricePerUnit: 28.00, coveragePerUnit: 90 },
    { id: 'paint-006', name: 'Sealer 5-in-1 (5L)', brand: 'Nippon', category: 'paint', unit: 'litre', pricePerUnit: 11.20, coveragePerUnit: 130 },
    { id: 'paint-007', name: 'Weatherbond Exterior (5L)', brand: 'Nippon', category: 'paint', unit: 'litre', pricePerUnit: 19.80, coveragePerUnit: 80 },
    { id: 'paint-008', name: 'Wood Stain (1L)', brand: 'Bona', category: 'paint', unit: 'litre', pricePerUnit: 38.00, coveragePerUnit: 120 },

    // TILE
    { id: 'tile-001', name: 'Homogeneous 600x600', brand: 'Niro', category: 'tile', unit: 'sqft', pricePerUnit: 3.50 },
    { id: 'tile-002', name: 'Porcelain 600x600', brand: 'Roman', category: 'tile', unit: 'sqft', pricePerUnit: 5.20 },
    { id: 'tile-003', name: 'Marble Look 800x800', brand: 'Hafary', category: 'tile', unit: 'sqft', pricePerUnit: 8.90 },
    { id: 'tile-004', name: 'Subway 75x150', brand: 'Niro', category: 'tile', unit: 'sqft', pricePerUnit: 2.80 },
    { id: 'tile-005', name: 'Wood Look 200x1200', brand: 'Hafary', category: 'tile', unit: 'sqft', pricePerUnit: 7.50 },
    { id: 'tile-006', name: 'Mosaic Sheet 300x300', brand: 'Hafary', category: 'tile', unit: 'sqft', pricePerUnit: 12.00 },
    { id: 'tile-007', name: 'Terrazzo Look 600x600', brand: 'Niro', category: 'tile', unit: 'sqft', pricePerUnit: 6.80 },
    { id: 'tile-008', name: 'Anti-Slip Outdoor 300x300', brand: 'Roman', category: 'tile', unit: 'sqft', pricePerUnit: 4.50 },
    { id: 'tile-009', name: 'Large Format 1200x600', brand: 'Hafary', category: 'tile', unit: 'sqft', pricePerUnit: 9.80 },

    // ELECTRICAL
    { id: 'elec-001', name: 'LED Downlight 12W', brand: 'Philips', category: 'electrical', unit: 'piece', pricePerUnit: 12.90 },
    { id: 'elec-002', name: 'Switch Socket (White)', brand: 'Schneider', category: 'electrical', unit: 'piece', pricePerUnit: 8.50 },
    { id: 'elec-003', name: 'Switch Socket (Matt Black)', brand: 'Schneider', category: 'electrical', unit: 'piece', pricePerUnit: 14.50 },
    { id: 'elec-004', name: 'LED Panel 24W 600x600', brand: 'Philips', category: 'electrical', unit: 'piece', pricePerUnit: 28.00 },
    { id: 'elec-005', name: 'USB-C Wall Socket', brand: 'Legrand', category: 'electrical', unit: 'piece', pricePerUnit: 32.00 },
    { id: 'elec-006', name: 'Isolator Switch 20A', brand: 'Schneider', category: 'electrical', unit: 'piece', pricePerUnit: 12.00 },
    { id: 'elec-007', name: 'Isolator Switch 45A (Cooker)', brand: 'Schneider', category: 'electrical', unit: 'piece', pricePerUnit: 22.00 },
    { id: 'elec-008', name: 'RCCB 63A 2P', brand: 'ABB', category: 'electrical', unit: 'piece', pricePerUnit: 65.00 },
    { id: 'elec-009', name: 'DB Box 8-Way', brand: 'Schneider', category: 'electrical', unit: 'piece', pricePerUnit: 85.00 },
    { id: 'elec-010', name: 'CAT6 Cable (305m box)', brand: 'Belden', category: 'electrical', unit: 'box', pricePerUnit: 165.00 },

    // LIGHTING
    { id: 'light-001', name: 'LED Strip 3000K (5m)', brand: 'Philips', category: 'lighting', unit: 'roll', pricePerUnit: 38.00 },
    { id: 'light-002', name: 'Aluminium LED Profile (2m)', brand: 'Generic', category: 'lighting', unit: 'piece', pricePerUnit: 12.00 },
    { id: 'light-003', name: 'Track Light 3-Head', brand: 'Philips', category: 'lighting', unit: 'set', pricePerUnit: 89.00 },
    { id: 'light-004', name: 'LED Driver 60W', brand: 'Mean Well', category: 'lighting', unit: 'piece', pricePerUnit: 25.00 },
    { id: 'light-005', name: 'Magnetic Track Rail (1m)', brand: 'Generic', category: 'lighting', unit: 'piece', pricePerUnit: 45.00 },

    // PLUMBING
    { id: 'plumb-001', name: 'Basin Mixer Tap', brand: 'Grohe', category: 'plumbing', unit: 'piece', pricePerUnit: 185.00 },
    { id: 'plumb-002', name: 'Rain Shower Set', brand: 'Grohe', category: 'plumbing', unit: 'set', pricePerUnit: 320.00 },
    { id: 'plumb-003', name: 'Concealed Cistern', brand: 'Geberit', category: 'plumbing', unit: 'piece', pricePerUnit: 280.00 },
    { id: 'plumb-004', name: 'Wall-Hung WC', brand: 'Duravit', category: 'plumbing', unit: 'piece', pricePerUnit: 450.00 },
    { id: 'plumb-005', name: 'Kitchen Sink (Double)', brand: 'Franke', category: 'plumbing', unit: 'piece', pricePerUnit: 380.00 },
    { id: 'plumb-006', name: 'Instant Water Heater', brand: 'Ariston', category: 'plumbing', unit: 'piece', pricePerUnit: 168.00 },
    { id: 'plumb-007', name: 'Floor Trap 150mm', brand: 'Bravat', category: 'plumbing', unit: 'piece', pricePerUnit: 35.00 },
    { id: 'plumb-008', name: 'Long Floor Drain 600mm', brand: 'Bravat', category: 'plumbing', unit: 'piece', pricePerUnit: 85.00 },

    // LAMINATE
    { id: 'lam-001', name: 'Formica Standard', brand: 'Formica', category: 'laminate', unit: 'sqft', pricePerUnit: 2.80 },
    { id: 'lam-002', name: 'Formica Premium', brand: 'Formica', category: 'laminate', unit: 'sqft', pricePerUnit: 4.20 },
    { id: 'lam-003', name: 'Lamitak Standard', brand: 'Lamitak', category: 'laminate', unit: 'sqft', pricePerUnit: 3.50 },
    { id: 'lam-004', name: 'Meganite Solid Surface', brand: 'Meganite', category: 'laminate', unit: 'sqft', pricePerUnit: 18.00 },

    // HARDWARE
    { id: 'hw-001', name: 'Plywood 18mm (Marine)', brand: 'Generic', category: 'hardware', unit: 'sqft', pricePerUnit: 4.50 },
    { id: 'hw-002', name: 'Plywood 12mm (MR Grade)', brand: 'Generic', category: 'hardware', unit: 'sqft', pricePerUnit: 3.20 },
    { id: 'hw-003', name: 'Blum Tandembox Antaro', brand: 'Blum', category: 'hardware', unit: 'set', pricePerUnit: 68.00 },
    { id: 'hw-004', name: 'Blum Soft-Close Hinge', brand: 'Blum', category: 'hardware', unit: 'pair', pricePerUnit: 8.50 },
    { id: 'hw-005', name: 'Hafele Pull-Out Basket', brand: 'Hafele', category: 'hardware', unit: 'piece', pricePerUnit: 120.00 },
    { id: 'hw-006', name: 'Sliding Door Track (2m)', brand: 'Hafele', category: 'hardware', unit: 'set', pricePerUnit: 95.00 },
    { id: 'hw-007', name: 'J-Channel Handle (3m)', brand: 'Generic', category: 'hardware', unit: 'piece', pricePerUnit: 18.00 },

    // COUNTERTOP
    { id: 'ct-001', name: 'Quartz (Caesarstone)', brand: 'Caesarstone', category: 'countertop', unit: 'sqft', pricePerUnit: 28.00 },
    { id: 'ct-002', name: 'Quartz (Silestone)', brand: 'Silestone', category: 'countertop', unit: 'sqft', pricePerUnit: 32.00 },
    { id: 'ct-003', name: 'Sintered Stone (Dekton)', brand: 'Dekton', category: 'countertop', unit: 'sqft', pricePerUnit: 45.00 },
    { id: 'ct-004', name: 'Granite Slab (local)', brand: 'Various', category: 'countertop', unit: 'sqft', pricePerUnit: 15.00 },
    { id: 'ct-005', name: 'Compact Laminate 12mm', brand: 'Formica', category: 'countertop', unit: 'sqft', pricePerUnit: 12.00 },
    { id: 'ct-006', name: 'Solid Surface (Corian)', brand: 'Corian', category: 'countertop', unit: 'sqft', pricePerUnit: 22.00 },

    // GLASS
    { id: 'glass-001', name: 'Tempered Glass 10mm', brand: 'Generic', category: 'glass', unit: 'sqft', pricePerUnit: 18.00 },
    { id: 'glass-002', name: 'Back-Painted Glass', brand: 'Generic', category: 'glass', unit: 'sqft', pricePerUnit: 22.00 },
    { id: 'glass-003', name: 'Mirror 5mm (beveled)', brand: 'Generic', category: 'glass', unit: 'sqft', pricePerUnit: 12.00 },
    { id: 'glass-004', name: 'Shower Screen L-Shape', brand: 'Generic', category: 'glass', unit: 'set', pricePerUnit: 450.00 },

    // FLOORING
    { id: 'floor-001', name: 'SPC Vinyl 5mm', brand: 'Inovar', category: 'flooring', unit: 'sqft', pricePerUnit: 4.80 },
    { id: 'floor-002', name: 'Hybrid Vinyl 6mm', brand: 'Inovar', category: 'flooring', unit: 'sqft', pricePerUnit: 6.50 },
    { id: 'floor-003', name: 'Engineered Timber (Oak)', brand: 'Meister', category: 'flooring', unit: 'sqft', pricePerUnit: 12.00 },
    { id: 'floor-004', name: 'Bamboo Flooring', brand: 'Generic', category: 'flooring', unit: 'sqft', pricePerUnit: 8.50 },

    // ADHESIVE AND GROUT
    { id: 'adh-001', name: 'Tile Adhesive (25kg)', brand: 'Mapei', category: 'adhesive', unit: 'bag', pricePerUnit: 18.00 },
    { id: 'adh-002', name: 'Grout Ultracolor Plus (5kg)', brand: 'Mapei', category: 'adhesive', unit: 'bag', pricePerUnit: 22.00 },
    { id: 'adh-003', name: 'Epoxy Grout Kerapoxy (5kg)', brand: 'Mapei', category: 'adhesive', unit: 'kit', pricePerUnit: 65.00 },
    { id: 'adh-004', name: 'Waterproofing Membrane (20kg)', brand: 'Mapei', category: 'adhesive', unit: 'pail', pricePerUnit: 85.00 },
    { id: 'adh-005', name: 'Silicone Sealant Neutral', brand: 'Bostik', category: 'adhesive', unit: 'tube', pricePerUnit: 8.50 },

    // AIRCON
    { id: 'ac-001', name: 'System 2 (2x9000 BTU)', brand: 'Daikin', category: 'aircon', unit: 'system', pricePerUnit: 2800.00 },
    { id: 'ac-002', name: 'System 3 (3x9000 BTU)', brand: 'Daikin', category: 'aircon', unit: 'system', pricePerUnit: 3600.00 },
    { id: 'ac-003', name: 'System 4 (4x9000 BTU)', brand: 'Mitsubishi', category: 'aircon', unit: 'system', pricePerUnit: 4200.00 },
    { id: 'ac-004', name: 'Trunking Per Run', brand: 'Generic', category: 'aircon', unit: 'run', pricePerUnit: 120.00 },

    // CURTAIN
    { id: 'cur-001', name: 'Day Curtain (per m)', brand: 'Generic', category: 'curtain', unit: 'meter', pricePerUnit: 15.00 },
    { id: 'cur-002', name: 'Blackout Curtain (per m)', brand: 'Generic', category: 'curtain', unit: 'meter', pricePerUnit: 28.00 },
    { id: 'cur-003', name: 'Roller Blind', brand: 'Generic', category: 'curtain', unit: 'sqft', pricePerUnit: 6.50 },
    { id: 'cur-004', name: 'Zebra Blind', brand: 'Generic', category: 'curtain', unit: 'sqft', pricePerUnit: 8.00 },
    { id: 'cur-005', name: 'Curtain Track Ceiling (per m)', brand: 'Silent Gliss', category: 'curtain', unit: 'meter', pricePerUnit: 35.00 },

    // WALLPAPER
    { id: 'wp-001', name: 'PVC Wallpaper (per roll)', brand: 'Generic', category: 'wallpaper', unit: 'roll', pricePerUnit: 45.00 },
    { id: 'wp-002', name: 'Non-Woven (per roll)', brand: 'Generic', category: 'wallpaper', unit: 'roll', pricePerUnit: 65.00 },
    { id: 'wp-003', name: 'Korean Wallpaper (per roll)', brand: 'LG Hausys', category: 'wallpaper', unit: 'roll', pricePerUnit: 85.00 },

    // ══════════════════════════════════════════════════════════
    // FF&E (Furniture, Fixtures & Equipment)
    // ══════════════════════════════════════════════════════════

    // FURNITURE
    { id: 'furn-001', name: '3-Seater Sofa (Fabric)', brand: 'Castlery', category: 'furniture', unit: 'piece', pricePerUnit: 1899.00 },
    { id: 'furn-002', name: '3-Seater Sofa (Leather)', brand: 'Castlery', category: 'furniture', unit: 'piece', pricePerUnit: 3499.00 },
    { id: 'furn-003', name: 'Dining Table 6-Seater (Oak)', brand: 'Scanteak', category: 'furniture', unit: 'piece', pricePerUnit: 2200.00 },
    { id: 'furn-004', name: 'Dining Table 4-Seater (Sintered)', brand: 'Castlery', category: 'furniture', unit: 'piece', pricePerUnit: 1599.00 },
    { id: 'furn-005', name: 'Dining Chair (Set of 2)', brand: 'Castlery', category: 'furniture', unit: 'set', pricePerUnit: 499.00 },
    { id: 'furn-006', name: 'Queen Bed Frame (Platform)', brand: 'FortyTwo', category: 'furniture', unit: 'piece', pricePerUnit: 599.00 },
    { id: 'furn-007', name: 'Queen Mattress (Pocketed Spring)', brand: 'Sealy', category: 'furniture', unit: 'piece', pricePerUnit: 1299.00 },
    { id: 'furn-008', name: 'Study Desk 120cm', brand: 'IKEA', category: 'furniture', unit: 'piece', pricePerUnit: 349.00 },
    { id: 'furn-009', name: 'TV Console 180cm', brand: 'Castlery', category: 'furniture', unit: 'piece', pricePerUnit: 899.00 },
    { id: 'furn-010', name: 'Shoe Cabinet (Slim)', brand: 'FortyTwo', category: 'furniture', unit: 'piece', pricePerUnit: 289.00 },
    { id: 'furn-011', name: 'Coffee Table (Round)', brand: 'Castlery', category: 'furniture', unit: 'piece', pricePerUnit: 699.00 },

    // FIXTURE (Bathroom & Kitchen Accessories)
    { id: 'fix-001', name: 'Towel Bar 600mm', brand: 'Grohe', category: 'fixture', unit: 'piece', pricePerUnit: 65.00 },
    { id: 'fix-002', name: 'Robe Hook (Double)', brand: 'Grohe', category: 'fixture', unit: 'piece', pricePerUnit: 35.00 },
    { id: 'fix-003', name: 'Toilet Paper Holder', brand: 'Grohe', category: 'fixture', unit: 'piece', pricePerUnit: 42.00 },
    { id: 'fix-004', name: 'Soap Dispenser (Wall)', brand: 'Grohe', category: 'fixture', unit: 'piece', pricePerUnit: 58.00 },
    { id: 'fix-005', name: 'Bathroom Mirror Cabinet 800mm', brand: 'Duravit', category: 'fixture', unit: 'piece', pricePerUnit: 520.00 },
    { id: 'fix-006', name: 'Kitchen Pull-Out Tap', brand: 'Grohe', category: 'fixture', unit: 'piece', pricePerUnit: 350.00 },
    { id: 'fix-007', name: 'Bidet Spray Set', brand: 'Bravat', category: 'fixture', unit: 'set', pricePerUnit: 85.00 },

    // DECOR
    { id: 'dec-001', name: 'Pendant Light (Dining)', brand: 'Various', category: 'decor', unit: 'piece', pricePerUnit: 280.00 },
    { id: 'dec-002', name: 'Ceiling Fan 52" (DC Motor)', brand: 'Fanco', category: 'decor', unit: 'piece', pricePerUnit: 389.00 },
    { id: 'dec-003', name: 'Area Rug 160x230cm', brand: 'Various', category: 'decor', unit: 'piece', pricePerUnit: 450.00 },
    { id: 'dec-004', name: 'Wall Art Print (Framed)', brand: 'Various', category: 'decor', unit: 'piece', pricePerUnit: 120.00 },
    { id: 'dec-005', name: 'Indoor Plant (Fiddle Leaf Fig)', brand: 'Various', category: 'decor', unit: 'piece', pricePerUnit: 85.00 },

    // APPLIANCE
    { id: 'app-001', name: 'Built-In Oven 60cm', brand: 'Bosch', category: 'appliance', unit: 'piece', pricePerUnit: 1299.00 },
    { id: 'app-002', name: 'Induction Hob 3-Zone', brand: 'Bosch', category: 'appliance', unit: 'piece', pricePerUnit: 1599.00 },
    { id: 'app-003', name: 'Hood (Slim 90cm)', brand: 'Bosch', category: 'appliance', unit: 'piece', pricePerUnit: 899.00 },
    { id: 'app-004', name: 'Washer Dryer Combo 8/5kg', brand: 'Samsung', category: 'appliance', unit: 'piece', pricePerUnit: 1199.00 },
    { id: 'app-005', name: 'Fridge 2-Door 340L', brand: 'Samsung', category: 'appliance', unit: 'piece', pricePerUnit: 899.00 },
    { id: 'app-006', name: 'Dishwasher 60cm', brand: 'Bosch', category: 'appliance', unit: 'piece', pricePerUnit: 1399.00 },
    { id: 'app-007', name: 'Microwave Built-In', brand: 'Bosch', category: 'appliance', unit: 'piece', pricePerUnit: 599.00 },
];

// ============================================================
// LABOUR BENCHMARKS (Variable but bounded)
// ============================================================

export interface LabourRate {
    trade: string;
    unit: string;              // e.g., "sqft", "point", "linear ft"
    rateMin: number;           // SGD
    rateMax: number;           // SGD
    rateAvg: number;           // SGD (platform benchmark)
    notes?: string;
}

export const LABOUR_BENCHMARKS: LabourRate[] = [
    // All area-based rates stored as $/sqm internally, displayed as $/sqft
    { trade: 'Painting', unit: 'sqm', rateMin: 8.61, rateMax: 12.92, rateAvg: 10.76, notes: '2 coats + primer. Display: $0.80–$1.20/sqft' },
    { trade: 'Tiling (Floor)', unit: 'sqm', rateMin: 43.06, rateMax: 86.11, rateAvg: 59.20, notes: 'Lay + grout. Display: $4–$8/sqft' },
    { trade: 'Tiling (Wall)', unit: 'sqm', rateMin: 53.82, rateMax: 107.64, rateAvg: 75.35, notes: 'Wall tiling. Display: $5–$10/sqft' },
    { trade: 'Electrical (Point)', unit: 'point', rateMin: 25.00, rateMax: 45.00, rateAvg: 35.00, notes: 'Per switch/socket point' },
    { trade: 'Plumbing (Point)', unit: 'point', rateMin: 80.00, rateMax: 150.00, rateAvg: 110.00, notes: 'Per water point' },
    // Linear rates stored as $/mm internally
    { trade: 'Carpentry', unit: 'mm', rateMin: 0.2625, rateMax: 0.3937, rateAvg: 0.3117, notes: 'Per mm linear. Display: $80–$120/linear ft' },
    { trade: 'Epoxy Grouting', unit: 'sqm', rateMin: 16.15, rateMax: 26.91, rateAvg: 19.38, notes: 'Display: $1.50–$2.50/sqft' },
];

// ============================================================
// AUTO-PRICING CALCULATOR
// ============================================================

export interface AutoPriceInput {
    trade: string;
    quantity: number;          // sqft, points, linear ft, etc.
    materialId?: string;       // Catalog item ID
    coats?: number;            // For paint
    labourTier?: 'min' | 'avg' | 'max';  // Which rate to use
}

export interface AutoPriceResult {
    materialCost: number;
    labourCost: number;
    rentalCost: number;
    totalCost: number;
    breakdown: {
        materialName?: string;
        materialUnitPrice?: number;
        materialQty?: number;
        labourRate: number;
        labourUnit: string;
        quantity: number;
    };
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';  // How confident we are in the price
    source: 'CATALOG' | 'BENCHMARK' | 'RFQ_REQUIRED';
}

export function calculateAutoPrice(input: AutoPriceInput): AutoPriceResult {
    const labour = LABOUR_BENCHMARKS.find(l => l.trade === input.trade);
    const material = input.materialId
        ? MATERIAL_CATALOG.find(m => m.id === input.materialId)
        : undefined;

    if (!labour) {
        return {
            materialCost: 0,
            labourCost: 0,
            rentalCost: 0,
            totalCost: 0,
            breakdown: { labourRate: 0, labourUnit: 'unknown', quantity: input.quantity },
            confidence: 'LOW',
            source: 'RFQ_REQUIRED'
        };
    }

    const tier = input.labourTier ?? 'avg';
    const labourRate = tier === 'min' ? labour.rateMin : tier === 'max' ? labour.rateMax : labour.rateAvg;
    const labourCost = input.quantity * labourRate;

    let materialCost = 0;
    let materialQty = input.quantity;

    if (material) {
        if (material.coveragePerUnit && material.coveragePerUnit > 0) {
            // Paint: need to calculate litres from sqft
            const litresNeeded = (input.quantity / material.coveragePerUnit) * (input.coats ?? 2);
            materialCost = litresNeeded * material.pricePerUnit;
            materialQty = Math.ceil(litresNeeded);
        } else {
            materialCost = input.quantity * material.pricePerUnit;
        }
    }

    const totalCost = materialCost + labourCost;

    return {
        materialCost: Math.round(materialCost * 100) / 100,
        labourCost: Math.round(labourCost * 100) / 100,
        rentalCost: 0,
        totalCost: Math.round(totalCost * 100) / 100,
        breakdown: {
            materialName: material?.name,
            materialUnitPrice: material?.pricePerUnit,
            materialQty,
            labourRate,
            labourUnit: labour.unit,
            quantity: input.quantity,
        },
        confidence: material ? 'HIGH' : 'MEDIUM',
        source: material ? 'CATALOG' : 'BENCHMARK'
    };
}
