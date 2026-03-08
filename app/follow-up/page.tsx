'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Phone, Mail, Clock, Plus, TrendingUp, Users, AlertCircle, FolderPlus, Zap, Eye, MessageCircle, ChevronRight, Flame, Timer, Star, ArrowUpRight } from 'lucide-react';
import RoofNav from '@/components/RoofNav';
import { getLeads, createProject } from '@/lib/supabase-data';

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
    score?: number; // 0-100 lead score
    touchpoints?: number; // how many interactions
    daysInPipeline?: number;
}

const STATUS_CONFIG: Record<LeadStatus, { bg: string; text: string; glow: string; label: string }> = {
    NEW: { bg: '#EFF6FF', text: '#2563EB', glow: '#3B82F6', label: 'New Lead' },
    CONTACTED: { bg: '#FEF9C3', text: '#CA8A04', glow: '#F59E0B', label: 'Contacted' },
    SITE_VISIT: { bg: '#F5F3FF', text: '#7C3AED', glow: '#8B5CF6', label: 'Site Visit' },
    QUOTING: { bg: '#FFF7ED', text: '#EA580C', glow: '#F97316', label: 'Quoting' },
    NEGOTIATING: { bg: '#EEF2FF', text: '#4F46E5', glow: '#6366F1', label: 'Negotiating' },
    WON: { bg: '#F0FDF4', text: '#16A34A', glow: '#22C55E', label: 'Won' },
    LOST: { bg: '#FEF2F2', text: '#DC2626', glow: '#EF4444', label: 'Lost' },
};

const HEAT_COLORS: Record<string, { border: string; glow: string; label: string }> = {
    just_looking: { border: '#94A3B8', glow: 'rgba(148,163,184,0.15)', label: 'Cold' },
    engaged: { border: '#F59E0B', glow: 'rgba(245,158,11,0.15)', label: 'Warm' },
    shortlisted: { border: '#F97316', glow: 'rgba(249,115,22,0.15)', label: 'Hot' },
    deciding: { border: '#EF4444', glow: 'rgba(239,68,68,0.2)', label: 'Very Hot' },
    committed: { border: '#22C55E', glow: 'rgba(34,197,94,0.2)', label: 'Committed' },
};

const STAFF_ROSTER = [
    { id: 'bjorn', name: 'Bjorn', initials: 'BT', color: '#6366F1' },
    { id: 'jenny', name: 'Jenny', initials: 'JL', color: '#EC4899' },
    { id: 'amir', name: 'Amir', initials: 'AR', color: '#14B8A6' },
];

const DEMO_LEADS: Lead[] = [
    { id: 'L001', name: 'Colleen Tan', phone: '+65 9123 4567', source: 'Instagram', propertyType: 'HDB', location: 'Punggol', budgetRange: '$35k–$50k', status: 'QUOTING', lastContact: '2 hours ago', nextAction: 'Send revised quote', assignedTo: 'Bjorn', commitmentLevel: 'engaged', score: 72, touchpoints: 5, daysInPipeline: 14 },
    { id: 'L002', name: 'Marcus Lee', phone: '+65 8234 5678', source: 'Referral', propertyType: 'Condo', location: 'Bukit Timah', budgetRange: '$80k–$120k', status: 'SITE_VISIT', lastContact: '1 day ago', nextAction: 'Confirm site visit Sat 2pm', assignedTo: 'Jenny', commitmentLevel: 'shortlisted', score: 85, touchpoints: 8, daysInPipeline: 21 },
    { id: 'L003', name: 'Sarah Wong', phone: '+65 9345 6789', source: 'Qanvast', propertyType: 'HDB', location: 'Tampines', budgetRange: '$25k–$35k', status: 'NEW', lastContact: 'Just now', nextAction: 'Call within 15 min ', assignedTo: 'Unassigned', commitmentLevel: 'just_looking', score: 25, touchpoints: 1, daysInPipeline: 0 },
    { id: 'L004', name: 'David Chen', phone: '+65 8456 7890', source: 'Walk-in', propertyType: 'Landed', location: 'Siglap', budgetRange: '$150k+', status: 'NEGOTIATING', lastContact: '3 days ago', nextAction: 'Follow up on contract', assignedTo: 'Amir', commitmentLevel: 'deciding', score: 91, touchpoints: 12, daysInPipeline: 35 },
    { id: 'L005', name: 'Amy Lim', phone: '+65 9567 8901', source: 'Facebook', propertyType: 'HDB', location: 'Sengkang', budgetRange: '$30k–$40k', status: 'CONTACTED', lastContact: '5 hours ago', nextAction: 'Send portfolio', assignedTo: 'Bjorn', commitmentLevel: 'just_looking', score: 35, touchpoints: 2, daysInPipeline: 3 },
    { id: 'L006', name: 'Raymond Goh', phone: '+65 8678 9012', source: 'Referral', propertyType: 'Condo', location: 'Novena', budgetRange: '$60k–$80k', status: 'WON', lastContact: '1 week ago', nextAction: 'Start project kickoff', assignedTo: 'Jenny', commitmentLevel: 'committed', score: 100, touchpoints: 15, daysInPipeline: 42 },
    { id: 'L007', name: 'Nicole Teo', phone: '+65 9012 3456', source: 'Carousell', propertyType: 'HDB', location: 'Bedok', budgetRange: '$40k–$55k', status: 'SITE_VISIT', lastContact: '8 hours ago', nextAction: 'Prepare mood board', assignedTo: 'Amir', commitmentLevel: 'engaged', score: 58, touchpoints: 4, daysInPipeline: 10 },
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

// CSS-only animated styles
const pulseKeyframes = `
@keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 0; } 100% { transform: scale(0.8); opacity: 0.5; } }
@keyframes slide-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes score-fill { from { width: 0; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes glow-pulse { 0%, 100% { box-shadow: 0 0 4px rgba(239,68,68,0.2); } 50% { box-shadow: 0 0 16px rgba(239,68,68,0.4); } }
`;

export default function FollowUpPage() {
    const [filter, setFilter] = useState<LeadStatus | 'ALL'>('ALL');
    const [staffFilter, setStaffFilter] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [leads, setLeads] = useState(DEMO_LEADS);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [hoveredLead, setHoveredLead] = useState<string | null>(null);
    const [expandedLead, setExpandedLead] = useState<string | null>(null);

    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    useEffect(() => {
        async function loadLeads() {
            try {
                const supaLeads = await getLeads();
                if (supaLeads.length > 0) {
                    const mapped: Lead[] = supaLeads.map((sl) => ({
                        id: sl.id,
                        name: sl.full_name,
                        phone: sl.phone || '',
                        source: 'Website',
                        propertyType: (sl.property_type as Lead['propertyType']) || 'HDB',
                        location: sl.property_address || 'Singapore',
                        budgetRange: sl.budget || 'TBD',
                        status: 'NEW' as LeadStatus,
                        lastContact: timeAgo(sl.created_at),
                        nextAction: 'Call within 15 min ',
                        assignedTo: 'Unassigned',
                        commitmentLevel: 'just_looking' as const,
                        score: 20,
                        touchpoints: 1,
                        daysInPipeline: 0,
                    }));
                    setLeads([...mapped, ...DEMO_LEADS]);
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
        fresh: leads.filter(l => l.status === 'NEW').length,
        won: leads.filter(l => l.status === 'WON').length,
        revenue: leads.filter(l => l.status === 'WON').reduce((s) => s + 75000, 0),
        avgScore: Math.round(leads.reduce((s, l) => s + (l.score || 0), 0) / leads.length),
    };

    // Pipeline funnel data
    const pipeline = [
        { status: 'NEW' as LeadStatus, count: leads.filter(l => l.status === 'NEW').length },
        { status: 'CONTACTED' as LeadStatus, count: leads.filter(l => l.status === 'CONTACTED').length },
        { status: 'SITE_VISIT' as LeadStatus, count: leads.filter(l => l.status === 'SITE_VISIT').length },
        { status: 'QUOTING' as LeadStatus, count: leads.filter(l => l.status === 'QUOTING').length },
        { status: 'NEGOTIATING' as LeadStatus, count: leads.filter(l => l.status === 'NEGOTIATING').length },
        { status: 'WON' as LeadStatus, count: leads.filter(l => l.status === 'WON').length },
    ];
    const maxPipeline = Math.max(...pipeline.map(p => p.count), 1);

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            <style dangerouslySetInnerHTML={{ __html: pulseKeyframes }} />
            <RoofNav />

            <div style={{ padding: '20px 32px 80px' }}>

                {/* ===== HERO STATS ROW ===== */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 16, marginBottom: 20 }}>

                    {/* Left: Big Number + Funnel */}
                    <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 14, fontWeight: 800, color: '#37352F' }}>Pipeline</span>
                                <span style={{ fontSize: 9, padding: '2px 8px', background: '#F0FDF4', color: '#22C55E', borderRadius: 10, fontWeight: 700 }}>LIVE</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                <span style={{ fontSize: 48, fontWeight: 900, color: '#37352F', lineHeight: 1 }}>{stats.total}</span>
                                <span style={{ fontSize: 12, color: '#9B9A97', fontWeight: 500 }}>total leads</span>
                            </div>
                        </div>

                        {/* Mini Funnel */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 16 }}>
                            {pipeline.map(p => {
                                const cfg = STATUS_CONFIG[p.status];
                                return (
                                    <div key={p.status} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                                        onClick={() => setFilter(filter === p.status ? 'ALL' : p.status)}>
                                        <span style={{ fontSize: 10, width: 20, textAlign: 'center', fontWeight: 700, color: cfg.glow }}>{cfg.label.charAt(0)}</span>
                                        <span style={{ fontSize: 10, color: '#9B9A97', width: 70, fontWeight: 500 }}>{cfg.label}</span>
                                        <div style={{ flex: 1, height: 6, background: '#F5F5F4', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', borderRadius: 3, background: cfg.glow,
                                                width: `${(p.count / maxPipeline) * 100}%`,
                                                animation: 'score-fill 0.8s ease-out',
                                            }} />
                                        </div>
                                        <span style={{ fontSize: 14, fontWeight: 800, color: cfg.text, width: 20, textAlign: 'right' }}>{p.count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Stats Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                        {[
                            { label: 'Hot Leads', value: stats.hot, sub: 'Quoting + Negotiating', icon: '', color: '#EA580C', bg: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)' },
                            { label: 'Fresh Today', value: stats.fresh, sub: 'Act within 15 min', icon: '', color: '#2563EB', bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' },
                            { label: 'Won', value: stats.won, sub: `~$${(stats.revenue / 1000).toFixed(0)}k revenue`, icon: '', color: '#16A34A', bg: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' },
                            { label: 'Lead Score', value: stats.avgScore, sub: 'Avg across pipeline', icon: '', color: '#7C3AED', bg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: s.bg, borderRadius: 14, padding: 16, border: '1px solid rgba(0,0,0,0.04)',
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 120,
                                cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <span style={{ fontSize: 24 }}>{s.icon}</span>
                                <div>
                                    <div style={{ fontSize: 32, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{s.label}</div>
                                    <div style={{ fontSize: 9, color: '#9B9A97', marginTop: 2 }}>{s.sub}</div>
                                </div>
                            </div>
                        ))}

                        {/* Conversion Rate */}
                        {[
                            { label: 'Win Rate', value: `${stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0}%`, sub: `${stats.won} of ${stats.total} converted`, icon: '', color: '#0EA5E9', bg: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)' },
                            { label: 'Avg Days', value: Math.round(leads.reduce((s, l) => s + (l.daysInPipeline || 0), 0) / leads.length), sub: 'Time to close', icon: '', color: '#6B6A67', bg: 'linear-gradient(135deg, #FAFAF9, #F5F5F4)' },
                            { label: 'Touchpoints', value: Math.round(leads.reduce((s, l) => s + (l.touchpoints || 0), 0) / leads.length), sub: 'Avg per lead', icon: '', color: '#EC4899', bg: 'linear-gradient(135deg, #FDF2F8, #FCE7F3)' },
                            { label: 'Unassigned', value: leads.filter(l => l.assignedTo === 'Unassigned').length, sub: 'Needs attention', icon: '', color: '#DC2626', bg: leads.filter(l => l.assignedTo === 'Unassigned').length > 0 ? 'linear-gradient(135deg, #FEF2F2, #FEE2E2)' : 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: s.bg, borderRadius: 14, padding: 16, border: '1px solid rgba(0,0,0,0.04)',
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 120,
                                cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <span style={{ fontSize: 24 }}>{s.icon}</span>
                                <div>
                                    <div style={{ fontSize: 32, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{s.label}</div>
                                    <div style={{ fontSize: 9, color: '#9B9A97', marginTop: 2 }}>{s.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== FILTERS BAR ===== */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
                    {/* Search */}
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#D4D3D0' }} />
                        <input
                            type="text"
                            placeholder="Search leads by name..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 12px 10px 36px', fontSize: 12, border: '1px solid #E9E9E7',
                                borderRadius: 10, fontFamily: f, outline: 'none', background: 'white', boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {/* Team Avatars */}
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: '4px 8px' }}>
                        <button onClick={() => setStaffFilter('ALL')} style={{
                            padding: '4px 10px', fontSize: 9, fontWeight: 700, borderRadius: 6, border: 'none', cursor: 'pointer',
                            background: staffFilter === 'ALL' ? '#37352F' : 'transparent', color: staffFilter === 'ALL' ? 'white' : '#9B9A97',
                            fontFamily: f, textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}>Team</button>
                        {STAFF_ROSTER.map(s => (
                            <button key={s.id} onClick={() => setStaffFilter(staffFilter === s.name ? 'ALL' : s.name)} style={{
                                width: 28, height: 28, borderRadius: '50%', border: staffFilter === s.name ? `2px solid ${s.color}` : '2px solid transparent',
                                background: s.color, color: 'white', fontSize: 8, fontWeight: 800, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                opacity: staffFilter !== 'ALL' && staffFilter !== s.name ? 0.35 : 1,
                                transition: 'all 0.2s', transform: staffFilter === s.name ? 'scale(1.15)' : 'scale(1)',
                            }}>{s.initials}</button>
                        ))}
                        <button onClick={() => setStaffFilter(staffFilter === 'Unassigned' ? 'ALL' : 'Unassigned')} style={{
                            width: 28, height: 28, borderRadius: '50%', border: staffFilter === 'Unassigned' ? '2px solid #DC2626' : '2px solid transparent',
                            background: '#D4D3D0', color: 'white', fontSize: 10, fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: staffFilter !== 'ALL' && staffFilter !== 'Unassigned' ? 0.35 : 1,
                            transition: 'all 0.2s',
                        }}>?</button>
                    </div>

                    {/* Status Filters */}
                    <div style={{ display: 'flex', gap: 2, background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 3 }}>
                        {(['ALL', 'NEW', 'CONTACTED', 'SITE_VISIT', 'QUOTING', 'NEGOTIATING', 'WON'] as const).map(s => {
                            const cfg = s !== 'ALL' ? STATUS_CONFIG[s] : null;
                            return (
                                <button key={s} onClick={() => setFilter(s)} style={{
                                    padding: '6px 12px', fontSize: 10, fontWeight: 600, borderRadius: 7,
                                    border: 'none', cursor: 'pointer', fontFamily: f,
                                    background: filter === s ? (cfg?.bg || '#37352F') : 'transparent',
                                    color: filter === s ? (cfg?.text || 'white') : '#9B9A97',
                                    transition: 'all 0.15s',
                                }}>
                                    {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ===== LEAD CARDS ===== */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {filtered.map((lead, idx) => {
                        const statusCfg = STATUS_CONFIG[lead.status];
                        const heatCfg = HEAT_COLORS[lead.commitmentLevel || 'just_looking'];
                        const staff = STAFF_ROSTER.find(s => s.name === lead.assignedTo);
                        const isHovered = hoveredLead === lead.id;
                        const isExpanded = expandedLead === lead.id;
                        const isUrgent = lead.status === 'NEW' || (lead.commitmentLevel === 'deciding');
                        const score = lead.score || 0;

                        return (
                            <div key={lead.id}
                                onMouseEnter={() => setHoveredLead(lead.id)}
                                onMouseLeave={() => setHoveredLead(null)}
                                onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                                style={{
                                    background: 'white', borderRadius: 14, padding: '0',
                                    border: `1px solid ${isHovered ? statusCfg.glow : '#E9E9E7'}`,
                                    borderLeft: `4px solid ${heatCfg.border}`,
                                    boxShadow: isHovered ? `0 8px 32px ${heatCfg.glow}, 0 2px 8px rgba(0,0,0,0.04)` : '0 1px 3px rgba(0,0,0,0.02)',
                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                    transform: isHovered ? 'translateY(-1px)' : 'none',
                                    animation: `slide-in 0.3s ease ${idx * 0.05}s both`,
                                    overflow: 'hidden',
                                }}>

                                {/* Main Row */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        {/* Staff Avatar */}
                                        <button onClick={e => { e.stopPropagation(); reassignLead(lead.id); }} style={{
                                            width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                            background: staff?.color || '#D4D3D0', color: 'white', fontSize: 10, fontWeight: 800,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            transition: 'transform 0.2s',
                                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                        }}>
                                            {staff?.initials || '?'}
                                        </button>

                                        {/* Lead Score Ring */}
                                        <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
                                            <svg width="36" height="36" viewBox="0 0 36 36">
                                                <circle cx="18" cy="18" r="15" fill="none" stroke="#F5F5F4" strokeWidth="2.5" />
                                                <circle cx="18" cy="18" r="15" fill="none" stroke={statusCfg.glow} strokeWidth="2.5"
                                                    strokeDasharray={`${score * 0.94} 100`} strokeLinecap="round"
                                                    transform="rotate(-90 18 18)"
                                                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                                                />
                                            </svg>
                                            <span style={{
                                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                                fontSize: 9, fontWeight: 800, color: statusCfg.text,
                                            }}>{score}</span>
                                        </div>

                                        {/* Name & Details */}
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 14, fontWeight: 700, color: '#37352F' }}>{lead.name}</span>
                                                <span style={{
                                                    fontSize: 8, padding: '2px 8px', borderRadius: 10, fontWeight: 700,
                                                    background: statusCfg.bg, color: statusCfg.text, textTransform: 'uppercase',
                                                }}>
                                                    {statusCfg.label}
                                                </span>
                                                {isUrgent && (
                                                    <span style={{
                                                        width: 8, height: 8, borderRadius: '50%', background: '#EF4444',
                                                        animation: 'glow-pulse 1.5s ease-in-out infinite', display: 'inline-block',
                                                    }} />
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center' }}>
                                                <span style={{ fontSize: 10, color: '#6B6A67', fontWeight: 500 }}>{lead.propertyType}</span>
                                                <span style={{ fontSize: 8, color: '#D4D3D0' }}>•</span>
                                                <span style={{ fontSize: 10, color: '#9B9A97' }}> {lead.location}</span>
                                                <span style={{ fontSize: 8, color: '#D4D3D0' }}>•</span>
                                                <span style={{ fontSize: 10, fontWeight: 600, color: '#37352F', fontFamily: "'SF Mono', monospace" }}>{lead.budgetRange}</span>
                                                <span style={{ fontSize: 8, color: '#D4D3D0' }}>•</span>
                                                <span style={{ fontSize: 10, color: '#9B9A97' }}>via {lead.source}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        {/* Heat Indicator */}
                                        <div style={{
                                            padding: '4px 10px', borderRadius: 10, fontSize: 9, fontWeight: 700,
                                            background: heatCfg.glow, color: heatCfg.border, textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}>
                                            {heatCfg.label}
                                        </div>

                                        {/* Next Action */}
                                        <div style={{ textAlign: 'right', maxWidth: 160 }}>
                                            <div style={{ fontSize: 8, fontWeight: 700, color: '#EA580C', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next</div>
                                            <div style={{ fontSize: 11, color: '#37352F', fontWeight: 500 }}>{lead.nextAction}</div>
                                        </div>

                                        {/* Last Contact */}
                                        <div style={{ textAlign: 'right', minWidth: 60 }}>
                                            <div style={{ fontSize: 8, fontWeight: 700, color: '#D4D3D0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Last</div>
                                            <div style={{ fontSize: 11, color: '#9B9A97' }}>{lead.lastContact}</div>
                                        </div>

                                        {/* Quick Actions (visible on hover) */}
                                        <div style={{
                                            display: 'flex', gap: 4,
                                            opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: isHovered ? 'auto' : 'none',
                                        }}>
                                            {[
                                                { icon: Phone, color: '#22C55E', bg: '#F0FDF4', label: 'Call' },
                                                { icon: Mail, color: '#3B82F6', bg: '#EFF6FF', label: 'Email' },
                                                { icon: MessageCircle, color: '#8B5CF6', bg: '#F5F3FF', label: 'Chat' },
                                            ].map(act => (
                                                <button key={act.label} onClick={e => e.stopPropagation()} style={{
                                                    width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
                                                    background: act.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'transform 0.15s',
                                                }}
                                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
                                                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                                >
                                                    <act.icon style={{ width: 13, height: 13, color: act.color }} />
                                                </button>
                                            ))}
                                            <button onClick={async (e) => {
                                                e.stopPropagation();
                                                const budgetNum = parseFloat(lead.budgetRange.replace(/[^0-9.]/g, '')) || undefined;
                                                const project = await createProject({
                                                    client_name: lead.name,
                                                    client_phone: lead.phone,
                                                    property_type: lead.propertyType,
                                                    property_address: lead.location,
                                                    budget_min: budgetNum,
                                                    status: 'lead',
                                                });
                                                if (project) {
                                                    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'QUOTING' as LeadStatus, nextAction: 'Project created', score: 60 } : l));
                                                }
                                            }} style={{
                                                width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
                                                background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'transform 0.15s',
                                            }}
                                                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
                                                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                            >
                                                <FolderPlus style={{ width: 13, height: 13, color: '#6366F1' }} />
                                            </button>
                                        </div>

                                        <ChevronRight style={{
                                            width: 14, height: 14, color: '#D4D3D0',
                                            transition: 'transform 0.2s, color 0.2s',
                                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                                            ...(isHovered ? { color: '#9B9A97' } : {}),
                                        }} />
                                    </div>
                                </div>

                                {/* Expanded Detail Panel */}
                                {isExpanded && (
                                    <div style={{
                                        borderTop: '1px solid #F5F5F4', padding: '14px 18px', background: '#FAFAF9',
                                        animation: 'slide-in 0.2s ease',
                                    }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                                            {/* Activity Timeline */}
                                            <div style={{ background: 'white', borderRadius: 10, padding: 14, border: '1px solid #E9E9E7' }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Activity</div>
                                                {['Enquiry received', 'Auto-reply sent', 'Bjorn assigned', 'First call made', 'Portfolio sent'].slice(0, lead.touchpoints || 3).map((act, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === 0 ? statusCfg.glow : '#E9E9E7', flexShrink: 0 }} />
                                                        <span style={{ fontSize: 10, color: i === 0 ? '#37352F' : '#9B9A97' }}>{act}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Lead Score Breakdown */}
                                            <div style={{ background: 'white', borderRadius: 10, padding: 14, border: '1px solid #E9E9E7' }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Score Breakdown</div>
                                                {[
                                                    { label: 'Budget Match', val: 80 },
                                                    { label: 'Engagement', val: score },
                                                    { label: 'Timeline Fit', val: 65 },
                                                    { label: 'Response Speed', val: 90 },
                                                ].map(s => (
                                                    <div key={s.label} style={{ marginBottom: 6 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                                            <span style={{ fontSize: 9, color: '#6B6A67' }}>{s.label}</span>
                                                            <span style={{ fontSize: 9, fontWeight: 700, color: '#37352F' }}>{s.val}</span>
                                                        </div>
                                                        <div style={{ height: 4, background: '#F5F5F4', borderRadius: 2, overflow: 'hidden' }}>
                                                            <div style={{
                                                                height: '100%', borderRadius: 2,
                                                                background: s.val > 70 ? '#22C55E' : s.val > 40 ? '#F59E0B' : '#EF4444',
                                                                width: `${s.val}%`, animation: 'score-fill 0.6s ease',
                                                            }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Quick Stats */}
                                            <div style={{ background: 'white', borderRadius: 10, padding: 14, border: '1px solid #E9E9E7' }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Quick Stats</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                                    {[
                                                        { label: 'Touchpoints', value: lead.touchpoints || 0, icon: '' },
                                                        { label: 'Days In', value: lead.daysInPipeline || 0, icon: '' },
                                                        { label: 'Budget', value: lead.budgetRange, icon: '' },
                                                        { label: 'Source', value: lead.source, icon: '' },
                                                    ].map(s => (
                                                        <div key={s.label} style={{ padding: '6px 8px', background: '#FAFAF9', borderRadius: 8 }}>
                                                            <div style={{ fontSize: 9, color: '#9B9A97' }}>{s.icon} {s.label}</div>
                                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>{s.value}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div style={{ background: 'white', borderRadius: 10, padding: 14, border: '1px solid #E9E9E7' }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Actions</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                    {[
                                                        { label: 'Schedule Site Visit', bg: '#F5F3FF', color: '#7C3AED' },
                                                        { label: 'Send Quotation', bg: '#FFF7ED', color: '#EA580C' },
                                                        { label: 'Open in Sequence', bg: '#EFF6FF', color: '#2563EB' },
                                                        { label: 'Convert to Project', bg: '#F0FDF4', color: '#16A34A' },
                                                    ].map(a => (
                                                        <button key={a.label} onClick={e => e.stopPropagation()} style={{
                                                            padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                                            background: a.bg, color: a.color, fontSize: 10, fontWeight: 600,
                                                            fontFamily: f, textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                            transition: 'transform 0.15s',
                                                        }}
                                                            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                                                            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                                        >
                                                            {a.label}
                                                            <ArrowUpRight style={{ width: 12, height: 12 }} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
