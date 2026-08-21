import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion })
  : null;

export async function POST(request: Request) {
  try {
    const { alternative_id, name, tier, creator_email } = await request.json();

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const isPriority = tier === 'priority';
    const amount = isPriority ? 2900 : 1900; // In cents ($29 vs $19)
    const tierTitle = isPriority
      ? '🚀 Priority Fast-Track & #1 Boost Listing'
      : '⚡ Verified Creator Badge Listing';

    // If Stripe is not yet configured in .env, return direct payment link or fallback
    if (!stripe) {
      return NextResponse.json({
        success: true,
        mode: 'mock',
        checkout_url: `${baseUrl}/checkout/success?mock=true&tier=${tier}&alt_id=${alternative_id}`,
        message: 'Stripe test mode active',
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tierTitle} for "${name}"`,
              description: `Instant verified promotional listing on WhyUndefeated directory.`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: creator_email || undefined,
      client_reference_id: alternative_id,
      metadata: {
        alternative_id,
        tier,
        name,
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/submit`,
    });

    return NextResponse.json({
      success: true,
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (err: unknown) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Could not create checkout session',
      },
      { status: 500 },
    );
  }
}
