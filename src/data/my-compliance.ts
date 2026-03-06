/**
 * Malaysia Compliance Data
 * 
 * CIDB grades, state-by-state PBT/council mapping,
 * professional body registry, and tax rates.
 */

// ============================================================
// EXCHANGE RATE
// ============================================================

export const SGD_TO_MYR = 3.05;
export const MYR_TO_SGD = 1 / SGD_TO_MYR;

// ============================================================
// CIDB GRADES (Construction Industry Development Board)
// ============================================================

export interface CIDBGrade {
    grade: string;
    maxProjectValue: number; // MYR
    minPaidUpCapital: number; // MYR
    description: string;
}

export const CIDB_GRADES: CIDBGrade[] = [
    { grade: 'G1', maxProjectValue: 200_000, minPaidUpCapital: 5_000, description: 'Small renovation, single house' },
    { grade: 'G2', maxProjectValue: 500_000, minPaidUpCapital: 25_000, description: 'Standard residential renovation' },
    { grade: 'G3', maxProjectValue: 1_000_000, minPaidUpCapital: 50_000, description: 'Large renovation, multiple units' },
    { grade: 'G4', maxProjectValue: 3_000_000, minPaidUpCapital: 150_000, description: 'Commercial fit-out' },
    { grade: 'G5', maxProjectValue: 5_000_000, minPaidUpCapital: 250_000, description: 'Large commercial' },
    { grade: 'G6', maxProjectValue: 10_000_000, minPaidUpCapital: 500_000, description: 'Major projects' },
    { grade: 'G7', maxProjectValue: Infinity, minPaidUpCapital: 750_000, description: 'Unlimited  mega projects' },
];

export function getRequiredCIDBGrade(projectValueMYR: number): CIDBGrade {
    return CIDB_GRADES.find(g => projectValueMYR <= g.maxProjectValue) || CIDB_GRADES[CIDB_GRADES.length - 1];
}

export function validateCIDBGrade(contractorGrade: string, projectValueMYR: number): {
    valid: boolean;
    required: string;
    message?: string;
} {
    const required = getRequiredCIDBGrade(projectValueMYR);
    const gradeOrder = CIDB_GRADES.map(g => g.grade);
    const contractorIdx = gradeOrder.indexOf(contractorGrade);
    const requiredIdx = gradeOrder.indexOf(required.grade);

    if (contractorIdx < 0) {
        return { valid: false, required: required.grade, message: `Unknown CIDB grade: ${contractorGrade}` };
    }

    const valid = contractorIdx >= requiredIdx;
    return {
        valid,
        required: required.grade,
        message: valid
            ? undefined
            : `️ Contractor is CIDB ${contractorGrade}. This project (RM${projectValueMYR.toLocaleString()}) requires minimum ${required.grade}. Contractor must upgrade or engage a ${required.grade}+ main contractor.`,
    };
}

// ============================================================
// STATE & LOCAL COUNCIL (PBT) MAPPING
// ============================================================

export interface LocalCouncil {
    id: string;
    name: string;
    state: string;
    permitRequired: boolean;
    heritageZone: boolean;
    processingDays: { min: number; max: number };
    feeMYR: { min: number; max: number };
    workingHours: string;
    notes?: string;
}

export const LOCAL_COUNCILS: LocalCouncil[] = [
    {
        id: 'mbjb', name: 'MBJB (Majlis Bandaraya Johor Bahru)', state: 'Johor',
        permitRequired: true, heritageZone: false,
        processingDays: { min: 7, max: 14 }, feeMYR: { min: 50, max: 200 },
        workingHours: '8am-6pm weekdays',
        notes: 'Close to SG  cross-border labour common',
    },
    {
        id: 'mbpj', name: 'MBPJ (Majlis Bandaraya Petaling Jaya)', state: 'Selangor',
        permitRequired: true, heritageZone: false,
        processingDays: { min: 7, max: 14 }, feeMYR: { min: 50, max: 200 },
        workingHours: '8am-6pm weekdays',
    },
    {
        id: 'mbsa', name: 'MBSA (Majlis Bandaraya Shah Alam)', state: 'Selangor',
        permitRequired: true, heritageZone: false,
        processingDays: { min: 7, max: 14 }, feeMYR: { min: 50, max: 200 },
        workingHours: '8am-6pm weekdays',
    },
    {
        id: 'dbkl', name: 'DBKL (Dewan Bandaraya Kuala Lumpur)', state: 'KL',
        permitRequired: true, heritageZone: false,
        processingDays: { min: 10, max: 21 }, feeMYR: { min: 100, max: 500 },
        workingHours: '8am-6pm weekdays',
    },
    {
        id: 'mbpp', name: 'MBPP (Majlis Bandaraya Pulau Pinang)', state: 'Penang',
        permitRequired: true, heritageZone: true,
        processingDays: { min: 14, max: 30 }, feeMYR: { min: 100, max: 300 },
        workingHours: '8am-6pm weekdays',
        notes: '️ George Town heritage zone  cannot change facade, longer approval',
    },
    {
        id: 'mpsp', name: 'MPSP (Majlis Perbandaran Seberang Perai)', state: 'Penang',
        permitRequired: true, heritageZone: false,
        processingDays: { min: 7, max: 14 }, feeMYR: { min: 50, max: 200 },
        workingHours: '8am-6pm weekdays',
    },
    {
        id: 'mbmb', name: 'MBMB (Majlis Bandaraya Melaka Bersejarah)', state: 'Melaka',
        permitRequired: true, heritageZone: false,
        processingDays: { min: 7, max: 14 }, feeMYR: { min: 50, max: 200 },
        workingHours: '8am-6pm weekdays',
    },
    {
        id: 'dbkk', name: 'DBKK (Dewan Bandaraya Kota Kinabalu)', state: 'Sabah',
        permitRequired: true, heritageZone: false,
        processingDays: { min: 7, max: 21 }, feeMYR: { min: 50, max: 200 },
        workingHours: '8am-6pm weekdays',
    },
    {
        id: 'dbku', name: 'DBKU (Dewan Bandaraya Kuching Utara)', state: 'Sarawak',
        permitRequired: true, heritageZone: false,
        processingDays: { min: 7, max: 21 }, feeMYR: { min: 50, max: 200 },
        workingHours: '8am-6pm weekdays',
    },
    {
        id: 'mbi', name: 'MBI (Majlis Bandaraya Ipoh)', state: 'Perak',
        permitRequired: true, heritageZone: false,
        processingDays: { min: 7, max: 14 }, feeMYR: { min: 50, max: 150 },
        workingHours: '8am-6pm weekdays',
    },
];

export function getCouncilByState(state: string): LocalCouncil[] {
    return LOCAL_COUNCILS.filter(c => c.state.toLowerCase() === state.toLowerCase());
}

// ============================================================
// PROFESSIONAL BODIES
// ============================================================

export interface ProfessionalBody {
    id: string;
    name: string;
    fullName: string;
    requiredFor: string;
    registrationType: string;
}

export const MY_PROFESSIONAL_BODIES: ProfessionalBody[] = [
    { id: 'lam', name: 'LAM', fullName: 'Lembaga Arkitek Malaysia', requiredFor: 'Building plans > 2 storeys, new builds', registrationType: 'Professional Architect (Ar.)' },
    { id: 'bqsm', name: 'BQSM', fullName: 'Board of Quantity Surveyors Malaysia', requiredFor: 'Formal cost estimation (government projects)', registrationType: 'Registered QS' },
    { id: 'iem', name: 'IEM', fullName: 'Institution of Engineers Malaysia', requiredFor: 'Structural modifications', registrationType: 'Professional Engineer (Ir.)' },
    { id: 'st', name: 'ST', fullName: 'Suruhanjaya Tenaga (Energy Commission)', requiredFor: 'All electrical work', registrationType: 'Licensed Wireman' },
    { id: 'span', name: 'SPAN', fullName: 'Suruhanjaya Perkhidmatan Air Negara', requiredFor: 'Water supply modifications', registrationType: 'Licensed Plumber' },
    { id: 'bomba', name: 'JBPM', fullName: 'Jabatan Bomba dan Penyelamat Malaysia', requiredFor: 'Fire system installation', registrationType: 'JBPM-certified' },
];

// ============================================================
// TAX RATES
// ============================================================

export const MY_TAX = {
    sst_service: 0.06,  // 6% Service Tax
    sst_sales: 0.10,    // 10% Sales Tax on materials
    withholding: 0,      // For local contractors
} as const;

export const SG_TAX = {
    gst: 0.09,          // 9% GST
} as const;

/** Calculate MY tax for a renovation project */
export function calculateMYTax(materialCost: number, labourCost: number): {
    salesTax: number;
    serviceTax: number;
    total: number;
} {
    const salesTax = materialCost * MY_TAX.sst_sales;
    const serviceTax = labourCost * MY_TAX.sst_service;
    return { salesTax, serviceTax, total: salesTax + serviceTax };
}

// ============================================================
// CROSS-BORDER CALCULATOR
// ============================================================

export interface CrossBorderCost {
    fabricationCostMYR: number;
    fabricationCostSGD: number;
    shippingSGD: number;
    importGSTSGD: number;
    sgInstallSGD: number;
    bufferSGD: number;
    totalSGD: number;
    savingsVsFullSG: number;
    savingsPercent: number;
}

export function calculateCrossBorder(
    fabricationMYR: number,
    sgEquivalentSGD: number,
    sgInstallSGD: number,
    shippingSGD: number = 800,
    bufferPercent: number = 0.08,
): CrossBorderCost {
    const fabricationSGD = fabricationMYR * MYR_TO_SGD;
    const subtotal = fabricationSGD + shippingSGD + sgInstallSGD;
    const importGST = (fabricationSGD + shippingSGD) * SG_TAX.gst;
    const buffer = subtotal * bufferPercent;
    const total = subtotal + importGST + buffer;
    const savings = sgEquivalentSGD - total;

    return {
        fabricationCostMYR: fabricationMYR,
        fabricationCostSGD: +fabricationSGD.toFixed(2),
        shippingSGD,
        importGSTSGD: +importGST.toFixed(2),
        sgInstallSGD,
        bufferSGD: +buffer.toFixed(2),
        totalSGD: +total.toFixed(2),
        savingsVsFullSG: +savings.toFixed(2),
        savingsPercent: +((savings / sgEquivalentSGD) * 100).toFixed(1),
    };
}
