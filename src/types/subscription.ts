/**
 * Subscription & Pricing Types
 * 
 * Simple flat pricing with optional add-ons
 * - Flat monthly fee per market
 * - Optional add-ons for maintenance, white-label, etc.
 */

import { Jurisdiction } from './core';

// ============================================================
// SUBSCRIPTION TIERS (Simple Flat Pricing)
// ============================================================

export type SubscriptionTier = 'professional' | 'enterprise';
export type JurisdictionAccess = 'SG' | 'MY' | 'BOTH';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'cancelled' | 'suspended';

export interface SubscriptionPlan {
    id: string;
    name: string;
    jurisdictionAccess: JurisdictionAccess;

    // Flat monthly price (no per-seat nonsense)
    priceMonthly: number;
    currency: 'SGD' | 'MYR';

    // Annual discount
    annualDiscountPercent: number;

    // Everything included - no feature gating
    unlimitedUsers: boolean;
    unlimitedQuotes: boolean;
    unlimitedProjects: boolean;

    // What's included
    includedFeatures: string[];
}

// ============================================================
// ADD-ONS (Optional extras)
// ============================================================

export interface AddOn {
    id: string;
    name: string;
    description: string;
    priceMonthly: number;
    priceOneTime?: number;  // For setup fees
    currency: 'SGD' | 'MYR';
}

export const ADD_ONS: AddOn[] = [
    // Maintenance & Support
    {
        id: 'priority-support',
        name: 'Priority Support',
        description: '4-hour response SLA, dedicated account manager',
        priceMonthly: 199,
        currency: 'SGD',
    },
    {
        id: 'maintenance-annual',
        name: 'Annual Maintenance Package',
        description: 'Quarterly reviews, custom report setup, data cleanup',
        priceMonthly: 99,
        currency: 'SGD',
    },

    // White Label
    {
        id: 'white-label-basic',
        name: 'White Label (Basic)',
        description: 'Your logo, colors, remove "Powered by" branding',
        priceMonthly: 149,
        priceOneTime: 500,  // Setup fee
        currency: 'SGD',
    },
    {
        id: 'white-label-full',
        name: 'White Label (Full)',
        description: 'Custom domain, full branding, client portal with your branding',
        priceMonthly: 299,
        priceOneTime: 1500, // Setup fee
        currency: 'SGD',
    },

    // Integrations
    {
        id: 'api-access',
        name: 'API Access',
        description: 'REST API for custom integrations, webhooks',
        priceMonthly: 149,
        currency: 'SGD',
    },
    {
        id: 'accounting-sync',
        name: 'Accounting Sync',
        description: 'Auto-sync to Xero, QuickBooks, or MYOB',
        priceMonthly: 79,
        currency: 'SGD',
    },

    // AI Features
    {
        id: 'ai-assistant',
        name: 'AI Assistant',
        description: 'Smart cost predictions, quote optimization suggestions',
        priceMonthly: 99,
        currency: 'SGD',
    },

    // Training
    {
        id: 'onboarding',
        name: 'Onboarding Package',
        description: '2-hour training session, data migration assistance',
        priceMonthly: 0,
        priceOneTime: 500,
        currency: 'SGD',
    },
];

// ============================================================
// FLAT PRICING PLANS
// ============================================================

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    // SINGAPORE ONLY
    {
        id: 'sg-professional',
        name: 'Professional (Singapore)',
        jurisdictionAccess: 'SG',
        priceMonthly: 299,
        currency: 'SGD',
        annualDiscountPercent: 20,
        unlimitedUsers: true,
        unlimitedQuotes: true,
        unlimitedProjects: true,
        includedFeatures: [
            'Quote Builder with Compliance Engine',
            'Full Cost Database (SG)',
            'Team Performance Dashboard',
            'Lead Management',
            'Approval Workflows',
            'Customer Reviews & Defect Tracking',
            'Charts & Analytics',
            'Unlimited Users',
            'Email Support',
        ],
    },

    // MALAYSIA ONLY
    {
        id: 'my-professional',
        name: 'Professional (Malaysia)',
        jurisdictionAccess: 'MY',
        priceMonthly: 899,
        currency: 'MYR',
        annualDiscountPercent: 20,
        unlimitedUsers: true,
        unlimitedQuotes: true,
        unlimitedProjects: true,
        includedFeatures: [
            'Quote Builder with Compliance Engine',
            'Full Cost Database (MY)',
            'Team Performance Dashboard',
            'Lead Management',
            'Approval Workflows',
            'Customer Reviews & Defect Tracking',
            'Charts & Analytics',
            'Unlimited Users',
            'Email Support',
        ],
    },

    // BOTH MARKETS
    {
        id: 'both-professional',
        name: 'Professional (SG + MY)',
        jurisdictionAccess: 'BOTH',
        priceMonthly: 449,
        currency: 'SGD',
        annualDiscountPercent: 25,
        unlimitedUsers: true,
        unlimitedQuotes: true,
        unlimitedProjects: true,
        includedFeatures: [
            'Quote Builder with Compliance Engine',
            'Full Cost Database (SG + MY)',
            'Team Performance Dashboard',
            'Lead Management',
            'Approval Workflows',
            'Customer Reviews & Defect Tracking',
            'Charts & Analytics',
            'Multi-Market Switching',
            'Unlimited Users',
            'Priority Email Support',
        ],
    },
];

// ============================================================
// COMPANY SUBSCRIPTION
// ============================================================

export interface CompanySubscription {
    companyId: string;
    planId: string;
    jurisdictionAccess: JurisdictionAccess;
    status: SubscriptionStatus;

    // Active add-ons
    activeAddOns: string[];

    // Billing
    billingCycle: 'monthly' | 'annual';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    totalMonthlyPrice: number;  // Plan + add-ons
    currency: 'SGD' | 'MYR';

    // Trial
    isTrial: boolean;
    trialEndsAt?: string;

    // Metadata
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function hasJurisdictionAccess(
    subscription: CompanySubscription,
    jurisdiction: Jurisdiction
): boolean {
    if (subscription.jurisdictionAccess === 'BOTH') return true;
    return subscription.jurisdictionAccess === jurisdiction;
}

export function calculateTotalPrice(
    plan: SubscriptionPlan,
    addOnIds: string[],
    annual: boolean
): { monthly: number; total: number; savings: number } {
    // Plan price
    let monthly = plan.priceMonthly;

    // Add-ons
    for (const addOnId of addOnIds) {
        const addOn = ADD_ONS.find(a => a.id === addOnId);
        if (addOn) {
            monthly += addOn.priceMonthly;
        }
    }

    if (annual) {
        const discount = plan.annualDiscountPercent / 100;
        const total = monthly * 12 * (1 - discount);
        const savings = monthly * 12 - total;
        return { monthly, total, savings };
    }

    return { monthly, total: monthly, savings: 0 };
}

export function getAddOnSetupFees(addOnIds: string[]): number {
    return addOnIds.reduce((total, id) => {
        const addOn = ADD_ONS.find(a => a.id === id);
        return total + (addOn?.priceOneTime || 0);
    }, 0);
}

export function getPlanByJurisdiction(jurisdiction: JurisdictionAccess): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS.find(p => p.jurisdictionAccess === jurisdiction);
}
