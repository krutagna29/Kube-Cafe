-- Create database
CREATE DATABASE IF NOT EXISTS kube_cafe;
USE kube_cafe;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin table
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu categories table
CREATE TABLE menu_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu items table
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE SET NULL
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_address TEXT,
    phone VARCHAR(20),
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    menu_item_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE SET NULL
);

-- Insert default admin
INSERT INTO admins (username, password, email) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@kubecafe.com');

-- Insert default menu categories
INSERT INTO menu_categories (name, description) VALUES 
('Beverages', 'Hot and cold beverages'),
('Food', 'Main course dishes'),
('Desserts', 'Sweet treats and desserts'),
('Drinks', 'Refreshing drinks and mocktails');

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES 
('Espresso', 'Strong Italian coffee', 3.50, 1, '/images/espresso.jpg'),
('Cappuccino', 'Espresso with steamed milk foam', 4.50, 1, '/images/cappuccino.jpg'),
('Latte', 'Espresso with steamed milk', 4.00, 1, '/images/latte.jpg'),
('Burger', 'Classic beef burger with fries', 12.99, 2, '/images/burger.jpg'),
('Pizza Margherita', 'Traditional Italian pizza', 15.99, 2, '/images/pizza.jpg'),
('Caesar Salad', 'Fresh salad with Caesar dressing', 8.99, 2, '/images/salad.jpg'),
('Chocolate Cake', 'Rich chocolate layer cake', 6.50, 3, '/images/chocolate-cake.jpg'),
('Tiramisu', 'Italian coffee-flavored dessert', 7.50, 3, '/images/tiramisu.jpg'),
('Iced Tea', 'Refreshing iced tea', 3.00, 4, '/images/iced-tea.jpg'),
('Lemonade', 'Fresh squeezed lemonade', 3.50, 4, '/images/lemonade.jpg'); 