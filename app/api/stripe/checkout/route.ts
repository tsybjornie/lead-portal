import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// STRIPE CHECKOUT API ROUTE
// Creates a Stripe Checkout Session for subscription
// ============================================================

export async function POST(req: NextRequest) {
    try {
        const { priceId, tier } = await req.json();

        // Check for Stripe secret key
        const stripeKey = process.env.STRIPE_SECRET_KEY;

        if (!stripeKey || stripeKey === 'sk_test_placeholder') {
            // Demo mode — no real Stripe key configured
            // Return a success response that the client can use to set demo tier
            return NextResponse.json({
                demo: true,
                tier,
                message: 'Stripe not configured. Demo mode activated.',
                // In production, this would be a Stripe Checkout URL
                url: null,
            });
        }

        // Production: Create Stripe Checkout Session
        const stripe = require('stripe')(stripeKey);

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://roof-builder.vercel.app'}/sequence?subscription=success&tier=${tier}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://roof-builder.vercel.app'}/sequence?subscription=cancelled`,
            metadata: {
                tier,
                platform: 'roof',
            },
            // Allow promotion codes
            allow_promotion_codes: true,
            // Collect billing address
            billing_address_collection: 'required',
            // Custom fields
            custom_text: {
                submit: {
                    message: `Unlock the world's most comprehensive material encyclopedia. Your subscription starts immediately.`,
                },
            },
        });

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Stripe checkout error:', message);
        return NextResponse.json(
            { error: 'Failed to create checkout session', details: message },
            { status: 500 }
        );
    }
}
