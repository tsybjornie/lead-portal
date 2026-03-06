"use client";

import { useMemo } from 'react';

// Types passed from Builder
interface QuotePreviewProps {
    clientName: string;
    projectArea: number;
    jurisdiction: 'MY' | 'SG';
    lines: Array<{
        name: string;
        category: string;
        qty: number;
        unitPrice: number;
        total: number;
    }>;
    total: number;
    onClose: () => void;
}

export default function QuotePreview({ clientName, projectArea, jurisdiction, lines, total, onClose }: QuotePreviewProps) {

    // Group by Category for Clean Layout
    const groupedLines = useMemo(() => {
        const groups: Record<string, any[]> = {};
        lines.forEach(l => {
            if (!groups[l.category]) groups[l.category] = [];
            groups[l.category].push(l);
        });
        return groups;
    }, [lines]);

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl min-h-[1000px] shadow-2xl relative">

                {/* TOOLBAR */}
                <div className="absolute -top-12 right-0 flex gap-4">
                    <button onClick={onClose} className="text-white hover:text-gray-300 font-bold">CLOSE PREVIEW</button>
                    <button className="bg-gold-500 text-navy-900 px-4 py-1 rounded font-bold hover:bg-white">PRINT PDF</button>
                </div>

                {/* DOCUMENT START */}
                <div className="p-16 font-serif text-navy-900">

                    {/* HEADER */}
                    <div className="flex justify-between items-start mb-16 border-b-4 border-navy-900 pb-8">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tighter mb-2">ARC<span className="text-gold-500">QUOTE</span></h1>
                            <p className="text-sm tracking-widest uppercase">Interior Architecture & Design</p>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-sm">123 Design Avenue</p>
                            <p className="text-sm">{jurisdiction === 'SG' ? 'Singapore 018956' : 'Kuala Lumpur 50450'}</p>
                            <p className="text-sm font-bold mt-2">REF: Q-{new Date().getFullYear()}-001</p>
                            <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* CLIENT INFO */}
                    <div className="mb-12 flex justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">PREPARED FOR</h3>
                            <h2 className="text-xl font-bold">{clientName || "Valued Client"}</h2>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">PROJECT SPECS</h3>
                            <p className="font-bold">{projectArea} SQFT</p>
                        </div>
                    </div>

                    {/* SCOPE TABLE */}
                    <div className="mb-12">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-navy-900 text-xs font-bold uppercase tracking-widest">
                                    <th className="pb-2 w-1/2">Description</th>
                                    <th className="pb-2 text-center">Qty</th>
                                    <th className="pb-2 text-right">Unit Price</th>
                                    <th className="pb-2 text-right">Amount ({jurisdiction === 'SG' ? 'SGD' : 'MYR'})</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {Object.entries(groupedLines).map(([category, catLines]) => (
                                    <>
                                        {/* CATEGORY HEADER */}
                                        <tr key={category} className="bg-gray-50">
                                            <td colSpan={4} className="py-3 px-2 text-xs font-bold uppercase text-gray-500 tracking-wider">
                                                {category.replace('_', ' ')}
                                            </td>
                                        </tr>
                                        {/* ITEMS */}
                                        {catLines.map((line, idx) => (
                                            <tr key={idx}>
                                                <td className="py-4 pl-4 pr-8">
                                                    <p className="font-bold text-sm">{line.name}</p>
                                                    <p className="text-xs text-gray-400 mt-1">Supply, fabrication, and installation complete with necessary fittings.</p>
                                                </td>
                                                <td className="py-4 text-center text-sm font-mono">{line.qty}</td>
                                                <td className="py-4 text-right text-sm font-mono">{line.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                                <td className="py-4 text-right text-sm font-bold font-mono">{line.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                            </tr>
                                        ))}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* TOTALS */}
                    <div className="flex justify-end mb-16">
                        <div className="w-1/3 border-t-2 border-navy-900 pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm">Subtotal</span>
                                <span className="font-mono">{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm">GST (9%)</span>
                                <span className="font-mono text-gray-400">Excl.</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-bold bg-gold-500/10 p-2 rounded">
                                <span>TOTAL ESTIMATE</span>
                                <span>{currencySymbol(jurisdiction)} {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="border-t border-gray-200 pt-8 text-xs text-gray-500 text-justify leading-relaxed">
                        <p className="font-bold mb-2">TERMS & CONDITIONS</p>
                        <p>1. This quotation is valid for 14 days from the date of issue.</p>
                        <p>2. A 50% deposit is required to commence works.</p>
                        <p>3. Variations to the scope will be charged separately.</p>
                        <p>4. All materials remain the property of Roof until fully paid.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}

function currencySymbol(jur: string) {
    return jur === 'SG' ? 'S$' : 'RM';
}
