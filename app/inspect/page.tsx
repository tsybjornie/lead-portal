"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AppDock from "../components/AppDock";
import { loadProject, updateInspectData, type OSSnag } from "../lib/project-store";

interface SnagItem {
    id: string;
    zone: string;
    category: string;
    description: string;
    severity: "low" | "medium" | "high";
    status: "open" | "fixed";
}

type InspectCategory =
    | "Alignment"
    | "Gaps"
    | "Finish"
    | "Lighting"
    | "Hardware"
    | "Cleanliness";

const ZONES = [
    "Living Room",
    "Master Bedroom",
    "Bedroom 2",
    "Bedroom 3",
    "Kitchen",
    "Bathroom 1",
    "Bathroom 2",
    "Balcony",
    "Corridor",
    "Entrance",
];

const CATEGORIES: InspectCategory[] = [
    "Alignment",
    "Gaps",
    "Finish",
    "Lighting",
    "Hardware",
    "Cleanliness",
];

const AI_SUGGESTIONS: Record<InspectCategory, string[]> = {
    Alignment: [
        "Cabinet doors not level",
        "Tile pattern misaligned at junction",
        "Skirting board uneven at corner",
        "Countertop not flush with wall",
        "Door frame slightly crooked",
    ],
    Gaps: [
        "Gap between countertop and wall",
        "Sealant missing at shower glass",
        "Gap at flooring transition strip",
        "Visible gap in laminate joinery",
        "Uneven grout spacing",
    ],
    Finish: [
        "Paint touch-up needed on wall",
        "Scratch on laminate surface",
        "Rough texture on ceiling patch",
        "Uneven paint sheen on feature wall",
        "Scuff marks on vinyl flooring",
    ],
    Lighting: [
        "Downlight not centered over vanity",
        "LED strip uneven brightness",
        "Switch plate not flush with wall",
        "Warm/cool mismatch between zones",
        "Under-cabinet light flickering",
    ],
    Hardware: [
        "Drawer runner not smooth",
        "Door handle loose",
        "Soft-close hinge not engaging",
        "Towel bar not secure",
        "Cabinet lock stiff to operate",
    ],
    Cleanliness: [
        "Construction dust on shelving",
        "Adhesive residue on tiles",
        "Protective film not removed",
        "Grout haze on floor tiles",
        "Silicone smear on glass panel",
    ],
};

let nextSnagId = 1;

export default function InspectPage() {
    const [snags, setSnags] = useState<SnagItem[]>([]);
    const [activeZone, setActiveZone] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] =
        useState<InspectCategory | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [customDesc, setCustomDesc] = useState("");
    const [synced, setSynced] = useState(false);

    // Load snags from project store on mount
    useEffect(() => {
        const project = loadProject();
        if (project && project.snags.length > 0) {
            setSnags(project.snags.map(s => ({
                id: s.id,
                zone: s.zone,
                category: s.category,
                description: s.description,
                severity: s.severity,
                status: s.status,
            })));
        }
    }, []);

    // Sync snags to project store
    useEffect(() => {
        if (snags.length > 0 || synced) {
            const osSnags: OSSnag[] = snags.map(s => ({
                id: s.id,
                zone: s.zone,
                category: s.category,
                description: s.description,
                severity: s.severity,
                status: s.status,
            }));
            updateInspectData(osSnags);
            setSynced(true);
        }
    }, [snags, synced]);

    const addSnag = (
        zone: string,
        category: string,
        description: string,
        severity: "low" | "medium" | "high" = "medium"
    ) => {
        setSnags((prev) => [
            ...prev,
            {
                id: `snag_${nextSnagId++}`,
                zone,
                category,
                description,
                severity,
                status: "open",
            },
        ]);
        setCustomDesc("");
    };

    const toggleStatus = (id: string) => {
        setSnags((prev) =>
            prev.map((s) =>
                s.id === id
                    ? { ...s, status: s.status === "open" ? "fixed" : "open" }
                    : s
            )
        );
    };

    const removeSnag = (id: string) => {
        setSnags((prev) => prev.filter((s) => s.id !== id));
    };

    const openCount = snags.filter((s) => s.status === "open").length;
    const fixedCount = snags.filter((s) => s.status === "fixed").length;

    return (
        <div
            className="min-h-screen bg-[#fafafa] text-[#111] relative"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
            {/* Top bar */}
            <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-10 py-8 bg-[#fafafa]/80 backdrop-blur-sm">
                <Link
                    href="/hub"
                    className="text-[11px] tracking-[0.3em] uppercase font-medium text-[#999] hover:text-[#111] transition-colors"
                >
                    ← Command Center
                </Link>
                <div className="flex items-center gap-4">
                    <Link
                        href="/reveal"
                        className="text-[11px] tracking-[0.3em] uppercase font-medium text-[#999] hover:text-[#111] transition-colors"
                    >
                        → Reveal
                    </Link>
                    <span className="text-[#ddd]">|</span>
                    <div className="text-[11px] tracking-[0.3em] uppercase font-medium text-[#999]">
                        Inspect
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-10 md:px-20 pt-32 pb-20">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
                    className="mb-20"
                >
                    <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extralight leading-[0.95] tracking-[-0.04em] mb-4">
                        Quality
                        <br />
                        <span className="italic font-light text-[#bbb]">control.</span>
                    </h1>
                    <p className="text-[#999] text-sm tracking-wide max-w-md mt-6">
                        Inspect every zone. Log every snag. Ensure perfection before
                        handover.
                    </p>
                </motion.div>

                {/* Summary */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-3 gap-px bg-[#e5e5e5] mb-16"
                >
                    {[
                        { label: "Total Snags", value: snags.length.toString() },
                        { label: "Open", value: openCount.toString() },
                        { label: "Fixed", value: fixedCount.toString() },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-[#fafafa] p-8">
                            <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-2">
                                {stat.label}
                            </div>
                            <div className="text-2xl font-extralight tracking-tight">
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Zone + Category selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-16"
                >
                    {/* Step 1: Zone */}
                    <div className="mb-10">
                        <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-4">
                            01 — Select zone
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {ZONES.map((zone) => {
                                const isActive = activeZone === zone;
                                const zoneSnagCount = snags.filter(
                                    (s) => s.zone === zone && s.status === "open"
                                ).length;
                                return (
                                    <button
                                        key={zone}
                                        onClick={() => {
                                            setActiveZone(isActive ? null : zone);
                                            setActiveCategory(null);
                                        }}
                                        className={`px-5 py-3 border text-sm font-extralight tracking-wide transition-all duration-300 ${isActive
                                            ? "bg-[#111] text-white border-[#111]"
                                            : "border-[#e5e5e5] hover:border-[#111]"
                                            }`}
                                    >
                                        {zone}
                                        {zoneSnagCount > 0 && (
                                            <span className="ml-2 text-[10px] font-medium">
                                                {zoneSnagCount}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Category */}
                    <AnimatePresence>
                        {activeZone && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-10"
                            >
                                <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-4">
                                    02 — Inspection category
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map((cat) => {
                                        const isActive = activeCategory === cat;
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() =>
                                                    setActiveCategory(isActive ? null : cat)
                                                }
                                                className={`px-5 py-3 border text-sm font-extralight tracking-wide transition-all duration-300 ${isActive
                                                    ? "bg-[#111] text-white border-[#111]"
                                                    : "border-[#e5e5e5] hover:border-[#111]"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Step 3: AI suggestions */}
                    <AnimatePresence>
                        {activeZone && activeCategory && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-4">
                                    03 — Common issues (tap to add)
                                </div>
                                <div className="space-y-1 mb-6">
                                    {AI_SUGGESTIONS[activeCategory].map((suggestion) => {
                                        const alreadyAdded = snags.some(
                                            (s) =>
                                                s.zone === activeZone &&
                                                s.description === suggestion
                                        );
                                        return (
                                            <button
                                                key={suggestion}
                                                disabled={alreadyAdded}
                                                onClick={() =>
                                                    addSnag(activeZone, activeCategory, suggestion)
                                                }
                                                className={`block w-full text-left px-5 py-4 border-b border-[#f0f0f0] text-sm font-extralight tracking-wide transition-all duration-300 ${alreadyAdded
                                                    ? "text-[#ccc] line-through"
                                                    : "hover:bg-[#111] hover:text-white hover:pl-8"
                                                    }`}
                                            >
                                                {suggestion}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom snag */}
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-2">
                                            Custom issue
                                        </label>
                                        <input
                                            type="text"
                                            value={customDesc}
                                            onChange={(e) => setCustomDesc(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "Enter" &&
                                                    customDesc.trim() &&
                                                    activeZone &&
                                                    activeCategory
                                                ) {
                                                    addSnag(
                                                        activeZone,
                                                        activeCategory,
                                                        customDesc.trim()
                                                    );
                                                }
                                            }}
                                            className="w-full bg-transparent border-b border-[#e5e5e5] focus:border-[#111] outline-none py-2 text-lg font-extralight tracking-tight transition-colors"
                                            placeholder="Describe the issue"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (customDesc.trim() && activeZone && activeCategory)
                                                addSnag(
                                                    activeZone,
                                                    activeCategory,
                                                    customDesc.trim()
                                                );
                                        }}
                                        className="px-6 py-2 bg-[#111] text-white text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-[#333] transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Snag list */}
                {snags.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-16"
                    >
                        <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-6">
                            Snag List
                        </div>

                        {snags.map((snag, i) => (
                            <div
                                key={snag.id}
                                onMouseEnter={() => setHoveredId(snag.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="border-t border-[#e5e5e5] py-5 transition-all duration-300"
                                style={{
                                    borderColor: hoveredId === snag.id ? "#111" : "#e5e5e5",
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <span className="text-[11px] tracking-[0.2em] font-medium text-[#ccc] mt-1 w-8">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div>
                                            <div
                                                className={`text-base font-extralight tracking-tight ${snag.status === "fixed"
                                                    ? "line-through text-[#bbb]"
                                                    : ""
                                                    }`}
                                            >
                                                {snag.description}
                                            </div>
                                            <div className="flex gap-4 mt-1">
                                                <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-[#bbb]">
                                                    {snag.zone}
                                                </span>
                                                <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-[#bbb]">
                                                    {snag.category}
                                                </span>
                                                <span
                                                    className={`text-[10px] tracking-[0.15em] uppercase font-medium ${snag.severity === "high"
                                                        ? "text-[#111]"
                                                        : snag.severity === "medium"
                                                            ? "text-[#999]"
                                                            : "text-[#ccc]"
                                                        }`}
                                                >
                                                    {snag.severity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => toggleStatus(snag.id)}
                                            className={`text-[11px] tracking-[0.15em] uppercase font-medium transition-colors ${snag.status === "fixed"
                                                ? "text-[#999] hover:text-[#111]"
                                                : "text-[#111] hover:text-[#999]"
                                                }`}
                                        >
                                            {snag.status === "fixed" ? "Reopen" : "Mark Fixed"}
                                        </button>
                                        <button
                                            onClick={() => removeSnag(snag.id)}
                                            className="text-[11px] tracking-[0.15em] uppercase font-medium text-[#ccc] hover:text-[#111] transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="border-t border-[#e5e5e5]" />
                    </motion.div>
                )}
            </div>

            {/* Bottom bar */}
            <footer className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-10 py-6 bg-[#fafafa]/80 backdrop-blur-sm border-t border-[#f0f0f0]">
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                    {openCount} open / {fixedCount} fixed
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                        {snags.length} total snags
                    </div>
                    {snags.length > 0 && openCount === 0 && (
                        <Link
                            href="/reveal"
                            className="px-5 py-2 bg-[#111] text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors"
                        >
                            → Generate Portfolio
                        </Link>
                    )}
                </div>
            </footer>

            <AppDock />
        </div>
    );
}
