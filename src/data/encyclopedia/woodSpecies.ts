import type { MaterialEntry } from './core';


// ── WOOD ENCYCLOPEDIA WITH JANKA SCORES ──

export const WOOD_SPECIES: MaterialEntry[] = [
    // ── SOFTWOOD (Janka < 800) ──
    { name: 'Kiri / Paulownia', origin: 'Japan/China', janka: 300, characteristics: 'Ultra-light, for tansu drawers, fire resistant' },
    { name: 'Western Red Cedar', origin: 'Pacific NW, USA/Canada', janka: 350, characteristics: 'Aromatic, rot-resistant, wardrobe lining' },
    { name: 'Eastern White Pine', origin: 'NE USA/Canada', janka: 380, characteristics: 'Soft, knotty, rustic flooring' },
    { name: 'Sugi (Japanese Cedar)', origin: 'Japan', janka: 400, characteristics: 'Light, aromatic, traditional Japanese, yakisugi source' },
    { name: 'Spruce (European)', origin: 'Scandinavia/Alps', janka: 400, characteristics: 'Light, resonant, structural timber' },
    { name: 'Douglas Fir', origin: 'Pacific NW, USA/Canada', janka: 660, characteristics: 'Strong for softwood, structural, warm grain' },
    { name: 'Cypress (Hinoki)', origin: 'Japan', janka: 700, characteristics: 'Prized Japanese wood, lemon scent, rot-proof, onsen baths' },
    // ── MEDIUM HARDWOOD (Janka 800–1400) ──
    { name: 'American Black Walnut', origin: 'Eastern USA', janka: 1010, characteristics: 'Rich chocolate brown, mid-century modern icon' },
    { name: 'European Oak', origin: 'France/Germany/UK', janka: 1120, characteristics: 'Classic, golden, quarter-sawn = ray fleck' },
    { name: 'American White Oak', origin: 'Eastern USA', janka: 1360, characteristics: 'Strong, water-resistant, whiskey barrels' },
    { name: 'American Red Oak', origin: 'Eastern USA', janka: 1290, characteristics: 'Pink-red tone, pronounced grain' },
    { name: 'American Cherry', origin: 'Eastern USA', janka: 950, characteristics: 'Warm reddish-brown, darkens with age' },
    { name: 'Hard Maple (Sugar Maple)', origin: 'NE USA/Canada', janka: 1450, characteristics: 'Cream-white, extremely hard, bowling alleys' },
    { name: 'European Beech', origin: 'Central Europe', janka: 1300, characteristics: 'Pale, fine grain, bends well, furniture classic' },
    { name: 'Birch (Yellow)', origin: 'NE USA/Canada', janka: 1260, characteristics: 'Light, fine grain, plywood favorite' },
    { name: 'European Ash', origin: 'Europe', janka: 1320, characteristics: 'Light with bold grain, flexible, tool handles' },
    { name: 'Sapele', origin: 'West Africa', janka: 1410, characteristics: 'Ribbon-striped, mahogany alternative, stable' },
    { name: 'Nyatoh', origin: 'SE Asia (MY/ID)', janka: 1020, characteristics: 'Reddish-brown, SG/MY furniture standard' },
    // ── HARD HARDWOOD (Janka 1400–2000) ──
    { name: 'Teak (Burma/Myanmar)', origin: 'Myanmar', janka: 1450, characteristics: 'Gold-brown, natural oils, termite-proof, outdoor king' },
    { name: 'Teak (Indonesian)', origin: 'Java, Indonesia', janka: 1150, characteristics: 'Plantation-grown, lighter color, more affordable' },
    { name: 'American Hickory', origin: 'Eastern USA', janka: 1820, characteristics: 'Rustic, dramatic grain variation' },
    { name: 'Merbau (Kwila)', origin: 'SE Asia/Pacific', janka: 1925, characteristics: 'Dark reddish-brown, outdoor decking staple SG/MY' },
    { name: 'Jarrah', origin: 'Western Australia', janka: 1910, characteristics: 'Deep red, termite-resistant' },
    { name: 'Kempas', origin: 'Malaysia/Indonesia', janka: 1710, characteristics: 'Orange-red, very hard, budget hardwood' },
    { name: 'Spotted Gum', origin: 'Eastern Australia', janka: 2200, characteristics: 'Wavy grain, multi-tone, beautiful deck wood' },
    { name: 'Blackbutt', origin: 'Eastern Australia', janka: 2100, characteristics: 'Pale gold, fire-resistant, Australian flooring #1' },
    { name: 'Chengal', origin: 'Malaysia', janka: 1750, characteristics: 'Golden-brown, extremely durable, MY/SG heritage timber' },
    { name: 'Balau (Selangan Batu)', origin: 'Malaysia/Indonesia', janka: 1820, characteristics: 'Yellow-brown, bridges, marine piling' },
    // ── VERY HARD / EXOTIC (Janka 2000+) ──
    { name: 'Brazilian Cherry (Jatoba)', origin: 'Brazil', janka: 2350, characteristics: 'Deep red-orange, extremely hard flooring' },
    { name: 'Brazilian Walnut (Ipe)', origin: 'Brazil', janka: 3510, characteristics: 'Dark brown, almost indestructible, NYC boardwalks' },
    { name: 'Cumaru (Brazilian Teak)', origin: 'Brazil', janka: 3540, characteristics: 'Golden-brown, vanilla scent, Ipe alternative' },
    { name: 'Purpleheart (Amaranth)', origin: 'Central/South America', janka: 2520, characteristics: 'Turns purple on exposure, exotic accent' },
    { name: 'Ebony (Gaboon)', origin: 'Cameroon/Gabon', janka: 3220, characteristics: 'Jet black, piano keys, ultra-premium' },
    { name: 'Ebony (Macassar)', origin: 'Indonesia (Sulawesi)', janka: 3220, characteristics: 'Black with brown streaks, art deco icon' },
    { name: 'African Padauk', origin: 'West/Central Africa', janka: 2170, characteristics: 'Vivid orange-red, fades to brown' },
    { name: 'Wenge', origin: 'Congo/Cameroon', janka: 1930, characteristics: 'Near-black with fine grain, modern luxury' },
    { name: 'Zebrawood', origin: 'Cameroon/Gabon', janka: 1830, characteristics: 'Pale with dark stripes, feature panels' },
    { name: 'Bocote', origin: 'Mexico/Central America', janka: 2200, characteristics: 'Golden with dark figure, dramatic grain' },
    { name: 'Cocobolo', origin: 'Central America', janka: 2960, characteristics: 'Multi-color rainbow grain, turning wood' },
    { name: 'Lignum Vitae', origin: 'Caribbean', janka: 4500, characteristics: 'HARDEST WOOD ON EARTH, self-lubricating, ship bearings' },
    { name: 'Snakewood', origin: 'South America', janka: 3800, characteristics: 'Snakeskin pattern, rarest commercial wood' },
    { name: 'Pink Ivory', origin: 'Southern Africa', janka: 3230, characteristics: 'Pink to red, rarer than diamonds per volume, Zulu royal' },
    { name: 'African Blackwood', origin: 'East Africa', janka: 3670, characteristics: 'Near-black, clarinets + oboes, densest commercial wood' },
    // ── RECLAIMED / LIVE EDGE ──
    { name: 'Reclaimed Teak', origin: 'Indonesia (demolition)', janka: 1450, characteristics: 'Aged patina, nail holes, rustic character' },
    { name: 'Suar / Raintree (Monkey Pod)', origin: 'SE Asia', janka: 900, characteristics: 'Wide slabs, live-edge dining tables, golden-brown' },
    { name: 'Camphor', origin: 'Taiwan/Japan', janka: 1000, characteristics: 'Aromatic, reddish, moth-repellent, chest wood' },
    { name: 'Elm (reclaimed)', origin: 'China/Europe', janka: 830, characteristics: 'Dramatic grain, antique furniture restoration' },
];
