'use client';

import { useState, useMemo } from 'react';
import {
    DesignerQuoteSummary,
    DesignerDashboardStats,
    ProgressClaim,
    ClaimStatus,
} from '@/types/commission';
import { Quote, QuoteStatus } from '@/types/quote';

// ============================================================
// MOCK DATA GENERATOR (Replace with real data from context)
// ============================================================

function generateMockDesignerData(designerId: string): {
    quotes: DesignerQuoteSummary[];
    stats: DesignerDashboardStats;
    claims: ProgressClaim[];
} {
    const quotes: DesignerQuoteSummary[] = [
        {
            quoteId: 'q1',
            quoteNumber: 'QT-SG-2026-001',
            clientName: 'Tan Wei Ming',
            projectName: '322C Tengah Drive',
            status: 'in_progress',
            totalValue: 45000,
            totalMargin: 15750,
            marginPercentage: 35,
            commissionEarned: 1575,
            commissionStatus: 'earned',
            claims: { total: 4, submitted: 2, approved: 1, paid: 1 },
            claimProgress: 20,
            amountBilled: 18000,
            amountPaid: 9000,
            amountOutstanding: 9000,
            createdAt: '2026-01-15',
            acceptedAt: '2026-01-20',
        },
        {
            quoteId: 'q2',
            quoteNumber: 'QT-SG-2026-002',
            clientName: 'Lim Mei Ling',
            projectName: '456 Clementi Ave 3',
            status: 'accepted',
            totalValue: 78000,
            totalMargin: 27300,
            marginPercentage: 35,
            commissionEarned: 2730,
            commissionStatus: 'pending',
            claims: { total: 4, submitted: 1, approved: 0, paid: 0 },
            claimProgress: 0,
            amountBilled: 15600,
            amountPaid: 0,
            amountOutstanding: 15600,
            createdAt: '2026-01-22',
            acceptedAt: '2026-01-25',
        },
        {
            quoteId: 'q3',
            quoteNumber: 'QT-MY-2026-001',
            clientName: 'Ahmad bin Yusof',
            projectName: 'Setia Alam Unit 12-3',
            status: 'completed',
            totalValue: 32000,
            totalMargin: 9600,
            marginPercentage: 30,
            commissionEarned: 1152,
            commissionStatus: 'paid',
            claims: { total: 4, submitted: 4, approved: 4, paid: 4 },
            claimProgress: 100,
            amountBilled: 32000,
            amountPaid: 32000,
            amountOutstanding: 0,
            createdAt: '2025-12-01',
            acceptedAt: '2025-12-05',
        },
    ];

    const stats: DesignerDashboardStats = {
        totalQuotes: 12,
        activeQuotes: 3,
        completedQuotes: 8,
        conversionRate: 0.75,
        totalProjectValue: 425000,
        totalMarginGenerated: 148750,
        averageMargin: 0.35,
        totalCommissionEarned: 14875,
        commissionPending: 4305,
        commissionPaid: 10570,
        totalClaimed: 95000,
        totalPaid: 72000,
        totalOutstanding: 23000,
        byJurisdiction: {
            SG: { value: 320000, margin: 112000, commission: 11200 },
            MY: { value: 105000, margin: 36750, commission: 3675 },
        },
        monthlyTrend: [
            { month: 'Aug', value: 45000, margin: 15750, commission: 1575 },
            { month: 'Sep', value: 62000, margin: 21700, commission: 2170 },
            { month: 'Oct', value: 55000, margin: 19250, commission: 1925 },
            { month: 'Nov', value: 78000, margin: 27300, commission: 2730 },
            { month: 'Dec', value: 85000, margin: 29750, commission: 2975 },
            { month: 'Jan', value: 100000, margin: 35000, commission: 3500 },
        ],
    };

    const claims: ProgressClaim[] = [
        {
            id: 'c1',
            quoteId: 'q1',
            quoteNumber: 'QT-SG-2026-001',
            claimNumber: 'PC-001',
            paymentTermId: 'pt1',
            paymentTermStage: 'Upon Confirmation',
            paymentPercentage: 20,
            baseAmount: 9000,
            adjustments: [],
            totalAmount: 9000,
            variationIds: [],
            variationDelta: 0,
            status: 'paid',
            submittedAt: '2026-01-20',
            approvedAt: '2026-01-21',
            invoicedAt: '2026-01-22',
            invoiceNumber: 'INV-2026-001',
            paidAt: '2026-01-25',
            paymentReference: 'TT-2026-0125',
            createdAt: '2026-01-20',
            updatedAt: '2026-01-25',
        },
        {
            id: 'c2',
            quoteId: 'q1',
            quoteNumber: 'QT-SG-2026-001',
            claimNumber: 'PC-002',
            paymentTermId: 'pt2',
            paymentTermStage: 'Start of Renovation',
            paymentPercentage: 40,
            baseAmount: 18000,
            adjustments: [
                { id: 'adj1', description: 'Retention 5%', amount: -900, type: 'retention' },
            ],
            totalAmount: 17100,
            variationIds: [],
            variationDelta: 0,
            status: 'approved',
            submittedAt: '2026-01-26',
            approvedAt: '2026-01-27',
            createdAt: '2026-01-26',
            updatedAt: '2026-01-27',
        },
    ];

    return { quotes, stats, claims };
}

// ============================================================
// STATUS BADGE COMPONENT
// ============================================================

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        draft: 'bg-gray-100 text-gray-700',
        pending_review: 'bg-yellow-100 text-yellow-800',
        sent: 'bg-blue-100 text-blue-800',
        accepted: 'bg-green-100 text-green-800',
        in_progress: 'bg-purple-100 text-purple-800',
        variation_pending: 'bg-orange-100 text-orange-800',
        completed: 'bg-emerald-100 text-emerald-800',
        cancelled: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
        earned: 'bg-green-100 text-green-800',
        paid: 'bg-emerald-100 text-emerald-800',
    };

    const labels: Record<string, string> = {
        draft: 'Draft',
        pending_review: 'Pending Review',
        sent: 'Sent',
        accepted: 'Accepted',
        in_progress: 'In Progress',
        variation_pending: 'Variation Pending',
        completed: 'Completed',
        cancelled: 'Cancelled',
        pending: 'Pending',
        earned: 'Earned',
        paid: 'Paid',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            {labels[status] || status}
        </span>
    );
}

// ============================================================
// CLAIM STATUS BADGE
// ============================================================

function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
    const styles: Record<ClaimStatus, string> = {
        draft: 'bg-gray-100 text-gray-700',
        submitted: 'bg-blue-100 text-blue-800',
        approved: 'bg-green-100 text-green-800',
        invoiced: 'bg-purple-100 text-purple-800',
        paid: 'bg-emerald-100 text-emerald-800',
        disputed: 'bg-red-100 text-red-800',
        voided: 'bg-gray-300 text-gray-600',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

// ============================================================
// STAT CARD COMPONENT
// ============================================================

function StatCard({
    title,
    value,
    subtitle,
    trend,
    icon
}: {
    title: string;
    value: string;
    subtitle?: string;
    trend?: { value: number; label: string };
    icon?: string;
}) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-bold text-navy-900 mt-1">{value}</p>
                    {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
                </div>
                {icon && <span className="text-2xl">{icon}</span>}
            </div>
            {trend && (
                <div className={`mt-2 text-sm ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.value >= 0 ? '' : ''} {Math.abs(trend.value)}% {trend.label}
                </div>
            )}
        </div>
    );
}

// ============================================================
// PROGRESS BAR COMPONENT
// ============================================================

function ProgressBar({ percentage, label }: { percentage: number; label?: string }) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{label || 'Progress'}</span>
                <span className="font-semibold">{percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// ============================================================
// MAIN DESIGNER DASHBOARD COMPONENT
// ============================================================

interface DesignerDashboardProps {
    designerId: string;
    designerName: string;
}

export default function DesignerCommissionDashboard({
    designerId,
    designerName
}: DesignerDashboardProps) {
    const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
    const [view, setView] = useState<'overview' | 'quotes' | 'claims'>('overview');

    // In production, this would come from QuoteContext
    const { quotes, stats, claims } = useMemo(
        () => generateMockDesignerData(designerId),
        [designerId]
    );

    const selectedQuoteClaims = useMemo(
        () => claims.filter(c => c.quoteId === selectedQuote),
        [claims, selectedQuote]
    );

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-navy-900">Welcome back, {designerName}</h1>
                <p className="text-gray-600">Your commission and claims dashboard</p>
            </div>

            {/* VIEW TABS */}
            <div className="flex gap-2 mb-6">
                {(['overview', 'quotes', 'claims'] as const).map((v) => (
                    <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`px-4 py-2 rounded-lg font-semibold capitalize transition-colors ${view === v
                                ? 'bg-navy-900 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {v}
                    </button>
                ))}
            </div>

            {/* OVERVIEW VIEW */}
            {view === 'overview' && (
                <div className="space-y-6">
                    {/* COMMISSION STATS */}
                    <div>
                        <h2 className="text-lg font-bold text-navy-900 mb-4"> Commission Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Earned"
                                value={formatCurrency(stats.totalCommissionEarned)}
                                icon=""
                            />
                            <StatCard
                                title="Pending"
                                value={formatCurrency(stats.commissionPending)}
                                subtitle="Awaiting project completion"
                                icon=""
                            />
                            <StatCard
                                title="Paid Out"
                                value={formatCurrency(stats.commissionPaid)}
                                icon=""
                            />
                            <StatCard
                                title="This Month"
                                value={formatCurrency(stats.monthlyTrend[5]?.commission || 0)}
                                trend={{ value: 18, label: 'vs last month' }}
                                icon=""
                            />
                        </div>
                    </div>

                    {/* CLAIMS STATS */}
                    <div>
                        <h2 className="text-lg font-bold text-navy-900 mb-4"> Claims Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Billed"
                                value={formatCurrency(stats.totalClaimed)}
                                icon=""
                            />
                            <StatCard
                                title="Collected"
                                value={formatCurrency(stats.totalPaid)}
                                icon=""
                            />
                            <StatCard
                                title="Outstanding"
                                value={formatCurrency(stats.totalOutstanding)}
                                subtitle="Awaiting payment"
                                icon=""
                            />
                            <StatCard
                                title="Collection Rate"
                                value={`${Math.round((stats.totalPaid / stats.totalClaimed) * 100)}%`}
                                icon=""
                            />
                        </div>
                    </div>

                    {/* PERFORMANCE BY JURISDICTION */}
                    <div>
                        <h2 className="text-lg font-bold text-navy-900 mb-4"> By Jurisdiction</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl"></span>
                                    <h3 className="font-bold text-navy-900">Singapore</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-gray-500">Value</p>
                                        <p className="font-bold">{formatCurrency(stats.byJurisdiction.SG.value)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Margin</p>
                                        <p className="font-bold text-green-600">{formatCurrency(stats.byJurisdiction.SG.margin)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Commission</p>
                                        <p className="font-bold text-blue-600">{formatCurrency(stats.byJurisdiction.SG.commission)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl"></span>
                                    <h3 className="font-bold text-navy-900">Malaysia</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-gray-500">Value</p>
                                        <p className="font-bold">{formatCurrency(stats.byJurisdiction.MY.value)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Margin</p>
                                        <p className="font-bold text-green-600">{formatCurrency(stats.byJurisdiction.MY.margin)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Commission</p>
                                        <p className="font-bold text-blue-600">{formatCurrency(stats.byJurisdiction.MY.commission)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MONTHLY TREND */}
                    <div>
                        <h2 className="text-lg font-bold text-navy-900 mb-4"> Monthly Trend</h2>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-end gap-2 h-40">
                                {stats.monthlyTrend.map((month, i) => {
                                    const maxValue = Math.max(...stats.monthlyTrend.map(m => m.value));
                                    const height = (month.value / maxValue) * 100;
                                    return (
                                        <div key={month.month} className="flex-1 flex flex-col items-center">
                                            <div
                                                className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all hover:from-blue-600 hover:to-blue-400"
                                                style={{ height: `${height}%` }}
                                                title={`${month.month}: ${formatCurrency(month.value)}`}
                                            />
                                            <span className="text-xs text-gray-500 mt-2">{month.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* QUOTES VIEW */}
            {view === 'quotes' && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-navy-900">Your Quotes</h2>

                    {quotes.map((quote) => (
                        <div
                            key={quote.quoteId}
                            className={`bg-white border rounded-lg p-4 transition-all cursor-pointer ${selectedQuote === quote.quoteId ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            onClick={() => setSelectedQuote(selectedQuote === quote.quoteId ? null : quote.quoteId)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-navy-900">{quote.quoteNumber}</span>
                                        <StatusBadge status={quote.status} />
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{quote.clientName}</p>
                                    <p className="text-xs text-gray-500">{quote.projectName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{formatCurrency(quote.totalValue)}</p>
                                    <p className="text-sm text-gray-600">Margin: {quote.marginPercentage}%</p>
                                </div>
                            </div>

                            {/* COMMISSION & CLAIMS ROW */}
                            <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Commission</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-green-600">{formatCurrency(quote.commissionEarned)}</span>
                                        <StatusBadge status={quote.commissionStatus} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Billed</p>
                                    <p className="font-semibold">{formatCurrency(quote.amountBilled)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Paid</p>
                                    <p className="font-semibold text-green-600">{formatCurrency(quote.amountPaid)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Outstanding</p>
                                    <p className="font-semibold text-amber-600">{formatCurrency(quote.amountOutstanding)}</p>
                                </div>
                            </div>

                            {/* CLAIM PROGRESS */}
                            <div className="mt-4">
                                <ProgressBar percentage={quote.claimProgress} label="Payment Progress" />
                            </div>

                            {/* EXPANDED CLAIMS DETAIL */}
                            {selectedQuote === quote.quoteId && selectedQuoteClaims.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                    <h4 className="font-semibold text-sm text-gray-700 mb-3">Progress Claims</h4>
                                    <div className="space-y-2">
                                        {selectedQuoteClaims.map((claim) => (
                                            <div
                                                key={claim.id}
                                                className="flex justify-between items-center p-3 bg-gray-50 rounded"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-sm">{claim.claimNumber}</span>
                                                    <span className="text-gray-600">{claim.paymentTermStage}</span>
                                                    <ClaimStatusBadge status={claim.status} />
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">{formatCurrency(claim.totalAmount)}</p>
                                                    <p className="text-xs text-gray-500">{claim.paymentPercentage}%</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* CLAIMS VIEW */}
            {view === 'claims' && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-navy-900">All Progress Claims</h2>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">Claim #</th>
                                    <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">Quote</th>
                                    <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">Stage</th>
                                    <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                                    <th className="text-center p-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                    <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                                    <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {claims.map((claim, i) => (
                                    <tr key={claim.id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                                        <td className="p-3 font-mono">{claim.claimNumber}</td>
                                        <td className="p-3 text-sm text-gray-600">{claim.quoteNumber}</td>
                                        <td className="p-3 text-sm">{claim.paymentTermStage}</td>
                                        <td className="p-3 text-right font-semibold">{formatCurrency(claim.totalAmount)}</td>
                                        <td className="p-3 text-center"><ClaimStatusBadge status={claim.status} /></td>
                                        <td className="p-3 text-sm text-gray-600">{claim.invoiceNumber || ''}</td>
                                        <td className="p-3 text-sm text-gray-600">{claim.paidAt || ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
