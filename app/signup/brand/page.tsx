'use client';

import Link from 'next/link';
import { useState } from 'react';

const PRODUCT_CATEGORIES = [
    'Tiles & Stone', 'Timber & Laminate', 'Quartz & Solid Surface',
    'Sanitary Ware & Fittings', 'Kitchen Appliances', 'Lighting',
    'Paint & Coatings', 'Hardware & Ironmongery', 'Glass & Mirrors',
    'Curtains & Blinds', 'Air Conditioning', 'Smart Home / IoT',
    'Furniture & Soft Furnishings', 'Wallpaper & Wall Panels',
    'Doors & Windows', 'Waterproofing Products',
];
const BRAND_TYPES = ['Manufacturer', 'Authorized Distributor', 'Exclusive Agent (SG)', 'Retailer / Showroom', 'Direct Importer'];
const MARKETS = ['Singapore', 'Malaysia', 'Both SG & MY'];

export default function BrandSignup() {
    const [form, setForm] = useState({
        brand: '', company: '', uen: '', contact: '', email: '', phone: '', website: '',
        brandType: '', categories: [] as string[], market: '', showroom: '', tradePricing: false,
    });
    const [honeypot, setHoneypot] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    const handleSubmit = async () => {
        if (!form.brand || !form.contact) return;
        setIsSubmitting(true);
        setMessage('');
        try {
            const res = await fetch('/api/submit/brand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    brand_name: form.brand,
                    company_name: form.company,
                    uen: form.uen,
                    contact_person: form.contact,
                    email: form.email,
                    phone: form.phone,
                    website: form.website,
                    brand_type: form.brandType,
                    categories: form.categories,
                    market: form.market,
                    showroom: form.showroom,
                    trade_pricing: form.tradePricing,
                    _website: honeypot,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.error || 'Something went wrong.');
                setMessageType('error');
            } else {
                setMessage('Application submitted! We will review within 48 hours.');
                setMessageType('success');
            }
        } catch {
            setMessage('Connection error. Please try again.');
            setMessageType('error');
        }
        setIsSubmitting(false);
    };

    const toggleCat = (cat: string) => setForm(p => ({ ...p, categories: p.categories.includes(cat) ? p.categories.filter(c => c !== cat) : [...p.categories, cat] }));

    const inputStyle = {
        width: '100%', padding: '12px 16px', fontSize: 13, fontFamily: f,
        border: '1px solid rgba(0,0,0,0.15)', borderRadius: 6,
        background: 'transparent', color: '#111', outline: 'none',
        transition: 'border-color 0.2s', boxSizing: 'border-box' as const,
    };
    const labelStyle = {
        fontFamily: mono, fontSize: 9, fontWeight: 600 as const,
        color: 'rgba(0,0,0,0.55)', letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        display: 'block' as const, marginBottom: 8,
    };
    const selectStyle = { ...inputStyle, cursor: 'pointer' as const, appearance: 'none' as const };
    const chipStyle = (active: boolean) => ({
        fontSize: 11, padding: '6px 14px', borderRadius: 20, cursor: 'pointer' as const,
        border: `1px solid ${active ? '#111' : 'rgba(0,0,0,0.12)'}`,
        background: active ? '#111' : 'transparent',
        color: active ? '#fff' : 'rgba(0,0,0,0.6)', fontWeight: active ? 600 : 400 as const,
        transition: 'all 0.15s', fontFamily: f, display: 'inline-block' as const,
    });

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                input:focus, select:focus { border-color: rgba(0,0,0,0.5) !important; }
                input::placeholder { color: rgba(0,0,0,0.3); }
            `}</style>

            {/* TOP BAR */}
            <nav style={{
                padding: '0 48px', height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}>
                <Link href="/landing" style={{
                    fontFamily: mono, fontSize: 11, fontWeight: 500,
                    color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em',
                    textTransform: 'uppercase' as const, textDecoration: 'none',
                }}>ROOF</Link>
                <Link href="/join" style={{ fontSize: 12, fontWeight: 400, color: 'rgba(0,0,0,0.5)', textDecoration: 'none' }}>
                    ← Back to role selection
                </Link>
            </nav>

            {/* CONTENT */}
            <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 48px 80px' }}>
                <div style={{
                    fontFamily: mono, fontSize: 10, fontWeight: 500,
                    color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const, marginBottom: 24,
                }}>BRAND PARTNER APPLICATION</div>

                <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                    List your<br />
                    <span style={{ color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>products.</span>
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', margin: '0 0 48px', lineHeight: 1.6 }}>
                    Get specified by designers. Reach verified trade channels.
                </p>

                {/* Honeypot */}
                <div style={{ position: 'absolute', left: '-9999px' }}>
                    <input type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>

                {/* BRAND INFO */}
                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 20, paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>BRAND DETAILS</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                        <label style={labelStyle}>Brand Name</label>
                        <input style={inputStyle} value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} placeholder="e.g. Hansgrohe, Laminam" />
                    </div>
                    <div>
                        <label style={labelStyle}>Company / Distributor</label>
                        <input style={inputStyle} value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="ABC Distribution Pte Ltd" />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                        <label style={labelStyle}>UEN / SSM No.</label>
                        <input style={inputStyle} value={form.uen} onChange={e => setForm(p => ({ ...p, uen: e.target.value }))} placeholder="201XXXXXXX" />
                    </div>
                    <div>
                        <label style={labelStyle}>Relationship to Brand</label>
                        <select style={{ ...selectStyle, color: form.brandType ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.brandType} onChange={e => setForm(p => ({ ...p, brandType: e.target.value }))}>
                            <option value="">Select type</option>
                            {BRAND_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>

                {/* CONTACT */}
                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 20, paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>CONTACT</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                        <label style={labelStyle}>Contact Person</label>
                        <input style={inputStyle} value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} placeholder="Sales rep name" />
                    </div>
                    <div>
                        <label style={labelStyle}>Phone</label>
                        <input style={inputStyle} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+65 9xxx xxxx" />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                        <label style={labelStyle}>Email</label>
                        <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="sales@brand.com" />
                    </div>
                    <div>
                        <label style={labelStyle}>Website</label>
                        <input style={inputStyle} value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://..." />
                    </div>
                </div>

                {/* PRODUCT CATEGORIES */}
                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 20, paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>PRODUCTS</div>

                <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Product Categories (select all)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {PRODUCT_CATEGORIES.map(cat => (
                            <span key={cat} onClick={() => toggleCat(cat)} style={chipStyle(form.categories.includes(cat))}>{cat}</span>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                        <label style={labelStyle}>Market Coverage</label>
                        <select style={{ ...selectStyle, color: form.market ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.market} onChange={e => setForm(p => ({ ...p, market: e.target.value }))}>
                            <option value="">Select market</option>
                            {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Showroom (optional)</label>
                        <input style={inputStyle} value={form.showroom} onChange={e => setForm(p => ({ ...p, showroom: e.target.value }))} placeholder="e.g. 100 Tras St, #03-01" />
                    </div>
                </div>

                {/* Trade Pricing Toggle */}
                <div style={{
                    marginBottom: 32, padding: '16px', background: 'rgba(0,0,0,0.02)', borderRadius: 8,
                    border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                }} onClick={() => setForm(p => ({ ...p, tradePricing: !p.tradePricing }))}>
                    <div style={{
                        width: 18, height: 18, borderRadius: 4,
                        border: `1.5px solid ${form.tradePricing ? '#111' : 'rgba(0,0,0,0.2)'}`,
                        background: form.tradePricing ? '#111' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 11, fontWeight: 700,
                    }}>{form.tradePricing ? '✓' : ''}</div>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>Offer Trade Pricing</div>
                        <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)' }}>Show special pricing visible only to verified ID firms</div>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !form.brand || !form.contact}
                    style={{
                        width: '100%', padding: '14px', fontSize: 13, fontWeight: 600, fontFamily: f,
                        color: '#fff', background: isSubmitting ? 'rgba(0,0,0,0.3)' : '#111',
                        border: 'none', borderRadius: 6,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                    }}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Brand Application →'}
                </button>

                {message && (
                    <div style={{
                        marginTop: 16, padding: '10px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                        background: messageType === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(220,38,38,0.06)',
                        color: messageType === 'success' ? '#059669' : 'rgba(220,38,38,0.8)',
                        border: `1px solid ${messageType === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(220,38,38,0.1)'}`,
                    }}>{message}</div>
                )}

                <p style={{
                    fontFamily: mono, fontSize: 9, color: 'rgba(0,0,0,0.4)', textAlign: 'center',
                    marginTop: 16, letterSpacing: '0.03em',
                }}>
                    Get featured in the Roof material catalog · Designers specify your products in quotes
                </p>
            </div>

            {/* FOOTER */}
            <footer style={{
                padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>
                    © 2026 ROOF · SINGAPORE
                </span>
            </footer>
        </div>
    );
}
