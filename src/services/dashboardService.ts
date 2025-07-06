import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalShipments: number;
  activeMessages: number;
  totalUsers: number;
  deliveredShipments: number;
  inTransitShipments: number;
  pendingShipments: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      // Get total shipments
      const { count: totalShipments } = await supabase
        .from('pie_tracking')
        .select('*', { count: 'exact', head: true });

      // Get active messages (unread)
      const { count: activeMessages } = await supabase
        .from('pie_contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      // Get total users
      const { count: totalUsers } = await supabase
        .from('pie_admin_users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get delivered shipments
      const { count: deliveredShipments } = await supabase
        .from('pie_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Delivered');

      // Get in transit shipments
      const { count: inTransitShipments } = await supabase
        .from('pie_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'In Transit');

      // Get pending shipments
      const { count: pendingShipments } = await supabase
        .from('pie_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');

      return {
        totalShipments: totalShipments || 0,
        activeMessages: activeMessages || 0,
        totalUsers: totalUsers || 0,
        deliveredShipments: deliveredShipments || 0,
        inTransitShipments: inTransitShipments || 0,
        pendingShipments: pendingShipments || 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalShipments: 0,
        activeMessages: 0,
        totalUsers: 0,
        deliveredShipments: 0,
        inTransitShipments: 0,
        pendingShipments: 0,
      };
    }
  },

  async getRecentActivity(): Promise<Array<{
    id: string;
    action: string;
    user: string;
    time: string;
    type: 'message' | 'tracking' | 'user';
  }>> {
    try {
      const activities: Array<{
        id: string;
        action: string;
        user: string;
        time: string;
        type: 'message' | 'tracking' | 'user';
      }> = [];

      // Get recent messages
      const { data: messages } = await supabase
        .from('pie_contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (messages) {
        messages.forEach(message => {
          activities.push({
            id: message.id,
            action: 'New message received',
            user: message.name,
            time: new Date(message.created_at).toLocaleString(),
            type: 'message'
          });
        });
      }

      // Get recent tracking updates
      const { data: tracking } = await supabase
        .from('pie_tracking')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (tracking) {
        tracking.forEach(track => {
          activities.push({
            id: track.id,
            action: `Shipment ${track.status.toLowerCase()}`,
            user: track.customer_name,
            time: new Date(track.updated_at).toLocaleString(),
            type: 'tracking'
          });
        });
      }

      // Sort by time and return latest 10
      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }
};