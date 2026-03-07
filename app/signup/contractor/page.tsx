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
    const [honeypot, setHoneypot] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [certFiles, setCertFiles] = useState<File[]>([]);
    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    const handleSubmit = async () => {
        if (!form.company || !form.contact) return;
        setIsSubmitting(true);
        setMessage('');
        try {
            const res = await fetch('/api/submit/contractor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_name: form.company,
                    uen: form.uen,
                    contact_person: form.contact,
                    email: form.email,
                    phone: form.phone,
                    bca_license: form.bca,
                    hdb_license: form.hdb,
                    trades: form.trades,
                    team_size: form.size,
                    coverage: form.coverage,
                    day_rate: form.rate,
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
    const chipStyle = (active: boolean) => ({
        fontSize: 11, padding: '6px 14px', borderRadius: 4, cursor: 'pointer' as const,
        border: `1px solid ${active ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)'}`,
        background: active ? '#111' : 'transparent',
        color: active ? '#fff' : 'rgba(0,0,0,0.6)',
        fontWeight: active ? 600 : 400 as const,
        transition: 'all 0.2s',
        fontFamily: f,
    });

    const toggleTrade = (t: string) => setForm(p => ({ ...p, trades: p.trades.includes(t) ? p.trades.filter(x => x !== t) : [...p.trades, t] }));
    const toggleCov = (c: string) => setForm(p => ({ ...p, coverage: p.coverage.includes(c) ? p.coverage.filter(x => x !== c) : [...p.coverage, c] }));

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                input:focus, select:focus { border-color: rgba(0,0,0,0.5) !important; }
                input::placeholder { color: rgba(0,0,0,0.35); }
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

            {/* ═══════ CONTENT ═══════ */}
            <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 48px 80px' }}>
                <div style={{
                    fontFamily: mono, fontSize: 10, fontWeight: 500,
                    color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const, marginBottom: 24,
                }}>CONTRACTOR APPLICATION</div>

                <h1 style={{
                    fontSize: 32, fontWeight: 300, letterSpacing: '-0.03em',
                    margin: '0 0 8px', color: '#111',
                }}>
                    Join as<br />
                    <span style={{ color: 'rgba(0,0,0,0.15)', fontStyle: 'italic' }}>Contractor.</span>
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', margin: '0 0 48px', lineHeight: 1.6 }}>
                    Get dispatched to verified renovation projects from ID firms on Roof.
                </p>

                {/* Company Info */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 9, fontWeight: 500,
                        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const, marginBottom: 20,
                        paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}>COMPANY DETAILS</div>

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
                    <div>
                        <label style={labelStyle}>Email</label>
                        <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="office@company.com" />
                    </div>
                </div>

                {/* Licenses */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 9, fontWeight: 500,
                        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const, marginBottom: 20,
                        paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}>LICENSES</div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>BCA License No. (if any)</label>
                            <input style={inputStyle} value={form.bca} onChange={e => setForm(p => ({ ...p, bca: e.target.value }))} placeholder="ME / CR / CW class" />
                        </div>
                        <div>
                            <label style={labelStyle}>HDB License No. (if any)</label>
                            <input style={inputStyle} value={form.hdb} onChange={e => setForm(p => ({ ...p, hdb: e.target.value }))} placeholder="HDB renovation permit" />
                        </div>
                    </div>
                </div>

                {/* Cert Upload */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 9, fontWeight: 500,
                        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const, marginBottom: 20,
                        paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}>CERTIFICATIONS</div>
                    <label style={labelStyle}>Upload certificates (PDF)</label>
                    <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', margin: '0 0 12px', lineHeight: 1.4 }}>
                        BCA license, HDB permit, insurance, safety certs — upload as PDF. Max 5 files, 10MB each.
                    </p>
                    <label style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '20px', border: '2px dashed rgba(0,0,0,0.12)', borderRadius: 8,
                        cursor: 'pointer', transition: 'border-color 0.2s', background: 'rgba(0,0,0,0.02)',
                    }}>
                        <span style={{ fontSize: 20 }}>📄</span>
                        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', fontWeight: 500 }}>
                            {certFiles.length > 0 ? 'Add more files' : 'Click to upload PDF certificates'}
                        </span>
                        <input type="file" accept=".pdf" multiple style={{ display: 'none' }}
                            onChange={e => {
                                const files = Array.from(e.target.files || []);
                                const pdfs = files.filter(f => f.type === 'application/pdf' && f.size <= 10 * 1024 * 1024);
                                setCertFiles(prev => [...prev, ...pdfs].slice(0, 5));
                                e.target.value = '';
                            }}
                        />
                    </label>
                    {certFiles.length > 0 && (
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {certFiles.map((file, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(5,150,105,0.05)', borderRadius: 6, border: '1px solid rgba(5,150,105,0.15)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 14 }}>📋</span>
                                        <span style={{ fontSize: 11, fontWeight: 500, color: '#059669' }}>{file.name}</span>
                                        <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)' }}>({(file.size / 1024).toFixed(0)} KB)</span>
                                    </div>
                                    <button type="button" onClick={() => setCertFiles(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4 }}>✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Trades */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 9, fontWeight: 500,
                        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const, marginBottom: 20,
                        paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}>TRADES & CAPACITY</div>

                    <label style={labelStyle}>Trades You Cover (select all)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                        {TRADE_TYPES.map(t => (
                            <span key={t} onClick={() => toggleTrade(t)} style={chipStyle(form.trades.includes(t))}>{t}</span>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                        <div>
                            <label style={labelStyle}>Team Size</label>
                            <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const, color: form.size ? '#111' : 'rgba(0,0,0,0.2)' }} value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))}>
                                <option value="">How many workers?</option>
                                {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Typical Day Rate (optional)</label>
                            <input style={inputStyle} value={form.rate} onChange={e => setForm(p => ({ ...p, rate: e.target.value }))} placeholder="e.g. $180/day per worker" />
                        </div>
                    </div>

                    <label style={labelStyle}>Coverage Area</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {COVERAGE.map(c => (
                            <span key={c} onClick={() => toggleCov(c)} style={chipStyle(form.coverage.includes(c))}>{c}</span>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !form.company || !form.contact}
                    style={{
                        width: '100%', padding: '14px', fontSize: 13, fontWeight: 600, fontFamily: f,
                        color: '#fff', background: isSubmitting ? 'rgba(0,0,0,0.3)' : '#111',
                        border: 'none', borderRadius: 6,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                    }}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Contractor Application →'}
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
                    BCA-registered firms get priority matching · Applications reviewed within 48hrs
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
                        { label: 'All Roles', href: '/landing' },
                    ].map(link => (
                        <Link key={link.label} href={link.href}
                            style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.2)'}
                        >{link.label}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
