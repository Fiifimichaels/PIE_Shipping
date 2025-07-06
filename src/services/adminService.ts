import { supabase } from '../lib/supabase';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager';
  is_active: boolean;
  created_by?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export const adminService = {
  async login(email: string, password: string): Promise<{
    success: boolean;
    admin?: Admin;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.rpc('admin_login', {
        email_input: email,
        password_input: password
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data && data.length > 0) {
        const result = data[0];
        if (result.success) {
          return { success: true, admin: result.admin_data };
        } else {
          return { success: false, error: result.error_message };
        }
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  },

  async getAllAdmins(): Promise<Admin[]> {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admins:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching admins:', error);
      return [];
    }
  },

  async createAdmin(adminData: {
    name: string;
    email: string;
    password: string;
    role: 'super_admin' | 'admin' | 'manager';
  }): Promise<{ success: boolean; error?: string; admin?: Admin }> {
    try {
      // Hash password using the database function
      const { data: hashedPassword, error: hashError } = await supabase.rpc('hash_password', {
        password: adminData.password
      });

      if (hashError) {
        return { success: false, error: 'Failed to hash password' };
      }

      const { data, error } = await supabase
        .from('admins')
        .insert([{
          name: adminData.name,
          email: adminData.email,
          password_hash: hashedPassword,
          role: adminData.role
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating admin:', error);
        return { success: false, error: error.message };
      }

      return { success: true, admin: data };
    } catch (error) {
      console.error('Error creating admin:', error);
      return { success: false, error: 'Failed to create admin' };
    }
  },

  async updateAdmin(
    id: string,
    updates: Partial<Pick<Admin, 'name' | 'email' | 'role' | 'is_active'>>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('admins')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating admin:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating admin:', error);
      return { success: false, error: 'Failed to update admin' };
    }
  },

  async deleteAdmin(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting admin:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting admin:', error);
      return { success: false, error: 'Failed to delete admin' };
    }
  },

  async changePassword(
    id: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Hash password using the database function
      const { data: hashedPassword, error: hashError } = await supabase.rpc('hash_password', {
        password: newPassword
      });

      if (hashError) {
        return { success: false, error: 'Failed to hash password' };
      }

      const { error } = await supabase
        .from('admins')
        .update({ 
          password_hash: hashedPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error changing password:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      return { success: false, error: 'Failed to change password' };
    }
  }
};