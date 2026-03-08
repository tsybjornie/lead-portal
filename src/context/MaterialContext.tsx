'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { MaterialSelection, SupplierInfo } from '@/data/materialEncyclopedia';

// ============================================================
// MATERIAL CONTEXT — Design Selection State Management
// Connects Sequence (browse/select) → Quote Builder (price) → Dispatch (spec)
// ============================================================

interface MaterialContextType {
    // Selections
    selections: MaterialSelection[];
    addSelection: (selection: Omit<MaterialSelection, 'id'>) => void;
    updateSelection: (id: string, updates: Partial<MaterialSelection>) => void;
    removeSelection: (id: string) => void;
    getSelectionsByRoom: (room: string) => MaterialSelection[];
    getSelectionsByTrade: (trade: string) => MaterialSelection[];

    // Totals
    totalCost: number;
    totalRetail: number;
    totalProfit: number;

    // Per-room totals
    getRoomTotals: (room: string) => { cost: number; retail: number; profit: number };
}

const MaterialContext = createContext<MaterialContextType | null>(null);

export function useMaterialContext() {
    const ctx = useContext(MaterialContext);
    if (!ctx) {
        // Return a no-op context instead of throwing — allows usage before provider wraps
        return {
            selections: [],
            addSelection: () => { },
            updateSelection: () => { },
            removeSelection: () => { },
            getSelectionsByRoom: () => [],
            getSelectionsByTrade: () => [],
            totalCost: 0,
            totalRetail: 0,
            totalProfit: 0,
            getRoomTotals: () => ({ cost: 0, retail: 0, profit: 0 }),
        } as MaterialContextType;
    }
    return ctx;
}

export function MaterialProvider({ children }: { children: ReactNode }) {
    const [selections, setSelections] = useState<MaterialSelection[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('roof_material_selections');
            if (saved) setSelections(JSON.parse(saved));
        } catch { /* ignore */ }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem('roof_material_selections', JSON.stringify(selections));
        } catch { /* ignore */ }
    }, [selections]);

    const addSelection = useCallback((selection: Omit<MaterialSelection, 'id'>) => {
        const id = `mat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        setSelections(prev => [...prev, { ...selection, id }]);
    }, []);

    const updateSelection = useCallback((id: string, updates: Partial<MaterialSelection>) => {
        setSelections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }, []);

    const removeSelection = useCallback((id: string) => {
        setSelections(prev => prev.filter(s => s.id !== id));
    }, []);

    const getSelectionsByRoom = useCallback((room: string) => {
        return selections.filter(s => s.room === room);
    }, [selections]);

    const getSelectionsByTrade = useCallback((trade: string) => {
        return selections.filter(s => s.tradeCategory === trade);
    }, [selections]);

    // Calculate totals
    const totalCost = selections.reduce((sum, s) => sum + (s.costTotal || 0), 0);
    const totalRetail = selections.reduce((sum, s) => sum + (s.retailTotal || 0), 0);
    const totalProfit = totalRetail - totalCost;

    const getRoomTotals = useCallback((room: string) => {
        const roomSelections = selections.filter(s => s.room === room);
        const cost = roomSelections.reduce((sum, s) => sum + (s.costTotal || 0), 0);
        const retail = roomSelections.reduce((sum, s) => sum + (s.retailTotal || 0), 0);
        return { cost, retail, profit: retail - cost };
    }, [selections]);

    return (
        <MaterialContext.Provider value={{
            selections,
            addSelection,
            updateSelection,
            removeSelection,
            getSelectionsByRoom,
            getSelectionsByTrade,
            totalCost,
            totalRetail,
            totalProfit,
            getRoomTotals,
        }}>
            {children}
        </MaterialContext.Provider>
    );
}
