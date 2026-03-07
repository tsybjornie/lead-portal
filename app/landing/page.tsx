'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <div
            className="min-h-screen bg-[#fafafa] text-[#111] overflow-hidden relative"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
            {/* Top bar — simple, just the brand and login */}
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

            {/* Hero — centered, breathing room, friendly language */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 md:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
                    transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
                    className="text-center max-w-[560px]"
                >
                    {/* Big friendly title */}
                    <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-light leading-[1.05] tracking-[-0.03em] text-[#111] mb-6">
                        Run your renovation firm
                        <br />
                        <span className="text-[#bbb] italic">without the chaos.</span>
                    </h1>

                    <p className="text-[16px] text-[#888] leading-relaxed max-w-[400px] mx-auto mb-10">
                        Quotes, leads, schedules, payments — everything your design firm needs, in one place.
                    </p>

                    {/* Two clear paths */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
                        <Link
                            href="/signup"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#111] text-white text-[14px] font-semibold hover:bg-[#333] transition-all text-center"
                        >
                            Start free as a Designer
                        </Link>
                        <Link
                            href="/signup/homeowner"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-[#666] text-[14px] font-medium border border-[#e5e5e5] hover:border-[#111] hover:text-[#111] transition-all text-center"
                        >
                            I need a renovation
                        </Link>
                    </div>

                    {/* Already have an account? Super obvious */}
                    <p className="text-[13px] text-[#bbb]">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#111] font-medium hover:underline">
                            Log in here
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Subtle bottom section — what Roof does, no pricing */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
                className="max-w-[700px] mx-auto px-8 pb-24"
            >
                <div className="border-t border-[#e5e5e5] pt-12">
                    <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-[#ccc] mb-6">
                        Everything you need
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[
                            { icon: '📋', title: 'Lead Tracking', desc: 'Never lose a prospect' },
                            { icon: '🧮', title: 'Auto-Pricing', desc: 'Quotes in minutes, not days' },
                            { icon: '📊', title: 'Project P&L', desc: 'Know your margin instantly' },
                            { icon: '🔨', title: 'Trade Dispatch', desc: 'Deploy verified tradesmen' },
                            { icon: '📅', title: 'Scheduling', desc: 'Gantt timelines, auto-sorted' },
                            { icon: '💰', title: 'Payments', desc: 'Milestone billing & escrow' },
                        ].map((item, i) => (
                            <div key={i} className="py-3">
                                <div className="text-xl mb-2">{item.icon}</div>
                                <div className="text-[13px] font-semibold text-[#111] mb-1">{item.title}</div>
                                <div className="text-[12px] text-[#999]">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Minimal footer */}
            <footer className="border-t border-[#f0f0f0] px-8 md:px-12 py-6 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#ccc]">
                    Roof · Singapore & Malaysia
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#ccc]">
                    {new Date().getFullYear()}
                </span>
            </footer>
        </div>
    );
}
