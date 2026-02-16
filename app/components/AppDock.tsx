"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const apps = [
    { code: "FU", name: "FollowUp", href: "http://localhost:5500/follow%20up%20-%20lead%20reponse/dashboard.html", external: true },
    { code: "NU", name: "Numbers", href: "http://localhost:3000/", external: true },
    { code: "SQ", name: "Sequence", href: "http://localhost:5500/sequence/index.html", external: true },
    { code: "PD", name: "PaddleDuck", href: "http://localhost:3001", external: true },
    { code: "ME", name: "Measure", href: "http://localhost:3000/measure", external: true },
    { code: "IN", name: "Inspect", href: "http://localhost:3000/inspect", external: true },
    { code: "LE", name: "Ledger", href: "http://localhost:3000/ledger", external: true },
    { code: "RE", name: "Reveal", href: "http://localhost:3000/reveal", external: true },
];

export default function AppDock() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredApp, setHoveredApp] = useState<string | null>(null);

    return (
        <>
            {/* Trigger button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-[9999] w-12 h-12 bg-[#111] text-white flex items-center justify-center text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-[#333] transition-colors"
                style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? "×" : "OS"}
            </motion.button>

            {/* Dock panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0, 1] }}
                        className="fixed bottom-24 right-8 z-[9998] bg-[#fafafa] border border-[#e5e5e5] shadow-2xl w-72"
                        style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-[#f0f0f0]">
                            <div className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#bbb]">
                                Ordinance Systems
                            </div>
                        </div>

                        {/* App list */}
                        <div className="py-1">
                            {apps.map((app) => (
                                <a
                                    key={app.code}
                                    href={app.href}
                                    target={app.external ? "_blank" : undefined}
                                    rel={app.external ? "noopener noreferrer" : undefined}
                                    onMouseEnter={() => setHoveredApp(app.code)}
                                    onMouseLeave={() => setHoveredApp(null)}
                                    className="flex items-center gap-4 px-5 py-3 transition-all duration-200 hover:bg-[#f0f0f0]"
                                >
                                    <span
                                        className="w-8 h-8 flex items-center justify-center text-[10px] tracking-wider font-bold border transition-all duration-200"
                                        style={{
                                            background: hoveredApp === app.code ? "#111" : "transparent",
                                            color: hoveredApp === app.code ? "#fff" : "#999",
                                            borderColor: hoveredApp === app.code ? "#111" : "#e5e5e5",
                                        }}
                                    >
                                        {app.code}
                                    </span>
                                    <span
                                        className="text-sm font-extralight tracking-wide transition-colors duration-200"
                                        style={{ color: hoveredApp === app.code ? "#111" : "#888" }}
                                    >
                                        {app.name}
                                    </span>
                                </a>
                            ))}
                        </div>

                        {/* Hub link */}
                        <a
                            href="http://localhost:3000/hub"
                            className="block px-5 py-3 border-t border-[#f0f0f0] text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] hover:text-[#111] hover:bg-[#f0f0f0] transition-all"
                        >
                            ← Command Center
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
