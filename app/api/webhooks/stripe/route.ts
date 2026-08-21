import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseClient } from '@/lib/alternatives/client';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion })
  : null;

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let event: Stripe.Event;

    // Cryptographic signature verification if secret is configured
    if (webhookSecret && stripe) {
      const signature = request.headers.get('stripe-signature');
      if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
      }
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: unknown) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
      }
    } else {
      // Fallback for dev/testing when no webhook secret is set
      event = JSON.parse(rawBody);
    }

    // Process checkout session completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data?.object as Stripe.Checkout.Session;
      const alternativeId = session?.metadata?.alternative_id || session?.client_reference_id;
      const customerEmail = session?.customer_details?.email || session?.customer_email;
      const tier = session?.metadata?.tier || 'verified';

      const supabase = getSupabaseClient();
      if (supabase && (alternativeId || customerEmail)) {
        let query = supabase.from('community_alternatives').update({
          is_verified: true,
          verification_tier: tier,
          status: 'approved',
        });

        if (alternativeId) {
          query = query.eq('id', alternativeId);
        } else {
          query = query.eq('creator_email', customerEmail);
        }

        const { error } = await query;
        if (error) {
          console.error('Stripe webhook database update error:', error);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('Stripe webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 400 });
  }
}
