'use client';

import React, { useState } from 'react';
import { MapPin, Plus, X, ChevronDown, ChevronUp, Ruler, Grid3X3, Copy } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

export interface Zone {
    id: string;
    name: string;
    colour: string;
    dimensions?: {
        lengthM?: number;   // metres
        widthM?: number;    // metres
        heightM?: number;   // metres (defaults to 2.7)
    };
    // 6-sided cube measurements
    surfaces?: {
        floorSqm: number;       // L × W
        ceilingSqm: number;     // L × W (same as floor)
        wallASqm: number;       // Wall A  long wall (L × H)
        wallBSqm: number;       // Wall B  long wall opposite (L × H)
        wallCSqm: number;       // Wall C  short wall (W × H)
        wallDSqm: number;       // Wall D  short wall opposite (W × H)
        totalWallSqm: number;   // A + B + C + D
        totalSurfaceSqm: number; // floor + ceiling + all walls
    };
    computedAreaSqm?: number;   // floor area (L × W)
    computedPerimeterM?: number;
    notes?: string;
}

const ZONE_COLOURS = [
    '#3B82F6', // blue
    '#10B981', // emerald
    '#F59E0B', // amber
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
    '#84CC16', // lime
    '#EF4444', // red
    '#6366F1', // indigo
];

// Quick presets for common property types
const ZONE_PRESETS: Record<string, { name: string; dims?: { lengthM: number; widthM: number; heightM: number } }[]> = {
    'HDB 3-Room': [
        { name: 'Living / Dining', dims: { lengthM: 5.5, widthM: 3.5, heightM: 2.6 } },
        { name: 'Kitchen', dims: { lengthM: 2.8, widthM: 2.0, heightM: 2.6 } },
        { name: 'Master Bedroom', dims: { lengthM: 3.5, widthM: 3.0, heightM: 2.6 } },
        { name: 'Bedroom 2', dims: { lengthM: 3.0, widthM: 2.8, heightM: 2.6 } },
        { name: 'Master Bathroom', dims: { lengthM: 2.0, widthM: 1.5, heightM: 2.4 } },
        { name: 'Common Bathroom', dims: { lengthM: 1.8, widthM: 1.5, heightM: 2.4 } },
        { name: 'Service Yard', dims: { lengthM: 1.5, widthM: 1.2, heightM: 2.6 } },
        { name: 'Entrance / Foyer' },
    ],
    'HDB 4-Room': [
        { name: 'Living / Dining', dims: { lengthM: 6.5, widthM: 3.8, heightM: 2.6 } },
        { name: 'Kitchen', dims: { lengthM: 3.0, widthM: 2.2, heightM: 2.6 } },
        { name: 'Master Bedroom', dims: { lengthM: 3.8, widthM: 3.2, heightM: 2.6 } },
        { name: 'Bedroom 2', dims: { lengthM: 3.2, widthM: 2.8, heightM: 2.6 } },
        { name: 'Bedroom 3', dims: { lengthM: 2.8, widthM: 2.5, heightM: 2.6 } },
        { name: 'Master Bathroom', dims: { lengthM: 2.2, widthM: 1.6, heightM: 2.4 } },
        { name: 'Common Bathroom', dims: { lengthM: 2.0, widthM: 1.5, heightM: 2.4 } },
        { name: 'Yard / Service Area', dims: { lengthM: 1.8, widthM: 1.2, heightM: 2.6 } },
        { name: 'Bomb Shelter', dims: { lengthM: 1.6, widthM: 1.4, heightM: 2.6 } },
        { name: 'Entrance / Foyer' },
    ],
    'HDB 5-Room': [
        { name: 'Living Room', dims: { lengthM: 5.5, widthM: 4.0, heightM: 2.6 } },
        { name: 'Dining Area', dims: { lengthM: 3.5, widthM: 3.0, heightM: 2.6 } },
        { name: 'Kitchen', dims: { lengthM: 3.2, widthM: 2.5, heightM: 2.6 } },
        { name: 'Master Bedroom', dims: { lengthM: 4.0, widthM: 3.5, heightM: 2.6 } },
        { name: 'Bedroom 2', dims: { lengthM: 3.2, widthM: 3.0, heightM: 2.6 } },
        { name: 'Bedroom 3', dims: { lengthM: 3.0, widthM: 2.8, heightM: 2.6 } },
        { name: 'Study / Bedroom 4', dims: { lengthM: 2.8, widthM: 2.5, heightM: 2.6 } },
        { name: 'Master Bathroom', dims: { lengthM: 2.5, widthM: 1.8, heightM: 2.4 } },
        { name: 'Common Bathroom', dims: { lengthM: 2.0, widthM: 1.5, heightM: 2.4 } },
        { name: 'Yard / Service Area', dims: { lengthM: 2.0, widthM: 1.5, heightM: 2.6 } },
        { name: 'Bomb Shelter', dims: { lengthM: 1.6, widthM: 1.4, heightM: 2.6 } },
        { name: 'Entrance / Foyer' },
    ],
    'Condo (2BR)': [
        { name: 'Living / Dining', dims: { lengthM: 5.5, widthM: 4.0, heightM: 2.8 } },
        { name: 'Kitchen', dims: { lengthM: 3.0, widthM: 2.5, heightM: 2.8 } },
        { name: 'Master Bedroom', dims: { lengthM: 4.0, widthM: 3.5, heightM: 2.8 } },
        { name: 'Bedroom 2', dims: { lengthM: 3.2, widthM: 3.0, heightM: 2.8 } },
        { name: 'Master Bathroom', dims: { lengthM: 2.5, widthM: 2.0, heightM: 2.6 } },
        { name: 'Common Bathroom', dims: { lengthM: 2.0, widthM: 1.5, heightM: 2.6 } },
        { name: 'Balcony', dims: { lengthM: 3.0, widthM: 1.5, heightM: 2.8 } },
        { name: 'Yard', dims: { lengthM: 1.5, widthM: 1.2, heightM: 2.8 } },
        { name: 'Entrance / Foyer' },
    ],
    'Commercial': [
        { name: 'Main Area' },
        { name: 'Back Office' },
        { name: 'Washroom' },
        { name: 'Storage' },
        { name: 'Frontage' },
    ],
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function generateZoneId(): string {
    return `zone-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
}

export function computeZoneMetrics(zone: Zone): Zone {
    const dims = zone.dimensions;
    if (!dims) return { ...zone, computedAreaSqm: undefined, computedPerimeterM: undefined, surfaces: undefined };

    const L = dims.lengthM || 0;
    const W = dims.widthM || 0;
    const H = dims.heightM || 0;

    const floor = L * W;
    const ceiling = L * W;
    const wallA = L * H;   // long wall
    const wallB = L * H;   // long wall opposite
    const wallC = W * H;   // short wall
    const wallD = W * H;   // short wall opposite
    const totalWall = wallA + wallB + wallC + wallD;
    const totalSurface = floor + ceiling + totalWall;
    const perimeter = (L && W) ? 2 * (L + W) : undefined;

    const surfaces = (L && W && H) ? {
        floorSqm: floor,
        ceilingSqm: ceiling,
        wallASqm: wallA,
        wallBSqm: wallB,
        wallCSqm: wallC,
        wallDSqm: wallD,
        totalWallSqm: totalWall,
        totalSurfaceSqm: totalSurface,
    } : undefined;

    return {
        ...zone,
        computedAreaSqm: floor || undefined,
        computedPerimeterM: perimeter,
        surfaces,
    };
}

// ============================================================
// ZONE MANAGER COMPONENT
// ============================================================

interface ZoneManagerProps {
    zones: Zone[];
    onZonesChange: (zones: Zone[]) => void;
}

export default function ZoneManager({ zones, onZonesChange }: ZoneManagerProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [newZoneName, setNewZoneName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showPresets, setShowPresets] = useState(false);

    // --- ADD ZONE ---
    const addZone = () => {
        if (!newZoneName.trim()) return;
        const colourIdx = zones.length % ZONE_COLOURS.length;
        const zone = computeZoneMetrics({
            id: generateZoneId(),
            name: newZoneName.trim(),
            colour: ZONE_COLOURS[colourIdx],
            dimensions: { heightM: 2.7 }, // default ceiling height
        });
        onZonesChange([...zones, zone]);
        setNewZoneName('');
    };

    // --- LOAD PRESET ---
    const loadPreset = (presetKey: string) => {
        const presetZones = ZONE_PRESETS[presetKey];
        if (!presetZones) return;

        const newZones = presetZones.map((p, i) => computeZoneMetrics({
            id: generateZoneId(),
            name: p.name,
            colour: ZONE_COLOURS[i % ZONE_COLOURS.length],
            dimensions: p.dims ? { lengthM: p.dims.lengthM, widthM: p.dims.widthM, heightM: p.dims.heightM } : { heightM: 2.7 },
        }));
        onZonesChange([...zones, ...newZones]);
        setShowPresets(false);
    };

    // --- UPDATE ZONE ---
    const updateZone = (id: string, updates: Partial<Zone>) => {
        onZonesChange(zones.map(z => {
            if (z.id !== id) return z;
            const updated = { ...z, ...updates };
            return computeZoneMetrics(updated);
        }));
    };

    // --- REMOVE ZONE ---
    const removeZone = (id: string) => {
        onZonesChange(zones.filter(z => z.id !== id));
    };

    // --- TOTAL AREA ---
    const totalArea = zones.reduce((sum, z) => sum + (z.computedAreaSqm || 0), 0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                        <h3 className="font-bold text-gray-900"> Zones</h3>
                        <p className="text-xs text-gray-500">
                            {zones.length} zone{zones.length !== 1 ? 's' : ''}
                            {totalArea > 0 && `  ${totalArea.toFixed(1)} sqm total`}
                        </p>
                    </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {isExpanded && (
                <div className="p-5 border-t border-gray-100">
                    {/* Quick Add Row */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newZoneName}
                            onChange={(e) => setNewZoneName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addZone()}
                            placeholder="Add zone (e.g. Kitchen, Feature Wall)..."
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        />
                        <button
                            onClick={addZone}
                            disabled={!newZoneName.trim()}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowPresets(!showPresets)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1"
                            >
                                <Copy className="w-4 h-4" /> Preset
                            </button>
                            {showPresets && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    {Object.keys(ZONE_PRESETS).map(key => (
                                        <button
                                            key={key}
                                            onClick={() => loadPreset(key)}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            {key}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Zone List */}
                    {zones.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 text-sm">
                            <Grid3X3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No zones yet. Add zones to organize your quote by location.</p>
                            <p className="text-xs mt-1">Try a preset like &ldquo;HDB 4-Room&rdquo; to get started quickly.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {zones.map(zone => (
                                <div
                                    key={zone.id}
                                    className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                                    style={{ borderLeftColor: zone.colour, borderLeftWidth: '4px' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span
                                                className="w-3 h-3 rounded-full shrink-0"
                                                style={{ backgroundColor: zone.colour }}
                                            />
                                            {editingId === zone.id ? (
                                                <input
                                                    type="text"
                                                    value={zone.name}
                                                    onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                                                    onBlur={() => setEditingId(null)}
                                                    onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                                                    autoFocus
                                                    className="flex-1 border border-blue-400 rounded px-2 py-0.5 text-sm font-medium focus:ring-1 focus:ring-blue-400"
                                                />
                                            ) : (
                                                <span
                                                    className="font-medium text-sm text-gray-900 cursor-pointer hover:text-blue-700 truncate"
                                                    onClick={() => setEditingId(zone.id)}
                                                    title="Click to rename"
                                                >
                                                    {zone.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {zone.computedAreaSqm && (
                                                <span className="text-xs text-gray-500 font-mono">
                                                    {zone.computedAreaSqm.toFixed(1)} sqm
                                                </span>
                                            )}
                                            <button
                                                onClick={() => removeZone(zone.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Inline Dimensions */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <Ruler className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                value={zone.dimensions?.lengthM || ''}
                                                onChange={(e) => updateZone(zone.id, {
                                                    dimensions: { ...zone.dimensions, lengthM: parseFloat(e.target.value) || undefined }
                                                })}
                                                placeholder="L"
                                                className="w-14 border border-gray-200 rounded px-1.5 py-0.5 text-xs text-center focus:border-blue-400"
                                                step="0.1"
                                            />
                                            <span className="text-gray-400 text-xs">×</span>
                                            <input
                                                type="number"
                                                value={zone.dimensions?.widthM || ''}
                                                onChange={(e) => updateZone(zone.id, {
                                                    dimensions: { ...zone.dimensions, widthM: parseFloat(e.target.value) || undefined }
                                                })}
                                                placeholder="W"
                                                className="w-14 border border-gray-200 rounded px-1.5 py-0.5 text-xs text-center focus:border-blue-400"
                                                step="0.1"
                                            />
                                            <span className="text-gray-400 text-xs">×</span>
                                            <input
                                                type="number"
                                                value={zone.dimensions?.heightM || ''}
                                                onChange={(e) => updateZone(zone.id, {
                                                    dimensions: { ...zone.dimensions, heightM: parseFloat(e.target.value) || undefined }
                                                })}
                                                placeholder="H"
                                                className="w-14 border border-gray-200 rounded px-1.5 py-0.5 text-xs text-center focus:border-blue-400"
                                                step="0.1"
                                            />
                                            <span className="text-[10px] text-gray-400 ml-1">m</span>
                                        </div>
                                    </div>

                                    {/* 6-Sided Surface Breakdown */}
                                    {zone.surfaces && (
                                        <div className="mt-2 space-y-1">
                                            {/* Row 1: Floor, Ceiling, All Walls, Total */}
                                            <div className="grid grid-cols-4 gap-1 text-[10px]">
                                                <div className="bg-blue-50 rounded px-1.5 py-1 text-center" title="Floor area (L × W)">
                                                    <div className="text-blue-400 font-medium">Floor</div>
                                                    <div className="text-blue-700 font-mono font-bold">{zone.surfaces.floorSqm.toFixed(1)}</div>
                                                </div>
                                                <div className="bg-purple-50 rounded px-1.5 py-1 text-center" title="Ceiling area (L × W)">
                                                    <div className="text-purple-400 font-medium">Ceiling</div>
                                                    <div className="text-purple-700 font-mono font-bold">{zone.surfaces.ceilingSqm.toFixed(1)}</div>
                                                </div>
                                                <div className="bg-orange-50 rounded px-1.5 py-1 text-center" title="Total wall area (all 4 walls)">
                                                    <div className="text-orange-400 font-medium">4 Walls</div>
                                                    <div className="text-orange-700 font-mono font-bold">{zone.surfaces.totalWallSqm.toFixed(1)}</div>
                                                </div>
                                                <div className="bg-gray-100 rounded px-1.5 py-1 text-center" title="All 6 surfaces combined">
                                                    <div className="text-gray-500 font-medium">6-Side</div>
                                                    <div className="text-gray-900 font-mono font-bold">{zone.surfaces.totalSurfaceSqm.toFixed(1)}</div>
                                                </div>
                                            </div>
                                            {/* Row 2: Individual walls A/B/C/D */}
                                            <div className="grid grid-cols-4 gap-1 text-[10px]">
                                                <div className="bg-green-50 rounded px-1.5 py-1 text-center" title={`Wall A: ${zone.dimensions?.lengthM}m × ${zone.dimensions?.heightM}m (long wall)`}>
                                                    <div className="text-green-400 font-medium">Wall A</div>
                                                    <div className="text-green-700 font-mono font-bold">{zone.surfaces.wallASqm.toFixed(1)}</div>
                                                    <div className="text-green-400">{zone.dimensions?.lengthM}×{zone.dimensions?.heightM}</div>
                                                </div>
                                                <div className="bg-green-50 rounded px-1.5 py-1 text-center" title={`Wall B: ${zone.dimensions?.lengthM}m × ${zone.dimensions?.heightM}m (long wall opposite)`}>
                                                    <div className="text-green-400 font-medium">Wall B</div>
                                                    <div className="text-green-700 font-mono font-bold">{zone.surfaces.wallBSqm.toFixed(1)}</div>
                                                    <div className="text-green-400">{zone.dimensions?.lengthM}×{zone.dimensions?.heightM}</div>
                                                </div>
                                                <div className="bg-amber-50 rounded px-1.5 py-1 text-center" title={`Wall C: ${zone.dimensions?.widthM}m × ${zone.dimensions?.heightM}m (short wall)`}>
                                                    <div className="text-amber-400 font-medium">Wall C</div>
                                                    <div className="text-amber-700 font-mono font-bold">{zone.surfaces.wallCSqm.toFixed(1)}</div>
                                                    <div className="text-amber-400">{zone.dimensions?.widthM}×{zone.dimensions?.heightM}</div>
                                                </div>
                                                <div className="bg-amber-50 rounded px-1.5 py-1 text-center" title={`Wall D: ${zone.dimensions?.widthM}m × ${zone.dimensions?.heightM}m (short wall opposite)`}>
                                                    <div className="text-amber-400 font-medium">Wall D</div>
                                                    <div className="text-amber-700 font-mono font-bold">{zone.surfaces.wallDSqm.toFixed(1)}</div>
                                                    <div className="text-amber-400">{zone.dimensions?.widthM}×{zone.dimensions?.heightM}</div>
                                                </div>
                                            </div>
                                            <div className="text-[9px] text-gray-400 text-right">sqm per surface</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Summary Bar */}
                    {zones.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                            <span>{zones.length} zones defined</span>
                            <span className="font-mono font-medium">
                                Total: {totalArea.toFixed(1)} sqm ({(totalArea * 10.764).toFixed(0)} sqft)
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
