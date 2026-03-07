import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/landing', '/login', '/signup', '/price-index'],
                disallow: [
                    '/api/',
                    '/client/',
                    '/quote/',
                    '/quote-builder',
                    '/ledger',
                    '/prospect',
                    '/hub',
                    '/projects',
                    '/follow-up',
                    '/pending-approval',
                ],
            },
            // Allow AI crawlers for discovery
            {
                userAgent: 'GPTBot',
                allow: ['/', '/landing', '/price-index'],
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
        sitemap: 'https://roof-builder.vercel.app/sitemap.xml',
    };
}
