'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { TradeCategory, TRADE_PROFILES } from '@/types/trades';
import { Jurisdiction } from '@/types/core';
import { PropertyContext } from '@/types/site-protection';
import { RenovationPhase, TradeRole, CostFactors } from '@/types/quotation-model';
import { GeneratedTradeSection } from '@/lib/ai/auto-quote';
import ZoneManager, { Zone, computeZoneMetrics } from '@/components/ZoneManager';
import AutoCompleteInput from '@/components/AutoCompleteInput';
import { VENDOR_LIBRARY } from '@/data/vendor-library';
import { useVendorLibrary } from '@/hooks/useVendorLibrary';

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

//  Material Options (client configurator) 
interface MaterialOption {
    id: string;
    name: string;           // "Quartz (Caesarstone)"
    rate: number;           // 180
    description?: string;   // "Durable, low maintenance"
    isRecommended?: boolean;
}

//  Per-line comments 
interface LineComment {
    id: string;
    text: string;
    author: 'client' | 'designer';
    timestamp: string;
}

interface LineItem {
    id: string;
    description: string;
    dimensions: Dimensions;

    // Core Financials
    unitRate: number;
    costPrice: number;
    margin: number;
    sellingPrice: number;

    // Traditional Multipliers
    isStaircase?: boolean;
    productivityMultiplier: number;

    // Owner-supplied & cost split
    materialCost: number;
    labourCost: number;
    isOwnerSupplied: boolean;

    // Zone assignment
    zoneId?: string;

    // --- HYBRID CHINA MODEL EXTENSIONS ---
    phase: RenovationPhase;
    tradeRole: TradeRole | 'CUSTOM';
    customRoleName?: string;

    // Advanced Factors
    wastage: number; // 0.05
    risk: number;    // 0.03
    timeline?: number; // 1.0

    // Blank Canvas / Manual
    isManualOverride?: boolean;
    vendorId?: string; // New field for Vendor Library
    isGift?: boolean;  //  FOC item
    manualPrice?: number;

    // --- CSV-MATCHED COLUMNS ---
    location?: string;       // Room/Zone: living room, kitchen, master bathroom, etc.
    taskType?: string;       // Task type: dismantle, demolish, install, screed, etc.
    specifications?: string; // Open-ended specs: "pressfitt tightened 15mm SS304..."

    //  Interactive Client Quote 
    materialOptions?: MaterialOption[];   // Options for client to choose from
    selectedOptionId?: string;            // Client's chosen option
    clientStatus?: 'pending' | 'approved' | 'flagged';  // Client review state
    comments?: LineComment[];             // Per-line comment thread
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
// DROPDOWN OPTIONS (matching backend CSV)
// ============================================================

const LOCATION_OPTIONS = [
    'nil', 'living room', 'dining room', 'kitchen', 'master bedroom', 'bedroom 2', 'bedroom 3',
    'master bathroom', 'common bathroom', 'foyer', 'study room', 'utility room',
    'balcony', 'service yard', 'entire unit', 'entire unit flooring', 'corridor',
];

const TASK_TYPE_OPTIONS = [
    'drafting', 'sourcing', 'application', 'dismantle', 'demolish', 'remove',
    'protection and moving', 'disposal', 'waterproofing', 'screed', 'lay tiles',
    'install', 'install pipes', 'supply and install', 'fabricate', 'restore',
    'hack', 'plaster', 'paint', 'wiring', 'piping', 'custom',
];

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

    // Vendor Library Hook
    const { vendors, getVendorPrice } = useVendorLibrary();

    const getVendorsByCategory = (category: string) => {
        return vendors.filter(v => v.categories.includes(category as TradeCategory) || v.id === 'generic');
    };

    // Drag state
    const [draggedItem, setDraggedItem] = useState<{ sectionId: string; itemId: string } | null>(null);

    // Overflow menu state
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Material options editor state
    const [editingOptionsId, setEditingOptionsId] = useState<string | null>(null);

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
                // Defaults for upgraded model
                phase: RenovationPhase.HARD,
                tradeRole: TradeRole.GENERAL_BUILDER,
                wastage: 0.05,
                risk: 0.03,
                timeline: 1.0,
                isManualOverride: false,
                vendorId: 'generic'
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
        console.log(`Adding trade section: ${category}`);
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
        setSections(prev => {
            const next = [...prev, newSection];
            // Scroll to bottom after state update
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 100);
            return next;
        });
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
            // Cap margin at 95% to prevent division by zero/near-zero
            ? (subtotalSelling - subtotalCost) / subtotalSelling
            : 0;
        return { ...section, subtotalCost, subtotalSelling, overallMargin };
    };

    const calculateSellingPrice = (item: Partial<LineItem>): number => {
        // 1. MANUAL OVERRIDE (selling price is fixed, we back-calculate cost if needed)
        // If manual override is on, we don't calculate selling price from cost. 
        // We just return what's set.
        if (item.isManualOverride) {
            return item.sellingPrice || 0;
        }

        // 2. GIFT MODE: Selling price is 0
        if (item.isGift) {
            return 0;
        }

        const qty = item.dimensions?.quantity || 1;
        const prodMult = item.productivityMultiplier || 1.0;
        const matRate = item.materialCost || 0;
        const labRate = item.labourCost || 0;
        const wastage = item.wastage || 0.05;
        const risk = item.risk || 0.03;
        const timeline = item.timeline || 1.0;

        // FIX: Use nullish coalescing to allow 0 margin
        const margin = item.margin ?? 0.35; // Default 35% if undefined
        const isOwnerSupplied = item.isOwnerSupplied || false;

        // --- THE HYBRID FORMULA ---
        // P = [ Outcome * (Resources + Wastage) * Difficulty * Timeline ] / (1 - Margin) + Risk

        // A. Resources (Material only if not owner supplied)
        const effectiveMatRate = isOwnerSupplied ? 0 : matRate * (1 + wastage);
        const effectiveLabRate = labRate;

        // B. Base Rate per Unit (Mat + Lab)
        const baseUnitRate = effectiveMatRate + effectiveLabRate;

        // C. Total Direct Cost (Outcome * Rate * Difficulty * Timeline)
        const directCost = (qty * baseUnitRate * prodMult * timeline);

        // D. Risk Buffer (Percentage of direct cost)
        const riskBuffer = directCost * risk;

        // E. Total Cost
        const totalCost = directCost + riskBuffer;

        // F. Final Price with Margin
        // Selling = Cost / (1 - Margin)
        const safeMargin = Math.min(Math.max(margin, 0), 0.95);

        // Prevent division by zero if margin is 1 (100%)
        if (safeMargin >= 1) return totalCost * 100; // Edge case

        return totalCost / (1 - safeMargin);
    };

    // Update calculateLineItem to populate costPrice and sellingPrice
    const calculateLineItem = (item: LineItem): LineItem => {
        const selling = calculateSellingPrice(item);

        // Back-calculate cost for display
        // FIX: Use nullish coalescing to allow 0 margin
        const margin = item.margin ?? 0.35;

        // If it's a gift, cost is still calculated based on formulabut selling is 0.
        // If manual override, cost is also derived from manual selling price and margin.

        // If it is a gift, we want to know the ACTUAL cost, which is the selling price IF it wasn't a gift, minus the margin.
        // Wait, calculateSellingPrice(isGift=false) returns the Target Selling Price.
        // Target Selling * (1-margin) = Cost.

        let calculatedCost = 0;

        if (item.isGift) {
            const theoreticalSelling = calculateSellingPrice({ ...item, isGift: false });
            calculatedCost = theoreticalSelling * (1 - margin);
        } else {
            // Normal case: Cost = Selling * (1 - margin)
            // This assumes Selling was derived from Cost / (1 - margin)
            // So Cost = [Cost / (1 - margin)] * (1 - margin) = Cost. Correct.
            calculatedCost = selling * (1 - margin);
        }

        return {
            ...item,
            costPrice: calculatedCost,
            sellingPrice: selling
        };
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
            dimensions: { unit: 'ls', quantity: 1 },
            unitRate: 0,
            costPrice: 0,
            margin: 0.35,
            sellingPrice: 0,
            productivityMultiplier: 1.0,
            materialCost: 0,
            labourCost: 0,
            isOwnerSupplied: false,
            // New Defaults
            phase: RenovationPhase.HARD,
            tradeRole: TradeRole.GENERAL_BUILDER,
            wastage: 0.05,
            risk: 0.03,
            timeline: 1.0,
            isManualOverride: false,
            vendorId: 'generic',
            isGift: false, // Default for new items
            // CSV-matched defaults
            location: '',
            taskType: '',
            specifications: '',
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

                return calculateLineItem(updated);
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

    // Ordered by natural renovation workflow Roof
    const TRADE_Roof: TradeCategory[] = [
        'design_submissions', 'preliminaries', 'demolition',
        'masonry', 'waterproofing',
        'carpentry', 'metalworks', 'glassworks',
        'ceiling', 'flooring', 'painting',
        'electrical', 'plumbing', 'aircon',
        'cleaning',
    ];
    const usedTrades = sections.map(s => s.category);
    const unusedTrades = TRADE_Roof
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
                        <p className="text-gray-500 text-sm mt-1">Drag-drop line items  Auto-calculate dimensions  Trade subtotals</p>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">MARKET</label>
                            <select
                                value={jurisdiction}
                                onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium"
                            >
                                <option value="SG"> Singapore</option>
                                <option value="MY"> Malaysia</option>
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
                {/* LEFT PANEL: Zones + Quote Sections (main work area) */}
                <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
                    {/* ZONE MANAGER */}
                    <ZoneManager zones={zones} onZonesChange={setZones} />
                    {sections.length === 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                            <div className="text-5xl mb-4"></div>
                            <h3 className="text-xl font-medium text-gray-700">Start building your quote</h3>
                            <p className="text-gray-500 mt-2">Select a trade category from the right panel</p>
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
                            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 border-l-4 border-l-blue-500 px-5 py-3 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleSectionExpanded(section.id)}
                                        className="text-gray-400 hover:text-gray-700 text-sm"
                                    >
                                        {section.isExpanded ? '' : ''}
                                    </button>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base">{section.displayName}</h3>
                                        <p className="text-[11px] text-gray-400">{section.items.length} items</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Subtotal</div>
                                        <div className="font-bold text-lg text-gray-900">
                                            {formatCurrency(section.subtotalSelling, jurisdiction)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Margin</div>
                                        <div className={`font-bold text-lg ${section.overallMargin >= 0.15 ? 'text-emerald-600' : section.overallMargin >= 0.10 ? 'text-amber-500' : 'text-red-500'}`}>
                                            {(section.overallMargin * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeTradeSection(section.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                        title="Remove section"
                                    >

                                    </button>
                                </div>
                            </div>

                            {/* Section Items */}
                            {section.isExpanded && (
                                <div className="p-5">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="pb-2 w-6"></th>
                                                <th colSpan={zones.length > 0 ? 13 : 12} className="text-left pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                                                <th className="pb-2 w-8"></th>
                                            </tr>
                                            <tr className="border-b border-gray-200 bg-gray-50/80 sticky top-0 z-10">
                                                <th></th>
                                                <th className="text-center py-1.5 text-[9px] font-semibold text-gray-400 uppercase bg-gray-50/80">Location</th>
                                                <th className="text-center py-1.5 text-[9px] font-semibold text-gray-400 uppercase bg-gray-50/80">Task Type</th>
                                                <th className="text-center py-1.5 text-[9px] font-semibold text-gray-400 uppercase bg-gray-50/80">Specifications</th>
                                                {zones.length > 0 && <th className="text-center py-1.5 text-[9px] font-semibold text-gray-400 uppercase bg-gray-50/80">Zone</th>}
                                                <th className="text-center py-1.5 text-[9px] font-semibold text-gray-400 uppercase bg-gray-50/80">Qty</th>
                                                <th className="text-center py-1.5 text-[9px] font-semibold text-gray-400 uppercase bg-gray-50/80">Unit</th>
                                                <th className="text-center py-1.5 text-[9px] font-semibold text-gray-400 uppercase bg-gray-50/80">Rate</th>
                                                <th className="text-left py-1.5 text-[9px] font-semibold text-gray-400 uppercase bg-gray-50/80">Phase</th>
                                                <th className="text-center py-1.5 text-[9px] font-semibold text-gray-400 uppercase bg-gray-50/80">Margin %</th>
                                                <th className="text-right py-1.5 text-[9px] font-semibold text-gray-400 uppercase bg-gray-50/80">Price</th>
                                                <th className="bg-gray-50/80"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {section.items.map((item, idx) => (
                                                <React.Fragment key={item.id}>
                                                    {/*  ROW 1: Description (full width)  */}
                                                    <tr
                                                        draggable
                                                        onDragStart={() => handleDragStart(section.id, item.id)}
                                                        onDrop={(e) => { e.stopPropagation(); handleDrop(section.id, idx); }}
                                                        className={`group/row border-t border-gray-100 ${item.isStaircase ? 'bg-amber-50' : idx % 2 === 1 ? 'bg-slate-50/60' : ''} hover:bg-blue-50/40 cursor-move transition-colors`}
                                                    >
                                                        <td className="pt-2 pb-0.5 text-center align-top" rowSpan={2}>
                                                            <span className="text-[10px] font-mono text-gray-400">{idx + 1}</span>
                                                        </td>
                                                        <td colSpan={zones.length > 0 ? 13 : 12} className="pt-2 pb-0.5 pl-1">
                                                            <div className="flex items-start gap-2">
                                                                {item.isOwnerSupplied && (
                                                                    <span className="shrink-0 mt-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded" title="Client supplies material">
                                                                        OS
                                                                    </span>
                                                                )}
                                                                {item.isGift && (
                                                                    <span className="shrink-0 mt-1 px-1.5 py-0.5 bg-pink-100 text-pink-600 text-[10px] font-bold rounded">
                                                                        FOC
                                                                    </span>
                                                                )}
                                                                {item.materialOptions && item.materialOptions.length > 0 && (
                                                                    <span className="shrink-0 mt-1 px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded">
                                                                        {item.materialOptions.length} options
                                                                    </span>
                                                                )}
                                                                <div className="flex-1">
                                                                    <AutoCompleteInput
                                                                        value={item.description}
                                                                        onChange={(val) => updateLineItem(section.id, item.id, { description: val })}
                                                                        onSelectSuggestion={(sug) => {
                                                                            const updates: Record<string, unknown> = { description: sug.text };
                                                                            if (sug.rate) updates.unitRate = sug.rate;
                                                                            if (sug.materialRate !== undefined) updates.materialCost = sug.materialRate;
                                                                            if (sug.labourRate !== undefined) updates.labourCost = sug.labourRate;
                                                                            if (sug.unit) updates.dimensions = { ...item.dimensions, unit: sug.unit as MeasurementUnit };
                                                                            updateLineItem(section.id, item.id, updates as Partial<LineItem>);
                                                                        }}
                                                                        placeholder="Start typing... (AI will suggest)"
                                                                        category={section.category}
                                                                    />
                                                                </div>
                                                                {/* Vendor selector inline */}
                                                                <select
                                                                    className="shrink-0 text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-500 hover:border-blue-300 max-w-[140px]"
                                                                    value={item.vendorId || ''}
                                                                    onChange={(e) => {
                                                                        const newVendorId = e.target.value;
                                                                        const updates: Partial<LineItem> = { vendorId: newVendorId };
                                                                        if (newVendorId && newVendorId !== 'generic') {
                                                                            const vendorPriceData = getVendorPrice(newVendorId, item.description);
                                                                            if (vendorPriceData !== null) {
                                                                                updates.unitRate = vendorPriceData.price;
                                                                                if (vendorPriceData.unit) {
                                                                                    updates.dimensions = { ...item.dimensions, unit: vendorPriceData.unit as MeasurementUnit };
                                                                                }
                                                                            }
                                                                        }
                                                                        updateLineItem(section.id, item.id, updates);
                                                                    }}
                                                                >
                                                                    <option value="">(No Vendor)</option>
                                                                    <option value="generic">Generic / Market Rate</option>
                                                                    {getVendorsByCategory(section.category).filter(v => v.id !== 'generic').map(v => (
                                                                        <option key={v.id} value={v.id}>{v.name}</option>
                                                                    ))}
                                                                </select>
                                                                {item.vendorId && item.vendorId !== 'generic' && getVendorPrice(item.vendorId, item.description) !== null && (
                                                                    <span className="text-[10px] text-green-600 font-bold shrink-0 mt-1" title="Price matched from vendor list"></span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="pt-2 pb-0.5 align-top relative">
                                                            <div className="flex items-center gap-1">
                                                                {/* Active state badges */}
                                                                {item.isOwnerSupplied && (
                                                                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded">OS</span>
                                                                )}
                                                                {item.isManualOverride && (
                                                                    <span className="px-1.5 py-0.5 bg-black text-white text-[9px] font-bold rounded">Manual</span>
                                                                )}
                                                                {/*  trigger */}
                                                                <button
                                                                    onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                                                                    className="w-6 h-6 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-sm opacity-0 group-hover/row:opacity-100 flex items-center justify-center"
                                                                    title="More options"
                                                                ></button>
                                                            </div>
                                                            {/* Dropdown menu */}
                                                            {openMenuId === item.id && (
                                                                <>
                                                                    <div className="fixed inset-0 z-20" onClick={() => setOpenMenuId(null)} />
                                                                    <div className="absolute right-0 top-8 z-30 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-52 text-xs">
                                                                        <button
                                                                            onClick={() => {
                                                                                const toggled = !item.isOwnerSupplied;
                                                                                updateLineItem(section.id, item.id, {
                                                                                    isOwnerSupplied: toggled,
                                                                                    unitRate: toggled ? item.labourCost : (item.materialCost + item.labourCost),
                                                                                });
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 ${item.isOwnerSupplied ? 'text-amber-700 font-medium' : 'text-gray-700'}`}
                                                                        >
                                                                            <span>{item.isOwnerSupplied ? '' : ' '}</span>
                                                                            Client supplies material
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                updateLineItem(section.id, item.id, { isManualOverride: !item.isManualOverride });
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 ${item.isManualOverride ? 'text-gray-900 font-medium' : 'text-gray-700'}`}
                                                                        >
                                                                            <span>{item.isManualOverride ? '' : ' '}</span>
                                                                            Override price manually
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                updateLineItem(section.id, item.id, { isGift: !item.isGift });
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 ${item.isGift ? 'text-pink-600 font-medium' : 'text-gray-700'}`}
                                                                        >
                                                                            <span>{item.isGift ? '' : ' '}</span>
                                                                            Mark as gift / FOC
                                                                        </button>
                                                                        <div className="border-t border-gray-100 my-1" />
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingOptionsId(editingOptionsId === item.id ? null : item.id);
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 ${item.materialOptions && item.materialOptions.length > 0 ? 'text-purple-600 font-medium' : 'text-gray-700'}`}
                                                                        >
                                                                            <span>{item.materialOptions && item.materialOptions.length > 0 ? `${item.materialOptions.length}` : '+'}</span>
                                                                            {item.materialOptions && item.materialOptions.length > 0 ? 'Edit material options' : 'Add material options'}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                removeLineItem(section.id, item.id);
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                                                                        >
                                                                            <span></span>
                                                                            Remove item
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    {/*  ROW 2: Variables (all fields)  */}
                                                    <tr className={`border-b border-gray-100 ${item.isStaircase ? 'bg-amber-50' : idx % 2 === 1 ? 'bg-slate-50/60' : ''} hover:bg-blue-50/40 transition-colors`}>
                                                        {/* Location (dropdown) */}
                                                        <td className="pb-2 pt-0.5">
                                                            <select
                                                                value={item.location || ''}
                                                                onChange={(e) => updateLineItem(section.id, item.id, { location: e.target.value })}
                                                                className="w-full border border-gray-200 rounded px-1 py-1 text-xs focus:border-blue-400 min-w-[90px]"
                                                            >
                                                                <option value="">—</option>
                                                                {LOCATION_OPTIONS.map(loc => (
                                                                    <option key={loc} value={loc}>{loc}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        {/* Task Type (dropdown) */}
                                                        <td className="pb-2 pt-0.5">
                                                            <select
                                                                value={item.taskType || ''}
                                                                onChange={(e) => updateLineItem(section.id, item.id, { taskType: e.target.value })}
                                                                className="w-full border border-gray-200 rounded px-1 py-1 text-xs focus:border-blue-400 min-w-[80px]"
                                                            >
                                                                <option value="">—</option>
                                                                {TASK_TYPE_OPTIONS.map(tt => (
                                                                    <option key={tt} value={tt}>{tt}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        {/* Specifications (open-ended) */}
                                                        <td className="pb-2 pt-0.5">
                                                            <input
                                                                type="text"
                                                                value={item.specifications || ''}
                                                                onChange={(e) => updateLineItem(section.id, item.id, { specifications: e.target.value })}
                                                                placeholder="e.g. 15mm SS304 stainless"
                                                                className="w-full border border-gray-200 rounded px-1.5 py-1 text-xs focus:border-blue-400 min-w-[120px]"
                                                            />
                                                        </td>
                                                        {/* Zone */}
                                                        {zones.length > 0 && (
                                                            <td className="pb-2 pt-0.5">
                                                                <select
                                                                    value={item.zoneId || ''}
                                                                    onChange={(e) => updateLineItem(section.id, item.id, { zoneId: e.target.value || undefined })}
                                                                    className="w-full border border-gray-200 rounded px-1 py-1 text-xs focus:border-blue-400"
                                                                >
                                                                    <option value=""></option>
                                                                    {zones.map(z => (
                                                                        <option key={z.id} value={z.id}>
                                                                            {z.name}{z.computedAreaSqm ? ` (${z.computedAreaSqm.toFixed(0)}sqm)` : ''}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                        )}
                                                        {/* L */}
                                                        <td className="pb-2 pt-0.5">
                                                            <input
                                                                type="number"
                                                                value={item.dimensions.lengthFt || ''}
                                                                onChange={(e) => updateLineItem(section.id, item.id, {
                                                                    dimensions: { ...item.dimensions, lengthFt: parseFloat(e.target.value) || undefined }
                                                                })}
                                                                placeholder=""
                                                                className="w-14 border border-gray-200 rounded px-1 py-1 text-center text-xs focus:border-blue-400"
                                                            />
                                                        </td>
                                                        {/* W */}
                                                        <td className="pb-2 pt-0.5">
                                                            <input
                                                                type="number"
                                                                value={item.dimensions.widthFt || ''}
                                                                onChange={(e) => updateLineItem(section.id, item.id, {
                                                                    dimensions: { ...item.dimensions, widthFt: parseFloat(e.target.value) || undefined }
                                                                })}
                                                                placeholder=""
                                                                className="w-14 border border-gray-200 rounded px-1 py-1 text-center text-xs focus:border-blue-400"
                                                            />
                                                        </td>
                                                        {/* Qty */}
                                                        <td className="pb-2 pt-0.5">
                                                            <input
                                                                type="number"
                                                                value={item.dimensions.quantity || calculateQuantity(item.dimensions) || ''}
                                                                onChange={(e) => updateLineItem(section.id, item.id, {
                                                                    dimensions: { ...item.dimensions, quantity: parseFloat(e.target.value) || undefined, lengthFt: undefined, widthFt: undefined }
                                                                })}
                                                                className="w-14 border border-gray-200 rounded px-1 py-1 text-center text-xs focus:border-blue-400"
                                                            />
                                                        </td>
                                                        {/* Unit */}
                                                        <td className="pb-2 pt-0.5">
                                                            <select
                                                                value={item.dimensions.unit}
                                                                onChange={(e) => updateLineItem(section.id, item.id, {
                                                                    dimensions: { ...item.dimensions, unit: e.target.value as MeasurementUnit }
                                                                })}
                                                                className="w-full border border-gray-200 rounded px-1 py-1 text-xs focus:border-blue-400"
                                                            >
                                                                <option value="sqft">Sq Feet</option>
                                                                <option value="sqm">Sq Metre</option>
                                                                <optgroup label=" Linear ">
                                                                    <option value="lm">Linear m</option>
                                                                    <option value="m">Metre</option>
                                                                    <option value="mm">Millimetre</option>
                                                                </optgroup>
                                                                <optgroup label=" Volume ">
                                                                    <option value="cu.m">Cubic m</option>
                                                                </optgroup>
                                                                <optgroup label=" Count ">
                                                                    <option value="pcs">Pieces</option>
                                                                    <option value="nos">Roof</option>
                                                                    <option value="unit">Unit</option>
                                                                    <option value="set">Set</option>
                                                                    <option value="pair">Pair</option>
                                                                    <option value="lot">Lot</option>
                                                                    <option value="panel">Panel</option>
                                                                    <option value="leaf">Leaf</option>
                                                                </optgroup>
                                                                <optgroup label=" Weight ">
                                                                    <option value="kg">Kilogram</option>
                                                                    <option value="ton">Tonne</option>
                                                                </optgroup>
                                                                <optgroup label=" Consumable ">
                                                                    <option value="roll">Roll</option>
                                                                    <option value="sheet">Sheet</option>
                                                                    <option value="bag">Bag</option>
                                                                    <option value="litre">Litre</option>
                                                                </optgroup>
                                                                <optgroup label=" Labour ">
                                                                    <option value="day">Day</option>
                                                                    <option value="hr">Hour</option>
                                                                    <option value="trip">Trip</option>
                                                                </optgroup>
                                                                <optgroup label=" Fixed ">
                                                                    <option value="ls">Lump Sum</option>
                                                                </optgroup>
                                                            </select>
                                                        </td>
                                                        {/* Rate */}
                                                        <td className="pb-2 pt-0.5">
                                                            <input
                                                                type="number"
                                                                value={item.unitRate || ''}
                                                                onChange={(e) => updateLineItem(section.id, item.id, { unitRate: parseFloat(e.target.value) || 0 })}
                                                                placeholder="0.00"
                                                                className="w-20 border border-gray-200 rounded px-1 py-1 text-center text-xs focus:border-blue-400"
                                                            />
                                                        </td>
                                                        {/* Phase/Role */}
                                                        <td className="pb-2 pt-0.5">
                                                            <div className="flex flex-col gap-0.5">
                                                                <select
                                                                    value={item.phase}
                                                                    onChange={(e) => updateLineItem(section.id, item.id, { phase: e.target.value as RenovationPhase })}
                                                                    className={`w-full text-[10px] font-bold uppercase rounded px-1 py-0.5 border ${item.phase === RenovationPhase.HIDDEN ? 'bg-red-50 text-red-700 border-red-200' :
                                                                        item.phase === RenovationPhase.HARD ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                            item.phase === RenovationPhase.SOFT ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                                                'bg-gray-50 text-gray-700 border-gray-200'
                                                                        }`}
                                                                >
                                                                    <option value={RenovationPhase.HIDDEN}>Hidden</option>
                                                                    <option value={RenovationPhase.HARD}>Hard</option>
                                                                    <option value={RenovationPhase.SOFT}>Soft</option>
                                                                    <option value={RenovationPhase.OTHER}>Other</option>
                                                                </select>
                                                                <select
                                                                    value={item.tradeRole === 'CUSTOM' ? 'CUSTOM' : item.tradeRole}
                                                                    onChange={(e) => updateLineItem(section.id, item.id, { tradeRole: e.target.value as TradeRole | 'CUSTOM' })}
                                                                    className="w-full text-[10px] text-gray-600 border border-gray-200 rounded px-1 py-0.5"
                                                                >
                                                                    {Object.values(TradeRole).map(role => (
                                                                        <option key={role} value={role}>{role}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </td>
                                                        {/* Margin */}
                                                        <td className="pb-2 pt-0.5">
                                                            <input
                                                                type="number"
                                                                value={Math.round(item.margin * 100)}
                                                                onChange={(e) => {
                                                                    const val = parseFloat(e.target.value);
                                                                    const newMargin = isNaN(val) ? 0 : val / 100;
                                                                    updateLineItem(section.id, item.id, { margin: newMargin });
                                                                }}
                                                                className="w-14 border border-gray-200 rounded px-1 py-1 text-center text-xs focus:border-blue-400"
                                                                min="0"
                                                                max="100"
                                                            />
                                                        </td>
                                                        {/* Price */}
                                                        <td className="pb-2 pt-0.5 text-right">
                                                            {item.isGift ? (
                                                                <span className="inline-block px-2 py-0.5 bg-pink-100 text-pink-600 text-xs font-bold rounded"> FOC</span>
                                                            ) : (
                                                                <span className="font-bold text-gray-900 text-sm">
                                                                    {formatCurrency(item.sellingPrice, jurisdiction)}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="pb-2 pt-0.5"></td>
                                                    </tr>

                                                    {/*  ROW 3: Material Options Editor (collapsible)  */}
                                                    {editingOptionsId === item.id && (
                                                        <tr className="border-b border-purple-100 bg-purple-50/30">
                                                            <td></td>
                                                            <td colSpan={zones.length > 0 ? 11 : 10} className="py-3 px-2">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-xs font-bold text-purple-700">Material Options</span>
                                                                    <span className="text-[10px] text-gray-400">Client will choose one in their view</span>
                                                                    <button
                                                                        onClick={() => setEditingOptionsId(null)}
                                                                        className="ml-auto text-gray-400 hover:text-gray-600 text-xs"
                                                                    >Close </button>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {(item.materialOptions || []).map((opt, optIdx) => (
                                                                        <div key={opt.id} className={`flex items-center gap-2 p-2 rounded-lg border ${opt.isRecommended ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-white'}`}>
                                                                            <button
                                                                                onClick={() => {
                                                                                    const opts = (item.materialOptions || []).map(o => ({
                                                                                        ...o,
                                                                                        isRecommended: o.id === opt.id,
                                                                                    }));
                                                                                    updateLineItem(section.id, item.id, { materialOptions: opts, selectedOptionId: opt.id });
                                                                                }}
                                                                                className={`text-xs ${opt.isRecommended ? 'text-purple-600' : 'text-gray-300 hover:text-purple-400'}`}
                                                                                title="Set as recommended"
                                                                            >{opt.isRecommended ? '' : ''}</button>
                                                                            <input
                                                                                type="text"
                                                                                value={opt.name}
                                                                                onChange={(e) => {
                                                                                    const opts = [...(item.materialOptions || [])];
                                                                                    opts[optIdx] = { ...opts[optIdx], name: e.target.value };
                                                                                    updateLineItem(section.id, item.id, { materialOptions: opts });
                                                                                }}
                                                                                placeholder="Option name (e.g. Quartz)"
                                                                                className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:border-purple-400"
                                                                            />
                                                                            <input
                                                                                type="number"
                                                                                value={opt.rate || ''}
                                                                                onChange={(e) => {
                                                                                    const opts = [...(item.materialOptions || [])];
                                                                                    opts[optIdx] = { ...opts[optIdx], rate: parseFloat(e.target.value) || 0 };
                                                                                    updateLineItem(section.id, item.id, { materialOptions: opts });
                                                                                }}
                                                                                placeholder="Rate"
                                                                                className="w-20 border border-gray-200 rounded px-2 py-1 text-xs text-right focus:border-purple-400"
                                                                            />
                                                                            <span className="text-[10px] text-gray-400">/{item.dimensions.unit}</span>
                                                                            <input
                                                                                type="text"
                                                                                value={opt.description || ''}
                                                                                onChange={(e) => {
                                                                                    const opts = [...(item.materialOptions || [])];
                                                                                    opts[optIdx] = { ...opts[optIdx], description: e.target.value };
                                                                                    updateLineItem(section.id, item.id, { materialOptions: opts });
                                                                                }}
                                                                                placeholder="Short description"
                                                                                className="w-40 border border-gray-200 rounded px-2 py-1 text-xs focus:border-purple-400"
                                                                            />
                                                                            <button
                                                                                onClick={() => {
                                                                                    const opts = (item.materialOptions || []).filter(o => o.id !== opt.id);
                                                                                    updateLineItem(section.id, item.id, { materialOptions: opts.length > 0 ? opts : undefined });
                                                                                }}
                                                                                className="text-gray-300 hover:text-red-500 text-xs"
                                                                            ></button>
                                                                        </div>
                                                                    ))}
                                                                    <button
                                                                        onClick={() => {
                                                                            const opts = [...(item.materialOptions || [])];
                                                                            const newOpt: MaterialOption = {
                                                                                id: `opt-${Date.now()}`,
                                                                                name: '',
                                                                                rate: item.unitRate,
                                                                                isRecommended: opts.length === 0,
                                                                            };
                                                                            opts.push(newOpt);
                                                                            updateLineItem(section.id, item.id, {
                                                                                materialOptions: opts,
                                                                                selectedOptionId: opts.find(o => o.isRecommended)?.id || opts[0]?.id,
                                                                            });
                                                                        }}
                                                                        className="text-purple-600 hover:text-purple-800 text-xs font-medium flex items-center gap-1"
                                                                    >
                                                                        <span>+</span> Add option
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
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
                                    <p className="text-gray-400 text-sm">{sections.length} categories  {totals.itemCount} items</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-400 text-sm">Cost: {formatCurrency(totals.grandTotalCost, jurisdiction)}</div>
                                    <div className="text-3xl font-bold">
                                        {formatCurrency(totals.grandTotalSelling, jurisdiction)}
                                    </div>
                                    <div className={`text-sm font-medium mt-1 ${totals.overallMargin >= 0.15 ? 'text-emerald-400' : totals.overallMargin >= 0.10 ? 'text-amber-400' : 'text-red-400'}`}>
                                        {(totals.overallMargin * 100).toFixed(1)}% overall margin
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL: Trade Selector */}
                <div className="lg:col-span-1 order-1 lg:order-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:sticky lg:top-24 z-10">
                        <h3 className="font-bold text-gray-900 mb-1 text-sm"> Add Trade</h3>
                        <p className="text-[10px] text-gray-400 mb-3">Click a category to add it to your quote</p>
                        <div className="space-y-1.5 max-h-[calc(100vh-300px)] overflow-y-auto">
                            {unusedTrades.map(trade => {
                                const profile = TRADE_PROFILES[trade];
                                return (
                                    <button
                                        key={trade}
                                        onClick={() => addTradeSection(trade)}
                                        className="w-full text-left px-3 py-2 rounded-lg border border-gray-100 hover:border-blue-400 hover:bg-blue-50 transition-all group cursor-pointer active:scale-[0.98]"
                                    >
                                        <div className="font-medium text-gray-800 text-[12px] group-hover:text-blue-700">{profile.displayName}</div>
                                        <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{profile.description}</div>
                                    </button>
                                );
                            })}
                            {unusedTrades.length === 0 && (
                                <div className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded-lg"> All trades added</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
