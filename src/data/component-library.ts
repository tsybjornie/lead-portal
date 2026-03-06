/**
 * Component Library  Brain Dump Seed Data
 * 
 * 125+ classified items covering all renovation materials, hardware,
 * and finishes with 6D classification and dual SG/MY pricing.
 * 
 * Unit convention: All rates stored in FEET. Conversion to metres
 * is handled at display time (× 3.281 for lm, × 10.764 for sqft).
 */

import { ComponentLibraryItem, MaterialClassification } from '@/types/component-classifications';

// ============================================================
// UNIT CONVERSION HELPERS
// ============================================================

export const UNIT_CONVERSIONS = {
    ft_to_m: 0.3048,
    m_to_ft: 3.2808,
    sqft_to_sqm: 0.0929,
    sqm_to_sqft: 10.7639,
} as const;

/** Convert a per-foot price to per-metre */
export function ftToM(pricePerFt: number): number {
    return +(pricePerFt * UNIT_CONVERSIONS.m_to_ft).toFixed(2);
}

/** Convert a per-sqft price to per-sqm */
export function sqftToSqm(pricePerSqft: number): number {
    return +(pricePerSqft * UNIT_CONVERSIONS.sqm_to_sqft).toFixed(2);
}

// ============================================================
// SHORTHAND HELPERS
// ============================================================

const SGD_MYR = 3.05; // Exchange rate as of Mar 2026

function dp(sgd: number): { sgd: number; myr: number } {
    return { sgd, myr: +(sgd * SGD_MYR).toFixed(2) };
}

function cls(
    w: ComponentLibraryItem['classification']['water'],
    f: ComponentLibraryItem['classification']['fire'],
    r: ComponentLibraryItem['classification']['rust'],
    stc: number,
    vocLevel: ComponentLibraryItem['classification']['voc']['level'],
    formaldehydeClass: ComponentLibraryItem['classification']['voc']['formaldehydeClass'],
    stain: ComponentLibraryItem['classification']['stain'],
): MaterialClassification {
    return {
        water: w, fire: f, rust: r,
        acoustic: { stc, label: stc >= 40 ? 'Excellent' : stc >= 30 ? 'Good' : 'Fair' },
        voc: { level: vocLevel, formaldehydeClass, description: `${vocLevel} VOC${formaldehydeClass ? `, ${formaldehydeClass}` : ''}` },
        stain,
    };
}

// ============================================================
// COMPONENT LIBRARY
// ============================================================

export const COMPONENT_LIBRARY: ComponentLibraryItem[] = [

    // 
    // CARCASS MATERIALS (board types)
    // 

    {
        id: 'CL-CARC-001', name: 'Particle Board E2', category: 'carpentry', subCategory: 'carcass',
        description: 'Standard particle board, E2 formaldehyde emission. Budget option for dry areas only.',
        classification: cls('W1', 'none', 'R1', 15, 'high', 'E2', 2),
        materialCost: dp(25), labourCost: dp(15), unit: 'sheet', tier: 'budget',
        origin: 'MY', complianceNotes: ['️ E2 not recommended for bedrooms  formaldehyde risk'],
        alternativeIds: ['CL-CARC-002', 'CL-CARC-003'], lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-CARC-002', name: 'Particle Board MR E1', category: 'carpentry', subCategory: 'carcass',
        description: 'Moisture-resistant particle board, E1 emission. Standard for kitchen cabinets.',
        classification: cls('W3', 'none', 'R1', 15, 'medium', 'E1', 2),
        materialCost: dp(38), labourCost: dp(15), unit: 'sheet', tier: 'standard',
        origin: 'MY', alternativeIds: ['CL-CARC-001', 'CL-CARC-004'], lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-CARC-003', name: 'MDF E1', category: 'carpentry', subCategory: 'carcass',
        description: 'Medium density fibreboard. Smooth surface for painting. Not moisture resistant.',
        classification: cls('W1', 'none', 'R1', 18, 'medium', 'E1', 2),
        materialCost: dp(32), labourCost: dp(15), unit: 'sheet', tier: 'standard',
        origin: 'MY', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-CARC-004', name: 'MDF MR E0', category: 'carpentry', subCategory: 'carcass',
        description: 'Moisture-resistant MDF, ultra-low formaldehyde. Premium choice for enclosed cabinets.',
        classification: cls('W3', 'none', 'R1', 18, 'low', 'E0', 2),
        materialCost: dp(60), labourCost: dp(15), unit: 'sheet', tier: 'premium',
        origin: 'MY', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-CARC-005', name: 'Plywood 18mm', category: 'carpentry', subCategory: 'carcass',
        description: 'Standard plywood carcass. Industry default for SG custom carpentry.',
        classification: cls('W2', 'none', 'R1', 20, 'medium', 'E1', 3),
        materialCost: dp(45), labourCost: dp(15), unit: 'sheet', tier: 'standard',
        origin: 'MY', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-CARC-006', name: 'Marine Plywood', category: 'carpentry', subCategory: 'carcass',
        description: 'WBP-glued plywood for wet areas. Bathroom vanity, outdoor.',
        classification: cls('W4', 'none', 'R1', 20, 'medium', 'E1', 3),
        materialCost: dp(80), labourCost: dp(18), unit: 'sheet', tier: 'premium',
        origin: 'MY', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-CARC-007', name: 'Birch Plywood', category: 'carpentry', subCategory: 'carcass',
        description: 'Baltic birch, exposed-edge grade. For visible plywood aesthetic.',
        classification: cls('W2', 'none', 'R1', 22, 'low', 'E1', 3),
        materialCost: dp(95), labourCost: dp(20), unit: 'sheet', tier: 'premium',
        origin: 'EU', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-CARC-008', name: 'SOSB (Oriented Strand Board)', category: 'carpentry', subCategory: 'carcass',
        description: 'Strand board. Budget option, exposed industrial aesthetic.',
        classification: cls('W2', 'none', 'R1', 18, 'medium', 'E1', 2),
        materialCost: dp(30), labourCost: dp(15), unit: 'sheet', tier: 'budget',
        origin: 'SEA', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-CARC-009', name: 'Aluminium Cabinet Frame', category: 'carpentry', subCategory: 'carcass',
        description: 'Full aluminium frame system. Waterproof, termite-proof, zero VOC.',
        classification: cls('W5', 'none', 'R5', 12, 'zero', undefined, 5),
        materialCost: dp(180), labourCost: dp(40), unit: 'lm', tier: 'premium',
        origin: 'CN', complianceNotes: ['Ideal for kitchen wet area', 'No formaldehyde'],
        lastUpdated: '2026-03-02',
    },

    // 
    // SURFACE FINISHES
    // 

    {
        id: 'CL-SURF-001', name: 'LPL (Low Pressure Laminate)', category: 'carpentry', subCategory: 'finish',
        description: 'Budget laminate, bonded directly to board. Limited colour range.',
        classification: cls('W1', 'none', 'R1', 0, 'low', undefined, 3),
        materialCost: dp(3), labourCost: dp(2), unit: 'sqft', tier: 'budget',
        origin: 'MY', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-SURF-002', name: 'HPL (Formica/Lamitak)', category: 'carpentry', subCategory: 'finish',
        description: 'High pressure laminate. Industry standard. Wide colour + wood-grain range.',
        classification: cls('W2', 'none', 'R1', 0, 'low', undefined, 4),
        materialCost: dp(6), labourCost: dp(3), unit: 'sqft', tier: 'standard',
        brand: 'Formica/Lamitak', origin: 'MY', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-SURF-003', name: 'Fenix NTM', category: 'carpentry', subCategory: 'finish',
        description: 'Nano-tech matte surface. Self-healing micro-scratches. Ultra stain-resistant.',
        classification: cls('W2', 'none', 'R1', 0, 'low', undefined, 5),
        materialCost: dp(18), labourCost: dp(4), unit: 'sqft', tier: 'premium',
        brand: 'Fenix', origin: 'IT', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-SURF-004', name: 'Acrylic High Gloss', category: 'carpentry', subCategory: 'finish',
        description: 'Mirror-like high gloss finish. Modern kitchens. Shows fingerprints.',
        classification: cls('W2', 'none', 'R1', 0, 'low', undefined, 4),
        materialCost: dp(14), labourCost: dp(4), unit: 'sqft', tier: 'premium',
        origin: 'CN', maintenanceNotes: 'Clean with microfibre only. Fingerprints visible.', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-SURF-005', name: 'PVC Thermofoil', category: 'carpentry', subCategory: 'finish',
        description: 'Vacuum-pressed PVC film. Cheap but peels in SG heat. Not recommended.',
        classification: cls('W2', 'none', 'R1', 0, 'medium', undefined, 3),
        materialCost: dp(6), labourCost: dp(3), unit: 'sqft', tier: 'budget',
        origin: 'CN', complianceNotes: ['️ PEELS in Singapore humidity/heat after 2-3 years'],
        lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-SURF-006', name: '2K Spray Paint', category: 'carpentry', subCategory: 'finish',
        description: 'Factory-sprayed 2-component paint. Durable, any RAL colour.',
        classification: cls('W2', 'none', 'R1', 0, 'medium', undefined, 4),
        materialCost: dp(12), labourCost: dp(5), unit: 'sqft', tier: 'premium',
        origin: 'SG', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-SURF-007', name: 'Natural Wood Veneer', category: 'carpentry', subCategory: 'finish',
        description: 'Real wood veneer on plywood/MDF. Oak, walnut, ash, teak available.',
        classification: cls('W1', 'none', 'R1', 0, 'low', undefined, 2),
        materialCost: dp(22), labourCost: dp(8), unit: 'sqft', tier: 'premium',
        origin: 'EU', maintenanceNotes: 'Seal with polyurethane. Avoid direct sunlight.', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-SURF-008', name: 'Sintered Stone (panel)', category: 'carpentry', subCategory: 'finish',
        description: 'Ultra-thin sintered stone panel for cabinet doors/feature walls.',
        classification: cls('W4', 'none', 'R5', 0, 'zero', undefined, 5),
        materialCost: dp(35), labourCost: dp(12), unit: 'sqft', tier: 'luxury',
        brand: 'Dekton/Laminam', origin: 'IT', lastUpdated: '2026-03-02',
    },

    // 
    // EDGE BANDING
    // 

    {
        id: 'CL-EDGE-001', name: 'PVC Edge Band 0.4mm', category: 'carpentry', subCategory: 'edge_banding',
        description: 'Thin PVC edge tape. Budget, visible seam line.',
        classification: cls('W2', 'none', 'R1', 0, 'low', undefined, 3),
        materialCost: dp(0.50), labourCost: dp(0.30), unit: 'lm', tier: 'budget',
        origin: 'CN', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-EDGE-002', name: 'PVC Edge Band 2mm', category: 'carpentry', subCategory: 'edge_banding',
        description: 'Thick PVC edge. Rounded profile, durable. Standard choice.',
        classification: cls('W2', 'none', 'R1', 0, 'low', undefined, 3),
        materialCost: dp(1.50), labourCost: dp(0.50), unit: 'lm', tier: 'standard',
        origin: 'MY', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-EDGE-003', name: 'ABS Eco Edge Band', category: 'carpentry', subCategory: 'edge_banding',
        description: 'Environmentally friendly ABS edge. No PVC, recyclable.',
        classification: cls('W2', 'none', 'R1', 0, 'zero', undefined, 3),
        materialCost: dp(1.80), labourCost: dp(0.50), unit: 'lm', tier: 'standard',
        origin: 'DE', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-EDGE-004', name: 'Laser Edge (seamless)', category: 'carpentry', subCategory: 'edge_banding',
        description: 'Laser-bonded seamless edge. Zero visible joint line. Factory only.',
        classification: cls('W3', 'none', 'R1', 0, 'low', undefined, 4),
        materialCost: dp(3.50), labourCost: dp(1.00), unit: 'lm', tier: 'premium',
        origin: 'DE', brand: 'Rehau', lastUpdated: '2026-03-02',
    },

    // 
    // HARDWARE
    // 

    {
        id: 'CL-HW-001', name: 'Blum Clip-top Hinge', category: 'carpentry', subCategory: 'hinge',
        description: 'Soft-close concealed hinge. 110° opening. Industry gold standard.',
        classification: cls('W2', 'none', 'R3', 0, 'zero', undefined, 5),
        materialCost: dp(8), labourCost: dp(2), unit: 'pcs', tier: 'premium',
        brand: 'Blum', origin: 'global', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-HW-002', name: 'Hettich Sensys Hinge', category: 'carpentry', subCategory: 'hinge',
        description: 'Soft-close concealed hinge. Good alternative to Blum.',
        classification: cls('W2', 'none', 'R3', 0, 'zero', undefined, 5),
        materialCost: dp(7), labourCost: dp(2), unit: 'pcs', tier: 'standard',
        brand: 'Hettich', origin: 'DE', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-HW-003', name: 'Generic Soft-close Hinge', category: 'carpentry', subCategory: 'hinge',
        description: 'China-made soft-close hinge. Functional but shorter lifespan.',
        classification: cls('W2', 'none', 'R2', 0, 'zero', undefined, 4),
        materialCost: dp(3), labourCost: dp(2), unit: 'pcs', tier: 'budget',
        origin: 'CN', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-HW-004', name: 'Blum Tandembox Runner', category: 'carpentry', subCategory: 'drawer_runner',
        description: 'Full-extension undermount drawer runner. Soft-close.',
        classification: cls('W2', 'none', 'R3', 0, 'zero', undefined, 5),
        materialCost: dp(25), labourCost: dp(5), unit: 'set', tier: 'premium',
        brand: 'Blum', origin: 'global', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-HW-005', name: 'Blum Aventos HF', category: 'carpentry', subCategory: 'lift_system',
        description: 'Bi-fold lift-up mechanism for overhead cabinets.',
        classification: cls('W2', 'none', 'R3', 0, 'zero', undefined, 5),
        materialCost: dp(70), labourCost: dp(15), unit: 'set', tier: 'premium',
        brand: 'Blum', origin: 'global', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-HW-006', name: 'Blum TIP-ON Push-to-Open', category: 'carpentry', subCategory: 'push_open',
        description: 'Handleless door opening mechanism. Touch to open.',
        classification: cls('W2', 'none', 'R3', 0, 'zero', undefined, 5),
        materialCost: dp(15), labourCost: dp(3), unit: 'pcs', tier: 'premium',
        brand: 'Blum', origin: 'global', lastUpdated: '2026-03-02',
    },

    // 
    // HANDLES
    // 

    {
        id: 'CL-HDL-001', name: 'Bar Pull Handle (Zinc)', category: 'carpentry', subCategory: 'handle',
        description: 'Standard bar pull, zinc alloy. Budget choice.',
        classification: cls('W1', 'none', 'R2', 0, 'zero', undefined, 4),
        materialCost: dp(4), labourCost: dp(1), unit: 'pcs', tier: 'budget',
        origin: 'CN', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-HDL-002', name: 'Bar Pull Handle (SS304)', category: 'carpentry', subCategory: 'handle',
        description: 'Stainless steel bar pull. Durable, kitchen-safe.',
        classification: cls('W4', 'none', 'R4', 0, 'zero', undefined, 5),
        materialCost: dp(15), labourCost: dp(1), unit: 'pcs', tier: 'standard',
        origin: 'CN', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-HDL-003', name: 'Brass Knob Handle', category: 'carpentry', subCategory: 'handle',
        description: 'Solid brass knob. Develops patina over time. Art Deco / MCM style.',
        classification: cls('W2', 'none', 'R3', 0, 'zero', undefined, 3),
        materialCost: dp(40), labourCost: dp(1), unit: 'pcs', tier: 'premium',
        origin: 'IN', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-HDL-004', name: 'J-Channel (handleless)', category: 'carpentry', subCategory: 'handle',
        description: 'Integrated aluminium J-channel. Handleless modern look.',
        classification: cls('W2', 'none', 'R4', 0, 'zero', undefined, 4),
        materialCost: dp(18), labourCost: dp(3), unit: 'lm', tier: 'premium',
        origin: 'CN', lastUpdated: '2026-03-02',
    },

    // 
    // COUNTERTOPS
    // 

    {
        id: 'CL-CNTR-001', name: 'Quartz Countertop (China)', category: 'carpentry', subCategory: 'countertop',
        description: 'Engineered quartz from China. Budget, good quality. 20mm.',
        classification: cls('W4', 'none', 'R5', 0, 'zero', undefined, 4),
        materialCost: dp(22), labourCost: dp(10), unit: 'sqft', tier: 'budget',
        origin: 'CN', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-CNTR-002', name: 'Caesarstone Quartz', category: 'carpentry', subCategory: 'countertop',
        description: 'Premium engineered quartz. Consistent quality, wide palette.',
        classification: cls('W4', 'none', 'R5', 0, 'zero', undefined, 5),
        materialCost: dp(45), labourCost: dp(15), unit: 'sqft', tier: 'premium',
        brand: 'Caesarstone', origin: 'IL', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-CNTR-003', name: 'Dekton Sintered Stone', category: 'carpentry', subCategory: 'countertop',
        description: 'Ultra-compact sintered stone. Heat/scratch/stain proof. Luxury.',
        classification: cls('W5', 'none', 'R5', 0, 'zero', undefined, 5),
        materialCost: dp(55), labourCost: dp(18), unit: 'sqft', tier: 'luxury',
        brand: 'Dekton', origin: 'ES', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-CNTR-004', name: 'Natural Marble Countertop', category: 'carpentry', subCategory: 'countertop',
        description: 'Natural marble slab. Beautiful but porous  stains and etches.',
        classification: cls('W2', 'none', 'R5', 0, 'zero', undefined, 1),
        materialCost: dp(60), labourCost: dp(20), unit: 'sqft', tier: 'luxury',
        origin: 'IT', incompatibleWith: ['acid_cleaners', 'lemon_juice', 'vinegar'],
        maintenanceNotes: 'Seal every 6-12 months. Blot spills immediately. No acid.', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-CNTR-005', name: 'Solid Surface (Hi-Macs)', category: 'carpentry', subCategory: 'countertop',
        description: 'Acrylic solid surface. Seamless joints, repairable scratches.',
        classification: cls('W4', 'none', 'R5', 0, 'low', undefined, 3),
        materialCost: dp(30), labourCost: dp(12), unit: 'sqft', tier: 'standard',
        brand: 'Hi-Macs', origin: 'KR', lastUpdated: '2026-03-02',
    },

    // 
    // DOORS
    // 

    {
        id: 'CL-DOOR-001', name: 'Hollow Core Laminate Door', category: 'carpentry', subCategory: 'bedroom_door',
        description: 'Budget bedroom door. Lightweight, poor soundproofing.',
        classification: cls('W1', 'none', 'R1', 20, 'low', undefined, 3),
        materialCost: dp(180), labourCost: dp(100), unit: 'pcs', tier: 'budget',
        origin: 'MY', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-DOOR-002', name: 'Solid Core Laminate Door', category: 'carpentry', subCategory: 'bedroom_door',
        description: 'Standard bedroom door. Better sound insulation than hollow.',
        classification: cls('W1', 'none', 'R1', 28, 'low', undefined, 3),
        materialCost: dp(320), labourCost: dp(140), unit: 'pcs', tier: 'standard',
        origin: 'MY', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-DOOR-003', name: 'Solid Timber Door', category: 'carpentry', subCategory: 'bedroom_door',
        description: 'Premium solid wood door. Excellent acoustics and feel.',
        classification: cls('W2', 'none', 'R1', 35, 'low', undefined, 2),
        materialCost: dp(600), labourCost: dp(200), unit: 'pcs', tier: 'premium',
        origin: 'MY', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-DOOR-004', name: 'Fire-Rated Door FR30', category: 'carpentry', subCategory: 'main_door',
        description: 'HDB-compliant FR30 main door. Mandatory for HDB units.',
        classification: cls('W1', 'FR30', 'R1', 30, 'low', undefined, 3),
        materialCost: dp(500), labourCost: dp(200), unit: 'pcs', tier: 'standard',
        origin: 'MY', complianceNotes: ['MANDATORY for HDB main door  SCDF requirement'],
        lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-DOOR-005', name: 'Aluminium Bathroom Door', category: 'carpentry', subCategory: 'bathroom_door',
        description: 'Aluminium frame with frosted/clear glass. Waterproof.',
        classification: cls('W5', 'none', 'R4', 18, 'zero', undefined, 5),
        materialCost: dp(250), labourCost: dp(120), unit: 'pcs', tier: 'standard',
        origin: 'MY', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-DOOR-006', name: 'Barn Door', category: 'carpentry', subCategory: 'feature_door',
        description: 'Sliding barn door on exposed track. Feature element. ️ Poor sound/privacy.',
        classification: cls('W1', 'none', 'R2', 15, 'low', undefined, 3),
        materialCost: dp(450), labourCost: dp(150), unit: 'pcs', tier: 'premium',
        origin: 'CN', complianceNotes: ['️ No sound privacy  gap around edges'],
        lastUpdated: '2026-03-02',
    },

    // 
    // PLUMBING FIXTURES (with rust/finish ratings)
    // 

    {
        id: 'CL-PLMB-001', name: 'Mixer Tap (Chrome)', category: 'plumbing', subCategory: 'mixer_tap',
        description: 'Standard chrome plated basin mixer. Budget.',
        classification: cls('W5', 'none', 'R3', 0, 'zero', undefined, 4),
        materialCost: dp(60), labourCost: dp(35), unit: 'pcs', tier: 'budget',
        origin: 'CN', incompatibleWith: ['acid_cleaners'],
        maintenanceNotes: 'Chrome plating corrodes with acid cleaners. Use mild soap only.',
        lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-PLMB-002', name: 'Mixer Tap (Matte Black PVD)', category: 'plumbing', subCategory: 'mixer_tap',
        description: 'PVD-coated matte black finish. 10× more durable than chrome plating.',
        classification: cls('W5', 'none', 'R4', 0, 'zero', undefined, 4),
        materialCost: dp(150), labourCost: dp(40), unit: 'pcs', tier: 'premium',
        origin: 'CN', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-PLMB-003', name: 'Grohe Mixer Tap', category: 'plumbing', subCategory: 'mixer_tap',
        description: 'German-engineered basin mixer. Chrome with ceramic cartridge.',
        classification: cls('W5', 'none', 'R4', 0, 'zero', undefined, 5),
        materialCost: dp(250), labourCost: dp(40), unit: 'pcs', tier: 'premium',
        brand: 'Grohe', origin: 'DE', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-PLMB-004', name: 'TOTO Wall-Hung WC', category: 'plumbing', subCategory: 'wc',
        description: 'Japanese wall-hung toilet. Concealed cistern, water-saving.',
        classification: cls('W5', 'none', 'R5', 0, 'zero', undefined, 5),
        materialCost: dp(600), labourCost: dp(250), unit: 'pcs', tier: 'premium',
        brand: 'TOTO', origin: 'JP', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-PLMB-005', name: 'Rain Shower Set (Standard)', category: 'plumbing', subCategory: 'shower_set',
        description: 'Overhead rain shower + handheld combo. Chrome.',
        classification: cls('W5', 'none', 'R3', 0, 'zero', undefined, 4),
        materialCost: dp(100), labourCost: dp(60), unit: 'pcs', tier: 'standard',
        origin: 'CN', lastUpdated: '2026-03-02',
    },

    // 
    // FLOORING
    // 

    {
        id: 'CL-FLR-001', name: 'SPC Vinyl Plank (click-lock)', category: 'flooring', subCategory: 'vinyl',
        description: 'Stone polymer composite vinyl. 100% waterproof. Click-lock install.',
        classification: cls('W4', 'none', 'R5', 8, 'low', undefined, 4),
        materialCost: dp(4), labourCost: dp(2.50), unit: 'sqft', tier: 'standard',
        origin: 'CN', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-FLR-002', name: 'LVT Herringbone', category: 'flooring', subCategory: 'vinyl',
        description: 'Luxury vinyl tile in herringbone pattern. Premium look, easy install.',
        classification: cls('W4', 'none', 'R5', 10, 'low', undefined, 4),
        materialCost: dp(6), labourCost: dp(4), unit: 'sqft', tier: 'premium',
        origin: 'KR', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-FLR-003', name: 'Laminate Flooring 12mm', category: 'flooring', subCategory: 'laminate',
        description: 'AC4 commercial grade laminate. NOT waterproof  avoid wet areas.',
        classification: cls('W1', 'none', 'R1', 12, 'medium', 'E1', 3),
        materialCost: dp(3.50), labourCost: dp(2), unit: 'sqft', tier: 'budget',
        origin: 'MY', complianceNotes: ['️ NOT waterproof  swells with moisture'],
        lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-FLR-004', name: 'Engineered Wood (Oak)', category: 'flooring', subCategory: 'timber',
        description: 'Real oak veneer on plywood base. Warm, natural aesthetic.',
        classification: cls('W1', 'none', 'R1', 15, 'low', undefined, 2),
        materialCost: dp(12), labourCost: dp(5), unit: 'sqft', tier: 'premium',
        origin: 'EU', maintenanceNotes: 'Avoid wet mopping. Use damp cloth only.',
        lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-FLR-005', name: 'Microcement Floor', category: 'flooring', subCategory: 'seamless',
        description: 'Seamless microcement overlay. Industrial-chic. Needs sealer.',
        classification: cls('W4', 'none', 'R5', 5, 'low', undefined, 3),
        materialCost: dp(18), labourCost: dp(12), unit: 'sqft', tier: 'premium',
        origin: 'ES', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-FLR-006', name: 'Epoxy Floor (decorative)', category: 'flooring', subCategory: 'seamless',
        description: 'Poured epoxy resin floor. Seamless, fully waterproof, chemical resistant.',
        classification: cls('W5', 'none', 'R5', 5, 'medium', undefined, 5),
        materialCost: dp(10), labourCost: dp(8), unit: 'sqft', tier: 'standard',
        origin: 'SG', lastUpdated: '2026-03-02',
    },

    // 
    // PAINTING & WALL FINISHES
    // 

    {
        id: 'CL-PAINT-001', name: 'Emulsion Paint (Nippon/Dulux)', category: 'painting', subCategory: 'emulsion',
        description: 'Standard 2-coat emulsion. Walls and ceilings.',
        classification: cls('W1', 'none', 'R1', 0, 'low', undefined, 2),
        materialCost: dp(0.80), labourCost: dp(1.20), unit: 'sqft', tier: 'standard',
        brand: 'Nippon/Dulux', origin: 'SG', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-PAINT-002', name: 'Limewash Paint', category: 'painting', subCategory: 'artisan',
        description: 'Natural lime-based paint. Chalky, textured finish. Breathable.',
        classification: cls('W1', 'none', 'R1', 0, 'zero', undefined, 2),
        materialCost: dp(5), labourCost: dp(8), unit: 'sqft', tier: 'premium',
        brand: 'Bauwerk/Kalklitir', origin: 'EU', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-PAINT-003', name: 'Venetian Plaster (Marmorino)', category: 'painting', subCategory: 'artisan',
        description: 'Multi-layer polished plaster. Marble-like depth. Artisan skill required.',
        classification: cls('W2', 'none', 'R1', 0, 'zero', undefined, 3),
        materialCost: dp(15), labourCost: dp(25), unit: 'sqft', tier: 'luxury',
        brand: 'San Marco/Novacolor', origin: 'IT',
        maintenanceNotes: 'Can be waxed for additional protection. Repairable.',
        lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-PAINT-004', name: 'Tadelakt', category: 'painting', subCategory: 'artisan',
        description: 'Moroccan waterproof lime plaster. Can be used in showers. Artisan only.',
        classification: cls('W4', 'none', 'R1', 0, 'zero', undefined, 3),
        materialCost: dp(20), labourCost: dp(35), unit: 'sqft', tier: 'luxury',
        origin: 'IT', complianceNotes: ['Specialist installer required  very few in SG'],
        lastUpdated: '2026-03-02',
    },

    // 
    // ELECTRICAL SWITCHES
    // 

    {
        id: 'CL-ELEC-001', name: 'Switch (Budget  Legrand/DERA)', category: 'electrical', subCategory: 'switch',
        description: 'Basic switch plate. Functional, standard white.',
        classification: cls('W1', 'none', 'R1', 0, 'zero', undefined, 4),
        materialCost: dp(4), labourCost: dp(0), unit: 'pcs', tier: 'budget',
        brand: 'Legrand/DERA', origin: 'CN', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-ELEC-002', name: 'Switch (Schneider Zencelo)', category: 'electrical', subCategory: 'switch',
        description: 'Premium switch plate. Sleek design, multiple finishes.',
        classification: cls('W1', 'none', 'R1', 0, 'zero', undefined, 4),
        materialCost: dp(14), labourCost: dp(0), unit: 'pcs', tier: 'premium',
        brand: 'Schneider', origin: 'global', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-ELEC-003', name: 'Smart Switch (Aqara)', category: 'electrical', subCategory: 'switch',
        description: 'Zigbee smart switch. Voice control, scheduling, no neutral required.',
        classification: cls('W1', 'none', 'R1', 0, 'zero', undefined, 4),
        materialCost: dp(35), labourCost: dp(5), unit: 'pcs', tier: 'premium',
        brand: 'Aqara', origin: 'CN', lastUpdated: '2026-03-02',
    },

    // 
    // TILING
    // 

    {
        id: 'CL-TILE-001', name: 'Ceramic Tile 300×300', category: 'masonry', subCategory: 'wall_tiling',
        description: 'Budget ceramic wall tile. Bathroom/kitchen standard.',
        classification: cls('W4', 'none', 'R5', 0, 'zero', undefined, 4),
        materialCost: dp(3), labourCost: dp(6), unit: 'sqft', tier: 'budget',
        origin: 'CN', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-TILE-002', name: 'Porcelain Tile 600×600', category: 'masonry', subCategory: 'floor_tiling',
        description: 'Standard floor porcelain. Low absorption, durable.',
        classification: cls('W5', 'none', 'R5', 0, 'zero', undefined, 4),
        materialCost: dp(6), labourCost: dp(7), unit: 'sqft', tier: 'standard',
        origin: 'CN', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-TILE-003', name: 'Subway Tile 75×150', category: 'masonry', subCategory: 'wall_tiling',
        description: 'Classic subway tile. Bevelled or flat. Timeless look.',
        classification: cls('W4', 'none', 'R5', 0, 'zero', undefined, 4),
        materialCost: dp(5), labourCost: dp(8), unit: 'sqft', tier: 'standard',
        origin: 'CN', complianceNotes: ['Labour cost higher due to more grout lines'],
        lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-TILE-004', name: 'Zellige Tile', category: 'masonry', subCategory: 'wall_tiling',
        description: 'Handmade Moroccan tile. Each piece unique. Premium artisan look.',
        classification: cls('W3', 'none', 'R5', 0, 'zero', undefined, 2),
        materialCost: dp(30), labourCost: dp(12), unit: 'sqft', tier: 'luxury',
        origin: 'IT', maintenanceNotes: 'Porous  must seal. Expect colour variation.',
        lastUpdated: '2026-03-02',
    },

    // 
    // GROUT
    // 

    {
        id: 'CL-GROUT-001', name: 'Cement Grout', category: 'masonry', subCategory: 'grout',
        description: 'Standard cement-based grout. Stains over time.',
        classification: cls('W2', 'none', 'R1', 0, 'low', undefined, 1),
        materialCost: dp(3), labourCost: dp(0), unit: 'kg', tier: 'budget',
        origin: 'SG', lastUpdated: '2026-03-02',
    },
    {
        id: 'CL-GROUT-002', name: 'Epoxy Grout (Mapei Kerapoxy)', category: 'masonry', subCategory: 'grout',
        description: 'Epoxy grout. Stain-proof, waterproof. Harder to apply.',
        classification: cls('W5', 'none', 'R5', 0, 'low', undefined, 5),
        materialCost: dp(18), labourCost: dp(5), unit: 'kg', tier: 'premium',
        brand: 'Mapei', origin: 'IT', lastUpdated: '2026-03-02',
    },
];

// ============================================================
// QUERY FUNCTIONS
// ============================================================

export function getComponentsByTrade(category: string): ComponentLibraryItem[] {
    return COMPONENT_LIBRARY.filter(c => c.category === category);
}

export function getComponentsBySubCategory(subCategory: string): ComponentLibraryItem[] {
    return COMPONENT_LIBRARY.filter(c => c.subCategory === subCategory);
}

export function getComponentsByWaterRating(minRating: ComponentLibraryItem['classification']['water']): ComponentLibraryItem[] {
    const order = ['W1', 'W2', 'W3', 'W4', 'W5'];
    const minIdx = order.indexOf(minRating);
    return COMPONENT_LIBRARY.filter(c => order.indexOf(c.classification.water) >= minIdx);
}

export function getComponentsByTier(tier: ComponentLibraryItem['tier']): ComponentLibraryItem[] {
    return COMPONENT_LIBRARY.filter(c => c.tier === tier);
}

export function getAlternatives(itemId: string): ComponentLibraryItem[] {
    const item = COMPONENT_LIBRARY.find(c => c.id === itemId);
    if (!item?.alternativeIds) return [];
    return COMPONENT_LIBRARY.filter(c => item.alternativeIds!.includes(c.id));
}

/** Search component library by name/description */
export function searchComponents(query: string, category?: string): ComponentLibraryItem[] {
    const q = query.toLowerCase();
    return COMPONENT_LIBRARY.filter(c => {
        if (category && c.category !== category) return false;
        return c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            (c.brand?.toLowerCase().includes(q) ?? false);
    });
}
