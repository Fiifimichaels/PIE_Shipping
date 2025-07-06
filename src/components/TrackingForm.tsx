import React, { useState } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { trackingService } from '../services/trackingService';
import { TrackingInfo, TrackingEvent } from '../lib/supabase';

const TrackingForm: React.FC = () => {
  const { t } = useLanguage();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<{
    tracking: TrackingInfo;
    events: TrackingEvent[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await trackingService.getTrackingInfo(trackingNumber);
      
      if (result.error) {
        setError(result.error);
        setTrackingResult(null);
      } else if (result.tracking) {
        setTrackingResult({
          tracking: result.tracking,
          events: result.events
        });
      } else {
        setError('Tracking number not found');
        setTrackingResult(null);
      }
    } catch (error) {
      console.error('Error tracking shipment:', error);
      setError('Failed to track shipment. Please try again.');
      setTrackingResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="tracking" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('trackShipment')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Enter your tracking number to get real-time updates
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleTrack} className="mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span>Track</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {trackingResult && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tracking: {trackingResult.tracking.tracking_number}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status: <span className="font-medium text-green-600">{trackingResult.tracking.status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Location</p>
                  <p className="font-medium text-gray-900 dark:text-white flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {trackingResult.tracking.current_location || 'Unknown'}
                  </p>
                </div>
              </div>

              {trackingResult.tracking.estimated_delivery && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Estimated Delivery: {new Date(trackingResult.tracking.estimated_delivery).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {trackingResult.events.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{event.event_date} {event.event_time}</span>
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium">{event.status}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{event.location}</p>
                      {event.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrackingForm;