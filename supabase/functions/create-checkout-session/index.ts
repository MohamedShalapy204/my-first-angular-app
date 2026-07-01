import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('No items provided');
    }

    // Validate stock and get trusted prices from database (single query)
    const productIds = items.map((item) => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, stock, price')
      .in('id', productIds);

    if (productsError || !products || products.length !== productIds.length) {
      throw new Error('One or more products not found');
    }

    // Build product lookup map for O(1) access
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate stock and build validated items
    const validatedItems = [];
    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product) {
        throw new Error(`Product ${item.product_id} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.product_id}`);
      }
      validatedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Calculate total from trusted database prices
    const total = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Check for existing pending order (idempotency)
    // The unique index on (user_id) WHERE status='pending' prevents race conditions
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id, stripe_session_id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    // If existing pending order with Stripe session, return its URL
    if (existingOrder?.stripe_session_id) {
      const session = await stripe.checkout.sessions.retrieve(existingOrder.stripe_session_id);
      if (session.url) {
        return new Response(JSON.stringify({ url: session.url }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Create pending order FIRST (before Stripe session)
    // This ensures we have an order to update when webhook fires
    const orderId = existingOrder?.id;
    if (!orderId) {
      const { error: orderError } = await supabase.from('orders').insert({
        user_id: user.id,
        total: total,
        status: 'pending',
      });

      if (orderError) {
        // Unique constraint violation means another request is creating order
        // Retry to get the existing pending order
        const { data: retryOrder } = await supabase
          .from('orders')
          .select('id, stripe_session_id')
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .single();

        if (retryOrder?.stripe_session_id) {
          const session = await stripe.checkout.sessions.retrieve(retryOrder.stripe_session_id);
          if (session.url) {
            return new Response(JSON.stringify({ url: session.url }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
        throw new Error('Failed to create order');
      }
    }

    // Get the pending order ID
    const { data: pendingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (!pendingOrder) {
      throw new Error('Failed to create order');
    }

    // Create Stripe Checkout Session with order ID in metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: validatedItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Product #${item.product_id}`,
            metadata: {
              product_id: item.product_id,
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        user_id: user.id,
        order_id: pendingOrder.id,
        items: JSON.stringify(validatedItems),
      },
      success_url: `${req.headers.get('origin') || 'http://localhost:4200'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin') || 'http://localhost:4200'}/checkout/cancel`,
    });

    // Update pending order with Stripe session ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', pendingOrder.id);

    if (updateError) {
      console.error('Failed to update order with session ID:', updateError);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    // Return generic error to client (don't leak internals)
    return new Response(JSON.stringify({ error: 'Checkout failed. Please try again.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
