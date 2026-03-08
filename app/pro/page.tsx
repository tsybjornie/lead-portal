'use client';

import React, { useState } from 'react';
import RoofNav from '@/components/RoofNav';

// ============================================================
// PROFESSIONAL PORTAL — Multi-Role Workspace Hub
// ============================================================

type Role = 'designer' | 'drafter' | 'site_mgr' | 'admin';

const ROLE_CFG: Record<Role, { label: string; emoji: string; color: string; bg: string }> = {
    designer: { label: 'Designer', emoji: '', color: '#F59E0B', bg: '#FEF9C3' },
    drafter: { label: 'Drafter', emoji: '', color: '#3B82F6', bg: '#EFF6FF' },
    site_mgr: { label: 'Site Mgr', emoji: '', color: '#22C55E', bg: '#F0FDF4' },
    admin: { label: 'Admin', emoji: '', color: '#6B6A67', bg: '#F7F6F3' },
};

interface TeamMember {
    id: string;
    name: string;
    role: Role;
    status: 'active' | 'away' | 'busy';
    projects: string[];
    tasks: number;
    completedToday: number;
}

const TEAM: TeamMember[] = [
    { id: 'T1', name: 'Bjorn Tan', role: 'designer', status: 'active', projects: ['Tan Residence', 'Lim BTO'], tasks: 5, completedToday: 2 },
    { id: 'T2', name: 'Jenny Lee', role: 'designer', status: 'busy', projects: ['Wong Condo', 'Chen Landed'], tasks: 7, completedToday: 3 },
    { id: 'T3', name: 'Alex Ong', role: 'drafter', status: 'active', projects: ['Tan Residence', 'Wong Condo'], tasks: 4, completedToday: 1 },
    { id: 'T4', name: 'Ravi Kumar', role: 'drafter', status: 'away', projects: ['Chen Landed'], tasks: 2, completedToday: 0 },
    { id: 'T5', name: 'Ahmad Shah', role: 'site_mgr', status: 'active', projects: ['Tan Residence', 'Lim BTO', 'Old Project'], tasks: 6, completedToday: 4 },
    { id: 'T6', name: 'Michelle Ng', role: 'admin', status: 'active', projects: [], tasks: 8, completedToday: 5 },
];

export default function ProPortal() {
    const [activeRole, setActiveRole] = useState<Role | 'all'>('all');
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const filteredTeam = activeRole === 'all' ? TEAM : TEAM.filter(t => t.role === activeRole);
    const member = TEAM.find(t => t.id === selectedMember);

    const roleCounts = Object.keys(ROLE_CFG).map(r => ({
        role: r as Role,
        count: TEAM.filter(t => t.role === r).length,
    }));

    const statusColors = { active: '#22C55E', busy: '#F59E0B', away: '#9B9A97' };

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            <RoofNav />
            <div style={{ padding: '20px 32px 80px' }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#37352F', margin: '0 0 4px' }}>Professional Portal</h1>
                <p style={{ fontSize: 12, color: '#9B9A97', margin: '0 0 20px' }}>Team overview · Role-based workspace · Project assignments</p>

                {/* Role Filter Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
                    <button onClick={() => setActiveRole('all')} style={{
                        padding: 14, borderRadius: 12, border: activeRole === 'all' ? '2px solid #37352F' : '1px solid #E9E9E7',
                        background: activeRole === 'all' ? '#37352F' : 'white', cursor: 'pointer', textAlign: 'left',
                    }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}></div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: activeRole === 'all' ? 'white' : '#37352F' }}>{TEAM.length}</div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: activeRole === 'all' ? 'rgba(255,255,255,0.7)' : '#9B9A97', textTransform: 'uppercase' }}>All Team</div>
                    </button>
                    {roleCounts.map(rc => {
                        const cfg = ROLE_CFG[rc.role];
                        const isActive = activeRole === rc.role;
                        return (
                            <button key={rc.role} onClick={() => setActiveRole(isActive ? 'all' : rc.role)} style={{
                                padding: 14, borderRadius: 12, border: isActive ? `2px solid ${cfg.color}` : '1px solid #E9E9E7',
                                background: isActive ? cfg.bg : 'white', cursor: 'pointer', textAlign: 'left',
                                transition: 'all 0.2s',
                            }}>
                                <div style={{ fontSize: 20, marginBottom: 4 }}>{cfg.emoji}</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: cfg.color }}>{rc.count}</div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase' }}>{cfg.label}s</div>
                            </button>
                        );
                    })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: selectedMember ? '1fr 380px' : '1fr', gap: 16 }}>
                    {/* Team Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                        {filteredTeam.map(tm => {
                            const cfg = ROLE_CFG[tm.role];
                            const isSelected = selectedMember === tm.id;
                            const completionPct = tm.tasks > 0 ? (tm.completedToday / tm.tasks * 100) : 0;
                            return (
                                <div key={tm.id} onClick={() => setSelectedMember(isSelected ? null : tm.id)}
                                    style={{
                                        background: 'white', borderRadius: 14, padding: 18, cursor: 'pointer',
                                        border: isSelected ? `2px solid ${cfg.color}` : '1px solid #E9E9E7',
                                        transition: 'all 0.2s', boxShadow: isSelected ? `0 4px 16px ${cfg.bg}` : 'none',
                                    }}
                                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {/* Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: '50%', background: cfg.bg,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                                            border: `2px solid ${cfg.color}`, position: 'relative',
                                        }}>
                                            {cfg.emoji}
                                            <div style={{
                                                position: 'absolute', bottom: -1, right: -1, width: 12, height: 12,
                                                borderRadius: '50%', background: statusColors[tm.status],
                                                border: '2px solid white',
                                            }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: '#37352F' }}>{tm.name}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                                <span style={{ fontSize: 9, color: statusColors[tm.status], fontWeight: 600, textTransform: 'capitalize' }}> {tm.status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Projects */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                                        {tm.projects.map(p => (
                                            <span key={p} style={{ fontSize: 9, padding: '3px 8px', background: '#F7F6F3', borderRadius: 6, color: '#6B6A67', fontWeight: 500 }}>{p}</span>
                                        ))}
                                        {tm.projects.length === 0 && <span style={{ fontSize: 9, color: '#D4D3D0' }}>No projects assigned</span>}
                                    </div>

                                    {/* Task Progress */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontSize: 10, color: '#9B9A97' }}>Today&apos;s Tasks</span>
                                            <span style={{ fontSize: 10, fontWeight: 700, color: '#37352F' }}>{tm.completedToday}/{tm.tasks}</span>
                                        </div>
                                        <div style={{ height: 6, background: '#F5F5F4', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', borderRadius: 3,
                                                background: completionPct >= 80 ? '#22C55E' : completionPct >= 40 ? '#F59E0B' : '#3B82F6',
                                                width: `${completionPct}%`, transition: 'width 0.5s',
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Member Detail Panel */}
                    {member && (() => {
                        const cfg = ROLE_CFG[member.role];
                        // Role-specific sections
                        const sections = {
                            designer: [
                                { title: 'Active Design Boards', items: ['Tan Residence — Kitchen Concept', 'Tan Residence — MBR Mood Board', 'Lim BTO — Living Room Concepts'] },
                                { title: 'Upcoming Deadlines', items: ['Client deck review: 12 Mar', 'Material sign-off: 14 Mar', 'Design presentation: 16 Mar'] },
                                { title: 'Recent Uploads', items: ['Kitchen_3D_v2.jpg — 2h ago', 'Material_Board_Final.pdf — Yesterday', 'Site_Survey_Photos.zip — 2d ago'] },
                            ],
                            drafter: [
                                { title: 'Drawing Queue', items: ['DWG-002 Kitchen Elevation (URGENT)', 'DWG-003 Master Bath Elevation', 'DWG-005 Electrical Layout'] },
                                { title: 'Hours This Week', items: ['Mon: 7.5h', 'Tue: 8.0h', 'Wed: 6.5h (today)'] },
                                { title: 'Pending Reviews', items: ['DWG-006 Living Floor Plan — v2 submitted', 'DWG-001 Floor Plan — approved '] },
                            ],
                            site_mgr: [
                                { title: 'Today\'s Sites', items: ['Tan Residence — Tiling (8am–5pm)', 'Lim BTO — Carpentry install (1pm–6pm)'] },
                                { title: 'Open Defects', items: ['ISS-001 Uneven wall in master bath', 'ISS-002 Tile lippage at entrance'] },
                                { title: 'Crew On Site', items: ['Ah Kow (Tiler) — ON SITE', 'Raju (Helper) — ON SITE', 'Ah Beng (Plumber) — EN ROUTE'] },
                            ],
                            admin: [
                                { title: 'Pending Invoices', items: ['INV-2025-042 Hock Seng — $4,200', 'INV-2025-043 KH Electrical — $1,800', 'INV-2025-044 Union Plaster — $3,500'] },
                                { title: 'Follow-Up Queue', items: ['Sarah Wong — Call within 15 min', 'Marcus Lee — Confirm site visit', 'Amy Lim — Send portfolio'] },
                                { title: 'Admin Tasks', items: ['GST filing due: 31 Mar', 'Insurance renewal: 15 Apr', 'BCA license check: 30 Apr'] },
                            ],
                        };

                        const roleSections = sections[member.role] || [];

                        return (
                            <div style={{
                                background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', padding: 20,
                                position: 'sticky', top: 68, alignSelf: 'start',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: '50%', background: cfg.bg,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                                            border: `2px solid ${cfg.color}`,
                                        }}>{cfg.emoji}</div>
                                        <div>
                                            <div style={{ fontSize: 15, fontWeight: 800, color: '#37352F' }}>{member.name}</div>
                                            <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedMember(null)} style={{
                                        width: 28, height: 28, borderRadius: 6, border: '1px solid #E9E9E7', background: 'white',
                                        cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}></button>
                                </div>

                                {/* Role-Specific Sections */}
                                {roleSections.map((sec, si) => (
                                    <div key={si} style={{ marginBottom: 14 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{sec.title}</div>
                                        {sec.items.map((item, ii) => (
                                            <div key={ii} style={{
                                                padding: '6px 10px', marginBottom: 3, borderRadius: 6,
                                                background: item.includes('URGENT') ? '#FEF2F2' : '#FAFAF9',
                                                border: '1px solid #F3F3F2', fontSize: 11, color: '#37352F',
                                            }}>{item}</div>
                                        ))}
                                    </div>
                                ))}

                                {/* Quick Actions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <button style={{
                                        padding: '10px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none',
                                        cursor: 'pointer', background: cfg.bg, color: cfg.color, fontFamily: f, width: '100%',
                                    }}> Message {member.name.split(' ')[0]}</button>
                                    <button style={{
                                        padding: '10px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: '1px solid #E9E9E7',
                                        cursor: 'pointer', background: 'white', color: '#37352F', fontFamily: f, width: '100%',
                                    }}> Assign Task</button>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
