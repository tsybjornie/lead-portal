/**
 * Contract Document Types
 * Contracts are always BRANDED (full company details) with T&Cs and signature blocks
 * 
 * FLOW:
 * 1. Quote (can be Anonymous) → Client shopping around
 * 2. Client decides to proceed
 * 3. Designer generates Contract (always Branded) from Quote
 * 4. Client signs Contract digitally
 * 5. System records signature + timestamp
 */

export type ContractStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'SIGNED' | 'COUNTERSIGNED' | 'ACTIVE' | 'COMPLETED' | 'TERMINATED';

export interface DigitalSignature {
    signatureData: string; // Base64 PNG of drawn signature
    signedAt: string; // ISO timestamp
    signerName: string;
    signerEmail?: string;
    signerPhone?: string;
    ipAddress?: string;
    userAgent?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}

export interface ContractDocument {
    id: string;
    status: ContractStatus;

    // Derived from Quote
    quoteId: string;
    quoteVersion: number;

    // Contract-specific
    contractNumber: string; // e.g., "CTR-2024-001"
    contractDate: string;
    commencement: string; // Project start date
    completionTarget: string; // Expected completion

    // Parties (Always shown - never anonymous)
    companyName: string;
    companyAddress: string;
    companyContact: string;
    companyRegistration?: string;
    companyGST?: string;

    clientName: string;
    clientNRIC?: string; // Last 4 digits for verification
    clientAddress: string;
    clientContact: string;

    // Project
    projectName: string;
    projectAddress: string;
    projectType: string;

    // Financial
    contractSum: number;
    gstAmount?: number;
    totalWithGST: number;

    // Payment Schedule
    paymentSchedule: PaymentMilestone[];

    // Terms & Conditions
    termsAndConditions: string;

    // Signatures
    clientSignature?: DigitalSignature;
    companySignature?: DigitalSignature;

    // Witnesses (optional)
    clientWitness?: {
        name: string;
        nric?: string;
        signature?: DigitalSignature;
    };
    companyWitness?: {
        name: string;
        designation: string;
        signature?: DigitalSignature;
    };

    // Timestamps
    createdAt: string;
    updatedAt: string;
    sentAt?: string;
    viewedAt?: string;
    signedAt?: string;
    countersignedAt?: string;
}

export interface PaymentMilestone {
    id: string;
    description: string;
    percentage: number;
    amount: number;
    dueAt: 'SIGNING' | 'COMPLETION' | 'CUSTOM';
    customDueDate?: string;
    status: 'PENDING' | 'DUE' | 'PAID' | 'OVERDUE';
    paidAt?: string;
    paymentReference?: string;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

export function generateContractNumber(year: number, sequence: number): string {
    return `CTR-${year}-${String(sequence).padStart(4, '0')}`;
}

export function createDefaultPaymentSchedule(contractSum: number): PaymentMilestone[] {
    return [
        {
            id: 'milestone-1',
            description: 'Upon signing of contract',
            percentage: 50,
            amount: contractSum * 0.5,
            dueAt: 'SIGNING',
            status: 'PENDING'
        },
        {
            id: 'milestone-2',
            description: 'Upon completion of works',
            percentage: 40,
            amount: contractSum * 0.4,
            dueAt: 'COMPLETION',
            status: 'PENDING'
        },
        {
            id: 'milestone-3',
            description: 'After defect liability period (30 days)',
            percentage: 10,
            amount: contractSum * 0.1,
            dueAt: 'CUSTOM',
            status: 'PENDING'
        }
    ];
}

export function isContractFullySigned(contract: ContractDocument): boolean {
    return !!contract.clientSignature && !!contract.companySignature;
}

// ═══════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════

const CONTRACTS_KEY = 'paddleduck_contracts';

export function saveContracts(contracts: ContractDocument[]): boolean {
    if (typeof window === 'undefined') return false;
    try {
        localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));
        return true;
    } catch (e) {
        console.error('[Contracts] Failed to save:', e);
        return false;
    }
}

export function getContracts(): ContractDocument[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(CONTRACTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

export function getContractByQuoteId(quoteId: string): ContractDocument | null {
    const contracts = getContracts();
    return contracts.find(c => c.quoteId === quoteId) || null;
}
