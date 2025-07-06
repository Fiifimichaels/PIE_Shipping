/*
  # Preach It Enterprise Database Schema

  1. New Tables
    - `pie_contact_messages` - Contact form submissions with status tracking
    - `pie_tracking` - Shipment tracking information
    - `pie_tracking_events` - Detailed tracking history events
    - `pie_admin_users` - Admin user accounts with role-based access
    - `pie_settings` - System configuration settings
    - `pie_quotes` - Service quote requests and management

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admins
    - Proper foreign key constraints

  3. Sample Data
    - Default admin user
    - Sample tracking data
    - Sample contact messages
    - Default system settings
*/

-- Create custom types
CREATE TYPE contact_status AS ENUM ('unread', 'read', 'replied');
CREATE TYPE service_type AS ENUM ('ocean', 'air', 'land', 'express');
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'operator');
CREATE TYPE setting_type AS ENUM ('string', 'number', 'boolean', 'json');
CREATE TYPE quote_status AS ENUM ('pending', 'quoted', 'accepted', 'rejected', 'expired');

-- 1. Contact Messages Table
CREATE TABLE IF NOT EXISTS pie_contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status contact_status DEFAULT 'unread',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Tracking Information Table
CREATE TABLE IF NOT EXISTS pie_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  origin text NOT NULL,
  destination text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  current_location text,
  estimated_delivery date,
  actual_delivery date,
  weight decimal(10,2),
  dimensions text,
  service_type service_type DEFAULT 'ocean',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Tracking Events Table
CREATE TABLE IF NOT EXISTS pie_tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id uuid NOT NULL REFERENCES pie_tracking(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  event_time time NOT NULL,
  location text NOT NULL,
  status text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- 4. Admin Users Table
CREATE TABLE IF NOT EXISTS pie_admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role user_role DEFAULT 'operator',
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. System Settings Table
CREATE TABLE IF NOT EXISTS pie_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text,
  setting_type setting_type DEFAULT 'string',
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. Service Quotes Table
CREATE TABLE IF NOT EXISTS pie_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  company_name text,
  origin text NOT NULL,
  destination text NOT NULL,
  service_type service_type NOT NULL,
  cargo_type text,
  weight decimal(10,2),
  dimensions text,
  estimated_value decimal(12,2),
  quote_amount decimal(12,2),
  currency text DEFAULT 'USD',
  status quote_status DEFAULT 'pending',
  valid_until date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON pie_contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON pie_contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_tracking_number ON pie_tracking(tracking_number);
CREATE INDEX IF NOT EXISTS idx_tracking_status ON pie_tracking(status);
CREATE INDEX IF NOT EXISTS idx_tracking_customer_email ON pie_tracking(customer_email);
CREATE INDEX IF NOT EXISTS idx_tracking_events_tracking_id ON pie_tracking_events(tracking_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_date ON pie_tracking_events(event_date);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON pie_admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON pie_admin_users(role);
CREATE INDEX IF NOT EXISTS idx_settings_key ON pie_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_quotes_number ON pie_quotes(quote_number);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_email ON pie_quotes(customer_email);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON pie_quotes(status);

-- Enable Row Level Security
ALTER TABLE pie_contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pie_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE pie_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pie_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pie_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pie_quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Contact Messages
CREATE POLICY "Admins can manage all contact messages"
  ON pie_contact_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pie_admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_active = true
    )
  );

CREATE POLICY "Anyone can insert contact messages"
  ON pie_contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for Tracking
CREATE POLICY "Anyone can view tracking info"
  ON pie_tracking
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage tracking"
  ON pie_tracking
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pie_admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_active = true
    )
  );

-- RLS Policies for Tracking Events
CREATE POLICY "Anyone can view tracking events"
  ON pie_tracking_events
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage tracking events"
  ON pie_tracking_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pie_admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_active = true
    )
  );

-- RLS Policies for Admin Users
CREATE POLICY "Admins can view admin users"
  ON pie_admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pie_admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can manage admin users"
  ON pie_admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pie_admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND role = 'admin'
      AND is_active = true
    )
  );

-- RLS Policies for Settings
CREATE POLICY "Anyone can view settings"
  ON pie_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON pie_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pie_admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_active = true
    )
  );

-- RLS Policies for Quotes
CREATE POLICY "Anyone can insert quotes"
  ON pie_quotes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage quotes"
  ON pie_quotes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pie_admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_active = true
    )
  );

-- Insert default admin user (password: admin123 - hashed with bcrypt)
INSERT INTO pie_admin_users (name, email, password, role) VALUES 
('Admin User', 'admin@preachitenterprise.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample tracking data
INSERT INTO pie_tracking (tracking_number, customer_name, customer_email, origin, destination, status, current_location, estimated_delivery, service_type) VALUES 
('PIE123456789', 'John Doe', 'john@example.com', 'New York, USA', 'Shanghai, China', 'In Transit', 'Singapore Port', '2024-01-20', 'ocean'),
('PIE987654321', 'Jane Smith', 'jane@company.com', 'Los Angeles, USA', 'Tokyo, Japan', 'Delivered', 'Tokyo Port', '2024-01-15', 'ocean'),
('PIE456789123', 'Mike Johnson', 'mike@business.com', 'Chicago, USA', 'London, UK', 'In Transit', 'Atlantic Ocean', '2024-01-18', 'air');

-- Get tracking IDs for events (using a more complex approach since we can't use AUTO_INCREMENT)
DO $$
DECLARE
    tracking_id_1 uuid;
    tracking_id_2 uuid;
    tracking_id_3 uuid;
BEGIN
    SELECT id INTO tracking_id_1 FROM pie_tracking WHERE tracking_number = 'PIE123456789';
    SELECT id INTO tracking_id_2 FROM pie_tracking WHERE tracking_number = 'PIE987654321';
    SELECT id INTO tracking_id_3 FROM pie_tracking WHERE tracking_number = 'PIE456789123';

    -- Insert sample tracking events
    INSERT INTO pie_tracking_events (tracking_id, event_date, event_time, location, status, description) VALUES 
    (tracking_id_1, '2024-01-10', '14:30:00', 'New York Port', 'Picked up', 'Package collected from origin'),
    (tracking_id_1, '2024-01-12', '09:15:00', 'Transit Hub', 'In transit', 'Package in transit to destination'),
    (tracking_id_1, '2024-01-13', '16:20:00', 'Singapore Port', 'Arrived at port', 'Package arrived at intermediate port'),
    (tracking_id_2, '2024-01-08', '10:00:00', 'Los Angeles Port', 'Picked up', 'Package collected from origin'),
    (tracking_id_2, '2024-01-12', '14:30:00', 'Pacific Ocean', 'In transit', 'Package crossing Pacific Ocean'),
    (tracking_id_2, '2024-01-15', '11:45:00', 'Tokyo Port', 'Delivered', 'Package successfully delivered');
END $$;

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
('quote_validity_days', '30', 'string', 'Default quote validity in days'),
('enable_notifications', 'true', 'string', 'Enable email notifications'),
('tracking_update_interval', '6', 'string', 'Tracking update interval in hours');

-- Create views for easier data access
CREATE OR REPLACE VIEW pie_active_shipments AS
SELECT 
  t.*,
  COUNT(e.id) as event_count,
  MAX(e.created_at) as last_update
FROM pie_tracking t
LEFT JOIN pie_tracking_events e ON t.id = e.tracking_id
WHERE t.status NOT IN ('Delivered', 'Cancelled')
GROUP BY t.id, t.tracking_number, t.customer_name, t.customer_email, t.customer_phone, 
         t.origin, t.destination, t.status, t.current_location, t.estimated_delivery, 
         t.actual_delivery, t.weight, t.dimensions, t.service_type, t.created_at, t.updated_at;

CREATE OR REPLACE VIEW pie_recent_messages AS
SELECT 
  *,
  EXTRACT(DAY FROM (NOW() - created_at)) as days_old
FROM pie_contact_messages
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_tracking_info(tracking_num text)
RETURNS TABLE (
  tracking_data jsonb,
  events jsonb
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_jsonb(t.*) as tracking_data,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'event_date', e.event_date,
          'event_time', e.event_time,
          'location', e.location,
          'status', e.status,
          'description', e.description,
          'created_at', e.created_at
        ) ORDER BY e.event_date DESC, e.event_time DESC
      ) FILTER (WHERE e.id IS NOT NULL),
      '[]'::jsonb
    ) as events
  FROM pie_tracking t
  LEFT JOIN pie_tracking_events e ON t.id = e.tracking_id
  WHERE t.tracking_number = tracking_num
  GROUP BY t.id;
END;
$$;

CREATE OR REPLACE FUNCTION add_tracking_event(
  p_tracking_number text,
  p_location text,
  p_status text,
  p_description text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  tracking_id_var uuid;
BEGIN
  -- Get tracking ID
  SELECT id INTO tracking_id_var 
  FROM pie_tracking 
  WHERE tracking_number = p_tracking_number;
  
  IF tracking_id_var IS NULL THEN
    RETURN false;
  END IF;
  
  -- Insert tracking event
  INSERT INTO pie_tracking_events (tracking_id, event_date, event_time, location, status, description)
  VALUES (tracking_id_var, CURRENT_DATE, CURRENT_TIME, p_location, p_status, p_description);
  
  -- Update tracking status and location
  UPDATE pie_tracking 
  SET current_location = p_location, 
      status = p_status, 
      updated_at = NOW()
  WHERE id = tracking_id_var;
  
  RETURN true;
END;
$$;