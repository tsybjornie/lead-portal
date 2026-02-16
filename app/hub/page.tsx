"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
    id: string;
    name: string;
    tagline: string;
    index: string;
    href: string;
    external?: boolean;
}

const products: Product[] = [
    {
        id: "followup",
        name: "FollowUp",
        tagline: "Lead CRM",
        index: "01",
        href: "http://localhost:5500/follow%20up%20-%20lead%20reponse/dashboard.html",
        external: true,
    },
    {
        id: "numbers",
        name: "Numbers",
        tagline: "Quoting Engine",
        index: "02",
        href: "/",
        external: false,
    },
    {
        id: "sequence",
        name: "Sequence",
        tagline: "Workflow Automation",
        index: "03",
        href: "http://localhost:5500/sequence/index.html",
        external: true,
    },
    {
        id: "paddleduck",
        name: "PaddleDuck",
        tagline: "Project Management",
        index: "04",
        href: "http://localhost:3001",
        external: true,
    },
    {
        id: "measure",
        name: "Measure",
        tagline: "Site Measurement",
        index: "05",
        href: "/measure",
        external: false,
    },
    {
        id: "inspect",
        name: "Inspect",
        tagline: "Quality Control",
        index: "06",
        href: "/inspect",
        external: false,
    },
    {
        id: "ledger",
        name: "Ledger",
        tagline: "Project Finance",
        index: "07",
        href: "/ledger",
        external: false,
    },
    {
        id: "reveal",
        name: "Reveal",
        tagline: "Portfolio Generator",
        index: "08",
        href: "/reveal",
        external: false,
    },
];

export default function HubPage() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    return (
        <div
            className="min-h-screen bg-[#fafafa] text-[#111] overflow-hidden relative select-none"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
            onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
        >
            {/* Floating cursor label */}
            <AnimatePresence>
                {hoveredId && (
                    <motion.div
                        className="fixed z-50 pointer-events-none px-5 py-2 bg-[#111] text-white text-[11px] font-medium tracking-[0.2em] uppercase rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: cursorPos.x + 20,
                            y: cursorPos.y - 20,
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring" as const, stiffness: 500, damping: 30 }}
                    >
                        Open →
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top bar */}
            <motion.header
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-10 py-8"
            >
                <div className="text-[11px] tracking-[0.3em] uppercase font-medium text-[#999]">
                    Ordinance Systems
                </div>
                <div className="text-[11px] tracking-[0.3em] uppercase font-medium text-[#999]">
                    Command Center
                </div>
            </motion.header>

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex flex-col justify-center px-10 md:px-20 lg:px-32 py-32">
                {/* Hero text */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
                    className="mb-24"
                >
                    <h1
                        className="text-[clamp(3rem,8vw,8rem)] font-extralight leading-[0.9] tracking-[-0.04em] text-[#111]"
                    >
                        Every
                        <br />
                        <span className="italic font-light text-[#bbb]">tool.</span>
                        <br />
                        One place.
                    </h1>
                </motion.div>

                {/* Product list — editorial style */}
                <div className="w-full">
                    {products.map((product, i) => {
                        const isHovered = hoveredId === product.id;

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.4 + i * 0.08,
                                    ease: [0.25, 0.1, 0, 1],
                                }}
                            >
                                <a
                                    href={product.href}
                                    target={product.external ? "_blank" : undefined}
                                    rel={product.external ? "noopener noreferrer" : undefined}
                                    className="block group"
                                    onMouseEnter={() => setHoveredId(product.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    <div
                                        className="flex items-baseline justify-between py-5 md:py-6 border-t transition-all duration-500"
                                        style={{
                                            borderColor: isHovered ? "#111" : "#e5e5e5",
                                        }}
                                    >
                                        {/* Index */}
                                        <div
                                            className="text-[11px] tracking-[0.2em] font-medium transition-colors duration-500 w-12"
                                            style={{ color: isHovered ? "#111" : "#ccc" }}
                                        >
                                            {product.index}
                                        </div>

                                        {/* Name */}
                                        <div className="flex-1">
                                            <motion.span
                                                className="text-[clamp(1.5rem,3.5vw,3.5rem)] font-extralight tracking-[-0.03em] transition-colors duration-500 inline-block"
                                                style={{ color: isHovered ? "#111" : "#888" }}
                                                animate={{
                                                    x: isHovered ? 16 : 0,
                                                }}
                                                transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                                            >
                                                {product.name}
                                            </motion.span>
                                        </div>

                                        {/* Tagline */}
                                        <motion.div
                                            className="text-[11px] tracking-[0.15em] uppercase font-medium text-right hidden md:block"
                                            style={{ color: isHovered ? "#111" : "#ccc" }}
                                            animate={{ opacity: isHovered ? 1 : 0.4 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {product.tagline}
                                        </motion.div>

                                        {/* Arrow */}
                                        <motion.div
                                            className="ml-8 text-2xl font-extralight"
                                            style={{ color: isHovered ? "#111" : "transparent" }}
                                            animate={{
                                                x: isHovered ? 0 : -10,
                                                opacity: isHovered ? 1 : 0,
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            →
                                        </motion.div>
                                    </div>
                                </a>
                            </motion.div>
                        );
                    })}

                    {/* Bottom border */}
                    <div className="border-t border-[#e5e5e5]" />
                </div>
            </div>

            {/* Bottom bar */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-10 py-8"
            >
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                    Professional Infrastructure
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                    © {new Date().getFullYear()}
                </div>
            </motion.footer>
        </div>
    );
}
