'use client';

import Link from 'next/link';
import { useMarket } from '../context/MarketContext';

export default function Footer() {
    const { market } = useMarket();

    return (
        <footer style={{
            background: '#1a1a1a', // Darker for better contrast
            color: '#e0e0e0',
            padding: '4rem 0',
            marginTop: 'auto', // Push to bottom if content is short
            borderTop: '1px solid #333'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem',
                    textAlign: 'left'
                }}>
                    {/* Column 1: Brand */}
                    <div>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', marginBottom: '1rem', color: 'white' }}>roof</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.6 }}>
                            Connecting homeowners with {market === 'SG' ? "Singapore's" : "Malaysia's"} most trusted renovation professionals through intelligent matching.
                        </p>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                            <a
                                href="mailto:hello@roofplatform.com"
                                style={{
                                    color: '#D4AF37', // Gold color for visibility
                                    textDecoration: 'underline',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#FFD700';
                                    e.currentTarget.style.opacity = '0.8';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#D4AF37';
                                    e.currentTarget.style.opacity = '1';
                                }}
                            >
                                <span style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>✉</span> hello@roofplatform.com
                            </a>
                        </p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            <a
                                href="https://wa.me/6581109542"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: '#25D366',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <span style={{ fontSize: '1.1rem' }}>✆</span> WhatsApp: +65 8110 9542
                            </a>
                        </p>
                    </div>

                    {/* Column 2: Platform */}
                    <div>
                        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: '#888' }}>Platform</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}><Link href={`/${market.toLowerCase()}`} style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Home</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link href={`/${market.toLowerCase()}/assessment`} style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Get Matched</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link href={`/${market.toLowerCase()}/about`} style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>About Us</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link href={`/${market.toLowerCase()}/faq`} style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>FAQ</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link href={`/${market.toLowerCase()}/guides`} style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Guides & References</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div>
                        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: '#888' }}>Legal & Transparency</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}><Link href={`/${market.toLowerCase()}/legal/trust`} style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Trust & Transparency</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link href={`/${market.toLowerCase()}/legal/roles`} style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Roles & Responsibilities</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link href={`/${market.toLowerCase()}/legal/disclaimers`} style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Disclaimers</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link href={`/${market.toLowerCase()}/hard-truths`} style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Hard Truths</Link></li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid #333',
                    paddingTop: '2rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    alignItems: 'center'
                }}>
                    <p style={{ marginBottom: 0, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                        &copy; {new Date().getFullYear()} roof. All rights reserved.
                    </p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.5, fontStyle: 'italic', maxWidth: '600px' }}>
                        roof is an introduction service only. We do not perform renovation works, handle escrow, or guarantee the performance of any firm.
                    </p>
                </div>
            </div>
        </footer >
    );
}
