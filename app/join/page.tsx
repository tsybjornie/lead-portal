'use client';

import Link from 'next/link';
import { useState } from 'react';

const ROLES = [
    {
        id: 'homeowner',
        letter: 'H',
        title: 'I\'m a Homeowner',
        subtitle: 'Looking for a designer',
        desc: 'Get matched with 3 pre-qualified interior designers who fit your budget, style, and working preferences.',
        cta: 'Start Matching',
        href: '/signup/homeowner',
        color: '#3B82F6',
        bg: '#EFF6FF',
    },
    {
        id: 'designer',
        letter: 'D',
        title: 'I\'m a Designer / ID Firm',
        subtitle: 'Looking for clients & tools',
        desc: 'Access quotation tools, project management, and get matched with qualified homeowner leads.',
        cta: 'Register Your Firm',
        href: '/signup',
        color: '#10B981',
        bg: '#ECFDF5',
    },
    {
        id: 'contractor',
        letter: 'C',
        title: 'I\'m a Contractor',
        subtitle: 'Looking for subcontract work',
        desc: 'Get dispatched to renovation projects. Painting, plumbing, electrical, tiling — registered companies welcome.',
        cta: 'Join as Contractor',
        href: '/signup/contractor',
        color: '#F59E0B',
        bg: '#FFFBEB',
    },
    {
        id: 'worker',
        letter: 'W',
        title: 'I\'m a Tradesman / Worker',
        subtitle: 'Looking for jobs',
        desc: 'Get dispatched to verified projects. Plumbers, electricians, tilers, carpenters — all trades welcome.',
        cta: 'Join as Worker',
        href: '/signup/worker',
        color: '#8B5CF6',
        bg: '#F5F3FF',
    },
    {
        id: 'brand',
        letter: 'B',
        title: 'I\'m a Brand / Supplier',
        subtitle: 'Looking for trade channels',
        desc: 'List your products in our material catalog. Get specified by designers. Offer trade pricing to verified firms.',
        cta: 'Join as Brand Partner',
        href: '/signup/brand',
        color: '#EC4899',
        bg: '#FDF2F8',
    },
];

export default function SignupLanding() {
    const [hovered, setHovered] = useState<string | null>(null);
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    return (
        <div style={{ fontFamily: f, background: '#FAFAF9', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 48, maxWidth: 600 }}>
                <Link href="/landing" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10, background: '#37352F',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 18, fontWeight: 800,
                    }}>R</div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#37352F', letterSpacing: '-0.03em' }}>Roof</span>
                </Link>
                <h1 style={{ fontSize: 36, fontWeight: 900, color: '#37352F', letterSpacing: '-0.03em', margin: '0 0 12px' }}>
                    Join the Platform
                </h1>
                <p style={{ fontSize: 15, color: '#9B9A97', margin: 0, lineHeight: 1.6 }}>
                    Everyone builds a home. Pick your role.
                </p>
            </div>

            {/* Role Cards — 3 top, 2 bottom centered */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, maxWidth: 900, width: '100%' }}>
                {ROLES.map((role, i) => {
                    const span = i < 3 ? 2 : 3;
                    return (
                        <Link
                            key={role.id}
                            href={role.href}
                            style={{ textDecoration: 'none', gridColumn: `span ${span}` }}
                            onMouseEnter={() => setHovered(role.id)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <div style={{
                                background: hovered === role.id ? role.bg : 'white',
                                border: `1.5px solid ${hovered === role.id ? role.color : '#E9E9E7'}`,
                                borderRadius: 16,
                                padding: '28px 24px',
                                transition: 'all 0.2s',
                                transform: hovered === role.id ? 'translateY(-4px)' : 'none',
                                boxShadow: hovered === role.id ? `0 8px 24px ${role.color}15` : 'none',
                                cursor: 'pointer',
                                height: '100%',
                            }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 8, background: role.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: 16, fontWeight: 800, marginBottom: 12,
                                }}>{role.letter}</div>
                                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#37352F', margin: '0 0 4px' }}>{role.title}</h2>
                                <div style={{ fontSize: 11, fontWeight: 600, color: role.color, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{role.subtitle}</div>
                                <p style={{ fontSize: 13, color: '#9B9A97', lineHeight: 1.5, margin: '0 0 16px' }}>{role.desc}</p>
                                <div style={{
                                    fontSize: 13, fontWeight: 700, color: role.color,
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                }}>
                                    {role.cta} →
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Manifesto */}
            <div style={{ textAlign: 'center', marginTop: 40, maxWidth: 500 }}>
                <p style={{ fontSize: 12, color: '#C8C7C3', lineHeight: 1.8, fontStyle: 'italic' }}>
                    Roof is an open platform. Everyone is welcome — your credentials, certifications, and track record speak for you. We don't gatekeep. We show the truth.
                </p>
            </div>

            {/* Footer link */}
            <div style={{ marginTop: 24 }}>
                <span style={{ fontSize: 13, color: '#9B9A97' }}>Already have an account? </span>
                <Link href="/login" style={{ fontSize: 13, fontWeight: 600, color: '#37352F', textDecoration: 'none' }}>Log in</Link>
            </div>
        </div>
    );
}
