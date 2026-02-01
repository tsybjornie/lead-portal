'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const pathname = usePathname();

    // Simple password check (replace with proper auth later)
    const ADMIN_PASSWORD = 'reno2024';

    useEffect(() => {
        const saved = sessionStorage.getItem('admin_auth');
        if (saved === 'true') {
            setAuthenticated(true);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setAuthenticated(true);
            sessionStorage.setItem('admin_auth', 'true');
        } else {
            alert('Incorrect password');
        }
    };

    if (!authenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg)'
            }}>
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '4px',
                    boxShadow: 'var(--shadow-lg)',
                    maxWidth: '400px',
                    width: '100%'
                }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Admin Access</h1>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const navItems = [
        { href: '/admin/firms', label: 'Firm Applications' },
        { href: '/admin/enquiries', label: 'Homeowner Enquiries' },
        { href: '/admin/matching', label: 'Matching' },
        { href: '/admin/credits', label: 'Credits' }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
            {/* Sidebar */}
            <aside style={{
                width: '240px',
                background: '#1a1a1a',
                color: 'white',
                padding: '2rem 0',
                flexShrink: 0
            }}>
                <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                    <Link href="/admin" style={{ color: 'white', textDecoration: 'none' }}>
                        <h2 style={{ fontSize: '1.2rem', fontFamily: 'Playfair Display, serif' }}>
                            ROOF
                        </h2>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Admin Dashboard</span>
                    </Link>
                </div>
                <nav>
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'block',
                                padding: '0.75rem 1.5rem',
                                color: pathname === item.href ? 'white' : 'rgba(255,255,255,0.7)',
                                textDecoration: 'none',
                                background: pathname === item.href ? 'rgba(255,255,255,0.1)' : 'transparent',
                                borderLeft: pathname === item.href ? '3px solid var(--accent)' : '3px solid transparent',
                                fontSize: '0.95rem'
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                    <button
                        onClick={() => {
                            sessionStorage.removeItem('admin_auth');
                            setAuthenticated(false);
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}
