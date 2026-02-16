/**
 * Scope Checklists for Line Items
 * Defines common inclusions/exclusions per category to prevent bill shock
 */

export interface ScopeItem {
    id: string;
    label: string;
    defaultIncluded: boolean;
    typicalExtraCost?: number; // Estimated extra if not included
    notes?: string;
}

export interface CategoryScope {
    categoryId: string;
    categoryName: string;
    items: ScopeItem[];
    commonAddOns: string[]; // Suggests: "Did you add XYZ?"
}

export const SCOPE_CHECKLISTS: Record<string, CategoryScope> = {
    'kitchen-base-cabinet': {
        categoryId: 'kitchen-base-cabinet',
        categoryName: 'Kitchen Base Cabinet',
        items: [
            { id: 'carcase', label: 'Carcase (Plywood 18mm)', defaultIncluded: true },
            { id: 'doors', label: 'Cabinet Doors', defaultIncluded: true },
            { id: 'handles', label: 'Handles/Knobs', defaultIncluded: true },
            { id: 'soft-close', label: 'Soft-close hinges', defaultIncluded: false, typicalExtraCost: 45, notes: 'Blum/Hettich standard' },
            { id: 'internal-fittings', label: 'Internal drawers/shelves', defaultIncluded: false, typicalExtraCost: 120 },
            { id: 'hob-cutout', label: 'Hob cutout', defaultIncluded: false, typicalExtraCost: 80 },
            { id: 'sink-cutout', label: 'Sink cutout', defaultIncluded: false, typicalExtraCost: 80 },
            { id: 'led-lighting', label: 'LED under-cabinet lighting', defaultIncluded: false, typicalExtraCost: 150 },
            { id: 'touch-latch', label: 'Touch-latch (push-to-open)', defaultIncluded: false, typicalExtraCost: 45 },
        ],
        commonAddOns: ['Quartz Countertop', 'Backsplash Tiles', 'Water Point Relocation']
    },

    'kitchen-upper-cabinet': {
        categoryId: 'kitchen-upper-cabinet',
        categoryName: 'Kitchen Upper Cabinet',
        items: [
            { id: 'carcase', label: 'Carcase (Plywood 18mm)', defaultIncluded: true },
            { id: 'doors', label: 'Cabinet Doors', defaultIncluded: true },
            { id: 'handles', label: 'Handles/Knobs', defaultIncluded: true },
            { id: 'soft-close', label: 'Soft-close hinges', defaultIncluded: false, typicalExtraCost: 45 },
            { id: 'glass-doors', label: 'Glass door panels', defaultIncluded: false, typicalExtraCost: 180 },
            { id: 'internal-lighting', label: 'Internal LED lighting', defaultIncluded: false, typicalExtraCost: 100 },
            { id: 'lift-up-system', label: 'Lift-up door system (Blum Aventos)', defaultIncluded: false, typicalExtraCost: 350 },
        ],
        commonAddOns: ['Hood/Ventilation Ducting', 'Power Points']
    },

    'quartz-countertop': {
        categoryId: 'quartz-countertop',
        categoryName: 'Quartz Countertop',
        items: [
            { id: 'material', label: 'Quartz slab (15mm)', defaultIncluded: true },
            { id: 'fabrication', label: 'Fabrication', defaultIncluded: true },
            { id: 'installation', label: 'Installation', defaultIncluded: true },
            { id: 'hob-cutout', label: 'Hob cutout', defaultIncluded: false, typicalExtraCost: 80 },
            { id: 'sink-cutout', label: 'Sink cutout', defaultIncluded: false, typicalExtraCost: 80 },
            { id: 'edge-profile', label: 'Edge profiling (bullnose/bevel)', defaultIncluded: false, typicalExtraCost: 40, notes: 'Per linear ft' },
            { id: 'backsplash-upstand', label: 'Backsplash upstand (4")', defaultIncluded: false, typicalExtraCost: 60 },
            { id: 'waterfall-edge', label: 'Waterfall edge (island)', defaultIncluded: false, typicalExtraCost: 400 },
        ],
        commonAddOns: ['Sink', 'Mixer Tap', 'Hob']
    },

    'wardrobe': {
        categoryId: 'wardrobe',
        categoryName: 'Built-in Wardrobe',
        items: [
            { id: 'carcase', label: 'Carcase (Plywood 18mm)', defaultIncluded: true },
            { id: 'doors', label: 'Doors (Swing/Sliding)', defaultIncluded: true },
            { id: 'handles', label: 'Handles', defaultIncluded: true },
            { id: 'soft-close', label: 'Soft-close hinges', defaultIncluded: false, typicalExtraCost: 60 },
            { id: 'internal-drawers', label: 'Internal drawers', defaultIncluded: false, typicalExtraCost: 150, notes: 'Per drawer' },
            { id: 'tie-rack', label: 'Tie/Belt rack', defaultIncluded: false, typicalExtraCost: 80 },
            { id: 'trouser-rack', label: 'Trouser rack', defaultIncluded: false, typicalExtraCost: 120 },
            { id: 'led-strip', label: 'LED strip lighting', defaultIncluded: false, typicalExtraCost: 100 },
            { id: 'mirror', label: 'Full-length mirror', defaultIncluded: false, typicalExtraCost: 180 },
            { id: 'jewelry-tray', label: 'Jewelry tray', defaultIncluded: false, typicalExtraCost: 60 },
        ],
        commonAddOns: ['Power Points Inside', 'Sensor Lights']
    },

    'bathroom-tiling': {
        categoryId: 'bathroom-tiling',
        categoryName: 'Bathroom Tiling',
        items: [
            { id: 'tiles', label: 'Tiles supply', defaultIncluded: true },
            { id: 'adhesive', label: 'Tile adhesive', defaultIncluded: true },
            { id: 'grouting', label: 'Grouting', defaultIncluded: true },
            { id: 'waterproofing', label: 'Waterproofing membrane', defaultIncluded: false, typicalExtraCost: 45, notes: 'Per sqm' },
            { id: 'hacking', label: 'Hacking of existing tiles', defaultIncluded: false, typicalExtraCost: 35, notes: 'Per sqm' },
            { id: 'screeding', label: 'Floor screeding', defaultIncluded: false, typicalExtraCost: 25, notes: 'Per sqm' },
            { id: 'niche', label: 'Recessed niche for toiletries', defaultIncluded: false, typicalExtraCost: 200 },
            { id: 'border', label: 'Border/accent tiles', defaultIncluded: false, typicalExtraCost: 100 },
        ],
        commonAddOns: ['Floor Trap', 'Shower Screen', 'Vanity']
    },

    'flooring-vinyl': {
        categoryId: 'flooring-vinyl',
        categoryName: 'Vinyl Flooring',
        items: [
            { id: 'material', label: 'Vinyl planks/tiles', defaultIncluded: true },
            { id: 'installation', label: 'Installation', defaultIncluded: true },
            { id: 'underlay', label: 'Underlay/moisture barrier', defaultIncluded: false, typicalExtraCost: 8, notes: 'Per sqm' },
            { id: 'skirting', label: 'Skirting', defaultIncluded: false, typicalExtraCost: 12, notes: 'Per linear m' },
            { id: 'stair-nosing', label: 'Stair nosing', defaultIncluded: false, typicalExtraCost: 45, notes: 'Per step' },
            { id: 'transition-strip', label: 'Transition strips', defaultIncluded: false, typicalExtraCost: 25, notes: 'Per piece' },
            { id: 'subfloor-prep', label: 'Subfloor leveling', defaultIncluded: false, typicalExtraCost: 15, notes: 'Per sqm' },
        ],
        commonAddOns: ['Door Shaving', 'Furniture Moving']
    },

    'electrical-rewiring': {
        categoryId: 'electrical-rewiring',
        categoryName: 'Electrical Rewiring',
        items: [
            { id: 'wiring', label: 'Wiring (points to DB)', defaultIncluded: true },
            { id: 'trunking', label: 'Trunking/conduit', defaultIncluded: true },
            { id: 'db-upgrade', label: 'DB box upgrade', defaultIncluded: false, typicalExtraCost: 350 },
            { id: 'mcb', label: 'MCB/RCCB installation', defaultIncluded: false, typicalExtraCost: 80, notes: 'Per circuit' },
            { id: 'socket-outlet', label: 'Socket outlets (supply)', defaultIncluded: false, typicalExtraCost: 25, notes: 'Per point' },
            { id: 'switch', label: 'Switches (supply)', defaultIncluded: false, typicalExtraCost: 20, notes: 'Per point' },
            { id: 'light-fixture', label: 'Light fixture installation', defaultIncluded: false, typicalExtraCost: 30, notes: 'Per point' },
            { id: 'ceiling-fan', label: 'Ceiling fan point', defaultIncluded: false, typicalExtraCost: 80 },
            { id: 'aircon-point', label: 'Aircon power point', defaultIncluded: false, typicalExtraCost: 180 },
        ],
        commonAddOns: ['Light Fixtures', 'Ceiling Fans', 'Aircon Units']
    },

    'painting': {
        categoryId: 'painting',
        categoryName: 'Wall Painting',
        items: [
            { id: 'paint', label: 'Emulsion paint (2-3 coats)', defaultIncluded: true },
            { id: 'labor', label: 'Painting labor', defaultIncluded: true },
            { id: 'sealer', label: 'Sealer/primer', defaultIncluded: false, typicalExtraCost: 3, notes: 'Per sqm' },
            { id: 'skim-coat', label: 'Skim coat', defaultIncluded: false, typicalExtraCost: 8, notes: 'Per sqm' },
            { id: 'ceiling', label: 'Ceiling painting', defaultIncluded: false, typicalExtraCost: 5, notes: 'Per sqm' },
            { id: 'feature-wall', label: 'Feature wall (different color)', defaultIncluded: false, typicalExtraCost: 100 },
            { id: 'furniture-cover', label: 'Furniture protection', defaultIncluded: false, typicalExtraCost: 50 },
        ],
        commonAddOns: ['Cornice Replacement', 'Feature Wall Design']
    },
};

/**
 * Get scope checklist for a category
 */
export function getScopeChecklist(categoryId: string): CategoryScope | null {
    return SCOPE_CHECKLISTS[categoryId] || null;
}

/**
 * Calculate total extra cost for excluded items user wants to include
 */
export function calculateExtras(categoryId: string, includedItemIds: string[]): number {
    const scope = SCOPE_CHECKLISTS[categoryId];
    if (!scope) return 0;

    return scope.items
        .filter(item => !item.defaultIncluded && includedItemIds.includes(item.id))
        .reduce((sum, item) => sum + (item.typicalExtraCost || 0), 0);
}

/**
 * Get common add-ons that should be suggested
 */
export function getAddOnSuggestions(selectedCategories: string[]): string[] {
    const suggestions = new Set<string>();

    for (const catId of selectedCategories) {
        const scope = SCOPE_CHECKLISTS[catId];
        if (scope) {
            scope.commonAddOns.forEach(addon => suggestions.add(addon));
        }
    }

    return Array.from(suggestions);
}
