/**
 * Quote Templates
 * Pre-built templates for common renovation packages
 */

export interface TemplateLineItem {
    mainCategory: string;
    taskDescription: string;
    unit: 'Per Unit' | 'Linear (mm/cm/m)' | 'Area (sqm/sqft)' | 'Lump Sum';
    defaultQuantity?: number;
    suggestedRate?: number;
    notes?: string;
}

export interface QuoteTemplate {
    id: string;
    name: string;
    description: string;
    jurisdiction: 'SG' | 'MY' | 'BOTH';
    projectType: 'Residential' | 'Commercial' | 'Both';
    items: TemplateLineItem[];
}

export const QUOTE_TEMPLATES: QuoteTemplate[] = [
    {
        id: 'kitchen-standard-sg',
        name: 'Standard Kitchen (HDB/Condo)',
        description: '10ft base + upper cabinets, countertop, backsplash',
        jurisdiction: 'SG',
        projectType: 'Residential',
        items: [
            { mainCategory: 'Kitchen Carpentry', taskDescription: 'Base cabinets with soft-close hinges', unit: 'Linear (mm/cm/m)', defaultQuantity: 3000, suggestedRate: 450 },
            { mainCategory: 'Kitchen Carpentry', taskDescription: 'Upper wall cabinets', unit: 'Linear (mm/cm/m)', defaultQuantity: 3000, suggestedRate: 380 },
            { mainCategory: 'Kitchen Carpentry', taskDescription: 'Quartz countertop (15mm)', unit: 'Linear (mm/cm/m)', defaultQuantity: 3000, suggestedRate: 280 },
            { mainCategory: 'Tiling', taskDescription: 'Backsplash tiles', unit: 'Area (sqm/sqft)', defaultQuantity: 2, suggestedRate: 85 },
            { mainCategory: 'Plumbing', taskDescription: 'Sink installation', unit: 'Per Unit', defaultQuantity: 1, suggestedRate: 350 },
            { mainCategory: 'Electrical', taskDescription: 'Power points for appliances', unit: 'Per Unit', defaultQuantity: 4, suggestedRate: 120 },
        ]
    },
    {
        id: 'bathroom-basic-sg',
        name: 'Basic Bathroom Renovation',
        description: 'Floor/wall tiles, WC, vanity, shower screen',
        jurisdiction: 'SG',
        projectType: 'Residential',
        items: [
            { mainCategory: 'Hacking', taskDescription: 'Hack existing floor and wall tiles', unit: 'Area (sqm/sqft)', defaultQuantity: 8, suggestedRate: 35 },
            { mainCategory: 'Waterproofing', taskDescription: 'Membrane waterproofing', unit: 'Area (sqm/sqft)', defaultQuantity: 8, suggestedRate: 45 },
            { mainCategory: 'Tiling', taskDescription: 'Floor tiles (porcelain)', unit: 'Area (sqm/sqft)', defaultQuantity: 4, suggestedRate: 85 },
            { mainCategory: 'Tiling', taskDescription: 'Wall tiles', unit: 'Area (sqm/sqft)', defaultQuantity: 12, suggestedRate: 75 },
            { mainCategory: 'Sanitary', taskDescription: 'Wall-hung WC', unit: 'Per Unit', defaultQuantity: 1, suggestedRate: 800 },
            { mainCategory: 'Sanitary', taskDescription: 'Vanity basin with cabinet', unit: 'Per Unit', defaultQuantity: 1, suggestedRate: 650 },
            { mainCategory: 'Sanitary', taskDescription: 'Shower screen (tempered glass)', unit: 'Per Unit', defaultQuantity: 1, suggestedRate: 450 },
            { mainCategory: 'Plumbing', taskDescription: 'Mixer tap installation', unit: 'Per Unit', defaultQuantity: 2, suggestedRate: 180 },
        ]
    },
    {
        id: 'bedroom-wardrobes-sg',
        name: 'Bedroom Built-in Wardrobes',
        description: '8ft full-height wardrobes with accessories',
        jurisdiction: 'SG',
        projectType: 'Residential',
        items: [
            { mainCategory: 'Bedroom Carpentry', taskDescription: 'Full-height wardrobe with sliding doors', unit: 'Linear (mm/cm/m)', defaultQuantity: 2400, suggestedRate: 520 },
            { mainCategory: 'Bedroom Carpentry', taskDescription: 'Internal fittings (drawers, shelves)', unit: 'Lump Sum', defaultQuantity: 1, suggestedRate: 800 },
            { mainCategory: 'Bedroom Carpentry', taskDescription: 'Soft-close accessories', unit: 'Per Unit', defaultQuantity: 4, suggestedRate: 45 },
            { mainCategory: 'Electrical', taskDescription: 'LED strip lighting', unit: 'Linear (mm/cm/m)', defaultQuantity: 2400, suggestedRate: 25 },
        ]
    },
    {
        id: 'living-feature-wall-sg',
        name: 'Living Room Feature Wall + TV Console',
        description: 'Feature wall with TV console and storage',
        jurisdiction: 'SG',
        projectType: 'Residential',
        items: [
            { mainCategory: 'Living Carpentry', taskDescription: 'Feature wall panel (laminate/veneer)', unit: 'Area (sqm/sqft)', defaultQuantity: 8, suggestedRate: 280 },
            { mainCategory: 'Living Carpentry', taskDescription: 'TV console with storage', unit: 'Linear (mm/cm/m)', defaultQuantity: 2000, suggestedRate: 380 },
            { mainCategory: 'Electrical', taskDescription: 'Concealed wiring for TV', unit: 'Lump Sum', defaultQuantity: 1, suggestedRate: 350 },
            { mainCategory: 'Electrical', taskDescription: 'Power points', unit: 'Per Unit', defaultQuantity: 3, suggestedRate: 120 },
        ]
    },
    {
        id: 'full-reno-3br-sg',
        name: 'Full Renovation (3BR HDB)',
        description: 'Complete renovation package',
        jurisdiction: 'SG',
        projectType: 'Residential',
        items: [
            // Hacking
            { mainCategory: 'Hacking', taskDescription: 'Kitchen floor tiles', unit: 'Area (sqm/sqft)', defaultQuantity: 8, suggestedRate: 35 },
            { mainCategory: 'Hacking', taskDescription: 'Bathroom 1 tiles', unit: 'Area (sqm/sqft)', defaultQuantity: 5, suggestedRate: 35 },
            { mainCategory: 'Hacking', taskDescription: 'Bathroom 2 tiles', unit: 'Area (sqm/sqft)', defaultQuantity: 4, suggestedRate: 35 },
            // Masonry
            { mainCategory: 'Masonry', taskDescription: 'Kitchen floor screed', unit: 'Area (sqm/sqft)', defaultQuantity: 8, suggestedRate: 25 },
            // Waterproofing
            { mainCategory: 'Waterproofing', taskDescription: 'Bathroom 1 waterproofing', unit: 'Area (sqm/sqft)', defaultQuantity: 5, suggestedRate: 45 },
            { mainCategory: 'Waterproofing', taskDescription: 'Bathroom 2 waterproofing', unit: 'Area (sqm/sqft)', defaultQuantity: 4, suggestedRate: 45 },
            // Tiling
            { mainCategory: 'Tiling', taskDescription: 'Kitchen floor + backsplash', unit: 'Area (sqm/sqft)', defaultQuantity: 10, suggestedRate: 85 },
            { mainCategory: 'Tiling', taskDescription: 'Bathroom 1 floor + wall', unit: 'Area (sqm/sqft)', defaultQuantity: 14, suggestedRate: 85 },
            { mainCategory: 'Tiling', taskDescription: 'Bathroom 2 floor + wall', unit: 'Area (sqm/sqft)', defaultQuantity: 12, suggestedRate: 85 },
            // Carpentry
            { mainCategory: 'Kitchen Carpentry', taskDescription: 'Base + upper cabinets', unit: 'Linear (mm/cm/m)', defaultQuantity: 4000, suggestedRate: 420 },
            { mainCategory: 'Bedroom Carpentry', taskDescription: 'Master wardrobe', unit: 'Linear (mm/cm/m)', defaultQuantity: 2400, suggestedRate: 520 },
            { mainCategory: 'Bedroom Carpentry', taskDescription: 'Bedroom 2 wardrobe', unit: 'Linear (mm/cm/m)', defaultQuantity: 1800, suggestedRate: 480 },
            { mainCategory: 'Bedroom Carpentry', taskDescription: 'Bedroom 3 wardrobe', unit: 'Linear (mm/cm/m)', defaultQuantity: 1500, suggestedRate: 480 },
            { mainCategory: 'Living Carpentry', taskDescription: 'TV console', unit: 'Linear (mm/cm/m)', defaultQuantity: 2000, suggestedRate: 380 },
            // Electrical
            { mainCategory: 'Electrical', taskDescription: 'Full house rewiring', unit: 'Lump Sum', defaultQuantity: 1, suggestedRate: 3500 },
            { mainCategory: 'Electrical', taskDescription: 'Lighting installation', unit: 'Per Unit', defaultQuantity: 20, suggestedRate: 80 },
            // Painting
            { mainCategory: 'Painting', taskDescription: 'Full house painting (3 coats)', unit: 'Area (sqm/sqft)', defaultQuantity: 120, suggestedRate: 8 },
            // Flooring
            { mainCategory: 'Flooring', taskDescription: 'Vinyl flooring (bedrooms + living)', unit: 'Area (sqm/sqft)', defaultQuantity: 60, suggestedRate: 42 },
        ]
    },
];

// Helper to get templates by jurisdiction
export function getTemplatesByJurisdiction(jurisdiction: 'SG' | 'MY'): QuoteTemplate[] {
    return QUOTE_TEMPLATES.filter(t => t.jurisdiction === jurisdiction || t.jurisdiction === 'BOTH');
}
