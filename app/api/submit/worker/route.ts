import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
        return NextResponse.json({ error: 'Too many submissions.' }, { status: 429 });
    }

    const body = await req.json();
    if (body._website) return NextResponse.json({ success: true });

    const { full_name, phone, email, id_type, trades, experience, availability, license, firm } = body;
    if (!full_name || !phone) {
        return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 });
    }

    const { error } = await supabase.from('worker_applications').insert({
        full_name, phone, email, id_type, trades, experience, availability, license, firm,
    });

    if (error) return NextResponse.json({ error: 'Failed to submit.' }, { status: 500 });
    return NextResponse.json({ success: true });
}
