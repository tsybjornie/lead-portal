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

    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const handleSubmit = () => {
        if (!formData.name || !formData.email || !formData.password) return;
        setIsSubmitting(true);
        setTimeout(() => {
            router.push('/login');
        }, 1200);
    };

    return (
        <div style={{
            fontFamily: f, minHeight: '100vh',
            background: 'linear-gradient(135deg, #FAFAF9 0%, #F0EFEB 50%, #E8E6E1 100%)',
        }}>
            {/* Nav */}
            <nav style={{
                padding: '16px 48px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Link href="/landing" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10, background: '#37352F',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 18, fontWeight: 800,
                    }}>R</div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#37352F', letterSpacing: '-0.03em' }}>Roof</span>
                </Link>
                <Link href="/login" style={{
                    fontSize: 13, fontWeight: 600, color: '#6B6A67', textDecoration: 'none',
                }}>Already have an account? <span style={{ color: '#37352F', fontWeight: 700 }}>Log in</span></Link>
            </nav>

            <div style={{ display: 'flex', maxWidth: 960, margin: '0 auto', padding: '40px 24px 80px', gap: 56, alignItems: 'flex-start' }}>

                {/* Left: Account Form */}
                <div style={{ flex: 1, maxWidth: 400 }}>
                    <h1 style={{ fontSize: 32, fontWeight: 800, color: '#37352F', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                        Create your account
                    </h1>
                    <p style={{ fontSize: 14, color: '#9B9A97', margin: '0 0 8px' }}>
                        All tools free. No subscription.
                    </p>
                    <p style={{ fontSize: 13, color: '#10B981', margin: '0 0 32px', fontWeight: 600 }}>
                        You start at 2% — close more projects, your rate drops automatically.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { key: 'name', label: 'Full Name', placeholder: 'Bjorn Teo', type: 'text' },
                            { key: 'email', label: 'Email', placeholder: 'bjorn@vinterior.sg', type: 'email' },
                            { key: 'firmName', label: 'Firm Name', placeholder: 'Vinterior Pte Ltd', type: 'text' },
                            { key: 'role', label: 'Your Role / Title', placeholder: '', type: 'select' },
                            { key: 'phone', label: 'Phone', placeholder: '+65 9123 4567', type: 'tel' },
                            { key: 'password', label: 'Password', placeholder: 'Choose a password', type: 'password' },
                        ].map(field => (
                            <div key={field.key}>
                                <label style={{
                                    fontSize: 11, fontWeight: 600, color: '#6B6A67',
                                    textTransform: 'uppercase', letterSpacing: '0.06em',
                                    display: 'block', marginBottom: 6,
                                }}>{field.label}</label>
                                {field.type === 'select' ? (
                                    <select
                                        value={(formData as any)[field.key]}
                                        onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                        style={{
                                            width: '100%', padding: '12px 16px', fontSize: 14, fontFamily: f,
                                            border: '1.5px solid #E9E9E7', borderRadius: 8,
                                            background: 'white', color: (formData as any)[field.key] ? '#37352F' : '#9B9A97', outline: 'none',
                                            transition: 'border-color 0.15s', boxSizing: 'border-box',
                                            appearance: 'none', cursor: 'pointer',
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
                                        style={{
                                            width: '100%', padding: '12px 16px', fontSize: 14, fontFamily: f,
                                            border: '1.5px solid #E9E9E7', borderRadius: 8,
                                            background: 'white', color: '#37352F', outline: 'none',
                                            transition: 'border-color 0.15s', boxSizing: 'border-box',
                                        }}
                                        onFocus={e => { e.target.style.borderColor = '#37352F'; }}
                                        onBlur={e => { e.target.style.borderColor = '#E9E9E7'; }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.name || !formData.email || !formData.password}
                        style={{
                            width: '100%', marginTop: 24, padding: '14px 0', fontSize: 14, fontWeight: 700,
                            color: 'white', background: isSubmitting ? '#9B9A97' : '#37352F',
                            border: 'none', borderRadius: 8, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            fontFamily: f, transition: 'all 0.15s',
                        }}
                    >
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </button>

                    <p style={{ fontSize: 11, color: '#9B9A97', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
                        By creating an account, you agree to Roof&apos;s Terms of Service and Privacy Policy.
                    </p>
                </div>

                {/* Right: Commission Structure (informational) */}
                <div style={{ flex: 1, maxWidth: 440 }}>
                    <div style={{
                        background: 'white', borderRadius: 16, padding: '32px',
                        border: '1.5px solid #E9E9E7', boxShadow: '0 2px 16px rgba(55,53,47,0.04)',
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#37352F', margin: '0 0 4px' }}>
                            How Roof pricing works
                        </h3>
                        <p style={{ fontSize: 12, color: '#9B9A97', margin: '0 0 20px', lineHeight: 1.5 }}>
                            Commission is only charged on signed project value. More volume = lower rate. Resets annually — maintain to keep your rate.
                        </p>

                        {/* Tier table */}
                        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #F1F1EF' }}>
                            {TIERS.map((tier, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', padding: '14px 18px',
                                    borderBottom: i < TIERS.length - 1 ? '1px solid #F1F1EF' : 'none',
                                    background: i === 0 ? '#FAFAF8' : 'white',
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F' }}>{tier.projects} projects</div>
                                        <div style={{ fontSize: 11, color: '#9B9A97' }}>{tier.label}</div>
                                    </div>
                                    <div style={{
                                        fontSize: 20, fontWeight: 800, color: i === 0 ? '#37352F' : '#10B981',
                                        letterSpacing: '-0.02em',
                                    }}>
                                        {tier.rate}
                                    </div>
                                    {i === 0 && (
                                        <div style={{ marginLeft: 8, fontSize: 9, fontWeight: 700, background: '#37352F', color: 'white', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            You start here
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* What's included */}
                        <div style={{ marginTop: 24, borderTop: '1px solid #F1F1EF', paddingTop: 18 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F', marginBottom: 10 }}>
                                All tiers include — free
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                {[
                                    'Quote Builder + BOQ',
                                    'Material Catalog',
                                    'Follow Up CRM',
                                    'Dispatch & POs',
                                    'Sequence Scheduling',
                                    'Client Dashboard',
                                    'Ledger & P&L',
                                    'Staff Seats',
                                ].map(f => (
                                    <div key={f} style={{ fontSize: 11, color: '#6B6A67', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <span style={{ color: '#10B981', fontSize: 12 }}>✓</span>{f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reassurance */}
                        <div style={{
                            marginTop: 18, padding: '12px 14px', borderRadius: 8,
                            background: '#F7F6F3', fontSize: 11, color: '#6B6A67', lineHeight: 1.6,
                        }}>
                            <strong style={{ color: '#37352F' }}>No subscription. No setup fees.</strong><br />
                            Commission is only charged when your client signs and pays through Roof. Your rate drops automatically as you close more projects each year.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
