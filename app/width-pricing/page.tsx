'use client';

import React, { useState } from 'react';
import RoofNav from '@/components/RoofNav';

// ============================================================
// WIDTH PRICING CALCULATOR — Linear-ft/meter Based Pricing
// ============================================================

interface LineItem {
    id: string;
    label: string;
    material: string;
    ratePerMeter: number;
    lengthM: number;
    widthMm: number;
    wastePct: number;
}

const MATERIAL_RATES = [
    { name: 'Quartz Countertop (20mm)', rate: 280, unit: '/m', cat: 'Countertop' },
    { name: 'Quartz Countertop (30mm)', rate: 380, unit: '/m', cat: 'Countertop' },
    { name: 'Granite Countertop', rate: 320, unit: '/m', cat: 'Countertop' },
    { name: 'Solid Surface (Corian)', rate: 220, unit: '/m', cat: 'Countertop' },
    { name: 'Sintered Stone (Dekton)', rate: 450, unit: '/m', cat: 'Countertop' },
    { name: 'Marble (Carrara)', rate: 520, unit: '/m', cat: 'Countertop' },
    { name: 'Backsplash Tile (600×300)', rate: 65, unit: '/m', cat: 'Backsplash' },
    { name: 'Backsplash Glass Panel', rate: 120, unit: '/m', cat: 'Backsplash' },
    { name: 'Skirting (PVC)', rate: 8, unit: '/m', cat: 'Skirting' },
    { name: 'Skirting (Hardwood)', rate: 22, unit: '/m', cat: 'Skirting' },
    { name: 'Chair Rail Moulding', rate: 18, unit: '/m', cat: 'Moulding' },
    { name: 'Crown Moulding (Plaster)', rate: 35, unit: '/m', cat: 'Moulding' },
    { name: 'Vinyl Flooring', rate: 45, unit: '/sqm', cat: 'Flooring' },
    { name: 'Laminate Flooring', rate: 55, unit: '/sqm', cat: 'Flooring' },
    { name: 'Engineered Timber', rate: 120, unit: '/sqm', cat: 'Flooring' },
];

const DEMO_ITEMS: LineItem[] = [
    { id: 'W1', label: 'Kitchen Countertop — L-shape', material: 'Quartz Countertop (20mm)', ratePerMeter: 280, lengthM: 4.2, widthMm: 600, wastePct: 10 },
    { id: 'W2', label: 'Kitchen Backsplash', material: 'Backsplash Glass Panel', ratePerMeter: 120, lengthM: 3.5, widthMm: 600, wastePct: 5 },
    { id: 'W3', label: 'Island Countertop', material: 'Quartz Countertop (30mm)', ratePerMeter: 380, lengthM: 2.4, widthMm: 900, wastePct: 8 },
    { id: 'W4', label: 'Master Bath Vanity Top', material: 'Solid Surface (Corian)', ratePerMeter: 220, lengthM: 1.2, widthMm: 550, wastePct: 5 },
    { id: 'W5', label: 'Living Room Skirting', material: 'Skirting (Hardwood)', ratePerMeter: 22, lengthM: 18, widthMm: 80, wastePct: 10 },
];

export default function WidthPricingPage() {
    const [items, setItems] = useState(DEMO_ITEMS);
    const [compareMode, setCompareMode] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const calcItemCost = (item: LineItem) => {
        const baseCost = item.ratePerMeter * item.lengthM;
        const wasteCost = baseCost * (item.wastePct / 100);
        return baseCost + wasteCost;
    };

    const totalCost = items.reduce((s, i) => s + calcItemCost(i), 0);
    const totalLength = items.reduce((s, i) => s + i.lengthM, 0);

    const updateItem = (id: string, field: keyof LineItem, value: number | string) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    // Group materials by category
    const matCats = [...new Set(MATERIAL_RATES.map(m => m.cat))];

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            <RoofNav />
            <div style={{ padding: '20px 32px 80px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#37352F', margin: '0 0 4px' }}>Width Pricing Calculator</h1>
                        <p style={{ fontSize: 12, color: '#9B9A97', margin: 0 }}>Linear-meter pricing · Countertops · Backsplash · Skirting · Moulding</p>
                    </div>
                    <button onClick={() => setCompareMode(!compareMode)} style={{
                        padding: '8px 16px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: compareMode ? '#37352F' : '#F7F6F3', color: compareMode ? 'white' : '#37352F', fontFamily: f,
                    }}>{compareMode ? ' Close Compare' : ' Compare Materials'}</button>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
                    {[
                        { label: 'Total Cost', value: `$${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: '', color: '#16A34A', bg: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' },
                        { label: 'Line Items', value: items.length, icon: '', color: '#3B82F6', bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' },
                        { label: 'Total Length', value: `${totalLength.toFixed(1)}m`, icon: '', color: '#7C3AED', bg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' },
                        { label: 'Avg $/meter', value: `$${totalLength > 0 ? (totalCost / totalLength).toFixed(0) : 0}`, icon: '', color: '#EA580C', bg: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)' },
                    ].map(s => (
                        <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: 16, border: '1px solid rgba(0,0,0,0.04)' }}>
                            <span style={{ fontSize: 20 }}>{s.icon}</span>
                            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1, marginTop: 4 }}>{s.value}</div>
                            <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: compareMode ? '1fr 380px' : '1fr', gap: 16 }}>
                    {/* Main Table */}
                    <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                        {/* Header Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 100px 80px 80px 60px 100px', gap: 0, padding: '10px 16px', background: '#FAFAF9', borderBottom: '1px solid #E9E9E7' }}>
                            {['Item', 'Material', 'Rate/m', 'Length', 'Width', 'Waste', 'Total'].map(h => (
                                <span key={h} style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                            ))}
                        </div>

                        {/* Rows */}
                        {items.map((item, idx) => {
                            const cost = calcItemCost(item);
                            return (
                                <div key={item.id} style={{
                                    display: 'grid', gridTemplateColumns: '2fr 2fr 100px 80px 80px 60px 100px', gap: 0,
                                    padding: '10px 16px', borderBottom: '1px solid #F5F5F4', alignItems: 'center',
                                    transition: 'background 0.15s',
                                }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#FAFAF9')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <input value={item.label} onChange={e => updateItem(item.id, 'label', e.target.value)}
                                        style={{ fontSize: 12, fontWeight: 600, color: '#37352F', border: 'none', background: 'transparent', fontFamily: f, outline: 'none', width: '100%' }} />
                                    <select value={item.material} onChange={e => {
                                        const rate = MATERIAL_RATES.find(m => m.name === e.target.value);
                                        if (rate) {
                                            setItems(prev => prev.map(i => i.id === item.id ? { ...i, material: rate.name, ratePerMeter: rate.rate } : i));
                                        }
                                    }} style={{ fontSize: 10, color: '#6B6A67', border: '1px solid #E9E9E7', borderRadius: 4, padding: '4px 6px', fontFamily: f, background: 'white' }}>
                                        {MATERIAL_RATES.map(m => (
                                            <option key={m.name} value={m.name}>{m.name}</option>
                                        ))}
                                    </select>
                                    <span style={{ fontSize: 11, fontFamily: "'SF Mono', monospace", color: '#3B82F6', fontWeight: 600 }}>${item.ratePerMeter}/m</span>
                                    <input type="number" value={item.lengthM} step={0.1} onChange={e => updateItem(item.id, 'lengthM', parseFloat(e.target.value) || 0)}
                                        style={{ width: 60, fontSize: 11, fontFamily: "'SF Mono', monospace", border: '1px solid #E9E9E7', borderRadius: 4, padding: '4px 6px', textAlign: 'center' }} />
                                    <input type="number" value={item.widthMm} step={10} onChange={e => updateItem(item.id, 'widthMm', parseInt(e.target.value) || 0)}
                                        style={{ width: 60, fontSize: 11, fontFamily: "'SF Mono', monospace", border: '1px solid #E9E9E7', borderRadius: 4, padding: '4px 6px', textAlign: 'center' }} />
                                    <span style={{ fontSize: 10, color: '#9B9A97' }}>{item.wastePct}%</span>
                                    <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "'SF Mono', monospace", color: '#16A34A' }}>${cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                            );
                        })}

                        {/* Add Row */}
                        <div style={{ padding: '10px 16px' }}>
                            <button onClick={() => {
                                setItems(prev => [...prev, {
                                    id: `W${Date.now()}`, label: 'New Item', material: MATERIAL_RATES[0].name,
                                    ratePerMeter: MATERIAL_RATES[0].rate, lengthM: 1, widthMm: 600, wastePct: 5,
                                }]);
                            }} style={{
                                padding: '8px 16px', fontSize: 11, fontWeight: 600, borderRadius: 8, border: '1px dashed #E9E9E7',
                                background: 'transparent', cursor: 'pointer', color: '#9B9A97', fontFamily: f, width: '100%',
                            }}>+ Add Item</button>
                        </div>

                        {/* Total Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: '#FAFAF9', borderTop: '2px solid #E9E9E7' }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>Total ({items.length} items · {totalLength.toFixed(1)}m)</span>
                            <span style={{ fontSize: 16, fontWeight: 900, fontFamily: "'SF Mono', monospace", color: '#16A34A' }}>${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>

                    {/* Compare Panel */}
                    {compareMode && (
                        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', padding: 16 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}> Material Rate Comparison</div>
                            {matCats.map(cat => (
                                <div key={cat} style={{ marginBottom: 14 }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: '#37352F', marginBottom: 6 }}>{cat}</div>
                                    {MATERIAL_RATES.filter(m => m.cat === cat).sort((a, b) => a.rate - b.rate).map(m => {
                                        const maxRate = Math.max(...MATERIAL_RATES.filter(x => x.cat === cat).map(x => x.rate));
                                        const pct = maxRate > 0 ? (m.rate / maxRate * 100) : 0;
                                        return (
                                            <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, cursor: 'pointer' }}
                                                onClick={() => setSelectedMaterial(m.name)}>
                                                <span style={{ fontSize: 10, color: '#6B6A67', width: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</span>
                                                <div style={{ flex: 1, height: 8, background: '#F5F5F4', borderRadius: 4, overflow: 'hidden' }}>
                                                    <div style={{
                                                        height: '100%', borderRadius: 4,
                                                        background: pct > 80 ? '#EF4444' : pct > 50 ? '#F59E0B' : '#22C55E',
                                                        width: `${pct}%`, transition: 'width 0.3s',
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'SF Mono', monospace", color: '#37352F', width: 60, textAlign: 'right' }}>${m.rate}{m.unit}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
