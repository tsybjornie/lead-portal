'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem',
            background: 'var(--bg-cream)'
        }}>
            <h1 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                color: 'var(--primary-dark)',
                marginBottom: '1rem',
                lineHeight: 1
            }}>
                404
            </h1>
            <h2 style={{
                fontSize: '1.5rem',
                color: 'var(--text)',
                marginBottom: '2rem',
                fontWeight: 400
            }}>
                Page Not Found
            </h2>
            <p style={{
                color: 'var(--text-light)',
                marginBottom: '3rem',
                maxWidth: '400px',
                lineHeight: 1.6
            }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        padding: '0.75rem 2rem',
                        border: '1px solid var(--primary-dark)',
                        background: 'transparent',
                        color: 'var(--primary-dark)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => {
                        e.target.style.background = 'var(--primary-dark)';
                        e.target.style.color = 'white';
                    }}
                    onMouseLeave={e => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--primary-dark)';
                    }}
                >
                    ← Go Back
                </button>

                <Link
                    href="/"
                    style={{
                        padding: '0.75rem 2rem',
                        background: 'var(--primary-dark)',
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        borderRadius: '4px',
                        display: 'inline-block',
                        border: '1px solid var(--primary-dark)'
                    }}
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
