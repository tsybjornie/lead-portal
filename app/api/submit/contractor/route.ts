import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// In-memory rate limiter
const submissions = new Map<string, { count: number; resetAt: number }>();
const MAX_PER_HOUR = 3;
const WINDOW_MS = 3600_000;

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

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: 'Too many submissions. Please try again later.' },
            { status: 429 }
        );
    }

    const body = await req.json();

    // Honeypot check
    if (body._website) {
        return NextResponse.json({ success: true });
    }

    const { company_name, uen, contact_person, email, phone, bca_license, hdb_license, trades, team_size, coverage, day_rate } = body;

    if (!company_name || !contact_person) {
        return NextResponse.json({ error: 'Company name and contact person are required.' }, { status: 400 });
    }

    const { error } = await supabase.from('contractor_applications').insert({
        company_name, uen, contact_person, email, phone,
        bca_license, hdb_license, trades, team_size, coverage, day_rate,
    });

    if (error) {
        return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
