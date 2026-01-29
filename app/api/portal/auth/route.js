import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FIRMS_FILE = path.join(DATA_DIR, 'firms.json');

function readFirms() {
    if (!fs.existsSync(FIRMS_FILE)) {
        return { firms: [] };
    }
    const data = fs.readFileSync(FIRMS_FILE, 'utf-8');
    return JSON.parse(data);
}

// GET - authenticate firm by email
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        const data = readFirms();
        const firm = data.firms.find(f => f.email?.toLowerCase() === email.toLowerCase());

        if (!firm) {
            return NextResponse.json({ firm: null, message: 'No firm found with this email' });
        }

        // Return firm data (excluding sensitive info if needed)
        return NextResponse.json({
            firm: {
                id: firm.id,
                company_name: firm.company_name,
                firm_type: firm.firm_type,
                status: firm.status,
                credits: firm.credits || 0,
                email: firm.email
            }
        });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
