'use client';

import React, { useState } from 'react';
import RoofNav from '@/components/RoofNav';

// ============================================================
// OVERHEAD CALCULATOR — Margin & Overhead Analysis
// ============================================================

interface OverheadItem {
    id: string;
    label: string;
    monthly: number;
    category: 'rent' | 'staff' | 'insurance' | 'transport' | 'software' | 'marketing' | 'misc';
}

const CAT_CFG = {
    rent: { emoji: '', color: '#3B82F6', bg: '#EFF6FF' },
    staff: { emoji: '', color: '#8B5CF6', bg: '#F5F3FF' },
    insurance: { emoji: '', color: '#22C55E', bg: '#F0FDF4' },
    transport: { emoji: '', color: '#F59E0B', bg: '#FEF9C3' },
    software: { emoji: '', color: '#06B6D4', bg: '#ECFEFF' },
    marketing: { emoji: '', color: '#EC4899', bg: '#FDF2F8' },
    misc: { emoji: '', color: '#6B6A67', bg: '#F7F6F3' },
};

const DEMO_OVERHEADS: OverheadItem[] = [
    { id: 'O1', label: 'Studio Rent (Ubi)', monthly: 3200, category: 'rent' },
    { id: 'O2', label: 'Senior Designer Salary', monthly: 5500, category: 'staff' },
    { id: 'O3', label: 'Junior Designer Salary', monthly: 3200, category: 'staff' },
    { id: 'O4', label: 'Admin / Accounts', monthly: 2800, category: 'staff' },
    { id: 'O5', label: 'Business Insurance', monthly: 350, category: 'insurance' },
    { id: 'O6', label: 'Vehicle (Lease + Petrol)', monthly: 1200, category: 'transport' },
    { id: 'O7', label: 'Software (AutoCAD, Adobe, Roof)', monthly: 480, category: 'software' },
    { id: 'O8', label: 'Google Ads + Social', monthly: 800, category: 'marketing' },
    { id: 'O9', label: 'CPF Contributions', monthly: 1900, category: 'staff' },
    { id: 'O10', label: 'Misc (Printing, Samples, etc)', monthly: 400, category: 'misc' },
];

export default function OverheadCalculator() {
    const [overheads, setOverheads] = useState(DEMO_OVERHEADS);
    const [projectsPerMonth, setProjectsPerMonth] = useState(3);
    const [avgProjectValue, setAvgProjectValue] = useState(65000);
    const [avgCostOfWorks, setAvgCostOfWorks] = useState(45000);
    const [desiredMarginPct, setDesiredMarginPct] = useState(25);
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const totalMonthly = overheads.reduce((s, o) => s + o.monthly, 0);
    const totalAnnual = totalMonthly * 12;
    const overheadPerProject = projectsPerMonth > 0 ? totalMonthly / projectsPerMonth : 0;
    const avgGrossProfit = avgProjectValue - avgCostOfWorks;
    const avgNetProfit = avgGrossProfit - overheadPerProject;
    const actualMarginPct = avgProjectValue > 0 ? (avgNetProfit / avgProjectValue * 100) : 0;
    const grossMarginPct = avgProjectValue > 0 ? (avgGrossProfit / avgProjectValue * 100) : 0;
    const markupPct = avgCostOfWorks > 0 ? ((avgProjectValue - avgCostOfWorks) / avgCostOfWorks * 100) : 0;

    // What should they charge to hit desired margin?
    const requiredPrice = avgCostOfWorks > 0 ? (avgCostOfWorks + overheadPerProject) / (1 - desiredMarginPct / 100) : 0;
    const requiredMarkup = avgCostOfWorks > 0 ? ((requiredPrice - avgCostOfWorks) / avgCostOfWorks * 100) : 0;

    // Breakeven
    const breakeven = avgGrossProfit > 0 ? Math.ceil(totalMonthly / avgGrossProfit) : 0;

    // Category breakdown
    const categories = Object.keys(CAT_CFG) as (keyof typeof CAT_CFG)[];
    const catTotals = categories.map(c => ({
        cat: c,
        total: overheads.filter(o => o.category === c).reduce((s, o) => s + o.monthly, 0),
    })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            <RoofNav />
            <div style={{ padding: '20px 32px 80px' }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#37352F', margin: '0 0 4px' }}>Overhead Calculator</h1>
                <p style={{ fontSize: 12, color: '#9B9A97', margin: '0 0 20px' }}>Margin analysis · Overhead allocation · Break-even · Pricing guidance</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {/* Left: Inputs */}
                    <div>
                        {/* Project Parameters */}
                        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', padding: 16, marginBottom: 12 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}> Project Parameters</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {[
                                    { label: 'Projects / Month', value: projectsPerMonth, set: setProjectsPerMonth, prefix: '' },
                                    { label: 'Avg Project Value ($)', value: avgProjectValue, set: setAvgProjectValue, prefix: '$' },
                                    { label: 'Avg Cost of Works ($)', value: avgCostOfWorks, set: setAvgCostOfWorks, prefix: '$' },
                                    { label: 'Target Net Margin (%)', value: desiredMarginPct, set: setDesiredMarginPct, prefix: '' },
                                ].map(input => (
                                    <div key={input.label}>
                                        <label style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{input.label}</label>
                                        <input type="number" value={input.value} onChange={e => input.set(parseFloat(e.target.value) || 0)}
                                            style={{ width: '100%', padding: '8px 10px', fontSize: 13, fontWeight: 700, border: '1px solid #E9E9E7', borderRadius: 8, fontFamily: f, boxSizing: 'border-box' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Monthly Overheads */}
                        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', padding: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}> Monthly Overheads</span>
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#37352F' }}>${totalMonthly.toLocaleString()}/mo</span>
                            </div>
                            {overheads.map(o => {
                                const cfg = CAT_CFG[o.category];
                                return (
                                    <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #F5F5F4' }}>
                                        <span style={{ fontSize: 14 }}>{cfg.emoji}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 11, fontWeight: 600, color: '#37352F' }}>{o.label}</div>
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'SF Mono', monospace", color: '#37352F' }}>${o.monthly.toLocaleString()}</span>
                                    </div>
                                );
                            })}

                            {/* Category Breakdown */}
                            <div style={{ marginTop: 14 }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', marginBottom: 6 }}>By Category</div>
                                {catTotals.map(c => {
                                    const cfg = CAT_CFG[c.cat];
                                    const pct = totalMonthly > 0 ? (c.total / totalMonthly * 100) : 0;
                                    return (
                                        <div key={c.cat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <span style={{ fontSize: 12 }}>{cfg.emoji}</span>
                                            <span style={{ fontSize: 10, width: 70, color: '#6B6A67', textTransform: 'capitalize' }}>{c.cat}</span>
                                            <div style={{ flex: 1, height: 6, background: '#F5F5F4', borderRadius: 3, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', background: cfg.color, borderRadius: 3, width: `${pct}%`, transition: 'width 0.5s' }} />
                                            </div>
                                            <span style={{ fontSize: 10, fontWeight: 700, color: '#37352F', width: 50, textAlign: 'right' }}>${c.total.toLocaleString()}</span>
                                            <span style={{ fontSize: 9, color: '#9B9A97', width: 30, textAlign: 'right' }}>{pct.toFixed(0)}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Analysis */}
                    <div>
                        {/* Key Metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
                            {[
                                { label: 'Gross Margin', value: `${grossMarginPct.toFixed(1)}%`, sub: `$${avgGrossProfit.toLocaleString()} /project`, color: '#3B82F6', bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' },
                                { label: 'Net Margin', value: `${actualMarginPct.toFixed(1)}%`, sub: `$${Math.round(avgNetProfit).toLocaleString()} /project`, color: actualMarginPct > 15 ? '#16A34A' : actualMarginPct > 5 ? '#F59E0B' : '#DC2626', bg: actualMarginPct > 15 ? 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' : actualMarginPct > 5 ? 'linear-gradient(135deg, #FEF9C3, #FEF3C7)' : 'linear-gradient(135deg, #FEF2F2, #FEE2E2)' },
                                { label: 'Current Markup', value: `${markupPct.toFixed(0)}%`, sub: `on cost of works`, color: '#7C3AED', bg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' },
                            ].map(m => (
                                <div key={m.label} style={{ background: m.bg, borderRadius: 14, padding: 16, border: '1px solid rgba(0,0,0,0.04)' }}>
                                    <div style={{ fontSize: 32, fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.value}</div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: m.color, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 4 }}>{m.label}</div>
                                    <div style={{ fontSize: 9, color: '#9B9A97', marginTop: 2 }}>{m.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Waterfall */}
                        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', padding: 16, marginBottom: 12 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}> Profit Waterfall (Per Project)</div>
                            {[
                                { label: 'Project Value', value: avgProjectValue, type: 'income' as const },
                                { label: '– Cost of Works', value: -avgCostOfWorks, type: 'expense' as const },
                                { label: '= Gross Profit', value: avgGrossProfit, type: 'subtotal' as const },
                                { label: '– Overhead Allocation', value: -overheadPerProject, type: 'expense' as const },
                                { label: '= Net Profit', value: avgNetProfit, type: 'result' as const },
                            ].map(row => (
                                <div key={row.label} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '8px 12px', borderBottom: row.type === 'result' ? 'none' : '1px solid #F5F5F4',
                                    background: row.type === 'result' ? (avgNetProfit >= 0 ? '#F0FDF4' : '#FEF2F2') : row.type === 'subtotal' ? '#FAFAF9' : 'transparent',
                                    borderRadius: row.type === 'result' || row.type === 'subtotal' ? 6 : 0,
                                    marginTop: row.type === 'subtotal' || row.type === 'result' ? 4 : 0,
                                }}>
                                    <span style={{ fontSize: 12, fontWeight: row.type === 'result' || row.type === 'subtotal' ? 700 : 500, color: '#37352F' }}>{row.label}</span>
                                    <span style={{
                                        fontSize: 13, fontWeight: 800, fontFamily: "'SF Mono', monospace",
                                        color: row.type === 'result' ? (avgNetProfit >= 0 ? '#16A34A' : '#DC2626') : row.type === 'expense' ? '#DC2626' : '#37352F',
                                    }}>${Math.abs(Math.round(row.value)).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        {/* Pricing Guidance */}
                        <div style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', borderRadius: 12, border: '1px solid #DDD6FE', padding: 16, marginBottom: 12 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}> Pricing Guidance</div>
                            <div style={{ fontSize: 11, color: '#6B6A67', marginBottom: 8 }}>To achieve <strong>{desiredMarginPct}% net margin</strong> with your current overheads:</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div style={{ background: 'white', borderRadius: 8, padding: 12 }}>
                                    <div style={{ fontSize: 9, color: '#7C3AED', fontWeight: 600 }}>Charge Per Project</div>
                                    <div style={{ fontSize: 22, fontWeight: 900, color: '#7C3AED' }}>${Math.round(requiredPrice).toLocaleString()}</div>
                                </div>
                                <div style={{ background: 'white', borderRadius: 8, padding: 12 }}>
                                    <div style={{ fontSize: 9, color: '#7C3AED', fontWeight: 600 }}>Required Markup</div>
                                    <div style={{ fontSize: 22, fontWeight: 900, color: '#7C3AED' }}>{requiredMarkup.toFixed(0)}%</div>
                                </div>
                            </div>
                        </div>

                        {/* Breakeven */}
                        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', padding: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}> Break-Even</div>
                                    <div style={{ fontSize: 11, color: '#6B6A67', marginTop: 2 }}>Projects needed per month to cover all overheads</div>
                                </div>
                                <div style={{ fontSize: 36, fontWeight: 900, color: breakeven <= projectsPerMonth ? '#22C55E' : '#DC2626' }}>{breakeven}</div>
                            </div>
                            <div style={{ marginTop: 8, height: 6, background: '#F5F5F4', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', borderRadius: 3,
                                    background: projectsPerMonth >= breakeven ? '#22C55E' : '#DC2626',
                                    width: `${Math.min((projectsPerMonth / Math.max(breakeven, 1)) * 100, 100)}%`,
                                }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                <span style={{ fontSize: 9, color: '#9B9A97' }}>Current: {projectsPerMonth}/mo</span>
                                <span style={{ fontSize: 9, color: '#9B9A97' }}>Need: {breakeven}/mo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
