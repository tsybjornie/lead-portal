'use client';

import { useState } from 'react';

// ============================================================
// TYPES
// ============================================================

interface Directive {
    id: string;
    taskNumber: string;
    description: string;
    zone: string;
    specs: string[];
    drawingRef: string;
    drawingTitle: string;
    materials: { item: string; qty: string; status: 'on-site' | 'ordered' | 'missing' }[];
    tools: { item: string; have: boolean }[];
    methodology: string;
    blocker: string | null;
    status: 'pending' | 'in-progress' | 'photo-required' | 'completed' | 'blocked';
    priority: 'normal' | 'urgent';
    ifcThreads: { id: string; question: string; askedBy: string; answeredBy: string | null; answer: string | null; timestamp: string; pinRef: string }[];
}

// ============================================================
// DEMO DATA — Directives derived from quote line items
// ============================================================

const TODAY_DIRECTIVES: Directive[] = [
    {
        id: 'd1', taskNumber: 'T-001',
        description: 'Install kitchen base cabinets',
        zone: 'Kitchen',
        specs: ['Marine Plywood 18mm', 'Formica laminate — Warm Oak (WO-442)', 'Blum soft-close hinges', 'Hafele handles — Brushed Nickel'],
        drawingRef: 'DWG-004', drawingTitle: 'Kitchen Layout Plan (Rev.2)',
        materials: [
            { item: 'Marine Plywood 18mm × 12 sheets', qty: '12 sheets', status: 'on-site' },
            { item: 'Formica WO-442 laminate', qty: '8 sheets', status: 'on-site' },
            { item: 'Blum soft-close 110° × 24', qty: '24 pcs', status: 'on-site' },
            { item: 'Hafele BN handles × 12', qty: '12 pcs', status: 'ordered' },
        ],
        tools: [
            { item: 'Table saw', have: true },
            { item: 'Dowel jig', have: true },
            { item: 'Laser level', have: true },
            { item: 'Edge banding machine', have: true },
        ],
        methodology: 'Mount wall cleat at 850mm from FFL. Level across full 3.2m run using laser. Install carcass left-to-right. Ensure 2mm gap from wall. Fixed panel at hob location — NO drawer here.',
        blocker: null,
        status: 'in-progress',
        priority: 'normal',
        ifcThreads: [
            {
                id: 'ifc1', question: 'Drawing shows 3.2m run but wall measures 3.18m. Adjust last panel?',
                askedBy: 'Kumar', answeredBy: 'Bjorn Teo (ID)', answer: 'Yes, trim last panel by 20mm. Keep equal gaps. Updated DWG-004 Rev.3 uploaded.',
                timestamp: '2026-03-05 14:30', pinRef: 'DWG-004 → Panel P6',
            },
        ],
    },
    {
        id: 'd2', taskNumber: 'T-002',
        description: 'Build master bedroom wardrobe frame',
        zone: 'Master Bedroom',
        specs: ['Marine Plywood 18mm', 'Laminate — Walnut Dark (WD-118)', 'Full extension drawer slides × 6'],
        drawingRef: 'DWG-007', drawingTitle: 'Master Bedroom Elevation (Rev.1)',
        materials: [
            { item: 'Marine Plywood 18mm × 8 sheets', qty: '8 sheets', status: 'on-site' },
            { item: 'WD-118 laminate', qty: '6 sheets', status: 'missing' },
        ],
        tools: [
            { item: 'Table saw', have: true },
            { item: 'Dowel jig', have: true },
            { item: 'Panel clamps × 4', have: false },
        ],
        methodology: 'Wardrobe frame 2.4m(H) × 3.0m(W). Three compartments: left hanging (600mm deep), center drawers, right shelving. Build frame first, laminate on-site after alignment check.',
        blocker: 'Laminate WD-118 not delivered yet. ETA: Mar 7.',
        status: 'blocked',
        priority: 'normal',
        ifcThreads: [],
    },
    {
        id: 'd3', taskNumber: 'T-003',
        description: 'Install shoe cabinet at entrance',
        zone: 'Foyer',
        specs: ['Plywood 12mm', 'Spray paint — Matt White', 'Flip-down doors × 3'],
        drawingRef: 'DWG-002', drawingTitle: 'Foyer Layout Plan',
        materials: [
            { item: 'Plywood 12mm × 3 sheets', qty: '3 sheets', status: 'on-site' },
            { item: 'Flip-down mechanisms × 3', qty: '3 sets', status: 'on-site' },
        ],
        tools: [
            { item: 'Spray gun', have: true },
            { item: 'Compressor', have: true },
        ],
        methodology: '1200mm(H) × 900mm(W) × 350mm(D). Wall-mounted at 150mm from FFL. Three tiers, flip-down doors. Pre-spray all panels before assembly.',
        blocker: null,
        status: 'pending',
        priority: 'urgent',
        ifcThreads: [],
    },
];

// ============================================================
// COMPONENT
// ============================================================

export default function WorkerTasksPage() {
    const [expandedTask, setExpandedTask] = useState<string | null>('d1');
    const [showIFC, setShowIFC] = useState<string | null>(null);
    const [newQuestion, setNewQuestion] = useState('');
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const statusColor = (s: string) => ({
        'pending': '#9B9A97', 'in-progress': '#3B82F6', 'photo-required': '#F59E0B',
        'completed': '#10B981', 'blocked': '#EF4444',
    }[s] || '#9B9A97');

    const statusLabel = (s: string) => ({
        'pending': 'Not Started', 'in-progress': 'In Progress', 'photo-required': 'Photo Needed',
        'completed': 'Done', 'blocked': 'Blocked',
    }[s] || s);

    const completedCount = TODAY_DIRECTIVES.filter(d => d.status === 'completed').length;

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px', background: '#37352F', color: 'white',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div>
                    <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Worker View — WoodWork SG
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
                        Kumar Saravanan
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, opacity: 0.6 }}>Checked in at</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'SF Mono', monospace" }}>08:15</div>
                </div>
            </div>

            {/* Site Info Bar */}
            <div style={{
                padding: '12px 20px', background: 'white', borderBottom: '1px solid #E9E9E7',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#37352F' }}>Lim Residence</div>
                    <div style={{ fontSize: 11, color: '#9B9A97' }}>Blk 412 #08-345 Punggol</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>
                    {completedCount}/{TODAY_DIRECTIVES.length} tasks
                </div>
            </div>

            {/* Task List */}
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Today&apos;s Directives
                </div>

                {TODAY_DIRECTIVES.map(d => {
                    const isExpanded = expandedTask === d.id;
                    const hasMissing = d.materials.some(m => m.status === 'missing') || d.tools.some(t => !t.have);

                    return (
                        <div key={d.id} style={{
                            background: 'white', borderRadius: 10,
                            border: `1px solid ${d.status === 'blocked' ? '#FECACA' : d.priority === 'urgent' ? '#FDE68A' : '#E9E9E7'}`,
                            overflow: 'hidden',
                        }}>
                            {/* Task Header — always visible */}
                            <button
                                onClick={() => setExpandedTask(isExpanded ? null : d.id)}
                                style={{
                                    width: '100%', padding: '16px 20px', border: 'none', background: 'none',
                                    cursor: 'pointer', textAlign: 'left', fontFamily: f,
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700, fontFamily: "'SF Mono', monospace",
                                            color: '#9B9A97',
                                        }}>{d.taskNumber}</span>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                                            background: `${statusColor(d.status)}15`, color: statusColor(d.status),
                                            textTransform: 'uppercase',
                                        }}>{statusLabel(d.status)}</span>
                                        {d.priority === 'urgent' && (
                                            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#FEF3C7', color: '#D97706' }}>URGENT</span>
                                        )}
                                        {hasMissing && (
                                            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#FEF2F2', color: '#EF4444' }}>MISSING ITEMS</span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#37352F' }}>{d.description}</div>
                                    <div style={{ fontSize: 11, color: '#9B9A97', marginTop: 2 }}>
                                        {d.zone} — Ref: {d.drawingRef}
                                    </div>
                                </div>
                                <span style={{ fontSize: 16, color: '#9B9A97', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                    ▼
                                </span>
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div style={{ padding: '0 20px 20px', borderTop: '1px solid #F5F5F4' }}>
                                    {/* Blocker Alert */}
                                    {d.blocker && (
                                        <div style={{
                                            margin: '12px 0', padding: '10px 14px', borderRadius: 8,
                                            background: '#FEF2F2', border: '1px solid #FECACA',
                                        }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', marginBottom: 4 }}>Blocker</div>
                                            <div style={{ fontSize: 12, color: '#37352F' }}>{d.blocker}</div>
                                        </div>
                                    )}

                                    {/* Drawing Reference */}
                                    <div style={{
                                        margin: '12px 0', padding: '12px 14px', borderRadius: 8,
                                        background: '#F0F4FF', border: '1px solid #DBEAFE', cursor: 'pointer',
                                    }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', marginBottom: 4 }}>Drawing</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F' }}>
                                            {d.drawingRef} — {d.drawingTitle}
                                        </div>
                                        <div style={{ fontSize: 10, color: '#3B82F6', marginTop: 4, fontWeight: 600 }}>Tap to view full drawing →</div>
                                    </div>

                                    {/* Methodology */}
                                    <div style={{ margin: '12px 0' }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                                            How to Execute
                                        </div>
                                        <div style={{
                                            fontSize: 12, color: '#37352F', lineHeight: 1.6,
                                            padding: '10px 14px', background: '#F7F6F3', borderRadius: 8,
                                        }}>
                                            {d.methodology}
                                        </div>
                                    </div>

                                    {/* Specifications */}
                                    <div style={{ margin: '12px 0' }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                                            Specifications
                                        </div>
                                        {d.specs.map((s, i) => (
                                            <div key={i} style={{ fontSize: 12, color: '#37352F', padding: '3px 0', display: 'flex', gap: 6 }}>
                                                <span style={{ color: '#9B9A97' }}>·</span> {s}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Materials Checklist */}
                                    <div style={{ margin: '12px 0' }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                                            Materials
                                        </div>
                                        {d.materials.map((m, i) => (
                                            <div key={i} style={{
                                                fontSize: 12, padding: '6px 0', display: 'flex',
                                                justifyContent: 'space-between', alignItems: 'center',
                                                borderBottom: i < d.materials.length - 1 ? '1px solid #F5F5F4' : 'none',
                                            }}>
                                                <span style={{ color: '#37352F' }}>{m.item}</span>
                                                <span style={{
                                                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                                                    background: m.status === 'on-site' ? '#ECFDF5' : m.status === 'ordered' ? '#FEF3C7' : '#FEF2F2',
                                                    color: m.status === 'on-site' ? '#10B981' : m.status === 'ordered' ? '#D97706' : '#EF4444',
                                                    textTransform: 'uppercase',
                                                }}>{m.status}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tools Checklist */}
                                    <div style={{ margin: '12px 0' }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                                            Tools Required
                                        </div>
                                        {d.tools.map((t, i) => (
                                            <div key={i} style={{ fontSize: 12, padding: '4px 0', display: 'flex', gap: 8, color: '#37352F' }}>
                                                <span style={{ color: t.have ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                                                    {t.have ? '✓' : '✗'}
                                                </span>
                                                <span style={{ textDecoration: !t.have ? 'none' : 'none' }}>{t.item}</span>
                                                {!t.have && <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 600 }}>MISSING</span>}
                                            </div>
                                        ))}
                                    </div>

                                    {/* IFC Thread — Anti Telephone Game */}
                                    <div style={{ margin: '12px 0' }}>
                                        <div style={{
                                            fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase',
                                            letterSpacing: '0.06em', marginBottom: 6,
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        }}>
                                            <span>Questions (IFC)</span>
                                            {d.ifcThreads.length > 0 && (
                                                <span style={{ fontSize: 9, color: '#10B981', fontWeight: 700 }}>
                                                    {d.ifcThreads.filter(t => t.answer).length}/{d.ifcThreads.length} answered
                                                </span>
                                            )}
                                        </div>

                                        {d.ifcThreads.map(ifc => (
                                            <div key={ifc.id} style={{
                                                padding: '10px 14px', background: '#F7F6F3', borderRadius: 8, marginBottom: 8,
                                            }}>
                                                <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F', marginBottom: 4 }}>
                                                    {ifc.question}
                                                </div>
                                                <div style={{ fontSize: 10, color: '#9B9A97', marginBottom: 6 }}>
                                                    Asked by {ifc.askedBy} · {ifc.timestamp} · Pin: {ifc.pinRef}
                                                </div>
                                                {ifc.answer && (
                                                    <div style={{
                                                        padding: '8px 12px', background: '#ECFDF5', borderRadius: 6,
                                                        borderLeft: '3px solid #10B981',
                                                    }}>
                                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#10B981', marginBottom: 2 }}>
                                                            {ifc.answeredBy}
                                                        </div>
                                                        <div style={{ fontSize: 12, color: '#37352F' }}>{ifc.answer}</div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Ask Question */}
                                        {showIFC === d.id ? (
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <input
                                                    value={newQuestion}
                                                    onChange={e => setNewQuestion(e.target.value)}
                                                    placeholder="Type your question..."
                                                    style={{
                                                        flex: 1, padding: '8px 12px', fontSize: 12, fontFamily: f,
                                                        border: '1px solid #E9E9E7', borderRadius: 8, outline: 'none',
                                                    }}
                                                />
                                                <button style={{
                                                    padding: '8px 16px', fontSize: 11, fontWeight: 700,
                                                    background: '#37352F', color: 'white', border: 'none',
                                                    borderRadius: 8, cursor: 'pointer', fontFamily: f,
                                                    whiteSpace: 'nowrap',
                                                }}>Send IFC</button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowIFC(d.id)}
                                                style={{
                                                    width: '100%', padding: '10px', fontSize: 12, fontWeight: 600,
                                                    background: 'none', border: '1px dashed #D1D0CD', borderRadius: 8,
                                                    cursor: 'pointer', color: '#9B9A97', fontFamily: f,
                                                }}
                                            >
                                                Ask a Question (IFC)
                                            </button>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                                        {d.status !== 'completed' && d.status !== 'blocked' && (
                                            <button style={{
                                                flex: 1, padding: '12px', fontSize: 13, fontWeight: 700,
                                                background: '#37352F', color: 'white', border: 'none',
                                                borderRadius: 8, cursor: 'pointer', fontFamily: f,
                                            }}>
                                                {d.status === 'pending' ? 'Start Task' : 'Upload Photo Evidence'}
                                            </button>
                                        )}
                                        {d.status === 'in-progress' && (
                                            <button style={{
                                                padding: '12px 20px', fontSize: 13, fontWeight: 700,
                                                background: '#10B981', color: 'white', border: 'none',
                                                borderRadius: 8, cursor: 'pointer', fontFamily: f,
                                            }}>
                                                Mark Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
