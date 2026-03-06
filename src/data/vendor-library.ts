
import { TradeCategory } from '@/types/trades';
import { Jurisdiction } from '@/types/core';

export type VendorReliability = 'A' | 'B' | 'C';

export interface Vendor {
    id: string;
    name: string;
    categories: TradeCategory[];
    jurisdiction: Jurisdiction | 'BOTH';
    reliability: VendorReliability;
    description?: string;
    address?: string;
    contactNumber?: string;
    email?: string;
    website?: string;
    acraNumber?: string;
    priceList: Record<string, { price: number; unit: string }>; // Maps itemKey -> { price, unit }
}

export const RELIABILITY_LABELS: Record<VendorReliability, { label: string; emoji: string }> = {
    A: { label: 'Excellent  on-time, quality consistent', emoji: '' },
    B: { label: 'Good  occasional delays, quality OK', emoji: '' },
    C: { label: 'Budget  unpredictable timing, varies', emoji: '' },
};

export const VENDOR_LIBRARY: Vendor[] = [
    // 
    // SINGAPORE VENDORS
    // 

    // --- TILING VENDORS ---
    {
        id: 'hafary',
        name: 'Hafary',
        categories: ['masonry', 'flooring'],
        jurisdiction: 'SG',
        reliability: 'A',
        description: 'Singapore\'s leading tile supplier. Huge variety, premium showrooms.',
        priceList: {
            'wall_tiling': { price: 3.50, unit: 'psf' },
            'floor_tiling': { price: 4.80, unit: 'psf' },
            'homogeneous_tile': { price: 4.80, unit: 'psf' },
            'marble_look_tile': { price: 6.50, unit: 'psf' },
            'subway_tile': { price: 5.50, unit: 'pc' }
        }
    },
    {
        id: 'soon_bee_huat',
        name: 'Soon Bee Huat',
        categories: ['masonry', 'flooring'],
        jurisdiction: 'SG',
        reliability: 'A',
        description: 'Reliable, good stock availability, slightly more affordable.',
        priceList: {
            'wall_tiling': { price: 3.20, unit: 'psf' },
            'floor_tiling': { price: 4.20, unit: 'psf' },
            'homogeneous_tile': { price: 4.20, unit: 'psf' },
            'marble_look_tile': { price: 5.80, unit: 'psf' },
            'subway_tile': { price: 5.00, unit: 'pc' }
        }
    },
    {
        id: 'lian_seng_hin',
        name: 'Lian Seng Hin',
        categories: ['masonry', 'flooring'],
        jurisdiction: 'SG',
        reliability: 'B',
        description: 'Budget-friendly options, great for contractors.',
        priceList: {
            'wall_tiling': { price: 3.00, unit: 'psf' },
            'floor_tiling': { price: 4.00, unit: 'psf' },
            'homogeneous_tile': { price: 3.80, unit: 'psf' },
            'marble_look_tile': { price: 5.00, unit: 'psf' },
            'subway_tile': { price: 4.50, unit: 'pc' }
        }
    },

    // --- PAINT VENDORS ---
    {
        id: 'nippon_paint',
        name: 'Nippon Paint SG',
        categories: ['painting'],
        jurisdiction: 'SG',
        reliability: 'A',
        description: 'Premium paint manufacturer. Vinilex 5000 is standard.',
        priceList: {
            'interior_painting': { price: 120.00, unit: 'tin' },
            'exterior_painting': { price: 150.00, unit: 'tin' },
            'sealer': { price: 80.00, unit: 'tin' }
        }
    },
    {
        id: 'dulux',
        name: 'Dulux SG',
        categories: ['painting'],
        jurisdiction: 'SG',
        reliability: 'A',
        description: 'Wash & Wear is a popular choice.',
        priceList: {
            'interior_painting': { price: 130.00, unit: 'tin' },
            'exterior_painting': { price: 160.00, unit: 'tin' },
            'sealer': { price: 85.00, unit: 'tin' }
        }
    },
    {
        id: 'hong_lee',
        name: 'Hong Lee Hardware',
        categories: ['plumbing'],
        jurisdiction: 'SG',
        reliability: 'B',
        description: 'General building supplies and plumbing fixtures.',
        priceList: {
            'cement_screed': { price: 8.50, unit: 'bag' },
            'waterproofing_membrane': { price: 45.00, unit: 'pail' },
            'copper_pipe': { price: 22.00, unit: 'len' }
        }
    },
    {
        id: 'excel_hardware',
        name: 'Excel Hardware',
        categories: ['carpentry'],
        jurisdiction: 'SG',
        reliability: 'B',
        description: 'Furniture fittings, handles, and tracks.',
        priceList: {
            'soft_close_hinge': { price: 4.50, unit: 'pair' },
            'drawer_runner': { price: 12.00, unit: 'set' },
            'plywood_18mm': { price: 45.00, unit: 'sht' }
        }
    },

    // --- VINYL FLOORING ---
    {
        id: 'evorich',
        name: 'Evorich',
        categories: ['flooring'],
        jurisdiction: 'SG',
        reliability: 'A',
        description: 'Specialists in vinyl and timber decking.',
        priceList: {
            'vinyl_flooring': { price: 3.80, unit: 'psf' },
            'timber_decking': { price: 18.00, unit: 'psf' }
        }
    },
    {
        id: 'the_floor_gallery',
        name: 'The Floor Gallery',
        categories: ['flooring'],
        jurisdiction: 'SG',
        reliability: 'B',
        description: 'Wide range of laminate and vinyl.',
        priceList: {
            'vinyl_flooring': { price: 4.20, unit: 'psf' },
            'laminate_flooring': { price: 3.50, unit: 'psf' }
        }
    },

    // --- CARPENTRY LAMINATES ---
    {
        id: 'lamitak',
        name: 'Lamitak',
        categories: ['carpentry'],
        jurisdiction: 'BOTH',
        reliability: 'A',
        description: 'Premium laminates, wood-looks are excellent.',
        priceList: {
            'laminate_finish': { price: 4.50, unit: 'psf' },
            'solid_colour': { price: 3.50, unit: 'psf' }
        }
    },
    {
        id: 'edl',
        name: 'EDL',
        categories: ['carpentry'],
        jurisdiction: 'SG',
        reliability: 'A',
        description: 'Designer choices, Fenix compact laminates.',
        priceList: {
            'laminate_finish': { price: 5.00, unit: 'psf' },
            'solid_colour': { price: 4.00, unit: 'psf' }
        }
    },

    // --- ELECTRICAL ---
    {
        id: 'light_makers',
        name: 'Light Makers',
        categories: ['electrical'],
        jurisdiction: 'SG',
        reliability: 'B',
        description: 'Lighting fixtures and accessories.',
        priceList: {
            'downlight_led': { price: 12.00, unit: 'pc' },
            'track_light': { price: 25.00, unit: 'pc' },
            'led_strip': { price: 8.00, unit: 'm' }
        }
    },

    // --- SG GENERIC / DEFAULT ---
    {
        id: 'generic_sg',
        name: 'SG Market Rate',
        categories: ['masonry', 'flooring', 'painting', 'carpentry', 'electrical', 'plumbing', 'metalworks', 'glassworks', 'ceiling'],
        jurisdiction: 'SG',
        reliability: 'B',
        description: 'Standard Singapore market rate estimation.',
        priceList: {
            'wall_tiling': { price: 4.00, unit: 'psf' },
            'floor_tiling': { price: 5.00, unit: 'psf' },
            'painting': { price: 0.90, unit: 'psf' },
            'vinyl_flooring': { price: 4.50, unit: 'psf' },
            'laminate_finish': { price: 4.00, unit: 'psf' }
        }
    },

    // 
    // MALAYSIA VENDORS
    // 

    {
        id: 'niro_granite_my',
        name: 'Niro Granite MY',
        categories: ['masonry', 'flooring'],
        jurisdiction: 'MY',
        reliability: 'A',
        description: 'Malaysia HQ, major tile manufacturer. Factory-direct pricing.',
        priceList: {
            'wall_tiling': { price: 8.00, unit: 'psf' },     // MYR
            'floor_tiling': { price: 12.00, unit: 'psf' },
            'homogeneous_tile': { price: 11.00, unit: 'psf' },
            'marble_look_tile': { price: 16.00, unit: 'psf' },
            'subway_tile': { price: 12.00, unit: 'pc' }
        }
    },
    {
        id: 'nippon_paint_my',
        name: 'Nippon Paint MY',
        categories: ['painting'],
        jurisdiction: 'MY',
        reliability: 'A',
        description: 'Nippon Paint Malaysia. Matex and Spotless range.',
        priceList: {
            'interior_painting': { price: 80.00, unit: 'tin' },  // MYR per 5L
            'exterior_painting': { price: 100.00, unit: 'tin' },
            'sealer': { price: 55.00, unit: 'tin' }
        }
    },
    {
        id: 'kanzen_my',
        name: 'Kanzen Hardware MY',
        categories: ['carpentry', 'plumbing'],
        jurisdiction: 'MY',
        reliability: 'B',
        description: 'JB hardware supplier. Plywood, fittings, and plumbing.',
        priceList: {
            'plywood_18mm': { price: 85.00, unit: 'sht' },   // MYR
            'soft_close_hinge': { price: 8.00, unit: 'pair' },
            'drawer_runner': { price: 25.00, unit: 'set' },
            'cement_screed': { price: 18.00, unit: 'bag' },
            'waterproofing_membrane': { price: 95.00, unit: 'pail' }
        }
    },
    {
        id: 'homepro_my',
        name: 'HomePro MY',
        categories: ['electrical', 'plumbing', 'painting'],
        jurisdiction: 'MY',
        reliability: 'B',
        description: 'Chain hardware store. Good for electrical & basic fittings.',
        priceList: {
            'downlight_led': { price: 25.00, unit: 'pc' },   // MYR
            'track_light': { price: 55.00, unit: 'pc' },
            'led_strip': { price: 18.00, unit: 'm' },
            'interior_painting': { price: 75.00, unit: 'tin' }
        }
    },
    {
        id: 'hafele_my',
        name: 'Häfele MY',
        categories: ['carpentry'],
        jurisdiction: 'MY',
        reliability: 'A',
        description: 'German hardware brand. Premium hinges, runners, systems.',
        priceList: {
            'soft_close_hinge': { price: 22.00, unit: 'pair' },  // MYR
            'drawer_runner': { price: 65.00, unit: 'set' },
            'laminate_finish': { price: 12.00, unit: 'psf' }
        }
    },
    {
        id: 'jb_carpentry',
        name: 'JB Carpentry Workshop',
        categories: ['carpentry'],
        jurisdiction: 'MY',
        reliability: 'B',
        description: 'JB-based workshop. Cross-border fabrication for SG projects.',
        priceList: {
            'kitchen_cabinet': { price: 180.00, unit: 'lft' },  // MYR per linear ft
            'wardrobe': { price: 160.00, unit: 'lft' },
            'vanity': { price: 200.00, unit: 'lft' },
            'shoe_cabinet': { price: 150.00, unit: 'lft' }
        }
    },
    {
        id: 'my_flooring',
        name: 'Floor Depot MY',
        categories: ['flooring'],
        jurisdiction: 'MY',
        reliability: 'B',
        description: 'Malaysia flooring chain. SPC, laminate, engineered wood.',
        priceList: {
            'vinyl_flooring': { price: 8.50, unit: 'psf' },   // MYR
            'laminate_flooring': { price: 7.00, unit: 'psf' },
            'timber_decking': { price: 35.00, unit: 'psf' }
        }
    },
    {
        id: 'generic_my',
        name: 'MY Market Rate',
        categories: ['masonry', 'flooring', 'painting', 'carpentry', 'electrical', 'plumbing', 'metalworks', 'glassworks', 'ceiling'],
        jurisdiction: 'MY',
        reliability: 'C',
        description: 'Standard Malaysia market rate estimation.',
        priceList: {
            'wall_tiling': { price: 10.00, unit: 'psf' },    // MYR
            'floor_tiling': { price: 13.00, unit: 'psf' },
            'painting': { price: 2.50, unit: 'psf' },
            'vinyl_flooring': { price: 9.00, unit: 'psf' },
            'laminate_finish': { price: 10.00, unit: 'psf' }
        }
    },
];

// ============================================================
// QUERY FUNCTIONS
// ============================================================

export function getVendorsByCategory(category: string): Vendor[] {
    return VENDOR_LIBRARY.filter(v =>
        v.categories.includes(category as TradeCategory) || v.id.startsWith('generic')
    );
}

export function getVendorsByJurisdiction(jurisdiction: Jurisdiction): Vendor[] {
    return VENDOR_LIBRARY.filter(v =>
        v.jurisdiction === jurisdiction || v.jurisdiction === 'BOTH'
    );
}

export function getVendorsByCategoryAndJurisdiction(category: string, jurisdiction: Jurisdiction): Vendor[] {
    return VENDOR_LIBRARY.filter(v =>
        (v.categories.includes(category as TradeCategory) || v.id.startsWith('generic')) &&
        (v.jurisdiction === jurisdiction || v.jurisdiction === 'BOTH')
    );
}

export function getVendorPrice(vendorId: string, itemKey: string): { price: number; unit: string } | null {
    const vendor = VENDOR_LIBRARY.find(v => v.id === vendorId);
    if (!vendor) return null;
    return vendor.priceList[itemKey] || null;
}

/** Compare all vendors for a specific item, sorted cheapest first */
export function compareVendorPrices(
    itemKey: string,
    jurisdiction: Jurisdiction
): Array<{ vendor: Vendor; price: number; unit: string }> {
    const vendors = getVendorsByJurisdiction(jurisdiction);
    const results: Array<{ vendor: Vendor; price: number; unit: string }> = [];

    for (const vendor of vendors) {
        const priceInfo = vendor.priceList[itemKey];
        if (priceInfo) {
            results.push({ vendor, price: priceInfo.price, unit: priceInfo.unit });
        }
    }

    return results.sort((a, b) => a.price - b.price);
}
