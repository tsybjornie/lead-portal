/**
 * CommitmentTracker.ts
 *
 * Tracks client engagement signals during the "Mating Phase"
 * to help IDs know who's serious vs. who's tire-kicking.
 */

export type CommitmentLevel = 'just_looking' | 'engaged' | 'shortlisted' | 'deciding' | 'committed';

export interface EngagementEvent {
    quoteId: string;
    type: 'QUOTE_VIEWED' | 'SECTION_READ' | 'SHORTLISTED' | 'BUDGET_DECLARED' | 'SITE_VISIT_BOOKED';
    section?: string;
    durationSeconds?: number;
    timestamp: string;
}

/**
 * Determines the commitment level based on accumulated signals.
 * This is what the ID sees as a traffic light badge.
 */
export function calculateCommitmentLevel(signals: {
    viewed: boolean;
    timeSpentSeconds: number;
    budgetDeclared: boolean;
    shortlisted: boolean;
    siteVisitBooked: boolean;
}): CommitmentLevel {
    if (signals.siteVisitBooked) return 'committed';
    if (signals.shortlisted && signals.budgetDeclared) return 'deciding';
    if (signals.shortlisted) return 'shortlisted';
    if (signals.viewed && signals.timeSpentSeconds > 120) return 'engaged';
    return 'just_looking';
}

/**
 * Returns date string 7 days from now (quote expiry)
 */
export function calculateExpiryDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString();
}

/**
 * Returns a human-readable label + color for the ID's dashboard
 */
export function getCommitmentDisplay(level: CommitmentLevel): {
    label: string;
    color: 'red' | 'orange' | 'yellow' | 'green';
    emoji: string;
    description: string;
} {
    switch (level) {
        case 'just_looking':
            return {
                label: 'Just Looking',
                color: 'red',
                emoji: '🔴',
                description: 'Client opened the quote but hasn\'t engaged deeply. Don\'t over-invest yet.'
            };
        case 'engaged':
            return {
                label: 'Engaged',
                color: 'orange',
                emoji: '🟠',
                description: 'Client spent significant time reviewing sections. Follow up recommended.'
            };
        case 'shortlisted':
            return {
                label: 'Shortlisted',
                color: 'yellow',
                emoji: '🟡',
                description: 'Client has shortlisted you. You are being compared against other IDs.'
            };
        case 'deciding':
            return {
                label: 'Deciding',
                color: 'yellow',
                emoji: '🟡',
                description: 'Client declared budget AND shortlisted you. High probability of conversion.'
            };
        case 'committed':
            return {
                label: 'Committed',
                color: 'green',
                emoji: '🟢',
                description: 'Client booked a site visit. Treat this as a hot lead.'
            };
    }
}

/**
 * Generates the "Section Heatmap" — which parts of the quote
 * the client lingered on, sorted by engagement.
 */
export function rankSectionEngagement(
    heatmap: Record<string, number>
): { section: string; seconds: number; interest: 'HIGH' | 'MEDIUM' | 'LOW' }[] {
    return Object.entries(heatmap)
        .sort(([, a], [, b]) => b - a)
        .map(([section, seconds]) => ({
            section,
            seconds,
            interest: seconds > 120 ? 'HIGH' : seconds > 30 ? 'MEDIUM' : 'LOW'
        }));
}
