-- Preach It Enterprise Database Creation Script
-- Run this in phpMyAdmin to create the complete database

-- Create the database
CREATE DATABASE IF NOT EXISTS pie_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE pie_db;

-- 1. Contact Messages Table
CREATE TABLE pie_contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- 2. Tracking Information Table
CREATE TABLE pie_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  current_location VARCHAR(255),
  estimated_delivery DATE,
  actual_delivery DATE NULL,
  weight DECIMAL(10,2),
  dimensions VARCHAR(100),
  service_type ENUM('ocean', 'air', 'land', 'express') DEFAULT 'ocean',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tracking_number (tracking_number),
  INDEX idx_status (status),
  INDEX idx_customer_email (customer_email)
);

-- 3. Tracking Events Table
CREATE TABLE pie_tracking_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_id INT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tracking_id) REFERENCES pie_tracking(id) ON DELETE CASCADE,
  INDEX idx_tracking_id (tracking_id),
  INDEX idx_event_date (event_date)
);

-- 4. Admin Users Table
CREATE TABLE pie_admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'operator') DEFAULT 'operator',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- 5. System Settings Table
CREATE TABLE pie_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_setting_key (setting_key)
);

-- 6. Service Quotes Table
CREATE TABLE pie_quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  company_name VARCHAR(255),
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  service_type ENUM('ocean', 'air', 'land', 'express') NOT NULL,
  cargo_type VARCHAR(100),
  weight DECIMAL(10,2),
  dimensions VARCHAR(100),
  estimated_value DECIMAL(12,2),
  quote_amount DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'quoted', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
  valid_until DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_quote_number (quote_number),
  INDEX idx_customer_email (customer_email),
  INDEX idx_status (status)
);

-- Insert default admin user (password: admin123 - should be hashed in production)
INSERT INTO pie_admin_users (name, email, password, role) VALUES 
('Admin User', 'admin@preachitenterprise.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample tracking data
INSERT INTO pie_tracking (tracking_number, customer_name, customer_email, origin, destination, status, current_location, estimated_delivery, service_type) VALUES 
('PIE123456789', 'John Doe', 'john@example.com', 'New York, USA', 'Shanghai, China', 'In Transit', 'Singapore Port', '2024-01-20', 'ocean'),
('PIE987654321', 'Jane Smith', 'jane@company.com', 'Los Angeles, USA', 'Tokyo, Japan', 'Delivered', 'Tokyo Port', '2024-01-15', 'ocean'),
('PIE456789123', 'Mike Johnson', 'mike@business.com', 'Chicago, USA', 'London, UK', 'In Transit', 'Atlantic Ocean', '2024-01-18', 'air');

-- Insert sample tracking events
INSERT INTO pie_tracking_events (tracking_id, event_date, event_time, location, status, description) VALUES 
(1, '2024-01-10', '14:30:00', 'New York Port', 'Picked up', 'Package collected from origin'),
(1, '2024-01-12', '09:15:00', 'Transit Hub', 'In transit', 'Package in transit to destination'),
(1, '2024-01-13', '16:20:00', 'Singapore Port', 'Arrived at port', 'Package arrived at intermediate port'),
(2, '2024-01-08', '10:00:00', 'Los Angeles Port', 'Picked up', 'Package collected from origin'),
(2, '2024-01-12', '14:30:00', 'Pacific Ocean', 'In transit', 'Package crossing Pacific Ocean'),
(2, '2024-01-15', '11:45:00', 'Tokyo Port', 'Delivered', 'Package successfully delivered');

-- Insert sample contact messages
INSERT INTO pie_contact_messages (name, email, phone, message, status) VALUES 
('John Doe', 'john@example.com', '+1 (555) 123-4567', 'I need a quote for shipping 50 containers from New York to Shanghai.', 'unread'),
('Jane Smith', 'jane@company.com', '+1 (555) 987-6543', 'Can you provide information about your air freight services to Europe?', 'read'),
('Mike Johnson', 'mike@business.com', '+1 (555) 456-7890', 'I have a time-sensitive shipment that needs to reach Tokyo by Friday.', 'replied');

-- Insert default system settings
INSERT INTO pie_settings (setting_key, setting_value, setting_type, description) VALUES 
('company_name', 'Preach It Enterprise', 'string', 'Company name'),
('company_email', 'info@preachitenterprise.com', 'string', 'Main company email'),
('company_phone', '+1 (555) 123-4567', 'string', 'Main company phone'),
('company_address', '123 Harbor Street, Shipping District, NY 10001', 'string', 'Company address'),
('default_currency', 'USD', 'string', 'Default currency for quotes'),
('quote_validity_days', '30', 'number', 'Default quote validity in days'),
('enable_notifications', 'true', 'boolean', 'Enable email notifications'),
('tracking_update_interval', '6', 'number', 'Tracking update interval in hours');

-- Create views for easier data access
CREATE VIEW pie_active_shipments AS
SELECT 
  t.*,
  COUNT(e.id) as event_count,
  MAX(e.created_at) as last_update
FROM pie_tracking t
LEFT JOIN pie_tracking_events e ON t.id = e.tracking_id
WHERE t.status NOT IN ('Delivered', 'Cancelled')
GROUP BY t.id;

CREATE VIEW pie_recent_messages AS
SELECT 
  *,
  DATEDIFF(NOW(), created_at) as days_old
FROM pie_contact_messages
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY created_at DESC;

-- Create stored procedures for common operations
DELIMITER //

CREATE PROCEDURE GetTrackingInfo(IN tracking_num VARCHAR(50))
BEGIN
  SELECT 
    t.*,
    e.event_date,
    e.event_time,
    e.location as event_location,
    e.status as event_status,
    e.description as event_description
  FROM pie_tracking t
  LEFT JOIN pie_tracking_events e ON t.id = e.tracking_id
  WHERE t.tracking_number = tracking_num
  ORDER BY e.event_date DESC, e.event_time DESC;
END //

CREATE PROCEDURE AddTrackingEvent(
  IN p_tracking_id INT,
  IN p_location VARCHAR(255),
  IN p_status VARCHAR(255),
  IN p_description TEXT
)
BEGIN
  INSERT INTO pie_tracking_events (tracking_id, event_date, event_time, location, status, description)
  VALUES (p_tracking_id, CURDATE(), CURTIME(), p_location, p_status, p_description);
  
  UPDATE pie_tracking 
  SET current_location = p_location, status = p_status, updated_at = NOW()
  WHERE id = p_tracking_id;
END //

DELIMITER ;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON pie_db.* TO 'pie_user'@'localhost' IDENTIFIED BY 'your_password';
-- FLUSH PRIVILEGES;

-- Display success message
SELECT 'Database pie_db created successfully with all tables, sample data, views, and procedures!' as Status;