"use client";

import { useState } from 'react';
import VendorManager from './admin/VendorManager';
import ClientManager from './admin/ClientManager';
import ItemBuilder from './admin/ItemBuilder';
import CsvImporter from './admin/CsvImporter';
import CompanySettings from './admin/CompanySettings';
import TeamPerformancePanel from './admin/TeamPerformancePanel';
import ReviewsAndLeadsPanel from './admin/ReviewsAndLeadsPanel';
import PerformanceCharts from './admin/PerformanceCharts';
import SubscriptionPanel from './admin/SubscriptionPanel';

export default function DashboardAdmin() {
    // Tab state for approval sections
    const [approvalTab, setApprovalTab] = useState<'discounts' | 'claims' | 'costs'>('discounts');

    return (
        <div className="p-8 font-sans max-w-[1600px] mx-auto">
            {/* HEADER */}
            <div className="flex justify-between items-end mb-8 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none group-hover:opacity-80 transition-opacity" />

                <div className="relative">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Command Center</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium flex items-center gap-2">
                        Global Oversight
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                        <span className="text-green-600 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            ALL SYSTEMS NOMINAL
                        </span>
                    </p>
                </div>
                <div className="flex gap-8 relative">
                    <div className="text-right">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Active Value</span>
                        <span className="block text-2xl font-black text-slate-900">$1,240,000</span>
                    </div>
                    <div className="text-right border-l border-slate-200 pl-8">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Avg Margin</span>
                        <span className="block text-2xl font-black text-emerald-600">32.4%</span>
                    </div>
                    <div className="text-right border-l border-slate-200 pl-8">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Team Conversion</span>
                        <span className="block text-2xl font-black text-blue-600">68%</span>
                    </div>
                </div>
            </div>

            {/* PERFORMANCE CHARTS */}
            <div className="mb-8">
                <PerformanceCharts />
            </div>

            {/* TEAM PERFORMANCE SECTION */}
            <div className="mb-8">
                <TeamPerformancePanel />
            </div>

            {/* LEADS, REVIEWS & QUALITY SECTION */}
            <div className="mb-8">
                <ReviewsAndLeadsPanel />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT: APPROVAL QUEUE (Control) */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-navy-900 mb-4 flex justify-between items-center">
                        <span>Approval Queue</span>
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">5 Pending</span>
                    </h2>

                    {/* Approval Tabs */}
                    <div className="flex gap-2 mb-4 border-b border-gray-100 pb-2">
                        <button
                            onClick={() => setApprovalTab('discounts')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${approvalTab === 'discounts' ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Discounts (2)
                        </button>
                        <button
                            onClick={() => setApprovalTab('claims')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${approvalTab === 'claims' ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Claims (2)
                        </button>
                        <button
                            onClick={() => setApprovalTab('costs')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${approvalTab === 'costs' ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Supplier Costs (1)
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* DISCOUNT APPROVALS */}
                        {approvalTab === 'discounts' && (
                            <>
                                <div className="p-4 border border-gray-100 rounded bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-navy-900 text-sm">Discount Override: Project Alpha</h3>
                                        <p className="text-xs text-gray-500">Designer: Sarah | Amount: 5% Off | Reason: "Client Loyalty"</p>
                                        <p className="text-xs text-red-500 font-bold mt-1">Impact: Margin drops to 24% (Below Floor)</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600">APPROVE</button>
                                        <button className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600">REJECT</button>
                                    </div>
                                </div>
                                <div className="p-4 border border-gray-100 rounded bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-navy-900 text-sm">Credit Terms Extension</h3>
                                        <p className="text-xs text-gray-500">Designer: Mike | Client: Residency 88</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600">APPROVE</button>
                                        <button className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600">REJECT</button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* CLAIM APPROVALS */}
                        {approvalTab === 'claims' && (
                            <>
                                <div className="p-4 border border-amber-200 rounded bg-amber-50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-navy-900 text-sm">Progress Claim PC-003</h3>
                                        <p className="text-xs text-gray-500">Project: Marina Bay Residence | Designer: Sarah</p>
                                        <p className="text-xs text-gray-600 mt-1">Stage: 30% Upon Carpentry Delivery | <span className="font-bold">$48,500</span></p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600">APPROVE</button>
                                        <button className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600">REJECT</button>
                                    </div>
                                </div>
                                <div className="p-4 border border-amber-200 rounded bg-amber-50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-navy-900 text-sm">Progress Claim PC-007</h3>
                                        <p className="text-xs text-gray-500">Project: Sentosa Cove Villa | Designer: Lisa</p>
                                        <p className="text-xs text-gray-600 mt-1">Stage: 20% Confirmation | <span className="font-bold">$32,000</span></p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600">APPROVE</button>
                                        <button className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600">REJECT</button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* SUPPLIER COST APPROVALS */}
                        {approvalTab === 'costs' && (
                            <>
                                <div className="p-4 border border-blue-200 rounded bg-blue-50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-navy-900 text-sm">Cost Update: Plywood 18mm</h3>
                                        <p className="text-xs text-gray-500">Supplier: WoodWorks Pte Ltd</p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Current: $42.00/sheet  New: <span className="text-red-500 font-bold">$45.50/sheet (+8.3%)</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Source: Invoice #WW-2024-0892 dated 25 Jan</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600">UPDATE</button>
                                        <button className="px-3 py-1 bg-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-400">IGNORE</button>
                                    </div>
                                </div>
                                <div className="p-4 border border-green-200 rounded bg-green-50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-navy-900 text-sm">Rebate Available: Hafele Hardware</h3>
                                        <p className="text-xs text-gray-500">Supplier: Hafele Singapore</p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Volume Rebate: <span className="text-green-600 font-bold">5% on orders &gt; $10,000</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Valid: Jan - Mar 2024 | Minimum order qty met</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600">APPLY</button>
                                        <button className="px-3 py-1 bg-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-400">LATER</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT: COST LEARNING HUB (Intelligence) */}
                <div className="bg-navy-900 text-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-gold-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                        <span>Cost Learning Hub</span>
                        <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span>
                    </h2>

                    {/* DRAG DROP ZONE */}
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-6 hover:border-gold-500 transition-colors cursor-pointer group">
                        <p className="text-gray-400 group-hover:text-white transition-colors font-bold">DRAG INVOICES HERE</p>
                        <p className="text-xs text-gray-500 mt-2">Support: PDF, JPG, PNG</p>
                    </div>

                    {/* REVIEW LIST */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Suggested Updates</h3>
                        <div className="space-y-2">
                            <div className="bg-white/5 p-3 rounded flex justify-between items-center border border-white/10">
                                <div>
                                    <p className="text-sm font-bold">Plywood 18mm (WoodWorks)</p>
                                    <p className="text-xs text-gray-400">Detected: $42.00  <span className="text-red-400">$45.50 (+8%)</span></p>
                                </div>
                                <button className="text-xs bg-gold-500 text-navy-900 px-2 py-1 rounded font-bold hover:bg-white">UPDATE</button>
                            </div>
                            <div className="bg-white/5 p-3 rounded flex justify-between items-center border border-white/10">
                                <div>
                                    <p className="text-sm font-bold">Hafele Hinge (Soft Close)</p>
                                    <p className="text-xs text-gray-400">Detected: $4.50  <span className="text-green-400">$4.20 (-6%)</span></p>
                                </div>
                                <button className="text-xs bg-gold-500 text-navy-900 px-2 py-1 rounded font-bold hover:bg-white">UPDATE</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* DATA MANAGEMENT LAYER */}
            <div className="mt-12 pt-8 border-t-2 border-industrial-navy">
                <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                    <span className="text-gold-600"></span> Data Management Layer
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 1. Vendors */}
                    <VendorManager />
                    {/* 2. Clients */}
                    <div className="flex flex-col gap-6">
                        <ClientManager />
                        <CsvImporter />
                    </div>
                    {/* 3. Logic Builder */}
                    <div className="lg:col-span-1">
                        <ItemBuilder />
                    </div>
                </div>
            </div>

            {/* SUBSCRIPTION & BILLING */}
            <div className="mt-12 pt-8 border-t-2 border-industrial-navy">
                <SubscriptionPanel />
            </div>

            {/* COMPANY SETTINGS */}
            <div className="mt-12 pt-8 border-t-2 border-industrial-navy">
                <CompanySettings />
            </div>

        </div>
    );
}
