"use client";

import { useState } from 'react';
import QuoteBuilder from './QuoteBuilder';
import DesignerCommissionDashboard from './DesignerCommissionDashboard';

type ViewType = 'DASHBOARD' | 'QUOTE_BUILDER' | 'COMMISSION';

export default function DashboardDesigner() {
    const [view, setView] = useState<ViewType>('DASHBOARD');
    const designerName = 'Sarah Chen';
    const designerId = 'designer-001';

    if (view === 'QUOTE_BUILDER') {
        return (
            <div className="">
                <div className="bg-slate-900/90 backdrop-blur border-b border-white/10 p-2">
                    <button
                        onClick={() => setView('DASHBOARD')}
                        className="text-white font-bold text-xs uppercase hover:text-blue-400 px-4 py-2 flex items-center gap-2"
                    >
                        ← Return to Dashboard
                    </button>
                </div>
                <QuoteBuilder />
            </div>
        );
    }

    if (view === 'COMMISSION') {
        return (
            <div className="">
                <div className="bg-slate-900/90 backdrop-blur border-b border-white/10 p-2">
                    <button
                        onClick={() => setView('DASHBOARD')}
                        className="text-white font-bold text-xs uppercase hover:text-blue-400 px-4 py-2 flex items-center gap-2"
                    >
                        ← Return to Dashboard
                    </button>
                </div>
                <DesignerCommissionDashboard
                    designerId={designerId}
                    designerName={designerName}
                />
            </div>
        );
    }

    return (
        <div className="p-8 font-sans max-w-[1600px] mx-auto">
            {/* HEADER */}
            <div className="flex justify-between items-end mb-8 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none group-hover:opacity-80 transition-opacity" />

                <div className="relative">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome, {designerName}.</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium flex items-center gap-2">
                        System Status
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                        <span className="text-green-600 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            OPTIMAL
                        </span>
                    </p>
                </div>
                <div className="flex gap-3 relative">
                    <button
                        onClick={() => setView('COMMISSION')}
                        className="bg-white/80 backdrop-blur border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-white hover:shadow-md transition-all active:scale-95"
                    >
                        💰 Commission & Claims
                    </button>
                    <button
                        onClick={() => setView('QUOTE_BUILDER')}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span>+</span> New Quotation
                    </button>
                </div>
            </div>

            {/* QUICK STATS BAR */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-lg">
                    <p className="text-xs uppercase opacity-80">Commission Earned</p>
                    <p className="text-2xl font-bold mt-1">$14,875</p>
                    <p className="text-xs mt-1 opacity-80">↑ 18% this month</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-lg">
                    <p className="text-xs uppercase opacity-80">Active Quotes</p>
                    <p className="text-2xl font-bold mt-1">3</p>
                    <p className="text-xs mt-1 opacity-80">2 pending approval</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-4 rounded-lg">
                    <p className="text-xs uppercase opacity-80">Outstanding Claims</p>
                    <p className="text-2xl font-bold mt-1">$23,000</p>
                    <p className="text-xs mt-1 opacity-80">3 invoices pending</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-4 rounded-lg">
                    <p className="text-xs uppercase opacity-80">Avg Margin</p>
                    <p className="text-2xl font-bold mt-1">35%</p>
                    <p className="text-xs mt-1 opacity-80">Above target ✓</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: ACTIVE PROJECTS */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-navy-900 mb-4 border-b pb-2">Active Projects</h2>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-gray-400 uppercase tracking-wider">
                                    <th className="pb-3">Project</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Value</th>
                                    <th className="pb-3">Commission</th>
                                    <th className="pb-3">Claims</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="border-b border-gray-100 group hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setView('COMMISSION')}>
                                    <td className="py-4">
                                        <p className="font-bold text-navy-900">322C Tengah Drive</p>
                                        <p className="text-xs text-gray-500">Tan Wei Ming</p>
                                    </td>
                                    <td className="py-4"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">IN PROGRESS</span></td>
                                    <td className="py-4 text-gray-600">$45,000</td>
                                    <td className="py-4">
                                        <span className="text-green-600 font-semibold">$1,575</span>
                                        <span className="ml-1 text-xs text-gray-400">earned</span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500" style={{ width: '20%' }} />
                                            </div>
                                            <span className="text-xs text-gray-500">20%</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-100 group hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setView('COMMISSION')}>
                                    <td className="py-4">
                                        <p className="font-bold text-navy-900">456 Clementi Ave 3</p>
                                        <p className="text-xs text-gray-500">Lim Mei Ling</p>
                                    </td>
                                    <td className="py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">ACCEPTED</span></td>
                                    <td className="py-4 text-gray-600">$78,000</td>
                                    <td className="py-4">
                                        <span className="text-amber-600 font-semibold">$2,730</span>
                                        <span className="ml-1 text-xs text-gray-400">pending</span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500" style={{ width: '0%' }} />
                                            </div>
                                            <span className="text-xs text-gray-500">0%</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-100 group hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setView('COMMISSION')}>
                                    <td className="py-4">
                                        <p className="font-bold text-navy-900">Setia Alam Unit 12-3</p>
                                        <p className="text-xs text-gray-500">Ahmad bin Yusof</p>
                                    </td>
                                    <td className="py-4"><span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold">COMPLETED</span></td>
                                    <td className="py-4 text-gray-600">RM 32,000</td>
                                    <td className="py-4">
                                        <span className="text-emerald-600 font-semibold">$1,152</span>
                                        <span className="ml-1 text-xs text-gray-400">paid</span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500" style={{ width: '100%' }} />
                                            </div>
                                            <span className="text-xs text-gray-500">100%</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-4 pt-4 border-t text-center">
                            <button
                                onClick={() => setView('COMMISSION')}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                            >
                                View Full Commission Dashboard →
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-navy-900 mb-4 border-b pb-2">Recent Claims Activity</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-lg">✓</span>
                                    <div>
                                        <p className="font-semibold text-sm">PC-001 Paid</p>
                                        <p className="text-xs text-gray-500">322C Tengah Drive</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">$9,000</p>
                                    <p className="text-xs text-gray-400">Jan 25</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-blue-500 text-lg">✓</span>
                                    <div>
                                        <p className="font-semibold text-sm">PC-002 Approved</p>
                                        <p className="text-xs text-gray-500">322C Tengah Drive</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-600">$17,100</p>
                                    <p className="text-xs text-gray-400">Jan 27</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-amber-500 text-lg">⏳</span>
                                    <div>
                                        <p className="font-semibold text-sm">PC-001 Submitted</p>
                                        <p className="text-xs text-gray-500">456 Clementi Ave 3</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-amber-600">$15,600</p>
                                    <p className="text-xs text-gray-400">Pending</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: THINGS TO KNOW */}
                <div className="space-y-6">
                    <div className="bg-navy-900 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-gold-500 font-bold uppercase tracking-widest text-xs mb-4">Things To Know</h2>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="text-gold-400 font-bold">💰</span>
                                <span className="text-gray-300">You have <strong className="text-white">$4,305</strong> in pending commission awaiting project completion.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-400 font-bold">!</span>
                                <span className="text-gray-300">Supplier <strong className="text-white">WoodWorks MY</strong> has increased plywood base cost by 8% effective today.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-400 font-bold">i</span>
                                <span className="text-gray-300">New <strong>Town Council (SG)</strong> compliance module added. Please use for all condo projects.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 font-bold">✓</span>
                                <span className="text-gray-300">Your average margin (35%) is above target. Keep it up!</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-sm font-bold text-gray-500 mb-4 uppercase">Commission Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-navy-900">This Month</span>
                                <span className="font-bold text-green-600">$3,500</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-navy-900">Last Month</span>
                                <span className="font-semibold text-gray-600">$2,975</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-navy-900">YTD Total</span>
                                <span className="font-bold text-navy-900">$14,875</span>
                            </div>
                            <div className="pt-3 border-t mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Pending Payout</span>
                                    <span className="font-semibold text-amber-600">$4,305</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-sm font-bold text-gray-500 mb-4 uppercase">System Health</h2>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-navy-900 font-bold">Margin Guard</span>
                            <span className="text-green-500 text-xs font-bold">ACTIVE</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-navy-900 font-bold">Geo-Engine</span>
                            <span className="text-green-500 text-xs font-bold">ONLINE</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-navy-900 font-bold">Commission Tracker</span>
                            <span className="text-green-500 text-xs font-bold">SYNCED</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

