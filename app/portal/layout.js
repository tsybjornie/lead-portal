'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PortalLayout({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [firmData, setFirmData] = useState(null);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        // Check if already logged in
        const savedEmail = sessionStorage.getItem('firm_email');
        if (savedEmail) {
            verifyFirm(savedEmail);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyFirm = async (firmEmail) => {
        try {
            const res = await fetch(`/api/portal/auth?email=${encodeURIComponent(firmEmail)}`);
            const data = await res.json();

            if (data.firm && data.firm.status === 'approved') {
                setFirmData(data.firm);
                setAuthenticated(true);
                sessionStorage.setItem('firm_email', firmEmail);
            } else if (data.firm && data.firm.status === 'pending') {
                alert('Your application is still pending approval.');
            } else if (data.firm && data.firm.status === 'suspended') {
                alert('Your account has been suspended. Please contact support.');
            } else {
                alert('No approved firm found with this email.');
                sessionStorage.removeItem('firm_email');
            }
        } catch (error) {
            console.error('Auth error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        await verifyFirm(email);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('firm_email');
        setAuthenticated(false);
        setFirmData(null);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading...
            </div>
        );
    }

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
                    maxWidth: '450px',
                    width: '100%'
                }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Firm Portal</h1>
                    <p style={{ color: 'var(--text-light)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                        Access your leads and account information
                    </p>

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Login with your registered email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@company.com"
                                required
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Access Portal
                        </button>
                    </form>

                    <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'center' }}>
                        Not registered yet? <Link href="/contractor-application" style={{ color: 'var(--accent)' }}>Apply here</Link>
                    </p>
                </div>
            </div>
        );
    }

    const navItems = [
        { href: '/portal', label: 'Dashboard' },
        { href: '/portal/leads', label: 'My Leads' },
        { href: '/portal/payments', label: 'Payments & Credits' }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: '#2c3e50',
                color: 'white',
                padding: '2rem 0',
                flexShrink: 0
            }}>
                <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1rem', fontFamily: 'Playfair Display, serif', marginBottom: '0.25rem' }}>
                        {firmData?.company_name || 'Firm Portal'}
                    </h2>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                        Credits: <strong style={{ color: '#27ae60' }}>{firmData?.credits || 0}</strong>
                    </span>
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
                                borderLeft: pathname === item.href ? '3px solid #27ae60' : '3px solid transparent',
                                fontSize: '0.95rem'
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                    <button
                        onClick={handleLogout}
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
