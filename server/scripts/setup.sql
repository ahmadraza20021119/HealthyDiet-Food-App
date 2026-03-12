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
  address TEXT
);

-- User info table
CREATE TABLE IF NOT EXISTS user_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  age INT,
  gender VARCHAR(10),
  weight FLOAT,
  height FLOAT,
  activity_level VARCHAR(50),
  health_goal VARCHAR(50),
  dietary_preference VARCHAR(50),
  allergies TEXT,
  food_intake VARCHAR(50)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  image VARCHAR(255),
  health_goal VARCHAR(50),
  dietary_preference VARCHAR(50)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_price DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  subtotal DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample products
INSERT INTO products (name, description, price, image, health_goal, dietary_preference) VALUES
('Grilled Chicken Salad', 'Healthy grilled chicken with fresh veggies', 9.99, '/images/chicken-salad.jpg', 'weightLoss', 'nonVegetarian'),
('Quinoa Veggie Bowl', 'Nutritious quinoa with mixed vegetables', 8.49, '/images/quinoa-bowl.jpg', 'weightLoss', 'vegan'),
('Avocado Toast & Eggs', 'Whole grain toast with avocado and eggs', 7.99, '/images/avocado-toast.jpg', 'muscleGain', 'nonVegetarian'),
('Berry Protein Smoothie', 'Smoothie with berries and protein powder', 5.99, '/images/berry-smoothie.jpg', 'muscleGain', 'vegan'),
('Tofu Stir Fry', 'Stir fried tofu with vegetables', 8.99, '/images/tofu-stir-fry.jpg', 'weightGain', 'vegan');

-- Insert a test user
INSERT INTO users (name, email, password, phone, address) VALUES
('Test User', 'test@example.com', 'password', '1234567890', 'Test Address');