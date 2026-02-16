"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AppDock from "../components/AppDock";
import { loadProject, updateRevealData } from "../lib/project-store";

interface ProjectPhoto {
    id: string;
    type: "before" | "after";
    zone: string;
    dataUrl: string;
}

interface ProjectInfo {
    clientName: string;
    propertyType: string;
    size: string;
    duration: string;
    budget: string;
    style: string;
}

const PROPERTY_TYPES = [
    "3-Room HDB",
    "4-Room HDB",
    "5-Room HDB",
    "Executive HDB",
    "Condo",
    "Landed",
    "Commercial",
];

const STYLES = [
    "Minimalist",
    "Scandinavian",
    "Industrial",
    "Japanese",
    "Modern",
    "Contemporary",
    "Mid-Century",
    "Muji",
    "Resort",
    "Japandi",
];

const ZONES = [
    "Living Room",
    "Master Bedroom",
    "Kitchen",
    "Bathroom",
    "Study",
    "Dining",
    "Balcony",
    "Entrance",
];

function generateCaption(info: ProjectInfo, photoCount: number): string {
    const lines = [];
    if (info.propertyType) {
        lines.push(
            `${info.propertyType} transformation${info.style ? ` — ${info.style} style` : ""}.`
        );
    }
    if (info.size || info.duration) {
        const parts = [];
        if (info.size) parts.push(info.size);
        if (info.duration) parts.push(`completed in ${info.duration}`);
        lines.push(parts.join(", ") + ".");
    }
    if (photoCount > 0) {
        lines.push(
            `${photoCount} photos from this project showcase the transformation.`
        );
    }
    lines.push("");
    lines.push(
        "Every detail matters. From material selection to final styling, this space was designed for how life is actually lived."
    );
    lines.push("");
    lines.push("#renovation #interiordesign #singapore #homedesign");
    if (info.propertyType?.includes("HDB")) {
        lines.push("#hdb #hdbrenovation #bto");
    }
    if (info.style) {
        lines.push(`#${info.style.toLowerCase().replace(/[^a-z]/g, "")}`);
    }
    return lines.join("\n");
}

let nextPhotoId = 1;

export default function RevealPage() {
    const [photos, setPhotos] = useState<ProjectPhoto[]>([]);
    const [info, setInfo] = useState<ProjectInfo>({
        clientName: "",
        propertyType: "",
        size: "",
        duration: "",
        budget: "",
        style: "",
    });
    const [activeSection, setActiveSection] = useState<
        "info" | "photos" | "output"
    >("info");
    const [addingPhotoZone, setAddingPhotoZone] = useState<string | null>(null);

    // Load project info from shared store on mount
    useEffect(() => {
        const project = loadProject();
        if (project) {
            setInfo(prev => ({
                ...prev,
                clientName: project.clientName || prev.clientName,
                propertyType: project.propertyType || prev.propertyType,
                style: project.style || prev.style,
                size: project.totalFloorArea > 0 ? project.totalFloorArea.toFixed(0) : prev.size,
                budget: project.quoteTotalAmount > 0 ? `$${project.quoteTotalAmount.toLocaleString()}` : prev.budget,
            }));
        }
    }, []);

    // Sync photo count to project store
    useEffect(() => {
        if (photos.length > 0) {
            updateRevealData(photos.length);
        }
    }, [photos]);

    const handlePhotoUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "before" | "after",
        zone: string
    ) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setPhotos((prev) => [
                    ...prev,
                    {
                        id: `photo_${nextPhotoId++}`,
                        type,
                        zone,
                        dataUrl: reader.result as string,
                    },
                ]);
            };
            reader.readAsDataURL(file);
        });
        setAddingPhotoZone(null);
    };

    const removePhoto = (id: string) => {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
    };

    const caption = generateCaption(info, photos.length);

    const sections = [
        { id: "info" as const, label: "Project Brief" },
        { id: "photos" as const, label: "Photography" },
        { id: "output" as const, label: "Portfolio Output" },
    ];

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
                        href="/inspect"
                        className="text-[11px] tracking-[0.3em] uppercase font-medium text-[#999] hover:text-[#111] transition-colors"
                    >
                        ← Inspect
                    </Link>
                    <span className="text-[#ddd]">|</span>
                    <div className="text-[11px] tracking-[0.3em] uppercase font-medium text-[#999]">
                        Reveal
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-10 md:px-20 pt-32 pb-20">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
                    className="mb-16"
                >
                    <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extralight leading-[0.95] tracking-[-0.04em] mb-4">
                        Project
                        <br />
                        <span className="italic font-light text-[#bbb]">reveal.</span>
                    </h1>
                    <p className="text-[#999] text-sm tracking-wide max-w-md mt-6">
                        Transform completed projects into portfolio-ready content. Auto-generate captions and social posts.
                    </p>
                </motion.div>

                {/* Section nav */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-1 mb-16"
                >
                    {sections.map((section, i) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex-1 py-5 text-center border-t-2 transition-all duration-300 ${activeSection === section.id
                                ? "border-[#111] bg-white"
                                : "border-[#e5e5e5] hover:border-[#999]"
                                }`}
                        >
                            <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-1">
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <div
                                className={`text-sm font-extralight tracking-wide ${activeSection === section.id ? "text-[#111]" : "text-[#999]"
                                    }`}
                            >
                                {section.label}
                            </div>
                        </button>
                    ))}
                </motion.div>

                {/* Section: Info */}
                <AnimatePresence mode="wait">
                    {activeSection === "info" && (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="space-y-8">
                                {/* Client name */}
                                <div>
                                    <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-2">
                                        Client Reference
                                    </label>
                                    <input
                                        type="text"
                                        value={info.clientName}
                                        onChange={(e) =>
                                            setInfo({ ...info, clientName: e.target.value })
                                        }
                                        className="w-full bg-transparent border-b border-[#e5e5e5] focus:border-[#111] outline-none py-3 text-xl font-extralight tracking-tight transition-colors"
                                        placeholder="e.g. The Tan Residence"
                                    />
                                </div>

                                {/* Property type */}
                                <div>
                                    <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-4">
                                        Property Type
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {PROPERTY_TYPES.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() =>
                                                    setInfo({ ...info, propertyType: type })
                                                }
                                                className={`px-5 py-3 border text-sm font-extralight tracking-wide transition-all duration-300 ${info.propertyType === type
                                                    ? "bg-[#111] text-white border-[#111]"
                                                    : "border-[#e5e5e5] hover:border-[#111]"
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Style */}
                                <div>
                                    <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-4">
                                        Design Style
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {STYLES.map((style) => (
                                            <button
                                                key={style}
                                                onClick={() => setInfo({ ...info, style })}
                                                className={`px-5 py-3 border text-sm font-extralight tracking-wide transition-all duration-300 ${info.style === style
                                                    ? "bg-[#111] text-white border-[#111]"
                                                    : "border-[#e5e5e5] hover:border-[#111]"
                                                    }`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Size + Duration + Budget */}
                                <div className="grid grid-cols-3 gap-8">
                                    <div>
                                        <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-2">
                                            Size (sqft)
                                        </label>
                                        <input
                                            type="text"
                                            value={info.size}
                                            onChange={(e) =>
                                                setInfo({ ...info, size: e.target.value })
                                            }
                                            className="w-full bg-transparent border-b border-[#e5e5e5] focus:border-[#111] outline-none py-2 text-lg font-extralight tracking-tight transition-colors"
                                            placeholder="1,200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-2">
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            value={info.duration}
                                            onChange={(e) =>
                                                setInfo({ ...info, duration: e.target.value })
                                            }
                                            className="w-full bg-transparent border-b border-[#e5e5e5] focus:border-[#111] outline-none py-2 text-lg font-extralight tracking-tight transition-colors"
                                            placeholder="8 weeks"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-2">
                                            Budget
                                        </label>
                                        <input
                                            type="text"
                                            value={info.budget}
                                            onChange={(e) =>
                                                setInfo({ ...info, budget: e.target.value })
                                            }
                                            className="w-full bg-transparent border-b border-[#e5e5e5] focus:border-[#111] outline-none py-2 text-lg font-extralight tracking-tight transition-colors"
                                            placeholder="$45,000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setActiveSection("photos")}
                                className="mt-12 px-8 py-4 bg-[#111] text-white text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors"
                            >
                                Next: Photography →
                            </button>
                        </motion.div>
                    )}

                    {/* Section: Photos */}
                    {activeSection === "photos" && (
                        <motion.div
                            key="photos"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="space-y-6">
                                {ZONES.map((zone) => {
                                    const zonePhotos = photos.filter((p) => p.zone === zone);
                                    const beforePhotos = zonePhotos.filter(
                                        (p) => p.type === "before"
                                    );
                                    const afterPhotos = zonePhotos.filter(
                                        (p) => p.type === "after"
                                    );
                                    const isExpanded = addingPhotoZone === zone;

                                    return (
                                        <div
                                            key={zone}
                                            className="border-t border-[#e5e5e5] py-6"
                                        >
                                            <button
                                                onClick={() =>
                                                    setAddingPhotoZone(isExpanded ? null : zone)
                                                }
                                                className="flex items-center justify-between w-full text-left"
                                            >
                                                <div className="flex items-baseline gap-4">
                                                    <span className="text-lg font-extralight tracking-[-0.02em]">
                                                        {zone}
                                                    </span>
                                                    {zonePhotos.length > 0 && (
                                                        <span className="text-[11px] tracking-[0.15em] font-medium text-[#bbb]">
                                                            {beforePhotos.length}B / {afterPhotos.length}A
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-sm font-extralight text-[#bbb]">
                                                    {isExpanded ? "−" : "+"}
                                                </span>
                                            </button>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="grid grid-cols-2 gap-6 mt-6">
                                                            {/* Before upload */}
                                                            <div>
                                                                <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-3">
                                                                    Before
                                                                </div>
                                                                {beforePhotos.map((photo) => (
                                                                    <div
                                                                        key={photo.id}
                                                                        className="relative mb-3 group"
                                                                    >
                                                                        <img
                                                                            src={photo.dataUrl}
                                                                            alt=""
                                                                            className="w-full aspect-[4/3] object-cover"
                                                                        />
                                                                        <button
                                                                            onClick={() => removePhoto(photo.id)}
                                                                            className="absolute top-2 right-2 bg-[#111]/80 text-white text-[10px] tracking-wider uppercase px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <label className="block w-full py-8 border border-dashed border-[#ddd] hover:border-[#111] text-center text-[11px] tracking-[0.2em] uppercase font-medium text-[#bbb] hover:text-[#111] cursor-pointer transition-all">
                                                                    + Upload Before
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        className="hidden"
                                                                        onChange={(e) =>
                                                                            handlePhotoUpload(e, "before", zone)
                                                                        }
                                                                    />
                                                                </label>
                                                            </div>

                                                            {/* After upload */}
                                                            <div>
                                                                <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-3">
                                                                    After
                                                                </div>
                                                                {afterPhotos.map((photo) => (
                                                                    <div
                                                                        key={photo.id}
                                                                        className="relative mb-3 group"
                                                                    >
                                                                        <img
                                                                            src={photo.dataUrl}
                                                                            alt=""
                                                                            className="w-full aspect-[4/3] object-cover"
                                                                        />
                                                                        <button
                                                                            onClick={() => removePhoto(photo.id)}
                                                                            className="absolute top-2 right-2 bg-[#111]/80 text-white text-[10px] tracking-wider uppercase px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <label className="block w-full py-8 border border-dashed border-[#ddd] hover:border-[#111] text-center text-[11px] tracking-[0.2em] uppercase font-medium text-[#bbb] hover:text-[#111] cursor-pointer transition-all">
                                                                    + Upload After
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        className="hidden"
                                                                        onChange={(e) =>
                                                                            handlePhotoUpload(e, "after", zone)
                                                                        }
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                                <div className="border-t border-[#e5e5e5]" />
                            </div>

                            <button
                                onClick={() => setActiveSection("output")}
                                className="mt-12 px-8 py-4 bg-[#111] text-white text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors"
                            >
                                Next: Generate Portfolio →
                            </button>
                        </motion.div>
                    )}

                    {/* Section: Output */}
                    {activeSection === "output" && (
                        <motion.div
                            key="output"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Portfolio card preview */}
                            <div className="border border-[#e5e5e5] bg-white mb-12">
                                <div className="p-10">
                                    <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-6">
                                        Portfolio Card Preview
                                    </div>

                                    {/* Photo grid */}
                                    {photos.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 mb-8">
                                            {photos
                                                .filter((p) => p.type === "after")
                                                .slice(0, 6)
                                                .map((photo) => (
                                                    <img
                                                        key={photo.id}
                                                        src={photo.dataUrl}
                                                        alt=""
                                                        className="w-full aspect-square object-cover"
                                                    />
                                                ))}
                                        </div>
                                    )}

                                    {/* Project info */}
                                    <div className="space-y-4">
                                        {info.clientName && (
                                            <h2 className="text-3xl font-extralight tracking-[-0.03em]">
                                                {info.clientName}
                                            </h2>
                                        )}
                                        <div className="flex flex-wrap gap-6">
                                            {info.propertyType && (
                                                <span className="text-sm font-extralight text-[#999]">
                                                    {info.propertyType}
                                                </span>
                                            )}
                                            {info.style && (
                                                <span className="text-sm font-extralight text-[#999]">
                                                    {info.style}
                                                </span>
                                            )}
                                            {info.size && (
                                                <span className="text-sm font-extralight text-[#999]">
                                                    {info.size} sqft
                                                </span>
                                            )}
                                            {info.duration && (
                                                <span className="text-sm font-extralight text-[#999]">
                                                    {info.duration}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Generated caption */}
                            <div className="mb-12">
                                <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-4">
                                    Auto-Generated Caption
                                </div>
                                <div className="border border-[#e5e5e5] bg-white p-8">
                                    <pre className="text-sm font-extralight leading-relaxed whitespace-pre-wrap font-[inherit]">
                                        {caption}
                                    </pre>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(caption)}
                                    className="mt-4 text-[11px] tracking-[0.15em] uppercase font-medium text-[#999] hover:text-[#111] transition-colors"
                                >
                                    Copy to Clipboard
                                </button>
                            </div>

                            {/* Stats summary */}
                            <div className="grid grid-cols-4 gap-px bg-[#e5e5e5]">
                                {[
                                    { label: "Photos", value: photos.length.toString() },
                                    {
                                        label: "Before",
                                        value: photos
                                            .filter((p) => p.type === "before")
                                            .length.toString(),
                                    },
                                    {
                                        label: "After",
                                        value: photos
                                            .filter((p) => p.type === "after")
                                            .length.toString(),
                                    },
                                    {
                                        label: "Zones",
                                        value: new Set(photos.map((p) => p.zone)).size.toString(),
                                    },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-[#fafafa] p-6">
                                        <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-1">
                                            {stat.label}
                                        </div>
                                        <div className="text-xl font-extralight tracking-tight">
                                            {stat.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <footer className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-10 py-6 bg-[#fafafa]/80 backdrop-blur-sm border-t border-[#f0f0f0]">
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                    {photos.length} photos uploaded
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                    {info.propertyType || "No property set"}
                </div>
            </footer>

            <AppDock />
        </div>
    );
}
