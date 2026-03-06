/**
 * Ergonomic Standards  Position & Height Guidelines
 * 
 * Baked-in construction knowledge for switch, socket, and fixture placement.
 * When a designer places an element on an elevation, the system auto-validates
 * against these standards. Catches "anyhow" placement before it hits site.
 * 
 * Based on: SS 550 (Singapore), MS IEC (Malaysia), BCA guidelines, ADA principles
 * 
 * Lives in: Roof (elevation auto-validation)
 */

// ============================================================
// HEIGHT STANDARDS (mm from finished floor level)
// ============================================================

export interface HeightStandard {
    element: string;
    category: 'electrical' | 'plumbing' | 'carpentry' | 'general';
    zone: string | 'all';           // Which room this applies to

    // Heights
    standardHeight: number;          // mm from FFL
    minHeight: number;
    maxHeight: number;

    // Context
    reason: string;                  // Why this height
    accessibility?: string;          // ADA/universal design note
    sgRegulation?: string;           // Singapore regulation reference
}

export const ERGONOMIC_STANDARDS: HeightStandard[] = [

    // 
    // ELECTRICAL  Switches
    // 

    {
        element: 'Light Switch',
        category: 'electrical', zone: 'all',
        standardHeight: 1200, minHeight: 1100, maxHeight: 1400,
        reason: 'Shoulder-height for average adult. Easy reach without stretching.',
        accessibility: 'Wheelchair accessible at 1100mm. Children reach at 900mm.',
        sgRegulation: 'SS 550:2009',
    },
    {
        element: 'Light Switch (Bedside)',
        category: 'electrical', zone: 'bedroom',
        standardHeight: 600, minHeight: 500, maxHeight: 700,
        reason: 'Reachable from lying in bed. Above mattress height.',
    },
    {
        element: 'Dimmer Switch',
        category: 'electrical', zone: 'all',
        standardHeight: 1200, minHeight: 1100, maxHeight: 1400,
        reason: 'Same as light switch for consistency.',
    },

    // 
    // ELECTRICAL  Sockets
    // 

    {
        element: 'General Power Socket (13A)',
        category: 'electrical', zone: 'all',
        standardHeight: 300, minHeight: 200, maxHeight: 450,
        reason: 'Low enough to be inconspicuous, high enough to not need bending for elderly.',
        accessibility: 'For wheelchair users, raise to 450-600mm.',
    },
    {
        element: 'Kitchen Counter Socket',
        category: 'electrical', zone: 'kitchen',
        standardHeight: 1100, minHeight: 1000, maxHeight: 1200,
        reason: 'Above countertop (900mm) + backsplash. Easy reach for appliances.',
    },
    {
        element: 'Kitchen Counter Socket (Below Cabinet)',
        category: 'electrical', zone: 'kitchen',
        standardHeight: 1050, minHeight: 950, maxHeight: 1150,
        reason: 'Between countertop and wall cabinet. Clear of splash zone.',
    },
    {
        element: 'Bathroom Shaver Socket',
        category: 'electrical', zone: 'bathroom',
        standardHeight: 1500, minHeight: 1400, maxHeight: 1600,
        reason: 'Above splash zone. Must be IP44 rated in wet areas.',
        sgRegulation: 'SS 638  min 600mm from bath/shower zone boundary',
    },
    {
        element: 'TV Socket',
        category: 'electrical', zone: 'living',
        standardHeight: 300, minHeight: 200, maxHeight: 500,
        reason: 'Hidden behind TV console or wall-mounted TV.',
    },
    {
        element: 'TV Socket (Wall-mounted TV)',
        category: 'electrical', zone: 'living',
        standardHeight: 1200, minHeight: 1000, maxHeight: 1400,
        reason: 'Behind wall-mounted TV. Centre of TV typically at 1200mm (eye level when seated).',
    },
    {
        element: 'Desk Power Socket',
        category: 'electrical', zone: 'study',
        standardHeight: 750, minHeight: 650, maxHeight: 850,
        reason: 'At desk height for easy laptop/charger access.',
    },
    {
        element: 'Floor Socket (Pop-up)',
        category: 'electrical', zone: 'all',
        standardHeight: 0, minHeight: 0, maxHeight: 0,
        reason: 'Flush with floor. For island counters and open-plan areas.',
    },
    {
        element: 'Washing Machine Socket',
        category: 'electrical', zone: 'service_yard',
        standardHeight: 1200, minHeight: 1100, maxHeight: 1350,
        reason: 'Above machine height. Easy to unplug. Away from water.',
    },
    {
        element: 'Aircon Isolator',
        category: 'electrical', zone: 'all',
        standardHeight: 2100, minHeight: 2000, maxHeight: 2200,
        reason: 'Near FCU unit, above head height. Accessible for maintenance.',
    },

    // 
    // ELECTRICAL  Data & Comms
    // 

    {
        element: 'Data Point (LAN)',
        category: 'electrical', zone: 'all',
        standardHeight: 300, minHeight: 200, maxHeight: 450,
        reason: 'Same height as power sockets for clean cable routing.',
    },
    {
        element: 'Intercom / Video Doorbell Panel',
        category: 'electrical', zone: 'all',
        standardHeight: 1500, minHeight: 1400, maxHeight: 1600,
        reason: 'Eye-level for viewing screen. Comfortable for most adults.',
        accessibility: 'For wheelchair users: 1200mm max',
    },

    // 
    // PLUMBING  Fixtures
    // 

    {
        element: 'Basin Tap',
        category: 'plumbing', zone: 'bathroom',
        standardHeight: 850, minHeight: 800, maxHeight: 900,
        reason: 'Standard vanity top height. Comfortable hand-washing.',
    },
    {
        element: 'Kitchen Tap',
        category: 'plumbing', zone: 'kitchen',
        standardHeight: 900, minHeight: 850, maxHeight: 950,
        reason: 'Kitchen sink rim typically at 900mm. Tap above rim.',
    },
    {
        element: 'Shower Mixer',
        category: 'plumbing', zone: 'bathroom',
        standardHeight: 1000, minHeight: 900, maxHeight: 1100,
        reason: 'Waist height for easy adjustment while showering.',
    },
    {
        element: 'Shower Head (Rain Shower)',
        category: 'plumbing', zone: 'bathroom',
        standardHeight: 2100, minHeight: 2000, maxHeight: 2300,
        reason: 'Above head. Adequate clearance for tallest occupant + 100mm.',
    },
    {
        element: 'Shower Head (Handheld)',
        category: 'plumbing', zone: 'bathroom',
        standardHeight: 1800, minHeight: 1600, maxHeight: 2000,
        reason: 'Adjustable bracket. Standard hook height for average adult.',
    },
    {
        element: 'Toilet Roll Holder',
        category: 'plumbing', zone: 'bathroom',
        standardHeight: 650, minHeight: 600, maxHeight: 750,
        reason: 'Comfortable reach from seated position on WC.',
    },
    {
        element: 'Towel Bar',
        category: 'plumbing', zone: 'bathroom',
        standardHeight: 1200, minHeight: 1100, maxHeight: 1400,
        reason: 'Easy hang and reach. Below mirror typically.',
    },

    // 
    // CARPENTRY  Built-in Heights
    // 

    {
        element: 'Kitchen Countertop',
        category: 'carpentry', zone: 'kitchen',
        standardHeight: 900, minHeight: 850, maxHeight: 950,
        reason: 'Standard ergonomic cooking height. Elbow height minus 100-150mm.',
        accessibility: 'For wheelchair: 800mm max with knee clearance below.',
    },
    {
        element: 'Kitchen Wall Cabinet (Bottom)',
        category: 'carpentry', zone: 'kitchen',
        standardHeight: 1500, minHeight: 1400, maxHeight: 1600,
        reason: '600mm above countertop. Clears head when working at counter.',
    },
    {
        element: 'Kitchen Wall Cabinet (Top)',
        category: 'carpentry', zone: 'kitchen',
        standardHeight: 2100, minHeight: 2000, maxHeight: 2400,
        reason: 'Top shelf reachable without step stool for average adult (1650mm).',
    },
    {
        element: 'Wardrobe Hanging Rod (Main)',
        category: 'carpentry', zone: 'bedroom',
        standardHeight: 1700, minHeight: 1600, maxHeight: 1800,
        reason: 'Long dresses need 1500mm clearance from rod to floor.',
    },
    {
        element: 'Wardrobe Hanging Rod (Double)',
        category: 'carpentry', zone: 'bedroom',
        standardHeight: 1200, minHeight: 1100, maxHeight: 1300,
        reason: 'Upper rod at 1200mm for shirts. Lower rod at 600mm for pants.',
    },
    {
        element: 'Bathroom Vanity',
        category: 'carpentry', zone: 'bathroom',
        standardHeight: 850, minHeight: 800, maxHeight: 900,
        reason: 'Comfortable height for face washing. Basin rim at vanity top.',
    },
    {
        element: 'Mirror (Centre)',
        category: 'carpentry', zone: 'bathroom',
        standardHeight: 1500, minHeight: 1400, maxHeight: 1600,
        reason: 'Centre at average eye level. Bottom edge above basin taps.',
    },
    {
        element: 'TV Console',
        category: 'carpentry', zone: 'living',
        standardHeight: 500, minHeight: 400, maxHeight: 600,
        reason: 'TV centre at 1200mm (seated eye level). Console stores AV equipment.',
    },
    {
        element: 'Study Desk',
        category: 'carpentry', zone: 'study',
        standardHeight: 750, minHeight: 720, maxHeight: 780,
        reason: 'Standard desk height for typing. Forearms parallel to floor.',
        accessibility: 'Adjustable desks: 600-1200mm range recommended.',
    },
    {
        element: 'Shoe Cabinet',
        category: 'carpentry', zone: 'all',
        standardHeight: 900, minHeight: 800, maxHeight: 1200,
        reason: 'Waist height for comfortable access. Can go taller if pull-down type.',
    },
];

// ============================================================
// VALIDATION HELPERS
// ============================================================

/** Validate element height against ergonomic standards */
export function validateHeight(
    element: string,
    zone: string,
    heightFromFloor: number,
): { valid: boolean; standard?: HeightStandard; warning?: string } {
    // Find matching standard
    const standards = ERGONOMIC_STANDARDS.filter(s =>
        s.element.toLowerCase().includes(element.toLowerCase()) &&
        (s.zone === zone || s.zone === 'all')
    );

    if (standards.length === 0) {
        return { valid: true }; // No standard to check against
    }

    const standard = standards[0]; // Best match

    if (heightFromFloor < standard.minHeight) {
        return {
            valid: false,
            standard,
            warning: `️ ${element} at ${heightFromFloor}mm is too low. Standard: ${standard.standardHeight}mm (min ${standard.minHeight}mm). ${standard.reason}`,
        };
    }

    if (heightFromFloor > standard.maxHeight) {
        return {
            valid: false,
            standard,
            warning: `️ ${element} at ${heightFromFloor}mm is too high. Standard: ${standard.standardHeight}mm (max ${standard.maxHeight}mm). ${standard.reason}`,
        };
    }

    return { valid: true, standard };
}

/** Get all standards for a zone */
export function getStandardsForZone(zone: string): HeightStandard[] {
    return ERGONOMIC_STANDARDS.filter(s => s.zone === zone || s.zone === 'all');
}

/** Get standard height for a specific element */
export function getStandardHeight(element: string, zone: string): number | undefined {
    const match = ERGONOMIC_STANDARDS.find(s =>
        s.element.toLowerCase().includes(element.toLowerCase()) &&
        (s.zone === zone || s.zone === 'all')
    );
    return match?.standardHeight;
}
