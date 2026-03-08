'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================
// SUBSCRIPTION CONTEXT — Premium Access Gating
// Tiers: Free (teaser) | Pro $99/mo | Studio $199/mo
// ============================================================

export type SubscriptionTier = 'free' | 'pro' | 'studio';

export interface SubscriptionPlan {
    id: string;
    tier: SubscriptionTier;
    name: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
    stripePriceId?: string;     // Stripe Price ID for checkout
}

export const PLANS: SubscriptionPlan[] = [
    {
        id: 'free', tier: 'free', name: 'Explorer', price: 0, currency: 'SGD', interval: 'month',
        features: [
            'Browse 10 material previews',
            'Basic project management',
            'Standard Dispatch specs',
            'Community forum access',
        ],
    },
    {
        id: 'pro', tier: 'pro', name: 'Professional', price: 99, currency: 'SGD', interval: 'month',
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
        features: [
            'Full Material Encyclopedia (500+ materials)',
            'Supplier directory with pricing',
            'Designer markup calculator',
            'World Motifs reference (150+)',
            'Export to client deck',
            'Priority support',
        ],
    },
    {
        id: 'studio', tier: 'studio', name: 'Studio', price: 199, currency: 'SGD', interval: 'month',
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STUDIO_PRICE_ID || 'price_studio_placeholder',
        features: [
            'Everything in Professional',
            'Cost vs retail pricing intelligence',
            'Supplier logistics & lead times',
            'Cross-border procurement (SG/MY/ID/IT)',
            'Installation rate database',
            'Team seats (up to 5 designers)',
            'API access for integrations',
            'Custom supplier onboarding',
            'White-label client deck',
        ],
    },
];

// What each tier can access
export const TIER_ACCESS = {
    free: {
        materialPreviewCount: 10,       // Can see first 10 entries per category
        canViewSupplierPricing: false,
        canViewDesignerMarkup: false,
        canViewLogistics: false,
        canViewInstallRates: false,
        canViewMotifs: false,            // Locked
        canExportDeck: false,
        canUseSearch: false,             // Search locked
        maxProjects: 1,
    },
    pro: {
        materialPreviewCount: Infinity,  // Full access
        canViewSupplierPricing: true,
        canViewDesignerMarkup: true,
        canViewLogistics: false,         // Studio only
        canViewInstallRates: false,      // Studio only
        canViewMotifs: true,
        canExportDeck: true,
        canUseSearch: true,
        maxProjects: 10,
    },
    studio: {
        materialPreviewCount: Infinity,
        canViewSupplierPricing: true,
        canViewDesignerMarkup: true,
        canViewLogistics: true,
        canViewInstallRates: true,
        canViewMotifs: true,
        canExportDeck: true,
        canUseSearch: true,
        maxProjects: Infinity,
    },
};

interface SubscriptionContextType {
    tier: SubscriptionTier;
    plan: SubscriptionPlan;
    access: typeof TIER_ACCESS['free'];
    isLoading: boolean;
    isPro: boolean;
    isStudio: boolean;
    // Actions
    upgradeTo: (tier: SubscriptionTier) => void;
    checkAccess: (feature: keyof typeof TIER_ACCESS['free']) => boolean;
    // For demo purposes
    setDemoTier: (tier: SubscriptionTier) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function useSubscription() {
    const ctx = useContext(SubscriptionContext);
    if (!ctx) {
        // Default to free tier if outside provider
        const plan = PLANS[0];
        return {
            tier: 'free' as SubscriptionTier,
            plan,
            access: TIER_ACCESS.free,
            isLoading: false,
            isPro: false,
            isStudio: false,
            upgradeTo: () => { },
            checkAccess: () => false,
            setDemoTier: () => { },
        };
    }
    return ctx;
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [tier, setTier] = useState<SubscriptionTier>('free');
    const [isLoading, setIsLoading] = useState(true);

    // Check localStorage for existing subscription (demo) or Stripe status
    useEffect(() => {
        try {
            const saved = localStorage.getItem('roof_subscription_tier');
            if (saved && ['free', 'pro', 'studio'].includes(saved)) {
                setTier(saved as SubscriptionTier);
            }
        } catch { /* ignore */ }
        setIsLoading(false);
    }, []);

    // Persist tier changes
    useEffect(() => {
        try {
            localStorage.setItem('roof_subscription_tier', tier);
        } catch { /* ignore */ }
    }, [tier]);

    const plan = PLANS.find(p => p.tier === tier) || PLANS[0];
    const access = TIER_ACCESS[tier];

    const upgradeTo = async (targetTier: SubscriptionTier) => {
        const targetPlan = PLANS.find(p => p.tier === targetTier);
        if (!targetPlan || !targetPlan.stripePriceId) return;

        // Call Stripe Checkout API route
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: targetPlan.stripePriceId,
                    tier: targetTier,
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe Checkout
            }
        } catch (err) {
            // Fallback: for demo, just set tier directly
            console.warn('Stripe checkout failed, using demo mode:', err);
            setTier(targetTier);
        }
    };

    const checkAccess = (feature: keyof typeof TIER_ACCESS['free']) => {
        return !!access[feature];
    };

    const setDemoTier = (t: SubscriptionTier) => {
        setTier(t);
    };

    return (
        <SubscriptionContext.Provider value={{
            tier,
            plan,
            access,
            isLoading,
            isPro: tier === 'pro' || tier === 'studio',
            isStudio: tier === 'studio',
            upgradeTo,
            checkAccess,
            setDemoTier,
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
}
