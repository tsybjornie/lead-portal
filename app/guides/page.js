'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useMarket } from '../../context/MarketContext';

export default function GuidesPage() {
    const { market } = useMarket();

    const guides = [
        // Original Guides
        {
            title: 'Design vs Build',
            description: 'Design-Build vs Contractors: Which is right for you?',
            slug: 'design-vs-build',
            category: 'Planning',
            color: '#FFF8E1', // Warm Beige
            textColor: '#5D4037', // Dark Brown
            image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop', // Blueprint/Architecture focus
            markets: ['SG', 'JB']
        },
        {
            title: 'HDB Rules',
            description: 'Can you hack that wall? HDB permits explained simply.',
            slug: 'hdb-renovation-rules',
            category: 'Regulatory',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop', // Singapore style high-rise apartment living room
            markets: ['SG']
        },
        {
            title: 'Condo Guide',
            description: 'MCST rules, deposits, and moving-in hacks.',
            slug: 'condo-mcst-approvals',
            category: 'Regulatory',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop', // Modern Condo Interior
            markets: ['SG']
        },

        // JB Specific Guides
        {
            title: 'Buying in JB',
            description: 'Singaporean Guide to buying property in Johor Bahru.',
            slug: 'buying-property-jb-guide',
            category: 'Planning',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop', // High rise scenic
            markets: ['JB']
        },
        {
            title: 'Johor Permits',
            description: 'Majlis Bandaraya approvals for renovation works.',
            slug: 'jb-renovation-permits',
            category: 'Regulatory',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop', // Official building
            markets: ['JB']
        },

        // Expanded Content (Shared)
        {
            title: 'Budget 2025',
            description: 'How much does a renovation actually cost today?',
            slug: 'renovation-budget-guide-2025',
            category: 'Planning',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1554224155-9ffd4cea9585?q=80&w=800&auto=format&fit=crop', // Object focus: Calculator/Pen
            markets: ['SG', 'JB']
        },
        {
            title: 'Tiling 101',
            description: 'Vinyl vs Tiles: The ultimate durability showdown.',
            slug: 'tiling-flooring-guide',
            category: 'Technical',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop', // Object focus: White marble texture
            markets: ['SG', 'JB']
        },
        {
            title: 'Lighting',
            description: 'Warm vs Cool white? Planning your home ambiance.',
            slug: 'electrical-planning-guide',
            category: 'Technical',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', // Object focus: Light bulb filament/details
            markets: ['SG', 'JB']
        },
        {
            title: 'Carpentry',
            description: 'Laminates & Wood: Building the perfect wardrobe.',
            slug: 'carpentry-guide',
            category: 'Materials',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop', // Object focus: Wood grain/texture
            markets: ['SG', 'JB']
        },
        {
            title: 'Wet Works',
            description: 'Waterproofing & Plumbing: Avoiding leaks 101.',
            slug: 'wet-works-guide',
            category: 'Technical',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop', // Object focus: Bathroom tiles/faucet
            markets: ['SG', 'JB']
        },
        {
            title: 'Defects Check',
            description: 'Don\'t pay yet! Inspect these 5 spots first.',
            slug: 'defects-inspection-checklist',
            category: 'Handover',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=800&auto=format&fit=crop', // Object focus: Inspection checklist/Macro
            markets: ['SG', 'JB']
        },
        {
            title: 'Red Flags',
            description: 'Is your contractor scamming you? Signs to watch.',
            slug: 'contract-red-flags',
            category: 'Planning',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800&auto=format&fit=crop', // Object focus: Signing document/pen
            markets: ['SG', 'JB']
        },
        {
            title: 'Countertops',
            description: 'Quartz or Sintered Stone? The kitchen benchtop guide.',
            slug: 'kitchen-countertop-guide',
            category: 'Materials',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop', // Object focus: Stone texture
            markets: ['SG', 'JB']
        },
        {
            title: 'Licenses',
            description: 'Do they actually have a BCA license? How to check.',
            slug: 'licensed-contractor-required',
            category: 'Regulatory',
            color: '#FFF8E1',
            textColor: '#5D4037',
            image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop', // Construction safety hat/site
            markets: ['SG'] // SG Only (BCA)
        }
    ];

    const displayedGuides = guides.filter(guide => guide.markets.includes(market));

    // SEO Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${market === 'SG' ? 'Singapore' : 'Johor Bahru'} Renovation Guides Library`,
        description: `Comprehensive guides on ${market === 'SG' ? 'HDB rules' : 'Johor permits'}, renovation costs, and technical requirements.`,
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: displayedGuides.map((guide, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://renobuilders.sg/guides/${guide.slug}`,
                name: guide.title,
                description: guide.description,
                image: guide.image
            }))
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: 'Playfair Display, serif' }}>
            <Script
                id="guides-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Header Section */}
            <div style={{
                padding: '4rem 1rem 3rem',
                textAlign: 'center',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'inline-block',
                    background: '#E0F2F1',
                    color: '#00695C',
                    padding: '0.5rem 1rem',
                    borderRadius: '2px', // Sharper
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '1.5rem',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}>
                    {market === 'SG' ? '🇸🇬 SINGAPORE KNOWLEDGE BASE' : '🇲🇾 JOHOR BAHRU KNOWLEDGE BASE'}
                </div>
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    color: '#263238',
                    letterSpacing: '-0.02em',
                    fontStyle: 'italic'
                }}>
                    Renovation made <span style={{ color: '#009688', fontStyle: 'normal' }}>simple.</span>
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: '#546E7A',
                    lineHeight: 1.6,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}>
                    {market === 'SG'
                        ? 'No jargon, just easy guides to help you build your dream home in Singapore.'
                        : 'Navigate the cross-border renovation journey with confidence.'}
                </p>
            </div>

            {/* Editorial Grid */}
            <div className="container" style={{
                maxWidth: '1200px',
                padding: '0 1.5rem 6rem',
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem',
                }}>
                    {displayedGuides.map((guide, index) => (
                        <Link
                            key={index}
                            href={`/guides/${guide.slug}`}
                            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                        >
                            <div
                                style={{
                                    background: guide.color,
                                    borderRadius: '8px', // Standard/Minimal
                                    padding: '0', // Full bleed top
                                    height: '100%',
                                    minHeight: '380px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = `0 12px 24px -8px rgba(93, 64, 55, 0.15)`; // Brownish shadow
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Main Image (Squared Top) */}
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '4/3',
                                    background: 'white',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: `url(${guide.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}></div>

                                    {/* Category Tag on Image */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        left: '1rem',
                                        background: 'rgba(255,255,255,0.9)',
                                        color: guide.textColor,
                                        padding: '4px 10px',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                                    }}>
                                        {guide.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: guide.textColor, // Dark Brown
                                        marginBottom: '0.75rem',
                                        lineHeight: 1.2,
                                        letterSpacing: '-0.01em'
                                    }}>
                                        {guide.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.95rem',
                                        color: '#795548', // Lighter Brown
                                        lineHeight: 1.6,
                                        fontWeight: '500',
                                        marginBottom: 0,
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                                    }}>
                                        {guide.description}
                                    </p>

                                    {/* Read More Link (Decoration) */}
                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: '1rem',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        color: guide.textColor,
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        Read Guide <span>&rarr;</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div style={{
                    textAlign: 'center',
                    marginTop: '4rem',
                    paddingTop: '3rem',
                }}>
                    <a href="/assessment" style={{
                        display: 'inline-block',
                        background: '#5D4037', // Dark Brown
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '2px', // Sharp
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(93, 64, 55, 0.2)',
                        transition: 'transform 0.2s ease',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Get Matched for Free ({market === 'SG' ? 'Singapore' : 'Johor'})
                    </a>
                </div>
            </div>
        </div>
    );
}
