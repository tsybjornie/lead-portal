'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

/* ─────────────── DATA ─────────────── */

const ENGINES = [
    { icon: '📋', title: 'Follow Up', desc: 'AI prospect management. Never lose a lead again.', color: '#6366F1', tag: 'CRM' },
    { icon: '📐', title: 'Numbers', desc: '113 materials, real SG rates. Auto-price any scope.', color: '#10B981', tag: 'Quotation' },
    { icon: '🚀', title: 'Dispatch', desc: 'Deploy 20 trades. PO tracking. Vendor management.', color: '#F59E0B', tag: 'Procurement' },
    { icon: '📊', title: 'Sequence', desc: 'Gantt timelines, trade scheduling, task dependencies.', color: '#8B5CF6', tag: 'Project' },
    { icon: '💰', title: 'Ledger', desc: 'Project P&L, cashflow forecasting, milestone billing.', color: '#06B6D4', tag: 'Finance' },
    { icon: '🏪', title: 'Hardware POS', desc: 'Barcode inventory, stock tracking, trade credit.', color: '#EC4899', tag: 'Retail' },
];

const DESIGN_STYLES = [
    { name: 'Wabi-Sabi', origin: '🇯🇵 Japan', desc: 'The beauty of imperfection — raw textures, aged wood, and organic asymmetry.', accent: '#C4A882' },
    { name: 'Bauhaus', origin: '🇩🇪 Germany', desc: 'Form follows function — geometric purity, primary colors, and industrial honesty.', accent: '#E63946' },
    { name: 'De Stijl', origin: '🇳🇱 Netherlands', desc: 'Mondrian-inspired grids, bold primaries, and radical abstraction.', accent: '#457B9D' },
    { name: 'Brutalism', origin: '🇬🇧 Britain', desc: 'Raw concrete, exposed structure, and uncompromising material honesty.', accent: '#6B705C' },
    { name: 'Art Nouveau', origin: '🇫🇷 France', desc: 'Flowing organic forms, botanical motifs, and handcrafted ironwork.', accent: '#BC6C25' },
    { name: 'Peranakan', origin: '🇸🇬 Straits', desc: 'Vibrant tiles, ornate shophouse motifs, and heritage fusion.', accent: '#E07A5F' },
    { name: 'Hygge', origin: '🇩🇰 Denmark', desc: 'Warmth, comfort, and intentional coziness — soft textiles and candlelight.', accent: '#A8DADC' },
    { name: 'Art Deco', origin: '🇺🇸 America', desc: 'Geometric glamour with gold accents and Gatsby-era opulence.', accent: '#D4A574' },
];

const TRUST_SIGNALS = [
    { icon: '🏛️', title: 'BCA Registered', desc: 'All partner firms verified with Building & Construction Authority.' },
    { icon: '🏠', title: 'HDB Licensed', desc: 'Contractors hold valid HDB renovation licenses.' },
    { icon: '🪪', title: 'Singpass Verified', desc: 'Designer identity verified via Singpass Face Verification.' },
    { icon: '🔒', title: 'Escrow Protected', desc: 'Client payments held in escrow until work is verified.' },
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
    const [hoveredEngine, setHoveredEngine] = useState<number | null>(null);
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
    const section6 = useInView();

    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', monospace";

    return (
        <div style={{ fontFamily: f, background: '#09090B', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            {/* Gradient keyframes */}
            <style>{`
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes float-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.15); }
                    50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.3); }
                }
                @keyframes word-slide {
                    0% { opacity: 0; transform: translateY(20px); }
                    10% { opacity: 1; transform: translateY(0); }
                    85% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-20px); }
                }
                .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
                .reveal.visible { opacity: 1; transform: translateY(0); }
                .engine-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .engine-card:hover { transform: translateY(-8px) scale(1.02); }
                .style-card { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
                .style-card:hover { transform: translateY(-6px); }
                .cta-btn { transition: all 0.3s; }
                .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(99,102,241,0.4); }
            `}</style>

            {/* ═══════ NAV ═══════ */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: scrollY > 60 ? 'rgba(9,9,11,0.85)' : 'transparent',
                backdropFilter: scrollY > 60 ? 'blur(20px) saturate(180%)' : 'none',
                borderBottom: scrollY > 60 ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                transition: 'all 0.4s',
                padding: '0 48px', height: 64,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 15, fontWeight: 800,
                    }}>R</div>
                    <span style={{ fontSize: 17, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>Roof</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <Link href="/founding" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>Founding 20</Link>
                    <Link href="/why-roof" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>Why Roof</Link>
                    <Link href="/price-index" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>Price Index</Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link href="/login" style={{
                        padding: '8px 18px', fontSize: 13, fontWeight: 500,
                        color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderRadius: 8,
                    }}>Log in</Link>
                    <Link href="/join" className="cta-btn" style={{
                        padding: '8px 22px', fontSize: 13, fontWeight: 600,
                        color: 'white', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        textDecoration: 'none', borderRadius: 8,
                    }}>Get Started Free</Link>
                </div>
            </nav>

            {/* ═══════ HERO ═══════ */}
            <section style={{
                padding: '160px 48px 100px', textAlign: 'center',
                maxWidth: 900, margin: '0 auto',
                position: 'relative',
            }}>
                {/* Ambient glow */}
                <div style={{
                    position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)',
                    width: 800, height: 600,
                    background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative', zIndex: 1,
                }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '6px 16px 6px 8px', borderRadius: 100,
                        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                        fontSize: 12, fontWeight: 600, color: '#A5B4FC',
                        marginBottom: 32, letterSpacing: '0.02em',
                    }}>
                        <span style={{
                            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                            color: 'white', fontSize: 10, fontWeight: 700,
                            padding: '2px 8px', borderRadius: 100, letterSpacing: '0.05em',
                        }}>NEW</span>
                        Now onboarding Founding 20 firms
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(48px, 7vw, 76px)', fontWeight: 800, lineHeight: 1.05,
                        letterSpacing: '-0.04em', color: 'white', margin: '0 0 8px',
                    }}>
                        The operating system<br />
                        for renovation{' '}
                        <span style={{
                            display: 'inline-block', position: 'relative', minWidth: 280,
                        }}>
                            <span key={wordIdx} style={{
                                background: 'linear-gradient(135deg, #6366F1, #A78BFA, #EC4899)',
                                backgroundSize: '200% 200%',
                                animation: 'gradient-shift 3s ease infinite, word-slide 2.2s ease-in-out',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                display: 'inline-block',
                            }}>
                                {heroWords[wordIdx]}
                            </span>
                        </span>
                    </h1>

                    <p style={{
                        fontSize: 18, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
                        maxWidth: 540, margin: '24px auto 12px', fontWeight: 400,
                    }}>
                        From first lead to final handover. Track prospects, auto-price quotes, dispatch trades, and manage payments — all in one place.
                    </p>

                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 40 }}>
                        <span style={{ color: '#10B981' }}>Free to use</span>
                        <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 12px' }}>·</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>Commission only when you close</span>
                        <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 12px' }}>·</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>Starts at 2%</span>
                    </p>

                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                        <Link href="/signup" className="cta-btn" style={{
                            padding: '14px 36px', fontSize: 15, fontWeight: 700,
                            color: 'white', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                            textDecoration: 'none', borderRadius: 12,
                            boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
                        }}>Start Free Trial</Link>
                        <Link href="/join" style={{
                            padding: '14px 36px', fontSize: 15, fontWeight: 600,
                            color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.06)',
                            textDecoration: 'none', borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.3s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        >I&apos;m a Homeowner →</Link>
                    </div>
                </div>
            </section>

            {/* ═══════ STATS BAR ═══════ */}
            <section ref={section1.ref} className={`reveal ${section1.visible ? 'visible' : ''}`} style={{
                maxWidth: 900, margin: '0 auto 120px', padding: '0 48px',
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            }}>
                {[
                    { value: 113, suffix: '', label: 'Materials priced' },
                    { value: 20, suffix: '', label: 'Trades covered' },
                    { value: 100, suffix: '%', label: 'SG market rates' },
                    { value: 0, suffix: '', label: 'Free tools — pay when you close', display: '$0' },
                ].map((s, i) => (
                    <div key={i} style={{
                        textAlign: 'center', padding: '28px 16px',
                        borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}>
                        <div style={{
                            fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em',
                            background: 'linear-gradient(135deg, #E0E7FF, #fff)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>
                            {s.display || <AnimatedCounter target={s.value} suffix={s.suffix} />}
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginTop: 6 }}>{s.label}</div>
                    </div>
                ))}
            </section>

            {/* ═══════ SIX ENGINES ═══════ */}
            <section ref={section2.ref} className={`reveal ${section2.visible ? 'visible' : ''}`} style={{
                maxWidth: 1100, margin: '0 auto', padding: '0 48px 120px',
            }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                        Platform
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'white',
                        letterSpacing: '-0.03em', margin: '0 0 16px',
                    }}>
                        Six engines. One command center.
                    </h2>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 500, margin: '0 auto' }}>
                        Everything a renovation firm needs. Nothing it doesn&apos;t.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {ENGINES.map((e, i) => (
                        <div key={i} className="engine-card" style={{
                            padding: '32px 28px', borderRadius: 16,
                            background: hoveredEngine === i
                                ? `linear-gradient(135deg, rgba(${e.color === '#6366F1' ? '99,102,241' : e.color === '#10B981' ? '16,185,129' : e.color === '#F59E0B' ? '245,158,11' : e.color === '#8B5CF6' ? '139,92,246' : e.color === '#06B6D4' ? '6,182,212' : '236,72,153'},0.1), rgba(255,255,255,0.03))`
                                : 'rgba(255,255,255,0.03)',
                            border: hoveredEngine === i
                                ? `1px solid ${e.color}40`
                                : '1px solid rgba(255,255,255,0.06)',
                            cursor: 'default',
                        }}
                            onMouseEnter={() => setHoveredEngine(i)}
                            onMouseLeave={() => setHoveredEngine(null)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <span style={{ fontSize: 28 }}>{e.icon}</span>
                                <span style={{
                                    fontSize: 10, fontWeight: 700, color: e.color,
                                    background: `${e.color}15`, padding: '3px 10px',
                                    borderRadius: 6, letterSpacing: '0.06em', textTransform: 'uppercase',
                                    fontFamily: mono,
                                }}>{e.tag}</span>
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>{e.title}</h3>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>{e.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════ COMPARISON TABLE ═══════ */}
            <section ref={section3.ref} className={`reveal ${section3.visible ? 'visible' : ''}`} style={{
                maxWidth: 700, margin: '0 auto', padding: '0 48px 120px',
            }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#10B981', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                        Why Roof
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: 'white',
                        letterSpacing: '-0.03em', margin: '0 0 12px',
                    }}>
                        They match. We manage.
                    </h2>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
                        Every competitor stops after the handshake.
                    </p>
                </div>
                <div style={{
                    borderRadius: 16, overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)',
                }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 100px 100px',
                        padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                        background: 'rgba(255,255,255,0.03)',
                    }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Feature</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Roof</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)', textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Others</span>
                    </div>
                    {COMPARISON.map((row, i) => (
                        <div key={i} style={{
                            display: 'grid', gridTemplateColumns: '1fr 100px 100px',
                            padding: '14px 24px',
                            borderBottom: i < COMPARISON.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        }}>
                            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{row.feature}</span>
                            <span style={{ textAlign: 'center', fontSize: 16 }}>{row.us ? '✅' : '—'}</span>
                            <span style={{ textAlign: 'center', fontSize: 16 }}>{row.them ? '✅' : '❌'}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════ DESIGN MOVEMENTS ═══════ */}
            <section ref={section4.ref} className={`reveal ${section4.visible ? 'visible' : ''}`} style={{
                padding: '100px 48px', position: 'relative',
                background: 'linear-gradient(180deg, #09090B 0%, #0F0F12 50%, #09090B 100%)',
            }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#D4A574', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                            Style Intelligence
                        </p>
                        <h2 style={{
                            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'white',
                            letterSpacing: '-0.03em', margin: '0 0 12px',
                        }}>
                            Curated Design Movements
                        </h2>
                        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', maxWidth: 420, margin: '0 auto' }}>
                            Our AI matches homeowners with designers who specialize in their preferred aesthetic.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                        {DESIGN_STYLES.map((style, i) => (
                            <div key={i} className="style-card" style={{
                                padding: '24px 20px', borderRadius: 14,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                cursor: 'default',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = `${style.accent}50`; e.currentTarget.style.background = `${style.accent}08`; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                            >
                                <div style={{ width: '100%', height: 3, borderRadius: 2, background: style.accent, marginBottom: 16, opacity: 0.6 }} />
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>{style.name}</h3>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>{style.origin}</div>
                                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.55, margin: 0 }}>{style.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ TRUST SIGNALS ═══════ */}
            <section ref={section5.ref} className={`reveal ${section5.visible ? 'visible' : ''}`} style={{
                padding: '100px 48px',
            }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#10B981', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                            Verified
                        </p>
                        <h2 style={{
                            fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: 'white',
                            letterSpacing: '-0.03em', margin: '0 0 12px',
                        }}>
                            Every partner. Verified.
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                        {TRUST_SIGNALS.map((s, i) => (
                            <div key={i} style={{
                                textAlign: 'center', padding: '32px 20px', borderRadius: 16,
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}>
                                <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>{s.title}</h3>
                                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ HOW IT WORKS ═══════ */}
            <section ref={section6.ref} className={`reveal ${section6.visible ? 'visible' : ''}`} style={{
                padding: '100px 48px', position: 'relative',
            }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#A78BFA', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                            Process
                        </p>
                        <h2 style={{
                            fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: 'white',
                            letterSpacing: '-0.03em', margin: 0,
                        }}>
                            Three steps. Zero friction.
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
                        {[
                            { step: '01', title: 'Tell us what you need', desc: 'Property type, budget, scope, style preference, and timeline — takes 2 minutes.', color: '#6366F1' },
                            { step: '02', title: 'We match you with 3 firms', desc: 'AI reviews your preferences and connects you with exactly 3 pre-qualified, style-matched designers.', color: '#A78BFA' },
                            { step: '03', title: 'Compare & sign on-platform', desc: 'Review proposals, chat, and sign contracts — everything stays in Roof through handover.', color: '#EC4899' },
                        ].map((item, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontFamily: mono, fontSize: 11, fontWeight: 700, color: item.color,
                                    letterSpacing: '0.1em', marginBottom: 16,
                                }}>{item.step}</div>
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'white', margin: '0 0 10px' }}>{item.title}</h3>
                                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ FINAL CTA ═══════ */}
            <section style={{
                maxWidth: 800, margin: '40px auto 120px', padding: '80px 60px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: 24, textAlign: 'center',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Glow */}
                <div style={{
                    position: 'absolute', top: -100, right: -100,
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)',
                    pointerEvents: 'none',
                }} />
                <h2 style={{
                    fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: 'white',
                    letterSpacing: '-0.03em', margin: '0 0 12px', position: 'relative',
                }}>
                    Ready to run your firm<br />like a system?
                </h2>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '0 0 36px', position: 'relative' }}>
                    Free to use. Pay only when you close deals. Founding 20 get 0.5% rates.
                </p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', position: 'relative' }}>
                    <Link href="/signup" className="cta-btn" style={{
                        padding: '16px 44px', fontSize: 16, fontWeight: 700,
                        color: 'white', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        textDecoration: 'none', borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
                    }}>Create Your Account →</Link>
                    <Link href="/founding" style={{
                        padding: '16px 36px', fontSize: 16, fontWeight: 600,
                        color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.06)',
                        textDecoration: 'none', borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    >Founding 20 →</Link>
                </div>
            </section>

            {/* ═══════ FOOTER ═══════ */}
            <footer style={{
                padding: '32px 48px', borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>© 2026 Roof. Built in Singapore.</span>
                <div style={{ display: 'flex', gap: 24 }}>
                    {['Login', 'Sign Up', 'Founding 20', 'Why Roof'].map(label => (
                        <Link key={label} href={`/${label.toLowerCase().replace(/ /g, '-').replace('sign-up', 'signup').replace('login', 'login')}`}
                            style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
                        >{label}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
