'use client';

import Link from 'next/link';

const STEPS = [
    { num: '01', title: 'Tell us about your home', desc: 'Property type, size, budget, and style preferences. Takes 2 minutes.' },
    { num: '02', title: 'Get matched with 3 designers', desc: 'We match you based on style fit, budget range, and availability. Within 24 hours.' },
    { num: '03', title: 'Compare transparent quotes', desc: 'Every quote is itemized. You see exactly what you are paying for — materials, labour, everything.' },
    { num: '04', title: 'Your money is protected', desc: 'Payments are held in escrow and released only when each milestone is verified and completed.' },
];

const PROTECTIONS = [
    { title: 'Escrow Protection', desc: 'Your money is held securely and released only after each renovation milestone is completed and verified. No work, no pay.' },
    { title: 'Verified Designers', desc: 'Every design firm on Roof is checked against BCA, HDB, and ACRA records. Unregistered firms cannot join.' },
    { title: 'Worker Reputation Scores', desc: 'Every tradesperson who works on your project has an Individual Reliability Score based on past performance. You see the score before work starts.' },
    { title: 'Transparent Pricing', desc: 'Our quotation system prices every item at current market rates. No hidden markups, no surprise costs after signing.' },
    { title: 'Full Project Timeline', desc: 'Track your renovation progress in real time. See what has been done, what is next, and when it will be finished.' },
    { title: 'Dispute Resolution', desc: 'If something goes wrong, your escrow funds are held until the issue is resolved. The data is on-platform — no he-said-she-said.' },
];

const FAQ = [
    { q: 'Is Roof free for homeowners?', a: 'Yes. Homeowners never pay Roof anything. Our revenue comes from the design firms, not from you.' },
    { q: 'How is my money protected?', a: 'Your renovation payments are held in escrow. Funds are released to the designer only after each milestone is completed and you confirm satisfaction. If work is not done, money stays with you.' },
    { q: 'How are designers selected?', a: 'We verify every firm against BCA registration, HDB licensing, and ACRA records. Firms must also maintain a minimum project completion rate and client satisfaction score to stay on the platform.' },
    { q: 'What if I already have a designer?', a: 'You can still use Roof for project tracking, escrow protection, and transparent quoting — even with your own designer. Just ask your designer to join Roof.' },
    { q: 'Do you cover Johor Bahru?', a: 'Yes. Roof operates in both Singapore and Johor Bahru, Malaysia. If you are renovating in JB, we can match you with local JB designers at significantly lower costs.' },
];

export default function HomeownerLanding() {
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    return (
        <div style={{ fontFamily: f, background: '#FAFAF9', minHeight: '100vh' }}>
            {/* Hero */}
            <div style={{ background: '#37352F', padding: '48px 24px 56px', textAlign: 'center', color: 'white' }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#37352F', fontSize: 16, fontWeight: 800 }}>R</div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>Roof</span>
                </Link>

                <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 10px', letterSpacing: '-0.03em', lineHeight: 1.25, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
                    Renovating? Get matched with verified designers. Your money is protected.
                </h1>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', margin: '0 0 28px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
                    Roof matches you with 3 verified interior designers in 24 hours. Every payment is held in escrow until the work is done.
                </p>
                <Link href="/signup/homeowner" style={{
                    display: 'inline-block', padding: '14px 40px', fontSize: 15, fontWeight: 700,
                    color: '#37352F', background: 'white', textDecoration: 'none', borderRadius: 10,
                }}>
                    Get Started — Free
                </Link>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                    Free for homeowners. Always.
                </div>
            </div>

            <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
                {/* How It Works */}
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#37352F', margin: '0 0 20px', textAlign: 'center' }}>How It Works</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 36 }}>
                    {STEPS.map(s => (
                        <div key={s.num} style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', padding: '20px' }}>
                            <div style={{ fontSize: 24, fontWeight: 900, color: '#059669', marginBottom: 6 }}>{s.num}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#37352F', marginBottom: 4 }}>{s.title}</div>
                            <div style={{ fontSize: 12, color: '#6B6A67', lineHeight: 1.6 }}>{s.desc}</div>
                        </div>
                    ))}
                </div>

                {/* Why Roof is Safer */}
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#37352F', margin: '0 0 20px', textAlign: 'center' }}>Why Roof is Safer</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 36 }}>
                    {PROTECTIONS.map(p => (
                        <div key={p.title} style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: '16px' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#37352F', marginBottom: 4 }}>{p.title}</div>
                            <div style={{ fontSize: 11, color: '#6B6A67', lineHeight: 1.6 }}>{p.desc}</div>
                        </div>
                    ))}
                </div>

                {/* The Problem */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', padding: '28px', marginBottom: 28 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#37352F', margin: '0 0 12px' }}>The Problem with Renovation in Singapore</h2>
                    <div style={{ fontSize: 13, color: '#6B6A67', lineHeight: 1.8 }}>
                        In 2024, CASE received over 1,200 renovation-related complaints in Singapore. Homeowners lost an estimated S$728,000 to unfinished projects, hidden charges, and unresponsive contractors.<br /><br />
                        The industry runs on trust, WhatsApp messages, and cash transfers. There is no escrow, no verified pricing, and no accountability when things go wrong.<br /><br />
                        <strong style={{ color: '#37352F' }}>Roof changes that.</strong> Every payment is escrowed. Every designer is verified. Every quote is transparent. If something goes wrong, the money stays with you until the issue is resolved.
                    </div>
                </div>

                {/* SG vs JB */}
                <div style={{ background: '#F0FDF4', borderRadius: 14, border: '1px solid #BBF7D0', padding: '28px', marginBottom: 28 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', margin: '0 0 12px' }}>Renovating in Johor Bahru?</h2>
                    <div style={{ fontSize: 13, color: '#065F46', lineHeight: 1.8 }}>
                        Roof also operates in Johor Bahru, Malaysia. JB renovations cost 40–60% less than Singapore for equivalent quality — lower labour costs, local material sourcing, and no foreign worker levies.<br /><br />
                        If you own property in Iskandar Malaysia, Medini, or Puteri Harbour, Roof can match you with verified JB-based designers at a fraction of Singapore rates. Same platform, same escrow protection, same transparency.
                    </div>
                </div>

                {/* FAQ */}
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#37352F', margin: '0 0 16px' }}>Frequently Asked Questions</h2>
                {FAQ.map((faq, i) => (
                    <details key={i} style={{ marginBottom: 8, background: 'white', borderRadius: 8, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                        <summary style={{ padding: '14px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#37352F' }}>
                            {faq.q}
                        </summary>
                        <div style={{ padding: '0 16px 14px', fontSize: 13, color: '#6B6A67', lineHeight: 1.7 }}>
                            {faq.a}
                        </div>
                    </details>
                ))}

                {/* Final CTA */}
                <div style={{ textAlign: 'center', margin: '36px 0 40px' }}>
                    <Link href="/signup/homeowner" style={{
                        display: 'inline-block', padding: '16px 48px', fontSize: 16, fontWeight: 800,
                        color: 'white', background: '#37352F', textDecoration: 'none', borderRadius: 12,
                    }}>
                        Find My Designer
                    </Link>
                    <div style={{ fontSize: 12, color: '#9B9A97', marginTop: 10 }}>Matched with 3 designers in 24 hours. No obligation. Free for homeowners.</div>
                </div>
            </div>
        </div>
    );
}
