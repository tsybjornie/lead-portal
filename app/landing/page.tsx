'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ROLES = [
    { id: 'designer', label: 'Design Firm', sub: 'Interior designers & architects', href: '/signup', icon: '✏️' },
    { id: 'homeowner', label: 'Homeowner', sub: 'Looking for a renovation', href: '/signup/homeowner', icon: '🏠' },
    { id: 'contractor', label: 'Contractor', sub: 'Builders, workers & foremen', href: '/signup/contractor', icon: '🔨' },
    { id: 'brand', label: 'Brand / Supplier', sub: 'Material brands & vendors', href: '/signup/brand', icon: '🏷️' },
];

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <div
            className="min-h-screen bg-[#fafafa] text-[#111] overflow-hidden"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
            {/* Top bar */}
            <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-12 py-5 bg-[#fafafa]/80 backdrop-blur-xl">
                <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#111]">
                    Roof
                </span>
                <Link
                    href="/login"
                    className="text-[13px] font-medium text-[#111] px-5 py-2 rounded-lg border border-[#111]/10 hover:bg-[#111] hover:text-white transition-all duration-200"
                >
                    Log in
                </Link>
            </header>

            {/* Hero — full viewport, just the essentials */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 md:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
                    transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
                    className="text-center w-full max-w-[620px]"
                >
                    <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-light leading-[1.05] tracking-[-0.03em] text-[#111] mb-4">
                        Roof<span className="text-[#ccc]">.</span>
                    </h1>

                    <p className="text-[16px] text-[#888] leading-relaxed max-w-[380px] mx-auto mb-12">
                        Run your renovation without the chaos.
                    </p>

                    {/* Role selector — clean grid, all roles */}
                    <div className="grid grid-cols-2 gap-3 max-w-[440px] mx-auto mb-8">
                        {ROLES.map((role, i) => (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                            >
                                <Link
                                    href={role.href}
                                    className="block p-5 rounded-xl bg-white border border-[#f0f0f0] hover:border-[#111] hover:shadow-sm transition-all duration-200 text-left group"
                                >
                                    <div className="text-lg mb-2">{role.icon}</div>
                                    <div className="text-[13px] font-semibold text-[#111] group-hover:text-[#111]">
                                        {role.label}
                                    </div>
                                    <div className="text-[11px] text-[#bbb] mt-0.5">
                                        {role.sub}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Already have an account */}
                    <p className="text-[13px] text-[#bbb]">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#111] font-medium hover:underline">
                            Log in
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Minimal footer */}
            <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-8 md:px-12 py-6">
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#ddd]">
                    Singapore · Malaysia
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#ddd]">
                    {new Date().getFullYear()}
                </span>
            </footer>
        </div>
    );
}
