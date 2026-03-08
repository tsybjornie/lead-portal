'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import RoofNav from '@/components/RoofNav';

/* ═══ MOCK DATA — Auto-extracted BOQ from SketchUp model ═══ */
const EXTRACTED_BOQ = [
    { id: 'B1', category: 'Carpentry', item: 'Kitchen Cabinet (Upper)', dims: '3200mm × 600mm × 900mm', qty: 1, unit: 'lot', unitPrice: 4200, material: 'Plywood + Laminate', confidence: 96 },
    { id: 'B2', category: 'Carpentry', item: 'Kitchen Cabinet (Lower)', dims: '3200mm × 600mm × 850mm', qty: 1, unit: 'lot', unitPrice: 5800, material: 'Plywood + Quartz Top', confidence: 94 },
    { id: 'B3', category: 'Carpentry', item: 'Wardrobe (Master BR)', dims: '2400mm × 600mm × 2400mm', qty: 1, unit: 'lot', unitPrice: 3600, material: 'Plywood + Veneer', confidence: 92 },
    { id: 'B4', category: 'Carpentry', item: 'TV Console + Feature Wall', dims: '3000mm × 400mm × 2100mm', qty: 1, unit: 'lot', unitPrice: 4500, material: 'Plywood + Laminate', confidence: 88 },
    { id: 'B5', category: 'Carpentry', item: 'Shoe Cabinet', dims: '1200mm × 350mm × 1000mm', qty: 1, unit: 'lot', unitPrice: 1200, material: 'Plywood + Laminate', confidence: 95 },
    { id: 'B6', category: 'Tiling', item: 'Living/Dining Floor Tiles', dims: '600×600 Porcelain', qty: 42, unit: 'sqm', unitPrice: 18, material: 'Porcelain 600×600', confidence: 91 },
    { id: 'B7', category: 'Tiling', item: 'Kitchen Floor + Wall Tiles', dims: '300×600 Ceramic', qty: 28, unit: 'sqm', unitPrice: 15, material: 'Ceramic 300×600', confidence: 89 },
    { id: 'B8', category: 'Tiling', item: 'Bathroom Tiles (×2)', dims: '300×300 Anti-slip', qty: 18, unit: 'sqm', unitPrice: 22, material: 'Anti-slip Ceramic', confidence: 87 },
    { id: 'B9', category: 'Painting', item: 'Whole Unit Painting', dims: '3-coat Nippon', qty: 1, unit: 'lot', unitPrice: 2200, material: 'Nippon Odourless', confidence: 97 },
    { id: 'B10', category: 'Electrical', item: 'Power Points (additional)', dims: '13A switched', qty: 12, unit: 'pts', unitPrice: 65, material: 'Schneider', confidence: 85 },
    { id: 'B11', category: 'Electrical', item: 'Lighting Points', dims: 'LED Downlight', qty: 18, unit: 'pts', unitPrice: 45, material: 'Philips LED', confidence: 83 },
    { id: 'B12', category: 'Plumbing', item: 'Bathroom Fittings (×2)', dims: 'Rain shower + mixer', qty: 2, unit: 'sets', unitPrice: 850, material: 'Grohe / American Std', confidence: 80 },
];

const MATERIAL_MAPPINGS = [
    { sketchupMat: 'Wood_Plywood_Birch', roofItem: 'Marine Plywood 18mm', vendor: 'Hoe Kee', pricePerSheet: 42, matched: true },
    { sketchupMat: 'Laminate_White_Matte', roofItem: 'Formica D/S Laminate (White)', vendor: 'Hoe Kee', pricePerSheet: 18, matched: true },
    { sketchupMat: 'Stone_Quartz_White', roofItem: 'Quartz Countertop (White)', vendor: 'Stone Amperor', pricePerSqft: 28, matched: true },
    { sketchupMat: 'Tile_Porcelain_Grey', roofItem: 'Porcelain 600×600 (Grey)', vendor: 'Hafary', pricePerSqm: 18, matched: true },
    { sketchupMat: 'Paint_White_Matte', roofItem: 'Nippon Odourless (White)', vendor: 'Nippon Paint SG', pricePerLitre: 8, matched: true },
    { sketchupMat: 'Metal_Chrome_Fixture', roofItem: null, vendor: null, pricePerSqft: null, matched: false },
];

const VERSIONS = [
    { id: 'V3', date: '7 Mar 2026', label: 'Final — client approved', size: '24.6 MB', status: 'approved', changes: 'Added feature wall detail, updated kitchen layout per client feedback' },
    { id: 'V2', date: '3 Mar 2026', label: 'Revised layout', size: '22.1 MB', status: 'superseded', changes: 'Moved bathroom door, enlarged master wardrobe' },
    { id: 'V1', date: '28 Feb 2026', label: 'Initial concept', size: '18.4 MB', status: 'superseded', changes: 'First design concept based on site measurement' },
];

export default function SketchUpPage() {
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', monospace";

    const [tab, setTab] = useState<'upload' | 'boq' | 'materials' | 'versions' | 'viewer'>('upload');
    const [uploaded, setUploaded] = useState(false);
    const [parsing, setParsing] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [viewMode, setViewMode] = useState<'plan' | 'front' | 'side' | 'iso' | 'persp'>('iso');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = () => {
        setParsing(true);
        setTimeout(() => {
            setParsing(false);
            setUploaded(true);
            setTab('boq');
        }, 2500);
    };

    const totalBOQ = EXTRACTED_BOQ.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
    const categories = [...new Set(EXTRACTED_BOQ.map(b => b.category))];

    const navLinks = [
        { label: 'Dashboard', href: '/admin', active: false },
        { label: 'Autopilot', href: '/autopilot', active: false },
        { label: 'Intelligence', href: '/intelligence', active: false },
        { label: 'SketchUp', href: '/sketchup', active: true },
    ];

    return (
        <div style={{ fontFamily: f, background: '#fafafa', color: '#111', minHeight: '100vh' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                .skp-card { transition: all 0.2s; }
                .skp-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-1px); }
                .tab-active { border-bottom: 2px solid #111; color: #111 !important; font-weight: 600 !important; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
                @keyframes scan-line { from { top: 0; } to { top: 100%; } }
                @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
                .animate-in { animation: fade-in 0.3s ease forwards; }
                .drop-zone { transition: all 0.3s; }
                .drop-zone:hover { border-color: rgba(37,99,235,0.3) !important; background: rgba(37,99,235,0.02) !important; }
                .rotate-model { transition: transform 0.5s ease; }
            `}</style>

            <RoofNav />

            <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 48px' }}>
                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', marginBottom: 8 }}>DESIGN → EXECUTION</div>
                    <h1 style={{ fontSize: 26, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 6px' }}>
                        SketchUp <span style={{ color: 'rgba(0,0,0,0.2)', fontStyle: 'italic' }}>Integration</span>
                    </h1>
                    <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', margin: 0 }}>Upload your .skp file → Auto-extract BOQ → Map materials → Generate quote</p>
                </div>

                {/* Tabs */}
                {uploaded && (
                    <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        {[
                            { id: 'upload', label: 'Upload' },
                            { id: 'boq', label: 'Auto-BOQ' },
                            { id: 'materials', label: 'Materials' },
                            { id: 'viewer', label: '3D Viewer' },
                            { id: 'versions', label: 'Versions' },
                        ].map(t => (
                            <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={tab === t.id ? 'tab-active' : ''} style={{
                                padding: '10px 18px', fontSize: 12, fontWeight: 400, color: 'rgba(0,0,0,0.35)',
                                background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: f,
                                borderBottom: '2px solid transparent', marginBottom: -1,
                            }}>{t.label}</button>
                        ))}
                    </div>
                )}

                {/* ═══ UPLOAD TAB ═══ */}
                {tab === 'upload' && (
                    <div className="animate-in">
                        {!parsing && !uploaded && (
                            <div
                                className="drop-zone"
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(); }}
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    background: dragOver ? 'rgba(37,99,235,0.03)' : 'white',
                                    borderRadius: 16, padding: '60px 40px', textAlign: 'center', cursor: 'pointer',
                                    border: `2px dashed ${dragOver ? '#2563EB' : 'rgba(0,0,0,0.08)'}`,
                                }}
                            >
                                <input ref={fileInputRef} type="file" accept=".skp,.ifc,.obj,.fbx" style={{ display: 'none' }} onChange={handleUpload} />
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                </div>
                                <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>Drop your SketchUp file here</h2>
                                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.35)', margin: '0 0 20px' }}>
                                    Supports .skp, .ifc, .obj, .fbx — up to 100MB
                                </p>
                                <button style={{
                                    padding: '10px 28px', fontSize: 13, fontWeight: 600, background: '#111', color: 'white',
                                    border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: f,
                                }}>Browse Files</button>
                                <div style={{ marginTop: 24, display: 'flex', gap: 20, justifyContent: 'center' }}>
                                    {[
                                        { icon: '', label: 'Auto-extract BOQ' },
                                        { icon: '', label: 'Map materials' },
                                        { icon: '', label: 'Generate pricing' },
                                        { icon: '', label: '3D client view' },
                                    ].map(f => (
                                        <div key={f.label} style={{ fontSize: 10, color: 'rgba(0,0,0,0.25)' }}>
                                            {f.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {parsing && (
                            <div style={{ background: 'white', borderRadius: 16, padding: '60px 40px', textAlign: 'center', border: '1px solid rgba(37,99,235,0.1)' }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(37,99,235,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, animation: 'pulse 1.5s infinite' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                </div>
                                <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>Parsing SketchUp Model...</h2>
                                <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', margin: '0 0 24px' }}>Extracting geometry, materials, and measurements</p>
                                <div style={{ maxWidth: 300, margin: '0 auto' }}>
                                    {['Reading geometry...', 'Extracting dimensions...', 'Mapping materials...', 'Generating BOQ...'].map((step, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 11, color: 'rgba(0,0,0,0.4)' }}>
                                            <span style={{ color: '#059669' }}>✓</span> {step}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {uploaded && (
                            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid rgba(5,150,105,0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(5,150,105,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#059669' }}>✓</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Sarah_Tan_4Room_BTO_V3.skp</div>
                                        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)' }}>24.6 MB · Uploaded 7 Mar 2026 · 12 BOQ items extracted · 6 materials mapped</div>
                                    </div>
                                    <button onClick={() => { setUploaded(false); setTab('upload'); }} style={{
                                        padding: '6px 14px', fontSize: 10, fontWeight: 600, background: 'rgba(0,0,0,0.04)',
                                        color: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 6, cursor: 'pointer',
                                    }}>Replace</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ═══ AUTO-BOQ TAB ═══ */}
                {tab === 'boq' && uploaded && (
                    <div className="animate-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}>AUTO-EXTRACTED BOQ</div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.25)' }}>{EXTRACTED_BOQ.length} items</span>
                                <button style={{ padding: '5px 12px', fontSize: 10, fontWeight: 600, background: '#2563EB', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Export to Numbers →</button>
                            </div>
                        </div>

                        {categories.map(cat => (
                            <div key={cat} style={{ marginBottom: 16 }}>
                                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.2)', letterSpacing: '0.1em', marginBottom: 8, paddingLeft: 4 }}>{cat.toUpperCase()}</div>
                                <div style={{ background: 'white', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                                    {EXTRACTED_BOQ.filter(b => b.category === cat).map((item, i, arr) => (
                                        <div key={item.id} style={{
                                            display: 'grid', gridTemplateColumns: '1fr 140px 50px 80px 80px 50px', gap: 8, padding: '12px 16px',
                                            alignItems: 'center', fontSize: 12,
                                            borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: 600, marginBottom: 1 }}>{item.item}</div>
                                                <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.3)', fontFamily: mono }}>{item.dims}</div>
                                            </div>
                                            <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.35)' }}>{item.material}</div>
                                            <div style={{ fontFamily: mono, fontSize: 11, color: 'rgba(0,0,0,0.5)', textAlign: 'center' }}>{item.qty} {item.unit}</div>
                                            <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, textAlign: 'right' }}>S${item.unitPrice.toLocaleString()}</div>
                                            <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: '#111', textAlign: 'right' }}>S${(item.unitPrice * item.qty).toLocaleString()}</div>
                                            <div style={{ textAlign: 'center' }}>
                                                <span style={{
                                                    fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                                                    background: item.confidence >= 90 ? 'rgba(5,150,105,0.06)' : 'rgba(245,158,11,0.06)',
                                                    color: item.confidence >= 90 ? '#059669' : '#D97706',
                                                }}>{item.confidence}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Total */}
                        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                            <div>
                                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}>ESTIMATED TOTAL</div>
                                <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.25)', marginTop: 2 }}>Auto-extracted from SketchUp model · {EXTRACTED_BOQ.length} line items</div>
                            </div>
                            <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 800, color: '#059669' }}>S${totalBOQ.toLocaleString()}</div>
                        </div>

                        <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(37,99,235,0.03)', borderRadius: 8, fontSize: 10, color: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            Confidence scores show AI certainty on each extraction. Items below 85% should be manually verified. Click <strong>"Export to Numbers"</strong> to push this BOQ directly into your quote builder.
                        </div>
                    </div>
                )}

                {/* ═══ MATERIALS TAB ═══ */}
                {tab === 'materials' && uploaded && (
                    <div className="animate-in">
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 14 }}>MATERIAL MAPPING — SKETCHUP → ROOF</div>
                        <div style={{ background: 'white', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                            {/* Header */}
                            <div style={{ display: 'grid', gridTemplateColumns: '200px 200px 140px 100px 60px', gap: 8, padding: '10px 16px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                                {['SketchUp Material', 'Roof Match', 'Vendor', 'Price', 'Status'].map(h => (
                                    <div key={h} style={{ fontFamily: mono, fontSize: 8, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}>{h.toUpperCase()}</div>
                                ))}
                            </div>
                            {MATERIAL_MAPPINGS.map((m, i) => (
                                <div key={i} style={{
                                    display: 'grid', gridTemplateColumns: '200px 200px 140px 100px 60px', gap: 8, padding: '14px 16px',
                                    alignItems: 'center', borderBottom: i < MATERIAL_MAPPINGS.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                                }}>
                                    <div style={{ fontSize: 11, fontFamily: mono, color: 'rgba(0,0,0,0.5)' }}>{m.sketchupMat}</div>
                                    <div style={{ fontSize: 12, fontWeight: m.matched ? 600 : 400, color: m.matched ? '#111' : 'rgba(0,0,0,0.25)' }}>
                                        {m.roofItem || '— No match'}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)' }}>{m.vendor || '—'}</div>
                                    <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 600 }}>
                                        {m.pricePerSheet ? `S$${m.pricePerSheet}/sheet` : m.pricePerSqft ? `S$${m.pricePerSqft}/sqft` : m.pricePerSqm ? `S$${m.pricePerSqm}/sqm` : m.pricePerLitre ? `S$${m.pricePerLitre}/L` : '—'}
                                    </div>
                                    <div>
                                        {m.matched ? (
                                            <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(5,150,105,0.06)', color: '#059669' }}>MATCHED</span>
                                        ) : (
                                            <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(220,38,38,0.06)', color: '#DC2626' }}>MANUAL</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                            <div style={{ flex: 1, padding: '12px 14px', background: 'rgba(5,150,105,0.03)', borderRadius: 8, fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>
                                <strong>5/6 materials auto-matched</strong> to Roof's vendor database with live pricing
                            </div>
                            <div style={{ flex: 1, padding: '12px 14px', background: 'rgba(220,38,38,0.03)', borderRadius: 8, fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>
                                <strong>1 material needs manual mapping</strong> — click to search Roof's material library
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ 3D VIEWER TAB ═══ */}
                {tab === 'viewer' && uploaded && (
                    <div className="animate-in">
                        <div style={{
                            background: 'white', borderRadius: 16, overflow: 'hidden', position: 'relative',
                            height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(0,0,0,0.06)',
                        }}>
                            {/* Grid floor — hide in plan view */}
                            {viewMode !== 'plan' && (
                                <div style={{ position: 'absolute', bottom: 60, width: '100%', height: 120, background: 'linear-gradient(transparent, rgba(0,0,0,0.02))', perspective: '500px' }}>
                                    <div style={{ width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'rotateX(60deg)', transformOrigin: 'bottom' }} />
                                </div>
                            )}

                            {/* Model — transforms per view mode */}
                            <div className="rotate-model" style={{
                                transform: viewMode === 'plan' ? 'rotateX(90deg) scale(1.2)'
                                    : viewMode === 'front' ? 'rotateX(0deg) rotateY(0deg) scale(1.1)'
                                        : viewMode === 'side' ? 'rotateX(0deg) rotateY(90deg) scale(1.1)'
                                            : viewMode === 'iso' ? 'rotateX(30deg) rotateY(-30deg) scale(0.95)'
                                                : 'rotateX(15deg) rotateY(-20deg) scale(1)',
                                position: 'relative', perspective: '800px',
                            }}>
                                <div style={{ width: 280, height: 180, background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 4, position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 10, left: 10, right: 10, bottom: 10, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                                        <div style={{ fontFamily: mono, fontSize: 8, color: 'rgba(0,0,0,0.3)', position: 'absolute', top: 4, left: 6 }}>LIVING</div>
                                        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed rgba(0,0,0,0.08)' }} />
                                        <div style={{ fontFamily: mono, fontSize: 8, color: 'rgba(0,0,0,0.3)', position: 'absolute', bottom: 4, left: 6 }}>KITCHEN</div>
                                        <div style={{ position: 'absolute', top: 0, left: '60%', bottom: 0, borderLeft: '1px dashed rgba(0,0,0,0.08)' }} />
                                        <div style={{ fontFamily: mono, fontSize: 7, color: 'rgba(0,0,0,0.25)', position: 'absolute', top: 4, right: 6 }}>BR1</div>
                                        <div style={{ fontFamily: mono, fontSize: 7, color: 'rgba(0,0,0,0.25)', position: 'absolute', bottom: 4, right: 6 }}>BR2</div>
                                    </div>
                                    {/* Dimension labels */}
                                    <div style={{ position: 'absolute', bottom: -20, width: '100%', textAlign: 'center', fontFamily: mono, fontSize: 9, color: 'rgba(0,0,0,0.25)' }}>9,200mm</div>
                                    <div style={{ position: 'absolute', right: -40, top: '50%', transform: 'rotate(90deg)', fontFamily: mono, fontSize: 9, color: 'rgba(0,0,0,0.25)' }}>{viewMode === 'front' || viewMode === 'side' ? '2,800mm (FFL→Ceiling)' : '6,400mm'}</div>
                                </div>
                            </div>

                            {/* View Mode Controls */}
                            <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                                {[
                                    { id: 'plan' as const, label: 'Plan', icon: '⬜' },
                                    { id: 'front' as const, label: 'Front Elev.', icon: '▬' },
                                    { id: 'side' as const, label: 'Side Elev.', icon: '▮' },
                                    { id: 'iso' as const, label: 'Isometric', icon: '◇' },
                                    { id: 'persp' as const, label: 'Perspective', icon: '◈' },
                                ].map(mode => (
                                    <button key={mode.id} onClick={() => setViewMode(mode.id)} style={{
                                        padding: '6px 12px', fontSize: 9, fontFamily: mono, fontWeight: 600,
                                        background: viewMode === mode.id ? '#111' : 'rgba(0,0,0,0.03)',
                                        color: viewMode === mode.id ? 'white' : 'rgba(0,0,0,0.35)',
                                        border: `1px solid ${viewMode === mode.id ? '#111' : 'rgba(0,0,0,0.06)'}`,
                                        borderRadius: 6, cursor: 'pointer', letterSpacing: '0.03em',
                                    }}>{mode.icon} {mode.label}</button>
                                ))}
                            </div>

                            {/* Active view label */}
                            <div style={{ position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%)', fontFamily: mono, fontSize: 8, color: 'rgba(0,0,0,0.15)', letterSpacing: '0.15em' }}>
                                {viewMode === 'plan' ? 'TOP-DOWN PLAN VIEW' : viewMode === 'front' ? 'FRONT ELEVATION' : viewMode === 'side' ? 'SIDE ELEVATION' : viewMode === 'iso' ? 'ISOMETRIC VIEW' : 'PERSPECTIVE VIEW'}
                            </div>

                            {/* Info badge */}
                            <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 8, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)', fontFamily: mono }}>4-ROOM BTO</span>
                                <span style={{ fontSize: 9, color: 'rgba(0,0,0,0.25)', fontFamily: mono }}>Tampines N9 · 93 sqm</span>
                            </div>
                            <div style={{ position: 'absolute', top: 16, right: 16 }}>
                                <button style={{ padding: '6px 14px', fontSize: 10, fontWeight: 600, background: '#111', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: f }}>Share with Client →</button>
                            </div>
                        </div>
                        <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(0,0,0,0.02)', borderRadius: 8, fontSize: 10, color: 'rgba(0,0,0,0.35)' }}>
                            In production, this renders the full 3D SketchUp model via Three.js. Homeowners get a shareable link. Supports Plan, Elevation, Isometric, and Perspective views.
                        </div>
                    </div>
                )}

                {/* ═══ VERSIONS TAB ═══ */}
                {tab === 'versions' && uploaded && (
                    <div className="animate-in">
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 14 }}>DESIGN VERSION HISTORY</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {VERSIONS.map((v, i) => (
                                <div key={v.id} className="skp-card" style={{
                                    background: 'white', borderRadius: 12, padding: '18px 20px',
                                    border: `1px solid ${v.status === 'approved' ? 'rgba(5,150,105,0.15)' : 'rgba(0,0,0,0.06)'}`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                            background: v.status === 'approved' ? 'rgba(5,150,105,0.06)' : 'rgba(0,0,0,0.03)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontFamily: mono, fontSize: 12, fontWeight: 700,
                                            color: v.status === 'approved' ? '#059669' : 'rgba(0,0,0,0.2)',
                                        }}>{v.id}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 13, fontWeight: 600 }}>{v.label}</span>
                                                {v.status === 'approved' && <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(5,150,105,0.06)', color: '#059669' }}>APPROVED</span>}
                                            </div>
                                            <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.35)', marginTop: 2 }}>{v.changes}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.3)' }}>{v.date}</div>
                                            <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.2)', marginTop: 2 }}>{v.size}</div>
                                        </div>
                                    </div>
                                    {i === 0 && (
                                        <div style={{ display: 'flex', gap: 6, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                                            <button style={{ padding: '5px 12px', fontSize: 10, fontWeight: 600, background: 'rgba(37,99,235,0.06)', color: '#2563EB', border: 'none', borderRadius: 6, cursor: 'pointer' }}>View in 3D</button>
                                            <button style={{ padding: '5px 12px', fontSize: 10, fontWeight: 600, background: 'rgba(5,150,105,0.06)', color: '#059669', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Re-extract BOQ</button>
                                            <button style={{ padding: '5px 12px', fontSize: 10, fontWeight: 600, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Compare with V2</button>
                                            <button style={{ padding: '5px 12px', fontSize: 10, fontWeight: 600, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Download .skp</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(0,0,0,0.02)', borderRadius: 8, fontSize: 10, color: 'rgba(0,0,0,0.3)' }}>
                            Every upload creates a version. Clients see the approval status on their dashboard. BOQ auto-updates when a new version is extracted.
                        </div>
                    </div>
                )}
            </div>

            <footer style={{ padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 60 }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.25)', letterSpacing: '0.05em' }}>© 2026 ROOF · SKETCHUP INTEGRATION</span>
                <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.2)' }}>Design in SketchUp. Execute on Roof.</span>
            </footer>
        </div>
    );
}
