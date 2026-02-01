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
    // validMarkets: 'sg', 'my'
    const urlMarket = params?.market ? params.market.toUpperCase() : null;

    // State is mainly for Client-Side immediate feedback, but URL is source of truth
    // State is used for fallback if URL param isn't ready
    const [marketState, setMarketState] = useState('SG');

    // Drive state from URL, fallback to stored preference or default
    const market = urlMarket || marketState;

    useEffect(() => {
        if (urlMarket) {
            // content is driven by URL, just sync storage
            localStorage.setItem('market_preference', urlMarket);
        }
    }, [urlMarket]);

    const switchMarket = (targetMarket) => {
        const newMarketCode = targetMarket.toLowerCase();
        const currentMarketCode = market.toLowerCase();
        const newPath = pathname.replace(`/${currentMarketCode}`, `/${newMarketCode}`);

        // Optimistic update for UI responsiveness (though URL change will drive it momentarily)
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
