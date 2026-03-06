import { NextResponse } from 'next/server';
import {
    getProspects,
    saveProspects,
    createProspect,
    type Prospect,
} from '@/types/prospect-client';

// GET /api/prospects  List all prospects
export async function GET() {
    // In a real app we'd read from DB, but we use localStorage on the client.
    // This API acts as a pass-through for SSR-safe access.
    // The client will hydrate from localStorage directly,
    // but for any server-initiated calls we return empty.
    return NextResponse.json({ prospects: [] });
}

// POST /api/prospects  Create a new prospect
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, email, projectAddress, projectType, estimatedBudget, notes, referralSource } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const prospect = createProspect(name, phone, email);

        // Add optional fields
        if (projectAddress) prospect.projectAddress = projectAddress;
        if (projectType) prospect.projectType = projectType;
        if (estimatedBudget) prospect.estimatedBudget = estimatedBudget;
        if (notes) prospect.notes = notes;
        if (referralSource) prospect.referralSource = referralSource;

        return NextResponse.json({ success: true, prospect });
    } catch (err) {
        console.error('[Prospects] Create error:', err);
        return NextResponse.json({ error: 'Failed to create prospect' }, { status: 500 });
    }
}
