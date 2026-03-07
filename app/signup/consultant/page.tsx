'use client';

import Link from 'next/link';
import { useState } from 'react';

const QP_TYPES = [
    'Registered Architect (QP)',
    'Professional Engineer — Structural (QP)',
    'Professional Engineer — M&E (QP)',
    'Professional Engineer — Civil (QP)',
    'Licensed Electrical Worker (LEW)',
    'Land Surveyor',
    'Fire Safety Engineer',
    'Accredited Checker',
    'Other',
];

export default function ConsultantSignup() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', firm: '', license: '', qpType: '', experience: '', notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [certFiles, setCertFiles] = useState<File[]>([]);
    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    const handleSubmit = async () => {
        if (!form.name || !form.phone || !form.qpType) return;
        setIsSubmitting(true);
        setMessage('');
        try {
            const res = await fetch('/api/submit/consultant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: form.name, email: form.email, phone: form.phone,
                    firm_name: form.firm, license_number: form.license,
                    qp_type: form.qpType, experience: form.experience, notes: form.notes,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setMessage(data.error || 'Something went wrong.'); setMessageType('error'); }
            else { setMessage('Submitted! We will review your application.'); setMessageType('success'); setForm({ name: '', email: '', phone: '', firm: '', license: '', qpType: '', experience: '', notes: '' }); }
        } catch { setMessage('Connection error.'); setMessageType('error'); }
        setIsSubmitting(false);
    };

    const inputStyle = { width: '100%', padding: '12px 16px', fontSize: 13, fontFamily: f, border: '1px solid rgba(0,0,0,0.15)', borderRadius: 6, background: 'transparent', color: '#111', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const };
    const labelStyle = { fontFamily: mono, fontSize: 9, fontWeight: 600 as const, color: 'rgba(0,0,0,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, display: 'block' as const, marginBottom: 8 };
    const selectStyle = { ...inputStyle, cursor: 'pointer' as const, appearance: 'none' as const, color: 'rgba(0,0,0,0.5)' };
    const sectionHeader = { fontFamily: mono, fontSize: 9, fontWeight: 500 as const, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 20, paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)' };

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
            <style>{`input:focus, select:focus, textarea:focus { border-color: rgba(0,0,0,0.5) !important; } input::placeholder, textarea::placeholder { color: rgba(0,0,0,0.3); }`}</style>

            <nav style={{ padding: '0 48px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link href="/landing" style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, textDecoration: 'none' }}>ROOF</Link>
                    <span style={{ color: 'rgba(0,0,0,0.12)' }}>/</span>
                    <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>CONSULTANT</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link href="/signup" style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textDecoration: 'none' }}>Design Firm</Link>
                    <Link href="/signup/contractor" style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textDecoration: 'none' }}>Contractor</Link>
                    <Link href="/signup/specialist" style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textDecoration: 'none' }}>Specialist</Link>
                    <Link href="/login" style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)', textDecoration: 'none' }}>Log in</Link>
                </div>
            </nav>

            <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 48px 80px' }}>
                <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 24 }}>CONSULTANT / QP REGISTRATION</div>
                <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 8px', color: '#111' }}>
                    Licensed<br /><span style={{ color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>professionals.</span>
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', margin: '0 0 48px', lineHeight: 1.6 }}>
                    Register as a QP, LEW, or licensed consultant. Get matched with projects that need your expertise.
                </p>

                {/* YOUR DETAILS */}
                <div style={{ marginBottom: 32 }}>
                    <div style={sectionHeader}>YOUR DETAILS</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div><label style={labelStyle}>Full Name</label><input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" /></div>
                        <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+65 / +60" /></div>
                    </div>
                    <div style={{ marginBottom: 16 }}><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@firm.com" /></div>
                    <div><label style={labelStyle}>Firm / Company</label><input style={inputStyle} value={form.firm} onChange={e => setForm(p => ({ ...p, firm: e.target.value }))} placeholder="Your firm name" /></div>
                </div>

                {/* QUALIFICATION */}
                <div style={{ marginBottom: 32 }}>
                    <div style={sectionHeader}>QUALIFICATION</div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Type of License / Registration</label>
                        <select style={{ ...selectStyle, color: form.qpType ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.qpType} onChange={e => setForm(p => ({ ...p, qpType: e.target.value }))}>
                            <option value="">Select your qualification</option>
                            {QP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div><label style={labelStyle}>License / PE Number</label><input style={inputStyle} value={form.license} onChange={e => setForm(p => ({ ...p, license: e.target.value }))} placeholder="e.g. PE-12345" /></div>
                        <div><label style={labelStyle}>Years of Experience</label><input style={inputStyle} value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} placeholder="e.g. 15" /></div>
                    </div>
                </div>

                {/* CERTIFICATIONS UPLOAD */}
                <div style={{ marginBottom: 32 }}>
                    <div style={sectionHeader}>CERTIFICATIONS</div>
                    <label style={labelStyle}>Upload certificates (PDF)</label>
                    <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', margin: '0 0 12px', lineHeight: 1.4 }}>
                        PE/QP license, BOA registration, LEW cert — upload as PDF. Max 5 files, 10MB each.
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
                        <input
                            type="file"
                            accept=".pdf"
                            multiple
                            style={{ display: 'none' }}
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
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '8px 12px', background: 'rgba(5,150,105,0.05)', borderRadius: 6,
                                    border: '1px solid rgba(5,150,105,0.15)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 14 }}>📋</span>
                                        <span style={{ fontSize: 11, fontWeight: 500, color: '#059669' }}>{file.name}</span>
                                        <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)' }}>({(file.size / 1024).toFixed(0)} KB)</span>
                                    </div>
                                    <button type="button" onClick={() => setCertFiles(prev => prev.filter((_, j) => j !== i))} style={{
                                        background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'rgba(0,0,0,0.3)',
                                        padding: '2px 6px', borderRadius: 4,
                                    }}>✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* NOTES */}
                <div style={{ marginBottom: 32 }}>
                    <div style={sectionHeader}>ADDITIONAL INFO</div>
                    <label style={labelStyle}>Anything else?</label>
                    <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' as const }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Specialisations, project types, geographic coverage..." />
                </div>

                <button onClick={handleSubmit} disabled={isSubmitting || !form.name || !form.phone || !form.qpType} style={{ width: '100%', padding: '14px', fontSize: 13, fontWeight: 600, fontFamily: f, color: '#fff', background: isSubmitting ? 'rgba(0,0,0,0.3)' : '#111', border: 'none', borderRadius: 6, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
                    {isSubmitting ? 'Submitting...' : 'Register as Consultant →'}
                </button>

                {message && (<div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, background: messageType === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(220,38,38,0.06)', color: messageType === 'success' ? '#059669' : 'rgba(220,38,38,0.8)', border: `1px solid ${messageType === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(220,38,38,0.1)'}` }}>{message}</div>)}
            </div>

            <footer style={{ padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>© 2026 ROOF · SINGAPORE</span>
                <div style={{ display: 'flex', gap: 24 }}>
                    {[{ label: 'Landing', href: '/landing' }, { label: 'Platform', href: '/hub' }].map(link => (
                        <Link key={link.label} href={link.href} style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textDecoration: 'none' }}>{link.label}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
