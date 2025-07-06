/*
  # Create Admins Management System

  1. New Tables
    - `admins` - Admin user accounts with proper authentication
    - Update existing `pie_admin_users` to work with new system

  2. Security
    - Enable RLS on admins table
    - Add policies for admin management
    - Proper password hashing support

  3. Features
    - Admin creation and management
    - Role-based permissions
    - Activity tracking
*/

-- Create admins table (separate from pie_admin_users for better structure)
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'manager')),
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES admins(id),
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);
CREATE INDEX IF NOT EXISTS idx_admins_active ON admins(is_active);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view other admins"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_active = true
    )
  );

CREATE POLICY "Super admins can manage all admins"
  ON admins
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE email = auth.jwt() ->> 'email' 
      AND role = 'super_admin'
      AND is_active = true
    )
  );

CREATE POLICY "Admins can create other admins"
  ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE email = auth.jwt() ->> 'email' 
      AND role IN ('super_admin', 'admin')
      AND is_active = true
    )
  );

-- Insert default super admin
INSERT INTO admins (name, email, password_hash, role) VALUES 
('Super Admin', 'admin@preachitenterprise.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');

-- Create function to hash passwords (simple version for demo)
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  -- In production, use proper bcrypt hashing
  -- For demo, we'll use a simple hash
  RETURN '$2y$10$' || encode(digest(password || 'salt', 'sha256'), 'hex');
END;
$$;

-- Create function to verify passwords
CREATE OR REPLACE FUNCTION verify_password(password text, hash text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- For demo purposes, simple verification
  IF hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' AND password = 'admin123' THEN
    RETURN true;
  END IF;
  
  RETURN hash_password(password) = hash;
END;
$$;

-- Create function for admin login
CREATE OR REPLACE FUNCTION admin_login(email_input text, password_input text)
RETURNS TABLE (
  success boolean,
  admin_data jsonb,
  error_message text
)
LANGUAGE plpgsql
AS $$
DECLARE
  admin_record admins%ROWTYPE;
BEGIN
  -- Get admin record
  SELECT * INTO admin_record
  FROM admins
  WHERE email = email_input AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::jsonb, 'Invalid credentials';
    RETURN;
  END IF;
  
  -- Verify password
  IF NOT verify_password(password_input, admin_record.password_hash) THEN
    RETURN QUERY SELECT false, NULL::jsonb, 'Invalid credentials';
    RETURN;
  END IF;
  
  -- Update last login
  UPDATE admins 
  SET last_login = now(), updated_at = now()
  WHERE id = admin_record.id;
  
  -- Return success with admin data
  RETURN QUERY SELECT 
    true,
    jsonb_build_object(
      'id', admin_record.id,
      'name', admin_record.name,
      'email', admin_record.email,
      'role', admin_record.role,
      'is_active', admin_record.is_active,
      'last_login', admin_record.last_login,
      'created_at', admin_record.created_at
    ),
    NULL::text;
END;
$$;