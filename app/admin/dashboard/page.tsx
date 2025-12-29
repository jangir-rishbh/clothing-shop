import { ShoppingCart, Users, Package, DollarSign } from 'lucide-react';

export default function AdminDashboardPage() {
  // Mock data - replace with actual data fetching in a real application
  const stats = [
    { title: 'Total Sales', value: '$45,231.89', change: '+20.1% from last month', icon: <DollarSign className="h-4 w-4" /> },
    { title: 'New Customers', value: '2,345', change: '+180.1% from last month', icon: <Users className="h-4 w-4" /> },
    { title: 'Products', value: '1,234', change: '+19% from last month', icon: <Package className="h-4 w-4" /> },
    { title: 'Active Now', value: '573', change: '+201 since last hour', icon: <ShoppingCart className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Welcome back! Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl border bg-card text-card-foreground shadow dark:border-gray-800 dark:bg-gray-800/50">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <div className="h-4 w-4 text-muted-foreground">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        {/* Recent Orders */}
        <div className="rounded-xl border bg-card text-card-foreground shadow lg:col-span-4 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3, 4, 5].map((order) => (
                <div key={order} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 sm:pb-3 dark:border-gray-700 last:border-0">
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-sm sm:text-base">Order #100{order}</p>
                    <p className="text-sm text-muted-foreground">Customer {order}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm sm:text-base">${(Math.random() * 100).toFixed(2)}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">2 items</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border bg-card text-card-foreground shadow lg:col-span-3 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
            <div className="space-y-3 sm:space-y-4">
              {['T-Shirt', 'Jeans', 'Shoes', 'Hoodie', 'Hat'].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-medium">{product[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">{product}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{Math.floor(Math.random() * 100) + 1} sold</p>
                    </div>
                  </div>
                  <span className="font-medium text-sm sm:text-base">${(Math.random() * 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
