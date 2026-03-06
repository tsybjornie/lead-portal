/**
 * Vendor Profiles  Seed Data
 * 
 * Realistic vendor/subcontractor profiles for Singapore + Malaysia.
 * These serve as default data until Supabase is connected.
 * 
 * Usage:
 *   import { VENDORS, getVendorsByTrade } from '@/data/vendors';
 */

import { TradeCategory } from '@/types/trades';

// ============================================================
// TYPES
// ============================================================

export interface VendorProfile {
    id: string;
    name: string;
    tradeCategories: TradeCategory[];    // Can serve multiple trades
    jurisdiction: 'SG' | 'MY' | 'CROSS_BORDER';
    reliability: 'A' | 'B' | 'C' | 'F';

    // Contact
    contactPerson: string;
    phone: string;
    email: string;
    address: string;

    // Business
    paymentTerms: string;
    creditLimit?: number;

    // Performance
    avgLeadTimeDays: number;
    defectRate: number;          // % (e.g. 2.5 = 2.5%)
    onTimeDelivery: number;      // % (e.g. 92 = 92%)

    // Specialties / notes
    specialties: string[];
    notes?: string;
    isActive: boolean;
}

// ============================================================
// VENDOR DATABASE
// ============================================================

export const VENDORS: VendorProfile[] = [
    //  CARPENTRY 
    {
        id: 'v-carp-001',
        name: 'Timberline Carpentry Sdn Bhd',
        tradeCategories: ['carpentry'],
        jurisdiction: 'MY',
        reliability: 'A',
        contactPerson: 'James Tan',
        phone: '+60 12-345 6789',
        email: 'james@timberlinecarpentry.my',
        address: '42 Jalan Industri, Johor Bahru 81300',
        paymentTerms: '50% deposit, 40% on delivery, 10% after install',
        creditLimit: 150000,
        avgLeadTimeDays: 21,
        defectRate: 1.5,
        onTimeDelivery: 94,
        specialties: ['laminate cabinets', 'wardrobes', 'feature walls', 'kitchen sets'],
        notes: 'Primary carpentry factory. Excellent quality. Can handle high volume. Transport via own lorry to SG.',
        isActive: true,
    },
    {
        id: 'v-carp-002',
        name: 'Woodgrain Studio Pte Ltd',
        tradeCategories: ['carpentry'],
        jurisdiction: 'SG',
        reliability: 'A',
        contactPerson: 'Daniel Lim',
        phone: '+65 9123 4567',
        email: 'daniel@woodgrainstudio.sg',
        address: '8 Defu Lane 10, #03-22, Singapore 539182',
        paymentTerms: 'Net 30',
        creditLimit: 80000,
        avgLeadTimeDays: 14,
        defectRate: 2.0,
        onTimeDelivery: 90,
        specialties: ['solid wood', 'veneer', 'premium finishes', 'custom joinery'],
        notes: 'Premium carpentry for high-end projects. Higher cost but exceptional finish. Good for condo/landed.',
        isActive: true,
    },
    {
        id: 'v-carp-003',
        name: 'KSL Furniture Factory',
        tradeCategories: ['carpentry'],
        jurisdiction: 'CROSS_BORDER',
        reliability: 'B',
        contactPerson: 'Steven Koh',
        phone: '+60 16-789 0123',
        email: 'steven@kslfurniture.com',
        address: '15 Taman Perindustrian, Senai 81400 Johor',
        paymentTerms: '50% deposit, 50% on delivery',
        avgLeadTimeDays: 28,
        defectRate: 3.5,
        onTimeDelivery: 82,
        specialties: ['budget cabinets', 'mass production', 'melamine'],
        notes: 'Budget option. Good for HDB volume projects. Quality can be inconsistent  needs QC inspection.',
        isActive: true,
    },

    //  MASONRY & TILING 
    {
        id: 'v-mason-001',
        name: 'Ah Huat Tiling Services',
        tradeCategories: ['masonry'],
        jurisdiction: 'SG',
        reliability: 'A',
        contactPerson: 'Huat Koh',
        phone: '+65 8234 5678',
        email: 'ahhuat.tiling@gmail.com',
        address: 'Mobile  Islandwide service',
        paymentTerms: 'Progressive claim (weekly)',
        avgLeadTimeDays: 3,
        defectRate: 1.0,
        onTimeDelivery: 96,
        specialties: ['floor tiling', 'wall tiling', 'marble installation', 'mosaic patterns'],
        notes: 'Best tiler in SG. Book 3 weeks in advance. Skilled at herringbone and complex patterns.',
        isActive: true,
    },
    {
        id: 'v-mason-002',
        name: 'Premium Stone Gallery',
        tradeCategories: ['masonry', 'flooring'],
        jurisdiction: 'SG',
        reliability: 'B',
        contactPerson: 'Michelle Wong',
        phone: '+65 9876 5432',
        email: 'michelle@premiumstone.sg',
        address: '200 Jalan Sultan, #01-10, Singapore 199018',
        paymentTerms: 'Net 14 for materials, COD for labour',
        avgLeadTimeDays: 7,
        defectRate: 2.0,
        onTimeDelivery: 88,
        specialties: ['porcelain tiles', 'natural stone', 'homogeneous tiles', 'tile supply'],
        notes: 'Material supplier + installation. Good range of Italian and Spanish tiles. Competitive pricing on 600x600.',
        isActive: true,
    },

    //  DEMOLITION 
    {
        id: 'v-demo-001',
        name: 'Kuat Demo & Disposal Pte Ltd',
        tradeCategories: ['demolition', 'cleaning'],
        jurisdiction: 'SG',
        reliability: 'A',
        contactPerson: 'Raj Kumar',
        phone: '+65 8111 2222',
        email: 'raj@kuatdemo.sg',
        address: '50 Sungei Kadut Ave, Singapore 729564',
        paymentTerms: 'COD per session',
        avgLeadTimeDays: 2,
        defectRate: 0.5,
        onTimeDelivery: 95,
        specialties: ['wall hacking', 'floor hacking', 'NEA-licensed disposal', 'asbestos removal'],
        notes: 'Licensed waste carrier. Reliable for demo + disposal. Own fleet of lorries. Can do same-week bookings.',
        isActive: true,
    },

    //  ELECTRICAL 
    {
        id: 'v-elec-001',
        name: 'Bright Spark Electrical Pte Ltd',
        tradeCategories: ['electrical'],
        jurisdiction: 'SG',
        reliability: 'A',
        contactPerson: 'John Ng',
        phone: '+65 9345 6789',
        email: 'john@brightspark.sg',
        address: '10 Ubi Crescent, #05-10, Singapore 408564',
        paymentTerms: 'Net 30 (materials upfront)',
        avgLeadTimeDays: 5,
        defectRate: 0.8,
        onTimeDelivery: 93,
        specialties: ['rewiring', 'DB board upgrade', 'LED lighting', 'smart home', 'EMA licensed'],
        notes: 'EMA-licensed electrician. Handles BCA submissions. Can do after-hours work at premium.',
        isActive: true,
    },

    //  PLUMBING 
    {
        id: 'v-plumb-001',
        name: 'FlowTech Plumbing Services',
        tradeCategories: ['plumbing'],
        jurisdiction: 'SG',
        reliability: 'B',
        contactPerson: 'Ahmad Shah',
        phone: '+65 8222 3333',
        email: 'ahmad@flowtech.sg',
        address: 'Mobile  Islandwide',
        paymentTerms: 'Progressive claim (per bathroom/kitchen)',
        avgLeadTimeDays: 3,
        defectRate: 2.5,
        onTimeDelivery: 86,
        specialties: ['concealed piping', 'bathroom fittings', 'water heater', 'PUB licensed'],
        notes: 'PUB-licensed plumber. Experienced with concealed piping rerouting. Carries basic fittings on van.',
        isActive: true,
    },

    //  AIRCON 
    {
        id: 'v-aircon-001',
        name: 'CoolBreeze Aircon Pte Ltd',
        tradeCategories: ['aircon'],
        jurisdiction: 'SG',
        reliability: 'A',
        contactPerson: 'Mike Chen',
        phone: '+65 9456 7890',
        email: 'mike@coolbreeze.sg',
        address: '30 Sin Ming Lane, #06-05, Singapore 573968',
        paymentTerms: '50% deposit, 50% on commissioning',
        creditLimit: 50000,
        avgLeadTimeDays: 10,
        defectRate: 1.2,
        onTimeDelivery: 91,
        specialties: ['Daikin', 'Mitsubishi', 'multi-split systems', 'VRV', 'concealed trunking'],
        notes: 'Authorized Daikin installer. Good pricing on system bundles. Free chemical wash after 1 year.',
        isActive: true,
    },

    //  PAINTING 
    {
        id: 'v-paint-001',
        name: 'Wee Paint Pro',
        tradeCategories: ['painting'],
        jurisdiction: 'SG',
        reliability: 'B',
        contactPerson: 'Wee Chong',
        phone: '+65 8333 4444',
        email: 'weepaintpro@gmail.com',
        address: 'Mobile  Islandwide',
        paymentTerms: 'COD (materials advance)',
        avgLeadTimeDays: 2,
        defectRate: 3.0,
        onTimeDelivery: 85,
        specialties: ['emulsion', 'texture paint', 'limewash', 'colour consultation'],
        notes: 'Budget-friendly painter. 2-man team. Touch-ups inclusive within first week.',
        isActive: true,
    },

    //  CEILING 
    {
        id: 'v-ceil-001',
        name: 'TopForm Ceilings Pte Ltd',
        tradeCategories: ['ceiling'],
        jurisdiction: 'SG',
        reliability: 'A',
        contactPerson: 'Alex Tan',
        phone: '+65 9567 8901',
        email: 'alex@topformceilings.sg',
        address: '5 Tuas Close, Singapore 638950',
        paymentTerms: 'Net 21',
        avgLeadTimeDays: 5,
        defectRate: 1.5,
        onTimeDelivery: 92,
        specialties: ['gypsum board', 'feature ceilings', 'cove lighting troughs', 'access panels'],
        notes: 'Specializes in complex ceiling profiles. Good coordination with electrical team.',
        isActive: true,
    },

    //  METALWORKS 
    {
        id: 'v-metal-001',
        name: 'Ironclad Metalworks',
        tradeCategories: ['metalworks'],
        jurisdiction: 'MY',
        reliability: 'B',
        contactPerson: 'Kevin Lau',
        phone: '+60 12-456 7890',
        email: 'kevin@ironcladmetal.my',
        address: '28 Kawasan Perindustrian JB, Johor 81400',
        paymentTerms: '50% deposit, 50% on delivery',
        avgLeadTimeDays: 18,
        defectRate: 2.5,
        onTimeDelivery: 80,
        specialties: ['mild steel grilles', 'powder coating', 'stainless steel railings', 'metal gates'],
        notes: 'Cross-border fabrication. Good pricing but must factor transport + customs delays.',
        isActive: true,
    },

    //  GLASS & MIRRORS 
    {
        id: 'v-glass-001',
        name: 'ClearVision Glass Pte Ltd',
        tradeCategories: ['glassworks'],
        jurisdiction: 'SG',
        reliability: 'A',
        contactPerson: 'Sharon Lee',
        phone: '+65 9678 9012',
        email: 'sharon@clearvision.sg',
        address: '15 Woodlands Terrace, Singapore 738451',
        paymentTerms: 'Full payment before fabrication',
        avgLeadTimeDays: 12,
        defectRate: 1.0,
        onTimeDelivery: 90,
        specialties: ['tempered glass', 'shower screens', 'mirrors', 'glass backsplash', 'laminated glass'],
        notes: 'Good quality tempered glass. Precise measurements essential  no on-site cutting.',
        isActive: true,
    },

    //  WATERPROOFING 
    {
        id: 'v-wp-001',
        name: 'AquaShield Waterproofing Pte Ltd',
        tradeCategories: ['waterproofing'],
        jurisdiction: 'SG',
        reliability: 'A',
        contactPerson: 'David Sim',
        phone: '+65 8444 5555',
        email: 'david@aquashield.sg',
        address: '20 Benoi Road, Singapore 629877',
        paymentTerms: 'Progressive (after ponding test pass)',
        avgLeadTimeDays: 3,
        defectRate: 0.5,
        onTimeDelivery: 97,
        specialties: ['membrane waterproofing', 'epoxy coating', 'ponding test', 'balcony waterproofing'],
        notes: '10-year warranty on bathroom waterproofing. Uses Fosroc / Sika systems. Ponding test inclusive.',
        isActive: true,
    },

    //  FLOORING 
    {
        id: 'v-floor-001',
        name: 'FloorCraft Pte Ltd',
        tradeCategories: ['flooring'],
        jurisdiction: 'SG',
        reliability: 'B',
        contactPerson: 'Lisa Tan',
        phone: '+65 9789 0123',
        email: 'lisa@floorcraft.sg',
        address: '88 Tai Seng Ave, #02-15, Singapore 534416',
        paymentTerms: 'Materials upfront, labour on completion',
        avgLeadTimeDays: 5,
        defectRate: 2.0,
        onTimeDelivery: 88,
        specialties: ['SPC vinyl', 'engineered timber', 'laminate', 'herringbone'],
        notes: 'Good range of SPC/vinyl options. Competitive for whole-unit flooring. Includes free levelling up to 2mm.',
        isActive: true,
    },

    //  DESIGN & SUBMISSIONS 
    {
        id: 'v-design-001',
        name: 'Arc Design Studio',
        tradeCategories: ['design_submissions'],
        jurisdiction: 'SG',
        reliability: 'A',
        contactPerson: 'Tina Chong',
        phone: '+65 9890 1234',
        email: 'tina@arcdesign.sg',
        address: '18 Robinson Road, #12-05, Singapore 048547',
        paymentTerms: 'As per package',
        avgLeadTimeDays: 7,
        defectRate: 0,
        onTimeDelivery: 95,
        specialties: ['space planning', '3D renders', 'HDB permit', 'BCA submission', 'project management'],
        notes: 'In-house design arm. All permit submissions handled internally.',
        isActive: true,
    },

    //  PRELIMINARIES & SITE SETUP 
    {
        id: 'v-prelim-001',
        name: 'SafeGuard Protection Services',
        tradeCategories: ['preliminaries'],
        jurisdiction: 'SG',
        reliability: 'A',
        contactPerson: 'Benny Toh',
        phone: '+65 8555 6666',
        email: 'benny@safeguardprotection.sg',
        address: '6 Changi South Lane, Singapore 486775',
        paymentTerms: 'COD',
        avgLeadTimeDays: 1,
        defectRate: 0,
        onTimeDelivery: 98,
        specialties: ['floor protection', 'lift protection', 'door frame protection', 'temporary hoarding'],
        notes: 'Supplies protection materials and installs. Can mobilize same-day for urgent projects.',
        isActive: true,
    },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get all active vendors for a given trade category.
 */
export function getVendorsByTrade(trade: TradeCategory): VendorProfile[] {
    return getAllVendors().filter(v =>
        v.isActive && v.tradeCategories.includes(trade)
    );
}

/**
 * Get the best vendor (highest reliability, then on-time delivery) for a trade.
 */
export function getBestVendor(trade: TradeCategory): VendorProfile | null {
    const vendors = getVendorsByTrade(trade);
    if (vendors.length === 0) return null;

    const reliabilityOrder = { A: 4, B: 3, C: 2, F: 1 };
    return vendors.sort((a, b) =>
        (reliabilityOrder[b.reliability] - reliabilityOrder[a.reliability]) ||
        (b.onTimeDelivery - a.onTimeDelivery)
    )[0];
}

/**
 * Get all vendors by jurisdiction.
 */
export function getVendorsByJurisdiction(jurisdiction: 'SG' | 'MY' | 'CROSS_BORDER'): VendorProfile[] {
    return getAllVendors().filter(v =>
        v.isActive && (v.jurisdiction === jurisdiction || v.jurisdiction === 'CROSS_BORDER')
    );
}

// ============================================================
// LOCAL STORAGE  Custom Contractor Profiles
// Designers can create their own vendors without Supabase.
// Same vendor may give different rates to different designers,
// so this data belongs to the designer, not the vendor.
// ============================================================

const VENDOR_STORAGE_KEY = 'arc-quote-vendors';

/**
 * Get ALL vendors (user-created + seed defaults).
 * Custom vendors override seed vendors with same ID.
 */
export function getAllVendors(): VendorProfile[] {
    if (typeof window === 'undefined') return VENDORS;

    const stored = localStorage.getItem(VENDOR_STORAGE_KEY);
    if (!stored) return VENDORS;

    try {
        const custom: VendorProfile[] = JSON.parse(stored);
        const customIds = new Set(custom.map(v => v.id));
        const seedVendors = VENDORS.filter(v => !customIds.has(v.id));
        return [...custom, ...seedVendors];
    } catch {
        return VENDORS;
    }
}

/**
 * Save/update a vendor profile (designer's own contractor).
 */
export function saveVendor(vendor: VendorProfile): void {
    if (typeof window === 'undefined') return;

    const custom = getCustomVendors();
    const idx = custom.findIndex(v => v.id === vendor.id);
    if (idx >= 0) {
        custom[idx] = vendor;
    } else {
        custom.push(vendor);
    }
    localStorage.setItem(VENDOR_STORAGE_KEY, JSON.stringify(custom));
}

/**
 * Delete a custom vendor.
 */
export function deleteVendor(id: string): void {
    if (typeof window === 'undefined') return;

    const custom = getCustomVendors().filter(v => v.id !== id);
    localStorage.setItem(VENDOR_STORAGE_KEY, JSON.stringify(custom));
}

/**
 * Create a new blank vendor profile with a unique ID.
 */
export function createBlankVendor(tradeCategory: TradeCategory): VendorProfile {
    return {
        id: `v-custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: '',
        tradeCategories: [tradeCategory],
        jurisdiction: 'SG',
        reliability: 'B',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        paymentTerms: 'Net 30',
        avgLeadTimeDays: 14,
        defectRate: 0,
        onTimeDelivery: 85,
        specialties: [],
        isActive: true,
    };
}

function getCustomVendors(): VendorProfile[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(VENDOR_STORAGE_KEY);
    if (!stored) return [];

    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}
