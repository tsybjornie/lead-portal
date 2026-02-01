'use client';

import Link from 'next/link';

export default function HardTruthsPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Header */}
            <div style={{
                padding: '5rem 0 3rem',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg-cream)'
            }}>
                <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
                    <p style={{
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '1rem',
                        color: 'var(--text-light)'
                    }}>
                        Please Read Before Proceeding
                    </p>
                    <h1 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        color: 'var(--primary-dark)',
                        marginBottom: '1.5rem',
                        fontWeight: 400
                    }}>
                        Hard Truths
                    </h1>
                    <p style={{
                        fontSize: '1.15rem',
                        color: 'var(--text-light)',
                        lineHeight: 1.7,
                        maxWidth: '640px',
                        margin: '0 auto',
                        fontStyle: 'italic'
                    }}>
                        Renovation projects involve multiple parties, changing conditions, and human judgment.
                        This platform exists to improve clarity — not to eliminate reality.
                    </p>
                </div>
            </div>

            <div className="container" style={{
                maxWidth: '800px',
                padding: '5rem 1.5rem'
            }}>

                {/* For Homeowners */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '2rem',
                        color: 'var(--primary-dark)',
                        marginBottom: '2.5rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border)'
                    }}>
                        For Homeowners
                    </h2>

                    <div style={{ display: 'grid', gap: '3rem' }}>
                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #1: Renovation outcomes vary</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Even with the same firm, outcomes can differ due to site conditions, timelines, material availability, and personnel changes. No platform can guarantee identical results across projects.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #2: Quotes are not directly comparable</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Two quotations may differ significantly because of scope interpretation, material assumptions, exclusions, and allowances. A lower price does not always represent the same scope of work.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #3: No introduction platform guarantees workmanship</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Workmanship quality depends on individuals, trades availability, and site execution. We introduce firms — we do not control execution.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #4: Roles are often misunderstood</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Interior designers, project managers, and contractors have different responsibilities. Confusion around roles is one of the most common causes of disputes.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #5: Communication matters more than design</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Many renovation issues arise from misaligned expectations and communication breakdowns rather than design quality alone.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #6: Experiences will differ</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Skilled tradespeople age, retire, or change teams. Even reputable firms may deliver different experiences across time and projects.
                            </p>
                        </div>
                    </div>
                </section>

                {/* For Renovation Firms */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '2rem',
                        color: 'var(--primary-dark)',
                        marginBottom: '2.5rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border)'
                    }}>
                        For Residential Renovation Firms
                    </h2>

                    <div style={{ display: 'grid', gap: '3rem' }}>
                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #1: Access does not guarantee conversion</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Payment provides access to homeowner enquiries for consultation and discussion. It does not guarantee project awards or outcomes.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #2: Limited volume is intentional</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                We cap enquiries to avoid volume-driven behaviour. This platform is not designed for high-throughput or price-competition strategies.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #3: Some homeowners are still deciding</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Even after screening, some homeowners may still be exploring timelines, budgets, or options.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #4: Transparency reduces conflict</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Firms that clearly disclose scope, roles, limitations, and exclusions experience fewer disputes and smoother engagements.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #5: This platform is not for everyone</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Firms seeking high-volume leads, blind quoting, or price-first competition may find other platforms more suitable.
                            </p>
                        </div>
                    </div>
                </section>

                {/* For Commercial Property Owners / Tenants */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '2rem',
                        color: 'var(--primary-dark)',
                        marginBottom: '2.5rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border)'
                    }}>
                        For Commercial Property Owners / Tenants
                    </h2>

                    <div style={{ display: 'grid', gap: '3rem' }}>
                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #1: Approvals drive timelines more than design</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Commercial timelines are often determined by approvals (e.g. landlord, MCST, SCDF, BCA, NEA, SFA), not by design speed or contractor availability. Delays at the approval stage are common and outside any single party’s control.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #2: Not all firms handle commercial submissions</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Some firms focus on design and coordination, while others handle statutory submissions and site execution. It is the client’s responsibility to ensure that the engaged parties collectively cover authority submissions, compliance, and licensed execution where required.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #3: Budget ranges are wide by necessity</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Commercial project costs vary significantly due to fire safety requirements, mechanical & electrical scope, operational constraints, and landlord conditions. Early budgets are indicative, not fixed commitments.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #4: Scope changes are common</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Commercial requirements often evolve due to authority feedback, landlord conditions, and operational needs. Variations are a normal part of commercial projects, not an exception.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #5: No platform can guarantee regulatory approval</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Approval outcomes depend on regulatory authorities and project compliance. No introduction platform or consultant can guarantee approval results.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #6: Coordination complexity increases risk</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Commercial projects involve multiple stakeholders: owners, landlords, consultants, authorities, and contractors. Misalignment between parties is a common cause of delays and disputes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* For Commercial Renovation Firms / Contractors */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '2rem',
                        color: 'var(--primary-dark)',
                        marginBottom: '2.5rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border)'
                    }}>
                        For Commercial Renovation Firms
                    </h2>

                    <div style={{ display: 'grid', gap: '3rem' }}>
                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #1: Commercial enquiries require compliance readiness</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Firms must be prepared to handle authority submissions, documentation, and coordination with landlords and consultants. Projects may not proceed without proper compliance coverage.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #2: Not all enquiries proceed immediately</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Commercial clients may be budgeting, awaiting landlord approval, or planning phased works. Access to enquiries does not guarantee immediate project commencement.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #3: Pricing clarity matters more than speed</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Commercial clients prioritise scope clarity, compliance understanding, and risk management. Rushed or vague quotations increase dispute risk.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #4: Roles must be explicitly defined</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Design, project management, and execution responsibilities must be clearly stated. Assumptions about “who handles what” are a major source of conflict in commercial projects.
                            </p>
                        </div>

                        <div className="truth-item">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Hard Truth #5: This platform prioritises clarity over volume</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                                Firms seeking high-volume, fast-turnover enquiries may find other channels more suitable. Commercial projects benefit from fewer, better-aligned introductions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Closing / Acknowledgement */}
                <section style={{
                    background: 'var(--bg-cream)',
                    padding: '3rem',
                    border: '1px solid var(--border)',
                    textAlign: 'center'
                }}>
                    <h3 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '1.5rem',
                        marginBottom: '1.5rem',
                        color: 'var(--primary-dark)'
                    }}>
                        Why We State This Upfront
                    </h3>
                    <p style={{ lineHeight: 1.8, color: 'var(--text)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Most renovation conflicts begin with assumptions that were never discussed.
                        We state these realities early so discussions start on clearer ground.
                        If these points feel uncomfortable, this platform may not be the right fit — and that is intentional.
                    </p>
                    <div style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-light)',
                        borderTop: '1px solid #dcdcdc',
                        paddingTop: '1.5rem',
                        marginTop: '1.5rem'
                    }}>
                        Acknowledgement: By proceeding, users acknowledge that renovation projects involve uncertainty and that outcomes depend on many factors beyond introductions alone.
                    </div>
                </section>

                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <Link href="/faq" style={{
                        color: 'var(--text-light)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        letterSpacing: '0.05em'
                    }}>
                        ← Return to FAQ
                    </Link>
                </div>

            </div>
        </div>
    );
}
