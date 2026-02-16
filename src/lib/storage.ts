/**
 * Storage Utility for Quotation System
 * Handles localStorage persistence with auto-save and hydration
 */

const STORAGE_KEYS = {
    QUOTES: 'paddleduck_quotes',
    CURRENT_QUOTE_ID: 'paddleduck_current_quote_id',
    FIRM_SETTINGS: 'paddleduck_firm_settings',
    VENDOR_QUOTES: 'paddleduck_vendor_quotes',
} as const;

export interface FirmSettings {
    name: string;
    jurisdiction: 'SG' | 'MY';
    gstRegistered: boolean;
    gstRate: number; // 9 for SG, 6 for MY (SST)
    gstNumber?: string;
    defaultMarginTarget: number; // e.g., 25

    // Customizable payment schedule
    paymentScheduleTemplate: PaymentMilestoneTemplate[];
}

// Payment milestone template (company can customize number of tranches and percentages)
export interface PaymentMilestoneTemplate {
    name: string; // e.g., "Upon Signing", "50% Completion"
    percentage: number; // Must sum to 100
    trigger: 'SIGNING' | 'DAYS_AFTER_START' | 'PERCENTAGE_COMPLETE' | 'COMPLETION' | 'DEFECT_LIABILITY';
    triggerValue?: number; // e.g., 30 days after start, or 50% completion
}

// Quote status for workflow tracking
export type QuoteStatus = 'ESTIMATE' | 'DRAFT' | 'SENT' | 'NEGOTIATING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface SavedQuote {
    id: string;
    version: number;
    status: QuoteStatus; // NEW: Track quote lifecycle
    projectName: string;
    clientId: string; // Can be empty for ESTIMATE status
    clientName?: string; // For prospects without formal client record
    createdAt: string;
    updatedAt: string;
    lines: unknown[]; // QuoteLine[]
    totals: {
        subtotal: number;
        gst: number;
        total: number;
        margin: number;
    };
    history?: QuoteSnapshot[];
}

export interface QuoteSnapshot {
    version: number;
    timestamp: string;
    lines: unknown[];
    totals: SavedQuote['totals'];
    note?: string;
}

// ═══════════════════════════════════════════════════════════════
// CORE STORAGE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function safeGet<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.warn(`[Storage] Failed to read ${key}:`, e);
        return fallback;
    }
}

function safeSet(key: string, value: unknown): boolean {
    if (typeof window === 'undefined') return false;
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error(`[Storage] Failed to write ${key}:`, e);
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════
// QUOTE OPERATIONS
// ═══════════════════════════════════════════════════════════════

export function saveQuote(quote: SavedQuote): boolean {
    const quotes = getAllQuotes();
    const existingIndex = quotes.findIndex(q => q.id === quote.id);

    if (existingIndex >= 0) {
        quotes[existingIndex] = { ...quote, updatedAt: new Date().toISOString() };
    } else {
        quotes.push({ ...quote, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    return safeSet(STORAGE_KEYS.QUOTES, quotes);
}

export function getAllQuotes(): SavedQuote[] {
    return safeGet<SavedQuote[]>(STORAGE_KEYS.QUOTES, []);
}

export function getQuote(id: string): SavedQuote | null {
    const quotes = getAllQuotes();
    return quotes.find(q => q.id === id) || null;
}

export function deleteQuote(id: string): boolean {
    const quotes = getAllQuotes().filter(q => q.id !== id);
    return safeSet(STORAGE_KEYS.QUOTES, quotes);
}

export function setCurrentQuoteId(id: string | null): boolean {
    if (id === null) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_QUOTE_ID);
        return true;
    }
    return safeSet(STORAGE_KEYS.CURRENT_QUOTE_ID, id);
}

export function getCurrentQuoteId(): string | null {
    return safeGet<string | null>(STORAGE_KEYS.CURRENT_QUOTE_ID, null);
}

// ═══════════════════════════════════════════════════════════════
// VERSIONING
// ═══════════════════════════════════════════════════════════════

export function createQuoteVersion(quote: SavedQuote, note?: string): SavedQuote {
    const snapshot: QuoteSnapshot = {
        version: quote.version,
        timestamp: new Date().toISOString(),
        lines: JSON.parse(JSON.stringify(quote.lines)),
        totals: { ...quote.totals },
        note
    };

    return {
        ...quote,
        version: quote.version + 1,
        history: [...(quote.history || []), snapshot]
    };
}

export function restoreQuoteVersion(quote: SavedQuote, targetVersion: number): SavedQuote | null {
    const snapshot = quote.history?.find(h => h.version === targetVersion);
    if (!snapshot) return null;

    return {
        ...quote,
        lines: JSON.parse(JSON.stringify(snapshot.lines)),
        totals: { ...snapshot.totals }
    };
}

// ═══════════════════════════════════════════════════════════════
// FIRM SETTINGS
// ═══════════════════════════════════════════════════════════════

export function getFirmSettings(): FirmSettings {
    return safeGet<FirmSettings>(STORAGE_KEYS.FIRM_SETTINGS, {
        name: 'My Design Firm',
        jurisdiction: 'SG',
        gstRegistered: false,
        gstRate: 9,
        defaultMarginTarget: 25,
        paymentScheduleTemplate: [
            { name: 'Upon Signing', percentage: 50, trigger: 'SIGNING' },
            { name: 'Upon Completion', percentage: 40, trigger: 'COMPLETION' },
            { name: 'After Defect Liability (30 days)', percentage: 10, trigger: 'DEFECT_LIABILITY', triggerValue: 30 }
        ]
    });
}

export function saveFirmSettings(settings: FirmSettings): boolean {
    return safeSet(STORAGE_KEYS.FIRM_SETTINGS, settings);
}

// ═══════════════════════════════════════════════════════════════
// GENERATE UNIQUE ID
// ═══════════════════════════════════════════════════════════════

export function generateQuoteId(): string {
    return `Q-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}
