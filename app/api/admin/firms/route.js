import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FIRMS_FILE = path.join(DATA_DIR, 'firms.json');

// Ensure data directory exists
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FIRMS_FILE)) {
        fs.writeFileSync(FIRMS_FILE, JSON.stringify({ firms: [] }, null, 2));
    }
}

function readFirms() {
    ensureDataDir();
    const data = fs.readFileSync(FIRMS_FILE, 'utf-8');
    return JSON.parse(data);
}

function writeFirms(data) {
    ensureDataDir();
    fs.writeFileSync(FIRMS_FILE, JSON.stringify(data, null, 2));
}

// GET - list all firms
export async function GET() {
    try {
        const data = readFirms();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read firms' }, { status: 500 });
    }
}

// PATCH - update firm status/credits
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, status, credits } = body;

        const data = readFirms();
        const firmIndex = data.firms.findIndex(f => f.id === id);

        if (firmIndex === -1) {
            return NextResponse.json({ error: 'Firm not found' }, { status: 404 });
        }

        if (status !== undefined) {
            data.firms[firmIndex].status = status;
        }
        if (credits !== undefined) {
            data.firms[firmIndex].credits = credits;
        }

        writeFirms(data);
        return NextResponse.json({ success: true, firm: data.firms[firmIndex] });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update firm' }, { status: 500 });
    }
}
