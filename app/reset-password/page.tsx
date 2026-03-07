'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    const handleReset = async () => {
        if (password.length < 6) {
            setMessage('Password must be at least 6 characters.');
            setMessageType('error');
            return;
        }
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setMessageType('error');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setMessage(error.message);
            setMessageType('error');
        } else {
            setMessage('Password updated! Redirecting to login...');
            setMessageType('success');
            setTimeout(() => router.push('/login'), 2000);
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
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`input:focus { border-color: rgba(0,0,0,0.5) !important; } input::placeholder { color: rgba(0,0,0,0.3); }`}</style>

            <nav style={{
                padding: '0 48px', height: 56,
                display: 'flex', alignItems: 'center',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}>
                <Link href="/landing" style={{
                    fontFamily: mono, fontSize: 11, fontWeight: 500,
                    color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em',
                    textTransform: 'uppercase' as const, textDecoration: 'none',
                }}>ROOF</Link>
            </nav>

            <div style={{ maxWidth: 400, margin: '0 auto', padding: '120px 48px 80px' }}>
                <div style={{
                    fontFamily: mono, fontSize: 10, fontWeight: 500,
                    color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const, marginBottom: 24,
                }}>NEW PASSWORD</div>

                <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                    Set your new<br />
                    <span style={{ color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>password.</span>
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', margin: '0 0 48px', lineHeight: 1.6 }}>
                    Choose a strong password with at least 6 characters.
                </p>

                <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>New Password</label>
                    <input
                        style={inputStyle}
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        autoFocus
                    />
                </div>

                <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>Confirm Password</label>
                    <input
                        style={inputStyle}
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleReset()}
                        placeholder="Repeat password"
                    />
                </div>

                <button
                    onClick={handleReset}
                    disabled={isSubmitting || !password || !confirmPassword}
                    style={{
                        width: '100%', padding: '14px', fontSize: 13, fontWeight: 600, fontFamily: f,
                        color: '#fff', background: isSubmitting ? 'rgba(0,0,0,0.3)' : '#111',
                        border: 'none', borderRadius: 6,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                    }}
                >
                    {isSubmitting ? 'Updating...' : 'Update Password →'}
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
        </div>
    );
}
