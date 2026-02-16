/**
 * AI Description Suggestion Engine
 * Fuzzy-match autocomplete for quote line item descriptions.
 * Sources: CARPENTRY_CATALOG, RATES keys, TRADE_PROFILES sub-trades,
 * and a curated corpus of common renovation line items.
 */

import { TradeCategory } from '@/types/trades';
import { SEED_PRICELIST, PricelistItem } from '@/data/pricelists';

// ============================================================
// TYPES
// ============================================================

export interface Suggestion {
    text: string;               // Full suggestion text
    category: TradeCategory;    // Which trade it belongs to
    unit?: string;              // Suggested unit
    rate?: number;              // Suggested cost rate (material + labour)
    materialRate?: number;      // Material portion
    labourRate?: number;        // Labour portion
    source: 'catalog' | 'rates' | 'corpus'; // Where this came from
    score: number;              // Match score (higher = better)
}

// ============================================================
// CURATED CORPUS — common renovation descriptions
// Organized by trade so we can filter by active section
// ============================================================

const DESCRIPTION_CORPUS: Record<TradeCategory, string[]> = {
    preliminaries: [
        'Floor protection — cardboard + PE sheet for all common areas',
        'Lift protection — plywood lining for service lift cabin',
        'Door frame protection wrapping — foam + tape for all existing door frames',
        'Temporary hoarding / barricade construction',
        'Site mobilization and setup of tools/equipment',
        'Temporary power and lighting setup',
        'Signage and safety barriers at work zone',
        'Material delivery coordination and storage',
        'Management levy / building management fee (paid to MCST)',
    ],
    demolition: [
        'Hack and remove existing floor tiles — bathroom',
        'Hack and remove existing wall tiles — bathroom',
        'Hack and remove existing floor tiles — kitchen',
        'Hack and remove existing wall tiles — kitchen',
        'Hack and remove existing flooring — living/dining area',
        'Remove existing kitchen cabinets and countertop',
        'Remove existing bathroom vanity and mirror',
        'Remove existing ceiling — partial, gypsum board',
        'Remove existing ceiling — full, entire unit',
        'Remove existing wardrobe — built-in',
        'Dismantle and remove existing shoe cabinet',
        'Remove existing doors and frames',
        'Partial wall hacking — create opening for pass-through',
        'Full wall demolition — non-structural partition',
        'Debris disposal — licensed lorry, NEA-approved (SG)',
        'Cart-away of debris from unit to loading bay',
        'Chipping of concrete screed / floor levelling compound',
    ],
    masonry: [
        'Supply and install floor tiles 600×600mm — bathroom',
        'Supply and install wall tiles 300×600mm — bathroom',
        'Supply and install floor tiles 600×600mm — kitchen',
        'Supply and install wall tiles — kitchen backsplash',
        'Supply and install floor tiles — living/dining area',
        'Supply and install homogeneous tiles 600×600mm',
        'Supply and install porcelain tiles 800×800mm',
        'Re-screeding of floor to even surface — 25mm thick',
        'Re-screeding of floor to achieve fall gradient — bathroom',
        'Plastering of new brick wall — both sides, 12mm thick',
        'Build new brick wall partition — 100mm thick',
        'Build new brick wall — half-height for shower area',
        'Skim coat on existing wall surface',
        'Tile skirting — matching floor tile, 100mm height',
        'Supply and install marble threshold / door saddle',
        'Epoxy grouting for floor tiles',
        'Overlay tiling — install tiles over existing without hacking',
    ],
    waterproofing: [
        'Waterproofing membrane — bathroom floor and walls (up to 1800mm)',
        'Waterproofing membrane — bathroom floor only',
        'Waterproofing membrane — shower area floor and walls to ceiling',
        'Waterproofing membrane — kitchen floor',
        'Waterproofing membrane — balcony floor',
        'Ponding test / flood test — 24 hours minimum',
        'Additional waterproofing coat — high-risk wet area',
    ],
    carpentry: [
        'Kitchen base cabinet — plywood carcass, laminate doors, soft-close',
        'Kitchen upper / wall cabinet — plywood carcass, laminate doors',
        'Kitchen tall cabinet — built-in fridge housing',
        'Quartz countertop — 20mm thick, undermount sink cutout',
        'Granite countertop — 20mm thick, polished edge',
        'Solid surface countertop — seamless joint, undermount sink cutout',
        'Built-in wardrobe — swing door, plywood carcass, laminate finish',
        'Built-in wardrobe — sliding door, aluminium track',
        'Walk-in wardrobe system — shelving, hanging, drawers',
        'Wardrobe internal fittings — pull-out trouser rack, tie rack, accessories',
        'TV feature wall — fluted panel, integrated cable concealment',
        'TV feature wall — slatted timber, LED backlight',
        'TV console — floating, plywood + laminate',
        'Shoe cabinet — entryway, ventilated shelves',
        'Full-height shoe cabinet — swing door, mirror panel',
        'Built-in study desk — cable grommet, drawer unit',
        'Study desk with tech integration — flip-up power, cable tray',
        'Platform bed with storage drawers/gas-lift',
        'Window bench / bay seat with storage',
        'Banquette / settee — dining area, storage underneath',
        'Vanity / dressing table — mirror, LED, drawer organizers',
        'Display cabinet with glass front — LED interior',
        'Overhead storage above doorway — corridor',
        'Utility cabinet — washer/dryer concealment',
        'DB box cover panel — swing-open, magnetic catch',
        'Air-con trunking cover / casing — plywood, laminate',
        'Pipe boxing / column cladding',
        'Kitchen island / peninsula with countertop overhang',
        'Built-in bookshelf — floor to ceiling, mixed open + closed',
        'Prayer altar cabinet — hardwood, brass hardware',
        'Entrance drop zone — hooks, shoe cabinet, mirror, key tray',
        'Hidden / jib door — concealed within wall panelling',
        'Partition cabinet — room divider, open + closed storage',
        'Timber slat screen / divider',
        'Daybed with storage — elevated platform',
        'Murphy bed / wall bed — fold-up mechanism',
        'Loft bed with desk below — kids room',
        'Reading nook / alcove with built-in seat',
        'Under-staircase storage — pull-out drawers',
        'Wine rack / bar cabinet',
        'Aluminium frame cabinet — waterproof, for wet areas',
        'Stainless steel kitchen cabinet — SS304, hygienic',
    ],
    metalworks: [
        'Mild steel window grille — powder coated black',
        'Stainless steel railing — glass infill panel',
        'Metal gate — mild steel, powder coated',
        'Aluminium bi-fold door frame',
        'Mild steel bracket for floating shelf',
        'Feature metal screen / partition — laser cut',
        'Metal door frame — galvanised, powder coated',
        'Stainless steel kitchen backsplash panel',
    ],
    glassworks: [
        'Tempered glass shower screen — frameless, 10mm',
        'Tempered glass shower screen — with black frame, 10mm',
        'Tempered glass panel partition — fixed',
        'Mirror — bathroom, bevelled edge, 6mm',
        'Mirror — full-length, bedroom/wardrobe door',
        'Glass door — swing, tempered, 12mm',
        'Laminated glass — safety, for overhead/skylight',
        'Glass backsplash panel — toughened, printed',
    ],
    ceiling: [
        'Supply and install false ceiling — 9mm gypsum board, full area',
        'Supply and install false ceiling — partial / perimeter cove',
        'L-box / curtain pelmet — gypsum, with concealed track housing',
        'Cove lighting trough — indirect LED strip housing',
        'Feature ceiling — multi-level / stepped profile',
        'Access panel for maintenance — 600×600mm',
        'Ceiling repair / patching — localised damage',
        'Skim coat and paint existing ceiling',
    ],
    flooring: [
        'Supply and install SPC vinyl plank — living/dining/bedrooms',
        'Supply and install luxury vinyl tile (LVT)',
        'Supply and install engineered timber flooring',
        'Supply and install laminate flooring',
        'Supply and install homogeneous tiles — 600×600mm',
        'Supply and install porcelain tiles — 800×800mm',
        'Supply and install marble flooring',
        'Supply and install epoxy coating — industrial look',
        'Floor levelling / self-levelling compound',
        'Timber skirting — to match flooring',
        'Vinyl skirting — colour-matched',
        'Tile skirting — matching floor tile',
        'Staircase tiling — including nosing trim',
        'Carpet tiles — commercial grade',
    ],
    painting: [
        'Painting walls — 2 coats emulsion, Nippon / Dulux',
        'Painting walls — 3 coats premium, Jotun / Benjamin Moore',
        'Painting ceiling — 2 coats ceiling white emulsion',
        'Feature wall — textured paint / limewash effect',
        'Feature wall — dark accent colour, 3 coats',
        'Painting doors and frames — 2 coats gloss/semi-gloss',
        'Painting metal grilles — rust-proof primer + 2 coats',
        'Touch-up painting after carpentry installation',
        'Skim coat + painting — new plasterboard surfaces',
    ],
    electrical: [
        'Full unit rewiring — new cables from DB to all points',
        'Supply and install power point — 13A twin socket',
        'Supply and install power point — 15A aircon socket',
        'Supply and install USB socket point — dual USB-A/C',
        'Supply and install light point — ceiling, with switch',
        'Supply and install light point — wall-mounted / sconce',
        'Supply and install LED downlight — recessed, 12W',
        'Supply and install LED strip — cove lighting, per metre',
        'Supply and install ceiling fan point — with regulator',
        'Supply and install data point — CAT6 ethernet',
        'Install new DB board / consumer unit — RCBO',
        'Install dedicated 40A circuit for oven / cooktop',
        'Relocate existing power point',
        'Supply and install dimmer switch',
        'Install smart switch / smart home panel',
        'Supply and install TV point — coaxial + HDMI',
        'Install motion sensor switch — corridor / bathroom',
    ],
    plumbing: [
        'Supply and install WC — wall-hung / close-coupled',
        'Supply and install basin + vanity cabinet',
        'Supply and install kitchen sink — single / double bowl, undermount',
        'Supply and install mixer tap — basin',
        'Supply and install mixer tap — kitchen, pull-out spray',
        'Supply and install rain shower set — overhead + handheld',
        'Supply and install instant water heater — single point',
        'Supply and install storage water heater — 30L/50L',
        'Supply and install floor trap / grating',
        'Supply and install bathroom mirror cabinet — with LED',
        'Supply and install bathroom accessories — towel bar, tissue holder, hooks',
        'Supply and install bidet spray set',
        'Replace existing concealed piping — hot/cold water',
        'New plumbing point — extension from existing',
        'Supply and install exhaust fan — bathroom, with ducting',
        'Supply and install sink waste trap / bottle trap',
    ],
    aircon: [
        'Supply and install aircon system 2 — 1 condenser + 2 FCU (Daikin/Mitsubishi)',
        'Supply and install aircon system 3 — 1 condenser + 3 FCU (Daikin/Mitsubishi)',
        'Supply and install aircon system 4 — 1 condenser + 4 FCU (Daikin/Mitsubishi)',
        'Aircon trunking — concealed, PVC casing',
        'Aircon copper piping extension — per metre',
        'Aircon condensate drainage piping',
        'Dismantle and dispose existing AC units',
        'Chemical wash — per FCU',
    ],
    design_submissions: [
        'Space planning and conceptual layout — 2 options',
        'Detailed working drawings — floor plan, electrical, ceiling, elevation',
        '3D perspective renders — living, kitchen, bathroom',
        'HDB renovation permit submission — online application',
        'BCA submission — structural works endorsement by PE',
        'Material sourcing and selection assistance',
        'Project management and site supervision — weekly visits',
        'Final measurement and shop drawing coordination',
    ],
    cleaning: [
        'Post-renovation deep cleaning — vacuum, mop, wipe all surfaces, remove cement stains, clean fixtures. Crew of 2-3, ~4-6 hours',
        'Chemical cleaning of floor tiles — acid wash for grout haze',
        'Window and glass cleaning — interior surfaces',
        'Defect rectification round — touch-ups and minor fixes before handover',
    ],
};

// ============================================================
// BUILD SUGGESTION INDEX (runs once, on first import)
// ============================================================

interface IndexedSuggestion {
    text: string;
    category: TradeCategory;
    lowerText: string;       // Pre-computed for matching speed
    words: string[];          // Tokenized for word-prefix matching
    unit?: string;
    rate?: number;
    materialRate?: number;
    labourRate?: number;
    source: 'catalog' | 'rates' | 'corpus';
}

let _suggestionIndex: IndexedSuggestion[] | null = null;

/**
 * Build a fuzzy-match lookup of pricelist descriptions.
 * Used to enrich corpus suggestions with actual rates.
 */
function buildPriceMap(): Map<string, PricelistItem> {
    const map = new Map<string, PricelistItem>();
    for (const item of SEED_PRICELIST) {
        map.set(item.description.toLowerCase(), item);
    }
    return map;
}

function buildIndex(): IndexedSuggestion[] {
    if (_suggestionIndex) return _suggestionIndex;

    const entries: IndexedSuggestion[] = [];
    const seen = new Set<string>();  // Dedupe by lowercase description
    const priceMap = buildPriceMap();

    // 1. Pricelist items FIRST — these carry actual rates
    for (const item of SEED_PRICELIST) {
        const key = item.description.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);

        entries.push({
            text: item.description,
            category: item.category,
            lowerText: key,
            words: key.split(/[\s—/,()]+/).filter(w => w.length > 1),
            unit: item.unit,
            rate: item.materialCost + item.labourCost,
            materialRate: item.materialCost,
            labourRate: item.labourCost,
            source: 'rates',
        });
    }

    // 2. Corpus descriptions — try to match to pricelist for rates
    for (const [category, descriptions] of Object.entries(DESCRIPTION_CORPUS)) {
        for (const text of descriptions) {
            const key = text.toLowerCase();
            if (seen.has(key)) continue; // Already added from pricelist
            seen.add(key);

            // Try fuzzy match to pricelist
            const priceItem = priceMap.get(key) || findClosestPrice(key, priceMap);

            entries.push({
                text,
                category: category as TradeCategory,
                lowerText: key,
                words: key.split(/[\s—/,()]+/).filter(w => w.length > 1),
                unit: priceItem?.unit,
                rate: priceItem ? priceItem.materialCost + priceItem.labourCost : undefined,
                materialRate: priceItem?.materialCost,
                labourRate: priceItem?.labourCost,
                source: priceItem ? 'rates' : 'corpus',
            });
        }
    }

    _suggestionIndex = entries;
    return entries;
}

/**
 * Try to find the closest pricelist match for a corpus description.
 * Uses simple substring containment on key terms.
 */
function findClosestPrice(corpusKey: string, priceMap: Map<string, PricelistItem>): PricelistItem | null {
    let bestMatch: PricelistItem | null = null;
    let bestOverlap = 0;

    const corpusWords = new Set(corpusKey.split(/[\s—/,()]+/).filter(w => w.length > 2));

    for (const [priceKey, item] of priceMap) {
        const priceWords = new Set(priceKey.split(/[\s—/,()]+/).filter(w => w.length > 2));
        let overlap = 0;
        for (const w of corpusWords) {
            if (priceWords.has(w)) overlap++;
        }
        // Need at least 2 overlapping meaningful words
        if (overlap > bestOverlap && overlap >= 2) {
            bestOverlap = overlap;
            bestMatch = item;
        }
    }

    return bestMatch;
}

// ============================================================
// FUZZY MATCHING
// ============================================================

function scoreMatch(query: string, entry: IndexedSuggestion): number {
    if (!query) return 0;

    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return 0;

    const { lowerText, words } = entry;

    // Exact prefix match (highest priority)
    if (lowerText.startsWith(lowerQuery)) return 100;

    // Contains the full query as substring
    if (lowerText.includes(lowerQuery)) return 80;

    // Word-prefix matching: each query word must match start of a corpus word
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 0);
    let matchedWords = 0;
    let totalQueryWords = queryWords.length;

    for (const qw of queryWords) {
        // Check if any corpus word starts with this query word
        const found = words.some(w => w.startsWith(qw));
        if (found) matchedWords++;
    }

    if (totalQueryWords > 0 && matchedWords === totalQueryWords) {
        return 60 + (matchedWords / Math.max(words.length, 1)) * 20;
    }

    // Partial word matching (at least one word matches)
    if (matchedWords > 0) {
        return 30 + (matchedWords / totalQueryWords) * 30;
    }

    // Character-level fuzzy: check if query chars appear in order
    let qi = 0;
    for (let i = 0; i < lowerText.length && qi < lowerQuery.length; i++) {
        if (lowerText[i] === lowerQuery[qi]) qi++;
    }
    if (qi === lowerQuery.length) {
        return 15 + (lowerQuery.length / lowerText.length) * 15;
    }

    return 0;
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Get suggestions for a partial description.
 * @param query     The text typed so far
 * @param category  If provided, prioritise suggestions for this trade
 * @param limit     Max results to return (default 8)
 */
export function getSuggestions(
    query: string,
    category?: TradeCategory,
    limit: number = 8
): Suggestion[] {
    if (!query || query.trim().length < 2) return [];

    const index = buildIndex();
    const scored: Suggestion[] = [];

    for (const entry of index) {
        let score = scoreMatch(query, entry);
        if (score <= 0) continue;

        // Boost score for matching trade
        if (category && entry.category === category) {
            score += 25;
        }

        scored.push({
            text: entry.text,
            category: entry.category,
            unit: entry.unit,
            rate: entry.rate,
            materialRate: entry.materialRate,
            labourRate: entry.labourRate,
            source: entry.source,
            score,
        });
    }

    // Sort by score descending, then alphabetically
    scored.sort((a, b) => b.score - a.score || a.text.localeCompare(b.text));

    return scored.slice(0, limit);
}

/**
 * Get the best single prediction (for ghost text).
 * Returns the remainder of the predicted text, or empty string.
 */
export function getGhostText(query: string, category?: TradeCategory): string {
    if (!query || query.trim().length < 3) return '';

    const suggestions = getSuggestions(query, category, 1);
    if (suggestions.length === 0) return '';

    const best = suggestions[0];
    // Only show ghost text for high-confidence matches
    if (best.score < 50) return '';

    // Return the portion of the suggestion that extends beyond what the user typed
    const lowerQuery = query.toLowerCase().trim();
    const lowerText = best.text.toLowerCase();

    // Find where in the suggestion the user's text matches
    const idx = lowerText.indexOf(lowerQuery);
    if (idx === 0) {
        // Prefix match — show the rest
        return best.text.slice(query.trim().length);
    }

    return '';
}
