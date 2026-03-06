'use client';

import Link from 'next/link';
import { useState } from 'react';

const ROLES = [
    {
        id: 'homeowner', num: '01',
        title: 'Homeowner',
        subtitle: 'Looking for a designer',
        desc: 'Get matched with 3 pre-qualified interior designers who fit your budget, style, and working preferences.',
        cta: 'Start Matching',
        href: '/signup/homeowner',
    },
    {
        id: 'designer', num: '02',
        title: 'Designer / ID Firm',
        subtitle: 'Looking for clients & tools',
        desc: 'Access quotation tools, project management, and get matched with qualified homeowner leads.',
        cta: 'Register Your Firm',
        href: '/signup',
    },
    {
        id: 'contractor', num: '03',
        title: 'Contractor',
        subtitle: 'Looking for subcontract work',
        desc: 'Get dispatched to renovation projects. Painting, plumbing, electrical, tiling — registered companies welcome.',
        cta: 'Join as Contractor',
        href: '/signup/contractor',
    },
    {
        id: 'worker', num: '04',
        title: 'Tradesman / Worker',
        subtitle: 'Looking for jobs',
        desc: 'Get dispatched to verified projects. Plumbers, electricians, tilers, carpenters — all trades welcome.',
        cta: 'Join as Worker',
        href: '/signup/worker',
    },
    {
        id: 'brand', num: '05',
        title: 'Brand / Supplier',
        subtitle: 'Looking for trade channels',
        desc: 'List your products in our material catalog. Get specified by designers. Offer trade pricing to verified firms.',
        cta: 'Join as Brand Partner',
        href: '/signup/brand',
    },
];

export default function SignupLanding() {
    const [hovered, setHovered] = useState<string | null>(null);
    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                .role-row { transition: all 0.3s ease; text-decoration: none; color: inherit; }
                .role-row:hover { background: rgba(0,0,0,0.02) !important; }
                .role-row:hover .role-title { color: #000 !important; }
                .role-row:hover .role-arrow { opacity: 1 !important; transform: translateX(0) !important; }
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
                    fontSize: 12, fontWeight: 400, color: 'rgba(0,0,0,0.5)',
                    textDecoration: 'none', transition: 'color 0.2s',
                }}>
                    Already have an account? <span style={{ fontWeight: 600, color: '#111' }}>Log in</span>
                </Link>
            </nav>

            {/* ═══════ CONTENT ═══════ */}
            <div style={{ maxWidth: 700, margin: '0 auto', padding: '120px 48px 80px' }}>
                <div style={{ textAlign: 'center', marginBottom: 80 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 10, fontWeight: 500,
                        color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em',
                        textTransform: 'uppercase' as const, marginBottom: 40,
                    }}>SELECT YOUR ROLE</div>

                    <h1 style={{
                        fontSize: 'clamp(40px, 6vw, 60px)', fontWeight: 300, lineHeight: 1.05,
                        letterSpacing: '-0.04em', margin: '0 0 16px',
                    }}>
                        Join the<br />
                        <span style={{ color: 'rgba(0,0,0,0.5)', fontStyle: 'italic' }}>platform.</span>
                    </h1>

                    <p style={{
                        fontSize: 14, color: 'rgba(0,0,0,0.5)', lineHeight: 1.7, margin: 0,
                    }}>
                        Everyone builds a home. Pick your role.
                    </p>
                </div>

                {/* Role List */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    {ROLES.map(role => (
                        <Link
                            key={role.id}
                            href={role.href}
                            className="role-row"
                            style={{
                                display: 'grid', gridTemplateColumns: '40px 1fr auto 40px',
                                alignItems: 'center', padding: '24px 0',
                                borderBottom: '1px solid rgba(0,0,0,0.06)',
                                textDecoration: 'none', color: 'inherit',
                            }}
                            onMouseEnter={() => setHovered(role.id)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <span style={{
                                fontFamily: mono, fontSize: 10, fontWeight: 400,
                                color: 'rgba(0,0,0,0.4)', letterSpacing: '0.05em',
                            }}>{role.num}</span>
                            <div>
                                <span className="role-title" style={{
                                    fontSize: 18, fontWeight: 400, color: 'rgba(0,0,0,0.6)',
                                    letterSpacing: '-0.02em', transition: 'color 0.3s',
                                }}>{role.title}</span>
                                {hovered === role.id && (
                                    <div style={{
                                        fontSize: 12, color: 'rgba(0,0,0,0.5)',
                                        marginTop: 4, lineHeight: 1.6,
                                    }}>{role.desc}</div>
                                )}
                            </div>
                            <span style={{
                                fontFamily: mono, fontSize: 9, fontWeight: 500,
                                color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em',
                                textTransform: 'uppercase' as const,
                            }}>{role.subtitle}</span>
                            <span className="role-arrow" style={{
                                color: 'rgba(0,0,0,0.5)', fontSize: 16, textAlign: 'right',
                                opacity: 0, transform: 'translateX(-8px)', transition: 'all 0.3s',
                            }}>→</span>
                        </Link>
                    ))}
                </div>

                {/* Manifesto */}
                <div style={{
                    textAlign: 'center', marginTop: 60,
                    padding: '0 40px',
                }}>
                    <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', lineHeight: 1.8, fontStyle: 'italic' }}>
                        Roof is an open platform. Everyone is welcome — your credentials, certifications,
                        and track record speak for you. We don&apos;t gatekeep. We show the truth.
                    </p>
                </div>
            </div>

            {/* ═══════ FOOTER ═══════ */}
            <footer style={{
                padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.05em' }}>
                    © 2026 ORDINANCE SYSTEMS · SINGAPORE
                </span>
                <div style={{ display: 'flex', gap: 24 }}>
                    {[
                        { label: 'Landing', href: '/landing' },
                        { label: 'Platform', href: '/hub' },
                        { label: 'Founding 20', href: '/founding' },
                    ].map(link => (
                        <Link key={link.label} href={link.href}
                            style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.2)'}
                        >{link.label}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
