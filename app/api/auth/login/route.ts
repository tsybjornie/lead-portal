import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════
// SERVER-SIDE CREDENTIAL VALIDATION
// Passwords never leave the server — not shipped to the browser
// ═══════════════════════════════════════════════════════════════

interface DemoUser {
    code: string;
    username: string;
    password: string;
    name: string;
    email: string;
    role: string;
    roles: string[];
    firm?: { name: string; uen: string };
    defaultRoute: string;
}

const DEMO_USERS: DemoUser[] = [
    { code: 'BJORN', username: 'bjorn', password: 'roof123', name: 'Bjorn Teo', email: 'bjorn@vinterior.sg', role: 'designer', roles: ['designer'], firm: { name: 'Vinterior Pte Ltd', uen: '202312345X' }, defaultRoute: '/hub' },
    { code: 'TINA', username: 'tina', password: 'roof123', name: 'Tina Wong', email: 'tina@vinterior.sg', role: 'designer', roles: ['designer'], firm: { name: 'Vinterior Pte Ltd', uen: '202312345X' }, defaultRoute: '/hub' },
    { code: 'BOSS', username: 'admin', password: 'roof123', name: 'Roof Admin', email: 'admin@roof.sg', role: 'admin', roles: ['designer', 'vendor', 'client', 'prospect', 'developer', 'admin', 'worker'], defaultRoute: '/hub' },
    { code: 'AHMAD', username: 'ahmad', password: 'roof123', name: 'Ahmad Bin Hassan', email: 'ahmad@woodworksg.com', role: 'vendor', roles: ['vendor'], firm: { name: 'WoodWork SG', uen: '202198765Y' }, defaultRoute: '/vendor/dashboard' },
    { code: 'LEONG', username: 'leong', password: 'roof123', name: 'Leong Electrical', email: 'leong@sparkssg.com', role: 'vendor', roles: ['vendor'], firm: { name: 'Sparks Electrical Pte Ltd', uen: '201987654Z' }, defaultRoute: '/vendor/dashboard' },
    { code: 'KUMAR', username: 'kumar', password: 'roof123', name: 'Kumar Saravanan', email: 'kumar@woodworksg.com', role: 'worker', roles: ['worker'], firm: { name: 'WoodWork SG', uen: '202198765Y' }, defaultRoute: '/worker/tasks' },
    { code: 'DAVID', username: 'david', password: 'roof123', name: 'David Lim', email: 'david.lim@gmail.com', role: 'client', roles: ['client'], defaultRoute: '/client-dashboard' },
    { code: 'SARAH', username: 'sarah', password: 'roof123', name: 'Sarah Chen', email: 'sarah.chen@gmail.com', role: 'prospect', roles: ['prospect'], defaultRoute: '/prospect' },
    { code: 'CAPITA', username: 'capita', password: 'roof123', name: 'CapitaLand Dev', email: 'projects@capitaland.com', role: 'developer', roles: ['developer'], firm: { name: 'CapitaLand Residential', uen: '198301876K' }, defaultRoute: '/hub' },
];

// Simple in-memory rate limiter
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = attempts.get(ip);
    if (!record || now > record.resetAt) {
        attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return false;
    }
    record.count += 1;
    return record.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: 'Too many login attempts. Please wait a minute.' },
            { status: 429 }
        );
    }

    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json({ error: 'Username and password required.' }, { status: 400 });
    }

    const user = DEMO_USERS.find(
        u => u.username.toLowerCase() === username.toLowerCase().trim()
    );

    if (!user || user.password !== password) {
        return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    // Return user info WITHOUT password
    return NextResponse.json({
        code: user.code,
        name: user.name,
        email: user.email,
        role: user.role,
        roles: user.roles,
        firm: user.firm,
        defaultRoute: user.defaultRoute,
    });
}
