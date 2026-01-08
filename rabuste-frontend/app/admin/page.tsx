"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
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
        setData(json);
      } catch (err) {
        setError("Unable to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="p-6 text-[#2e211a]">Loading dashboard…</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="bg-[#FAF3E0] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6 sm:space-y-8 lg:space-y-10 border border-[#B87333]/20">

      {/* PAGE HEADING */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-[#B87333] to-[#CD7F32] rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2e211a]" style={{ fontFamily: 'var(--font-heading)' }}>
          Admin Dashboard
        </h1>
        <div className="flex-1 h-px bg-gradient-to-r from-[#B87333]/30 to-transparent" />
      </div>

      {/* ===================== */}
      {/* STAT CARDS */}
      {/* ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Revenue */}
        <div className="group bg-[#FFFDF2] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#B87333]/20 hover:border-[#B87333]/40">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#6b4a2f] uppercase tracking-wider">Revenue Today</p>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center">
              <span className="text-white text-xs font-bold">₹</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2e211a] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            ₹{data.stats.revenueToday}
          </h2>
          <div className="mt-3 text-xs text-[#8B6F47] opacity-70">+12% from yesterday</div>
        </div>

        {/* Orders */}
        <div className="group bg-[#FFFDF2] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#B87333]/20 hover:border-[#B87333]/40">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#6b4a2f] uppercase tracking-wider">Orders Completed</p>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5E7D4C] to-[#5E7D4C] flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2e211a] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {data.stats.totalOrders}
          </h2>
          <div className="mt-3 text-xs text-[#8B6F47] opacity-70">+8% from yesterday</div>
        </div>

        {/* Users */}
        <div className="group bg-[#FFFDF2] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#B87333]/20 hover:border-[#B87333]/40">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#6b4a2f] uppercase tracking-wider">Users</p>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center">
              <span className="text-white text-xs font-bold">👥</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2e211a] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {data.stats.totalUsers}
          </h2>
          <div className="mt-3 text-xs text-[#8B6F47] opacity-70">+15% from last week</div>
        </div>

      </div>

      {/* ===================== */}
      {/* AI INSIGHTS */}
      {/* ===================== */}
      <div className="bg-gradient-to-br from-[#FFFDF2] to-[#FFF8E8] p-4 sm:p-6 rounded-2xl shadow-inner border-l-4 border-[#c68642] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#c68642]/10 to-transparent rounded-full -mr-16 -mt-16" />
        <h2 className="text-base sm:text-lg font-semibold text-[#2e211a] mb-3 sm:mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <span className="text-2xl">🤖</span>
          AI Insights
        </h2>

        <ul className="space-y-2 sm:space-y-3 text-sm text-[#3a2618]">
          {data.insights.mostSoldItem && (
            <li className="flex flex-col sm:flex-row sm:items-start sm:gap-2 bg-white/50 p-3 rounded-lg">
              <span className="font-semibold">🥇 Most sold item:</span>
              <span className="text-[#B87333] font-medium">
                {data.insights.mostSoldItem.name} ({data.insights.mostSoldItem.count})
              </span>
            </li>
          )}

          {data.insights.peakHour && (
            <li className="flex flex-col sm:flex-row sm:items-start sm:gap-2 bg-white/50 p-3 rounded-lg">
              <span className="font-semibold">🔥 Peak order time:</span>
              <span className="text-[#B87333] font-medium">{data.insights.peakHour}</span>
            </li>
          )}

          {data.insights.lowStockItems?.map((item: any) => (
            <li key={item._id} className="flex flex-col sm:flex-row sm:items-start sm:gap-2 bg-white/50 p-3 rounded-lg">
              <span className="font-semibold">⚠️ Low stock:</span>
              <span className="text-red-600 font-medium">{item.name} ({item.stock} left)</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ===================== */}
      {/* QUICK ACTIONS */}
      {/* ===================== */}
      <div>
        <h2 className="text-lg font-semibold text-[#2e211a] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

          <a
            href="/admin/orders"
            className="group bg-gradient-to-r from-[#3a2618] to-[#2a1a12] text-[#fffbd6] px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#B87333]/30 hover:border-[#B87333]/50 flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#B87333] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-sm font-medium">Orders</span>
          </a>

          <a
            href="/admin/menu"
            className="group bg-gradient-to-r from-[#3a2618] to-[#2a1a12] text-[#fffbd6] px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#B87333]/30 hover:border-[#B87333]/50 flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#B87333] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-sm font-medium">Menu</span>
          </a>

          <a
            href="/admin/workshops"
            className="group bg-gradient-to-r from-[#3a2618] to-[#2a1a12] text-[#fffbd6] px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#B87333]/30 hover:border-[#B87333]/50 flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#B87333] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-sm font-medium">Workshops</span>
          </a>

          <a
            href="/admin/gallery"
            className="group bg-gradient-to-r from-[#3a2618] to-[#2a1a12] text-[#fffbd6] px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#B87333]/30 hover:border-[#B87333]/50 flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#B87333] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-sm font-medium">Gallery</span>
          </a>

          <a
            href="/admin/coupons"
            className="group bg-gradient-to-r from-[#3a2618] to-[#2a1a12] text-[#fffbd6] px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#B87333]/30 hover:border-[#B87333]/50 flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#B87333] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-sm font-medium">Coupons</span>
          </a>

        </div>
      </div>
    </div>
  );
}
