'use client';

import { useRoofAuth } from '@/context/RoofAuthContext';
import UnifiedSidebar from '@/components/UnifiedSidebar';
import ContentProtection from '@/components/ContentProtection';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PUBLIC_ROUTES = ['/login', '/quote/'];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, sidebarCollapsed } = useRoofAuth();
    const pathname = usePathname();
    const router = useRouter();

    const isPublicRoute = PUBLIC_ROUTES.some(r => pathname.startsWith(r));

    // Redirect to login if not authenticated and not on a public route
    useEffect(() => {
        if (!isLoggedIn && !isPublicRoute) {
            // Don't redirect  just show without sidebar so existing pages still work
        }
    }, [isLoggedIn, isPublicRoute, router]);

    // Public routes: no sidebar, full width
    if (isPublicRoute) {
        return <>{children}</>;
    }

    // Not logged in: show pages without sidebar (backward compatible)
    if (!isLoggedIn) {
        return (
            <div>
                <ContentProtection />
                {/* Floating login button */}
                <button
                    onClick={() => router.push('/login')}
                    style={{
                        position: 'fixed', bottom: 20, right: 20, zIndex: 100,
                        background: '#37352F', color: 'white', border: 'none',
                        borderRadius: 10, padding: '10px 20px', fontSize: 13,
                        fontWeight: 600, cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(55,53,47,0.2)',
                        fontFamily: "'Inter', sans-serif",
                        display: 'flex', alignItems: 'center', gap: 8,
                    }}
                >
                    <span style={{ fontSize: 16 }}></span>
                    Login to Roof
                </button>
                {children}
            </div>
        );
    }

    // Logged in: sidebar + content
    const ml = sidebarCollapsed ? 60 : 240;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <UnifiedSidebar />
            <div style={{
                marginLeft: ml, flex: 1, transition: 'margin-left 0.2s ease',
                minHeight: '100vh',
            }}>
                {children}
            </div>
        </div>
    );
}
