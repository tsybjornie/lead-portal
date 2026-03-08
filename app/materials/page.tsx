/**
 * Materials Page — Encyclopedia Browser integrated with Sequence Design System
 * Uses RoofNav, sidebar navigation, and the same visual language as /sequence
 */

'use client';

import React from 'react';
import RoofNav from '@/components/RoofNav';
import MaterialSearch from '@/components/MaterialSearch';
import { useMaterialContext } from '@/context/MaterialContext';
import { encyclopediaToSelection } from '@/lib/materialBridge';
import type { SearchableItem } from '@/components/MaterialSearch';
import type { MaterialEntry } from '@/data/encyclopedia/core';

const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const mono = "'JetBrains Mono', 'SF Mono', monospace";

export default function MaterialsPage() {
    const { addSelection, selections, removeSelection, totalCost, totalRetail, totalProfit } = useMaterialContext();

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            <RoofNav />

            <div style={{ display: 'flex', minHeight: 'calc(100vh - 48px)' }}>
                {/* ── Sidebar ── */}
                <aside style={{
                    width: 220, borderRight: '1px solid #E9E9E7', background: '#fff',
                    padding: '20px 0', flexShrink: 0, position: 'sticky', top: 48,
                    height: 'calc(100vh - 48px)', overflowY: 'auto',
                    display: 'flex', flexDirection: 'column',
                }}>
                    <div style={{ padding: '0 16px 16px', borderBottom: '1px solid #F3F3F2' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#37352F', letterSpacing: '-0.01em' }}>Materials</div>
                        <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 2 }}>Browse & Quote</div>
                    </div>

                    {/* Navigation */}
                    <nav style={{ padding: '12px 8px', flex: 1 }}>
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px', marginBottom: 2 }}>
                                Navigate
                            </div>
                            <a href="/sequence" style={{
                                display: 'block', padding: '6px 8px', fontSize: 12,
                                color: '#6B6A67', textDecoration: 'none',
                                borderRadius: 4, fontFamily: f,
                            }}>
                                ← Back to Sequence
                            </a>
                            <div style={{
                                display: 'block', padding: '6px 8px', fontSize: 12,
                                fontWeight: 600, color: '#37352F', background: '#F7F6F3',
                                borderRadius: 4,
                            }}>
                                Encyclopedia Browser
                            </div>
                        </div>

                        {/* Quick stats */}
                        {selections.length > 0 && (
                            <div style={{ marginTop: 16, padding: '0 8px' }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                                    Quote Summary
                                </div>
                                <div style={{
                                    background: '#F7F6F3', borderRadius: 8, padding: 12,
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
                                        <span style={{ color: '#9B9A97' }}>Items</span>
                                        <span style={{ fontWeight: 700, color: '#37352F' }}>{selections.length}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
                                        <span style={{ color: '#9B9A97' }}>Cost</span>
                                        <span style={{ fontFamily: mono, fontWeight: 700, color: '#37352F' }}>${totalCost.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
                                        <span style={{ color: '#9B9A97' }}>Retail</span>
                                        <span style={{ fontFamily: mono, fontWeight: 700, color: '#37352F' }}>${totalRetail.toLocaleString()}</span>
                                    </div>
                                    <div style={{ borderTop: '1px solid #E9E9E7', paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                                        <span style={{ fontWeight: 700, color: totalProfit >= 0 ? '#16A34A' : '#DC2626' }}>Profit</span>
                                        <span style={{ fontFamily: mono, fontWeight: 700, color: totalProfit >= 0 ? '#16A34A' : '#DC2626' }}>${totalProfit.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </nav>

                    {/* User */}
                    <div style={{ padding: '16px', borderTop: '1px solid #F3F3F2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#37352F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>JC</div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: '#37352F' }}>Jessica Chen</div>
                                <div style={{ fontSize: 9, color: '#9B9A97' }}>Senior Designer</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
                    <MaterialSearch
                        onSelectMaterial={(item: SearchableItem) => {
                            console.log('Selected:', item.name);
                        }}
                        onAddToQuote={(item: SearchableItem, room: string, quantity: string) => {
                            const selection = encyclopediaToSelection(
                                item.raw as MaterialEntry,
                                item.supplierInfo,
                                room,
                                quantity,
                                item.category,
                            );
                            addSelection(selection);
                        }}
                    />

                    {/* Selected Materials Table */}
                    {selections.length > 0 && (
                        <div style={{ marginTop: 32 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #F3F3F2' }}>
                                <div style={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }} />
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>📋 Selected Materials</span>
                                <span style={{ fontSize: 10, fontWeight: 500, color: '#9B9A97' }}>{selections.length} items</span>
                            </div>

                            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                    <thead>
                                        <tr style={{ background: '#FAFAF9', borderBottom: '1px solid #E9E9E7' }}>
                                            {['Material', 'Room', 'Category', 'Qty', 'Cost', 'Retail', 'Profit', ''].map(h => (
                                                <th key={h} style={{
                                                    padding: '10px 14px', textAlign: 'left',
                                                    fontSize: 9, fontWeight: 700, color: '#9B9A97',
                                                    textTransform: 'uppercase', letterSpacing: '0.06em',
                                                }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selections.map(sel => (
                                            <tr key={sel.id} style={{ borderBottom: '1px solid #F3F3F2' }}>
                                                <td style={{ padding: '12px 14px', fontWeight: 600, color: '#37352F' }}>
                                                    {sel.selectedItem}
                                                    {sel.overrideCost !== undefined && (
                                                        <span style={{
                                                            marginLeft: 6, fontSize: 9, padding: '1px 6px',
                                                            borderRadius: 3, fontWeight: 700,
                                                            background: (sel.costVariance || 0) < 0 ? '#F0FDF4' : '#FEF2F2',
                                                            color: (sel.costVariance || 0) < 0 ? '#16A34A' : '#DC2626',
                                                        }}>
                                                            {(sel.costVariance || 0) > 0 ? '+' : ''}{sel.costVariance}%
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '12px 14px', color: '#6B6A67' }}>{sel.room}</td>
                                                <td style={{ padding: '12px 14px' }}>
                                                    <span style={{
                                                        fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                                                        letterSpacing: '0.06em', padding: '2px 6px',
                                                        borderRadius: 3, background: '#F7F6F3', color: '#6B6A67',
                                                    }}>{sel.tradeCategory}</span>
                                                </td>
                                                <td style={{ padding: '12px 14px', fontFamily: mono, color: '#6B6A67' }}>{sel.quantity || '—'}</td>
                                                <td style={{ padding: '12px 14px', fontFamily: mono, color: '#37352F', fontWeight: 600 }}>${(sel.costTotal || 0).toFixed(0)}</td>
                                                <td style={{ padding: '12px 14px', fontFamily: mono, color: '#37352F', fontWeight: 600 }}>${(sel.retailTotal || 0).toFixed(0)}</td>
                                                <td style={{ padding: '12px 14px', fontFamily: mono, fontWeight: 700, color: (sel.designerProfit || 0) >= 0 ? '#16A34A' : '#DC2626' }}>
                                                    ${(sel.designerProfit || 0).toFixed(0)}
                                                </td>
                                                <td style={{ padding: '12px 14px' }}>
                                                    <button
                                                        onClick={() => removeSelection(sel.id)}
                                                        style={{
                                                            background: 'none', border: 'none', color: '#9B9A97',
                                                            cursor: 'pointer', fontSize: 14, padding: 2,
                                                        }}
                                                        title="Remove"
                                                    >×</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Totals row */}
                                        <tr style={{ background: '#FAFAF9' }}>
                                            <td colSpan={4} style={{ padding: '12px 14px', fontWeight: 800, color: '#37352F' }}>Total</td>
                                            <td style={{ padding: '12px 14px', fontFamily: mono, fontWeight: 800, color: '#37352F' }}>${totalCost.toLocaleString()}</td>
                                            <td style={{ padding: '12px 14px', fontFamily: mono, fontWeight: 800, color: '#37352F' }}>${totalRetail.toLocaleString()}</td>
                                            <td style={{ padding: '12px 14px', fontFamily: mono, fontWeight: 800, color: totalProfit >= 0 ? '#16A34A' : '#DC2626' }}>${totalProfit.toLocaleString()}</td>
                                            <td />
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
