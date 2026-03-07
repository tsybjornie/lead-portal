import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════
// EMAIL NOTIFICATIONS FOR NEW SUBMISSIONS
// Called by Supabase webhook on INSERT to lead/application tables
// ═══════════════════════════════════════════════════════════════

// For production, use Resend, SendGrid, or similar.
// For now, this logs the notification and can be extended.
const ADMIN_EMAILS = ['bjorn@vinterior.sg', 'tina@vinterior.sg'];

interface WebhookPayload {
    type: 'INSERT';
    table: string;
    record: Record<string, any>;
    schema: string;
}

export async function POST(req: NextRequest) {
    // Verify this is coming from Supabase (basic auth header check)
    const authHeader = req.headers.get('authorization');
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;

    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const payload: WebhookPayload = await req.json();
        const { table, record } = payload;

        // Build notification message based on table
        let subject = '';
        let message = '';

        switch (table) {
            case 'homeowner_leads':
                subject = `🏠 New Homeowner Lead: ${record.full_name}`;
                message = `Name: ${record.full_name}\nPhone: ${record.phone}\nEmail: ${record.email || 'N/A'}\nProperty: ${record.property_type || 'N/A'}\nBudget: ${record.budget || 'N/A'}\nTimeline: ${record.timeline || 'N/A'}\nStyle: ${record.preferred_style || 'N/A'}`;
                break;
            case 'contractor_applications':
                subject = `🔧 New Contractor Application: ${record.company_name}`;
                message = `Company: ${record.company_name}\nContact: ${record.contact_person}\nPhone: ${record.phone || 'N/A'}\nEmail: ${record.email || 'N/A'}\nTrades: ${(record.trades || []).join(', ')}\nTeam: ${record.team_size || 'N/A'}`;
                break;
            case 'worker_applications':
                subject = `👷 New Worker Application: ${record.full_name}`;
                message = `Name: ${record.full_name}\nPhone: ${record.phone}\nTrades: ${(record.trades || []).join(', ')}\nExperience: ${record.experience || 'N/A'}\nAvailability: ${record.availability || 'N/A'}`;
                break;
            case 'brand_applications':
                subject = `🏷️ New Brand Application: ${record.brand_name}`;
                message = `Brand: ${record.brand_name}\nCompany: ${record.company_name || 'N/A'}\nContact: ${record.contact_person || 'N/A'}\nEmail: ${record.email || 'N/A'}\nCategories: ${(record.categories || []).join(', ')}`;
                break;
            default:
                subject = `📬 New submission in ${table}`;
                message = JSON.stringify(record, null, 2);
        }

        // Log the notification (always works as audit trail)
        console.log(`[NOTIFICATION] ${subject}\n${message}`);

        // Send email via Resend if API key is configured
        if (process.env.RESEND_API_KEY) {
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'Roof Platform <notifications@roofplatform.com>',
                    to: ADMIN_EMAILS,
                    subject,
                    text: message,
                }),
            });
        }

        return NextResponse.json({ success: true, subject });
    } catch (err) {
        console.error('Webhook handler error:', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
