'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    type Prospect,
    type ProspectStatus,
    getProspects,
    saveProspects,
    createProspect,
    getStaleProspects,
} from '@/types/prospect-client';
import { createProject } from '../../app/lib/project-store';

// ============================================================
// CONSTANTS
// ============================================================

const KANBAN_COLUMNS: { status: ProspectStatus; label: string; color: string; bgColor: string }[] = [
    { status: 'LEAD', label: 'Lead', color: 'text-slate-600', bgColor: 'bg-slate-100' },
    { status: 'QUOTED', label: 'Quoted', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { status: 'VIEWED', label: 'Viewed', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { status: 'NEGOTIATING', label: 'Negotiating', color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { status: 'ACCEPTED', label: 'Accepted', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { status: 'SIGNED', label: 'Signed', color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { status: 'PAID', label: 'Paid', color: 'text-green-600', bgColor: 'bg-green-50' },
    { status: 'CONVERTED', label: 'Converted', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
];

const PROPERTY_TYPES = ['3-Room HDB', '4-Room HDB', '5-Room HDB', 'Executive HDB', 'Condo', 'Landed', 'Commercial'];

const SAMPLE_PROSPECTS: Prospect[] = [
    {
        id: 'prsp-demo-1', status: 'LEAD', name: 'David Lim', phone: '+65 9123 4567',
        email: 'david@email.com', projectType: '4-Room HDB', estimatedBudget: 55000,
        projectAddress: 'Block 456 Tampines St 42', referralSource: 'Instagram',
        quoteIds: [], createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
        id: 'prsp-demo-2', status: 'QUOTED', name: 'Michelle Tan', phone: '+65 8234 5678',
        email: 'michelle@email.com', projectType: 'Condo', estimatedBudget: 120000,
        projectAddress: '8 Marina View #12-05', referralSource: 'Referral',
        quoteIds: ['q-001'], activeQuoteId: 'q-001',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
        id: 'prsp-demo-3', status: 'VIEWED', name: 'Jason Ng', phone: '+65 9345 6789',
        projectType: '5-Room HDB', estimatedBudget: 72000,
        projectAddress: 'Block 789 Woodlands Dr 14', referralSource: 'Website',
        quoteIds: ['q-002'], activeQuoteId: 'q-002', quoteViewedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
        id: 'prsp-demo-4', status: 'NEGOTIATING', name: 'Priya Kaur', phone: '+65 8456 7890',
        email: 'priya@email.com', projectType: 'Condo', estimatedBudget: 95000,
        projectAddress: '10 Paya Lebar Road', notes: 'Wants to downgrade some carpentry',
        quoteIds: ['q-003'], activeQuoteId: 'q-003',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
        id: 'prsp-demo-5', status: 'ACCEPTED', name: 'Tan Wei Ming', phone: '+65 9567 8901',
        email: 'weiming@email.com', projectType: '4-Room HDB', estimatedBudget: 45000,
        projectAddress: '322C Tengah Drive',
        quoteIds: ['q-004'], activeQuoteId: 'q-004', quoteAcceptedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'prsp-demo-6', status: 'STALE', name: 'Robert Ong', phone: '+65 8678 9012',
        projectType: 'Landed', estimatedBudget: 250000,
        projectAddress: '15 Jalan Binchang', referralSource: 'Qanvast',
        quoteIds: ['q-005'], lastContactedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    }
];

// ============================================================
// COMPONENT
// ============================================================

export default function ProspectKanban() {
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [newProspect, setNewProspect] = useState({ name: '', phone: '', email: '', projectType: '', estimatedBudget: '', projectAddress: '', referralSource: '' });

    // Load prospects
    useEffect(() => {
        const stored = getProspects();
        if (stored.length > 0) {
            setProspects(stored);
        } else {
            // Seed with sample data
            saveProspects(SAMPLE_PROSPECTS);
            setProspects(SAMPLE_PROSPECTS);
        }
    }, []);

    // Save on change
    const persist = useCallback((updated: Prospect[]) => {
        setProspects(updated);
        saveProspects(updated);
    }, []);

    // Drag handlers
    const handleDragStart = (id: string) => setDraggedId(id);
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (targetStatus: ProspectStatus) => {
        if (!draggedId) return;
        const updated = prospects.map(p => {
            if (p.id !== draggedId) return p;
            const now = new Date().toISOString();
            const updates: Partial<Prospect> = { status: targetStatus, updatedAt: now };
            if (targetStatus === 'VIEWED') updates.quoteViewedAt = now;
            if (targetStatus === 'ACCEPTED') updates.quoteAcceptedAt = now;
            if (targetStatus === 'SIGNED') updates.tcSignedAt = now;
            if (targetStatus === 'PAID') updates.firstPaymentAt = now;
            return { ...p, ...updates };
        });
        persist(updated);
        setDraggedId(null);

        // Fire API call (fire-and-forget for now)
        fetch(`/api/prospects/${draggedId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: targetStatus }),
        }).catch(() => { });
    };

    // Add new prospect + project
    const handleAdd = () => {
        if (!newProspect.name.trim()) return;
        const p = createProspect(newProspect.name, newProspect.phone, newProspect.email);
        p.projectType = newProspect.projectType;
        p.estimatedBudget = newProspect.estimatedBudget ? Number(newProspect.estimatedBudget) : undefined;
        p.projectAddress = newProspect.projectAddress;
        p.referralSource = newProspect.referralSource;

        // Also create a linked OS project
        createProject(newProspect.name, newProspect.projectType);

        const updated = [p, ...prospects];
        persist(updated);
        setNewProspect({ name: '', phone: '', email: '', projectType: '', estimatedBudget: '', projectAddress: '', referralSource: '' });
        setShowAddForm(false);
    };

    // Stats
    const totalPipeline = prospects
        .filter(p => !['CONVERTED', 'REJECTED', 'STALE'].includes(p.status))
        .reduce((sum, p) => sum + (p.estimatedBudget || 0), 0);
    const convertedCount = prospects.filter(p => p.status === 'CONVERTED').length;
    const totalCount = prospects.filter(p => p.status !== 'STALE' && p.status !== 'REJECTED').length;
    const conversionRate = totalCount > 0 ? Math.round((convertedCount / totalCount) * 100) : 0;
    const staleCount = prospects.filter(p => {
        const last = p.lastContactedAt || p.updatedAt;
        return new Date(last).getTime() < Date.now() - 14 * 86400000 &&
            !['CONVERTED', 'REJECTED', 'STALE'].includes(p.status);
    }).length;

    const getDaysSince = (date: string) => Math.floor((Date.now() - new Date(date).getTime()) / 86400000);

    const fmt = (n: number) => `$${n.toLocaleString()}`;

    return (
        <div className="p-6 lg:p-8 font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Prospect Pipeline</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Drag cards between columns to update status</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
                >
                    <span className="text-lg leading-none">+</span> New Project
                </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-xl">
                    <p className="text-[10px] uppercase tracking-wider opacity-80">Pipeline Value</p>
                    <p className="text-xl font-bold mt-1">{fmt(totalPipeline)}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-4 rounded-xl">
                    <p className="text-[10px] uppercase tracking-wider opacity-80">Converted</p>
                    <p className="text-xl font-bold mt-1">{convertedCount}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white p-4 rounded-xl">
                    <p className="text-[10px] uppercase tracking-wider opacity-80">Conversion Rate</p>
                    <p className="text-xl font-bold mt-1">{conversionRate}%</p>
                </div>
                <div className={`bg-gradient-to-br ${staleCount > 0 ? 'from-amber-500 to-orange-600' : 'from-slate-400 to-slate-500'} text-white p-4 rounded-xl`}>
                    <p className="text-[10px] uppercase tracking-wider opacity-80">Stale Leads</p>
                    <p className="text-xl font-bold mt-1">{staleCount}</p>
                </div>
            </div>

            {/* Quick Add Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">New Client Project</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        <input
                            placeholder="Client Name *"
                            value={newProspect.name}
                            onChange={e => setNewProspect(p => ({ ...p, name: e.target.value }))}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                        />
                        <input
                            placeholder="Phone"
                            value={newProspect.phone}
                            onChange={e => setNewProspect(p => ({ ...p, phone: e.target.value }))}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                        />
                        <input
                            placeholder="Email"
                            value={newProspect.email}
                            onChange={e => setNewProspect(p => ({ ...p, email: e.target.value }))}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                        />
                        <input
                            placeholder="Project Address"
                            value={newProspect.projectAddress}
                            onChange={e => setNewProspect(p => ({ ...p, projectAddress: e.target.value }))}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        <select
                            value={newProspect.projectType}
                            onChange={e => setNewProspect(p => ({ ...p, projectType: e.target.value }))}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none bg-white"
                        >
                            <option value="">Property Type</option>
                            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input
                            placeholder="Budget (e.g. 55000)"
                            type="number"
                            value={newProspect.estimatedBudget}
                            onChange={e => setNewProspect(p => ({ ...p, estimatedBudget: e.target.value }))}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                        />
                        <input
                            placeholder="Referral Source"
                            value={newProspect.referralSource}
                            onChange={e => setNewProspect(p => ({ ...p, referralSource: e.target.value }))}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleAdd}
                                className="flex-1 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors"
                            >
                                Add to Pipeline
                            </button>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-3 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Kanban Board */}
            <div className="flex gap-2.5 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
                {KANBAN_COLUMNS.map(col => {
                    const cards = prospects.filter(p => p.status === col.status);
                    return (
                        <div
                            key={col.status}
                            className="min-w-[220px] w-[220px] shrink-0 flex flex-col"
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(col.status)}
                        >
                            {/* Column Header */}
                            <div className={`rounded-t-xl px-3 py-2.5 ${col.bgColor} border-b-2 border-current/10`}>
                                <div className="flex items-center justify-between">
                                    <p className={`text-[11px] font-bold uppercase tracking-wider ${col.color}`}>{col.label}</p>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/60 ${col.color}`}>
                                        {cards.length}
                                    </span>
                                </div>
                                {cards.length > 0 && (
                                    <p className="text-[9px] text-slate-400 mt-0.5">
                                        {fmt(cards.reduce((s, c) => s + (c.estimatedBudget || 0), 0))}
                                    </p>
                                )}
                            </div>

                            {/* Cards */}
                            <div className="bg-slate-50/50 rounded-b-xl p-1.5 space-y-1.5 flex-1 min-h-[120px]">
                                {cards.map(prospect => {
                                    const daysSinceUpdate = getDaysSince(prospect.lastContactedAt || prospect.updatedAt);
                                    const isStale = daysSinceUpdate > 14 && !['CONVERTED', 'REJECTED', 'STALE'].includes(prospect.status);
                                    const isExpanded = expandedCard === prospect.id;

                                    return (
                                        <div
                                            key={prospect.id}
                                            draggable
                                            onDragStart={() => handleDragStart(prospect.id)}
                                            onClick={() => setExpandedCard(isExpanded ? null : prospect.id)}
                                            className={`bg-white rounded-lg p-3 border cursor-grab active:cursor-grabbing transition-all hover:shadow-md min-h-[76px] flex flex-col ${draggedId === prospect.id
                                                ? 'opacity-50 border-blue-300'
                                                : isStale
                                                    ? 'border-amber-200'
                                                    : 'border-slate-100 hover:border-slate-200'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <p className="text-xs font-semibold text-slate-800 leading-tight">{prospect.name}</p>
                                                {isStale && (
                                                    <span className="text-[8px] px-1 py-0.5 bg-amber-100 text-amber-600 rounded font-bold shrink-0">STALE</span>
                                                )}
                                            </div>
                                            {prospect.projectType && (
                                                <p className="text-[10px] text-slate-400 mt-0.5">{prospect.projectType}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-auto pt-1.5">
                                                {prospect.estimatedBudget ? (
                                                    <span className="text-[10px] font-bold text-slate-600">{fmt(prospect.estimatedBudget)}</span>
                                                ) : <span />}
                                                <span className="text-[9px] text-slate-300">{daysSinceUpdate}d</span>
                                            </div>

                                            {/* Expanded detail */}
                                            {isExpanded && (
                                                <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5">
                                                    {prospect.phone && (
                                                        <p className="text-[10px] text-slate-500"> {prospect.phone}</p>
                                                    )}
                                                    {prospect.email && (
                                                        <p className="text-[10px] text-slate-500"> {prospect.email}</p>
                                                    )}
                                                    {prospect.projectAddress && (
                                                        <p className="text-[10px] text-slate-500"> {prospect.projectAddress}</p>
                                                    )}
                                                    {prospect.referralSource && (
                                                        <p className="text-[10px] text-slate-400">via {prospect.referralSource}</p>
                                                    )}
                                                    {prospect.notes && (
                                                        <p className="text-[10px] text-amber-600 italic"> {prospect.notes}</p>
                                                    )}
                                                    {prospect.quoteIds.length > 0 && (
                                                        <p className="text-[10px] text-blue-500">{prospect.quoteIds.length} quote(s) linked</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Empty state */}
                                {cards.length === 0 && (
                                    <div className="flex items-center justify-center h-24 text-[10px] text-slate-300 uppercase tracking-wider">
                                        Drop here
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
