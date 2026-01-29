'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StyleQuiz() {
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // All 11 styles
    const styles = {
        modern_minimalist: {
            id: 'modern_minimalist',
            name: 'Modern Minimalist',
            description: 'Clean lines, minimal decor, and functional design create a serene, uncluttered space.',
            characteristics: [
                'Clean lines and geometric shapes',
                'Neutral color palette',
                'Minimal decor and clutter-free',
                'Functional furniture',
                'Open, airy spaces'
            ]
        },
        scandinavian: {
            id: 'scandinavian',
            name: 'Scandinavian',
            description: 'Cozy, natural materials and "hygge" vibes create warmth and comfort.',
            characteristics: [
                'Natural wood tones',
                'Soft, neutral colors',
                'Cozy textiles and textures',
                'Functional yet beautiful',
                'Plants and natural elements'
            ]
        },
        industrial: {
            id: 'industrial',
            name: 'Industrial',
            description: 'Urban, raw materials and exposed elements create an authentic, edgy aesthetic.',
            characteristics: [
                'Exposed brick and concrete',
                'Metal fixtures and piping',
                'Raw, unfinished surfaces',
                'Open floor plans',
                'Edison bulbs and industrial lighting'
            ]
        },
        japandi: {
            id: 'japandi',
            name: 'Japandi',
            description: 'Japanese minimalism meets Scandinavian warmth for perfect balance.',
            characteristics: [
                'Minimalist aesthetic',
                'Natural materials',
                'Neutral, earthy tones',
                'Functional design',
                'Zen-like calm'
            ]
        },
        peranakan: {
            id: 'peranakan',
            name: 'Peranakan',
            description: 'Colorful heritage tiles, ornate carvings, and rich details celebrate Singapore\'s unique culture.',
            characteristics: [
                'Vibrant patterned tiles',
                'Ornate wood carvings',
                'Rich, jewel-tone colors',
                'Heritage craftsmanship',
                'Cultural storytelling'
            ]
        },
        contemporary: {
            id: 'contemporary',
            name: 'Contemporary',
            description: 'Bold, artistic, and current with statement pieces that inspire conversation.',
            characteristics: [
                'Bold color accents',
                'Artistic statement pieces',
                'Mixed textures',
                'Current trends',
                'Dynamic layouts'
            ]
        },
        mid_century: {
            id: 'mid_century',
            name: 'Mid-Century Modern',
            description: '1950s-60s retro charm with iconic furniture and optimistic design.',
            characteristics: [
                'Iconic furniture pieces',
                'Warm wood tones',
                'Retro color palette',
                'Clean, organic lines',
                'Functional elegance'
            ]
        },
        tropical_modern: {
            id: 'tropical_modern',
            name: 'Tropical Modern',
            description: 'Lush greenery and indoor-outdoor living perfect for Singapore\'s climate.',
            characteristics: [
                'Abundant plants and greenery',
                'Indoor-outdoor flow',
                'Natural ventilation',
                'Tropical materials',
                'Resort-like atmosphere'
            ]
        },
        coastal: {
            id: 'coastal',
            name: 'Coastal',
            description: 'Light, airy, and beach-inspired for a breezy, relaxed feel.',
            characteristics: [
                'Light, neutral palette',
                'Natural textures',
                'Blue and white accents',
                'Relaxed atmosphere',
                'Natural light'
            ]
        },
        wabi_sabi: {
            id: 'wabi_sabi',
            name: 'Wabi-Sabi',
            description: 'Natural imperfection and aged beauty create authentic, soulful spaces.',
            characteristics: [
                'Embraces imperfection',
                'Natural, aged materials',
                'Earthy color palette',
                'Handcrafted elements',
                'Organic textures'
            ]
        },
        transitional: {
            id: 'transitional',
            name: 'Transitional',
            description: 'Perfect blend of traditional elegance and contemporary comfort.',
            characteristics: [
                'Balanced design',
                'Classic meets modern',
                'Neutral sophistication',
                'Timeless appeal',
                'Versatile styling'
            ]
        }
    };

    // Quiz questions
    const questions = [
        {
            id: 1,
            question: 'When you open your front door after a long day, you want to feel...',
            options: [
                {
                    text: 'Instant calm - like taking a deep breath',
                    scores: ['scandinavian', 'japandi', 'modern_minimalist', 'coastal', 'wabi_sabi']
                },
                {
                    text: 'Creative energy - inspired to do something',
                    scores: ['contemporary', 'industrial', 'mid_century']
                },
                {
                    text: 'Connected to heritage and culture',
                    scores: ['peranakan', 'transitional']
                },
                {
                    text: 'Like you\'re in a lush, tropical retreat',
                    scores: ['tropical_modern', 'coastal']
                }
            ]
        },
        {
            id: 2,
            question: 'Imagine waking up on a Saturday morning. The light streaming through your windows is...',
            options: [
                {
                    text: 'Soft and warm, filtering through natural fabrics',
                    scores: ['scandinavian', 'coastal', 'tropical_modern']
                },
                {
                    text: 'Dramatic and architectural, casting bold shadows',
                    scores: ['industrial', 'modern_minimalist', 'contemporary']
                },
                {
                    text: 'Gentle and diffused, creating a peaceful glow',
                    scores: ['japandi', 'transitional', 'wabi_sabi']
                },
                {
                    text: 'Bright and optimistic, dancing through plants',
                    scores: ['mid_century', 'tropical_modern', 'coastal']
                },
                {
                    text: 'Playing off colorful tiles and ornate details',
                    scores: ['peranakan']
                }
            ]
        },
        {
            id: 3,
            question: 'It\'s Sunday morning. You\'re holding your coffee, looking around. What draws your eye?',
            options: [
                {
                    text: 'The way everything has its perfect place',
                    scores: ['modern_minimalist', 'japandi']
                },
                {
                    text: 'Layers of textures - natural, lived-in, imperfect',
                    scores: ['scandinavian', 'wabi_sabi', 'tropical_modern']
                },
                {
                    text: 'Something unexpected - bold art, a vintage treasure',
                    scores: ['contemporary', 'mid_century', 'peranakan']
                },
                {
                    text: 'The quality and craftsmanship of each piece',
                    scores: ['transitional', 'peranakan']
                },
                {
                    text: 'Exposed beams, raw surfaces, honest materials',
                    scores: ['industrial', 'wabi_sabi']
                },
                {
                    text: 'Green walls, plants everywhere, nature inside',
                    scores: ['tropical_modern']
                }
            ]
        },
        {
            id: 4,
            question: 'You\'re hosting people you love. The atmosphere you want to create is...',
            options: [
                {
                    text: 'Intimate and warm, like a Scandinavian cabin',
                    scores: ['scandinavian', 'coastal']
                },
                {
                    text: 'Effortlessly sophisticated, timeless',
                    scores: ['transitional', 'japandi']
                },
                {
                    text: 'Unexpected and conversational - "Where did you get that?"',
                    scores: ['contemporary', 'mid_century', 'peranakan']
                },
                {
                    text: 'Stripped-back and authentic, no pretense',
                    scores: ['industrial', 'modern_minimalist', 'wabi_sabi']
                },
                {
                    text: 'Tropical, breezy, feels like a resort',
                    scores: ['tropical_modern', 'coastal']
                }
            ]
        },
        {
            id: 5,
            question: 'Every home needs a corner that\'s just YOURS. You imagine yours with...',
            options: [
                {
                    text: 'Nothing but what you need - clean, clear, calm',
                    scores: ['modern_minimalist', 'japandi']
                },
                {
                    text: 'Books, soft light, a cozy chair, maybe a plant',
                    scores: ['scandinavian', 'coastal', 'transitional']
                },
                {
                    text: 'Something iconic - a statement piece you\'ve been dreaming about',
                    scores: ['mid_century', 'contemporary']
                },
                {
                    text: 'Collected heirlooms, colorful heritage pieces',
                    scores: ['peranakan', 'transitional']
                },
                {
                    text: 'Raw, industrial character - maybe brick or metal',
                    scores: ['industrial']
                },
                {
                    text: 'Surrounded by greenery, like a private garden',
                    scores: ['tropical_modern']
                },
                {
                    text: 'Imperfect beauty - aged wood, natural wear',
                    scores: ['wabi_sabi']
                }
            ]
        },
        {
            id: 6,
            question: 'You\'re relaxing on a Sunday afternoon. Looking up, what makes you smile?',
            options: [
                {
                    text: 'High ceilings, clean lines, uncluttered space',
                    scores: ['modern_minimalist', 'industrial']
                },
                {
                    text: 'Warm wood tones, natural textures everywhere',
                    scores: ['scandinavian', 'japandi', 'mid_century', 'wabi_sabi']
                },
                {
                    text: 'Intricate tilework, ornate carvings, rich colors',
                    scores: ['peranakan']
                },
                {
                    text: 'An eclectic gallery wall or bold statement piece',
                    scores: ['contemporary', 'mid_century']
                },
                {
                    text: 'Light, airy, feels like the beach is nearby',
                    scores: ['coastal', 'tropical_modern']
                },
                {
                    text: 'A balanced mix - not too modern, not too traditional',
                    scores: ['transitional']
                },
                {
                    text: 'Plants cascading from shelves, green everywhere',
                    scores: ['tropical_modern']
                }
            ]
        },
        {
            id: 7,
            question: 'The vacation homes that make you think "I could live here" are...',
            options: [
                {
                    text: 'Minimalist ryokans in Japan',
                    scores: ['japandi', 'modern_minimalist', 'wabi_sabi']
                },
                {
                    text: 'Industrial lofts in Brooklyn or Berlin',
                    scores: ['industrial']
                },
                {
                    text: 'Cozy cabins in Norway or Denmark',
                    scores: ['scandinavian']
                },
                {
                    text: 'Mid-century gems in Palm Springs',
                    scores: ['mid_century']
                },
                {
                    text: 'Heritage shophouses in Penang or Melaka',
                    scores: ['peranakan']
                },
                {
                    text: 'Bali villas with open-air living',
                    scores: ['tropical_modern', 'coastal']
                },
                {
                    text: 'Parisian apartments - classic but updated',
                    scores: ['transitional', 'contemporary']
                },
                {
                    text: 'Japanese countryside homes with wabi-sabi charm',
                    scores: ['wabi_sabi', 'japandi']
                }
            ]
        },
        {
            id: 8,
            question: 'When it comes to what fills your home, you believe...',
            options: [
                {
                    text: 'Every single thing should earn its place',
                    scores: ['modern_minimalist', 'japandi']
                },
                {
                    text: 'Comfort and function first, beauty in simplicity',
                    scores: ['scandinavian', 'coastal']
                },
                {
                    text: 'Quality pieces that last generations',
                    scores: ['transitional', 'peranakan']
                },
                {
                    text: 'Mix it all - vintage, new, found, curated',
                    scores: ['contemporary', 'industrial']
                },
                {
                    text: 'Iconic design pieces are worth the investment',
                    scores: ['mid_century', 'contemporary']
                },
                {
                    text: 'Nature should be the star - everything else supports',
                    scores: ['tropical_modern', 'wabi_sabi']
                },
                {
                    text: 'Imperfection tells a story',
                    scores: ['wabi_sabi']
                }
            ]
        },
        {
            id: 9,
            question: 'If your home had a soundtrack, it would make you feel...',
            options: [
                {
                    text: 'Centered. Present. At peace.',
                    scores: ['japandi', 'modern_minimalist', 'wabi_sabi']
                },
                {
                    text: 'Warm. Cozy. Safe. "Hygge."',
                    scores: ['scandinavian', 'coastal']
                },
                {
                    text: 'Rooted in heritage and culture',
                    scores: ['peranakan', 'transitional']
                },
                {
                    text: 'Inspired. Creative. Alive.',
                    scores: ['contemporary', 'mid_century']
                },
                {
                    text: 'Authentic. Real. Unpretentious.',
                    scores: ['industrial', 'wabi_sabi']
                },
                {
                    text: 'Relaxed. Breezy. Resort-like.',
                    scores: ['coastal', 'tropical_modern']
                }
            ]
        },
        {
            id: 10,
            question: 'In your ideal home, the first hour of your day looks like...',
            options: [
                {
                    text: 'Meditation or yoga in a clutter-free, zen space',
                    scores: ['modern_minimalist', 'japandi', 'wabi_sabi']
                },
                {
                    text: 'Coffee in a cozy nook with natural light and soft textures',
                    scores: ['scandinavian', 'coastal']
                },
                {
                    text: 'Enjoying tea surrounded by heritage and tradition',
                    scores: ['peranakan', 'transitional']
                },
                {
                    text: 'Making breakfast in a space that feels creative and alive',
                    scores: ['contemporary', 'mid_century']
                },
                {
                    text: 'Brewing coffee in your industrial-style kitchen, music on',
                    scores: ['industrial', 'mid_century']
                },
                {
                    text: 'Opening doors to let the breeze in, watering plants',
                    scores: ['tropical_modern', 'wabi_sabi']
                }
            ]
        }
    ];

    const handleAnswer = (optionIndex) => {
        const newAnswers = [...answers, optionIndex];
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const calculateResults = () => {
        const scores = {};

        // Initialize scores
        Object.keys(styles).forEach(styleId => {
            scores[styleId] = 0;
        });

        // Calculate scores
        answers.forEach((answerIndex, questionIndex) => {
            const question = questions[questionIndex];
            const selectedOption = question.options[answerIndex];
            selectedOption.scores.forEach(styleId => {
                scores[styleId] += 1;
            });
        });

        // Sort by score
        const sortedStyles = Object.entries(scores)
            .sort(([, a], [, b]) => b - a)
            .map(([styleId]) => styleId);

        return {
            topMatch: sortedStyles[0],
            runnerUp: sortedStyles[1],
            scores
        };
    };

    if (showResults) {
        const results = calculateResults();
        const topStyle = styles[results.topMatch];
        const runnerUpStyle = styles[results.runnerUp];

        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '3rem 0' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{
                        background: 'white',
                        padding: '3rem',
                        borderRadius: '0',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border)',
                        textAlign: 'center'
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            marginBottom: '1rem',
                            color: 'var(--primary-dark)'
                        }}>
                            Your Perfect Match
                        </h1>
                        <h2 style={{
                            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                            color: 'var(--accent)',
                            marginBottom: '2rem',
                            fontWeight: 500
                        }}>
                            {topStyle.name}
                        </h2>

                        <p style={{
                            fontSize: '1.15rem',
                            lineHeight: 1.8,
                            marginBottom: '2.5rem',
                            color: 'var(--text-light)'
                        }}>
                            {topStyle.description}
                        </p>

                        <div style={{
                            background: 'var(--bg-cream)',
                            padding: '2rem',
                            borderRadius: '0',
                            marginBottom: '2.5rem',
                            textAlign: 'left',
                            border: '1px solid var(--border)'
                        }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Key Characteristics:</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {topStyle.characteristics.map((char, i) => (
                                    <li key={i} style={{
                                        marginBottom: '0.75rem',
                                        paddingLeft: '1.5rem',
                                        position: 'relative'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: 'var(--accent)'
                                        }}>→</span>
                                        {char}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {runnerUpStyle && (
                            <div style={{
                                padding: '2rem',
                                background: 'var(--bg-light)',
                                borderRadius: '0',
                                marginBottom: '2.5rem',
                                border: '1px solid var(--border)'
                            }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>You Might Also Love:</h3>
                                <p style={{
                                    fontSize: '1.5rem',
                                    color: 'var(--accent)',
                                    fontFamily: 'Playfair Display, serif',
                                    fontStyle: 'italic',
                                    marginBottom: '0.5rem'
                                }}>
                                    {runnerUpStyle.name}
                                </p>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', margin: 0 }}>
                                    {runnerUpStyle.description}
                                </p>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link
                                href="/homeowner-enquiry"
                                className="btn btn-primary"
                                style={{ minWidth: '250px' }}
                            >
                                Proceed to Enquiry Form
                            </Link>
                            <button
                                onClick={() => {
                                    setQuizStarted(false);
                                    setCurrentQuestion(0);
                                    setAnswers([]);
                                    setShowResults(false);
                                }}
                                className="btn btn-secondary"
                                style={{ minWidth: '200px' }}
                            >
                                Retake Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Welcome cover screen
    if (!quizStarted) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, var(--bg-cream) 0%, var(--bg-light) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background texture */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url(\'data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grain" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="%23000" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
                    opacity: 0.5,
                    pointerEvents: 'none'
                }} />

                <div style={{
                    maxWidth: '700px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <h1 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        color: 'var(--primary-dark)',
                        marginBottom: '1. 5rem',
                        fontWeight: 400,
                        lineHeight: 1.2
                    }}>
                        Find Your Style
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                        color: 'var(--text-light)',
                        marginBottom: '1rem',
                        lineHeight: 1.7,
                        maxWidth: '600px',
                        margin: '0 auto 1rem'
                    }}>
                        Discover your perfect renovation aesthetic through 10 thoughtful questions.
                    </p>

                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--text-light)',
                        marginBottom: '3rem',
                        opacity: 0.8
                    }}>
                        Takes just 2 minutes
                    </p>

                    <button
                        onClick={() => setQuizStarted(true)}
                        style={{
                            padding: '1.25rem 3.5rem',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            background: 'var(--accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            fontFamily: 'inherit',
                            letterSpacing: '0.02em',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)';
                        }}
                    >
                        Start Now
                    </button>

                    <div style={{
                        marginTop: '3rem',
                        display: 'flex',
                        gap: '2.5rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        fontSize: '0.9rem',
                        color: 'var(--text-light)',
                        opacity: 0.7
                    }}>
                        <span>✓ 10 Questions</span>
                        <span>✓ Personalized Results</span>
                        <span>✓ 11 Unique Styles</span>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '3rem 0' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                {/* Progress Bar */}
                <div style={{
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    <p style={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--text-light)',
                        marginBottom: '1rem',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'
                    }}>
                        Question {currentQuestion + 1} of {questions.length}
                    </p>
                    <div style={{
                        height: '4px',
                        background: 'var(--bg-light)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        maxWidth: '400px',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            height: '100%',
                            background: 'var(--accent)',
                            width: `${progress}%`,
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </div>

                {/* Question Card */}
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '0',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border)',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                        marginBottom: '3rem',
                        textAlign: 'center',
                        color: 'var(--primary-dark)',
                        lineHeight: 1.4
                    }}>
                        {currentQ.question}
                    </h2>

                    <div style={{
                        display: 'grid',
                        gap: '1.5rem'
                    }}>
                        {currentQ.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                style={{
                                    padding: '1.5rem',
                                    border: '2px solid var(--border)',
                                    background: 'white',
                                    borderRadius: '0',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    textAlign: 'left',
                                    fontSize: '1.05rem',
                                    lineHeight: 1.6,
                                    fontFamily: 'inherit',
                                    color: 'var(--text)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--accent)';
                                    e.currentTarget.style.background = 'var(--bg-cream)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Back button for non-first questions */}
                {currentQuestion > 0 && (
                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={() => {
                                setCurrentQuestion(currentQuestion - 1);
                                setAnswers(answers.slice(0, -1));
                            }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-light)',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                textDecoration: 'underline',
                                fontFamily: 'inherit'
                            }}
                        >
                            ← Back to previous question
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
