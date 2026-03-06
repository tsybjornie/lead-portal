/**
 * Variation Order Types
 * Track changes to scope after initial quote is signed
 */

export type VOType = 'ADDITION' | 'OMISSION' | 'SUBSTITUTION';
export type VOStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'INVOICED';

export interface VariationOrderItem {
    id: string;
    type: VOType;
    category: string;
    description: string;
    unit: string;
    quantity: number;
    rate: number;
    amount: number; // Positive for ADDITION, Negative for OMISSION
    reason: string;
    requestedBy: 'CLIENT' | 'DESIGNER' | 'VENDOR';
    notes?: string;
}

export interface VariationOrder {
    id: string;
    projectId: string;
    quoteId: string; // Reference to original quote
    voNumber: string; // e.g., "VO-001", "VO-002"

    // Metadata
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    status: VOStatus;

    // Items
    items: VariationOrderItem[];

    // Financials
    subtotal: number; // Sum of all item amounts (can be negative for net omission)
    gstAmount?: number;
    total: number;

    // Running Project Total
    originalContractSum: number;
    previousVOsTotal: number;
    thisVOAmount: number;
    revisedContractSum: number;

    // Approval
    clientApprovalDate?: string;
    clientSignature?: string; // Base64 or URL

    // Notes
    notes?: string;
}

// 
// HELPER FUNCTIONS
// 

export function generateVONumber(existingVOs: VariationOrder[]): string {
    const count = existingVOs.length + 1;
    return `VO-${String(count).padStart(3, '0')}`;
}

export function calculateVOTotals(
    items: VariationOrderItem[],
    gstRate?: number
): { subtotal: number; gstAmount: number; total: number } {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const gstAmount = gstRate ? subtotal * (gstRate / 100) : 0;
    const total = subtotal + gstAmount;

    return { subtotal, gstAmount, total };
}

export function calculateRevisedContractSum(
    originalSum: number,
    allVOs: VariationOrder[]
): number {
    const voTotal = allVOs
        .filter(vo => vo.status === 'APPROVED' || vo.status === 'INVOICED')
        .reduce((sum, vo) => sum + vo.total, 0);

    return originalSum + voTotal;
}

export function createVOItem(
    type: VOType,
    category: string,
    description: string,
    unit: string,
    quantity: number,
    rate: number,
    reason: string,
    requestedBy: 'CLIENT' | 'DESIGNER' | 'VENDOR'
): VariationOrderItem {
    const baseAmount = quantity * rate;
    const amount = type === 'OMISSION' ? -Math.abs(baseAmount) : baseAmount;

    return {
        id: `VOI-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        type,
        category,
        description,
        unit,
        quantity,
        rate,
        amount,
        reason,
        requestedBy
    };
}

// 
// STORAGE HELPERS
// 

const VO_STORAGE_KEY = 'Roof_variation_orders';

export function saveVariationOrders(vos: VariationOrder[]): boolean {
    if (typeof window === 'undefined') return false;
    try {
        localStorage.setItem(VO_STORAGE_KEY, JSON.stringify(vos));
        return true;
    } catch (e) {
        console.error('[VO Storage] Failed to save:', e);
        return false;
    }
}

export function getVariationOrders(): VariationOrder[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(VO_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('[VO Storage] Failed to load:', e);
        return [];
    }
}

export function getVOsByProject(projectId: string): VariationOrder[] {
    return getVariationOrders().filter(vo => vo.projectId === projectId);
}
