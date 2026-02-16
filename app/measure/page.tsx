"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AppDock from "../components/AppDock";
import { loadProject, createProject, updateMeasureData, onProjectUpdate, type OSRoom } from "../lib/project-store";

interface Room {
    id: string;
    name: string;
    length: number;
    width: number;
    height: number;
}

let nextId = 1;
function uid() {
    return `room_${nextId++}`;
}

const PRESET_ROOMS = [
    "Living Room",
    "Master Bedroom",
    "Bedroom 2",
    "Bedroom 3",
    "Kitchen",
    "Bathroom 1",
    "Bathroom 2",
    "Storeroom",
    "Balcony",
    "Service Yard",
];

export default function MeasurePage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [customName, setCustomName] = useState("");
    const [synced, setSynced] = useState(false);

    // Load rooms from shared project store on mount
    useEffect(() => {
        const project = loadProject();
        if (project && project.rooms.length > 0) {
            setRooms(project.rooms.map(r => ({
                id: r.id,
                name: r.name,
                length: r.length,
                width: r.width,
                height: r.height,
            })));
        } else if (!project) {
            createProject("", "");
        }
    }, []);

    // Sync rooms to project store whenever they change
    useEffect(() => {
        if (rooms.length > 0 || synced) {
            const osRooms: OSRoom[] = rooms.map(r => ({
                id: r.id,
                name: r.name,
                length: r.length,
                width: r.width,
                height: r.height,
            }));
            updateMeasureData(osRooms);
            setSynced(true);
        }
    }, [rooms, synced]);

    // Listen for cross-tab updates
    useEffect(() => {
        const unsub = onProjectUpdate((project) => {
            if (project.lastUpdatedBy !== "measure") {
                // Don't overwrite our own edits, but if another app created a project, load it
            }
        });
        return unsub;
    }, []);

    const addRoom = (name: string) => {
        setRooms((prev) => [
            ...prev,
            { id: uid(), name, length: 0, width: 0, height: 2.6 },
        ]);
        setShowAdd(false);
        setCustomName("");
    };

    const updateRoom = (id: string, field: keyof Room, value: number) => {
        setRooms((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        );
    };

    const removeRoom = (id: string) => {
        setRooms((prev) => prev.filter((r) => r.id !== id));
    };

    const totalFloor = rooms.reduce((sum, r) => sum + r.length * r.width, 0);
    const totalWall = rooms.reduce(
        (sum, r) => sum + 2 * (r.length + r.width) * r.height,
        0
    );

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
                        href="/"
                        className="text-[11px] tracking-[0.3em] uppercase font-medium text-[#999] hover:text-[#111] transition-colors"
                    >
                        → Numbers
                    </Link>
                    <span className="text-[#ddd]">|</span>
                    <div className="text-[11px] tracking-[0.3em] uppercase font-medium text-[#999]">
                        Measure
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
                        Site
                        <br />
                        <span className="italic font-light text-[#bbb]">measurement.</span>
                    </h1>
                    <p className="text-[#999] text-sm tracking-wide max-w-md mt-6">
                        Capture room dimensions. Areas auto-sync to Numbers for quoting.
                    </p>
                </motion.div>

                {/* Summary cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-3 gap-px bg-[#e5e5e5] mb-16"
                >
                    {[
                        { label: "Rooms", value: rooms.length.toString() },
                        {
                            label: "Floor Area",
                            value: `${totalFloor.toFixed(1)} sqft`,
                        },
                        {
                            label: "Wall Area",
                            value: `${totalWall.toFixed(1)} sqft`,
                        },
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

                {/* Room list */}
                <div className="mb-12">
                    <AnimatePresence>
                        {rooms.map((room, i) => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                transition={{ duration: 0.4 }}
                                onMouseEnter={() => setHoveredId(room.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="border-t border-[#e5e5e5] py-8 transition-all duration-300"
                                style={{
                                    borderColor: hoveredId === room.id ? "#111" : "#e5e5e5",
                                }}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-baseline gap-6">
                                        <span className="text-[11px] tracking-[0.2em] font-medium text-[#ccc] w-8">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="text-xl font-extralight tracking-[-0.02em]">
                                            {room.name}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-6">
                                        <span className="text-sm font-extralight text-[#999]">
                                            {(room.length * room.width).toFixed(1)} sqft
                                        </span>
                                        <button
                                            onClick={() => removeRoom(room.id)}
                                            className="text-[11px] tracking-[0.15em] uppercase font-medium text-[#ccc] hover:text-[#111] transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Dimension inputs */}
                                <div className="flex gap-6 ml-14">
                                    {(
                                        [
                                            ["length", "Length (ft)", room.length],
                                            ["width", "Width (ft)", room.width],
                                            ["height", "Height (ft)", room.height],
                                        ] as const
                                    ).map(([field, label, val]) => (
                                        <div key={field} className="flex-1">
                                            <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-2">
                                                {label}
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                value={val || ""}
                                                onChange={(e) =>
                                                    updateRoom(
                                                        room.id,
                                                        field,
                                                        parseFloat(e.target.value) || 0
                                                    )
                                                }
                                                className="w-full bg-transparent border-b border-[#e5e5e5] focus:border-[#111] outline-none py-2 text-lg font-extralight tracking-tight transition-colors"
                                                placeholder="0.0"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Bottom border if rooms exist */}
                    {rooms.length > 0 && <div className="border-t border-[#e5e5e5]" />}
                </div>

                {/* Add room */}
                <AnimatePresence>
                    {showAdd ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-12"
                        >
                            <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-6">
                                Select room type
                            </div>
                            <div className="flex flex-wrap gap-3 mb-8">
                                {PRESET_ROOMS.filter(
                                    (name) => !rooms.find((r) => r.name === name)
                                ).map((name) => (
                                    <button
                                        key={name}
                                        onClick={() => addRoom(name)}
                                        className="px-5 py-3 border border-[#e5e5e5] hover:border-[#111] text-sm font-extralight tracking-wide transition-all duration-300 hover:bg-[#111] hover:text-white"
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-[#bbb] mb-2">
                                        Custom room name
                                    </label>
                                    <input
                                        type="text"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value)}
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            customName.trim() &&
                                            addRoom(customName.trim())
                                        }
                                        className="w-full bg-transparent border-b border-[#e5e5e5] focus:border-[#111] outline-none py-2 text-lg font-extralight tracking-tight transition-colors"
                                        placeholder="Enter room name"
                                    />
                                </div>
                                <button
                                    onClick={() =>
                                        customName.trim() && addRoom(customName.trim())
                                    }
                                    className="px-6 py-2 bg-[#111] text-white text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-[#333] transition-colors"
                                >
                                    Add
                                </button>
                            </div>

                            <button
                                onClick={() => setShowAdd(false)}
                                className="mt-6 text-[11px] tracking-[0.15em] uppercase font-medium text-[#ccc] hover:text-[#111] transition-colors"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    ) : (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setShowAdd(true)}
                            className="w-full py-6 border border-dashed border-[#ddd] hover:border-[#111] text-[11px] tracking-[0.2em] uppercase font-medium text-[#bbb] hover:text-[#111] transition-all duration-300"
                        >
                            + Add Room
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <footer className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-10 py-6 bg-[#fafafa]/80 backdrop-blur-sm border-t border-[#f0f0f0]">
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                    {rooms.length} room{rooms.length !== 1 ? "s" : ""} measured
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                        Total {totalFloor.toFixed(0)} sqft
                    </div>
                    {rooms.length > 0 && rooms.some(r => r.length > 0 && r.width > 0) && (
                        <Link
                            href="/"
                            className="px-5 py-2 bg-[#111] text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors"
                        >
                            → Build Quote
                        </Link>
                    )}
                </div>
            </footer>

            <AppDock />
        </div>
    );
}
