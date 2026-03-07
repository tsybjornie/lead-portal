'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

const NAV_GROUPS = [
    {
        links: [
            { label: 'Dashboard', href: '/admin' },
            { label: 'Projects', href: '/projects' },
        ],
    },
    {
        links: [
            { label: 'Follow-Up', href: '/follow-up' },
            { label: 'Intelligence', href: '/intelligence' },
            { label: 'Autopilot', href: '/autopilot' },
        ],
    },
    {
        links: [
            { label: 'Sequence', href: '/sequence' },
            { label: 'SketchUp', href: '/sketchup' },
            { label: 'Quote Builder', href: '/quote-builder' },
        ],
    },
    {
        links: [
            { label: 'Dispatch', href: '/dispatch' },
            { label: 'PaddleDuck', href: '/paddleduck' },
            { label: 'Ledger', href: '/ledger' },
        ],
    },
];

export default function RoofNav() {
    const pathname = usePathname();

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

                {NAV_GROUPS.map((group, gi) => (
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

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link href="/login" style={{
                    fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.35)',
                    textDecoration: 'none', padding: '5px 8px',
                }}>Log in</Link>
            </div>
        </nav>
    );
}
