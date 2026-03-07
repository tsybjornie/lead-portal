'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DEMAND = [
    { id: 'homeowner', label: 'Homeowner', sub: 'HDB, condo, landed', href: '/signup/homeowner', img: '/images/roles/homeowner.png', featured: true },
    { id: 'business', label: 'Business Owner', sub: 'Retail, F&B, hotel, industrial', href: '/signup/homeowner', img: '/images/roles/business.png', featured: false },
    { id: 'investor', label: 'Property Investor', sub: 'Shophouses, flips & portfolios', href: '/signup/homeowner', img: '/images/roles/investor.png', featured: false },
    { id: 'developer', label: 'Property Developer', sub: 'New builds & conversions', href: '/signup/homeowner', img: '/images/roles/office.png', featured: false },
    { id: 'tenant', label: 'Tenant / Renter', sub: 'Rented homes & commercial fit-outs', href: '/signup/homeowner', img: '/images/roles/contractor.png', featured: false },
];

const SUPPLY = [
    { id: 'designer', label: 'Design Firm', sub: 'Interior designers & architects', href: '/signup', img: '/images/roles/design-firm.png', featured: true },
    { id: 'consultant', label: 'Consultant / QP', sub: 'Architects (PE), engineers, LEW, surveyors', href: '/signup/consultant', img: '/images/roles/consultant.png', featured: false },
    { id: 'contractor', label: 'Contractor', sub: 'Builders, tradesmen & site crew', href: '/signup/contractor', img: '/images/roles/contractor.png', featured: false },
    { id: 'specialist', label: 'Specialist', sub: 'Landscape, smart home, pest, cleaning, movers', href: '/signup/specialist', img: '/images/roles/specialist.png', featured: false },
    { id: 'brand', label: 'Brand / Distributor', sub: 'Materials, equipment & plant', href: '/signup/brand', img: '/images/roles/brand.png', featured: false },
];

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <div
            className="min-h-screen bg-[#fafafa] text-[#111]"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Roof",
                        "description": "Run your renovation without the chaos. Manage leads, quotes, projects, schedules, and payments.",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "url": "https://roof-builder.vercel.app",
                        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "SGD" },
                        "author": { "@type": "Organization", "name": "Roof", "areaServed": [{ "@type": "Country", "name": "Singapore" }, { "@type": "Country", "name": "Malaysia" }] }
                    })
                }}
            />

            {/* Top bar */}
            <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-12 py-5 bg-[#fafafa]/80 backdrop-blur-xl">
                <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#111]">Roof</span>
                <Link href="/login" className="text-[13px] font-medium text-[#111] px-5 py-2 rounded-lg border border-[#111]/10 hover:bg-[#111] hover:text-white transition-all duration-200">
                    Log in
                </Link>
            </header>

            {/* Hero */}
            <div className="pt-36 pb-20 px-8 md:px-20 max-w-[1100px] mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
                    transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
                >
                    <h1 className="text-[clamp(3rem,7vw,5.5rem)] font-extralight leading-[1.02] tracking-[-0.04em] text-[#111] mb-5">
                        Roof<span className="text-[#d4d4d4]">.</span>
                    </h1>
                    <p className="text-[17px] text-[#999] leading-relaxed max-w-[420px] mx-auto font-light">
                        The operating system for renovations.
                    </p>
                </motion.div>
            </div>

            {/* ═══ DEMAND SIDE — Bento Grid ═══ */}
            <section className="px-8 md:px-12 max-w-[1100px] mx-auto mb-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mounted ? 1 : 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <p className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#c0c0c0] mb-6 pl-1">
                        I need a renovation
                    </p>

                    {/* Bento: Homeowner takes 2 cols, others fill remaining */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ gridAutoRows: 'minmax(0, 1fr)' }}>
                        {DEMAND.map((role, i) => (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                                transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
                                className={role.featured ? 'col-span-2 row-span-2' : ''}
                            >
                                <Link
                                    href={role.href}
                                    className="group block h-full rounded-2xl overflow-hidden relative"
                                    style={{ minHeight: role.featured ? 380 : 180 }}
                                >
                                    {/* Image */}
                                    <Image
                                        src={role.img}
                                        alt={role.label}
                                        fill
                                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />
                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                                        <div className={`font-semibold text-white mb-0.5 ${role.featured ? 'text-[22px] md:text-[26px]' : 'text-[14px]'}`}>
                                            {role.label}
                                        </div>
                                        <div className={`text-white/60 font-light ${role.featured ? 'text-[14px]' : 'text-[11px]'}`}>
                                            {role.sub}
                                        </div>
                                        {role.featured && (
                                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/15 backdrop-blur-md text-white text-[12px] font-medium group-hover:bg-white/25 transition-all duration-300">
                                                Get started
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ═══ SUPPLY SIDE — Bento Grid ═══ */}
            <section className="px-8 md:px-12 max-w-[1100px] mx-auto mb-28">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mounted ? 1 : 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <p className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#c0c0c0] mb-6 pl-1">
                        I&apos;m a professional
                    </p>

                    {/* Bento: Design Firm takes 2 cols row 1, others fill */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ gridAutoRows: 'minmax(0, 1fr)' }}>
                        {SUPPLY.map((role, i) => (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                                transition={{ delay: 0.7 + i * 0.08, duration: 0.6 }}
                                className={role.featured ? 'col-span-2 row-span-2' : ''}
                            >
                                <Link
                                    href={role.href}
                                    className="group block h-full rounded-2xl overflow-hidden relative"
                                    style={{ minHeight: role.featured ? 380 : 180 }}
                                >
                                    {/* Image */}
                                    <Image
                                        src={role.img}
                                        alt={role.label}
                                        fill
                                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />
                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                                        <div className={`font-semibold text-white mb-0.5 ${role.featured ? 'text-[22px] md:text-[26px]' : 'text-[14px]'}`}>
                                            {role.label}
                                        </div>
                                        <div className={`text-white/60 font-light ${role.featured ? 'text-[14px]' : 'text-[11px]'}`}>
                                            {role.sub}
                                        </div>
                                        {role.featured && (
                                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/15 backdrop-blur-md text-white text-[12px] font-medium group-hover:bg-white/25 transition-all duration-300">
                                                Join as a firm
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Trust bar */}
            <div className="text-center pb-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mounted ? 1 : 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="flex items-center justify-center gap-8 text-[11px] text-[#ccc] font-medium"
                >
                    <span>🇸🇬 Singapore</span>
                    <span className="w-px h-3 bg-[#e5e5e5]" />
                    <span>🇲🇾 Malaysia</span>
                    <span className="w-px h-3 bg-[#e5e5e5]" />
                    <span>Escrow protected</span>
                    <span className="w-px h-3 bg-[#e5e5e5]" />
                    <span>Independently rated</span>
                </motion.div>
            </div>

            {/* Already on Roof */}
            <div className="text-center pb-8">
                <p className="text-[13px] text-[#bbb]">
                    Already on Roof?{' '}
                    <Link href="/login" className="text-[#111] font-medium hover:underline">Log in</Link>
                </p>
            </div>

            {/* Footer */}
            <footer className="border-t border-[#f0f0f0] px-8 md:px-12 py-6 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#ddd]">Singapore · Malaysia</span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#ddd]">{new Date().getFullYear()}</span>
            </footer>
        </div>
    );
}
