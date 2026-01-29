import Link from 'next/link';

export const metadata = {
    title: 'Disclaimers - RenoBuilders',
    description: 'Important disclaimers about our service limitations, no guarantees policy, and no escrow handling.'
};

export default function DisclaimersPage() {
    return (
        <div style={{ background: 'white', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 style={{ marginBottom: '1rem' }}>Disclaimers & Limitations</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '3rem' }}>
                    Please read carefully. Using our platform means you acknowledge and accept these limitations.
                </p>

                <section style={{
                    background: '#fee',
                    padding: '2rem',
                    borderRadius: '12px',
                    marginBottom: '3rem',
                    borderLeft: '6px solid var(--error)'
                }}>
                    <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>⚠️ No Guarantees or Warranties</h2>
                    <p style={{ fontWeight: 600, marginBottom: '1rem' }}>
                        RenoBuilders makes <strong>NO GUARANTEES</strong> regarding:
                    </p>
                    <ul style={{ marginLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.75rem' }}>
                            Contract signing or project closure with any matched firm
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            Quality, timeliness, or completion of renovation work
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            Firm responsiveness or communication quality
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            Price accuracy or budget adherence
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            Firm credentials beyond basic registration verification
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            Legal compliance with renovation permits or building codes
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            Resolution of disputes between parties
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>No Escrow or Payment Handling</h2>
                    <p style={{ fontWeight: 600, marginBottom: '1rem' }}>
                        RenoBuilders does <strong>NOT</strong> handle renovation payments:
                    </p>

                    <div style={{
                        background: 'var(--bg-light)',
                        padding: '2rem',
                        borderRadius: '12px'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>What This Means:</h3>
                        <ul style={{ marginLeft: '1.5rem' }}>
                            <li style={{ marginBottom: '0.75rem' }}>
                                ✗ We do <strong>NOT</strong> hold deposits, down payments, or milestone payments
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                ✗ We do <strong>NOT</strong> act as an escrow agent or payment intermediary
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                ✗ We do <strong>NOT</strong> process credit cards for renovation works
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                ✗ We do <strong>NOT</strong> provide payment protection or refund services
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                ✗ We do <strong>NOT</strong> verify or approve payment schedules
                            </li>
                        </ul>

                        <p style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            background: 'white',
                            borderRadius: '8px',
                            marginBottom: 0
                        }}>
                            <strong>All payments</strong> for renovation works are made <strong>directly</strong> between you and the firm.
                            RenoBuilders has no visibility into, control over, or responsibility for these transactions.
                        </p>
                    </div>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>Platform Fee Structure</h2>
                    <p>
                        Our platform operates on a lead introduction model:
                    </p>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Homeowners:</strong> Our service is <strong>free</strong>. You pay nothing to submit a quiz or receive matches.
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            <strong>Firms:</strong> Pay for access to pre-qualified leads that match their expertise and capacity.
                        </li>
                    </ul>
                    <p style={{
                        background: '#e8f5e9',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginTop: '1rem'
                    }}>
                        Firm fees are for <strong>lead access only</strong> - not for guarantees, outcomes, or success.
                        Firms pay to contact suitable homeowners, but conversion to a contract is not guaranteed.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>Limitation of Liability</h2>

                    <div style={{
                        border: '2px solid var(--error)',
                        padding: '2rem',
                        borderRadius: '12px'
                    }}>
                        <p style={{ fontWeight: 600, marginBottom: '1rem' }}>
                            To the maximum extent permitted by law:
                        </p>
                        <ol style={{ marginLeft: '1.5rem' }}>
                            <li style={{ marginBottom: '0.75rem' }}>
                                RenoBuilders is <strong>not liable</strong> for any losses, damages, or costs arising from:
                                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                                    <li>Contracts between homeowners and firms</li>
                                    <li>Quality or timeliness of renovation work</li>
                                    <li>Payment disputes or non-payment</li>
                                    <li>Permit violations or regulatory non-compliance</li>
                                    <li>Property damage during renovations</li>
                                    <li>Personal injury on renovation sites</li>
                                </ul>
                            </li>
                            <li style={{ marginBottom: '0.75rem' }}>
                                Our liability for any claim is <strong>limited to</strong> the fees paid (if any) for the specific lead in question
                            </li>
                            <li style={{ marginBottom: 0 }}>
                                We are not responsible for <strong>indirect, consequential, or punitive damages</strong> of any kind
                            </li>
                        </ol>
                    </div>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>Your Responsibilities for Due Diligence</h2>
                    <p style={{ fontWeight: 600, marginBottom: '1rem' }}>
                        Before engaging any firm, YOU must:
                    </p>
                    <div style={{
                        display: 'grid',
                        gap: '1rem'
                    }}>
                        <div style={{
                            padding: '1rem',
                            background: 'var(--bg-light)',
                            borderRadius: '8px',
                            borderLeft: '4px solid var(--accent)'
                        }}>
                            <strong>✓ Verify licenses and credentials</strong>
                            <p style={{ marginBottom: 0, marginTop: '0.25rem', color: 'var(--text-light)' }}>
                                Check BCA registration, insurance coverage, and professional licenses
                            </p>
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: 'var(--bg-light)',
                            borderRadius: '8px',
                            borderLeft: '4px solid var(--accent)'
                        }}>
                            <strong>✓ Request and check references</strong>
                            <p style={{ marginBottom: 0, marginTop: '0.25rem', color: 'var(--text-light)' }}>
                                Speak to past clients, view completed projects, read independent reviews
                            </p>
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: 'var(--bg-light)',
                            borderRadius: '8px',
                            borderLeft: '4px solid var(--accent)'
                        }}>
                            <strong>✓ Review contracts carefully</strong>
                            <p style={{ marginBottom: 0, marginTop: '0.25rem', color: 'var(--text-light)' }}>
                                Understand payment terms, timelines, scope, defect liability periods
                            </p>
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: 'var(--bg-light)',
                            borderRadius: '8px',
                            borderLeft: '4px solid var(--accent)'
                        }}>
                            <strong>✓ Seek independent legal advice</strong>
                            <p style={{ marginBottom: 0, marginTop: '0.25rem', color: 'var(--text-light)' }}>
                                Consult a lawyer before signing renovation contracts, especially for large projects
                            </p>
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: 'var(--bg-light)',
                            borderRadius: '8px',
                            borderLeft: '4px solid var(--accent)'
                        }}>
                            <strong>✓ Understand permit requirements</strong>
                            <p style={{ marginBottom: 0, marginTop: '0.25rem', color: 'var(--text-light)' }}>
                                Ensure your contractor obtains all necessary HDB/URA/BCA permits
                            </p>
                        </div>
                    </div>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>Service Availability & Changes</h2>
                    <ul style={{ marginLeft: '1.5rem' }}>
                        <li style={{ marginBottom: '0.75rem' }}>
                            We may modify, suspend, or discontinue the service at any time
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            We may remove firms from our network without notice
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            Lead expiry periods (7-14 days) are not guaranteed response times
                        </li>
                        <li style={{ marginBottom: '0.75rem' }}>
                            Matching quality depends on firm availability and may vary
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>Acceptance of Terms</h2>
                    <p>
                        By using RenoBuilders, you acknowledge that you have read, understood, and accept these disclaimers and limitations.
                        If you do not agree, please do not use our service.
                    </p>

                    <div style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        marginTop: '2rem'
                    }}>
                        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Summary</h3>
                        <p style={{ marginBottom: '0.5rem' }}>
                            ✓ RenoBuilders is an <strong>introduction service only</strong>
                        </p>
                        <p style={{ marginBottom: '0.5rem' }}>
                            ✓ We provide <strong>no guarantees</strong> about outcomes
                        </p>
                        <p style={{ marginBottom: '0.5rem' }}>
                            ✓ We handle <strong>no payments</strong> for renovation works
                        </p>
                        <p style={{ marginBottom: 0 }}>
                            ✓ You are responsible for <strong>all due diligence</strong> and contracts
                        </p>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <Link href="/legal/trust" className="btn btn-secondary">
                            Trust & Transparency
                        </Link>
                        <Link href="/legal/roles" className="btn btn-secondary">
                            Roles & Responsibilities
                        </Link>
                        <Link href="/" className="btn btn-primary">
                            Back to Home
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
