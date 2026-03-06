'use client';

import Link from 'next/link';
import { useState } from 'react';

const TRADE_TYPES = [
    'General Renovation', 'Painting', 'Plumbing', 'Electrical (LEW)',
    'Tiling & Flooring', 'Carpentry & Woodwork', 'Air-Con Installation',
    'Masonry / Hacking', 'Waterproofing', 'Ceiling & Partition',
    'Glass & Aluminium', 'Metal / Grille Work', 'Cleaning & Disposal',
];
const COMPANY_SIZES = ['Solo (1 person)', '2–5 workers', '6–15 workers', '16–50 workers', '50+ workers'];
const COVERAGE = ['Island-wide SG', 'Central', 'East', 'West', 'North', 'JB / Iskandar MY'];

export default function ContractorSignup() {
    const [form, setForm] = useState({ company: '', uen: '', contact: '', email: '', phone: '', bca: '', hdb: '', trades: [] as string[], size: '', coverage: [] as string[], rate: '', notes: '' });
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const inputStyle = { width: '100%', padding: '12px 14px', fontSize: 14, fontFamily: f, border: '1.5px solid #E9E9E7', borderRadius: 8, outline: 'none', background: 'white', boxSizing: 'border-box' as const };
    const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: '#6B6A67', marginBottom: 6, display: 'block' as const };
    const selectStyle = { ...inputStyle, cursor: 'pointer' as const, appearance: 'none' as const };
    const chipStyle = (active: boolean) => ({
        fontSize: 12, padding: '6px 12px', borderRadius: 20, cursor: 'pointer',
        border: `1.5px solid ${active ? '#F59E0B' : '#E9E9E7'}`,
        background: active ? '#FFF8E1' : 'white',
        color: active ? '#E65100' : '#6B6A67', fontWeight: active ? 600 : 400,
        transition: 'all 0.15s',
    });

    const toggleTrade = (t: string) => setForm(p => ({ ...p, trades: p.trades.includes(t) ? p.trades.filter(x => x !== t) : [...p.trades, t] }));
    const toggleCov = (c: string) => setForm(p => ({ ...p, coverage: p.coverage.includes(c) ? p.coverage.filter(x => x !== c) : [...p.coverage, c] }));

    return (
        <div style={{ fontFamily: f, background: '#FAFAF9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
            <div style={{ maxWidth: 560, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Link href="/join" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#37352F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 800 }}>R</div>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#37352F' }}>Roof</span>
                    </Link>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#37352F', margin: '0 0 8px' }}>Join as Contractor</h1>
                    <p style={{ fontSize: 14, color: '#9B9A97', margin: 0 }}>Get dispatched to verified renovation projects from ID firms on Roof.</p>
                </div>

                <div style={{ background: 'white', borderRadius: 16, padding: '32px 28px', border: '1px solid #E9E9E7' }}>
                    {/* Company Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Company Name</label>
                            <input style={inputStyle} value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Ah Heng Electrical Pte Ltd" />
                        </div>
                        <div>
                            <label style={labelStyle}>UEN / SSM No.</label>
                            <input style={inputStyle} value={form.uen} onChange={e => setForm(p => ({ ...p, uen: e.target.value }))} placeholder="201XXXXXXX" />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Contact Person</label>
                            <input style={inputStyle} value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} placeholder="Ah Heng" />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input style={inputStyle} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+65 9xxx xxxx" />
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Email</label>
                        <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="office@company.com" />
                    </div>

                    {/* Licenses */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>BCA License No. (if any)</label>
                            <input style={inputStyle} value={form.bca} onChange={e => setForm(p => ({ ...p, bca: e.target.value }))} placeholder="ME / CR / CW class" />
                        </div>
                        <div>
                            <label style={labelStyle}>HDB License No. (if any)</label>
                            <input style={inputStyle} value={form.hdb} onChange={e => setForm(p => ({ ...p, hdb: e.target.value }))} placeholder="HDB renovation permit" />
                        </div>
                    </div>

                    {/* Trades */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Trades You Cover (select all)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {TRADE_TYPES.map(t => (
                                <span key={t} onClick={() => toggleTrade(t)} style={chipStyle(form.trades.includes(t))}>{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* Size & Coverage */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Team Size</label>
                            <select style={selectStyle} value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))}>
                                <option value="">How many workers?</option>
                                {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Typical Day Rate (optional)</label>
                            <input style={inputStyle} value={form.rate} onChange={e => setForm(p => ({ ...p, rate: e.target.value }))} placeholder="e.g. $180/day per worker" />
                        </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>Coverage Area</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {COVERAGE.map(c => (
                                <span key={c} onClick={() => toggleCov(c)} style={chipStyle(form.coverage.includes(c))}>{c}</span>
                            ))}
                        </div>
                    </div>

                    <button style={{
                        width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, fontFamily: f,
                        color: 'white', background: '#F59E0B', border: 'none', borderRadius: 10, cursor: 'pointer',
                    }}>
                        Submit Contractor Application →
                    </button>
                    <p style={{ fontSize: 11, color: '#C8C7C3', textAlign: 'center', marginTop: 12 }}>
                        BCA-registered firms get priority matching • Applications reviewed within 48hrs
                    </p>
                </div>
            </div>
        </div>
    );
}
