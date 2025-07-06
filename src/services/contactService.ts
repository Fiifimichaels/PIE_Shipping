import { supabase, ContactMessage } from '../lib/supabase';

export const contactService = {
  async submitMessage(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('pie_contact_messages')
        .insert([data]);

      if (error) {
        console.error('Error submitting message:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error submitting message:', error);
      return { success: false, error: 'Failed to submit message' };
    }
  },

  async getMessages(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('pie_contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  async updateMessageStatus(
    id: string, 
    status: 'unread' | 'read' | 'replied'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('pie_contact_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating message status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating message status:', error);
      return { success: false, error: 'Failed to update message status' };
    }
  },

  async deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('pie_contact_messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting message:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { success: false, error: 'Failed to delete message' };
    }
  }
};