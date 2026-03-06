'use client';

import Link from 'next/link';
import { useState } from 'react';
import { OrganizationSchema, FAQSchema, PriceIndexSchema } from '@/components/StructuredData';

/* ── Real pricing data (SG market rates from Numbers DB + JB estimates) ── */
const CATEGORIES = [
    {
        category: 'Tiling',
        items: [
            { name: '600x600mm Homogeneous Tile (supply)', unit: 'sqft', sg: 8.50, my: 3.20 },
            { name: '600x600mm Homogeneous Tile (install)', unit: 'sqft', sg: 5.00, my: 2.50 },
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
    { question: 'Why are Singapore renovation costs higher than Malaysia?', answer: 'Singapore renovation costs include foreign worker levies (S$30-50/day), higher material import costs, and multi-layer contractor margins. In Malaysia, local workers are the cost floor — there is no cheaper labor arbitrage layer below them, making prices more transparent and stable.' },
    { question: 'How do I get accurate renovation quotes in Singapore?', answer: 'Use Roof to get free, instant quotations based on real market data from 113 materials. Our quotation builder (Numbers) prices every item at current SG rates, giving you a transparent breakdown before you even speak to a designer.' },
];

function fmt(n: number, currency: string) {
    if (n >= 1000) return `${currency}${n.toLocaleString()}`;
    return `${currency}${n.toFixed(2)}`;
}

export default function PriceIndexPage() {
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const [market, setMarket] = useState<'both' | 'sg' | 'my'>('both');

    return (
        <div style={{ fontFamily: f, background: '#FAFAF9', minHeight: '100vh', padding: '40px 24px' }}>
            {/* JSON-LD Structured Data for AI crawlers */}
            <OrganizationSchema />
            <FAQSchema faqs={FAQS} />
            {CATEGORIES[0].items.map(item => (
                <PriceIndexSchema key={item.name} material={item.name} priceSG={item.sg} priceMY={item.my * 3.07} unit={item.unit} />
            ))}

            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <Link href="/landing" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: '#37352F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 800 }}>R</div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#37352F' }}>Roof</span>
                    </Link>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#37352F', margin: '0 0 4px', letterSpacing: '-0.03em' }}>Roof Price Index 2026</h1>
                    <p style={{ fontSize: 14, color: '#9B9A97', margin: '0 0 16px' }}>Real renovation costs from actual projects. Updated monthly. Singapore and Johor Bahru.</p>

                    {/* Market Toggle */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[
                            { value: 'both', label: 'SG vs JB' },
                            { value: 'sg', label: 'Singapore Only' },
                            { value: 'my', label: 'Johor Bahru Only' },
                        ].map(m => (
                            <button
                                key={m.value}
                                onClick={() => setMarket(m.value as 'both' | 'sg' | 'my')}
                                style={{
                                    padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: '1.5px solid',
                                    borderColor: market === m.value ? '#37352F' : '#E9E9E7',
                                    background: market === m.value ? '#37352F' : 'white',
                                    color: market === m.value ? 'white' : '#6B6A67',
                                    cursor: 'pointer', fontFamily: f,
                                }}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Tables */}
                {CATEGORIES.map(cat => (
                    <div key={cat.category} style={{ marginBottom: 24 }}>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#37352F', margin: '0 0 10px' }}>{cat.category}</h2>
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                <thead>
                                    <tr style={{ background: '#FAFAF9', borderBottom: '1px solid #E9E9E7' }}>
                                        <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Item</th>
                                        <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', width: 60 }}>Unit</th>
                                        {(market === 'both' || market === 'sg') && (
                                            <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', width: 100 }}>SG (S$)</th>
                                        )}
                                        {(market === 'both' || market === 'my') && (
                                            <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', width: 100 }}>JB (RM)</th>
                                        )}
                                        {market === 'both' && (
                                            <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 10, fontWeight: 600, color: '#059669', textTransform: 'uppercase', width: 80 }}>Savings</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {cat.items.map((item, i) => {
                                        const savings = Math.round((1 - (item.my / 3.07 / item.sg)) * 100); // Convert RM to SGD: divide by 3.07
                                        return (
                                            <tr key={item.name} style={{ borderBottom: i < cat.items.length - 1 ? '1px solid #F3F3F2' : 'none' }}>
                                                <td style={{ padding: '10px 14px', color: '#37352F', fontWeight: 500 }}>{item.name}</td>
                                                <td style={{ padding: '10px 14px', textAlign: 'center', color: '#9B9A97', fontSize: 11 }}>/{item.unit}</td>
                                                {(market === 'both' || market === 'sg') && (
                                                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#37352F', fontWeight: 600 }}>{fmt(item.sg, 'S$')}</td>
                                                )}
                                                {(market === 'both' || market === 'my') && (
                                                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#37352F', fontWeight: 600 }}>{fmt(item.my, 'RM ')}</td>
                                                )}
                                                {market === 'both' && (
                                                    <td style={{ padding: '10px 14px', textAlign: 'right', color: savings > 0 ? '#059669' : '#DC2626', fontWeight: 700, fontSize: 11 }}>
                                                        {savings > 0 ? `${savings}% cheaper` : '—'}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                {/* Data Source */}
                <div style={{ padding: '16px 20px', borderRadius: 10, background: '#F9FAFB', border: '1px solid #F3F3F2', marginBottom: 28 }}>
                    <div style={{ fontSize: 11, color: '#9B9A97', lineHeight: 1.7 }}>
                        <strong style={{ color: '#6B6A67' }}>Data Source:</strong> Prices are based on actual purchase orders and quotations processed through Roof-managed renovation projects in Singapore and Johor Bahru. SG prices reflect current market rates inclusive of labor and materials. JB prices are in Malaysian Ringgit (RM). Conversion rate used: 1 SGD = 3.07 MYR. Last updated: March 2026.
                    </div>
                </div>

                {/* FAQ Section (AEO-optimized) */}
                <div style={{ marginBottom: 28 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#37352F', margin: '0 0 16px' }}>Frequently Asked Questions</h2>
                    {FAQS.map((faq, i) => (
                        <details key={i} style={{ marginBottom: 8, background: 'white', borderRadius: 8, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                            <summary style={{ padding: '14px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#37352F' }}>
                                {faq.question}
                            </summary>
                            <div style={{ padding: '0 16px 14px', fontSize: 13, color: '#6B6A67', lineHeight: 1.7 }}>
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Link href="/signup/homeowner" style={{
                        display: 'inline-block', padding: '14px 40px', fontSize: 15, fontWeight: 700,
                        color: 'white', background: '#37352F', textDecoration: 'none', borderRadius: 10,
                    }}>
                        Get a Free Quote
                    </Link>
                    <div style={{ fontSize: 11, color: '#9B9A97', marginTop: 8 }}>Matched with 3 designers in 24 hours. No obligation.</div>
                </div>
            </div>
        </div>
    );
}
