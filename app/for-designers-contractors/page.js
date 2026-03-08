import LeadForm from '../components/LeadForm';

export const metadata = {
    title: 'For Designers & Contractors | Access Quality Renovation Leads Singapore',
    description: 'Join our network of renovation professionals in Singapore. Access verified HDB, condo, and commercial leads matched to your expertise and capacity.',
    keywords: ['renovation leads Singapore', 'interior designer leads', 'contractor leads', 'renovation business'],
};

export default function ForDesignersContractorsPage() {
    const faqs = [
        {
            question: "How do you match leads to contractors?",
            answer: "We match based on budget tier, property type, location, scope of work, and contractor specialization. For example, HDB specialists receive HDB leads, high-budget projects go to contractors with relevant portfolios, and F&B fitouts are matched to commercial specialists."
        },
        {
            question: "What information do leads include?",
            answer: "Leads include: homeowner/client contact details, property type and location, stated budget range, scope of work description, timeline expectations, and specific requirements (e.g., HDB permit needed, MCST compliance, designer involvement)."
        },
        {
            question: "How quickly do I need to respond to a lead?",
            answer: "Leads are time-sensitive. We recommend responding within 2-4 hours during business hours. Quick response rates significantly increase conversion chances, especially since homeowners often contact multiple contractors."
        },
        {
            question: "Can I choose which leads to purchase?",
            answer: "Yes, you review lead details (budget, property type, scope, location) before purchasing. You only pay for leads you actively choose to pursue. No forced assignments or subscription requirements."
        },
        {
            question: "Do you guarantee lead exclusivity?",
            answer: "Leads may be shared with 2-3 qualified contractors to ensure homeowners receive competitive proposals. This is industry standard and helps homeowners make informed decisions while giving you fair opportunity to win the project."
        },
        {
            question: "What qualifications do you require from contractors?",
            answer: "We verify business registration, contractor license (where applicable), insurance coverage, past project portfolio, and client references. Interior designers should have relevant credentials or demonstrated experience. We maintain quality standards for network participants."
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
                    <h1>For Interior Designers & Renovation Contractors</h1>
                    <p className="hero-intro">
                        Grow your renovation business with quality leads matched to your expertise. Whether you specialize in HDB renovations, luxury condos, commercial fitouts, or full-service design-and-build, our platform connects you with homeowners and businesses actively seeking renovation professionals in Singapore.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2>Lead Pricing Structure</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-gray)' }}>
                        Transparent pricing based on project value. You only pay for leads you choose to pursue:
                    </p>

                    <div className="budget-grid">
                        <div className="tier-card">
                            <div className="tier-range">$30k – $80k Projects</div>
                            <div className="tier-price">$80 per lead</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                Standard HDB, basic condo renovations
                            </p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$40k – $100k Projects</div>
                            <div className="tier-price">$100 per lead</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                Comprehensive HDB, condo refreshes
                            </p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$50k – $120k Projects</div>
                            <div className="tier-price">$120 per lead</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                Premium HDB, quality condo renovations
                            </p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$60k – $140k Projects</div>
                            <div className="tier-price">$140 per lead</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                High-end residential, small commercial
                            </p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$70k – $160k Projects</div>
                            <div className="tier-price">$160 per lead</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                Luxury residential, designer involvement
                            </p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$100k+ Projects</div>
                            <div className="tier-price">$200+ per lead</div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                Premium transformations, large commercial
                            </p>
                        </div>
                    </div>

                    <p className="tier-note">
                        Lead pricing scales with project value. Higher-budget projects command higher lead prices but offer greater revenue potential and margin.
                    </p>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <h2>Who This Platform Serves</h2>

                    <ul className="rules-list">
                        <li>
                            <strong>Renovation Contractors</strong>
                            Licensed contractors specializing in residential (HDB/condo) or commercial projects seeking consistent lead flow
                        </li>
                        <li>
                            <strong>Interior Designers</strong>
                            Design professionals offering full-service design + build, or designers seeking projects to collaborate with trusted contractors
                        </li>
                        <li>
                            <strong>Design-Build Firms</strong>
                            Companies offering integrated design and construction services from concept to completion
                        </li>
                        <li>
                            <strong>Commercial Specialists</strong>
                            Contractors experienced in office fitouts, retail spaces, F&B establishments with authority approval expertise
                        </li>
                        <li>
                            <strong>Niche Specialists</strong>
                            Professionals focused on specific segments: high-budget renovations, eco-friendly builds, smart home integration, etc.
                        </li>
                    </ul>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2>How the Lead System Works</h2>

                    <div className="milestone-timeline">
                        <div className="milestone-item">
                            <div className="milestone-title">1. Homeowner Submits Inquiry</div>
                            <p>Homeowners provide budget, property details, scope, timeline through our consultation forms. All inquiries pre-qualified.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">2. Lead Matching & Notification</div>
                            <p>We match leads to 2-3 contractors based on budget tier, location, expertise. You receive notification with preview details.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">3. Review & Purchase Decision</div>
                            <p>Review lead details. Choose to purchase if it matches your capacity and specialization. Payment processed securely.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">4. Full Access & Contact</div>
                            <p>Receive complete homeowner contact details and project information. Reach out promptly to schedule consultation.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">5. Your Sales Process</div>
                            <p>Conduct site visit, prepare quotation, present proposal. Win the project based on your expertise, pricing, and service quality.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <h2>Network Quality Standards</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        We maintain standards to ensure homeowner confidence and professional service:
                    </p>

                    <ul className="rules-list">
                        <li>
                            <strong>Business Verification</strong>
                            Active business registration, contractor license (where required), professional credentials verified
                        </li>
                        <li>
                            <strong>Insurance Coverage</strong>
                            Public liability and workmen compensation insurance required. Building management often requires $1M-$10M coverage
                        </li>
                        <li>
                            <strong>Portfolio & References</strong>
                            Past project photos, client references, or testimonials demonstrate capability and quality standards
                        </li>
                        <li>
                            <strong>Compliance Knowledge</strong>
                            Familiarity with HDB permits, MCST procedures, or commercial authority approvals (SCDF, NEA, BCA) as relevant to specialization
                        </li>
                        <li>
                            <strong>Professional Conduct</strong>
                            Responsive communication, transparent quotations, proper contracts, warranty support expected from all network members
                        </li>
                    </ul>
                </div>
            </section>

            <section className="section">
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

            <section className="section section-alt">
                <div className="container">
                    <h2>Join Our Contractor Network</h2>
                    <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem', color: 'var(--text-gray)' }}>
                        Interested in accessing renovation leads matched to your expertise? Share your details and we&apos;ll contact you about network participation.
                    </p>
                    <LeadForm pageType="contractor-signup" />
                </div>
            </section>
        </>
    );
}
