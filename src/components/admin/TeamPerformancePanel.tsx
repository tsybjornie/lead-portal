'use client';

import React, { useState, useMemo } from 'react';
import {
    TeamMemberPerformance,
    TeamPerformanceSnapshot,
    PerformancePeriod,
    RankingCriteria,
    calculateRankings,
    identifyNeedsAttention,
    formatPerformancePeriod,
    getTrendIcon,
    getRankBadge,
} from '@/types/team-performance';
import { Jurisdiction } from '@/types/core';

// ============================================================
// SAMPLE DATA (Replace with API calls)
// ============================================================

const SAMPLE_MEMBERS: Omit<TeamMemberPerformance, 'rank'>[] = [
    {
        memberId: 'D001',
        name: 'Sarah Chen',
        role: 'senior_designer',
        jurisdiction: 'SG',
        quotesCreated: 12,
        quotesAccepted: 9,
        quotesPending: 2,
        conversionRate: 0.75,
        totalValue: 485000,
        totalMargin: 145500,
        avgMarginPercentage: 0.30,
        commissionEarned: 14550,
        trend: 'up',
        periodChange: { value: 12, margin: 8, conversion: 5 },
    },
    {
        memberId: 'D002',
        name: 'Mike Tan',
        role: 'designer',
        jurisdiction: 'SG',
        quotesCreated: 8,
        quotesAccepted: 5,
        quotesPending: 2,
        conversionRate: 0.625,
        totalValue: 320000,
        totalMargin: 96000,
        avgMarginPercentage: 0.30,
        commissionEarned: 9600,
        trend: 'stable',
        periodChange: { value: 0, margin: -2, conversion: 3 },
    },
    {
        memberId: 'D003',
        name: 'Jenny Lim',
        role: 'designer',
        jurisdiction: 'MY',
        quotesCreated: 15,
        quotesAccepted: 11,
        quotesPending: 3,
        conversionRate: 0.733,
        totalValue: 280000,
        totalMargin: 70000,
        avgMarginPercentage: 0.25,
        commissionEarned: 8400,
        trend: 'up',
        periodChange: { value: 25, margin: 18, conversion: 10 },
    },
    {
        memberId: 'D004',
        name: 'Ahmad Hassan',
        role: 'designer',
        jurisdiction: 'MY',
        quotesCreated: 6,
        quotesAccepted: 2,
        quotesPending: 1,
        conversionRate: 0.333,
        totalValue: 85000,
        totalMargin: 21250,
        avgMarginPercentage: 0.25,
        commissionEarned: 2550,
        trend: 'down',
        periodChange: { value: -15, margin: -20, conversion: -12 },
    },
    {
        memberId: 'D005',
        name: 'Lisa Wong',
        role: 'senior_designer',
        jurisdiction: 'SG',
        quotesCreated: 10,
        quotesAccepted: 8,
        quotesPending: 1,
        conversionRate: 0.80,
        totalValue: 520000,
        totalMargin: 166400,
        avgMarginPercentage: 0.32,
        commissionEarned: 16640,
        trend: 'up',
        periodChange: { value: 8, margin: 10, conversion: 2 },
    },
    {
        memberId: 'D006',
        name: 'David Lee',
        role: 'intern',
        jurisdiction: 'SG',
        quotesCreated: 3,
        quotesAccepted: 1,
        quotesPending: 1,
        conversionRate: 0.333,
        totalValue: 45000,
        totalMargin: 13500,
        avgMarginPercentage: 0.30,
        commissionEarned: 1350,
        trend: 'stable',
        periodChange: { value: 0, margin: 0, conversion: 0 },
    },
];

// ============================================================
// COMPONENT
// ============================================================

export default function TeamPerformancePanel() {
    const [period, setPeriod] = useState<PerformancePeriod>('this_month');
    const [sortBy, setSortBy] = useState<RankingCriteria>('value');
    const [showJurisdiction, setShowJurisdiction] = useState<'all' | Jurisdiction>('all');

    // Calculate rankings
    const rankedMembers = useMemo(() => {
        let filtered = SAMPLE_MEMBERS;
        if (showJurisdiction !== 'all') {
            filtered = filtered.filter(m => m.jurisdiction === showJurisdiction);
        }
        return calculateRankings(filtered, sortBy);
    }, [sortBy, showJurisdiction]);

    const needsAttention = useMemo(
        () => identifyNeedsAttention(rankedMembers, 2),
        [rankedMembers]
    );

    // Team totals
    const totals = useMemo(() => ({
        totalValue: rankedMembers.reduce((s, m) => s + m.totalValue, 0),
        totalMargin: rankedMembers.reduce((s, m) => s + m.totalMargin, 0),
        avgConversion: rankedMembers.length > 0
            ? rankedMembers.reduce((s, m) => s + m.conversionRate, 0) / rankedMembers.length
            : 0,
        totalCommission: rankedMembers.reduce((s, m) => s + m.commissionEarned, 0),
    }), [rankedMembers]);

    const formatCurrency = (value: number) =>
        `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

    const formatPercent = (value: number) =>
        `${(value * 100).toFixed(1)}%`;

    const getChangeColor = (change: number) =>
        change > 0 ? 'text-green-600' : change < 0 ? 'text-red-500' : 'text-gray-400';

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'senior_designer': return 'Senior';
            case 'designer': return 'Designer';
            case 'manager': return 'Manager';
            case 'intern': return 'Intern';
            default: return role;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Team Performance</h2>
                    <p className="text-sm text-gray-500">{rankedMembers.length} team members • {formatPerformancePeriod(period)}</p>
                </div>
                <div className="flex gap-3">
                    {/* Period Selector */}
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as PerformancePeriod)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium bg-white"
                    >
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                        <option value="quarter">Quarter</option>
                        <option value="year">Year</option>
                        <option value="all_time">All Time</option>
                    </select>

                    {/* Market Filter */}
                    <select
                        value={showJurisdiction}
                        onChange={(e) => setShowJurisdiction(e.target.value as 'all' | Jurisdiction)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium bg-white"
                    >
                        <option value="all">All Markets</option>
                        <option value="SG">🇸🇬 Singapore</option>
                        <option value="MY">🇲🇾 Malaysia</option>
                    </select>
                </div>
            </div>

            {/* Summary Stats Bar */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Total Value</div>
                    <div className="text-xl font-bold text-gray-900">{formatCurrency(totals.totalValue)}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Total Margin</div>
                    <div className="text-xl font-bold text-green-600">{formatCurrency(totals.totalMargin)}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Avg Conversion</div>
                    <div className="text-xl font-bold text-blue-600">{formatPercent(totals.avgConversion)}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Total Commission</div>
                    <div className="text-xl font-bold text-purple-600">{formatCurrency(totals.totalCommission)}</div>
                </div>
            </div>

            {/* Needs Attention Alert */}
            {needsAttention.length > 0 && (
                <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-800 font-medium text-sm">
                        <span>⚠️</span>
                        <span>Needs Attention</span>
                    </div>
                    <div className="text-sm text-amber-700 mt-1">
                        {needsAttention.map(m => m.name).join(', ')} —
                        {needsAttention.some(m => m.trend === 'down')
                            ? ' declining performance or low conversion'
                            : ' bottom rankings this period'}
                    </div>
                </div>
            )}

            {/* Rankings Table */}
            <div className="px-6 py-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                            <th className="pb-3 w-16">Rank</th>
                            <th className="pb-3">Team Member</th>
                            <th className="pb-3 text-center">Market</th>
                            <th className="pb-3 text-center">Quotes</th>
                            <th
                                className={`pb-3 text-right cursor-pointer hover:text-blue-600 ${sortBy === 'conversion' ? 'text-blue-600 font-bold' : ''}`}
                                onClick={() => setSortBy('conversion')}
                            >
                                Conversion ↕
                            </th>
                            <th
                                className={`pb-3 text-right cursor-pointer hover:text-blue-600 ${sortBy === 'value' ? 'text-blue-600 font-bold' : ''}`}
                                onClick={() => setSortBy('value')}
                            >
                                Value ↕
                            </th>
                            <th
                                className={`pb-3 text-right cursor-pointer hover:text-blue-600 ${sortBy === 'margin' ? 'text-blue-600 font-bold' : ''}`}
                                onClick={() => setSortBy('margin')}
                            >
                                Margin ↕
                            </th>
                            <th
                                className={`pb-3 text-right cursor-pointer hover:text-blue-600 ${sortBy === 'commission' ? 'text-blue-600 font-bold' : ''}`}
                                onClick={() => setSortBy('commission')}
                            >
                                Commission ↕
                            </th>
                            <th className="pb-3 text-center w-20">Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankedMembers.map((member) => {
                            const isNeedsAttention = needsAttention.includes(member);
                            return (
                                <tr
                                    key={member.memberId}
                                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${isNeedsAttention ? 'bg-red-50/50' : ''}`}
                                >
                                    <td className="py-3 text-center text-lg">
                                        {getRankBadge(member.rank)}
                                    </td>
                                    <td className="py-3">
                                        <div className="font-medium text-gray-900">{member.name}</div>
                                        <div className="text-xs text-gray-500">{getRoleLabel(member.role)}</div>
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className="text-lg">{member.jurisdiction === 'SG' ? '🇸🇬' : '🇲🇾'}</span>
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className="font-medium text-gray-900">{member.quotesAccepted}</span>
                                        <span className="text-gray-400">/{member.quotesCreated}</span>
                                    </td>
                                    <td className="py-3 text-right font-medium">
                                        {formatPercent(member.conversionRate)}
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className="font-medium text-gray-900">{formatCurrency(member.totalValue)}</div>
                                        <div className={`text-xs ${getChangeColor(member.periodChange.value)}`}>
                                            {member.periodChange.value > 0 ? '+' : ''}{member.periodChange.value}%
                                        </div>
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className="font-medium text-green-600">{formatCurrency(member.totalMargin)}</div>
                                        <div className="text-xs text-gray-500">{formatPercent(member.avgMarginPercentage)}</div>
                                    </td>
                                    <td className="py-3 text-right font-medium text-purple-600">
                                        {formatCurrency(member.commissionEarned)}
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className={`text-lg ${member.trend === 'up' ? 'text-green-600' :
                                                member.trend === 'down' ? 'text-red-500' :
                                                    'text-gray-400'
                                            }`}>
                                            {getTrendIcon(member.trend)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {rankedMembers.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No team members found for this filter.
                    </div>
                )}
            </div>
        </div>
    );
}
