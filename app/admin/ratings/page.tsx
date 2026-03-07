'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ═══════ SEED DATA — Simulates projects flowing through the pipeline ═══════ */
const STAGES = [
    { key: 'MATCHED', label: 'Matched', icon: '🤝', color: '#8B5CF6' },
    { key: 'QUOTING', label: 'Quoting', icon: '📝', color: '#3B82F6' },
    { key: 'CONTRACTED', label: 'Contracted', icon: '✍️', color: '#2563EB' },
    { key: 'IN_PROGRESS', label: 'In Progress', icon: '🔨', color: '#D97706' },
    { key: 'MILESTONE_CHECK', label: 'Milestone', icon: '📸', color: '#F59E0B' },
    { key: 'HANDOVER', label: 'Handover', icon: '🏠', color: '#059669' },
    { key: 'SURVEY_30D', label: '30-Day', icon: '📋', color: '#10B981' },
    { key: 'SURVEY_6M', label: '6-Month', icon: '🔍', color: '#34D399' },
];

const PROJECTS = [
    { id: 'P001', homeowner: 'Sarah Tan', designer: 'Multiply Carpentry', property: '4-Room BTO', location: 'Tampines N9', stage: 'IN_PROGRESS', quote: 45000, current: 43200, planned: '2026-03-01', due: '2026-05-15', photos: 24, milestones: '4/7', alerts: 0 },
    { id: 'P002', homeowner: 'Ahmad Rahman', designer: 'Cubic Deco', property: '5-Room HDB', location: 'Woodlands', stage: 'QUOTING', quote: 55000, current: null, planned: null, due: null, photos: 0, milestones: '0/8', alerts: 0 },
    { id: 'P003', homeowner: 'Lim Wei Ming', designer: 'Cubic Deco', property: 'Condo 3-Bed', location: 'Punggol', stage: 'MILESTONE_CHECK', quote: 80000, current: 78500, planned: '2026-02-01', due: '2026-04-20', photos: 38, milestones: '5/9', alerts: 1 },
    { id: 'P004', homeowner: 'Nurul Aisyah', designer: 'Bjorn JB Studio', property: 'Landed Terrace', location: 'Iskandar Puteri', stage: 'CONTRACTED', quote: 120000, current: null, planned: '2026-04-01', due: '2026-08-30', photos: 0, milestones: '0/12', alerts: 0 },
    { id: 'P005', homeowner: 'David Loh', designer: 'Multiply Carpentry', property: 'HDB EM', location: 'Bishan', stage: 'HANDOVER', quote: 62000, current: 64800, planned: '2025-11-01', due: '2026-02-28', photos: 51, milestones: '7/7', alerts: 0 },
    { id: 'P006', homeowner: 'Rachel Goh', designer: 'Multiply Carpentry', property: 'Condo Studio', location: 'Toa Payoh', stage: 'SURVEY_30D', quote: 28000, current: 27500, planned: '2025-10-15', due: '2026-01-10', photos: 18, milestones: '5/5', alerts: 0 },
    { id: 'P007', homeowner: 'Tan Bee Hoon', designer: 'Glass Vision', property: 'Condo 2-Bed', location: 'Clementi', stage: 'SURVEY_6M', quote: 48000, current: 52300, planned: '2025-06-01', due: '2025-10-15', photos: 33, milestones: '6/6', alerts: 2 },
    { id: 'P008', homeowner: 'Kumar Rajan', designer: 'Cubic Deco', property: 'HDB 4-Room', location: 'Jurong West', stage: 'MATCHED', quote: null, current: null, planned: null, due: null, photos: 0, milestones: '0/0', alerts: 0 },
];

const DESIGNER_SCORES = [
    { firm: 'Multiply Carpentry', projects: 3, completed: 2, budgetAcc: 97.2, timelineAcc: 94.5, avgDesign: 4.3, avgWorkmanship: 4.1, avgComms: 4.7, avgValue: 4.4, avgOverall: 4.4, recommendRate: 100, photos: 93, responseHrs: 2.1, shadow: 'one_star' },
    { firm: 'Cubic Deco', projects: 3, completed: 0, budgetAcc: 98.1, timelineAcc: 91.0, avgDesign: null, avgWorkmanship: null, avgComms: null, avgValue: null, avgOverall: null, recommendRate: null, photos: 38, responseHrs: 4.3, shadow: 'unrated' },
    { firm: 'Bjorn JB Studio', projects: 1, completed: 0, budgetAcc: null, timelineAcc: null, avgDesign: null, avgWorkmanship: null, avgComms: null, avgValue: null, avgOverall: null, recommendRate: null, photos: 0, responseHrs: null, shadow: 'unrated' },
    { firm: 'Glass Vision', projects: 1, completed: 1, budgetAcc: 91.0, timelineAcc: 88.2, avgDesign: 3.8, avgWorkmanship: 3.5, avgComms: 3.2, avgValue: 3.0, avgOverall: 3.4, recommendRate: 50, photos: 33, responseHrs: 8.7, shadow: 'unrated' },
];

const PENDING_SURVEYS = [
    { project: 'P006', homeowner: 'Rachel Goh', type: '30-day', dueDate: '2026-03-10', status: 'pending' },
    { project: 'P007', homeowner: 'Tan Bee Hoon', type: '6-month', dueDate: '2026-04-15', status: 'pending' },
    { project: 'P005', homeowner: 'David Loh', type: 'handover', dueDate: '2026-03-01', status: 'sent' },
];

const ALERTS = [
    { project: 'P003', type: 'DELAYED_MILESTONE', message: 'Tiling milestone overdue by 5 days', severity: 'warning' },
    { project: 'P007', type: 'BUDGET_OVERRUN', message: 'Final invoice 9% over original quote ($52.3k vs $48k)', severity: 'critical' },
    { project: 'P007', type: 'LOW_RESPONSE', message: 'Avg response time: 8.7 hours (benchmark: <4hrs)', severity: 'warning' },
];

function shadowLabel(tier: string) {
    switch (tier) {
        case 'bib_gourmand': return { emoji: '🔵', label: 'Bib Gourmand', color: '#3B82F6' };
        case 'one_star': return { emoji: '⭐', label: '1 Star', color: '#F59E0B' };
        case 'two_star': return { emoji: '⭐⭐', label: '2 Stars', color: '#F59E0B' };
        case 'three_star': return { emoji: '⭐⭐⭐', label: '3 Stars', color: '#EF4444' };
        default: return { emoji: '○', label: 'Unrated', color: 'rgba(255,255,255,0.3)' };
    }
}

export default function RatingsAdmin() {
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', monospace";
    const [view, setView] = useState<'pipeline' | 'scorecards' | 'surveys' | 'alerts'>('pipeline');

    const views = [
        { key: 'pipeline', label: 'Project Pipeline', count: PROJECTS.length },
        { key: 'scorecards', label: 'Designer Scorecards', count: DESIGNER_SCORES.length },
        { key: 'surveys', label: 'Survey Queue', count: PENDING_SURVEYS.length },
        { key: 'alerts', label: 'Alerts', count: ALERTS.length },
    ];

    return (
        <div style={{ fontFamily: f, background: '#18171C', color: 'white', minHeight: '100vh' }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            {/* Header */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Link href="/admin" style={{ width: 28, height: 28, borderRadius: 7, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white', textDecoration: 'none' }}>R</Link>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>Roof Ratings</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(245,158,11,0.2)', color: '#FBBF24', fontWeight: 600, marginLeft: 4 }}>PHASE 1 — COLLECT</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: mono }}>Data capture only · No public ratings</span>
                    <Link href="/admin" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Admin</Link>
                </div>
            </div>

            {/* View Tabs */}
            <div style={{ padding: '0 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 4 }}>
                {views.map(v => (
                    <button key={v.key} onClick={() => setView(v.key as typeof view)} style={{
                        padding: '12px 16px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                        background: 'transparent', color: view === v.key ? 'white' : 'rgba(255,255,255,0.4)',
                        borderBottom: view === v.key ? '2px solid #F59E0B' : '2px solid transparent',
                        fontFamily: f, transition: 'all 0.15s', display: 'flex', gap: 6, alignItems: 'center',
                    }}>
                        {v.label}
                        <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: view === v.key ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)', color: view === v.key ? '#FBBF24' : 'rgba(255,255,255,0.3)' }}>{v.count}</span>
                    </button>
                ))}
            </div>

            <div style={{ padding: '28px' }}>
                {/* ═══════ PIPELINE — Kanban across 8 stages ═══════ */}
                {view === 'pipeline' && (
                    <>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 16, fontFamily: mono }}>
                            PROJECT LIFECYCLE · Every project flows left-to-right · All data auto-captured
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`, gap: 8, overflowX: 'auto' }}>
                            {STAGES.map(stage => {
                                const stageProjects = PROJECTS.filter(p => p.stage === stage.key);
                                return (
                                    <div key={stage.key} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', minHeight: 300 }}>
                                        <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: 14 }}>{stage.icon}</span>
                                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: stage.color }}>{stage.label}</span>
                                            <span style={{ fontSize: 9, marginLeft: 'auto', padding: '1px 5px', borderRadius: 6, background: `${stage.color}22`, color: stage.color }}>{stageProjects.length}</span>
                                        </div>
                                        <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            {stageProjects.map(p => (
                                                <div key={p.id} style={{
                                                    background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px',
                                                    border: p.alerts > 0 ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.06)',
                                                }}>
                                                    <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 2 }}>{p.homeowner}</div>
                                                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{p.designer}</div>
                                                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{p.property} · {p.location}</div>
                                                    {p.quote && (
                                                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                                                            💰 ${(p.quote / 1000).toFixed(0)}k
                                                            {p.current && <span style={{ color: p.current > p.quote ? '#EF4444' : '#10B981' }}> → ${(p.current / 1000).toFixed(1)}k</span>}
                                                        </div>
                                                    )}
                                                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                                        <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>📸 {p.photos}</span>
                                                        <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>📋 {p.milestones}</span>
                                                        {p.alerts > 0 && <span style={{ fontSize: 8, color: '#EF4444' }}>⚠️ {p.alerts}</span>}
                                                    </div>
                                                </div>
                                            ))}
                                            {stageProjects.length === 0 && (
                                                <div style={{ padding: '20px 10px', textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.15)' }}>
                                                    No projects
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* ═══════ SCORECARDS — Per-designer performance ═══════ */}
                {view === 'scorecards' && (
                    <>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 16, fontFamily: mono }}>
                            DESIGNER SCORECARDS · Shadow ratings (internal only) · Data drives tier, not credentials
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {DESIGNER_SCORES.map(d => {
                                const tier = shadowLabel(d.shadow);
                                const budgetColor = d.budgetAcc === null ? 'rgba(255,255,255,0.2)' : d.budgetAcc >= 95 ? '#10B981' : d.budgetAcc >= 90 ? '#F59E0B' : '#EF4444';
                                const timeColor = d.timelineAcc === null ? 'rgba(255,255,255,0.2)' : d.timelineAcc >= 95 ? '#10B981' : d.timelineAcc >= 85 ? '#F59E0B' : '#EF4444';
                                return (
                                    <div key={d.firm} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 20 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                            <div>
                                                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 2 }}>{d.firm}</div>
                                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                                                    {d.completed}/{d.projects} completed · {d.photos} photos
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: 20 }}>{tier.emoji}</div>
                                                <div style={{ fontSize: 9, fontWeight: 600, color: tier.color, fontFamily: mono }}>{tier.label}</div>
                                            </div>
                                        </div>

                                        {/* Metrics Grid */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                                            {[
                                                { label: '💰 Budget', value: d.budgetAcc ? `${d.budgetAcc}%` : '—', color: budgetColor },
                                                { label: '⏱️ Timeline', value: d.timelineAcc ? `${d.timelineAcc}%` : '—', color: timeColor },
                                                { label: '💬 Response', value: d.responseHrs ? `${d.responseHrs}h` : '—', color: d.responseHrs && d.responseHrs <= 4 ? '#10B981' : d.responseHrs ? '#EF4444' : 'rgba(255,255,255,0.2)' },
                                                { label: '👍 Recommend', value: d.recommendRate !== null ? `${d.recommendRate}%` : '—', color: d.recommendRate !== null && d.recommendRate >= 80 ? '#10B981' : 'rgba(255,255,255,0.2)' },
                                            ].map(m => (
                                                <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                                                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>{m.label}</div>
                                                    <div style={{ fontSize: 16, fontWeight: 800, color: m.color, fontFamily: mono }}>{m.value}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Survey Scores */}
                                        {d.avgOverall !== null ? (
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                {[
                                                    { label: '🎨 Design', score: d.avgDesign },
                                                    { label: '🔧 Work', score: d.avgWorkmanship },
                                                    { label: '💬 Comms', score: d.avgComms },
                                                    { label: '💰 Value', score: d.avgValue },
                                                    { label: '⭐ Overall', score: d.avgOverall },
                                                ].map(s => (
                                                    <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '6px 4px', textAlign: 'center' }}>
                                                        <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)' }}>{s.label}</div>
                                                        <div style={{ fontSize: 13, fontWeight: 700, color: s.score && s.score >= 4 ? '#10B981' : s.score && s.score >= 3 ? '#F59E0B' : '#EF4444', fontFamily: mono }}>{s.score?.toFixed(1)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '8px 0' }}>
                                                No survey data yet — awaiting project completions
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* ═══════ SURVEYS — Pending queue ═══════ */}
                {view === 'surveys' && (
                    <>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 16, fontFamily: mono }}>
                            SURVEY QUEUE · Auto-triggered at handover, 30-day, and 6-month marks
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                        {['Project', 'Homeowner', 'Survey Type', 'Due Date', 'Status', 'Action'].map(h => (
                                            <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {PENDING_SURVEYS.map(s => (
                                        <tr key={s.project + s.type} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <td style={{ padding: '10px 14px', fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{s.project}</td>
                                            <td style={{ padding: '10px 14px', fontWeight: 600 }}>{s.homeowner}</td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <span style={{
                                                    padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                                                    background: s.type === '6-month' ? 'rgba(239,68,68,0.15)' : s.type === '30-day' ? 'rgba(245,158,11,0.15)' : 'rgba(5,150,105,0.15)',
                                                    color: s.type === '6-month' ? '#F87171' : s.type === '30-day' ? '#FBBF24' : '#34D399',
                                                }}>{s.type}</span>
                                            </td>
                                            <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.5)' }}>{s.dueDate}</td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <span style={{
                                                    padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                                                    background: s.status === 'sent' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)',
                                                    color: s.status === 'sent' ? '#60A5FA' : 'rgba(255,255,255,0.4)',
                                                }}>{s.status}</span>
                                            </td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <button style={{
                                                    padding: '4px 12px', fontSize: 10, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 6, background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                                                    fontFamily: f,
                                                }}>Send Reminder</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* ═══════ ALERTS — Flagged issues ═══════ */}
                {view === 'alerts' && (
                    <>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 16, fontFamily: mono }}>
                            AUTOMATED ALERTS · AI-detected anomalies requiring human review
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {ALERTS.map((a, i) => (
                                <div key={i} style={{
                                    background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '16px 20px',
                                    border: `1px solid ${a.severity === 'critical' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.2)'}`,
                                    display: 'flex', alignItems: 'center', gap: 16,
                                }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: a.severity === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                                        fontSize: 18,
                                    }}>
                                        {a.severity === 'critical' ? '🚨' : '⚠️'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{a.message}</div>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                                            Project {a.project} · {a.type.replace('_', ' ')}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 4, fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                                        background: a.severity === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                                        color: a.severity === 'critical' ? '#F87171' : '#FBBF24',
                                    }}>{a.severity}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
