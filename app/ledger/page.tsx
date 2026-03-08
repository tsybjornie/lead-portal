"use client";

import { useState, useMemo } from "react";
import RoofNav from '@/components/RoofNav';

// ============================================================
// TYPES
// ============================================================

interface LedgerEntry {
    id: string;
    date: string;
    description: string;
    category: string;
    type: "income" | "expense";
    status: "paid" | "pending" | "overdue" | "scheduled";
    amount: number;         // Before GST
    gstAmount: number;      // GST component (9%)
    totalAmount: number;    // Amount + GST
    vendorCode?: string;    // Vendor fingerprint e.g. "WW-001"
    vendorName?: string;
    tradeCategory?: string; // carpentry, tiling, etc.
    invoiceRef?: string;    // Invoice reference for IRAS
    paymentMethod?: string; // bank transfer, cash, cheque
    claimRef?: string;      // Links to PO/claim
    isGstRegistered?: boolean; // Vendor GST status
    duty?: "homeowner" | "id" | "vendor"; // Who's responsible
    supplyType?: "supply" | "install" | "supply_and_install"; // Split tracking
    creditTerms?: string; // e.g. "Net 30", "COD", "Net 60"
}

type TabView = "transactions" | "summary" | "gst" | "vendors" | "compliance" | "team";

// ============================================================
// CONSTANTS
// ============================================================

const GST_RATE = 0.09; // Singapore 9% GST

const EXPENSE_CATEGORIES = [
    "Materials", "Labour", "Subcontractor", "Transport",
    "Equipment Rental", "Permits & Submissions", "Design Fee",
    "Contingency", "Site Protection", "Temporary Services",
    "Staff Salary", "Office Rent", "Insurance", "Software & Tools",
    "Utilities", "Marketing Spend",
];

const INCOME_CATEGORIES = [
    "Deposit (10%)", "Progress Payment 1", "Progress Payment 2",
    "Progress Payment 3", "Final Payment", "Variation Order",
    "Retention Release",
];

// ============================================================
// DEMO DATA
// ============================================================

const DEMO_TRANSACTIONS: LedgerEntry[] = [
    // INCOME
    { id: "tx-001", date: "2026-02-15", description: "Client deposit — 10% of quoted $85,000", category: "Deposit (10%)", type: "income", status: "paid", amount: 8500, gstAmount: 765, totalAmount: 9265, paymentMethod: "bank transfer", invoiceRef: "INV-2026-001", duty: "homeowner" },
    { id: "tx-002", date: "2026-03-01", description: "Progress Payment 1 — Demolition + Hacking complete", category: "Progress Payment 1", type: "income", status: "paid", amount: 17000, gstAmount: 1530, totalAmount: 18530, paymentMethod: "bank transfer", invoiceRef: "INV-2026-002", duty: "homeowner" },
    { id: "tx-003", date: "2026-03-15", description: "Progress Payment 2 — Masonry + Waterproofing", category: "Progress Payment 2", type: "income", status: "pending", amount: 21250, gstAmount: 1912.50, totalAmount: 23162.50, paymentMethod: "bank transfer", invoiceRef: "INV-2026-003", duty: "homeowner" },
    // EXPENSES - Materials (supply)
    { id: "tx-010", date: "2026-02-20", description: "Marine plywood 18mm × 40 sheets", category: "Materials", type: "expense", status: "paid", amount: 3400, gstAmount: 306, totalAmount: 3706, vendorCode: "SL-001", vendorName: "SinLec Hardware", tradeCategory: "carpentry", invoiceRef: "SL-INV-8821", isGstRegistered: true, duty: "vendor", supplyType: "supply", creditTerms: "Net 30" },
    { id: "tx-011", date: "2026-02-22", description: "Niro Granite GHQ03 — 600×600mm floor tiles (96 sqft kitchen)", category: "Materials", type: "expense", status: "paid", amount: 403, gstAmount: 36.27, totalAmount: 439.27, vendorCode: "HF-001", vendorName: "Hafary Gallery", tradeCategory: "tiling", invoiceRef: "HF-INV-11234", isGstRegistered: true, duty: "vendor", supplyType: "supply", creditTerms: "Net 30" },
    { id: "tx-012", date: "2026-02-25", description: "Blum Aventos HK-S soft-close × 8 sets", category: "Materials", type: "expense", status: "paid", amount: 360, gstAmount: 32.40, totalAmount: 392.40, vendorCode: "BL-001", vendorName: "Blum SG", tradeCategory: "carpentry", invoiceRef: "BL-INV-5561", isGstRegistered: true, duty: "vendor", supplyType: "supply", creditTerms: "Net 60" },
    { id: "tx-013", date: "2026-03-01", description: "SIKA waterproofing membrane — master bath + common bath", category: "Materials", type: "expense", status: "paid", amount: 580, gstAmount: 52.20, totalAmount: 632.20, vendorCode: "NP-001", vendorName: "Nippon SG", tradeCategory: "waterproofing", invoiceRef: "NP-INV-3302", isGstRegistered: true, duty: "vendor", supplyType: "supply", creditTerms: "Net 30" },
    // EXPENSES - Labour (install)
    { id: "tx-020", date: "2026-02-28", description: "Demolition works — whole unit hacking + disposal", category: "Labour", type: "expense", status: "paid", amount: 5100, gstAmount: 0, totalAmount: 5100, vendorCode: "WW-001", vendorName: "WoodWork SG (Ahmad)", tradeCategory: "demolition", isGstRegistered: false, duty: "vendor", supplyType: "install", creditTerms: "COD" },
    { id: "tx-021", date: "2026-03-05", description: "Tiling labour — kitchen floor + backsplash (herringbone)", category: "Labour", type: "expense", status: "pending", amount: 2880, gstAmount: 0, totalAmount: 2880, vendorCode: "WW-001", vendorName: "WoodWork SG (Ahmad)", tradeCategory: "tiling", invoiceRef: "WW-CLM-042", isGstRegistered: false, duty: "vendor", supplyType: "install", creditTerms: "Net 14" },
    { id: "tx-022", date: "2026-03-08", description: "Carpentry — kitchen cabinets fabrication & install", category: "Labour", type: "expense", status: "scheduled", amount: 8500, gstAmount: 0, totalAmount: 8500, vendorCode: "WW-001", vendorName: "WoodWork SG (Ahmad)", tradeCategory: "carpentry", isGstRegistered: false, duty: "vendor", supplyType: "install", creditTerms: "Net 14" },
    { id: "tx-023", date: "2026-03-10", description: "Electrical rewiring — 32 points incl. DB upgrade", category: "Labour", type: "expense", status: "scheduled", amount: 3200, gstAmount: 0, totalAmount: 3200, vendorCode: "SP-001", vendorName: "Sparks Electrical (Leong)", tradeCategory: "electrical", isGstRegistered: false, duty: "vendor", supplyType: "install", creditTerms: "Net 30" },
    // EXPENSES - Admin
    { id: "tx-030", date: "2026-02-18", description: "HDB renovation permit — BCA submission", category: "Permits & Submissions", type: "expense", status: "paid", amount: 300, gstAmount: 0, totalAmount: 300, duty: "id" },
    { id: "tx-031", date: "2026-02-17", description: "Site protection — corridor & lift lobby", category: "Site Protection", type: "expense", status: "paid", amount: 450, gstAmount: 0, totalAmount: 450, vendorCode: "WW-001", vendorName: "WoodWork SG (Ahmad)", duty: "vendor" },
    // OVERHEADS & STAFF
    { id: "tx-040", date: "2026-03-01", description: "Bjorn Tan — Mar salary (Designer / PM)", category: "Staff Salary", type: "expense", status: "paid", amount: 4500, gstAmount: 0, totalAmount: 4500, duty: "id" },
    { id: "tx-041", date: "2026-03-01", description: "Jenny Lee — Mar salary (Designer)", category: "Staff Salary", type: "expense", status: "paid", amount: 3800, gstAmount: 0, totalAmount: 3800, duty: "id" },
    { id: "tx-042", date: "2026-03-01", description: "Alex Ong — Mar salary (Drafter)", category: "Staff Salary", type: "expense", status: "paid", amount: 3200, gstAmount: 0, totalAmount: 3200, duty: "id" },
    { id: "tx-043", date: "2026-03-01", description: "Michelle Ng — Mar salary (Admin / Ops)", category: "Staff Salary", type: "expense", status: "paid", amount: 2800, gstAmount: 0, totalAmount: 2800, duty: "id" },
    { id: "tx-044", date: "2026-03-01", description: "Studio rent — Ubi industrial unit", category: "Office Rent", type: "expense", status: "paid", amount: 2400, gstAmount: 216, totalAmount: 2616, invoiceRef: "RENT-MAR-26", isGstRegistered: true, duty: "id" },
    { id: "tx-045", date: "2026-03-01", description: "Professional indemnity insurance — quarterly", category: "Insurance", type: "expense", status: "paid", amount: 850, gstAmount: 0, totalAmount: 850, duty: "id" },
    { id: "tx-046", date: "2026-03-01", description: "AutoCAD + Adobe CC + Roof platform — monthly", category: "Software & Tools", type: "expense", status: "paid", amount: 380, gstAmount: 34.20, totalAmount: 414.20, isGstRegistered: true, duty: "id" },
    { id: "tx-047", date: "2026-03-01", description: "Studio utilities — electricity + internet", category: "Utilities", type: "expense", status: "paid", amount: 320, gstAmount: 28.80, totalAmount: 348.80, isGstRegistered: true, duty: "id" },
    { id: "tx-048", date: "2026-03-05", description: "Instagram + Google Ads — Mar budget", category: "Marketing Spend", type: "expense", status: "paid", amount: 1200, gstAmount: 0, totalAmount: 1200, duty: "id" },
    // COMMISSION & CPF
    { id: "tx-050", date: "2026-03-01", description: "Rachel Lim — 8% commission on P001 Sarah Tan ($45k)", category: "Staff Salary", type: "expense", status: "paid", amount: 3600, gstAmount: 0, totalAmount: 3600, duty: "id", creditTerms: "COD" },
    { id: "tx-051", date: "2026-03-01", description: "CPF contributions (employer 17%) — Bjorn, Jenny, Alex, Michelle", category: "Staff Salary", type: "expense", status: "paid", amount: 2431, gstAmount: 0, totalAmount: 2431, duty: "id" },
    { id: "tx-052", date: "2026-03-01", description: "Freelance drafter — 3 drawings @ $180/drawing", category: "Staff Salary", type: "expense", status: "pending", amount: 540, gstAmount: 0, totalAmount: 540, duty: "id", creditTerms: "Net 14" },
];

// ============================================================
// COMPONENT
// ============================================================

export default function LedgerPage() {
    const [entries, setEntries] = useState<LedgerEntry[]>(DEMO_TRANSACTIONS);
    const [tab, setTab] = useState<TabView>("transactions");
    const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
    const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending" | "overdue" | "scheduled">("all");
    const [showAddForm, setShowAddForm] = useState(false);
    const [hoveredWaterfall, setHoveredWaterfall] = useState<number | null>(null);
    const [hoveredDonut, setHoveredDonut] = useState<string | null>(null);

    // ============================================================
    // CALCULATIONS
    // ============================================================

    const totals = useMemo(() => {
        const income = entries.filter(e => e.type === "income");
        const expenses = entries.filter(e => e.type === "expense");

        const totalIncome = income.reduce((s, e) => s + e.amount, 0);
        const totalIncomeGst = income.reduce((s, e) => s + e.gstAmount, 0);
        const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
        const totalExpenseGst = expenses.reduce((s, e) => s + e.gstAmount, 0);

        const paidIncome = income.filter(e => e.status === "paid").reduce((s, e) => s + e.totalAmount, 0);
        const pendingIncome = income.filter(e => e.status !== "paid").reduce((s, e) => s + e.totalAmount, 0);
        const paidExpense = expenses.filter(e => e.status === "paid").reduce((s, e) => s + e.totalAmount, 0);
        const pendingExpense = expenses.filter(e => e.status !== "paid").reduce((s, e) => s + e.totalAmount, 0);

        // IRAS GST: Output tax (collected from client) - Input tax (paid to vendors)
        const outputTax = totalIncomeGst; // GST collected
        const inputTax = totalExpenseGst; // GST paid (claimable)
        const gstPayable = outputTax - inputTax; // Net to IRAS

        return {
            totalIncome, totalIncomeGst, totalExpense, totalExpenseGst,
            netCashFlow: totalIncome - totalExpense,
            paidIncome, pendingIncome, paidExpense, pendingExpense,
            outputTax, inputTax, gstPayable,
            cashInHand: paidIncome - paidExpense,
        };
    }, [entries]);

    // Vendor summary
    const vendorSummary = useMemo(() => {
        const map = new Map<string, { code: string; name: string; total: number; paid: number; pending: number; trades: Set<string>; count: number; terms: string }>();
        entries.filter(e => e.type === "expense" && e.vendorCode).forEach(e => {
            const key = e.vendorCode!;
            const existing = map.get(key) || { code: key, name: e.vendorName || key, total: 0, paid: 0, pending: 0, trades: new Set<string>(), count: 0, terms: e.creditTerms || 'N/A' };
            existing.total += e.totalAmount;
            existing.count++;
            if (e.status === "paid") existing.paid += e.totalAmount;
            else existing.pending += e.totalAmount;
            if (e.tradeCategory) existing.trades.add(e.tradeCategory);
            if (e.creditTerms) existing.terms = e.creditTerms;
            map.set(key, existing);
        });
        return Array.from(map.values()).sort((a, b) => b.total - a.total);
    }, [entries]);

    // Filtered entries
    const filtered = useMemo(() => {
        return entries.filter(e => {
            if (filterType !== "all" && e.type !== filterType) return false;
            if (filterStatus !== "all" && e.status !== filterStatus) return false;
            return true;
        }).sort((a, b) => b.date.localeCompare(a.date));
    }, [entries, filterType, filterStatus]);

    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const statusColor = (s: string) => {
        switch (s) {
            case "paid": return { bg: "#F0FDF4", text: "#16A34A" };
            case "pending": return { bg: "#FEF9C3", text: "#CA8A04" };
            case "overdue": return { bg: "#FEF2F2", text: "#DC2626" };
            case "scheduled": return { bg: "#F0F9FF", text: "#2563EB" };
            default: return { bg: "#F5F5F4", text: "#78716C" };
        }
    };

    const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const toggleStatus = (id: string) => {
        setEntries(prev => prev.map(e =>
            e.id === id ? { ...e, status: e.status === "paid" ? "pending" : "paid" } : e
        ));
    };

    return (
        <div style={{ fontFamily: f, minHeight: "100vh", background: "#FAFAF9" }}>
            <RoofNav />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 80px" }}>
                {/* SUMMARY CARDS */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
                    {[
                        { label: "Cash In Hand", value: fmt(totals.cashInHand), color: totals.cashInHand >= 0 ? "#16A34A" : "#DC2626" },
                        { label: "Total Income", value: fmt(totals.totalIncome), color: "#37352F" },
                        { label: "Total Expenses", value: fmt(totals.totalExpense), color: "#37352F" },
                        { label: "Pending Claims", value: fmt(totals.pendingIncome), color: "#CA8A04" },
                        { label: "GST Payable (IRAS)", value: fmt(totals.gstPayable), color: totals.gstPayable > 0 ? "#DC2626" : "#16A34A" },
                    ].map(card => (
                        <div key={card.label} style={{
                            background: "white", borderRadius: 10, padding: "16px 18px",
                            border: "1px solid #E9E9E7", cursor: "pointer", transition: "all 0.2s",
                        }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                        >
                            <div style={{ fontSize: 10, fontWeight: 600, color: "#9B9A97", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                                {card.label}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: card.color, fontFamily: "'SF Mono', monospace" }}>
                                {card.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* PROFIT MARGIN BAR */}
                <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: '14px 18px', marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Project Cash Position</span>
                        <span style={{ fontSize: 12, fontWeight: 800, fontFamily: "'SF Mono', monospace", color: totals.netCashFlow >= 0 ? '#16A34A' : '#DC2626' }}>
                            {totals.netCashFlow >= 0 ? '+' : ''}{fmt(totals.netCashFlow)} ({totals.totalIncome > 0 ? ((totals.netCashFlow / totals.totalIncome) * 100).toFixed(1) : 0}% margin)
                        </span>
                    </div>
                    <div style={{ height: 10, background: '#F5F5F4', borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
                        <div style={{ height: '100%', background: 'linear-gradient(90deg, #22C55E, #16A34A)', width: `${totals.totalIncome > 0 ? (totals.totalIncome / (totals.totalIncome + totals.totalExpense)) * 100 : 50}%`, borderRadius: '5px 0 0 5px', transition: 'width 0.5s' }} />
                        <div style={{ height: '100%', background: 'linear-gradient(90deg, #EF4444, #DC2626)', flex: 1, borderRadius: '0 5px 5px 0' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontSize: 9, color: '#16A34A', fontWeight: 600 }}>Income {fmt(totals.totalIncome)}</span>
                        <span style={{ fontSize: 9, color: '#DC2626', fontWeight: 600 }}>Expenses {fmt(totals.totalExpense)}</span>
                    </div>
                </div>

                {/* BUSINESS HEALTH INTELLIGENCE */}
                {(() => {
                    const overheadCategories = ['Staff Salary', 'Office Rent', 'Insurance', 'Software & Tools', 'Utilities', 'Marketing Spend'];
                    const monthlyOverhead = entries.filter(e => e.type === 'expense' && overheadCategories.includes(e.category)).reduce((s, e) => s + e.totalAmount, 0);
                    const projectCosts = entries.filter(e => e.type === 'expense' && !overheadCategories.includes(e.category)).reduce((s, e) => s + e.totalAmount, 0);
                    const avgProjectValue = totals.totalIncome > 0 ? totals.totalIncome / entries.filter(e => e.type === 'income').length : 45000;
                    const avgProjectProfit = avgProjectValue * 0.25; // assume 25% margin
                    const projectsToBreakeven = monthlyOverhead > 0 ? Math.ceil(monthlyOverhead / avgProjectProfit) : 0;
                    const cashReserve = totals.netCashFlow;
                    const monthsRunway = monthlyOverhead > 0 ? (cashReserve / monthlyOverhead) : 99;
                    const isHealthy = monthsRunway > 3;
                    const isWarning = monthsRunway > 1 && monthsRunway <= 3;
                    const isCritical = monthsRunway <= 1;

                    // Find biggest bleed
                    const categorySpend = overheadCategories.map(cat => ({
                        cat,
                        total: entries.filter(e => e.type === 'expense' && e.category === cat).reduce((s, e) => s + e.totalAmount, 0),
                    })).sort((a, b) => b.total - a.total);

                    return (
                        <div style={{
                            background: isCritical ? '#FEF2F2' : isWarning ? '#FEF9C3' : '#F0FDF4',
                            borderRadius: 10,
                            border: `1px solid ${isCritical ? '#FCA5A5' : isWarning ? '#FDE68A' : '#BBF7D0'}`,
                            padding: '16px 18px', marginBottom: 24,
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: isCritical ? '#DC2626' : isWarning ? '#92400E' : '#16A34A' }}>
                                        {isCritical ? 'CRITICAL — Cash Depleting' : isWarning ? 'WARNING — Monitor Closely' : 'HEALTHY — On Track'}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 2 }}>
                                        Business health based on current overhead vs income
                                    </div>
                                </div>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: isCritical ? '#DC2626' : isWarning ? '#F59E0B' : '#22C55E',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: 14, fontWeight: 900,
                                }}>
                                    {isCritical ? '!' : isWarning ? '~' : '+'}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
                                {[
                                    { label: 'Monthly Burn', value: fmt(monthlyOverhead), sub: 'Fixed overhead', color: '#DC2626' },
                                    { label: 'Project Costs', value: fmt(projectCosts), sub: 'Materials + labour', color: '#9B9A97' },
                                    { label: 'Break-even', value: `${projectsToBreakeven} projects`, sub: 'Per month needed', color: '#2563EB' },
                                    { label: 'Runway', value: monthsRunway > 12 ? '12+ months' : `${monthsRunway.toFixed(1)} months`, sub: 'At current rate', color: isCritical ? '#DC2626' : isWarning ? '#F59E0B' : '#22C55E' },
                                ].map(m => (
                                    <div key={m.label} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 6, padding: '8px 10px' }}>
                                        <div style={{ fontSize: 8, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{m.label}</div>
                                        <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "'SF Mono', monospace", color: m.color }}>{m.value}</div>
                                        <div style={{ fontSize: 8, color: '#9B9A97', marginTop: 1 }}>{m.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Biggest bleeds */}
                            <div style={{ fontSize: 10, fontWeight: 600, color: '#37352F', marginBottom: 4 }}>Where you&apos;re spending most</div>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {categorySpend.filter(c => c.total > 0).slice(0, 4).map(c => (
                                    <div key={c.cat} style={{
                                        background: 'rgba(255,255,255,0.7)', borderRadius: 4, padding: '3px 8px',
                                        fontSize: 9, fontWeight: 600, display: 'flex', gap: 4, alignItems: 'center',
                                    }}>
                                        <span style={{ color: '#6B6A67' }}>{c.cat}</span>
                                        <span style={{ color: '#DC2626', fontFamily: "'SF Mono', monospace" }}>{fmt(c.total)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {/* TABS */}
                <div style={{ display: "flex", gap: 2, marginBottom: 20, background: "#F7F6F3", borderRadius: 8, padding: 3 }}>
                    {(["transactions", "summary", "gst", "vendors", "compliance", "team"] as TabView[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            style={{
                                flex: 1, padding: "8px 0", fontSize: 12, fontWeight: 600, borderRadius: 6,
                                border: "none", cursor: "pointer", textTransform: "capitalize",
                                background: tab === t ? "white" : "transparent",
                                color: tab === t ? "#37352F" : "#9B9A97",
                                boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                            }}
                        >
                            {t === "gst" ? "GST / IRAS" : t === "compliance" ? "ACRA / Tax" : t === "team" ? "Team" : t}
                        </button>
                    ))}
                </div>

                {/* ==================== TRANSACTIONS TAB ==================== */}
                {tab === "transactions" && (
                    <>
                        {/* Due Invoices Alert */}
                        {(() => {
                            const dueItems = entries.filter(e => e.status === 'pending' || e.status === 'scheduled');
                            if (dueItems.length === 0) return null;
                            const totalDue = dueItems.reduce((s, e) => s + e.totalAmount, 0);
                            return (
                                <div style={{ background: '#FEF9C3', borderRadius: 10, padding: 14, marginBottom: 14, border: '1px solid #FDE68A' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>Upcoming Payments Due</span>
                                        <span style={{ fontSize: 12, fontWeight: 800, fontFamily: "'SF Mono', monospace", color: '#92400E' }}>{fmt(totalDue)}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {dueItems.map(item => {
                                            const termsDays = item.creditTerms === 'COD' ? 0 : item.creditTerms === 'Net 14' ? 14 : item.creditTerms === 'Net 30' ? 30 : item.creditTerms === 'Net 60' ? 60 : 30;
                                            const invoiceDate = new Date(item.date);
                                            const dueDate = new Date(invoiceDate.getTime() + termsDays * 86400000);
                                            const today = new Date('2026-03-08');
                                            const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);
                                            const isOverdue = daysLeft < 0;
                                            return (
                                                <div key={item.id} style={{
                                                    background: 'white', borderRadius: 6, padding: '6px 10px',
                                                    border: `1px solid ${isOverdue ? '#FCA5A5' : '#FDE68A'}`,
                                                    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                                                }}
                                                    onClick={() => toggleStatus(item.id)}
                                                >
                                                    <div>
                                                        <div style={{ fontSize: 10, fontWeight: 600, color: '#37352F' }}>{item.description.slice(0, 30)}...</div>
                                                        <div style={{ fontSize: 9, color: '#9B9A97' }}>{item.vendorName || 'Client'} {item.creditTerms ? `(${item.creditTerms})` : ''}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', color: '#37352F' }}>{fmt(item.totalAmount)}</div>
                                                        <div style={{ fontSize: 8, fontWeight: 700, color: isOverdue ? '#DC2626' : daysLeft <= 7 ? '#F59E0B' : '#22C55E' }}>
                                                            {isOverdue ? `${Math.abs(daysLeft)}d OVERDUE` : daysLeft === 0 ? 'DUE TODAY' : `${daysLeft}d left`}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Filters */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                            {(["all", "income", "expense"] as const).map(f => (
                                <button key={f} onClick={() => setFilterType(f)} style={{
                                    fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 6,
                                    border: filterType === f ? "1.5px solid #37352F" : "1px solid #E9E9E7",
                                    background: filterType === f ? "#37352F" : "white",
                                    color: filterType === f ? "white" : "#6B6A67", cursor: "pointer",
                                    textTransform: "capitalize",
                                }}>{f}</button>
                            ))}
                            <div style={{ width: 1, background: "#E9E9E7", margin: "0 4px" }} />
                            {(["all", "paid", "pending", "scheduled"] as const).map(s => (
                                <button key={s} onClick={() => setFilterStatus(s)} style={{
                                    fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 6,
                                    border: filterStatus === s ? "1.5px solid #37352F" : "1px solid #E9E9E7",
                                    background: filterStatus === s ? "#37352F" : "white",
                                    color: filterStatus === s ? "white" : "#6B6A67", cursor: "pointer",
                                    textTransform: "capitalize",
                                }}>{s}</button>
                            ))}
                        </div>

                        {/* Table */}
                        <div style={{ background: "white", borderRadius: 10, border: "1px solid #E9E9E7", overflow: "hidden" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #E9E9E7", background: "#FAFAF9" }}>
                                        {["Date", "Description", "Vendor", "Category", "Duty", "Status", "Amount"].map(h => (
                                            <th key={h} style={{
                                                padding: "10px 14px", textAlign: h === "Amount" ? "right" : "left",
                                                fontSize: 10, fontWeight: 700, color: "#9B9A97",
                                                textTransform: "uppercase", letterSpacing: "0.06em",
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(entry => {
                                        const sc = statusColor(entry.status);
                                        return (
                                            <tr
                                                key={entry.id}
                                                onClick={() => toggleStatus(entry.id)}
                                                style={{ borderBottom: "1px solid #F5F5F3", cursor: "pointer", transition: "background 0.1s" }}
                                                onMouseEnter={e => (e.currentTarget.style.background = "#FAFAF9")}
                                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                            >
                                                <td style={{ padding: "10px 14px", fontSize: 12, color: "#9B9A97", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                                                    {entry.date}
                                                </td>
                                                <td style={{ padding: "10px 14px", maxWidth: 300 }}>
                                                    <div style={{ fontWeight: 500, color: "#37352F", fontSize: 12.5 }}>{entry.description}</div>
                                                    {entry.invoiceRef && (
                                                        <div style={{ fontSize: 10, color: "#C8C7C3", marginTop: 2, fontFamily: "monospace" }}>{entry.invoiceRef}</div>
                                                    )}
                                                </td>
                                                <td style={{ padding: "10px 14px" }}>
                                                    {entry.vendorCode ? (
                                                        <div>
                                                            <span style={{ fontSize: 10, fontWeight: 700, color: "#37352F", background: "#F7F6F3", padding: "2px 6px", borderRadius: 3, fontFamily: "monospace" }}>
                                                                {entry.vendorCode}
                                                            </span>
                                                            <div style={{ fontSize: 10, color: "#9B9A97", marginTop: 2 }}>{entry.vendorName}</div>
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: 11, color: "#D1D0CD" }}>—</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: "10px 14px" }}>
                                                    <span style={{ fontSize: 11, color: "#6B6A67" }}>{entry.category}</span>
                                                    {entry.supplyType && (
                                                        <div style={{
                                                            fontSize: 9, fontWeight: 700, color: entry.supplyType === "supply" ? "#2563EB" : "#16A34A",
                                                            textTransform: "uppercase", marginTop: 2,
                                                        }}>
                                                            {entry.supplyType.replace("_", " + ")}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: "10px 14px" }}>
                                                    {entry.duty && (
                                                        <span style={{
                                                            fontSize: 9, fontWeight: 700, textTransform: "uppercase", padding: "2px 6px", borderRadius: 3,
                                                            background: entry.duty === "homeowner" ? "#EDE9FE" : entry.duty === "id" ? "#DBEAFE" : "#FEF3C7",
                                                            color: entry.duty === "homeowner" ? "#7C3AED" : entry.duty === "id" ? "#2563EB" : "#D97706",
                                                        }}>{entry.duty}</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: "10px 14px" }}>
                                                    <span style={{
                                                        fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99,
                                                        background: sc.bg, color: sc.text, textTransform: "uppercase",
                                                    }}>{entry.status}</span>
                                                </td>
                                                <td style={{
                                                    padding: "10px 14px", textAlign: "right", fontFamily: "'SF Mono', monospace",
                                                    fontWeight: 700, fontSize: 13,
                                                    color: entry.type === "income" ? "#16A34A" : "#37352F",
                                                }}>
                                                    {entry.type === "income" ? "+" : "−"}{fmt(entry.totalAmount)}
                                                    {entry.gstAmount > 0 && (
                                                        <div style={{ fontSize: 9, color: "#9B9A97", fontWeight: 500 }}>
                                                            incl. GST {fmt(entry.gstAmount)}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* ==================== SUMMARY TAB ==================== */}
                {tab === "summary" && (() => {
                    // Chart data
                    const incomeByCategory = INCOME_CATEGORIES.map(cat => {
                        const catEntries = entries.filter(e => e.type === "income" && e.category === cat);
                        const total = catEntries.reduce((s, e) => s + e.totalAmount, 0);
                        const paid = catEntries.filter(e => e.status === "paid").reduce((s, e) => s + e.totalAmount, 0);
                        return { cat, total, paid, count: catEntries.length };
                    }).filter(c => c.total > 0);

                    const expenseByCategory = EXPENSE_CATEGORIES.map(cat => {
                        const catEntries = entries.filter(e => e.type === "expense" && e.category === cat);
                        const total = catEntries.reduce((s, e) => s + e.totalAmount, 0);
                        const supply = catEntries.filter(e => e.supplyType === "supply").reduce((s, e) => s + e.totalAmount, 0);
                        const install = catEntries.filter(e => e.supplyType === "install").reduce((s, e) => s + e.totalAmount, 0);
                        return { cat, total, supply, install };
                    }).filter(c => c.total > 0);

                    const maxIncome = Math.max(...incomeByCategory.map(c => c.total), 1);
                    const maxExpense = Math.max(...expenseByCategory.map(c => c.total), 1);
                    const totalExpenseAmt = expenseByCategory.reduce((s, c) => s + c.total, 0);

                    // Donut segments
                    const donutColors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#22C55E', '#06B6D4', '#EC4899', '#6366F1', '#14B8A6', '#F97316'];
                    let cumulativePct = 0;
                    const donutSegments = expenseByCategory.map((c, i) => {
                        const pct = (c.total / totalExpenseAmt) * 100;
                        const start = cumulativePct;
                        cumulativePct += pct;
                        return { ...c, pct, start, color: donutColors[i % donutColors.length] };
                    });

                    // Cashflow waterfall
                    const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));
                    let runningBal = 0;
                    const waterfall = sortedEntries.map(e => {
                        const delta = e.status === "paid" ? (e.type === "income" ? e.totalAmount : -e.totalAmount) : 0;
                        runningBal += delta;
                        return { date: e.date.slice(5), desc: e.description.slice(0, 25), delta, balance: runningBal, type: e.type, status: e.status };
                    }).filter(w => w.delta !== 0);
                    const maxBalance = Math.max(...waterfall.map(w => Math.abs(w.balance)), 1);

                    const conicGradient = donutSegments.map(s => `${s.color} ${s.start}% ${s.start + s.pct}%`).join(', ');

                    return (
                        <div>
                            {/* Row 1: Bar Charts */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                {/* Income Bar Chart */}
                                <div style={{ background: "white", borderRadius: 10, border: "1px solid #E9E9E7", padding: 20 }}>
                                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#37352F", margin: "0 0 4px" }}>Income Breakdown</h3>
                                    <p style={{ fontSize: 10, color: "#9B9A97", margin: "0 0 16px" }}>Payment milestones · {fmt(totals.totalIncome)} total</p>
                                    {incomeByCategory.map(c => (
                                        <div key={c.cat} style={{ marginBottom: 10, padding: '6px 8px', borderRadius: 6, cursor: 'pointer', transition: 'background 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#FAFAF9')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                <span style={{ fontSize: 11, color: "#37352F", fontWeight: 500 }}>{c.cat}</span>
                                                <span style={{ fontSize: 11, fontFamily: "'SF Mono', monospace", fontWeight: 700, color: "#16A34A" }}>{fmt(c.total)}</span>
                                            </div>
                                            <div style={{ height: 8, background: "#F5F5F4", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                                                <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #22C55E, #16A34A)", width: `${(c.total / maxIncome) * 100}%`, transition: "width 0.5s ease" }} />
                                                {c.paid > 0 && c.paid < c.total && (
                                                    <div style={{ position: "absolute", top: 0, left: 0, height: "100%", borderRadius: 4, background: "rgba(22,163,74,0.3)", width: `${(c.paid / maxIncome) * 100}%` }} />
                                                )}
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                                                <span style={{ fontSize: 9, color: "#9B9A97" }}>{c.count} entries</span>
                                                <span style={{ fontSize: 9, color: c.paid >= c.total ? "#22C55E" : "#CA8A04" }}>{c.paid >= c.total ? "✓ Collected" : `${fmt(c.paid)} collected`}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Expense Bar Chart */}
                                <div style={{ background: "white", borderRadius: 10, border: "1px solid #E9E9E7", padding: 20 }}>
                                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#37352F", margin: "0 0 4px" }}>Expense Breakdown</h3>
                                    <p style={{ fontSize: 10, color: "#9B9A97", margin: "0 0 16px" }}>By category · {fmt(totals.totalExpense)} total</p>
                                    {expenseByCategory.map(c => (
                                        <div key={c.cat} style={{ marginBottom: 10, padding: '6px 8px', borderRadius: 6, cursor: 'pointer', transition: 'background 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#FAFAF9')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                <span style={{ fontSize: 11, color: "#37352F", fontWeight: 500 }}>{c.cat}</span>
                                                <span style={{ fontSize: 11, fontFamily: "'SF Mono', monospace", fontWeight: 700 }}>{fmt(c.total)}</span>
                                            </div>
                                            <div style={{ height: 8, background: "#F5F5F4", borderRadius: 4, overflow: "hidden", display: "flex" }}>
                                                {c.supply > 0 && (
                                                    <div style={{ height: "100%", background: "#3B82F6", width: `${(c.supply / maxExpense) * 100}%`, transition: "width 0.5s ease" }} />
                                                )}
                                                {c.install > 0 && (
                                                    <div style={{ height: "100%", background: "#F59E0B", width: `${(c.install / maxExpense) * 100}%`, transition: "width 0.5s ease" }} />
                                                )}
                                                {c.supply === 0 && c.install === 0 && (
                                                    <div style={{ height: "100%", background: "#9B9A97", borderRadius: 4, width: `${(c.total / maxExpense) * 100}%`, transition: "width 0.5s ease" }} />
                                                )}
                                            </div>
                                            <div style={{ display: "flex", gap: 12, marginTop: 2 }}>
                                                {c.supply > 0 && <span style={{ fontSize: 9, color: "#3B82F6" }}>● Supply {fmt(c.supply)}</span>}
                                                {c.install > 0 && <span style={{ fontSize: 9, color: "#F59E0B" }}>● Install {fmt(c.install)}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Row 2: Donut + Cashflow Waterfall */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
                                {/* Donut Chart */}
                                <div style={{ background: "white", borderRadius: 10, border: "1px solid #E9E9E7", padding: 20 }}>
                                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#37352F", margin: "0 0 16px" }}>Expense Distribution</h3>
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                                        <div style={{
                                            width: 160, height: 160, borderRadius: "50%",
                                            background: `conic-gradient(${conicGradient})`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <div style={{
                                                width: 100, height: 100, borderRadius: "50%", background: "white",
                                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'SF Mono', monospace", color: "#37352F" }}>{fmt(totalExpenseAmt)}</div>
                                                <div style={{ fontSize: 9, color: "#9B9A97", fontWeight: 600 }}>TOTAL SPEND</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        {donutSegments.map(s => (
                                            <div key={s.cat} style={{
                                                display: "flex", alignItems: "center", gap: 8, padding: '4px 6px', borderRadius: 4,
                                                cursor: 'pointer', transition: 'all 0.15s',
                                                background: hoveredDonut === s.cat ? s.color + '10' : 'transparent',
                                                transform: hoveredDonut === s.cat ? 'scale(1.02)' : 'none',
                                            }}
                                                onMouseEnter={() => setHoveredDonut(s.cat)}
                                                onMouseLeave={() => setHoveredDonut(null)}
                                            >
                                                <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                                                <span style={{ fontSize: 10, color: hoveredDonut === s.cat ? '#37352F' : '#6B6A67', fontWeight: hoveredDonut === s.cat ? 700 : 400, flex: 1 }}>{s.cat}</span>
                                                <span style={{ fontSize: 10, fontFamily: "'SF Mono', monospace", fontWeight: 600, color: '#37352F' }}>{s.pct.toFixed(1)}%</span>
                                                <span style={{ fontSize: 9, fontFamily: "'SF Mono', monospace", color: '#9B9A97' }}>{fmt(s.total)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Cashflow Waterfall */}
                                <div style={{ background: "white", borderRadius: 10, border: "1px solid #E9E9E7", padding: 20 }}>
                                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#37352F", margin: "0 0 4px" }}>Cashflow Waterfall</h3>
                                    <p style={{ fontSize: 10, color: "#9B9A97", margin: "0 0 16px" }}>Running balance from paid transactions</p>
                                    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 160, borderBottom: "1px solid #E9E9E7", paddingBottom: 4 }}>
                                        {waterfall.map((w, i) => {
                                            const normalizedHeight = (w.balance / maxBalance) * 100;
                                            return (
                                                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", position: 'relative' }}
                                                    onMouseEnter={() => setHoveredWaterfall(i)}
                                                    onMouseLeave={() => setHoveredWaterfall(null)}
                                                >
                                                    {/* Tooltip */}
                                                    {hoveredWaterfall === i && (
                                                        <div style={{
                                                            position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
                                                            background: '#37352F', color: 'white', padding: '6px 10px', borderRadius: 6,
                                                            fontSize: 9, whiteSpace: 'nowrap', zIndex: 10, pointerEvents: 'none',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                        }}>
                                                            <div style={{ fontWeight: 700, marginBottom: 2 }}>{w.desc}...</div>
                                                            <div style={{ color: w.delta > 0 ? '#86EFAC' : '#FCA5A5' }}>
                                                                {w.delta > 0 ? '+' : ''}{fmt(w.delta)}
                                                            </div>
                                                            <div style={{ color: '#9B9A97', marginTop: 1 }}>Balance: {fmt(w.balance)}</div>
                                                        </div>
                                                    )}
                                                    <div style={{
                                                        width: "100%", maxWidth: 40, borderRadius: "4px 4px 0 0",
                                                        height: `${Math.max(normalizedHeight, 5)}%`,
                                                        background: w.delta > 0
                                                            ? "linear-gradient(180deg, #22C55E, #16A34A)"
                                                            : "linear-gradient(180deg, #EF4444, #DC2626)",
                                                        transition: "all 0.3s ease",
                                                        opacity: hoveredWaterfall === null || hoveredWaterfall === i ? 1 : 0.3,
                                                        transform: hoveredWaterfall === i ? 'scaleY(1.05)' : 'none',
                                                        transformOrigin: 'bottom',
                                                        cursor: 'pointer',
                                                    }}>
                                                        <div style={{
                                                            position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)",
                                                            fontSize: 8, fontWeight: 700, whiteSpace: "nowrap",
                                                            fontFamily: "'SF Mono', monospace",
                                                            color: w.delta > 0 ? "#16A34A" : "#DC2626",
                                                            opacity: hoveredWaterfall === null || hoveredWaterfall === i ? 1 : 0,
                                                        }}>
                                                            {w.delta > 0 ? "+" : ""}{(w.delta / 1000).toFixed(1)}k
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                                        {waterfall.map((w, i) => (
                                            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 8, color: "#9B9A97" }}>
                                                {w.date}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12 }}>
                                        <span style={{ fontSize: 9, color: "#16A34A" }}>● Income</span>
                                        <span style={{ fontSize: 9, color: "#EF4444" }}>● Expense</span>
                                        <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'SF Mono', monospace", color: "#37352F" }}>Balance: {fmt(waterfall[waterfall.length - 1]?.balance || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* ==================== GST / IRAS TAB ==================== */}
                {tab === "gst" && (
                    <div style={{ background: "white", borderRadius: 10, border: "1px solid #E9E9E7", padding: 24 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#37352F", marginBottom: 20 }}>GST Summary — IRAS F5 Ready</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                            <div style={{ padding: 16, background: "#F0FDF4", borderRadius: 8, textAlign: "center" }}>
                                <div style={{ fontSize: 10, fontWeight: 600, color: "#16A34A", textTransform: "uppercase", marginBottom: 6 }}>Output Tax (Collected)</div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: "#16A34A", fontFamily: "monospace" }}>{fmt(totals.outputTax)}</div>
                                <div style={{ fontSize: 10, color: "#86EFAC", marginTop: 4 }}>GST charged to client on invoices</div>
                            </div>
                            <div style={{ padding: 16, background: "#FEF2F2", borderRadius: 8, textAlign: "center" }}>
                                <div style={{ fontSize: 10, fontWeight: 600, color: "#DC2626", textTransform: "uppercase", marginBottom: 6 }}>Input Tax (Claimable)</div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: "#DC2626", fontFamily: "monospace" }}>{fmt(totals.inputTax)}</div>
                                <div style={{ fontSize: 10, color: "#FCA5A5", marginTop: 4 }}>GST paid to GST-registered vendors</div>
                            </div>
                            <div style={{ padding: 16, background: totals.gstPayable > 0 ? "#FEF9C3" : "#F0FDF4", borderRadius: 8, textAlign: "center" }}>
                                <div style={{ fontSize: 10, fontWeight: 600, color: totals.gstPayable > 0 ? "#CA8A04" : "#16A34A", textTransform: "uppercase", marginBottom: 6 }}>
                                    Net {totals.gstPayable > 0 ? "Payable to IRAS" : "Refund from IRAS"}
                                </div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: totals.gstPayable > 0 ? "#CA8A04" : "#16A34A", fontFamily: "monospace" }}>{fmt(Math.abs(totals.gstPayable))}</div>
                                <div style={{ fontSize: 10, color: "#9B9A97", marginTop: 4 }}>Output − Input = Net GST</div>
                            </div>
                        </div>

                        <h4 style={{ fontSize: 12, fontWeight: 700, color: "#37352F", marginBottom: 12 }}>GST-Registered Vendors (Input Tax Claimable)</h4>
                        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #E9E9E7" }}>
                                    {["Vendor Code", "Vendor Name", "Invoice", "Amount (excl GST)", "GST (9%)", "Total"].map(h => (
                                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9B9A97", textTransform: "uppercase" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {entries.filter(e => e.type === "expense" && e.isGstRegistered && e.gstAmount > 0).map(e => (
                                    <tr key={e.id} style={{ borderBottom: "1px solid #F5F5F3" }}>
                                        <td style={{ padding: "8px 12px", fontFamily: "monospace", fontWeight: 700, fontSize: 11 }}>{e.vendorCode}</td>
                                        <td style={{ padding: "8px 12px", fontSize: 12 }}>{e.vendorName}</td>
                                        <td style={{ padding: "8px 12px", fontFamily: "monospace", fontSize: 10, color: "#9B9A97" }}>{e.invoiceRef}</td>
                                        <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{fmt(e.amount)}</td>
                                        <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "#DC2626" }}>{fmt(e.gstAmount)}</td>
                                        <td style={{ padding: "8px 12px", fontFamily: "monospace", fontWeight: 700 }}>{fmt(e.totalAmount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ marginTop: 16, padding: 12, background: "#FEF9C3", borderRadius: 6, fontSize: 11, color: "#92400E" }}>
                            <strong>⚠️ Note:</strong> Non-GST-registered vendors (e.g. sole proprietor contractors) — their invoices do NOT have claimable input tax. Ensure vendor GST registration numbers are verified before claiming.
                        </div>
                    </div>
                )}

                {/* ==================== VENDORS TAB ==================== */}
                {tab === "vendors" && (
                    <div style={{ background: "white", borderRadius: 10, border: "1px solid #E9E9E7", overflow: "hidden" }}>
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E9E9E7" }}>
                            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#37352F" }}>Vendor Payment Summary</h3>
                            <p style={{ fontSize: 11, color: "#9B9A97", marginTop: 2 }}>All vendors with fingerprint codes and payment status</p>
                        </div>
                        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #E9E9E7", background: "#FAFAF9" }}>
                                    {["Code", "Vendor", "Trades", "Terms", "# Entries", "Total", "Paid", "Outstanding"].map(h => (
                                        <th key={h} style={{
                                            padding: "10px 14px", textAlign: h === "Total" || h === "Paid" || h === "Outstanding" ? "right" : "left",
                                            fontSize: 10, fontWeight: 700, color: "#9B9A97", textTransform: "uppercase",
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {vendorSummary.map(v => (
                                    <tr key={v.code} style={{ borderBottom: "1px solid #F5F5F3" }}>
                                        <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, fontSize: 12 }}>{v.code}</td>
                                        <td style={{ padding: "10px 14px", fontWeight: 500 }}>{v.name}</td>
                                        <td style={{ padding: "10px 14px" }}>
                                            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                                {Array.from(v.trades).map(t => (
                                                    <span key={t} style={{
                                                        fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 3,
                                                        background: "#F7F6F3", color: "#6B6A67", textTransform: "capitalize",
                                                    }}>{t}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ padding: "10px 14px" }}>
                                            <span style={{
                                                fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                                                background: v.terms === 'COD' ? '#FEF2F2' : v.terms === 'Net 14' ? '#FEF9C3' : '#EFF6FF',
                                                color: v.terms === 'COD' ? '#DC2626' : v.terms === 'Net 14' ? '#CA8A04' : '#2563EB',
                                            }}>{v.terms}</span>
                                        </td>
                                        <td style={{ padding: "10px 14px", textAlign: "center", fontSize: 12, color: "#9B9A97" }}>{v.count}</td>
                                        <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>{fmt(v.total)}</td>
                                        <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", color: "#16A34A" }}>{fmt(v.paid)}</td>
                                        <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: v.pending > 0 ? "#DC2626" : "#9B9A97" }}>
                                            {v.pending > 0 ? fmt(v.pending) : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ==================== COMPLIANCE TAB ==================== */}
                {tab === "compliance" && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Xero Integration */}
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div>
                                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#37352F', margin: '0 0 4px' }}>Accounting Integration</h3>
                                    <p style={{ fontSize: 11, color: '#9B9A97', margin: 0 }}>Sync your ledger with Xero for automated bookkeeping</p>
                                </div>
                                <button style={{
                                    padding: '10px 20px', fontSize: 12, fontWeight: 700, borderRadius: 8, border: 'none',
                                    background: '#13B5EA', color: 'white', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}>
                                    Connect to Xero
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                {[
                                    { label: 'Last Sync', value: 'Not connected', color: '#9B9A97' },
                                    { label: 'Invoices Synced', value: '0 / ' + entries.length, color: '#9B9A97' },
                                    { label: 'Status', value: 'Pending Setup', color: '#F59E0B' },
                                ].map(s => (
                                    <div key={s.label} style={{ background: '#FAFAF9', borderRadius: 6, padding: 10 }}>
                                        <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ACRA & IRAS Compliance Checklist */}
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#37352F', margin: '0 0 4px' }}>ACRA & IRAS Compliance Checklist</h3>
                            <p style={{ fontSize: 11, color: '#9B9A97', margin: '0 0 16px' }}>Company regulatory deadlines and filing status for FY2025/26</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[
                                    { task: 'GST F5 Return (Q1 Jan-Mar)', deadline: '30 Apr 2026', status: 'upcoming', category: 'IRAS', desc: 'File quarterly GST return. Output tax minus input tax.' },
                                    { task: 'GST F5 Return (Q4 Oct-Dec)', deadline: '31 Jan 2026', status: 'done', category: 'IRAS', desc: 'Filed on 28 Jan 2026. Net payable $1,230.' },
                                    { task: 'Estimated Chargeable Income (ECI)', deadline: '30 Jun 2026', status: 'upcoming', category: 'IRAS', desc: 'File within 3 months of financial year end.' },
                                    { task: 'Corporate Tax Return (Form C-S)', deadline: '30 Nov 2026', status: 'not_started', category: 'IRAS', desc: 'Annual corporate income tax filing for YA2026.' },
                                    { task: 'Annual Return (AR)', deadline: '30 May 2026', status: 'upcoming', category: 'ACRA', desc: 'File annual return with ACRA. $60 filing fee.' },
                                    { task: 'AGM (Annual General Meeting)', deadline: '30 Jun 2026', status: 'not_started', category: 'ACRA', desc: 'Must be held within 6 months after FYE, or 15 months from last AGM.' },
                                    { task: 'CPF Submissions (Monthly)', deadline: '14th monthly', status: 'done', category: 'CPF', desc: 'Monthly CPF contributions for employees. Auto-deducted.' },
                                    { task: 'IR8A Employee Tax Forms', deadline: '01 Mar 2026', status: 'done', category: 'IRAS', desc: 'Filed employee income forms for YA2026.' },
                                ].map((item, idx) => {
                                    const statusCfg: Record<string, { color: string; bg: string; label: string }> = {
                                        done: { color: '#22C55E', bg: '#F0FDF4', label: 'Done' },
                                        upcoming: { color: '#F59E0B', bg: '#FEF9C3', label: 'Upcoming' },
                                        not_started: { color: '#9B9A97', bg: '#F7F6F3', label: 'Not Started' },
                                        overdue: { color: '#DC2626', bg: '#FEF2F2', label: 'Overdue' },
                                    };
                                    const cfg = statusCfg[item.status] || statusCfg.not_started;
                                    const catCfg: Record<string, { color: string; bg: string }> = {
                                        IRAS: { color: '#DC2626', bg: '#FEF2F2' },
                                        ACRA: { color: '#2563EB', bg: '#EFF6FF' },
                                        CPF: { color: '#7C3AED', bg: '#F5F3FF' },
                                    };
                                    const cc = catCfg[item.category] || { color: '#6B6A67', bg: '#F7F6F3' };
                                    return (
                                        <div key={idx} style={{
                                            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                                            background: '#FAFAF9', borderRadius: 8, border: '1px solid #F5F5F4',
                                            cursor: 'pointer', transition: 'all 0.15s',
                                        }}
                                            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)')}
                                            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                                        >
                                            <div style={{
                                                width: 20, height: 20, borderRadius: '50%', border: `2px solid ${cfg.color}`,
                                                background: item.status === 'done' ? cfg.color : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            }}>
                                                {item.status === 'done' && <span style={{ color: 'white', fontSize: 10, fontWeight: 900 }}>&#10003;</span>}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                                    <span style={{ fontSize: 12, fontWeight: 600, color: item.status === 'done' ? '#9B9A97' : '#37352F', textDecoration: item.status === 'done' ? 'line-through' : 'none' }}>{item.task}</span>
                                                    <span style={{ fontSize: 7, padding: '2px 6px', borderRadius: 3, fontWeight: 700, background: cc.bg, color: cc.color }}>{item.category}</span>
                                                </div>
                                                <div style={{ fontSize: 10, color: '#9B9A97' }}>{item.desc}</div>
                                            </div>
                                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: '#37352F', fontFamily: 'monospace' }}>{item.deadline}</div>
                                                <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 10, fontWeight: 700, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                            {[
                                { label: 'Export GST F5 Report', desc: 'Ready for IRAS e-filing', color: '#DC2626' },
                                { label: 'Generate IR8A Forms', desc: 'Employee income forms', color: '#7C3AED' },
                                { label: 'Download AR Data', desc: 'For ACRA BizFile+', color: '#2563EB' },
                                { label: 'Export to CSV', desc: 'Full ledger download', color: '#37352F' },
                            ].map(action => (
                                <button key={action.label} style={{
                                    background: 'white', borderRadius: 10, padding: 16, border: '1px solid #E9E9E7',
                                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: f,
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = action.color; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E9E9E7'; }}
                                >
                                    <div style={{ fontSize: 12, fontWeight: 700, color: action.color, marginBottom: 4 }}>{action.label}</div>
                                    <div style={{ fontSize: 10, color: '#9B9A97' }}>{action.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ==================== TEAM TAB ==================== */}
                {tab === "team" && (
                    <div>
                        {/* ── PROJECT P&L ── */}
                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 9, fontWeight: 600, color: '#9B9A97', letterSpacing: '0.1em', marginBottom: 10 }}>PROJECT P&L — DETAILED BREAKDOWN</div>
                        {[
                            {
                                name: 'Grace Lim — Landed (Partial)', contract: 120000, designer: 'Rachel Lim', phase: 'Design', status: 'active',
                                team: [{ name: 'Rachel Lim', role: 'Lead Designer' }, { name: 'Alex Teo', role: 'Drafter' }],
                                costs: { materials: 32000, labour: 28000, subcon: 12000, design: 4800, vo: 1200 },
                                analysis: { verdict: 'HIGH PERFORMER', reason: 'Large landed contract with premium pricing. Rachel negotiated well on material costs (sourced from JB for tiles/stone). Subcon rates 15% below market. Design fee earned via percentage model. Only 1 minor VO so far — client is decisive.' },
                            },
                            {
                                name: 'Tan Family — BTO (Completed)', contract: 42000, designer: 'You (Bjorn)', phase: 'Done', status: 'completed',
                                team: [{ name: 'You (Bjorn)', role: 'Lead Designer' }, { name: 'Jenny Koh', role: 'Support' }],
                                costs: { materials: 12500, labour: 9800, subcon: 3200, design: 2400, vo: 600 },
                                analysis: { verdict: 'SOLID', reason: 'Standard BTO, well-executed. Material costs controlled via Roof vendor network. Labour came in under budget due to experienced crew (Ah Hock team). No scope creep — client signed off on specs early. Good reference project.' },
                            },
                            {
                                name: 'Sarah Chen — Condo Reno', contract: 68000, designer: 'Rachel Lim', phase: 'Carpentry', status: 'active',
                                team: [{ name: 'Rachel Lim', role: 'Lead Designer' }, { name: 'Alex Teo', role: 'Drafter' }],
                                costs: { materials: 18500, labour: 12000, subcon: 6800, design: 3800, vo: 1700 },
                                analysis: { verdict: 'ON TRACK', reason: 'Condo reno with good margin. Rachel upsold premium carpentry (+$8k). One VO for added feature wall — correctly charged. CoolAir aircon quote came in 26% above market (flagged in Contractor Benchmarking). Switching aircon vendor could save $1,200.' },
                            },
                            {
                                name: 'Mr & Mrs Tan — 4-Room BTO', contract: 45000, designer: 'You (Bjorn)', phase: 'Tiling', status: 'active',
                                team: [{ name: 'You (Bjorn)', role: 'Lead Designer' }, { name: 'Alex Teo', role: 'Drafter' }],
                                costs: { materials: 13200, labour: 10500, subcon: 4200, design: 2500, vo: 800 },
                                analysis: { verdict: 'HEALTHY', reason: 'Bread-and-butter 4-room BTO. Margin healthy at 31%. WiseWork tiling slightly above market (+12%) but quality is reliable. Design fees standard. No red flags — maintain current trajectory.' },
                            },
                            {
                                name: 'David Loh — 5-Room BTO', contract: 52000, designer: 'You (Bjorn)', phase: 'Handover', status: 'completing',
                                team: [{ name: 'You (Bjorn)', role: 'Lead Designer' }, { name: 'Jenny Koh', role: 'Support' }],
                                costs: { materials: 15200, labour: 11800, subcon: 4800, design: 2800, vo: 1000 },
                                analysis: { verdict: 'WRAPPING UP', reason: 'Almost done — handover this week. Margin at 31%. One VO for additional power point ($1k) — properly documented and charged. Labour costs slightly high due to overtime for plumbing rework (PipeMaster issue). Consider reviewing PipeMaster reliability.' },
                            },
                            {
                                name: 'Kevin Ng — Resale HDB', contract: 35000, designer: 'Jenny Koh', phase: 'M&E', status: 'active',
                                team: [{ name: 'Jenny Koh', role: 'Lead Designer' }, { name: 'You (Bjorn)', role: 'Oversight' }],
                                costs: { materials: 12800, labour: 9200, subcon: 4500, design: 2200, vo: 800 },
                                analysis: { verdict: 'THIN MARGIN', reason: 'Resale HDB typically lower margin. Contract was competitively priced to win the bid. Jenny is learning — requiring more oversight time from Bjorn (hidden cost not captured). Material costs reasonable. Subcon slightly high for M&E — could negotiate better for next resale project.' },
                            },
                            {
                                name: 'Amy Teo — Studio Apt', contract: 22000, designer: 'Michelle Ng', phase: 'Delayed', status: 'bleeding',
                                team: [{ name: 'Michelle Ng', role: 'Lead Designer' }, { name: 'You (Bjorn)', role: 'Rescue' }],
                                costs: { materials: 8500, labour: 7200, subcon: 4800, design: 2000, vo: 2300 },
                                analysis: { verdict: 'BLEEDING — URGENT', reason: 'Project is LOSING money. Root causes: (1) Michelle underquoted the contract by ~$5k vs comparable studios. (2) 3 VOs totalling $2,300 were NOT charged to client — Michelle absorbed them. (3) Subcon costs inflated because Michelle gave unclear specs, causing rework. (4) Project delayed 2 weeks — client threatening penalty. (5) Bjorn had to step in for rescue, adding hidden management cost. RECOMMENDATION: Complete project, absorb loss, do not assign Michelle to solo projects until training complete.' },
                            },
                        ].map((proj, pi) => {
                            const totalCosts = proj.costs.materials + proj.costs.labour + proj.costs.subcon + proj.costs.design + proj.costs.vo;
                            const profit = proj.contract - totalCosts;
                            const margin = (profit / proj.contract * 100);
                            const isBleeding = profit < 0;
                            return (
                                <div key={proj.name} style={{ background: 'white', borderRadius: 10, border: `1px solid ${isBleeding ? '#FCA5A5' : '#E9E9E7'}`, marginBottom: 12, overflow: 'hidden' }}>
                                    {/* Header */}
                                    <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F3F2' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>{proj.name}</div>
                                                <div style={{ fontSize: 10, color: '#9B9A97' }}>Phase: {proj.phase} · Designer: {proj.designer}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 14, fontWeight: 800, color: isBleeding ? '#DC2626' : '#16A34A' }}>{isBleeding ? '' : '+'}{fmt(profit)}</div>
                                                <div style={{ fontSize: 9, color: '#9B9A97' }}>{margin.toFixed(1)}% margin</div>
                                            </div>
                                            <span style={{ fontSize: 8, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: isBleeding ? '#FEE2E2' : margin >= 30 ? '#DCFCE7' : margin >= 15 ? '#EFF6FF' : '#FFFBEB', color: isBleeding ? '#DC2626' : margin >= 30 ? '#166534' : margin >= 15 ? '#2563EB' : '#92400E' }}>
                                                {proj.analysis.verdict}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Team */}
                                    <div style={{ padding: '8px 16px', borderBottom: '1px solid #F3F3F2', display: 'flex', gap: 16, alignItems: 'center' }}>
                                        <span style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase' }}>Team</span>
                                        {proj.team.map(t => (
                                            <span key={t.name} style={{ fontSize: 10, color: '#6B6A67' }}>{t.name} <span style={{ fontSize: 9, color: '#D4D4D4' }}>({t.role})</span></span>
                                        ))}
                                    </div>

                                    {/* Cost Breakdown */}
                                    <div style={{ padding: '10px 16px', borderBottom: '1px solid #F3F3F2' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr', gap: 8, alignItems: 'end' }}>
                                            {[
                                                { label: 'Contract', value: proj.contract, color: '#37352F', bold: true },
                                                { label: 'Materials', value: proj.costs.materials, color: '#6B6A67', bold: false },
                                                { label: 'Labour', value: proj.costs.labour, color: '#6B6A67', bold: false },
                                                { label: 'Subcon', value: proj.costs.subcon, color: '#6B6A67', bold: false },
                                                { label: 'Design Fee', value: proj.costs.design, color: '#6B6A67', bold: false },
                                                { label: 'VOs', value: proj.costs.vo, color: proj.costs.vo > 1500 ? '#DC2626' : '#6B6A67', bold: false },
                                                { label: 'Profit', value: profit, color: isBleeding ? '#DC2626' : '#16A34A', bold: true },
                                            ].map(c => (
                                                <div key={c.label}>
                                                    <div style={{ fontSize: 8, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', marginBottom: 2 }}>{c.label}</div>
                                                    <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, fontWeight: c.bold ? 700 : 400, color: c.color }}>{fmt(c.value)}</div>
                                                    {c.label !== 'Contract' && c.label !== 'Profit' && (
                                                        <div style={{ marginTop: 2, height: 3, borderRadius: 1.5, background: '#F3F3F2' }}>
                                                            <div style={{ width: `${(c.value / proj.contract) * 100}%`, height: '100%', borderRadius: 1.5, background: c.color === '#DC2626' ? '#EF4444' : '#D4D4D4' }} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* AI Analysis */}
                                    <div style={{ padding: '10px 16px', background: isBleeding ? '#FEF2F2' : '#FAFAF9' }}>
                                        <div style={{ fontSize: 8, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', marginBottom: 4 }}>Analysis</div>
                                        <div style={{ fontSize: 10, color: isBleeding ? '#991B1B' : '#6B6A67', lineHeight: '1.5' }}>{proj.analysis.reason}</div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Portfolio Summary */}
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 16, marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                            {[
                                { label: 'Total Contract Value', value: fmt(384000), color: '#37352F' },
                                { label: 'Total Costs', value: fmt(270400), color: '#DC2626' },
                                { label: 'Portfolio Profit', value: '+' + fmt(113600), color: '#16A34A' },
                                { label: 'Avg Margin', value: '29.6%', color: '#16A34A' },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 8, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                                    <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* ── DESIGNER PROFITABILITY ── */}
                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 9, fontWeight: 600, color: '#9B9A97', letterSpacing: '0.1em', marginBottom: 10 }}>DESIGNER PROFITABILITY</div>
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden', marginBottom: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr 0.8fr 1.2fr', padding: '10px 16px', borderBottom: '1px solid #E9E9E7', background: '#FAFAF9' }}>
                                {['Designer', 'Revenue', 'Costs', 'Profit', 'Margin', 'Commission', 'Verdict'].map(h => (
                                    <div key={h} style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                                ))}
                            </div>
                            {[
                                { name: 'Rachel Lim', role: 'Senior ID', revenue: 125000, costs: 78000, commission: 3600, type: 'commission', rate: '8%', morale: 92, culture: 88, projects: 4, clientRating: 4.7, verdict: 'star' },
                                { name: 'Bjorn (You)', role: 'Principal', revenue: 245000, costs: 142000, commission: 0, type: 'salaried', rate: '$6,500/m', morale: 78, culture: 95, projects: 6, clientRating: 4.9, verdict: 'star' },
                                { name: 'Jenny Koh', role: 'Junior ID', revenue: 55000, costs: 48000, commission: 0, type: 'salaried', rate: '$3,200/m', morale: 85, culture: 90, projects: 2, clientRating: 4.3, verdict: 'grow' },
                                { name: 'Alex Teo', role: 'Drafter', revenue: 0, costs: 32400, commission: 0, type: 'salaried', rate: '$2,700/m', morale: 60, culture: 55, projects: 0, clientRating: 0, verdict: 'watch' },
                                { name: 'Michelle Ng', role: 'Junior ID', revenue: 38000, costs: 41000, commission: 0, type: 'salaried', rate: '$3,000/m', morale: 45, culture: 40, projects: 1, clientRating: 3.1, verdict: 'risk' },
                            ].sort((a, b) => (b.revenue - b.costs) - (a.revenue - a.costs)).map((d, i, arr) => {
                                const profit = d.revenue - d.costs;
                                const margin = d.revenue > 0 ? (profit / d.revenue * 100) : -100;
                                return (
                                    <div key={d.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr 0.8fr 1.2fr', padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid #F3F3F2' : 'none', alignItems: 'center', background: d.verdict === 'risk' ? '#FEF2F2' : 'transparent' }}>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{d.name}</div>
                                            <div style={{ fontSize: 10, color: '#9B9A97' }}>{d.role} · {d.type === 'commission' ? `${d.rate} commission` : d.rate}</div>
                                        </div>
                                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, fontWeight: 600, color: '#37352F' }}>{fmt(d.revenue)}</div>
                                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: '#DC2626' }}>{fmt(d.costs)}</div>
                                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, fontWeight: 700, color: profit >= 0 ? '#16A34A' : '#DC2626' }}>{profit >= 0 ? '+' : ''}{fmt(profit)}</div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: margin >= 20 ? '#16A34A' : margin >= 0 ? '#D97706' : '#DC2626' }}>{margin.toFixed(0)}%</div>
                                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: '#9B9A97' }}>{d.commission > 0 ? fmt(d.commission) : '—'}</div>
                                        <div>
                                            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: d.verdict === 'star' ? '#ECFDF5' : d.verdict === 'grow' ? '#EFF6FF' : d.verdict === 'watch' ? '#FFFBEB' : '#FEF2F2', color: d.verdict === 'star' ? '#059669' : d.verdict === 'grow' ? '#2563EB' : d.verdict === 'watch' ? '#D97706' : '#DC2626' }}>
                                                {d.verdict === 'star' ? 'TOP PERFORMER' : d.verdict === 'grow' ? 'GROWING' : d.verdict === 'watch' ? 'WATCH' : 'AT RISK'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── DESIGNER EXPENSE CLAIMS ── */}
                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 9, fontWeight: 600, color: '#9B9A97', letterSpacing: '0.1em', marginBottom: 10 }}>DESIGNER EXPENSE CLAIMS</div>
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden', marginBottom: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 0.7fr 0.7fr 0.7fr 0.7fr 0.8fr 0.8fr 0.8fr', padding: '10px 16px', borderBottom: '1px solid #E9E9E7', background: '#FAFAF9' }}>
                                {['Designer', 'Project', 'Transport', 'Materials', 'Meals', 'Parking', 'Total', 'Status', 'Reimburse'].map(h => (
                                    <div key={h} style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                                ))}
                            </div>
                            {[
                                { designer: 'Rachel Lim', project: 'Grace Lim — Landed', transport: 180, materials: 350, meals: 45, parking: 32, status: 'approved', date: '4 Mar' },
                                { designer: 'Rachel Lim', project: 'Sarah Chen — Condo', transport: 95, materials: 120, meals: 28, parking: 16, status: 'approved', date: '5 Mar' },
                                { designer: 'You (Bjorn)', project: 'Mr & Mrs Tan — BTO', transport: 45, materials: 0, meals: 12, parking: 8, status: 'approved', date: '6 Mar' },
                                { designer: 'You (Bjorn)', project: 'David Loh — BTO', transport: 38, materials: 85, meals: 15, parking: 8, status: 'approved', date: '5 Mar' },
                                { designer: 'Jenny Koh', project: 'Kevin Ng — Resale', transport: 120, materials: 280, meals: 55, parking: 24, status: 'pending', date: '7 Mar' },
                                { designer: 'Michelle Ng', project: 'Amy Teo — Studio', transport: 210, materials: 480, meals: 85, parking: 48, status: 'flagged', date: '7 Mar' },
                                { designer: 'Alex Teo', project: 'Multiple (Drafting)', transport: 25, materials: 0, meals: 18, parking: 0, status: 'pending', date: '7 Mar' },
                            ].map((c, i, arr) => {
                                const total = c.transport + c.materials + c.meals + c.parking;
                                const isHigh = total > 500;
                                return (
                                    <div key={c.designer + c.project} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 0.7fr 0.7fr 0.7fr 0.7fr 0.8fr 0.8fr 0.8fr', padding: '10px 16px', borderBottom: i < arr.length - 1 ? '1px solid #F3F3F2' : 'none', alignItems: 'center', background: c.status === 'flagged' ? '#FEF2F2' : 'transparent' }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: '#37352F' }}>{c.designer}</div>
                                        <div style={{ fontSize: 10, color: '#6B6A67' }}>{c.project}</div>
                                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, color: '#6B6A67' }}>{c.transport > 0 ? '$' + c.transport : '\u2014'}</div>
                                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, color: c.materials > 300 ? '#DC2626' : '#6B6A67' }}>{c.materials > 0 ? '$' + c.materials : '\u2014'}</div>
                                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, color: '#6B6A67' }}>{c.meals > 0 ? '$' + c.meals : '\u2014'}</div>
                                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, color: '#6B6A67' }}>{c.parking > 0 ? '$' + c.parking : '\u2014'}</div>
                                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, fontWeight: 700, color: isHigh ? '#DC2626' : '#37352F' }}>${total}</div>
                                        <div>
                                            <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: c.status === 'approved' ? '#DCFCE7' : c.status === 'pending' ? '#FEF3C7' : '#FEE2E2', color: c.status === 'approved' ? '#166534' : c.status === 'pending' ? '#92400E' : '#991B1B' }}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            {c.status === 'approved' && <span style={{ fontSize: 9, color: '#059669', fontWeight: 600 }}>Paid {c.date}</span>}
                                            {c.status === 'pending' && <button style={{ fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 3, border: '1px solid #E9E9E7', background: '#37352F', color: 'white', cursor: 'pointer' }}>Approve</button>}
                                            {c.status === 'flagged' && <span style={{ fontSize: 9, color: '#DC2626', fontWeight: 700 }}>Review</span>}
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Totals */}
                            <div style={{ padding: '10px 16px', background: '#FAFAF9', borderTop: '2px solid #E9E9E7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: 20 }}>
                                    <div><span style={{ fontSize: 8, color: '#9B9A97', textTransform: 'uppercase' }}>This month</span> <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, fontWeight: 700, color: '#37352F', marginLeft: 4 }}>${180 + 95 + 45 + 38 + 120 + 210 + 25 + 350 + 120 + 0 + 85 + 280 + 480 + 0 + 45 + 28 + 12 + 15 + 55 + 85 + 18 + 32 + 16 + 8 + 8 + 24 + 48 + 0}</span></div>
                                    <div><span style={{ fontSize: 8, color: '#9B9A97', textTransform: 'uppercase' }}>Pending</span> <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, fontWeight: 700, color: '#D97706', marginLeft: 4 }}>${120 + 280 + 55 + 24 + 25 + 0 + 18 + 0}</span></div>
                                    <div><span style={{ fontSize: 8, color: '#9B9A97', textTransform: 'uppercase' }}>Flagged</span> <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, fontWeight: 700, color: '#DC2626', marginLeft: 4 }}>${210 + 480 + 85 + 48}</span></div>
                                </div>
                                <div style={{ fontSize: 9, color: '#991B1B', fontWeight: 600 }}>Michelle&apos;s claims are 3.2x higher than team avg — review material purchases</div>
                            </div>
                        </div>

                        {/* ── CONTRACTOR COST BENCHMARKING ── */}
                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 9, fontWeight: 600, color: '#9B9A97', letterSpacing: '0.1em', marginBottom: 10 }}>CONTRACTOR COST BENCHMARKING</div>
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden', marginBottom: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 0.8fr 1.2fr', padding: '10px 16px', borderBottom: '1px solid #E9E9E7', background: '#FAFAF9' }}>
                                {['Contractor', 'Trade', 'Your Rate', 'Market Avg', 'Diff', 'Action'].map(h => (
                                    <div key={h} style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                                ))}
                            </div>
                            {[
                                { vendor: 'WiseWork Tiling', vendorCode: 'WW-001', trade: 'Tiling', yourRate: 18, marketAvg: 16, unit: '/sqm' },
                                { vendor: 'PipeMaster', vendorCode: 'PM-001', trade: 'Plumbing', yourRate: 850, marketAvg: 780, unit: '/set' },
                                { vendor: 'SparkTech', vendorCode: 'ST-001', trade: 'Electrical', yourRate: 65, marketAvg: 68, unit: '/pt' },
                                { vendor: 'CoolAir SG', vendorCode: 'CA-001', trade: 'Aircon', yourRate: 1200, marketAvg: 950, unit: '/unit' },
                                { vendor: 'J&J Carpentry', vendorCode: 'JJ-001', trade: 'Carpentry', yourRate: 120, marketAvg: 115, unit: '/sqft' },
                                { vendor: 'Hoe Kee Trading', vendorCode: 'HK-001', trade: 'Materials', yourRate: 42, marketAvg: 42, unit: '/sheet' },
                            ].map((c, i, arr) => {
                                const diff = ((c.yourRate - c.marketAvg) / c.marketAvg * 100);
                                const isOvercharging = diff > 10;
                                const isFair = diff >= -5 && diff <= 10;
                                return (
                                    <div key={c.vendor} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 0.8fr 1.2fr', padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid #F3F3F2' : 'none', alignItems: 'center', background: isOvercharging ? '#FEF2F2' : 'transparent' }}>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{c.vendor}</div>
                                            <div style={{ fontSize: 10, color: '#9B9A97', fontFamily: "'SF Mono', monospace" }}>{c.vendorCode}</div>
                                        </div>
                                        <div style={{ fontSize: 12, color: '#6B6A67' }}>{c.trade}</div>
                                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, fontWeight: 600 }}>S${c.yourRate}{c.unit}</div>
                                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: '#9B9A97' }}>S${c.marketAvg}{c.unit}</div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: isOvercharging ? '#DC2626' : isFair ? '#16A34A' : '#D97706' }}>
                                            {diff > 0 ? '+' : ''}{diff.toFixed(0)}%
                                        </div>
                                        <div>
                                            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: isOvercharging ? '#FEE2E2' : isFair ? '#ECFDF5' : '#EFF6FF', color: isOvercharging ? '#DC2626' : isFair ? '#059669' : '#2563EB' }}>
                                                {isOvercharging ? 'OVERCHARGING' : isFair ? 'FAIR RATE' : 'BELOW MKT'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── HR / CULTURE FIT / MORALE ── */}
                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 9, fontWeight: 600, color: '#9B9A97', letterSpacing: '0.1em', marginBottom: 10 }}>HR DASHBOARD — MORALE, CULTURE FIT, AND REVIEWS</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                            {[
                                { name: 'Rachel Lim', role: 'Senior ID', morale: 92, culture: 88, clientRating: 4.7, vendorRating: 4.2, verdict: 'Keep & promote', clientReview: 'Very responsive, great taste.', vendorReview: 'Clear specs, pays on time.', type: 'commission' },
                                { name: 'Jenny Koh', role: 'Junior ID', morale: 85, culture: 90, clientRating: 4.3, vendorRating: 3.8, verdict: 'Invest & train', clientReview: 'Enthusiastic but needs guidance.', vendorReview: 'Specs sometimes unclear.', type: 'salaried' },
                                { name: 'Alex Teo', role: 'Drafter', morale: 60, culture: 55, clientRating: 0, vendorRating: 0, verdict: 'Discuss role fit', clientReview: 'N/A (no client contact)', vendorReview: 'N/A (support role)', type: 'salaried' },
                                { name: 'Michelle Ng', role: 'Junior ID', morale: 45, culture: 40, clientRating: 3.1, vendorRating: 2.4, verdict: 'PERFORMANCE REVIEW', clientReview: 'Unresponsive, missed deadlines.', vendorReview: 'Specs always wrong. Late payer.', type: 'salaried' },
                            ].map(p => (
                                <div key={p.name} style={{ background: 'white', borderRadius: 10, border: `1px solid ${p.morale < 50 ? '#FCA5A5' : '#E9E9E7'}`, padding: 16, position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>{p.name}</div>
                                            <div style={{ fontSize: 10, color: '#9B9A97' }}>{p.role} · {p.type}</div>
                                        </div>
                                        <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: p.morale >= 80 ? '#ECFDF5' : p.morale >= 60 ? '#FFFBEB' : '#FEF2F2', color: p.morale >= 80 ? '#059669' : p.morale >= 60 ? '#D97706' : '#DC2626' }}>
                                            {p.verdict}
                                        </span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
                                        <div style={{ background: '#FAFAF9', borderRadius: 6, padding: '6px 8px' }}>
                                            <div style={{ fontSize: 8, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', marginBottom: 2 }}>Morale</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#F3F3F2' }}>
                                                    <div style={{ width: `${p.morale}%`, height: '100%', borderRadius: 2, background: p.morale >= 80 ? '#22C55E' : p.morale >= 60 ? '#F59E0B' : '#EF4444' }} />
                                                </div>
                                                <span style={{ fontSize: 10, fontWeight: 700, color: p.morale >= 80 ? '#22C55E' : p.morale >= 60 ? '#F59E0B' : '#EF4444' }}>{p.morale}%</span>
                                            </div>
                                        </div>
                                        <div style={{ background: '#FAFAF9', borderRadius: 6, padding: '6px 8px' }}>
                                            <div style={{ fontSize: 8, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', marginBottom: 2 }}>Culture Fit</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#F3F3F2' }}>
                                                    <div style={{ width: `${p.culture}%`, height: '100%', borderRadius: 2, background: p.culture >= 80 ? '#22C55E' : p.culture >= 60 ? '#F59E0B' : '#EF4444' }} />
                                                </div>
                                                <span style={{ fontSize: 10, fontWeight: 700, color: p.culture >= 80 ? '#22C55E' : p.culture >= 60 ? '#F59E0B' : '#EF4444' }}>{p.culture}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Reviews loop */}
                                    <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', marginBottom: 4 }}>REVIEWS</div>
                                    {[
                                        { from: 'Client', rating: p.clientRating, review: p.clientReview },
                                        { from: 'Vendor', rating: p.vendorRating, review: p.vendorReview },
                                    ].map(r => (
                                        <div key={r.from} style={{ padding: '4px 0', borderBottom: '1px solid #F5F5F4', display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <span style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', minWidth: 40 }}>{r.from}</span>
                                            {r.rating > 0 ? (
                                                <span style={{ fontSize: 10, fontWeight: 700, color: r.rating >= 4 ? '#059669' : r.rating >= 3 ? '#D97706' : '#DC2626' }}>{r.rating}</span>
                                            ) : (
                                                <span style={{ fontSize: 10, color: '#D4D4D4' }}>—</span>
                                            )}
                                            <span style={{ fontSize: 9, color: '#6B6A67', fontStyle: 'italic', flex: 1 }}>&ldquo;{r.review}&rdquo;</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* ── MOM COMPLIANCE ── */}
                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 9, fontWeight: 600, color: '#9B9A97', letterSpacing: '0.1em', marginBottom: 10 }}>MOM COMPLIANCE — MINISTRY OF MANPOWER</div>
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 16, marginBottom: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {[
                                    { item: 'CPF Contributions', desc: 'Employer 17% + Employee 20% for citizens/PRs', status: 'compliant', due: 'Monthly (14th)' },
                                    { item: 'SDL (Skills Development Levy)', desc: '0.25% of gross salary or min $2/worker', status: 'compliant', due: 'Monthly' },
                                    { item: 'Annual Leave (EA)', desc: 'Min 7 days (Year 1) up to 14 days (Year 8+)', status: 'compliant', due: 'Ongoing' },
                                    { item: 'Sick Leave', desc: '14 days outpatient + 60 days hospitalisation', status: 'compliant', due: 'Ongoing' },
                                    { item: 'Overtime Pay', desc: 'Non-workman up to $2,600 basic: 1.5× rate', status: 'review', due: 'Per payroll' },
                                    { item: 'Work Permit Quota', desc: 'S-Pass: 10% DRC ratio for services', status: 'compliant', due: 'Annual' },
                                    { item: 'Foreign Worker Levy', desc: 'S-Pass tier 1: $450/mth, WP: $300-$700', status: 'compliant', due: 'Monthly' },
                                    { item: 'Employment Contracts', desc: 'Written KETs required within 14 days', status: 'action', due: '2 pending' },
                                    { item: 'Payslip Issuance', desc: 'Itemised payslips within 3 working days', status: 'compliant', due: 'Per payroll' },
                                    { item: 'Maternity/Paternity', desc: '16 wk maternity, 2 wk paternity (govt-paid)', status: 'na', due: 'N/A currently' },
                                ].map(c => (
                                    <div key={c.item} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #F3F3F2', background: c.status === 'action' ? '#FEF2F2' : c.status === 'review' ? '#FFFBEB' : '#FAFAF9' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                            <span style={{ fontSize: 11, fontWeight: 600, color: '#37352F' }}>{c.item}</span>
                                            <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 6px', borderRadius: 3, background: c.status === 'compliant' ? '#DCFCE7' : c.status === 'review' ? '#FEF3C7' : c.status === 'action' ? '#FEE2E2' : '#F3F4F6', color: c.status === 'compliant' ? '#166534' : c.status === 'review' ? '#92400E' : c.status === 'action' ? '#991B1B' : '#6B7280' }}>
                                                {c.status === 'compliant' ? 'OK' : c.status === 'review' ? 'REVIEW' : c.status === 'action' ? 'ACTION' : 'N/A'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 9, color: '#9B9A97', marginBottom: 2 }}>{c.desc}</div>
                                        <div style={{ fontSize: 8, color: '#D4D4D4', fontFamily: "'SF Mono', monospace" }}>{c.due}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── LEGAL DOCUMENTS & CONTRACTS ── */}
                        <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 9, fontWeight: 600, color: '#9B9A97', letterSpacing: '0.1em', marginBottom: 10 }}>LEGAL DOCUMENTS AND CONTRACTS</div>
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden', marginBottom: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 0.8fr 1fr', padding: '10px 16px', borderBottom: '1px solid #E9E9E7', background: '#FAFAF9' }}>
                                {['Document', 'Party', 'Type', 'Status', 'Expiry', 'Action'].map(h => (
                                    <div key={h} style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                                ))}
                            </div>
                            {[
                                { doc: 'Employment Contract — Rachel Lim', party: 'Rachel Lim (Senior ID)', type: 'Employment', status: 'signed', expiry: 'Permanent', action: 'View' },
                                { doc: 'Employment Contract — Jenny Koh', party: 'Jenny Koh (Junior ID)', type: 'Employment', status: 'signed', expiry: 'Permanent', action: 'View' },
                                { doc: 'Employment Contract — Alex Teo', party: 'Alex Teo (Drafter)', type: 'Employment', status: 'pending', expiry: 'DUE: 14 Mar', action: 'Send' },
                                { doc: 'Employment Contract — Michelle Ng', party: 'Michelle Ng (Junior ID)', type: 'Employment', status: 'pending', expiry: 'DUE: 14 Mar', action: 'Send' },
                                { doc: 'Vendor Agreement — WiseWork Tiling', party: 'WiseWork (WW-001)', type: 'Vendor', status: 'signed', expiry: '31 Dec 2026', action: 'View' },
                                { doc: 'Vendor Agreement — PipeMaster', party: 'PipeMaster (PM-001)', type: 'Vendor', status: 'signed', expiry: '30 Jun 2026', action: 'View' },
                                { doc: 'Vendor Agreement — CoolAir SG', party: 'CoolAir (CA-001)', type: 'Vendor', status: 'expired', expiry: 'EXPIRED', action: 'Renew' },
                                { doc: 'Public Liability Insurance', party: 'AIG Singapore', type: 'Insurance', status: 'active', expiry: '15 Aug 2026', action: 'View' },
                                { doc: 'Work Injury Compensation', party: 'NTUC Income', type: 'Insurance', status: 'active', expiry: '1 Apr 2027', action: 'View' },
                                { doc: 'Client Agreement — Tan BTO', party: 'Mr & Mrs Tan', type: 'Client', status: 'signed', expiry: 'Project-end', action: 'View' },
                                { doc: 'NDA — Freelance Drafter', party: 'Ahmad Freelance', type: 'NDA', status: 'pending', expiry: 'DUE: 10 Mar', action: 'Send' },
                                { doc: 'BCA Contractor License', party: 'BCA Singapore', type: 'License', status: 'active', expiry: '31 Dec 2026', action: 'View' },
                            ].map((d, i, arr) => (
                                <div key={d.doc} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 0.8fr 1fr', padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid #F3F3F2' : 'none', alignItems: 'center', background: d.status === 'expired' ? '#FEF2F2' : d.status === 'pending' ? '#FFFBEB' : 'transparent' }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{d.doc}</div>
                                    <div style={{ fontSize: 11, color: '#6B6A67' }}>{d.party}</div>
                                    <div><span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3, background: d.type === 'Employment' ? '#EFF6FF' : d.type === 'Vendor' ? '#FEF3C7' : d.type === 'Insurance' ? '#ECFDF5' : d.type === 'Client' ? '#F5F3FF' : d.type === 'NDA' ? '#FFF7ED' : '#F3F4F6', color: d.type === 'Employment' ? '#2563EB' : d.type === 'Vendor' ? '#92400E' : d.type === 'Insurance' ? '#059669' : d.type === 'Client' ? '#7C3AED' : d.type === 'NDA' ? '#C2410C' : '#374151' }}>{d.type}</span></div>
                                    <div><span style={{ fontSize: 8, fontWeight: 700, padding: '1px 6px', borderRadius: 3, background: d.status === 'signed' || d.status === 'active' ? '#DCFCE7' : d.status === 'pending' ? '#FEF3C7' : '#FEE2E2', color: d.status === 'signed' || d.status === 'active' ? '#166534' : d.status === 'pending' ? '#92400E' : '#991B1B' }}>{d.status.toUpperCase()}</span></div>
                                    <div style={{ fontSize: 10, fontWeight: 600, color: d.expiry.includes('DUE') || d.expiry === 'EXPIRED' ? '#DC2626' : '#9B9A97' }}>{d.expiry}</div>
                                    <div><button style={{ fontSize: 9, fontWeight: 600, padding: '3px 10px', borderRadius: 4, border: '1px solid #E9E9E7', background: d.action === 'Send' || d.action === 'Renew' ? '#37352F' : 'white', color: d.action === 'Send' || d.action === 'Renew' ? 'white' : '#6B6A67', cursor: 'pointer' }}>{d.action}</button></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
