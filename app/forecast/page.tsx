'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ── Revenue Forecast Engine ── */

interface YearData {
    year: number;
    firms: number;
    newFirms: number;
    avgDealValue: number;
    dealsPerFirm: number;
    totalDeals: number;
    gmv: number;
    // revenue lines
    setupRevenue: number;
    saasRevenue: number;
    commissionRevenue: number;
    escrowRevenue: number;
    tradeFinanceRevenue: number;
    totalRevenue: number;
    // blended rate
    blendedCommission: number;
}

function forecast(
    initialFirms: number,
    growthRate: number,
    avgDeal: number,
    dealsPerFirm: number,
    setupFee: number,
    saasFee: number,
    escrowRate: number,
    tradeFinancePct: number, // % of GMV that goes through trade finance
    tradeFinanceRate: number,
): YearData[] {
    const years: YearData[] = [];
    let totalFirmsEver = 0;

    for (let y = 1; y <= 5; y++) {
        const firms = Math.round(initialFirms * Math.pow(1 + growthRate, y - 1));
        const newFirms = y === 1 ? firms : firms - (years[y - 2]?.firms || 0);
        totalFirmsEver += newFirms;

        const totalDeals = firms * dealsPerFirm;
        const gmv = totalDeals * avgDeal;

        // Commission: firms migrate through tiers based on cumulative deals
        // Simplified: Year 1 all at 2%, blended rate drops each year
        const tierRates = [0.02, 0.0175, 0.015, 0.0125, 0.01]; // blended avg by year
        const blendedComm = tierRates[Math.min(y - 1, 4)];

        // Only Roof-sourced leads get commission (assume 60% Roof-sourced, 40% warm referral)
        const roofSourcedPct = 0.6;

        const setupRevenue = newFirms * setupFee * 0.5; // PSG covers half
        const saasRevenue = firms * saasFee * 12;
        const commissionRevenue = gmv * roofSourcedPct * blendedComm;
        const escrowRevenue = gmv * escrowRate;
        const tfGmv = y >= 2 ? gmv * tradeFinancePct * Math.min(1, (y - 1) / 3) : 0; // ramps up
        const tradeFinanceRevenue = tfGmv * tradeFinanceRate;

        years.push({
            year: y,
            firms,
            newFirms: Math.max(0, newFirms),
            avgDealValue: avgDeal,
            dealsPerFirm,
            totalDeals,
            gmv,
            setupRevenue,
            saasRevenue,
            commissionRevenue,
            escrowRevenue,
            tradeFinanceRevenue,
            totalRevenue: setupRevenue + saasRevenue + commissionRevenue + escrowRevenue + tradeFinanceRevenue,
            blendedCommission: blendedComm,
        });
    }
    return years;
}

function fmtK(n: number) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
    return `$${n.toFixed(0)}`;
}

function fmtPct(n: number) { return `${(n * 100).toFixed(1)}%`; }

export default function RevenueForecast() {
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    // Adjustable inputs
    const [initialFirms, setInitialFirms] = useState(10);
    const [growthRate, setGrowthRate] = useState(1.0); // 100% YoY
    const [avgDeal, setAvgDeal] = useState(80000);
    const [dealsPerFirm, setDealsPerFirm] = useState(10);

    const data = forecast(initialFirms, growthRate, avgDeal, dealsPerFirm, 15000, 299, 0.02, 0.4, 0.02);

    const inputStyle = { width: 80, padding: '6px 8px', fontSize: 13, fontFamily: f, border: '1.5px solid #E9E9E7', borderRadius: 6, textAlign: 'right' as const, outline: 'none' };
    const labelStyle = { fontSize: 11, fontWeight: 600 as const, color: '#9B9A97', marginBottom: 4, display: 'block' as const };

    // Find where commission < escrow+TF (the crossover point)
    const crossover = data.findIndex(d => (d.escrowRevenue + d.tradeFinanceRevenue) > d.commissionRevenue);

    return (
        <div style={{ fontFamily: f, background: '#FAFAF9', minHeight: '100vh', padding: '40px 24px' }}>
            <div style={{ maxWidth: 960, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <Link href="/why-roof" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: '#37352F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 800 }}>R</div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#37352F' }}>Roof</span>
                    </Link>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#37352F', margin: '0 0 4px', letterSpacing: '-0.03em' }}>Revenue Forecast Model</h1>
                    <p style={{ fontSize: 13, color: '#9B9A97', margin: 0 }}>Mathematical projection based on current fee structure. Adjust inputs to stress-test.</p>
                </div>

                {/* Input Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28, background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E9E9E7' }}>
                    <div>
                        <label style={labelStyle}>Starting Firms (Y1)</label>
                        <input style={inputStyle} type="number" value={initialFirms} onChange={e => setInitialFirms(+e.target.value || 1)} />
                    </div>
                    <div>
                        <label style={labelStyle}>YoY Growth Rate</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <input style={inputStyle} type="number" step="0.1" value={(growthRate * 100).toFixed(0)} onChange={e => setGrowthRate((+e.target.value || 50) / 100)} />
                            <span style={{ fontSize: 12, color: '#9B9A97' }}>%</span>
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Avg Deal Value (S$)</label>
                        <input style={inputStyle} type="number" step="10000" value={avgDeal} onChange={e => setAvgDeal(+e.target.value || 50000)} />
                    </div>
                    <div>
                        <label style={labelStyle}>Deals per Firm / Year</label>
                        <input style={inputStyle} type="number" value={dealsPerFirm} onChange={e => setDealsPerFirm(+e.target.value || 5)} />
                    </div>
                </div>

                {/* Assumptions */}
                <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 8, background: '#F9FAFB', border: '1px solid #F3F3F2', fontSize: 11, color: '#9B9A97', lineHeight: 1.7 }}>
                    <strong style={{ color: '#6B6A67' }}>Assumptions:</strong> 50% PSG subsidy on setup fee | 60% Roof-sourced leads (commission applies), 40% warm referrals (no commission) | Escrow fee 2% on all GMV | Trade finance ramps from Y2 (40% of GMV at 2% fee) | Blended commission decays 2.0% → 1.0% as firms hit loyalty tiers
                </div>

                {/* Revenue Table */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', overflow: 'hidden', marginBottom: 28 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                            <tr style={{ background: '#FAFAF9', borderBottom: '1px solid #E9E9E7' }}>
                                {['', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'].map(h => (
                                    <th key={h} style={{ padding: '12px 14px', textAlign: h === '' ? 'left' : 'right', fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Operating Metrics */}
                            <tr style={{ borderBottom: '1px solid #F3F3F2' }}>
                                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#37352F' }}>Active Firms</td>
                                {data.map(d => <td key={d.year} style={{ padding: '10px 14px', textAlign: 'right', color: '#37352F', fontWeight: 600 }}>{d.firms}</td>)}
                            </tr>
                            <tr style={{ borderBottom: '1px solid #F3F3F2' }}>
                                <td style={{ padding: '10px 14px', color: '#6B6A67' }}>Total Deals</td>
                                {data.map(d => <td key={d.year} style={{ padding: '10px 14px', textAlign: 'right', color: '#6B6A67' }}>{d.totalDeals}</td>)}
                            </tr>
                            <tr style={{ borderBottom: '1px solid #E9E9E7' }}>
                                <td style={{ padding: '10px 14px', color: '#6B6A67' }}>GMV</td>
                                {data.map(d => <td key={d.year} style={{ padding: '10px 14px', textAlign: 'right', color: '#6B6A67', fontWeight: 600 }}>{fmtK(d.gmv)}</td>)}
                            </tr>

                            {/* Revenue Lines */}
                            <tr style={{ borderBottom: '1px solid #F3F3F2', background: '#FAFAF9' }}>
                                <td colSpan={6} style={{ padding: '8px 14px', fontWeight: 700, color: '#37352F', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue Breakdown</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #F3F3F2' }}>
                                <td style={{ padding: '10px 14px', color: '#6B6A67' }}>Setup Fees (one-time)</td>
                                {data.map(d => <td key={d.year} style={{ padding: '10px 14px', textAlign: 'right', color: '#6B6A67' }}>{fmtK(d.setupRevenue)}</td>)}
                            </tr>
                            <tr style={{ borderBottom: '1px solid #F3F3F2' }}>
                                <td style={{ padding: '10px 14px', color: '#6B6A67' }}>SaaS ($299/mo)</td>
                                {data.map(d => <td key={d.year} style={{ padding: '10px 14px', textAlign: 'right', color: '#059669', fontWeight: 500 }}>{fmtK(d.saasRevenue)}</td>)}
                            </tr>
                            <tr style={{ borderBottom: '1px solid #F3F3F2' }}>
                                <td style={{ padding: '10px 14px', color: '#6B6A67' }}>Commission ({fmtPct(data[0]?.blendedCommission || 0)} → {fmtPct(data[4]?.blendedCommission || 0)})</td>
                                {data.map(d => <td key={d.year} style={{ padding: '10px 14px', textAlign: 'right', color: '#D97706', fontWeight: 500 }}>{fmtK(d.commissionRevenue)}</td>)}
                            </tr>
                            <tr style={{ borderBottom: '1px solid #F3F3F2' }}>
                                <td style={{ padding: '10px 14px', color: '#6B6A67' }}>Escrow Fee (2%)</td>
                                {data.map(d => <td key={d.year} style={{ padding: '10px 14px', textAlign: 'right', color: '#2563EB', fontWeight: 500 }}>{fmtK(d.escrowRevenue)}</td>)}
                            </tr>
                            <tr style={{ borderBottom: '1px solid #E9E9E7' }}>
                                <td style={{ padding: '10px 14px', color: '#6B6A67' }}>Trade Finance (2%)</td>
                                {data.map(d => <td key={d.year} style={{ padding: '10px 14px', textAlign: 'right', color: '#7C3AED', fontWeight: 500 }}>{fmtK(d.tradeFinanceRevenue)}</td>)}
                            </tr>
                            <tr style={{ background: '#37352F' }}>
                                <td style={{ padding: '12px 14px', fontWeight: 800, color: 'white' }}>Total Revenue</td>
                                {data.map(d => <td key={d.year} style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: 'white', fontSize: 14 }}>{fmtK(d.totalRevenue)}</td>)}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Visual bar chart */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', padding: '24px', marginBottom: 28 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 700, color: '#37352F', margin: '0 0 20px' }}>Revenue Mix by Year</h2>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 200 }}>
                        {data.map(d => {
                            const max = Math.max(...data.map(x => x.totalRevenue));
                            const h = (d.totalRevenue / max) * 180;
                            const setupH = (d.setupRevenue / d.totalRevenue) * h;
                            const saasH = (d.saasRevenue / d.totalRevenue) * h;
                            const commH = (d.commissionRevenue / d.totalRevenue) * h;
                            const escrowH = (d.escrowRevenue / d.totalRevenue) * h;
                            const tfH = (d.tradeFinanceRevenue / d.totalRevenue) * h;
                            return (
                                <div key={d.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#37352F' }}>{fmtK(d.totalRevenue)}</div>
                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', borderRadius: 6, overflow: 'hidden' }}>
                                        <div style={{ height: tfH, background: '#7C3AED' }} title="Trade Finance" />
                                        <div style={{ height: escrowH, background: '#2563EB' }} title="Escrow" />
                                        <div style={{ height: commH, background: '#F59E0B' }} title="Commission" />
                                        <div style={{ height: saasH, background: '#10B981' }} title="SaaS" />
                                        <div style={{ height: setupH, background: '#9B9A97' }} title="Setup" />
                                    </div>
                                    <div style={{ fontSize: 11, color: '#9B9A97', fontWeight: 600 }}>Y{d.year}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 16, justifyContent: 'center' }}>
                        {[
                            { label: 'Setup', color: '#9B9A97' },
                            { label: 'SaaS', color: '#10B981' },
                            { label: 'Commission', color: '#F59E0B' },
                            { label: 'Escrow', color: '#2563EB' },
                            { label: 'Trade Finance', color: '#7C3AED' },
                        ].map(l => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                                <span style={{ fontSize: 10, color: '#6B6A67' }}>{l.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Analysis */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', padding: '24px' }}>
                    <h2 style={{ fontSize: 14, fontWeight: 700, color: '#37352F', margin: '0 0 16px' }}>Long-Term Risk Analysis</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ padding: '16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#991B1B', marginBottom: 8 }}>Without Escrow + Trade Finance</div>
                            <div style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.8 }}>
                                Y5 Revenue: <strong>{fmtK(data[4].setupRevenue + data[4].saasRevenue + data[4].commissionRevenue)}</strong><br />
                                Commission decays as firms hit 0.5% tier<br />
                                SaaS caps at {data[4].firms} firms x $299 = {fmtK(data[4].saasRevenue)}/yr<br />
                                <strong>Verdict: Plateaus. Need 500+ firms to hit $2M.</strong>
                            </div>
                        </div>
                        <div style={{ padding: '16px', borderRadius: 10, background: '#ECFDF5', border: '1px solid #6EE7B7' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#065F46', marginBottom: 8 }}>With Escrow + Trade Finance</div>
                            <div style={{ fontSize: 12, color: '#064E3B', lineHeight: 1.8 }}>
                                Y5 Revenue: <strong>{fmtK(data[4].totalRevenue)}</strong><br />
                                Escrow scales with GMV (no decay): {fmtK(data[4].escrowRevenue)}<br />
                                Trade finance grows exponentially: {fmtK(data[4].tradeFinanceRevenue)}<br />
                                <strong>Verdict: Scales. Fintech layers prevent plateau.</strong>
                            </div>
                        </div>
                    </div>
                    {crossover >= 0 && (
                        <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 8, background: '#FFFBEB', border: '1px solid #FDE68A', fontSize: 12, color: '#92400E' }}>
                            <strong>Crossover Point:</strong> In Year {crossover + 1}, Escrow + Trade Finance revenue ({fmtK(data[crossover].escrowRevenue + data[crossover].tradeFinanceRevenue)}) overtakes Commission revenue ({fmtK(data[crossover].commissionRevenue)}). This is when Roof transitions from a SaaS company to a fintech.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
