import './globals.css';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import { MarketProvider } from '../context/MarketContext';
import Footer from '../components/Footer';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'roof Singapore | Find Your Perfect Interior Designer & Renovation Contractor',
  description: 'Premium interior design and renovation matching service in Singapore. Get connected with 2-4 pre-qualified professionals based on your style, budget, and project needs. Free for homeowners. Serving HDB, condo, and commercial renovations.',
  keywords: [
    'renovation singapore',
    'interior design singapore',
    'hdb renovation',
    'condo renovation singapore',
    'renovation contractor singapore',
    'interior designer singapore',
    'home renovation singapore',
    'commercial renovation singapore',
    'renovation companies singapore',
    'home interior design',
    'renovation quote singapore',
    'bto renovation',
    'resale flat renovation',
    'renovation cost singapore'
  ],
  openGraph: {
    title: 'roof | Premium Renovation & Interior Design Matching in Singapore',
    description: 'Stop browsing hundreds of firms. Get matched with 2-4 pre-qualified interior designers and renovation contractors tailored to your specific needs, style, and budget. Free service for Singapore homeowners.',
    type: 'website',
    locale: 'en_SG',
    siteName: 'roof',
  },
  alternates: {
    canonical: 'https://renobuilders.sg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <MarketProvider>
          <Navigation />

          <main style={{ minHeight: '60vh' }}>
            {children}
          </main>

          <Footer />
        </MarketProvider>
        <Analytics />
      </body>
    </html>
  );
}
