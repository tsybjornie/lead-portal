import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ENQUIRIES_FILE)) {
        fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify({ enquiries: [] }, null, 2));
    }
}

function readEnquiries() {
    ensureDataDir();
    const data = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
    return JSON.parse(data);
}

function writeEnquiries(data) {
    ensureDataDir();
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(data, null, 2));
}

// GET - list all enquiries  
export async function GET() {
    try {
        const data = readEnquiries();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read enquiries' }, { status: 500 });
    }
}

// PATCH - update enquiry status
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, status, assignedFirms } = body;

        const data = readEnquiries();
        const enqIndex = data.enquiries.findIndex(e => e.id === id);

        if (enqIndex === -1) {
            return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
        }

        if (status !== undefined) {
            data.enquiries[enqIndex].status = status;
        }
        if (assignedFirms !== undefined) {
            data.enquiries[enqIndex].assignedFirms = assignedFirms;
        }

        writeEnquiries(data);
        return NextResponse.json({ success: true, enquiry: data.enquiries[enqIndex] });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 });
    }
}
