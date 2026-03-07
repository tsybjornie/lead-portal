'use client';

import Link from 'next/link';
import { useState } from 'react';
import RoofNav from '@/components/RoofNav';

/* ── Seed data (Bjorn's real network) ── */
const FIRMS = [
    { id: 1, name: 'Multiply Carpentry', owner: 'Bjorn', market: 'SG', type: 'Designer', tier: 'Founding', status: 'Active', projects: 3, gmv: 126000, joined: '2026-01-15', color: '#059669' },
    { id: 2, name: 'Bjorn JB Studio', owner: 'Bjorn', market: 'MY', type: 'Designer', tier: 'Founding', status: 'Active', projects: 2, gmv: 45000, joined: '2026-01-15', color: '#2563EB' },
    { id: 3, name: 'Cubic Deco', owner: 'Uncle', market: 'SG', type: 'Contractor', tier: 'Founding', status: 'Active', projects: 4, gmv: 88000, joined: '2026-02-01', color: '#8B5CF6' },
    { id: 4, name: 'Glass Vision Pte Ltd', owner: 'Cousin', market: 'SG', type: 'Contractor', tier: 'Founding', status: 'Active', projects: 1, gmv: 22000, joined: '2026-02-10', color: '#D97706' },
    { id: 5, name: 'Metalliqx', owner: 'Allen (Mentor)', market: 'SG', type: 'Vendor', tier: 'Founding', status: 'Active', projects: 0, gmv: 15000, joined: '2026-02-15', color: '#DC2626' },
];

const HOMEOWNERS = [
    { id: 1, name: 'Sarah Tan', property: '4-Room BTO', location: 'Tampines N9', status: 'Matched', matchedFirm: 'Multiply Carpentry', budget: 45000 },
    { id: 2, name: 'Ahmad Rahman', property: '5-Room HDB', location: 'Woodlands', status: 'Pending', matchedFirm: '—', budget: 55000 },
    { id: 3, name: 'Lim Wei Ming', property: 'Condo 1,200sqft', location: 'Punggol', status: 'Matched', matchedFirm: 'Cubic Deco', budget: 80000 },
    { id: 4, name: 'Nurul Aisyah', property: 'Landed Terrace', location: 'Iskandar Puteri', status: 'Matched', matchedFirm: 'Bjorn JB Studio', budget: 120000 },
];

const WORKERS = [
    { id: 1, name: 'Raj Kumar', trade: 'Tiling', irs: 920, market: 'SG', jobs: 47, color: '#059669' },
    { id: 2, name: 'Ali bin Hassan', trade: 'Carpentry', irs: 780, market: 'MY', jobs: 32, color: '#2563EB' },
    { id: 3, name: 'Tan Ah Kow', trade: 'Electrical', irs: 650, market: 'SG', jobs: 21, color: '#D97706' },
    { id: 4, name: 'Muthu', trade: 'Painting', irs: 545, market: 'MY', jobs: 15, color: '#8B5CF6' },
    { id: 5, name: 'Jason Lee', trade: 'Plumbing', irs: 320, market: 'SG', jobs: 5, color: '#9B9A97' },
];

function irsTier(score: number) {
    if (score >= 900) return { label: 'Elite', color: '#059669' };
    if (score >= 700) return { label: 'Trusted', color: '#2563EB' };
    if (score >= 500) return { label: 'Established', color: '#D97706' };
    if (score >= 300) return { label: 'Building', color: '#9B9A97' };
    return { label: 'New', color: '#DC2626' };
}

export default function AdminDashboard() {
    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";
    const [tab, setTab] = useState<'overview' | 'firms' | 'homeowners' | 'workers'>('overview');

    const totalGMV = FIRMS.reduce((s, f) => s + f.gmv, 0);
    const escrowRevenue = Math.round(totalGMV * 0.02);
    const commissionRevenue = Math.round(totalGMV * 0.015);

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'firms', label: `Firms (${FIRMS.length})` },
        { key: 'homeowners', label: `Homeowners (${HOMEOWNERS.length})` },
        { key: 'workers', label: `Workers (${WORKERS.length})` },
    ];

    const cardStyle = {
        background: 'white', borderRadius: 12, padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    };
    const thStyle = {
        padding: '10px 14px', textAlign: 'left' as const, fontSize: 9, fontWeight: 600 as const,
        color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase' as const, letterSpacing: '0.1em',
        fontFamily: mono,
    };
    const tdStyle = { padding: '10px 14px', fontSize: 12, color: 'rgba(0,0,0,0.6)' };
    const badge = (text: string, color: string) => ({
        padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600 as const,
        background: `${color}12`, color, display: 'inline-block' as const,
    });

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <RoofNav />

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 48px' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 12 }}>PLATFORM OVERVIEW</div>
                    <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 4px', color: '#111' }}>
                        Roof <span style={{ color: 'rgba(0,0,0,0.2)', fontStyle: 'italic' }}>Admin</span>
                    </h1>
                    <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', margin: 0 }}>Bjorn — Multiply Carpentry</p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key as typeof tab)} style={{
                            padding: '10px 16px', fontSize: 11, fontWeight: 500, border: 'none', cursor: 'pointer',
                            background: 'transparent', fontFamily: mono,
                            color: tab === t.key ? '#111' : 'rgba(0,0,0,0.35)',
                            borderBottom: tab === t.key ? '2px solid #111' : '2px solid transparent',
                            transition: 'all 0.15s', letterSpacing: '0.02em',
                        }}>{t.label}</button>
                    ))}
                </div>

                {tab === 'overview' && (
                    <>
                        {/* KPI Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
                            {[
                                { label: 'Total GMV', value: `S$${(totalGMV / 1000).toFixed(0)}k`, sub: 'All-time', color: '#059669' },
                                { label: 'Active Firms', value: `${FIRMS.length}/20`, sub: 'slots', color: '#2563EB' },
                                { label: 'Homeowner Leads', value: `${HOMEOWNERS.length}`, sub: `${HOMEOWNERS.filter(h => h.status === 'Matched').length} matched`, color: '#D97706' },
                                { label: 'Est. Platform Revenue', value: `S$${((escrowRevenue + commissionRevenue) / 1000).toFixed(1)}k`, sub: 'Escrow + commission', color: '#8B5CF6' },
                            ].map(kpi => (
                                <div key={kpi.label} style={cardStyle}>
                                    <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase' as const, letterSpacing: '0.12em', marginBottom: 8 }}>{kpi.label}</div>
                                    <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, letterSpacing: '-0.02em' }}>{kpi.value}</div>
                                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)', marginTop: 4 }}>{kpi.sub}</div>
                                </div>
                            ))}
                        </div>



                        {/* Revenue Breakdown */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div style={cardStyle}>
                                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 14 }}>REVENUE BY SOURCE</div>
                                {[
                                    { label: 'Escrow fees (2% GMV)', value: `S$${escrowRevenue.toLocaleString()}`, active: true },
                                    { label: 'Commission (blended 1.5%)', value: `S$${commissionRevenue.toLocaleString()}`, active: true },
                                    { label: 'Setup fees', value: 'S$0', active: false },
                                    { label: 'SaaS', value: 'S$0', active: false },
                                ].map(r => (
                                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>{r.label}</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: r.active ? '#059669' : 'rgba(0,0,0,0.15)' }}>{r.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={cardStyle}>
                                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 14 }}>GMV BY MARKET</div>
                                {[
                                    { label: 'Singapore', value: `S$${FIRMS.filter(f => f.market === 'SG').reduce((s, f) => s + f.gmv, 0).toLocaleString()}` },
                                    { label: 'Johor Bahru', value: `S$${FIRMS.filter(f => f.market === 'MY').reduce((s, f) => s + f.gmv, 0).toLocaleString()}` },
                                ].map(m => (
                                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>{m.label}</span>
                                        <span style={{ fontSize: 14, fontWeight: 600 }}>{m.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {tab === 'firms' && (
                    <div style={{ ...cardStyle, overflow: 'hidden', padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                                    {['Firm', 'Owner', 'Market', 'Type', 'Tier', 'Projects', 'GMV', 'Status'].map(h => (
                                        <th key={h} style={thStyle}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {FIRMS.map(firm => (
                                    <tr key={firm.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                        <td style={{ ...tdStyle, fontWeight: 600, color: '#111' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 8, background: firm.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>{firm.name.charAt(0)}</div>
                                                {firm.name}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>{firm.owner}</td>
                                        <td style={tdStyle}><span style={badge(firm.market, firm.market === 'SG' ? '#2563EB' : '#D97706')}>{firm.market}</span></td>
                                        <td style={tdStyle}>{firm.type}</td>
                                        <td style={tdStyle}><span style={badge(firm.tier, '#059669')}>{firm.tier}</span></td>
                                        <td style={tdStyle}>{firm.projects}</td>
                                        <td style={{ ...tdStyle, fontWeight: 600, color: '#111' }}>S${firm.gmv.toLocaleString()}</td>
                                        <td style={tdStyle}>
                                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block', marginRight: 6 }}></span>
                                            {firm.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'homeowners' && (
                    <div style={{ ...cardStyle, overflow: 'hidden', padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                                    {['Name', 'Property', 'Location', 'Budget', 'Status', 'Matched Firm'].map(h => (
                                        <th key={h} style={thStyle}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {HOMEOWNERS.map(ho => (
                                    <tr key={ho.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                        <td style={{ ...tdStyle, fontWeight: 600, color: '#111' }}>{ho.name}</td>
                                        <td style={tdStyle}>{ho.property}</td>
                                        <td style={tdStyle}>{ho.location}</td>
                                        <td style={{ ...tdStyle, fontWeight: 600, color: '#111' }}>S${ho.budget.toLocaleString()}</td>
                                        <td style={tdStyle}><span style={badge(ho.status, ho.status === 'Matched' ? '#059669' : '#D97706')}>{ho.status}</span></td>
                                        <td style={{ ...tdStyle, color: ho.matchedFirm === '—' ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.6)' }}>{ho.matchedFirm}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'workers' && (
                    <div style={{ ...cardStyle, overflow: 'hidden', padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                                    {['Worker', 'Trade', 'IRS', 'Tier', 'Market', 'Jobs'].map(h => (
                                        <th key={h} style={thStyle}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {WORKERS.map(w => {
                                    const tier = irsTier(w.irs);
                                    return (
                                        <tr key={w.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                            <td style={{ ...tdStyle, fontWeight: 600, color: '#111' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>{w.name.charAt(0)}</div>
                                                    {w.name}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>{w.trade}</td>
                                            <td style={{ ...tdStyle, fontWeight: 700, color: tier.color }}>{w.irs}</td>
                                            <td style={tdStyle}><span style={badge(tier.label, tier.color)}>{tier.label}</span></td>
                                            <td style={tdStyle}><span style={badge(w.market, w.market === 'SG' ? '#2563EB' : '#D97706')}>{w.market}</span></td>
                                            <td style={tdStyle}>{w.jobs}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}


            </div>

            {/* Footer */}
            <footer style={{ padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>© 2026 ROOF · ADMIN</span>
            </footer>
        </div>
    );
}
