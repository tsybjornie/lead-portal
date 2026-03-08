import type { MaterialEntry } from './core';


// ── TILE MATERIALS ENCYCLOPEDIA ──

export const TILE_MATERIALS: MaterialEntry[] = [
    // ── CERAMIC & PORCELAIN ──
    { name: 'Porcelain — full body', category: 'Ceramic & Porcelain', characteristics: 'Color through, most durable' },
    { name: 'Porcelain — glazed', category: 'Ceramic & Porcelain', characteristics: 'Printed surface' },
    { name: 'Porcelain — polished', category: 'Ceramic & Porcelain', characteristics: 'Mirror finish, slippery' },
    { name: 'Porcelain — matt / anti-slip (R10-R13)', category: 'Ceramic & Porcelain', characteristics: 'Safety rated' },
    { name: 'Porcelain — rustic / textured', category: 'Ceramic & Porcelain', characteristics: 'Rough surface, natural feel' },
    { name: 'Porcelain — marble-look', category: 'Ceramic & Porcelain', characteristics: 'Budget marble alternative' },
    { name: 'Porcelain — wood-look', category: 'Ceramic & Porcelain', characteristics: 'Plank format' },
    { name: 'Porcelain — concrete-look', category: 'Ceramic & Porcelain', characteristics: 'Industrial aesthetic' },
    { name: 'Porcelain — terrazzo-look', category: 'Ceramic & Porcelain', characteristics: 'Chip pattern, easier than real' },
    { name: 'Ceramic — wall only', category: 'Ceramic & Porcelain', characteristics: 'Softer, budget, not for floors' },
    { name: 'Ceramic — hand-glazed', category: 'Ceramic & Porcelain', characteristics: 'Artisan, irregular finish' },
    // ── SPECIALTY / ARTISAN ──
    { name: 'Zellige', origin: 'Fez, Morocco', category: 'Specialty', priceTier: '$$$$', characteristics: 'Hand-cut geometric mosaic, imperfect glaze, 10th century' },
    { name: 'Encaustic cement tile', origin: 'Europe', category: 'Specialty', priceTier: '$$$', characteristics: 'Pattern inlaid (not printed), hydraulic pressed' },
    { name: 'Sukabumi (Green Bali Stone)', origin: 'Java, Indonesia', category: 'Specialty', priceTier: '$$$$', characteristics: 'Volcanic stone, naturally cool, pool/spa, green-blue' },
    { name: 'Terracotta', origin: 'Italy/Mexico', category: 'Specialty', priceTier: '$$', characteristics: 'Traditional fired clay, warm earthy' },
    { name: 'Cotto', origin: 'Tuscany, Italy', category: 'Specialty', priceTier: '$$', characteristics: 'Unglazed terracotta, Tuscan farmhouse' },
    { name: 'Majolica tile', origin: 'Italy/Spain', category: 'Specialty', priceTier: '$$$$', characteristics: 'Hand-painted decorative, tin-glazed, Renaissance' },
    { name: 'Peranakan / Baba-Nonya tile', origin: 'Singapore/Malaysia', category: 'Specialty', priceTier: '$$$$', characteristics: 'Heritage shophouse motif, floral + phoenix' },
    { name: 'Delft tile', origin: 'Netherlands', category: 'Specialty', priceTier: '$$$$', characteristics: 'Blue & white hand-painted, Dutch Golden Age' },
    { name: 'Talavera', origin: 'Puebla, Mexico', category: 'Specialty', priceTier: '$$$', characteristics: 'Vibrant hand-painted cobalt + yellow' },
    { name: 'Iznik tile', origin: 'Turkey', category: 'Specialty', priceTier: '$$$$$', characteristics: 'Blue & turquoise tulip pattern, Ottoman 1400s' },
    { name: 'Azulejo', origin: 'Portugal', category: 'Specialty', priceTier: '$$$', characteristics: 'Hand-painted blue & white tile, 1500s' },
    // ── NATURAL / ORGANIC ──
    { name: 'Slate tile', category: 'Natural', priceTier: '$', characteristics: 'Natural cleft surface' },
    { name: 'Sandstone tile', category: 'Natural', priceTier: '$$', characteristics: 'Warm earthy tones' },
    { name: 'Limestone tile', category: 'Natural', priceTier: '$$$', characteristics: 'Fossil-rich, cream' },
    { name: 'Basalt tile', category: 'Natural', priceTier: '$$', characteristics: 'Dark volcanic' },
    { name: 'Quartzite tile', category: 'Natural', priceTier: '$$$', characteristics: 'Natural sparkle' },
    { name: 'Pebble mosaic', category: 'Natural', priceTier: '$$', characteristics: 'River stones on mesh' },
    { name: 'Lava stone', category: 'Natural', priceTier: '$$$', characteristics: 'Volcanic, can be glazed' },
    // ── GLASS & METAL ──
    { name: 'Glass mosaic', category: 'Glass & Metal', priceTier: '$$', characteristics: 'Pool / backsplash' },
    { name: 'Glass subway tile', category: 'Glass & Metal', priceTier: '$$', characteristics: 'Translucent' },
    { name: 'Mirror mosaic', category: 'Glass & Metal', priceTier: '$$$', characteristics: 'Reflective feature' },
    { name: 'Stainless steel mosaic', category: 'Glass & Metal', priceTier: '$$$', characteristics: 'Industrial' },
    { name: 'Copper / brass mosaic', category: 'Glass & Metal', priceTier: '$$$$', characteristics: 'Warm metallic' },
    // ── ROOF TILES (LANDED) ──
    { name: 'Concrete roof tile', category: 'Roof', priceTier: '$', characteristics: 'Flat / S-profile' },
    { name: 'Clay roof tile', category: 'Roof', priceTier: '$$', characteristics: 'Traditional' },
    { name: 'Japanese kawara', origin: 'Japan', category: 'Roof', priceTier: '$$$', characteristics: 'Curved grey clay, temple style' },
    { name: 'Chinese imperial yellow glaze', origin: 'China', category: 'Roof', priceTier: '$$$$$', characteristics: 'Heritage, Forbidden City' },
    { name: 'Indonesian Joglo shingle', origin: 'Java, Indonesia', category: 'Roof', priceTier: '$$$$', characteristics: 'Teak wood' },
    { name: 'Spanish terracotta barrel', origin: 'Spain', category: 'Roof', priceTier: '$$$', characteristics: 'Mediterranean' },
    { name: 'Slate roofing', origin: 'Wales/Spain', category: 'Roof', priceTier: '$$$$', characteristics: 'Natural stone' },
];

// ── TILE LAYOUT PATTERNS ──

export const TILE_LAYOUTS = [
    // Basic
    'Stack bond (grid)', 'Brick bond (1/2 offset)', '1/3 offset', '45° diagonal',
    // Herringbone family
    'Herringbone (90° classic)', 'Double herringbone', 'Chevron (angled cuts)', 'Herringbone 45° (diagonal)',
    // Complex
    'Basket weave', 'Pinwheel', 'Windmill', 'Versailles / French pattern (4 sizes)',
    'Stretcher bond (running bond)', 'Flemish bond', 'Cross hatch', 'Hexagonal',
    'Fish scale / scallop', 'Arabesque / lantern', 'Penny round mosaic',
    'Subway (classic 1:2)', 'Stacked subway (vertical)', 'Diamond / rhombus', 'Random / crazy paving',
    // Mixed size
    'Linear plank (wood-look)', 'Modular (2-3 sizes mixed)', 'Opus Romano (multi-size)', 'Hopscotch (large + small)',
];

// ── WORLD DESIGN MOTIFS ──
