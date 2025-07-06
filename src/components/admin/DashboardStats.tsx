import React from 'react';
import { TrendingUp, TrendingDown, Package, MessageSquare, Users, DollarSign } from 'lucide-react';
import { dashboardService, DashboardStats as StatsType } from '../../services/dashboardService';

const DashboardStats: React.FC = () => {
  const [stats, setStats] = React.useState<StatsType | null>(null);
  const [recentActivity, setRecentActivity] = React.useState<Array<{
    id: string;
    action: string;
    user: string;
    time: string;
    type: 'message' | 'tracking' | 'user';
  }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, activityData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivity()
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = stats ? [
    {
      name: 'Total Shipments',
      value: stats.totalShipments.toString(),
      change: '+12%',
      changeType: 'increase' as const,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Messages',
      value: stats.activeMessages.toString(),
      change: '+5%',
      changeType: 'increase' as const,
      icon: MessageSquare,
      color: 'bg-green-500',
    },
    {
      name: 'Total Users',
      value: stats.totalUsers.toString(),
      change: '+8%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      name: 'In Transit',
      value: stats.inTransitShipments.toString(),
      change: '-2%',
      changeType: 'decrease' as const,
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ] : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipment Trends</h3>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Chart visualization would go here</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center">No recent activity</p>
            ) : (
              recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'message' ? 'bg-green-500' :
                  activity.type === 'tracking' ? 'bg-blue-500' : 'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">by {activity.user}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;