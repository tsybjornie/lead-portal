import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://roof.sg';
    const now = new Date().toISOString();

    // Public pages that crawlers should index
    const publicPages = [
        { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
        { path: '/landing', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/join', priority: 0.9, changeFrequency: 'monthly' as const },
        { path: '/price-index', priority: 0.9, changeFrequency: 'monthly' as const },
        { path: '/founding', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/why-roof', priority: 0.8, changeFrequency: 'monthly' as const },
        { path: '/irs', priority: 0.7, changeFrequency: 'weekly' as const },
        { path: '/forecast', priority: 0.6, changeFrequency: 'monthly' as const },
        { path: '/signup/homeowner', priority: 0.8, changeFrequency: 'monthly' as const },
        { path: '/signup', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/signup/contractor', priority: 0.6, changeFrequency: 'monthly' as const },
        { path: '/signup/worker', priority: 0.6, changeFrequency: 'monthly' as const },
        { path: '/signup/brand', priority: 0.6, changeFrequency: 'monthly' as const },
    ];

    return publicPages.map(page => ({
        url: `${baseUrl}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    }));
}
