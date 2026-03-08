import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FIRMS_FILE = path.join(DATA_DIR, 'firms.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

function readFirms() {
    if (!fs.existsSync(FIRMS_FILE)) {
        return { firms: [] };
    }
    return JSON.parse(fs.readFileSync(FIRMS_FILE, 'utf-8'));
}

function readEnquiries() {
    if (!fs.existsSync(ENQUIRIES_FILE)) {
        return { enquiries: [] };
    }
    return JSON.parse(fs.readFileSync(ENQUIRIES_FILE, 'utf-8'));
}

// GET - get leads assigned to a firm
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        // Find the firm
        const firmsData = readFirms();
        const firm = firmsData.firms.find(f => f.email?.toLowerCase() === email.toLowerCase());

        if (!firm) {
            return NextResponse.json({ leads: [], message: 'Firm not found' });
        }

        // Find enquiries assigned to this firm
        const enquiriesData = readEnquiries();
        const assignedLeads = enquiriesData.enquiries.filter(enq =>
            enq.assignedFirms && enq.assignedFirms.includes(firm.id)
        );

        return NextResponse.json({ leads: assignedLeads });
    } catch (error) {
        console.error('Leads error:', error);
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}
