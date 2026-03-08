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
    { label: 'Work Permit', value: 'workpermit' },
    { label: '🌏 Passport', value: 'passport' },
];

export default function WorkerSignup() {
    const [form, setForm] = useState({ name: '', phone: '', email: '', idType: '', trades: [] as string[], experience: '', availability: '', license: '', firm: '' });
    const [honeypot, setHoneypot] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    const handleSubmit = async () => {
        if (!form.name || !form.phone) return;
        setIsSubmitting(true);
        setMessage('');
        try {
            const res = await fetch('/api/submit/worker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: form.name,
                    phone: form.phone,
                    email: form.email,
                    id_type: form.idType,
                    trades: form.trades,
                    experience: form.experience,
                    availability: form.availability,
                    license: form.license,
                    firm: form.firm,
                    _website: honeypot,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.error || 'Something went wrong.');
                setMessageType('error');
            } else {
                setMessage('Application submitted! We will verify your identity and get back to you.');
                setMessageType('success');
                setForm({ name: '', phone: '', email: '', idType: '', trades: [], experience: '', availability: '', license: '', firm: '' });
            }
        } catch {
            setMessage('Connection error. Please try again.');
            setMessageType('error');
        }
        setIsSubmitting(false);
    };

    const toggleTrade = (trade: string) => {
        setForm(p => ({ ...p, trades: p.trades.includes(trade) ? p.trades.filter(t => t !== trade) : [...p.trades, trade] }));
    };

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
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link href="/landing" style={{
                        fontFamily: mono, fontSize: 11, fontWeight: 500,
                        color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em',
                        textTransform: 'uppercase' as const, textDecoration: 'none',
                    }}>ROOF</Link>
                    <span style={{ color: 'rgba(0,0,0,0.12)' }}>/</span>
                    <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>WORKER</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link href="/signup/contractor" style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textDecoration: 'none' }}>Contractor</Link>
                    <Link href="/signup/specialist" style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textDecoration: 'none' }}>Specialist</Link>
                    <Link href="/signup/vendor" style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textDecoration: 'none' }}>Vendor</Link>
                    <Link href="/login" style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)', textDecoration: 'none' }}>Log in</Link>
                </div>
            </nav>

            {/* CONTENT */}
            <div style={{ maxWidth: 520, margin: '0 auto', padding: '80px 48px 80px' }}>
                <div style={{
                    fontFamily: mono, fontSize: 10, fontWeight: 500,
                    color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const, marginBottom: 24,
                }}>WORKER APPLICATION</div>

                <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                    Join the<br />
                    <span style={{ color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>workforce.</span>
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', margin: '0 0 48px', lineHeight: 1.6 }}>
                    Get dispatched to verified renovation projects. All trades welcome.
                </p>

                {/* Honeypot - hidden from humans */}
                <div style={{ position: 'absolute', left: '-9999px' }}>
                    <input type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>

                {/* YOUR DETAILS */}
                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 20, paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>YOUR DETAILS</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ahmad bin Hassan" />
                    </div>
                    <div>
                        <label style={labelStyle}>Phone</label>
                        <input style={inputStyle} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+65 / +60" />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                        <label style={labelStyle}>Email (optional)</label>
                        <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
                    </div>
                    <div>
                        <label style={labelStyle}>Identity Verification</label>
                        <select style={{ ...selectStyle, color: form.idType ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.idType} onChange={e => setForm(p => ({ ...p, idType: e.target.value }))}>
                            <option value="">How to verify you?</option>
                            {ID_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* TRADES */}
                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 20, paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>TRADES & EXPERIENCE</div>

                <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Your Trades (select all that apply)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {TRADES.map(trade => (
                            <span key={trade} onClick={() => toggleTrade(trade)} style={chipStyle(form.trades.includes(trade))}>{trade}</span>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                        <label style={labelStyle}>Experience</label>
                        <select style={{ ...selectStyle, color: form.experience ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}>
                            <option value="">Years of experience</option>
                            {EXPERIENCE_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Availability</label>
                        <select style={{ ...selectStyle, color: form.availability ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.availability} onChange={e => setForm(p => ({ ...p, availability: e.target.value }))}>
                            <option value="">When can you work?</option>
                            {AVAILABILITY.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                    <div>
                        <label style={labelStyle}>License / Cert (optional)</label>
                        <input style={inputStyle} value={form.license} onChange={e => setForm(p => ({ ...p, license: e.target.value }))} placeholder="e.g. LEW Grade 7" />
                    </div>
                    <div>
                        <label style={labelStyle}>Current Firm (optional)</label>
                        <input style={inputStyle} value={form.firm} onChange={e => setForm(p => ({ ...p, firm: e.target.value }))} placeholder="If employed" />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !form.name || !form.phone}
                    style={{
                        width: '100%', padding: '14px', fontSize: 13, fontWeight: 600, fontFamily: f,
                        color: '#fff', background: isSubmitting ? 'rgba(0,0,0,0.3)' : '#111',
                        border: 'none', borderRadius: 6,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                    }}
                >
                    {isSubmitting ? 'Submitting...' : 'Join the Workforce →'}
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
                    🇸🇬 SG workers verified via Singpass · 🇲🇾 MY workers verified via MyKAD
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
