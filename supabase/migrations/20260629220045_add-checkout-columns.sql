-- Stock constraint
ALTER TABLE products ADD CONSTRAINT stock_non_negative CHECK (stock >= 0);

-- Webhook dedup column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_event_id TEXT UNIQUE;

-- Stripe session ID column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Allow 'pending' status
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'));
