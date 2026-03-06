import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'quotes');

function generateShareCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 for readability
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

async function ensureDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch {
        // dir exists
    }
}

// POST  Designer shares a quote
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sections, zones, quoteNumber, companyName, companyTagline, projectName, clientName, jurisdiction } = body;

        if (!sections || !Array.isArray(sections)) {
            return NextResponse.json({ error: 'sections is required' }, { status: 400 });
        }

        await ensureDir();

        // Generate unique share code
        let shareCode = generateShareCode();
        let attempts = 0;
        while (attempts < 10) {
            const filePath = path.join(DATA_DIR, `${shareCode}.json`);
            try {
                await fs.access(filePath);
                shareCode = generateShareCode();
                attempts++;
            } catch {
                break; // file doesn't exist, code is unique
            }
        }

        const quoteData = {
            shareCode,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            quoteNumber: quoteNumber || '',
            status: 'SENT',
            companyName: companyName || '',
            companyTagline: companyTagline || '',
            projectName: projectName || '',
            clientName: clientName || '',
            jurisdiction: jurisdiction || 'SG',
            sections,
            zones: zones || [],
            clientFeedback: {} as Record<string, {
                status: 'pending' | 'approved' | 'flagged';
                selectedOptionId?: string;
                comments: Array<{ id: string; text: string; author: 'client' | 'designer'; timestamp: string }>;
            }>,
        };

        const filePath = path.join(DATA_DIR, `${shareCode}.json`);
        await fs.writeFile(filePath, JSON.stringify(quoteData, null, 2), 'utf-8');

        const shareUrl = `/quote/${shareCode}`;
        return NextResponse.json({ shareCode, shareUrl }, { status: 201 });

    } catch (error) {
        console.error('Error sharing quote:', error);
        return NextResponse.json({ error: 'Failed to share quote' }, { status: 500 });
    }
}
