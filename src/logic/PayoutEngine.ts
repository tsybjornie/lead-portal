/**
 * PayoutEngine.ts
 * 
 * Logic for staggered deposit releases (10/40/50),
 * forfeiture recycling, and rescue bonuses.
 */

import { PurchaseOrder } from '../types/roof-ledger';

export const PAYOUT_CONFIG = {
    PREP_FEE_PCT: 0.10,        // 10% on PO Signature
    MOBILIZATION_PCT: 0.40,    // 40% on Photo Verification
    COMPLETION_PCT: 0.50       // 50% on Inspection
};

/**
 * Calculates the staggered payout schedule for a PO
 */
export function calculateStaggeredPayout(total: number) {
    return {
        prepFee: Math.round(total * PAYOUT_CONFIG.PREP_FEE_PCT),
        mobilizationDeposit: Math.round(total * PAYOUT_CONFIG.MOBILIZATION_PCT),
        completionBalance: Math.round(total * PAYOUT_CONFIG.COMPLETION_PCT)
    };
}

/**
 * Handles the "Rescind & Forfeit" logic
 * Returns the amount to be recycled into the project's Rescue Pool.
 */
export function recycleForfeitedDeposit(po: PurchaseOrder): number {
    if (po.status !== 'rescinded') return 0;

    // The prep fee (10%) is already paid and lost by the ID/Platform.
    // The 40% Mobilization deposit was LOCKED and is now reclaimed.
    // We can use a portion of the reclaimed 40% or the "lost" 10% 
    // from the platform's perspective to fund the next vendor's bounty.

    return po.payoutSchedule.prepFee; // Standard: Recycle the lost 10% as a bonus
}

/**
 * Determines if a payout is ready for release
 */
export function isPayoutUnlocked(
    stage: 'PREP' | 'MOBILIZATION' | 'COMPLETION',
    po: PurchaseOrder
): boolean {
    if (stage === 'PREP') return po.status !== 'draft';
    if (stage === 'MOBILIZATION') return !!po.mobilizationPhotos?.length;
    if (stage === 'COMPLETION') return po.status === 'inspected';
    return false;
}
