/**
 * Smart Alerts Engine
 * Provides intelligent warnings and suggestions to designers
 * Non-blocking - just informational indicators
 */

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type AlertCategory = 'MISSING_ITEM' | 'SCOPE_GAP' | 'MARGIN_LOW' | 'BEST_PRACTICE';

export interface SmartAlert {
    id: string;
    severity: AlertSeverity;
    category: AlertCategory;
    title: string;
    message: string;
    suggestedAction?: string;
    relatedItemId?: string;
    dismissable: boolean;
}

interface QuoteLineForAlerts {
    id: string;
    mainCategory: string;
    taskDescription: string;
    sellingRate?: number;
    internalCost?: number;
}

// ═══════════════════════════════════════════════════════════════
// ALERT RULES
// ═══════════════════════════════════════════════════════════════

interface AlertRule {
    id: string;
    name: string;
    check: (lines: QuoteLineForAlerts[]) => SmartAlert | null;
}

const ALERT_RULES: AlertRule[] = [
    // Kitchen alerts
    {
        id: 'kitchen-no-countertop',
        name: 'Kitchen without countertop',
        check: (lines) => {
            const hasKitchenCabinet = lines.some(l =>
                l.mainCategory.toLowerCase().includes('kitchen') &&
                l.taskDescription.toLowerCase().includes('cabinet')
            );
            const hasCountertop = lines.some(l =>
                l.taskDescription.toLowerCase().includes('countertop') ||
                l.taskDescription.toLowerCase().includes('quartz')
            );

            if (hasKitchenCabinet && !hasCountertop) {
                return {
                    id: 'alert-kitchen-no-countertop',
                    severity: 'WARNING',
                    category: 'MISSING_ITEM',
                    title: 'No Countertop',
                    message: 'Kitchen cabinets detected but no countertop. Did you forget to add it?',
                    suggestedAction: 'Add quartz or laminate countertop',
                    dismissable: true
                };
            }
            return null;
        }
    },

    // Bathroom alerts
    {
        id: 'bathroom-no-waterproofing',
        name: 'Bathroom without waterproofing',
        check: (lines) => {
            const hasBathroomTiling = lines.some(l =>
                (l.mainCategory.toLowerCase().includes('bathroom') ||
                    l.mainCategory.toLowerCase().includes('tiling')) &&
                l.taskDescription.toLowerCase().includes('tile')
            );
            const hasWaterproofing = lines.some(l =>
                l.taskDescription.toLowerCase().includes('waterproof')
            );

            if (hasBathroomTiling && !hasWaterproofing) {
                return {
                    id: 'alert-bathroom-no-waterproofing',
                    severity: 'CRITICAL',
                    category: 'SCOPE_GAP',
                    title: 'No Waterproofing',
                    message: 'Bathroom tiling detected but no waterproofing. This is essential!',
                    suggestedAction: 'Add waterproofing membrane (typically $45/sqm)',
                    dismissable: true
                };
            }
            return null;
        }
    },

    // Hacking alerts
    {
        id: 'tiling-no-hacking',
        name: 'New tiles without hacking',
        check: (lines) => {
            const hasTiling = lines.some(l =>
                l.mainCategory.toLowerCase().includes('tiling') ||
                l.taskDescription.toLowerCase().includes('floor tile') ||
                l.taskDescription.toLowerCase().includes('wall tile')
            );
            const hasHacking = lines.some(l =>
                l.taskDescription.toLowerCase().includes('hack')
            );

            if (hasTiling && !hasHacking) {
                return {
                    id: 'alert-tiling-no-hacking',
                    severity: 'INFO',
                    category: 'MISSING_ITEM',
                    title: 'No Hacking?',
                    message: 'Tiling detected but no hacking. Is this overlay or are existing tiles being retained?',
                    suggestedAction: 'Add hacking if replacing existing tiles',
                    dismissable: true
                };
            }
            return null;
        }
    },

    // Electrical alerts
    {
        id: 'full-reno-no-rewiring',
        name: 'Full renovation without rewiring',
        check: (lines) => {
            const itemCount = lines.length;
            const hasRewiring = lines.some(l =>
                l.taskDescription.toLowerCase().includes('rewir') ||
                l.taskDescription.toLowerCase().includes('full house') && l.mainCategory.toLowerCase().includes('electrical')
            );

            // If more than 10 items and no rewiring, might be a full reno
            if (itemCount > 10 && !hasRewiring) {
                return {
                    id: 'alert-full-reno-no-rewiring',
                    severity: 'INFO',
                    category: 'BEST_PRACTICE',
                    title: 'Consider Rewiring',
                    message: 'Large scope detected. Consider full electrical rewiring for older properties.',
                    suggestedAction: 'Check property age - rewiring recommended for 15+ year old properties',
                    dismissable: true
                };
            }
            return null;
        }
    },

    // Carpentry alerts
    {
        id: 'wardrobe-no-soft-close',
        name: 'Wardrobe without soft-close',
        check: (lines) => {
            const hasWardrobe = lines.some(l =>
                l.taskDescription.toLowerCase().includes('wardrobe')
            );
            const hasSoftClose = lines.some(l =>
                l.taskDescription.toLowerCase().includes('soft-close') ||
                l.taskDescription.toLowerCase().includes('soft close')
            );

            if (hasWardrobe && !hasSoftClose) {
                return {
                    id: 'alert-wardrobe-no-soft-close',
                    severity: 'INFO',
                    category: 'BEST_PRACTICE',
                    title: 'Soft-close not specified',
                    message: 'Wardrobe detected. Confirm if soft-close hinges are included in vendor quote.',
                    dismissable: true
                };
            }
            return null;
        }
    },

    // Flooring alerts
    {
        id: 'vinyl-no-skirting',
        name: 'Vinyl without skirting',
        check: (lines) => {
            const hasVinyl = lines.some(l =>
                l.taskDescription.toLowerCase().includes('vinyl')
            );
            const hasSkirting = lines.some(l =>
                l.taskDescription.toLowerCase().includes('skirting')
            );

            if (hasVinyl && !hasSkirting) {
                return {
                    id: 'alert-vinyl-no-skirting',
                    severity: 'WARNING',
                    category: 'MISSING_ITEM',
                    title: 'No Skirting',
                    message: 'Vinyl flooring detected but no skirting. Edge gaps will be visible.',
                    suggestedAction: 'Add skirting (typically $12/linear m)',
                    dismissable: true
                };
            }
            return null;
        }
    },
];

// ═══════════════════════════════════════════════════════════════
// MAIN ENGINE
// ═══════════════════════════════════════════════════════════════

export function runSmartAlerts(lines: QuoteLineForAlerts[]): SmartAlert[] {
    const alerts: SmartAlert[] = [];

    for (const rule of ALERT_RULES) {
        const alert = rule.check(lines);
        if (alert) {
            alerts.push(alert);
        }
    }

    return alerts;
}

// ═══════════════════════════════════════════════════════════════
// MARGIN ALERTS
// ═══════════════════════════════════════════════════════════════

export function checkMarginAlerts(
    totalCost: number,
    totalSelling: number,
    marginThreshold: number = 20
): SmartAlert | null {
    if (totalSelling === 0) return null;

    const margin = ((totalSelling - totalCost) / totalSelling) * 100;

    if (margin < 0) {
        return {
            id: 'alert-negative-margin',
            severity: 'CRITICAL',
            category: 'MARGIN_LOW',
            title: 'Negative Margin!',
            message: `You are selling at a loss. Review your pricing.`,
            dismissable: false
        };
    }

    if (margin < marginThreshold) {
        return {
            id: 'alert-low-margin',
            severity: 'WARNING',
            category: 'MARGIN_LOW',
            title: 'Low Margin',
            message: `Margin is ${margin.toFixed(1)}%, below target of ${marginThreshold}%.`,
            suggestedAction: 'Review selling rates or internal costs',
            dismissable: true
        };
    }

    return null;
}

// ═══════════════════════════════════════════════════════════════
// DISMISSED ALERTS TRACKING
// ═══════════════════════════════════════════════════════════════

const DISMISSED_ALERTS_KEY = 'paddleduck_dismissed_alerts';

export function getDismissedAlerts(quoteId: string): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(`${DISMISSED_ALERTS_KEY}_${quoteId}`);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function dismissAlert(quoteId: string, alertId: string): void {
    if (typeof window === 'undefined') return;
    const dismissed = getDismissedAlerts(quoteId);
    if (!dismissed.includes(alertId)) {
        dismissed.push(alertId);
        localStorage.setItem(`${DISMISSED_ALERTS_KEY}_${quoteId}`, JSON.stringify(dismissed));
    }
}

export function filterDismissedAlerts(alerts: SmartAlert[], quoteId: string): SmartAlert[] {
    const dismissed = getDismissedAlerts(quoteId);
    return alerts.filter(a => !dismissed.includes(a.id) || !a.dismissable);
}
