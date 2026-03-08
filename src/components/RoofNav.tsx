'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import { useRole } from '@/components/RoleContext';
import type { RoleId } from '@/components/RoleContext';

const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

// ── Role definitions ──

interface RoleDef {
    id: RoleId;
    label: string;
    color: string;
    bg: string;
    navGroups: { links: { label: string; href: string }[] }[];
}

const ROLES: RoleDef[] = [
    {
        id: 'designer', label: 'Designer', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',
        navGroups: [
            { links: [{ label: 'Follow-Up', href: '/follow-up' }, { label: 'Projects', href: '/projects' }, { label: 'Quote Builder', href: '/quote-builder' }] },
            { links: [{ label: 'Sequence', href: '/sequence' }, { label: 'Dispatch', href: '/dispatch' }] },
            { links: [{ label: 'Ledger', href: '/ledger' }, { label: 'Team', href: '/team' }] },
            { links: [{ label: 'Intelligence', href: '/intelligence' }, { label: 'Autopilot', href: '/autopilot' }] },
        ],
    },
    {
        id: 'firm_owner', label: 'Firm Owner', color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)',
        navGroups: [
            { links: [{ label: 'Follow-Up', href: '/follow-up' }, { label: 'Projects', href: '/projects' }, { label: 'Quote Builder', href: '/quote-builder' }] },
            { links: [{ label: 'Sequence', href: '/sequence' }, { label: 'Dispatch', href: '/dispatch' }] },
            { links: [{ label: 'Ledger', href: '/ledger' }, { label: 'Team', href: '/team' }] },
            { links: [{ label: 'Marketing', href: '/marketing' }, { label: 'Intelligence', href: '/intelligence' }, { label: 'Autopilot', href: '/autopilot' }] },
        ],
    },
    {
        id: 'drafter', label: 'Drafter', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',
        navGroups: [
            { links: [{ label: 'Drafter', href: '/drafter' }, { label: 'Sequence', href: '/sequence' }] },
            { links: [{ label: 'Team', href: '/team' }] },
        ],
    },
    {
        id: 'contractor', label: 'Contractor', color: '#EF4444', bg: 'rgba(239,68,68,0.08)',
        navGroups: [
            { links: [{ label: 'My Jobs', href: '/dispatch' }, { label: 'Workers', href: '/team' }, { label: 'Site Inspect', href: '/inspect' }] },
            { links: [{ label: 'Overhead', href: '/overhead' }, { label: 'Vendor Rates', href: '/vendor-rates' }, { label: 'Price Index', href: '/price-index' }] },
            { links: [{ label: 'Ledger', href: '/ledger' }, { label: 'Chat', href: '/chat' }] },
        ],
    },
    {
        id: 'admin', label: 'Admin', color: '#9333EA', bg: 'rgba(147,51,234,0.08)',
        navGroups: [
            { links: [{ label: 'Dashboard', href: '/admin' }, { label: 'Follow-Up', href: '/follow-up' }, { label: 'Projects', href: '/projects' }] },
            { links: [{ label: 'Quote Builder', href: '/quote-builder' }, { label: 'Sequence', href: '/sequence' }, { label: 'Drafter', href: '/drafter' }] },
            { links: [{ label: 'Dispatch', href: '/dispatch' }, { label: 'Ledger', href: '/ledger' }, { label: 'Team', href: '/team' }] },
            { links: [{ label: 'Marketing', href: '/marketing' }, { label: 'Intelligence', href: '/intelligence' }, { label: 'Autopilot', href: '/autopilot' }] },
        ],
    },
];

export default function RoofNav() {
    const pathname = usePathname();
    const { activeRole, setActiveRole } = useRole();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const role = ROLES.find(r => r.id === activeRole)!;

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin' || pathname?.startsWith('/admin/');
        if (href === '/projects') return pathname === '/projects' || pathname?.startsWith('/project/');
        return pathname === href || pathname?.startsWith(href + '/');
    };

    return (
        <nav style={{
            padding: '0 32px', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'white', position: 'sticky', top: 0, zIndex: 50,
            fontFamily: "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <Link href="/landing" style={{
                    fontFamily: mono, fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.7)',
                    letterSpacing: '0.14em', textDecoration: 'none', marginRight: 20,
                }}>ROOF</Link>

                {role.navGroups.map((group, gi) => (
                    <div key={gi} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.08)', margin: '0 8px' }} />
                        <div style={{ display: 'flex', gap: 2 }}>
                            {group.links.map(link => {
                                const active = isActive(link.href);
                                return (
                                    <Link key={link.label} href={link.href} style={{
                                        fontSize: 11, fontWeight: active ? 600 : 400,
                                        color: active ? '#111' : 'rgba(0,0,0,0.35)',
                                        textDecoration: 'none', padding: '5px 8px', borderRadius: 5,
                                        background: active ? 'rgba(0,0,0,0.05)' : 'transparent',
                                        transition: 'all 0.15s', whiteSpace: 'nowrap',
                                    }}>{link.label}</Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Role Switcher */}
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: '0.05em',
                            padding: '3px 10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                            background: role.bg, color: role.color,
                            textTransform: 'uppercase', fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', gap: 4,
                        }}
                    >
                        {role.label}
                        <span style={{ fontSize: 8, opacity: 0.6 }}>▼</span>
                    </button>

                    {dropdownOpen && (
                        <div style={{
                            position: 'absolute', top: '100%', right: 0, marginTop: 6,
                            background: 'white', borderRadius: 8, border: '1px solid #E9E9E7',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden',
                            minWidth: 160, zIndex: 100,
                        }}>
                            <div style={{ padding: '8px 12px', borderBottom: '1px solid #F3F3F2' }}>
                                <span style={{ fontSize: 8, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Switch Role</span>
                            </div>
                            {ROLES.map(r => (
                                <button
                                    key={r.id}
                                    onClick={() => { setActiveRole(r.id); setDropdownOpen(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                                        padding: '8px 12px', border: 'none', cursor: 'pointer',
                                        background: r.id === activeRole ? '#FAFAF9' : 'white',
                                        fontFamily: 'inherit', textAlign: 'left',
                                        transition: 'background 0.1s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAF9'}
                                    onMouseLeave={e => e.currentTarget.style.background = r.id === activeRole ? '#FAFAF9' : 'white'}
                                >
                                    <span style={{
                                        width: 8, height: 8, borderRadius: '50%', background: r.color,
                                        boxShadow: r.id === activeRole ? `0 0 0 2px white, 0 0 0 3px ${r.color}` : 'none',
                                    }} />
                                    <span style={{ fontSize: 11, fontWeight: r.id === activeRole ? 700 : 500, color: '#37352F' }}>{r.label}</span>
                                    {r.id === activeRole && <span style={{ marginLeft: 'auto', fontSize: 10, color: r.color }}>✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Link href="/login" style={{
                    fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.35)',
                    textDecoration: 'none', padding: '5px 8px',
                }}>Log in</Link>
            </div>
        </nav>
    );
}
