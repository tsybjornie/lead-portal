"use client";

import { useState } from 'react';
import QuoteBuilder from './QuoteBuilder';
import DesignerCommissionDashboard from './DesignerCommissionDashboard';
import ProspectKanban from './ProspectKanban';
import ProjectScheduleTimeline from './ProjectScheduleTimeline';

import Link from 'next/link';

type ViewType = 'DASHBOARD' | 'QUOTE_BUILDER' | 'COMMISSION' | 'PIPELINE' | 'SCHEDULE';

export default function DashboardDesigner() {
    const [view, setView] = useState<ViewType>('DASHBOARD');
    const designerName = 'Bjorn Teo';
    const designerId = 'designer-001';

    if (view === 'QUOTE_BUILDER') {
        return (
            <div className="">
                <div className="bg-slate-900/90 backdrop-blur border-b border-white/10 p-2">
                    <button
                        onClick={() => setView('DASHBOARD')}
                        className="text-white font-bold text-xs uppercase hover:text-blue-400 px-4 py-2 flex items-center gap-2"
                    >
                        Return to Dashboard
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
                        Return to Dashboard
                    </button>
                </div>
                <DesignerCommissionDashboard
                    designerId={designerId}
                    designerName={designerName}
                />
            </div>
        );
    }

    if (view === 'PIPELINE') {
        return (
            <div className="">
                <div className="bg-slate-900/90 backdrop-blur border-b border-white/10 p-2">
                    <button
                        onClick={() => setView('DASHBOARD')}
                        className="text-white font-bold text-xs uppercase hover:text-blue-400 px-4 py-2 flex items-center gap-2"
                    >
                        Return to Dashboard
                    </button>
                </div>
                <ProspectKanban />
            </div>
        );
    }

    if (view === 'SCHEDULE') {
        return (
            <div className="">
                <div className="bg-slate-900/90 backdrop-blur border-b border-white/10 p-2 flex justify-between items-center">
                    <button
                        onClick={() => setView('DASHBOARD')}
                        className="text-white font-bold text-xs uppercase hover:text-blue-400 px-4 py-2 flex items-center gap-2"
                    >
                        Return to Dashboard
                    </button>
                    <span className="text-white/50 text-xs">Roof  PROJECT MANAGEMENT</span>
                </div>
                <ProjectScheduleTimeline />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* TOP BAR */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-sm font-bold text-gray-900">Roof</h1>
                        <span className="text-gray-200">|</span>
                        <span className="text-sm text-gray-500">{designerName}</span>
                        <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold uppercase tracking-wider">Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setView('PIPELINE')} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">Pipeline</button>
                        <button onClick={() => setView('SCHEDULE')} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">Schedule</button>
                        <Link href="/vendor-rates"><button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">Vendors</button></Link>
                        <button onClick={() => setView('COMMISSION')} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">Commission</button>
                        <div className="w-px h-5 bg-gray-200 mx-1" />
                        <Link href="/quote-builder">
                            <button className="px-4 py-1.5 text-xs font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all">
                                + New Quote
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-8 py-8">
                {/* METRIC ROW */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Commission Earned</p>
                        <p className="text-2xl font-black text-gray-900 mt-2">$14,875</p>
                        <p className="text-xs text-emerald-600 font-medium mt-1">+18% this month</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Quotes</p>
                        <p className="text-2xl font-black text-gray-900 mt-2">3</p>
                        <p className="text-xs text-amber-600 font-medium mt-1">2 pending approval</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Outstanding Claims</p>
                        <p className="text-2xl font-black text-gray-900 mt-2">$23,000</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">3 invoices pending</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Average Margin</p>
                        <p className="text-2xl font-black text-gray-900 mt-2">35%</p>
                        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* LEFT: PROJECTS */}
                    <div className="col-span-2 space-y-6">
                        {/* Active Projects */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-gray-900">Active Projects</h2>
                                <span className="text-[10px] text-gray-400">3 projects</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {[
                                    { name: '322C Tengah Drive', client: 'Tan Wei Ming', status: 'In Progress', statusColor: 'bg-amber-50 text-amber-700', value: '$45,000', commission: '$1,575', commLabel: 'earned', progress: 20 },
                                    { name: '456 Clementi Ave 3', client: 'Lim Mei Ling', status: 'Accepted', statusColor: 'bg-emerald-50 text-emerald-700', value: '$78,000', commission: '$2,730', commLabel: 'pending', progress: 0 },
                                    { name: 'Setia Alam Unit 12-3', client: 'Ahmad bin Yusof', status: 'Completed', statusColor: 'bg-gray-100 text-gray-600', value: 'RM 32,000', commission: '$1,152', commLabel: 'paid', progress: 100 },
                                ].map((p, i) => (
                                    <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 cursor-pointer transition-colors" onClick={() => setView('COMMISSION')}>
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">{p.client}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${p.statusColor}`}>{p.status}</span>
                                            <span className="text-sm font-medium text-gray-700 w-20 text-right">{p.value}</span>
                                            <div className="text-right w-24">
                                                <span className="text-sm font-bold text-gray-900">{p.commission}</span>
                                                <p className="text-[10px] text-gray-400">{p.commLabel}</p>
                                            </div>
                                            <div className="w-16">
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                                                </div>
                                                <p className="text-[9px] text-gray-400 text-right mt-1">{p.progress}%</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <h2 className="text-sm font-bold text-gray-900">Recent Activity</h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {[
                                    { label: 'PC-001 Paid', project: '322C Tengah Drive', amount: '$9,000', date: 'Jan 25', type: 'paid' },
                                    { label: 'PC-002 Approved', project: '322C Tengah Drive', amount: '$17,100', date: 'Jan 27', type: 'approved' },
                                    { label: 'PC-001 Submitted', project: '456 Clementi Ave 3', amount: '$15,600', date: 'Pending', type: 'pending' },
                                ].map((a, i) => (
                                    <div key={i} className="px-5 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${a.type === 'paid' ? 'bg-emerald-500' : a.type === 'approved' ? 'bg-blue-500' : 'bg-amber-400'}`} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{a.label}</p>
                                                <p className="text-[11px] text-gray-400">{a.project}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">{a.amount}</p>
                                            <p className="text-[10px] text-gray-400">{a.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">
                        {/* Alerts */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <h2 className="text-sm font-bold text-gray-900">Alerts</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <p className="text-xs font-semibold text-amber-800">Price Change</p>
                                    <p className="text-[11px] text-amber-700 mt-1">WoodWorks MY plywood base cost +8% today</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-xs font-semibold text-blue-800">Compliance Update</p>
                                    <p className="text-[11px] text-blue-700 mt-1">New Town Council (SG) module — use for all condo projects</p>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <p className="text-xs font-semibold text-emerald-800">Pending Commission</p>
                                    <p className="text-[11px] text-emerald-700 mt-1">$4,305 awaiting project completion</p>
                                </div>
                            </div>
                        </div>

                        {/* Commission Summary */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <h2 className="text-sm font-bold text-gray-900">Commission</h2>
                            </div>
                            <div className="p-5 space-y-0">
                                {[
                                    { label: 'This Month', value: '$3,500', bold: true },
                                    { label: 'Last Month', value: '$2,975', bold: false },
                                    { label: 'YTD Total', value: '$14,875', bold: true },
                                ].map((r, i) => (
                                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                                        <span className="text-xs text-gray-500">{r.label}</span>
                                        <span className={`text-sm ${r.bold ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>{r.value}</span>
                                    </div>
                                ))}
                                <div className="pt-3 mt-2 border-t border-gray-100 flex justify-between">
                                    <span className="text-xs text-gray-400">Pending Payout</span>
                                    <span className="text-sm font-bold text-amber-600">$4,305</span>
                                </div>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <h2 className="text-sm font-bold text-gray-900">System</h2>
                            </div>
                            <div className="p-5 space-y-0">
                                {[
                                    { name: 'Margin Guard', status: 'Active' },
                                    { name: 'Geo-Engine', status: 'Online' },
                                    { name: 'Commission Tracker', status: 'Synced' },
                                    { name: 'Price Index', status: 'Live' },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-xs text-gray-600">{s.name}</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                            <span className="text-[10px] font-medium text-emerald-600">{s.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

