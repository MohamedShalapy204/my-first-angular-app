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
  UPDATE orders
  SET status = 'paid',
      stripe_event_id = p_stripe_event_id,
      updated_at = NOW()
  WHERE stripe_session_id = p_stripe_session_id
    AND status = 'pending'
  RETURNING id INTO v_order_id;

  IF v_order_id IS NULL THEN
    RAISE EXCEPTION 'No pending order found for session %', p_stripe_session_id;
  END IF;

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

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    PERFORM decrement_stock(
      (v_item->>'product_id')::BIGINT,
      (v_item->>'quantity')::INT
    );
  END LOOP;

  DELETE FROM cart_items WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
