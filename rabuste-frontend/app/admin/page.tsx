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
    <div className="bg-[#FAF3E0] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl space-y-6 sm:space-y-8 lg:space-y-10">

      {/* PAGE HEADING */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#2e211a]">
        Admin Dashboard
      </h1>

      {/* ===================== */}
      {/* STAT CARDS */}
      {/* ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Revenue */}
        <div className="bg-[#FFFDF2] p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <p className="text-sm text-[#6b4a2f]">Revenue Today</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2e211a] mt-2">
            ₹{data.stats.revenueToday}
          </h2>
        </div>

        {/* Orders */}
        <div className="bg-[#FFFDF2] p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <p className="text-sm text-[#6b4a2f]">Orders Completed</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2e211a] mt-2">
            {data.stats.totalOrders}
          </h2>
        </div>

        {/* Users */}
        <div className="bg-[#FFFDF2] p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <p className="text-sm text-[#6b4a2f]">Users</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2e211a] mt-2">
            {data.stats.totalUsers}
          </h2>
        </div>

      </div>

      {/* ===================== */}
      {/* AI INSIGHTS */}
      {/* ===================== */}
      <div className="bg-[#FFFDF2] p-4 sm:p-6 rounded-xl shadow-inner border-l-4 border-[#c68642]">
        <h2 className="text-base sm:text-lg font-semibold text-[#2e211a] mb-3 sm:mb-4">
          🤖 AI Insights
        </h2>

        <ul className="space-y-2 sm:space-y-3 text-sm text-[#3a2618]">
          {data.insights.mostSoldItem && (
            <li className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
              <span>🥇 <b>Most sold item:</b></span>
              <span>
                {data.insights.mostSoldItem.name} ({data.insights.mostSoldItem.count})
              </span>
            </li>
          )}

          {data.insights.peakHour && (
            <li className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
              <span>🔥 <b>Peak order time:</b></span>
              <span>{data.insights.peakHour}</span>
            </li>
          )}

          {data.insights.lowStockItems?.map((item: any) => (
            <li key={item._id} className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
              <span>⚠️ <b>Low stock:</b></span>
              <span>{item.name} ({item.stock} left)</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ===================== */}
      {/* QUICK ACTIONS */}
      {/* ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        <a
          href="/admin/orders"
          className="bg-[#3a2618] text-[#fffbd6] px-4 py-3 rounded-md shadow
                     hover:shadow-md transition text-center"
        >
          <span className="text-sm font-medium">Orders</span>
        </a>

        <a
          href="/admin/menu"
          className="bg-[#3a2618] text-[#fffbd6] px-4 py-3 rounded-md shadow
                     hover:shadow-md transition text-center"
        >
          <span className="text-sm font-medium">Menu</span>
        </a>

        <a
          href="/admin/workshops"
          className="bg-[#3a2618] text-[#fffbd6] px-4 py-3 rounded-md shadow
                     hover:shadow-md transition text-center"
        >
          <span className="text-sm font-medium">Workshops</span>
        </a>

        <a
          href="/admin/gallery"
          className="bg-[#3a2618] text-[#fffbd6] px-4 py-3 rounded-md shadow
                     hover:shadow-md transition text-center"
        >
          <span className="text-sm font-medium">Gallery</span>
        </a>

        <a
          href="/admin/coupons"
          className="bg-[#3a2618] text-[#fffbd6] px-4 py-3 rounded-md shadow
                     hover:shadow-md transition text-center"
        >
          <span className="text-sm font-medium">Coupons</span>
        </a>

      </div>
    </div>
  );
}
