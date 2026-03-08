// ============================================================
// MATERIAL ENCYCLOPEDIA — Central Index
// Import everything from here: import { ... } from '@/data/encyclopedia'
// Or import from specific files: import { ... } from '@/data/encyclopedia/tiles'
// ============================================================

// ── Core Types ──
export type { SupplierInfo, MaterialEntry, MotifEntry, MaterialSelection } from './core';

// ── Suppliers ──
export { DEMO_SUPPLIERS } from './suppliers';

// ── Natural Stone ──
export { STONE_TYPES, STONE_NAMES } from './naturalStone';

// ── Wood Species ──
export { WOOD_SPECIES } from './woodSpecies';

// ── Tiles (Basic) ──
export { TILE_MATERIALS, TILE_LAYOUTS } from './tilesBasic';

// ── Tiles (Advanced — with pricing) ──
export type { TileEntry, TileLayingCost } from './tilesAdvanced';
export { TILE_ENCYCLOPEDIA, TILE_LAYING_COSTS } from './tilesAdvanced';

// ── World Motifs ──
export { WORLD_MOTIFS } from './motifs';

// ── Soft Furnishing ──
export { CURTAIN_STYLES, BLIND_TYPES } from './softFurnishing';

// ── Wallpaper ──
export { WALLPAPER_TYPES, WALLPAPER_PATTERNS } from './wallpaper';

export { METAL_MATERIALS, METAL_FINISHES, PLYWOOD_GRADES, PLYWOOD_SPECIES } from './materials';

// ── Architecture ──
export type { ArchitectureStyle } from './architecture';
export { VERNACULAR_ARCHITECTURE, ADDITIONAL_ARCHITECTURE } from './architecture';

// ── Paint Finishes ──
export type { PaintEntry } from './paintFinishes';
export { PAINT_BRANDS, PAINT_FINISHES } from './paintFinishes';

// ── Search ──
export { getMotifRegions, searchMaterials } from './search';

// ── Furniture ──
export type { FurnitureEntry } from './furniture';
export { PEDIGREE_FURNITURE } from './furniture';

// ── Craft Heritage ──
export type { CraftEntry } from './craftHeritage';
export { CRAFT_HERITAGE } from './craftHeritage';

// ── Lighting ──
export type { LightingEntry } from './lighting';
export { LIGHTING_DESIGNS } from './lighting';

// ── Cabinetry ──
export type { PlywoodGrade, AssemblyMethod, CabinetHardware, CabinetTier } from './cabinetry';
export { PLYWOOD_ENCYCLOPEDIA, ASSEMBLY_METHODS, CABINET_HARDWARE, CABINET_TIERS } from './cabinetry';

// ── Pricing Transparency ──
export type { OverheadCostItem, RenovationPriceRange, MarginLineItem, ProjectCostBreakdown, IndustryMarkup } from './pricingTransparency';
export { RENOVATION_OVERHEAD_COSTS, SG_RENOVATION_PRICES, MARGIN_LINE_ITEMS, PROJECT_COST_EXAMPLE, INDUSTRY_MARKUP_COMPARISON } from './pricingTransparency';

// ── Cabinet Door Styles ──
export type { CabinetDoorStyle } from './cabinetDoorStyles';
export { CABINET_DOOR_STYLES } from './cabinetDoorStyles';

// ── Millwork ──
export type { MillworkType } from './millwork';
export { MILLWORK_TYPES } from './millwork';

// ── Countertops ──
export type { CountertopEdgeProfile } from './countertops';
export { COUNTERTOP_EDGE_PROFILES } from './countertops';

// ── Wall Finishes ──
export type { WallFinish } from './wallFinishes';
export { WALL_FINISHES } from './wallFinishes';
