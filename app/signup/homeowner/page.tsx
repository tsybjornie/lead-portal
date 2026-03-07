'use client';

import Link from 'next/link';
import { useState } from 'react';

const SG_PROPERTIES = ['HDB 3-Room', 'HDB 4-Room', 'HDB 5-Room', 'HDB Executive', 'Executive Condo (EC)', 'Condo', 'Landed — Terrace', 'Landed — Semi-D', 'Landed — Bungalow / GCB', 'Shophouse'];
const MY_PROPERTIES = ['Flat / Apartment', 'Condo / Serviced Residence', 'Townhouse', 'Terrace (Single Storey)', 'Terrace (Double Storey)', 'Semi-D', 'Bungalow', 'Villa', 'Shophouse', 'Shop-Office (SOHO/SOFO)'];
const BUDGET_RANGES = ['Below $30k', '$30k – $50k', '$50k – $80k', '$80k – $120k', '$120k – $200k', 'Above $200k'];
const STYLES = ['Wabi-Sabi', 'Bauhaus', 'De Stijl', 'Brutalism', 'Art Nouveau', 'Peranakan', 'Hygge', 'Art Deco', 'Luxury', 'Not sure — help me decide'];
const TIMELINES = ['ASAP (keys received)', 'Within 3 months', '3–6 months', '6–12 months', 'Just exploring'];
const PROJECT_REASONS = [
    'New renovation (moving in)',
    'Resale / pre-owned refresh',
    'Reinstatement (fire, flood, structural)',
    'Insurance claim / loss adjuster involved',
    'Addition & alteration (A&A)',
    'Partial upgrade (kitchen / bathroom only)',
    'Just exploring options',
];
const HOUSEHOLD = [
    { id: 'couple', label: 'Couple' },
    { id: 'kids', label: 'Young children' },
    { id: 'teens', label: 'Teenagers' },
    { id: 'elderly', label: 'Elderly parents' },
    { id: 'wheelchair', label: 'Wheelchair / mobility aid' },
    { id: 'helper', label: 'Helper / maid' },
    { id: 'pets_dog', label: 'Dogs' },
    { id: 'pets_cat', label: 'Cats' },
    { id: 'single', label: 'Living alone' },
    { id: 'wfh', label: 'Work from home' },
];

export default function HomeownerSignup() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', property: '', address: '', budget: '', style: '', timeline: '', notes: '', household: [] as string[], reason: '' });
    const [honeypot, setHoneypot] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    const propertyTypes = form.country === 'MY' ? MY_PROPERTIES : SG_PROPERTIES;

    const toggleHousehold = (id: string) => {
        setForm(p => ({ ...p, household: p.household.includes(id) ? p.household.filter(h => h !== id) : [...p.household, id] }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.phone) return;
        setIsSubmitting(true);
        setMessage('');
        try {
            const res = await fetch('/api/submit/homeowner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: form.name,
                    email: form.email,
                    phone: form.phone,
                    country: form.country,
                    property_type: form.property,
                    property_address: form.address,
                    project_reason: form.reason,
                    budget: form.budget,
                    timeline: form.timeline,
                    preferred_style: form.style,
                    household: form.household,
                    notes: form.notes,
                    _website: honeypot,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.error || 'Something went wrong.');
                setMessageType('error');
            } else {
                setMessage('Submitted! We will match you with 3 designers within 24 hours.');
                setMessageType('success');
                setForm({ name: '', email: '', phone: '', country: '', property: '', address: '', budget: '', style: '', timeline: '', notes: '', household: [], reason: '' });
            }
        } catch {
            setMessage('Connection error. Please try again.');
            setMessageType('error');
        }
        setIsSubmitting(false);
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
    const selectStyle = {
        ...inputStyle, cursor: 'pointer' as const, appearance: 'none' as const,
        color: 'rgba(0,0,0,0.5)',
    };
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
                }}>ROOF</Link>
                <Link href="/landing" style={{
                    fontSize: 12, fontWeight: 400, color: 'rgba(0,0,0,0.5)', textDecoration: 'none',
                }}>
                    ← Back
                </Link>
            </nav>

            {/* Honeypot */}
            <div style={{ position: 'absolute', left: '-9999px' }}>
                <input type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>

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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Country</label>
                            <select style={{ ...selectStyle, color: form.country ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value, property: '' }))}>
                                <option value="">Select country</option>
                                <option value="SG">🇸🇬 Singapore</option>
                                <option value="MY">🇲🇾 Malaysia</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Property Type</label>
                            <select style={{ ...selectStyle, color: form.property ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.property} onChange={e => setForm(p => ({ ...p, property: e.target.value }))}>
                                <option value="">{form.country ? 'Select type' : 'Select country first'}</option>
                                {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Property Address or Postal Code</label>
                        <input style={inputStyle} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder={form.country === 'MY' ? 'e.g. 47301 Petaling Jaya' : 'e.g. 520456 or Block 456 Tampines St 42'} />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>What kind of project is this?</label>
                        <select style={{ ...selectStyle, color: form.reason ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}>
                            <option value="">Select project type</option>
                            {PROJECT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Budget</label>
                            <select style={{ ...selectStyle, color: form.budget ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}>
                                <option value="">Select range</option>
                                {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Timeline</label>
                            <select style={{ ...selectStyle, color: form.timeline ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}>
                                <option value="">When do you need?</option>
                                {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* WHO LIVES HERE */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 9, fontWeight: 500,
                        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const, marginBottom: 20,
                        paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}>WHO LIVES HERE</div>

                    <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', margin: '0 0 12px', lineHeight: 1.5 }}>
                        This helps your designer plan for accessibility, safety, and lifestyle needs.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {HOUSEHOLD.map(h => (
                            <span key={h.id} onClick={() => toggleHousehold(h.id)} style={chipStyle(form.household.includes(h.id))}>
                                {h.label}
                            </span>
                        ))}
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
                        <select style={{ ...selectStyle, color: form.style ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.style} onChange={e => setForm(p => ({ ...p, style: e.target.value }))}>
                            <option value="">What&apos;s your vibe?</option>
                            {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Anything else we should know?</label>
                        <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' as const }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="E.g. Must have home office, prefer open kitchen, need extra storage..." />
                    </div>
                </div>

                {/* SUBMIT */}
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
                    {isSubmitting ? 'Submitting...' : 'Get My 3 Matches →'}
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
                    100% Free · No obligations · Matches within 24 hours
                </p>
            </div>

            {/* ═══════ FOOTER ═══════ */}
            <footer style={{
                padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>
                    © 2026 ROOF · SINGAPORE
                </span>
                <div style={{ display: 'flex', gap: 24 }}>
                    {[
                        { label: 'Landing', href: '/landing' },
                        { label: 'Platform', href: '/hub' },
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
