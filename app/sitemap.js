export default function sitemap() {
    const baseUrl = 'https://roofplatform.com';

    // Hardcoded list of guides from guides/page.js
    const guides = [
        'design-vs-build',
        'hdb-renovation-rules',
        'condo-mcst-approvals',
        'buying-property-jb-guide',
        'jb-renovation-permits',
        'renovation-budget-guide-2025',
        'tiling-flooring-guide',
        'electrical-planning-guide',
        'carpentry-guide',
        'wet-works-guide',
        'defects-inspection-checklist',
        'contract-red-flags',
        'kitchen-countertop-guide',
        'licensed-contractor-required'
    ];

    const guideUrls = guides.map((slug) => ({
        url: `${baseUrl}/guides/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/assessment`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/guides`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/hard-truths`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        ...guideUrls,
    ];
}
