'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye,
  Star,
  Clock,
  BarChart3,
  PieChart,
  MoreVertical
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [animatedStats, setAnimatedStats] = useState(false);

  useEffect(() => {
    setAnimatedStats(true);
  }, []);

  // Enhanced mock data with more realistic values
  const stats = [
    { 
      title: 'Total Revenue', 
      value: '₹1,04,563', 
      change: '+12.5%', 
      trend: 'up',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      title: 'Active Users', 
      value: '8,549', 
      change: '+23.1%', 
      trend: 'up',
      icon: <Users className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      title: 'Total Orders', 
      value: '3,247', 
      change: '+8.2%', 
      trend: 'up',
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      title: 'Conversion Rate', 
      value: '3.24%', 
      change: '-2.4%', 
      trend: 'down',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const recentOrders = [
    { id: '#10234', customer: 'Sarah Johnson', amount: '₹7,499', status: 'completed', items: 3, time: '2 min ago' },
    { id: '#10233', customer: 'Mike Chen', amount: '₹13,000', status: 'processing', items: 5, time: '5 min ago' },
    { id: '#10232', customer: 'Emma Davis', amount: '₹3,799', status: 'pending', items: 2, time: '12 min ago' },
    { id: '#10231', customer: 'Alex Wilson', amount: '₹19,499', status: 'completed', items: 8, time: '18 min ago' },
    { id: '#10230', customer: 'Lisa Brown', amount: '₹5,599', status: 'processing', items: 4, time: '25 min ago' }
  ];

  const topProducts = [
    { name: 'Premium T-Shirt', sales: 234, revenue: '₹3,90,000', trend: '+12%', rating: 4.8 },
    { name: 'Slim Fit Jeans', sales: 189, revenue: '₹6,30,000', trend: '+8%', rating: 4.6 },
    { name: 'Running Shoes', sales: 156, revenue: '₹7,80,000', trend: '+15%', rating: 4.9 },
    { name: 'Hoodie Jacket', sales: 143, revenue: '₹4,76,000', trend: '-3%', rating: 4.7 },
    { name: 'Summer Dress', sales: 128, revenue: '₹3,20,000', trend: '+5%', rating: 4.5 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your store today. 🎉
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            <Activity className="h-4 w-4 mr-2" />
            View Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`
              relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 
              bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-2xl 
              transform hover:-translate-y-1 transition-all duration-300
              ${animatedStats ? 'animate-fade-in-up' : 'opacity-0'}
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-5 dark:opacity-10"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`flex items-center text-sm font-medium ${stat.textColor}`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables Section */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recentOrders.map((order, index) => (
              <div 
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{order.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{order.amount}</p>
                    <p className="text-xs text-gray-500">{order.items} items • {order.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top Products</h2>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <PieChart className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {topProducts.map((product, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{product.sales} sold</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{product.revenue}</p>
                  <p className={`text-xs font-medium ${
                    product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Need Quick Insights?</h2>
            <p className="text-blue-100">Get detailed analytics and reports about your business performance.</p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <button className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors">
              <Eye className="h-4 w-4 mr-2" />
              Preview Report
            </button>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-medium">
              <BarChart3 className="h-4 w-4 mr-2" />
              Full Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
