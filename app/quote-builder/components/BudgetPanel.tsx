'use client';

import { useState, useMemo } from 'react';
import { GeneratedTradeSection } from '@/lib/ai/auto-quote';
import {
    optimizeBudget,
    generateBudgetTiers,
    BudgetResult,
    MaterialTier,
} from '@/lib/ai/budget-optimizer';

interface BudgetPanelProps {
    sections: GeneratedTradeSection[];
    onApplyBudget: (optimizedSections: GeneratedTradeSection[]) => void;
}

const formatCurrency = (n: number) =>
    `S$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

const TIER_COLORS: Record<MaterialTier, string> = {
    budget: 'bg-green-50 border-green-200 text-green-700',
    standard: 'bg-blue-50 border-blue-200 text-blue-700',
    premium: 'bg-purple-50 border-purple-200 text-purple-700',
    luxury: 'bg-amber-50 border-amber-200 text-amber-700',
};

const TIER_ICONS: Record<MaterialTier, string> = {
    budget: '💰',
    standard: '⭐',
    premium: '✨',
    luxury: '👑',
};

export default function BudgetPanel({ sections, onApplyBudget }: BudgetPanelProps) {
    const [budgetInput, setBudgetInput] = useState('');
    const [result, setResult] = useState<BudgetResult | null>(null);
    const [showTiers, setShowTiers] = useState(false);

    const currentTotal = useMemo(() =>
        sections.reduce((s, sec) => s + sec.subtotalSelling, 0),
        [sections]
    );

    const tiers = useMemo(() =>
        sections.length > 0 ? generateBudgetTiers(sections) : [],
        [sections]
    );

    const handleOptimize = () => {
        const budget = parseFloat(budgetInput.replace(/[^0-9.]/g, ''));
        if (isNaN(budget) || budget < 1000) return;

        // If input ends with 'k', multiply by 1000
        const finalBudget = budgetInput.toLowerCase().includes('k')
            ? budget * 1000
            : budget;

        const optimized = optimizeBudget(sections, finalBudget);
        setResult(optimized);
    };

    const handleApply = () => {
        if (result) {
            onApplyBudget(result.sections);
            setResult(null);
        }
    };

    if (sections.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            🎯 Budget Optimizer
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Current quote: <span className="font-medium text-gray-700">{formatCurrency(currentTotal)}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setShowTiers(!showTiers)}
                        className="text-xs px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        {showTiers ? 'Hide' : 'Compare'} Tiers
                    </button>
                </div>
            </div>

            {/* Tier comparison */}
            {showTiers && tiers.length > 0 && (
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                        What you get at each tier
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        {tiers.map(t => (
                            <button
                                key={t.tier}
                                onClick={() => {
                                    setBudgetInput(t.total.toFixed(0));
                                    const optimized = optimizeBudget(sections, t.total);
                                    setResult(optimized);
                                }}
                                className={`text-left p-3 rounded-lg border-2 transition-all hover:shadow-md ${TIER_COLORS[t.tier]}`}
                            >
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span>{TIER_ICONS[t.tier]}</span>
                                    <span className="text-xs font-bold uppercase">{t.tier}</span>
                                </div>
                                <div className="text-lg font-bold">{formatCurrency(t.total)}</div>
                                <p className="text-[10px] mt-1 opacity-80 leading-tight">{t.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Budget input */}
            <div className="px-5 py-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">S$</span>
                        <input
                            type="text"
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleOptimize()}
                            placeholder="e.g. 55000 or 55k"
                            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                        />
                    </div>
                    <button
                        onClick={handleOptimize}
                        disabled={!budgetInput}
                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                    >
                        Optimize
                    </button>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className="px-5 pb-5 space-y-4">
                    {/* Summary bar */}
                    <div className={`rounded-lg p-4 ${result.fitsInBudget ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                {result.fitsInBudget ? '✅ Fits within budget' : '⚠️ Close to budget'}
                            </span>
                            <span className="text-sm font-bold">
                                Saved {formatCurrency(result.originalTotal - result.optimizedTotal)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span>Was: <s>{formatCurrency(result.originalTotal)}</s></span>
                            <span>→</span>
                            <span className="font-bold text-lg text-gray-900">{formatCurrency(result.optimizedTotal)}</span>
                            <span className="ml-auto">Budget: {formatCurrency(result.budget)}</span>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${result.fitsInBudget ? 'bg-green-500' : 'bg-amber-500'}`}
                                style={{ width: `${Math.min((result.optimizedTotal / result.budget) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Downgrades */}
                    {result.downgradedItems.length > 0 && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                                Material adjustments
                            </p>
                            <div className="space-y-1.5">
                                {result.downgradedItems.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-700">{d.itemDescription}</span>
                                            <div className="text-gray-400 mt-0.5">
                                                <span className="line-through">{d.fromLabel}</span>
                                                {' → '}
                                                <span className="text-emerald-600 font-medium">{d.toLabel}</span>
                                            </div>
                                        </div>
                                        <span className="text-emerald-600 font-medium ml-2">
                                            −{formatCurrency(d.totalSaved)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Removed items */}
                    {result.removedItems.length > 0 && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                                Optional items removed
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {result.removedItems.map((item, i) => (
                                    <span key={i} className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
                                        ✕ {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Warnings */}
                    {result.warnings.map((w, i) => (
                        <p key={i} className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                            {w}
                        </p>
                    ))}

                    {/* Apply button */}
                    <button
                        onClick={handleApply}
                        className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                        Apply Budget-Optimized Quote
                    </button>
                </div>
            )}
        </div>
    );
}
