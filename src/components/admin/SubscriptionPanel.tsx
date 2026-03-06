'use client';

import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS, ADD_ONS, SubscriptionPlan, AddOn } from '@/types/subscription';

export default function SubscriptionPanel() {
    // Mock current subscription (Professional SG)
    const [currentPlanId, setCurrentPlanId] = useState('sg-professional');
    const [activeAddOns, setActiveAddOns] = useState<string[]>(['priority-support']);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

    const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === currentPlanId) || SUBSCRIPTION_PLANS[0];

    const toggleAddOn = (addOnId: string) => {
        if (activeAddOns.includes(addOnId)) {
            setActiveAddOns(activeAddOns.filter(id => id !== addOnId));
        } else {
            setActiveAddOns([...activeAddOns, addOnId]);
        }
    };

    // Calculate Totals
    const planPrice = billingCycle === 'annual'
        ? currentPlan.priceMonthly * 12 * (1 - currentPlan.annualDiscountPercent / 100)
        : currentPlan.priceMonthly;

    const addOnsMonthlyTotal = activeAddOns.reduce((sum, id) => {
        const addOn = ADD_ONS.find(a => a.id === id);
        return sum + (addOn?.priceMonthly || 0);
    }, 0);

    const addOnsPrice = billingCycle === 'annual'
        ? addOnsMonthlyTotal * 12 // Add-ons usually bill same cycle
        : addOnsMonthlyTotal;

    const totalAnnual = planPrice + addOnsPrice;
    const monthlyEquivalent = totalAnnual / 12;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-navy-900"> Subscription & Billing</h2>
                <div className="flex bg-gray-100 rounded-lg p-1 text-sm font-medium">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-3 py-1 rounded transition-colors ${billingCycle === 'monthly' ? 'bg-white shadow text-navy-900' : 'text-gray-500'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('annual')}
                        className={`px-3 py-1 rounded transition-colors ${billingCycle === 'annual' ? 'bg-green-100 text-green-700 shadow' : 'text-gray-500'}`}
                    >
                        Annual (-{currentPlan.annualDiscountPercent}%)
                    </button>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Current Plan */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Current Plan</h3>
                        <div className="p-4 border-2 border-blue-100 bg-blue-50 rounded-lg flex justify-between items-center cursor-pointer hover:border-blue-300 transition-colors">
                            <div>
                                <h4 className="font-bold text-lg text-navy-900">{currentPlan.name}</h4>
                                <div className="flex gap-2 text-xs text-gray-600 mt-1">
                                    <span className="bg-white px-2 py-0.5 rounded border border-blue-200"> Unlimited Users</span>
                                    <span className="bg-white px-2 py-0.5 rounded border border-blue-200"> Unlimited Projects</span>
                                    <span className="bg-white px-2 py-0.5 rounded border border-blue-200">️ {currentPlan.jurisdictionAccess} Market</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-blue-700">
                                    {currentPlan.currency} {currentPlan.priceMonthly}<span className="text-sm text-gray-500 font-normal">/mo</span>
                                </p>
                                {billingCycle === 'annual' && (
                                    <p className="text-xs text-green-600 font-bold">You save {currentPlan.annualDiscountPercent}% annually</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Add-ons Grid */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Available Add-ons</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ADD_ONS.map(addOn => {
                                const isActive = activeAddOns.includes(addOn.id);
                                return (
                                    <div
                                        key={addOn.id}
                                        onClick={() => toggleAddOn(addOn.id)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${isActive
                                                ? 'border-green-500 bg-green-50 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={`font-bold text-sm ${isActive ? 'text-green-800' : 'text-gray-900'}`}>
                                                {isActive ? ' ' : ''}{addOn.name}
                                            </h4>
                                            <span className="text-sm font-bold text-gray-700">
                                                ${addOn.priceMonthly}/mo
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2">{addOn.description}</p>
                                        {addOn.priceOneTime && !isActive && (
                                            <p className="text-xs text-amber-600 mt-2 font-medium">+ ${addOn.priceOneTime} one-time setup</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Billing Summary */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
                    <h3 className="font-bold text-navy-900 mb-6">Billing Summary</h3>

                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Base Plan ({currentPlan.name})</span>
                            <span className="font-medium">${currentPlan.priceMonthly}/mo</span>
                        </div>
                        {billingCycle === 'annual' && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Annual Discount ({currentPlan.annualDiscountPercent}%)</span>
                                <span>-${(currentPlan.priceMonthly * (currentPlan.annualDiscountPercent / 100)).toFixed(0)}/mo</span>
                            </div>
                        )}

                        <div className="pt-2"></div>

                        {activeAddOns.map(id => {
                            const addOn = ADD_ONS.find(a => a.id === id);
                            if (!addOn) return null;
                            return (
                                <div key={id} className="flex justify-between text-sm">
                                    <span className="text-gray-600">+ {addOn.name}</span>
                                    <span className="font-medium">${addOn.priceMonthly}/mo</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-between items-end mb-2">
                        <span className="font-bold text-navy-900">Total Monthly</span>
                        <span className="text-2xl font-bold text-navy-900">${monthlyEquivalent.toFixed(0)}</span>
                    </div>

                    {billingCycle === 'annual' && (
                        <p className="text-xs text-gray-500 text-right mb-6">
                            Billed annually as ${totalAnnual.toLocaleString()}
                        </p>
                    )}

                    <button className="w-full bg-navy-900 text-white font-bold py-3 rounded-lg hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/20">
                        UPDATE SUBSCRIPTION
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                        Secure payment via Stripe. Cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
}
