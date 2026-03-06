'use client';

import { useState } from 'react';

/* ── Seed data (Bjorn's real network) ── */
const FIRMS = [
    { id: 1, name: 'Multiply Carpentry', owner: 'Bjorn', market: 'SG', type: 'Designer', tier: 'Founding', status: 'Active', projects: 3, gmv: 126000, joined: '2026-01-15' },
    { id: 2, name: 'Bjorn JB Studio', owner: 'Bjorn', market: 'MY', type: 'Designer', tier: 'Founding', status: 'Active', projects: 2, gmv: 45000, joined: '2026-01-15' },
    { id: 3, name: 'Cubic Deco', owner: 'Uncle', market: 'SG', type: 'Contractor', tier: 'Founding', status: 'Active', projects: 4, gmv: 88000, joined: '2026-02-01' },
    { id: 4, name: 'Glass Vision Pte Ltd', owner: 'Cousin', market: 'SG', type: 'Contractor', tier: 'Founding', status: 'Active', projects: 1, gmv: 22000, joined: '2026-02-10' },
    { id: 5, name: 'Metalliqx', owner: 'Allen (Mentor)', market: 'SG', type: 'Vendor', tier: 'Founding', status: 'Active', projects: 0, gmv: 15000, joined: '2026-02-15' },
];

const HOMEOWNERS = [
    { id: 1, name: 'Sarah Tan', property: '4-Room BTO', location: 'Tampines N9', status: 'Matched', matchedFirm: 'Multiply Carpentry', budget: 45000 },
    { id: 2, name: 'Ahmad Rahman', property: '5-Room HDB', location: 'Woodlands', status: 'Pending', matchedFirm: '—', budget: 55000 },
    { id: 3, name: 'Lim Wei Ming', property: 'Condo 1,200sqft', location: 'Punggol', status: 'Matched', matchedFirm: 'Cubic Deco', budget: 80000 },
    { id: 4, name: 'Nurul Aisyah', property: 'Landed Terrace', location: 'Iskandar Puteri', status: 'Matched', matchedFirm: 'Bjorn JB Studio', budget: 120000 },
];

const WORKERS = [
    { id: 1, name: 'Raj Kumar', trade: 'Tiling', irs: 920, market: 'SG', jobs: 47 },
    { id: 2, name: 'Ali bin Hassan', trade: 'Carpentry', irs: 780, market: 'MY', jobs: 32 },
    { id: 3, name: 'Tan Ah Kow', trade: 'Electrical', irs: 650, market: 'SG', jobs: 21 },
    { id: 4, name: 'Muthu', trade: 'Painting', irs: 545, market: 'MY', jobs: 15 },
    { id: 5, name: 'Jason Lee', trade: 'Plumbing', irs: 320, market: 'SG', jobs: 5 },
];

function irsTier(score: number) {
    if (score >= 900) return { label: 'Elite', color: '#059669' };
    if (score >= 700) return { label: 'Trusted', color: '#2563EB' };
    if (score >= 500) return { label: 'Established', color: '#D97706' };
    if (score >= 300) return { label: 'Building', color: '#9B9A97' };
    return { label: 'New', color: '#DC2626' };
}

export default function AdminDashboard() {
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const [tab, setTab] = useState<'overview' | 'firms' | 'homeowners' | 'workers' | 'pricing'>('overview');

    const totalGMV = FIRMS.reduce((s, f) => s + f.gmv, 0);
    const totalProjects = FIRMS.reduce((s, f) => s + f.projects, 0);
    const escrowRevenue = Math.round(totalGMV * 0.02);
    const commissionRevenue = Math.round(totalGMV * 0.015);

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'firms', label: `Firms (${FIRMS.length})` },
        { key: 'homeowners', label: `Homeowners (${HOMEOWNERS.length})` },
        { key: 'workers', label: `Workers (${WORKERS.length})` },
        { key: 'pricing', label: 'Price Index' },
    ];

    return (
        <div style={{ fontFamily: f, background: '#18171C', color: 'white', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>R</div>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>Roof Admin</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(5,150,105,0.2)', color: '#34D399', fontWeight: 600, marginLeft: 4 }}>FOUNDER</span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Bjorn — Multiply Carpentry</div>
            </div>

            {/* Tabs */}
            <div style={{ padding: '0 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 4 }}>
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key as typeof tab)}
                        style={{
                            padding: '12px 16px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                            background: 'transparent', color: tab === t.key ? 'white' : 'rgba(255,255,255,0.4)',
                            borderBottom: tab === t.key ? '2px solid #059669' : '2px solid transparent',
                            fontFamily: f, transition: 'all 0.15s',
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div style={{ padding: '28px' }}>
                {tab === 'overview' && (
                    <>
                        {/* KPI Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
                            {[
                                { label: 'Total GMV', value: `S$${(totalGMV / 1000).toFixed(0)}k`, sub: 'All-time', color: '#059669' },
                                { label: 'Active Firms', value: `${FIRMS.length}/20`, sub: 'Founding slots', color: '#2563EB' },
                                { label: 'Homeowner Leads', value: `${HOMEOWNERS.length}`, sub: `${HOMEOWNERS.filter(h => h.status === 'Matched').length} matched`, color: '#D97706' },
                                { label: 'Est. Platform Revenue', value: `S$${((escrowRevenue + commissionRevenue) / 1000).toFixed(1)}k`, sub: 'Escrow + commission', color: '#8B5CF6' },
                            ].map(kpi => (
                                <div key={kpi.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '20px' }}>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{kpi.label}</div>
                                    <div style={{ fontSize: 28, fontWeight: 900, color: kpi.color }}>{kpi.value}</div>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{kpi.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Founding 20 Visual */}
                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '20px', marginBottom: 28 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Founding 20 Slots</div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {Array.from({ length: 20 }).map((_, i) => {
                                    const firm = FIRMS[i];
                                    return (
                                        <div
                                            key={i}
                                            title={firm ? `${firm.name} (${firm.owner})` : `Slot ${i + 1} — Available`}
                                            style={{
                                                width: 40, height: 40, borderRadius: 8,
                                                background: firm ? '#059669' : 'rgba(255,255,255,0.04)',
                                                border: firm ? '2px solid #34D399' : '2px solid rgba(255,255,255,0.08)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 10, fontWeight: 700, color: firm ? 'white' : 'rgba(255,255,255,0.2)',
                                                cursor: 'default',
                                            }}
                                        >
                                            {firm ? firm.name.charAt(0) : i + 1}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Revenue Breakdown */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '20px' }}>
                                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Revenue by Source</div>
                                {[
                                    { label: 'Escrow fees (2% GMV)', value: `S$${escrowRevenue.toLocaleString()}`, pct: 55 },
                                    { label: 'Commission (blended 1.5%)', value: `S$${commissionRevenue.toLocaleString()}`, pct: 35 },
                                    { label: 'Setup fees', value: 'S$0', pct: 0 },
                                    { label: 'SaaS', value: 'S$0', pct: 0 },
                                ].map(r => (
                                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{r.label}</span>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: r.pct > 0 ? '#059669' : 'rgba(255,255,255,0.2)' }}>{r.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '20px' }}>
                                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>GMV by Market</div>
                                {[
                                    { label: 'Singapore', value: `S$${FIRMS.filter(f => f.market === 'SG').reduce((s, f) => s + f.gmv, 0).toLocaleString()}` },
                                    { label: 'Johor Bahru', value: `S$${FIRMS.filter(f => f.market === 'MY').reduce((s, f) => s + f.gmv, 0).toLocaleString()}` },
                                ].map(m => (
                                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{m.label}</span>
                                        <span style={{ fontSize: 13, fontWeight: 700 }}>{m.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {tab === 'firms' && (
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['Firm', 'Owner', 'Market', 'Type', 'Tier', 'Projects', 'GMV', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {FIRMS.map(firm => (
                                    <tr key={firm.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{firm.name}</td>
                                        <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.5)' }}>{firm.owner}</td>
                                        <td style={{ padding: '10px 14px' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: 4, background: firm.market === 'SG' ? 'rgba(37,99,235,0.15)' : 'rgba(217,119,6,0.15)', color: firm.market === 'SG' ? '#60A5FA' : '#FBBF24', fontSize: 10, fontWeight: 600 }}>{firm.market}</span>
                                        </td>
                                        <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.5)' }}>{firm.type}</td>
                                        <td style={{ padding: '10px 14px' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(5,150,105,0.15)', color: '#34D399', fontSize: 10, fontWeight: 600 }}>{firm.tier}</span>
                                        </td>
                                        <td style={{ padding: '10px 14px' }}>{firm.projects}</td>
                                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>S${firm.gmv.toLocaleString()}</td>
                                        <td style={{ padding: '10px 14px' }}>
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
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['Name', 'Property', 'Location', 'Budget', 'Status', 'Matched Firm'].map(h => (
                                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {HOMEOWNERS.map(ho => (
                                    <tr key={ho.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{ho.name}</td>
                                        <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.5)' }}>{ho.property}</td>
                                        <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.5)' }}>{ho.location}</td>
                                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>S${ho.budget.toLocaleString()}</td>
                                        <td style={{ padding: '10px 14px' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: 4, background: ho.status === 'Matched' ? 'rgba(5,150,105,0.15)' : 'rgba(217,119,6,0.15)', color: ho.status === 'Matched' ? '#34D399' : '#FBBF24', fontSize: 10, fontWeight: 600 }}>{ho.status}</span>
                                        </td>
                                        <td style={{ padding: '10px 14px', color: ho.matchedFirm === '—' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)' }}>{ho.matchedFirm}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'workers' && (
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['Worker', 'Trade', 'IRS', 'Tier', 'Market', 'Jobs'].map(h => (
                                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {WORKERS.map(w => {
                                    const tier = irsTier(w.irs);
                                    return (
                                        <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <td style={{ padding: '10px 14px', fontWeight: 600 }}>{w.name}</td>
                                            <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.5)' }}>{w.trade}</td>
                                            <td style={{ padding: '10px 14px', fontWeight: 700, color: tier.color }}>{w.irs}</td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <span style={{ padding: '2px 8px', borderRadius: 4, background: `${tier.color}22`, color: tier.color, fontSize: 10, fontWeight: 600 }}>{tier.label}</span>
                                            </td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <span style={{ padding: '2px 8px', borderRadius: 4, background: w.market === 'SG' ? 'rgba(37,99,235,0.15)' : 'rgba(217,119,6,0.15)', color: w.market === 'SG' ? '#60A5FA' : '#FBBF24', fontSize: 10, fontWeight: 600 }}>{w.market}</span>
                                            </td>
                                            <td style={{ padding: '10px 14px' }}>{w.jobs}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'pricing' && (
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '20px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Price Index — Internal Only</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>This data is not public. For your reference only.</div>
                        <a href="/price-index" style={{ display: 'inline-block', padding: '10px 20px', background: '#059669', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
                            Open Price Index
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
