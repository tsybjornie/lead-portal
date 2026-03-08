/**
 * MaterialSearch — Encyclopedia Browser (Sequence Design System)
 * Matches the Sequence page aesthetic: light theme, white cards, colored badges
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
    STONE_TYPES, STONE_NAMES,
    WOOD_SPECIES,
    TILE_ENCYCLOPEDIA,
    PAINT_BRANDS,
    METAL_MATERIALS, METAL_FINISHES,
    WALLPAPER_TYPES,
    PEDIGREE_FURNITURE,
    CRAFT_HERITAGE,
    LIGHTING_DESIGNS,
    CABINET_TIERS,
    COUNTERTOP_EDGE_PROFILES,
    WALL_FINISHES,
    CURTAIN_STYLES, BLIND_TYPES,
} from '@/data/encyclopedia';
import type { MaterialEntry, SupplierInfo } from '@/data/encyclopedia/core';
import { ENCYCLOPEDIA_CATEGORIES, type EncyclopediaCategory } from '@/lib/materialBridge';

// ── Design tokens (matching Sequence page) ──
const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const mono = "'JetBrains Mono', 'SF Mono', monospace";

const catColors: Record<string, { bg: string; color: string; accent: string }> = {
    stone: { bg: '#EDE9FE', color: '#7C3AED', accent: '#8B5CF6' },
    wood: { bg: '#FEF3C7', color: '#92400E', accent: '#F59E0B' },
    tiles: { bg: '#DBEAFE', color: '#1E40AF', accent: '#3B82F6' },
    paint: { bg: '#FEF3C7', color: '#92400E', accent: '#F97316' },
    cabinetry: { bg: '#F3E8FF', color: '#6B21A8', accent: '#9333EA' },
    countertops: { bg: '#E0E7FF', color: '#3730A3', accent: '#6366F1' },
    wallpaper: { bg: '#FCE7F3', color: '#9D174D', accent: '#EC4899' },
    metal: { bg: '#F1F5F9', color: '#334155', accent: '#64748B' },
    lighting: { bg: '#FEF9C3', color: '#854D0E', accent: '#F59E0B' },
    furniture: { bg: '#FEF3C7', color: '#92400E', accent: '#D97706' },
    craft: { bg: '#ECFDF5', color: '#065F46', accent: '#10B981' },
    soft: { bg: '#FFF1F2', color: '#9F1239', accent: '#F43F5E' },
    wall: { bg: '#F0FDF4', color: '#166534', accent: '#22C55E' },
    all: { bg: '#F7F6F3', color: '#37352F', accent: '#37352F' },
};

// ============================================================
// SEARCHABLE ITEM TYPE
// ============================================================

export interface SearchableItem {
    name: string;
    category: string;
    categoryKey: EncyclopediaCategory;
    origin?: string;
    priceTier?: string;
    characteristics?: string;
    imageUrl?: string;
    supplierInfo?: SupplierInfo;
    raw: unknown;
}

interface MaterialSearchProps {
    onSelectMaterial?: (item: SearchableItem) => void;
    onAddToQuote?: (item: SearchableItem, room: string, quantity: string) => void;
}

// ============================================================
// DATA AGGREGATION
// ============================================================

function buildSearchableItems(): SearchableItem[] {
    const items: SearchableItem[] = [];

    // Stone Names
    if (STONE_NAMES && Array.isArray(STONE_NAMES)) {
        STONE_NAMES.forEach((entry: MaterialEntry) => {
            items.push({ name: entry.name, category: 'Natural Stone', categoryKey: 'stone', origin: entry.origin, priceTier: entry.priceTier, characteristics: entry.characteristics, imageUrl: entry.imageUrl, supplierInfo: entry.primarySupplier, raw: entry });
        });
    }

    // Stone Types (simple strings)
    if (STONE_TYPES && Array.isArray(STONE_TYPES)) {
        STONE_TYPES.forEach((name: string) => {
            if (!items.find(i => i.name === name && i.categoryKey === 'stone')) {
                items.push({ name, category: 'Natural Stone', categoryKey: 'stone', raw: { name } });
            }
        });
    }

    // Wood Species
    if (WOOD_SPECIES && Array.isArray(WOOD_SPECIES)) {
        WOOD_SPECIES.forEach((entry: MaterialEntry) => {
            items.push({ name: entry.name, category: 'Wood Species', categoryKey: 'wood', origin: entry.origin, characteristics: entry.characteristics, imageUrl: entry.imageUrl, raw: entry });
        });
    }

    // Tiles
    if (TILE_ENCYCLOPEDIA && Array.isArray(TILE_ENCYCLOPEDIA)) {
        TILE_ENCYCLOPEDIA.forEach((entry: { name: string; size?: string; characteristics?: string; costRange?: string }) => {
            items.push({ name: entry.name, category: 'Tiles', categoryKey: 'tiles', characteristics: entry.characteristics || entry.size, priceTier: entry.costRange, raw: entry });
        });
    }

    // Paint Brands
    if (PAINT_BRANDS && Array.isArray(PAINT_BRANDS)) {
        PAINT_BRANDS.forEach((entry) => {
            items.push({ name: entry.name, category: 'Paint', categoryKey: 'paint', origin: entry.brandCountry, characteristics: entry.characteristics, priceTier: entry.priceRange, raw: entry });
        });
    }

    // Metal Materials
    if (METAL_MATERIALS && Array.isArray(METAL_MATERIALS)) {
        METAL_MATERIALS.forEach((name: string) => { items.push({ name, category: 'Metals', categoryKey: 'metal', raw: { name } }); });
    }
    if (METAL_FINISHES && Array.isArray(METAL_FINISHES)) {
        METAL_FINISHES.forEach((name: string) => { items.push({ name, category: 'Metal Finishes', categoryKey: 'metal', raw: { name } }); });
    }

    // Wallpaper
    if (WALLPAPER_TYPES && Array.isArray(WALLPAPER_TYPES)) {
        WALLPAPER_TYPES.forEach((name: string) => { items.push({ name, category: 'Wallpaper', categoryKey: 'wallpaper', raw: { name } }); });
    }

    // Furniture
    if (PEDIGREE_FURNITURE && Array.isArray(PEDIGREE_FURNITURE)) {
        PEDIGREE_FURNITURE.forEach((entry: { name: string; designer?: string; year?: string | number; origin?: string; characteristics?: string }) => {
            items.push({ name: entry.name, category: 'Furniture', categoryKey: 'furniture', origin: entry.origin || (entry.designer ? `${entry.designer}` : undefined), characteristics: entry.characteristics, raw: entry });
        });
    }

    // Craft Heritage
    if (CRAFT_HERITAGE && Array.isArray(CRAFT_HERITAGE)) {
        CRAFT_HERITAGE.forEach((entry: { name: string; origin?: string; characteristics?: string; region?: string }) => {
            items.push({ name: entry.name, category: 'Craft Heritage', categoryKey: 'craft', origin: entry.origin || entry.region, characteristics: entry.characteristics, raw: entry });
        });
    }

    // Lighting
    if (LIGHTING_DESIGNS && Array.isArray(LIGHTING_DESIGNS)) {
        LIGHTING_DESIGNS.forEach((entry: { name: string; designer?: string; year?: string | number; characteristics?: string }) => {
            items.push({ name: entry.name, category: 'Lighting', categoryKey: 'lighting', origin: entry.designer || undefined, characteristics: entry.characteristics, raw: entry });
        });
    }

    // Cabinet Tiers
    if (CABINET_TIERS && Array.isArray(CABINET_TIERS)) {
        CABINET_TIERS.forEach((entry: { tier: string; label: string; pricePerLM?: string; description?: string }) => {
            items.push({ name: `${entry.label} Cabinetry`, category: 'Cabinetry', categoryKey: 'cabinetry', priceTier: entry.pricePerLM, characteristics: entry.description, raw: entry });
        });
    }

    // Countertops
    if (COUNTERTOP_EDGE_PROFILES && Array.isArray(COUNTERTOP_EDGE_PROFILES)) {
        COUNTERTOP_EDGE_PROFILES.forEach((entry: { name: string; characteristics?: string; description?: string }) => {
            items.push({ name: entry.name, category: 'Countertops', categoryKey: 'countertops', characteristics: entry.characteristics || entry.description, raw: entry });
        });
    }

    // Wall Finishes
    if (WALL_FINISHES && Array.isArray(WALL_FINISHES)) {
        WALL_FINISHES.forEach((entry: { name: string; characteristics?: string; description?: string; costRange?: string }) => {
            items.push({ name: entry.name, category: 'Wall Finishes', categoryKey: 'wall', characteristics: entry.characteristics || entry.description, priceTier: entry.costRange, raw: entry });
        });
    }

    // Soft Furnishings
    if (CURTAIN_STYLES && Array.isArray(CURTAIN_STYLES)) {
        CURTAIN_STYLES.forEach((name: string) => { items.push({ name, category: 'Soft Furnishing', categoryKey: 'soft', raw: { name } }); });
    }
    if (BLIND_TYPES && Array.isArray(BLIND_TYPES)) {
        BLIND_TYPES.forEach((name: string) => { items.push({ name, category: 'Soft Furnishing', categoryKey: 'soft', raw: { name } }); });
    }

    return items;
}

// ============================================================
// COMPONENT
// ============================================================

export default function MaterialSearch({ onSelectMaterial, onAddToQuote }: MaterialSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<EncyclopediaCategory>('all');
    const [selectedItem, setSelectedItem] = useState<SearchableItem | null>(null);
    const [addRoom, setAddRoom] = useState('');
    const [addQuantity, setAddQuantity] = useState('');

    const allItems = useMemo(() => buildSearchableItems(), []);

    const filteredItems = useMemo(() => {
        let results = allItems;
        if (activeCategory !== 'all') {
            results = results.filter(item => item.categoryKey === activeCategory);
        }
        if (searchQuery.trim()) {
            const words = searchQuery.toLowerCase().split(/\s+/);
            results = results.filter(item => {
                const searchText = `${item.name} ${item.category} ${item.origin || ''} ${item.characteristics || ''} ${item.priceTier || ''}`.toLowerCase();
                return words.every(word => searchText.includes(word));
            });
        }
        return results;
    }, [allItems, activeCategory, searchQuery]);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { all: allItems.length };
        allItems.forEach(item => { counts[item.categoryKey] = (counts[item.categoryKey] || 0) + 1; });
        return counts;
    }, [allItems]);

    const handleSelectItem = useCallback((item: SearchableItem) => {
        setSelectedItem(prev => prev?.name === item.name && prev?.categoryKey === item.categoryKey ? null : item);
        onSelectMaterial?.(item);
    }, [onSelectMaterial]);

    const handleAddToQuote = useCallback(() => {
        if (selectedItem && onAddToQuote && addRoom) {
            onAddToQuote(selectedItem, addRoom, addQuantity);
            setSelectedItem(null);
            setAddRoom('');
            setAddQuantity('');
        }
    }, [selectedItem, onAddToQuote, addRoom, addQuantity]);

    return (
        <div style={{ fontFamily: f }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: 0 }}>Material Encyclopedia</h2>
                    <p style={{ fontSize: 12, color: '#9B9A97', margin: '4px 0 0' }}>
                        {allItems.length} materials across {ENCYCLOPEDIA_CATEGORIES.length - 1} categories
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Search materials... (e.g. marble, teak, herringbone, tropical)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%', padding: '10px 16px', fontSize: 13,
                        border: '1px solid #E9E9E7', borderRadius: 8,
                        outline: 'none', fontFamily: f, background: '#fff',
                        boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#37352F'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#E9E9E7'; }}
                />
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
                {ENCYCLOPEDIA_CATEGORIES.map(cat => {
                    const isActive = activeCategory === cat.key;
                    const count = categoryCounts[cat.key] || 0;
                    if (count === 0 && cat.key !== 'all') return null;
                    return (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            style={{
                                padding: '5px 12px', fontSize: 11,
                                fontWeight: isActive ? 700 : 400,
                                background: isActive ? '#37352F' : '#F7F6F3',
                                color: isActive ? '#fff' : '#6B6A67',
                                border: 'none', borderRadius: 20,
                                cursor: 'pointer', fontFamily: 'inherit',
                            }}
                        >
                            {cat.icon} {cat.label} <span style={{ opacity: 0.7, fontSize: 10 }}>({count})</span>
                        </button>
                    );
                })}
            </div>

            {/* Results Count */}
            {searchQuery && (
                <div style={{ fontSize: 11, color: '#9B9A97', marginBottom: 12 }}>
                    {filteredItems.length} results for &ldquo;{searchQuery}&rdquo;
                </div>
            )}

            {/* Material Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {filteredItems.slice(0, 100).map((item, idx) => {
                    const isSelected = selectedItem?.name === item.name && selectedItem?.categoryKey === item.categoryKey;
                    const colors = catColors[item.categoryKey] || catColors.all;
                    return (
                        <div
                            key={`${item.categoryKey}-${item.name}-${idx}`}
                            onClick={() => handleSelectItem(item)}
                            style={{
                                background: '#fff',
                                border: isSelected ? `2px solid ${colors.accent}` : '1px solid #E9E9E7',
                                borderRadius: 10,
                                padding: isSelected ? 15 : 16,
                                cursor: 'pointer',
                                transition: 'box-shadow 0.15s, border-color 0.15s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            {/* Category badge */}
                            <div style={{ marginBottom: 8 }}>
                                <span style={{
                                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                                    letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4,
                                    background: colors.bg, color: colors.color,
                                }}>
                                    {item.category}
                                </span>
                            </div>

                            {/* Name */}
                            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#37352F', margin: '0 0 4px' }}>
                                {item.name}
                            </h3>

                            {/* Origin */}
                            {item.origin && (
                                <div style={{ fontSize: 10, color: '#9B9A97', marginBottom: 6 }}>
                                    📍 {item.origin}
                                </div>
                            )}

                            {/* Characteristics */}
                            {item.characteristics && (
                                <p style={{
                                    fontSize: 11, color: '#6B6A67', lineHeight: 1.5,
                                    margin: '0 0 8px',
                                    overflow: 'hidden', textOverflow: 'ellipsis',
                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                }}>
                                    {item.characteristics}
                                </p>
                            )}

                            {/* Price tier */}
                            {item.priceTier && (
                                <div style={{
                                    paddingTop: 8, borderTop: '1px solid #F3F3F2',
                                    fontSize: 10,
                                }}>
                                    <span style={{ fontFamily: mono, fontWeight: 700, color: '#37352F' }}>
                                        {item.priceTier}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredItems.length > 100 && (
                <div style={{ textAlign: 'center', padding: 16, color: '#9B9A97', fontSize: 11 }}>
                    Showing first 100 of {filteredItems.length} results. Refine your search.
                </div>
            )}

            {filteredItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: '#9B9A97' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>No results for &ldquo;{searchQuery}&rdquo;</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>Try a different search term</div>
                </div>
            )}

            {/* Selected Item Detail Panel */}
            {selectedItem && (
                <div style={{
                    position: 'fixed', bottom: 0, left: 220, right: 0,
                    background: '#fff', borderTop: '1px solid #E9E9E7',
                    padding: '16px 32px',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
                    zIndex: 50,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                            <span style={{
                                fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                                letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4,
                                background: (catColors[selectedItem.categoryKey] || catColors.all).bg,
                                color: (catColors[selectedItem.categoryKey] || catColors.all).color,
                                marginRight: 8,
                            }}>
                                {selectedItem.category}
                            </span>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#37352F' }}>
                                {selectedItem.name}
                            </span>
                            {selectedItem.origin && (
                                <span style={{ fontSize: 11, color: '#9B9A97', marginLeft: 8 }}>
                                    {selectedItem.origin}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setSelectedItem(null)}
                            style={{ background: 'none', border: 'none', color: '#9B9A97', cursor: 'pointer', fontSize: 16, padding: 4 }}
                        >✕</button>
                    </div>

                    {selectedItem.characteristics && (
                        <p style={{ fontSize: 11, color: '#6B6A67', lineHeight: 1.5, margin: '0 0 12px', maxWidth: 600 }}>
                            {selectedItem.characteristics}
                        </p>
                    )}

                    {/* Add to Quote */}
                    {onAddToQuote && (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                            <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Room</div>
                                <select
                                    value={addRoom} onChange={(e) => setAddRoom(e.target.value)}
                                    style={{
                                        padding: '8px 12px', fontSize: 12, border: '1px solid #E9E9E7',
                                        borderRadius: 6, fontFamily: f, background: '#fff',
                                    }}
                                >
                                    <option value="">Select room</option>
                                    {['Master Bedroom', 'Bedroom 2', 'Living Room', 'Kitchen', 'Master Bathroom', 'Common Bathroom', 'Dining Area', 'Study Room', 'Balcony', 'Whole Unit'].map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Quantity</div>
                                <input
                                    type="text" placeholder="42 sqft" value={addQuantity}
                                    onChange={(e) => setAddQuantity(e.target.value)}
                                    style={{
                                        padding: '8px 12px', fontSize: 12, border: '1px solid #E9E9E7',
                                        borderRadius: 6, fontFamily: f, width: 100, boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleAddToQuote}
                                disabled={!addRoom}
                                style={{
                                    padding: '8px 16px', fontSize: 12, fontWeight: 700,
                                    background: addRoom ? '#37352F' : '#E9E9E7',
                                    color: addRoom ? '#fff' : '#9B9A97',
                                    border: 'none', borderRadius: 6,
                                    cursor: addRoom ? 'pointer' : 'not-allowed',
                                }}
                            >
                                + Add to Quote
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
