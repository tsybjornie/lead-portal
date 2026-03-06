/**
 * Defect & Rectification Tracking
 * 
 * When a defect is found (by client, designer, or inspector),
 * it's logged with evidence and assigned to the responsible vendor.
 * Rectification is tracked until sign-off.
 * 
 * Lives in: Inspect (defect detection) + Roof (rectification management)
 */

import { TradeCategory } from './trades';

// ============================================================
// DEFECT
// ============================================================

export type DefectSeverity = 'cosmetic' | 'minor' | 'major' | 'critical';
export type DefectStatus = 'reported' | 'acknowledged' | 'in_progress' | 'rectified' | 'verified' | 'disputed';

export interface Defect {
    id: string;
    projectId: string;
    zone: string;
    trade: TradeCategory;

    // What's wrong
    title: string;
    description: string;
    severity: DefectSeverity;
    photos: string[];                // Evidence photos (fingerprinted)

    // Against which spec
    elevationId?: string;            // Links to original elevation
    elementId?: string;              // Specific element that's defective
    expectedSpec?: string;           // "Formica FY-8843 Walnut Bliss"
    actualResult?: string;           // "Wrong laminate used  looks like FY-7721"

    // Attribution
    reportedBy: string;              // WHO found it
    reportedByRole: 'client' | 'designer' | 'inspector' | 'vendor';
    reportedAt: string;
    attributedTo: 'designer' | 'vendor' | 'site_condition';
    vendorId?: string;
    vendorName?: string;

    // Rectification
    status: DefectStatus;
    rectification?: Rectification;

    // Deadline
    rectifyByDate?: string;          // When it must be fixed
    isOverdue: boolean;
}

export interface Rectification {
    id: string;
    defectId: string;

    // What was done
    description: string;
    method: string;                  // How it was fixed
    photosAfter: string[];           // Evidence photos of fix

    // Timeline
    startedAt?: string;
    completedAt?: string;
    verifiedAt?: string;

    // Sign-off chain
    vendorConfirmed: boolean;
    designerVerified: boolean;
    clientAccepted: boolean;
    clientAcceptedAt?: string;

    // Cost
    costToVendor: number;            // Does vendor absorb cost? (their fault)
    costToDesigner: number;          // Designer error? They pay.
    costToClient: number;            // Site condition? Client pays.
    notes?: string;
}

// ============================================================
// 360° RATING SYSTEM  Everyone rates everyone
// ============================================================

export type RaterRole = 'client' | 'designer' | 'vendor' | 'inspector';

export interface ProjectRating {
    id: string;
    projectId: string;
    fromRole: RaterRole;
    fromName: string;
    toRole: RaterRole;
    toName: string;
    toId: string;                    // Designer ID or Vendor ID
    trade?: TradeCategory;           // Only for vendor ratings

    // Scores
    overallScore: number;            // 1-5
    categories: RatingCategory[];

    // Free text
    comment?: string;
    privateNote?: string;            // Only visible to admin

    submittedAt: string;
}

export interface RatingCategory {
    name: string;
    score: number;                   // 1-5
    weight: number;                  // Importance
}

// ============================================================
// WHO RATES WHOM  Role-specific questions
// ============================================================

// CLIENT rates DESIGNER
export const CLIENT_RATES_DESIGNER: RatingCategory[] = [
    { name: 'Listened to what I wanted', score: 0, weight: 3 },
    { name: 'Design matched my expectations', score: 0, weight: 3 },
    { name: 'Communication was clear and timely', score: 0, weight: 2 },
    { name: 'Stayed within budget', score: 0, weight: 3 },
    { name: 'Would recommend to friends', score: 0, weight: 2 },
];

// CLIENT rates VENDOR (per trade)
export const CLIENT_RATES_VENDOR: RatingCategory[] = [
    { name: 'Work looks clean and professional', score: 0, weight: 3 },
    { name: 'Workers were respectful and tidy', score: 0, weight: 2 },
    { name: 'Completed on time', score: 0, weight: 2 },
    { name: 'No damage to existing areas', score: 0, weight: 3 },
];

// DESIGNER rates VENDOR (per trade  professional assessment)
export const DESIGNER_RATES_VENDOR: RatingCategory[] = [
    { name: 'Workmanship matches spec quality', score: 0, weight: 3 },
    { name: 'Followed elevation drawings accurately', score: 0, weight: 3 },
    { name: 'Used correct materials (no substitutions)', score: 0, weight: 3 },
    { name: 'Finished within agreed timeline', score: 0, weight: 2 },
    { name: 'Easy to coordinate with', score: 0, weight: 1 },
    { name: 'Site left clean after work', score: 0, weight: 1 },
];

// VENDOR rates DESIGNER (tradesman perspective  this is the gold)
export const VENDOR_RATES_DESIGNER: RatingCategory[] = [
    { name: 'Drawings were clear and complete', score: 0, weight: 3 },
    { name: 'Dimensions were accurate (no rework needed)', score: 0, weight: 3 },
    { name: 'Material specs were specific (no guessing)', score: 0, weight: 3 },
    { name: 'Responded quickly to site queries', score: 0, weight: 2 },
    { name: 'Realistic timeline given', score: 0, weight: 2 },
    { name: 'Coordination with other trades was organised', score: 0, weight: 2 },
];

// VENDOR rates VENDOR (inter-trade coordination)
export const VENDOR_RATES_VENDOR: RatingCategory[] = [
    { name: 'Left site in good condition for my work', score: 0, weight: 3 },
    { name: 'Their work didn\'t affect mine', score: 0, weight: 2 },
    { name: 'Good coordination on timing', score: 0, weight: 2 },
];

// ============================================================
// VENDOR INVITATION  Job invite via WhatsApp link
// ============================================================

export type InvitationStatus = 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';

export interface VendorInvitation {
    id: string;
    projectId: string;
    trade: TradeCategory;
    vendorId: string;
    vendorName: string;
    vendorPhone: string;             // WhatsApp number

    // What they're being invited for
    scope: string;                   // Brief description
    elevationPackId?: string;        // Link to full trade elevation pack
    estimatedValue: number;          // How much the job is worth
    startDate?: string;
    endDate?: string;

    // Link
    inviteLink: string;              // e.g. "/vendor/invite/abc123"
    inviteCode: string;              // Short code for the vendor
    whatsappSent: boolean;
    whatsappSentAt?: string;

    // Status
    status: InvitationStatus;
    viewedAt?: string;
    respondedAt?: string;
    declineReason?: string;

    // Designer who invited
    invitedBy: string;
    invitedAt: string;
}

// ============================================================
// HELPERS
// ============================================================

/** Generate a WhatsApp message with vendor invitation link */
export function generateWhatsAppInvite(invitation: VendorInvitation, baseUrl: string): string {
    const link = `${baseUrl}${invitation.inviteLink}`;
    const msg = encodeURIComponent(
        `Hi ${invitation.vendorName},\n\n` +
        `You've been invited for a ${invitation.trade} job.\n\n` +
        ` Scope: ${invitation.scope}\n` +
        ` Est. Value: $${invitation.estimatedValue.toLocaleString()}\n` +
        ` Start: ${invitation.startDate || 'TBC'}\n\n` +
        `View full details & accept:\n${link}\n\n` +
        `Code: ${invitation.inviteCode}\n\n` +
        ` Sent via Ordinance Systems`
    );
    return `https://wa.me/${invitation.vendorPhone.replace(/[^0-9]/g, '')}?text=${msg}`;
}

/** Generate invite code */
export function generateInviteCode(): string {
    return `OS-${Date.now().toString(36).toUpperCase().slice(-4)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/** Create a vendor invitation */
export function createVendorInvitation(
    projectId: string,
    trade: TradeCategory,
    vendorId: string,
    vendorName: string,
    vendorPhone: string,
    scope: string,
    estimatedValue: number,
    invitedBy: string,
): VendorInvitation {
    const inviteCode = generateInviteCode();
    return {
        id: `inv_${Date.now()}`,
        projectId,
        trade,
        vendorId,
        vendorName,
        vendorPhone,
        scope,
        estimatedValue,
        inviteLink: `/vendor/invite/${inviteCode.toLowerCase()}`,
        inviteCode,
        whatsappSent: false,
        status: 'sent',
        invitedBy,
        invitedAt: new Date().toISOString(),
    };
}

/** Severity to deadline mapping (business days) */
export const RECTIFICATION_DEADLINES: Record<DefectSeverity, number> = {
    cosmetic: 14,    // 14 days
    minor: 7,        // 7 days
    major: 3,        // 3 days
    critical: 1,     // 24 hours
};

/** Create a defect report */
export function createDefect(
    projectId: string,
    zone: string,
    trade: TradeCategory,
    title: string,
    severity: DefectSeverity,
    reportedBy: string,
    reportedByRole: Defect['reportedByRole'],
): Defect {
    const deadlineDays = RECTIFICATION_DEADLINES[severity];
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + deadlineDays);

    return {
        id: `def_${Date.now()}`,
        projectId,
        zone,
        trade,
        title,
        description: '',
        severity,
        photos: [],
        reportedBy,
        reportedByRole,
        reportedAt: new Date().toISOString(),
        attributedTo: 'vendor',
        status: 'reported',
        rectifyByDate: deadline.toISOString(),
        isOverdue: false,
    };
}
