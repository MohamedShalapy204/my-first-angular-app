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
