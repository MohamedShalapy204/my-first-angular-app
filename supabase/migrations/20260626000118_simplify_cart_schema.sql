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
