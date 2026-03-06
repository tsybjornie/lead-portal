/**
 * Budget Tracker & AI Remedies
 * 
 * Tracks client budget vs quote total, calculates overrun,
 * and auto-suggests downgrades and removals to bring quote within budget.
 */

import { COMPONENT_LIBRARY, getAlternatives } from '@/data/component-library';
import { ComponentLibraryItem } from '@/types/component-classifications';

// ============================================================
// BUDGET TRACKING
// ============================================================

export type BudgetStatus = 'under' | 'on_target' | 'over_10' | 'over_25' | 'over_50' | 'unrealistic';

export interface BudgetAnalysis {
    clientBudget: number;
    quoteTotal: number;
    difference: number;          // positive = over budget, negative = under
    percentOver: number;
    status: BudgetStatus;
    statusLabel: string;
    statusEmoji: string;
    remedies: BudgetRemedy[];
}

export interface BudgetRemedy {
    id: string;
    type: 'downgrade' | 'remove' | 'defer' | 'split_phase' | 'alternative_vendor';
    description: string;
    currentItem: string;
    suggestedItem?: string;
    savingsAmount: number;
    impact: 'low' | 'medium' | 'high';   // impact on design/quality
    impactNote: string;
}

// ============================================================
// BUDGET ANALYSIS
// ============================================================

export function analyzeBudget(clientBudget: number, quoteTotal: number): BudgetAnalysis {
    const difference = quoteTotal - clientBudget;
    const percentOver = clientBudget > 0 ? (difference / clientBudget) * 100 : 0;

    let status: BudgetStatus;
    let statusLabel: string;
    let statusEmoji: string;

    if (percentOver <= -5) {
        status = 'under';
        statusLabel = `Under budget by ${Math.abs(percentOver).toFixed(0)}%`;
        statusEmoji = '';
    } else if (percentOver <= 5) {
        status = 'on_target';
        statusLabel = 'Within budget range (±5%)';
        statusEmoji = '';
    } else if (percentOver <= 10) {
        status = 'over_10';
        statusLabel = `Over budget by ${percentOver.toFixed(0)}%  minor adjustments needed`;
        statusEmoji = '️';
    } else if (percentOver <= 25) {
        status = 'over_25';
        statusLabel = `Over budget by ${percentOver.toFixed(0)}%  need to discuss priorities`;
        statusEmoji = '';
    } else if (percentOver <= 50) {
        status = 'over_50';
        statusLabel = `Over budget by ${percentOver.toFixed(0)}%  scope reduction required`;
        statusEmoji = '';
    } else {
        status = 'unrealistic';
        statusLabel = `Budget vs scope mismatch (${percentOver.toFixed(0)}% over)  client needs education`;
        statusEmoji = '';
    }

    return {
        clientBudget,
        quoteTotal,
        difference,
        percentOver: +percentOver.toFixed(1),
        status,
        statusLabel,
        statusEmoji,
        remedies: [], // populated by generateRemedies()
    };
}

// ============================================================
// REMEDY GENERATOR
// ============================================================

export interface QuoteLineForBudget {
    id: string;
    description: string;
    componentId?: string;    // links to COMPONENT_LIBRARY
    category: string;
    sellingPrice: number;
    tier?: string;
    isEssential: boolean;    // can't remove (e.g., waterproofing, permit)
}

/** Essential categories that CANNOT be removed */
const ESSENTIAL_CATEGORIES = [
    'waterproofing', 'preliminaries', 'design_submissions', 'cleaning',
];

/** Categories that can be deferred to phase 2 */
const DEFERRABLE_CATEGORIES = [
    'feature_wall', 'display_cabinet', 'smart_home', 'feature_door',
    'curtains', 'decor', 'landscaping',
];

export function generateRemedies(
    lines: QuoteLineForBudget[],
    targetSavings: number,
): BudgetRemedy[] {
    const remedies: BudgetRemedy[] = [];
    let runningTotal = 0;

    // STRATEGY 1: Downgrade premium  standard  budget
    for (const line of lines) {
        if (runningTotal >= targetSavings) break;
        if (!line.componentId) continue;

        const component = COMPONENT_LIBRARY.find(c => c.id === line.componentId);
        if (!component) continue;

        // Find cheaper alternative
        if (component.alternativeIds?.length) {
            const alternatives = getAlternatives(component.id);
            const cheaper = alternatives
                .filter(a =>
                    (a.materialCost.sgd + a.labourCost.sgd) <
                    (component.materialCost.sgd + component.labourCost.sgd)
                )
                .sort((a, b) =>
                    (a.materialCost.sgd + a.labourCost.sgd) -
                    (b.materialCost.sgd + b.labourCost.sgd)
                );

            if (cheaper.length > 0) {
                const best = cheaper[0];
                const savings = line.sellingPrice * 0.3; // rough estimate
                remedies.push({
                    id: `remedy-dg-${line.id}`,
                    type: 'downgrade',
                    description: `Downgrade ${component.name}  ${best.name}`,
                    currentItem: component.name,
                    suggestedItem: best.name,
                    savingsAmount: +savings.toFixed(2),
                    impact: 'low',
                    impactNote: `${best.tier} tier instead of ${component.tier}. Functional, just different finish.`,
                });
                runningTotal += savings;
            }
        }
    }

    // STRATEGY 2: Defer non-essential items to phase 2
    for (const line of lines) {
        if (runningTotal >= targetSavings) break;
        if (ESSENTIAL_CATEGORIES.includes(line.category)) continue;

        const isDeferrable = DEFERRABLE_CATEGORIES.some(dc =>
            line.category.includes(dc) || line.description.toLowerCase().includes(dc)
        );

        if (isDeferrable) {
            remedies.push({
                id: `remedy-defer-${line.id}`,
                type: 'defer',
                description: `Defer "${line.description}" to Phase 2`,
                currentItem: line.description,
                savingsAmount: line.sellingPrice,
                impact: 'medium',
                impactNote: 'Can be added after move-in. No structural dependency.',
            });
            runningTotal += line.sellingPrice;
        }
    }

    // STRATEGY 3: Remove non-essential nice-to-haves
    for (const line of lines) {
        if (runningTotal >= targetSavings) break;
        if (line.isEssential) continue;
        if (ESSENTIAL_CATEGORIES.includes(line.category)) continue;

        // Only suggest removing low-priority items
        const isNiceToHave = ['display_cabinet', 'feature_wall', 'window_bench', 'vanity']
            .some(kw => line.description.toLowerCase().includes(kw));

        if (isNiceToHave) {
            remedies.push({
                id: `remedy-rm-${line.id}`,
                type: 'remove',
                description: `Remove "${line.description}"`,
                currentItem: line.description,
                savingsAmount: line.sellingPrice,
                impact: 'high',
                impactNote: 'This item will not be included. Can add via Variation Order later.',
            });
            runningTotal += line.sellingPrice;
        }
    }

    return remedies;
}

/** Generate a summary message for the client */
export function getBudgetMessage(analysis: BudgetAnalysis): string {
    const { status, clientBudget, quoteTotal, percentOver } = analysis;
    const fmt = (n: number) => `S$${n.toLocaleString()}`;

    switch (status) {
        case 'under':
            return `Great news  this design fits within your budget of ${fmt(clientBudget)}. Quote total: ${fmt(quoteTotal)}. You have ${fmt(Math.abs(analysis.difference))} remaining for contingency or upgrades.`;
        case 'on_target':
            return `This design is right on target with your budget of ${fmt(clientBudget)}. Quote total: ${fmt(quoteTotal)}.`;
        case 'over_10':
            return `The current design is ${percentOver}% over your budget (${fmt(quoteTotal)} vs ${fmt(clientBudget)}). We can make a few minor adjustments to bring it in line. See suggestions below.`;
        case 'over_25':
            return `The design exceeds your budget by ${percentOver}% (${fmt(quoteTotal)} vs ${fmt(clientBudget)}). Let's discuss which areas to prioritize and where we can find savings.`;
        case 'over_50':
            return `There's a significant gap between the design and budget (${percentOver}% over). We need to re-scope  either reduce the renovation areas or simplify finishes significantly.`;
        case 'unrealistic':
            return `The current scope requires ${fmt(quoteTotal)} but the budget is ${fmt(clientBudget)} (${percentOver}% gap). To be transparent  this budget cannot achieve the discussed scope. Let's reset expectations and focus on the highest-priority areas.`;
        default:
            return '';
    }
}
