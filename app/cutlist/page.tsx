'use client';

import React, { useState } from 'react';
import RoofNav from '@/components/RoofNav';

// ============================================================
// CUTLIST OPTIMIZER — Board Cutting Optimization for Carpentry
// ============================================================

interface CutPiece {
    id: string;
    label: string;
    length: number;
    width: number;
    qty: number;
    color: string;
}

interface Board {
    length: number;
    width: number;
    label: string;
    pricePerSheet: number;
}

const BOARD_PRESETS: Board[] = [
    { length: 2440, width: 1220, label: '8×4 ft (2440×1220mm)', pricePerSheet: 85 },
    { length: 2440, width: 610, label: '8×2 ft (2440×610mm)', pricePerSheet: 48 },
    { length: 1830, width: 1220, label: '6×4 ft (1830×1220mm)', pricePerSheet: 68 },
    { length: 2440, width: 1830, label: '8×6 ft (2440×1830mm)', pricePerSheet: 120 },
];

const PIECE_COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#22C55E', '#EC4899', '#06B6D4', '#EF4444', '#6366F1', '#14B8A6', '#F97316'];

export default function CutlistPage() {
    const [boardIdx, setBoardIdx] = useState(0);
    const [pieces, setPieces] = useState<CutPiece[]>([
        { id: 'P1', label: 'Panel A (Shelf)', length: 600, width: 400, qty: 4, color: PIECE_COLORS[0] },
        { id: 'P2', label: 'Panel B (Side)', length: 800, width: 300, qty: 2, color: PIECE_COLORS[1] },
        { id: 'P3', label: 'Panel C (Back)', length: 1200, width: 600, qty: 1, color: PIECE_COLORS[2] },
        { id: 'P4', label: 'Panel D (Door)', length: 700, width: 350, qty: 2, color: PIECE_COLORS[3] },
    ]);
    const [newLabel, setNewLabel] = useState('');
    const [newL, setNewL] = useState('');
    const [newW, setNewW] = useState('');
    const [newQty, setNewQty] = useState('1');
    const [kerfMm, setKerfMm] = useState(3);
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const board = BOARD_PRESETS[boardIdx];

    // Expand pieces by qty
    const allPieces = pieces.flatMap(p => Array.from({ length: p.qty }, (_, i) => ({ ...p, id: `${p.id}_${i}` })));

    // Simple first-fit-decreasing bin packing (greedy by area)
    const sortedPieces = [...allPieces].sort((a, b) => (b.length * b.width) - (a.length * a.width));

    // Pack pieces into boards using rows
    const boards: { pieces: { piece: typeof sortedPieces[0]; x: number; y: number; rotated: boolean }[] }[] = [];

    sortedPieces.forEach(piece => {
        let placed = false;
        const pw = piece.length + kerfMm;
        const ph = piece.width + kerfMm;
        const pwR = piece.width + kerfMm;
        const phR = piece.length + kerfMm;

        for (const brd of boards) {
            // Try to place in existing board
            for (let y = 0; y <= board.width - ph; y += 10) {
                for (let x = 0; x <= board.length - pw; x += 10) {
                    const overlaps = brd.pieces.some(p => {
                        const pW = p.rotated ? p.piece.width + kerfMm : p.piece.length + kerfMm;
                        const pH = p.rotated ? p.piece.length + kerfMm : p.piece.width + kerfMm;
                        return !(x + pw <= p.x || x >= p.x + pW || y + ph <= p.y || y >= p.y + pH);
                    });
                    if (!overlaps) {
                        brd.pieces.push({ piece, x, y, rotated: false });
                        placed = true;
                        break;
                    }
                }
                if (placed) break;
            }
            if (placed) break;
            // Try rotated
            if (!placed && pwR !== pw) {
                for (let y = 0; y <= board.width - phR; y += 10) {
                    for (let x = 0; x <= board.length - pwR; x += 10) {
                        const overlaps = brd.pieces.some(p => {
                            const pW = p.rotated ? p.piece.width + kerfMm : p.piece.length + kerfMm;
                            const pH = p.rotated ? p.piece.length + kerfMm : p.piece.width + kerfMm;
                            return !(x + pwR <= p.x || x >= p.x + pW || y + phR <= p.y || y >= p.y + pH);
                        });
                        if (!overlaps) {
                            brd.pieces.push({ piece, x, y, rotated: true });
                            placed = true;
                            break;
                        }
                        if (placed) break;
                    }
                    if (placed) break;
                }
            }
            if (placed) break;
        }
        if (!placed) {
            boards.push({ pieces: [{ piece, x: 0, y: 0, rotated: false }] });
        }
    });

    const totalPieceArea = allPieces.reduce((s, p) => s + p.length * p.width, 0);
    const totalBoardArea = boards.length * board.length * board.width;
    const wastePercent = totalBoardArea > 0 ? ((totalBoardArea - totalPieceArea) / totalBoardArea * 100) : 0;
    const totalCost = boards.length * board.pricePerSheet;

    const addPiece = () => {
        if (!newLabel || !newL || !newW) return;
        const id = `P${Date.now()}`;
        setPieces(prev => [...prev, {
            id, label: newLabel, length: parseInt(newL), width: parseInt(newW),
            qty: parseInt(newQty) || 1, color: PIECE_COLORS[prev.length % PIECE_COLORS.length],
        }]);
        setNewLabel(''); setNewL(''); setNewW(''); setNewQty('1');
    };

    const scale = 0.22;

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            <RoofNav />
            <div style={{ padding: '20px 32px 80px' }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#37352F', margin: '0 0 4px' }}>Cutlist Optimizer</h1>
                <p style={{ fontSize: 12, color: '#9B9A97', margin: '0 0 20px' }}>Board cutting layout · Waste minimization · Cost estimation</p>

                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
                    {/* Left Panel */}
                    <div>
                        {/* Board Selection */}
                        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', padding: 16, marginBottom: 12 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Board Size</div>
                            {BOARD_PRESETS.map((b, i) => (
                                <button key={i} onClick={() => setBoardIdx(i)} style={{
                                    display: 'block', width: '100%', padding: '8px 12px', marginBottom: 4, borderRadius: 8,
                                    border: boardIdx === i ? '2px solid #37352F' : '1px solid #E9E9E7', cursor: 'pointer',
                                    background: boardIdx === i ? '#FAFAF9' : 'white', textAlign: 'left', fontFamily: f,
                                }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#37352F' }}>{b.label}</span>
                                    <span style={{ fontSize: 10, color: '#9B9A97', float: 'right' }}>${b.pricePerSheet}/sheet</span>
                                </button>
                            ))}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                <span style={{ fontSize: 10, color: '#9B9A97' }}>Kerf:</span>
                                <input type="number" value={kerfMm} onChange={e => setKerfMm(parseInt(e.target.value) || 0)}
                                    style={{ width: 50, padding: '4px 6px', fontSize: 11, border: '1px solid #E9E9E7', borderRadius: 4, fontFamily: f, textAlign: 'center' }} />
                                <span style={{ fontSize: 10, color: '#9B9A97' }}>mm</span>
                            </div>
                        </div>

                        {/* Cut Pieces */}
                        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', padding: 16, marginBottom: 12 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Cut Pieces</div>
                            {pieces.map(p => (
                                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #F5F5F4' }}>
                                    <div style={{ width: 12, height: 12, borderRadius: 3, background: p.color, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: '#37352F' }}>{p.label}</div>
                                        <div style={{ fontSize: 9, color: '#9B9A97' }}>{p.length}×{p.width}mm · qty {p.qty}</div>
                                    </div>
                                    <button onClick={() => setPieces(prev => prev.filter(x => x.id !== p.id))} style={{
                                        width: 20, height: 20, borderRadius: 4, border: 'none', background: '#FEF2F2',
                                        color: '#DC2626', cursor: 'pointer', fontSize: 10, fontWeight: 700,
                                    }}>×</button>
                                </div>
                            ))}
                            {/* Add New */}
                            <div style={{ marginTop: 10 }}>
                                <input placeholder="Label" value={newLabel} onChange={e => setNewLabel(e.target.value)}
                                    style={{ width: '100%', padding: '6px 8px', fontSize: 11, border: '1px solid #E9E9E7', borderRadius: 6, marginBottom: 4, fontFamily: f, boxSizing: 'border-box' }} />
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <input placeholder="L (mm)" value={newL} onChange={e => setNewL(e.target.value)} type="number"
                                        style={{ flex: 1, padding: '6px 8px', fontSize: 11, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f }} />
                                    <input placeholder="W (mm)" value={newW} onChange={e => setNewW(e.target.value)} type="number"
                                        style={{ flex: 1, padding: '6px 8px', fontSize: 11, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f }} />
                                    <input placeholder="Qty" value={newQty} onChange={e => setNewQty(e.target.value)} type="number"
                                        style={{ width: 50, padding: '6px 8px', fontSize: 11, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f, textAlign: 'center' }} />
                                </div>
                                <button onClick={addPiece} style={{
                                    marginTop: 6, width: '100%', padding: '8px', fontSize: 11, fontWeight: 700, borderRadius: 8,
                                    border: 'none', background: '#37352F', color: 'white', cursor: 'pointer', fontFamily: f,
                                }}>+ Add Piece</button>
                            </div>
                        </div>

                        {/* Results */}
                        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', padding: 16 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Results</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                <div style={{ padding: '10px 12px', background: '#EFF6FF', borderRadius: 8 }}>
                                    <div style={{ fontSize: 9, color: '#3B82F6', fontWeight: 600 }}>Boards Needed</div>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: '#1D4ED8' }}>{boards.length}</div>
                                </div>
                                <div style={{ padding: '10px 12px', background: wastePercent < 20 ? '#F0FDF4' : wastePercent < 35 ? '#FEF9C3' : '#FEF2F2', borderRadius: 8 }}>
                                    <div style={{ fontSize: 9, color: wastePercent < 20 ? '#16A34A' : wastePercent < 35 ? '#CA8A04' : '#DC2626', fontWeight: 600 }}>Waste</div>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: wastePercent < 20 ? '#16A34A' : wastePercent < 35 ? '#CA8A04' : '#DC2626' }}>{wastePercent.toFixed(1)}%</div>
                                </div>
                                <div style={{ padding: '10px 12px', background: '#F5F3FF', borderRadius: 8 }}>
                                    <div style={{ fontSize: 9, color: '#7C3AED', fontWeight: 600 }}>Total Pieces</div>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: '#7C3AED' }}>{allPieces.length}</div>
                                </div>
                                <div style={{ padding: '10px 12px', background: '#FFF7ED', borderRadius: 8 }}>
                                    <div style={{ fontSize: 9, color: '#EA580C', fontWeight: 600 }}>Material Cost</div>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: '#EA580C' }}>${totalCost}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual Board Layouts */}
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Cutting Layout</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {boards.map((brd, bi) => (
                                <div key={bi} style={{ background: 'white', borderRadius: 12, border: '1px solid #E9E9E7', padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#37352F' }}>Board {bi + 1}</span>
                                        <span style={{ fontSize: 10, color: '#9B9A97' }}>{brd.pieces.length} pieces · ${board.pricePerSheet}</span>
                                    </div>
                                    <div style={{
                                        width: board.length * scale, height: board.width * scale,
                                        background: '#FEF9C3', border: '2px solid #CA8A04', borderRadius: 4,
                                        position: 'relative', overflow: 'hidden',
                                    }}>
                                        {/* Grid lines */}
                                        {Array.from({ length: Math.floor(board.length / 100) }).map((_, i) => (
                                            <div key={`v${i}`} style={{ position: 'absolute', left: (i + 1) * 100 * scale, top: 0, width: 1, height: '100%', background: 'rgba(0,0,0,0.03)' }} />
                                        ))}
                                        {Array.from({ length: Math.floor(board.width / 100) }).map((_, i) => (
                                            <div key={`h${i}`} style={{ position: 'absolute', top: (i + 1) * 100 * scale, left: 0, height: 1, width: '100%', background: 'rgba(0,0,0,0.03)' }} />
                                        ))}
                                        {/* Pieces */}
                                        {brd.pieces.map((p, pi) => {
                                            const w = p.rotated ? p.piece.width : p.piece.length;
                                            const h = p.rotated ? p.piece.length : p.piece.width;
                                            return (
                                                <div key={pi} title={`${p.piece.label} (${w}×${h}mm)`} style={{
                                                    position: 'absolute', left: p.x * scale, top: p.y * scale,
                                                    width: w * scale, height: h * scale,
                                                    background: p.piece.color, opacity: 0.85, borderRadius: 2,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    border: '1px solid rgba(255,255,255,0.4)',
                                                    transition: 'opacity 0.2s',
                                                }}
                                                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                                                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}
                                                >
                                                    <span style={{ fontSize: Math.min(w * scale / 8, 9), color: 'white', fontWeight: 700, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                                                        {w}×{h}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
