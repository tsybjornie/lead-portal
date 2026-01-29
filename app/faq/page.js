'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FAQPage() {
    const [openItem, setOpenItem] = useState(null);

    const toggleItem = (id) => {
        setOpenItem(openItem === id ? null : id);
    };

    const AccordionItem = ({ id, question, answer }) => {
        const isOpen = openItem === id;

        return (
            <div style={{
                borderBottom: '1px solid var(--border)',
                marginBottom: '1rem'
            }}>
                <button
                    onClick={() => toggleItem(id)}
                    style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        padding: '1.5rem 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        color: isOpen ? 'var(--primary-dark)' : 'var(--text)',
                        fontFamily: 'inherit'
                    }}
                >
                    {question}
                    <span style={{
                        fontSize: '1.25rem',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                        transition: 'transform 0.3s',
                        color: 'var(--accent)'
                    }}>+</span>
                </button>

                <div style={{
                    maxHeight: isOpen ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    opacity: isOpen ? 1 : 0
                }}>
                    <div style={{
                        paddingBottom: '2rem',
                        color: 'var(--text-light)',
                        lineHeight: 1.7,
                        fontSize: '1rem'
                    }}>
                        {answer}
                    </div>
                </div>
            </div>
        );
    };

    const homeownerFAQs = [
        {
            id: 'h1',
            question: 'What does this platform do?',
            answer: 'We introduce renovation firms after your project scope, budget, and expectations are clarified. Our goal is to reduce misunderstandings by aligning roles and responsibilities before discussions begin.'
        },
        {
            id: 'h2',
            question: 'Is this a directory where I browse many interior designers?',
            answer: 'No. We do not operate as a public directory or browsing platform. Firms are introduced only after you complete a short project questionnaire.'
        },
        {
            id: 'h3',
            question: 'How many firms will I be introduced to?',
            answer: 'Typically 2–4 firms. We intentionally limit introductions to keep conversations focused and meaningful.'
        },
        {
            id: 'h4',
            question: 'Why can’t I see all the firms upfront?',
            answer: 'Browsing large lists often leads to price-shopping, confusion, and mismatched expectations. We prioritise fit and clarity over volume.'
        },
        {
            id: 'h5',
            question: 'Is this service free for homeowners?',
            answer: 'Yes. Homeowners do not pay to submit enquiries or be introduced to firms.'
        },
        {
            id: 'h6',
            question: 'Will I receive quotations immediately?',
            answer: 'Not necessarily. Most firms prefer to understand your requirements and scope before providing quotations.'
        },
        {
            id: 'h7',
            question: 'Are consultations free?',
            answer: 'It depends on the firm. Some firms offer complimentary initial consultations, while others may charge a design or consultation fee. Any fees are discussed directly between you and the firm.'
        },
        {
            id: 'h8',
            question: 'Are the firms recommended or endorsed?',
            answer: 'No. Firms are introduced based on declared capabilities and project fit. Homeowners should conduct their own evaluations before engagement.'
        },
        {
            id: 'h9',
            question: 'Who manages the renovation works?',
            answer: 'Renovation works are managed directly between homeowners and the engaged firm or contractor. We do not manage construction, site supervision, or renovation payments.'
        },
        {
            id: 'h10',
            question: 'Do all firms have the required licenses?',
            answer: 'Firms declare their roles and licenses (e.g. design-only or licensed main contractor). Where required, licensed contractors must be engaged for execution. Homeowners should verify suitability for their specific project.'
        },
        {
            id: 'h11',
            question: 'What if my experience differs from others?',
            answer: 'Renovation outcomes depend on many factors including scope clarity, site conditions, and the people involved. Individual experiences may vary.'
        },
        {
            id: 'h12',
            question: 'Can I request more firms if I’m not satisfied?',
            answer: 'We limit introductions to maintain quality and fairness. Additional introductions are not guaranteed.'
        },
        {
            id: 'h13',
            question: 'Do you handle disputes or workmanship issues?',
            answer: 'No. Contractual matters, workmanship quality, and disputes are handled directly between homeowners and the engaged parties.'
        },
        {
            id: 'h14',
            question: 'Do you help purchase tiles, lights, or materials?',
            answer: 'Some firms offer styling or sourcing assistance, which may be scoped separately. Procurement arrangements are agreed directly between homeowners and firms.'
        },
        {
            id: 'h15',
            question: 'Can I contact the firms directly?',
            answer: 'Yes. Once introduced, you may communicate directly with the firms.'
        },
        {
            id: 'h16',
            question: 'Why should I use this instead of other renovation platforms?',
            answer: 'Our focus is on clarity before commitment, not browsing or volume. This helps reduce misunderstandings later in the renovation process.'
        }
    ];

    const firmFAQs = [
        {
            id: 'f1',
            question: 'What is this platform?',
            answer: 'We are a structured matching platform that introduces homeowners after project scope, budget, and expectations are clarified. We are not a volume lead marketplace.'
        },
        {
            id: 'f2',
            question: 'How many enquiries will I receive?',
            answer: 'Typically 2–6 enquiries per month, depending on capacity and fit. Enquiry volume is intentionally capped.'
        },
        {
            id: 'f3',
            question: 'Are enquiries exclusive?',
            answer: 'No. Homeowners may be introduced to a small number of firms.'
        },
        {
            id: 'f4',
            question: 'Do you guarantee project awards or conversions?',
            answer: 'No. Payment is for consultation access, not project outcomes or awards.'
        },
        {
            id: 'f5',
            question: 'How are homeowners screened?',
            answer: 'Homeowners complete a structured questionnaire covering property type, budget, scope, timeline, and coordination expectations.'
        },
        {
            id: 'f6',
            question: 'How does the credit system work?',
            answer: 'Access is structured using consultation credits rather than unlimited leads. Each enquiry introduced uses one credit. Credits represent access for consultation and discussion, not guaranteed outcomes.'
        },
        {
            id: 'f7',
            question: 'Why use a credit-based system?',
            answer: 'A credit-based approach helps limit enquiry volume, reduce competition per project, and align expectations around quality rather than quantity.'
        },
        {
            id: 'f8',
            question: 'Are credits refundable?',
            answer: 'No. Credits are not refundable once an enquiry is introduced.'
        },
        {
            id: 'f9',
            question: 'Can unused credits roll over?',
            answer: 'Credit usage and validity are outlined during onboarding. Details are provided privately after application approval.'
        },
        {
            id: 'f10',
            question: 'Can I decline enquiries?',
            answer: 'Yes. Firms may decline enquiries that are outside scope or unsuitable.'
        },
        {
            id: 'f11',
            question: 'Do I need to offer free consultations?',
            answer: 'No. Consultation or design fees are determined by each firm.'
        },
        {
            id: 'f12',
            question: 'How are roles disclosed to homeowners?',
            answer: 'Firms declare whether they are design-only, design & build (licensed main contractor), or engaging third-party licensed contractors. This information is shown to homeowners.'
        },
        {
            id: 'f13',
            question: 'Do you rank or review firms publicly?',
            answer: 'No. We do not publish public rankings or reviews.'
        },
        {
            id: 'f14',
            question: 'Will homeowners see my pricing?',
            answer: 'No. Pricing discussions occur directly between firms and homeowners.'
        },
        {
            id: 'f15',
            question: 'Do you take commissions on renovation contracts?',
            answer: 'No. We do not take a percentage or commission from renovation works.'
        },
        {
            id: 'f16',
            question: 'Who is this platform not suitable for?',
            answer: 'This platform may not be suitable for firms that want high-volume enquiries, rely on blind quoting, compete primarily on price, or expect free replacements.'
        },
        {
            id: 'f17',
            question: 'Will there be dashboards or logins?',
            answer: 'Not at this stage. Tools and dashboards may be introduced later as optional paid features.'
        },
        {
            id: 'f18',
            question: 'Do you provide SEO, marketing, or advertising services?',
            answer: 'We provide infrastructure and tools that support clarity and visibility. We do not guarantee rankings or manage advertising campaigns.'
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Header */}
            <div style={{
                background: 'var(--bg-cream)',
                padding: '5rem 0 4rem',
                borderBottom: '1px solid var(--border)'
            }}>
                <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
                    <h1 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        color: 'var(--primary-dark)',
                        marginBottom: '1.5rem',
                        fontWeight: 400
                    }}>
                        Frequently Asked Questions
                    </h1>
                    <p style={{
                        fontSize: '1.15rem',
                        color: 'var(--text-light)',
                        lineHeight: 1.7,
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Common questions about how our platform connects homeowners with renovation experts.
                    </p>
                </div>
            </div>

            <div className="container" style={{
                maxWidth: '900px',
                padding: '4rem 1.5rem 6rem'
            }}>

                {/* Homeowners Section */}
                <section style={{ marginBottom: '5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '2rem',
                        borderBottom: '2px solid var(--primary-dark)',
                        paddingBottom: '0.5rem'
                    }}>
                        <h2 style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '2rem',
                            color: 'var(--primary-dark)',
                            margin: 0,
                            fontWeight: 400
                        }}>
                            For Homeowners
                        </h2>
                    </div>

                    <div>
                        {homeownerFAQs.map(faq => (
                            <AccordionItem key={faq.id} {...faq} />
                        ))}
                    </div>
                </section>

                {/* Firms Section */}
                <section>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '2rem',
                        borderBottom: '2px solid var(--primary-dark)',
                        paddingBottom: '0.5rem'
                    }}>
                        <h2 style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '2rem',
                            color: 'var(--primary-dark)',
                            margin: 0,
                            fontWeight: 400
                        }}>
                            For Renovation Firms
                        </h2>
                    </div>

                    <div>
                        {firmFAQs.map(faq => (
                            <AccordionItem key={faq.id} {...faq} />
                        ))}
                    </div>
                </section>

            </div>

            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '0 1.5rem 6rem',
                textAlign: 'center'
            }}>
                <div style={{
                    padding: '2rem',
                    borderTop: '1px solid var(--border)',
                    marginTop: '2rem'
                }}>
                    <Link href="/hard-truths" style={{
                        color: 'var(--text-light)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid transparent',
                        transition: 'border-color 0.3s'
                    }}
                        onMouseEnter={(e) => e.target.style.borderColor = 'var(--text-light)'}
                        onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
                    >
                        Read Our "Hard Truths" →
                    </Link>
                </div>
            </div>

        </div>
    );
}
