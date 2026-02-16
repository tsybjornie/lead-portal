"use client";

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { CostItem, ComponentPricing } from '@/types/core';

export default function CsvImporter() {
    const { addItem } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [csvInput, setCsvInput] = useState('');
    const [parsedCount, setParsedCount] = useState(0);

    const handleParse = () => {
        // Simple CSV Parser: Category, Name, Cost, Supplier
        // e.g. "Plaster, Venetian Gold, 150, StuccoCo"
        const lines = csvInput.split('\n').filter(l => l.trim().length > 0);

        let count = 0;
        lines.forEach(line => {
            const parts = line.split(',');
            if (parts.length < 3) return;

            const category = parts[0].trim(); // Dynamic: "Decorative Plaster"
            const name = parts[1].trim();
            const cost = parseFloat(parts[2].trim());
            const supplier = parts[3]?.trim() || 'Imported';

            if (isNaN(cost)) return;

            // Apply "Standard Material Strategy"
            const newPricing: ComponentPricing = {
                strategy: {
                    baseCostPerBaseUnit: cost,
                    volatilityBuffer: 0,
                    logisticsCost: 0,
                    targetMargin: 0.35, // Default 35%
                    riskFactor: 1.10,   // Default 10% Risk
                    currency: 'MYR',    // Default MYR for imports
                    baseCost: cost
                } as any,
                jurisdiction: 'MY',
                source: { supplierId: supplier, isVerified: false, isStale: false }
            };

            const newItem: CostItem = {
                id: `IMP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                name: name,
                category: category.toLowerCase().replace(/\s/g, '_'), // internal handle
                measurementType: 'Unit',
                exclusions: [],
                components: {
                    supply: newPricing
                }
            };

            addItem(newItem);
            count++;
        });

        setParsedCount(count);
        setCsvInput('');
        setTimeout(() => setParsedCount(0), 3000); // Reset success after 3s
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold text-navy-900">Bulk Data Importer</h2>
                    <p className="text-xs text-gray-500">Paste CSV: Category, Name, Cost, Supplier</p>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-xs font-bold text-gray-400 hover:text-navy-900"
                >
                    {isOpen ? 'HIDE' : 'EXPAND'}
                </button>
            </div>

            {isOpen && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <textarea
                        value={csvInput}
                        onChange={e => setCsvInput(e.target.value)}
                        placeholder={`Decorative Plaster, Venetian Gold Texture, 150, StuccoMaster\nLighting, Pendant Lamp Type A, 200, LightHouse`}
                        className="w-full h-32 p-3 text-xs font-mono bg-gray-50 border border-gray-300 rounded mb-4 focus:border-navy-900 outline-none"
                    />

                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-green-600">
                            {parsedCount > 0 ? `Successfully Imported ${parsedCount} Items!` : ''}
                        </span>
                        <button
                            onClick={handleParse}
                            disabled={!csvInput}
                            className="bg-navy-900 text-white px-6 py-2 rounded text-xs font-bold hover:bg-black disabled:opacity-50"
                        >
                            PROCESS IMPORT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
