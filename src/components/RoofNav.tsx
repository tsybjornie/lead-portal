'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

const NAV_LINKS = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Projects', href: '/projects' },
    { label: 'Autopilot', href: '/autopilot' },
    { label: 'Intelligence', href: '/intelligence' },
    { label: 'SketchUp', href: '/sketchup' },
];

export default function RoofNav() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin' || pathname?.startsWith('/admin/');
        if (href === '/projects') return pathname === '/projects' || pathname?.startsWith('/project/');
        return pathname === href;
    };

    return (
        <nav style={{
            padding: '0 40px', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'white', position: 'sticky', top: 0, zIndex: 50,
            fontFamily: "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                <Link href="/landing" style={{
                    fontFamily: mono, fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.7)',
                    letterSpacing: '0.14em', textDecoration: 'none',
                }}>ROOF</Link>

                <div style={{ width: 1, height: 20, background: 'rgba(0,0,0,0.08)' }} />

                <div style={{ display: 'flex', gap: 4 }}>
                    {NAV_LINKS.map(link => {
                        const active = isActive(link.href);
                        return (
                            <Link key={link.label} href={link.href} style={{
                                fontSize: 12, fontWeight: active ? 600 : 400,
                                color: active ? '#111' : 'rgba(0,0,0,0.35)',
                                textDecoration: 'none', padding: '6px 12px', borderRadius: 6,
                                background: active ? 'rgba(0,0,0,0.04)' : 'transparent',
                                transition: 'all 0.15s',
                            }}>{link.label}</Link>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Link href="/quote-builder" style={{
                    fontSize: 11, fontWeight: 600, color: 'white', background: '#111',
                    padding: '6px 14px', borderRadius: 6, textDecoration: 'none',
                    transition: 'background 0.15s',
                }}>New Quote</Link>
                <Link href="/login" style={{
                    fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)',
                    textDecoration: 'none', padding: '6px 10px',
                }}>Log in</Link>
            </div>
        </nav>
    );
}
