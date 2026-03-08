'use client';

import { useState } from 'react';
import RoofNav from '@/components/RoofNav';

// =============================================================
// SITE COMMAND CENTER — The ID's cockpit for active construction
// =============================================================

interface SiteCrew {
    id: string;
    name: string;
    trade: string;
    vendor: string;
    vendorCode: string;
    status: 'on-site' | 'en-route' | 'completed' | 'no-show';
    checkIn?: string;
    checkOut?: string;
    task: string;
    location: string;
}

interface SiteActivity {
    id: string;
    time: string;
    type: 'photo' | 'checkin' | 'checkout' | 'defect' | 'delivery' | 'approval' | 'message';
    who: string;
    text: string;
    urgent?: boolean;
}

interface Delivery {
    id: string;
    item: string;
    from: string;
    eta: string;
    status: 'arriving-today' | 'arriving-this-week' | 'delayed';
    clientPurchase?: boolean;
    dimensions?: string;
    location: string;
}

interface ChecklistItem {
    id: string;
    phase: string;
    task: string;
    status: 'done' | 'in-progress' | 'pending' | 'flagged';
    assignee: string;
    photos?: number;
}

// ── DEMO DATA ──

const PROJECT = {
    name: 'Mr & Mrs Tan — 4-Room HDB',
    address: 'Block 123 Tampines St 45 #12-345',
    progress: 56,
    phase: 'Tiling',
    daysRemaining: 19,
    handoverDate: 'Feb 25, 2026',
};

const TODAYS_CREW: SiteCrew[] = [
    { id: 'c1', name: 'Ah Kow', trade: 'Tiler', vendor: 'WiseWork', vendorCode: 'WW-001', status: 'on-site', checkIn: '8:15 AM', task: 'Kitchen floor tiling (600x600 porcelain)', location: 'Kitchen' },
    { id: 'c2', name: 'Raju', trade: 'Tiler Helper', vendor: 'WiseWork', vendorCode: 'WW-001', status: 'on-site', checkIn: '8:20 AM', task: 'Cutting & grouting support', location: 'Kitchen' },
    { id: 'c3', name: 'Ah Beng', trade: 'Plumber', vendor: 'PipeMaster', vendorCode: 'PM-001', status: 'en-route', task: 'Basin rough-in for master bath', location: 'Master Bath' },
    { id: 'c4', name: 'Kumar', trade: 'Electrician', vendor: 'SparkTech', vendorCode: 'ST-001', status: 'completed', checkIn: '7:30 AM', checkOut: '11:45 AM', task: 'DB box wiring + point marking', location: 'Whole Unit' },
    { id: 'c5', name: 'Xiao Ming', trade: 'Aircon', vendor: 'CoolAir SG', vendorCode: 'CA-001', status: 'no-show', task: 'Trunking installation for MBR + Living', location: 'Master Bedroom + Living' },
];

const ACTIVITY_FEED: SiteActivity[] = [
    { id: 'a1', time: '12:30 PM', type: 'photo', who: 'Ah Kow (Tiler)', text: 'Uploaded 4 photos — Kitchen floor tiling 60% complete' },
    { id: 'a2', time: '11:45 AM', type: 'checkout', who: 'Kumar (Electrician)', text: 'Checked out — DB box wiring complete, 14 points marked' },
    { id: 'a3', time: '11:20 AM', type: 'defect', who: 'You', text: 'Flagged: Uneven tile lippage at kitchen entrance (>2mm)', urgent: true },
    { id: 'a4', time: '10:00 AM', type: 'delivery', who: 'System', text: 'Bosch Dishwasher delivery confirmed for tomorrow 2-5 PM' },
    { id: 'a5', time: '9:30 AM', type: 'message', who: 'Mrs Tan (Client)', text: 'Can we change the grout color to dark grey instead?' },
    { id: 'a6', time: '8:20 AM', type: 'checkin', who: 'Raju (Tiler Helper)', text: 'Checked in — GPS verified at site' },
    { id: 'a7', time: '8:15 AM', type: 'checkin', who: 'Ah Kow (Tiler)', text: 'Checked in — GPS verified at site' },
    { id: 'a8', time: '7:30 AM', type: 'checkin', who: 'Kumar (Electrician)', text: 'Checked in — GPS verified at site' },
];

const DELIVERIES: Delivery[] = [
    { id: 'd1', item: 'Bosch Dishwasher SMS2HVI72E', from: 'Lazada', eta: 'Tomorrow 2-5 PM', status: 'arriving-today', clientPurchase: true, dimensions: '600×600×845mm', location: 'Kitchen' },
    { id: 'd2', item: 'Tiles — Niro Granite 600x600 (Kitchen)', from: 'Hafary', eta: 'Today (delivered)', status: 'arriving-today', location: 'Kitchen' },
    { id: 'd3', item: 'Fanco Ceiling Fan', from: 'Taobao via ezbuy', eta: 'Feb 25', status: 'arriving-this-week', clientPurchase: true, location: 'Master Bedroom' },
    { id: 'd4', item: 'Castlery Sofa (L-Shape)', from: 'Castlery.com', eta: 'Mar 1 (post-handover)', status: 'arriving-this-week', clientPurchase: true, dimensions: '2700×1800×850mm', location: 'Living Room' },
    { id: 'd5', item: 'Aircon units ×3', from: 'CoolAir SG', eta: 'Delayed — vendor no-show', status: 'delayed', location: 'MBR + BR2 + Living' },
];

const CHECKLIST: ChecklistItem[] = [
    { id: 'cl1', phase: 'Tiling', task: 'Kitchen floor — 600×600 porcelain', status: 'in-progress', assignee: 'WW-001', photos: 4 },
    { id: 'cl2', phase: 'Tiling', task: 'Kitchen backsplash — subway tiles', status: 'pending', assignee: 'WW-001' },
    { id: 'cl3', phase: 'Tiling', task: 'Master bath — floor + wall', status: 'pending', assignee: 'WW-001' },
    { id: 'cl4', phase: 'M&E', task: 'DB box wiring complete', status: 'done', assignee: 'ST-001', photos: 6 },
    { id: 'cl5', phase: 'M&E', task: '14-point marking verified', status: 'done', assignee: 'ST-001', photos: 2 },
    { id: 'cl6', phase: 'M&E', task: 'Basin rough-in (master bath)', status: 'in-progress', assignee: 'PM-001' },
    { id: 'cl7', phase: 'Defect', task: 'Kitchen entrance tile lippage >2mm', status: 'flagged', assignee: 'WW-001', photos: 1 },
];

const formatPrice = (n: number) => `$${n.toLocaleString()}`;

export default function SiteCommandCenter() {
    const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'deliveries'>('overview');

    const onSite = TODAYS_CREW.filter(c => c.status === 'on-site').length;
    const enRoute = TODAYS_CREW.filter(c => c.status === 'en-route').length;
    const noShows = TODAYS_CREW.filter(c => c.status === 'no-show').length;
    const defects = CHECKLIST.filter(c => c.status === 'flagged').length;
    const delayedDeliveries = DELIVERIES.filter(d => d.status === 'delayed').length;

    const statusColor = (s: SiteCrew['status']) => {
        switch (s) {
            case 'on-site': return 'bg-emerald-500';
            case 'en-route': return 'bg-blue-500';
            case 'completed': return 'bg-gray-400';
            case 'no-show': return 'bg-red-500';
        }
    };

    const statusLabel = (s: SiteCrew['status']) => {
        switch (s) {
            case 'on-site': return 'ON SITE';
            case 'en-route': return 'EN ROUTE';
            case 'completed': return 'DONE';
            case 'no-show': return 'NO SHOW';
        }
    };

    const activityIcon = (t: SiteActivity['type']) => {
        switch (t) {
            case 'photo': return 'PH';
            case 'checkin': return 'IN';
            case 'checkout': return 'OUT';
            case 'defect': return '!!';
            case 'delivery': return 'DL';
            case 'approval': return '✓';
            case 'message': return 'MSG';
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAF9]" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
            <RoofNav />

            {/* Project Info Bar */}
            <div className="bg-white border-b border-gray-100 px-8 py-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-bold text-gray-800">Site Command</h2>
                        <span className="text-[8px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold uppercase">Live</span>
                        <span className="text-[10px] text-gray-400">{PROJECT.name} • {PROJECT.address}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">Progress</span>
                            <div className="w-24 bg-gray-100 rounded-full h-1.5">
                                <div className="bg-gray-900 h-1.5 rounded-full" style={{ width: `${PROJECT.progress}%` }} />
                            </div>
                            <span className="text-xs font-bold text-gray-800">{PROJECT.progress}%</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-gray-400 mr-1">Handover</span>
                            <span className="text-xs font-bold text-gray-800">{PROJECT.handoverDate}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-gray-400 mr-1">Days Left</span>
                            <span className="text-sm font-black text-gray-900">{PROJECT.daysRemaining}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-6">
                {/* Alert Banner */}
                {noShows > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-red-600">ALERT</span>
                            <div>
                                <p className="text-xs font-bold text-red-700">Vendor No-Show Alert</p>
                                <p className="text-[10px] text-red-500">CoolAir SG (CA-001) — Xiao Ming did not check in for trunking installation. Auto-penalty applied to karma score.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="text-[10px] px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50">Call Vendor</button>
                            <button className="text-[10px] px-3 py-1.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Dispatch Backup</button>
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-6 gap-3 mb-6">
                    {[
                        { label: 'On Site Now', value: String(onSite), color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'En Route', value: String(enRoute), color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Completed Today', value: String(TODAYS_CREW.filter(c => c.status === 'completed').length), color: 'text-gray-600', bg: 'bg-gray-50' },
                        { label: 'No Shows', value: String(noShows), color: noShows > 0 ? 'text-red-600' : 'text-gray-400', bg: noShows > 0 ? 'bg-red-50' : 'bg-gray-50' },
                        { label: 'Open Defects', value: String(defects), color: defects > 0 ? 'text-amber-600' : 'text-gray-400', bg: defects > 0 ? 'bg-amber-50' : 'bg-gray-50' },
                        { label: 'Delayed Deliveries', value: String(delayedDeliveries), color: delayedDeliveries > 0 ? 'text-red-600' : 'text-gray-400', bg: delayedDeliveries > 0 ? 'bg-red-50' : 'bg-gray-50' },
                    ].map(s => (
                        <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-opacity-50`}>
                            <p className="text-[9px] text-gray-400 uppercase font-medium mb-1">{s.label}</p>
                            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
                    {(['overview', 'checklist', 'deliveries'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'overview' ? 'Site Overview' : tab === 'checklist' ? 'Checklist' : 'Deliveries'}
                        </button>
                    ))}
                </div>

                {/* ── OVERVIEW TAB ── */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-3 gap-5">
                        {/* Left: Today's Crew */}
                        <div className="col-span-2 space-y-4">
                            <div className="bg-white rounded-xl border border-gray-100 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-bold text-gray-800">Today&apos;s Crew</h2>
                                    <p className="text-[10px] text-gray-400">{new Date().toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div className="space-y-2">
                                    {TODAYS_CREW.map(crew => (
                                        <div key={crew.id} className={`flex items-center justify-between p-3 rounded-lg border ${crew.status === 'no-show' ? 'border-red-200 bg-red-50/50' : 'border-gray-100 bg-gray-50/50'
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${statusColor(crew.status)}`} />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs font-semibold text-gray-800">{crew.name}</p>
                                                        <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">{crew.trade}</span>
                                                        <span className="text-[8px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded font-mono font-medium">{crew.vendorCode}</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 mt-0.5">{crew.task} • {crew.location}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {crew.checkIn && (
                                                    <p className="text-[10px] text-gray-400">
                                                        In: {crew.checkIn}{crew.checkOut ? ` → Out: ${crew.checkOut}` : ''}
                                                    </p>
                                                )}
                                                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold text-white ${statusColor(crew.status)}`}>
                                                    {statusLabel(crew.status)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Activity Feed */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl border border-gray-100 p-5">
                                <h2 className="text-sm font-bold text-gray-800 mb-4">Live Activity</h2>
                                <div className="space-y-0">
                                    {ACTIVITY_FEED.map((a, i) => (
                                        <div key={a.id} className={`flex gap-3 py-2.5 ${i < ACTIVITY_FEED.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                            <span className="text-sm shrink-0 mt-0.5">{activityIcon(a.type)}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[11px] ${a.urgent ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>{a.text}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-[9px] text-gray-400">{a.who}</p>
                                                    <p className="text-[9px] text-gray-300">{a.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl border border-gray-100 p-5">
                                <h2 className="text-sm font-bold text-gray-800 mb-3">Quick Actions</h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: 'Flag Defect', icon: '!', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                                        { label: 'Approve Work', icon: '✓', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                                        { label: 'Call Vendor', icon: 'TEL', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                                        { label: 'Message Client', icon: 'MSG', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                                        { label: 'Upload Photos', icon: '+', color: 'bg-gray-50 text-gray-700 border-gray-200' },
                                        { label: 'Add VO', icon: 'VO', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                                    ].map(action => (
                                        <button key={action.label} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-[10px] font-semibold transition-all hover:scale-[1.02] ${action.color}`}>
                                            <span>{action.icon}</span>
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── CHECKLIST TAB ── */}
                {activeTab === 'checklist' && (
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-sm font-bold text-gray-800">QC Checklist</h2>
                                <p className="text-[10px] text-gray-400 mt-0.5">{CHECKLIST.filter(c => c.status === 'done').length}/{CHECKLIST.length} tasks verified</p>
                            </div>
                            <button className="text-xs px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">+ Add Task</button>
                        </div>
                        {/* Group by phase */}
                        {['Tiling', 'M&E', 'Defect'].map(phase => {
                            const items = CHECKLIST.filter(c => c.phase === phase);
                            if (items.length === 0) return null;
                            return (
                                <div key={phase} className="mb-5">
                                    <h3 className={`text-[10px] font-bold uppercase tracking-wide px-1 mb-2 ${phase === 'Defect' ? 'text-red-500' : 'text-gray-400'
                                        }`}>{phase === 'Defect' ? 'Defects' : phase}</h3>
                                    <div className="space-y-1.5">
                                        {items.map(item => (
                                            <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border ${item.status === 'flagged' ? 'border-red-200 bg-red-50/50' : 'border-gray-100'
                                                }`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${item.status === 'done' ? 'bg-emerald-500 text-white' :
                                                        item.status === 'in-progress' ? 'bg-blue-100 text-blue-600 border border-blue-300' :
                                                            item.status === 'flagged' ? 'bg-red-500 text-white' :
                                                                'bg-gray-100 text-gray-400 border border-gray-200'
                                                        }`}>
                                                        {item.status === 'done' ? '✓' : item.status === 'flagged' ? '!' : ''}
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs ${item.status === 'flagged' ? 'text-red-700 font-semibold' : 'text-gray-700'}`}>{item.task}</p>
                                                        <p className="text-[9px] text-gray-400 mt-0.5">Assigned: {item.assignee}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {item.photos && (
                                                        <span className="text-[9px] text-gray-400">{item.photos} photos</span>
                                                    )}
                                                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${item.status === 'done' ? 'bg-emerald-50 text-emerald-600' :
                                                        item.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                                                            item.status === 'flagged' ? 'bg-red-50 text-red-600' :
                                                                'bg-gray-50 text-gray-400'
                                                        }`}>{item.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── DELIVERIES TAB ── */}
                {activeTab === 'deliveries' && (
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-sm font-bold text-gray-800">Delivery Coordination</h2>
                                <p className="text-[10px] text-gray-400 mt-0.5">Site deliveries + client purchases requiring coordination</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {DELIVERIES.map(d => (
                                <div key={d.id} className={`flex items-center justify-between p-4 rounded-lg border ${d.status === 'delayed' ? 'border-red-200 bg-red-50/30' :
                                    d.status === 'arriving-today' ? 'border-amber-200 bg-amber-50/30' :
                                        'border-gray-100'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${d.status === 'delayed' ? 'bg-red-100' :
                                            d.status === 'arriving-today' ? 'bg-amber-100' : 'bg-blue-100'
                                            }`}>
                                            {d.status === 'delayed' ? '!' : 'DL'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-semibold text-gray-800">{d.item}</p>
                                                {d.clientPurchase && (
                                                    <span className="text-[7px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded-full font-bold uppercase">Client Purchase</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] text-gray-400">from {d.from}</span>
                                                <span className="text-[10px] text-gray-400">{d.location}</span>
                                                {d.dimensions && <span className="text-[10px] text-gray-400">{d.dimensions}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xs font-semibold ${d.status === 'delayed' ? 'text-red-600' :
                                            d.status === 'arriving-today' ? 'text-amber-600' : 'text-gray-600'
                                            }`}>{d.eta}</p>
                                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block ${d.status === 'delayed' ? 'bg-red-100 text-red-600' :
                                            d.status === 'arriving-today' ? 'bg-amber-100 text-amber-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                            {d.status === 'delayed' ? 'DELAYED' : d.status === 'arriving-today' ? 'TODAY/TOMORROW' : 'THIS WEEK'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 mt-4">
                            <p className="text-[10px] text-blue-700">
                                <span className="font-semibold">Synced from client&apos;s My Purchases:</span> Items marked &quot;Client Purchase&quot; were added by the homeowner. Dimensions are auto-loaded for your equipment layout planning.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
