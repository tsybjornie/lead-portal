'use client';

import Link from 'next/link';
import { useState } from 'react';

const PROPERTY_TYPES = ['HDB 3-Room', 'HDB 4-Room', 'HDB 5-Room', 'HDB Executive', 'Condo', 'Landed — Terrace', 'Landed — Semi-D', 'Landed — Bungalow', 'Commercial'];
const BUDGET_RANGES = ['Below $30k', '$30k – $50k', '$50k – $80k', '$80k – $120k', '$120k – $200k', 'Above $200k'];
const STYLES = ['Wabi-Sabi', 'Bauhaus', 'De Stijl', 'Brutalism', 'Art Nouveau', 'Peranakan', 'Hygge', 'Art Deco', 'Luxury', 'Not sure — help me decide'];
const TIMELINES = ['ASAP (keys received)', 'Within 3 months', '3–6 months', '6–12 months', 'Just exploring'];

export default function HomeownerSignup() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', property: '', address: '', budget: '', style: '', timeline: '', notes: '' });
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const inputStyle = { width: '100%', padding: '12px 14px', fontSize: 14, fontFamily: f, border: '1.5px solid #E9E9E7', borderRadius: 8, outline: 'none', background: 'white', boxSizing: 'border-box' as const };
    const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: '#6B6A67', marginBottom: 6, display: 'block' as const };
    const selectStyle = { ...inputStyle, cursor: 'pointer' as const, appearance: 'none' as const };

    return (
        <div style={{ fontFamily: f, background: '#FAFAF9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
            <div style={{ maxWidth: 520, width: '100%' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Link href="/join" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#37352F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 800 }}>R</div>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#37352F' }}>Roof</span>
                    </Link>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#37352F', margin: '0 0 8px' }}>Find Your Designer</h1>
                    <p style={{ fontSize: 14, color: '#9B9A97', margin: 0 }}>Tell us about your project and we'll match you with 3 designers in 24 hours.</p>
                </div>

                {/* Form */}
                <div style={{ background: 'white', borderRadius: 16, padding: '32px 28px', border: '1px solid #E9E9E7' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="David Lim" />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input style={inputStyle} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+65 9xxx xxxx" />
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Email</label>
                        <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="david@email.com" />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Property Type</label>
                        <select style={selectStyle} value={form.property} onChange={e => setForm(p => ({ ...p, property: e.target.value }))}>
                            <option value="">Select property type</option>
                            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Property Address</label>
                        <input style={inputStyle} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Block 456 Tampines St 42 #08-123" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Budget</label>
                            <select style={selectStyle} value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}>
                                <option value="">Select range</option>
                                {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Timeline</label>
                            <select style={selectStyle} value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}>
                                <option value="">When do you need?</option>
                                {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Preferred Style</label>
                        <select style={selectStyle} value={form.style} onChange={e => setForm(p => ({ ...p, style: e.target.value }))}>
                            <option value="">What's your vibe?</option>
                            {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>Anything else we should know?</label>
                        <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' as const }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="E.g. Must have home office, pet-friendly, wheelchair accessible..." />
                    </div>
                    <button style={{
                        width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, fontFamily: f,
                        color: 'white', background: '#3B82F6', border: 'none', borderRadius: 10, cursor: 'pointer',
                    }}>
                        Get My 3 Matches →
                    </button>
                    <p style={{ fontSize: 11, color: '#C8C7C3', textAlign: 'center', marginTop: 12 }}>
                        100% Free • No obligations • Matches within 24 hours
                    </p>
                </div>
            </div>
        </div>
    );
}
