-- Unique partial index for pending orders
-- Prevents race condition: only one pending order per user at a time
-- Used by create-checkout-session Edge Function for idempotency
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_pending_unique
  ON orders (user_id)
  WHERE status = 'pending';
