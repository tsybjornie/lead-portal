import LeadForm from '../../components/LeadForm';

export const metadata = {
    title: 'Commercial Renovation Singapore | Office, Retail & F&B Fit-Outs',
    description: 'Commercial renovation consultation in Singapore. Connect with contractors familiar with SCDF, SFA, NEA, BCA, and MOM approvals for office, retail, and F&B spaces.',
    keywords: ['commercial renovation Singapore', 'office renovation', 'retail fitout', 'F&B renovation', 'commercial contractor'],
};

export default function CommercialRenovationPage() {
    const faqs = [
        {
            question: "What approvals are needed for commercial renovations in Singapore?",
            answer: "Commercial renovations often require multiple authority approvals: BCA for structural changes, SCDF for fire safety compliance, NEA for wet trades/F&B, SFA for food establishments, MOM for worker safety. Requirements depend on the type of business and scope of renovation."
        },
        {
            question: "How long does commercial renovation approval take?",
            answer: "Timeline varies by scope and authorities involved. Simple office refreshes may need minimal approvals (1-2 weeks), while F&B fitouts requiring SCDF, NEA, and SFA approvals can take 6-12 weeks. Plan ahead and engage experienced contractors who understand the process."
        },
        {
            question: "Do I need an architect for commercial renovations?",
            answer: "Major structural changes, new mezzanine floors, or significant alterations typically require a Qualified Person (QP) – usually a registered architect or engineer. For minor works like office partitions or cosmetic upgrades, contractors can handle directly with relevant authorities."
        },
        {
            question: "What is the typical budget for office renovation in Singapore?",
            answer: "Office renovations typically range from $50-$150 per square foot depending on finishes and specifications. A 1,000 sqft office might cost $50,000-$150,000. Factors include partitioning needs, electrical requirements, flooring, ceiling systems, and furniture."
        },
        {
            question: "Can commercial renovations be done after business hours?",
            answer: "Yes, many commercial renovations are scheduled after hours or on weekends to minimize business disruption. Contractors experienced in commercial works can coordinate night shifts, though this may incur additional costs for overtime labor."
        },
        {
            question: "What insurance does a commercial contractor need?",
            answer: "Commercial contractors should carry public liability insurance ($5M-$10M coverage), workmen compensation insurance, and contractor's all-risk insurance. Building management typically requires proof of insurance before issuing renovation permits."
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
                    <h1>Commercial Renovation in Singapore</h1>
                    <p className="hero-intro">
                        Connect with contractors experienced in commercial fit-outs, office renovations, retail spaces, and F&B establishments. Our network includes professionals familiar with regulatory approvals from SCDF, SFA, NEA, BCA, and MOM—ensuring your commercial project meets all compliance requirements while staying on schedule and budget.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2>Commercial Project Budget Ranges</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-gray)' }}>
                        Budgets vary significantly based on space type, size, and fitout level:
                    </p>

                    <div className="budget-grid">
                        <div className="tier-card">
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Office Space</h3>
                            <div className="tier-range">$50 - $150 /sqft</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                Partitions, flooring, ceiling, electrical, data cabling, lighting
                            </p>
                        </div>

                        <div className="tier-card">
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Retail Fitout</h3>
                            <div className="tier-range">$80 - $200 /sqft</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                Display fixtures, branding, lighting design, POS systems, storage
                            </p>
                        </div>

                        <div className="tier-card">
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>F&B Establishment</h3>
                            <div className="tier-range">$150 - $400 /sqft</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                Kitchen equipment, exhaust systems, grease traps, plumbing, ACMV, seating
                            </p>
                        </div>

                        <div className="tier-card">
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Industrial/Warehouse</h3>
                            <div className="tier-range">$30 - $100 /sqft</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                Floor coatings, racking systems, loading bays, utilities, safety features
                            </p>
                        </div>
                    </div>

                    <p className="tier-note">
                        Commercial project pricing typically per square foot. Lead pricing negotiable based on project scale, complexity, and authority approvals required.
                    </p>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <h2>Authority Approvals & Compliance Awareness</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Commercial contractors in our network understand these regulatory requirements:
                    </p>

                    <ul className="rules-list">
                        <li>
                            <strong>BCA (Building & Construction Authority)</strong>
                            Structural changes, mezzanine floors, major alterations require QP endorsement and BCA submission. Change-of-use applications may be needed.
                        </li>
                        <li>
                            <strong>SCDF (Singapore Civil Defence Force)</strong>
                            Fire safety compliance for sprinklers, fire alarms, emergency exits, fire-rated doors, and escape routes. Critical for all commercial spaces.
                        </li>
                        <li>
                            <strong>NEA (National Environment Agency)</strong>
                            Required for wet trade works, kitchen exhaust systems, grease traps, and any food preparation areas. Environmental health compliance.
                        </li>
                        <li>
                            <strong>SFA (Singapore Food Agency)</strong>
                            Food establishment licenses for F&B businesses. Kitchen layout, equipment specifications, hygiene facilities must meet SFA requirements.
                        </li>
                        <li>
                            <strong>MOM (Ministry of Manpower)</strong>
                            Workplace safety regulations, especially for construction works. Higher-risk works require safety supervisors and proper risk assessments.
                        </li>
                        <li>
                            <strong>Building Management Approval</strong>
                            Most commercial buildings require management approval, renovation deposit, insurance proof, and adherence to working hours before work begins.
                        </li>
                    </ul>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2>Payment Milestones for Commercial Projects</h2>
                    <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--text-gray)' }}>
                        General guidance only. Commercial contracts should clearly specify payment schedules, retention amounts, and defect liability periods.
                    </p>

                    <div className="milestone-timeline">
                        <div className="milestone-item">
                            <div className="milestone-title">1. Mobilization Deposit (15-25%)</div>
                            <p>Upon contract award. Covers design development, permit submissions, material procurement, and contractor setup.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">2. After Demolition & Site Prep (15-20%)</div>
                            <p>Old fixtures removed, site cleared, hacking completed. Ready for new construction phase.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">3. After Structural/Main Works (20-25%)</div>
                            <p>Partitions built, ceiling installed, major MEP (mechanical, electrical, plumbing) rough-in completed.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">4. After Finishes & Fixtures (20-25%)</div>
                            <p>Flooring, tiling, painting, lighting installed. Space taking final form.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">5. After Practical Completion (10-15%)</div>
                            <p>All works substantially complete, operational testing done, permits obtained. Ready for occupancy.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">6. Final Payment & Retention Release (5-10%)</div>
                            <p>After defect liability period (typically 12 months), all defects rectified, final inspection passed. Release retention sum.</p>
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
                    <h2>Request Your Commercial Renovation Consultation</h2>
                    <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem', color: 'var(--text-gray)' }}>
                        Share your business type and project scope. We&apos;ll connect you with commercial contractors experienced in regulatory compliance and fitout delivery.
                    </p>
                    <LeadForm pageType="commercial-renovation" />
                </div>
            </section>
        </>
    );
}
