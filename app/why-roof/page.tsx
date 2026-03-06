'use client';

import Link from 'next/link';

export default function WhyRoof() {
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    return (
        <div style={{ fontFamily: f, background: '#FAFAF9', minHeight: '100vh', padding: '60px 24px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <Link href="/landing" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: '#37352F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 800 }}>R</div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#37352F' }}>Roof</span>
                    </Link>
                    <h1 style={{ fontSize: 32, fontWeight: 900, color: '#37352F', margin: '0 0 8px', letterSpacing: '-0.03em' }}>Why Roof?</h1>
                    <p style={{ fontSize: 14, color: '#9B9A97', margin: 0 }}>A side-by-side comparison for design firms evaluating their options.</p>
                </div>

                {/* Main Comparison Table */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', overflow: 'hidden', marginBottom: 28 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, color: '#37352F' }}>
                        <thead>
                            <tr style={{ background: '#FAFAF9', borderBottom: '1px solid #E9E9E7' }}>
                                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metric</th>
                                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qanvast</th>
                                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enquote</th>
                                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#37352F', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#ECFDF5' }}>Roof</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { metric: 'Setup Fee', qanvast: '—', enquote: 'S$20,000', roof: 'S$15,000 (PSG elig.)', highlight: true },
                                { metric: 'Monthly Fee', qanvast: '—', enquote: 'Included', roof: 'S$299/mo', highlight: false },
                                { metric: 'Commission', qanvast: 'S$80/lead (pre-pay)', enquote: '5% flat (all rev)', roof: '2% → 0.5% (tiered)', highlight: true },
                                { metric: 'Warm referral commission', qanvast: 'N/A', enquote: '5% (all rev)', roof: '0% (no commission)', highlight: true },
                                { metric: 'Leads per match', qanvast: '5 firms compete', enquote: '—', roof: '3 firms only', highlight: true },
                                { metric: 'Win rate', qanvast: '~20% (1 in 5)', enquote: '—', roof: '~33% (1 in 3)', highlight: false },
                                { metric: 'Payment model', qanvast: 'Pay before winning', enquote: 'Rev-share', roof: 'Pay after winning', highlight: true },
                                { metric: 'Quotation tools', qanvast: 'No', enquote: 'Yes', roof: 'Yes (113 materials)', highlight: false },
                                { metric: 'Project management', qanvast: 'No', enquote: 'No', roof: 'Yes (Sequence)', highlight: true },
                                { metric: 'Worker dispatch', qanvast: 'No', enquote: 'No', roof: 'Yes (Dispatch)', highlight: true },
                                { metric: 'Lead CRM', qanvast: 'No', enquote: 'No', roof: 'Yes (Follow Up)', highlight: true },
                                { metric: 'Escrow protection', qanvast: 'No', enquote: 'No', roof: 'Yes (milestone-based)', highlight: true },
                                { metric: 'Client matching', qanvast: 'Directory listing', enquote: 'No', roof: 'AI-powered (style + budget)', highlight: false },
                                { metric: 'Worker reliability score', qanvast: 'No', enquote: 'No', roof: 'Yes (IRS, NRIC-linked)', highlight: true },
                                { metric: 'Credit score system', qanvast: 'No', enquote: 'No', roof: 'Yes (trade finance)', highlight: true },
                            ].map((row, i) => (
                                <tr key={row.metric} style={{ borderBottom: '1px solid #F3F3F2' }}>
                                    <td style={{ padding: '12px 20px', fontWeight: 500 }}>{row.metric}</td>
                                    <td style={{ padding: '12px 20px', textAlign: 'center', color: '#9B9A97' }}>{row.qanvast}</td>
                                    <td style={{ padding: '12px 20px', textAlign: 'center', color: '#9B9A97' }}>{row.enquote}</td>
                                    <td style={{ padding: '12px 20px', textAlign: 'center', fontWeight: row.highlight ? 700 : 500, color: row.highlight ? '#059669' : '#37352F', background: '#FAFFF9' }}>{row.roof}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Commission Tiers */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', padding: '24px', marginBottom: 28 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#37352F', margin: '0 0 16px' }}>Commission Tiers (The Loyalty Engine)</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {[
                            { tier: 'Seed', req: 'Onboarding', rate: '2.0%', pos: 'Market Entry', color: '#F59E0B' },
                            { tier: 'Growth', req: '25 Projects', rate: '1.5%', pos: 'Verified Specialist', color: '#10B981' },
                            { tier: 'Elite', req: '75 Projects', rate: '1.0%', pos: 'Platform Partner', color: '#3B82F6' },
                            { tier: 'Sovereign', req: '150+ Projects', rate: '0.5%', pos: 'Platform Owner', color: '#7C3AED' },
                        ].map(t => (
                            <div key={t.tier} style={{ padding: '16px', borderRadius: 10, border: `1.5px solid ${t.color}20`, textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 900, color: t.color }}>{t.rate}</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#37352F', marginTop: 4 }}>{t.tier}</div>
                                <div style={{ fontSize: 11, color: '#9B9A97', marginTop: 2 }}>{t.req}</div>
                                <div style={{ fontSize: 10, color: '#C8C7C3', marginTop: 6, fontStyle: 'italic' }}>{t.pos}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* The Math */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', padding: '24px', marginBottom: 28 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#37352F', margin: '0 0 16px' }}>The Math: Qanvast vs Roof</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ padding: '16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#991B1B', marginBottom: 8 }}>Qanvast: 25 leads/month</div>
                            <div style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.8 }}>
                                25 leads x S$80 = <strong>S$2,000/mo upfront</strong><br />
                                Win rate: ~20% (5 per lead)<br />
                                Wins: ~5 projects/mo<br />
                                Cost per win: <strong>S$400</strong><br />
                                <span style={{ fontSize: 11, color: '#9B9A97' }}>80% of spend wasted on lost leads</span>
                            </div>
                        </div>
                        <div style={{ padding: '16px', borderRadius: 10, background: '#ECFDF5', border: '1px solid #6EE7B7' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46', marginBottom: 8 }}>Roof: Same volume</div>
                            <div style={{ fontSize: 12, color: '#064E3B', lineHeight: 1.8 }}>
                                Upfront cost: <strong>S$0</strong><br />
                                Win rate: ~33% (3 per lead)<br />
                                Avg deal: S$80,000 x 2% = <strong>S$1,600</strong><br />
                                At 0.5% tier: <strong>S$400</strong> (same as Qanvast)<br />
                                <span style={{ fontSize: 11, color: '#059669' }}>Zero risk — pay only when you win</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center' }}>
                    <Link href="/join" style={{
                        display: 'inline-block', padding: '14px 40px', fontSize: 15, fontWeight: 700,
                        color: 'white', background: '#37352F', textDecoration: 'none', borderRadius: 10,
                    }}>
                        Join Roof
                    </Link>
                </div>
            </div>
        </div>
    );
}
