"use client";

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Supplier, Jurisdiction, ReliabilityScore } from '@/types/core';

export default function VendorManager() {
    const { suppliers, addSupplier } = useData();
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('SG');
    const [reliability, setReliability] = useState<ReliabilityScore>('B');
    const [paymentTerms, setPaymentTerms] = useState('30 Days');
    const [transportIssues, setTransportIssues] = useState('');

    const handleAdd = () => {
        const newSupplier: Supplier = {
            id: `SUP-${Date.now()}`,
            name,
            jurisdiction,
            reliability,
            paymentTerms,
            hiddenPainFields: {
                transportIssues
            }
        };
        addSupplier(newSupplier);
        setIsOpen(false);
        // Reset
        setName('');
        setJurisdiction('SG');
        setReliability('B');
        setPaymentTerms('30 Days');
        setTransportIssues('');
    };

    const getReliabilityColor = (score: ReliabilityScore) => {
        switch (score) {
            case 'A': return 'bg-green-100 text-green-800 border-green-200';
            case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'C': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'F': return 'bg-red-100 text-red-800 border-red-200';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-navy-900">Vendor Glossary</h2>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-navy-900 text-gold-500 px-4 py-2 rounded text-xs font-bold hover:bg-black transition-colors"
                >
                    {isOpen ? 'CANCEL' : '+ ADD VENDOR'}
                </button>
            </div>

            {/* ADD FORM */}
            {isOpen && (
                <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200 animate-in fade-in slide-in-from-top-2 shadow-inner">
                    <h3 className="text-sm font-bold text-navy-900 uppercase mb-4 border-b border-gray-200 pb-2">New Vendor</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">VENDOR NAME</label>
                            <input
                                value={name} onChange={e => setName(e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded focus:border-navy-500 focus:ring-1 focus:ring-navy-500"
                                placeholder="e.g. Acme Joinery"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">JURISDICTION</label>
                            <div className="flex gap-2">
                                {(['SG', 'MY', 'CROSS_BORDER'] as Jurisdiction[]).map(j => (
                                    <button
                                        key={j}
                                        onClick={() => setJurisdiction(j)}
                                        className={`flex-1 py-2 text-xs font-bold rounded border ${jurisdiction === j ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-500 border-gray-300'}`}
                                    >
                                        {j}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">RELIABILITY SCORE</label>
                            <select
                                value={reliability} onChange={e => setReliability(e.target.value as ReliabilityScore)}
                                className="w-full p-2 text-sm border border-gray-300 rounded"
                            >
                                <option value="A">A - Excellent (Premium)</option>
                                <option value="B">B - Good (Standard)</option>
                                <option value="C">C - Unreliable (Budget only)</option>
                                <option value="F">F - Blacklisted</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">PAYMENT TERMS</label>
                            <input
                                value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded"
                                placeholder="e.g. 50% Deposit"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">HIDDEN PAIN / ISSUES</label>
                            <textarea
                                value={transportIssues} onChange={e => setTransportIssues(e.target.value)}
                                className="w-full p-2 text-sm border border-red-200 bg-red-50 rounded h-20 placeholder:text-red-300"
                                placeholder="Track record issues, late deliveries, specific constraints..."
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={!name}
                        className="w-full bg-navy-900 text-white font-bold py-3 rounded text-sm hover:bg-navy-800 disabled:opacity-50 transition-colors shadow-lg"
                    >
                        ADD TO GLOSSARY
                    </button>
                </div>
            )}

            {/* LIST */}
            <div className="space-y-3">
                {suppliers.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-8">No vendors found.</div>
                ) : (
                    suppliers.map(s => (
                        <div key={s.id} className="border border-gray-200 rounded p-4 hover:border-blue-300 transition-colors bg-white flex justify-between items-center group">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-navy-900">{s.name}</h4>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${getReliabilityColor(s.reliability)}`}>
                                        Grade {s.reliability}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-bold border border-gray-200">
                                        {s.jurisdiction}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 flex gap-4">
                                    <span>Terms: {s.paymentTerms}</span>
                                    {s.hiddenPainFields?.transportIssues && (
                                        <span className="text-red-500 font-medium">⚠️ {s.hiddenPainFields.transportIssues}</span>
                                    )}
                                </div>
                            </div>
                            <button className="text-xs text-gray-400 hover:text-navy-900 opacity-0 group-hover:opacity-100 transition-opacity underline">
                                Edit
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
