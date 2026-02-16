/**
 * Quote Context
 * State management for the quote lifecycle
 * Handles: quote CRUD, state transitions, variations, and audit logging
 */

'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
    Quote,
    QuoteLineItem,
    QuoteStatus,
    QuoteAdjustment,
    Variation,
    VariationStatus,
    AuditEntry,
    AuditAction,
    MarginRule,
    DEFAULT_MARGIN_RULES,
    canTransition,
    isTerminalStatus,
    calculateQuoteTotals,
    generateQuoteNumber,
    generateVariationNumber,
} from '@/types/quote';
import { TradeCategory, getMarginFloor } from '@/types/trades';

// ============================================================
// STORAGE KEYS
// ============================================================

const QUOTES_STORAGE_KEY = 'arc-quote-quotes';
const VARIATIONS_STORAGE_KEY = 'arc-quote-variations';
const AUDIT_STORAGE_KEY = 'arc-quote-audit';
const MARGIN_RULES_STORAGE_KEY = 'arc-quote-margin-rules';

// ============================================================
// CONTEXT TYPES
// ============================================================

interface QuoteContextValue {
    // Quotes
    quotes: Quote[];
    activeQuote: Quote | null;

    // Variations
    variations: Variation[];

    // Audit
    auditLog: AuditEntry[];

    // Margin Rules
    marginRules: MarginRule[];

    // Quote Operations
    createQuote: (data: CreateQuoteInput) => Quote;
    updateQuote: (id: string, updates: Partial<Quote>) => void;
    deleteQuote: (id: string) => void;
    setActiveQuote: (id: string | null) => void;
    duplicateQuote: (id: string) => Quote;

    // State Transitions
    transitionQuote: (id: string, newStatus: QuoteStatus, reason?: string) => boolean;

    // Line Items
    addLineItem: (quoteId: string, item: Omit<QuoteLineItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateLineItem: (quoteId: string, itemId: string, updates: Partial<QuoteLineItem>) => void;
    removeLineItem: (quoteId: string, itemId: string) => void;

    // Adjustments
    addAdjustment: (quoteId: string, adjustment: Omit<QuoteAdjustment, 'id' | 'createdAt'>) => void;
    removeAdjustment: (quoteId: string, adjustmentId: string) => void;

    // Variations
    createVariation: (quoteId: string, reason: string) => Variation;
    approveVariation: (variationId: string, approver: string) => void;
    rejectVariation: (variationId: string, reason: string) => void;

    // Kill-Switch / Margin Check
    checkMarginCompliance: (quote: Quote) => MarginCheckResult;
    requestMarginOverride: (quoteId: string, reason: string) => void;
    approveMarginOverride: (quoteId: string, approver: string) => void;

    // Analytics
    getQuotesByStatus: (status: QuoteStatus) => Quote[];
    getQuotesByClient: (clientId: string) => Quote[];
    getMarginAnalytics: () => MarginAnalytics;
}

interface CreateQuoteInput {
    clientId: string;
    clientName: string;
    projectName: string;
    projectAddress: string;
    jurisdiction: 'SG' | 'MY';
    createdBy: string;
    validityDays?: number;
}

interface MarginCheckResult {
    isCompliant: boolean;
    overallMargin: number;
    marginFloor: number;
    violations: MarginViolation[];
    warnings: MarginWarning[];
    requiresOverride: boolean;
}

interface MarginViolation {
    lineItemId?: string;
    category?: TradeCategory;
    currentMargin: number;
    requiredMargin: number;
    message: string;
}

interface MarginWarning {
    lineItemId?: string;
    category?: TradeCategory;
    currentMargin: number;
    targetMargin: number;
    message: string;
}

interface MarginAnalytics {
    averageMargin: number;
    marginByCategory: Record<string, number>;
    marginByJurisdiction: Record<string, number>;
    quotesAboveTarget: number;
    quotesBelowFloor: number;
    totalRevenue: number;
    totalCost: number;
}

// ============================================================
// CONTEXT
// ============================================================

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuoteContext() {
    const context = useContext(QuoteContext);
    if (!context) {
        throw new Error('useQuoteContext must be used within QuoteProvider');
    }
    return context;
}

// ============================================================
// PROVIDER
// ============================================================

interface QuoteProviderProps {
    children: ReactNode;
    currentUserId: string;
    currentUserName: string;
    currentUserRole: 'designer' | 'admin';
}

export function QuoteProvider({
    children,
    currentUserId,
    currentUserName,
    currentUserRole,
}: QuoteProviderProps) {
    // State
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [activeQuote, setActiveQuoteState] = useState<Quote | null>(null);
    const [variations, setVariations] = useState<Variation[]>([]);
    const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
    const [marginRules, setMarginRules] = useState<MarginRule[]>(DEFAULT_MARGIN_RULES);

    // --------------------------------------------------------
    // PERSISTENCE
    // --------------------------------------------------------

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const storedQuotes = localStorage.getItem(QUOTES_STORAGE_KEY);
            const storedVariations = localStorage.getItem(VARIATIONS_STORAGE_KEY);
            const storedAudit = localStorage.getItem(AUDIT_STORAGE_KEY);
            const storedRules = localStorage.getItem(MARGIN_RULES_STORAGE_KEY);

            if (storedQuotes) setQuotes(JSON.parse(storedQuotes));
            if (storedVariations) setVariations(JSON.parse(storedVariations));
            if (storedAudit) setAuditLog(JSON.parse(storedAudit));
            if (storedRules) setMarginRules(JSON.parse(storedRules));
        } catch (error) {
            console.error('Failed to load quote data:', error);
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
    }, [quotes]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(VARIATIONS_STORAGE_KEY, JSON.stringify(variations));
    }, [variations]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(auditLog));
    }, [auditLog]);

    // --------------------------------------------------------
    // AUDIT LOGGING
    // --------------------------------------------------------

    const logAudit = useCallback((
        action: AuditAction,
        quoteId: string,
        description: string,
        options: {
            variationId?: string;
            lineItemId?: string;
            previousValue?: unknown;
            newValue?: unknown;
            isMarginViolation?: boolean;
            requiresReview?: boolean;
        } = {}
    ) => {
        const entry: AuditEntry = {
            id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            action,
            quoteId,
            variationId: options.variationId,
            lineItemId: options.lineItemId,
            actorId: currentUserId,
            actorName: currentUserName,
            actorRole: currentUserRole,
            description,
            previousValue: options.previousValue ? JSON.stringify(options.previousValue) : undefined,
            newValue: options.newValue ? JSON.stringify(options.newValue) : undefined,
            isMarginViolation: options.isMarginViolation ?? false,
            requiresReview: options.requiresReview ?? false,
        };

        setAuditLog(prev => [entry, ...prev].slice(0, 1000)); // Keep last 1000 entries
    }, [currentUserId, currentUserName, currentUserRole]);

    // --------------------------------------------------------
    // QUOTE OPERATIONS
    // --------------------------------------------------------

    const createQuote = useCallback((data: CreateQuoteInput): Quote => {
        const now = new Date().toISOString();
        const validityDays = data.validityDays ?? 30;
        const validUntil = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString();

        const quote: Quote = {
            id: `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            quoteNumber: generateQuoteNumber(data.jurisdiction),
            revision: 1,
            status: 'draft',
            clientId: data.clientId,
            clientName: data.clientName,
            projectName: data.projectName,
            projectAddress: data.projectAddress,
            jurisdiction: data.jurisdiction,
            currency: data.jurisdiction === 'SG' ? 'SGD' : 'MYR',
            totalCost: 0,
            totalPrice: 0,
            totalMargin: 0,
            lineItems: [],
            adjustments: [],
            variationIds: [],
            validUntil,
            createdBy: data.createdBy,
            createdAt: now,
            updatedAt: now,
        };

        setQuotes(prev => [...prev, quote]);
        logAudit('quote_created', quote.id, `Quote ${quote.quoteNumber} created for ${data.clientName}`);

        return quote;
    }, [logAudit]);

    const updateQuote = useCallback((id: string, updates: Partial<Quote>) => {
        setQuotes(prev => prev.map(q => {
            if (q.id !== id) return q;

            const updated = { ...q, ...updates, updatedAt: new Date().toISOString() };

            // Recalculate totals if line items or adjustments changed
            if (updates.lineItems || updates.adjustments) {
                const totals = calculateQuoteTotals(
                    updated.lineItems,
                    updated.adjustments
                );
                updated.totalCost = totals.totalCost;
                updated.totalPrice = totals.totalPrice;
                updated.totalMargin = totals.totalMargin;
            }

            logAudit('quote_updated', id, `Quote updated`);
            return updated;
        }));
    }, [logAudit]);

    const deleteQuote = useCallback((id: string) => {
        setQuotes(prev => prev.filter(q => q.id !== id));
        if (activeQuote?.id === id) {
            setActiveQuoteState(null);
        }
    }, [activeQuote]);

    const setActiveQuote = useCallback((id: string | null) => {
        if (id === null) {
            setActiveQuoteState(null);
        } else {
            const quote = quotes.find(q => q.id === id);
            setActiveQuoteState(quote ?? null);
        }
    }, [quotes]);

    const duplicateQuote = useCallback((id: string): Quote => {
        const original = quotes.find(q => q.id === id);
        if (!original) throw new Error('Quote not found');

        const now = new Date().toISOString();
        const duplicate: Quote = {
            ...original,
            id: `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            quoteNumber: generateQuoteNumber(original.jurisdiction),
            revision: 1,
            status: 'draft',
            variationIds: [],
            createdAt: now,
            updatedAt: now,
            sentAt: undefined,
            acceptedAt: undefined,
            completedAt: undefined,
        };

        setQuotes(prev => [...prev, duplicate]);
        logAudit('quote_created', duplicate.id, `Quote duplicated from ${original.quoteNumber}`);

        return duplicate;
    }, [quotes, logAudit]);

    // --------------------------------------------------------
    // STATE TRANSITIONS
    // --------------------------------------------------------

    const transitionQuote = useCallback((id: string, newStatus: QuoteStatus, reason?: string): boolean => {
        const quote = quotes.find(q => q.id === id);
        if (!quote) return false;

        if (!canTransition(quote.status, newStatus)) {
            console.warn(`Invalid transition: ${quote.status} → ${newStatus}`);
            return false;
        }

        const now = new Date().toISOString();
        const updates: Partial<Quote> = { status: newStatus };

        // Set timestamp based on status
        if (newStatus === 'sent') updates.sentAt = now;
        if (newStatus === 'accepted') updates.acceptedAt = now;
        if (newStatus === 'completed') updates.completedAt = now;

        updateQuote(id, updates);

        // Log the transition
        const actionMap: Record<QuoteStatus, AuditAction> = {
            draft: 'quote_updated',
            pending_review: 'quote_updated',
            sent: 'quote_sent',
            accepted: 'quote_accepted',
            in_progress: 'quote_updated',
            variation_pending: 'quote_updated',
            completed: 'quote_updated',
            cancelled: 'quote_cancelled',
            expired: 'quote_expired',
        };

        logAudit(
            actionMap[newStatus],
            id,
            `Quote transitioned from ${quote.status} to ${newStatus}${reason ? `: ${reason}` : ''}`
        );

        return true;
    }, [quotes, updateQuote, logAudit]);

    // --------------------------------------------------------
    // LINE ITEMS
    // --------------------------------------------------------

    const addLineItem = useCallback((
        quoteId: string,
        item: Omit<QuoteLineItem, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
        const now = new Date().toISOString();
        const lineItem: QuoteLineItem = {
            ...item,
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: now,
            updatedAt: now,
        };

        setQuotes(prev => prev.map(q => {
            if (q.id !== quoteId) return q;

            const updatedItems = [...q.lineItems, lineItem];
            const totals = calculateQuoteTotals(updatedItems, q.adjustments);

            return {
                ...q,
                lineItems: updatedItems,
                totalCost: totals.totalCost,
                totalPrice: totals.totalPrice,
                totalMargin: totals.totalMargin,
                updatedAt: now,
            };
        }));

        logAudit('item_added', quoteId, `Added: ${item.itemName}`, { lineItemId: lineItem.id });
    }, [logAudit]);

    const updateLineItem = useCallback((
        quoteId: string,
        itemId: string,
        updates: Partial<QuoteLineItem>
    ) => {
        const now = new Date().toISOString();

        setQuotes(prev => prev.map(q => {
            if (q.id !== quoteId) return q;

            const updatedItems = q.lineItems.map(item =>
                item.id === itemId
                    ? { ...item, ...updates, updatedAt: now }
                    : item
            );

            const totals = calculateQuoteTotals(updatedItems, q.adjustments);

            return {
                ...q,
                lineItems: updatedItems,
                totalCost: totals.totalCost,
                totalPrice: totals.totalPrice,
                totalMargin: totals.totalMargin,
                updatedAt: now,
            };
        }));

        logAudit('item_modified', quoteId, `Item updated`, { lineItemId: itemId });
    }, [logAudit]);

    const removeLineItem = useCallback((quoteId: string, itemId: string) => {
        const now = new Date().toISOString();

        setQuotes(prev => prev.map(q => {
            if (q.id !== quoteId) return q;

            // Mark as removed, don't delete (for audit trail)
            const updatedItems = q.lineItems.map(item =>
                item.id === itemId
                    ? { ...item, status: 'removed' as const, updatedAt: now }
                    : item
            );

            const totals = calculateQuoteTotals(updatedItems, q.adjustments);

            return {
                ...q,
                lineItems: updatedItems,
                totalCost: totals.totalCost,
                totalPrice: totals.totalPrice,
                totalMargin: totals.totalMargin,
                updatedAt: now,
            };
        }));

        logAudit('item_removed', quoteId, `Item removed`, { lineItemId: itemId });
    }, [logAudit]);

    // --------------------------------------------------------
    // ADJUSTMENTS
    // --------------------------------------------------------

    const addAdjustment = useCallback((
        quoteId: string,
        adjustment: Omit<QuoteAdjustment, 'id' | 'createdAt'>
    ) => {
        const now = new Date().toISOString();
        const adj: QuoteAdjustment = {
            ...adjustment,
            id: `adj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: now,
        };

        setQuotes(prev => prev.map(q => {
            if (q.id !== quoteId) return q;

            const updatedAdj = [...q.adjustments, adj];
            const totals = calculateQuoteTotals(q.lineItems, updatedAdj);

            return {
                ...q,
                adjustments: updatedAdj,
                totalCost: totals.totalCost,
                totalPrice: totals.totalPrice,
                totalMargin: totals.totalMargin,
                updatedAt: now,
            };
        }));

        logAudit('quote_updated', quoteId, `Adjustment added: ${adjustment.name}`);
    }, [logAudit]);

    const removeAdjustment = useCallback((quoteId: string, adjustmentId: string) => {
        const now = new Date().toISOString();

        setQuotes(prev => prev.map(q => {
            if (q.id !== quoteId) return q;

            const updatedAdj = q.adjustments.filter(a => a.id !== adjustmentId);
            const totals = calculateQuoteTotals(q.lineItems, updatedAdj);

            return {
                ...q,
                adjustments: updatedAdj,
                totalCost: totals.totalCost,
                totalPrice: totals.totalPrice,
                totalMargin: totals.totalMargin,
                updatedAt: now,
            };
        }));

        logAudit('quote_updated', quoteId, `Adjustment removed`);
    }, [logAudit]);

    // --------------------------------------------------------
    // VARIATIONS
    // --------------------------------------------------------

    const createVariation = useCallback((quoteId: string, reason: string): Variation => {
        const quote = quotes.find(q => q.id === quoteId);
        if (!quote) throw new Error('Quote not found');

        const existingVariations = variations.filter(v => v.quoteId === quoteId);
        const now = new Date().toISOString();

        const variation: Variation = {
            id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            variationNumber: generateVariationNumber(existingVariations.length),
            quoteId,
            status: 'draft',
            reason,
            requestedBy: currentUserName,
            addedItems: [],
            modifiedItems: [],
            removedItemIds: [],
            previousTotal: quote.totalPrice,
            newTotal: quote.totalPrice,
            deltaAmount: 0,
            deltaMargin: 0,
            createdAt: now,
            updatedAt: now,
        };

        setVariations(prev => [...prev, variation]);

        // Update quote status
        if (quote.status === 'in_progress') {
            transitionQuote(quoteId, 'variation_pending');
        }

        // Link variation to quote
        updateQuote(quoteId, {
            variationIds: [...quote.variationIds, variation.id],
        });

        logAudit('variation_created', quoteId, `Variation ${variation.variationNumber} created: ${reason}`, {
            variationId: variation.id,
        });

        return variation;
    }, [quotes, variations, currentUserName, transitionQuote, updateQuote, logAudit]);

    const approveVariation = useCallback((variationId: string, approver: string) => {
        const now = new Date().toISOString();

        setVariations(prev => prev.map(v => {
            if (v.id !== variationId) return v;

            return {
                ...v,
                status: 'approved' as VariationStatus,
                internalApprovedAt: now,
                internalApprovedBy: approver,
                updatedAt: now,
            };
        }));

        const variation = variations.find(v => v.id === variationId);
        if (variation) {
            logAudit('variation_approved', variation.quoteId, `Variation ${variation.variationNumber} approved`, {
                variationId,
            });

            // Check if all variations are approved, return to in_progress
            const quote = quotes.find(q => q.id === variation.quoteId);
            if (quote?.status === 'variation_pending') {
                const quoteVariations = variations.filter(v => quote.variationIds.includes(v.id));
                const allApproved = quoteVariations.every(v =>
                    v.id === variationId || v.status === 'approved' || v.status === 'rejected'
                );
                if (allApproved) {
                    transitionQuote(quote.id, 'in_progress');
                }
            }
        }
    }, [variations, quotes, transitionQuote, logAudit]);

    const rejectVariation = useCallback((variationId: string, reason: string) => {
        const now = new Date().toISOString();

        setVariations(prev => prev.map(v => {
            if (v.id !== variationId) return v;

            return {
                ...v,
                status: 'rejected' as VariationStatus,
                updatedAt: now,
            };
        }));

        const variation = variations.find(v => v.id === variationId);
        if (variation) {
            logAudit('variation_rejected', variation.quoteId, `Variation ${variation.variationNumber} rejected: ${reason}`, {
                variationId,
            });
        }
    }, [variations, logAudit]);

    // --------------------------------------------------------
    // MARGIN COMPLIANCE (KILL-SWITCHES)
    // --------------------------------------------------------

    const checkMarginCompliance = useCallback((quote: Quote): MarginCheckResult => {
        const violations: MarginViolation[] = [];
        const warnings: MarginWarning[] = [];

        const applicableRules = marginRules.filter(
            rule => !rule.jurisdiction || rule.jurisdiction === quote.jurisdiction
        );

        // Check each line item
        for (const item of quote.lineItems.filter(i => i.status === 'active')) {
            const categoryRule = applicableRules.find(r => r.category === item.category);
            const defaultRule = applicableRules.find(r => !r.category);
            const rule = categoryRule || defaultRule;

            if (rule) {
                if (item.margin < rule.marginFloor) {
                    violations.push({
                        lineItemId: item.id,
                        category: item.category as TradeCategory,
                        currentMargin: item.margin,
                        requiredMargin: rule.marginFloor,
                        message: rule.blockMessage,
                    });
                } else if (item.margin < rule.marginWarning) {
                    warnings.push({
                        lineItemId: item.id,
                        category: item.category as TradeCategory,
                        currentMargin: item.margin,
                        targetMargin: rule.marginWarning,
                        message: rule.warningMessage,
                    });
                }
            }
        }

        // Check overall margin
        const defaultRule = applicableRules.find(r => !r.category);
        const marginFloor = defaultRule?.marginFloor ?? 0.20;

        if (quote.totalMargin < marginFloor) {
            violations.push({
                currentMargin: quote.totalMargin,
                requiredMargin: marginFloor,
                message: `Overall margin ${(quote.totalMargin * 100).toFixed(1)}% is below floor of ${(marginFloor * 100).toFixed(0)}%`,
            });
        }

        return {
            isCompliant: violations.length === 0,
            overallMargin: quote.totalMargin,
            marginFloor,
            violations,
            warnings,
            requiresOverride: violations.length > 0,
        };
    }, [marginRules]);

    const requestMarginOverride = useCallback((quoteId: string, reason: string) => {
        logAudit('margin_override', quoteId, `Margin override requested: ${reason}`, {
            isMarginViolation: true,
            requiresReview: true,
        });
    }, [logAudit]);

    const approveMarginOverride = useCallback((quoteId: string, approver: string) => {
        logAudit('margin_override', quoteId, `Margin override approved by ${approver}`, {
            isMarginViolation: true,
        });
    }, [logAudit]);

    // --------------------------------------------------------
    // ANALYTICS
    // --------------------------------------------------------

    const getQuotesByStatus = useCallback((status: QuoteStatus): Quote[] => {
        return quotes.filter(q => q.status === status);
    }, [quotes]);

    const getQuotesByClient = useCallback((clientId: string): Quote[] => {
        return quotes.filter(q => q.clientId === clientId);
    }, [quotes]);

    const getMarginAnalytics = useCallback((): MarginAnalytics => {
        const activeQuotes = quotes.filter(q => !isTerminalStatus(q.status) || q.status === 'completed');

        const totalRevenue = activeQuotes.reduce((sum, q) => sum + q.totalPrice, 0);
        const totalCost = activeQuotes.reduce((sum, q) => sum + q.totalCost, 0);
        const averageMargin = totalRevenue > 0 ? (totalRevenue - totalCost) / totalRevenue : 0;

        // Margin by category
        const marginByCategory: Record<string, { revenue: number; cost: number }> = {};
        for (const quote of activeQuotes) {
            for (const item of quote.lineItems.filter(i => i.status === 'active')) {
                if (!marginByCategory[item.category]) {
                    marginByCategory[item.category] = { revenue: 0, cost: 0 };
                }
                marginByCategory[item.category].revenue += item.totalPrice;
                marginByCategory[item.category].cost += item.totalCost;
            }
        }
        const marginByCategoryResult: Record<string, number> = {};
        for (const [cat, data] of Object.entries(marginByCategory)) {
            marginByCategoryResult[cat] = data.revenue > 0
                ? (data.revenue - data.cost) / data.revenue
                : 0;
        }

        // Margin by jurisdiction
        const marginByJurisdiction: Record<string, number> = {
            SG: 0,
            MY: 0,
        };
        for (const jurisdiction of ['SG', 'MY'] as const) {
            const jQuotes = activeQuotes.filter(q => q.jurisdiction === jurisdiction);
            const jRevenue = jQuotes.reduce((sum, q) => sum + q.totalPrice, 0);
            const jCost = jQuotes.reduce((sum, q) => sum + q.totalCost, 0);
            marginByJurisdiction[jurisdiction] = jRevenue > 0 ? (jRevenue - jCost) / jRevenue : 0;
        }

        // Count quotes above/below targets
        const defaultRule = marginRules.find(r => !r.category && !r.jurisdiction);
        const target = defaultRule?.marginWarning ?? 0.30;
        const floor = defaultRule?.marginFloor ?? 0.20;

        const quotesAboveTarget = activeQuotes.filter(q => q.totalMargin >= target).length;
        const quotesBelowFloor = activeQuotes.filter(q => q.totalMargin < floor).length;

        return {
            averageMargin,
            marginByCategory: marginByCategoryResult,
            marginByJurisdiction,
            quotesAboveTarget,
            quotesBelowFloor,
            totalRevenue,
            totalCost,
        };
    }, [quotes, marginRules]);

    // --------------------------------------------------------
    // CONTEXT VALUE
    // --------------------------------------------------------

    const value: QuoteContextValue = {
        quotes,
        activeQuote,
        variations,
        auditLog,
        marginRules,
        createQuote,
        updateQuote,
        deleteQuote,
        setActiveQuote,
        duplicateQuote,
        transitionQuote,
        addLineItem,
        updateLineItem,
        removeLineItem,
        addAdjustment,
        removeAdjustment,
        createVariation,
        approveVariation,
        rejectVariation,
        checkMarginCompliance,
        requestMarginOverride,
        approveMarginOverride,
        getQuotesByStatus,
        getQuotesByClient,
        getMarginAnalytics,
    };

    return (
        <QuoteContext.Provider value={value}>
            {children}
        </QuoteContext.Provider>
    );
}
