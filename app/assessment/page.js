'use client';

import Link from 'next/link';

export default function Assessment() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#1a1a1a', // Plain dark background to suit theme
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>


            <div style={{
                textAlign: 'center',
                maxWidth: '700px',
                padding: '4rem',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                <h1 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '3.5rem',
                    marginBottom: '1.5rem',
                    color: 'var(--primary-dark)',
                    letterSpacing: '-0.02em'
                }}>
                    Working Style Match
                </h1>
                <div style={{ width: '60px', height: '1px', background: 'var(--accent)', margin: '0 auto 2rem' }}></div>
                <p style={{
                    fontSize: '1.2rem',
                    color: 'var(--text)',
                    marginBottom: '2.5rem',
                    lineHeight: 1.7,
                    fontWeight: 400
                }}>
                    Good renovations aren't just about pretty pictures. They're about finding designers who work the way <em>you</em> work. We match you with 3 firms based on communication style, timeline preferences, and decision-making approach.
                </p>
                <a href="/homeowner-enquiry" className="btn btn-primary" style={{
                    padding: '1.2rem 3.5rem',
                    background: 'var(--primary-dark)',
                    color: 'white',
                    border: '1px solid var(--primary-dark)',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: 10
                }}>
                    Begin Profile
                </a>
                <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                    10 Insightful Questions • 2 Minutes
                </p>
            </div>
        </div>
    );
}
