"use client";

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { CostItem, ComponentPricing, Jurisdiction, ComponentType } from '@/types/core';

export default function ItemBuilder() {
    const { addItem } = useData();
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [category, setCategory] = useState('carpentry');
    const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('MY');
    const [baseCost, setBaseCost] = useState(0);
    const [margin, setMargin] = useState(35); // %
    const [risk, setRisk] = useState(10); // %

    const handleAdd = () => {
        // CONSTRUCT THE STRATEGY
        const newPricing: ComponentPricing = {
            strategy: {
                baseCostPerBaseUnit: baseCost, // Assuming Unit/Lump Sum for simplicity in this MVP builder
                volatilityBuffer: 0,
                logisticsCost: 0,
                targetMargin: margin / 100,
                riskFactor: 1 + (risk / 100),
                currency: jurisdiction === 'SG' ? 'SGD' : 'MYR',
                // legacy/helper fields
                baseCost: baseCost
            } as any, // Type cast for hybrid compatibility
            jurisdiction,
            source: { supplierId: 'MANUAL', isVerified: false, isStale: false }
        };

        const newItem: CostItem = {
            id: `CUST-${Date.now()}`,
            name,
            category,
            measurementType: 'Unit', // Defaulting to Unit for manual items ease of use
            exclusions: [],
            components: {
                supply: newPricing
            }
        };

        addItem(newItem);
        setIsOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setBaseCost(0);
        setMargin(35);
    };

    return (
        <div className="bg-navy-900 border border-gold-500/30 p-6 rounded-lg shadow-lg text-white">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gold-500 uppercase tracking-widest">Pricing Strategy Builder</h2>
                    <p className="text-xs text-gray-400">Create new billable modules with custom logic</p>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-gold-500 text-navy-900 px-4 py-2 rounded text-xs font-bold hover:bg-white transition-colors"
                >
                    {isOpen ? 'CANCEL' : '+ BUILD STRATEGY'}
                </button>
            </div>

            {/* BUILDER FORM */}
            {isOpen && (
                <div className="bg-white/5 p-6 rounded border border-white/10 animate-in fade-in slide-in-from-top-2">

                    {/* ROW 1: BASICS */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-400 mb-1">MODULE TITLE</label>
                            <input
                                value={name} onChange={e => setName(e.target.value)}
                                className="w-full p-2 text-sm bg-navy-800 border border-gray-600 rounded text-white focus:border-gold-500 outline-none"
                                placeholder="e.g. Custom Feature Wall"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">CATEGORY</label>
                            <input
                                list="categories"
                                value={category} onChange={e => setCategory(e.target.value)}
                                className="w-full p-2 text-sm bg-navy-800 border border-gray-600 rounded text-white"
                                placeholder="Select or Type New..."
                            />
                            <datalist id="categories">
                                <option value="carpentry" />
                                <option value="wetworks" />
                                <option value="metal" />
                                <option value="service" />
                                <option value="decorative_plaster" />
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">JURISDICTION</label>
                            <select
                                value={jurisdiction} onChange={e => setJurisdiction(e.target.value as Jurisdiction)}
                                className="w-full p-2 text-sm bg-navy-800 border border-gray-600 rounded text-white"
                            >
                                <option value="MY">Malaysia (MY)</option>
                                <option value="SG">Singapore (SG)</option>
                            </select>
                        </div>
                    </div>

                    {/* ROW 2: THE MATH */}
                    <div className="p-4 bg-black/20 rounded border border-white/5 mb-4">
                        <h3 className="text-xs font-bold text-gold-500 mb-3 uppercase">Profit Logic</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">BASE COST</label>
                                <div className="relative">
                                    <span className="absolute left-2 top-2 text-xs text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={baseCost} onChange={e => setBaseCost(Number(e.target.value))}
                                        className="w-full pl-6 p-2 text-sm bg-navy-800 border border-gray-600 rounded text-white text-right font-mono"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">RISK BUFFER %</label>
                                <input
                                    type="number"
                                    value={risk} onChange={e => setRisk(Number(e.target.value))}
                                    className="w-full p-2 text-sm bg-navy-800 border border-gray-600 rounded text-white text-right font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">TARGET MARGIN %</label>
                                <input
                                    type="number"
                                    value={margin} onChange={e => setMargin(Number(e.target.value))}
                                    className="w-full p-2 text-sm bg-navy-800 border border-gray-600 rounded text-white text-right font-mono"
                                />
                            </div>
                        </div>

                        {/* LIVE PREVIEW */}
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                            <span className="text-xs text-gray-400">ESTIMATED SELLING PRICE:</span>
                            <span className="text-xl font-bold text-gold-500 font-mono">
                                ${baseCost > 0 ? ((baseCost * (1 + risk / 100)) / (1 - margin / 100)).toFixed(2) : '0.00'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={!name || baseCost <= 0}
                        className="w-full bg-gold-500 text-navy-900 font-bold py-3 rounded text-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        DEPLOY MODULE
                    </button>
                </div>
            )}
        </div>
    );
}
