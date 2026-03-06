'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

/* ─────────────── DATA ─────────────── */

const ENGINES = [
    { num: '01', title: 'Pipeline', desc: 'Capture leads, score prospects, convert clients.', tag: 'CRM', path: '/follow-up' },
    { num: '02', title: 'Numbers', desc: '113 materials. Real SG rates. Auto-price any scope.', tag: 'Quotation', path: '/' },
    { num: '03', title: 'Dispatch', desc: 'Deploy 20 trades. PO tracking. Vendor management.', tag: 'Procurement', path: '/dispatch' },
    { num: '04', title: 'Sequence', desc: 'Gantt timelines, trade scheduling, task dependencies.', tag: 'Project', path: '/sequence' },
    { num: '05', title: 'Ledger', desc: 'Project P&L, cashflow forecasting, milestone billing.', tag: 'Finance', path: '/ledger' },
    { num: '06', title: 'Hardware POS', desc: 'Barcode inventory, stock tracking, trade credit.', tag: 'Retail', path: '/hardware-pos' },
];

const COMPARISON = [
    { feature: 'Free matching', us: true, them: true },
    { feature: 'Deposit protection', us: true, them: true },
    { feature: 'Auto-pricing quotation engine', us: true, them: false },
    { feature: 'Project management (Gantt)', us: true, them: false },
    { feature: 'Worker dispatch + IRS rating', us: true, them: false },
    { feature: 'Hardware POS + inventory', us: true, them: false },
    { feature: 'Real-time P&L per project', us: true, them: false },
    { feature: 'Milestone escrow payments', us: true, them: false },
];

const TRUST_SIGNALS = [
    { icon: '◈', title: 'BCA Registered', desc: 'All partner firms verified with Building & Construction Authority.' },
    { icon: '◉', title: 'HDB Licensed', desc: 'Contractors hold valid HDB renovation licenses.' },
    { icon: '◎', title: 'Singpass Verified', desc: 'Designer identity verified via Singpass Face Verification.' },
    { icon: '◆', title: 'Escrow Protected', desc: 'Client payments held in escrow until work is verified.' },
];

/* ─────────────── HOOKS ─────────────── */

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const { ref, visible } = useInView(0.3);
    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const duration = 1600;
        const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [visible, target]);
    return <span ref={ref as any}>{count}{suffix}</span>;
}

/* ─────────────── PAGE ─────────────── */

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const heroWords = ['matching.', 'quoting.', 'scheduling.', 'dispatching.', 'billing.'];
    const [wordIdx, setWordIdx] = useState(0);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    useEffect(() => {
        const interval = setInterval(() => setWordIdx(i => (i + 1) % heroWords.length), 2200);
        return () => clearInterval(interval);
    }, []);

    const section1 = useInView();
    const section2 = useInView();
    const section3 = useInView();
    const section4 = useInView();
    const section5 = useInView();

    const f = "'Instrument Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    return (
        <div style={{ fontFamily: f, background: '#09090B', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                @keyframes word-slide {
                    0% { opacity: 0; transform: translateY(20px); }
                    10% { opacity: 1; transform: translateY(0); }
                    85% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-20px); }
                }
                .reveal { opacity: 0; transform: translateY(40px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
                .reveal.visible { opacity: 1; transform: translateY(0); }
                .engine-row { transition: all 0.3s ease; cursor: pointer; }
                .engine-row:hover { background: rgba(255,255,255,0.03) !important; }
                .engine-row:hover .engine-num { color: #fff !important; }
                .engine-row:hover .engine-title { color: #fff !important; }
                .engine-row:hover .engine-arrow { opacity: 1 !important; transform: translateX(0) !important; }
            `}</style>

            {/* ═══════ FLOATING PILL NAV ═══════ */}
            <div style={{
                position: 'fixed',
                top: scrollY > 60 ? 16 : 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
                <nav style={{
                    background: 'rgba(18, 18, 18, 0.92)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderRadius: '60px',
                    padding: '0 8px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
                }}>
                    {/* Brand */}
                    <Link href="/" style={{
                        fontFamily: f,
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#fff',
                        textDecoration: 'none',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        padding: '0 20px 0 22px',
                        whiteSpace: 'nowrap',
                    }}>
                        ORDINANCE
                    </Link>

                    <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

                    {/* Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '0 4px' }}>
                        {[
                            { name: 'Platform', path: '/hub' },
                            { name: 'Founding 20', path: '/founding' },
                            { name: 'Why Roof', path: '/why-roof' },
                            { name: 'Price Index', path: '/price-index' },
                        ].map(link => (
                            <Link key={link.name} href={link.path} style={{
                                fontFamily: f,
                                fontSize: '0.78rem',
                                fontWeight: 400,
                                color: 'rgba(255,255,255,0.4)',
                                textDecoration: 'none',
                                padding: '6px 14px',
                                borderRadius: '40px',
                                transition: 'all 0.25s ease',
                                whiteSpace: 'nowrap',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}
                            >{link.name}</Link>
                        ))}
                    </div>

                    <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

                    {/* CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px 0 8px' }}>
                        <Link href="/login" style={{
                            fontSize: '0.78rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)',
                            textDecoration: 'none', padding: '6px 12px', borderRadius: 40,
                            transition: 'color 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                        >Log in</Link>
                        <Link href="/join" style={{
                            fontSize: '0.78rem', fontWeight: 600, color: '#fff',
                            textDecoration: 'none', padding: '6px 16px', borderRadius: 40,
                            background: 'rgba(255,255,255,0.1)', transition: 'all 0.2s',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >Get Started</Link>
                    </div>
                </nav>
            </div>

            {/* ═══════ HERO ═══════ */}
            <section style={{
                padding: '200px 48px 120px', textAlign: 'center',
                maxWidth: 1000, margin: '0 auto', position: 'relative',
            }}>
                {/* Subtle ambient */}
                <div style={{
                    position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
                    width: 700, height: 500,
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative', zIndex: 1,
                }}>
                    {/* Ordinance badge */}
                    <div style={{
                        fontFamily: mono,
                        fontSize: 10, fontWeight: 500, letterSpacing: '0.2em',
                        color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
                        marginBottom: 48,
                    }}>
                        ORDINANCE SYSTEMS · SINGAPORE
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(52px, 8vw, 88px)', fontWeight: 700, lineHeight: 1.0,
                        letterSpacing: '-0.04em', color: 'white', margin: '0 0 8px',
                    }}>
                        The operating<br />system for<br />
                        <span style={{ display: 'inline-block', position: 'relative', minWidth: 300 }}>
                            <span key={wordIdx} style={{
                                color: 'rgba(255,255,255,0.25)',
                                animation: 'word-slide 2.2s ease-in-out',
                                display: 'inline-block',
                            }}>
                                {heroWords[wordIdx]}
                            </span>
                        </span>
                    </h1>

                    <p style={{
                        fontSize: 16, color: 'rgba(255,255,255,0.3)', lineHeight: 1.8,
                        maxWidth: 480, margin: '40px auto 16px', fontWeight: 400,
                    }}>
                        From first lead to final handover. Track prospects,<br />
                        auto-price quotes, dispatch trades, manage payments.
                    </p>

                    <p style={{ fontSize: 11, fontWeight: 500, marginBottom: 48, fontFamily: mono, letterSpacing: '0.05em' }}>
                        <span style={{ color: 'rgba(255,255,255,0.35)' }}>Free to use</span>
                        <span style={{ color: 'rgba(255,255,255,0.1)', margin: '0 16px' }}>—</span>
                        <span style={{ color: 'rgba(255,255,255,0.25)' }}>Commission only when you close</span>
                        <span style={{ color: 'rgba(255,255,255,0.1)', margin: '0 16px' }}>—</span>
                        <span style={{ color: 'rgba(255,255,255,0.25)' }}>Starts at 2%</span>
                    </p>

                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                        <Link href="/signup" style={{
                            padding: '14px 40px', fontSize: 13, fontWeight: 600,
                            color: '#09090B', background: '#fff',
                            textDecoration: 'none', borderRadius: 8,
                            letterSpacing: '0.02em',
                            transition: 'all 0.3s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >Start Free Trial</Link>
                        <Link href="https://roofplatform.com" style={{
                            padding: '14px 40px', fontSize: 13, fontWeight: 500,
                            color: 'rgba(255,255,255,0.5)', background: 'transparent',
                            textDecoration: 'none', borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.3s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                        >I&apos;m a Homeowner →</Link>
                    </div>
                </div>
            </section>

            {/* ═══════ STATS LINE ═══════ */}
            <section ref={section1.ref} className={`reveal ${section1.visible ? 'visible' : ''}`} style={{
                maxWidth: 800, margin: '0 auto 140px', padding: '0 48px',
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                {[
                    { value: 113, suffix: '', label: 'Materials priced' },
                    { value: 20, suffix: '', label: 'Trades covered' },
                    { value: 100, suffix: '%', label: 'SG market rates' },
                    { value: 0, suffix: '', label: 'Free tools', display: '$0' },
                ].map((s, i) => (
                    <div key={i} style={{
                        textAlign: 'center', padding: '36px 16px',
                        borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}>
                        <div style={{
                            fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em',
                            color: '#fff',
                        }}>
                            {s.display || <AnimatedCounter target={s.value} suffix={s.suffix} />}
                        </div>
                        <div style={{
                            fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 500,
                            marginTop: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
                            fontFamily: mono,
                        }}>{s.label}</div>
                    </div>
                ))}
            </section>

            {/* ═══════ ENGINES — LIST STYLE ═══════ */}
            <section ref={section2.ref} className={`reveal ${section2.visible ? 'visible' : ''}`} style={{
                maxWidth: 900, margin: '0 auto', padding: '0 48px 140px',
            }}>
                <div style={{ marginBottom: 56 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 10, fontWeight: 500,
                        color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em',
                        textTransform: 'uppercase', marginBottom: 16,
                    }}>
                        THE PLATFORM
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, color: 'white',
                        letterSpacing: '-0.04em', margin: '0 0 12px', lineHeight: 1.05,
                    }}>
                        Six engines.<br />
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>One command center.</span>
                    </h2>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    {ENGINES.map((e, i) => (
                        <Link key={i} href={e.path} className="engine-row" style={{
                            display: 'grid', gridTemplateColumns: '50px 1fr 120px 40px',
                            alignItems: 'center', padding: '24px 0',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            textDecoration: 'none',
                        }}>
                            <span className="engine-num" style={{
                                fontFamily: mono, fontSize: 11, fontWeight: 500,
                                color: 'rgba(255,255,255,0.15)', letterSpacing: '0.05em',
                                transition: 'color 0.3s',
                            }}>{e.num}</span>
                            <div>
                                <span className="engine-title" style={{
                                    fontSize: 20, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                                    letterSpacing: '-0.02em', transition: 'color 0.3s',
                                }}>{e.title}</span>
                                <span style={{
                                    fontSize: 13, color: 'rgba(255,255,255,0.25)',
                                    marginLeft: 20, fontWeight: 400,
                                }}>{e.desc}</span>
                            </div>
                            <span style={{
                                fontFamily: mono, fontSize: 9, fontWeight: 500,
                                color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em',
                                textTransform: 'uppercase', textAlign: 'right',
                            }}>{e.tag}</span>
                            <span className="engine-arrow" style={{
                                color: 'rgba(255,255,255,0.4)', fontSize: 16,
                                textAlign: 'right', opacity: 0,
                                transform: 'translateX(-8px)', transition: 'all 0.3s',
                            }}>→</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══════ COMPARISON ═══════ */}
            <section ref={section3.ref} className={`reveal ${section3.visible ? 'visible' : ''}`} style={{
                maxWidth: 700, margin: '0 auto', padding: '0 48px 140px',
            }}>
                <div style={{ marginBottom: 48 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 10, fontWeight: 500,
                        color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em',
                        textTransform: 'uppercase', marginBottom: 16,
                    }}>
                        DIFFERENTIATION
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: 'white',
                        letterSpacing: '-0.03em', margin: 0,
                    }}>
                        They match.<br />
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>We manage.</span>
                    </h2>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    {/* Header */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 80px 80px',
                        padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Feature</span>
                        <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(255,255,255,0.4)', textAlign: 'center', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Roof</span>
                        <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(255,255,255,0.12)', textAlign: 'center', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Others</span>
                    </div>
                    {COMPARISON.map((row, i) => (
                        <div key={i} style={{
                            display: 'grid', gridTemplateColumns: '1fr 80px 80px',
                            padding: '14px 0',
                            borderBottom: i < COMPARISON.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        }}>
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>{row.feature}</span>
                            <span style={{ textAlign: 'center', fontSize: 13, color: row.us ? '#fff' : 'rgba(255,255,255,0.15)' }}>{row.us ? '●' : '○'}</span>
                            <span style={{ textAlign: 'center', fontSize: 13, color: row.them ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)' }}>{row.them ? '●' : '○'}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════ TRUST SIGNALS ═══════ */}
            <section ref={section4.ref} className={`reveal ${section4.visible ? 'visible' : ''}`} style={{
                maxWidth: 900, margin: '0 auto', padding: '0 48px 140px',
            }}>
                <div style={{ marginBottom: 48 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 10, fontWeight: 500,
                        color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em',
                        textTransform: 'uppercase', marginBottom: 16,
                    }}>
                        VERIFICATION
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: 'white',
                        letterSpacing: '-0.03em', margin: 0,
                    }}>
                        Every partner.<br />
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>Verified.</span>
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    {TRUST_SIGNALS.map((s, i) => (
                        <div key={i} style={{
                            padding: '36px 24px', background: '#09090B',
                        }}>
                            <div style={{
                                fontSize: 20, color: 'rgba(255,255,255,0.15)', marginBottom: 20,
                                fontWeight: 300,
                            }}>{s.icon}</div>
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', margin: '0 0 8px' }}>{s.title}</h3>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════ PROCESS ═══════ */}
            <section ref={section5.ref} className={`reveal ${section5.visible ? 'visible' : ''}`} style={{
                maxWidth: 800, margin: '0 auto', padding: '0 48px 140px',
            }}>
                <div style={{ marginBottom: 48 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 10, fontWeight: 500,
                        color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em',
                        textTransform: 'uppercase', marginBottom: 16,
                    }}>
                        PROCESS
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: 'white',
                        letterSpacing: '-0.03em', margin: 0,
                    }}>
                        Three steps.<br />
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>Zero friction.</span>
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
                    {[
                        { step: '01', title: 'Tell us what you need', desc: 'Property type, budget, scope, style preference, and timeline — takes 2 minutes.' },
                        { step: '02', title: 'We match you with 3 firms', desc: 'AI reviews your preferences and connects you with 3 pre-qualified, style-matched designers.' },
                        { step: '03', title: 'Compare & sign on-platform', desc: 'Review proposals, chat, and sign contracts — everything stays in Roof through handover.' },
                    ].map((item, i) => (
                        <div key={i}>
                            <div style={{
                                fontFamily: mono, fontSize: 10, fontWeight: 500,
                                color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em',
                                marginBottom: 16,
                            }}>{item.step}</div>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.7)', margin: '0 0 10px', letterSpacing: '-0.01em' }}>{item.title}</h3>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════ FINAL CTA ═══════ */}
            <section style={{
                maxWidth: 700, margin: '0 auto 120px',
                padding: '80px 48px', textAlign: 'center',
                borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
                <h2 style={{
                    fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: 'white',
                    letterSpacing: '-0.03em', margin: '0 0 12px', lineHeight: 1.1,
                }}>
                    Ready to run your firm<br />
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>like a system?</span>
                </h2>
                <p style={{
                    color: 'rgba(255,255,255,0.25)', margin: '0 0 40px',
                    fontFamily: mono, fontSize: 11, letterSpacing: '0.03em',
                }}>
                    Free to use · Pay only when you close · Founding 20 get 0.5% rates
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <Link href="/signup" style={{
                        padding: '14px 44px', fontSize: 13, fontWeight: 600,
                        color: '#09090B', background: '#fff',
                        textDecoration: 'none', borderRadius: 8,
                        transition: 'all 0.3s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >Create Your Account →</Link>
                    <Link href="/founding" style={{
                        padding: '14px 36px', fontSize: 13, fontWeight: 500,
                        color: 'rgba(255,255,255,0.5)', background: 'transparent',
                        textDecoration: 'none', borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    >Founding 20 →</Link>
                </div>
            </section>

            {/* ═══════ FOOTER ═══════ */}
            <footer style={{
                padding: '28px 48px', borderTop: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.05em' }}>© 2026 ORDINANCE SYSTEMS · SINGAPORE</span>
                <div style={{ display: 'flex', gap: 24 }}>
                    {['Login', 'Sign Up', 'Founding 20', 'Why Roof'].map(label => (
                        <Link key={label} href={`/${label.toLowerCase().replace(/ /g, '-').replace('sign-up', 'signup').replace('login', 'login')}`}
                            style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.15)')}
                        >{label}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
