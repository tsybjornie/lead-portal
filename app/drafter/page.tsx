'use client';

import React, { useState } from 'react';
import RoofNav from '@/components/RoofNav';
import RatingModal, { CRITERIA } from '@/components/RatingModal';
import { Clock, Upload, Check, AlertCircle, Eye, ChevronRight, FileText, Pencil, RotateCcw, CheckCircle2, MessageSquare, Timer } from 'lucide-react';

// ============================================================
// DRAFTER PORTAL — Drawing Management Workspace
// ============================================================

interface Drawing {
    id: string;
    ref: string;
    title: string;
    project: string;
    zone: string;
    status: 'queued' | 'drafting' | 'review' | 'revision' | 'approved';
    priority: 'urgent' | 'normal' | 'low';
    designer: string;
    dueDate: string;
    version: number;
    hoursLogged: number;
    hoursEstimate: number;
    notes: string;
    revisionNotes?: string;
}

const STATUS_CFG = {
    queued: { label: 'Queued', color: '#9B9A97', bg: '#F7F6F3', emoji: '' },
    drafting: { label: 'Drafting', color: '#3B82F6', bg: '#EFF6FF', emoji: '' },
    review: { label: 'In Review', color: '#F59E0B', bg: '#FEF9C3', emoji: '' },
    revision: { label: 'Revision', color: '#EF4444', bg: '#FEF2F2', emoji: '' },
    approved: { label: 'Approved', color: '#22C55E', bg: '#F0FDF4', emoji: '' },
};

const PRIORITY_CFG = {
    urgent: { label: 'URGENT', color: '#DC2626', bg: '#FEE2E2' },
    normal: { label: 'NORMAL', color: '#6B6A67', bg: '#F7F6F3' },
    low: { label: 'LOW', color: '#9B9A97', bg: '#FAFAF9' },
};

const DEMO_DRAWINGS: Drawing[] = [
    { id: 'D001', ref: 'DWG-001', title: 'Floor Plan — Whole Unit', project: 'Tan Residence (Clementi)', zone: 'Whole Unit', status: 'approved', priority: 'urgent', designer: 'Bjorn', dueDate: '2026-03-05', version: 3, hoursLogged: 6.5, hoursEstimate: 6, notes: 'Include furniture layout', revisionNotes: 'Move dining table 300mm east' },
    { id: 'D002', ref: 'DWG-002', title: 'Kitchen Elevation — All Walls', project: 'Tan Residence (Clementi)', zone: 'Kitchen', status: 'revision', priority: 'urgent', designer: 'Bjorn', dueDate: '2026-03-08', version: 2, hoursLogged: 4.0, hoursEstimate: 5, notes: 'Show appliance positions + overhead cabinets', revisionNotes: 'Backsplash height wrong — should be 600mm not 500mm. Also add hood dimensions.' },
    { id: 'D003', ref: 'DWG-003', title: 'Master Bath Elevation', project: 'Tan Residence (Clementi)', zone: 'Master Bath', status: 'drafting', priority: 'normal', designer: 'Bjorn', dueDate: '2026-03-10', version: 1, hoursLogged: 2.5, hoursEstimate: 4, notes: 'Porcelain 600×1200 wall tiles, niche detail' },
    { id: 'D004', ref: 'DWG-004', title: 'Carpentry Details — MBR Wardrobe', project: 'Tan Residence (Clementi)', zone: 'Master Bedroom', status: 'queued', priority: 'normal', designer: 'Jenny', dueDate: '2026-03-12', version: 0, hoursLogged: 0, hoursEstimate: 5, notes: 'Full-height wardrobe 2.4m, Blum hinges, LED strip' },
    { id: 'D005', ref: 'DWG-005', title: 'Electrical Layout', project: 'Tan Residence (Clementi)', zone: 'Whole Unit', status: 'queued', priority: 'low', designer: 'Bjorn', dueDate: '2026-03-14', version: 0, hoursLogged: 0, hoursEstimate: 3, notes: 'Point marking + DB schedule' },
    { id: 'D006', ref: 'DWG-006', title: 'Floor Plan — Living/Dining', project: 'Lim BTO (Punggol)', zone: 'Living + Dining', status: 'review', priority: 'normal', designer: 'Jenny', dueDate: '2026-03-07', version: 2, hoursLogged: 5.0, hoursEstimate: 5, notes: 'Built-in TV console + study nook' },
    { id: 'D007', ref: 'DWG-007', title: 'Kitchen Countertop Section', project: 'Lim BTO (Punggol)', zone: 'Kitchen', status: 'drafting', priority: 'urgent', designer: 'Bjorn', dueDate: '2026-03-09', version: 1, hoursLogged: 1.5, hoursEstimate: 3, notes: 'Quartz countertop 20mm, undermount sink cut-out' },
];

export default function DrafterPortal() {
    const [drawings, setDrawnings] = useState(DEMO_DRAWINGS);
    const [activeView, setActiveView] = useState<'board' | 'list'>('board');
    const [selectedDrawing, setSelectedDrawing] = useState<string | null>(null);
    const [trackingId, setTrackingId] = useState<string | null>(null);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [ratingTarget, setRatingTarget] = useState<{ name: string; project: string } | null>(null);
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    // Timer effect
    React.useEffect(() => {
        if (!trackingId) return;
        const interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
        return () => clearInterval(interval);
    }, [trackingId]);

    const formatTime = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const selected = drawings.find(d => d.id === selectedDrawing);

    const statuses: Drawing['status'][] = ['queued', 'drafting', 'review', 'revision', 'approved'];
    const stats = {
        total: drawings.length,
        queued: drawings.filter(d => d.status === 'queued').length,
        active: drawings.filter(d => d.status === 'drafting').length,
        review: drawings.filter(d => d.status === 'review').length,
        revision: drawings.filter(d => d.status === 'revision').length,
        approved: drawings.filter(d => d.status === 'approved').length,
        totalHours: drawings.reduce((s, d) => s + d.hoursLogged, 0),
        urgent: drawings.filter(d => d.priority === 'urgent' && d.status !== 'approved').length,
    };

    return (
        <>
            <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
                <style dangerouslySetInnerHTML={{
                    __html: `
                @keyframes pulse-border { 0%, 100% { border-color: #FECACA; } 50% { border-color: #EF4444; } }
                @keyframes slide-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes timer-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
            `}} />
                <RoofNav />

                <div style={{ padding: '20px 32px 80px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div>
                            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#37352F', margin: '0 0 4px' }}>Drafter Portal</h1>
                            <p style={{ fontSize: 12, color: '#9B9A97', margin: 0 }}>Drawing assignments · File management · Time tracking</p>
                        </div>
                        {/* Live Timer */}
                        {trackingId && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px',
                                background: '#EFF6FF', borderRadius: 10, border: '1px solid #BFDBFE',
                                animation: 'slide-up 0.3s ease',
                            }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6', animation: 'timer-pulse 1s infinite' }} />
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#3B82F6' }}>
                                    Tracking: {drawings.find(d => d.id === trackingId)?.ref}
                                </span>
                                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'SF Mono', monospace", color: '#1D4ED8' }}>
                                    {formatTime(timerSeconds)}
                                </span>
                                <button onClick={() => { setTrackingId(null); setTimerSeconds(0); }} style={{
                                    padding: '4px 10px', fontSize: 10, fontWeight: 700, background: '#DC2626', color: 'white',
                                    border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: f,
                                }}>Stop</button>
                            </div>
                        )}
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 20 }}>
                        {[
                            { label: 'Total', value: stats.total, color: '#37352F', bg: '#FAFAF9', icon: '' },
                            { label: 'Queued', value: stats.queued, color: '#9B9A97', bg: '#F7F6F3', icon: '' },
                            { label: 'Drafting', value: stats.active, color: '#3B82F6', bg: '#EFF6FF', icon: '' },
                            { label: 'In Review', value: stats.review, color: '#F59E0B', bg: '#FEF9C3', icon: '' },
                            { label: 'Revisions', value: stats.revision, color: '#EF4444', bg: '#FEF2F2', icon: '' },
                            { label: 'Approved', value: stats.approved, color: '#22C55E', bg: '#F0FDF4', icon: '' },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: s.bg, borderRadius: 12, padding: 14, border: '1px solid #E9E9E7',
                                cursor: 'pointer', transition: 'transform 0.15s',
                            }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                            >
                                <span style={{ fontSize: 18 }}>{s.icon}</span>
                                <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1, marginTop: 4 }}>{s.value}</div>
                                <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Urgent Alert */}
                    {stats.urgent > 0 && (
                        <div style={{
                            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 16px',
                            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
                            animation: 'pulse-border 2s infinite',
                        }}>
                            <span style={{ fontSize: 16 }}></span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#DC2626' }}>
                                {stats.urgent} urgent drawing{stats.urgent > 1 ? 's' : ''} need attention
                            </span>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: selectedDrawing ? '1fr 380px' : '1fr', gap: 16, transition: 'all 0.3s' }}>
                        {/* Kanban Board */}
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${statuses.length}, 1fr)`, gap: 10, overflowX: 'auto' }}>
                            {statuses.map(status => {
                                const cfg = STATUS_CFG[status];
                                const items = drawings.filter(d => d.status === status);
                                return (
                                    <div key={status}>
                                        {/* Column Header */}
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, padding: '6px 10px',
                                            background: cfg.bg, borderRadius: 8,
                                        }}>
                                            <span style={{ fontSize: 12 }}>{cfg.emoji}</span>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                                            <span style={{
                                                fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                                                background: 'rgba(0,0,0,0.05)', color: cfg.color,
                                            }}>{items.length}</span>
                                        </div>

                                        {/* Cards */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {items.map((d, i) => {
                                                const prCfg = PRIORITY_CFG[d.priority];
                                                const isSelected = selectedDrawing === d.id;
                                                const progress = d.hoursEstimate > 0 ? Math.min((d.hoursLogged / d.hoursEstimate) * 100, 100) : 0;
                                                return (
                                                    <div key={d.id} onClick={() => setSelectedDrawing(isSelected ? null : d.id)}
                                                        style={{
                                                            background: 'white', borderRadius: 10, padding: 14,
                                                            border: `1px solid ${isSelected ? cfg.color : '#E9E9E7'}`,
                                                            borderLeft: `4px solid ${cfg.color}`,
                                                            cursor: 'pointer', transition: 'all 0.2s',
                                                            boxShadow: isSelected ? `0 4px 16px ${cfg.bg}` : '0 1px 3px rgba(0,0,0,0.02)',
                                                            animation: `slide-up 0.3s ease ${i * 0.05}s both`,
                                                        }}
                                                        onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.06)`)}
                                                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
                                                    >
                                                        {/* Priority + Ref */}
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                                            <span style={{ fontSize: 10, fontFamily: "'SF Mono', monospace", fontWeight: 700, color: '#6B6A67' }}>{d.ref}</span>
                                                            <span style={{
                                                                fontSize: 7, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                                                                background: prCfg.bg, color: prCfg.color, textTransform: 'uppercase',
                                                                letterSpacing: '0.08em',
                                                            }}>{prCfg.label}</span>
                                                        </div>

                                                        {/* Title */}
                                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F', marginBottom: 4, lineHeight: 1.3 }}>{d.title}</div>
                                                        <div style={{ fontSize: 10, color: '#9B9A97', marginBottom: 8 }}>{d.project}</div>

                                                        {/* Progress Bar */}
                                                        <div style={{ marginBottom: 6 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                                                <span style={{ fontSize: 8, color: '#9B9A97' }}>v{d.version} · {d.zone}</span>
                                                                <span style={{ fontSize: 8, fontFamily: "'SF Mono', monospace", color: '#6B6A67' }}>{d.hoursLogged}h / {d.hoursEstimate}h</span>
                                                            </div>
                                                            <div style={{ height: 3, background: '#F5F5F4', borderRadius: 2, overflow: 'hidden' }}>
                                                                <div style={{
                                                                    height: '100%', borderRadius: 2,
                                                                    background: progress > 90 ? '#EF4444' : progress > 60 ? '#F59E0B' : '#3B82F6',
                                                                    width: `${progress}%`, transition: 'width 0.5s',
                                                                }} />
                                                            </div>
                                                        </div>

                                                        {/* Footer */}
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ fontSize: 9, color: '#9B9A97' }}>Due {d.dueDate.slice(5)}</span>
                                                            <div style={{ display: 'flex', gap: 4 }}>
                                                                {d.status === 'revision' && (
                                                                    <span style={{ fontSize: 8, padding: '1px 5px', background: '#FEE2E2', color: '#DC2626', borderRadius: 4, fontWeight: 700 }}>REDLINE</span>
                                                                )}
                                                                {trackingId === d.id ? (
                                                                    <span style={{ fontSize: 8, padding: '1px 5px', background: '#EFF6FF', color: '#3B82F6', borderRadius: 4, fontWeight: 700, animation: 'timer-pulse 1s infinite' }}> LIVE</span>
                                                                ) : null}
                                                            </div>
                                                        </div>

                                                        {/* Revision Notes */}
                                                        {d.status === 'revision' && d.revisionNotes && (
                                                            <div style={{
                                                                marginTop: 8, padding: '6px 10px', background: '#FEF2F2', borderRadius: 6,
                                                                border: '1px solid #FECACA', fontSize: 10, color: '#DC2626', lineHeight: 1.4,
                                                            }}>
                                                                <strong>Revision:</strong> {d.revisionNotes}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {items.length === 0 && (
                                                <div style={{ padding: 20, textAlign: 'center', color: '#D4D3D0', fontSize: 10, border: '1px dashed #E9E9E7', borderRadius: 8 }}>
                                                    No drawings
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Detail Panel */}
                        {selected && (
                            <div style={{
                                background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', padding: 20,
                                animation: 'slide-up 0.3s ease', position: 'sticky', top: 68, alignSelf: 'start',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                    <div>
                                        <span style={{ fontSize: 10, fontFamily: "'SF Mono', monospace", fontWeight: 700, color: '#9B9A97' }}>{selected.ref} · v{selected.version}</span>
                                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#37352F', margin: '4px 0' }}>{selected.title}</h3>
                                        <span style={{ fontSize: 11, color: '#9B9A97' }}>{selected.project} · {selected.zone}</span>
                                    </div>
                                    <button onClick={() => setSelectedDrawing(null)} style={{
                                        width: 28, height: 28, borderRadius: 6, border: '1px solid #E9E9E7', background: 'white',
                                        cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}></button>
                                </div>

                                {/* Status + Priority */}
                                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                                    <span style={{
                                        fontSize: 9, padding: '3px 10px', borderRadius: 10, fontWeight: 700,
                                        background: STATUS_CFG[selected.status].bg, color: STATUS_CFG[selected.status].color,
                                    }}>
                                        {STATUS_CFG[selected.status].emoji} {STATUS_CFG[selected.status].label}
                                    </span>
                                    <span style={{
                                        fontSize: 9, padding: '3px 10px', borderRadius: 10, fontWeight: 700,
                                        background: PRIORITY_CFG[selected.priority].bg, color: PRIORITY_CFG[selected.priority].color,
                                    }}>
                                        {PRIORITY_CFG[selected.priority].label}
                                    </span>
                                </div>

                                {/* Time Tracking */}
                                <div style={{ background: '#FAFAF9', borderRadius: 10, padding: 14, marginBottom: 14, border: '1px solid #F3F3F2' }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}> Time Tracking</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <div>
                                            <span style={{ fontSize: 24, fontWeight: 900, color: '#37352F' }}>{selected.hoursLogged}</span>
                                            <span style={{ fontSize: 12, color: '#9B9A97' }}> / {selected.hoursEstimate}h</span>
                                        </div>
                                        <button onClick={() => {
                                            if (trackingId === selected.id) {
                                                setTrackingId(null); setTimerSeconds(0);
                                            } else {
                                                setTrackingId(selected.id); setTimerSeconds(0);
                                            }
                                        }} style={{
                                            padding: '6px 14px', fontSize: 10, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
                                            fontFamily: f,
                                            background: trackingId === selected.id ? '#DC2626' : '#3B82F6',
                                            color: 'white',
                                        }}>
                                            {trackingId === selected.id ? ' Stop' : ' Start Timer'}
                                        </button>
                                    </div>
                                    <div style={{ height: 6, background: '#E9E9E7', borderRadius: 3, overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', borderRadius: 3,
                                            background: (selected.hoursLogged / selected.hoursEstimate) > 0.9 ? '#EF4444' : '#3B82F6',
                                            width: `${Math.min((selected.hoursLogged / selected.hoursEstimate) * 100, 100)}%`,
                                        }} />
                                    </div>
                                </div>

                                {/* Designer Notes */}
                                <div style={{ background: '#FAFAF9', borderRadius: 10, padding: 14, marginBottom: 14, border: '1px solid #F3F3F2' }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}> Designer Notes</div>
                                    <p style={{ fontSize: 11, color: '#37352F', margin: 0, lineHeight: 1.5 }}>{selected.notes}</p>
                                </div>

                                {/* Revision Notes */}
                                {selected.revisionNotes && (
                                    <div style={{
                                        background: '#FEF2F2', borderRadius: 10, padding: 14, marginBottom: 14,
                                        border: '1px solid #FECACA',
                                    }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}> Revision Required</div>
                                        <p style={{ fontSize: 11, color: '#DC2626', margin: 0, lineHeight: 1.5 }}>{selected.revisionNotes}</p>
                                    </div>
                                )}

                                {/* File Upload */}
                                <div style={{
                                    border: '2px dashed #E9E9E7', borderRadius: 10, padding: 20, textAlign: 'center',
                                    marginBottom: 14, cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.background = '#F8FAFF'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E9E9E7'; e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <Upload style={{ width: 20, height: 20, color: '#9B9A97', margin: '0 auto 6px' }} />
                                    <div style={{ fontSize: 11, fontWeight: 600, color: '#6B6A67' }}>Upload Drawing File</div>
                                    <div style={{ fontSize: 9, color: '#9B9A97' }}>.dwg, .dxf, .pdf, .skp</div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {selected.status === 'queued' && (
                                        <button onClick={() => setDrawnings(prev => prev.map(d => d.id === selected.id ? { ...d, status: 'drafting' } : d))} style={{
                                            padding: '10px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
                                            background: '#3B82F6', color: 'white', fontFamily: f, width: '100%',
                                        }}> Start Drafting</button>
                                    )}
                                    {selected.status === 'drafting' && (
                                        <button onClick={() => setDrawnings(prev => prev.map(d => d.id === selected.id ? { ...d, status: 'review' } : d))} style={{
                                            padding: '10px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
                                            background: '#F59E0B', color: 'white', fontFamily: f, width: '100%',
                                        }}> Submit for Review</button>
                                    )}
                                    {selected.status === 'revision' && (
                                        <button onClick={() => setDrawnings(prev => prev.map(d => d.id === selected.id ? { ...d, status: 'drafting', version: d.version + 1 } : d))} style={{
                                            padding: '10px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
                                            background: '#EF4444', color: 'white', fontFamily: f, width: '100%',
                                        }}> Start Revision (v{selected.version + 1})</button>
                                    )}
                                    {selected.status === 'review' && (
                                        <button onClick={() => setDrawnings(prev => prev.map(d => d.id === selected.id ? { ...d, status: 'approved' } : d))} style={{
                                            padding: '10px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
                                            background: '#22C55E', color: 'white', fontFamily: f, width: '100%',
                                        }}>✅ Approve Drawing</button>
                                    )}
                                    {selected.status === 'approved' && (
                                        <button onClick={() => setRatingTarget({ name: 'Alex Ong (Drafter)', project: selected.project })} style={{
                                            padding: '10px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: '1px solid #FDE68A',
                                            background: '#FEF3C7', color: '#D97706', fontFamily: f, width: '100%', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                                        }}>🔒 Rate Drafter</button>
                                    )}
                                </div>

                                {/* Due Date */}
                                <div style={{ marginTop: 14, padding: '8px 12px', background: '#FAFAF9', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 10, color: '#9B9A97' }}> Due Date</span>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#37352F' }}>{selected.dueDate}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <RatingModal
                isOpen={!!ratingTarget}
                onClose={() => setRatingTarget(null)}
                onSubmit={(data) => { console.log('Drafter rating:', data); setRatingTarget(null); }}
                targetName={ratingTarget?.name || ''}
                targetRole="Drafter"
                projectName={ratingTarget?.project}
                criteria={CRITERIA.designerRatesDrafter}
            />
        </>
    );
}
