'use client';

import Link from 'next/link';
import { useState } from 'react';

const PROPERTY_TYPES = ['HDB 3-Room', 'HDB 4-Room', 'HDB 5-Room', 'HDB Executive', 'Condo', 'Landed — Terrace', 'Landed — Semi-D', 'Landed — Bungalow', 'Commercial'];
const BUDGET_RANGES = ['Below $30k', '$30k – $50k', '$50k – $80k', '$80k – $120k', '$120k – $200k', 'Above $200k'];
const STYLES = ['Wabi-Sabi', 'Bauhaus', 'De Stijl', 'Brutalism', 'Art Nouveau', 'Peranakan', 'Hygge', 'Art Deco', 'Luxury', 'Not sure — help me decide'];
const TIMELINES = ['ASAP (keys received)', 'Within 3 months', '3–6 months', '6–12 months', 'Just exploring'];

export default function HomeownerSignup() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', property: '', address: '', budget: '', style: '', timeline: '', notes: '' });
    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

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
    const selectStyle = {
        ...inputStyle, cursor: 'pointer' as const, appearance: 'none' as const,
        color: 'rgba(0,0,0,0.5)',
    };

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                input:focus, select:focus, textarea:focus { border-color: rgba(0,0,0,0.5) !important; }
                input::placeholder, textarea::placeholder { color: rgba(0,0,0,0.3); }
            `}</style>

            {/* ═══════ TOP BAR ═══════ */}
            <nav style={{
                padding: '0 48px', height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}>
                <Link href="/landing" style={{
                    fontFamily: mono, fontSize: 11, fontWeight: 500,
                    color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em',
                    textTransform: 'uppercase' as const, textDecoration: 'none',
                }}>ORDINANCE SYSTEMS</Link>
                <Link href="/join" style={{
                    fontSize: 12, fontWeight: 400, color: 'rgba(0,0,0,0.5)', textDecoration: 'none',
                }}>
                    ← Back to role selection
                </Link>
            </nav>

            {/* ═══════ CONTENT ═══════ */}
            <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 48px 80px' }}>
                <div style={{
                    fontFamily: mono, fontSize: 10, fontWeight: 500,
                    color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const, marginBottom: 24,
                }}>HOMEOWNER MATCHING</div>

                <h1 style={{
                    fontSize: 32, fontWeight: 300, letterSpacing: '-0.03em',
                    margin: '0 0 8px', color: '#111',
                }}>
                    Find your<br />
                    <span style={{ color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>designer.</span>
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', margin: '0 0 48px', lineHeight: 1.6 }}>
                    Tell us about your project and we&apos;ll match you with 3 designers in 24 hours.
                </p>

                {/* YOUR DETAILS */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 9, fontWeight: 500,
                        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const, marginBottom: 20,
                        paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}>YOUR DETAILS</div>

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
                    <div>
                        <label style={labelStyle}>Email</label>
                        <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="david@email.com" />
                    </div>
                </div>

                {/* PROJECT DETAILS */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 9, fontWeight: 500,
                        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const, marginBottom: 20,
                        paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}>PROJECT DETAILS</div>

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
                </div>

                {/* PREFERENCES */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 9, fontWeight: 500,
                        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const, marginBottom: 20,
                        paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}>PREFERENCES</div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Preferred Style</label>
                        <select style={selectStyle} value={form.style} onChange={e => setForm(p => ({ ...p, style: e.target.value }))}>
                            <option value="">What&apos;s your vibe?</option>
                            {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Anything else we should know?</label>
                        <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' as const }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="E.g. Must have home office, pet-friendly, wheelchair accessible..." />
                    </div>
                </div>

                {/* SUBMIT */}
                <button style={{
                    width: '100%', padding: '14px', fontSize: 13, fontWeight: 600, fontFamily: f,
                    color: '#fff', background: '#111', border: 'none', borderRadius: 6,
                    cursor: 'pointer', transition: 'background 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.background = '#333'}
                    onMouseLeave={e => e.currentTarget.style.background = '#111'}
                >
                    Get My 3 Matches →
                </button>
                <p style={{
                    fontFamily: mono, fontSize: 9, color: 'rgba(0,0,0,0.4)', textAlign: 'center',
                    marginTop: 16, letterSpacing: '0.03em',
                }}>
                    100% Free · No obligations · Matches within 24 hours
                </p>
            </div>

            {/* ═══════ FOOTER ═══════ */}
            <footer style={{
                padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>
                    © 2026 ORDINANCE SYSTEMS · SINGAPORE
                </span>
                <div style={{ display: 'flex', gap: 24 }}>
                    {[
                        { label: 'Landing', href: '/landing' },
                        { label: 'Platform', href: '/hub' },
                        { label: 'All Roles', href: '/join' },
                    ].map(link => (
                        <Link key={link.label} href={link.href}
                            style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.35)'}
                        >{link.label}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
