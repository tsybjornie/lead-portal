'use client';

import Link from 'next/link';
import { useState } from 'react';

const TOTAL_SLOTS = 20;
const TAKEN_SLOTS = 5; // Seeded: own firms + family firms

const BENEFITS = [
    { title: 'Quotation Builder', desc: '113 materials priced at SG + JB market rates. Generate client-ready quotes in minutes, not hours.', badge: 'N' },
    { title: 'Project Scheduler', desc: 'Gantt-style timeline with milestone tracking. Clients see progress without 50 WhatsApp messages a day.', badge: 'S' },
    { title: 'Worker Dispatch', desc: 'Find verified tradesmen with IRS reputation scores. Dispatch directly from your project schedule.', badge: 'D' },
    { title: 'Client Matching', desc: 'AI-powered matching based on style, budget, and compatibility. 3 firms per lead, not 5.', badge: 'C' },
    { title: 'Lead CRM', desc: 'Track every prospect from first contact to signed contract. Auto follow-ups so nobody falls through the cracks.', badge: 'F' },
    { title: 'Escrow Protection', desc: 'Milestone-based payment releases. Clients feel safe. You get paid on time. Disputes go down.', badge: 'E' },
];

const COMPARISON = [
    { metric: 'Setup fee', others: 'S$15,000–$20,000', founding: 'S$0' },
    { metric: 'Monthly fee', others: 'S$299/mo', founding: 'S$0' },
    { metric: 'Commission (Roof leads)', others: '2% → 0.5%', founding: '2% → 0.5%' },
    { metric: 'Commission (your own leads)', others: '0%', founding: '0%' },
    { metric: 'Price lock', others: 'Subject to change', founding: 'Locked forever' },
    { metric: 'Tools access', others: 'All 6 engines', founding: 'All 6 engines' },
    { metric: 'Priority support', others: 'Standard', founding: 'Direct line to founders' },
];

export default function Founding20() {
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const remaining = TOTAL_SLOTS - TAKEN_SLOTS;
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

    return (
        <div style={{ fontFamily: f, background: '#FAFAF9', minHeight: '100vh' }}>
            {/* Hero */}
            <div style={{ background: '#37352F', padding: '60px 24px 50px', color: 'white', textAlign: 'center' }}>
                <Link href="/landing" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#37352F', fontSize: 16, fontWeight: 800 }}>R</div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>Roof</span>
                </Link>

                <h1 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                    Founding 20
                </h1>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', margin: '0 0 32px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
                    We are selecting 20 design firms to build Roof with us.<br />
                    Free setup. Free SaaS. Forever.
                </p>

                {/* Slot Counter */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap', maxWidth: 500, margin: '0 auto 24px' }}>
                    {Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
                        const taken = i < TAKEN_SLOTS;
                        const isHovered = hoveredSlot === i;
                        return (
                            <div
                                key={i}
                                onMouseEnter={() => setHoveredSlot(i)}
                                onMouseLeave={() => setHoveredSlot(null)}
                                style={{
                                    width: 36, height: 36, borderRadius: 8,
                                    background: taken ? '#059669' : isHovered && !taken ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                                    border: taken ? '2px solid #059669' : '2px solid rgba(255,255,255,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, fontWeight: 700, color: taken ? 'white' : 'rgba(255,255,255,0.3)',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {taken ? '/' : i + 1}
                            </div>
                        );
                    })}
                </div>
                <div style={{ fontSize: 14, color: '#059669', fontWeight: 700 }}>
                    {TAKEN_SLOTS} taken. {remaining} spots remaining.
                </div>
            </div>

            <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
                {/* The Deal */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', padding: '28px', marginBottom: 28 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#37352F', margin: '0 0 16px' }}>The Deal</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                        <div style={{ textAlign: 'center', padding: 16, borderRadius: 10, background: '#ECFDF5', border: '1px solid #D1FAE5' }}>
                            <div style={{ fontSize: 28, fontWeight: 900, color: '#059669' }}>$0</div>
                            <div style={{ fontSize: 12, color: '#065F46', fontWeight: 600 }}>Setup Fee</div>
                            <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 4 }}>Forever, not just year 1</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: 16, borderRadius: 10, background: '#ECFDF5', border: '1px solid #D1FAE5' }}>
                            <div style={{ fontSize: 28, fontWeight: 900, color: '#059669' }}>$0</div>
                            <div style={{ fontSize: 12, color: '#065F46', fontWeight: 600 }}>Monthly Fee</div>
                            <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 4 }}>No SaaS charge. Ever.</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: 16, borderRadius: 10, background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                            <div style={{ fontSize: 28, fontWeight: 900, color: '#D97706' }}>2%</div>
                            <div style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>Our Leads Only</div>
                            <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 4 }}>Your own leads = 0%</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 8, background: '#F9FAFB', fontSize: 12, color: '#6B6A67', lineHeight: 1.7 }}>
                        We only make money when you make money. Commission applies only to leads we bring you through Roof. Your warm referrals, repeat clients, and self-sourced leads cost you 0%. Commission drops to 0.5% at volume.
                    </div>
                </div>

                {/* What You Get */}
                <div style={{ marginBottom: 28 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#37352F', margin: '0 0 16px' }}>What You Get</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {BENEFITS.map(b => (
                            <div key={b.title} style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: 6, background: '#37352F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 800 }}>{b.badge}</div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>{b.title}</div>
                                </div>
                                <div style={{ fontSize: 12, color: '#6B6A67', lineHeight: 1.6 }}>{b.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Founding vs Standard */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', overflow: 'hidden', marginBottom: 28 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                            <tr style={{ background: '#FAFAF9', borderBottom: '1px solid #E9E9E7' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase' }}></th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase' }}>Standard (after 20)</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#059669', textTransform: 'uppercase', background: '#F0FDF4' }}>Founding 20</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPARISON.map((row, i) => (
                                <tr key={row.metric} style={{ borderBottom: i < COMPARISON.length - 1 ? '1px solid #F3F3F2' : 'none' }}>
                                    <td style={{ padding: '10px 16px', fontWeight: 500, color: '#37352F' }}>{row.metric}</td>
                                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#9B9A97' }}>{row.others}</td>
                                    <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 700, color: '#059669', background: '#FAFFF9' }}>{row.founding}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Who We're Looking For */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', padding: '28px', marginBottom: 28 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#37352F', margin: '0 0 12px' }}>Who We Are Looking For</h2>
                    <div style={{ fontSize: 13, color: '#6B6A67', lineHeight: 1.8 }}>
                        We want firms that will use the platform daily and help us build the right product. In return, you get founding-tier pricing locked forever.<br /><br />

                        <strong style={{ color: '#37352F' }}>Ideal fit:</strong><br />
                        - Active ID firms (2+ projects running at any time)<br />
                        - Based in Singapore or Johor Bahru<br />
                        - Willing to give us honest feedback<br />
                        - Open to trying new tools for quoting, scheduling, and dispatch<br /><br />

                        <strong style={{ color: '#37352F' }}>Not a fit:</strong><br />
                        - Firms that only want leads and won't use the tools<br />
                        - One-person operations with fewer than 3 projects per year
                    </div>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Link href="/signup/contractor" style={{
                        display: 'inline-block', padding: '16px 48px', fontSize: 16, fontWeight: 800,
                        color: 'white', background: '#059669', textDecoration: 'none', borderRadius: 12,
                        boxShadow: '0 4px 16px rgba(5,150,105,0.3)',
                    }}>
                        Claim Your Founding Spot
                    </Link>
                    <div style={{ fontSize: 12, color: '#9B9A97', marginTop: 10 }}>{remaining} of {TOTAL_SLOTS} spots remaining. Once they are gone, standard pricing applies.</div>
                </div>
            </div>
        </div>
    );
}
