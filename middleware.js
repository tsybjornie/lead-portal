import { NextResponse } from 'next/server'

export function middleware(request) {
    const pathname = request.nextUrl.pathname

    // 1. Root path -> Redirect to /sg (Default Market)
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/sg', request.url))
    }

    // 2. Checks if the path is missing a locale (and is not a protected path)
    // Protected paths rely on the config matcher generally, but we can be explicit here if needed.
    // Ideally, if a user goes to /about, we want them at /sg/about.
    // The matcher below handles this. If it matches /about, we redirect.

    // NOTE: If we are already in /[market]/..., pathname starts with /sg or /my.
    const hasLocale = pathname.startsWith('/sg') || pathname.startsWith('/my');

    if (!hasLocale) {
        // If no locale, and it matched the config (meaning it's not api/admin/etc), redirect to /sg + pathname
        return NextResponse.redirect(new URL(`/sg${pathname}`, request.url))
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - admin (admin panel)
         * - portal (partner portal)
         * - logo.png (static assets)
         * - robots.txt
         * - sitemap.xml
         */
        '/((?!api|_next/static|_next/image|favicon.ico|admin|portal|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
