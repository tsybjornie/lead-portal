'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DEMAND = [
    { id: 'homeowner', label: 'Homeowner', sub: 'HDB, condo, landed', href: '/signup/homeowner', img: '/images/roles/homeowner.png' },
    { id: 'business', label: 'Business Owner', sub: 'Retail, F&B, hotel, industrial', href: '/signup/homeowner', img: '/images/roles/business.png' },
    { id: 'investor', label: 'Property Investor', sub: 'Shophouses, flips & portfolios', href: '/signup/homeowner', img: '/images/roles/investor.png' },
    { id: 'developer', label: 'Property Developer', sub: 'New builds & conversions', href: '/signup/homeowner', img: '/images/roles/office.png' },
];

const SUPPLY = [
    { id: 'designer', label: 'Design Firm', sub: 'Interior designers & architects', href: '/signup', img: '/images/roles/design-firm.png' },
    { id: 'contractor', label: 'Contractor', sub: 'Builders & tradesmen', href: '/signup/contractor', img: '/images/roles/contractor.png' },
    { id: 'worker', label: 'Worker', sub: 'Site crew & skilled trades', href: '/signup/worker', img: '/images/roles/worker.png' },
    { id: 'brand', label: 'Brand Owner / Distributor', sub: 'Materials, equipment & plant', href: '/signup/brand', img: '/images/roles/brand.png' },
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
            <div className="pt-32 pb-16 px-8 md:px-20 max-w-[900px] mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
                    transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
                >
                    <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.05] tracking-[-0.03em] text-[#111] mb-4">
                        Roof<span className="text-[#ccc]">.</span>
                    </h1>
                    <p className="text-[16px] text-[#888] leading-relaxed max-w-[380px] mx-auto">
                        Run your renovation without the chaos.
                    </p>
                </motion.div>
            </div>

            {/* ═══ DEMAND SIDE ═══ */}
            <section className="px-8 md:px-20 max-w-[900px] mx-auto mb-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mounted ? 1 : 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <p className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#bbb] mb-5">
                        I need a renovation
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {DEMAND.map((role, i) => (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 15 }}
                                transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                            >
                                <Link
                                    href={role.href}
                                    className="block h-full rounded-xl bg-white border border-[#f0f0f0] hover:border-[#111] overflow-hidden transition-all duration-200 group"
                                >
                                    <div className="relative h-32 overflow-hidden">
                                        <Image
                                            src={role.img}
                                            alt={role.label}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4 min-h-[72px]">
                                        <div className="text-[13px] font-semibold text-[#111]">{role.label}</div>
                                        <div className="text-[11px] text-[#bbb] mt-0.5">{role.sub}</div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ═══ SUPPLY SIDE ═══ */}
            <section className="px-8 md:px-20 max-w-[900px] mx-auto mb-24">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mounted ? 1 : 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <p className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#bbb] mb-5">
                        I&apos;m a professional
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {SUPPLY.map((role, i) => (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 15 }}
                                transition={{ delay: 0.7 + i * 0.08, duration: 0.5 }}
                            >
                                <Link
                                    href={role.href}
                                    className="block h-full rounded-xl bg-white border border-[#f0f0f0] hover:border-[#111] overflow-hidden transition-all duration-200 group"
                                >
                                    <div className="relative h-32 overflow-hidden">
                                        <Image
                                            src={role.img}
                                            alt={role.label}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4 min-h-[72px]">
                                        <div className="text-[13px] font-semibold text-[#111]">{role.label}</div>
                                        <div className="text-[11px] text-[#bbb] mt-0.5">{role.sub}</div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Already have an account */}
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
