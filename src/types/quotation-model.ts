export enum RenovationPhase {
    HIDDEN = 'HIDDEN', // 隐蔽工程 (Water, Elec, Waterproofing) - High Risk
    HARD = 'HARD',     // 硬装 (Tiling, Carpentry, Windows) - Fixed
    SOFT = 'SOFT',     // 软装 (Curtains, Furniture, Lighting) - Movable
    OTHER = 'OTHER'    // Other / Manual
}

export enum TradeRole {
    // Demolition & Structural
    HACKER = 'Hacker',
    GENERAL_BUILDER = 'General Builder',

    // M&E (Mechanical & Electrical)
    ELECTRICIAN = 'Electrician',
    PLUMBER = 'Plumber',
    AC_TECH = 'AC Technician',

    // Finishes
    // Finishes
    TILE_MASON = 'Tile Mason',
    SKIM_COAT_SPECIALIST = 'Skim Coat Specialist',
    PAINTER = 'Paint Crew',
    POLISHER = 'Polisher',

    // Fabrication
    CARPENTER = 'Cabinet Maker',
    DOOR_SPECIALIST = 'Door Fabricator',
    GLASS_SPECIALIST = 'Glass Fabricator',
    ALUMINIUM_SPECIALIST = 'Aluminium Installer',

    // Professionals
    INTERIOR_DESIGNER = 'Interior Designer',
    PROJECT_MANAGER = 'Project Manager',
    PE = 'Professional Engineer',

    // Generic
    GENERAL_WORKER = 'General Worker',
    CUSTOM = 'Custom Trade'
}

export interface CostFactors {
    wastage: number;      // 0.05 = 5%
    risk: number;         // 0.03 = 3%
    timeline: number;     // 1.0 = Standard, 1.5 = Rush
    margin: number;       // 0.35 = 35%
}

export interface AdvancedLineItem {
    phase: RenovationPhase;
    tradeRole: TradeRole;
    customRoleName?: string; // If tradeRole is CUSTOM

    // Advanced Formula Inputs
    wastage: number;
    risk: number;
    timelineMultiplier: number;

    isManualOverride: boolean; // "Blank Canvas" mode
    manualPrice?: number;
}
