'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ═══════ SEED DATA ═══════ */
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
    { id: 'P001', homeowner: 'Sarah Tan', designer: 'Multiply Carpentry', property: '4-Room BTO', location: 'Tampines N9', stage: 'IN_PROGRESS', quote: 45000, current: 43200, photos: 24, milestones: '4/7', alerts: 0 },
    { id: 'P002', homeowner: 'Ahmad Rahman', designer: 'Cubic Deco', property: '5-Room HDB', location: 'Woodlands', stage: 'QUOTING', quote: 55000, current: null, photos: 0, milestones: '0/8', alerts: 0 },
    { id: 'P003', homeowner: 'Lim Wei Ming', designer: 'Cubic Deco', property: 'Condo 3-Bed', location: 'Punggol', stage: 'MILESTONE_CHECK', quote: 80000, current: 78500, photos: 38, milestones: '5/9', alerts: 1 },
    { id: 'P004', homeowner: 'Nurul Aisyah', designer: 'Bjorn JB Studio', property: 'Landed Terrace', location: 'Iskandar Puteri', stage: 'CONTRACTED', quote: 120000, current: null, photos: 0, milestones: '0/12', alerts: 0 },
    { id: 'P005', homeowner: 'David Loh', designer: 'Multiply Carpentry', property: 'HDB EM', location: 'Bishan', stage: 'HANDOVER', quote: 62000, current: 64800, photos: 51, milestones: '7/7', alerts: 0 },
    { id: 'P006', homeowner: 'Rachel Goh', designer: 'Multiply Carpentry', property: 'Condo Studio', location: 'Toa Payoh', stage: 'SURVEY_30D', quote: 28000, current: 27500, photos: 18, milestones: '5/5', alerts: 0 },
    { id: 'P007', homeowner: 'Tan Bee Hoon', designer: 'Glass Vision', property: 'Condo 2-Bed', location: 'Clementi', stage: 'SURVEY_6M', quote: 48000, current: 52300, photos: 33, milestones: '6/6', alerts: 2 },
    { id: 'P008', homeowner: 'Kumar Rajan', designer: 'Cubic Deco', property: 'HDB 4-Room', location: 'Jurong West', stage: 'MATCHED', quote: null, current: null, photos: 0, milestones: '0/0', alerts: 0 },
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
        case 'one_star': return { emoji: '⭐', label: '1 Star', color: '#D97706' };
        case 'two_star': return { emoji: '⭐⭐', label: '2 Stars', color: '#D97706' };
        case 'three_star': return { emoji: '⭐⭐⭐', label: '3 Stars', color: '#DC2626' };
        default: return { emoji: '○', label: 'Unrated', color: 'rgba(0,0,0,0.25)' };
    }
}

export default function RatingsAdmin() {
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', monospace";
    const [view, setView] = useState<'pipeline' | 'scorecards' | 'surveys' | 'alerts'>('pipeline');

    const views = [
        { key: 'pipeline', label: 'Pipeline', count: PROJECTS.length },
        { key: 'scorecards', label: 'Scorecards', count: DESIGNER_SCORES.length },
        { key: 'surveys', label: 'Surveys', count: PENDING_SURVEYS.length },
        { key: 'alerts', label: 'Alerts', count: ALERTS.length },
    ];

    const navLinks = [
        { label: 'Dashboard', href: '/admin', active: false },
        { label: 'Match Briefs', href: '/admin/matches', active: false },
        { label: 'Ratings', href: '/admin/ratings', active: true },
    ];

    return (
        <div style={{ fontFamily: f, background: '#fafafa', color: '#111', minHeight: '100vh' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                .stage-col:hover { background: rgba(0,0,0,0.015) !important; }
                .proj-card { transition: all 0.2s ease; }
                .proj-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
                .score-card { transition: all 0.2s ease; }
                .score-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
                .tab-btn:hover { color: #111 !important; }
            `}</style>

            {/* ═══ NAV ═══ */}
            <nav style={{ padding: '0 48px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link href="/landing" style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, textDecoration: 'none' }}>ROOF</Link>
                    <span style={{ color: 'rgba(0,0,0,0.12)' }}>/</span>
                    <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>RATINGS</span>
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(217,119,6,0.08)', color: '#D97706', fontSize: 9, fontWeight: 600, letterSpacing: '0.06em' }}>PHASE 1</span>
                </div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    {navLinks.map(link => (
                        <Link key={link.label} href={link.href} style={{
                            fontSize: 11, fontWeight: link.active ? 600 : 400,
                            color: link.active ? '#111' : 'rgba(0,0,0,0.35)',
                            textDecoration: 'none', borderBottom: link.active ? '2px solid #111' : '2px solid transparent', paddingBottom: 2,
                        }}>{link.label}</Link>
                    ))}
                </div>
            </nav>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 48px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 4px', color: '#111' }}>
                            Quality <span style={{ color: 'rgba(0,0,0,0.2)', fontStyle: 'italic' }}>Engine</span>
                        </h1>
                        <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', margin: 0, fontFamily: mono, letterSpacing: '0.03em' }}>
                            {PROJECTS.length} projects · {DESIGNER_SCORES.length} firms tracked · {ALERTS.length} active alerts
                        </p>
                    </div>
                    {/* Quick Stats */}
                    <div style={{ display: 'flex', gap: 20 }}>
                        {[
                            { label: 'Avg Rating', value: '4.4', sub: '/5.0', color: '#059669' },
                            { label: 'Budget Acc.', value: '95.8', sub: '%', color: '#2563EB' },
                            { label: 'On-Time', value: '91.2', sub: '%', color: '#D97706' },
                        ].map(s => (
                            <div key={s.label} style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: mono, fontSize: 9, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{s.label}</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: mono, lineHeight: 1.1 }}>
                                    {s.value}<span style={{ fontSize: 11, color: 'rgba(0,0,0,0.2)' }}>{s.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* View Tabs */}
                <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    {views.map(v => (
                        <button key={v.key} className="tab-btn" onClick={() => setView(v.key as typeof view)} style={{
                            padding: '10px 16px', fontSize: 11, fontWeight: 500, border: 'none', cursor: 'pointer',
                            background: 'transparent', fontFamily: mono,
                            color: view === v.key ? '#111' : 'rgba(0,0,0,0.3)',
                            borderBottom: view === v.key ? '2px solid #111' : '2px solid transparent',
                            transition: 'all 0.15s', display: 'flex', gap: 6, alignItems: 'center',
                        }}>
                            {v.label}
                            <span style={{
                                fontSize: 9, padding: '1px 6px', borderRadius: 8, fontFamily: mono,
                                background: view === v.key ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.03)',
                                color: view === v.key ? '#111' : 'rgba(0,0,0,0.25)',
                            }}>{v.count}</span>
                        </button>
                    ))}
                </div>

                {/* ═══ PIPELINE — Kanban ═══ */}
                {view === 'pipeline' && (
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`, gap: 8 }}>
                        {STAGES.map(stage => {
                            const stageProjects = PROJECTS.filter(p => p.stage === stage.key);
                            return (
                                <div key={stage.key} className="stage-col" style={{
                                    background: 'white', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)',
                                    minHeight: 320, transition: 'background 0.2s',
                                }}>
                                    <div style={{
                                        padding: '12px 14px', borderBottom: '1px solid rgba(0,0,0,0.04)',
                                        display: 'flex', alignItems: 'center', gap: 8,
                                    }}>
                                        <span style={{ fontSize: 13 }}>{stage.icon}</span>
                                        <span style={{
                                            fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                                            color: stage.color, fontFamily: mono,
                                        }}>{stage.label}</span>
                                        <span style={{
                                            fontSize: 9, marginLeft: 'auto', padding: '2px 7px', borderRadius: 8,
                                            background: `${stage.color}10`, color: stage.color, fontWeight: 700, fontFamily: mono,
                                        }}>{stageProjects.length}</span>
                                    </div>
                                    <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {stageProjects.map(p => (
                                            <div key={p.id} className="proj-card" style={{
                                                background: '#fafafa', borderRadius: 10, padding: 12,
                                                border: p.alerts > 0 ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(0,0,0,0.04)',
                                                cursor: 'default',
                                            }}>
                                                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2, color: '#111' }}>{p.homeowner}</div>
                                                <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.4)', marginBottom: 4 }}>{p.designer}</div>
                                                <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.3)' }}>{p.property} · {p.location}</div>
                                                {p.quote && (
                                                    <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.3)', marginTop: 6, fontFamily: mono }}>
                                                        ${(p.quote / 1000).toFixed(0)}k
                                                        {p.current && (
                                                            <span style={{
                                                                marginLeft: 4, fontWeight: 600,
                                                                color: p.current > p.quote ? '#DC2626' : '#059669',
                                                            }}>→ ${(p.current / 1000).toFixed(1)}k</span>
                                                        )}
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 9, color: 'rgba(0,0,0,0.25)' }}>
                                                    <span>📸 {p.photos}</span>
                                                    <span>📋 {p.milestones}</span>
                                                    {p.alerts > 0 && <span style={{ color: '#DC2626', fontWeight: 600 }}>⚠ {p.alerts}</span>}
                                                </div>
                                            </div>
                                        ))}
                                        {stageProjects.length === 0 && (
                                            <div style={{ padding: '24px 10px', textAlign: 'center', fontSize: 10, color: 'rgba(0,0,0,0.12)' }}>—</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ═══ SCORECARDS ═══ */}
                {view === 'scorecards' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {DESIGNER_SCORES.map(d => {
                            const tier = shadowLabel(d.shadow);
                            const budgetColor = d.budgetAcc === null ? 'rgba(0,0,0,0.15)' : d.budgetAcc >= 95 ? '#059669' : d.budgetAcc >= 90 ? '#D97706' : '#DC2626';
                            const timeColor = d.timelineAcc === null ? 'rgba(0,0,0,0.15)' : d.timelineAcc >= 95 ? '#059669' : d.timelineAcc >= 85 ? '#D97706' : '#DC2626';
                            return (
                                <div key={d.firm} className="score-card" style={{
                                    background: 'white', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)',
                                    padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                                        <div>
                                            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3, color: '#111' }}>{d.firm}</div>
                                            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)' }}>
                                                {d.completed}/{d.projects} completed · {d.photos} photos
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 22 }}>{tier.emoji}</div>
                                            <div style={{ fontSize: 9, fontWeight: 700, color: tier.color, fontFamily: mono }}>{tier.label}</div>
                                        </div>
                                    </div>

                                    {/* Metrics */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                                        {[
                                            { label: 'Budget', value: d.budgetAcc ? `${d.budgetAcc}%` : '—', color: budgetColor },
                                            { label: 'Timeline', value: d.timelineAcc ? `${d.timelineAcc}%` : '—', color: timeColor },
                                            { label: 'Response', value: d.responseHrs ? `${d.responseHrs}h` : '—', color: d.responseHrs && d.responseHrs <= 4 ? '#059669' : d.responseHrs ? '#DC2626' : 'rgba(0,0,0,0.15)' },
                                            { label: 'Recommend', value: d.recommendRate !== null ? `${d.recommendRate}%` : '—', color: d.recommendRate !== null && d.recommendRate >= 80 ? '#059669' : 'rgba(0,0,0,0.15)' },
                                        ].map(m => (
                                            <div key={m.label} style={{
                                                background: '#fafafa', borderRadius: 10, padding: '10px 12px', textAlign: 'center',
                                            }}>
                                                <div style={{ fontSize: 8, color: 'rgba(0,0,0,0.35)', marginBottom: 3, fontFamily: mono, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{m.label}</div>
                                                <div style={{ fontSize: 18, fontWeight: 800, color: m.color, fontFamily: mono }}>{m.value}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Survey Scores */}
                                    {d.avgOverall !== null ? (
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {[
                                                { label: 'Design', score: d.avgDesign },
                                                { label: 'Work', score: d.avgWorkmanship },
                                                { label: 'Comms', score: d.avgComms },
                                                { label: 'Value', score: d.avgValue },
                                                { label: 'Overall', score: d.avgOverall },
                                            ].map(s => (
                                                <div key={s.label} style={{
                                                    flex: 1, background: '#fafafa', borderRadius: 8, padding: '7px 4px', textAlign: 'center',
                                                }}>
                                                    <div style={{ fontSize: 8, color: 'rgba(0,0,0,0.3)', fontFamily: mono, letterSpacing: '0.04em' }}>{s.label}</div>
                                                    <div style={{
                                                        fontSize: 14, fontWeight: 800, fontFamily: mono,
                                                        color: s.score && s.score >= 4 ? '#059669' : s.score && s.score >= 3 ? '#D97706' : '#DC2626',
                                                    }}>{s.score?.toFixed(1)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{
                                            fontSize: 11, color: 'rgba(0,0,0,0.2)', textAlign: 'center', padding: '12px 0',
                                            background: '#fafafa', borderRadius: 8,
                                        }}>
                                            No survey data yet — awaiting project completions
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ═══ SURVEYS ═══ */}
                {view === 'surveys' && (
                    <div style={{
                        background: 'white', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)',
                        overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                                    {['Project', 'Homeowner', 'Survey Type', 'Due Date', 'Status', 'Action'].map(h => (
                                        <th key={h} style={{
                                            padding: '14px 16px', textAlign: 'left', fontSize: 9, fontWeight: 600,
                                            color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: mono,
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {PENDING_SURVEYS.map(s => (
                                    <tr key={s.project + s.type} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                                        <td style={{ padding: '12px 16px', fontFamily: mono, fontSize: 11, color: 'rgba(0,0,0,0.4)' }}>{s.project}</td>
                                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111' }}>{s.homeowner}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                                                background: s.type === '6-month' ? 'rgba(220,38,38,0.06)' : s.type === '30-day' ? 'rgba(217,119,6,0.06)' : 'rgba(5,150,105,0.06)',
                                                color: s.type === '6-month' ? '#DC2626' : s.type === '30-day' ? '#D97706' : '#059669',
                                            }}>{s.type}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: 'rgba(0,0,0,0.4)', fontFamily: mono, fontSize: 11 }}>{s.dueDate}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                                                background: s.status === 'sent' ? 'rgba(37,99,235,0.06)' : 'rgba(0,0,0,0.03)',
                                                color: s.status === 'sent' ? '#2563EB' : 'rgba(0,0,0,0.35)',
                                            }}>{s.status}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <button style={{
                                                padding: '5px 14px', fontSize: 10, fontWeight: 600, border: '1px solid rgba(0,0,0,0.08)',
                                                borderRadius: 6, background: 'white', color: 'rgba(0,0,0,0.5)', cursor: 'pointer', fontFamily: f,
                                            }}>Send Reminder</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ═══ ALERTS ═══ */}
                {view === 'alerts' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {ALERTS.map((a, i) => (
                            <div key={i} style={{
                                background: 'white', borderRadius: 12, padding: '18px 24px',
                                border: `1px solid ${a.severity === 'critical' ? 'rgba(220,38,38,0.15)' : 'rgba(217,119,6,0.1)'}`,
                                display: 'flex', alignItems: 'center', gap: 16,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: a.severity === 'critical' ? 'rgba(220,38,38,0.06)' : 'rgba(217,119,6,0.06)',
                                    fontSize: 18, flexShrink: 0,
                                }}>
                                    {a.severity === 'critical' ? '🚨' : '⚠️'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color: '#111' }}>{a.message}</div>
                                    <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.35)', fontFamily: mono }}>
                                        Project {a.project} · {a.type.replace('_', ' ')}
                                    </div>
                                </div>
                                <span style={{
                                    padding: '4px 12px', borderRadius: 20, fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                                    letterSpacing: '0.05em', fontFamily: mono,
                                    background: a.severity === 'critical' ? 'rgba(220,38,38,0.06)' : 'rgba(217,119,6,0.06)',
                                    color: a.severity === 'critical' ? '#DC2626' : '#D97706',
                                }}>{a.severity}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer style={{ padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.25)', letterSpacing: '0.05em' }}>© 2026 ROOF · QUALITY ENGINE</span>
                <Link href="/landing" style={{ fontSize: 11, color: 'rgba(0,0,0,0.25)', textDecoration: 'none' }}>Landing</Link>
            </footer>
        </div>
    );
}
