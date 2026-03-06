"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AppDock from "../components/AppDock";
import { loadProject, updateRevealData, updatePhotoshootData } from "../lib/project-store";
import {
    type PhotoshootBooking,
    type PhotoshootStatus,
    PHOTOSHOOT_PACKAGES,
    PHOTOGRAPHERS,
    createPhotoshootBooking,
} from "@/types/photoshoot";

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
    "Wabi-Sabi",
    "Bauhaus",
    "De Stijl",
    "Brutalism",
    "Art Nouveau",
    "Peranakan",
    "Hygge",
    "Art Deco",
    "Luxury",
    "Muji",
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
            `${info.propertyType} transformation${info.style ? `  ${info.style} style` : ""}.`
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
        "info" | "photos" | "output" | "photoshoot"
    >("info");
    const [addingPhotoZone, setAddingPhotoZone] = useState<string | null>(null);
    const [booking, setBooking] = useState<PhotoshootBooking | null>(null);
    const [selectedPackage, setSelectedPackage] = useState('standard');
    const [selectedPhotographer, setSelectedPhotographer] = useState('');

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
            if (project.photoshoot) {
                setBooking(project.photoshoot);
                setSelectedPackage(project.photoshoot.packageId);
            }
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
        { id: "photoshoot" as const, label: "Photoshoot" },
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
                    Command Center
                </Link>
                <div className="flex items-center gap-4">
                    <Link
                        href="/inspect"
                        className="text-[11px] tracking-[0.3em] uppercase font-medium text-[#999] hover:text-[#111] transition-colors"
                    >
                        Inspect
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
                                Next: Photography
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
                                                    {isExpanded ? "" : "+"}
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
                                Next: Generate Portfolio
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
                    {/* Section: Photoshoot */}
                    {activeSection === "photoshoot" && (
                        <motion.div
                            key="photoshoot"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                        >
                            {!booking ? (
                                /* Booking setup */
                                <div className="space-y-10">
                                    <div>
                                        <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-6">Select Package</div>
                                        <div className="grid grid-cols-3 gap-4">
                                            {PHOTOSHOOT_PACKAGES.map(pkg => (
                                                <button
                                                    key={pkg.id}
                                                    onClick={() => setSelectedPackage(pkg.id)}
                                                    className={`text-left p-6 border transition-all duration-300 ${selectedPackage === pkg.id
                                                        ? 'bg-[#111] text-white border-[#111]'
                                                        : 'border-[#e5e5e5] hover:border-[#111]'
                                                        }`}
                                                >
                                                    <div className="text-lg font-extralight tracking-tight mb-1">{pkg.name}</div>
                                                    <div className={`text-[10px] tracking-wider mb-3 ${selectedPackage === pkg.id ? 'text-white/60' : 'text-[#999]'}`}>
                                                        {pkg.description}
                                                    </div>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-xl font-light">${pkg.price}</span>
                                                        <span className={`text-[10px] ${selectedPackage === pkg.id ? 'text-white/40' : 'text-[#bbb]'}`}>
                                                            {pkg.photoCount} photos{pkg.videoTour ? ' + video' : ''}
                                                        </span>
                                                    </div>
                                                    <div className={`text-[10px] mt-2 ${selectedPackage === pkg.id ? 'text-white/40' : 'text-[#ccc]'}`}>
                                                        {pkg.editingDays} days editing
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-4">Photographer</div>
                                        <div className="flex flex-wrap gap-3">
                                            {PHOTOGRAPHERS.map(ph => (
                                                <button
                                                    key={ph.id}
                                                    onClick={() => setSelectedPhotographer(ph.id)}
                                                    className={`px-5 py-3 border text-sm font-extralight tracking-wide transition-all duration-300 ${selectedPhotographer === ph.id
                                                        ? 'bg-[#111] text-white border-[#111]'
                                                        : 'border-[#e5e5e5] hover:border-[#111]'
                                                        }`}
                                                >
                                                    <div>{ph.name}</div>
                                                    <div className={`text-[10px] mt-0.5 ${selectedPhotographer === ph.id ? 'text-white/60' : 'text-[#999]'}`}>
                                                        {ph.specialty}   {ph.rating}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-4">Zones to Shoot</div>
                                        <div className="flex flex-wrap gap-2">
                                            {ZONES.map(zone => {
                                                const zonePhotos = photos.filter(p => p.zone === zone && p.type === 'after');
                                                return (
                                                    <span
                                                        key={zone}
                                                        className={`px-4 py-2 border text-sm font-extralight ${zonePhotos.length > 0
                                                            ? 'bg-[#111] text-white border-[#111]'
                                                            : 'border-[#e5e5e5] text-[#999]'
                                                            }`}
                                                    >
                                                        {zone} {zonePhotos.length > 0 && `(${zonePhotos.length})`}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        <p className="text-[10px] text-[#ccc] mt-2">Zones with After photos will be included in the shoot</p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const b = createPhotoshootBooking(selectedPackage);
                                            if (selectedPhotographer) {
                                                const ph = PHOTOGRAPHERS.find(p => p.id === selectedPhotographer);
                                                b.photographer = ph?.name;
                                            }
                                            b.zones = photos
                                                .filter(p => p.type === 'after')
                                                .map(p => p.zone)
                                                .filter((v, i, a) => a.indexOf(v) === i);
                                            setBooking(b);
                                            updatePhotoshootData(b);
                                        }}
                                        className="px-8 py-4 bg-[#111] text-white text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors"
                                    >
                                        Book Photoshoot
                                    </button>
                                </div>
                            ) : (
                                /* Booking status */
                                <div className="space-y-8">
                                    <div className="border border-[#e5e5e5] bg-white p-8">
                                        <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-6">Booking Confirmed</div>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Package', value: booking.packageName },
                                                { label: 'Photographer', value: booking.photographer || 'TBC' },
                                                { label: 'Status', value: booking.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) },
                                                { label: 'Zones', value: booking.zones.length > 0 ? booking.zones.join(', ') : 'All zones' },
                                                { label: 'Portfolio Permission', value: booking.clientPermission ? 'Granted' : 'Not granted' },
                                            ].map(item => (
                                                <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#f0f0f0] last:border-0">
                                                    <span className="text-sm font-extralight text-[#999]">{item.label}</span>
                                                    <span className="text-sm font-light text-[#111]">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Permission toggle */}
                                    <div className="flex items-center justify-between py-4 border border-[#e5e5e5] px-6">
                                        <div>
                                            <div className="text-sm font-light">Portfolio Permission</div>
                                            <div className="text-[10px] text-[#999]">Allow designer to use photos in their portfolio</div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const updated = { ...booking, clientPermission: !booking.clientPermission, updatedAt: new Date().toISOString() };
                                                setBooking(updated);
                                                updatePhotoshootData(updated);
                                            }}
                                            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${booking.clientPermission ? 'bg-[#111]' : 'bg-[#ddd]'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-300 shadow-sm ${booking.clientPermission ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>

                                    {/* Deliverables preview */}
                                    {booking.deliverables.length > 0 ? (
                                        <div>
                                            <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-4">Deliverables</div>
                                            <div className="grid grid-cols-3 gap-1">
                                                {booking.deliverables.map(d => (
                                                    <div key={d.id} className="aspect-square bg-[#f5f5f5] flex items-center justify-center">
                                                        <span className="text-[10px] text-[#ccc]">{d.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border border-dashed border-[#ddd] p-10 text-center">
                                            <div className="text-sm font-extralight text-[#bbb]">Deliverables will appear here after the shoot</div>
                                            <div className="text-[10px] text-[#ddd] mt-1">Estimated delivery: {PHOTOSHOOT_PACKAGES.find(p => p.id === booking.packageId)?.editingDays || 5} working days after shoot</div>
                                        </div>
                                    )}

                                    {/* Change booking */}
                                    <button
                                        onClick={() => setBooking(null)}
                                        className="text-[11px] tracking-[0.15em] uppercase font-medium text-[#999] hover:text-[#111] transition-colors"
                                    >
                                        Change Booking
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <footer className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-10 py-6 bg-[#fafafa]/80 backdrop-blur-sm border-t border-[#f0f0f0]">
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                    {photos.length} photos uploaded{booking ? `  Shoot: ${booking.status.replace(/_/g, ' ')}` : ''}
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                    {info.propertyType || "No property set"}
                </div>
            </footer>

            <AppDock />
        </div>
    );
}
