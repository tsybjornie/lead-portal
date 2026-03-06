"use client";

import { useState, useMemo } from "react";

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
}

type TabView = "transactions" | "summary" | "gst" | "vendors";

// ============================================================
// CONSTANTS
// ============================================================

const GST_RATE = 0.09; // Singapore 9% GST

const EXPENSE_CATEGORIES = [
    "Materials", "Labour", "Subcontractor", "Transport",
    "Equipment Rental", "Permits & Submissions", "Design Fee",
    "Contingency", "Site Protection", "Temporary Services",
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
    { id: "tx-010", date: "2026-02-20", description: "Marine plywood 18mm × 40 sheets", category: "Materials", type: "expense", status: "paid", amount: 3400, gstAmount: 306, totalAmount: 3706, vendorCode: "SL-001", vendorName: "SinLec Hardware", tradeCategory: "carpentry", invoiceRef: "SL-INV-8821", isGstRegistered: true, duty: "vendor", supplyType: "supply" },
    { id: "tx-011", date: "2026-02-22", description: "Niro Granite GHQ03 — 600×600mm floor tiles (96 sqft kitchen)", category: "Materials", type: "expense", status: "paid", amount: 403, gstAmount: 36.27, totalAmount: 439.27, vendorCode: "HF-001", vendorName: "Hafary Gallery", tradeCategory: "tiling", invoiceRef: "HF-INV-11234", isGstRegistered: true, duty: "vendor", supplyType: "supply" },
    { id: "tx-012", date: "2026-02-25", description: "Blum Aventos HK-S soft-close × 8 sets", category: "Materials", type: "expense", status: "paid", amount: 360, gstAmount: 32.40, totalAmount: 392.40, vendorCode: "BL-001", vendorName: "Blum SG", tradeCategory: "carpentry", invoiceRef: "BL-INV-5561", isGstRegistered: true, duty: "vendor", supplyType: "supply" },
    { id: "tx-013", date: "2026-03-01", description: "SIKA waterproofing membrane — master bath + common bath", category: "Materials", type: "expense", status: "paid", amount: 580, gstAmount: 52.20, totalAmount: 632.20, vendorCode: "NP-001", vendorName: "Nippon SG", tradeCategory: "waterproofing", invoiceRef: "NP-INV-3302", isGstRegistered: true, duty: "vendor", supplyType: "supply" },
    // EXPENSES - Labour (install)
    { id: "tx-020", date: "2026-02-28", description: "Demolition works — whole unit hacking + disposal", category: "Labour", type: "expense", status: "paid", amount: 5100, gstAmount: 0, totalAmount: 5100, vendorCode: "WW-001", vendorName: "WoodWork SG (Ahmad)", tradeCategory: "demolition", isGstRegistered: false, duty: "vendor", supplyType: "install" },
    { id: "tx-021", date: "2026-03-05", description: "Tiling labour — kitchen floor + backsplash (herringbone)", category: "Labour", type: "expense", status: "pending", amount: 2880, gstAmount: 0, totalAmount: 2880, vendorCode: "WW-001", vendorName: "WoodWork SG (Ahmad)", tradeCategory: "tiling", invoiceRef: "WW-CLM-042", isGstRegistered: false, duty: "vendor", supplyType: "install" },
    { id: "tx-022", date: "2026-03-08", description: "Carpentry — kitchen cabinets fabrication & install", category: "Labour", type: "expense", status: "scheduled", amount: 8500, gstAmount: 0, totalAmount: 8500, vendorCode: "WW-001", vendorName: "WoodWork SG (Ahmad)", tradeCategory: "carpentry", isGstRegistered: false, duty: "vendor", supplyType: "install" },
    { id: "tx-023", date: "2026-03-10", description: "Electrical rewiring — 32 points incl. DB upgrade", category: "Labour", type: "expense", status: "scheduled", amount: 3200, gstAmount: 0, totalAmount: 3200, vendorCode: "SP-001", vendorName: "Sparks Electrical (Leong)", tradeCategory: "electrical", isGstRegistered: false, duty: "vendor", supplyType: "install" },
    // EXPENSES - Admin
    { id: "tx-030", date: "2026-02-18", description: "HDB renovation permit — BCA submission", category: "Permits & Submissions", type: "expense", status: "paid", amount: 300, gstAmount: 0, totalAmount: 300, duty: "id" },
    { id: "tx-031", date: "2026-02-17", description: "Site protection — corridor & lift lobby", category: "Site Protection", type: "expense", status: "paid", amount: 450, gstAmount: 0, totalAmount: 450, vendorCode: "WW-001", vendorName: "WoodWork SG (Ahmad)", duty: "vendor" },
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
        const map = new Map<string, { code: string; name: string; total: number; paid: number; pending: number; trades: Set<string>; count: number }>();
        entries.filter(e => e.type === "expense" && e.vendorCode).forEach(e => {
            const key = e.vendorCode!;
            const existing = map.get(key) || { code: key, name: e.vendorName || key, total: 0, paid: 0, pending: 0, trades: new Set<string>(), count: 0 };
            existing.total += e.totalAmount;
            existing.count++;
            if (e.status === "paid") existing.paid += e.totalAmount;
            else existing.pending += e.totalAmount;
            if (e.tradeCategory) existing.trades.add(e.tradeCategory);
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
            {/* HEADER */}
            <div style={{
                position: "sticky", top: 0, zIndex: 50,
                background: "rgba(250,250,249,0.92)", backdropFilter: "blur(12px)",
                borderBottom: "1px solid #E9E9E7", padding: "12px 24px",
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <a href="/hub" style={{ fontSize: 18, fontWeight: 800, color: "#37352F", textDecoration: "none" }}>Roof</a>
                        <span style={{ color: "#E9E9E7" }}>|</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#37352F" }}>Project Ledger</span>
                        <span style={{ fontSize: 10, fontWeight: 500, color: "#9B9A97", background: "#F7F6F3", padding: "3px 8px", borderRadius: 4 }}>
                            Holland V Condo · QO1
                        </span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button style={{
                            fontSize: 11, fontWeight: 600, padding: "6px 14px", borderRadius: 6,
                            border: "1px solid #E9E9E7", background: "white", cursor: "pointer",
                        }}>Export CSV</button>
                        <button style={{
                            fontSize: 11, fontWeight: 600, padding: "6px 14px", borderRadius: 6,
                            border: "none", background: "#37352F", color: "white", cursor: "pointer",
                        }}>+ Add Entry</button>
                    </div>
                </div>
            </div>

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
                            border: "1px solid #E9E9E7",
                        }}>
                            <div style={{ fontSize: 10, fontWeight: 600, color: "#9B9A97", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                                {card.label}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: card.color, fontFamily: "'SF Mono', monospace" }}>
                                {card.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* TABS */}
                <div style={{ display: "flex", gap: 2, marginBottom: 20, background: "#F7F6F3", borderRadius: 8, padding: 3 }}>
                    {(["transactions", "summary", "gst", "vendors"] as TabView[]).map(t => (
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
                            {t === "gst" ? "GST / IRAS" : t}
                        </button>
                    ))}
                </div>

                {/* ==================== TRANSACTIONS TAB ==================== */}
                {tab === "transactions" && (
                    <>
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
                {tab === "summary" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {/* Income Breakdown */}
                        <div style={{ background: "white", borderRadius: 10, border: "1px solid #E9E9E7", padding: 20 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#37352F", marginBottom: 16 }}>Income Breakdown</h3>
                            {INCOME_CATEGORIES.map(cat => {
                                const catEntries = entries.filter(e => e.type === "income" && e.category === cat);
                                const total = catEntries.reduce((s, e) => s + e.totalAmount, 0);
                                if (total === 0) return null;
                                const paidAmt = catEntries.filter(e => e.status === "paid").reduce((s, e) => s + e.totalAmount, 0);
                                return (
                                    <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F5F5F3" }}>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 500, color: "#37352F" }}>{cat}</div>
                                            <div style={{ fontSize: 10, color: "#9B9A97" }}>{catEntries.length} entries · {fmt(paidAmt)} collected</div>
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#16A34A", fontFamily: "monospace" }}>
                                            {fmt(total)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Expense Breakdown */}
                        <div style={{ background: "white", borderRadius: 10, border: "1px solid #E9E9E7", padding: 20 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#37352F", marginBottom: 16 }}>Expense Breakdown</h3>
                            {EXPENSE_CATEGORIES.map(cat => {
                                const catEntries = entries.filter(e => e.type === "expense" && e.category === cat);
                                const total = catEntries.reduce((s, e) => s + e.totalAmount, 0);
                                if (total === 0) return null;
                                const supplyAmt = catEntries.filter(e => e.supplyType === "supply").reduce((s, e) => s + e.totalAmount, 0);
                                const installAmt = catEntries.filter(e => e.supplyType === "install").reduce((s, e) => s + e.totalAmount, 0);
                                return (
                                    <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F5F5F3" }}>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 500, color: "#37352F" }}>{cat}</div>
                                            <div style={{ fontSize: 10, color: "#9B9A97" }}>
                                                {supplyAmt > 0 && <span style={{ color: "#2563EB" }}>Supply: {fmt(supplyAmt)}</span>}
                                                {supplyAmt > 0 && installAmt > 0 && " · "}
                                                {installAmt > 0 && <span style={{ color: "#16A34A" }}>Install: {fmt(installAmt)}</span>}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#37352F", fontFamily: "monospace" }}>
                                            {fmt(total)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

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
                                    {["Code", "Vendor", "Trades", "# Entries", "Total", "Paid", "Outstanding"].map(h => (
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
            </div>
        </div>
    );
}
