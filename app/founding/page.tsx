'use client';

import Link from 'next/link';
import { useState } from 'react';

const TOTAL_SLOTS = 20;
const TAKEN_SLOTS = 5;

const BENEFITS = [
    { num: '01', title: 'Quotation Builder', desc: '113 materials priced at SG + JB market rates. Generate client-ready quotes in minutes.' },
    { num: '02', title: 'Project Scheduler', desc: 'Gantt-style timeline with milestone tracking. Clients see progress without 50 WhatsApp messages.' },
    { num: '03', title: 'Worker Dispatch', desc: 'Find verified tradesmen with IRS reputation scores. Dispatch directly from your project schedule.' },
    { num: '04', title: 'Client Matching', desc: 'AI-powered matching based on style, budget, and compatibility. 3 firms per lead, not 5.' },
    { num: '05', title: 'Lead CRM', desc: 'Track every prospect from first contact to signed contract. Auto follow-ups so nobody falls through.' },
    { num: '06', title: 'Escrow Protection', desc: 'Milestone-based payment releases. Clients feel safe. You get paid on time. Disputes go down.' },
];

const COMPARISON = [
    { metric: 'Setup fee', others: 'S$15,000–$20,000', founding: 'S$0' },
    { metric: 'Monthly fee', others: 'S$299/mo', founding: 'S$0' },
    { metric: 'Commission (Roof leads)', others: '2% → 0.5%', founding: '2% → 0.5%' },
    { metric: 'Commission (your leads)', others: '0%', founding: '0%' },
    { metric: 'Price lock', others: 'Subject to change', founding: 'Locked forever' },
    { metric: 'Tools access', others: 'All 6 engines', founding: 'All 6 engines' },
    { metric: 'Priority support', others: 'Standard', founding: 'Direct line' },
];

export default function Founding20() {
    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";
    const remaining = TOTAL_SLOTS - TAKEN_SLOTS;
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                .benefit-row { transition: all 0.3s ease; }
                .benefit-row:hover { background: rgba(0,0,0,0.02) !important; }
                .benefit-row:hover .b-title { color: #000 !important; }
            `}</style>

            {/* ═══════ TOP BAR ═══════ */}
            <nav style={{
                padding: '0 48px', height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}>
                <Link href="/landing" style={{
                    fontFamily: mono, fontSize: 11, fontWeight: 500,
                    color: 'rgba(0,0,0,0.4)', letterSpacing: '0.14em',
                    textTransform: 'uppercase' as const, textDecoration: 'none',
                }}>ORDINANCE SYSTEMS</Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                    {[
                        { name: 'Platform', path: '/hub' },
                        { name: 'Landing', path: '/landing' },
                        { name: 'Price Index', path: '/price-index' },
                    ].map(link => (
                        <Link key={link.name} href={link.path} style={{
                            fontSize: 12, fontWeight: 400, color: 'rgba(0,0,0,0.35)',
                            textDecoration: 'none', transition: 'color 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(0,0,0,0.8)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.35)'}
                        >{link.name}</Link>
                    ))}
                    <Link href="/signup/contractor" style={{
                        fontSize: 12, fontWeight: 500, color: '#111',
                        textDecoration: 'none', padding: '6px 16px', borderRadius: 6,
                        border: '1px solid rgba(0,0,0,0.12)', transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}
                    >Apply Now</Link>
                </div>
            </nav>

            {/* ═══════ HERO ═══════ */}
            <section style={{ padding: '100px 48px 80px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                <div style={{
                    fontFamily: mono, fontSize: 10, fontWeight: 500,
                    color: 'rgba(0,0,0,0.2)', letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const, marginBottom: 40,
                }}>FOUNDING PROGRAM</div>

                <h1 style={{
                    fontSize: 'clamp(48px, 7vw, 72px)', fontWeight: 300, lineHeight: 1.0,
                    letterSpacing: '-0.04em', margin: '0 0 20px',
                }}>
                    Founding<br />
                    <span style={{ color: 'rgba(0,0,0,0.15)', fontStyle: 'italic' }}>Twenty.</span>
                </h1>

                <p style={{
                    fontSize: 15, color: 'rgba(0,0,0,0.35)', lineHeight: 1.8,
                    maxWidth: 420, margin: '0 auto 48px',
                }}>
                    We are selecting 20 design firms to build Roof with us.
                    Free setup. Free SaaS. Forever.
                </p>

                {/* Slot Counter */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' as const, maxWidth: 480, margin: '0 auto 20px' }}>
                    {Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
                        const taken = i < TAKEN_SLOTS;
                        const isHovered = hoveredSlot === i;
                        return (
                            <div
                                key={i}
                                onMouseEnter={() => setHoveredSlot(i)}
                                onMouseLeave={() => setHoveredSlot(null)}
                                style={{
                                    width: 36, height: 36, borderRadius: 4,
                                    background: taken ? '#111' : isHovered ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.03)',
                                    border: taken ? '1px solid #111' : '1px solid rgba(0,0,0,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 10, fontWeight: 500, fontFamily: mono,
                                    color: taken ? '#fff' : 'rgba(0,0,0,0.2)',
                                    transition: 'all 0.2s ease',
                                    cursor: taken ? 'default' : 'pointer',
                                }}
                            >
                                {taken ? '✓' : i + 1}
                            </div>
                        );
                    })}
                </div>
                <div style={{ fontFamily: mono, fontSize: 11, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.05em' }}>
                    {TAKEN_SLOTS} claimed · {remaining} remaining
                </div>
            </section>

            {/* ═══════ THE DEAL ═══════ */}
            <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 48px 80px' }}>
                <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 16 }}>THE DEAL</div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 20 }}>
                    {[
                        { value: '$0', label: 'Setup Fee', sub: 'Forever, not just year 1' },
                        { value: '$0', label: 'Monthly Fee', sub: 'No SaaS charge. Ever.' },
                        { value: '2%', label: 'Our Leads Only', sub: 'Your own leads = 0%' },
                    ].map((item, i) => (
                        <div key={i} style={{ textAlign: 'center', padding: '36px 20px', background: '#fafafa' }}>
                            <div style={{ fontSize: 32, fontWeight: 300, color: '#111', letterSpacing: '-0.03em' }}>{item.value}</div>
                            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', fontWeight: 600, marginTop: 8 }}>{item.label}</div>
                            <div style={{ fontFamily: mono, fontSize: 9, color: 'rgba(0,0,0,0.2)', marginTop: 6, letterSpacing: '0.03em' }}>{item.sub}</div>
                        </div>
                    ))}
                </div>

                <div style={{ padding: '16px 0', fontSize: 12, color: 'rgba(0,0,0,0.3)', lineHeight: 1.8, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    We only make money when you make money. Commission applies only to leads we bring you through Roof.
                    Your warm referrals, repeat clients, and self-sourced leads cost you 0%. Commission drops to 0.5% at volume.
                </div>
            </section>

            {/* ═══════ WHAT YOU GET ═══════ */}
            <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 48px 80px' }}>
                <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 16 }}>WHAT YOU GET</div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    {BENEFITS.map(b => (
                        <div key={b.title} className="benefit-row" style={{
                            display: 'grid', gridTemplateColumns: '40px 1fr',
                            alignItems: 'start', padding: '20px 0',
                            borderBottom: '1px solid rgba(0,0,0,0.06)',
                        }}>
                            <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 400, color: 'rgba(0,0,0,0.12)', letterSpacing: '0.05em', paddingTop: 2 }}>{b.num}</span>
                            <div>
                                <div className="b-title" style={{ fontSize: 15, fontWeight: 500, color: 'rgba(0,0,0,0.6)', marginBottom: 4, transition: 'color 0.3s' }}>{b.title}</div>
                                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.3)', lineHeight: 1.7 }}>{b.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════ COMPARISON TABLE ═══════ */}
            <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 48px 80px' }}>
                <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 16 }}>FOUNDING vs STANDARD</div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 140px', padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                        <span></span>
                        <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.2)', textAlign: 'center', letterSpacing: '0.1em' }}>STANDARD</span>
                        <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.6)', textAlign: 'center', letterSpacing: '0.1em' }}>FOUNDING 20</span>
                    </div>
                    {COMPARISON.map((row, i) => (
                        <div key={row.metric} style={{
                            display: 'grid', gridTemplateColumns: '1fr 140px 140px',
                            padding: '12px 0', borderBottom: i < COMPARISON.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                        }}>
                            <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', fontWeight: 400 }}>{row.metric}</span>
                            <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.2)', textAlign: 'center', fontFamily: mono }}>{row.others}</span>
                            <span style={{ fontSize: 12, color: '#111', textAlign: 'center', fontWeight: 600, fontFamily: mono }}>{row.founding}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════ WHO WE'RE LOOKING FOR ═══════ */}
            <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 48px 80px' }}>
                <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 16 }}>WHO WE&apos;RE LOOKING FOR</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 28 }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 16 }}>Ideal fit</div>
                        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.35)', lineHeight: 2.0 }}>
                            Active ID firms (2+ projects running)<br />
                            Based in Singapore or Johor Bahru<br />
                            Willing to give honest feedback<br />
                            Open to trying new tools
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 16 }}>Not a fit</div>
                        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.35)', lineHeight: 2.0 }}>
                            Firms that only want leads<br />
                            One-person operations<br />
                            Fewer than 3 projects per year
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════ CTA ═══════ */}
            <section style={{ maxWidth: 700, margin: '0 auto', padding: '60px 48px 80px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 12px', lineHeight: 1.1 }}>
                    Claim your spot.<br />
                    <span style={{ color: 'rgba(0,0,0,0.15)' }}>Build with us.</span>
                </h2>
                <p style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.25)', margin: '0 0 36px', letterSpacing: '0.03em' }}>
                    {remaining} of {TOTAL_SLOTS} spots remaining · Pricing locked forever
                </p>
                <Link href="/signup/contractor" style={{
                    display: 'inline-block', padding: '14px 48px', fontSize: 13, fontWeight: 600,
                    color: '#fff', background: '#111', textDecoration: 'none', borderRadius: 8, transition: 'all 0.3s',
                }}
                    onMouseEnter={e => e.currentTarget.style.background = '#333'}
                    onMouseLeave={e => e.currentTarget.style.background = '#111'}
                >Apply as Founding Firm →</Link>
            </section>

            {/* ═══════ FOOTER ═══════ */}
            <footer style={{ padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.2)', letterSpacing: '0.05em' }}>© 2026 ORDINANCE SYSTEMS · SINGAPORE</span>
                <div style={{ display: 'flex', gap: 24 }}>
                    {[
                        { label: 'Landing', href: '/landing' },
                        { label: 'Platform', href: '/hub' },
                        { label: 'Sign Up', href: '/signup' },
                    ].map(link => (
                        <Link key={link.label} href={link.href}
                            style={{ fontSize: 11, color: 'rgba(0,0,0,0.2)', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.2)'}
                        >{link.label}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
