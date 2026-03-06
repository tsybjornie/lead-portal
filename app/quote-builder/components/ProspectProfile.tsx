'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Zone, computeZoneMetrics } from '@/components/ZoneManager';

// ============================================================
// TYPES
// ============================================================

export interface ProspectData {
    // Client info
    clientName: string;
    phone: string;
    email: string;
    address: string;
    // Property
    propertyType: 'hdb' | 'condo' | 'landed' | 'commercial';
    unitNumber: string;
    floorArea: number | null;       // sqft
    numBedrooms: number;
    numBathrooms: number;
    // Project
    budgetMin: number | null;
    budgetMax: number | null;
    renovationType: 'full' | 'partial' | 'touchup';
    moveInDate: string;             // ISO date
    specialRequirements: string;
    // Floorplan
    floorplanImage: string | null;  // base64 data URL
}

interface FloorplanRoom {
    id: string;
    name: string;
    lengthM: number;
    widthM: number;
    heightM: number;
}

interface ProspectProfileProps {
    onPropertyChange?: (data: Partial<ProspectData>) => void;
    onRoomsToZones?: (zones: Zone[]) => void;
}

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEY = 'arc-quote-prospect';
const ZONE_COLOURS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#84CC16', '#EF4444', '#6366F1'];

const DEFAULT_PROSPECT: ProspectData = {
    clientName: '',
    phone: '',
    email: '',
    address: '',
    propertyType: 'hdb',
    unitNumber: '',
    floorArea: null,
    numBedrooms: 3,
    numBathrooms: 2,
    budgetMin: null,
    budgetMax: null,
    renovationType: 'full',
    moveInDate: '',
    specialRequirements: '',
    floorplanImage: null,
};

const COMMON_ROOMS: Record<string, { name: string; h: number }[]> = {
    hdb: [
        { name: 'Living / Dining', h: 2.6 },
        { name: 'Kitchen', h: 2.6 },
        { name: 'Master Bedroom', h: 2.6 },
        { name: 'Bedroom 2', h: 2.6 },
        { name: 'Bedroom 3', h: 2.6 },
        { name: 'Master Bathroom', h: 2.4 },
        { name: 'Common Bathroom', h: 2.4 },
        { name: 'Service Yard', h: 2.6 },
        { name: 'Bomb Shelter', h: 2.6 },
    ],
    condo: [
        { name: 'Living / Dining', h: 2.8 },
        { name: 'Kitchen', h: 2.8 },
        { name: 'Master Bedroom', h: 2.8 },
        { name: 'Bedroom 2', h: 2.8 },
        { name: 'Master Bathroom', h: 2.6 },
        { name: 'Common Bathroom', h: 2.6 },
        { name: 'Balcony', h: 2.8 },
        { name: 'Yard', h: 2.8 },
    ],
    landed: [
        { name: 'Living Room', h: 3.0 },
        { name: 'Dining Room', h: 3.0 },
        { name: 'Kitchen', h: 3.0 },
        { name: 'Master Bedroom', h: 3.0 },
        { name: 'Bedroom 2', h: 3.0 },
        { name: 'Bedroom 3', h: 3.0 },
        { name: 'Master Bathroom', h: 2.6 },
        { name: 'Common Bathroom', h: 2.6 },
        { name: 'Garage', h: 3.0 },
        { name: 'Backyard', h: 3.0 },
    ],
    commercial: [
        { name: 'Main Area', h: 3.0 },
        { name: 'Back Office', h: 3.0 },
        { name: 'Washroom', h: 2.6 },
        { name: 'Storage', h: 3.0 },
        { name: 'Frontage', h: 3.0 },
    ],
};

// ============================================================
// COMPONENT
// ============================================================

export default function ProspectProfile({ onPropertyChange, onRoomsToZones }: ProspectProfileProps) {
    const [data, setData] = useState<ProspectData>(DEFAULT_PROSPECT);
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeTab, setActiveTab] = useState<'client' | 'property' | 'floorplan'>('client');
    const [rooms, setRooms] = useState<FloorplanRoom[]>([]);
    const [showRoomPicker, setShowRoomPicker] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ---- LOAD FROM STORAGE ----
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setData({ ...DEFAULT_PROSPECT, ...parsed.prospect });
                if (parsed.rooms) setRooms(parsed.rooms);
            }
        } catch (e) {
            console.error('Failed to load prospect data', e);
        }
    }, []);

    // ---- SAVE TO STORAGE ----
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ prospect: data, rooms }));
    }, [data, rooms]);

    // ---- UPDATE HELPER ----
    const update = useCallback((field: keyof ProspectData, value: unknown) => {
        setData(prev => {
            const next = { ...prev, [field]: value };
            onPropertyChange?.({ [field]: value });
            return next;
        });
    }, [onPropertyChange]);

    // ---- FLOORPLAN UPLOAD ----
    const handleFileUpload = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;
        if (file.size > 10 * 1024 * 1024) {
            alert('Image too large (max 10MB)');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            update('floorplanImage', result);
            setActiveTab('floorplan');
        };
        reader.readAsDataURL(file);
    }, [update]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    }, [handleFileUpload]);

    // ---- ROOM MANAGEMENT ----
    const addRoom = (name: string, height: number = 2.6) => {
        setRooms(prev => [...prev, {
            id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name,
            lengthM: 0,
            widthM: 0,
            heightM: height,
        }]);
    };

    const updateRoom = (id: string, updates: Partial<FloorplanRoom>) => {
        setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const removeRoom = (id: string) => {
        setRooms(prev => prev.filter(r => r.id !== id));
    };

    // ---- PUSH TO ZONE MANAGER ----
    const pushToZones = () => {
        const filledRooms = rooms.filter(r => r.name && (r.lengthM > 0 || r.widthM > 0));
        if (filledRooms.length === 0) return;

        const newZones: Zone[] = filledRooms.map((room, i) => computeZoneMetrics({
            id: `zone-fp-${Date.now()}-${i}`,
            name: room.name,
            colour: ZONE_COLOURS[i % ZONE_COLOURS.length],
            dimensions: {
                lengthM: room.lengthM || undefined,
                widthM: room.widthM || undefined,
                heightM: room.heightM || 2.7,
            },
        }));

        // Also write directly to localStorage for the builder to pick up
        try {
            const existing = localStorage.getItem('quote-builder-zones');
            const existingZones: Zone[] = existing ? JSON.parse(existing) : [];
            const merged = [...existingZones, ...newZones];
            localStorage.setItem('quote-builder-zones', JSON.stringify(merged));
        } catch (e) {
            console.error('Failed to merge zones', e);
        }

        onRoomsToZones?.(newZones);
    };

    const totalRoomArea = rooms.reduce((sum, r) => sum + (r.lengthM * r.widthM), 0);

    // ---- RENDER ----
    return (
        <div className="mb-4">
            <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200">
                {/* Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-indigo-50 via-white to-violet-50 hover:from-indigo-100 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm shadow-md">
                            
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900 text-sm">
                                {data.clientName || 'New Prospect'}
                                {data.propertyType && (
                                    <span className="ml-2 text-xs font-normal text-gray-400">
                                        {data.propertyType.toUpperCase()} {data.unitNumber && ` ${data.unitNumber}`}
                                    </span>
                                )}
                            </h3>
                            <p className="text-[11px] text-gray-400">
                                Client details  Property info  Floorplan
                            </p>
                        </div>
                    </div>
                    <span className="text-gray-400 text-xs">
                        {isExpanded ? '' : ''}
                    </span>
                </button>

                {isExpanded && (
                    <div className="border-t border-gray-100">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100">
                            {[
                                { key: 'client' as const, label: ' Client', },
                                { key: 'property' as const, label: ' Property', },
                                { key: 'floorplan' as const, label: ' Floorplan', badge: rooms.length > 0 ? rooms.length : undefined },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 py-2.5 text-xs font-medium transition-all relative ${activeTab === tab.key
                                            ? 'text-indigo-700 bg-indigo-50/50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.label}
                                    {tab.badge && (
                                        <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold">
                                            {tab.badge}
                                        </span>
                                    )}
                                    {activeTab === tab.key && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="p-4">
                            {/* ============ CLIENT TAB ============ */}
                            {activeTab === 'client' && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">Client Name</label>
                                            <input
                                                type="text"
                                                value={data.clientName}
                                                onChange={e => update('clientName', e.target.value)}
                                                placeholder="John & Jane Tan"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                value={data.phone}
                                                onChange={e => update('phone', e.target.value)}
                                                placeholder="+65 8123 4567"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => update('email', e.target.value)}
                                                placeholder="john@email.com"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">Address</label>
                                            <input
                                                type="text"
                                                value={data.address}
                                                onChange={e => update('address', e.target.value)}
                                                placeholder="123 Tampines St 45, #12-345"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                                            />
                                        </div>
                                    </div>
                                    {/* Project section */}
                                    <div className="pt-2 border-t border-gray-100">
                                        <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Project</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-500 mb-1">Reno Type</label>
                                                <select
                                                    value={data.renovationType}
                                                    onChange={e => update('renovationType', e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:border-indigo-400"
                                                >
                                                    <option value="full">Full Renovation</option>
                                                    <option value="partial">Partial Reno</option>
                                                    <option value="touchup">Touch-Up / Minor</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-500 mb-1">Budget Range</label>
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        value={data.budgetMin ?? ''}
                                                        onChange={e => update('budgetMin', e.target.value ? Number(e.target.value) : null)}
                                                        placeholder="Min"
                                                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:border-indigo-400"
                                                    />
                                                    <span className="text-gray-300 text-xs"></span>
                                                    <input
                                                        type="number"
                                                        value={data.budgetMax ?? ''}
                                                        onChange={e => update('budgetMax', e.target.value ? Number(e.target.value) : null)}
                                                        placeholder="Max"
                                                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:border-indigo-400"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-gray-500 mb-1">Move-in Date</label>
                                                <input
                                                    type="date"
                                                    value={data.moveInDate}
                                                    onChange={e => update('moveInDate', e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:border-indigo-400"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">Special Requirements / Notes</label>
                                            <textarea
                                                value={data.specialRequirements}
                                                onChange={e => update('specialRequirements', e.target.value)}
                                                placeholder="e.g. Client prefers Scandinavian style, needs wheelchair-accessible bathroom, wants to keep existing kitchen cabinets..."
                                                rows={2}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ============ PROPERTY TAB ============ */}
                            {activeTab === 'property' && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-4 gap-2">
                                        {(['hdb', 'condo', 'landed', 'commercial'] as const).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => update('propertyType', type)}
                                                className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${data.propertyType === type
                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                                                    }`}
                                            >
                                                {type === 'hdb' ? ' HDB' : type === 'condo' ? '️ Condo' : type === 'landed' ? ' Landed' : ' Commercial'}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">Unit No.</label>
                                            <input
                                                type="text"
                                                value={data.unitNumber}
                                                onChange={e => update('unitNumber', e.target.value)}
                                                placeholder="#12-345"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">Floor Area (sqft)</label>
                                            <input
                                                type="number"
                                                value={data.floorArea ?? ''}
                                                onChange={e => update('floorArea', e.target.value ? Number(e.target.value) : null)}
                                                placeholder="1,000"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">Rooms</label>
                                            <div className="flex gap-2">
                                                <div className="flex items-center gap-1 flex-1">
                                                    <span className="text-[10px] text-gray-400"></span>
                                                    <input
                                                        type="number"
                                                        value={data.numBedrooms}
                                                        onChange={e => update('numBedrooms', parseInt(e.target.value) || 0)}
                                                        min={0}
                                                        max={10}
                                                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:border-indigo-400"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1 flex-1">
                                                    <span className="text-[10px] text-gray-400"></span>
                                                    <input
                                                        type="number"
                                                        value={data.numBathrooms}
                                                        onChange={e => update('numBathrooms', parseInt(e.target.value) || 0)}
                                                        min={0}
                                                        max={10}
                                                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:border-indigo-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ============ FLOORPLAN TAB ============ */}
                            {activeTab === 'floorplan' && (
                                <div className="space-y-4">
                                    {/* Upload zone */}
                                    {!data.floorplanImage ? (
                                        <div
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging
                                                    ? 'border-indigo-400 bg-indigo-50'
                                                    : 'border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30'
                                                }`}
                                        >
                                            <div className="text-4xl mb-2"></div>
                                            <p className="font-medium text-gray-700 text-sm">Drop floorplan here or click to upload</p>
                                            <p className="text-xs text-gray-400 mt-1">JPEG, PNG  Max 10MB</p>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(file);
                                                }}
                                                className="hidden"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            {/* Floorplan image */}
                                            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                                                <img
                                                    src={data.floorplanImage}
                                                    alt="Floorplan"
                                                    className="w-full h-auto max-h-[400px] object-contain"
                                                />
                                                <button
                                                    onClick={() => update('floorplanImage', null)}
                                                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                                                    title="Remove floorplan"
                                                >
                                                    
                                                </button>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="absolute top-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-medium text-gray-700 hover:bg-white shadow-md"
                                                >
                                                     Replace
                                                </button>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleFileUpload(file);
                                                    }}
                                                    className="hidden"
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1 text-center">
                                                Use this floorplan as reference to add rooms below
                                            </p>
                                        </div>
                                    )}

                                    {/* Room annotation section */}
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-semibold text-gray-700"> Room Dimensions</h4>
                                                {totalRoomArea > 0 && (
                                                    <span className="text-[10px] text-gray-400 font-mono">
                                                        {totalRoomArea.toFixed(1)} sqm total
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowRoomPicker(!showRoomPicker)}
                                                        className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[11px] font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                                                    >
                                                        + Quick Add
                                                    </button>
                                                    {showRoomPicker && (
                                                        <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-[240px] overflow-y-auto">
                                                            <div className="p-1.5">
                                                                {(COMMON_ROOMS[data.propertyType] || COMMON_ROOMS.hdb).map((room, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => { addRoom(room.name, room.h); setShowRoomPicker(false); }}
                                                                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                                                                    >
                                                                        {room.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => addRoom('', 2.6)}
                                                    className="px-2.5 py-1 border border-gray-300 rounded-lg text-[11px] font-medium hover:bg-gray-50 transition-colors"
                                                >
                                                    + Custom
                                                </button>
                                            </div>
                                        </div>

                                        {rooms.length === 0 ? (
                                            <div className="py-6 text-center text-gray-400 text-xs">
                                                <p>No rooms added yet.</p>
                                                <p className="mt-1">Use &ldquo;Quick Add&rdquo; to add common rooms, or &ldquo;Custom&rdquo; for any room.</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-100">
                                                {/* Header row */}
                                                <div className="grid grid-cols-[1fr,80px,80px,80px,70px,32px] gap-1 px-3 py-1.5 bg-gray-50 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                                                    <span>Room</span>
                                                    <span className="text-center">L (m)</span>
                                                    <span className="text-center">W (m)</span>
                                                    <span className="text-center">H (m)</span>
                                                    <span className="text-center">Area</span>
                                                    <span></span>
                                                </div>
                                                {rooms.map((room) => (
                                                    <div key={room.id} className="grid grid-cols-[1fr,80px,80px,80px,70px,32px] gap-1 px-3 py-1.5 items-center hover:bg-indigo-50/30">
                                                        <input
                                                            type="text"
                                                            value={room.name}
                                                            onChange={e => updateRoom(room.id, { name: e.target.value })}
                                                            placeholder="Room name"
                                                            className="border border-gray-200 rounded px-2 py-1 text-xs focus:border-indigo-400"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={room.lengthM || ''}
                                                            onChange={e => updateRoom(room.id, { lengthM: parseFloat(e.target.value) || 0 })}
                                                            placeholder=""
                                                            step="0.1"
                                                            className="border border-gray-200 rounded px-2 py-1 text-xs text-center focus:border-indigo-400"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={room.widthM || ''}
                                                            onChange={e => updateRoom(room.id, { widthM: parseFloat(e.target.value) || 0 })}
                                                            placeholder=""
                                                            step="0.1"
                                                            className="border border-gray-200 rounded px-2 py-1 text-xs text-center focus:border-indigo-400"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={room.heightM || ''}
                                                            onChange={e => updateRoom(room.id, { heightM: parseFloat(e.target.value) || 0 })}
                                                            placeholder="2.6"
                                                            step="0.1"
                                                            className="border border-gray-200 rounded px-2 py-1 text-xs text-center focus:border-indigo-400"
                                                        />
                                                        <span className="text-[11px] text-gray-500 font-mono text-center">
                                                            {room.lengthM > 0 && room.widthM > 0
                                                                ? `${(room.lengthM * room.widthM).toFixed(1)}`
                                                                : ''
                                                            }
                                                            <span className="text-[9px] text-gray-300 ml-0.5">sqm</span>
                                                        </span>
                                                        <button
                                                            onClick={() => removeRoom(room.id)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors text-center"
                                                        >
                                                            
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Push to zones */}
                                        {rooms.length > 0 && (
                                            <div className="px-3 py-2.5 bg-gradient-to-r from-indigo-50 to-violet-50 border-t border-gray-200">
                                                <button
                                                    onClick={pushToZones}
                                                    className="w-full py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                                                >
                                                     Apply {rooms.filter(r => r.name && (r.lengthM > 0 || r.widthM > 0)).length} Rooms to Zone Manager
                                                </button>
                                                <p className="text-[10px] text-gray-400 text-center mt-1">
                                                    This will add these rooms as zones with dimensions
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
