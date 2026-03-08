'use client';

import { useState } from 'react';
import RoofNav from '@/components/RoofNav';

export default function FollowUpPage() {
    const [tab, setTab] = useState<'pipeline' | 'broadcast' | 'export'>('pipeline');
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            <RoofNav />
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 80px' }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#37352F', margin: '0 0 6px' }}>Follow Up</h1>
                <p style={{ fontSize: 12, color: '#9B9A97', margin: '0 0 20px' }}>Lead pipeline, broadcasts, and data exports</p>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 2, marginBottom: 20, background: '#F7F6F3', borderRadius: 8, padding: 3 }}>
                    {(['pipeline', 'broadcast', 'export'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            flex: 1, padding: '8px 0', fontSize: 12, fontWeight: 600, borderRadius: 6,
                            border: 'none', cursor: 'pointer', fontFamily: f, textTransform: 'capitalize',
                            background: tab === t ? 'white' : 'transparent',
                            color: tab === t ? '#37352F' : '#9B9A97',
                            boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                        }}>{t}</button>
                    ))}
                </div>

                {/* Pipeline */}
                {tab === 'pipeline' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {[
                            {
                                stage: 'New Lead', color: '#3B82F6', leads: [
                                    { name: 'Mrs Lim', project: '4-Room HDB Tampines', budget: '$65k', source: 'Referral', days: 2 },
                                    { name: 'Mr Chen', project: '5-Room BTO Woodlands', budget: '$90k', source: 'Website', days: 1 },
                                    { name: 'The Wongs', project: 'Condo Bishan', budget: '$120k', source: 'Instagram', days: 3 },
                                ]
                            },
                            {
                                stage: 'Site Visit', color: '#8B5CF6', leads: [
                                    { name: 'Mr & Mrs Tan', project: '4-Room HDB Clementi', budget: '$80k', source: 'Referral', days: 5 },
                                    { name: 'Ms Ng', project: '3-Room BTO Punggol', budget: '$45k', source: 'Carousell', days: 7 },
                                ]
                            },
                            {
                                stage: 'Quotation Sent', color: '#F59E0B', leads: [
                                    { name: 'Mr Raj', project: 'Landed Terrace', budget: '$180k', source: 'Agent', days: 12 },
                                    { name: 'Dr Lee', project: 'Penthouse Orchard', budget: '$250k', source: 'Referral', days: 9 },
                                ]
                            },
                            {
                                stage: 'Won', color: '#22C55E', leads: [
                                    { name: 'Mr & Mrs Koh', project: 'EC Sengkang', budget: '$95k', source: 'Website', days: 21 },
                                ]
                            },
                        ].map(col => (
                            <div key={col.stage}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '0 4px' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#37352F' }}>{col.stage}</span>
                                    <span style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', background: '#F7F6F3', padding: '1px 6px', borderRadius: 4 }}>{col.leads.length}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {col.leads.map((lead, i) => (
                                        <div key={i} style={{
                                            background: 'white', borderRadius: 8, border: '1px solid #E9E9E7', padding: 12,
                                            borderLeft: `3px solid ${col.color}`, cursor: 'pointer',
                                        }}>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F', marginBottom: 3 }}>{lead.name}</div>
                                            <div style={{ fontSize: 10, color: '#6B6A67', marginBottom: 4 }}>{lead.project}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: 11, fontWeight: 700, color: col.color, fontFamily: "'SF Mono', monospace" }}>{lead.budget}</span>
                                                <span style={{ fontSize: 9, color: '#D4D3D0' }}>{lead.days}d ago</span>
                                            </div>
                                            <div style={{ fontSize: 9, color: '#9B9A97', marginTop: 4 }}>via {lead.source}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Broadcast */}
                {tab === 'broadcast' && (
                    <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 24 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#37352F', margin: '0 0 16px' }}>Broadcast Messages</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                            <div>
                                <label style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Audience</label>
                                <select style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f }}>
                                    <option>All Leads</option>
                                    <option>New Leads Only</option>
                                    <option>Site Visit Stage</option>
                                    <option>Quotation Sent</option>
                                    <option>Past Clients</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Channel</label>
                                <select style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f }}>
                                    <option>WhatsApp</option>
                                    <option>Email</option>
                                    <option>SMS</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Message</label>
                            <textarea placeholder="Type your broadcast message..." style={{ width: '100%', padding: 12, fontSize: 12, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f, minHeight: 100, resize: 'vertical', boxSizing: 'border-box' }} />
                        </div>
                        <button style={{ marginTop: 12, padding: '10px 24px', fontSize: 12, fontWeight: 700, background: '#37352F', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                            Send Broadcast
                        </button>
                    </div>
                )}

                {/* Export */}
                {tab === 'export' && (
                    <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 24 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#37352F', margin: '0 0 16px' }}>Export Data</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                            {[
                                { label: 'Lead Pipeline', desc: 'All leads with stage, budget, source', format: 'CSV', icon: '📊' },
                                { label: 'Client List', desc: 'Active + past clients with project details', format: 'XLSX', icon: '👥' },
                                { label: 'Financial Summary', desc: 'Income, expenses, GST for IRAS filing', format: 'PDF', icon: '💰' },
                                { label: 'Vendor Payments', desc: 'All vendor transactions with codes', format: 'CSV', icon: '🏗️' },
                                { label: 'Project Timeline', desc: 'Milestones and completion dates', format: 'PDF', icon: '📅' },
                                { label: 'Full Backup', desc: 'Complete data export for all modules', format: 'ZIP', icon: '💾' },
                            ].map(item => (
                                <button key={item.label} style={{
                                    background: '#FAFAF9', border: '1px solid #E9E9E7', borderRadius: 10, padding: 16,
                                    cursor: 'pointer', textAlign: 'left', fontFamily: f,
                                }}>
                                    <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F', marginBottom: 4 }}>{item.label}</div>
                                    <div style={{ fontSize: 10, color: '#9B9A97', marginBottom: 8 }}>{item.desc}</div>
                                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: '#F7F6F3', borderRadius: 4, color: '#6B6A67' }}>{item.format}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
