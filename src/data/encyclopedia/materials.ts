// Metals, plywood grades & species


export const METAL_MATERIALS = [
    'Mild steel', 'Stainless steel (304)', 'Stainless steel (316 — marine)',
    'Aluminium', 'Wrought iron', 'Brass (solid)', 'Copper (solid)',
    'Bronze', 'Corten steel (weathering)', 'Cast iron',
];

export const METAL_FINISHES = [
    // Powder coat
    'Powder coat — matt black (RAL 9005)', 'Powder coat — satin black', 'Powder coat — gloss black',
    'Powder coat — white (RAL 9016)', 'Powder coat — dark grey (RAL 7016)', 'Powder coat — custom RAL',
    // Metal finish
    'Hairline stainless', 'Mirror polish stainless', 'Brushed brass / PVD gold',
    'Brushed nickel', 'Antique brass (patina)', 'Oil-rubbed bronze',
    'Rose gold / copper PVD', 'Blackened steel (patina)', 'Raw / industrial',
    'Corten rust finish', 'Hot-dip galvanized', 'Anodized aluminium',
];

// ── PLYWOOD ENCYCLOPEDIA ──

export const PLYWOOD_GRADES = [
    { name: 'A/A (premium both faces)', characteristics: 'Both sides sanded smooth, furniture grade' },
    { name: 'A/B (one premium face)', characteristics: 'One good side for visible face' },
    { name: 'B/BB (standard carpentry)', characteristics: 'General purpose, minor defects' },
    { name: 'BB/BB (good both faces)', characteristics: 'Decent both sides, utility grade' },
    { name: 'BB/CC (one rough — hidden)', characteristics: 'One rough side stays hidden (carcass back)' },
    { name: 'Marine grade', characteristics: 'Waterproof WBP glue, void-free, wet areas' },
    { name: 'Structural (F grade)', characteristics: 'Load-bearing, F7/F11/F14/F17 ratings' },
];

export const PLYWOOD_SPECIES = [
    { name: 'Meranti (Lauan)', origin: 'Malaysia/Indonesia', characteristics: 'Most common SE Asian plywood, reddish, affordable' },
    { name: 'Birch (Baltic/Finnish)', origin: 'Finland/Russia', characteristics: 'Pale, strong, clean edge, premium furniture' },
    { name: 'Poplar', origin: 'Europe/USA', characteristics: 'Light, paintable, lightweight furniture' },
    { name: 'Pine (Radiata)', origin: 'New Zealand', characteristics: 'Softwood ply, structural, knotty' },
    { name: 'Okoume (Gaboon)', origin: 'Gabon, Africa', characteristics: 'Light weight, marine plywood, pinkish' },
    { name: 'Maple', origin: 'North America', characteristics: 'Hard, cream-white, premium cabinet grade' },
    { name: 'Oak', origin: 'Europe/USA', characteristics: 'Strong, visible grain, feature cabinetry' },
    { name: 'Bamboo', origin: 'China', characteristics: 'Eco, strong, stable, modern aesthetic' },
];

