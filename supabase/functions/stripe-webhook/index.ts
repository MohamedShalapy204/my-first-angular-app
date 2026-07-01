import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (event.type !== 'checkout.session.completed') {
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Dedup check
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_event_id', event.id)
      .single();

    if (existingOrder) {
      return new Response(JSON.stringify({ received: true, message: 'Event already processed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let items: Array<{ product_id: number; quantity: number; price: number }>;
    try {
      items = JSON.parse(session.metadata?.items || '[]');
    } catch {
      throw new Error('Invalid items metadata in session');
    }

    const userId = session.client_reference_id;

    if (!userId || !items.length) {
      throw new Error('Missing user_id or items in session metadata');
    }

    // Execute entire checkout atomically via RPC
    // - Updates existing pending order (no duplicate)
    // - Inserts order items
    // - Decrements stock atomically (no race condition)
    // - Clears cart
    const { error: rpcError } = await supabase.rpc('confirm_checkout', {
      p_stripe_session_id: session.id,
      p_stripe_event_id: event.id,
      p_user_id: userId,
      p_items: items,
    });

    if (rpcError) {
      console.error('Checkout transaction failed:', rpcError);
      // Return 200 to prevent Stripe retries on application errors
      // The error is logged, and order remains in 'pending' state for manual review
      return new Response(JSON.stringify({ received: true, error: 'Transaction failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
