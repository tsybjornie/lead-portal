'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DEMAND = [
    { id: 'homeowner', label: 'Homeowner', sub: 'HDB, condo, landed', href: '/signup/homeowner/taste', img: '/images/roles/homeowner.png', featured: true },
    { id: 'business', label: 'Business Owner', sub: 'Retail, F&B, hotel, industrial', href: '/signup/homeowner', img: '/images/roles/business.png', featured: false },
    { id: 'investor', label: 'Property Investor', sub: 'Shophouses, flips & portfolios', href: '/signup/homeowner', img: '/images/roles/investor.png', featured: false },
    { id: 'developer', label: 'Property Developer', sub: 'New builds & conversions', href: '/signup/homeowner', img: '/images/roles/office.png', featured: false },
    { id: 'tenant', label: 'Tenant / Renter', sub: 'Rented homes & commercial fit-outs', href: '/signup/homeowner', img: '/images/roles/contractor.png', featured: false },
];

const SUPPLY = [
    { id: 'designer', label: 'Design Firm', sub: 'Interior designers & architects', href: '/signup', img: '/images/roles/design-firm.png', featured: true },
    { id: 'consultant', label: 'Consultant / QP', sub: 'Architects (PE), engineers, LEW, surveyors', href: '/signup/consultant', img: '/images/roles/consultant.png', featured: false },
    { id: 'drafter', label: 'Drafter / 3D Artist', sub: 'SketchUp, AutoCAD, renders & shop drawings', href: '/signup/drafter', img: '/images/roles/consultant.png', featured: false },
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
            <footer className="border-t border-[#f0f0f0] px-8 md:px-12 py-10">
                <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#ccc] mb-3">Homeowners</div>
                        <div className="flex flex-col gap-2">
                            <Link href="/signup/homeowner/taste" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Take Taste Quiz</Link>
                            <Link href="/signup/homeowner" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Sign Up</Link>
                            <Link href="/client/login" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Client Login</Link>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#ccc] mb-3">Professionals</div>
                        <div className="flex flex-col gap-2">
                            <Link href="/signup" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Design Firms</Link>
                            <Link href="/signup/contractor" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Contractors</Link>
                            <Link href="/signup/drafter" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Drafters</Link>
                            <Link href="/signup/specialist" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Specialists</Link>
                            <Link href="/signup/brand" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Brands</Link>
                            <Link href="/signup/vendor" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Vendors</Link>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#ccc] mb-3">Platform</div>
                        <div className="flex flex-col gap-2">
                            <Link href="/why-roof" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Why Roof</Link>
                            <Link href="/price-index" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Price Index</Link>
                            <Link href="/founding" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Founding 20</Link>
                            <Link href="/hub" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Product Hub</Link>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#ccc] mb-3">Admin</div>
                        <div className="flex flex-col gap-2">
                            <Link href="/login" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Firm Login</Link>
                            <Link href="/admin" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Dashboard</Link>
                            <Link href="/admin/matches" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Match Briefs</Link>
                            <Link href="/admin/ratings" className="text-[12px] text-[#999] hover:text-[#111] transition-colors">Ratings</Link>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-6">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#ddd]">© {new Date().getFullYear()} Roof · Singapore · Malaysia</span>
                    <span className="text-[10px] tracking-[0.1em] font-medium text-[#ddd]">The operating system for renovations</span>
                </div>
            </footer>
        </div>
    );
}
