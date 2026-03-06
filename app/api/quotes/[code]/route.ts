import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'quotes');

// GET  Load shared quote by code
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const filePath = path.join(DATA_DIR, `${code}.json`);

        try {
            const data = await fs.readFile(filePath, 'utf-8');
            return NextResponse.json(JSON.parse(data));
        } catch {
            return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error loading quote:', error);
        return NextResponse.json({ error: 'Failed to load quote' }, { status: 500 });
    }
}

// PATCH  Client updates feedback (approve/flag/comment/pick option)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const filePath = path.join(DATA_DIR, `${code}.json`);

        let quoteData;
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            quoteData = JSON.parse(data);
        } catch {
            return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
        }

        const body = await request.json();
        const { itemId, action, payload } = body;

        if (!itemId || !action) {
            return NextResponse.json({ error: 'itemId and action required' }, { status: 400 });
        }

        // Initialize feedback for this item if needed
        if (!quoteData.clientFeedback) {
            quoteData.clientFeedback = {};
        }
        if (!quoteData.clientFeedback[itemId]) {
            quoteData.clientFeedback[itemId] = {
                status: 'pending',
                comments: [],
            };
        }

        const feedback = quoteData.clientFeedback[itemId];

        switch (action) {
            case 'approve':
                feedback.status = feedback.status === 'approved' ? 'pending' : 'approved';
                break;
            case 'flag':
                feedback.status = feedback.status === 'flagged' ? 'pending' : 'flagged';
                break;
            case 'selectOption':
                feedback.selectedOptionId = payload?.optionId;
                break;
            case 'comment':
                if (payload?.text) {
                    feedback.comments.push({
                        id: `cmt-${Date.now()}`,
                        text: payload.text,
                        author: payload.author || 'client',
                        timestamp: new Date().toISOString(),
                    });
                }
                break;
            default:
                return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
        }

        quoteData.updatedAt = new Date().toISOString();
        await fs.writeFile(filePath, JSON.stringify(quoteData, null, 2), 'utf-8');

        return NextResponse.json({ success: true, feedback: quoteData.clientFeedback });

    } catch (error) {
        console.error('Error updating quote:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
