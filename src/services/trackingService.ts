import { supabase, TrackingInfo, TrackingEvent } from '../lib/supabase';

export const trackingService = {
  async getTrackingInfo(trackingNumber: string): Promise<{
    tracking: TrackingInfo | null;
    events: TrackingEvent[];
    error?: string;
  }> {
    try {
      // Get tracking information
      const { data: tracking, error: trackingError } = await supabase
        .from('pie_tracking')
        .select('*')
        .eq('tracking_number', trackingNumber)
        .single();

      if (trackingError) {
        if (trackingError.code === 'PGRST116') {
          return { tracking: null, events: [], error: 'Tracking number not found' };
        }
        console.error('Error fetching tracking info:', trackingError);
        return { tracking: null, events: [], error: trackingError.message };
      }

      // Get tracking events
      const { data: events, error: eventsError } = await supabase
        .from('pie_tracking_events')
        .select('*')
        .eq('tracking_id', tracking.id)
        .order('event_date', { ascending: false })
        .order('event_time', { ascending: false });

      if (eventsError) {
        console.error('Error fetching tracking events:', eventsError);
        return { tracking, events: [], error: eventsError.message };
      }

      return { tracking, events: events || [] };
    } catch (error) {
      console.error('Error in tracking service:', error);
      return { tracking: null, events: [], error: 'Failed to fetch tracking information' };
    }
  },

  async getAllTracking(): Promise<TrackingInfo[]> {
    try {
      const { data, error } = await supabase
        .from('pie_tracking')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all tracking:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all tracking:', error);
      return [];
    }
  },

  async createTracking(data: {
    tracking_number: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    origin: string;
    destination: string;
    status: string;
    current_location?: string;
    estimated_delivery?: string;
    service_type: 'ocean' | 'air' | 'land' | 'express';
    weight?: number;
    dimensions?: string;
  }): Promise<{ success: boolean; error?: string; tracking?: TrackingInfo }> {
    try {
      const { data: tracking, error } = await supabase
        .from('pie_tracking')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating tracking:', error);
        return { success: false, error: error.message };
      }

      return { success: true, tracking };
    } catch (error) {
      console.error('Error creating tracking:', error);
      return { success: false, error: 'Failed to create tracking' };
    }
  },

  async updateTracking(
    id: string,
    data: Partial<TrackingInfo>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('pie_tracking')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating tracking:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating tracking:', error);
      return { success: false, error: 'Failed to update tracking' };
    }
  },

  async deleteTracking(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('pie_tracking')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting tracking:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting tracking:', error);
      return { success: false, error: 'Failed to delete tracking' };
    }
  },

  async addTrackingEvent(data: {
    tracking_id: string;
    event_date: string;
    event_time: string;
    location: string;
    status: string;
    description?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('pie_tracking_events')
        .insert([data]);

      if (error) {
        console.error('Error adding tracking event:', error);
        return { success: false, error: error.message };
      }

      // Update the main tracking record with the latest status and location
      await supabase
        .from('pie_tracking')
        .update({
          status: data.status,
          current_location: data.location,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.tracking_id);

      return { success: true };
    } catch (error) {
      console.error('Error adding tracking event:', error);
      return { success: false, error: 'Failed to add tracking event' };
    }
  }
};