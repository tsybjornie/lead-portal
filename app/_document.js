import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* SEO Meta Tags */}
                    <meta charSet="UTF-8" />
                    <meta name="description" content="Connect with Singapore's top interior designers and renovation contractors. Get matched with 2-4 pre-qualified professionals based on your style, budget, and project needs. Free service for homeowners." />
                    <meta name="keywords" content="Singapore renovation, interior design Singapore, HDB renovation, condo renovation, renovation contractors Singapore, interior designer Singapore, home renovation, renovation company" />
                    <meta name="author" content="RenoBuilders" />

                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="RenoBuilders - Find Your Perfect Interior Designer in Singapore" />
                    <meta property="og:description" content="Get matched with 2-4 pre-qualified interior designers and contractors based on your renovation needs. Free for homeowners." />
                    <meta property="og:site_name" content="RenoBuilders" />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="RenoBuilders - Find Your Perfect Interior Designer in Singapore" />
                    <meta name="twitter:description" content="Get matched with 2-4 pre-qualified interior designers and contractors based on your renovation needs." />

                    {/* Structured Data for SEO */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Service",
                                "name": "RenoBuilders",
                                "description": "Interior design and renovation matching service in Singapore",
                                "provider": {
                                    "@type": "Organization",
                                    "name": "RenoBuilders",
                                    "address": {
                                        "@type": "PostalAddress",
                                        "addressCountry": "SG"
                                    }
                                },
                                "areaServed": {
                                    "@type": "Country",
                                    "name": "Singapore"
                                },
                                "serviceType": ["Interior Design", "Home Renovation", "Contractor Matching"],
                                "offers": {
                                    "@type": "Offer",
                                    "price": "0",
                                    "priceCurrency": "SGD",
                                    "description": "Free matching service for homeowners"
                                }
                            })
                        }}
                    />

                    {/* Fonts */}
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
