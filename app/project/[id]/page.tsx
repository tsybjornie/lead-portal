'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

/* ═══════════════════════════════════════════
   MOCK DATA — 3 demo projects
   ═══════════════════════════════════════════ */

const PROJECTS: Record<string, {
    name: string; client: string; clientPhone: string; property: string; address: string;
    budget: string; status: string; completion: number; startDate: string; targetEnd: string;
    designer: string; sqm: number;
}> = {
    'sarah-tan': {
        name: 'Tan BTO Renovation', client: 'Sarah Tan', clientPhone: '+65 9123 4567',
        property: '4-Room BTO', address: 'Tampines N9 Block 123 #08-456', budget: 'S$55,000 – S$65,000',
        status: 'active', completion: 57, startDate: '2026-01-15', targetEnd: '2026-05-30',
        designer: 'Bjorn', sqm: 93,
    },
    'lim-wei-ming': {
        name: 'Lim Condo Refresh', client: 'Lim Wei Ming', clientPhone: '+65 8234 5678',
        property: 'Condo 3-Bed', address: 'Punggol Waterway Terraces #12-08', budget: 'S$85,000 – S$110,000',
        status: 'active', completion: 72, startDate: '2025-12-01', targetEnd: '2026-04-15',
        designer: 'Bjorn', sqm: 120,
    },
    'nurul-aisyah': {
        name: 'Aisyah Landed Build', client: 'Nurul Aisyah', clientPhone: '+60 12-345 6789',
        property: 'Landed Terrace', address: 'Iskandar Puteri, Johor', budget: 'S$180,000 – S$220,000',
        status: 'signed', completion: 5, startDate: '2026-03-01', targetEnd: '2026-12-31',
        designer: 'Bjorn', sqm: 240,
    },
};

const TEAM: Record<string, { role: string; name: string; firm?: string; status: string; email: string; avatar: string }[]> = {
    'sarah-tan': [
        { role: 'Designer', name: 'Bjorn', firm: 'Multiply Carpentry', status: 'active', email: 'bjorn@multiply.sg', avatar: '🧑‍🎨' },
        { role: 'Client', name: 'Sarah Tan', status: 'active', email: 'sarah.tan@gmail.com', avatar: '👩' },
        { role: 'Drafter', name: 'Ryan Choo', status: 'active', email: 'ryan@drafts.sg', avatar: '✏️' },
        { role: 'Contractor', name: 'Ah Kow Construction', status: 'active', email: 'ahkow@build.sg', avatar: '🔨' },
        { role: 'Vendor', name: 'Hafary Tiles', status: 'pending', email: 'orders@hafary.com.sg', avatar: '🏪' },
        { role: 'Vendor', name: 'KimSeng Hardware', status: 'invited', email: 'sales@kimseng.com', avatar: '🏪' },
    ],
    'lim-wei-ming': [
        { role: 'Designer', name: 'Bjorn', firm: 'Multiply Carpentry', status: 'active', email: 'bjorn@multiply.sg', avatar: '🧑‍🎨' },
        { role: 'Client', name: 'Lim Wei Ming', status: 'active', email: 'weiming@outlook.com', avatar: '👨' },
        { role: 'Drafter', name: 'Ryan Choo', status: 'active', email: 'ryan@drafts.sg', avatar: '✏️' },
        { role: 'Contractor', name: 'Ah Kow Construction', status: 'active', email: 'ahkow@build.sg', avatar: '🔨' },
        { role: 'Consultant', name: 'Eng Liang QP', status: 'active', email: 'elqp@consult.sg', avatar: '📐' },
    ],
    'nurul-aisyah': [
        { role: 'Designer', name: 'Bjorn', firm: 'Multiply Carpentry', status: 'active', email: 'bjorn@multiply.sg', avatar: '🧑‍🎨' },
        { role: 'Client', name: 'Nurul Aisyah', status: 'active', email: 'nurul@email.com', avatar: '👩' },
    ],
};

const QUOTES_DATA: Record<string, { serial: string; version: number; total: number; status: string; date: string; sections: number }[]> = {
    'sarah-tan': [
        { serial: 'Q-2026-001', version: 3, total: 58200, status: 'approved', date: '2026-02-20', sections: 8 },
        { serial: 'Q-2026-001', version: 2, total: 62500, status: 'superseded', date: '2026-02-10', sections: 8 },
        { serial: 'Q-2026-001', version: 1, total: 71000, status: 'superseded', date: '2026-01-28', sections: 7 },
    ],
    'lim-wei-ming': [
        { serial: 'Q-2026-002', version: 2, total: 95800, status: 'approved', date: '2026-01-15', sections: 12 },
        { serial: 'Q-2026-002', version: 1, total: 108000, status: 'superseded', date: '2025-12-28', sections: 11 },
    ],
    'nurul-aisyah': [
        { serial: 'Q-2026-003', version: 1, total: 195000, status: 'pending', date: '2026-03-05', sections: 15 },
    ],
};

const FILES_DATA: Record<string, { name: string; type: string; size: string; category: string; uploadedBy: string; date: string }[]> = {
    'sarah-tan': [
        { name: 'TanBTO_V3.skp', type: 'SketchUp', size: '14.2 MB', category: '3D Model', uploadedBy: 'Ryan Choo', date: '2026-03-01' },
        { name: 'kitchen_render_final.png', type: 'Image', size: '3.8 MB', category: 'Render', uploadedBy: 'Ryan Choo', date: '2026-03-01' },
        { name: 'floor_plan_v3.pdf', type: 'PDF', size: '1.2 MB', category: 'Drawing', uploadedBy: 'Ryan Choo', date: '2026-02-28' },
        { name: 'site_photo_before_1.jpg', type: 'Image', size: '2.1 MB', category: 'Site Photo', uploadedBy: 'Ah Kow', date: '2026-02-15' },
        { name: 'electrical_plan.pdf', type: 'PDF', size: '0.8 MB', category: 'Drawing', uploadedBy: 'Bjorn', date: '2026-02-10' },
        { name: 'material_samples.pdf', type: 'PDF', size: '5.4 MB', category: 'Document', uploadedBy: 'Hafary Tiles', date: '2026-02-08' },
    ],
    'lim-wei-ming': [
        { name: 'LimCondo_V2.skp', type: 'SketchUp', size: '18.7 MB', category: '3D Model', uploadedBy: 'Ryan Choo', date: '2026-02-20' },
        { name: 'master_bedroom_render.png', type: 'Image', size: '4.2 MB', category: 'Render', uploadedBy: 'Ryan Choo', date: '2026-02-18' },
    ],
    'nurul-aisyah': [
        { name: 'site_survey.pdf', type: 'PDF', size: '2.3 MB', category: 'Document', uploadedBy: 'Bjorn', date: '2026-03-02' },
    ],
};

const MILESTONES: Record<string, { label: string; target: string; done: boolean; pct: number }[]> = {
    'sarah-tan': [
        { label: 'Design sign-off', target: '2026-02-01', done: true, pct: 100 },
        { label: 'Hacking & removal', target: '2026-02-15', done: true, pct: 100 },
        { label: 'Electrical & plumbing rough-in', target: '2026-03-01', done: true, pct: 100 },
        { label: 'Tiling & waterproofing', target: '2026-03-15', done: false, pct: 60 },
        { label: 'Carpentry install', target: '2026-04-15', done: false, pct: 0 },
        { label: 'Painting & touch-up', target: '2026-05-01', done: false, pct: 0 },
        { label: 'Final inspection & handover', target: '2026-05-30', done: false, pct: 0 },
    ],
    'lim-wei-ming': [
        { label: 'Design sign-off', target: '2026-01-01', done: true, pct: 100 },
        { label: 'Hacking & removal', target: '2026-01-15', done: true, pct: 100 },
        { label: 'Structural works', target: '2026-02-01', done: true, pct: 100 },
        { label: 'M&E rough-in', target: '2026-02-15', done: true, pct: 100 },
        { label: 'Wet works', target: '2026-03-01', done: true, pct: 100 },
        { label: 'Carpentry install', target: '2026-03-20', done: false, pct: 40 },
        { label: 'Final fit-out', target: '2026-04-15', done: false, pct: 0 },
    ],
    'nurul-aisyah': [
        { label: 'Design concept approval', target: '2026-04-01', done: false, pct: 20 },
        { label: 'Authority submission', target: '2026-05-01', done: false, pct: 0 },
        { label: 'Construction start', target: '2026-06-01', done: false, pct: 0 },
    ],
};

const ACTIVITY: Record<string, { actor: string; action: string; detail: string; time: string; icon: string }[]> = {
    'sarah-tan': [
        { actor: 'Ryan Choo', action: 'uploaded', detail: 'TanBTO_V3.skp — kitchen layout revised', time: '2h ago', icon: '📄' },
        { actor: 'Ah Kow', action: 'completed', detail: 'Electrical rough-in — all points tested', time: '1d ago', icon: '✅' },
        { actor: 'Sarah Tan', action: 'approved', detail: 'Quote V3 — S$58,200', time: '6d ago', icon: '💰' },
        { actor: 'Bjorn', action: 'shared', detail: 'Floor plan V3 with client', time: '1w ago', icon: '📤' },
        { actor: 'Hafary Tiles', action: 'confirmed', detail: 'PO #HF-2026-089 — delivery 15 Mar', time: '1w ago', icon: '🏪' },
        { actor: 'Ryan Choo', action: 'uploaded', detail: 'Kitchen render final — client review', time: '2w ago', icon: '🖼️' },
        { actor: 'Ah Kow', action: 'started', detail: 'Hacking & removal phase', time: '3w ago', icon: '🔨' },
        { actor: 'Bjorn', action: 'created', detail: 'Project created from lead', time: '7w ago', icon: '🚀' },
    ],
    'lim-wei-ming': [
        { actor: 'Ryan Choo', action: 'uploaded', detail: 'Master bedroom render', time: '1w ago', icon: '🖼️' },
        { actor: 'Eng Liang QP', action: 'approved', detail: 'Structural plan — no PE endorsement needed', time: '2w ago', icon: '📐' },
        { actor: 'Lim Wei Ming', action: 'approved', detail: 'Quote V2 — S$95,800', time: '7w ago', icon: '💰' },
        { actor: 'Bjorn', action: 'created', detail: 'Project created', time: '14w ago', icon: '🚀' },
    ],
    'nurul-aisyah': [
        { actor: 'Bjorn', action: 'uploaded', detail: 'Site survey report', time: '5d ago', icon: '📄' },
        { actor: 'Bjorn', action: 'created', detail: 'Quote V1 — S$195,000 (pending approval)', time: '3d ago', icon: '💰' },
        { actor: 'Nurul Aisyah', action: 'signed', detail: 'Design agreement', time: '1w ago', icon: '✍️' },
        { actor: 'Bjorn', action: 'created', detail: 'Project created from site visit', time: '1w ago', icon: '🚀' },
    ],
};

type Tab = 'overview' | 'team' | 'quotes' | 'files' | 'schedule' | 'activity';

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
    Designer: { bg: 'rgba(37,99,235,0.06)', text: '#2563EB' },
    Client: { bg: 'rgba(5,150,105,0.06)', text: '#059669' },
    Drafter: { bg: 'rgba(139,92,246,0.06)', text: '#8B5CF6' },
    Contractor: { bg: 'rgba(234,88,12,0.06)', text: '#EA580C' },
    Vendor: { bg: 'rgba(0,0,0,0.04)', text: 'rgba(0,0,0,0.5)' },
    Consultant: { bg: 'rgba(14,165,233,0.06)', text: '#0EA5E9' },
};

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'rgba(5,150,105,0.06)', text: '#059669', label: 'ACTIVE' },
    signed: { bg: 'rgba(37,99,235,0.06)', text: '#2563EB', label: 'SIGNED' },
    pending: { bg: 'rgba(234,88,12,0.06)', text: '#EA580C', label: 'PENDING' },
    invited: { bg: 'rgba(0,0,0,0.04)', text: 'rgba(0,0,0,0.4)', label: 'INVITED' },
};

export default function ProjectDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [tab, setTab] = useState<Tab>('overview');

    const project = PROJECTS[id];
    if (!project) {
        return (
            <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🏗️</div>
                    <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Project not found</h2>
                    <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', marginBottom: 24 }}>This project ID doesn't match any demo project.</p>
                    <Link href="/projects" style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, background: '#111', color: 'white', borderRadius: 8, textDecoration: 'none' }}>← Back to Projects</Link>
                </div>
            </div>
        );
    }

    const team = TEAM[id] || [];
    const quotes = QUOTES_DATA[id] || [];
    const files = FILES_DATA[id] || [];
    const milestones = MILESTONES[id] || [];
    const activity = ACTIVITY[id] || [];
    const statusBadge = STATUS_BADGE[project.status] || STATUS_BADGE.active;

    const tabs: { id: Tab; label: string; icon: string; count?: number }[] = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'team', label: 'Team', icon: '👥', count: team.length },
        { id: 'quotes', label: 'Quotes', icon: '💰', count: quotes.length },
        { id: 'files', label: 'Files', icon: '📁', count: files.length },
        { id: 'schedule', label: 'Schedule', icon: '📅', count: milestones.length },
        { id: 'activity', label: 'Activity', icon: '⚡', count: activity.length },
    ];

    return (
        <div style={{ fontFamily: f, background: '#fafafa', color: '#111', minHeight: '100vh' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
            <style>{`
                .collab-card { transition: all 0.2s; }
                .collab-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-1px); }
                .tab-btn { transition: all 0.15s; }
                .tab-btn:hover { color: #111 !important; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
                .animate-in { animation: fade-in 0.3s ease forwards; }
            `}</style>

            {/* Nav */}
            <nav style={{ padding: '0 48px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link href="/landing" style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em', textDecoration: 'none' }}>ROOF</Link>
                    <span style={{ color: 'rgba(0,0,0,0.12)' }}>/</span>
                    <Link href="/projects" style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', textDecoration: 'none' }}>PROJECTS</Link>
                    <span style={{ color: 'rgba(0,0,0,0.12)' }}>/</span>
                    <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em' }}>{project.client.toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                    {[
                        { label: 'Dashboard', href: '/admin', active: false },
                        { label: 'Projects', href: '/projects', active: true },
                        { label: 'Intelligence', href: '/intelligence', active: false },
                        { label: 'SketchUp', href: '/sketchup', active: false },
                    ].map(link => (
                        <Link key={link.label} href={link.href} style={{ fontSize: 12, fontWeight: link.active ? 600 : 400, color: link.active ? '#111' : 'rgba(0,0,0,0.35)', textDecoration: link.active ? 'underline' : 'none', textUnderlineOffset: '4px' }}>{link.label}</Link>
                    ))}
                </div>
            </nav>

            <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 48px' }}>
                {/* Project Header */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>PROJECT COLLABORATION HUB</div>
                            <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 6px' }}>
                                {project.client} <span style={{ color: 'rgba(0,0,0,0.25)', fontStyle: 'italic' }}>{project.property}</span>
                            </h1>
                            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', margin: 0 }}>{project.address} · {project.sqm} sqm · {project.budget}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: statusBadge.bg, color: statusBadge.text, fontFamily: mono }}>{statusBadge.label}</span>
                            <div style={{ width: 80, height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${project.completion}%`, height: '100%', background: '#059669', borderRadius: 3, transition: 'width 0.5s' }} />
                            </div>
                            <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: '#059669' }}>{project.completion}%</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 0 }}>
                    {tabs.map(t => (
                        <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)} style={{
                            padding: '10px 16px', fontSize: 12, fontWeight: tab === t.id ? 600 : 400,
                            color: tab === t.id ? '#111' : 'rgba(0,0,0,0.35)', background: 'none', border: 'none',
                            borderBottom: tab === t.id ? '2px solid #111' : '2px solid transparent',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                            marginBottom: -1,
                        }}>
                            <span style={{ fontSize: 13 }}>{t.icon}</span> {t.label}
                            {t.count !== undefined && (
                                <span style={{ fontSize: 9, fontWeight: 700, fontFamily: mono, padding: '1px 5px', borderRadius: 4, background: tab === t.id ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.04)', color: tab === t.id ? '#111' : 'rgba(0,0,0,0.3)' }}>{t.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ═══ OVERVIEW TAB ═══ */}
                {tab === 'overview' && (
                    <div className="animate-in">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                            {[
                                { label: 'COMPLETION', value: `${project.completion}%`, color: '#059669' },
                                { label: 'TEAM SIZE', value: `${team.length}`, color: '#2563EB' },
                                { label: 'QUOTE VERSIONS', value: `${quotes.length}`, color: '#EA580C' },
                                { label: 'FILES', value: `${files.length}`, color: '#8B5CF6' },
                            ].map(stat => (
                                <div key={stat.label} className="collab-card" style={{ background: 'white', borderRadius: 12, padding: '18px 16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                                    <div style={{ fontFamily: mono, fontSize: 8, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 6 }}>{stat.label}</div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Quick team strip */}
                        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 16 }}>
                            <div style={{ fontFamily: mono, fontSize: 8, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 12 }}>TEAM</div>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                {team.map((m, i) => {
                                    const rc = ROLE_COLORS[m.role] || ROLE_COLORS.Vendor;
                                    return (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, background: rc.bg }}>
                                            <span style={{ fontSize: 14 }}>{m.avatar}</span>
                                            <span style={{ fontSize: 11, fontWeight: 500, color: rc.text }}>{m.name}</span>
                                            <span style={{ fontSize: 8, fontWeight: 700, fontFamily: mono, color: rc.text, opacity: 0.6 }}>{m.role.toUpperCase()}</span>
                                        </div>
                                    );
                                })}
                                <button onClick={() => setTab('team')} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.03)', border: '1px dashed rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)' }}>+ Invite</button>
                            </div>
                        </div>

                        {/* Recent activity */}
                        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', border: '1px solid rgba(0,0,0,0.06)' }}>
                            <div style={{ fontFamily: mono, fontSize: 8, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 12 }}>RECENT ACTIVITY</div>
                            {activity.slice(0, 4).map((a, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderTop: i > 0 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{a.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 12 }}><strong>{a.actor}</strong> <span style={{ color: 'rgba(0,0,0,0.35)' }}>{a.action}</span></div>
                                        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 2 }}>{a.detail}</div>
                                    </div>
                                    <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.25)', flexShrink: 0 }}>{a.time}</span>
                                </div>
                            ))}
                            <button onClick={() => setTab('activity')} style={{ width: '100%', padding: '8px', fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>View all activity →</button>
                        </div>
                    </div>
                )}

                {/* ═══ TEAM TAB ═══ */}
                {tab === 'team' && (
                    <div className="animate-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}>{team.length} COLLABORATORS</div>
                            <button style={{ padding: '8px 16px', fontSize: 11, fontWeight: 600, background: '#111', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>+ Invite Member</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {team.map((m, i) => {
                                const rc = ROLE_COLORS[m.role] || ROLE_COLORS.Vendor;
                                const sb = STATUS_BADGE[m.status] || STATUS_BADGE.active;
                                return (
                                    <div key={i} className="collab-card" style={{ background: 'white', borderRadius: 12, padding: '16px 20px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 12, background: rc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{m.avatar}</div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</span>
                                                    <span style={{ fontSize: 8, fontWeight: 700, fontFamily: mono, padding: '2px 6px', borderRadius: 4, background: rc.bg, color: rc.text }}>{m.role.toUpperCase()}</span>
                                                    <span style={{ fontSize: 7, fontWeight: 700, fontFamily: mono, padding: '2px 5px', borderRadius: 4, background: sb.bg, color: sb.text }}>{sb.label}</span>
                                                </div>
                                                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', marginTop: 2 }}>{m.email}{m.firm ? ` · ${m.firm}` : ''}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button style={{ padding: '5px 12px', fontSize: 10, fontWeight: 600, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Message</button>
                                            {m.status !== 'active' && <button style={{ padding: '5px 12px', fontSize: 10, fontWeight: 600, background: '#111', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Resend Invite</button>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Invite section */}
                        <div style={{ marginTop: 24, padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: 12, border: '1px dashed rgba(0,0,0,0.1)' }}>
                            <div style={{ fontFamily: mono, fontSize: 8, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 12 }}>INVITE BY ROLE</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {['Drafter', 'Contractor', 'Vendor', 'Consultant'].map(role => {
                                    const rc = ROLE_COLORS[role] || ROLE_COLORS.Vendor;
                                    return (
                                        <button key={role} style={{ padding: '8px 16px', fontSize: 11, fontWeight: 600, background: rc.bg, color: rc.text, border: 'none', borderRadius: 8, cursor: 'pointer' }}>+ {role}</button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ QUOTES TAB ═══ */}
                {tab === 'quotes' && (
                    <div className="animate-in">
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 16 }}>QUOTE HISTORY</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {quotes.map((q, i) => (
                                <div key={i} className="collab-card" style={{ background: 'white', borderRadius: 12, padding: '16px 20px', border: `1px solid ${q.status === 'approved' ? 'rgba(5,150,105,0.15)' : 'rgba(0,0,0,0.06)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: q.status === 'approved' ? 'rgba(5,150,105,0.06)' : q.status === 'pending' ? 'rgba(234,88,12,0.06)' : 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 12, fontWeight: 700, color: q.status === 'approved' ? '#059669' : q.status === 'pending' ? '#EA580C' : 'rgba(0,0,0,0.2)' }}>V{q.version}</div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 13, fontWeight: 600 }}>{q.serial}</span>
                                                <span style={{ fontSize: 8, fontWeight: 700, fontFamily: mono, padding: '2px 6px', borderRadius: 4, background: q.status === 'approved' ? 'rgba(5,150,105,0.06)' : q.status === 'pending' ? 'rgba(234,88,12,0.06)' : 'rgba(0,0,0,0.04)', color: q.status === 'approved' ? '#059669' : q.status === 'pending' ? '#EA580C' : 'rgba(0,0,0,0.3)' }}>{q.status.toUpperCase()}</span>
                                            </div>
                                            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', marginTop: 2 }}>{q.sections} sections · {q.date}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontFamily: mono, fontSize: 16, fontWeight: 700, color: q.status === 'approved' ? '#059669' : '#111' }}>S${q.total.toLocaleString()}</div>
                                        {i === 0 && <button style={{ padding: '4px 10px', fontSize: 9, fontWeight: 600, background: '#111', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', marginTop: 4 }}>Share with Client</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button style={{ width: '100%', marginTop: 16, padding: '12px', fontSize: 12, fontWeight: 600, background: '#111', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>+ Create New Version</button>
                    </div>
                )}

                {/* ═══ FILES TAB ═══ */}
                {tab === 'files' && (
                    <div className="animate-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}>{files.length} FILES</div>
                            <button style={{ padding: '8px 16px', fontSize: 11, fontWeight: 600, background: '#111', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>+ Upload</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {files.map((file, i) => (
                                <div key={i} className="collab-card" style={{ background: 'white', borderRadius: 10, padding: '14px 18px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontSize: 20 }}>{file.type === 'SketchUp' ? '📐' : file.type === 'Image' ? '🖼️' : '📄'}</span>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 600 }}>{file.name}</div>
                                            <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.35)', marginTop: 2 }}>{file.category} · {file.size} · by {file.uploadedBy}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.25)' }}>{file.date}</span>
                                        <button style={{ padding: '4px 10px', fontSize: 10, fontWeight: 500, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 5, cursor: 'pointer' }}>Download</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══ SCHEDULE TAB ═══ */}
                {tab === 'schedule' && (
                    <div className="animate-in">
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 16 }}>MILESTONES · {project.startDate} → {project.targetEnd}</div>
                        <div style={{ position: 'relative', paddingLeft: 28 }}>
                            {milestones.map((m, i) => (
                                <div key={i} style={{ position: 'relative', paddingBottom: i < milestones.length - 1 ? 24 : 0 }}>
                                    {/* Vertical line */}
                                    {i < milestones.length - 1 && (
                                        <div style={{ position: 'absolute', left: -18, top: 16, bottom: 0, width: 2, background: m.done ? '#059669' : 'rgba(0,0,0,0.08)' }} />
                                    )}
                                    {/* Node */}
                                    <div style={{ position: 'absolute', left: -24, top: 4, width: 14, height: 14, borderRadius: '50%', background: m.done ? '#059669' : m.pct > 0 ? 'rgba(234,88,12,0.15)' : 'rgba(0,0,0,0.06)', border: m.done ? 'none' : m.pct > 0 ? '2px solid #EA580C' : '2px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {m.done && <span style={{ color: 'white', fontSize: 8, fontWeight: 900 }}>✓</span>}
                                    </div>
                                    <div className="collab-card" style={{ background: 'white', borderRadius: 10, padding: '14px 18px', border: `1px solid ${m.done ? 'rgba(5,150,105,0.12)' : 'rgba(0,0,0,0.06)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500, color: m.done ? 'rgba(0,0,0,0.4)' : '#111', textDecoration: m.done ? 'line-through' : 'none' }}>{m.label}</div>
                                            <div style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.25)', marginTop: 2 }}>Target: {m.target}</div>
                                        </div>
                                        {!m.done && m.pct > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 60, height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                                                    <div style={{ width: `${m.pct}%`, height: '100%', background: '#EA580C', borderRadius: 2 }} />
                                                </div>
                                                <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 600, color: '#EA580C' }}>{m.pct}%</span>
                                            </div>
                                        )}
                                        {m.done && <span style={{ fontSize: 9, fontWeight: 700, fontFamily: mono, padding: '2px 6px', borderRadius: 4, background: 'rgba(5,150,105,0.06)', color: '#059669' }}>DONE</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══ ACTIVITY TAB ═══ */}
                {tab === 'activity' && (
                    <div className="animate-in">
                        <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 16 }}>ALL ACTIVITY</div>
                        <div style={{ background: 'white', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                            {activity.map((a, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 20px', borderTop: i > 0 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{a.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13 }}><strong>{a.actor}</strong> <span style={{ color: 'rgba(0,0,0,0.35)' }}>{a.action}</span></div>
                                        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 3 }}>{a.detail}</div>
                                    </div>
                                    <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.2)', flexShrink: 0, marginTop: 3 }}>{a.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <footer style={{ padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 60 }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>© 2026 ROOF · PROJECT HUB</span>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.2)', fontStyle: 'italic' }}>Everyone sees the same project. Through their own lens.</span>
            </footer>
        </div>
    );
}
