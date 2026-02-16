/**
 * Prospect to Client Conversion Workflow
 * 
 * FLOW:
 * 1. Designer creates quote for Prospect (just name/contact)
 * 2. Designer sends quote link to Prospect
 * 3. Prospect views quote in Client Portal (no login required)
 * 4. Prospect accepts T&Cs + digitally signs
 * 5. Prospect makes first payment (deposit)
 * 6. System auto-converts Prospect → Client with dashboard access
 */

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type ProspectStatus =
    | 'LEAD'          // Just captured contact info
    | 'QUOTED'        // Quote has been sent
    | 'VIEWED'        // Prospect has viewed the quote
    | 'NEGOTIATING'   // Prospect is asking for changes
    | 'ACCEPTED'      // Accepted quote, pending T&C and payment
    | 'SIGNED'        // Signed T&Cs
    | 'PAID'          // Made first payment → Ready for conversion
    | 'CONVERTED'     // Now a full CLIENT
    | 'REJECTED'      // Declined the quote
    | 'STALE';        // No response after X days

export interface Prospect {
    id: string;
    status: ProspectStatus;

    // Basic info (all we need initially)
    name: string;
    phone?: string;
    email?: string;

    // Captured during initial contact
    projectAddress?: string;
    projectType?: string;
    estimatedBudget?: number;
    notes?: string;
    referralSource?: string; // How did they find us?

    // Tracking
    createdAt: string;
    updatedAt: string;
    lastContactedAt?: string;

    // Quote linkage
    quoteIds: string[]; // Can have multiple quote revisions
    activeQuoteId?: string;

    // Conversion milestones
    quoteViewedAt?: string;
    quoteAcceptedAt?: string;
    tcSignedAt?: string;
    tcSignature?: string; // Base64 signature
    firstPaymentAt?: string;
    firstPaymentAmount?: number;
    firstPaymentReference?: string;

    // After conversion
    convertedToClientId?: string;
    convertedAt?: string;
}

export interface Client {
    id: string;

    // Core info (migrated from Prospect)
    name: string;
    phone: string;
    email: string;

    // Project details
    projectAddress: string;
    projectType: string;

    // Dashboard access
    hasPortalAccess: boolean;
    portalEmail?: string;
    portalPasswordHash?: string; // Would be set during onboarding
    lastPortalLogin?: string;

    // Financial
    totalContractValue: number;
    totalPaid: number;
    totalOutstanding: number;

    // Linkages
    prospectId: string; // Where they came from
    quoteIds: string[];
    activeProjectId?: string;

    // Tracking
    createdAt: string;
    updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════
// CONVERSION LOGIC
// ═══════════════════════════════════════════════════════════════

export function isReadyForConversion(prospect: Prospect): boolean {
    return (
        prospect.status === 'PAID' &&
        !!prospect.quoteAcceptedAt &&
        !!prospect.tcSignedAt &&
        !!prospect.firstPaymentAt
    );
}

export function convertProspectToClient(prospect: Prospect): Client {
    if (!isReadyForConversion(prospect)) {
        throw new Error('Prospect not ready for conversion. Requires: quote accepted, T&C signed, first payment.');
    }

    const clientId = `CLI-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const client: Client = {
        id: clientId,
        name: prospect.name,
        phone: prospect.phone || '',
        email: prospect.email || '',
        projectAddress: prospect.projectAddress || '',
        projectType: prospect.projectType || '',
        hasPortalAccess: false, // Will be enabled when they set up password
        totalContractValue: 0, // Will be set from quote
        totalPaid: prospect.firstPaymentAmount || 0,
        totalOutstanding: 0,
        prospectId: prospect.id,
        quoteIds: prospect.quoteIds,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return client;
}

// ═══════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════

const PROSPECTS_KEY = 'paddleduck_prospects';
const CLIENTS_KEY = 'paddleduck_clients';

export function saveProspects(prospects: Prospect[]): boolean {
    if (typeof window === 'undefined') return false;
    try {
        localStorage.setItem(PROSPECTS_KEY, JSON.stringify(prospects));
        return true;
    } catch (e) {
        console.error('[Prospects] Failed to save:', e);
        return false;
    }
}

export function getProspects(): Prospect[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(PROSPECTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

export function saveClients(clients: Client[]): boolean {
    if (typeof window === 'undefined') return false;
    try {
        localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
        return true;
    } catch (e) {
        console.error('[Clients] Failed to save:', e);
        return false;
    }
}

export function getClients(): Client[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(CLIENTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

export function createProspect(name: string, phone?: string, email?: string): Prospect {
    return {
        id: `PRSP-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        status: 'LEAD',
        name,
        phone,
        email,
        quoteIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

export function getProspectsByStatus(status: ProspectStatus): Prospect[] {
    return getProspects().filter(p => p.status === status);
}

export function getActiveProspects(): Prospect[] {
    const activeStatuses: ProspectStatus[] = ['LEAD', 'QUOTED', 'VIEWED', 'NEGOTIATING', 'ACCEPTED', 'SIGNED'];
    return getProspects().filter(p => activeStatuses.includes(p.status));
}

export function getStaleProspects(daysThreshold: number = 14): Prospect[] {
    const threshold = Date.now() - (daysThreshold * 24 * 60 * 60 * 1000);
    return getProspects().filter(p => {
        const lastActivity = p.lastContactedAt || p.updatedAt;
        return new Date(lastActivity).getTime() < threshold &&
            !['CONVERTED', 'REJECTED', 'STALE'].includes(p.status);
    });
}
