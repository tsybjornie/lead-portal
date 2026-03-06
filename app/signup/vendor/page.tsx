'use client';

import Link from 'next/link';
import { useState } from 'react';

const PRODUCT_CATEGORIES = [
    'Tiles & Stone', 'Timber & Laminate', 'Sanitary Ware', 'Lighting & Electrical',
    'Kitchen Appliances', 'Paint & Coatings', 'Hardware & Fittings', 'Glass & Mirrors',
    'Curtains & Blinds', 'Air Conditioning', 'Smart Home', 'Furniture', 'Other',
];
const DELIVERY_ZONES = ['Island-wide SG', 'Central SG', 'East SG', 'West SG', 'North SG', 'JB / MY', 'Overseas (import)'];
const BUSINESS_TYPES = ['Manufacturer', 'Distributor', 'Retailer', 'Wholesaler', 'Direct Importer'];

export default function VendorSignup() {
    const [form, setForm] = useState({ company: '', uen: '', contact: '', email: '', phone: '', website: '', categories: [] as string[], bizType: '', zones: [] as string[], moq: '', notes: '' });
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const inputStyle = { width: '100%', padding: '12px 14px', fontSize: 14, fontFamily: f, border: '1.5px solid #E9E9E7', borderRadius: 8, outline: 'none', background: 'white', boxSizing: 'border-box' as const };
    const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: '#6B6A67', marginBottom: 6, display: 'block' as const };
    const selectStyle = { ...inputStyle, cursor: 'pointer' as const, appearance: 'none' as const };
    const chipStyle = (active: boolean, color: string) => ({
        fontSize: 12, padding: '6px 12px', borderRadius: 20, cursor: 'pointer',
        border: `1.5px solid ${active ? color : '#E9E9E7'}`,
        background: active ? `${color}10` : 'white',
        color: active ? color : '#6B6A67', fontWeight: active ? 600 : 400,
        transition: 'all 0.15s',
    });

    const toggleCat = (cat: string) => {
        setForm(p => ({ ...p, categories: p.categories.includes(cat) ? p.categories.filter(c => c !== cat) : [...p.categories, cat] }));
    };
    const toggleZone = (zone: string) => {
        setForm(p => ({ ...p, zones: p.zones.includes(zone) ? p.zones.filter(z => z !== zone) : [...p.zones, zone] }));
    };

    return (
        <div style={{ fontFamily: f, background: '#FAFAF9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
            <div style={{ maxWidth: 560, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Link href="/join" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#37352F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 800 }}>R</div>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#37352F' }}>Roof</span>
                    </Link>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#37352F', margin: '0 0 8px' }}>Join as Vendor</h1>
                    <p style={{ fontSize: 14, color: '#9B9A97', margin: 0 }}>List your products and receive POs from verified ID firms on Roof.</p>
                </div>

                <div style={{ background: 'white', borderRadius: 16, padding: '32px 28px', border: '1px solid #E9E9E7' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Company Name</label>
                            <input style={inputStyle} value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="ABC Building Supplies Pte Ltd" />
                        </div>
                        <div>
                            <label style={labelStyle}>UEN / SSM No.</label>
                            <input style={inputStyle} value={form.uen} onChange={e => setForm(p => ({ ...p, uen: e.target.value }))} placeholder="201XXXXXXX" />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Contact Person</label>
                            <input style={inputStyle} value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} placeholder="John Tan" />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input style={inputStyle} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+65 9xxx xxxx" />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="sales@company.com" />
                        </div>
                        <div>
                            <label style={labelStyle}>Business Type</label>
                            <select style={selectStyle} value={form.bizType} onChange={e => setForm(p => ({ ...p, bizType: e.target.value }))}>
                                <option value="">Select type</option>
                                {BUSINESS_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Product Categories (select all that apply)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {PRODUCT_CATEGORIES.map(cat => (
                                <span key={cat} onClick={() => toggleCat(cat)} style={chipStyle(form.categories.includes(cat), '#F59E0B')}>{cat}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Delivery Zones</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {DELIVERY_ZONES.map(zone => (
                                <span key={zone} onClick={() => toggleZone(zone)} style={chipStyle(form.zones.includes(zone), '#F59E0B')}>{zone}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Website (optional)</label>
                            <input style={inputStyle} value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://..." />
                        </div>
                        <div>
                            <label style={labelStyle}>Min. Order Qty (optional)</label>
                            <input style={inputStyle} value={form.moq} onChange={e => setForm(p => ({ ...p, moq: e.target.value }))} placeholder="e.g. 10 cartons" />
                        </div>
                    </div>
                    <button style={{
                        width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, fontFamily: f,
                        color: 'white', background: '#F59E0B', border: 'none', borderRadius: 10, cursor: 'pointer',
                    }}>
                        Submit Vendor Application →
                    </button>
                    <p style={{ fontSize: 11, color: '#C8C7C3', textAlign: 'center', marginTop: 12 }}>
                        Applications reviewed within 48 hours • No listing fees
                    </p>
                </div>
            </div>
        </div>
    );
}
