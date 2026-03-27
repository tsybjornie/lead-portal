import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Route Protection Middleware
 * 
 * Gates routes by user role. In the prototype, role is set via a cookie.
 * In production, this would verify a JWT/session token against your auth provider.
 * 
 * Roles:
 *   designer   Full access to Roof, Roof, Roof tools
 *   client     Only /client-dashboard and related endpoints
 *   vendor     Only /vendor-portal and related endpoints
 *   admin      Everything
 * 
 * How to test:
 *   - Default (no cookie) = designer (for dev convenience)
 *   - Set cookie: document.cookie = "role=client; path=/"
 *   - Then try navigating to /vendor-rates  blocked
 */

// ============================================================
// ROUTE ACCESS CONTROL
// ============================================================

type Role = 'designer' | 'client' | 'vendor' | 'admin';

const ROUTE_ACCESS: Record<string, Role[]> = {
    // Designer-only routes (Roof, Roof, Roof tools)
    '/': ['designer', 'admin'],
    '/hub': ['designer', 'admin'],
    '/quote-builder': ['designer', 'admin'],
    '/vendor-rates': ['designer', 'admin'],
    '/reveal': ['designer', 'admin'],

    // Client-only routes
    '/client-dashboard': ['client', 'admin'],

    // Vendor-only routes (future)
    '/vendor-portal': ['vendor', 'admin'],

    // API routes  protected by prefix
    '/api/prospects': ['designer', 'admin'],
    '/api/assets': ['designer', 'admin'],
};

// Routes that are public (no auth required)
const PUBLIC_ROUTES = [
    '/login',
    '/landing',      // Landing / marketing page
    '/forgot-password',
    '/signup',
    '/invite',       // Vendor invitation link
    '/quote/',       // Public quote view
    '/homeowner',    // Homeowner onboarding
    '/legal',        // Legal pages
    '/_next',        // Next.js internals
    '/favicon.ico',
];

// ============================================================
// MIDDLEWARE
// ============================================================

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip public routes and Next.js internals
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Get role from cookie (production: verify JWT)
    // Default to 'admin' in dev so devs can access all views
    const isDev = process.env.NODE_ENV === 'development';
    const role = (request.cookies.get('role')?.value || (isDev ? 'admin' : 'designer')) as Role;

    // Find matching route rule
    const matchedRoute = Object.keys(ROUTE_ACCESS)
        .sort((a, b) => b.length - a.length) // Longest match first
        .find(route => pathname === route || pathname.startsWith(route + '/'));

    if (!matchedRoute) {
        // No explicit rule  allow (could be a static asset)
        return NextResponse.next();
    }

    const allowedRoles = ROUTE_ACCESS[matchedRoute];

    if (!allowedRoles.includes(role)) {
        // BLOCKED  redirect to appropriate home based on role
        const redirectMap: Record<Role, string> = {
            designer: '/',
            client: '/client-dashboard',
            vendor: '/vendor-portal',
            admin: '/',
        };

        const redirectTo = redirectMap[role] || '/login';
        const url = request.nextUrl.clone();
        url.pathname = redirectTo;
        url.searchParams.set('blocked', pathname); // So we can show "access denied"

        return NextResponse.redirect(url);
    }

    // Add role header for downstream use
    const response = NextResponse.next();
    response.headers.set('x-user-role', role);
    return response;
}

export const config = {
    matcher: [
        // Match all routes except static files
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
