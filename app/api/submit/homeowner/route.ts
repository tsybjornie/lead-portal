import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// In-memory rate limiter
const submissions = new Map<string, { count: number; resetAt: number }>();
const MAX_PER_HOUR = 3;
const WINDOW_MS = 3600_000; // 1 hour

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = submissions.get(ip);
    if (!record || now > record.resetAt) {
        submissions.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return false;
    }
    record.count += 1;
    return record.count > MAX_PER_HOUR;
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
    return /^[+\d\s()-]{7,20}$/.test(phone);
}

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: 'Too many submissions. Please try again later.' },
            { status: 429 }
        );
    }

    const body = await req.json();

    // Honeypot check — if this hidden field is filled, it's a bot
    if (body._website) {
        return NextResponse.json({ success: true }); // Silently accept but don't save
    }

    const { full_name, email, phone, property_type, property_address, budget, timeline, preferred_style, notes } = body;

    if (!full_name || !phone) {
        return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 });
    }

    if (email && !isValidEmail(email)) {
        return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
        return NextResponse.json({ error: 'Invalid phone format.' }, { status: 400 });
    }

    const { error } = await supabase.from('homeowner_leads').insert({
        full_name, email, phone, property_type, property_address,
        budget, timeline, preferred_style, notes,
    });

    if (error) {
        return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
