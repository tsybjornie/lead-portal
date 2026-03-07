'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    const handleReset = async () => {
        if (!email.trim()) return;
        setIsSubmitting(true);
        setMessage('');

        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setMessage(error.message);
            setMessageType('error');
        } else {
            setMessage('Check your email for a password reset link.');
            setMessageType('success');
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

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`input:focus { border-color: rgba(0,0,0,0.5) !important; } input::placeholder { color: rgba(0,0,0,0.3); }`}</style>

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
                <Link href="/login" style={{ fontSize: 12, fontWeight: 400, color: 'rgba(0,0,0,0.5)', textDecoration: 'none' }}>
                    ← Back to login
                </Link>
            </nav>

            <div style={{ maxWidth: 400, margin: '0 auto', padding: '120px 48px 80px' }}>
                <div style={{
                    fontFamily: mono, fontSize: 10, fontWeight: 500,
                    color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const, marginBottom: 24,
                }}>RESET PASSWORD</div>

                <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                    Forgot your<br />
                    <span style={{ color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>password?</span>
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', margin: '0 0 48px', lineHeight: 1.6 }}>
                    Enter your email and we'll send you a link to reset it.
                </p>

                <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>Email Address</label>
                    <input
                        style={inputStyle}
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleReset()}
                        placeholder="you@company.com"
                        autoFocus
                    />
                </div>

                <button
                    onClick={handleReset}
                    disabled={isSubmitting || !email.trim()}
                    style={{
                        width: '100%', padding: '14px', fontSize: 13, fontWeight: 600, fontFamily: f,
                        color: '#fff', background: isSubmitting ? 'rgba(0,0,0,0.3)' : '#111',
                        border: 'none', borderRadius: 6,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                    }}
                >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link →'}
                </button>

                {message && (
                    <div style={{
                        marginTop: 16, padding: '10px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                        background: messageType === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(220,38,38,0.06)',
                        color: messageType === 'success' ? '#059669' : 'rgba(220,38,38,0.8)',
                        border: `1px solid ${messageType === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(220,38,38,0.1)'}`,
                    }}>{message}</div>
                )}
            </div>

            <footer style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)',
                background: '#fafafa',
            }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>
                    © 2026 ROOF · SINGAPORE
                </span>
            </footer>
        </div>
    );
}
