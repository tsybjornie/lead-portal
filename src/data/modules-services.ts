import { CostItem, ComponentPricing } from '@/types/core';

// Helper to create a "Quiet Money" Strategy
const createServiceStrategy = (
    baseCost: number,
    jurisdiction: 'MY' | 'SG',
    margin: number,
    risk: number,
    currency: 'MYR' | 'SGD' = 'SGD'
) => ({
    strategy: {
        baseCost,
        volatilityBuffer: 0,
        logisticsAdder: 0,
        targetMargin: margin,
        executionRiskFactor: risk,
        currency
    },
    jurisdiction,
    source: { supplierId: 'INTERNAL', isStale: false }
});

export const QUIET_MONEY_MODULES: CostItem[] = [
    // --- 1. COMPLIANCE (The Gatekeepers) ---
    {
        id: 'SVC-LAM-MY',
        name: 'Professional Endorsements & Submissions (LAM)',
        category: 'compliance',
        measurementType: 'Unit',
        exclusions: ['Site Surveying Fees'],
        components: {
            supply: { ...createServiceStrategy(1500, 'MY', 0.45, 1.15, 'MYR'), jurisdiction: 'MY' } as ComponentPricing
        }
    },
    {
        id: 'SVC-CIDB-MY',
        name: 'CIDB Compliance & Levy',
        category: 'compliance',
        measurementType: 'Unit',
        exclusions: ['Late Penalty Fees'],
        components: {
            supply: { ...createServiceStrategy(500, 'MY', 0.35, 1.10, 'MYR'), jurisdiction: 'MY' } as ComponentPricing
        }
    },
    {
        id: 'SVC-TC-SG',
        name: 'Authority & Regulatory Compliance (SG)',
        category: 'compliance',
        measurementType: 'Unit',
        exclusions: ['Testing Fees', 'PE Endorsement'],
        components: {
            supply: { ...createServiceStrategy(2000, 'SG', 0.50, 1.25, 'SGD'), jurisdiction: 'SG' } as ComponentPricing
        }
    },

    // --- 2. SOURCING (Decision Risk) ---
    {
        id: 'SVC-SOURCE-ITEM',
        name: 'Specialist Item Sourcing & Procurement',
        category: 'sourcing',
        measurementType: 'Unit',
        exclusions: ['Freight (See Logistics)', 'Warranty Claims'],
        components: {
            supply: { ...createServiceStrategy(300, 'SG', 0.50, 1.20, 'SGD'), jurisdiction: 'SG' } as ComponentPricing
        }
    },
    {
        id: 'SVC-SOURCE-PKG',
        name: 'Fixtures & Finishes Sourcing Package',
        category: 'sourcing',
        measurementType: 'Unit',
        exclusions: [],
        components: {
            supply: { ...createServiceStrategy(1500, 'SG', 0.45, 1.10, 'SGD'), jurisdiction: 'SG' } as ComponentPricing
        }
    },

    // --- 3. COORDINATION (The Glue) ---
    {
        id: 'SVC-COORD-FIXED',
        name: 'Supplier & Delivery Coordination',
        category: 'coordination',
        measurementType: 'Unit',
        exclusions: ['Site supervision (See PM)'],
        components: {
            supply: { ...createServiceStrategy(2500, 'SG', 0.55, 1.15, 'SGD'), jurisdiction: 'SG' } as ComponentPricing
        }
    },

    // --- 4. PROJECT MANAGEMENT (The Liability) ---
    {
        id: 'SVC-PM-SG',
        name: 'Onsite Project Management & Liability',
        category: 'management',
        measurementType: 'Linear',
        exclusions: ['Legal Dispute Fees'],
        components: {
            installation: { ...createServiceStrategy(4000, 'SG', 0.45, 1.25, 'SGD'), jurisdiction: 'SG' } as ComponentPricing
        }
    },

    // --- 5. ASSEMBLY & INSTALLATION (Handyman Works) ---
    {
        id: 'SVC-ASSEMBLY-ITEM',
        name: 'Assembly & Installation (Per Item)',
        category: 'assembly',
        measurementType: 'Unit',
        exclusions: ['Structural Modifications', 'Electrical Wiring (See M&E)'],
        components: {
            installation: {
                ...createServiceStrategy(120, 'SG', 0.45, 1.25, 'SGD'),
                jurisdiction: 'SG'
            } as ComponentPricing
        }
    },
    {
        id: 'SVC-ASSEMBLY-TIME',
        name: 'On-site Fitting & Setup (Time Based)',
        category: 'assembly',
        measurementType: 'Linear',
        exclusions: ['Parts & Consumables'],
        components: {
            installation: {
                ...createServiceStrategy(500, 'SG', 0.55, 1.30, 'SGD'),
                jurisdiction: 'SG'
            } as ComponentPricing
        }
    },
    {
        id: 'SVC-ASSEMBLY-PKG',
        name: 'Handyman Assembly Package (Standard)',
        category: 'assembly',
        measurementType: 'Unit',
        exclusions: ['Items > 20kg', 'Drilling into Stone'],
        components: {
            installation: {
                ...createServiceStrategy(1200, 'SG', 0.40, 1.15, 'SGD'),
                jurisdiction: 'SG'
            } as ComponentPricing
        }
    },

    // --- 6. DESIGN DELIVERABLES (The Creative Revenue) ---
    // A. Renders (High Margin, Revision Cap)
    {
        id: 'SVC-DESIGN-RENDER',
        name: '3D Visualisation & Rendering (Per View)',
        category: 'design',
        measurementType: 'Unit', // Per View
        exclusions: ['Revisions > 2 Rounds', 'VR Walkthrough'],
        components: {
            fabrication: { // "Making it" happens in MY
                ...createServiceStrategy(150, 'MY', 0.40, 1.10, 'MYR'),
                jurisdiction: 'MY'
            } as ComponentPricing,
            supply: { // Selling it happens in SG
                ...createServiceStrategy(450, 'SG', 0.50, 1.0, 'SGD'),
                jurisdiction: 'SG'
            } as ComponentPricing
        }
    },
    // B. Moodboards (Time Boxed)
    {
        id: 'SVC-DESIGN-MOOD',
        name: 'Concept Moodboard & Material Palette',
        category: 'design',
        measurementType: 'Unit', // Per Room/Zone
        exclusions: ['Physical Samples (See Procurement)'],
        components: {
            supply: {
                ...createServiceStrategy(800, 'SG', 0.45, 1.10, 'SGD'),
                jurisdiction: 'SG'
            } as ComponentPricing
        }
    },
    // C. Samples (Procurement Service)
    {
        id: 'SVC-DESIGN-SAMPLE',
        name: 'Sample Procurement & Handling',
        category: 'design',
        measurementType: 'Unit', // Lump Sum
        exclusions: ['Cost of Large Stone Slabs'],
        components: {
            supply: {
                ...createServiceStrategy(300, 'SG', 0.35, 1.20, 'SGD'), // Buffer for logistics
                jurisdiction: 'SG'
            } as ComponentPricing
        }
    },
    // D. BOQ (Liability)
    {
        id: 'SVC-DESIGN-BOQ',
        name: 'Detailed Bill of Quantities (BOQ)',
        category: 'design',
        measurementType: 'Unit', // Fixed Fee
        exclusions: ['Legal Validation'],
        components: {
            supply: {
                ...createServiceStrategy(1200, 'SG', 0.60, 1.30, 'SGD'), // High Risk, High Margin
                jurisdiction: 'SG'
            } as ComponentPricing
        }
    }
];
