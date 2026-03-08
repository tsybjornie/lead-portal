'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const MarketContext = createContext();

export function MarketProvider({ children }) {
    const [market, setMarket] = useState('SG'); // Default to Singapore

    useEffect(() => {
        // Persist preference
        const saved = localStorage.getItem('market_preference');
        if (saved) {
            setMarket(saved);
        }
    }, []);

    const switchMarket = (newMarket) => {
        setMarket(newMarket);
        localStorage.setItem('market_preference', newMarket);
    };

    return (
        <MarketContext.Provider value={{ market, switchMarket }}>
            {children}
        </MarketContext.Provider>
    );
}

export function useMarket() {
    return useContext(MarketContext);
}
