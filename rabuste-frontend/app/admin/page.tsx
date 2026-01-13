"use client";

import { useEffect, useState } from "react";
import { 
  DollarSign, ShoppingBag, Users, TrendingUp, TrendingDown, 
  Clock, Package, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Calendar, BarChart3, PieChart, Activity
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface DashboardData {
  stats: {
    totalUsers: number;
    totalOrders: number;
    revenueToday: number;
    revenueYesterday?: number;
    ordersToday?: number;
    ordersYesterday?: number;
  };
  insights: {
    mostSoldItem: { name: string; count: number } | null;
    lowStockItems: Array<{ _id: string; name: string; stock: string }>;
    peakHour: string | null;
  };
  charts?: {
    revenueByDay: Array<{ date: string; revenue: number }>;
    ordersByDay: Array<{ date: string; orders: number }>;
    ordersByHour: Array<{ hour: string; orders: number }>;
    topItems: Array<{ name: string; sales: number }>;
  };
}

const COLORS = ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080'];

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: HeadersInit = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard", {
          headers: {
            ...getAuthHeaders(),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        
        // Generate chart data from existing data
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        let orders: any[] = [];
        
        try {
          const ordersRes = await fetch("/api/orders", {
            headers: { 
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (ordersRes.ok) {
            orders = await ordersRes.json();
            if (!Array.isArray(orders)) {
              orders = [];
            }
          }
        } catch (err) {
          console.error("Failed to fetch orders for charts:", err);
          orders = [];
        }

        // Generate revenue by day (last 7 days)
        const revenueByDay = generateRevenueByDay(orders);
        const ordersByDay = generateOrdersByDay(orders);
        const ordersByHour = generateOrdersByHour(orders);
        const topItems = generateTopItems(orders);

        // Calculate yesterday's data for comparison
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd.setHours(23, 59, 59, 999);
        
        const yesterdayOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= yesterday && orderDate <= yesterdayEnd;
        });
        
        const revenueYesterday = yesterdayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        setData({
          ...json,
          stats: {
            ...json.stats,
            revenueYesterday,
            ordersToday: json.stats.totalOrders,
            ordersYesterday: yesterdayOrders.length,
          },
          charts: {
            revenueByDay,
            ordersByDay,
            ordersByHour,
            topItems,
          },
        });
      } catch (err) {
        setError("Unable to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-red-600">{error || "Unable to load dashboard"}</p>
      </div>
    );
  }

  const revenueChange = data.stats.revenueYesterday 
    ? ((data.stats.revenueToday - data.stats.revenueYesterday) / data.stats.revenueYesterday * 100).toFixed(1)
    : null;
  
  const ordersChange = data.stats.ordersYesterday
    ? ((data.stats.ordersToday! - data.stats.ordersYesterday) / data.stats.ordersYesterday * 100).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          <p className="text-black mt-1">Business overview and analytics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-black">
          <Clock size={16} className="text-black" />
          <span className="text-black">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenue Today"
          value={`₹${data.stats.revenueToday.toLocaleString()}`}
          icon={DollarSign}
          change={revenueChange}
          trend={revenueChange ? (parseFloat(revenueChange) >= 0 ? "up" : "down") : undefined}
        />
        <StatCard
          title="Total Orders"
          value={data.stats.totalOrders.toLocaleString()}
          icon={ShoppingBag}
          change={ordersChange}
          trend={ordersChange ? (parseFloat(ordersChange) >= 0 ? "up" : "down") : undefined}
        />
        <StatCard
          title="Total Users"
          value={data.stats.totalUsers.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Pending Orders"
          value={data.stats.totalOrders > 0 ? "Active" : "None"}
          icon={Package}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <ChartCard title="Revenue Trend (Last 7 Days)" icon={TrendingUp}>
          {data.charts?.revenueByDay && data.charts.revenueByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.charts.revenueByDay}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#000000" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-black">
              No revenue data available
            </div>
          )}
        </ChartCard>

        {/* Orders Trend */}
        <ChartCard title="Orders Trend (Last 7 Days)" icon={BarChart3}>
          {data.charts?.ordersByDay && data.charts.ordersByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.charts.ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="orders" fill="#000000" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-black">
              No orders data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Hour */}
        <ChartCard title="Orders by Hour (Today)" icon={Activity}>
          {data.charts?.ordersByHour && data.charts.ordersByHour.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.charts.ordersByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#000000" 
                  strokeWidth={2}
                  dot={{ fill: '#000000', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-black">
              No hourly data available
            </div>
          )}
        </ChartCard>

        {/* Top Items */}
        <ChartCard title="Top Selling Items" icon={PieChart}>
          {data.charts?.topItems && data.charts.topItems.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={data.charts.topItems.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {data.charts.topItems.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-black">
              No sales data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightsCard data={data} />
        <LowStockCard items={data.insights.lowStockItems} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  change,
  trend,
}: {
  title: string;
  value: string;
  icon: any;
  change?: string | null;
  trend?: "up" | "down";
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-black rounded-lg">
          <Icon size={20} className="text-white" />
        </div>
        {change && trend && (
          <div className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{Math.abs(parseFloat(change))}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-black mb-1">{value}</h3>
      <p className="text-sm text-black">{title}</p>
    </div>
  );
}

function ChartCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-black rounded-lg">
          <Icon size={18} className="text-white" />
        </div>
        <h2 className="text-lg font-semibold text-black">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InsightsCard({ data }: { data: DashboardData }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-black rounded-lg">
          <TrendingUp size={18} className="text-white" />
        </div>
        <h2 className="text-lg font-semibold text-black">Business Insights</h2>
      </div>
      <div className="space-y-4">
        {data.insights.mostSoldItem && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-black">Most Sold Item</p>
              <p className="text-lg font-semibold text-black">{data.insights.mostSoldItem.name}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-black">{data.insights.mostSoldItem.count}</p>
              <p className="text-xs text-black">units sold</p>
            </div>
          </div>
        )}
        {data.insights.peakHour && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-black">Peak Order Time</p>
                <p className="text-lg font-semibold text-black">{data.insights.peakHour}</p>
              </div>
              <Clock size={24} className="text-black" />
          </div>
        )}
      </div>
    </div>
  );
}

function LowStockCard({ items }: { items: Array<{ _id: string; name: string; stock: string }> }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle size={18} className="text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-black">Low Stock Alert</h2>
      </div>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.slice(0, 5).map((item) => (
            <div key={item._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <p className="font-medium text-black">{item.name}</p>
              <span className="text-sm text-red-600 font-semibold">{item.stock}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-black text-center py-4">All items in stock</p>
      )}
    </div>
  );
}

// Helper functions to generate chart data
function generateRevenueByDay(orders: any[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  return last7Days.map(date => {
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === date;
    });
    const revenue = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      revenue,
    };
  });
}

function generateOrdersByDay(orders: any[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  return last7Days.map(date => {
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === date;
    });
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      orders: dayOrders.length,
    };
  });
}

function generateOrdersByHour(orders: any[]) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const today = new Date().toISOString().split('T')[0];
  
  return hours.map(hour => {
    const hourOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      const orderHour = new Date(order.createdAt).getHours();
      return orderDate === today && orderHour === hour;
    });
    return {
      hour: `${hour}:00`,
      orders: hourOrders.length,
    };
  });
}

function generateTopItems(orders: any[]) {
  const itemCount: Record<string, number> = {};
  
  orders.forEach(order => {
    order.items?.forEach((item: any) => {
      const name = item.name || 'Unknown Item';
      itemCount[name] = (itemCount[name] || 0) + (item.quantity || 1);
    });
  });

  return Object.entries(itemCount)
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);
}
