'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, Hammer, PaintBucket, Zap, Wrench, ChevronDown, ChevronRight, Package, Truck, Check } from 'lucide-react';
import { MATERIAL_CATALOG, CatalogItem } from '../../src/logic/AutoPricingEngine';

// ============================================================
// TYPES
// ============================================================

interface MaterialEntry {
    catalogId: string;
    qty: number;
    status: 'NOT_ORDERED' | 'ORDERED' | 'DELIVERED' | 'INSTALLED';
}

interface ScheduleBlock {
    id: string;
    trade: string;
    vendor: string;
    karmaTier: 'GOLD' | 'SILVER' | 'BRONZE';
    startDate: string;
    endDate: string;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED' | 'BLOCKED';
    dependencies: string[];
    progress: number;
    materials: MaterialEntry[];
}

// ============================================================
// DEMO DATA — Materials auto-reference MATERIAL_CATALOG
// ============================================================

const DEMO_SCHEDULE: ScheduleBlock[] = [
    {
        id: 'S1', trade: 'Hacking & Removal', vendor: 'Ah Kow Demolition', karmaTier: 'GOLD',
        startDate: 'Mar 10', endDate: 'Mar 14', status: 'COMPLETED', dependencies: [], progress: 100,
        materials: [],
    },
    {
        id: 'S2', trade: 'Electrical Rewiring', vendor: 'PowerTech SG', karmaTier: 'GOLD',
        startDate: 'Mar 15', endDate: 'Mar 19', status: 'IN_PROGRESS', dependencies: ['S1'], progress: 60,
        materials: [
            { catalogId: 'elec-002', qty: 24, status: 'DELIVERED' },
            { catalogId: 'elec-003', qty: 8, status: 'DELIVERED' },
            { catalogId: 'elec-005', qty: 4, status: 'ORDERED' },
            { catalogId: 'elec-006', qty: 3, status: 'ORDERED' },
            { catalogId: 'elec-001', qty: 18, status: 'DELIVERED' },
            { catalogId: 'elec-010', qty: 1, status: 'DELIVERED' },
            { catalogId: 'elec-009', qty: 1, status: 'DELIVERED' },
            { catalogId: 'light-001', qty: 4, status: 'NOT_ORDERED' },
            { catalogId: 'light-002', qty: 8, status: 'NOT_ORDERED' },
        ],
    },
    {
        id: 'S3', trade: 'Plumbing', vendor: 'WaterWorks Pte Ltd', karmaTier: 'SILVER',
        startDate: 'Mar 15', endDate: 'Mar 18', status: 'IN_PROGRESS', dependencies: ['S1'], progress: 40,
        materials: [
            { catalogId: 'plumb-001', qty: 2, status: 'DELIVERED' },
            { catalogId: 'plumb-002', qty: 1, status: 'DELIVERED' },
            { catalogId: 'plumb-003', qty: 2, status: 'ORDERED' },
            { catalogId: 'plumb-004', qty: 2, status: 'ORDERED' },
            { catalogId: 'plumb-005', qty: 1, status: 'NOT_ORDERED' },
            { catalogId: 'plumb-006', qty: 2, status: 'NOT_ORDERED' },
            { catalogId: 'plumb-007', qty: 3, status: 'DELIVERED' },
        ],
    },
    {
        id: 'S4', trade: 'Masonry & Tiling', vendor: 'TileKing', karmaTier: 'SILVER',
        startDate: 'Mar 20', endDate: 'Mar 28', status: 'SCHEDULED', dependencies: ['S2', 'S3'], progress: 0,
        materials: [
            { catalogId: 'tile-003', qty: 120, status: 'NOT_ORDERED' },
            { catalogId: 'tile-004', qty: 45, status: 'NOT_ORDERED' },
            { catalogId: 'tile-007', qty: 80, status: 'NOT_ORDERED' },
            { catalogId: 'adh-001', qty: 12, status: 'NOT_ORDERED' },
            { catalogId: 'adh-002', qty: 4, status: 'NOT_ORDERED' },
            { catalogId: 'adh-004', qty: 2, status: 'NOT_ORDERED' },
            { catalogId: 'adh-005', qty: 6, status: 'NOT_ORDERED' },
        ],
    },
    {
        id: 'S5', trade: 'Carpentry', vendor: 'CraftMaster Workshop', karmaTier: 'GOLD',
        startDate: 'Mar 22', endDate: 'Apr 5', status: 'SCHEDULED', dependencies: ['S2'], progress: 0,
        materials: [
            { catalogId: 'hw-001', qty: 200, status: 'NOT_ORDERED' },
            { catalogId: 'lam-001', qty: 300, status: 'NOT_ORDERED' },
            { catalogId: 'hw-003', qty: 6, status: 'NOT_ORDERED' },
            { catalogId: 'hw-004', qty: 24, status: 'NOT_ORDERED' },
            { catalogId: 'hw-007', qty: 8, status: 'NOT_ORDERED' },
            { catalogId: 'ct-001', qty: 25, status: 'NOT_ORDERED' },
        ],
    },
    {
        id: 'S6', trade: 'Painting', vendor: 'Pending Dispatch', karmaTier: 'BRONZE',
        startDate: 'Apr 6', endDate: 'Apr 10', status: 'BLOCKED', dependencies: ['S4', 'S5'], progress: 0,
        materials: [
            { catalogId: 'paint-001', qty: 15, status: 'NOT_ORDERED' },
            { catalogId: 'paint-006', qty: 5, status: 'NOT_ORDERED' },
        ],
    },
    {
        id: 'S7', trade: 'Cleaning & Handover', vendor: 'SparkleClean SG', karmaTier: 'SILVER',
        startDate: 'Apr 11', endDate: 'Apr 12', status: 'SCHEDULED', dependencies: ['S6'], progress: 0,
        materials: [],
    },
];

// ============================================================
// STYLING
// ============================================================

const STATUS_STYLES: Record<string, { bg: string; text: string; bar: string }> = {
    COMPLETED: { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500' },
    IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
    SCHEDULED: { bg: 'bg-gray-50', text: 'text-gray-500', bar: 'bg-gray-300' },
    BLOCKED: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-400' },
};

const KARMA_BADGE: Record<string, string> = {
    GOLD: 'bg-yellow-100 text-yellow-800',
    SILVER: 'bg-gray-100 text-gray-600',
    BRONZE: 'bg-orange-100 text-orange-700',
};

const TRADE_ICON: Record<string, React.ElementType> = {
    'Hacking & Removal': Hammer,
    'Electrical Rewiring': Zap,
    'Plumbing': Wrench,
    'Masonry & Tiling': PaintBucket,
    'Carpentry': Hammer,
    'Painting': PaintBucket,
    'Cleaning & Handover': CheckCircle,
};

const MAT_STATUS_STYLE: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    NOT_ORDERED: { bg: '#F7F6F3', text: '#9B9A97', icon: Package },
    ORDERED: { bg: '#EFF6FF', text: '#3B82F6', icon: Truck },
    DELIVERED: { bg: '#F0FDF4', text: '#22C55E', icon: Check },
    INSTALLED: { bg: '#F5F3FF', text: '#8B5CF6', icon: CheckCircle },
};

// ============================================================
// HELPERS
// ============================================================

function getCatalogItem(id: string): CatalogItem | undefined {
    return MATERIAL_CATALOG.find(m => m.id === id);
}

function calcMaterialCost(materials: MaterialEntry[]): number {
    return materials.reduce((sum, m) => {
        const item = getCatalogItem(m.catalogId);
        return sum + (item ? item.pricePerUnit * m.qty : 0);
    }, 0);
}

// ============================================================
// COMPONENT
// ============================================================

export default function SequencePage() {
    const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const totalTasks = DEMO_SCHEDULE.length;
    const completed = DEMO_SCHEDULE.filter(s => s.status === 'COMPLETED').length;
    const blocked = DEMO_SCHEDULE.filter(s => s.status === 'BLOCKED').length;
    const overallProgress = Math.round(DEMO_SCHEDULE.reduce((sum, s) => sum + s.progress, 0) / totalTasks);
    const totalMaterialCost = DEMO_SCHEDULE.reduce((sum, s) => sum + calcMaterialCost(s.materials), 0);
    const totalMaterialItems = DEMO_SCHEDULE.reduce((sum, s) => sum + s.materials.length, 0);
    const deliveredItems = DEMO_SCHEDULE.reduce((sum, s) => sum + s.materials.filter(m => m.status === 'DELIVERED' || m.status === 'INSTALLED').length, 0);

    const toggleBlock = (id: string) => {
        setExpandedBlocks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            {/* Header */}
            <header style={{
                padding: '20px 32px', borderBottom: '1px solid #E9E9E7',
                background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'sticky', top: 0, zIndex: 30,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link href="/hub" style={{ color: '#9B9A97', textDecoration: 'none' }}>
                        <ArrowLeft style={{ width: 20, height: 20 }} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#37352F', letterSpacing: '-0.02em' }}>Sequence</h1>
                        <p style={{ fontSize: 10, color: '#9B9A97', margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>Schedule every trade, track every task</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#37352F' }}>{overallProgress}%</div>
                        <div style={{ fontSize: 9, color: '#9B9A97', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overall</div>
                    </div>
                    <div style={{ width: 120, height: 6, background: '#F5F5F4', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${overallProgress}%`, background: '#37352F', borderRadius: 3, transition: 'width 0.3s' }} />
                    </div>
                </div>
            </header>

            <div style={{ padding: '24px 32px' }}>
                {/* Stats Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: blocked > 0 ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                    <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#22C55E' }}>{completed}</div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Completed</div>
                    </div>
                    <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#3B82F6' }}>{DEMO_SCHEDULE.filter(s => s.status === 'IN_PROGRESS').length}</div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.1em' }}>In Progress</div>
                    </div>
                    <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#9B9A97' }}>{DEMO_SCHEDULE.filter(s => s.status === 'SCHEDULED').length}</div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scheduled</div>
                    </div>
                    {blocked > 0 && (
                        <div style={{ background: '#FEF2F2', borderRadius: 10, border: '1px solid #FECACA', padding: 16, textAlign: 'center' }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#EF4444' }}>{blocked}</div>
                            <div style={{ fontSize: 9, fontWeight: 600, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Blocked</div>
                        </div>
                    )}
                    <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#37352F' }}>${totalMaterialCost.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{deliveredItems}/{totalMaterialItems} Items Received</div>
                    </div>
                </div>

                {/* Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {DEMO_SCHEDULE.map((block, i) => {
                        const style = STATUS_STYLES[block.status];
                        const Icon = TRADE_ICON[block.trade] || Hammer;
                        const isExpanded = expandedBlocks[block.id] || false;
                        const matCost = calcMaterialCost(block.materials);
                        const statusBg = style.bg.replace('bg-', '');

                        return (
                            <div key={block.id} style={{
                                background: 'white', borderRadius: 10, border: `1px solid ${block.status === 'BLOCKED' ? '#FECACA' : '#E9E9E7'}`,
                                overflow: 'hidden', transition: 'border-color 0.15s',
                            }}>
                                {/* Trade Header Row */}
                                <div
                                    onClick={() => block.materials.length > 0 && toggleBlock(block.id)}
                                    style={{
                                        padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14,
                                        cursor: block.materials.length > 0 ? 'pointer' : 'default',
                                    }}
                                >
                                    {/* Status icon */}
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: block.status === 'COMPLETED' ? '#F0FDF4' : block.status === 'IN_PROGRESS' ? '#EFF6FF' : block.status === 'BLOCKED' ? '#FEF2F2' : '#F7F6F3',
                                    }}>
                                        {block.status === 'COMPLETED' ? (
                                            <CheckCircle style={{ width: 16, height: 16, color: '#22C55E' }} />
                                        ) : block.status === 'BLOCKED' ? (
                                            <AlertTriangle style={{ width: 16, height: 16, color: '#EF4444' }} />
                                        ) : (
                                            <Icon style={{ width: 16, height: 16, color: block.status === 'IN_PROGRESS' ? '#3B82F6' : '#9B9A97' }} />
                                        )}
                                    </div>

                                    {/* Trade info */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>{block.trade}</span>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: 12, fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                                                background: block.status === 'COMPLETED' ? '#F0FDF4' : block.status === 'IN_PROGRESS' ? '#EFF6FF' : block.status === 'BLOCKED' ? '#FEF2F2' : '#F7F6F3',
                                                color: block.status === 'COMPLETED' ? '#22C55E' : block.status === 'IN_PROGRESS' ? '#3B82F6' : block.status === 'BLOCKED' ? '#EF4444' : '#9B9A97',
                                            }}>
                                                {block.status.replace('_', ' ')}
                                            </span>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: 12, fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                                                background: block.karmaTier === 'GOLD' ? '#FEF9C3' : block.karmaTier === 'SILVER' ? '#F3F4F6' : '#FFF7ED',
                                                color: block.karmaTier === 'GOLD' ? '#A16207' : block.karmaTier === 'SILVER' ? '#6B7280' : '#C2410C',
                                            }}>
                                                {block.karmaTier}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 11, color: '#9B9A97', marginTop: 2 }}>
                                            {block.vendor} · {block.startDate} – {block.endDate}
                                        </div>
                                    </div>

                                    {/* Material summary */}
                                    {block.materials.length > 0 && (
                                        <div style={{ textAlign: 'right', marginRight: 12 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>
                                                ${matCost.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                            </div>
                                            <div style={{ fontSize: 9, color: '#9B9A97' }}>
                                                {block.materials.length} items · {block.materials.filter(m => m.status === 'DELIVERED' || m.status === 'INSTALLED').length} received
                                            </div>
                                        </div>
                                    )}

                                    {/* Progress bar */}
                                    <div style={{ width: 100 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', marginBottom: 4, textAlign: 'right' }}>{block.progress}%</div>
                                        <div style={{ width: '100%', height: 5, background: '#F5F5F4', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', borderRadius: 3, transition: 'width 0.3s',
                                                width: `${block.progress}%`,
                                                background: block.status === 'COMPLETED' ? '#22C55E' : block.status === 'IN_PROGRESS' ? '#3B82F6' : block.status === 'BLOCKED' ? '#EF4444' : '#D4D3D0',
                                            }} />
                                        </div>
                                    </div>

                                    {/* Expand chevron */}
                                    {block.materials.length > 0 && (
                                        <div style={{ color: '#D4D3D0' }}>
                                            {isExpanded ? <ChevronDown style={{ width: 16, height: 16 }} /> : <ChevronRight style={{ width: 16, height: 16 }} />}
                                        </div>
                                    )}

                                    {/* Date */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9B9A97', fontSize: 10 }}>
                                        <Clock style={{ width: 12, height: 12 }} />
                                        {block.startDate} – {block.endDate}
                                    </div>
                                </div>

                                {/* Materials Panel (expanded) */}
                                {isExpanded && block.materials.length > 0 && (
                                    <div style={{ borderTop: '1px solid #F5F5F4', padding: '0 20px 16px' }}>
                                        <div style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '12px 0 8px' }}>
                                            Materials — pulled from Dispatch Catalog
                                        </div>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid #F5F5F4' }}>
                                                    {['Material', 'Brand', 'Qty', 'Unit Price', 'Total', 'Status'].map(h => (
                                                        <th key={h} style={{
                                                            padding: '6px 8px', textAlign: h === 'Material' || h === 'Brand' || h === 'Status' ? 'left' : 'right',
                                                            fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em',
                                                        }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {block.materials.map((mat) => {
                                                    const item = getCatalogItem(mat.catalogId);
                                                    if (!item) return null;
                                                    const total = item.pricePerUnit * mat.qty;
                                                    const ms = MAT_STATUS_STYLE[mat.status];
                                                    const StatusIcon = ms.icon;
                                                    return (
                                                        <tr key={mat.catalogId} style={{ borderBottom: '1px solid #FAFAF9' }}>
                                                            <td style={{ padding: '8px', fontWeight: 600, color: '#37352F' }}>{item.name}</td>
                                                            <td style={{ padding: '8px', color: '#6B6A67' }}>{item.brand}</td>
                                                            <td style={{ padding: '8px', textAlign: 'right', color: '#37352F' }}>{mat.qty} <span style={{ fontSize: 9, color: '#9B9A97' }}>{item.unit}</span></td>
                                                            <td style={{ padding: '8px', textAlign: 'right', color: '#9B9A97' }}>${item.pricePerUnit.toFixed(2)}</td>
                                                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#37352F' }}>${total.toLocaleString('en-SG', { minimumFractionDigits: 2 })}</td>
                                                            <td style={{ padding: '8px' }}>
                                                                <span style={{
                                                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                                                    padding: '2px 8px', borderRadius: 12, fontSize: 9, fontWeight: 700,
                                                                    background: ms.bg, color: ms.text,
                                                                }}>
                                                                    <StatusIcon style={{ width: 10, height: 10 }} />
                                                                    {mat.status.replace('_', ' ')}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot>
                                                <tr style={{ borderTop: '1px solid #E9E9E7' }}>
                                                    <td colSpan={4} style={{ padding: '8px', fontSize: 11, fontWeight: 700, color: '#9B9A97', textAlign: 'right' }}>Subtotal</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontSize: 14, fontWeight: 800, color: '#37352F' }}>${matCost.toLocaleString('en-SG', { minimumFractionDigits: 2 })}</td>
                                                    <td />
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
