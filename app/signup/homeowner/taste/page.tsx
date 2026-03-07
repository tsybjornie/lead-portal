'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════
   TASTE QUIZ — Visual preference profiling for homeowners
   Shows pairs of renovation photos. Homeowner picks one.
   Results generate a taste profile used for smarter matching.
   ═══════════════════════════════════════════════════════ */

const ROUNDS = [
    {
        question: 'Which living room feels more like home?',
        dimension: 'warmth',
        optionA: { src: '/taste/warm-japandi.png', label: 'Warm & Natural', tags: ['warm', 'japandi', 'natural', 'wood'] },
        optionB: { src: '/taste/cool-modern.png', label: 'Cool & Contemporary', tags: ['cool', 'modern', 'minimal', 'marble'] },
    },
    {
        question: 'Which kitchen do you prefer?',
        dimension: 'material',
        optionA: { src: '/taste/natural-rustic.png', label: 'Organic & Textured', tags: ['rustic', 'brick', 'copper', 'earthy'] },
        optionB: { src: '/taste/industrial-dark.png', label: 'Bold & Industrial', tags: ['industrial', 'dark', 'matte', 'concrete'] },
    },
    {
        question: 'Which bedroom would you wake up in?',
        dimension: 'mood',
        optionA: { src: '/taste/scandinavian-light.png', label: 'Light & Serene', tags: ['scandinavian', 'airy', 'white', 'calm'] },
        optionB: { src: '/taste/luxury-dark.png', label: 'Rich & Dramatic', tags: ['luxury', 'moody', 'velvet', 'gold'] },
    },
    {
        question: 'How should spaces connect?',
        dimension: 'layout',
        optionA: { src: '/taste/open-concept.png', label: 'Open & Flowing', tags: ['open-plan', 'spacious', 'connected', 'modern'] },
        optionB: { src: '/taste/cozy-defined.png', label: 'Cozy & Defined', tags: ['defined', 'intimate', 'bookshelves', 'nook'] },
    },
    {
        question: 'Which space has more personality?',
        dimension: 'density',
        optionA: { src: '/taste/cool-modern.png', label: 'Less is More', tags: ['minimal', 'clean', 'restrained', 'curated'] },
        optionB: { src: '/taste/maximalist.png', label: 'More is More', tags: ['maximalist', 'colorful', 'layered', 'bold'] },
    },
];

type Choice = 'A' | 'B' | null;

function getTasteProfile(choices: Choice[]) {
    const tags: string[] = [];
    choices.forEach((c, i) => {
        if (c === 'A') tags.push(...ROUNDS[i].optionA.tags);
        if (c === 'B') tags.push(...ROUNDS[i].optionB.tags);
    });

    // Count tag frequencies to build profile
    const freq: Record<string, number> = {};
    tags.forEach(t => { freq[t] = (freq[t] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);

    // Determine primary style
    const warmScore = (choices[0] === 'A' ? 2 : 0) + (choices[1] === 'A' ? 1 : 0) + (choices[2] === 'A' ? 1 : 0);
    const coolScore = (choices[0] === 'B' ? 2 : 0) + (choices[1] === 'B' ? 1 : 0) + (choices[2] === 'B' ? 1 : 0);
    const minimalScore = (choices[4] === 'A' ? 2 : 0) + (choices[0] === 'B' ? 1 : 0);
    const maximalScore = (choices[4] === 'B' ? 2 : 0) + (choices[1] === 'A' ? 1 : 0);

    let style = 'Modern Eclectic';
    if (warmScore >= 3 && minimalScore >= 2) style = 'Japandi';
    else if (warmScore >= 3 && maximalScore >= 2) style = 'Warm Rustic';
    else if (warmScore >= 3) style = 'Scandinavian Warm';
    else if (coolScore >= 3 && minimalScore >= 2) style = 'Modern Minimalist';
    else if (coolScore >= 3 && maximalScore >= 2) style = 'Industrial Luxury';
    else if (coolScore >= 3) style = 'Contemporary';
    else if (minimalScore >= 2) style = 'Clean Minimal';
    else if (maximalScore >= 2) style = 'Bold Maximalist';

    const traits = sorted.slice(0, 6).map(([tag]) => tag);

    return { style, traits, warmScore, coolScore, minimalScore, maximalScore };
}

export default function TasteQuiz() {
    const [step, setStep] = useState(0);
    const [choices, setChoices] = useState<Choice[]>(Array(ROUNDS.length).fill(null));
    const [hovering, setHovering] = useState<'A' | 'B' | null>(null);
    const [completed, setCompleted] = useState(false);

    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    const handleChoice = (choice: 'A' | 'B') => {
        const updated = [...choices];
        updated[step] = choice;
        setChoices(updated);

        if (step < ROUNDS.length - 1) {
            setTimeout(() => setStep(step + 1), 400);
        } else {
            setTimeout(() => setCompleted(true), 400);
        }
    };

    const round = ROUNDS[step];
    const profile = completed ? getTasteProfile(choices) : null;

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                .taste-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .taste-card:hover { transform: scale(1.02); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
                .taste-card.selected { transform: scale(1.03); box-shadow: 0 0 0 3px #111, 0 12px 40px rgba(0,0,0,0.15); }
                .taste-card.dimmed { opacity: 0.4; transform: scale(0.97); filter: grayscale(0.5); }
                .progress-dot { transition: all 0.3s; }
                .trait-chip { animation: scaleIn 0.3s ease-out both; }
            `}</style>

            {/* Nav */}
            <nav style={{ padding: '0 48px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link href="/landing" style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, textDecoration: 'none' }}>ROOF</Link>
                    <span style={{ color: 'rgba(0,0,0,0.12)' }}>/</span>
                    <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>TASTE PROFILE</span>
                </div>
                <Link href="/signup/homeowner" style={{ fontSize: 12, fontWeight: 400, color: 'rgba(0,0,0,0.4)', textDecoration: 'none' }}>Skip →</Link>
            </nav>

            {!completed ? (
                <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 48px', animation: 'fadeSlideIn 0.4s ease-out' }} key={step}>
                    {/* Progress */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {ROUNDS.map((_, i) => (
                                <div key={i} className="progress-dot" style={{
                                    width: i === step ? 32 : 10, height: 10, borderRadius: 5,
                                    background: i < step ? '#111' : i === step ? '#111' : 'rgba(0,0,0,0.08)',
                                }} />
                            ))}
                        </div>
                        <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.05em' }}>
                            {step + 1} of {ROUNDS.length}
                        </span>
                    </div>

                    {/* Question */}
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 12 }}>
                            {round.dimension.toUpperCase()}
                        </div>
                        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.03em', margin: 0, color: '#111' }}>
                            {round.question}
                        </h1>
                    </div>

                    {/* Photo pair */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        {(['A', 'B'] as const).map(side => {
                            const option = side === 'A' ? round.optionA : round.optionB;
                            const selected = choices[step] === side;
                            const otherSelected = choices[step] !== null && choices[step] !== side;
                            return (
                                <div
                                    key={side}
                                    className={`taste-card ${selected ? 'selected' : ''} ${otherSelected ? 'dimmed' : ''}`}
                                    onClick={() => handleChoice(side)}
                                    onMouseEnter={() => setHovering(side)}
                                    onMouseLeave={() => setHovering(null)}
                                    style={{
                                        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                                        position: 'relative',
                                        border: selected ? '3px solid #111' : '3px solid transparent',
                                    }}
                                >
                                    <div style={{ position: 'relative', width: '100%', paddingTop: '66.67%' }}>
                                        <Image
                                            src={option.src}
                                            alt={option.label}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            sizes="(max-width: 960px) 50vw, 460px"
                                        />
                                        {/* Gradient overlay */}
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                                        }} />
                                        {/* Label */}
                                        <div style={{
                                            position: 'absolute', bottom: 16, left: 20, right: 20,
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        }}>
                                            <span style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{option.label}</span>
                                            {selected && (
                                                <div style={{
                                                    width: 28, height: 28, borderRadius: 14,
                                                    background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 14, animation: 'scaleIn 0.2s ease-out',
                                                }}>✓</div>
                                            )}
                                        </div>
                                        {/* Hover indicator */}
                                        {hovering === side && !selected && (
                                            <div style={{
                                                position: 'absolute', top: 16, right: 16,
                                                padding: '4px 12px', borderRadius: 20,
                                                background: 'rgba(255,255,255,0.9)', fontSize: 10, fontWeight: 600,
                                                color: '#111', animation: 'scaleIn 0.15s ease-out',
                                            }}>Select</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Back button if not first */}
                    {step > 0 && (
                        <button onClick={() => setStep(step - 1)} style={{
                            marginTop: 24, padding: '8px 20px', border: 'none', background: 'transparent',
                            fontSize: 12, color: 'rgba(0,0,0,0.35)', cursor: 'pointer', fontFamily: f,
                        }}>← Previous</button>
                    )}
                </div>
            ) : (
                /* ═══ RESULTS PAGE ═══ */
                <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 48px', animation: 'fadeSlideIn 0.5s ease-out' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 16 }}>YOUR TASTE PROFILE</div>
                        <h1 style={{ fontSize: 36, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 8px', color: '#111' }}>
                            {profile?.style}
                        </h1>
                        <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', margin: 0 }}>
                            We&apos;ll use this to match you with designers who specialise in this aesthetic.
                        </p>
                    </div>

                    {/* Taste spectrum bars */}
                    <div style={{
                        background: 'white', borderRadius: 14, padding: '28px 32px', marginBottom: 20,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 20 }}>STYLE SPECTRUM</div>

                        {[
                            { left: 'Warm', right: 'Cool', value: profile ? profile.coolScore / (profile.warmScore + profile.coolScore + 0.01) * 100 : 50 },
                            { left: 'Minimal', right: 'Maximalist', value: profile ? profile.maximalScore / (profile.minimalScore + profile.maximalScore + 0.01) * 100 : 50 },
                            { left: 'Open Plan', right: 'Defined Rooms', value: choices[3] === 'A' ? 25 : choices[3] === 'B' ? 75 : 50 },
                            { left: 'Light', right: 'Moody', value: choices[2] === 'A' ? 25 : choices[2] === 'B' ? 75 : 50 },
                        ].map((spectrum, i) => (
                            <div key={i} style={{ marginBottom: i < 3 ? 18 : 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', fontWeight: 500 }}>{spectrum.left}</span>
                                    <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', fontWeight: 500 }}>{spectrum.right}</span>
                                </div>
                                <div style={{ height: 8, background: 'rgba(0,0,0,0.04)', borderRadius: 4, position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute', left: `${Math.max(5, Math.min(95, spectrum.value))}%`,
                                        top: -3, width: 14, height: 14, borderRadius: 7,
                                        background: '#111', transform: 'translateX(-50%)',
                                        transition: 'left 0.5s ease-out',
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trait chips */}
                    <div style={{
                        background: 'white', borderRadius: 14, padding: '28px 32px', marginBottom: 20,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 14 }}>YOUR DESIGN DNA</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {profile?.traits.map((trait, i) => (
                                <span key={trait} className="trait-chip" style={{
                                    padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                                    background: i === 0 ? '#111' : 'rgba(0,0,0,0.05)',
                                    color: i === 0 ? '#fff' : 'rgba(0,0,0,0.6)',
                                    animationDelay: `${i * 0.08}s`,
                                }}>{trait}</span>
                            ))}
                        </div>
                    </div>

                    {/* What your choices reveal */}
                    <div style={{
                        background: 'white', borderRadius: 14, padding: '28px 32px', marginBottom: 32,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 14 }}>YOUR CHOICES</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {ROUNDS.map((r, i) => {
                                const chosen = choices[i] === 'A' ? r.optionA : r.optionB;
                                return (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < ROUNDS.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                                        <div style={{ width: 48, height: 32, borderRadius: 6, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                                            <Image src={chosen.src} alt={chosen.label} fill style={{ objectFit: 'cover' }} sizes="48px" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 500, color: '#111' }}>{chosen.label}</div>
                                            <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)' }}>{r.dimension}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* CTA */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => { setStep(0); setChoices(Array(ROUNDS.length).fill(null)); setCompleted(false); }} style={{
                            padding: '14px 24px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: 'transparent', border: '1px solid rgba(0,0,0,0.12)', color: '#111',
                            cursor: 'pointer', fontFamily: f, flex: 1,
                        }}>Retake Quiz</button>
                        <Link href="/signup/homeowner" style={{
                            padding: '14px 24px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: '#111', border: 'none', color: '#fff', textDecoration: 'none',
                            fontFamily: f, flex: 2, textAlign: 'center',
                        }}>Continue to Sign Up →</Link>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer style={{ padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>© 2026 ROOF · TASTE PROFILE</span>
                <Link href="/landing" style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textDecoration: 'none' }}>Landing</Link>
            </footer>
        </div>
    );
}
