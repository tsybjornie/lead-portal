'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';

const MarketContext = createContext();

export function MarketProvider({ children }) {
    // Default to 'SG' if params are missing (e.g. 404 page or root layout before hydration)
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();

    // Derive market from URL, fallback to localStorage or 'SG'
    // validMarkets: 'sg', 'my', 'jb' (treating jb as my)
    const urlMarket = params?.market ? params.market.toUpperCase() : null;

    // State is mainly for Client-Side immediate feedback, but URL is source of truth
    const [market, setMarketState] = useState(urlMarket || 'SG');

    useEffect(() => {
        if (urlMarket) {
            setMarketState(urlMarket);
            localStorage.setItem('market_preference', urlMarket);
        }
    }, [urlMarket]);

    const switchMarket = (targetMarket) => {
        const newMarketCode = targetMarket.toLowerCase();
        const currentMarketCode = market.toLowerCase();

        // Simple Replace: /sg/about -> /my/about
        // This regex ensures we only replace the FIRST path segment if it's a market
        const newPath = pathname.replace(`/${currentMarketCode}`, `/${newMarketCode}`);

        setMarketState(targetMarket);
        localStorage.setItem('market_preference', targetMarket);
        router.push(newPath);
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
