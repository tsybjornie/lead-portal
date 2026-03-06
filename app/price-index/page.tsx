import { Metadata } from 'next';
import PriceIndexPage from './PriceIndexPage';

export const metadata: Metadata = {
    title: 'Roof Price Index 2026 — Real Renovation Costs (Singapore & JB)',
    description: 'Actual renovation material and labor costs based on real project data. Compare Singapore vs Johor Bahru prices across 20+ categories. Updated monthly from Roof-managed projects.',
    keywords: [
        'renovation cost Singapore 2026', 'HDB renovation price', 'BTO renovation cost',
        'renovation cost JB', 'kos renovation Malaysia', 'tiling cost Singapore',
        'kitchen renovation price', 'bathroom renovation cost', 'carpentry price Singapore',
        'interior design cost comparison', 'renovation material price',
    ],
    openGraph: {
        title: 'Roof Price Index 2026 — Real Renovation Costs',
        description: 'The only renovation price index based on real transaction data. Singapore vs Johor Bahru.',
        type: 'article',
        locale: 'en_SG',
    },
};

export default function Page() {
    return <PriceIndexPage />;
}
