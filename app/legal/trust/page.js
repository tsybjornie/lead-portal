import Link from 'next/link';

export const metadata = {
    title: 'Trust & Transparency - RenoBuilders',
    description: 'How RenoBuilders works: our match-first approach, quality standards, and commitment to transparency.'
};

export default function TrustPage() {
    return (
        <div style={{ background: 'white', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 style={{ marginBottom: '2rem' }}>Trust & Transparency</h1>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>How RenoBuilders Works</h2>
                    <p>
                        RenoBuilders is an <strong>introduction service</strong> that connects homeowners with qualified renovation firms in Singapore.
                        We use a match-first approach to ensure quality connections without the noise of browsing or comparison shopping.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>Our Match-First Philosophy</h2>
                    <p>We believe the best way to find a renovation firm is through intelligent matching, not endless browsing.</p>

                    <div style={{
                        background: 'var(--bg-light)',
                        padding: '2rem',
                        borderRadius: '12px',
                        marginTop: '1.5rem'
                    }}>
                        <h3 style={{ marginBottom: '1rem' }}>What This Means:</h3>
                        <ul style={{ marginLeft: '1.5rem' }}>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>No firm browsing or searching</strong> - You don&apos;t browse profiles or compare dozens of firms
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>2-4 curated matches only</strong> - We introduce you to a small number of suitable firms
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>No rankings</strong> - Each matched firm is suitable; we don&apos;t rank them
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>Time-bound introductions</strong> - Firms have 7-14 days to respond to your inquiry
                            </li>
                        </ul>
                    </div>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>How Firms Are Matched</h2>
                    <p>When you complete our quiz, we match you based on:</p>

                    <div style={{
                        display: 'grid',
                        gap: '1rem',
                        marginTop: '1.5rem'
                    }}>
                        <div style={{
                            padding: '1.5rem',
                            border: '2px solid var(--border)',
                            borderRadius: '8px',
                            borderLeft: '4px solid var(--primary)'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Budget Alignment</h3>
                            <p style={{ marginBottom: 0, color: 'var(--text-light)' }}>
                                Firms experienced with projects in your budget range
                            </p>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            border: '2px solid var(--border)',
                            borderRadius: '8px',
                            borderLeft: '4px solid var(--primary)'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Scope Expertise</h3>
                            <p style={{ marginBottom: 0, color: 'var(--text-light)' }}>
                                Firms capable of handling your specific renovation needs
                            </p>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            border: '2px solid var(--border)',
                            borderRadius: '8px',
                            borderLeft: '4px solid var(--primary)'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Capacity Availability</h3>
                            <p style={{ marginBottom: 0, color: 'var(--text-light)' }}>
                                Firms with availability to take on new projects
                            </p>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            border: '2px solid var(--border)',
                            borderRadius: '8px',
                            borderLeft: '4px solid var(--primary)'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Working Style Fit</h3>
                            <p style={{ marginBottom: 0, color: 'var(--text-light)' }}>
                                Firms whose approach aligns with your communication and involvement preferences
                            </p>
                        </div>
                    </div>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>Quality Standards for Firms</h2>
                    <p>All firms in our network are:</p>
                    <ul style={{ marginLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.75rem' }}>Registered businesses in Singapore</li>
                        <li style={{ marginBottom: '0.75rem' }}>Licensed as Interior Designers (ID) or Main Contractors (MC)</li>
                        <li style={{ marginBottom: '0.75rem' }}>Subject to capacity limits to ensure quality service</li>
                        <li style={{ marginBottom: '0.75rem' }}>Required to respond to leads within their validity period</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>What We Track (But Don&apos;t Show Publicly)</h2>
                    <p>To maintain match quality, we internally monitor:</p>
                    <ul style={{ marginLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.75rem' }}>Response times to homeowner inquiries</li>
                        <li style={{ marginBottom: '0.75rem' }}>Complaint signals and feedback</li>
                        <li style={{ marginBottom: '0.75rem' }}>Lead acceptance and conversion patterns</li>
                    </ul>
                    <p style={{
                        background: '#fef3e0',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginTop: '1rem'
                    }}>
                        <strong>Note:</strong> We do not publish public ratings or reviews. Quality control is handled internally through our matching algorithm and firm management.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>Your Data & Privacy</h2>
                    <p>When you submit a quiz:</p>
                    <ul style={{ marginLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.75rem' }}>
                            Your contact details are only shared with matched firms
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            Firms see your details only after they accept the lead
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            We do not sell or share your data with third parties
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            You control all communications with firms directly
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>Questions or Concerns?</h2>
                    <p>
                        If you have questions about how we work or concerns about a matched firm,
                        please contact us directly. We&apos;re committed to maintaining the quality and integrity of our platform.
                    </p>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <Link href="/legal/roles" className="btn btn-secondary">
                            Roles & Responsibilities
                        </Link>
                        <Link href="/legal/disclaimers" className="btn btn-secondary">
                            Disclaimers
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
