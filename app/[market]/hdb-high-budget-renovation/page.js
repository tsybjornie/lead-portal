import LeadForm from '../../components/LeadForm';

export const metadata = {
    title: 'High-Budget HDB Renovation Singapore | $100k-$200k+ Projects',
    description: 'Premium HDB renovation consultation for high-budget projects in Singapore. $100k to $200k+ renovations with designer involvement, luxury finishes, and full HDB compliance.',
    keywords: ['high budget HDB renovation', 'premium HDB renovation', 'luxury HDB renovation Singapore', 'designer HDB renovation'],
};

export default function HDBHighBudgetPage() {
    const faqs = [
        {
            question: "What makes a high-budget HDB renovation different?",
            answer: "High-budget HDB renovations ($100k+) typically involve designer collaboration, premium imported materials, extensive custom carpentry, smart home integration, and premium fixtures and fittings. The scope often includes comprehensive hacking and rebuilding rather than cosmetic updates."
        },
        {
            question: "Do the same HDB rules apply to high-budget renovations?",
            answer: "Yes, all HDB regulations remain the same regardless of budget. Structural walls cannot be removed, HDB permits are required for hacking and major works, and noise restrictions apply. Budget affects finishes and scope, not regulatory requirements."
        },
        {
            question: "Should I hire an interior designer for a $100k+ HDB renovation?",
            answer: "For budgets above $100k, working with an interior designer is recommended. Designers help maximize space efficiency, coordinate trades, specify premium materials, and ensure design cohesion. Many high-budget projects benefit from professional design oversight."
        },
        {
            question: "How long does a high-budget HDB renovation take?",
            answer: "High-budget HDB renovations typically take 3-5 months, longer than standard renovations due to custom carpentry, imported materials with longer lead times, more complex coordination, and higher quality control standards."
        },
        {
            question: "Can I include smart home systems in my HDB renovation?",
            answer: "Yes, smart home integration (lighting, aircon, curtains, security) is common in high-budget HDB renovations. Your contractor should work with qualified electricians to ensure proper wiring, control systems, and integration with HDB's existing infrastructure."
        },
        {
            question: "What should I prioritize in a premium HDB renovation budget?",
            answer: "Prioritize structural and concealed works first (waterproofing, electrical, plumbing), then quality carpentry and built-ins, followed by premium finishes. Don't compromise on fundamentals for aesthetic upgrades—good contractors will advise appropriate allocation."
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
                    <h1>High-Budget HDB Renovation in Singapore</h1>
                    <p className="hero-intro">
                        Connect with renovation professionals and interior designers experienced in premium HDB projects. For homeowners planning comprehensive transformations with budgets from $100,000 to $200,000 and beyond, we match you with specialists who understand both luxury finishes and HDB compliance requirements.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2>High-End HDB Project Budget Ranges</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-gray)' }}>
                        Premium HDB renovation consultations are matched to these budget tiers:
                    </p>

                    <div className="budget-grid">
                        <div className="tier-card">
                            <div className="tier-range">$60k – $100k</div>
                            <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-gray)' }}>
                                Quality finishes, comprehensive carpentry, designer consultation, upgraded kitchen and bathrooms
                            </p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$100k – $150k</div>
                            <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-gray)' }}>
                                Premium materials, full interior design service, custom built-ins, smart home features, imported fixtures
                            </p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$150k – $200k</div>
                            <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-gray)' }}>
                                Luxury finishes, extensive hacking & rebuilding, high-end European appliances, designer furniture integration
                            </p>
                        </div>

                        <div className="tier-card">
                            <div className="tier-range">$200k+</div>
                            <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-gray)' }}>
                                Complete transformation, architect/designer-led, imported materials, full home automation, premium everything
                            </p>
                        </div>
                    </div>

                    <p className="tier-note">
                        Lead pricing scales with budget. Higher-value projects are matched with contractors and designers experienced in premium specifications and quality control.
                    </p>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <h2>Typical Scope in High-Budget HDB Renovations</h2>

                    <ul className="rules-list">
                        <li>
                            <strong>Design & Planning</strong>
                            Professional interior designer involvement, 3D visualizations, detailed material specifications, and comprehensive project management
                        </li>
                        <li>
                            <strong>Custom Carpentry & Built-Ins</strong>
                            Tailored wardrobes, feature walls, TV consoles, storage solutions with premium finishes (laminates, veneers, lacquered glass)
                        </li>
                        <li>
                            <strong>Premium Kitchen & Bathrooms</strong>
                            Designer sanitary fittings, rain showers, imported tiles, quartz/marble countertops, quality appliances (Bosch, Miele, etc.)
                        </li>
                        <li>
                            <strong>Smart Home Integration</strong>
                            Automated lighting, motorized curtains, smart climate control, integrated sound systems, security features
                        </li>
                        <li>
                            <strong>Quality Finishes</strong>
                            Imported tiles, feature walls (marble, brick, 3D panels), designer lighting, premium flooring (engineered wood, vinyl planks)
                        </li>
                        <li>
                            <strong>Full Coordination</strong>
                            Project manager coordinating multiple trades, regular site inspections, quality control at each milestone, warranty support
                        </li>
                    </ul>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2>HDB Rules & Compliance (Same for All Budgets)</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Premium budgets don&apos;t change HDB structural regulations. All high-end projects must comply with:
                    </p>

                    <ul className="rules-list">
                        <li>
                            <strong>HDB Written Permission</strong>
                            Required for hacking, structural modifications, plumbing, and electrical works—regardless of budget level
                        </li>
                        <li>
                            <strong>Structural Limitations</strong>
                            No removal of structural walls, beams, columns, or external walls. Floor load limits for heavy materials (stone, large tiles)
                        </li>
                        <li>
                            <strong>Registered Professionals</strong>
                            Licensed contractors, LEW for electrical, PUB-licensed plumbers. Designer involvement doesn&apos;t waive these requirements
                        </li>
                        <li>
                            <strong>Work Hour Restrictions</strong>
                            Same noise rules apply: Monday-Saturday 9am-6pm only. Premium projects must still respect neighbours
                        </li>
                    </ul>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <h2>Payment Milestones for High-Budget Projects</h2>
                    <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--text-gray)' }}>
                        Educational guidance only—not legal or financial advice. Always document payment terms in your renovation contract and designer agreement.
                    </p>

                    <div className="milestone-timeline">
                        <div className="milestone-item">
                            <div className="milestone-title">1. Design Fees (If Separate)</div>
                            <p>Interior designers often charge separately: 10-20% deposit, progressive payments at concept/3D stage, balance upon final drawings.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">2. Renovation Deposit (10-15%)</div>
                            <p>Upon contract signing, before work begins. Covers initial material procurement and contractor mobilization.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">3. After Demolition & Site Prep (20%)</div>
                            <p>Hacking completed, site cleared, ready for rebuilding. First major milestone payment.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">4. After Masonry, Plumbing, Electrical (20-25%)</div>
                            <p>All concealed works completed (waterproofing, wiring, piping). Critical phase completed.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">5. After Carpentry & Main Works (20-25%)</div>
                            <p>Custom carpentry installed, tiling done, painting completed. Space taking final form.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">6. After Installation of Fixtures & Fittings (10-15%)</div>
                            <p>Kitchen cabinets, appliances, sanitary fittings, lighting installed. Near completion.</p>
                        </div>

                        <div className="milestone-item">
                            <div className="milestone-title">7. Final Payment (5-10%)</div>
                            <p>After defect rectification, final cleaning, project handover, HDB permit closure. Hold adequate retention for warranty accountability.</p>
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
                    <h2>Request Your Premium HDB Consultation</h2>
                    <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem', color: 'var(--text-gray)' }}>
                        Share your vision and budget. We&apos;ll connect you with contractors and designers experienced in high-budget HDB transformations.
                    </p>
                    <LeadForm pageType="hdb-high-budget" />
                </div>
            </section>
        </>
    );
}
