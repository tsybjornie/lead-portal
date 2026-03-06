/**
 * Carpentry Catalog
 * Every creative cabinetry & built-in configuration a cabinet maker can do.
 * Organized by room context with rates, descriptions, and dimensions.
 */

// ============================================================
// TYPES
// ============================================================

export interface CarpentryConfig {
    id: string;
    name: string;
    category: CarpentryCategory;
    rooms: RoomContext[];
    description: string;
    materialNote: string;
    dimensions: string;        // typical SG dimensions
    unitOfMeasure: 'lm' | 'sqft' | 'pcs' | 'set' | 'lot';
    rateRange: { low: number; high: number };   // SGD cost per unit (supply + install)
    complexity: 'simple' | 'moderate' | 'complex' | 'specialist';
    popularIn: ('hdb' | 'condo' | 'landed')[];
    tags: string[];
}

export type CarpentryCategory =
    | 'storage'
    | 'seating'
    | 'sleeping'
    | 'display'
    | 'partitions'
    | 'surfaces'
    | 'concealment'
    | 'specialty';

export type RoomContext =
    | 'living'
    | 'bedroom'
    | 'master'
    | 'kids'
    | 'study'
    | 'dining'
    | 'entryway'
    | 'kitchen'
    | 'utility'
    | 'corridor'
    | 'balcony';

// ============================================================
// THE CATALOG
// ============================================================

export const CARPENTRY_CATALOG: CarpentryConfig[] = [
    // 
    // STORAGE
    // 
    {
        id: 'wardrobe-swing',
        name: 'Swing Door Wardrobe',
        category: 'storage',
        rooms: ['bedroom', 'master'],
        description: 'Full-height wardrobe with hinged swing doors. Most common type. Internal layout: half hanging, half shelves. Carpenter-supplied hinges (soft-close upgrade available as add-on).',
        materialNote: '18mm plywood carcass, melamine/laminate doors',
        dimensions: 'H2400 × D600mm, width varies',
        unitOfMeasure: 'lm',
        rateRange: { low: 380, high: 550 },
        complexity: 'simple',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['wardrobe', 'swing door', 'hinged'],
    },
    {
        id: 'wardrobe-sliding',
        name: 'Sliding Door Wardrobe',
        category: 'storage',
        rooms: ['bedroom', 'master'],
        description: 'Floor-to-ceiling wardrobe with aluminium-track sliding doors. Saves swing clearance space. Cannot access both halves simultaneously.',
        materialNote: '18mm plywood carcass, aluminium frame sliding doors',
        dimensions: 'H2400 × D600mm, width varies',
        unitOfMeasure: 'lm',
        rateRange: { low: 420, high: 620 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo'],
        tags: ['wardrobe', 'sliding'],
    },
    {
        id: 'walkin-wardrobe',
        name: 'Walk-in Wardrobe System',
        category: 'storage',
        rooms: ['master'],
        description: 'Open or enclosed walk-in closet with hanging rods, drawers, shoe racks, accessories trays, and island counter. Requires dedicated room or partition.',
        materialNote: 'Plywood carcass, mix of open shelves + closed cabinets',
        dimensions: 'Custom per room layout  typically 3-5 lm of panels',
        unitOfMeasure: 'lot',
        rateRange: { low: 3500, high: 8000 },
        complexity: 'complex',
        popularIn: ['condo', 'landed'],
        tags: ['walk-in', 'closet', 'dressing'],
    },
    {
        id: 'shoe-cabinet',
        name: 'Shoe Cabinet',
        category: 'storage',
        rooms: ['entryway', 'corridor'],
        description: 'Entryway shoe storage. Slanted shelves for better visibility. Top surface doubles as key/bag drop. Typically includes ventilation slots.',
        materialNote: '18mm plywood, laminate finish, ventilation cutouts',
        dimensions: 'H1200 × W800-1200 × D350mm',
        unitOfMeasure: 'pcs',
        rateRange: { low: 400, high: 800 },
        complexity: 'simple',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['shoe', 'entryway', 'storage'],
    },
    {
        id: 'shoe-cabinet-tall',
        name: 'Full-Height Shoe Cabinet',
        category: 'storage',
        rooms: ['entryway'],
        description: 'Floor-to-ceiling shoe cabinet with pull-out drawers or swing doors. Can store 30-50 pairs. Often combined with mirror on door.',
        materialNote: '18mm plywood, laminate, optional mirror panel',
        dimensions: 'H2400 × W900-1600 × D350mm',
        unitOfMeasure: 'pcs',
        rateRange: { low: 800, high: 1500 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo'],
        tags: ['shoe', 'full-height', 'mirror'],
    },
    {
        id: 'storage-bench',
        name: 'Storage Bench',
        category: 'storage',
        rooms: ['entryway', 'bedroom', 'living', 'balcony'],
        description: 'Seating bench with lift-up or pull-out storage compartment underneath. Great for entryway shoe changing or blanket storage.',
        materialNote: 'Plywood carcass, cushion top (fabric/leather)',
        dimensions: 'H450 × W900-1500 × D400mm',
        unitOfMeasure: 'lm',
        rateRange: { low: 300, high: 500 },
        complexity: 'simple',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['bench', 'storage', 'seating'],
    },
    {
        id: 'overhead-storage',
        name: 'Overhead Storage Cabinet',
        category: 'storage',
        rooms: ['bedroom', 'corridor', 'study'],
        description: 'Wall-mounted cabinets above door frames or along corridor ceilings. Maximises dead space. Common for luggage and seasonal items.',
        materialNote: '18mm plywood, laminate, heavy-duty brackets',
        dimensions: 'H600 × D350mm, width varies',
        unitOfMeasure: 'lm',
        rateRange: { low: 200, high: 350 },
        complexity: 'simple',
        popularIn: ['hdb', 'condo'],
        tags: ['overhead', 'corridor', 'above-door'],
    },
    {
        id: 'utility-cabinet',
        name: 'Utility / Laundry Cabinet',
        category: 'storage',
        rooms: ['utility', 'kitchen', 'balcony'],
        description: 'Tall cabinet to conceal washer/dryer stack, brooms, vacuum, ironing board. Internal shelves adjustable. Water-resistant base.',
        materialNote: 'Marine plywood, laminate, water-resistant base panel',
        dimensions: 'H2000 × W700-1200 × D600mm',
        unitOfMeasure: 'pcs',
        rateRange: { low: 600, high: 1200 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo'],
        tags: ['utility', 'laundry', 'washer'],
    },
    {
        id: 'built-in-shelving',
        name: 'Built-in Shelving Unit',
        category: 'storage',
        rooms: ['living', 'study', 'bedroom'],
        description: 'Floor-to-ceiling open or mixed shelving for books, decor, vinyl. Can integrate lighting, closed lower cabinets, and display niches.',
        materialNote: 'Plywood carcass, mix of open shelves + closed doors',
        dimensions: 'H2400 × W varies × D300-400mm',
        unitOfMeasure: 'lm',
        rateRange: { low: 350, high: 600 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['shelving', 'bookcase', 'display'],
    },

    // 
    // SEATING
    // 
    {
        id: 'window-bench',
        name: 'Window Bench / Bay Seat',
        category: 'seating',
        rooms: ['living', 'bedroom', 'master', 'study'],
        description: 'Built-in bench under window with lift-up storage. Creates a cosy reading nook. Cushion top included or specify upholstery.',
        materialNote: 'Plywood carcass, cushion (foam + fabric or leather)',
        dimensions: 'H450 × D500mm, length = window width',
        unitOfMeasure: 'lm',
        rateRange: { low: 300, high: 550 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['window', 'bench', 'seat', 'bay window', 'nook'],
    },
    {
        id: 'banquette',
        name: 'Banquette / Settee',
        category: 'seating',
        rooms: ['dining', 'living', 'kitchen'],
        description: 'L-shaped or straight built-in dining bench with backrest. Storage under seat. Saves space vs individual chairs. Upholstered back and seat.',
        materialNote: 'Plywood structure, high-density foam, upholstery fabric',
        dimensions: 'H850(back) × seat H450 × D500mm, length varies',
        unitOfMeasure: 'lm',
        rateRange: { low: 400, high: 700 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo'],
        tags: ['banquette', 'settee', 'dining bench', 'booth'],
    },
    {
        id: 'daybed',
        name: 'Built-in Daybed',
        category: 'seating',
        rooms: ['living', 'study', 'balcony'],
        description: 'Elevated platform daybed with storage drawers underneath. Can double as guest sleeping. Backrest cushion creates sofa-like seating during day.',
        materialNote: 'Plywood platform, drawers, foam mattress + bolsters',
        dimensions: 'H450 × W900 × L1800mm platform',
        unitOfMeasure: 'set',
        rateRange: { low: 1200, high: 2500 },
        complexity: 'moderate',
        popularIn: ['condo', 'landed'],
        tags: ['daybed', 'lounge', 'guest bed'],
    },

    // 
    // SLEEPING
    // 
    {
        id: 'platform-bed',
        name: 'Platform Bed with Storage',
        category: 'sleeping',
        rooms: ['bedroom', 'master'],
        description: 'Raised platform (200-400mm) with gas-lift or drawer storage. Entire mattress area sits on the platform. Eliminates need for bed frame.',
        materialNote: 'Plywood platform, gas-lift mechanism or drawer tracks',
        dimensions: 'Queen: 1530 × 1900mm, King: 1830 × 1900mm, H200-400mm',
        unitOfMeasure: 'set',
        rateRange: { low: 1500, high: 3000 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo'],
        tags: ['platform', 'bed', 'storage', 'tatami'],
    },
    {
        id: 'murphy-bed',
        name: 'Murphy Bed (Wall Bed)',
        category: 'sleeping',
        rooms: ['bedroom', 'study', 'living'],
        description: 'Bed that folds up into a wall cabinet when not in use. Springs or gas-strut mechanism. Exterior panel becomes desk or bookshelf face.',
        materialNote: 'Plywood carcass, heavy-duty spring/gas mechanism, laminate',
        dimensions: 'Single: W1000mm, Queen: W1530mm, H2100mm panel',
        unitOfMeasure: 'set',
        rateRange: { low: 3000, high: 6000 },
        complexity: 'specialist',
        popularIn: ['condo'],
        tags: ['murphy', 'wall bed', 'fold-up', 'space-saving'],
    },
    {
        id: 'loft-bed',
        name: 'Loft Bed with Desk Below',
        category: 'sleeping',
        rooms: ['kids', 'bedroom'],
        description: 'Elevated sleeping platform (1200-1500mm above floor) with study desk, shelving, or wardrobe below. Safety railing included.',
        materialNote: 'Plywood + solid timber frame, safety railing, ladder',
        dimensions: 'Bed: single 900×1900mm, elevated 1200-1500mm',
        unitOfMeasure: 'set',
        rateRange: { low: 2500, high: 5000 },
        complexity: 'complex',
        popularIn: ['hdb', 'condo'],
        tags: ['loft', 'bunk', 'kids', 'elevated', 'study'],
    },
    {
        id: 'tatami-platform',
        name: 'Japanese Tatami Platform',
        category: 'sleeping',
        rooms: ['bedroom', 'master', 'study'],
        description: 'Low raised platform (150-300mm) covering entire room or section. Drawers or flip-up storage panels. Japanese-minimal aesthetic.',
        materialNote: 'Plywood platform, optional tatami mat surface, drawer tracks',
        dimensions: 'Room-width × depth varies, H150-300mm',
        unitOfMeasure: 'sqft',
        rateRange: { low: 25, high: 45 },
        complexity: 'moderate',
        popularIn: ['condo', 'landed'],
        tags: ['tatami', 'japanese', 'platform', 'zen'],
    },

    // 
    // DISPLAY & FEATURE
    // 
    {
        id: 'feature-wall',
        name: 'Feature Wall Panel',
        category: 'display',
        rooms: ['living', 'master', 'dining'],
        description: 'Decorative wall panelling behind TV or bed. Fluted panels, slatted timber, marble lookalike, or fabric-wrapped. Can include concealed storage.',
        materialNote: 'Fluted MDF, timber slats, veneer, or PU panel',
        dimensions: 'Custom  typically 8-12 ft wide × floor-to-ceiling',
        unitOfMeasure: 'sqft',
        rateRange: { low: 80, high: 200 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['feature wall', 'fluted', 'slatted', 'accent', 'TV wall'],
    },
    {
        id: 'tv-console',
        name: 'TV Console / Media Unit',
        category: 'display',
        rooms: ['living'],
        description: 'Floating or floor-standing console below TV. Includes cable management, media equipment shelf, and closed storage drawers.',
        materialNote: 'Plywood carcass, laminate or veneer finish',
        dimensions: 'H400-500 × D400 × W1500-2400mm',
        unitOfMeasure: 'lm',
        rateRange: { low: 250, high: 450 },
        complexity: 'simple',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['TV', 'console', 'media', 'floating'],
    },
    {
        id: 'display-cabinet',
        name: 'Display Cabinet (Glass Front)',
        category: 'display',
        rooms: ['living', 'dining', 'corridor'],
        description: 'Glass-fronted cabinet for collectibles, figurines, wine, or china. Interior LED lighting. Tempered glass shelves and doors.',
        materialNote: 'Plywood carcass, tempered glass doors, LED strips',
        dimensions: 'H2000-2400 × W600-1200 × D350mm',
        unitOfMeasure: 'pcs',
        rateRange: { low: 800, high: 2000 },
        complexity: 'moderate',
        popularIn: ['condo', 'landed'],
        tags: ['display', 'glass', 'vitrine', 'collectibles'],
    },
    {
        id: 'altar-cabinet',
        name: 'Prayer Altar / Shrine Cabinet',
        category: 'display',
        rooms: ['living', 'dining', 'corridor'],
        description: 'Wall-mounted or floor-standing altar cabinet. Pull-out incense tray, concealed behind sliding panel. Cultural design considerations.',
        materialNote: 'Solid timber or plywood with veneer, brass hardware',
        dimensions: 'W600-1000 × H800-1200 × D300mm',
        unitOfMeasure: 'pcs',
        rateRange: { low: 500, high: 1500 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['altar', 'prayer', 'shrine', 'cultural'],
    },
    {
        id: 'wine-rack',
        name: 'Wine Rack / Bar Cabinet',
        category: 'display',
        rooms: ['living', 'dining', 'kitchen'],
        description: 'Built-in wine storage with diamond lattice, horizontal slots, or pull-out trays. Can include glass holder rail and mini bar counter.',
        materialNote: 'Plywood, timber lattice, tempered glass shelf',
        dimensions: 'Custom  from 4-bottle niche to full wine wall',
        unitOfMeasure: 'pcs',
        rateRange: { low: 400, high: 2500 },
        complexity: 'moderate',
        popularIn: ['condo', 'landed'],
        tags: ['wine', 'bar', 'rack', 'drinks'],
    },

    // 
    // PARTITIONS & DIVIDERS
    // 
    {
        id: 'partition-cabinet',
        name: 'Partition Cabinet (Room Divider)',
        category: 'partitions',
        rooms: ['living', 'dining', 'study'],
        description: 'Freestanding or ceiling-anchored cabinet used as room divider. Open shelves on one side, closed storage on the other. Alternative to drywall.',
        materialNote: 'Plywood carcass, laminate, open + closed mixed',
        dimensions: 'H2400 × W varies × D350-400mm',
        unitOfMeasure: 'lm',
        rateRange: { low: 400, high: 700 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo'],
        tags: ['partition', 'divider', 'room divider'],
    },
    {
        id: 'slatted-screen',
        name: 'Timber Slat Screen / Divider',
        category: 'partitions',
        rooms: ['living', 'dining', 'entryway'],
        description: 'Vertical or horizontal timber slats as semi-transparent divider. Provides spatial definition while allowing light and airflow through.',
        materialNote: 'Solid timber slats (nyatoh, oak, or engineered), metal base frame',
        dimensions: 'H2400 × W varies, slat spacing 30-50mm',
        unitOfMeasure: 'lm',
        rateRange: { low: 300, high: 600 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['slat', 'screen', 'divider', 'timber'],
    },
    {
        id: 'sliding-partition',
        name: 'Sliding Partition Panel',
        category: 'partitions',
        rooms: ['living', 'study', 'bedroom'],
        description: 'Ceiling-mounted track with sliding panels to open/close a room. Can be solid, glass-insert, or slatted. Stacks flat when open.',
        materialNote: 'Plywood/timber panels, ceiling track + roller hardware',
        dimensions: 'H2400mm per panel, W600-900mm per panel',
        unitOfMeasure: 'pcs',
        rateRange: { low: 400, high: 800 },
        complexity: 'complex',
        popularIn: ['condo', 'landed'],
        tags: ['sliding', 'partition', 'flexible', 'track'],
    },

    // 
    // SURFACES & DESKS
    // 
    {
        id: 'study-desk',
        name: 'Built-in Study Desk',
        category: 'surfaces',
        rooms: ['study', 'bedroom', 'kids'],
        description: 'Wall-mounted or leg-supported study desk with cable management slot, drawer unit, and overhead shelf. Integrates with wardrobe run. Basic cable grommet included.',
        materialNote: 'Plywood, laminate or solid timber top, 60mm cable grommet',
        dimensions: 'H750 desk height × D600 × W varies',
        unitOfMeasure: 'lm',
        rateRange: { low: 250, high: 450 },
        complexity: 'simple',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['desk', 'study', 'work-from-home'],
    },
    {
        id: 'study-table-tech',
        name: 'Study Table with Tech Integration',
        category: 'surfaces',
        rooms: ['study', 'bedroom', 'master'],
        description: 'Premium work desk with hidden flip-up power switch panel (USB-A/C + 3-pin sockets), rubber gasket cable pass-through (seals when cables removed), under-desk cable tray, monitor arm reinforcement plate, and keyboard tray. Full WFH setup.',
        materialNote: 'Plywood, laminate/solid surface top, flip-up Bachmann/Kondator power unit, rubber gasket grommets, steel cable tray',
        dimensions: 'H750 × D700 × W1200-1800mm',
        unitOfMeasure: 'pcs',
        rateRange: { low: 800, high: 1800 },
        complexity: 'moderate',
        popularIn: ['condo', 'landed'],
        tags: ['desk', 'study', 'flip-up', 'power switch', 'rubber gasket', 'cable management', 'WFH', 'monitor arm'],
    },
    {
        id: 'aluminium-cabinet',
        name: 'Aluminium Frame Cabinet',
        category: 'storage',
        rooms: ['kitchen', 'balcony', 'utility'],
        description: 'Cabinet with aluminium frame and composite/aluminium panel doors. Fully waterproof and termite-proof. Ideal for outdoor kitchens, wet balconies, and utility areas. Will never warp or delaminate.',
        materialNote: 'Aluminium extrusion frame, aluminium composite panel (ACP) doors, SS hinges',
        dimensions: 'Custom  matches standard kitchen module sizes',
        unitOfMeasure: 'lm',
        rateRange: { low: 500, high: 850 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['aluminium', 'waterproof', 'outdoor', 'wet area', 'termite-proof', 'balcony kitchen'],
    },
    {
        id: 'ss-kitchen-cabinet',
        name: 'Stainless Steel Kitchen Cabinet',
        category: 'storage',
        rooms: ['kitchen'],
        description: 'Full stainless steel cabinet system  carcass, doors, and countertop all in SS304. Commercial-grade hygiene. Easy to clean, heat-resistant, zero formaldehyde. Common in professional and high-end residential kitchens.',
        materialNote: 'SS304 grade, 1.2mm thickness, brushed or mirror finish',
        dimensions: 'Standard kitchen module sizes, H720/850 × D550-600mm',
        unitOfMeasure: 'lm',
        rateRange: { low: 800, high: 1500 },
        complexity: 'complex',
        popularIn: ['landed'],
        tags: ['stainless steel', 'SS', 'kitchen', 'commercial', 'hygienic', 'SS304'],
    },
    {
        id: 'ss-outdoor-kitchen',
        name: 'SS Outdoor Kitchen / BBQ Station',
        category: 'surfaces',
        rooms: ['balcony', 'utility'],
        description: 'Weather-resistant outdoor cooking station in stainless steel. Includes countertop, gas line prep, under-counter storage, and backsplash. For balcony grilling or landed patio.',
        materialNote: 'SS304/316 (316 for coastal), granite or SS countertop',
        dimensions: 'Custom L-shape or straight run, H900 × D600mm',
        unitOfMeasure: 'lm',
        rateRange: { low: 1000, high: 2000 },
        complexity: 'specialist',
        popularIn: ['landed'],
        tags: ['outdoor', 'BBQ', 'stainless steel', 'kitchen', 'patio', 'grill'],
    },
    {
        id: 'metal-hybrid-cabinet',
        name: 'Metal-Hybrid Cabinet (Metal Frame + Plywood)',
        category: 'storage',
        rooms: ['kitchen', 'utility', 'study'],
        description: 'Industrial-look cabinet with powder-coated mild steel or aluminium frame combined with plywood/laminate panels. Lighter visual weight, modern aesthetic.',
        materialNote: 'Mild steel or aluminium frame, plywood panel infill, powder coat',
        dimensions: 'Custom per design, standard cabinet depths',
        unitOfMeasure: 'lm',
        rateRange: { low: 450, high: 750 },
        complexity: 'complex',
        popularIn: ['condo', 'landed'],
        tags: ['metal', 'hybrid', 'industrial', 'steel frame', 'aluminium frame'],
    },
    {
        id: 'vanity-table',
        name: 'Built-in Vanity / Dressing Table',
        category: 'surfaces',
        rooms: ['master', 'bedroom'],
        description: 'Makeup vanity with mirror, LED lighting, drawer organizers for cosmetics, hair tools. Often built into wardrobe system.',
        materialNote: 'Plywood, laminate, mirror panel, LED strip',
        dimensions: 'H750 × W800-1200 × D450mm',
        unitOfMeasure: 'pcs',
        rateRange: { low: 500, high: 1200 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['vanity', 'dressing', 'makeup', 'mirror'],
    },
    {
        id: 'floating-ledge',
        name: 'Floating Shelf / Ledge',
        category: 'surfaces',
        rooms: ['living', 'bedroom', 'dining', 'corridor'],
        description: 'Wall-mounted floating shelves for display or small storage. Concealed bracket mounting. Can run full wall length.',
        materialNote: 'Solid timber, plywood + veneer, or stone',
        dimensions: 'D200-300 × H30-50mm, length varies',
        unitOfMeasure: 'lm',
        rateRange: { low: 80, high: 180 },
        complexity: 'simple',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['floating', 'shelf', 'ledge', 'display'],
    },
    {
        id: 'island-counter',
        name: 'Kitchen Island / Peninsula Counter',
        category: 'surfaces',
        rooms: ['kitchen', 'dining'],
        description: 'Freestanding or wall-attached island with countertop overhang for bar seating. Includes base storage, power outlets, and plumbing prep for sink.',
        materialNote: 'Plywood base, quartz/granite/solid surface top',
        dimensions: 'H900 × W600-900 × L1200-2400mm',
        unitOfMeasure: 'lm',
        rateRange: { low: 500, high: 900 },
        complexity: 'complex',
        popularIn: ['condo', 'landed'],
        tags: ['island', 'peninsula', 'counter', 'bar'],
    },

    // 
    // CONCEALMENT & HIDDEN
    // 
    {
        id: 'hidden-door',
        name: 'Hidden / Secret Door',
        category: 'concealment',
        rooms: ['living', 'bedroom', 'master', 'study'],
        description: 'Door disguised as part of a wall panel or bookshelf. Push-open or touch-latch mechanism. Seamless when closed  no visible handle or frame.',
        materialNote: 'Plywood door leaf, concealed hinges, push-latch mechanism',
        dimensions: 'Standard door: W800-900 × H2100mm',
        unitOfMeasure: 'pcs',
        rateRange: { low: 1200, high: 3000 },
        complexity: 'specialist',
        popularIn: ['condo', 'landed'],
        tags: ['hidden', 'secret', 'concealed', 'jib door'],
    },
    {
        id: 'db-box-cover',
        name: 'DB Box / Utility Panel Cover',
        category: 'concealment',
        rooms: ['living', 'corridor', 'entryway'],
        description: 'Decorative panel to conceal electrical DB box, water heater, or AC condenser. Swing-open or magnetic panel for maintenance access.',
        materialNote: 'Plywood panel, magnetic catch or concealed hinges',
        dimensions: 'Custom to DB box size, typically 600×800mm',
        unitOfMeasure: 'pcs',
        rateRange: { low: 200, high: 500 },
        complexity: 'simple',
        popularIn: ['hdb', 'condo'],
        tags: ['DB box', 'cover', 'concealment', 'utility'],
    },
    {
        id: 'aircon-casing',
        name: 'Air-con Casing / Trunking Cover',
        category: 'concealment',
        rooms: ['living', 'bedroom', 'master'],
        description: 'Timber or plywood casing to conceal exposed AC trunking and piping. Integrates with false ceiling or runs along wall-ceiling junction.',
        materialNote: 'Plywood, laminate, with access panel for servicing',
        dimensions: 'Cross-section ~200×150mm, length varies per run',
        unitOfMeasure: 'lm',
        rateRange: { low: 80, high: 180 },
        complexity: 'simple',
        popularIn: ['hdb', 'condo'],
        tags: ['aircon', 'trunking', 'casing', 'concealment'],
    },
    {
        id: 'pipe-boxing',
        name: 'Pipe Boxing / Column Cladding',
        category: 'concealment',
        rooms: ['living', 'kitchen', 'bedroom'],
        description: 'Box-up exposed pipes, structural columns, or beams. Can be finished to match wall or treated as design feature with niches.',
        materialNote: 'Plywood + plastered + painted, or laminate wrap',
        dimensions: 'Custom per pipe/column dimension',
        unitOfMeasure: 'lm',
        rateRange: { low: 60, high: 150 },
        complexity: 'simple',
        popularIn: ['hdb', 'condo'],
        tags: ['boxing', 'pipe', 'column', 'cladding'],
    },

    // 
    // SPECIALTY / CREATIVE
    // 
    {
        id: 'pet-nook',
        name: 'Pet Nook / Built-in Pet House',
        category: 'specialty',
        rooms: ['living', 'utility', 'corridor'],
        description: 'Built-in niche or under-stair pet bed with ventilation. Can include feeding station pull-out and litter concealment.',
        materialNote: 'Plywood, laminate, washable interior surface',
        dimensions: 'W600-800 × H500-700 × D500mm',
        unitOfMeasure: 'pcs',
        rateRange: { low: 400, high: 1000 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['pet', 'dog', 'cat', 'nook'],
    },
    {
        id: 'kids-play-loft',
        name: "Kids' Play Loft / Bunk System",
        category: 'specialty',
        rooms: ['kids'],
        description: 'Custom bunk bed with integrated play area, slide, climbing wall, or fort structure. Safety railings, rounded edges. Shared room solution.',
        materialNote: 'Plywood + solid timber, rounded edges, non-toxic finish',
        dimensions: 'Custom per room  typically occupies 2×3m footprint',
        unitOfMeasure: 'lot',
        rateRange: { low: 4000, high: 10000 },
        complexity: 'specialist',
        popularIn: ['condo', 'landed'],
        tags: ['kids', 'play', 'loft', 'bunk', 'slide'],
    },
    {
        id: 'entrance-drop-zone',
        name: 'Entrance Drop Zone',
        category: 'specialty',
        rooms: ['entryway'],
        description: 'All-in-one entryway unit: coat hooks, shoe cabinet, mirror, key tray, umbrella slot, bag shelf. Organises the transition from outside to inside.',
        materialNote: 'Plywood, laminate, hooks, mirror panel',
        dimensions: 'H2400 × W1200-2000 × D350mm',
        unitOfMeasure: 'set',
        rateRange: { low: 1000, high: 2500 },
        complexity: 'moderate',
        popularIn: ['hdb', 'condo'],
        tags: ['entryway', 'drop zone', 'mudroom', 'hooks'],
    },
    {
        id: 'reading-nook',
        name: 'Reading Nook / Alcove Seat',
        category: 'specialty',
        rooms: ['living', 'bedroom', 'study', 'corridor'],
        description: 'Recessed or corner nook with built-in seat, back cushion, side shelves, and reading light niche. Cosy enclosed feeling.',
        materialNote: 'Plywood structure, upholstered cushion, LED niche light',
        dimensions: 'W900-1200 × D700 × H varies',
        unitOfMeasure: 'set',
        rateRange: { low: 800, high: 2000 },
        complexity: 'moderate',
        popularIn: ['condo', 'landed'],
        tags: ['reading', 'nook', 'alcove', 'cosy'],
    },
    {
        id: 'staircase-storage',
        name: 'Under-Staircase Storage',
        category: 'specialty',
        rooms: ['living', 'corridor'],
        description: 'Custom cabinets, pull-out drawers, or open shelving built into the triangular void under stairs. Often includes pantry, wine, or shoe storage.',
        materialNote: 'Plywood, laminate, custom-angled panels',
        dimensions: 'Custom per staircase void geometry',
        unitOfMeasure: 'lot',
        rateRange: { low: 1500, high: 4000 },
        complexity: 'complex',
        popularIn: ['landed'],
        tags: ['staircase', 'under-stair', 'void', 'pull-out'],
    },
    {
        id: 'pocket-door-cabinet',
        name: 'Pocket Door Cabinet',
        category: 'specialty',
        rooms: ['living', 'kitchen', 'study'],
        description: 'Cabinet with doors that slide back and disappear into the side panels when opened. Clean, flush look when closed and open.',
        materialNote: 'Plywood, pocket door track hardware, laminate',
        dimensions: 'Custom  typically W1200-2400 × H2400mm',
        unitOfMeasure: 'lm',
        rateRange: { low: 500, high: 800 },
        complexity: 'complex',
        popularIn: ['condo', 'landed'],
        tags: ['pocket door', 'sliding', 'concealed', 'flush'],
    },
    {
        id: 'bifold-counter',
        name: 'Bi-fold Counter / Pass-Through',
        category: 'specialty',
        rooms: ['kitchen', 'dining', 'living'],
        description: 'Countertop with bi-fold window that opens the kitchen to the living/dining area. Creates bar counter when open, closes off kitchen when shut.',
        materialNote: 'Timber frame, bi-fold mechanism, countertop extension',
        dimensions: 'Opening: W1200-2400 × H1000mm',
        unitOfMeasure: 'set',
        rateRange: { low: 1500, high: 3500 },
        complexity: 'specialist',
        popularIn: ['condo', 'landed'],
        tags: ['bi-fold', 'pass-through', 'counter', 'kitchen window'],
    },
    {
        id: 'console-unit',
        name: 'Console Side Table / Entryway Unit',
        category: 'specialty',
        rooms: ['entryway', 'living', 'corridor'],
        description: 'Narrow console table with drawers. Wall-mounted or legged. For keys, mail, display. Often paired with mirror above.',
        materialNote: 'Plywood or solid timber, laminate/veneer',
        dimensions: 'H800 × W1000-1500 × D300mm',
        unitOfMeasure: 'pcs',
        rateRange: { low: 300, high: 600 },
        complexity: 'simple',
        popularIn: ['hdb', 'condo', 'landed'],
        tags: ['console', 'side table', 'entryway', 'narrow'],
    },
    {
        id: 'room-in-room',
        name: 'Room-in-Room / Sleeping Pod',
        category: 'specialty',
        rooms: ['living', 'study'],
        description: 'Enclosed box-structure within a room. Creates a private sleeping or workspace within an open-plan area. Japanese capsule-inspired.',
        materialNote: 'Plywood structure, acoustic lining, ventilation cutouts',
        dimensions: 'W2000 × D2400 × H2100mm minimum',
        unitOfMeasure: 'lot',
        rateRange: { low: 5000, high: 12000 },
        complexity: 'specialist',
        popularIn: ['condo'],
        tags: ['pod', 'capsule', 'room-in-room', 'enclosed'],
    },
];

// ============================================================
// HELPERS
// ============================================================

/** Get all configs by room context */
export function getConfigsByRoom(room: RoomContext): CarpentryConfig[] {
    return CARPENTRY_CATALOG.filter(c => c.rooms.includes(room));
}

/** Get all configs by category */
export function getConfigsByCategory(cat: CarpentryCategory): CarpentryConfig[] {
    return CARPENTRY_CATALOG.filter(c => c.category === cat);
}

/** Search configs by keyword */
export function searchConfigs(query: string): CarpentryConfig[] {
    const q = query.toLowerCase();
    return CARPENTRY_CATALOG.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some(t => t.includes(q))
    );
}

/** Get all unique tags */
export function getAllTags(): string[] {
    const tags = new Set<string>();
    CARPENTRY_CATALOG.forEach(c => c.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
}
