'use client';

import React, { useState } from 'react';
import RoofNav from '@/components/RoofNav';
import { TrendingUp, Users, Eye, MousePointer, DollarSign, BarChart3, Target, Megaphone, ArrowUpRight, Calendar, Filter, Plus, ExternalLink, MessageSquare, Heart, Share2, Video, Scissors, CheckCircle2, Clock, UserCheck } from 'lucide-react';

// ============================================================
// MARKETING — Campaign Management + Analytics Dashboard
// ============================================================

type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft';
type Tab = 'overview' | 'campaigns' | 'content' | 'production';

interface Campaign {
    id: string;
    name: string;
    platform: string;
    status: CampaignStatus;
    budget: number;
    spent: number;
    impressions: number;
    clicks: number;
    leads: number;
    cpl: number;
    startDate: string;
    endDate: string;
}

const STATUS_CFG: Record<CampaignStatus, { color: string; bg: string }> = {
    active: { color: '#22C55E', bg: '#F0FDF4' },
    paused: { color: '#F59E0B', bg: '#FEF9C3' },
    completed: { color: '#6B6A67', bg: '#F7F6F3' },
    draft: { color: '#9B9A97', bg: '#FAFAF9' },
};

const PLATFORM_CFG: Record<string, { color: string; bg: string }> = {
    'Google Ads': { color: '#4285F4', bg: '#EFF6FF' },
    'Meta Ads': { color: '#1877F2', bg: '#EFF6FF' },
    'Instagram': { color: '#E4405F', bg: '#FDF2F8' },
    'Qanvast': { color: '#37352F', bg: '#F7F6F3' },
    'Carousell': { color: '#D73B0E', bg: '#FEF2F2' },
    'TikTok': { color: '#000000', bg: '#F7F6F3' },
};

const DEMO_CAMPAIGNS: Campaign[] = [
    { id: 'C1', name: 'HDB Reno Lead Gen', platform: 'Google Ads', status: 'active', budget: 2000, spent: 1420, impressions: 45000, clicks: 890, leads: 24, cpl: 59, startDate: '2026-02-15', endDate: '2026-03-15' },
    { id: 'C2', name: 'Portfolio Showcase', platform: 'Instagram', status: 'active', budget: 800, spent: 520, impressions: 32000, clicks: 1200, leads: 8, cpl: 65, startDate: '2026-02-20', endDate: '2026-03-20' },
    { id: 'C3', name: 'Condo Reno — Bukit Timah', platform: 'Meta Ads', status: 'active', budget: 1500, spent: 980, impressions: 28000, clicks: 640, leads: 15, cpl: 65, startDate: '2026-03-01', endDate: '2026-03-31' },
    { id: 'C4', name: 'Qanvast Premium Listing', platform: 'Qanvast', status: 'active', budget: 500, spent: 500, impressions: 15000, clicks: 420, leads: 12, cpl: 42, startDate: '2026-03-01', endDate: '2026-03-31' },
    { id: 'C5', name: 'BTO Kitchen Ideas (Video)', platform: 'TikTok', status: 'paused', budget: 600, spent: 310, impressions: 85000, clicks: 2100, leads: 5, cpl: 62, startDate: '2026-02-10', endDate: '2026-03-10' },
    { id: 'C6', name: 'Landing Reno Services', platform: 'Carousell', status: 'completed', budget: 400, spent: 400, impressions: 12000, clicks: 380, leads: 9, cpl: 44, startDate: '2026-01-15', endDate: '2026-02-15' },
];

const CONTENT_CALENDAR = [
    { day: 'Mon', type: 'Reel', title: 'Kitchen before/after reveal', platform: 'Instagram', status: 'published', views: 12400, likes: 890, comments: 45, shares: 62 },
    { day: 'Tue', type: 'Post', title: 'Material sourcing tips', platform: 'Instagram', status: 'published', views: 6200, likes: 420, comments: 28, shares: 15 },
    { day: 'Wed', type: 'Blog', title: 'HDB reno guide 2026', platform: 'Website', status: 'scheduled', views: 0, likes: 0, comments: 0, shares: 0 },
    { day: 'Thu', type: 'Video', title: 'Site visit walkthrough', platform: 'TikTok', status: 'scheduled', views: 0, likes: 0, comments: 0, shares: 0 },
    { day: 'Fri', type: 'Story', title: 'Tile selection at Hafary', platform: 'Instagram', status: 'draft', views: 0, likes: 0, comments: 0, shares: 0 },
    { day: 'Sat', type: 'Carousel', title: 'Top 5 SG reno mistakes', platform: 'Instagram', status: 'draft', views: 0, likes: 0, comments: 0, shares: 0 },
];

type ProdStage = 'concept' | 'shoot' | 'editing' | 'review' | 'approved';
const PROD_STAGE_CFG: Record<ProdStage, { color: string; bg: string; label: string }> = {
    concept: { color: '#9B9A97', bg: '#FAFAF9', label: 'Concept' },
    shoot: { color: '#F59E0B', bg: '#FEF9C3', label: 'Shoot' },
    editing: { color: '#7C3AED', bg: '#F5F3FF', label: 'Editing' },
    review: { color: '#3B82F6', bg: '#EFF6FF', label: 'Review' },
    approved: { color: '#22C55E', bg: '#F0FDF4', label: 'Approved' },
};

const PRODUCTION_ITEMS = [
    { id: 'P1', title: 'Tan Residence Kitchen Reveal', type: 'Reel', stage: 'approved' as ProdStage, assignee: 'Jenny', outsourced: false, dueDate: '03-08', notes: 'Client approved the final cut. Ready to post Monday.' },
    { id: 'P2', title: 'Site Visit Walkthrough — Lim BTO', type: 'Video', stage: 'editing' as ProdStage, assignee: 'Alex', outsourced: false, dueDate: '03-10', notes: 'Raw footage shot Tuesday. Need to add captions and music.' },
    { id: 'P3', title: '5 Common Reno Mistakes Carousel', type: 'Carousel', stage: 'concept' as ProdStage, assignee: 'Jenny', outsourced: false, dueDate: '03-13', notes: 'Need to finalize copy for each slide.' },
    { id: 'P4', title: 'Brand Intro Video (60s)', type: 'Video', stage: 'shoot' as ProdStage, assignee: 'External — Ray Studios', outsourced: true, dueDate: '03-12', notes: 'Shoot scheduled at studio on Thu. Storyboard finalized.' },
    { id: 'P5', title: 'Hafary Tile Showroom Visit', type: 'Story', stage: 'shoot' as ProdStage, assignee: 'Jenny', outsourced: false, dueDate: '03-09', notes: 'Capture BTS at Hafary during the showroom visit.' },
    { id: 'P6', title: 'Client Testimonial — Wong Family', type: 'Video', stage: 'review' as ProdStage, assignee: 'External — Jay Edits', outsourced: true, dueDate: '03-11', notes: 'First cut received. Bjorn to review before approval.' },
    { id: 'P7', title: 'Material Sourcing Tips Pt. 2', type: 'Post', stage: 'concept' as ProdStage, assignee: 'Michelle', outsourced: false, dueDate: '03-15', notes: 'Research popular materials for Q2 2026 trends.' },
    { id: 'P8', title: 'BTO Kitchen Ideas Short', type: 'Video', stage: 'editing' as ProdStage, assignee: 'External — Ray Studios', outsourced: true, dueDate: '03-14', notes: 'Shot last week. Waiting for first cut from vendor.' },
];

export default function MarketingPage() {
    const [tab, setTab] = useState<Tab>('overview');
    const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const totalBudget = DEMO_CAMPAIGNS.reduce((s, c) => s + c.budget, 0);
    const totalSpent = DEMO_CAMPAIGNS.reduce((s, c) => s + c.spent, 0);
    const totalLeads = DEMO_CAMPAIGNS.reduce((s, c) => s + c.leads, 0);
    const totalImpressions = DEMO_CAMPAIGNS.reduce((s, c) => s + c.impressions, 0);
    const totalClicks = DEMO_CAMPAIGNS.reduce((s, c) => s + c.clicks, 0);
    const avgCpl = totalLeads > 0 ? Math.round(totalSpent / totalLeads) : 0;
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;

    const filtered = statusFilter === 'all' ? DEMO_CAMPAIGNS : DEMO_CAMPAIGNS.filter(c => c.status === statusFilter);

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            <RoofNav />
            <div style={{ padding: '20px 32px 80px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#37352F', margin: '0 0 4px' }}>Marketing</h1>
                        <p style={{ fontSize: 12, color: '#9B9A97', margin: 0 }}>Campaign performance, content calendar, lead generation</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {(['overview', 'campaigns', 'content', 'production'] as Tab[]).map(t => (
                            <button key={t} onClick={() => setTab(t)} style={{
                                padding: '8px 16px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none',
                                background: tab === t ? '#37352F' : '#F7F6F3', color: tab === t ? 'white' : '#6B6A67',
                                cursor: 'pointer', fontFamily: f, textTransform: 'capitalize',
                            }}>{t}</button>
                        ))}
                    </div>
                </div>

                {tab === 'overview' && (
                    <>
                        {/* Summary Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 20 }}>
                            {[
                                { label: 'Total Spend', value: `$${totalSpent.toLocaleString()}`, sub: `of $${totalBudget.toLocaleString()} budget`, color: '#37352F', bg: 'white', icon: DollarSign },
                                { label: 'Leads Generated', value: totalLeads, sub: 'this period', color: '#22C55E', bg: '#F0FDF4', icon: Users },
                                { label: 'Cost / Lead', value: `$${avgCpl}`, sub: 'avg across campaigns', color: '#3B82F6', bg: '#EFF6FF', icon: Target },
                                { label: 'Impressions', value: `${(totalImpressions / 1000).toFixed(0)}k`, sub: 'total reach', color: '#7C3AED', bg: '#F5F3FF', icon: Eye },
                                { label: 'Clicks', value: totalClicks.toLocaleString(), sub: `${ctr.toFixed(1)}% CTR`, color: '#F59E0B', bg: '#FEF9C3', icon: MousePointer },
                                { label: 'Active Campaigns', value: DEMO_CAMPAIGNS.filter(c => c.status === 'active').length, sub: `of ${DEMO_CAMPAIGNS.length} total`, color: '#EC4899', bg: '#FDF2F8', icon: Megaphone },
                            ].map(s => (
                                <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: 16, border: '1px solid rgba(0,0,0,0.04)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <s.icon style={{ width: 16, height: 16, color: s.color }} />
                                    </div>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                                    <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', marginTop: 4, textTransform: 'uppercase' }}>{s.label}</div>
                                    <div style={{ fontSize: 9, color: '#D4D3D0', marginTop: 2 }}>{s.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Spend by Platform */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', padding: 16 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Spend by Platform</div>
                                {Object.entries(
                                    DEMO_CAMPAIGNS.reduce((acc, c) => {
                                        acc[c.platform] = (acc[c.platform] || 0) + c.spent;
                                        return acc;
                                    }, {} as Record<string, number>)
                                ).sort(([, a], [, b]) => b - a).map(([platform, spent]) => {
                                    const pcfg = PLATFORM_CFG[platform] || { color: '#6B6A67', bg: '#F7F6F3' };
                                    const pct = totalSpent > 0 ? (spent / totalSpent * 100) : 0;
                                    return (
                                        <div key={platform} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <span style={{ fontSize: 10, width: 100, color: '#37352F', fontWeight: 600 }}>{platform}</span>
                                            <div style={{ flex: 1, height: 8, background: '#F5F5F4', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', borderRadius: 4, background: pcfg.color, width: `${pct}%`, transition: 'width 0.5s' }} />
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: '#37352F', width: 60, textAlign: 'right' }}>${spent.toLocaleString()}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', padding: 16 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Leads by Platform</div>
                                {Object.entries(
                                    DEMO_CAMPAIGNS.reduce((acc, c) => {
                                        acc[c.platform] = (acc[c.platform] || 0) + c.leads;
                                        return acc;
                                    }, {} as Record<string, number>)
                                ).sort(([, a], [, b]) => b - a).map(([platform, leads]) => {
                                    const pcfg = PLATFORM_CFG[platform] || { color: '#6B6A67', bg: '#F7F6F3' };
                                    const pct = totalLeads > 0 ? (leads / totalLeads * 100) : 0;
                                    return (
                                        <div key={platform} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <span style={{ fontSize: 10, width: 100, color: '#37352F', fontWeight: 600 }}>{platform}</span>
                                            <div style={{ flex: 1, height: 8, background: '#F5F5F4', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', borderRadius: 4, background: pcfg.color, width: `${pct}%`, transition: 'width 0.5s' }} />
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: '#37352F', width: 40, textAlign: 'right' }}>{leads}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {tab === 'campaigns' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {(['all', 'active', 'paused', 'completed', 'draft'] as const).map(s => (
                                    <button key={s} onClick={() => setStatusFilter(s)} style={{
                                        padding: '5px 12px', fontSize: 10, fontWeight: 600, borderRadius: 6,
                                        border: statusFilter === s ? '1px solid #37352F' : '1px solid #E9E9E7',
                                        background: statusFilter === s ? '#37352F' : 'white',
                                        color: statusFilter === s ? 'white' : '#6B6A67',
                                        cursor: 'pointer', fontFamily: f, textTransform: 'capitalize',
                                    }}>{s}</button>
                                ))}
                            </div>
                            <button style={{
                                padding: '8px 16px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none',
                                background: '#37352F', color: 'white', cursor: 'pointer', fontFamily: f,
                                display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                                <Plus style={{ width: 12, height: 12 }} /> New Campaign
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {filtered.map(c => {
                                const sCfg = STATUS_CFG[c.status];
                                const pCfg = PLATFORM_CFG[c.platform] || { color: '#6B6A67', bg: '#F7F6F3' };
                                const budgetPct = c.budget > 0 ? (c.spent / c.budget * 100) : 0;
                                return (
                                    <div key={c.id} style={{
                                        background: 'white', borderRadius: 12, padding: 18, border: '1px solid #E9E9E7',
                                        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px', alignItems: 'center', gap: 16,
                                        cursor: 'pointer', transition: 'box-shadow 0.2s',
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)')}
                                        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                <span style={{ fontSize: 14, fontWeight: 700, color: '#37352F' }}>{c.name}</span>
                                                <span style={{ fontSize: 8, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: sCfg.bg, color: sCfg.color, textTransform: 'uppercase' }}>{c.status}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ fontSize: 8, padding: '2px 8px', borderRadius: 6, fontWeight: 700, background: pCfg.bg, color: pCfg.color }}>{c.platform}</span>
                                                <span style={{ fontSize: 9, color: '#9B9A97' }}>{c.startDate.slice(5)} to {c.endDate.slice(5)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 9, color: '#9B9A97', marginBottom: 2, textTransform: 'uppercase' }}>Spend</div>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: '#37352F' }}>${c.spent.toLocaleString()}</div>
                                            <div style={{ height: 3, background: '#F5F5F4', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', borderRadius: 2, background: budgetPct > 90 ? '#DC2626' : '#22C55E', width: `${budgetPct}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 9, color: '#9B9A97', marginBottom: 2, textTransform: 'uppercase' }}>Impressions</div>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: '#7C3AED' }}>{(c.impressions / 1000).toFixed(0)}k</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 9, color: '#9B9A97', marginBottom: 2, textTransform: 'uppercase' }}>Leads</div>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: '#22C55E' }}>{c.leads}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 9, color: '#9B9A97', marginBottom: 2, textTransform: 'uppercase' }}>CPL</div>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: c.cpl < 50 ? '#22C55E' : c.cpl < 65 ? '#F59E0B' : '#DC2626' }}>${c.cpl}</div>
                                        </div>
                                        <button style={{ padding: '6px 12px', fontSize: 10, fontWeight: 600, borderRadius: 6, border: '1px solid #E9E9E7', background: 'white', cursor: 'pointer', fontFamily: f, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <ExternalLink style={{ width: 10, height: 10 }} /> View
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {tab === 'content' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#37352F' }}>This Week&apos;s Content Calendar</div>
                            <button style={{
                                padding: '8px 16px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none',
                                background: '#37352F', color: 'white', cursor: 'pointer', fontFamily: f,
                                display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                                <Plus style={{ width: 12, height: 12 }} /> Add Content
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
                            {CONTENT_CALENDAR.map((item, idx) => {
                                const statusColors = { published: '#22C55E', scheduled: '#3B82F6', draft: '#9B9A97' };
                                const color = statusColors[item.status as keyof typeof statusColors] || '#9B9A97';
                                return (
                                    <div key={idx} style={{
                                        background: 'white', borderRadius: 12, padding: 16, border: '1px solid #E9E9E7',
                                        borderTop: `3px solid ${color}`, cursor: 'pointer', transition: 'all 0.2s',
                                        minHeight: 180, display: 'flex', flexDirection: 'column',
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)')}
                                        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                            <span style={{ fontSize: 13, fontWeight: 800, color: '#37352F' }}>{item.day}</span>
                                            <span style={{ fontSize: 8, padding: '2px 8px', borderRadius: 10, fontWeight: 700, color, background: `${color}15`, textTransform: 'uppercase' }}>{item.status}</span>
                                        </div>
                                        <span style={{ fontSize: 8, padding: '2px 8px', borderRadius: 6, fontWeight: 700, background: '#F7F6F3', color: '#6B6A67', display: 'inline-block', marginBottom: 8, width: 'fit-content' }}>{item.type}</span>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: '#37352F', margin: 0, flex: 1, lineHeight: 1.4 }}>{item.title}</p>
                                        <div style={{ marginTop: 8 }}>
                                            <span style={{ fontSize: 9, color: '#9B9A97' }}>{item.platform}</span>
                                        </div>
                                        {item.status === 'published' && (
                                            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #F5F5F4', display: 'flex', gap: 10 }}>
                                                <span style={{ fontSize: 9, color: '#6B6A67', display: 'flex', alignItems: 'center', gap: 3 }}>
                                                    <Eye style={{ width: 9, height: 9 }} /> {item.views >= 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views}
                                                </span>
                                                <span style={{ fontSize: 9, color: '#EC4899', display: 'flex', alignItems: 'center', gap: 3 }}>
                                                    <Heart style={{ width: 9, height: 9 }} /> {item.likes}
                                                </span>
                                                <span style={{ fontSize: 9, color: '#3B82F6', display: 'flex', alignItems: 'center', gap: 3 }}>
                                                    <MessageSquare style={{ width: 9, height: 9 }} /> {item.comments}
                                                </span>
                                                <span style={{ fontSize: 9, color: '#22C55E', display: 'flex', alignItems: 'center', gap: 3 }}>
                                                    <Share2 style={{ width: 9, height: 9 }} /> {item.shares}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {tab === 'production' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#37352F' }}>Production Pipeline</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <span style={{ fontSize: 10, color: '#9B9A97', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <UserCheck style={{ width: 11, height: 11 }} /> {PRODUCTION_ITEMS.filter(p => p.outsourced).length} outsourced
                                </span>
                                <button style={{
                                    padding: '8px 16px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none',
                                    background: '#37352F', color: 'white', cursor: 'pointer', fontFamily: f,
                                    display: 'flex', alignItems: 'center', gap: 4,
                                }}>
                                    <Plus style={{ width: 12, height: 12 }} /> New Production
                                </button>
                            </div>
                        </div>

                        {/* Kanban Columns */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                            {(Object.keys(PROD_STAGE_CFG) as ProdStage[]).map(stage => {
                                const cfg = PROD_STAGE_CFG[stage];
                                const items = PRODUCTION_ITEMS.filter(p => p.stage === stage);
                                return (
                                    <div key={stage}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 4px' }}>
                                            <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cfg.label}</span>
                                            <span style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', background: '#F7F6F3', padding: '1px 6px', borderRadius: 8 }}>{items.length}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 200 }}>
                                            {items.map(item => (
                                                <div key={item.id} style={{
                                                    background: 'white', borderRadius: 10, padding: 12, border: '1px solid #E9E9E7',
                                                    borderLeft: `3px solid ${cfg.color}`, cursor: 'pointer', transition: 'all 0.2s',
                                                }}
                                                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)')}
                                                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                                        <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, fontWeight: 700, background: '#F7F6F3', color: '#6B6A67' }}>{item.type}</span>
                                                        {item.outsourced && (
                                                            <span style={{ fontSize: 7, padding: '2px 6px', borderRadius: 4, fontWeight: 700, background: '#FEF9C3', color: '#F59E0B' }}>OUTSOURCED</span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#37352F', marginBottom: 4, lineHeight: 1.3 }}>{item.title}</div>
                                                    <p style={{ fontSize: 9, color: '#9B9A97', margin: '0 0 8px', lineHeight: 1.4 }}>{item.notes}</p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: 9, color: '#6B6A67', display: 'flex', alignItems: 'center', gap: 3 }}>
                                                            <Clock style={{ width: 9, height: 9 }} /> {item.dueDate}
                                                        </span>
                                                        <span style={{ fontSize: 9, fontWeight: 600, color: item.outsourced ? '#F59E0B' : '#6B6A67' }}>{item.assignee.length > 12 ? item.assignee.split(' ').pop() : item.assignee}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
