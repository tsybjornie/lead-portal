'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Save, Trash2, Search, Building2, Tag } from 'lucide-react';
import { Vendor } from '@/data/vendor-library';
import { useVendorLibrary } from '@/hooks/useVendorLibrary';
import { TradeCategory } from '@/types/trades';

export default function VendorRatesPage() {
    // --- HOOKS ---
    const { vendors, addVendor, updateVendor, deleteVendor } = useVendorLibrary();

    // --- STATE ---
    const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedVendor = vendors.find(v => v.id === selectedVendorId) || null;

    // --- ACTIONS ---

    const handleAddVendor = () => {
        const newId = `vendor-${Date.now()}`;
        const newVendor: Vendor = {
            id: newId,
            name: 'New Vendor',
            categories: ['masonry'],
            jurisdiction: 'SG',
            reliability: 'B',
            description: '',
            priceList: {}
        };
        addVendor(newVendor);
        setSelectedVendorId(newId);
    };

    // List of all available categories
    const allCategories: TradeCategory[] = [
        'preliminaries', 'demolition', 'masonry', 'carpentry', 'metalworks',
        'glassworks', 'ceiling', 'flooring', 'painting', 'electrical',
        'plumbing', 'aircon', 'waterproofing', 'design_submissions', 'cleaning'
    ];

    // Wrapper to match the name used in JSX
    const handleVendorFieldUpdate = (id: string, updates: Partial<Vendor>) => {
        updateVendor(id, updates);
    };

    const toggleCategory = (cat: TradeCategory) => {
        if (!selectedVendor) return;
        const current = selectedVendor.categories;
        const newCats = current.includes(cat)
            ? current.filter(c => c !== cat)
            : [...current, cat];

        updateVendor(selectedVendor.id, { categories: newCats });
    };

    // --- QUICK ADD SUGGESTIONS ---
    const TRADE_SUGGESTIONS: Partial<Record<TradeCategory, Array<{ label: string, unit: string }>>> = {
        carpentry: [
            { label: 'kitchen_cabinet_base', unit: 'pfr' },
            { label: 'kitchen_cabinet_wall', unit: 'pfr' },
            { label: 'wardrobe_swing', unit: 'pfr' },
            { label: 'wardrobe_sliding', unit: 'pfr' },
            { label: 'feature_wall', unit: 'psf' },
            { label: 'vanity_cabinet', unit: 'pfr' },
            { label: 'shoe_cabinet', unit: 'pfr' }
        ],
        masonry: [
            { label: 'wall_tiling_labor', unit: 'psf' },
            { label: 'floor_tiling_labor', unit: 'psf' },
            { label: 'kitchen_base_construction', unit: 'pfr' },
            { label: 'fridge_base', unit: 'ls' },
            { label: 'washing_machine_base', unit: 'ls' }
        ],
        painting: [
            { label: 'painting_internal_walls', unit: 'lot' },
            { label: 'painting_ceiling', unit: 'lot' },
            { label: 'sealer_coat', unit: 'lot' }
        ],
        preliminaries: [
            { label: 'floor_protection', unit: 'psf' },
            { label: 'haulage', unit: 'lot' }
        ],
        demolition: [
            { label: 'hacking_wall', unit: 'psf' },
            { label: 'hacking_floor', unit: 'psf' },
            { label: 'disposal', unit: 'load' }
        ]
    };

    // Get suggestions based on selected vendor categories
    const availableSuggestions = selectedVendor
        ? selectedVendor.categories.flatMap(cat => TRADE_SUGGESTIONS[cat] || [])
        : [];


    const [isAddingRate, setIsAddingRate] = useState(false);
    const [isEditingCategories, setIsEditingCategories] = useState(false);
    const [newRateKey, setNewRateKey] = useState('');
    const [newRatePrice, setNewRatePrice] = useState(0);
    const [newRateUnit, setNewRateUnit] = useState('psf');

    const updateRate = (vendorId: string, itemKey: string, newPrice: number, newUnit: string) => {
        const vendor = vendors.find(v => v.id === vendorId);
        if (!vendor) return;

        const updatedPriceList = {
            ...vendor.priceList,
            [itemKey]: { price: newPrice, unit: newUnit }
        };
        updateVendor(vendorId, { priceList: updatedPriceList });
    };

    const saveNewRate = () => {
        if (!selectedVendorId || !newRateKey.trim()) {
            return;
        }
        updateRate(selectedVendorId, newRateKey.trim(), newRatePrice, newRateUnit);
        setIsAddingRate(false);
        setNewRateKey('');
        setNewRatePrice(0);
        setNewRateUnit('psf');
    };

    const deleteRate = (vendorId: string, itemKey: string) => {
        const vendor = vendors.find(v => v.id === vendorId);
        if (!vendor) return;

        const newPriceList = { ...vendor.priceList };
        delete newPriceList[itemKey];
        updateVendor(vendorId, { priceList: newPriceList });
    };

    const filteredVendors = vendors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.categories.some(c => c.includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            {/* HEADER */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 p-1.5 rounded-md"><Building2 size={18} /></span>
                            Vendor Rate Library
                        </h1>
                        <p className="text-xs text-slate-500">Manage standard rates for your contractors and suppliers</p>
                    </div>
                </div>
                <button
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center gap-2"
                    onClick={() => alert('In this prototype, data resets on reload. In a real app, this would save to the server.')}
                >
                    <Save size={16} /> Save Changes
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* SIDEBAR LIST */}
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search vendors..."
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredVendors.map(vendor => (
                            <button
                                key={vendor.id}
                                onClick={() => setSelectedVendorId(vendor.id)}
                                className={`w-full text-left p-3 rounded-lg text-sm transition-all flex items-center gap-3
                                    ${selectedVendorId === vendor.id
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                                    }
                                `}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
                                    ${selectedVendorId === vendor.id ? 'bg-blue-200 text-blue-700' : 'bg-slate-200 text-slate-500'}
                                `}>
                                    {vendor.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold truncate">{vendor.name}</div>
                                    <div className="text-[10px] text-slate-400 truncate capitalize">
                                        {vendor.categories.join(', ')}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-100">
                        <button
                            onClick={handleAddVendor}
                            className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm font-medium hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Add New Vendor
                        </button>
                    </div>
                </div>

                {/* MAIN CONTENT Area */}
                <div className="flex-1 bg-slate-50 overflow-y-auto p-8">
                    {selectedVendor ? (
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* VENDOR INFO CARD */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Vendor Name</label>
                                        <input
                                            type="text"
                                            className="text-2xl font-black text-slate-900 w-full border-none focus:ring-0 p-0 placeholder-gray-300"
                                            value={selectedVendor.name}
                                            onChange={e => handleVendorFieldUpdate(selectedVendor.id, { name: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={() => deleteVendor(selectedVendor.id)}
                                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Vendor"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Trade</label>
                                            <button
                                                onClick={() => setIsEditingCategories(!isEditingCategories)}
                                                className="text-xs text-blue-600 hover:underline px-1"
                                            >
                                                {isEditingCategories ? 'Done' : '+ Edit'}
                                            </button>
                                        </div>

                                        {isEditingCategories ? (
                                            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                {allCategories.map(cat => {
                                                    const isSelected = selectedVendor.categories.includes(cat);
                                                    return (
                                                        <button
                                                            key={cat}
                                                            onClick={() => toggleCategory(cat)}
                                                            className={`px-2 py-1.5 rounded text-xs font-medium border transition-all flex items-center gap-1
                                                                ${isSelected
                                                                    ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm'
                                                                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'
                                                                }
                                                            `}
                                                        >
                                                            {isSelected && <span className="text-blue-500"></span>}
                                                            <span className="capitalize">{cat.replace('_', ' ')}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedVendor.categories.map(cat => (
                                                    <span key={cat} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200 capitalize flex items-center gap-1">
                                                        <Tag size={10} /> {cat.replace('_', ' ')}
                                                    </span>
                                                ))}
                                                {selectedVendor.categories.length === 0 && (
                                                    <span className="text-sm text-slate-400 italic">No option selected</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                                        <textarea
                                            className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            rows={5}
                                            value={selectedVendor.description || ''}
                                            onChange={e => handleVendorFieldUpdate(selectedVendor.id, { description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* CONTACT INFO */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span></span> Contact & Location
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Company Address</label>
                                            <textarea
                                                className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                rows={3}
                                                placeholder="e.g. 105 Eunos Ave 3, #01-00"
                                                value={selectedVendor.address || ''}
                                                onChange={e => handleVendorFieldUpdate(selectedVendor.id, { address: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Website</label>
                                            <input
                                                type="text"
                                                className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                placeholder="https://..."
                                                value={selectedVendor.website || ''}
                                                onChange={e => handleVendorFieldUpdate(selectedVendor.id, { website: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Number</label>
                                            <input
                                                type="text"
                                                className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                placeholder="+65 6xxx xxxx"
                                                value={selectedVendor.contactNumber || ''}
                                                onChange={e => handleVendorFieldUpdate(selectedVendor.id, { contactNumber: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                placeholder="sales@vendor.com"
                                                value={selectedVendor.email || ''}
                                                onChange={e => handleVendorFieldUpdate(selectedVendor.id, { email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ACRA / UEN No.</label>
                                            <input
                                                type="text"
                                                className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                placeholder="202412345K"
                                                value={selectedVendor.acraNumber || ''}
                                                onChange={e => handleVendorFieldUpdate(selectedVendor.id, { acraNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RATES TABLE */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <span></span> Price Matrix
                                    </h3>
                                    <button
                                        onClick={() => setIsAddingRate(true)}
                                        className="text-xs bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 px-3 py-1.5 rounded-lg shadow-sm font-medium transition-all flex items-center gap-1"
                                    >
                                        <Plus size={12} /> Add Rate Item
                                    </button>
                                </div>
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider bg-slate-50/30">
                                            <th className="px-6 py-3 font-semibold">Item Key / Description</th>
                                            <th className="px-6 py-3 font-semibold w-24">Unit</th>
                                            <th className="px-6 py-3 font-semibold w-40 text-right">Unit Rate ($)</th>
                                            <th className="px-6 py-3 w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {/* INLINE ADD ROW */}
                                        {isAddingRate && (
                                            <tr className="bg-blue-50/50 animate-in fade-in duration-200">
                                                <td className="px-6 py-3">
                                                    <div className="space-y-2">
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. tiles_600x600"
                                                            className="w-full bg-white border border-blue-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                            value={newRateKey}
                                                            onChange={e => setNewRateKey(e.target.value)}
                                                            autoFocus
                                                        />
                                                        {availableSuggestions.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                <span className="text-[10px] text-slate-400 uppercase tracking-wide mr-1 self-center">Quick Add:</span>
                                                                {availableSuggestions.slice(0, 8).map(sugg => (
                                                                    <button
                                                                        key={sugg.label}
                                                                        onClick={() => {
                                                                            setNewRateKey(sugg.label);
                                                                            setNewRateUnit(sugg.unit);
                                                                        }}
                                                                        className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-100 border border-blue-100 transition-colors"
                                                                    >
                                                                        + {sugg.label.replace(/_/g, ' ')}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <input
                                                        type="text"
                                                        placeholder="psf"
                                                        className="w-20 bg-white border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                        value={newRateUnit}
                                                        onChange={e => setNewRateUnit(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && saveNewRate()}
                                                    />
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="relative">
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                        <input
                                                            type="number"
                                                            className="w-24 text-right bg-white border border-blue-300 rounded pl-4 pr-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                            value={newRatePrice}
                                                            onChange={e => setNewRatePrice(parseFloat(e.target.value) || 0)}
                                                            onKeyDown={e => e.key === 'Enter' && saveNewRate()}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={saveNewRate}
                                                            disabled={!newRateKey.trim()}
                                                            className="p-1 text-green-600 hover:bg-green-100 rounded disabled:opacity-50"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setIsAddingRate(false)}
                                                            className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                                                        >
                                                            <Trash2 size={16} className="rotate-45" /> {/* Using Trash2 rotated as check/close or just X icon if available, but X is generic. Let's strictly use X if I had it, but for now this works or I can import X */}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                        {Object.entries(selectedVendor.priceList).length === 0 && !isAddingRate ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">
                                                    No rates defined for this vendor yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            Object.entries(selectedVendor.priceList).map(([key, rate]) => (
                                                <tr key={key} className="group hover:bg-blue-50/30 transition-colors">
                                                    <td className="px-6 py-3 font-medium text-slate-700">
                                                        {key}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <input
                                                            type="text"
                                                            className="w-20 bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-blue-400 rounded px-2 py-1 text-slate-500 text-xs focus:ring-0 focus:outline-none"
                                                            value={rate.unit}
                                                            onChange={e => updateRate(selectedVendor.id, key, rate.price, e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <div className="relative group/input">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                            <input
                                                                type="number"
                                                                className="w-24 text-right bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-blue-400 rounded pl-4 pr-2 py-1 font-mono text-slate-900 focus:ring-0 focus:outline-none"
                                                                value={rate.price}
                                                                onChange={e => updateRate(selectedVendor.id, key, parseFloat(e.target.value) || 0, rate.unit)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <button
                                                            onClick={() => deleteRate(selectedVendor.id, key)}
                                                            className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Building2 size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-600">Select a vendor</h3>
                            <p className="max-w-xs text-center mt-2">Choose a vendor from the sidebar to view and edit their price matrix.</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
