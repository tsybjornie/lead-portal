/**
 * Comprehensive Pricelists — Designer-Owned Rate Cards
 * 
 * These are YOUR negotiated rates with your contractors.
 * The same vendor may give different rates to different designers —
 * so this data belongs to YOU, not the vendor.
 * 
 * Seed data provides realistic Singapore market defaults.
 * Users can override via localStorage or Supabase.
 */

import { TradeCategory } from '@/types/trades';

// ============================================================
// TYPES
// ============================================================

export type PriceTier = 'budget' | 'standard' | 'premium' | 'luxury';

export interface PricelistItem {
    id: string;
    vendorId?: string;          // Link to vendor (optional — can be unlinked)
    category: TradeCategory;
    subCategory: string;        // e.g. 'base_cabinet', 'wall_tiling'
    description: string;
    materialCost: number;       // YOUR cost per unit
    labourCost: number;         // YOUR cost per unit
    unit: string;               // 'sqft', 'lm', 'pcs', 'lot', 'set'
    currency: 'SGD' | 'MYR';
    tier?: PriceTier;
    brand?: string;
    notes?: string;
    lastUpdated: string;        // ISO date
}

// ============================================================
// SEED PRICELISTS — Realistic SG Market Rates (2024-2025)
// ============================================================

export const SEED_PRICELIST: PricelistItem[] = [
    // ─── PRELIMINARIES ──────────────────────────────────────
    { id: 'pl-prelim-001', category: 'preliminaries', subCategory: 'floor_protection', description: 'Floor protection — corrugated cardboard + PE sheet, common areas', materialCost: 150, labourCost: 200, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-prelim-002', category: 'preliminaries', subCategory: 'lift_protection', description: 'Lift protection — plywood lining for service lift cabin', materialCost: 80, labourCost: 170, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-prelim-003', category: 'preliminaries', subCategory: 'door_protection', description: 'Door frame protection — foam + tape wrapping, all existing frames', materialCost: 30, labourCost: 70, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-prelim-004', category: 'preliminaries', subCategory: 'hoarding', description: 'Temporary hoarding / barricade at entrance', materialCost: 100, labourCost: 150, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-prelim-005', category: 'preliminaries', subCategory: 'mobilization', description: 'Site mobilization — tools, equipment setup', materialCost: 50, labourCost: 200, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── DEMOLITION ─────────────────────────────────────────
    { id: 'pl-demo-001', category: 'demolition', subCategory: 'hack_floor', description: 'Hack floor tiles — ceramic/homogeneous, including screed', materialCost: 0, labourCost: 6, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-demo-002', category: 'demolition', subCategory: 'hack_wall', description: 'Hack wall tiles — bathroom/kitchen', materialCost: 0, labourCost: 5, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-demo-003', category: 'demolition', subCategory: 'hack_wall_full', description: 'Full wall demolition — non-structural partition (brick)', materialCost: 0, labourCost: 10, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-demo-004', category: 'demolition', subCategory: 'ceiling_removal', description: 'Remove existing false ceiling — gypsum board', materialCost: 0, labourCost: 3, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-demo-005', category: 'demolition', subCategory: 'cabinet_removal', description: 'Dismantle and remove existing cabinets — kitchen/wardrobe', materialCost: 0, labourCost: 250, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-demo-006', category: 'demolition', subCategory: 'door_removal', description: 'Remove existing door + frame', materialCost: 0, labourCost: 80, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-demo-007', category: 'demolition', subCategory: 'debris_disposal', description: 'Debris disposal — licensed NEA lorry (1 trip)', materialCost: 0, labourCost: 350, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-demo-008', category: 'demolition', subCategory: 'cart_away', description: 'Cart-away of debris — unit to loading bay (per trip)', materialCost: 0, labourCost: 100, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── MASONRY & TILING ───────────────────────────────────
    { id: 'pl-mason-001', category: 'masonry', subCategory: 'wall_tiling', description: 'Wall tiling 300×600mm — bathroom (supply + install)', materialCost: 8, labourCost: 7, unit: 'sqft', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-mason-002', category: 'masonry', subCategory: 'wall_tiling', description: 'Wall tiling 300×600mm — premium porcelain', materialCost: 14, labourCost: 8, unit: 'sqft', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-mason-003', category: 'masonry', subCategory: 'floor_tiling', description: 'Floor tiling 600×600mm — homogeneous (supply + install)', materialCost: 10, labourCost: 8, unit: 'sqft', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-mason-004', category: 'masonry', subCategory: 'floor_tiling', description: 'Floor tiling 800×800mm — premium porcelain', materialCost: 16, labourCost: 10, unit: 'sqft', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-mason-005', category: 'masonry', subCategory: 'floor_tiling', description: 'Floor tiling — marble / natural stone', materialCost: 28, labourCost: 14, unit: 'sqft', currency: 'SGD', tier: 'luxury', lastUpdated: '2025-01-15' },
    { id: 'pl-mason-006', category: 'masonry', subCategory: 'screeding', description: 'Re-screeding — cement screed, 25mm avg thickness', materialCost: 2, labourCost: 3, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-mason-007', category: 'masonry', subCategory: 'screeding', description: 'Re-screeding — gradient fall for bathroom, 60mm to 15mm', materialCost: 3, labourCost: 5, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-mason-008', category: 'masonry', subCategory: 'plastering', description: 'Plastering — new brick wall, both sides, 12mm', materialCost: 2.5, labourCost: 5, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-mason-009', category: 'masonry', subCategory: 'brickwork', description: 'Build new brick wall — 100mm half-brick partition', materialCost: 6, labourCost: 9, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-mason-010', category: 'masonry', subCategory: 'overlay', description: 'Overlay tiling — direct on existing tiles (no hacking)', materialCost: 12, labourCost: 6, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-mason-011', category: 'masonry', subCategory: 'threshold', description: 'Marble threshold / door saddle — polished', materialCost: 25, labourCost: 15, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── WATERPROOFING ──────────────────────────────────────
    { id: 'pl-wp-001', category: 'waterproofing', subCategory: 'bathroom', description: 'Waterproofing membrane — bathroom floor + walls up to 1800mm', materialCost: 4, labourCost: 6, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-wp-002', category: 'waterproofing', subCategory: 'bathroom', description: 'Waterproofing membrane — shower area walls to ceiling', materialCost: 5, labourCost: 7, unit: 'sqft', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-wp-003', category: 'waterproofing', subCategory: 'balcony', description: 'Waterproofing membrane — balcony floor', materialCost: 3.5, labourCost: 5, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-wp-004', category: 'waterproofing', subCategory: 'ponding_test', description: 'Ponding / flood test — 24 hours minimum', materialCost: 0, labourCost: 120, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── CARPENTRY ──────────────────────────────────────────
    // Kitchen
    { id: 'pl-carp-001', category: 'carpentry', subCategory: 'base_cabinet', description: 'Kitchen base cabinet — 18mm plywood, laminate door, soft-close', materialCost: 220, labourCost: 130, unit: 'lm', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-002', category: 'carpentry', subCategory: 'base_cabinet', description: 'Kitchen base cabinet — premium veneer / solid surface door', materialCost: 380, labourCost: 160, unit: 'lm', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-003', category: 'carpentry', subCategory: 'upper_cabinet', description: 'Kitchen upper/wall cabinet — 18mm plywood, laminate', materialCost: 170, labourCost: 110, unit: 'lm', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-004', category: 'carpentry', subCategory: 'upper_cabinet', description: 'Kitchen upper cabinet — glass panel insert + LED', materialCost: 280, labourCost: 140, unit: 'lm', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-005', category: 'carpentry', subCategory: 'tall_cabinet', description: 'Kitchen tall cabinet — built-in fridge/oven housing', materialCost: 350, labourCost: 200, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-006', category: 'carpentry', subCategory: 'countertop', description: 'Quartz countertop — 20mm, undermount sink cutout', materialCost: 140, labourCost: 60, unit: 'lm', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-007', category: 'carpentry', subCategory: 'countertop', description: 'Quartz countertop — 30mm, waterfall edge', materialCost: 220, labourCost: 80, unit: 'lm', currency: 'SGD', tier: 'premium', brand: 'Caesarstone', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-008', category: 'carpentry', subCategory: 'countertop', description: 'Solid surface countertop — seamless joint', materialCost: 120, labourCost: 55, unit: 'lm', currency: 'SGD', tier: 'standard', brand: 'Hi-Macs', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-009', category: 'carpentry', subCategory: 'countertop', description: 'Granite countertop — 20mm polished, natural stone', materialCost: 100, labourCost: 50, unit: 'lm', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-010', category: 'carpentry', subCategory: 'island', description: 'Kitchen island / peninsula — with countertop overhang', materialCost: 600, labourCost: 350, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    // Wardrobes
    { id: 'pl-carp-011', category: 'carpentry', subCategory: 'wardrobe', description: 'Built-in wardrobe — swing door, plywood, laminate', materialCost: 260, labourCost: 160, unit: 'lm', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-012', category: 'carpentry', subCategory: 'wardrobe', description: 'Built-in wardrobe — sliding door, aluminium track', materialCost: 300, labourCost: 180, unit: 'lm', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-013', category: 'carpentry', subCategory: 'wardrobe', description: 'Built-in wardrobe — premium veneer, Blum fittings', materialCost: 450, labourCost: 220, unit: 'lm', currency: 'SGD', tier: 'premium', brand: 'Blum', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-014', category: 'carpentry', subCategory: 'wardrobe_fittings', description: 'Wardrobe internal fittings — pull-out trays, trouser rack, accessories', materialCost: 350, labourCost: 250, unit: 'lot', currency: 'SGD', brand: 'Hafele', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-015', category: 'carpentry', subCategory: 'walk_in', description: 'Walk-in wardrobe system — shelving, hanging, drawers', materialCost: 500, labourCost: 300, unit: 'lm', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    // Feature walls
    { id: 'pl-carp-016', category: 'carpentry', subCategory: 'feature_wall', description: 'TV feature wall — fluted panel, cable concealment', materialCost: 100, labourCost: 80, unit: 'sqft', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-017', category: 'carpentry', subCategory: 'feature_wall', description: 'TV feature wall — slatted timber + LED backlight', materialCost: 140, labourCost: 100, unit: 'sqft', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-018', category: 'carpentry', subCategory: 'feature_wall', description: 'Feature wall — stone veneer / marble-look panel', materialCost: 180, labourCost: 120, unit: 'sqft', currency: 'SGD', tier: 'luxury', lastUpdated: '2025-01-15' },
    // Storage
    { id: 'pl-carp-019', category: 'carpentry', subCategory: 'tv_console', description: 'TV console — floating, plywood + laminate', materialCost: 180, labourCost: 120, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-020', category: 'carpentry', subCategory: 'shoe_cabinet', description: 'Shoe cabinet — ventilated shelves, entryway', materialCost: 280, labourCost: 150, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-021', category: 'carpentry', subCategory: 'shoe_cabinet', description: 'Full-height shoe cabinet — swing door, mirror panel', materialCost: 450, labourCost: 220, unit: 'pcs', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-022', category: 'carpentry', subCategory: 'study_desk', description: 'Built-in study desk — cable grommet, drawer unit', materialCost: 250, labourCost: 150, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-023', category: 'carpentry', subCategory: 'platform_bed', description: 'Platform bed with storage — gas-lift / drawers', materialCost: 400, labourCost: 250, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-024', category: 'carpentry', subCategory: 'vanity', description: 'Vanity / dressing table — mirror + LED + drawer', materialCost: 300, labourCost: 180, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-025', category: 'carpentry', subCategory: 'display_cabinet', description: 'Display cabinet — glass front, LED interior', materialCost: 350, labourCost: 200, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-026', category: 'carpentry', subCategory: 'overhead', description: 'Overhead storage above doorway / corridor', materialCost: 180, labourCost: 120, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-027', category: 'carpentry', subCategory: 'db_cover', description: 'DB box cover panel — swing-open, magnetic catch', materialCost: 80, labourCost: 60, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-028', category: 'carpentry', subCategory: 'trunking_cover', description: 'Aircon trunking cover / casing — plywood, laminate', materialCost: 45, labourCost: 35, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-029', category: 'carpentry', subCategory: 'pipe_boxing', description: 'Pipe boxing / column cladding — plywood + laminate', materialCost: 50, labourCost: 40, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-030', category: 'carpentry', subCategory: 'bookshelf', description: 'Built-in bookshelf — floor to ceiling, mixed open + closed', materialCost: 280, labourCost: 170, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-031', category: 'carpentry', subCategory: 'utility_cabinet', description: 'Utility cabinet — washer/dryer concealment', materialCost: 320, labourCost: 180, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-carp-032', category: 'carpentry', subCategory: 'window_bench', description: 'Window bench / bay seat with storage', materialCost: 200, labourCost: 130, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── METALWORKS ─────────────────────────────────────────
    { id: 'pl-metal-001', category: 'metalworks', subCategory: 'window_grille', description: 'Mild steel window grille — powder coated black', materialCost: 100, labourCost: 80, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-metal-002', category: 'metalworks', subCategory: 'railing', description: 'Stainless steel railing — with glass infill panel', materialCost: 250, labourCost: 150, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-metal-003', category: 'metalworks', subCategory: 'gate', description: 'Metal entrance gate — mild steel, powder coated', materialCost: 800, labourCost: 400, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-metal-004', category: 'metalworks', subCategory: 'bracket', description: 'Mild steel bracket for floating shelf / console', materialCost: 25, labourCost: 35, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-metal-005', category: 'metalworks', subCategory: 'screen', description: 'Feature metal screen — laser cut, powder coated', materialCost: 180, labourCost: 120, unit: 'sqft', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },

    // ─── GLASSWORKS ─────────────────────────────────────────
    { id: 'pl-glass-001', category: 'glassworks', subCategory: 'shower_screen', description: 'Tempered glass shower screen — frameless, 10mm', materialCost: 250, labourCost: 100, unit: 'pcs', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-glass-002', category: 'glassworks', subCategory: 'shower_screen', description: 'Tempered glass shower screen — black frame, 10mm', materialCost: 300, labourCost: 120, unit: 'pcs', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-glass-003', category: 'glassworks', subCategory: 'mirror', description: 'Bathroom mirror — bevelled edge, 6mm, wall-mount', materialCost: 80, labourCost: 40, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-glass-004', category: 'glassworks', subCategory: 'mirror', description: 'Full-length mirror — bedroom / wardrobe door', materialCost: 120, labourCost: 50, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-glass-005', category: 'glassworks', subCategory: 'backsplash', description: 'Glass backsplash panel — toughened, printed', materialCost: 60, labourCost: 40, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── CEILING ────────────────────────────────────────────
    { id: 'pl-ceil-001', category: 'ceiling', subCategory: 'false_ceiling', description: 'False ceiling — 9mm gypsum board, full area', materialCost: 2, labourCost: 3, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-ceil-002', category: 'ceiling', subCategory: 'cove', description: 'L-box / curtain pelmet — gypsum, concealed track', materialCost: 8, labourCost: 10, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-ceil-003', category: 'ceiling', subCategory: 'cove_lighting', description: 'Cove lighting trough — indirect LED strip housing', materialCost: 10, labourCost: 12, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-ceil-004', category: 'ceiling', subCategory: 'feature', description: 'Feature ceiling — multi-level / stepped profile', materialCost: 5, labourCost: 7, unit: 'sqft', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-ceil-005', category: 'ceiling', subCategory: 'access_panel', description: 'Access panel for maintenance — 600×600mm', materialCost: 30, labourCost: 25, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── FLOORING ───────────────────────────────────────────
    { id: 'pl-floor-001', category: 'flooring', subCategory: 'vinyl', description: 'SPC vinyl plank — click-lock, 4mm + underlay', materialCost: 3, labourCost: 2, unit: 'sqft', currency: 'SGD', tier: 'budget', lastUpdated: '2025-01-15' },
    { id: 'pl-floor-002', category: 'flooring', subCategory: 'vinyl', description: 'Luxury vinyl tile (LVT) — herringbone pattern', materialCost: 5, labourCost: 3.5, unit: 'sqft', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-floor-003', category: 'flooring', subCategory: 'timber', description: 'Engineered timber flooring — oak/walnut veneer', materialCost: 10, labourCost: 5, unit: 'sqft', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-floor-004', category: 'flooring', subCategory: 'laminate', description: 'Laminate flooring — 12mm, AC4 commercial grade', materialCost: 3.5, labourCost: 2, unit: 'sqft', currency: 'SGD', tier: 'budget', lastUpdated: '2025-01-15' },
    { id: 'pl-floor-005', category: 'flooring', subCategory: 'marble', description: 'Marble flooring — Volakas white, polished', materialCost: 28, labourCost: 14, unit: 'sqft', currency: 'SGD', tier: 'luxury', lastUpdated: '2025-01-15' },
    { id: 'pl-floor-006', category: 'flooring', subCategory: 'epoxy', description: 'Epoxy floor coating — industrial / decorative', materialCost: 8, labourCost: 6, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-floor-007', category: 'flooring', subCategory: 'levelling', description: 'Self-levelling compound — floor prep, 3-5mm', materialCost: 2, labourCost: 2, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-floor-008', category: 'flooring', subCategory: 'skirting', description: 'Timber skirting — matching flooring, 80mm', materialCost: 3, labourCost: 2, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── PAINTING ───────────────────────────────────────────
    { id: 'pl-paint-001', category: 'painting', subCategory: 'emulsion', description: 'Painting walls — 2 coats emulsion (Nippon / Dulux)', materialCost: 0.80, labourCost: 1.20, unit: 'sqft', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-paint-002', category: 'painting', subCategory: 'emulsion', description: 'Painting walls — 3 coats premium (Jotun / Benjamin Moore)', materialCost: 1.60, labourCost: 1.50, unit: 'sqft', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-paint-003', category: 'painting', subCategory: 'ceiling', description: 'Painting ceiling — 2 coats ceiling white', materialCost: 0.50, labourCost: 0.80, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-paint-004', category: 'painting', subCategory: 'feature', description: 'Feature wall — textured paint / limewash effect', materialCost: 4, labourCost: 6, unit: 'sqft', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-paint-005', category: 'painting', subCategory: 'skim_coat', description: 'Skim coat + painting — new plasterboard surfaces', materialCost: 1.5, labourCost: 2, unit: 'sqft', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── ELECTRICAL ─────────────────────────────────────────
    { id: 'pl-elec-001', category: 'electrical', subCategory: 'rewiring', description: 'Full unit rewiring — new cables from DB to all points', materialCost: 1200, labourCost: 1600, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-elec-002', category: 'electrical', subCategory: 'power_point', description: 'Power point — 13A twin socket, supply + install', materialCost: 25, labourCost: 55, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-elec-003', category: 'electrical', subCategory: 'power_point', description: 'Power point — 15A aircon socket', materialCost: 30, labourCost: 60, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-elec-004', category: 'electrical', subCategory: 'power_point', description: 'USB socket point — dual USB-A / USB-C', materialCost: 35, labourCost: 55, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-elec-005', category: 'electrical', subCategory: 'light_point', description: 'Light point — ceiling, with switch', materialCost: 20, labourCost: 35, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-elec-006', category: 'electrical', subCategory: 'downlight', description: 'LED downlight — recessed, 12W, supply + install', materialCost: 18, labourCost: 30, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-elec-007', category: 'electrical', subCategory: 'led_strip', description: 'LED strip — cove lighting, per metre, with driver', materialCost: 12, labourCost: 15, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-elec-008', category: 'electrical', subCategory: 'fan_point', description: 'Ceiling fan point — supply + install, with regulator', materialCost: 35, labourCost: 55, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-elec-009', category: 'electrical', subCategory: 'data_point', description: 'Data point — CAT6 ethernet', materialCost: 30, labourCost: 50, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-elec-010', category: 'electrical', subCategory: 'db_board', description: 'DB board / consumer unit — RCBO upgrade', materialCost: 400, labourCost: 350, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-elec-011', category: 'electrical', subCategory: 'oven_circuit', description: 'Dedicated 40A circuit — oven / cooktop', materialCost: 80, labourCost: 200, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── PLUMBING ───────────────────────────────────────────
    { id: 'pl-plumb-001', category: 'plumbing', subCategory: 'wc', description: 'WC — wall-hung / close-coupled, supply + install', materialCost: 350, labourCost: 200, unit: 'pcs', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-002', category: 'plumbing', subCategory: 'wc', description: 'WC — premium wall-hung, concealed cistern', materialCost: 700, labourCost: 350, unit: 'pcs', currency: 'SGD', tier: 'premium', brand: 'Duravit', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-003', category: 'plumbing', subCategory: 'basin', description: 'Basin + vanity cabinet — countertop/undermount', materialCost: 250, labourCost: 150, unit: 'pcs', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-004', category: 'plumbing', subCategory: 'kitchen_sink', description: 'Kitchen sink — single/double bowl, undermount', materialCost: 150, labourCost: 100, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-005', category: 'plumbing', subCategory: 'mixer_tap', description: 'Mixer tap — basin, single-lever', materialCost: 80, labourCost: 40, unit: 'pcs', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-006', category: 'plumbing', subCategory: 'mixer_tap', description: 'Mixer tap — kitchen, pull-out spray head', materialCost: 150, labourCost: 50, unit: 'pcs', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-007', category: 'plumbing', subCategory: 'shower_set', description: 'Rain shower set — overhead + handheld', materialCost: 120, labourCost: 80, unit: 'pcs', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-008', category: 'plumbing', subCategory: 'shower_set', description: 'Rain shower set — thermostatic, premium', materialCost: 350, labourCost: 120, unit: 'pcs', currency: 'SGD', tier: 'premium', brand: 'Grohe', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-009', category: 'plumbing', subCategory: 'water_heater', description: 'Instant water heater — single point', materialCost: 180, labourCost: 80, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-010', category: 'plumbing', subCategory: 'water_heater', description: 'Storage water heater — 30L, multipoint', materialCost: 350, labourCost: 150, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-011', category: 'plumbing', subCategory: 'floor_trap', description: 'Floor trap / grating — stainless steel', materialCost: 15, labourCost: 30, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-012', category: 'plumbing', subCategory: 'exhaust_fan', description: 'Exhaust fan — bathroom, with ducting', materialCost: 45, labourCost: 35, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-013', category: 'plumbing', subCategory: 'accessories', description: 'Bathroom accessories — towel bar, tissue holder, hooks', materialCost: 80, labourCost: 70, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-014', category: 'plumbing', subCategory: 'bidet', description: 'Bidet spray set — chrome, with valve', materialCost: 40, labourCost: 30, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-plumb-015', category: 'plumbing', subCategory: 'concealed_piping', description: 'Concealed piping reroute — hot/cold water', materialCost: 200, labourCost: 400, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── DOORS ──────────────────────────────────────────────
    { id: 'pl-door-001', category: 'carpentry', subCategory: 'bedroom_door', description: 'Bedroom door — hollow core, laminate, with frame + hardware', materialCost: 280, labourCost: 170, unit: 'pcs', currency: 'SGD', tier: 'standard', lastUpdated: '2025-01-15' },
    { id: 'pl-door-002', category: 'carpentry', subCategory: 'bedroom_door', description: 'Bedroom door — solid core, veneer, premium hardware', materialCost: 500, labourCost: 220, unit: 'pcs', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-door-003', category: 'carpentry', subCategory: 'bathroom_door', description: 'Bathroom door — aluminium frame, frosted glass', materialCost: 200, labourCost: 150, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-door-004', category: 'carpentry', subCategory: 'main_door', description: 'Main door — solid timber, premium hardware + digital lock', materialCost: 800, labourCost: 300, unit: 'pcs', currency: 'SGD', tier: 'premium', lastUpdated: '2025-01-15' },
    { id: 'pl-door-005', category: 'carpentry', subCategory: 'sliding_door', description: 'Sliding door — aluminium frame, glass panel', materialCost: 500, labourCost: 250, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-door-006', category: 'carpentry', subCategory: 'bifold_door', description: 'Bi-fold door — aluminium, for kitchen/yard', materialCost: 600, labourCost: 300, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── AIRCON ──────────────────────────────────────────────
    { id: 'pl-aircon-001', category: 'aircon', subCategory: 'system_2', description: 'Aircon system 2 — 1 condenser + 2 FCU (Daikin)', materialCost: 2000, labourCost: 800, unit: 'set', currency: 'SGD', tier: 'standard', brand: 'Daikin', lastUpdated: '2025-01-15' },
    { id: 'pl-aircon-002', category: 'aircon', subCategory: 'system_3', description: 'Aircon system 3 — 1 condenser + 3 FCU (Daikin)', materialCost: 2600, labourCost: 1000, unit: 'set', currency: 'SGD', tier: 'standard', brand: 'Daikin', lastUpdated: '2025-01-15' },
    { id: 'pl-aircon-003', category: 'aircon', subCategory: 'system_4', description: 'Aircon system 4 — 1 condenser + 4 FCU (Mitsubishi)', materialCost: 3200, labourCost: 1200, unit: 'set', currency: 'SGD', tier: 'standard', brand: 'Mitsubishi', lastUpdated: '2025-01-15' },
    { id: 'pl-aircon-004', category: 'aircon', subCategory: 'system_5', description: 'Aircon system 5 — 1 condenser + 5 FCU (Daikin)', materialCost: 3800, labourCost: 1400, unit: 'set', currency: 'SGD', tier: 'standard', brand: 'Daikin', lastUpdated: '2025-01-15' },
    { id: 'pl-aircon-005', category: 'aircon', subCategory: 'trunking', description: 'Aircon trunking — concealed PVC casing', materialCost: 15, labourCost: 20, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-aircon-006', category: 'aircon', subCategory: 'piping', description: 'Copper piping extension — per metre', materialCost: 30, labourCost: 25, unit: 'lm', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-aircon-007', category: 'aircon', subCategory: 'chemical_wash', description: 'Chemical wash — per FCU', materialCost: 20, labourCost: 50, unit: 'pcs', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-aircon-008', category: 'aircon', subCategory: 'dismantle', description: 'Dismantle and dispose existing AC units', materialCost: 0, labourCost: 200, unit: 'set', currency: 'SGD', lastUpdated: '2025-01-15' },

    // ─── DESIGN & SUBMISSIONS ───────────────────────────────
    { id: 'pl-design-001', category: 'design_submissions', subCategory: 'space_planning', description: 'Space planning + conceptual layout — 2 options', materialCost: 0, labourCost: 800, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-design-002', category: 'design_submissions', subCategory: 'working_drawings', description: 'Working drawings — floor plan, electrical, ceiling, elevation', materialCost: 0, labourCost: 1200, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-design-003', category: 'design_submissions', subCategory: 'renders', description: '3D perspective renders — living, kitchen, master bedroom', materialCost: 0, labourCost: 800, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-design-004', category: 'design_submissions', subCategory: 'permit', description: 'HDB renovation permit submission', materialCost: 0, labourCost: 350, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-design-005', category: 'design_submissions', subCategory: 'permit', description: 'BCA structural submission — PE endorsement', materialCost: 0, labourCost: 2500, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-design-006', category: 'design_submissions', subCategory: 'project_mgmt', description: 'Project management — weekly site supervision', materialCost: 0, labourCost: 300, unit: 'lot', currency: 'SGD', notes: 'Per visit, typically 8-12 visits per project', lastUpdated: '2025-01-15' },

    // ─── CLEANING ───────────────────────────────────────────
    { id: 'pl-clean-001', category: 'cleaning', subCategory: 'deep_clean', description: 'Post-renovation deep cleaning — full unit', materialCost: 50, labourCost: 350, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-clean-002', category: 'cleaning', subCategory: 'acid_wash', description: 'Chemical cleaning — acid wash for grout haze', materialCost: 30, labourCost: 200, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
    { id: 'pl-clean-003', category: 'cleaning', subCategory: 'defect_round', description: 'Defect rectification round — touch-ups before handover', materialCost: 50, labourCost: 250, unit: 'lot', currency: 'SGD', lastUpdated: '2025-01-15' },
];

// ============================================================
// LOCAL STORAGE MANAGEMENT — designer-owned rates
// ============================================================

const PRICELIST_STORAGE_KEY = 'arc-quote-pricelists';

/**
 * Get all pricelist items (user-customized + seed defaults).
 * User's custom items take priority over seed data with same ID.
 */
export function getAllPricelistItems(): PricelistItem[] {
    if (typeof window === 'undefined') return SEED_PRICELIST;

    const stored = localStorage.getItem(PRICELIST_STORAGE_KEY);
    if (!stored) return SEED_PRICELIST;

    try {
        const customItems: PricelistItem[] = JSON.parse(stored);
        // Merge: custom items override seed items by ID
        const customIds = new Set(customItems.map(i => i.id));
        const seedItems = SEED_PRICELIST.filter(i => !customIds.has(i.id));
        return [...customItems, ...seedItems];
    } catch {
        return SEED_PRICELIST;
    }
}

/**
 * Get pricelist items for a specific trade category.
 */
export function getPricelistByTrade(category: TradeCategory): PricelistItem[] {
    return getAllPricelistItems().filter(i => i.category === category);
}

/**
 * Get pricelist items matching a search query.
 */
export function searchPricelist(query: string, category?: TradeCategory): PricelistItem[] {
    const q = query.toLowerCase();
    return getAllPricelistItems().filter(i => {
        if (category && i.category !== category) return false;
        return i.description.toLowerCase().includes(q) ||
            i.subCategory.toLowerCase().includes(q) ||
            (i.brand && i.brand.toLowerCase().includes(q));
    });
}

/**
 * Save / update a pricelist item (designer's own rate).
 */
export function savePricelistItem(item: PricelistItem): void {
    if (typeof window === 'undefined') return;

    const all = getAllCustomItems();
    const idx = all.findIndex(i => i.id === item.id);
    if (idx >= 0) {
        all[idx] = { ...item, lastUpdated: new Date().toISOString().split('T')[0] };
    } else {
        all.push({ ...item, lastUpdated: new Date().toISOString().split('T')[0] });
    }
    localStorage.setItem(PRICELIST_STORAGE_KEY, JSON.stringify(all));
}

/**
 * Delete a custom pricelist item.
 */
export function deletePricelistItem(id: string): void {
    if (typeof window === 'undefined') return;

    const all = getAllCustomItems().filter(i => i.id !== id);
    localStorage.setItem(PRICELIST_STORAGE_KEY, JSON.stringify(all));
}

/**
 * Get only user-customized items (not seed).
 */
function getAllCustomItems(): PricelistItem[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(PRICELIST_STORAGE_KEY);
    if (!stored) return [];

    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

/**
 * Reset pricelists to seed defaults.
 */
export function resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PRICELIST_STORAGE_KEY);
}
