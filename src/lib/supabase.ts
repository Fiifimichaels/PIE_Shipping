import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

export interface TrackingInfo {
  id: string;
  tracking_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  origin: string;
  destination: string;
  status: string;
  current_location?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  weight?: number;
  dimensions?: string;
  service_type: 'ocean' | 'air' | 'land' | 'express';
  created_at: string;
  updated_at: string;
}

export interface TrackingEvent {
  id: string;
  tracking_id: string;
  event_date: string;
  event_time: string;
  location: string;
  status: string;
  description?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  company_name?: string;
  origin: string;
  destination: string;
  service_type: 'ocean' | 'air' | 'land' | 'express';
  cargo_type?: string;
  weight?: number;
  dimensions?: string;
  estimated_value?: number;
  quote_amount?: number;
  currency: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'expired';
  valid_until?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}