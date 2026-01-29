import Link from 'next/link';

export const metadata = {
    title: 'Roles & Responsibilities - RenoBuilders',
    description: 'Understanding the roles of homeowners, firms, and RenoBuilders in the renovation process.'
};

export default function RolesPage() {
    return (
        <div style={{ background: 'white', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 style={{ marginBottom: '2rem' }}>Roles & Responsibilities</h1>

                <p style={{ fontSize: '1.1rem', marginBottom: '3rem', color: 'var(--text-light)' }}>
                    RenoBuilders is an introduction service. Understanding each party&apos;s role ensures realistic expectations and successful outcomes.
                </p>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{
                        color: 'var(--primary)',
                        paddingBottom: '0.5rem',
                        borderBottom: '3px solid var(--primary)'
                    }}>RenoBuilders&apos; Role (Our Platform)</h2>

                    <div style={{ marginTop: '1.5rem' }}>
                        <h3 style={{ color: 'var(--success)' }}>✓ What We DO</h3>
                        <ul style={{ marginLeft: '1.5rem', marginBottom: '2rem' }}>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>Introduce</strong> homeowners to 2-4 suitable firms based on project requirements
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>Verify</strong> firm registration and basic credentials before onboarding
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>Monitor</strong> response times and complaint signals internally
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>Manage</strong> firm capacity to prevent over-commitment
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>Facilitate</strong> the initial connection between parties
                            </li>
                        </ul>

                        <h3 style={{ color: 'var(--error)' }}>✗ What We DON&apos;T DO</h3>
                        <ul style={{ marginLeft: '1.5rem' }}>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>Guarantee</strong> outcomes, project completion, or contract signing
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>Handle</strong> payments, contracts, or escrow for renovation works
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>Mediate</strong> disputes between homeowners and firms
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>Supervise</strong> renovation work or quality control
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                <strong>Provide</strong> legal, financial, or technical advice
                            </li>
                        </ul>
                    </div>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{
                        color: 'var(--primary)',
                        paddingBottom: '0.5rem',
                        borderBottom: '3px solid var(--primary)'
                    }}>Homeowner&apos;s Responsibilities</h2>

                    <ul style={{ marginLeft: '1.5rem', marginTop: '1.5rem' }}>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Provide accurate information</strong> in the quiz (budget, scope, timeline)
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Respond to firms</strong> that contact you within reasonable timeframes
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Conduct your own due diligence</strong> on matched firms (reviews, references, portfolios)
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Negotiate and sign contracts</strong> directly with your chosen firm
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Handle all payments</strong> directly with the firm (not through our platform)
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Verify permits, licenses, and insurance</strong> before committing to any work
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Manage the renovation project</strong> directly with your contractor/designer
                        </li>
                    </ul>

                    <div style={{
                        background: '#fef3e0',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        marginTop: '1.5rem',
                        borderLeft: '4px solid var(--accent)'
                    }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>Important Reminder</h4>
                        <p style={{ marginBottom: 0 }}>
                            You are <strong>not obligated</strong> to work with any matched firm.
                            You may choose to work with some, one, or none of the firms introduced to you.
                        </p>
                    </div>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{
                        color: 'var(--primary)',
                        paddingBottom: '0.5rem',
                        borderBottom: '3px solid var(--primary)'
                    }}>Firm&apos;s (Contractor/Designer) Responsibilities</h2>

                    <ul style={{ marginLeft: '1.5rem', marginTop: '1.5rem' }}>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Respond within 7-14 days</strong> of lead assignment (lead validity period)
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Provide professional service</strong> including consultations, quotes, and proposals
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Maintain valid licenses</strong> and insurance as required by Singapore regulations
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Be transparent</strong> about pricing, timelines, and scope limitations
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Honor contracted terms</strong> if engaged by the homeowner
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Comply with capacity limits</strong> set by our platform
                        </li>
                    </ul>

                    <div style={{
                        background: '#e8f5e9',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        marginTop: '1.5rem',
                        borderLeft: '4px solid var(--success)'
                    }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>Quality Accountability</h4>
                        <p style={{ marginBottom: 0 }}>
                            Firms that consistently fail to respond or generate complaints may be paused or removed from our network.
                            However, contract disputes and project quality issues are between you and the firm directly.
                        </p>
                    </div>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>Understanding &quot;Introduction Service Only&quot;</h2>
                    <p>
                        RenoBuilders operates as a <strong>lead generation and introduction platform</strong>.
                        This means:
                    </p>

                    <div style={{
                        background: 'var(--bg-light)',
                        padding: '2rem',
                        borderRadius: '12px',
                        marginTop: '1.5rem'
                    }}>
                        <ol style={{ marginLeft: '1.5rem' }}>
                            <li style={{ marginBottom: '1rem' }}>
                                <strong>We facilitate the introduction</strong> between homeowners and firms
                            </li>
                            <li style={{ marginBottom: '1rem' }}>
                                <strong>All subsequent interactions</strong> (quotes, contracts, payments, work) happen directly between parties
                            </li>
                            <li style={{ marginBottom: '1rem' }}>
                                <strong>We are not party to any contract</strong> you sign with a firm
                            </li>
                            <li style={{ marginBottom: '1rem' }}>
                                <strong>We do not hold deposits or payments</strong> for renovation works
                            </li>
                            <li style={{ marginBottom: 0 }}>
                                <strong>Legal and regulatory compliance</strong> is the responsibility of the contracting parties
                            </li>
                        </ol>
                    </div>
                </section>

                <section>
                    <h2>If Something Goes Wrong</h2>
                    <p>For contract disputes, payment issues, or work quality concerns:</p>
                    <ul style={{ marginLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>First:</strong> Communicate directly with the firm to resolve the issue
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>If unresolved:</strong> Seek legal advice or mediation services
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Report to authorities:</strong> CASE, BCA, or relevant regulatory bodies
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Inform us:</strong> We track complaint signals and may take action on the firm&apos;s account
                        </li>
                    </ul>

                    <p style={{
                        background: '#fee',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        marginTop: '1.5rem',
                        borderLeft: '4px solid var(--error)'
                    }}>
                        <strong>Important:</strong> RenoBuilders cannot mediate disputes, recover payments, or compel firms to complete work.
                        Our role is limited to managing the firm&apos;s future access to our platform.
                    </p>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <Link href="/legal/trust" className="btn btn-secondary">
                            Trust & Transparency
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
