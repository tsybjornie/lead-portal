"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AppDock from "../components/AppDock";
import { loadProject, updateLedgerData, type OSTransaction } from "../lib/project-store";

interface Transaction {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
    type: "income" | "expense";
    status: "paid" | "pending" | "overdue";
}

const EXPENSE_CATEGORIES = [
    "Materials",
    "Labour",
    "Subcontractor",
    "Transport",
    "Equipment Rental",
    "Permits",
    "Design Fee",
    "Contingency",
];

const INCOME_CATEGORIES = [
    "Deposit",
    "Progress Payment",
    "Final Payment",
    "Variation Order",
    "Retention Release",
];

let nextTxId = 1;

export default function LedgerPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [txType, setTxType] = useState<"income" | "expense">("expense");
    const [quoteBudget, setQuoteBudget] = useState(0);
    const [synced, setSynced] = useState(false);
    const [form, setForm] = useState({
        description: "",
        category: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        status: "pending" as "paid" | "pending" | "overdue",
    });

    // Load from project store
    useEffect(() => {
        const project = loadProject();
        if (project) {
            if (project.transactions.length > 0) {
                setTransactions(project.transactions.map(t => ({
                    id: t.id,
                    date: t.date,
                    description: t.description,
                    category: t.category,
                    amount: t.amount,
                    type: t.type,
                    status: t.status,
                })));
            }
            if (project.quoteTotalAmount > 0) {
                setQuoteBudget(project.quoteTotalAmount);
            }
        }
    }, []);

    // Sync to project store
    useEffect(() => {
        if (transactions.length > 0 || synced) {
            const osTx: OSTransaction[] = transactions.map(t => ({
                id: t.id,
                date: t.date,
                description: t.description,
                category: t.category,
                amount: t.amount,
                type: t.type,
                status: t.status,
            }));
            updateLedgerData(osTx);
            setSynced(true);
        }
    }, [transactions, synced]);

    const addTransaction = () => {
        if (!form.description.trim() || !form.amount || !form.category) return;
        setTransactions((prev) => [
            ...prev,
            {
                id: `tx_${nextTxId++}`,
                date: form.date,
                description: form.description.trim(),
                category: form.category,
                amount: parseFloat(form.amount),
                type: txType,
                status: form.status,
            },
        ]);
        setForm({
            description: "",
            category: "",
            amount: "",
            date: new Date().toISOString().split("T")[0],
            status: "pending",
        });
        setShowAdd(false);
    };

    const toggleStatus = (id: string) => {
        setTransactions((prev) =>
            prev.map((t) =>
                t.id === id
                    ? { ...t, status: t.status === "paid" ? "pending" : "paid" }
                    : t
            )
        );
    };

    const removeTransaction = (id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
    const netCashFlow = totalIncome - totalExpense;
    const pendingAmount = transactions
        .filter((t) => t.status === "pending" || t.status === "overdue")
        .reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount), 0);

    const categories = txType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <div
            className="min-h-screen bg-[#fafafa] text-[#111] relative"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
            {/* Top bar */}
            <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-10 py-8 bg-[#fafafa]/80 backdrop-blur-sm">
                <Link
                    href="/hub"
                    className="text-[11px] tracking-[0.3em] uppercase font-medium text-[#999] hover:text-[#111] transition-colors"
                >
                    ← Command Center
                </Link>
                <div className="flex items-center gap-4">
                    {quoteBudget > 0 && (
                        <div className="text-[11px] tracking-[0.15em] font-medium text-[#bbb]">
                            Quote: ${quoteBudget.toLocaleString()}
                        </div>
                    )}
                    <span className="text-[#ddd]">|</span>
                    <div className="text-[11px] tracking-[0.3em] uppercase font-medium text-[#999]">
                        Ledger
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-10 md:px-20 pt-32 pb-20">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
                    className="mb-20"
                >
                    <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extralight leading-[0.95] tracking-[-0.04em] mb-4">
                        Project
                        <br />
                        <span className="italic font-light text-[#bbb]">finance.</span>
                    </h1>
                    <p className="text-[#999] text-sm tracking-wide max-w-md mt-6">
                        Track every dollar in and out. Know your cash position in real time.
                    </p>
                </motion.div>

                {/* Summary cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-4 gap-px bg-[#e5e5e5] mb-16"
                >
                    {[
                        { label: "Income", value: `$${totalIncome.toLocaleString()}` },
                        { label: "Expenses", value: `$${totalExpense.toLocaleString()}` },
                        {
                            label: "Net Cash Flow",
                            value: `${netCashFlow >= 0 ? "" : "-"}$${Math.abs(netCashFlow).toLocaleString()}`,
                        },
                        {
                            label: "Pending",
                            value: `$${Math.abs(pendingAmount).toLocaleString()}`,
                        },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-[#fafafa] p-6 md:p-8">
                            <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-2">
                                {stat.label}
                            </div>
                            <div className="text-xl md:text-2xl font-extralight tracking-tight">
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Transaction list */}
                <div className="mb-12">
                    <AnimatePresence>
                        {transactions.map((tx, i) => (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                transition={{ duration: 0.4 }}
                                onMouseEnter={() => setHoveredId(tx.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="border-t py-6 transition-all duration-300"
                                style={{
                                    borderColor: hoveredId === tx.id ? "#111" : "#e5e5e5",
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <span className="text-[11px] tracking-[0.2em] font-medium text-[#ccc] mt-1 w-8">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-4">
                                                <span className="text-base font-extralight tracking-tight">
                                                    {tx.description}
                                                </span>
                                            </div>
                                            <div className="flex gap-4 mt-1">
                                                <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-[#bbb]">
                                                    {tx.date}
                                                </span>
                                                <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-[#bbb]">
                                                    {tx.category}
                                                </span>
                                                <button
                                                    onClick={() => toggleStatus(tx.id)}
                                                    className={`text-[10px] tracking-[0.15em] uppercase font-medium transition-colors cursor-pointer ${tx.status === "paid"
                                                        ? "text-[#999]"
                                                        : tx.status === "overdue"
                                                            ? "text-[#111]"
                                                            : "text-[#bbb]"
                                                        }`}
                                                >
                                                    {tx.status}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-baseline gap-6">
                                        <span
                                            className={`text-lg font-extralight tracking-tight ${tx.type === "income" ? "text-[#111]" : "text-[#999]"
                                                }`}
                                        >
                                            {tx.type === "income" ? "+" : "-"}$
                                            {tx.amount.toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => removeTransaction(tx.id)}
                                            className="text-[11px] tracking-[0.15em] uppercase font-medium text-[#ccc] hover:text-[#111] transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {transactions.length > 0 && (
                        <div className="border-t border-[#e5e5e5]" />
                    )}
                </div>

                {/* Add transaction */}
                <AnimatePresence>
                    {showAdd ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-12"
                        >
                            {/* Type toggle */}
                            <div className="flex gap-1 mb-8">
                                {(["income", "expense"] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setTxType(type);
                                            setForm({ ...form, category: "" });
                                        }}
                                        className={`flex-1 py-4 text-center border-t-2 text-[11px] tracking-[0.2em] uppercase font-medium transition-all duration-300 ${txType === type
                                            ? "border-[#111] text-[#111]"
                                            : "border-[#e5e5e5] text-[#bbb]"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Category */}
                            <div className="mb-8">
                                <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-4">
                                    Category
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setForm({ ...form, category: cat })}
                                            className={`px-5 py-3 border text-sm font-extralight tracking-wide transition-all duration-300 ${form.category === cat
                                                ? "bg-[#111] text-white border-[#111]"
                                                : "border-[#e5e5e5] hover:border-[#111]"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Form fields */}
                            <div className="grid grid-cols-3 gap-8 mb-8">
                                <div className="col-span-2">
                                    <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-2">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({ ...form, description: e.target.value })
                                        }
                                        className="w-full bg-transparent border-b border-[#e5e5e5] focus:border-[#111] outline-none py-2 text-lg font-extralight tracking-tight transition-colors"
                                        placeholder="e.g. Carpentry milestone 2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-2">
                                        Amount ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={form.amount}
                                        onChange={(e) =>
                                            setForm({ ...form, amount: e.target.value })
                                        }
                                        className="w-full bg-transparent border-b border-[#e5e5e5] focus:border-[#111] outline-none py-2 text-lg font-extralight tracking-tight transition-colors"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={(e) =>
                                            setForm({ ...form, date: e.target.value })
                                        }
                                        className="w-full bg-transparent border-b border-[#e5e5e5] focus:border-[#111] outline-none py-2 text-lg font-extralight tracking-tight transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-4">
                                        Status
                                    </label>
                                    <div className="flex gap-2">
                                        {(["pending", "paid", "overdue"] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setForm({ ...form, status: s })}
                                                className={`px-4 py-2 border text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-300 ${form.status === s
                                                    ? "bg-[#111] text-white border-[#111]"
                                                    : "border-[#e5e5e5] hover:border-[#111]"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={addTransaction}
                                    className="px-8 py-4 bg-[#111] text-white text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors"
                                >
                                    Add Transaction
                                </button>
                                <button
                                    onClick={() => setShowAdd(false)}
                                    className="px-6 py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-[#999] hover:text-[#111] transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setShowAdd(true)}
                            className="w-full py-6 border border-dashed border-[#ddd] hover:border-[#111] text-[11px] tracking-[0.2em] uppercase font-medium text-[#bbb] hover:text-[#111] transition-all duration-300"
                        >
                            + Add Transaction
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <footer className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-10 py-6 bg-[#fafafa]/80 backdrop-blur-sm border-t border-[#f0f0f0]">
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                    {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                    Net {netCashFlow >= 0 ? "+" : "-"}${Math.abs(netCashFlow).toLocaleString()}
                </div>
            </footer>

            <AppDock />
        </div>
    );
}
