"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Supplier } from '@/types/core';
import { CostItem } from '@/types/core';
import { SUPPLIERS } from '@/data/knowledge-base';
import { QUIET_MONEY_MODULES } from '@/data/modules-services';

// --- TYPES ---
export interface Client {
    id: string;
    name: string;
    type: 'Residential' | 'Commercial';
    contact: string;
    // New Fields for Renovation Profile
    newPropertyAddress?: string;
    currentAddress?: string;
    renovationIdiosyncrasies?: string; // Feng Shui, Pets, Restrictions etc.
    // Enhanced Contact Protocol
    personInCharge?: {
        name: string;
        contact: string;
        role: string;
    };
    disputeEscalation?: {
        name: string;
        contact: string;
        priority: 'Normal' | 'High' | 'Critical';
    };
}

interface DataContextType {
    suppliers: Supplier[];
    clients: Client[];
    items: CostItem[];
    addSupplier: (s: Supplier) => void;
    addClient: (c: Client) => void;
    addItem: (i: CostItem) => void;
}

// --- CONTEXT ---
const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    // Initialize with "Static Truth"
    const [suppliers, setSuppliers] = useState<Supplier[]>(Object.values(SUPPLIERS));
    const [clients, setClients] = useState<Client[]>([]);
    const [items, setItems] = useState<CostItem[]>(QUIET_MONEY_MODULES);

    const addSupplier = (s: Supplier) => {
        setSuppliers(prev => [...prev, s]);
    };

    const addClient = (c: Client) => {
        setClients(prev => [...prev, c]);
    };

    const addItem = (i: CostItem) => {
        setItems(prev => [...prev, i]);
    };

    return (
        <DataContext.Provider value={{ suppliers, clients, items, addSupplier, addClient, addItem }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
