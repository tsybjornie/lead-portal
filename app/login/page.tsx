'use client';

import { useRoofAuth, validateCredentials, getAllUsers, ROLE_COLORS } from '@/context/RoofAuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const { loginByCode, isLoggedIn, user } = useRoofAuth();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const allUsers = getAllUsers();

    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    useEffect(() => { usernameRef.current?.focus(); }, []);

    // If already logged in, redirect
    if (isLoggedIn && user) {
        return null;
    }

    const handleLogin = () => {
        if (!username.trim()) { setError('Enter your username'); return; }
        if (!password.trim()) { setError('Enter your password'); return; }
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            const entry = validateCredentials(username, password);
            if (entry) {
                loginByCode(entry.user.code);
                router.push(entry.defaultRoute);
            } else {
                setError('Invalid username or password');
                setIsLoading(false);
            }
        }, 300);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleLogin();
    };

    const quickLogin = (uname: string) => {
        setUsername(uname);
        setPassword('roof123');
        setTimeout(() => {
            const entry = validateCredentials(uname, 'roof123');
            if (entry) {
                loginByCode(entry.user.code);
                router.push(entry.defaultRoute);
            }
        }, 200);
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

            <style>{`
                input:focus { border-color: rgba(0,0,0,0.5) !important; }
                input::placeholder { color: rgba(0,0,0,0.3); }
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
                    Don&apos;t have an account? <span style={{ fontWeight: 600, color: '#111' }}>Sign up</span>
                </Link>
            </nav>

            {/* ═══════ CONTENT ═══════ */}
            <div style={{
                maxWidth: 380, margin: '0 auto', padding: '160px 48px 80px',
            }}>
                <div style={{
                    fontFamily: mono, fontSize: 10, fontWeight: 500,
                    color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const, marginBottom: 24,
                }}>SIGN IN</div>

                <h1 style={{
                    fontSize: 32, fontWeight: 300, letterSpacing: '-0.03em',
                    margin: '0 0 8px', color: '#111',
                }}>
                    Welcome<br />
                    <span style={{ color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>back.</span>
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', margin: '0 0 48px', lineHeight: 1.6 }}>
                    The operating system for Singapore renovations
                </p>

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 20 }}>
                    <div>
                        <label style={labelStyle}>Username</label>
                        <input
                            ref={usernameRef}
                            type="text"
                            value={username}
                            onChange={e => { setUsername(e.target.value); setError(''); }}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter username"
                            autoComplete="username"
                            style={{
                                ...inputStyle,
                                borderColor: error ? 'rgba(220,38,38,0.5)' : 'rgba(0,0,0,0.15)',
                            }}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError(''); }}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter password"
                            autoComplete="current-password"
                            style={{
                                ...inputStyle,
                                borderColor: error ? 'rgba(220,38,38,0.5)' : 'rgba(0,0,0,0.15)',
                            }}
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '10px 14px', background: 'rgba(220,38,38,0.06)', borderRadius: 6,
                        marginBottom: 16, fontSize: 12, color: 'rgba(220,38,38,0.8)', fontWeight: 500,
                        border: '1px solid rgba(220,38,38,0.1)',
                    }}>{error}</div>
                )}

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    style={{
                        width: '100%', padding: '14px 0', fontSize: 13, fontWeight: 600, fontFamily: f,
                        background: isLoading ? 'rgba(0,0,0,0.3)' : '#111', color: '#fff', border: 'none',
                        borderRadius: 6, cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Link href="/join" style={{
                        fontSize: 12, color: 'rgba(0,0,0,0.4)', textDecoration: 'none',
                    }}>
                        Don&apos;t have an account? <span style={{ fontWeight: 600, color: '#111' }}>Sign up</span>
                    </Link>
                </div>
            </div>

            {/* ═══════ FOOTER ═══════ */}
            <footer style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#fafafa',
            }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>
                    © 2026 ORDINANCE SYSTEMS · SINGAPORE
                </span>
                <div style={{ display: 'flex', gap: 24 }}>
                    {[
                        { label: 'Landing', href: '/landing' },
                        { label: 'Platform', href: '/hub' },
                        { label: 'Founding 20', href: '/founding' },
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
