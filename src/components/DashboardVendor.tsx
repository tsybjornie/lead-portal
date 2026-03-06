"use client";

import { useState, useMemo } from 'react';
import {
    Calculator,
    Plus,
    Trash2,
    TrendingUp,
    FileText,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    GripVertical
} from 'lucide-react';
import {
    MAIN_CATEGORIES,
    LOCATION_PRESETS,
    MeasurementUnit
} from '@/types/quote';

// 
// VENDOR QUOTE LINE ITEM (Mirrors Designer's UniversalQuoteLine)
// 

interface VendorQuoteLine {
    id: string;
    lineNumber: number;

    // 3-tier hierarchy (SAME as designer)
    mainCategory: string;       // Work type: "Demolition", "Carpentry"
    subCategory: string;        // Location: "Master Bedroom", "Kitchen"
    taskDescription: string;    // Specific work: "Remove wardrobe"

    // Pricing (Vendor only has cost, not selling rate)
    costRate: number;           // Vendor's cost per unit
    measurementUnit: MeasurementUnit;
    quantity: number;
    displayQuantity: number;

    // Derived
    lineCost: number;           // displayQuantity * costRate

    // Internal
    internalRemarks?: string;
}

interface DashboardVendorProps {
    onLogout: () => void;
}

// Create a new empty line
function createEmptyVendorLine(lineNumber: number): VendorQuoteLine {
    return {
        id: `vline-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        lineNumber,
        mainCategory: '',
        subCategory: '',
        taskDescription: '',
        costRate: 0,
        measurementUnit: 'Unit',
        quantity: 0,
        displayQuantity: 0,
        lineCost: 0
    };
}

export default function DashboardVendor({ onLogout }: DashboardVendorProps) {
    // Quote lines (mirroring designer's structure)
    const [lines, setLines] = useState<VendorQuoteLine[]>([createEmptyVendorLine(1)]);
    const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set());
    const [quotePrice, setQuotePrice] = useState(0);

    // Calculations
    const calculations = useMemo(() => {
        const totalCost = lines.reduce((sum, line) => sum + line.lineCost, 0);
        const profit = quotePrice - totalCost;
        const margin = quotePrice > 0 ? (profit / quotePrice) * 100 : 0;

        return { totalCost, profit, margin };
    }, [lines, quotePrice]);

    // Add a new line
    const addLine = () => {
        setLines([...lines, createEmptyVendorLine(lines.length + 1)]);
    };

    // Update a line
    const updateLine = (id: string, updates: Partial<VendorQuoteLine>) => {
        setLines(prev => prev.map(line => {
            if (line.id !== id) return line;
            const updated = { ...line, ...updates };
            // Recalculate line cost
            updated.lineCost = updated.displayQuantity * updated.costRate;
            return updated;
        }));
    };

    // Remove a line
    const removeLine = (id: string) => {
        setLines(prev => prev.filter(line => line.id !== id).map((line, idx) => ({
            ...line,
            lineNumber: idx + 1
        })));
    };

    // Toggle line expansion
    const toggleLine = (id: string) => {
        setExpandedLines(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Unit options
    const UNIT_OPTIONS: { value: MeasurementUnit; label: string }[] = [
        { value: 'Unit', label: 'Per Unit' },
        { value: 'LinearMm', label: 'Linear (ft/m)' },
        { value: 'AreaSqMm', label: 'Area (sqft/sqm)' },
        { value: 'VolumeCuMm', label: 'Volume (cuft/cum)' },
        { value: 'LumpSum', label: 'Lump Sum' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
            {/* HEADER */}
            <header className="bg-white/80 backdrop-blur-lg border-b border-amber-200 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onLogout}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-slate-900">Vendor Quote Builder</h1>
                            <p className="text-xs text-slate-500">Build your quote using the same structure as the designer</p>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Cost</p>
                            <p className="text-lg font-black text-slate-700">${calculations.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Your Quote</p>
                            <p className="text-lg font-black text-amber-600">${quotePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Margin</p>
                            <p className={`text-lg font-black ${calculations.margin >= 20 ? 'text-green-600' : calculations.margin >= 10 ? 'text-amber-600' : 'text-red-600'}`}>
                                {calculations.margin.toFixed(1)}%
                            </p>
                        </div>
                        <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-all">
                            <FileText size={16} />
                            Submit Quote
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8 space-y-4">

                {/*  */}
                {/* QUOTE LINE ITEMS (Same structure as Designer's QuoteBuilder) */}
                {/*  */}

                {lines.map((line) => (
                    <section
                        key={line.id}
                        className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden"
                    >
                        {/* Line Header (Collapsed View) */}
                        <div
                            className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => toggleLine(line.id)}
                        >
                            <GripVertical size={16} className="text-slate-300" />
                            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                                {line.lineNumber}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-slate-800">
                                    {line.taskDescription || 'Untitled Item'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {line.mainCategory || 'No category'} {line.subCategory ? ` ${line.subCategory}` : ''}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-lg text-slate-800">${line.lineCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            {expandedLines.has(line.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>

                        {/* Expanded Content */}
                        {expandedLines.has(line.id) && (
                            <div className="border-t border-slate-100 p-6 space-y-4">
                                {/* Row 1: Category, Sub-Category (Location), Unit */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Main Category</label>
                                        <select
                                            value={line.mainCategory}
                                            onChange={e => updateLine(line.id, { mainCategory: e.target.value })}
                                            className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                        >
                                            <option value="">Select Category...</option>
                                            {MAIN_CATEGORIES.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sub-Category (Location)</label>
                                        <select
                                            value={line.subCategory}
                                            onChange={e => updateLine(line.id, { subCategory: e.target.value })}
                                            className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                        >
                                            <option value="">Select Location...</option>
                                            {LOCATION_PRESETS.map((loc: string) => <option key={loc} value={loc}>{loc}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unit</label>
                                        <select
                                            value={line.measurementUnit}
                                            onChange={e => updateLine(line.id, { measurementUnit: e.target.value as MeasurementUnit })}
                                            className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                        >
                                            {UNIT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Row 2: Task Description */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Task Description</label>
                                    <textarea
                                        value={line.taskDescription}
                                        onChange={e => updateLine(line.id, { taskDescription: e.target.value })}
                                        className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                                        rows={2}
                                        placeholder="Describe the scope of work..."
                                    />
                                </div>

                                {/* Row 3: Pricing */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cost Rate</label>
                                        <div className="flex items-center gap-1">
                                            <span className="text-slate-400 font-mono">$</span>
                                            <input
                                                type="number"
                                                value={line.costRate || ''}
                                                onChange={e => updateLine(line.id, { costRate: Number(e.target.value) })}
                                                className="flex-1 p-2 text-sm border border-slate-200 rounded-lg font-mono text-right focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Quantity</label>
                                        <input
                                            type="number"
                                            value={line.displayQuantity || ''}
                                            onChange={e => updateLine(line.id, { displayQuantity: Number(e.target.value), quantity: Number(e.target.value) })}
                                            className="w-full p-2 text-sm border border-slate-200 rounded-lg font-mono text-right focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Line Total</label>
                                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-right">
                                            <span className="font-black text-xl text-amber-700">${line.lineCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 4: Internal Remarks */}
                                <div className="border-t border-slate-100 pt-4">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Internal Notes (Hidden from Designer)</label>
                                    <input
                                        value={line.internalRemarks || ''}
                                        onChange={e => updateLine(line.id, { internalRemarks: e.target.value })}
                                        className="w-full p-2 text-sm border border-yellow-200 bg-yellow-50 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                                        placeholder="Private notes, supplier contacts, etc."
                                    />
                                </div>

                                {/* Delete Button */}
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={() => removeLine(line.id)}
                                        className="text-slate-300 hover:text-red-500 flex items-center gap-1 text-sm transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Remove Line
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                ))}

                {/* Add Line Button */}
                <button
                    onClick={addLine}
                    className="w-full border-2 border-dashed border-amber-300 text-amber-600 font-bold py-4 rounded-2xl hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    Add Line Item
                </button>

                {/*  */}
                {/* QUOTE PRICE & MARGIN SUMMARY */}
                {/*  */}
                <section className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                    <div className="grid grid-cols-4 gap-6 items-center">
                        <div>
                            <p className="text-amber-100 text-xs font-bold uppercase mb-1">Total Cost</p>
                            <p className="text-3xl font-black">${calculations.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                            <p className="text-amber-100 text-xs font-bold uppercase mb-1">Your Quote Price</p>
                            <input
                                type="number"
                                value={quotePrice || ''}
                                onChange={e => setQuotePrice(Number(e.target.value))}
                                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-2xl font-black text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <p className="text-amber-100 text-xs font-bold uppercase mb-1">Profit</p>
                            <p className={`text-3xl font-black ${calculations.profit >= 0 ? 'text-white' : 'text-red-200'}`}>
                                ${calculations.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div>
                            <p className="text-amber-100 text-xs font-bold uppercase mb-1">Margin</p>
                            <div className="flex items-center gap-2">
                                <TrendingUp size={24} />
                                <p className={`text-3xl font-black ${calculations.margin >= 20 ? 'text-white' : 'text-red-200'}`}>
                                    {calculations.margin.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
