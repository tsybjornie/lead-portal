'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { ScheduleTask } from '@/types/project-schedule';
import { HDB_MILESTONE_TEMPLATE, generatePaymentSchedule, getPaymentSummary } from '@/types/payment-milestones';

// ============================================================
// DATA
// ============================================================

const TASKS: ScheduleTask[] = [
    { id: 't1', projectId: 'p1', trade: 'preliminaries', title: 'Site Protection', scheduledStart: '2026-03-10', scheduledEnd: '2026-03-11', status: 'completed', dependsOn: [], blocks: [], notificationsSent: [] },
    { id: 't2', projectId: 'p1', trade: 'demolition', title: 'Demolition', scheduledStart: '2026-03-12', scheduledEnd: '2026-03-15', status: 'completed', dependsOn: [], blocks: [], notificationsSent: [] },
    { id: 't3', projectId: 'p1', trade: 'masonry', title: 'Brickwork', scheduledStart: '2026-03-16', scheduledEnd: '2026-03-22', status: 'in_progress', dependsOn: [], blocks: [], curingUntil: '2026-03-25T08:00:00Z', curingDescription: 'Plaster curing  3 days to set before next stage.', notificationsSent: [] },
    { id: 't4', projectId: 'p1', trade: 'plumbing', title: 'Plumbing', scheduledStart: '2026-03-16', scheduledEnd: '2026-03-19', status: 'in_progress', dependsOn: [], blocks: [], notificationsSent: [] },
    { id: 't5', projectId: 'p1', trade: 'electrical', title: 'Electrical', scheduledStart: '2026-03-16', scheduledEnd: '2026-03-20', status: 'scheduled', dependsOn: [], blocks: [], notificationsSent: [] },
    { id: 't6', projectId: 'p1', trade: 'waterproofing', title: 'Waterproofing', scheduledStart: '2026-03-23', scheduledEnd: '2026-03-25', status: 'scheduled', dependsOn: [], blocks: [], notificationsSent: [] },
    { id: 't7', projectId: 'p1', trade: 'ceiling', title: 'Ceiling', scheduledStart: '2026-03-21', scheduledEnd: '2026-03-24', status: 'scheduled', dependsOn: [], blocks: [], notificationsSent: [] },
    { id: 't8', projectId: 'p1', trade: 'flooring', title: 'Flooring', scheduledStart: '2026-03-27', scheduledEnd: '2026-04-01', status: 'scheduled', dependsOn: [], blocks: [], notificationsSent: [] },
    { id: 't9', projectId: 'p1', trade: 'carpentry', title: 'Carpentry', scheduledStart: '2026-04-02', scheduledEnd: '2026-04-12', status: 'scheduled', dependsOn: [], blocks: [], notificationsSent: [] },
    { id: 't10', projectId: 'p1', trade: 'painting', title: 'Painting', scheduledStart: '2026-04-13', scheduledEnd: '2026-04-17', status: 'scheduled', dependsOn: [], blocks: [], notificationsSent: [] },
    { id: 't11', projectId: 'p1', trade: 'cleaning', title: 'Handover', scheduledStart: '2026-04-18', scheduledEnd: '2026-04-19', status: 'scheduled', dependsOn: [], blocks: [], notificationsSent: [] },
];

const SITE_PHOTOS = [
    { id: 'p1', trade: 'Site Protection', date: '10 Mar', caption: 'Floor & door protection installed', color: '#E8D5B7' },
    { id: 'p2', trade: 'Demolition', date: '12 Mar', caption: 'Kitchen wall hacking in progress', color: '#C4B5A0' },
    { id: 'p3', trade: 'Demolition', date: '14 Mar', caption: 'All hacking completed, debris cleared', color: '#B8A99A' },
    { id: 'p4', trade: 'Brickwork', date: '16 Mar', caption: 'New partition wall  living room', color: '#D4C5B0' },
    { id: 'p5', trade: 'Brickwork', date: '18 Mar', caption: 'Plastering in progress  bedroom 2', color: '#C9BAA5' },
    { id: 'p6', trade: 'Plumbing', date: '17 Mar', caption: 'Pipe rough-in  master bathroom', color: '#A8C4D4' },
];

const CHAT_MESSAGES_INIT = [
    { sender: 'Bjorn Teo', role: 'Designer', text: 'Demolition complete. Masonry starts Monday.', time: '15 Mar, 5:10pm' },
    { sender: 'You', role: 'Client', text: 'Can I visit the site this week?', time: '18 Mar, 2:30pm' },
    { sender: 'Bjorn Teo', role: 'Designer', text: 'Yes, come anytime between 10am-4pm. Let me know what day.', time: '18 Mar, 2:45pm' },
];

const DOCUMENTS = [
    { name: 'Quotation  Final', type: 'PDF', date: '8 Mar', size: '2.4 MB' },
    { name: 'Elevation Pack  Kitchen', type: 'PDF', date: '12 Mar', size: '5.1 MB' },
    { name: 'Floor Plan  Proposed', type: 'PDF', date: '6 Mar', size: '1.8 MB' },
    { name: 'Contract Agreement', type: 'PDF', date: '9 Mar', size: '890 KB' },
];

const DEFECTS = [
    { id: 'd1', location: 'Bedroom 2  wall near window', description: 'Hairline crack appeared after plastering', severity: 'minor' as const, status: 'resolved' as const, reportedDate: '17 Mar', resolvedDate: '18 Mar', assignedTo: 'Lim Builders' },
    { id: 'd2', location: 'Kitchen  backsplash area', description: 'Tile alignment slightly off on row 3', severity: 'minor' as const, status: 'in_progress' as const, reportedDate: '18 Mar', resolvedDate: null, assignedTo: 'Ah Huat Carpentry' },
    { id: 'd3', location: 'Master bathroom  shower area', description: 'Grout missing between floor tiles', severity: 'major' as const, status: 'open' as const, reportedDate: '18 Mar', resolvedDate: null, assignedTo: null },
];

// ============================================================
// SUB-COMPONENTS
// ============================================================

function SectionHeader({ title, count, onClose }: { title: string; count?: number; onClose?: () => void }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
                {count !== undefined && <span style={{ fontSize: 11, color: '#9B9A97' }}>{count}</span>}
            </div>
            {onClose && (
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#9B9A97', padding: 0, lineHeight: 1 }}>
                    &times;
                </button>
            )}
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ClientProgressTracker() {
    const [chatDraft, setChatDraft] = useState('');
    const [chatMsgs, setChatMsgs] = useState(CHAT_MESSAGES_INIT);
    const [activePanel, setActivePanel] = useState<'photos' | 'documents' | 'defect' | 'rate' | null>(null);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [defectText, setDefectText] = useState('');
    const [defectSubmitted, setDefectSubmitted] = useState(false);
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const chatEndRef = useRef<HTMLDivElement>(null);

    const schedule = useMemo(() => {
        const s = generatePaymentSchedule('p1', 'David Lim', 75000, 'SGD', HDB_MILESTONE_TEMPLATE);
        // Deposit already paid via escrow during signing
        s.milestones[0].status = 'paid';
        s.milestones[0].paidAt = '2026-03-09T14:30:00Z';
        s.milestones[0].paidAmount = s.milestones[0].amount;
        s.milestones[0].qualityGatePassed = true;
        if (s.milestones[1]) s.milestones[1].status = 'due';
        s.totalPaid = s.milestones[0].amount;
        s.totalRemaining = s.contractValue - s.totalPaid;
        s.paidPercentage = s.milestones[0].percentage;
        return s;
    }, []);
    const payment = getPaymentSummary(schedule);

    const done = TASKS.filter(t => t.status === 'completed').length;
    const active = TASKS.filter(t => t.status === 'in_progress').length;
    const total = TASKS.length;
    const pct = Math.round((done / total) * 100);
    const curing = TASKS.filter(t => t.curingUntil);
    const completedTrades = TASKS.filter(t => t.status === 'completed');

    const today = new Date('2026-03-18');
    const endDate = new Date(TASKS[TASKS.length - 1].scheduledEnd);
    const startDate = new Date(TASKS[0].scheduledStart);
    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / 86400000);
    const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / 86400000);
    const totalProjectDays = Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000);
    const timePct = Math.round((daysPassed / totalProjectDays) * 100);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMsgs.length]);

    const handleSend = () => {
        if (!chatDraft.trim()) return;
        setChatMsgs(prev => [...prev, { sender: 'You', role: 'Client', text: chatDraft.trim(), time: 'Just now' }]);
        setChatDraft('');
    };

    const ringArc = (pct: number, r: number) => {
        const c = 2 * Math.PI * r;
        return { strokeDasharray: `${c}`, strokeDashoffset: `${c * (1 - pct / 100)}` };
    };

    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const card = { background: '#FBFBFA', borderRadius: 8, border: '1px solid #E9E9E7' };

    return (
        <div style={{ fontFamily: f, background: '#FFFFFF', minHeight: '100vh', color: '#37352F' }}>

            {/* Top bar */}
            <div style={{
                borderBottom: '1px solid #E9E9E7', padding: '10px 32px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'sticky', top: 0, background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(8px)', zIndex: 10,
            }}>
                <div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>456 Tampines St 42</span>
                    <span style={{ fontSize: 12, color: '#9B9A97', marginLeft: 8 }}>David Lim</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => setActivePanel(activePanel === 'photos' ? null : 'photos')} style={{
                        background: activePanel === 'photos' ? '#37352F' : 'transparent', color: activePanel === 'photos' ? 'white' : '#37352F',
                        border: '1px solid #E9E9E7', borderRadius: 4, padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    }}>Site Photos</button>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#37352F', color: 'white', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>DL</div>
                </div>
            </div>

            {/* Dashboard */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 32px 60px' }}>

                {/* Row 1: Ring + Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, marginBottom: 24 }}>
                    {/* Progress ring */}
                    <div style={{ ...card, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: 160, height: 160 }}>
                            <svg width="160" height="160" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="66" fill="none" stroke="#F1F1EF" strokeWidth="8" />
                                <circle cx="80" cy="80" r="66" fill="none" stroke="#37352F" strokeWidth="8" strokeLinecap="round" {...ringArc(pct, 66)} transform="rotate(-90 80 80)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>{pct}</div>
                                <div style={{ fontSize: 12, color: '#9B9A97', marginTop: 2 }}>percent</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, width: '100%', marginTop: 20, textAlign: 'center' }}>
                            {[{ v: done, l: 'done' }, { v: active, l: 'active' }, { v: total - done - active, l: 'upcoming' }].map(s => (
                                <div key={s.l}><div style={{ fontSize: 20, fontWeight: 700 }}>{s.v}</div><div style={{ fontSize: 11, color: '#9B9A97' }}>{s.l}</div></div>
                            ))}
                        </div>
                    </div>

                    {/* Stats + progress */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1, background: '#E9E9E7', borderRadius: 8, overflow: 'hidden' }}>
                            {[{ l: 'Days Left', v: `${daysLeft}` }, { l: 'Target', v: '19 Apr' }, { l: 'Paid', v: `$${payment.paid.toLocaleString()}` }, { l: 'Contract', v: `$${schedule.contractValue.toLocaleString()}` }].map(s => (
                                <div key={s.l} style={{ background: '#FFFFFF', padding: '14px 18px' }}>
                                    <div style={{ fontSize: 10, color: '#9B9A97', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</div>
                                    <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, letterSpacing: '-0.02em' }}>{s.v}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ ...card, padding: '16px 20px' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Time vs Progress</div>
                            <div style={{ display: 'flex', gap: 16 }}>
                                {[{ l: 'Time elapsed', p: timePct, c: '#9B9A97' }, { l: 'Work done', p: pct, c: pct >= timePct ? '#35A855' : '#EB5757' }].map(b => (
                                    <div key={b.l} style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9B9A97', marginBottom: 4 }}><span>{b.l}</span><span>{b.p}%</span></div>
                                        <div style={{ background: '#F1F1EF', height: 6, borderRadius: 3 }}><div style={{ height: '100%', borderRadius: 3, background: b.c, width: `${b.p}%`, transition: 'width 0.6s ease' }} /></div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ fontSize: 11, color: pct >= timePct ? '#35A855' : '#EB5757', marginTop: 8, fontWeight: 500 }}>
                                {pct >= timePct ? 'On track' : 'Behind schedule  work is lagging'}
                            </div>
                        </div>

                        {curing.length > 0 && (
                            <div style={{ background: '#FBF3DB', border: '1px solid #F1E5BC', borderRadius: 8, padding: '12px 16px' }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#6B5C3E' }}>Curing in progress</div>
                                <div style={{ fontSize: 12, color: '#6B5C3E', marginTop: 2, opacity: 0.8 }}>{curing[0].curingDescription}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Site Photos Panel (slide open) */}
                {activePanel === 'photos' && (
                    <div style={{ ...card, padding: '20px', marginBottom: 24 }}>
                        <SectionHeader title="Site Progress Photos" count={SITE_PHOTOS.length} onClose={() => setActivePanel(null)} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                            {SITE_PHOTOS.map(photo => (
                                <div key={photo.id} onClick={() => setSelectedPhoto(selectedPhoto === photo.id ? null : photo.id)}
                                    style={{ cursor: 'pointer', borderRadius: 6, overflow: 'hidden', border: selectedPhoto === photo.id ? '2px solid #37352F' : '2px solid transparent' }}>
                                    <div style={{ width: '100%', aspectRatio: '4/3', background: photo.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'rgba(55,53,47,0.15)' }}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" /><path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                    </div>
                                    <div style={{ padding: '6px 8px', background: '#FBFBFA' }}>
                                        <div style={{ fontSize: 11, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photo.caption}</div>
                                        <div style={{ fontSize: 10, color: '#9B9A97' }}>{photo.trade} · {photo.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedPhoto && (
                            <div style={{ marginTop: 12, padding: '12px 16px', background: '#F7F6F3', borderRadius: 6 }}>
                                <div style={{ fontSize: 13, fontWeight: 500 }}>{SITE_PHOTOS.find(p => p.id === selectedPhoto)?.caption}</div>
                                <div style={{ fontSize: 12, color: '#9B9A97', marginTop: 2 }}>
                                    {SITE_PHOTOS.find(p => p.id === selectedPhoto)?.trade} · {SITE_PHOTOS.find(p => p.id === selectedPhoto)?.date} · Uploaded by Bjorn Teo
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Documents Panel */}
                {activePanel === 'documents' && (
                    <div style={{ ...card, padding: '20px', marginBottom: 24 }}>
                        <SectionHeader title="Documents" count={DOCUMENTS.length} onClose={() => setActivePanel(null)} />
                        {DOCUMENTS.map((doc, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < DOCUMENTS.length - 1 ? '1px solid #F1F1EF' : 'none', cursor: 'pointer' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#F7F6F3')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                <div style={{ width: 32, height: 32, borderRadius: 4, background: '#F1F1EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 1h5.5L13 4.5V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="#9B9A97" strokeWidth="1.2" /><path d="M9 1v4h4" stroke="#9B9A97" strokeWidth="1.2" /></svg>
                                </div>
                                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{doc.name}</div><div style={{ fontSize: 11, color: '#9B9A97' }}>{doc.type} · {doc.size}</div></div>
                                <span style={{ fontSize: 11, color: '#9B9A97' }}>{doc.date}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Defect Report Panel */}
                {activePanel === 'defect' && (
                    <div style={{ ...card, padding: '20px', marginBottom: 24 }}>
                        <SectionHeader title="Report a Defect" onClose={() => { setActivePanel(null); setDefectSubmitted(false); setDefectText(''); }} />
                        {defectSubmitted ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#35A855' }}>Defect reported successfully</div>
                                <div style={{ fontSize: 12, color: '#9B9A97', marginTop: 4 }}>Bjorn Teo has been notified and will respond shortly.</div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ fontSize: 12, color: '#9B9A97', marginBottom: 8 }}>Describe the issue and its location. Your designer will be notified immediately.</div>
                                <textarea value={defectText} onChange={e => setDefectText(e.target.value)} placeholder="e.g. Crack in bedroom 2 wall near window..." rows={3}
                                    style={{ width: '100%', border: '1px solid #E9E9E7', borderRadius: 4, padding: '10px 12px', fontSize: 13, fontFamily: f, outline: 'none', resize: 'vertical', background: '#FFFFFF' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                    <button style={{ background: '#F7F6F3', border: '1px solid #E9E9E7', borderRadius: 4, padding: '6px 14px', fontSize: 12, cursor: 'pointer', color: '#37352F' }}>
                                        Attach photo
                                    </button>
                                    <button onClick={() => { if (defectText.trim()) setDefectSubmitted(true); }} disabled={!defectText.trim()}
                                        style={{ background: defectText.trim() ? '#37352F' : '#D3D1CB', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px', fontSize: 12, fontWeight: 500, cursor: defectText.trim() ? 'pointer' : 'default' }}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Rating Panel */}
                {activePanel === 'rate' && (
                    <div style={{ ...card, padding: '20px', marginBottom: 24 }}>
                        <SectionHeader title="Rate Completed Trades" onClose={() => setActivePanel(null)} />
                        {completedTrades.length === 0 ? (
                            <div style={{ fontSize: 13, color: '#9B9A97', textAlign: 'center', padding: 20 }}>No trades completed yet to rate.</div>
                        ) : (
                            completedTrades.map(trade => (
                                <div key={trade.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F1F1EF' }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500 }}>{trade.title}</div>
                                        <div style={{ fontSize: 11, color: '#9B9A97' }}>Completed {new Date(trade.scheduledEnd).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button key={star} onClick={() => setRatings(prev => ({ ...prev, [trade.id]: star }))}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 0, color: (ratings[trade.id] || 0) >= star ? '#37352F' : '#D3D1CB', transition: 'color 0.1s' }}>
                                                &#9733;
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Row 2: Schedule + Payments */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    {/* Schedule */}
                    <div style={{ ...card, padding: '20px', maxHeight: 400, overflowY: 'auto' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Schedule</div>
                        {TASKS.map(task => {
                            const isDone = task.status === 'completed';
                            const isActive = task.status === 'in_progress';
                            return (
                                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F1F1EF' }}>
                                    <div style={{
                                        width: 18, height: 18, borderRadius: 3, flexShrink: 0,
                                        border: isDone ? 'none' : isActive ? '2px solid #37352F' : '2px solid #D3D1CB',
                                        background: isDone ? '#37352F' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {isDone && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                        {isActive && <div style={{ width: 6, height: 6, borderRadius: 1, background: '#37352F' }} />}
                                    </div>
                                    <span style={{ fontSize: 13, flex: 1, fontWeight: isActive ? 600 : 400, color: isDone ? '#9B9A97' : '#37352F', textDecoration: isDone ? 'line-through' : 'none' }}>{task.title}</span>
                                    <span style={{ fontSize: 11, color: '#9B9A97' }}>{new Date(task.scheduledStart).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}</span>
                                    {isActive && !!task.curingUntil && <span style={{ fontSize: 10, fontWeight: 500, padding: '1px 6px', borderRadius: 3, background: '#FBF3DB', color: '#9F6B00' }}>Curing</span>}
                                    {isActive && !task.curingUntil && <span style={{ fontSize: 10, fontWeight: 500, padding: '1px 6px', borderRadius: 3, background: '#DDEDDA', color: '#35A855' }}>Active</span>}
                                </div>
                            );
                        })}
                    </div>

                    {/* Payments */}
                    <div style={{ ...card, padding: '20px', maxHeight: 400, overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>Payments</span>
                            <span style={{ fontSize: 12, color: '#9B9A97' }}>{payment.percentage}% paid</span>
                        </div>
                        <div style={{ background: '#F1F1EF', height: 4, borderRadius: 2, marginBottom: 16 }}><div style={{ height: '100%', borderRadius: 2, background: '#37352F', width: `${payment.percentage}%` }} /></div>
                        {schedule.milestones.map(ms => (
                            <div key={ms.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F1F1EF' }}>
                                <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: ms.status === 'paid' ? 'none' : '2px solid #D3D1CB', background: ms.status === 'paid' ? '#37352F' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {ms.status === 'paid' && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                </div>
                                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{ms.name}</div><div style={{ fontSize: 11, color: '#9B9A97' }}>{ms.percentage}%</div></div>
                                <div style={{ fontSize: 14, fontWeight: 600 }}>${ms.amount.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 3: Chat + Designer + Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
                    <div style={{ ...card, display: 'flex', flexDirection: 'column', maxHeight: 360 }}>
                        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E9E9E7', fontSize: 13, fontWeight: 600 }}>Messages</div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                            {chatMsgs.map((msg, i) => (
                                <div key={i} style={{ marginBottom: 14 }}>
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                                        <span style={{ fontSize: 13, fontWeight: 600 }}>{msg.sender}</span>
                                        <span style={{ fontSize: 10, color: '#9B9A97', background: '#F1F1EF', padding: '1px 5px', borderRadius: 3 }}>{msg.role}</span>
                                        <span style={{ fontSize: 10, color: '#C8C7C3' }}>{msg.time}</span>
                                    </div>
                                    <p style={{ fontSize: 13, margin: '3px 0 0', lineHeight: 1.5 }}>{msg.text}</p>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div style={{ padding: '10px 16px', borderTop: '1px solid #E9E9E7', display: 'flex', gap: 8 }}>
                            <input value={chatDraft} onChange={e => setChatDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                                placeholder="Type a message..." style={{ flex: 1, border: '1px solid #E9E9E7', borderRadius: 4, padding: '8px 12px', fontSize: 13, fontFamily: f, outline: 'none' }} />
                            <button onClick={handleSend} disabled={!chatDraft.trim()} style={{ background: chatDraft.trim() ? '#37352F' : '#D3D1CB', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: chatDraft.trim() ? 'pointer' : 'default' }}>Send</button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Company + Designer */}
                        <div style={{ ...card, padding: '20px' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Your Team</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#37352F', color: 'white', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>BT</div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600 }}>Bjorn Teo</div>
                                    <div style={{ fontSize: 12, color: '#9B9A97' }}>Interior Designer</div>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid #F1F1EF', paddingTop: 12, fontSize: 12, color: '#6B6B65', lineHeight: 1.8 }}>
                                <div style={{ fontWeight: 600, color: '#37352F' }}>Vinterior Pte Ltd</div>
                                <div>UEN: 202XXXXXXX</div>
                                <div>Singapore</div>
                                <div style={{ marginTop: 8 }}>hello@vinterior.sg</div>
                                <div>+65 XXXX XXXX</div>
                                <div style={{ marginTop: 4 }}>
                                    <span style={{ color: '#2383E2', cursor: 'pointer' }}>www.vinterior.sg</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div style={{ ...card, padding: '20px' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Quick Actions</div>
                            {[
                                { key: 'photos' as const, label: 'Site photos', desc: 'View progress photos from site.' },
                                { key: 'documents' as const, label: 'View documents', desc: 'Quotation, drawings, contracts.' },
                                { key: 'defect' as const, label: 'Defects & Rectifications', desc: 'Track and report issues.' },
                                { key: 'rate' as const, label: 'Rate workmanship', desc: 'Grade completed trades.' },
                            ].map(action => (
                                <div key={action.key} onClick={() => setActivePanel(activePanel === action.key ? null : action.key)}
                                    style={{ padding: '10px 0', borderBottom: '1px solid #F1F1EF', cursor: 'pointer' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#F7F6F3')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                    <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {action.label}
                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="#9B9A97" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                    <div style={{ fontSize: 11, color: '#9B9A97' }}>{action.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
