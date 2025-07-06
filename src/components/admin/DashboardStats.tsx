import React from 'react';
import { TrendingUp, TrendingDown, Package, MessageSquare, Users, DollarSign } from 'lucide-react';

const DashboardStats: React.FC = () => {
  const stats = [
    {
      name: 'Total Shipments',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Messages',
      value: '23',
      change: '+5%',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'bg-green-500',
    },
    {
      name: 'Total Users',
      value: '1,429',
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      name: 'Revenue',
      value: '$89,247',
      change: '-2%',
      changeType: 'decrease',
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ];

  const recentActivity = [
    { id: 1, action: 'New shipment created', user: 'John Doe', time: '2 minutes ago' },
    { id: 2, action: 'Message received', user: 'Jane Smith', time: '5 minutes ago' },
    { id: 3, action: 'Shipment delivered', user: 'Mike Johnson', time: '10 minutes ago' },
    { id: 4, action: 'New user registered', user: 'Sarah Wilson', time: '15 minutes ago' },
    { id: 5, action: 'Payment processed', user: 'David Brown', time: '20 minutes ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
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
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">by {activity.user}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;