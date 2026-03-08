import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// STRIPE WEBHOOK — Handle subscription events
// Verifies payment → updates user tier
// ============================================================

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const sig = req.headers.get('stripe-signature');

        const stripeKey = process.env.STRIPE_SECRET_KEY;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!stripeKey || !webhookSecret) {
            return NextResponse.json({ received: true, demo: true });
        }

        const stripe = require('stripe')(stripeKey);
        const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const tier = session.metadata?.tier;
                const customerEmail = session.customer_details?.email;
                console.log(`✅ Subscription activated: ${customerEmail} → ${tier}`);
                // TODO: Update user record in database
                // TODO: Send welcome email with onboarding guide
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                console.log(`🔄 Subscription updated: ${subscription.id} → ${subscription.status}`);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                console.log(`❌ Subscription cancelled: ${subscription.id}`);
                // TODO: Downgrade user to free tier
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                console.log(`⚠️ Payment failed: ${invoice.customer_email}`);
                // TODO: Send payment retry notification
                break;
            }

            default:
                console.log(`Unhandled event: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Webhook error:', message);
        return NextResponse.json(
            { error: 'Webhook verification failed' },
            { status: 400 }
        );
    }
}
