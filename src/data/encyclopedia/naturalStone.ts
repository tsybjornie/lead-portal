import type { MaterialEntry } from './core';


// ── NATURAL STONE ENCYCLOPEDIA ──

export const STONE_TYPES = [
    'Marble', 'Granite', 'Travertine', 'Slate', 'Limestone', 'Sandstone',
    'Quartzite', 'Soapstone', 'Onyx', 'Terrazzo', 'Sintered Stone',
];

export const STONE_NAMES: MaterialEntry[] = [
    // ── WHITE MARBLE ──
    { name: 'Carrara (Bianco Carrara)', origin: 'Carrara, Italy', priceTier: '$$', characteristics: 'Grey veins on white, most common Italian marble' },
    { name: 'Calacatta Oro', origin: 'Carrara, Italy', priceTier: '$$$$', characteristics: 'Bold gold veins on bright white, luxury statement' },
    { name: 'Calacatta Borghini', origin: 'Tuscany, Italy', priceTier: '$$$$$', characteristics: 'Thick dramatic veins, extremely rare' },
    { name: 'Statuario', origin: 'Carrara, Italy', priceTier: '$$$$', characteristics: 'Bold grey veins, Michelangelo\'s marble' },
    { name: 'Volakas', origin: 'Drama, Greece', priceTier: '$$', characteristics: 'White with grey-green veins, budget Calacatta alternative' },
    { name: 'Thassos', origin: 'Thassos Island, Greece', priceTier: '$$$', characteristics: 'Ultra-white, semi-translucent, crystal structure' },
    { name: 'Bianco Lasa', origin: 'South Tyrol, Italy', priceTier: '$$$$', characteristics: 'Pure white, minimal veining, very dense' },
    { name: 'Mystery White', origin: 'Kutahya, Turkey', priceTier: '$$', characteristics: 'Soft grey veins, affordable elegance' },
    { name: 'White Rhino', origin: 'Namibia', priceTier: '$$$', characteristics: 'White with dramatic grey movement' },
    // ── BEIGE / CREAM MARBLE ──
    { name: 'Crema Marfil', origin: 'Alicante, Spain', priceTier: '$$', characteristics: 'Warm cream, gold undertones, commercial workhorse' },
    { name: 'Botticino', origin: 'Brescia, Italy', priceTier: '$$', characteristics: 'Light beige, fine grain, classic' },
    { name: 'Daino Reale', origin: 'Italy', priceTier: '$$', characteristics: 'Warm beige, flowing veins' },
    { name: 'Perlato Svevo', origin: 'Puglia, Italy', priceTier: '$$', characteristics: 'Cream with fossil inclusions' },
    { name: 'Jerusalem Gold', origin: 'Israel', priceTier: '$$', characteristics: 'Gold limestone-marble, ancient heritage' },
    // ── DARK MARBLE ──
    { name: 'Nero Marquina', origin: 'Basque Country, Spain', priceTier: '$$$', characteristics: 'Deep black with white veins, striking contrast' },
    { name: 'Sahara Noir', origin: 'Tunisia', priceTier: '$$$', characteristics: 'Black with gold veins, dramatic' },
    { name: 'Saint Laurent', origin: 'France', priceTier: '$$$$', characteristics: 'Deep green-black, gold veins, rare' },
    { name: 'Emperador Dark', origin: 'Alicante, Spain', priceTier: '$$', characteristics: 'Rich brown, white veins' },
    { name: 'Emperador Light', origin: 'Alicante, Spain', priceTier: '$$', characteristics: 'Warm brown, lighter tones' },
    { name: 'Portoro', origin: 'Portovenere, Italy', priceTier: '$$$$$', characteristics: 'Black + gold veins, one of the rarest' },
    // ── EXOTIC / SPECIAL MARBLE ──
    { name: 'Calacatta Viola', origin: 'Italy', priceTier: '$$$$$', characteristics: 'White with purple veins, ultra-rare' },
    { name: 'Rosa Portogallo', origin: 'Portugal', priceTier: '$$$$', characteristics: 'Pink-rose with cream, romantic' },
    { name: 'Breccia Capraia', origin: 'Tuscany, Italy', priceTier: '$$$', characteristics: 'Warm fragments in cream matrix' },
    { name: 'Cipollino Ondulato', origin: 'Tuscany, Italy', priceTier: '$$$$', characteristics: 'Green-white waves, ancient Roman favorite' },
    { name: 'Azul Macaubas', origin: 'Bahia, Brazil', priceTier: '$$$$', characteristics: 'Blue quartzite, translucent, stunning' },
    { name: 'Patagonia', origin: 'Brazil', priceTier: '$$$$$', characteristics: 'Multi-color quartzite, each slab unique' },
    // ── GRANITE ──
    { name: 'Absolute Black', origin: 'Karnataka, India', priceTier: '$$', characteristics: 'Jet black, no pattern, most popular granite' },
    { name: 'Black Galaxy', origin: 'Andhra Pradesh, India', priceTier: '$$', characteristics: 'Black with gold flecks (bronzite)' },
    { name: 'Giallo Napoleone', origin: 'Brazil', priceTier: '$$', characteristics: 'Gold-yellow with brown movement' },
    { name: 'Blue Pearl', origin: 'Norway', priceTier: '$$$', characteristics: 'Blue with iridescent feldspar' },
    { name: 'Baltic Brown', origin: 'Finland', priceTier: '$$', characteristics: 'Brown with large round feldspar crystals' },
    { name: 'Kashmir White', origin: 'Tamil Nadu, India', priceTier: '$$', characteristics: 'White with garnet flecks' },
    { name: 'Steel Grey', origin: 'Andhra Pradesh, India', priceTier: '$$', characteristics: 'Consistent mid-grey, durable' },
    { name: 'Viscount White', origin: 'India', priceTier: '$$', characteristics: 'White-grey with dark veins' },
    // ── SOAPSTONE ──
    { name: 'Pietra do Minas', origin: 'Minas Gerais, Brazil', priceTier: '$$', characteristics: 'Classic grey-green, smooth, heats evenly' },
    { name: 'Barroca', origin: 'Brazil', priceTier: '$$', characteristics: 'Dark grey with white veins' },
    { name: 'Indian Soapstone', origin: 'Rajasthan, India', priceTier: '$', characteristics: 'Budget option, softer, lighter' },
    // ── ONYX ──
    { name: 'White Onyx', origin: 'Iran', priceTier: '$$$$', characteristics: 'Translucent white, best for backlighting' },
    { name: 'Honey Onyx', origin: 'Turkey', priceTier: '$$$', characteristics: 'Warm amber, translucent, dramatic veins' },
    { name: 'Green Onyx', origin: 'Pakistan', priceTier: '$$$', characteristics: 'Deep emerald, translucent' },
    { name: 'Blue Onyx', origin: 'Argentina', priceTier: '$$$$$', characteristics: 'Rare blue, museum grade' },
    { name: 'Pink Onyx', origin: 'Peru', priceTier: '$$$$', characteristics: 'Blush pink, translucent, delicate' },
    // ── QUARTZITE ──
    { name: 'Taj Mahal', origin: 'Brazil', priceTier: '$$$', characteristics: 'Warm white with gold veining' },
    { name: 'Super White', origin: 'Brazil', priceTier: '$$', characteristics: 'Marble-look but harder, grey veins' },
    { name: 'Fantasy Brown', origin: 'India', priceTier: '$$', characteristics: 'Brown, grey, white swirls' },
    { name: 'Fusion', origin: 'Brazil', priceTier: '$$$$', characteristics: 'Multi-color wow slab' },
    // ── SINTERED STONE ──
    { name: 'Dekton (Cosentino)', origin: 'Spain (manufactured)', priceTier: '$$$', characteristics: 'Ultra-compact, scratch/heat/UV proof' },
    { name: 'Neolith (TheSize)', origin: 'Spain (manufactured)', priceTier: '$$$', characteristics: 'Sintered compact, full-body color' },
    { name: 'Laminam', origin: 'Italy (manufactured)', priceTier: '$$$', characteristics: 'Large format porcelain slab' },
];
