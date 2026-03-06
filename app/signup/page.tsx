'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TIERS = [
    { projects: '1–25', rate: '2.0%', label: 'Starting rate' },
    { projects: '26–50', rate: '1.5%', label: 'Earned at volume' },
    { projects: '51–75', rate: '1.0%', label: 'Preferred partner' },
    { projects: '76+', rate: '0.5%', label: 'Elite rate' },
];

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', firmName: '', role: '', phone: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    const handleSubmit = () => {
        if (!formData.name || !formData.email || !formData.password) return;
        setIsSubmitting(true);
        setTimeout(() => { router.push('/login'); }, 1200);
    };

    const inputStyle = {
        width: '100%', padding: '12px 16px', fontSize: 13, fontFamily: f,
        border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6,
        background: 'transparent', color: '#111', outline: 'none',
        transition: 'border-color 0.2s', boxSizing: 'border-box' as const,
    };
    const labelStyle = {
        fontFamily: mono, fontSize: 9, fontWeight: 500 as const,
        color: 'rgba(0,0,0,0.5)', letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        display: 'block' as const, marginBottom: 8,
    };

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                input:focus, select:focus { border-color: rgba(0,0,0,0.4) !important; }
                input::placeholder { color: rgba(0,0,0,0.2); }
            `}</style>

            {/* ═══════ TOP BAR ═══════ */}
            <nav style={{
                padding: '0 48px', height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}>
                <Link href="/landing" style={{
                    fontFamily: mono, fontSize: 11, fontWeight: 500,
                    color: 'rgba(0,0,0,0.4)', letterSpacing: '0.14em',
                    textTransform: 'uppercase' as const, textDecoration: 'none',
                }}>ORDINANCE SYSTEMS</Link>
                <Link href="/login" style={{
                    fontSize: 12, fontWeight: 400, color: 'rgba(0,0,0,0.5)', textDecoration: 'none',
                }}>
                    Already have an account? <span style={{ fontWeight: 600, color: '#111' }}>Log in</span>
                </Link>
            </nav>

            {/* ═══════ CONTENT ═══════ */}
            <div style={{
                display: 'flex', maxWidth: 940, margin: '0 auto',
                padding: '80px 48px 80px', gap: 80, alignItems: 'flex-start',
            }}>
                {/* LEFT: Form */}
                <div style={{ flex: 1, maxWidth: 380 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 10, fontWeight: 500,
                        color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em',
                        textTransform: 'uppercase' as const, marginBottom: 24,
                    }}>CREATE ACCOUNT</div>

                    <h1 style={{
                        fontSize: 32, fontWeight: 300, letterSpacing: '-0.03em',
                        margin: '0 0 8px', color: '#111',
                    }}>
                        Create your<br />
                        <span style={{ color: 'rgba(0,0,0,0.5)', fontStyle: 'italic' }}>account.</span>
                    </h1>

                    <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', margin: '0 0 8px', lineHeight: 1.6 }}>
                        All tools free. No subscription.
                    </p>
                    <p style={{
                        fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.4)',
                        margin: '0 0 40px', letterSpacing: '0.03em',
                    }}>
                        Start at 2% · Close more, rate drops automatically
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {[
                            { key: 'name', label: 'Full Name', placeholder: 'Bjorn Teo', type: 'text' },
                            { key: 'email', label: 'Email', placeholder: 'bjorn@vinterior.sg', type: 'email' },
                            { key: 'firmName', label: 'Firm Name', placeholder: 'Vinterior Pte Ltd', type: 'text' },
                            { key: 'role', label: 'Your Role / Title', placeholder: '', type: 'select' },
                            { key: 'phone', label: 'Phone', placeholder: '+65 9123 4567', type: 'tel' },
                            { key: 'password', label: 'Password', placeholder: 'Choose a password', type: 'password' },
                        ].map(field => (
                            <div key={field.key}>
                                <label style={labelStyle}>{field.label}</label>
                                {field.type === 'select' ? (
                                    <select
                                        value={(formData as any)[field.key]}
                                        onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                        style={{
                                            ...inputStyle, cursor: 'pointer', appearance: 'none' as const,
                                            color: (formData as any)[field.key] ? '#111' : 'rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        <option value="" disabled>Select your role</option>
                                        <option value="owner">Firm Owner / Director</option>
                                        <option value="principal">Principal Designer</option>
                                        <option value="senior">Senior Designer</option>
                                        <option value="designer">Designer</option>
                                        <option value="junior">Junior Designer</option>
                                        <option value="coordinator">Design Coordinator</option>
                                        <option value="pm">Project Manager</option>
                                        <option value="drafter">Drafter / 3D Artist</option>
                                        <option value="admin">Admin / Operations</option>
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={(formData as any)[field.key]}
                                        onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                        style={inputStyle}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.name || !formData.email || !formData.password}
                        style={{
                            width: '100%', marginTop: 32, padding: '14px 0', fontSize: 13, fontWeight: 600,
                            color: '#fff', background: isSubmitting ? 'rgba(0,0,0,0.3)' : '#111',
                            border: 'none', borderRadius: 6, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            fontFamily: f, transition: 'all 0.2s',
                        }}
                    >
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </button>

                    <p style={{
                        fontSize: 10, color: 'rgba(0,0,0,0.45)', textAlign: 'center',
                        marginTop: 16, lineHeight: 1.6,
                    }}>
                        By creating an account, you agree to Roof&apos;s Terms of Service and Privacy Policy.
                    </p>
                </div>

                {/* RIGHT: Commission Structure */}
                <div style={{ flex: 1, maxWidth: 400, paddingTop: 80 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 10, fontWeight: 500,
                        color: 'rgba(0,0,0,0.45)', letterSpacing: '0.15em',
                        textTransform: 'uppercase' as const, marginBottom: 16,
                    }}>PRICING MODEL</div>

                    <h3 style={{ fontSize: 15, fontWeight: 500, color: '#111', margin: '0 0 8px' }}>
                        How Roof pricing works
                    </h3>
                    <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', margin: '0 0 28px', lineHeight: 1.7 }}>
                        Commission only on signed project value. More volume = lower rate. Resets annually.
                    </p>

                    {/* Tier rows */}
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                        {TIERS.map((tier, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '14px 0',
                                borderBottom: '1px solid rgba(0,0,0,0.06)',
                            }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{tier.projects} projects</div>
                                    <div style={{ fontFamily: mono, fontSize: 9, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.05em' }}>{tier.label}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{
                                        fontFamily: mono, fontSize: 18, fontWeight: 300,
                                        color: i === 0 ? '#111' : 'rgba(0,0,0,0.5)',
                                        letterSpacing: '-0.02em',
                                    }}>{tier.rate}</span>
                                    {i === 0 && (
                                        <span style={{
                                            fontFamily: mono, fontSize: 8, fontWeight: 600,
                                            background: '#111', color: '#fff',
                                            padding: '3px 8px', borderRadius: 3,
                                            letterSpacing: '0.06em', textTransform: 'uppercase',
                                        }}>START</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* What's included */}
                    <div style={{ marginTop: 32 }}>
                        <div style={{
                            fontFamily: mono, fontSize: 9, fontWeight: 500,
                            color: 'rgba(0,0,0,0.45)', letterSpacing: '0.12em',
                            textTransform: 'uppercase' as const, marginBottom: 12,
                        }}>ALL TIERS INCLUDE — FREE</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                                'Quote Builder + BOQ', 'Material Catalog',
                                'Follow Up CRM', 'Dispatch & POs',
                                'Sequence Scheduling', 'Client Dashboard',
                                'Ledger & P&L', 'Staff Seats',
                            ].map(item => (
                                <div key={item} style={{
                                    fontSize: 11, color: 'rgba(0,0,0,0.4)',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}>
                                    <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: 10 }}>●</span>{item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reassurance */}
                    <div style={{
                        marginTop: 28, padding: '16px 0',
                        borderTop: '1px solid rgba(0,0,0,0.06)',
                        fontSize: 11, color: 'rgba(0,0,0,0.4)', lineHeight: 1.7,
                    }}>
                        <strong style={{ color: 'rgba(0,0,0,0.5)' }}>No subscription. No setup fees.</strong><br />
                        Commission is only charged when your client signs and pays through Roof. Your rate drops automatically as you close more projects each year.
                    </div>
                </div>
            </div>
        </div>
    );
}
