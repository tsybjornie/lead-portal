'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ═══════ MOCK DATA — Designer's active projects ═══════ */
const ACTIVE_PROJECTS = [
    { id: 'P001', client: 'Sarah Tan', property: '4-Room BTO · Tampines N9', stage: 'In Progress', progress: 57, quote: 45000, remaining: 19350, milestones: '4/7', nextMilestone: 'Carpentry installation', dueDate: '2026-03-15' },
    { id: 'P003', client: 'Lim Wei Ming', property: 'Condo 3-Bed · Punggol', stage: 'Milestone Check', progress: 72, quote: 80000, remaining: 22400, milestones: '5/9', nextMilestone: 'Tiling completion photos', dueDate: '2026-03-10' },
    { id: 'P004', client: 'Nurul Aisyah', property: 'Landed Terrace · Iskandar Puteri', stage: 'Contracted', progress: 5, quote: 120000, remaining: 114000, milestones: '0/12', nextMilestone: 'Design finalization', dueDate: '2026-04-01' },
];

const DURATION_OPTIONS = [
    { weeks: 1, label: '1 week' },
    { weeks: 2, label: '2 weeks' },
    { weeks: 4, label: '1 month' },
    { weeks: 6, label: '6 weeks' },
    { weeks: 8, label: '2 months (max)' },
];

/* Scheduled meetings / site visits */
const SCHEDULED_MEETINGS = [
    { id: 'M1', projectId: 'P001', client: 'Sarah Tan', type: 'Site Visit', date: '2026-03-10', time: '10:00 AM', location: 'Tampines N9 BTO' },
    { id: 'M2', projectId: 'P001', client: 'Sarah Tan', type: 'Material Selection', date: '2026-03-14', time: '2:00 PM', location: 'Hoe Kee Showroom' },
    { id: 'M3', projectId: 'P003', client: 'Lim Wei Ming', type: 'Progress Review', date: '2026-03-12', time: '11:00 AM', location: 'Punggol Condo' },
    { id: 'M4', projectId: 'P004', client: 'Nurul Aisyah', type: 'Design Presentation', date: '2026-03-18', time: '3:00 PM', location: 'Zoom Call' },
    { id: 'M5', projectId: 'P003', client: 'Lim Wei Ming', type: 'Tiling Inspection', date: '2026-03-20', time: '9:00 AM', location: 'Punggol Condo' },
];

export default function AutopilotPage() {
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', monospace";

    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [duration, setDuration] = useState(2);
    const [reason, setReason] = useState('');
    const [step, setStep] = useState<'select' | 'confirm' | 'active'>('select');
    const [emergencyContact, setEmergencyContact] = useState('');

    const toggleProject = (id: string) => {
        setSelectedProjects(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const selectedProjectData = ACTIVE_PROJECTS.filter(p => selectedProjects.includes(p.id));
    const totalRemaining = selectedProjectData.reduce((sum, p) => sum + p.remaining, 0);
    const weeklyFee = Math.min(500 * selectedProjectData.length, totalRemaining * 0.05);
    const totalFee = weeklyFee * duration;

    // Meetings affected by selected projects
    const affectedMeetings = SCHEDULED_MEETINGS.filter(m => selectedProjects.includes(m.projectId));
    const resumeDate = new Date(Date.now() + duration * 7 * 24 * 60 * 60 * 1000);
    const getRescheduledDate = (originalDate: string, idx: number) => {
        const newDate = new Date(resumeDate.getTime() + (idx + 1) * 2 * 24 * 60 * 60 * 1000); // stagger 2 days apart after resume
        return newDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    const navLinks = [
        { label: 'Dashboard', href: '/admin', active: false },
        { label: 'Match Briefs', href: '/admin/matches', active: false },
        { label: 'Ratings', href: '/admin/ratings', active: false },
        { label: 'Autopilot', href: '/autopilot', active: true },
    ];

    return (
        <div style={{ fontFamily: f, background: '#fafafa', color: '#111', minHeight: '100vh' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                .project-card { transition: all 0.2s ease; cursor: pointer; }
                .project-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-1px); }
                .project-card.selected { border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
                .activate-btn { transition: all 0.3s ease; }
                .activate-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37,99,235,0.2); }
                .duration-btn { transition: all 0.15s ease; }
                .duration-btn:hover { border-color: rgba(0,0,0,0.2) !important; }
                @keyframes pulse-soft { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
            `}</style>

            {/* Nav */}
            <nav style={{ padding: '0 48px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link href="/landing" style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, textDecoration: 'none' }}>ROOF</Link>
                    <span style={{ color: 'rgba(0,0,0,0.12)' }}>/</span>
                    <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>AUTOPILOT</span>
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

            <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 48px' }}>

                {/* ═══ STEP 1: SELECT PROJECTS ═══ */}
                {step === 'select' && (
                    <>
                        <div style={{ marginBottom: 40 }}>
                            <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 12 }}>DESIGNER SAFETY NET</div>
                            <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                                Autopilot <span style={{ color: 'rgba(0,0,0,0.2)', fontStyle: 'italic' }}>Mode</span>
                            </h1>
                            <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', margin: 0, lineHeight: 1.7 }}>
                                Life happens. When you need to step away, Roof keeps your projects moving.<br />
                                Your clients stay informed. Your reputation stays intact. You heal.
                            </p>
                        </div>

                        {/* How it works */}
                        <div style={{ background: 'white', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', padding: 24, marginBottom: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 16 }}>HOW IT WORKS</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
                                {[
                                    { step: '01', title: 'Activate', desc: 'Select projects and duration' },
                                    { step: '02', title: 'Handoff', desc: 'Roof notifies your clients' },
                                    { step: '03', title: 'Operate', desc: 'We handle comms + coordination' },
                                    { step: '04', title: 'Resume', desc: 'Weekly digest, then you\'re back' },
                                ].map(s => (
                                    <div key={s.step}>
                                        <div style={{ fontFamily: mono, fontSize: 20, fontWeight: 800, color: 'rgba(0,0,0,0.06)', marginBottom: 6 }}>{s.step}</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 2 }}>{s.title}</div>
                                        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)' }}>{s.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Select Projects */}
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 12 }}>SELECT PROJECTS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                            {ACTIVE_PROJECTS.map(p => {
                                const isSelected = selectedProjects.includes(p.id);
                                return (
                                    <div key={p.id} className={`project-card ${isSelected ? 'selected' : ''}`} onClick={() => toggleProject(p.id)} style={{
                                        background: 'white', borderRadius: 12, padding: '18px 22px',
                                        border: `1.5px solid ${isSelected ? '#2563EB' : 'rgba(0,0,0,0.06)'}`,
                                        display: 'flex', alignItems: 'center', gap: 16,
                                    }}>
                                        {/* Checkbox */}
                                        <div style={{
                                            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                            border: `2px solid ${isSelected ? '#2563EB' : 'rgba(0,0,0,0.12)'}`,
                                            background: isSelected ? '#2563EB' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s',
                                        }}>
                                            {isSelected && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
                                        </div>

                                        {/* Project Info */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 2 }}>{p.client}</div>
                                            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)' }}>{p.property}</div>
                                        </div>

                                        {/* Progress */}
                                        <div style={{ textAlign: 'center', minWidth: 60 }}>
                                            <div style={{ fontFamily: mono, fontSize: 16, fontWeight: 700, color: '#111' }}>{p.progress}%</div>
                                            <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.25)', fontFamily: mono }}>DONE</div>
                                        </div>

                                        {/* Stage Badge */}
                                        <div style={{
                                            padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                                            background: p.stage === 'In Progress' ? 'rgba(217,119,6,0.06)' : p.stage === 'Milestone Check' ? 'rgba(245,158,11,0.06)' : 'rgba(37,99,235,0.06)',
                                            color: p.stage === 'In Progress' ? '#D97706' : p.stage === 'Milestone Check' ? '#F59E0B' : '#2563EB',
                                        }}>{p.stage}</div>

                                        {/* Fee Preview */}
                                        <div style={{ textAlign: 'right', minWidth: 80 }}>
                                            <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.5)' }}>
                                                S${Math.min(500, p.remaining * 0.05).toFixed(0)}/wk
                                            </div>
                                            <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.2)', fontFamily: mono }}>AUTOPILOT FEE</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Duration */}
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 12 }}>DURATION</div>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
                            {DURATION_OPTIONS.map(d => (
                                <button key={d.weeks} className="duration-btn" onClick={() => setDuration(d.weeks)} style={{
                                    padding: '8px 16px', fontSize: 11, fontWeight: 500, borderRadius: 8,
                                    border: `1.5px solid ${duration === d.weeks ? '#111' : 'rgba(0,0,0,0.08)'}`,
                                    background: duration === d.weeks ? '#111' : 'white',
                                    color: duration === d.weeks ? 'white' : 'rgba(0,0,0,0.4)',
                                    cursor: 'pointer', fontFamily: f,
                                }}>{d.label}</button>
                            ))}
                        </div>

                        {/* Reason (optional) */}
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 8 }}>REASON <span style={{ color: 'rgba(0,0,0,0.15)' }}>OPTIONAL · PRIVATE</span></div>
                        <input
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="e.g. Family emergency, health, bereavement…"
                            style={{
                                width: '100%', padding: '12px 16px', fontSize: 13, borderRadius: 10,
                                border: '1px solid rgba(0,0,0,0.08)', background: 'white', color: '#111',
                                fontFamily: f, outline: 'none', marginBottom: 12, boxSizing: 'border-box',
                            }}
                        />
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 8, marginTop: 16 }}>EMERGENCY CONTACT</div>
                        <input
                            value={emergencyContact}
                            onChange={e => setEmergencyContact(e.target.value)}
                            placeholder="Phone or WhatsApp for urgent decisions"
                            style={{
                                width: '100%', padding: '12px 16px', fontSize: 13, borderRadius: 10,
                                border: '1px solid rgba(0,0,0,0.08)', background: 'white', color: '#111',
                                fontFamily: f, outline: 'none', marginBottom: 32, boxSizing: 'border-box',
                            }}
                        />

                        {/* Affected Meetings */}
                        {selectedProjects.length > 0 && affectedMeetings.length > 0 && (
                            <div style={{ marginBottom: 28 }}>
                                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 12 }}>MEETINGS TO RESCHEDULE ({affectedMeetings.length})</div>
                                <div style={{ background: 'white', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                                    {affectedMeetings.map((m, i) => (
                                        <div key={m.id} style={{
                                            padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14,
                                            borderBottom: i < affectedMeetings.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                                        }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>📅</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{m.type}</div>
                                                <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.35)' }}>{m.client} · {m.location}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: 10, color: 'rgba(220,38,38,0.6)', fontFamily: mono, textDecoration: 'line-through' }}>{m.date}</div>
                                                <div style={{ fontSize: 10, color: '#059669', fontFamily: mono, fontWeight: 600 }}>→ {getRescheduledDate(m.date, i)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.25)', marginTop: 8, fontFamily: mono }}>
                                    New meeting requests auto-declined during autopilot · Clients notified with reschedule dates
                                </div>
                            </div>
                        )}

                        {/* Summary + Activate */}
                        {selectedProjects.length > 0 && (
                            <div style={{
                                background: 'white', borderRadius: 14, border: '1px solid rgba(37,99,235,0.12)',
                                padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                                    <div>
                                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 6 }}>AUTOPILOT SUMMARY</div>
                                        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>
                                            {selectedProjects.length} project{selectedProjects.length > 1 ? 's' : ''} · {duration} week{duration > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 800, color: '#2563EB' }}>
                                            S${totalFee.toLocaleString()}
                                        </div>
                                        <div style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.25)' }}>
                                            S${weeklyFee.toFixed(0)}/week
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                                    {selectedProjectData.map(p => (
                                        <div key={p.id} style={{
                                            flex: 1, background: '#fafafa', borderRadius: 8, padding: '10px 12px',
                                        }}>
                                            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2 }}>{p.client}</div>
                                            <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.35)' }}>Next: {p.nextMilestone}</div>
                                            <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.25)', fontFamily: mono }}>Due {p.dueDate}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button className="activate-btn" onClick={() => setStep('confirm')} style={{
                                        flex: 1, padding: '14px 24px', fontSize: 14, fontWeight: 600,
                                        background: '#2563EB', color: 'white', border: 'none', borderRadius: 10,
                                        cursor: 'pointer', fontFamily: f,
                                    }}>
                                        Activate Autopilot →
                                    </button>
                                </div>
                                <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.25)', textAlign: 'center', marginTop: 10, fontFamily: mono }}>
                                    Billed to your Roof account · Cancel anytime
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ═══ STEP 2: CONFIRM ═══ */}
                {step === 'confirm' && (
                    <div style={{ maxWidth: 500, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40, paddingTop: 20 }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
                            <h1 style={{ fontSize: 24, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
                                Confirm <span style={{ color: 'rgba(0,0,0,0.2)', fontStyle: 'italic' }}>Autopilot</span>
                            </h1>
                            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', margin: 0 }}>
                                Roof will take care of everything. Here's what happens next:
                            </p>
                        </div>

                        <div style={{ background: 'white', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                            {[
                                { icon: '📨', title: 'Client Notification', desc: 'Each client receives a message: "Your designer has a personal matter. Roof is ensuring your project stays on track. Response time: <4 hours."' },
                                { icon: '🔧', title: 'Vendor Coordination', desc: 'All purchase orders, deliveries, and site schedules continue through Roof dispatch.' },
                                { icon: '📸', title: 'Milestone Tracking', desc: 'Photo verification and progress updates continue. Payments release on schedule.' },
                                { icon: '📋', title: 'Weekly Digest', desc: `Every Sunday you receive a one-page digest of decisions that need your input. Everything else handled.` },
                                { icon: '📅', title: 'Meeting Reschedule', desc: `${affectedMeetings.length} meeting${affectedMeetings.length !== 1 ? 's' : ''} auto-rescheduled to after your return. New requests auto-declined with your return date.` },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                                    <div style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 2 }}>{item.title}</div>
                                        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', lineHeight: 1.6 }}>{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: 'white', borderRadius: 14, border: '1px solid rgba(37,99,235,0.1)', padding: 20, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedProjects.length} project{selectedProjects.length > 1 ? 's' : ''} · {duration} weeks</div>
                                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)' }}>Billed to Roof account</div>
                            </div>
                            <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 800, color: '#2563EB' }}>S${totalFee.toLocaleString()}</div>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setStep('select')} style={{
                                padding: '14px 24px', fontSize: 13, fontWeight: 500,
                                background: 'white', color: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,0,0,0.08)',
                                borderRadius: 10, cursor: 'pointer', fontFamily: f,
                            }}>← Back</button>
                            <button className="activate-btn" onClick={() => setStep('active')} style={{
                                flex: 1, padding: '14px 24px', fontSize: 14, fontWeight: 600,
                                background: '#2563EB', color: 'white', border: 'none', borderRadius: 10,
                                cursor: 'pointer', fontFamily: f,
                            }}>
                                Confirm & Activate Autopilot 🛡️
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══ STEP 3: ACTIVE ═══ */}
                {step === 'active' && (
                    <div style={{ maxWidth: 560, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40, paddingTop: 20 }}>
                            <div style={{ fontSize: 56, marginBottom: 16, animation: 'pulse-soft 3s infinite' }}>🛡️</div>
                            <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                                Autopilot <span style={{ color: '#2563EB', fontWeight: 600 }}>Active</span>
                            </h1>
                            <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', margin: '0 0 6px' }}>
                                Take all the time you need. We've got this.
                            </p>
                            <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.25)', fontFamily: mono }}>
                                Your clients have been notified. Weekly digest every Sunday.
                            </p>
                        </div>

                        {/* Status Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                            {selectedProjectData.map(p => (
                                <div key={p.id} style={{
                                    background: 'white', borderRadius: 12, padding: '18px 22px',
                                    border: '1px solid rgba(37,99,235,0.08)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                                    display: 'flex', alignItems: 'center', gap: 16,
                                }}>
                                    <div style={{
                                        width: 10, height: 10, borderRadius: '50%', background: '#2563EB',
                                        animation: 'pulse-soft 2s infinite', flexShrink: 0,
                                    }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{p.client}</div>
                                        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)' }}>{p.property}</div>
                                    </div>
                                    <div style={{
                                        padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                                        background: 'rgba(37,99,235,0.06)', color: '#2563EB',
                                    }}>Roof Managing</div>
                                </div>
                            ))}
                        </div>

                        {/* Rescheduled Meetings */}
                        {affectedMeetings.length > 0 && (
                            <div style={{
                                background: 'white', borderRadius: 14, padding: 24,
                                border: '1px solid rgba(0,0,0,0.06)', marginBottom: 28,
                            }}>
                                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 14 }}>RESCHEDULED MEETINGS</div>
                                {affectedMeetings.map((m, i) => (
                                    <div key={m.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                                        borderBottom: i < affectedMeetings.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                                    }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600 }}>{m.type} — {m.client}</div>
                                            <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)' }}>{m.location}</div>
                                        </div>
                                        <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, color: '#059669' }}>
                                            {getRescheduledDate(m.date, i)}
                                        </div>
                                    </div>
                                ))}
                                <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(37,99,235,0.03)', borderRadius: 8, fontSize: 10, color: 'rgba(0,0,0,0.35)' }}>
                                    💡 New meeting requests are auto-declined with message: <em>&quot;Designer returning {resumeDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}. Roof is managing the project.&quot;</em>
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div style={{
                            background: 'white', borderRadius: 14, padding: 24,
                            border: '1px solid rgba(0,0,0,0.06)', marginBottom: 28,
                        }}>
                            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 14 }}>AUTOPILOT TIMELINE</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600 }}>Started</div>
                                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', fontFamily: mono }}>7 Mar 2026</div>
                                </div>
                                <div style={{ flex: 1, margin: '0 20px', height: 2, background: 'rgba(0,0,0,0.06)', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: -3, left: 0, width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />
                                    <div style={{ position: 'absolute', top: -3, right: 0, width: 8, height: 8, borderRadius: '50%', background: 'rgba(0,0,0,0.1)' }} />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 12, fontWeight: 600 }}>Auto-resume</div>
                                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', fontFamily: mono }}>
                                        {new Date(Date.now() + duration * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setStep('select')} style={{
                                flex: 1, padding: '14px 24px', fontSize: 13, fontWeight: 600,
                                background: 'white', color: '#111', border: '1px solid rgba(0,0,0,0.08)',
                                borderRadius: 10, cursor: 'pointer', fontFamily: f,
                            }}>Resume Early — I'm Back</button>
                            <Link href="/admin" style={{
                                padding: '14px 24px', fontSize: 13, fontWeight: 500,
                                background: 'transparent', color: 'rgba(0,0,0,0.35)',
                                border: '1px solid rgba(0,0,0,0.06)', borderRadius: 10,
                                textDecoration: 'none', display: 'flex', alignItems: 'center',
                            }}>Dashboard</Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer style={{ padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 60 }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.25)', letterSpacing: '0.05em' }}>© 2026 ROOF · AUTOPILOT</span>
                <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.2)' }}>Your mental health matters. Take time when you need it.</span>
            </footer>
        </div>
    );
}
