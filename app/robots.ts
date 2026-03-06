import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/client/',
                    '/quote/',
                    '/quote-builder',
                    '/ledger',
                    '/prospect',
                    '/paddleduck',
                ],
            },
            // Explicitly allow AI crawlers
            {
                userAgent: 'GPTBot',
                allow: ['/', '/landing', '/why-roof', '/irs', '/join', '/forecast'],
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
        ],
        sitemap: 'https://roof.sg/sitemap.xml',
    };
}
