import { NextResponse } from 'next/server';
import { SAMPLE_PROJECT_ASSETS, type ProjectAsset } from '@/types/project-assets';

// GET /api/assets/[code]  Fetch visual assets for a project
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;

    // In production, this would query a database using the share code
    // For now, return sample assets for any valid code
    if (!code || code.length < 4) {
        return NextResponse.json({ error: 'Invalid share code' }, { status: 400 });
    }

    return NextResponse.json({
        shareCode: code,
        assets: SAMPLE_PROJECT_ASSETS,
        lastSyncedAt: new Date().toISOString(),
    });
}

// POST /api/assets/[code]  Update asset feedback (approve/flag/comment)
export async function POST(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;
    const body = await request.json();

    // In production, this would update the database
    // For now, just acknowledge the feedback
    return NextResponse.json({
        success: true,
        shareCode: code,
        assetId: body.assetId,
        action: body.action,
    });
}
