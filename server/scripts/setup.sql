-- Create database
CREATE DATABASE IF NOT EXISTS diet_food_app;
USE diet_food_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  role VARCHAR(20) DEFAULT 'user'
);

-- User info table
CREATE TABLE IF NOT EXISTS user_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  name VARCHAR(255),
  age INT,
  gender VARCHAR(10),
  weight FLOAT,
  height FLOAT,
  activity_level VARCHAR(50),
  health_goal VARCHAR(50),
  dietary_preference VARCHAR(50),
  allergies TEXT,
  food_intake VARCHAR(50),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(1000),
  health_goal ENUM('weightLoss', 'weightGain', 'muscleGain', 'maintenance') DEFAULT 'maintenance',
  dietary_preference ENUM('vegan', 'vegetarian', 'nonVegetarian', 'keto', 'standard') DEFAULT 'standard',
  calories INT DEFAULT 0,
  protein INT DEFAULT 0,
  carbs INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_price DECIMAL(10,2),
  status ENUM('pending', 'paid', 'processing', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  delivery_partner VARCHAR(20),
  tracking_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  subtotal DECIMAL(10,2),
  instructions TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  user_id INT,
  user_name VARCHAR(255),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample products if empty
INSERT INTO products (name, description, price, image, health_goal, dietary_preference, calories, protein, carbs)
SELECT * FROM (
  SELECT 'Grilled Chicken Salad', 'Healthy grilled chicken with fresh veggies', 499.00, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 'weightLoss', 'nonVegetarian', 350, 45, 10
  UNION ALL
  SELECT 'Quinoa Veggie Bowl', 'Nutritious quinoa with mixed vegetables', 399.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 'weightLoss', 'vegan', 280, 12, 45
  UNION ALL
  SELECT 'Avocado Toast & Eggs', 'Whole grain toast with avocado and eggs', 299.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8', 'muscleGain', 'nonVegetarian', 420, 18, 25
  UNION ALL
  SELECT 'Berry Protein Smoothie', 'Smoothie with berries and protein powder', 199.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888', 'muscleGain', 'vegan', 250, 25, 30
  UNION ALL
  SELECT 'Tofu Stir Fry', 'Stir fried tofu with vegetables', 349.00, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 'weightGain', 'vegan', 380, 20, 40
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

-- Insert admin user if not exists
INSERT INTO users (name, email, password, role)
SELECT 'Admin', 'admin@diet.com', 'admin123', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@diet.com');