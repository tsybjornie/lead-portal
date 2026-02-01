export default function AboutPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-cream)',
            padding: '8rem 0 4rem'
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: '400',
                    marginBottom: '3rem',
                    color: 'var(--primary-dark)',
                    textAlign: 'center'
                }}>
                    Why We Built This
                </h1>

                <div style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.9',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-body)'
                }}>
                    <p style={{ marginBottom: '2rem' }}>
                        ROOF was started by renovation industry insiders who were tired of seeing homeowners waste weeks—sometimes months—comparing firms based on portfolios alone.
                    </p>

                    <p style={{ marginBottom: '2rem' }}>
                        Beautiful photos don't guarantee a smooth renovation. We've seen too many projects fall apart not because of design, but because of mismatched working styles: homeowners who need weekly updates paired with designers who communicate monthly. Budget-conscious clients matched with firms that upsell at every turn.
                    </p>

                    <p style={{ marginBottom: '2rem' }}>
                        <strong>We built the matching system we wished existed when we renovated our own homes.</strong>
                    </p>

                    <p style={{ marginBottom: '2rem' }}>
                        Instead of browsing 100 portfolios, you answer questions about how you work, what matters to you, and how you make decisions. We match you with 3 designers who share your approach—not just your aesthetic.
                    </p>

                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2rem',
                        fontWeight: '400',
                        marginTop: '4rem',
                        marginBottom: '1.5rem',
                        color: 'var(--primary-dark)'
                    }}>
                        Our Promise
                    </h2>

                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '2rem 0'
                    }}>
                        {[
                            'No pushy sales. You stay in control.',
                            'No commissions from your project. What firms quote is what you pay.',
                            'No fake reviews. We vet based on BCA registration, HDB licensing, and real project history.',
                            'No obligations. Walk away anytime if the match isn\'t right.'
                        ].map((item, index) => (
                            <li key={index} style={{
                                marginBottom: '1rem',
                                paddingLeft: '2rem',
                                position: 'relative',
                                color: 'var(--text)'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    left: 0,
                                    color: 'var(--accent)',
                                    fontWeight: 'bold'
                                }}>✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <p style={{
                        marginTop: '4rem',
                        padding: '2rem',
                        background: 'rgba(139, 115, 85, 0.1)',
                        borderLeft: '4px solid var(--accent)',
                        fontStyle: 'italic',
                        color: 'var(--text-light)'
                    }}>
                        "The best renovation isn't the prettiest one on Instagram. It's the one that finishes on time, stays on budget, and doesn't make you hate your designer by week 3."
                    </p>
                </div>
            </div>
        </div>
    );
}
