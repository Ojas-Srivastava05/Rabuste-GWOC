"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { TrendingUp, ShoppingBag, Heart, Clock, Package } from "lucide-react";

type DashboardData = {
  stats: {
    totalOrders: number;
    totalSpent: number;
    favoriteItems: number;
    mostOrderedItem?: {
      name: string;
      count: number;
    };
  };
  recentOrders: Array<{
    _id: string;
    items: Array<{ itemId: string; quantity: number }>;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
};

export default function UserDashboard() {
  const { user } = useUser();
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
        const res = await fetch("/api/user/dashboard", {
          headers: {
            ...getAuthHeaders(),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #1A1110 0%, #0A0A0A 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="section-label">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FAF3E0] rounded-2xl p-6 shadow-2xl border border-[#B87333]/20">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF3E0] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6 sm:space-y-8 lg:space-y-10 border border-[#B87333]/20">
      {/* PAGE HEADING */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-[#B87333] to-[#CD7F32] rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2e211a]" style={{ fontFamily: 'var(--font-heading)' }}>
          My Dashboard
        </h1>
        <div className="flex-1 h-px bg-gradient-to-r from-[#B87333]/30 to-transparent" />
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-br from-[#B87333]/10 to-[#CD7F32]/10 p-6 rounded-2xl border border-[#B87333]/30">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2e211a] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Welcome back, {user?.name}!
        </h2>
        <p className="text-sm text-[#6b4a2f]">
          Here's a summary of your coffee journey with Rabuste
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Orders */}
        <div className="group bg-[#FFFDF2] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#B87333]/20 hover:border-[#B87333]/40">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#6b4a2f] uppercase tracking-wider">Total Orders</p>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center">
              <ShoppingBag size={16} style={{ color: '#FFF' }} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2e211a] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {data?.stats.totalOrders || 0}
          </h2>
          <div className="mt-3 text-xs text-[#8B6F47] opacity-70">Lifetime orders</div>
        </div>

        {/* Total Spent */}
        <div className="group bg-[#FFFDF2] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#B87333]/20 hover:border-[#B87333]/40">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#6b4a2f] uppercase tracking-wider">Total Spent</p>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5E7D4C] to-[#4A6339] flex items-center justify-center">
              <span className="text-white text-xs font-bold">₹</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2e211a] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            ₹{data?.stats.totalSpent || 0}
          </h2>
          <div className="mt-3 text-xs text-[#8B6F47] opacity-70">Lifetime spending</div>
        </div>

        {/* Favorite Items */}
        <div className="group bg-[#FFFDF2] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#B87333]/20 hover:border-[#B87333]/40">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#6b4a2f] uppercase tracking-wider">Favorites</p>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#DC2626] to-[#B91C1C] flex items-center justify-center">
              <Heart size={16} style={{ color: '#FFF' }} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2e211a] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {data?.stats.favoriteItems || 0}
          </h2>
          <div className="mt-3 text-xs text-[#8B6F47] opacity-70">Saved items</div>
        </div>

        {/* Most Ordered */}
        <div className="group bg-[#FFFDF2] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#B87333]/20 hover:border-[#B87333]/40">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#6b4a2f] uppercase tracking-wider">Top Choice</p>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center">
              <TrendingUp size={16} style={{ color: '#FFF' }} />
            </div>
          </div>
          <h2 className="text-lg font-bold text-[#2e211a] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {data?.stats.mostOrderedItem?.name || 'N/A'}
          </h2>
          <div className="mt-3 text-xs text-[#8B6F47] opacity-70">
            {data?.stats.mostOrderedItem ? `${data.stats.mostOrderedItem.count} orders` : 'No orders yet'}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-lg font-semibold text-[#2e211a] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <Clock size={20} style={{ color: '#B87333' }} />
          Recent Orders
        </h2>
        <div className="space-y-4">
          {data?.recentOrders && data.recentOrders.length > 0 ? (
            data.recentOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="bg-[#FFFDF2] p-4 rounded-xl shadow-lg border border-[#B87333]/20 hover:border-[#B87333]/40 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package size={16} style={{ color: '#B87333' }} />
                      <span className="text-sm font-semibold text-[#6b4a2f]">
                        Order #{order._id.slice(-6)}
                      </span>
                    </div>
                    <p className="text-xs text-[#8B6F47]">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#2e211a]">₹{order.totalAmount}</p>
                      <p className="text-xs text-[#8B6F47]">{order.items.length} items</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'assigned'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#FFFDF2] p-8 rounded-xl text-center border border-[#B87333]/20">
              <Package size={48} className="mx-auto mb-4" style={{ color: '#B87333', opacity: 0.5 }} />
              <p className="text-[#6b4a2f]">No orders yet</p>
              <p className="text-sm text-[#8B6F47] mt-2">Start your coffee journey today!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[#2e211a] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <a
            href="/menu"
            className="group bg-gradient-to-r from-[#3a2618] to-[#2a1a12] text-[#fffbd6] px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#B87333]/30 hover:border-[#B87333]/50 flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#B87333] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-sm font-medium">Browse Menu</span>
          </a>

          <a
            href="/user/orders"
            className="group bg-gradient-to-r from-[#3a2618] to-[#2a1a12] text-[#fffbd6] px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#B87333]/30 hover:border-[#B87333]/50 flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#B87333] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-sm font-medium">View All Orders</span>
          </a>

          <a
            href="/user/coupons"
            className="group bg-gradient-to-r from-[#3a2618] to-[#2a1a12] text-[#fffbd6] px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#B87333]/30 hover:border-[#B87333]/50 flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#B87333] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-sm font-medium">Available Coupons</span>
          </a>
        </div>
      </div>
    </div>
  );
}