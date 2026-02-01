import LeadForm from '../../components/LeadForm';

export const metadata = {
    title: 'Condo Renovation Consultation Singapore | MCST Compliance',
    description: 'Professional condo renovation consultation in Singapore. Connect with contractors familiar with MCST requirements, deposit procedures, and condominium house rules.',
    keywords: ['condo renovation Singapore', 'condominium renovation', 'MCST approval', 'condo renovation permit'],
};

export default function CondoRenovationPage() {
    const faqs = [
        {
            question: "Do I need MCST approval for condo renovations?",
            answer: "Yes, all condo renovations require prior notification and approval from your Management Corporation Strata Title (MCST). Most condos require submission of renovation plans, contractor details, and insurance documents at least 7-14 days before work begins."
        },
        {
            question: "What is the MCST renovation deposit?",
            answer: "Most condos require a renovation deposit (typically $3,000-$10,000) paid before work starts. This is fully refundable after project completion and satisfactory inspection, provided no damage to common property occurs and rules are followed."
        },
        {
            question: "What are typical condo renovation house rules?",
            answer: "Common rules include: renovation hours (usually 9am-6pm weekdays, limited weekend hours), lift usage restrictions (designated goods lift or specific timing), material delivery schedules, noise limits, and protection of common areas like lobbies and corridors."
        },
        {
            question: "Can I remove walls in my condo unit?",
            answer: "Non-structural walls can typically be removed, but you must submit plans to the MCST for approval. Structural walls, columns, and beams cannot be modified. A qualified contractor or designer should identify structural elements during planning."
        },
        {
            question: "How long does MCST approval take?",
            answer: "MCST approval typically takes 7-14 days after complete document submission. Some condos with active management respond within a week, while others may take longer. Submit early to avoid delaying your renovation start date."
        },
        {
            question: "What documents does my condo MCST usually require?",
            answer: "Typical requirements: renovation application form, floor plans showing proposed works, contractor&apos;s business registration, insurance coverage ($1M-$5M public liability), permit indemnity, and sometimes structural engineer endorsement for major hacking works."
        }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <section className="hero">
                <div className="container">
                    <h1>Condo Renovation Consultation in Singapore</h1>
                    <p className="hero-intro">
                        Connect with contractors experienced in condominium renovations who understand MCST approval processes, house rules, and deposit requirements. Whether you own a compact studio or a penthouse unit, we match you with professionals familiar with the specific requirements of private condominium developments in Singapore.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2>Condo Renovation Budget Tiers</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-gray)' }}>
                        Lead pricing for condominium projects based on renovation budget:
                    </p>

                    <div className="budget-grid">
                        <div className="tier-card">
                            <div className="tier-range">$40k – $100k</div>
                            <div className="tier-price">$100 per lead</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>Standard condo refresh</p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$60k – $140k</div>
                            <div className="tier-price">$140 per lead</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>Comprehensive renovation</p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$80k – $180k</div>
                            <div className="tier-price">$180 per lead</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>Premium finishes</p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$120k+</div>
                            <div className="tier-price">$200+ per lead</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>Luxury transformation</p>
                        </div>
                    </div>

                    <p className="tier-note">
                        Condo renovation budgets vary widely based on unit size, finishes, and scope. Larger units and penthouses typically require higher budgets. Lead pricing scales accordingly.
                    </p>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <h2>MCST Rules & Approval Requirements</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Contractors in our network are familiar with standard MCST requirements:
                    </p>

                    <ul className="rules-list">
                        <li>
                            <strong>MCST Submission & Approval</strong>
                            Submit renovation application with floor plans, contractor details, and insurance documents 7-14 days before starting work. Wait for written approval.
                        </li>
                        <li>
                            <strong>Renovation Deposit</strong>
                            Typically $3,000-$10,000 depending on condo. Fully refundable after completion and inspection if no common property damage occurs.
                        </li>
                        <li>
                            <strong>Working Hours</strong>
                            Usually Monday-Friday 9am-6pm, Saturday 9am-3pm (some condos), no work on Sundays/Public Holidays. Check your condo&apos;s specific by-laws.
                        </li>
                        <li>
                            <strong>Insurance Coverage</strong>
                            Contractors must provide public liability insurance ($1M-$5M coverage) and workmen compensation insurance. MCST will require proof.
                        </li>
                        <li>
                            <strong>Common Area Protection</strong>
                            Lobby, lift, corridors must be protected with hoarding/canvas. Use designated goods lift if available. Schedule material deliveries per MCST rules.
                        </li>
                        <li>
                            <strong>Noise & Dust Control</strong>
                            Minimize noise pollution, clean up daily, prevent dust from affecting neighbours. Some condos have strict cleanliness enforcement.
                        </li>
                    </ul>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2>Payment Milestones for Condo Renovations</h2>
                    <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--text-gray)' }}>
                        General guidance only—not contractual or financial advice. Payment schedules should be clearly documented in your renovation contract.
                    </p>

                    <div className="milestone-timeline">
                        <div className="milestone-item">
                            <div className="milestone-title">1. Deposit (10-20%)</div>
                            <p>Upon contract signing. Covers MCST deposit, initial material orders, and contractor mobilization.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">2. After Demolition (20-25%)</div>
                            <p>Old fixtures removed, walls hacked (if applicable), debris cleared. Site ready for rebuilding.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">3. After Masonry & Concealed Works (20-25%)</div>
                            <p>New walls built, waterproofing completed, electrical and plumbing rough-in done, trunking installed.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">4. After Carpentry & Tiling (20-25%)</div>
                            <p>Built-in carpentry installed, floor and wall tiling completed, painting done. Major works complete.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">5. Final Payment (10-20%)</div>
                            <p>After project completion, defect rectification, final inspection, and MCST deposit refund processed. Retain enough for accountability.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <div className="faq-question">{faq.question}</div>
                                <div className="faq-answer">{faq.answer}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2>Request Your Condo Renovation Consultation</h2>
                    <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem', color: 'var(--text-gray)' }}>
                        Share your budget and project scope. We&apos;ll connect you with contractors experienced in condo renovations and MCST compliance.
                    </p>
                    <LeadForm pageType="condo-renovation" />
                </div>
            </section>
        </>
    );
}
