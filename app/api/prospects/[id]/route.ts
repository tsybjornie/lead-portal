import { NextResponse } from 'next/server';

// PATCH /api/prospects/[id]  Update prospect status or fields
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // In production this would update the database.
        // The client-side will handle localStorage updates directly.
        // This endpoint serves as the API contract for future DB migration.
        return NextResponse.json({
            success: true,
            prospectId: id,
            updates: body,
            updatedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error('[Prospects] Update error:', err);
        return NextResponse.json({ error: 'Failed to update prospect' }, { status: 500 });
    }
}

// GET /api/prospects/[id]  Get single prospect
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    // Client-side hydration handles actual data.
    // This endpoint is the API contract.
    return NextResponse.json({
        prospectId: id,
        message: 'Hydrate from localStorage on client',
    });
}
