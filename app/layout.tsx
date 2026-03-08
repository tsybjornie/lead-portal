import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { RoofAuthProvider } from "@/context/RoofAuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { MaterialProvider } from "@/context/MaterialContext";
import { RoleProvider } from "@/components/RoleContext";
import AppShell from "@/components/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Roof — The Operating System for Renovations",
    template: "%s | Roof",
  },
  description: "Free renovation tools for interior designers. Quotation builder, project management, worker dispatch, and client matching — all in one platform. Serving Singapore and Johor Bahru, Malaysia.",
  keywords: ["renovation", "interior design", "Singapore", "Johor Bahru", "HDB renovation", "BTO renovation", "quotation tool", "project management", "escrow", "renovation cost", "kos renovation", "kontraktor ubah suai rumah", "interior design JB"],
  authors: [{ name: "Roof" }],
  creator: "Roof",
  publisher: "Roof",
  metadataBase: new URL("https://roof.sg"),
  alternates: {
    canonical: "/",
    languages: {
      "en-SG": "https://roof.sg",
      "en-MY": "https://roof.my",
      "ms-MY": "https://roof.my",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_SG",
    siteName: "Roof",
    title: "Roof — The Operating System for Renovations",
    description: "Free renovation tools for interior designers. Quotation builder, project management, worker dispatch, and client matching.",
    url: "https://roof.sg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roof — The Operating System for Renovations",
    description: "Free renovation tools for interior designers. Singapore & Johor Bahru.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-white text-gray-900`}
      >
        <RoofAuthProvider>
          <SubscriptionProvider>
            <MaterialProvider>
              <DataProvider>
                <RoleProvider>
                  <AppShell>
                    {children}
                  </AppShell>
                </RoleProvider>
              </DataProvider>
            </MaterialProvider>
          </SubscriptionProvider>
        </RoofAuthProvider>
      </body>
    </html>
  );
}
