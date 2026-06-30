-- Atomic stock decrement
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id BIGINT, p_quantity INT)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET stock = stock - p_quantity WHERE id = p_product_id AND stock >= p_quantity;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', p_product_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Full checkout transaction: update order, insert items, decrement stock, clear cart
CREATE OR REPLACE FUNCTION confirm_checkout(
  p_stripe_session_id TEXT,
  p_stripe_event_id TEXT,
  p_user_id UUID,
  p_items JSONB
)
RETURNS VOID AS $$
DECLARE
  v_order_id BIGINT;
  v_item JSONB;
BEGIN
  -- 1. Update existing pending order to confirmed
  UPDATE orders
  SET status = 'confirmed',
      stripe_event_id = p_stripe_event_id
  WHERE stripe_session_id = p_stripe_session_id
    AND status = 'pending'
  RETURNING id INTO v_order_id;

  IF v_order_id IS NULL THEN
    RAISE EXCEPTION 'No pending order found for session %', p_stripe_session_id;
  END IF;

  -- 2. Insert order items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
    VALUES (
      v_order_id,
      (v_item->>'product_id')::BIGINT,
      (v_item->>'quantity')::INT,
      (v_item->>'price')::NUMERIC
    );
  END LOOP;

  -- 3. Decrement stock atomically
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    PERFORM decrement_stock(
      (v_item->>'product_id')::BIGINT,
      (v_item->>'quantity')::INT
    );
  END LOOP;

  -- 4. Clear cart
  DELETE FROM cart_items WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
