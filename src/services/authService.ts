import { supabase, AdminUser } from '../lib/supabase';

export const authService = {
  async login(email: string, password: string): Promise<{
    success: boolean;
    user?: AdminUser;
    error?: string;
  }> {
    try {
      // For demo purposes, we'll use a simple check
      // In production, you should use proper password hashing
      const { data: users, error } = await supabase
        .from('pie_admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true);

      if (error) {
        console.error('Error during login:', error);
        return { success: false, error: error.message };
      }

      if (!users || users.length === 0) {
        return { success: false, error: 'Invalid credentials' };
      }

      const user = users[0];

      // Simple password check for demo (use proper hashing in production)
      if (email === 'admin@preachitenterprise.com' && password === 'admin123') {
        // Update last login
        await supabase
          .from('pie_admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);

        return { success: true, user };
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'Login failed' };
    }
  },

  async getUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('pie_admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
};