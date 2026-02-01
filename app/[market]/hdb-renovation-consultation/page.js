import LeadForm from '../../components/LeadForm';

export const metadata = {
    title: 'HDB Renovation Consultation Singapore | $30k-$160k+ Projects',
    description: 'Professional HDB renovation consultation in Singapore. Connect with verified contractors familiar with HDB permits, structural rules, and quality renovations from $30k to $160k+.',
    keywords: ['HDB renovation Singapore', 'HDB permit', 'HDB renovation consultation', 'HDB contractor'],
};

export default function HDBRenovationPage() {
    const faqs = [
        {
            question: "Do I need an HDB permit for my renovation?",
            answer: "Most HDB renovations require prior approval from HDB if you&apos;re doing hacking works, plumbing or sanitary works, electrical works, or any structural changes. Contractors we work with are familiar with the HDB permit application process and requirements."
        },
        {
            question: "What is the typical timeline for HDB permit approval?",
            answer: "HDB permit approval typically takes 2-4 weeks after submission of complete documents. The renovation can commence once you receive the Written Permission from HDB. Your contractor should factor this into the project timeline."
        },
        {
            question: "Can I hack walls in my HDB flat?",
            answer: "Only non-structural walls can be hacked. All HDB flats have specific structural walls, columns, and beams that cannot be removed or modified. A qualified contractor will identify these during site inspection and advise accordingly."
        },
        {
            question: "How much should I budget for an HDB 4-room renovation?",
            answer: "HDB 4-room renovations typically range from $30,000 to $80,000 for standard renovations, and $60,000 to $140,000 for more extensive works. The budget depends on finishes, hacking extent, carpentry needs, and electrical/plumbing modifications."
        },
        {
            question: "What is the construction noise time limit for HDB?",
            answer: "Renovation works in HDB estates are allowed Monday to Saturday, 9am to 6pm. No renovation works are permitted on Sundays and public holidays. Drilling, hacking, and noisy works must comply with these hours to avoid complaints."
        },
        {
            question: "Do contractors need to register with HDB?",
            answer: "Yes, contractors must register the renovation with HDB&apos;s online portal before starting work. This registration shows the renovation period and ensures compliance with HDB regulations. Proper contractors will handle this as part of their service."
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
                    <h1>HDB Renovation Consultation in Singapore</h1>
                    <p className="hero-intro">
                        Connect with renovation contractors who understand HDB permit requirements, structural limitations, and Singapore&apos;s housing authority regulations. Whether you&apos;re planning a standard refresh or a comprehensive renovation, we match you with professionals experienced in HDB projects across all flat types—from 3-room to Executive apartments.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2>Lead Pricing Tiers (For Residential Projects)</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-gray)' }}>
                        Lead pricing is based on the homeowner&apos;s stated budget range. These are example tiers:
                    </p>

                    <div className="budget-grid">
                        <div className="tier-card">
                            <div className="tier-range">$30k – $80k</div>
                            <div className="tier-price">$80 per lead</div>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$40k – $100k</div>
                            <div className="tier-price">$100 per lead</div>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$50k – $120k</div>
                            <div className="tier-price">$120 per lead</div>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$60k – $140k</div>
                            <div className="tier-price">$140 per lead</div>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$70k – $160k</div>
                            <div className="tier-price">$160 per lead</div>
                        </div>
                    </div>

                    <p className="tier-note">
                        Higher budget tiers available for premium renovations. Lead pricing scales proportionally with project value.
                    </p>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <h2>High-End HDB Renovation Tiers</h2>
                    <p style={{ marginBottom: '2rem' }}>
                        For homeowners seeking premium finishes and comprehensive renovations:
                    </p>

                    <div className="budget-grid">
                        <div className="tier-card">
                            <div className="tier-range">$60k – $100k</div>
                            <p>Quality finishes, full carpentry package, kitchen & bathroom upgrades</p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$100k – $150k</div>
                            <p>Premium materials, designer involvement, built-in features, smart home integration</p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$150k – $200k</div>
                            <p>Luxury finishes, extensive hacking & rebuilding, custom cabinetry, high-end appliances</p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$200k+</div>
                            <p>Complete transformation, designer-led project, imported materials, full home automation</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2>HDB Rules & Approvals Awareness</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        All contractors in our network are familiar with these HDB requirements:
                    </p>

                    <ul className="rules-list">
                        <li>
                            <strong>HDB Written Permission</strong>
                            Required for hacking, plumbing, electrical, and structural-related works. Application submitted via HDB&apos;s online portal with renovation plans and contractor details.
                        </li>
                        <li>
                            <strong>Structural Integrity</strong>
                            No removal or modification of structural walls, beams, columns, or external walls. Contractors must identify and preserve all structural elements.
                        </li>
                        <li>
                            <strong>Renovation Deposit</strong>
                            Contractors must pay a renovation deposit to HDB (refundable after inspection). Homeowners should confirm this is handled.
                        </li>
                        <li>
                            <strong>Registered Contractors</strong>
                            Contractors must be registered with HDB and Licensed Electrical Workers (LEW) must handle all electrical modifications.
                        </li>
                        <li>
                            <strong>Noise & Timing Restrictions</strong>
                            Works restricted to weekdays and Saturdays, 9am-6pm only. No works on Sundays and Public Holidays.
                        </li>
                        <li>
                            <strong>Common Area Protection</strong>
                            Lift lobbies, corridors, and common areas must be protected. Debris removal must be scheduled properly to avoid complaints.
                        </li>
                    </ul>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <h2>Typical Payment Milestones</h2>
                    <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--text-gray)' }}>
                        This is general guidance only—not legal or financial advice. Actual payment terms should be negotiated and documented in your renovation contract.
                    </p>

                    <div className="milestone-timeline">
                        <div className="milestone-item">
                            <div className="milestone-title">1. Deposit (10-20%)</div>
                            <p>Upon signing contract and before work begins. Confirms contractor commitment and covers initial material orders.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">2. After Demolition & Hacking (20-25%)</div>
                            <p>Once old fixtures removed, walls hacked, and debris cleared. Site is ready for rebuilding phase.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">3. After Masonry & Plumbing Rough-In (20-25%)</div>
                            <p>New walls built, waterproofing completed, plumbing and electrical conduits installed.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">4. After Carpentry & Tiling (20-25%)</div>
                            <p>Built-in carpentry installed, tiling completed, painting done. Space starts to take shape.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">5. Final Payment (10-20%)</div>
                            <p>After project completion, defect rectification, final inspection, and HDB permit closure. Retain enough to ensure accountability.</p>
                        </div>
                    </div>
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
                    <h2>Request Your HDB Renovation Consultation</h2>
                    <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem', color: 'var(--text-gray)' }}>
                        Share your budget and project details. We&apos;ll connect you with contractors experienced in HDB renovations who understand permit requirements and structural guidelines.
                    </p>
                    <LeadForm pageType="hdb-renovation" />
                </div>
            </section>
        </>
    );
}
