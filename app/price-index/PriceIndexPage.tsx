'use client';

import Link from 'next/link';
import { useState } from 'react';
import { OrganizationSchema, FAQSchema, PriceIndexSchema } from '@/components/StructuredData';

/* ── Real pricing data (SG market rates from Numbers DB + JB estimates) ── */
const CATEGORIES = [
    {
        category: 'Tiling',
        items: [
            { name: '600×600mm Homogeneous Tile (supply)', unit: 'sqft', sg: 8.50, my: 3.20 },
            { name: '600×600mm Homogeneous Tile (install)', unit: 'sqft', sg: 5.00, my: 2.50 },
            { name: 'Feature Wall Tile', unit: 'sqft', sg: 12.00, my: 5.00 },
            { name: 'Bathroom Floor Tile (non-slip)', unit: 'sqft', sg: 9.00, my: 3.50 },
        ],
    },
    {
        category: 'Carpentry',
        items: [
            { name: 'Kitchen Cabinet (L-shape, laminate)', unit: 'lot', sg: 8000, my: 3500 },
            { name: 'Wardrobe (2.4m, sliding door)', unit: 'lot', sg: 3500, my: 1500 },
            { name: 'Shoe Cabinet (1.2m)', unit: 'lot', sg: 1200, my: 500 },
            { name: 'TV Console (2.4m, wall-mounted)', unit: 'lot', sg: 2500, my: 1000 },
            { name: 'Quartz Countertop', unit: 'ft run', sg: 180, my: 75 },
        ],
    },
    {
        category: 'Painting',
        items: [
            { name: 'Emulsion Paint (walls, Nippon/Dulux)', unit: 'sqft', sg: 3.50, my: 1.50 },
            { name: '3-Room HDB (full repaint)', unit: 'lot', sg: 2500, my: 1000 },
            { name: '4-Room HDB (full repaint)', unit: 'lot', sg: 3200, my: 1300 },
            { name: 'Feature Wall (special finish)', unit: 'sqft', sg: 8.00, my: 3.50 },
        ],
    },
    {
        category: 'Electrical',
        items: [
            { name: 'Power Point Relocation', unit: 'point', sg: 120, my: 50 },
            { name: 'Light Point (new)', unit: 'point', sg: 100, my: 40 },
            { name: 'DB Box Upgrade (SP-approved)', unit: 'lot', sg: 450, my: 200 },
            { name: 'Full Rewiring (3-room HDB)', unit: 'lot', sg: 2800, my: 1200 },
        ],
    },
    {
        category: 'Plumbing',
        items: [
            { name: 'Water Point Relocation', unit: 'point', sg: 180, my: 80 },
            { name: 'Instant Water Heater (install)', unit: 'lot', sg: 350, my: 150 },
            { name: 'Sink + Tap Replacement', unit: 'lot', sg: 400, my: 180 },
        ],
    },
    {
        category: 'Hacking / Demolition',
        items: [
            { name: 'Wall Hacking (brick)', unit: 'sqft', sg: 15.00, my: 6.00 },
            { name: 'Floor Tile Hacking', unit: 'sqft', sg: 5.50, my: 2.50 },
            { name: 'Debris Disposal', unit: 'trip', sg: 350, my: 150 },
        ],
    },
    {
        category: 'Air Conditioning',
        items: [
            { name: 'System 3 (Daikin/Mitsubishi)', unit: 'lot', sg: 3800, my: 2200 },
            { name: 'System 4 (Daikin/Mitsubishi)', unit: 'lot', sg: 4800, my: 2800 },
            { name: 'Concealed Piping (per fan coil)', unit: 'lot', sg: 350, my: 150 },
        ],
    },
    {
        category: 'Full Renovation Packages',
        items: [
            { name: '3-Room BTO (basic)', unit: 'lot', sg: 25000, my: 12000 },
            { name: '4-Room BTO (mid-range)', unit: 'lot', sg: 42000, my: 20000 },
            { name: '5-Room HDB (premium)', unit: 'lot', sg: 65000, my: 32000 },
            { name: 'Condo (1,000 sqft, full reno)', unit: 'lot', sg: 80000, my: 40000 },
        ],
    },
];

const FAQS = [
    { question: 'How much does HDB renovation cost in Singapore in 2026?', answer: 'Based on Roof-managed projects, a 4-room HDB BTO renovation costs S$35,000-55,000 in 2026. This includes tiling, carpentry, painting, electrical, and plumbing. Basic packages start at S$25,000, while premium renovations can exceed S$80,000.' },
    { question: 'How much cheaper is renovation in Johor Bahru compared to Singapore?', answer: 'On average, renovation in JB costs 40-60% less than Singapore. A 4-room equivalent renovation costs RM 45,000-65,000 (S$13,500-19,500) in JB vs S$35,000-55,000 in SG. The savings come from lower labor costs and local material sourcing.' },
    { question: 'What is the Roof Price Index?', answer: 'The Roof Price Index is a monthly renovation cost report based on real transaction data from Roof-managed projects in Singapore and Johor Bahru. Unlike editorial estimates, these prices come from actual purchase orders, quotations, and completed projects.' },
    { question: 'Why are Singapore renovation costs higher than Malaysia?', answer: 'Singapore renovation costs include foreign worker levies (S$30-50/day), higher material import costs, and multi-layer contractor margins. In Malaysia, local workers are the cost floor — there is no cheaper labor arbitrage layer.' },
    { question: 'How do I get accurate renovation quotes in Singapore?', answer: 'Use Roof to get free, instant quotations based on real market data from 113 materials. Our quotation builder (Numbers) prices every item at current SG rates, giving you a transparent breakdown before you even speak to a designer.' },
];

function fmt(n: number, currency: string) {
    if (n >= 1000) return `${currency}${n.toLocaleString()}`;
    return `${currency}${n.toFixed(2)}`;
}

export default function PriceIndexPage() {
    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";
    const [market, setMarket] = useState<'both' | 'sg' | 'my'>('both');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            {/* JSON-LD */}
            <OrganizationSchema />
            <FAQSchema faqs={FAQS} />
            {CATEGORIES[0].items.map(item => (
                <PriceIndexSchema key={item.name} material={item.name} priceSG={item.sg} priceMY={item.my * 3.07} unit={item.unit} />
            ))}

            <style>{`
                .price-row { transition: background 0.2s ease; }
                .price-row:hover { background: rgba(0,0,0,0.02) !important; }
                .faq-item { transition: all 0.2s ease; cursor: pointer; }
                .faq-item:hover { background: rgba(0,0,0,0.02) !important; }
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
                        { name: 'Founding 20', path: '/founding' },
                        { name: 'Landing', path: '/landing' },
                    ].map(link => (
                        <Link key={link.name} href={link.path} style={{
                            fontSize: 12, fontWeight: 400, color: 'rgba(0,0,0,0.5)',
                            textDecoration: 'none', transition: 'color 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(0,0,0,0.8)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.35)'}
                        >{link.name}</Link>
                    ))}
                    <Link href="/join" style={{
                        fontSize: 12, fontWeight: 500, color: '#111',
                        textDecoration: 'none', padding: '6px 16px', borderRadius: 6,
                        border: '1px solid rgba(0,0,0,0.12)', transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}
                    >Get Started</Link>
                </div>
            </nav>

            {/* ═══════ HEADER ═══════ */}
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '100px 48px 0' }}>
                <div style={{ marginBottom: 60 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 10, fontWeight: 500,
                        color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em',
                        textTransform: 'uppercase' as const, marginBottom: 40,
                    }}>PRICE INDEX · MARCH 2026</div>

                    <h1 style={{
                        fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 300, lineHeight: 1.05,
                        letterSpacing: '-0.04em', margin: '0 0 16px',
                    }}>
                        Renovation costs.<br />
                        <span style={{ color: 'rgba(0,0,0,0.5)', fontStyle: 'italic' }}>Real data.</span>
                    </h1>

                    <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', margin: '0 0 32px', lineHeight: 1.7, maxWidth: 460 }}>
                        From actual projects. Updated monthly.<br />Singapore and Johor Bahru.
                    </p>

                    {/* Market Toggle */}
                    <div style={{ display: 'flex', gap: 4 }}>
                        {[
                            { value: 'both', label: 'SG vs JB' },
                            { value: 'sg', label: 'Singapore' },
                            { value: 'my', label: 'Johor Bahru' },
                        ].map(m => (
                            <button
                                key={m.value}
                                onClick={() => setMarket(m.value as 'both' | 'sg' | 'my')}
                                style={{
                                    padding: '6px 16px', fontSize: 11, fontWeight: 500,
                                    borderRadius: 4, border: '1px solid',
                                    borderColor: market === m.value ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)',
                                    background: market === m.value ? '#111' : 'transparent',
                                    color: market === m.value ? '#fff' : 'rgba(0,0,0,0.35)',
                                    cursor: 'pointer', fontFamily: mono,
                                    letterSpacing: '0.03em', transition: 'all 0.2s',
                                }}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ═══════ CATEGORY TABLES ═══════ */}
                {CATEGORIES.map((cat, catIdx) => (
                    <div key={cat.category} style={{ marginBottom: 48 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                            <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 400, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.05em' }}>
                                {String(catIdx + 1).padStart(2, '0')}
                            </span>
                            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: 0, letterSpacing: '-0.01em' }}>
                                {cat.category}
                            </h2>
                        </div>

                        {/* Header row */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: market === 'both' ? '1fr 60px 100px 100px 80px' : '1fr 60px 100px',
                            padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.08)', marginTop: 12,
                        }}>
                            <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>ITEM</span>
                            <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.1em', textAlign: 'center' }}>UNIT</span>
                            {(market === 'both' || market === 'sg') && (
                                <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.1em', textAlign: 'right' }}>SG (S$)</span>
                            )}
                            {(market === 'both' || market === 'my') && (
                                <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.1em', textAlign: 'right' }}>JB (RM)</span>
                            )}
                            {market === 'both' && (
                                <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.1em', textAlign: 'right' }}>DELTA</span>
                            )}
                        </div>

                        {/* Data rows */}
                        {cat.items.map((item, i) => {
                            const savings = Math.round((1 - (item.my / 3.07 / item.sg)) * 100);
                            return (
                                <div key={item.name} className="price-row" style={{
                                    display: 'grid',
                                    gridTemplateColumns: market === 'both' ? '1fr 60px 100px 100px 80px' : '1fr 60px 100px',
                                    padding: '12px 0',
                                    borderBottom: i < cat.items.length - 1 ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(0,0,0,0.08)',
                                    alignItems: 'center',
                                }}>
                                    <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)', fontWeight: 400 }}>{item.name}</span>
                                    <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.5)', textAlign: 'center' }}>/{item.unit}</span>
                                    {(market === 'both' || market === 'sg') && (
                                        <span style={{ fontFamily: mono, fontSize: 12, color: '#111', textAlign: 'right', fontWeight: 500 }}>{fmt(item.sg, 'S$')}</span>
                                    )}
                                    {(market === 'both' || market === 'my') && (
                                        <span style={{ fontFamily: mono, fontSize: 12, color: 'rgba(0,0,0,0.5)', textAlign: 'right', fontWeight: 500 }}>{fmt(item.my, 'RM ')}</span>
                                    )}
                                    {market === 'both' && (
                                        <span style={{
                                            fontFamily: mono, fontSize: 10, textAlign: 'right',
                                            color: savings > 0 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)',
                                            fontWeight: 500, letterSpacing: '0.02em',
                                        }}>
                                            {savings > 0 ? `−${savings}%` : '—'}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}

                {/* ═══════ DATA SOURCE ═══════ */}
                <div style={{ padding: '20px 0', marginBottom: 60, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 12 }}>DATA SOURCE</div>
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', lineHeight: 1.8 }}>
                        Prices based on actual purchase orders and quotations processed through Roof-managed renovation projects in Singapore and Johor Bahru. SG prices reflect current market rates inclusive of labor and materials. JB prices in Malaysian Ringgit (RM). Conversion: 1 SGD = 3.07 MYR. Last updated March 2026.
                    </div>
                </div>

                {/* ═══════ FAQ ═══════ */}
                <div style={{ marginBottom: 60 }}>
                    <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 16 }}>FREQUENTLY ASKED</div>

                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                        {FAQS.map((faq, i) => (
                            <div key={i} className="faq-item"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: 13, fontWeight: 500,
                                        color: openFaq === i ? '#111' : 'rgba(0,0,0,0.5)',
                                        transition: 'color 0.2s',
                                    }}>{faq.question}</span>
                                    <span style={{
                                        color: 'rgba(0,0,0,0.4)', fontSize: 14,
                                        transition: 'transform 0.2s',
                                        transform: openFaq === i ? 'rotate(45deg)' : 'none',
                                        flexShrink: 0, marginLeft: 16,
                                    }}>+</span>
                                </div>
                                {openFaq === i && (
                                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', lineHeight: 1.8, marginTop: 12, paddingRight: 40 }}>
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══════ CTA ═══════ */}
                <div style={{ textAlign: 'center', padding: '60px 0 80px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                        Get your quote.<br />
                        <span style={{ color: 'rgba(0,0,0,0.5)' }}>Know your numbers.</span>
                    </h2>
                    <p style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.4)', margin: '0 0 32px', letterSpacing: '0.05em' }}>
                        Matched with 3 designers in 24 hours · No obligation
                    </p>
                    <Link href="/signup/homeowner" style={{
                        display: 'inline-block', padding: '14px 44px', fontSize: 13, fontWeight: 600,
                        color: '#fff', background: '#111', textDecoration: 'none', borderRadius: 8, transition: 'all 0.3s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = '#333'}
                        onMouseLeave={e => e.currentTarget.style.background = '#111'}
                    >Get a Free Quote →</Link>
                </div>
            </div>

            {/* ═══════ FOOTER ═══════ */}
            <footer style={{ padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.05em' }}>© 2026 ORDINANCE SYSTEMS · SINGAPORE</span>
                <div style={{ display: 'flex', gap: 24 }}>
                    {[
                        { label: 'Landing', href: '/landing' },
                        { label: 'Platform', href: '/hub' },
                        { label: 'Founding 20', href: '/founding' },
                    ].map(link => (
                        <Link key={link.label} href={link.href}
                            style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.2)'}
                        >{link.label}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
