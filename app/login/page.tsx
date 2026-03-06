'use client';

import { useRoofAuth, validateCredentials, getAllUsers, ROLE_COLORS } from '@/context/RoofAuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function LoginPage() {
    const { loginByCode, isLoggedIn, user } = useRoofAuth();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const allUsers = getAllUsers();

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

    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    return (
        <div style={{
            fontFamily: f, minHeight: '100vh',
            background: 'linear-gradient(135deg, #FAFAF9 0%, #F0EFEB 50%, #E8E6E1 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
        }}>
            <div style={{ maxWidth: 400, width: '100%' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: 16, background: '#37352F',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 32, fontWeight: 800, marginBottom: 20,
                        boxShadow: '0 4px 24px rgba(55,53,47,0.15)',
                    }}>R</div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em', color: '#37352F' }}>
                        Welcome to Roof
                    </h1>
                    <p style={{ fontSize: 13, color: '#9B9A97', margin: 0 }}>
                        The operating system for Singapore renovations
                    </p>
                </div>

                {/* Login Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#6B6A67', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                            Username
                        </label>
                        <input
                            ref={usernameRef}
                            type="text"
                            value={username}
                            onChange={e => { setUsername(e.target.value); setError(''); }}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter username"
                            autoComplete="username"
                            style={{
                                width: '100%', padding: '12px 16px', fontSize: 14, fontFamily: f,
                                border: error ? '1.5px solid #EF4444' : '1.5px solid #E9E9E7',
                                borderRadius: 8, background: 'white', color: '#37352F', outline: 'none',
                                transition: 'border-color 0.15s', boxSizing: 'border-box',
                            }}
                            onFocus={e => { if (!error) e.target.style.borderColor = '#37352F'; }}
                            onBlur={e => { if (!error) e.target.style.borderColor = '#E9E9E7'; }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#6B6A67', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError(''); }}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter password"
                            autoComplete="current-password"
                            style={{
                                width: '100%', padding: '12px 16px', fontSize: 14, fontFamily: f,
                                border: error ? '1.5px solid #EF4444' : '1.5px solid #E9E9E7',
                                borderRadius: 8, background: 'white', color: '#37352F', outline: 'none',
                                transition: 'border-color 0.15s', boxSizing: 'border-box',
                            }}
                            onFocus={e => { if (!error) e.target.style.borderColor = '#37352F'; }}
                            onBlur={e => { if (!error) e.target.style.borderColor = '#E9E9E7'; }}
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '8px 14px', background: '#FEF2F2', borderRadius: 6,
                        marginBottom: 12, fontSize: 12, color: '#EF4444', fontWeight: 500,
                    }}>{error}</div>
                )}

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    style={{
                        width: '100%', padding: '13px 0', fontSize: 14, fontWeight: 700, fontFamily: f,
                        background: isLoading ? '#9B9A97' : '#37352F', color: 'white', border: 'none',
                        borderRadius: 8, cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s', letterSpacing: '0.01em',
                    }}
                >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                </button>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#9B9A97' }}>
                    Don&apos;t have an account?{' '}
                    <a href="/signup" style={{ color: '#37352F', fontWeight: 700, textDecoration: 'none' }}>Sign up</a>
                </p>


            </div>
        </div>
    );
}
