/**
 * JSON-LD Structured Data for AEO/GEO
 * Embeds schema.org data that AI engines (ChatGPT, Perplexity, Google AI Overview) can parse.
 * Use: import and include <StructuredData /> in any page's JSX.
 */

type Props = {
    type: 'organization' | 'service' | 'faq' | 'product';
    data?: Record<string, unknown>;
};

export function OrganizationSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Roof',
        url: 'https://roof.sg',
        logo: 'https://roof.sg/logo.png',
        description: 'The operating system for renovations. Free tools for interior designers with quotation builder, project management, worker dispatch, and escrow protection.',
        foundingDate: '2025',
        areaServed: [
            { '@type': 'Country', name: 'Singapore' },
            { '@type': 'State', name: 'Johor', containedInPlace: { '@type': 'Country', name: 'Malaysia' } },
        ],
        sameAs: [
            'https://roof.my',
        ],
        knowsAbout: [
            'Interior Design', 'Renovation', 'HDB Renovation', 'BTO Renovation',
            'Construction Management', 'Trade Finance', 'Escrow', 'Contractor Management',
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function ServiceSchema({ market }: { market: 'sg' | 'my' }) {
    const isSG = market === 'sg';
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: isSG ? 'Roof Renovation Platform — Singapore' : 'Roof Renovation Platform — Malaysia',
        provider: {
            '@type': 'Organization',
            name: 'Roof',
        },
        serviceType: 'Renovation Project Management',
        areaServed: isSG
            ? { '@type': 'Country', name: 'Singapore' }
            : { '@type': 'State', name: 'Johor', containedInPlace: { '@type': 'Country', name: 'Malaysia' } },
        description: isSG
            ? 'Free renovation tools for Singapore interior designers. Covers HDB, BTO, condo, and landed renovations with real-time pricing from 113 materials at SG market rates.'
            : 'Free renovation tools for Malaysian interior designers. Covers landed, condo, and apartment renovations in Johor Bahru with accurate local pricing.',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: isSG ? 'SGD' : 'MYR',
            description: 'Free platform access. Commission only on platform-sourced leads.',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function PriceIndexSchema({ material, priceSG, priceMY, unit }: { material: string; priceSG: number; priceMY: number; unit: string }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${material} — Renovation Material`,
        description: `Current market price for ${material} in Singapore and Malaysia renovation projects.`,
        offers: [
            {
                '@type': 'Offer',
                price: priceSG,
                priceCurrency: 'SGD',
                description: `Singapore market rate per ${unit}`,
                areaServed: { '@type': 'Country', name: 'Singapore' },
            },
            {
                '@type': 'Offer',
                price: priceMY,
                priceCurrency: 'MYR',
                description: `Malaysia (JB) market rate per ${unit}`,
                areaServed: { '@type': 'State', name: 'Johor' },
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
