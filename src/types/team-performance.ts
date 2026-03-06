/**
 * Team Performance Types
 * 
 * Admin-facing types for viewing all team members' sales performance,
 * rankings, and period comparisons.
 */

import { Jurisdiction } from './core';

// ============================================================
// TEAM MEMBER PERFORMANCE
// ============================================================

export type DesignerRole = 'designer' | 'senior_designer' | 'manager' | 'intern';
export type PerformanceTrend = 'up' | 'down' | 'stable';
export type PerformancePeriod = 'this_month' | 'last_month' | 'quarter' | 'year' | 'all_time';

export interface TeamMemberPerformance {
    memberId: string;
    name: string;
    role: DesignerRole;
    avatar?: string;
    jurisdiction: Jurisdiction;

    // Activity Metrics
    quotesCreated: number;
    quotesAccepted: number;
    quotesPending: number;
    conversionRate: number;        // quotesAccepted / quotesCreated

    // Financial Metrics
    totalValue: number;            // Total accepted quote value
    totalMargin: number;           // Total margin generated
    avgMarginPercentage: number;   // Average margin %
    commissionEarned: number;      // Commission earned

    // Ranking
    rank: number;                  // 1 = best
    trend: PerformanceTrend;       // Compared to previous period

    // Period Comparison (% change from previous)
    periodChange: {
        value: number;
        margin: number;
        conversion: number;
    };
}

// ============================================================
// TEAM PERFORMANCE SNAPSHOT
// ============================================================

export interface TeamPerformanceSnapshot {
    period: PerformancePeriod;
    startDate: string;
    endDate: string;

    // Team Aggregates
    totalMembers: number;
    activeMembers: number;         // Members with activity in period

    totalTeamValue: number;
    totalTeamMargin: number;
    avgTeamMarginPercentage: number;
    teamConversionRate: number;
    totalTeamCommission: number;

    // All Members (sorted by rank)
    members: TeamMemberPerformance[];

    // Quick Access
    topPerformers: TeamMemberPerformance[];      // Top 3
    needsAttention: TeamMemberPerformance[];     // Bottom performers or declining
}

// ============================================================
// RANKING LOGIC
// ============================================================

export type RankingCriteria = 'value' | 'margin' | 'conversion' | 'commission';

export interface RankingConfig {
    primaryCriteria: RankingCriteria;
    secondaryCriteria?: RankingCriteria;
    showBottomPerformers: boolean;
    bottomThreshold: number;       // Bottom N members to flag
}

export const DEFAULT_RANKING_CONFIG: RankingConfig = {
    primaryCriteria: 'value',
    secondaryCriteria: 'margin',
    showBottomPerformers: true,
    bottomThreshold: 2,
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function calculateRankings(
    members: Omit<TeamMemberPerformance, 'rank'>[],
    criteria: RankingCriteria = 'value'
): TeamMemberPerformance[] {
    const getValue = (m: Omit<TeamMemberPerformance, 'rank'>): number => {
        switch (criteria) {
            case 'value': return m.totalValue;
            case 'margin': return m.totalMargin;
            case 'conversion': return m.conversionRate;
            case 'commission': return m.commissionEarned;
            default: return m.totalValue;
        }
    };

    const sorted = [...members].sort((a, b) => getValue(b) - getValue(a));

    return sorted.map((member, index) => ({
        ...member,
        rank: index + 1,
    }));
}

export function identifyNeedsAttention(
    members: TeamMemberPerformance[],
    threshold: number = 2
): TeamMemberPerformance[] {
    const needsAttention: TeamMemberPerformance[] = [];

    // Bottom N by rank
    const bottom = members.slice(-threshold);
    needsAttention.push(...bottom);

    // Also flag anyone with declining trend
    const declining = members.filter(
        m => m.trend === 'down' && !bottom.includes(m)
    );
    needsAttention.push(...declining);

    return needsAttention;
}

export function formatPerformancePeriod(period: PerformancePeriod): string {
    switch (period) {
        case 'this_month': return 'This Month';
        case 'last_month': return 'Last Month';
        case 'quarter': return 'This Quarter';
        case 'year': return 'This Year';
        case 'all_time': return 'All Time';
    }
}

export function getTrendIcon(trend: PerformanceTrend): string {
    switch (trend) {
        case 'up': return '';
        case 'down': return '';
        case 'stable': return '';
    }
}

export function getRankBadge(rank: number): string {
    switch (rank) {
        case 1: return '';
        case 2: return '';
        case 3: return '';
        default: return `#${rank}`;
    }
}
