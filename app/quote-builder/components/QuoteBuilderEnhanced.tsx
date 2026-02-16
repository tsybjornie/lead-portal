'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { TradeCategory, TRADE_PROFILES } from '@/types/trades';
import { Jurisdiction } from '@/types/core';
import { PropertyContext } from '@/types/site-protection';
import { GeneratedTradeSection } from '@/lib/ai/auto-quote';
import ZoneManager, { Zone, computeZoneMetrics } from '@/components/ZoneManager';
import AutoCompleteInput from '@/components/AutoCompleteInput';

// ============================================================
// TYPES
// ============================================================

type MeasurementUnit =
    // Area
    | 'sqft' | 'sqm'
    // Linear
    | 'lm' | 'm' | 'mm'
    // Volume
    | 'cu.m'
    // Counting
    | 'pcs' | 'set' | 'lot' | 'nos' | 'unit' | 'pair' | 'panel' | 'leaf'
    // Weight
    | 'kg' | 'ton'
    // Consumables
    | 'roll' | 'sheet' | 'bag' | 'litre'
    // Labour / logistics
    | 'day' | 'hr' | 'trip'
    // Fixed price
    | 'ls';
// PropertyContext imported from @/types/site-protection

interface Dimensions {
    lengthFt?: number;
    widthFt?: number;
    heightFt?: number;
    area?: number;
    quantity?: number;
    unit: MeasurementUnit;
}

interface LineItem {
    id: string;
    description: string;
    dimensions: Dimensions;
    unitRate: number;
    costPrice: number;
    margin: number;
    sellingPrice: number;
    isStaircase?: boolean;
    productivityMultiplier: number;
    // Owner-supplied & cost split
    materialCost: number;
    labourCost: number;
    isOwnerSupplied: boolean;
    // Zone assignment
    zoneId?: string;
}

export interface TradeSection {
    id: string;
    category: TradeCategory;
    displayName: string;
    items: LineItem[];
    subtotalCost: number;
    subtotalSelling: number;
    overallMargin: number;
    isExpanded: boolean;
}

interface QuoteBuilderEnhancedProps {
    onReady?: (loadFn: (sections: GeneratedTradeSection[]) => void) => void;
    onSectionsChange?: (sections: TradeSection[]) => void;
    onZonesReady?: (importFn: (newZones: Zone[]) => void) => void;
}

// ============================================================
// UTILITIES
// ============================================================

const generateId = (): string => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const formatCurrency = (amount: number, jurisdiction: Jurisdiction): string => {
    const symbol = jurisdiction === 'SG' ? 'S$' : 'RM';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const calculateQuantity = (dims: Dimensions): number => {
    if (dims.quantity && dims.quantity > 0) return dims.quantity;
    if (dims.lengthFt && dims.widthFt) {
        return dims.lengthFt * dims.widthFt; // sqft
    }
    if (dims.area && dims.area > 0) return dims.area;
    return 0;
};

// ============================================================
// COMPONENT
// ============================================================

export default function QuoteBuilderEnhanced({ onReady, onSectionsChange, onZonesReady }: QuoteBuilderEnhancedProps = {}) {
    // Core state
    const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('SG');
    const [propertyContext, setPropertyContext] = useState<PropertyContext>('condo');
    const [zones, setZones] = useState<Zone[]>([]);
    const [sections, setSections] = useState<TradeSection[]>([]);

    // Drag state
    const [draggedItem, setDraggedItem] = useState<{ sectionId: string; itemId: string } | null>(null);

    // ============================================================
    // LOCALSTORAGE PERSISTENCE
    // ============================================================
    const STORAGE_KEY = 'quote-builder-draft';
    const ZONES_STORAGE_KEY = 'quote-builder-zones';

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setSections(parsed);
            } catch (e) {
                console.error('Failed to load quote draft', e);
            }
        }
        const savedZones = localStorage.getItem(ZONES_STORAGE_KEY);
        if (savedZones) {
            try {
                const parsed = JSON.parse(savedZones);
                if (Array.isArray(parsed)) setZones(parsed.map(computeZoneMetrics));
            } catch (e) {
                console.error('Failed to load zones', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
        if (onSectionsChange) onSectionsChange(sections);
    }, [sections, onSectionsChange]);

    useEffect(() => {
        localStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify(zones));
    }, [zones]);

    // Expose zone import function to parent
    useEffect(() => {
        if (onZonesReady) {
            onZonesReady((newZones: Zone[]) => {
                setZones(prev => [...prev, ...newZones]);
            });
        }
    }, [onZonesReady]);

    // --- LOAD FROM PROMPT ---
    const loadFromPrompt = useCallback((generatedSections: GeneratedTradeSection[]) => {
        const newSections: TradeSection[] = generatedSections.map(gs => ({
            id: gs.id,
            category: gs.category,
            displayName: gs.displayName,
            items: gs.items.map(item => ({
                id: item.id,
                description: item.description,
                dimensions: item.dimensions,
                unitRate: item.unitRate,
                costPrice: item.costPrice,
                margin: item.margin,
                sellingPrice: item.sellingPrice,
                isStaircase: item.isStaircase,
                productivityMultiplier: item.productivityMultiplier,
                materialCost: item.materialCost || 0,
                labourCost: item.labourCost || 0,
                isOwnerSupplied: item.isOwnerSupplied || false,
            })),
            subtotalCost: gs.subtotalCost,
            subtotalSelling: gs.subtotalSelling,
            overallMargin: gs.overallMargin,
            isExpanded: gs.isExpanded,
        }));
        setSections(newSections);
    }, []);

    // Expose the load function to parent via callback
    useEffect(() => {
        if (onReady) onReady(loadFromPrompt);
    }, [onReady, loadFromPrompt]);

    // ============================================================
    // CALCULATIONS
    // ============================================================

    const totals = useMemo(() => {
        const grandTotalCost = sections.reduce((sum, s) => sum + s.subtotalCost, 0);
        const grandTotalSelling = sections.reduce((sum, s) => sum + s.subtotalSelling, 0);
        const overallMargin = grandTotalSelling > 0
            ? (grandTotalSelling - grandTotalCost) / grandTotalSelling
            : 0;
        const itemCount = sections.reduce((sum, s) => sum + s.items.length, 0);
        return { grandTotalCost, grandTotalSelling, overallMargin, itemCount };
    }, [sections]);

    // ============================================================
    // SECTION MANAGEMENT
    // ============================================================

    const addTradeSection = (category: TradeCategory) => {
        const profile = TRADE_PROFILES[category];
        const newSection: TradeSection = {
            id: `section-${Date.now()}`,
            category,
            displayName: profile.displayName,
            items: [],
            subtotalCost: 0,
            subtotalSelling: 0,
            overallMargin: 0,
            isExpanded: true,
        };
        setSections(prev => [...prev, newSection]);
    };

    const removeTradeSection = (sectionId: string) => {
        setSections(prev => prev.filter(s => s.id !== sectionId));
    };

    const toggleSectionExpanded = (sectionId: string) => {
        setSections(prev => prev.map(s =>
            s.id === sectionId ? { ...s, isExpanded: !s.isExpanded } : s
        ));
    };

    // ============================================================
    // LINE ITEM MANAGEMENT
    // ============================================================

    const recalculateSection = (section: TradeSection): TradeSection => {
        const subtotalCost = section.items.reduce((sum, i) => sum + i.costPrice, 0);
        const subtotalSelling = section.items.reduce((sum, i) => sum + i.sellingPrice, 0);
        const overallMargin = subtotalSelling > 0
            ? (subtotalSelling - subtotalCost) / subtotalSelling
            : 0;
        return { ...section, subtotalCost, subtotalSelling, overallMargin };
    };

    const recalculateItem = (item: LineItem): LineItem => {
        const quantity = calculateQuantity(item.dimensions);
        const baseSubtotal = quantity * item.unitRate;
        const costPrice = baseSubtotal * item.productivityMultiplier;
        // Cap margin at 95% to prevent division by zero/near-zero
        const safeMargin = Math.min(Math.max(item.margin, 0), 0.95);
        const sellingPrice = costPrice / (1 - safeMargin);
        return { ...item, costPrice, sellingPrice: isNaN(sellingPrice) ? 0 : sellingPrice };
    };

    const addLineItem = (sectionId: string) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section) return;

        const profile = TRADE_PROFILES[section.category];
        const defaultMargin = jurisdiction === 'SG'
            ? profile.marginTargetSG
            : profile.marginTargetMY;

        const defaultUnit: MeasurementUnit =
            profile.primaryMeasurement === 'area' ? 'sqft' :
                profile.primaryMeasurement === 'linear' ? 'lm' :
                    profile.primaryMeasurement === 'unit' || profile.primaryMeasurement === 'point' ? 'pcs' : 'set';

        const newItem: LineItem = {
            id: generateId(),
            description: '',
            dimensions: { unit: defaultUnit },
            unitRate: 0,
            costPrice: 0,
            margin: defaultMargin,
            sellingPrice: 0,
            productivityMultiplier: 1.0,
            materialCost: 0,
            labourCost: 0,
            isOwnerSupplied: false,
        };

        setSections(prev => prev.map(s => {
            if (s.id !== sectionId) return s;
            return recalculateSection({ ...s, items: [...s.items, newItem] });
        }));
    };

    const updateLineItem = (sectionId: string, itemId: string, updates: Partial<LineItem>) => {
        setSections(prev => prev.map(section => {
            if (section.id !== sectionId) return section;

            const items = section.items.map(item => {
                if (item.id !== itemId) return item;

                const updated = { ...item, ...updates };

                // Handle staircase productivity penalty
                if (updates.isStaircase !== undefined) {
                    updated.productivityMultiplier = updates.isStaircase ? 1.5 : 1.0;
                }

                return recalculateItem(updated);
            });

            return recalculateSection({ ...section, items });
        }));
    };

    const removeLineItem = (sectionId: string, itemId: string) => {
        setSections(prev => prev.map(section => {
            if (section.id !== sectionId) return section;
            const items = section.items.filter(i => i.id !== itemId);
            return recalculateSection({ ...section, items });
        }));
    };

    // ============================================================
    // DRAG AND DROP
    // ============================================================

    const handleDragStart = (sectionId: string, itemId: string) => {
        setDraggedItem({ sectionId, itemId });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetSectionId: string, targetIndex: number) => {
        if (!draggedItem) return;

        setSections(prev => {
            let draggedLineItem: LineItem | null = null;

            // Remove from source
            let updated = prev.map(section => {
                if (section.id === draggedItem.sectionId) {
                    const item = section.items.find(i => i.id === draggedItem.itemId);
                    if (item) draggedLineItem = item;
                    return recalculateSection({
                        ...section,
                        items: section.items.filter(i => i.id !== draggedItem.itemId),
                    });
                }
                return section;
            });

            if (!draggedLineItem) return prev;

            // Add to target
            updated = updated.map(section => {
                if (section.id === targetSectionId) {
                    const items = [...section.items];
                    items.splice(targetIndex, 0, draggedLineItem!);
                    return recalculateSection({ ...section, items });
                }
                return section;
            });

            return updated;
        });

        setDraggedItem(null);
    };

    // ============================================================
    // AVAILABLE TRADES
    // ============================================================

    // Ordered by natural renovation workflow sequence
    const TRADE_SEQUENCE: TradeCategory[] = [
        'design_submissions', 'preliminaries', 'demolition',
        'masonry', 'waterproofing',
        'carpentry', 'metalworks', 'glassworks',
        'ceiling', 'flooring', 'painting',
        'electrical', 'plumbing', 'aircon',
        'cleaning',
    ];
    const usedTrades = sections.map(s => s.category);
    const unusedTrades = TRADE_SEQUENCE
        .filter(t => TRADE_PROFILES[t]) // only trades that have profiles
        .filter(t => !usedTrades.includes(t));

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div>
            {/* HEADER BAR */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quote Builder</h1>
                        <p className="text-gray-500 text-sm mt-1">Drag-drop line items • Auto-calculate dimensions • Trade subtotals</p>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">MARKET</label>
                            <select
                                value={jurisdiction}
                                onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium"
                            >
                                <option value="SG">🇸🇬 Singapore</option>
                                <option value="MY">🇲🇾 Malaysia</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">PROPERTY</label>
                            <select
                                value={propertyContext}
                                onChange={(e) => setPropertyContext(e.target.value as PropertyContext)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium"
                            >
                                <option value="hdb">HDB</option>
                                <option value="condo">Condo</option>
                                <option value="landed">Landed</option>
                                <option value="commercial">Commercial</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* LEFT PANEL: Trade Selector */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
                        <h3 className="font-bold text-gray-900 mb-4">➕ Add Trade</h3>
                        <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                            {unusedTrades.map(trade => {
                                const profile = TRADE_PROFILES[trade];
                                return (
                                    <button
                                        key={trade}
                                        onClick={() => addTradeSection(trade)}
                                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                                    >
                                        <div className="font-medium text-gray-900 text-sm group-hover:text-blue-700">{profile.displayName}</div>
                                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{profile.description}</div>
                                    </button>
                                );
                            })}
                            {unusedTrades.length === 0 && (
                                <div className="text-sm text-gray-400 text-center py-4">All trades added</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: Zones + Quote Sections */}
                <div className="lg:col-span-3 space-y-4">
                    {/* ZONE MANAGER */}
                    <ZoneManager zones={zones} onZonesChange={setZones} />
                    {sections.length === 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                            <div className="text-5xl mb-4">📋</div>
                            <h3 className="text-xl font-medium text-gray-700">Start building your quote</h3>
                            <p className="text-gray-500 mt-2">Select a trade category from the left panel</p>
                        </div>
                    )}

                    {sections.map(section => (
                        <div
                            key={section.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(section.id, section.items.length)}
                        >
                            {/* Section Header */}
                            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-5 py-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleSectionExpanded(section.id)}
                                        className="text-gray-400 hover:text-gray-700 text-sm"
                                    >
                                        {section.isExpanded ? '▼' : '▶'}
                                    </button>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{section.displayName}</h3>
                                        <p className="text-xs text-gray-500">{section.items.length} line items</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Subtotal</div>
                                        <div className="font-bold text-lg text-gray-900">
                                            {formatCurrency(section.subtotalSelling, jurisdiction)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Margin</div>
                                        <div className={`font-bold text-lg ${section.overallMargin >= 0.35 ? 'text-green-600' : section.overallMargin >= 0.25 ? 'text-amber-500' : 'text-red-500'}`}>
                                            {(section.overallMargin * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeTradeSection(section.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        title="Remove section"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Section Items */}
                            {section.isExpanded && (
                                <div className="p-5">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                                <th className="pb-3 w-8"></th>
                                                <th className="pb-3 pl-2">Description</th>
                                                {zones.length > 0 && <th className="pb-3 w-28">Zone</th>}
                                                <th className="pb-3 w-20 text-center">L (m)</th>
                                                <th className="pb-3 w-20 text-center">W (m)</th>
                                                <th className="pb-3 w-20 text-center">Qty/Area</th>
                                                <th className="pb-3 w-16">Unit</th>
                                                <th className="pb-3 w-24 text-right">Rate</th>
                                                <th className="pb-3 w-16 text-center">Margin</th>
                                                <th className="pb-3 w-28 text-right">Price</th>
                                                <th className="pb-3 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {section.items.map((item, idx) => (
                                                <tr
                                                    key={item.id}
                                                    draggable
                                                    onDragStart={() => handleDragStart(section.id, item.id)}
                                                    onDrop={(e) => { e.stopPropagation(); handleDrop(section.id, idx); }}
                                                    className={`border-b border-gray-50 hover:bg-blue-50/50 cursor-move transition-colors ${item.isStaircase ? 'bg-amber-50' : ''}`}
                                                >
                                                    <td className="py-3 text-gray-300 text-center">⠿</td>
                                                    <td className="py-3 pl-2">
                                                        <div className="flex items-start gap-1">
                                                            {item.isOwnerSupplied && (
                                                                <span className="shrink-0 mt-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded" title="Client supplies material">
                                                                    OS
                                                                </span>
                                                            )}
                                                            <AutoCompleteInput
                                                                value={item.description}
                                                                onChange={(val) => updateLineItem(section.id, item.id, { description: val })}
                                                                onSelectSuggestion={(sug) => {
                                                                    // Auto-fill rate and unit from suggestion if available
                                                                    const updates: Record<string, unknown> = { description: sug.text };
                                                                    if (sug.rate) {
                                                                        updates.unitRate = sug.rate;
                                                                    }
                                                                    if (sug.materialRate !== undefined) {
                                                                        updates.materialCost = sug.materialRate;
                                                                    }
                                                                    if (sug.labourRate !== undefined) {
                                                                        updates.labourCost = sug.labourRate;
                                                                    }
                                                                    if (sug.unit) {
                                                                        updates.dimensions = { ...item.dimensions, unit: sug.unit as MeasurementUnit };
                                                                    }
                                                                    updateLineItem(section.id, item.id, updates as Partial<LineItem>);
                                                                }}
                                                                placeholder="Start typing... (AI will suggest)"
                                                                category={section.category}
                                                            />
                                                        </div>
                                                    </td>
                                                    {zones.length > 0 && (
                                                        <td className="py-3">
                                                            <select
                                                                value={item.zoneId || ''}
                                                                onChange={(e) => updateLineItem(section.id, item.id, { zoneId: e.target.value || undefined })}
                                                                className="w-full border border-gray-200 rounded px-1 py-1.5 text-xs focus:border-blue-400"
                                                            >
                                                                <option value="">—</option>
                                                                {zones.map(z => (
                                                                    <option key={z.id} value={z.id}>
                                                                        {z.name}{z.computedAreaSqm ? ` (${z.computedAreaSqm.toFixed(0)}sqm)` : ''}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                    )}
                                                    <td className="py-3">
                                                        <input
                                                            type="number"
                                                            value={item.dimensions.lengthFt || ''}
                                                            onChange={(e) => updateLineItem(section.id, item.id, {
                                                                dimensions: { ...item.dimensions, lengthFt: parseFloat(e.target.value) || undefined }
                                                            })}
                                                            placeholder="—"
                                                            className="w-full border border-gray-200 rounded px-2 py-1.5 text-center focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                                        />
                                                    </td>
                                                    <td className="py-3">
                                                        <input
                                                            type="number"
                                                            value={item.dimensions.widthFt || ''}
                                                            onChange={(e) => updateLineItem(section.id, item.id, {
                                                                dimensions: { ...item.dimensions, widthFt: parseFloat(e.target.value) || undefined }
                                                            })}
                                                            placeholder="—"
                                                            className="w-full border border-gray-200 rounded px-2 py-1.5 text-center focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                                        />
                                                    </td>
                                                    <td className="py-3">
                                                        <input
                                                            type="number"
                                                            value={item.dimensions.quantity || calculateQuantity(item.dimensions) || ''}
                                                            onChange={(e) => updateLineItem(section.id, item.id, {
                                                                dimensions: { ...item.dimensions, quantity: parseFloat(e.target.value) || undefined, lengthFt: undefined, widthFt: undefined }
                                                            })}
                                                            className="w-full border border-gray-200 rounded px-2 py-1.5 text-center focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                                        />
                                                    </td>
                                                    <td className="py-3">
                                                        <select
                                                            value={item.dimensions.unit}
                                                            onChange={(e) => updateLineItem(section.id, item.id, {
                                                                dimensions: { ...item.dimensions, unit: e.target.value as MeasurementUnit }
                                                            })}
                                                            className="w-full border border-gray-200 rounded px-1 py-1.5 text-xs focus:border-blue-400"
                                                        >
                                                            <option value="sqft">sqft</option>
                                                            <option value="sqm">sqm</option>
                                                            <optgroup label="── Linear ──">
                                                                <option value="lm">lm</option>
                                                                <option value="m">m</option>
                                                                <option value="mm">mm</option>
                                                            </optgroup>
                                                            <optgroup label="── Volume ──">
                                                                <option value="cu.m">cu.m</option>
                                                            </optgroup>
                                                            <optgroup label="── Count ──">
                                                                <option value="pcs">pcs</option>
                                                                <option value="nos">nos</option>
                                                                <option value="unit">unit</option>
                                                                <option value="set">set</option>
                                                                <option value="pair">pair</option>
                                                                <option value="lot">lot</option>
                                                                <option value="panel">panel</option>
                                                                <option value="leaf">leaf</option>
                                                            </optgroup>
                                                            <optgroup label="── Weight ──">
                                                                <option value="kg">kg</option>
                                                                <option value="ton">ton</option>
                                                            </optgroup>
                                                            <optgroup label="── Consumable ──">
                                                                <option value="roll">roll</option>
                                                                <option value="sheet">sheet</option>
                                                                <option value="bag">bag</option>
                                                                <option value="litre">litre</option>
                                                            </optgroup>
                                                            <optgroup label="── Labour ──">
                                                                <option value="day">day</option>
                                                                <option value="hr">hr</option>
                                                                <option value="trip">trip</option>
                                                            </optgroup>
                                                            <optgroup label="── Fixed ──">
                                                                <option value="ls">ls</option>
                                                            </optgroup>
                                                        </select>
                                                    </td>
                                                    <td className="py-3">
                                                        <input
                                                            type="number"
                                                            value={item.unitRate || ''}
                                                            onChange={(e) => updateLineItem(section.id, item.id, { unitRate: parseFloat(e.target.value) || 0 })}
                                                            placeholder="0.00"
                                                            className="w-full border border-gray-200 rounded px-2 py-1.5 text-right font-mono focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                                        />
                                                    </td>
                                                    <td className="py-3">
                                                        <input
                                                            type="number"
                                                            value={Math.round(item.margin * 100)}
                                                            onChange={(e) => updateLineItem(section.id, item.id, { margin: (parseFloat(e.target.value) || 0) / 100 })}
                                                            className="w-full border border-gray-200 rounded px-2 py-1.5 text-center focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                                            min="0"
                                                            max="80"
                                                        />
                                                    </td>
                                                    <td className="py-3 text-right font-medium font-mono pr-2">
                                                        {formatCurrency(item.sellingPrice, jurisdiction)}
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => {
                                                                    const toggled = !item.isOwnerSupplied;
                                                                    const newRate = toggled ? item.labourCost : (item.materialCost + item.labourCost);
                                                                    updateLineItem(section.id, item.id, {
                                                                        isOwnerSupplied: toggled,
                                                                        unitRate: newRate,
                                                                    });
                                                                }}
                                                                className={`shrink-0 w-6 h-6 rounded text-[9px] font-bold border transition-colors ${item.isOwnerSupplied
                                                                    ? 'bg-amber-100 border-amber-300 text-amber-700'
                                                                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-amber-300'
                                                                    }`}
                                                                title={item.isOwnerSupplied ? 'Client supplies material (click to toggle)' : 'Click if client supplies material'}
                                                            >
                                                                OS
                                                            </button>
                                                            <button
                                                                onClick={() => removeLineItem(section.id, item.id)}
                                                                className="text-gray-300 hover:text-red-500 transition-colors"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <button
                                        onClick={() => addLineItem(section.id)}
                                        className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                    >
                                        <span className="text-lg">+</span> Add Line Item
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* GRAND TOTAL */}
                    {sections.length > 0 && (
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold">Quote Total</h3>
                                    <p className="text-gray-400 text-sm">{sections.length} categories • {totals.itemCount} items</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-400 text-sm">Cost: {formatCurrency(totals.grandTotalCost, jurisdiction)}</div>
                                    <div className="text-3xl font-bold">
                                        {formatCurrency(totals.grandTotalSelling, jurisdiction)}
                                    </div>
                                    <div className={`text-sm font-medium mt-1 ${totals.overallMargin >= 0.35 ? 'text-green-400' : totals.overallMargin >= 0.25 ? 'text-amber-400' : 'text-red-400'}`}>
                                        {(totals.overallMargin * 100).toFixed(1)}% overall margin
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
