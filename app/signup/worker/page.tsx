'use client';

import Link from 'next/link';
import { useState } from 'react';

const TRADES = [
    'Plumbing', 'Electrical', 'Tiling', 'Carpentry', 'Painting', 'Air-Con',
    'Masonry / Hacking', 'Waterproofing', 'Ceiling / Partition', 'Glass & Aluminium',
    'Curtains & Blinds', 'Flooring', 'Welding / Metalwork', 'General Helper',
];
const EXPERIENCE_LEVELS = ['< 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years'];
const AVAILABILITY = ['Full-time (Mon–Sat)', 'Part-time', 'Weekends only', 'Ad-hoc / On-call'];
const ID_TYPES = [
    { label: '🇸🇬 Singpass (NRIC/FIN)', value: 'singpass' },
    { label: '🇲🇾 MyKAD', value: 'mykad' },
    { label: '📄 Work Permit', value: 'workpermit' },
    { label: '🌏 Passport', value: 'passport' },
];

export default function WorkerSignup() {
    const [form, setForm] = useState({ name: '', phone: '', email: '', idType: '', trades: [] as string[], experience: '', availability: '', license: '', firm: '', notes: '' });
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const inputStyle = { width: '100%', padding: '12px 14px', fontSize: 14, fontFamily: f, border: '1.5px solid #E9E9E7', borderRadius: 8, outline: 'none', background: 'white', boxSizing: 'border-box' as const };
    const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: '#6B6A67', marginBottom: 6, display: 'block' as const };
    const selectStyle = { ...inputStyle, cursor: 'pointer' as const, appearance: 'none' as const };
    const chipStyle = (active: boolean) => ({
        fontSize: 12, padding: '6px 12px', borderRadius: 20, cursor: 'pointer',
        border: `1.5px solid ${active ? '#8B5CF6' : '#E9E9E7'}`,
        background: active ? '#8B5CF610' : 'white',
        color: active ? '#8B5CF6' : '#6B6A67', fontWeight: active ? 600 : 400,
        transition: 'all 0.15s',
    });

    const toggleTrade = (trade: string) => {
        setForm(p => ({ ...p, trades: p.trades.includes(trade) ? p.trades.filter(t => t !== trade) : [...p.trades, trade] }));
    };

    return (
        <div style={{ fontFamily: f, background: '#FAFAF9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
            <div style={{ maxWidth: 520, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Link href="/join" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#37352F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 800 }}>R</div>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#37352F' }}>Roof</span>
                    </Link>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#37352F', margin: '0 0 8px' }}>Join as Worker</h1>
                    <p style={{ fontSize: 14, color: '#9B9A97', margin: 0 }}>Get dispatched to verified renovation projects. All trades welcome.</p>
                </div>

                <div style={{ background: 'white', borderRadius: 16, padding: '32px 28px', border: '1px solid #E9E9E7' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ahmad bin Hassan" />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input style={inputStyle} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+65 / +60" />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Email (optional)</label>
                            <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
                        </div>
                        <div>
                            <label style={labelStyle}>Identity Verification</label>
                            <select style={selectStyle} value={form.idType} onChange={e => setForm(p => ({ ...p, idType: e.target.value }))}>
                                <option value="">How to verify you?</option>
                                {ID_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Your Trades (select all that apply)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {TRADES.map(trade => (
                                <span key={trade} onClick={() => toggleTrade(trade)} style={chipStyle(form.trades.includes(trade))}>{trade}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Experience</label>
                            <select style={selectStyle} value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}>
                                <option value="">Years of experience</option>
                                {EXPERIENCE_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Availability</label>
                            <select style={selectStyle} value={form.availability} onChange={e => setForm(p => ({ ...p, availability: e.target.value }))}>
                                <option value="">When can you work?</option>
                                {AVAILABILITY.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>License / Cert (optional)</label>
                            <input style={inputStyle} value={form.license} onChange={e => setForm(p => ({ ...p, license: e.target.value }))} placeholder="e.g. LEW Grade 7, Licensed Plumber" />
                        </div>
                        <div>
                            <label style={labelStyle}>Current Firm (optional)</label>
                            <input style={inputStyle} value={form.firm} onChange={e => setForm(p => ({ ...p, firm: e.target.value }))} placeholder="If employed by an ID firm" />
                        </div>
                    </div>
                    <button style={{
                        width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, fontFamily: f,
                        color: 'white', background: '#8B5CF6', border: 'none', borderRadius: 10, cursor: 'pointer',
                    }}>
                        Join the Workforce →
                    </button>
                    <p style={{ fontSize: 11, color: '#C8C7C3', textAlign: 'center', marginTop: 12 }}>
                        🇸🇬 SG workers verified via Singpass • 🇲🇾 MY workers verified via MyKAD
                    </p>
                </div>
            </div>
        </div>
    );
}
