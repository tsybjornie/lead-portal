import type { SupplierInfo } from './core';

// ── DEMO SUPPLIER DATA (SG/MY market) ──

export const DEMO_SUPPLIERS: Record<string, SupplierInfo> = {
    hafary: {
        supplierName: 'Hafary', supplierCountry: 'Singapore', supplierCity: 'Eunos',
        costPrice: '$8.50', retailPrice: '$12.80', unit: 'per pc',
        designerMarkup: 15, leadTime: '7-10 days', shipping: 'Local delivery',
        installRate: '$8.00', installUnit: 'per sqft',
    },
    sinlec: {
        supplierName: 'SinLec Hardware', supplierCountry: 'Singapore', supplierCity: 'Defu Lane',
        costPrice: '$78', retailPrice: '$95', unit: 'per sheet (4x8)',
        designerMarkup: 12, leadTime: '2-3 days', shipping: 'Local pickup / delivery',
        installRate: '$55', installUnit: 'per sqft (carpentry labor)',
    },
    stone_amperor: {
        supplierName: 'Stone Amperor', supplierCountry: 'Singapore', supplierCity: 'Mandai',
        costPrice: '$180', retailPrice: '$280', unit: 'per sqft (slab)',
        designerMarkup: 20, leadTime: '2-4 weeks (imported)', shipping: 'Sea freight from Italy/Brazil',
        installRate: '$25', installUnit: 'per sqft', moq: '1 full slab (~45 sqft)',
        notes: 'Slab selection by appointment. Bookmatching available.',
    },
    euro_marble: {
        supplierName: 'Euro Marble', supplierCountry: 'Singapore', supplierCity: 'Kaki Bukit',
        costPrice: '$220', retailPrice: '$350', unit: 'per sqft (slab)',
        designerMarkup: 20, leadTime: '3-6 weeks', shipping: 'Container from Carrara, Italy',
        installRate: '$28', installUnit: 'per sqft', moq: '1 full slab',
        notes: 'Direct quarry relationship. Can source to order.',
    },
    soon_bee_huat: {
        supplierName: 'Soon Bee Huat', supplierCountry: 'Singapore', supplierCity: 'Ubi',
        costPrice: '$15', retailPrice: '$25', unit: 'per sqft',
        designerMarkup: 15, leadTime: '5-7 days', shipping: 'Local delivery',
        installRate: '$12', installUnit: 'per sqft',
    },
    goodrich: {
        supplierName: 'Goodrich Global', supplierCountry: 'Singapore', supplierCity: 'Tagore Lane',
        costPrice: '$4.50', retailPrice: '$7.50', unit: 'per sqft',
        designerMarkup: 15, leadTime: '7-14 days', shipping: 'Local delivery',
        installRate: '$3.00', installUnit: 'per sqft',
    },
    mc_curtain: {
        supplierName: 'MC Curtain', supplierCountry: 'Singapore', supplierCity: 'Balestier',
        costPrice: '$8', retailPrice: '$14', unit: 'per sqft (fabric)',
        designerMarkup: 18, leadTime: '10-14 days', shipping: 'On-site measurement + install',
        installRate: 'Included', installUnit: 'full service',
    },
    hafele: {
        supplierName: 'Häfele', supplierCountry: 'Germany', supplierCity: 'SG Office: Toh Guan',
        costPrice: '$38', retailPrice: '$52', unit: 'per set',
        designerMarkup: 12, leadTime: '5-7 days', shipping: 'Ex-stock Singapore warehouse',
        installRate: 'Included in carpentry', installUnit: 'N/A',
    },
    blum: {
        supplierName: 'Blum', supplierCountry: 'Austria', supplierCity: 'SG Distributor: Häfele',
        costPrice: '$42', retailPrice: '$58', unit: 'per set',
        designerMarkup: 12, leadTime: '5-7 days', shipping: 'Ex-stock Singapore',
        installRate: 'Included in carpentry', installUnit: 'N/A',
    },
    kim_hin: {
        supplierName: 'Kim Hin Industry', supplierCountry: 'Malaysia', supplierCity: 'Johor Bahru',
        costPrice: '$3.80', retailPrice: '$6.50', unit: 'per pc (600x600)',
        designerMarkup: 15, leadTime: '3-5 days', shipping: 'Cross-border JB → SG',
        installRate: '$7.00', installUnit: 'per sqft',
    },
    hup_kiong: {
        supplierName: 'Hup Kiong Timber', supplierCountry: 'Malaysia', supplierCity: 'Muar, Johor',
        costPrice: '$22', retailPrice: '$38', unit: 'per sqft (solid timber)',
        designerMarkup: 18, leadTime: '2-3 weeks', shipping: 'Truck from Johor',
        installRate: '$18', installUnit: 'per sqft',
        notes: 'Specializes in Chengal, Merbau, Balau for outdoor. Sustainable plantation sources.',
    },
    bali_stone: {
        supplierName: 'CV Bali Stone', supplierCountry: 'Indonesia', supplierCity: 'Denpasar, Bali',
        costPrice: 'IDR 350,000', retailPrice: '$55', unit: 'per sqm',
        designerMarkup: 25, leadTime: '4-6 weeks', shipping: 'Sea freight Bali → SG (container)',
        installRate: '$15', installUnit: 'per sqft', moq: '50 sqm',
        notes: 'Sukabumi green stone specialist. FOB Benoa port.',
    },
    carrara_direct: {
        supplierName: 'Marmi Carrara S.r.l.', supplierCountry: 'Italy', supplierCity: 'Carrara, Tuscany',
        costPrice: '€120', retailPrice: '$280', unit: 'per sqm (slab)',
        designerMarkup: 25, leadTime: '6-8 weeks', shipping: 'Sea freight Livorno → SG',
        installRate: '$28', installUnit: 'per sqft', moq: '1 container (10+ slabs)',
        notes: 'Direct quarry. Slab photos via WhatsApp. Letter of credit payment.',
    },
};
