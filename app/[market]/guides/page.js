'use client';

import Link from 'next/link';

export default function GuidesPage() {
    return (
        <div className="home-layout">
            {/* LEFT SIDE - Navigation & Header (Reused style for consistency) */}
            <div className="home-left-panel">
                <div style={{ maxWidth: '600px' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        fontWeight: '400',
                        marginBottom: '2rem',
                        color: 'var(--primary-dark)',
                        lineHeight: '1.2'
                    }}>
                        The Roof Guides
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        marginBottom: '2rem',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-body)',
                        fontWeight: '500'
                    }}>
                        Honest advice on how to navigate the Singapore renovation market without getting burned.
                    </p>
                    <Link href="/" className="btn btn-secondary" style={{
                        fontSize: '0.95rem',
                        padding: '0.5rem 0'
                    }}>
                        ← Back to Home
                    </Link>
                </div>
            </div>

            {/* RIGHT SIDE - Scrollable Content */}
            <div className="home-right-panel" style={{ padding: '4rem 3rem' }}>

                {/* Article 1: The Red Flags */}
                <article style={{ marginBottom: '6rem', maxWidth: '800px' }}>
                    <div style={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: '0.85rem',
                        color: 'var(--accent)',
                        marginBottom: '1rem',
                        fontWeight: '600'
                    }}>
                        Editor's Pick
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        marginBottom: '1.5rem',
                        color: 'white',
                        lineHeight: '1.2'
                    }}>
                        5 Signs Your Contractor is About to Fold (And Ghost You)
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        color: 'rgba(255,255,255,0.8)',
                        marginBottom: '2rem'
                    }}>
                        Renovation disasters typically don't happen overnight. They happen in slow motion, visible only to those who know what to look for. Here are the quiet signals that a firm is in financial trouble.
                    </p>

                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '2rem',
                        marginBottom: '2rem',
                        borderLeft: '4px solid var(--accent)'
                    }}>
                        <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem' }}>1. The "Immediate Start" Discount</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                            If they offer a 10% discount for "starting hacking tomorrow" but require a 50% deposit upfront, run. This is a cash-flow gap panic move. A healthy firm plans weeks in advance.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '2rem',
                        marginBottom: '2rem',
                        borderLeft: '4px solid var(--accent)'
                    }}>
                        <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem' }}>2. The "Ghost" Site</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                            Ask to see an active job site. If they make excuses ("owner is private", "keys not available"), it means they don't have active sites or they are too messy to show. We verify active sites for every partner on Roof.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '2rem',
                        marginBottom: '3rem',
                        borderLeft: '4px solid var(--accent)'
                    }}>
                        <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem' }}>3. The "Generic" Material</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                            If your quote says "Heavy Duty Tiles" or "Quality Laminate" without specifying the brand (e.g., Hafary, Lamitak), they are reserving the right to use the cheapest option available. Always demand brand names in the contract.
                        </p>
                    </div>

                    <Link href="/assessment" className="btn btn-primary" style={{
                        color: 'white',
                        borderBottomColor: 'white',
                        marginTop: '1rem'
                    }}>
                        Get Matched with Verified Firms →
                    </Link>
                </article>

            </div>
        </div>
    );
}
