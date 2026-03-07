import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://roof-builder.vercel.app';
    const now = new Date().toISOString();

    const publicPages = [
        { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
        { path: '/landing', priority: 1.0, changeFrequency: 'weekly' as const },
        { path: '/login', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/signup', priority: 0.8, changeFrequency: 'monthly' as const },
        { path: '/signup/homeowner', priority: 0.9, changeFrequency: 'monthly' as const },
        { path: '/signup/contractor', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/signup/brand', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/price-index', priority: 0.9, changeFrequency: 'weekly' as const },
    ];

    return publicPages.map(page => ({
        url: `${baseUrl}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    }));
}
