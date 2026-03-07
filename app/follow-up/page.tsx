'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Filter, Phone, Mail, Clock, Plus, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { getLeads } from '@/lib/supabase-data';

type LeadStatus = 'NEW' | 'CONTACTED' | 'SITE_VISIT' | 'QUOTING' | 'NEGOTIATING' | 'WON' | 'LOST';

interface Lead {
    id: string;
    name: string;
    phone: string;
    source: string;
    propertyType: 'HDB' | 'Condo' | 'Landed';
    location: string;
    budgetRange: string;
    status: LeadStatus;
    lastContact: string;
    nextAction: string;
    assignedTo: string;
    commitmentLevel?: 'just_looking' | 'engaged' | 'shortlisted' | 'deciding' | 'committed';
}

const STATUS_STYLES: Record<LeadStatus, { bg: string; text: string }> = {
    NEW: { bg: 'bg-blue-50', text: 'text-blue-700' },
    CONTACTED: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
    SITE_VISIT: { bg: 'bg-purple-50', text: 'text-purple-700' },
    QUOTING: { bg: 'bg-orange-50', text: 'text-orange-700' },
    NEGOTIATING: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
    WON: { bg: 'bg-green-50', text: 'text-green-700' },
    LOST: { bg: 'bg-red-50', text: 'text-red-700' },
};

const COMMITMENT_DOT: Record<string, string> = {
    just_looking: 'bg-red-400',
    engaged: 'bg-orange-400',
    shortlisted: 'bg-yellow-400',
    deciding: 'bg-blue-400',
    committed: 'bg-green-400',
};

const STAFF_ROSTER = [
    { id: 'bjorn', name: 'Bjorn', initials: 'BT', color: 'bg-indigo-500' },
    { id: 'jenny', name: 'Jenny', initials: 'JL', color: 'bg-pink-500' },
    { id: 'amir', name: 'Amir', initials: 'AR', color: 'bg-teal-500' },
];

const DEMO_LEADS_INIT: Lead[] = [
    { id: 'L001', name: 'Colleen Tan', phone: '+65 9123 4567', source: 'Instagram', propertyType: 'HDB', location: 'Punggol', budgetRange: '$35k-$50k', status: 'QUOTING', lastContact: '2 hours ago', nextAction: 'Send revised quote', assignedTo: 'Bjorn', commitmentLevel: 'engaged' },
    { id: 'L002', name: 'Marcus Lee', phone: '+65 8234 5678', source: 'Referral', propertyType: 'Condo', location: 'Bukit Timah', budgetRange: '$80k-$120k', status: 'SITE_VISIT', lastContact: '1 day ago', nextAction: 'Confirm site visit Sat 2pm', assignedTo: 'Jenny', commitmentLevel: 'shortlisted' },
    { id: 'L003', name: 'Sarah Wong', phone: '+65 9345 6789', source: 'Qanvast', propertyType: 'HDB', location: 'Tampines', budgetRange: '$25k-$35k', status: 'NEW', lastContact: 'Just now', nextAction: 'Call within 15 min', assignedTo: 'Unassigned', commitmentLevel: 'just_looking' },
    { id: 'L004', name: 'David Chen', phone: '+65 8456 7890', source: 'Walk-in', propertyType: 'Landed', location: 'Siglap', budgetRange: '$150k+', status: 'NEGOTIATING', lastContact: '3 days ago', nextAction: 'Follow up on contract', assignedTo: 'Amir', commitmentLevel: 'deciding' },
    { id: 'L005', name: 'Amy Lim', phone: '+65 9567 8901', source: 'Facebook', propertyType: 'HDB', location: 'Sengkang', budgetRange: '$30k-$40k', status: 'CONTACTED', lastContact: '5 hours ago', nextAction: 'Send portfolio', assignedTo: 'Bjorn', commitmentLevel: 'just_looking' },
    { id: 'L006', name: 'Raymond Goh', phone: '+65 8678 9012', source: 'Referral', propertyType: 'Condo', location: 'Novena', budgetRange: '$60k-$80k', status: 'WON', lastContact: '1 week ago', nextAction: 'Start project kickoff', assignedTo: 'Jenny', commitmentLevel: 'committed' },
];

function timeAgo(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
}

export default function FollowUpPage() {
    const [filter, setFilter] = useState<LeadStatus | 'ALL'>('ALL');
    const [staffFilter, setStaffFilter] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [leads, setLeads] = useState(DEMO_LEADS_INIT);
    const [loadingLeads, setLoadingLeads] = useState(true);

    // Load real leads from Supabase, merge with demo if needed
    useEffect(() => {
        async function loadLeads() {
            try {
                const supaLeads = await getLeads();
                if (supaLeads.length > 0) {
                    const mapped: Lead[] = supaLeads.map((sl, i) => ({
                        id: sl.id,
                        name: sl.full_name,
                        phone: sl.phone || '',
                        source: 'Website',
                        propertyType: (sl.property_type as Lead['propertyType']) || 'HDB',
                        location: sl.property_address || 'Singapore',
                        budgetRange: sl.budget || 'TBD',
                        status: 'NEW' as LeadStatus,
                        lastContact: timeAgo(sl.created_at),
                        nextAction: 'Call within 15 min',
                        assignedTo: 'Unassigned',
                        commitmentLevel: 'just_looking' as const,
                    }));
                    setLeads([...mapped, ...DEMO_LEADS_INIT]);
                }
            } catch (err) {
                console.error('Failed to load leads:', err);
            } finally {
                setLoadingLeads(false);
            }
        }
        loadLeads();
    }, []);

    const reassignLead = (leadId: string) => {
        setLeads(prev => prev.map(l => {
            if (l.id !== leadId) return l;
            const staffNames = ['Unassigned', ...STAFF_ROSTER.map(s => s.name)];
            const currentIdx = staffNames.indexOf(l.assignedTo);
            const nextIdx = (currentIdx + 1) % staffNames.length;
            return { ...l, assignedTo: staffNames[nextIdx] };
        }));
    };

    const filtered = leads.filter(l => {
        if (filter !== 'ALL' && l.status !== filter) return false;
        if (staffFilter !== 'ALL' && l.assignedTo !== staffFilter) return false;
        if (searchQuery && !l.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const stats = {
        total: leads.length,
        hot: leads.filter(l => ['QUOTING', 'NEGOTIATING'].includes(l.status)).length,
        cold: leads.filter(l => l.status === 'NEW').length,
        won: leads.filter(l => l.status === 'WON').length,
    };

    return (
        <div className="min-h-screen bg-[#fafafa]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link href="/hub" className="text-[#999] hover:text-[#111] transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-[#111]">Follow Up</h1>
                        <p className="text-[11px] text-[#999] tracking-widest uppercase font-medium">Never lose a lead again</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-[#111] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors">
                    <Plus className="w-4 h-4" />
                    New Lead
                </button>
            </header>

            {/* Stats Bar */}
            <div className="px-8 py-4 flex gap-4">
                {[
                    { label: 'Total Leads', value: stats.total, icon: Users, color: 'text-[#111]' },
                    { label: 'Hot', value: stats.hot, icon: TrendingUp, color: 'text-orange-600' },
                    { label: 'New (Act Fast)', value: stats.cold, icon: AlertCircle, color: 'text-blue-600' },
                    { label: 'Won', value: stats.won, icon: TrendingUp, color: 'text-green-600' },
                ].map((stat) => (
                    <div key={stat.label} className="flex-1 bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <div>
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                            <div className="text-[10px] font-bold text-[#999] uppercase tracking-widest">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search + Filter */}
            <div className="px-8 py-2 flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ccc]" />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-100 text-sm focus:outline-none focus:border-[#111] transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {/* Staff Filter */}
                <div className="flex gap-1 items-center bg-white rounded-lg border border-gray-100 p-1">
                    <button
                        className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${staffFilter === 'ALL' ? 'bg-[#111] text-white' : 'text-[#999] hover:text-[#111]'}`}
                        onClick={() => setStaffFilter('ALL')}
                    >Team</button>
                    {STAFF_ROSTER.map(s => (
                        <button
                            key={s.id}
                            className={`w-7 h-7 rounded-full text-[9px] font-bold text-white transition-all ${staffFilter === s.name ? 'ring-2 ring-offset-1 ring-[#111] scale-110' : 'opacity-60 hover:opacity-100'} ${s.color}`}
                            onClick={() => setStaffFilter(staffFilter === s.name ? 'ALL' : s.name)}
                            title={s.name}
                        >{s.initials}</button>
                    ))}
                    <button
                        className={`w-7 h-7 rounded-full text-[9px] font-bold bg-gray-300 text-white transition-all ${staffFilter === 'Unassigned' ? 'ring-2 ring-offset-1 ring-[#111] scale-110' : 'opacity-60 hover:opacity-100'}`}
                        onClick={() => setStaffFilter(staffFilter === 'Unassigned' ? 'ALL' : 'Unassigned')}
                        title="Unassigned"
                    >?</button>
                </div>
                {/* Status Filter */}
                <div className="flex gap-1 bg-white rounded-lg border border-gray-100 p-1">
                    {(['ALL', 'NEW', 'CONTACTED', 'SITE_VISIT', 'QUOTING', 'WON'] as const).map((s) => (
                        <button
                            key={s}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${filter === s ? 'bg-[#111] text-white' : 'text-[#999] hover:text-[#111]'}`}
                            onClick={() => setFilter(s)}
                        >
                            {s.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lead List */}
            <div className="px-8 py-4 space-y-2">
                {filtered.map((lead) => (
                    <div key={lead.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-[#111]/20 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Staff Avatar (clickable to reassign) */}
                                {(() => {
                                    const staff = STAFF_ROSTER.find(s => s.name === lead.assignedTo);
                                    return (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); reassignLead(lead.id); }}
                                            className={`w-8 h-8 rounded-full text-[10px] font-bold text-white flex items-center justify-center shrink-0 transition-all hover:scale-110 hover:ring-2 hover:ring-offset-1 hover:ring-gray-300 ${staff?.color || 'bg-gray-300'}`}
                                            title={`Assigned to: ${lead.assignedTo} (click to reassign)`}
                                        >
                                            {staff?.initials || '?'}
                                        </button>
                                    );
                                })()}
                                {/* Commitment Dot */}
                                <div className={`w-2.5 h-2.5 rounded-full ${COMMITMENT_DOT[lead.commitmentLevel || 'just_looking']}`} />
                                {/* Name & Details */}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-[#111] text-sm">{lead.name}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${STATUS_STYLES[lead.status].bg} ${STATUS_STYLES[lead.status].text}`}>
                                            {lead.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-[#999] mt-0.5">
                                        {lead.propertyType} · {lead.location} · {lead.budgetRange} · via {lead.source}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                {/* Next Action */}
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Next</div>
                                    <div className="text-xs text-[#666]">{lead.nextAction}</div>
                                </div>
                                {/* Last Contact */}
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-[#ccc] uppercase tracking-wider flex items-center gap-1 justify-end">
                                        <Clock className="w-3 h-3" />
                                        Last
                                    </div>
                                    <div className="text-xs text-[#999]">{lead.lastContact}</div>
                                </div>
                                {/* Quick Actions */}
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors">
                                        <Phone className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors">
                                        <Mail className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
