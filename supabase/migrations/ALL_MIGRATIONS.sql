-- ============================================
-- LUMINA STUDIO - ALL DATABASE MIGRATIONS
-- Combined from Supabase MCP Server
-- Generated: 2026-06-30
-- ============================================

-- ============================================
-- 1. 20260429153238_create_products_table
-- ============================================

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO products (name, description, price, image_url) VALUES
('Wireless Headphones', 'Noise-cancelling over-ear headphones', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'),
('Smartwatch Series 5', 'Fitness tracker with heart rate monitor', 299.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'),
('Bluetooth Speaker', 'Portable speaker with 20h battery life', 59.50, 'https://images.unsplash.com/photo-1608354580875-30bd4168b351'),
('Mechanical Keyboard', 'RGB backlit gaming keyboard', 120.00, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae'),
('Gaming Mouse', 'High precision ergonomic mouse', 45.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf');

-- ============================================
-- 2. 20260429155703_add_public_read_policy_to_products
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

-- ============================================
-- 3. 20260624173654_full_database_schema
-- ============================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Products (enhance existing)
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id bigint REFERENCES categories(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock int DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Reviews (ON DELETE SET NULL to preserve ratings)
CREATE TABLE IF NOT EXISTS reviews (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id bigint NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Orders (ON DELETE SET NULL to preserve financial records)
CREATE TABLE IF NOT EXISTS orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id bigint NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity int NOT NULL DEFAULT 1,
  price_at_purchase numeric NOT NULL
);

-- Cart
CREATE TABLE IF NOT EXISTS cart (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cart_id bigint NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
  product_id bigint NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity int NOT NULL DEFAULT 1,
  UNIQUE(cart_id, product_id)
);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  phone text,
  address text,
  city text,
  updated_at timestamptz DEFAULT now()
);

-- Collections (ON DELETE SET NULL to preserve user collections)
CREATE TABLE IF NOT EXISTS collections (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Collection Items
CREATE TABLE IF NOT EXISTS collection_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  collection_id bigint NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id bigint NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  UNIQUE(collection_id, product_id)
);

-- RLS: Enable on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies: categories (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON categories FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can update categories" ON categories FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can delete categories" ON categories FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies: products (public read, admin write)
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON products FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies: reviews (public read, users manage own)
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies: orders (users read own, admin reads all)
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies: order_items (users read via own orders)
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can insert own order items" ON order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- RLS Policies: cart (users manage own)
CREATE POLICY "Users can view own cart" ON cart FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own cart" ON cart FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies: cart_items (users manage via own cart)
CREATE POLICY "Users can view own cart items" ON cart_items FOR SELECT USING (EXISTS (SELECT 1 FROM cart WHERE cart.id = cart_items.cart_id AND cart.user_id = auth.uid()));
CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL USING (EXISTS (SELECT 1 FROM cart WHERE cart.id = cart_items.cart_id AND cart.user_id = auth.uid()));

-- RLS Policies: profiles (users read/update own, admin reads all)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies: collections (users manage own)
CREATE POLICY "Users can view own collections" ON collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON collections FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies: collection_items (users manage via own collection)
CREATE POLICY "Users can view own collection items" ON collection_items FOR SELECT USING (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid()));
CREATE POLICY "Users can manage own collection items" ON collection_items FOR ALL USING (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid()));

-- Trigger: Auto-update product rating on review changes
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET rating = COALESCE((
    SELECT ROUND(AVG(rating), 2) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
  ), 0) WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Trigger: Auto-create cart on user signup
CREATE OR REPLACE FUNCTION create_cart_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO cart (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_cart
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_cart_on_signup();

-- Trigger: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name) VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_on_signup();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items(collection_id);

-- ============================================
-- 4. 20260626000118_simplify_cart_schema
-- ============================================

-- Migration: Simplify cart schema to single table
-- Date: 2026-06-26
-- Description: Remove carts table, add user_id directly to cart_items

-- 1. Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS cart;

-- 2. Create simplified cart_items table
CREATE TABLE cart_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id bigint REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- 3. Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- 4. Create policies
-- Users can only see their own cart items
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own cart items
CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own cart items
CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Create index for faster queries
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- 6. Drop orphaned cart trigger from Migration 3
DROP TRIGGER IF EXISTS on_auth_user_created_cart ON auth.users;
DROP FUNCTION IF EXISTS create_cart_on_signup();

-- ============================================
-- 5. 20260629220045_add-checkout-columns
-- ============================================

-- Stock constraint
ALTER TABLE products ADD CONSTRAINT stock_non_negative CHECK (stock >= 0);

-- Webhook dedup column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_event_id TEXT UNIQUE;

-- Stripe session ID column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Allow 'pending' status
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'));

-- ============================================
-- 6. 20260629224459_add-checkout-rpc-functions
-- ============================================

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

-- ============================================
-- 7. 20260629234113_update-confirm-checkout-add-updated-at
-- ============================================

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
  SET status = 'confirmed',
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

-- ============================================
-- 8. 20260629234124_add-updated-at-to-orders
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END
$$;

-- Update existing orders to have updated_at = created_at
UPDATE orders SET updated_at = created_at WHERE updated_at IS NULL;
