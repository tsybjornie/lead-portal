import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import { MarketProvider } from '../context/MarketContext';
import Footer from '../components/Footer';
import FacebookPixel from '../components/FacebookPixel';
import WhatsAppButton from '../components/WhatsAppButton';

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
    'renovation cost singapore',
    // High-Intent Factory Direct Keywords
    'marine plywood carpentry',
    'factory direct carpentry singapore',
    'custom carpentry singapore',
    'formaldehyde free cabinets',
    'BCA registered contractor',
    'hdb carpentry direct',
    'kitchen cabinet manufacturer singapore'
  ],
  openGraph: {
    title: 'roof | Premium Renovation & Interior Design Matching in Singapore',
    description: 'Stop browsing hundreds of firms. Get matched with 2-4 pre-qualified interior designers and renovation contractors tailored to your specific needs, style, and budget. Free service for Singapore homeowners.',
    type: 'website',
    locale: 'en_SG',
    siteName: 'roof',
  },
  alternates: {
    canonical: 'https://roofplatform.com',
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
  other: {
    'application-name': 'roof',
    'apple-mobile-web-app-title': 'roof',
  },
  verification: {
    google: 'KUjAZ6_cV-MwIgvLKc46_1T2jNx4stFYi-YH6i-cniQ',
  },
};



const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'roof',
  url: 'https://roofplatform.com',
  logo: 'https://roofplatform.com/logo.png',
  sameAs: [
    'https://www.instagram.com/roofplatform',
    'https://www.facebook.com/roofplatform'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+65-6123-4567',
    contactType: 'customer service',
    areaServed: ['SG', 'MY']
  }
};

export default function RootLayout({ children }) {
  // Schema for LocalBusiness (Singapore Factory Authority)
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://roofplatform.com',
    "name": "roof - Direct Carpentry & Renovation Matching",
    "description": "Singapore's premier matching platform for factory-direct carpentry and pre-qualified interior designers. Specializing in marine plywood fabrication and low-formaldehyde health standards.",
    "url": "https://roofplatform.com",
    "logo": "https://roofplatform.com/favicon.ico",
    "areaServed": "Singapore",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SG"
    },
    "knowsAbout": [
      "Custom Carpentry",
      "Interior Design",
      "Renovation",
      "Marine Plywood",
      "HDB Guidelines"
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>
        <MarketProvider>
          <Navigation />

          <main style={{ minHeight: '60vh' }}>
            {children}
          </main>

          <Footer />
          <FacebookPixel />
          <WhatsAppButton />
          <Analytics />
        </MarketProvider>
      </body>
    </html>
  );
}
