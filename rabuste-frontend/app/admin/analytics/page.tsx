"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Clock, ShoppingBag, DollarSign, Calendar, Package } from "lucide-react";

interface Analytics {
  averageAOV: number;
  peakTime: {
    hour: number;
    hour12: string;
    count: number;
  };
  peakDay: {
    day: number;
    dayName: string;
    count: number;
  };
  mostFrequentItem: {
    name: string;
    count: number;
    revenue: number;
  } | null;
  totalOrders: number;
  totalRevenue: number;
  totalItems: number;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-black">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Business Analytics</h1>
        <p className="text-black mt-1">Key insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Average Order Value</p>
              <p className="text-2xl font-bold text-black">₹{analytics.averageAOV.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-black rounded-lg">
              <DollarSign size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{analytics.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-black">{analytics.totalOrders}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <ShoppingBag size={20} className="text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Peak Time */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock size={24} className="text-black" />
            <h2 className="text-xl font-bold text-black">Peak Time</h2>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">{analytics.peakTime.hour12}</p>
            <p className="text-sm text-black">
              {analytics.peakTime.count} order{analytics.peakTime.count !== 1 ? 's' : ''} at this time
            </p>
          </div>
        </div>

        {/* Peak Day */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={24} className="text-black" />
            <h2 className="text-xl font-bold text-black">Peak Day</h2>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">{analytics.peakDay.dayName}</p>
            <p className="text-sm text-black">
              {analytics.peakDay.count} order{analytics.peakDay.count !== 1 ? 's' : ''} on this day
            </p>
          </div>
        </div>

        {/* Most Frequent Item */}
        {analytics.mostFrequentItem && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Package size={24} className="text-black" />
              <h2 className="text-xl font-bold text-black">Most Popular Item</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-black mb-1">Item Name</p>
                <p className="text-lg font-semibold text-black">{analytics.mostFrequentItem.name}</p>
              </div>
              <div>
                <p className="text-sm text-black mb-1">Total Quantity Sold</p>
                <p className="text-lg font-semibold text-black">{analytics.mostFrequentItem.count}</p>
              </div>
              <div>
                <p className="text-sm text-black mb-1">Total Revenue</p>
                <p className="text-lg font-semibold text-green-600">₹{analytics.mostFrequentItem.revenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Total Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-black mb-1">Total Items Sold</p>
            <p className="text-2xl font-bold text-black">{analytics.totalItems}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-lg">
            <Package size={20} className="text-black" />
          </div>
        </div>
      </div>
    </div>
  );
}
