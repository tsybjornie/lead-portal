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
        brandType: '', categories: [] as string[], market: '', showroom: '', tradePricing: false, notes: '',
    });
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const inputStyle = { width: '100%', padding: '12px 14px', fontSize: 14, fontFamily: f, border: '1.5px solid #E9E9E7', borderRadius: 8, outline: 'none', background: 'white', boxSizing: 'border-box' as const };
    const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: '#6B6A67', marginBottom: 6, display: 'block' as const };
    const selectStyle = { ...inputStyle, cursor: 'pointer' as const, appearance: 'none' as const };
    const chipStyle = (active: boolean) => ({
        fontSize: 12, padding: '6px 12px', borderRadius: 20, cursor: 'pointer',
        border: `1.5px solid ${active ? '#EC4899' : '#E9E9E7'}`,
        background: active ? '#FDF2F8' : 'white',
        color: active ? '#BE185D' : '#6B6A67', fontWeight: active ? 600 : 400,
        transition: 'all 0.15s',
    });

    const toggleCat = (cat: string) => setForm(p => ({ ...p, categories: p.categories.includes(cat) ? p.categories.filter(c => c !== cat) : [...p.categories, cat] }));

    return (
        <div style={{ fontFamily: f, background: '#FAFAF9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
            <div style={{ maxWidth: 560, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Link href="/join" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#37352F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 800 }}>R</div>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#37352F' }}>Roof</span>
                    </Link>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#37352F', margin: '0 0 8px' }}>Join as Brand Partner</h1>
                    <p style={{ fontSize: 14, color: '#9B9A97', margin: 0 }}>List your products. Get specified by designers. Reach verified trade channels.</p>
                </div>

                <div style={{ background: 'white', borderRadius: 16, padding: '32px 28px', border: '1px solid #E9E9E7' }}>
                    {/* Brand & Company */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Brand Name</label>
                            <input style={inputStyle} value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} placeholder="e.g. Hansgrohe, Laminam, Nippon" />
                        </div>
                        <div>
                            <label style={labelStyle}>Company / Distributor</label>
                            <input style={inputStyle} value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="ABC Distribution Pte Ltd" />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>UEN / SSM No.</label>
                            <input style={inputStyle} value={form.uen} onChange={e => setForm(p => ({ ...p, uen: e.target.value }))} placeholder="201XXXXXXX" />
                        </div>
                        <div>
                            <label style={labelStyle}>Relationship to Brand</label>
                            <select style={selectStyle} value={form.brandType} onChange={e => setForm(p => ({ ...p, brandType: e.target.value }))}>
                                <option value="">Select type</option>
                                {BRAND_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Contact */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Contact Person / Rep</label>
                            <input style={inputStyle} value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} placeholder="Sales rep name" />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input style={inputStyle} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+65 9xxx xxxx" />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="sales@brand.com" />
                        </div>
                        <div>
                            <label style={labelStyle}>Website</label>
                            <input style={inputStyle} value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://..." />
                        </div>
                    </div>

                    {/* Product Categories */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Product Categories (select all)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {PRODUCT_CATEGORIES.map(cat => (
                                <span key={cat} onClick={() => toggleCat(cat)} style={chipStyle(form.categories.includes(cat))}>{cat}</span>
                            ))}
                        </div>
                    </div>

                    {/* Market & Showroom */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Market Coverage</label>
                            <select style={selectStyle} value={form.market} onChange={e => setForm(p => ({ ...p, market: e.target.value }))}>
                                <option value="">Select market</option>
                                {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Showroom Address (optional)</label>
                            <input style={inputStyle} value={form.showroom} onChange={e => setForm(p => ({ ...p, showroom: e.target.value }))} placeholder="e.g. 100 Tras St, #03-01" />
                        </div>
                    </div>

                    {/* Trade Pricing Toggle */}
                    <div style={{
                        marginBottom: 24, padding: '16px', background: '#FDF2F8', borderRadius: 10,
                        border: '1px solid #FBCFE8', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                    }} onClick={() => setForm(p => ({ ...p, tradePricing: !p.tradePricing }))}>
                        <div style={{
                            width: 20, height: 20, borderRadius: 4,
                            border: `2px solid ${form.tradePricing ? '#EC4899' : '#D1D5DB'}`,
                            background: form.tradePricing ? '#EC4899' : 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: 12, fontWeight: 700,
                        }}>{form.tradePricing ? '✓' : ''}</div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F' }}>Offer Trade Pricing</div>
                            <div style={{ fontSize: 11, color: '#9B9A97' }}>Show special pricing visible only to verified ID firms on Roof</div>
                        </div>
                    </div>

                    <button style={{
                        width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, fontFamily: f,
                        color: 'white', background: '#EC4899', border: 'none', borderRadius: 10, cursor: 'pointer',
                    }}>
                        Submit Brand Application →
                    </button>
                    <p style={{ fontSize: 11, color: '#C8C7C3', textAlign: 'center', marginTop: 12 }}>
                        Get featured in the Roof material catalog • Designers can specify your products in quotes
                    </p>
                </div>
            </div>
        </div>
    );
}
