"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import {
  TrendingUp,
  ShoppingBag,
  Heart,
  Clock,
  Package,
  Mail,
  Phone,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

type DashboardData = {
  stats: {
    totalOrders: number;
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
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
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

        // Calculate favorites count from localStorage based on user ID
        const userId = user?.id;
        const favoriteCount = userId
          ? (() => {
              const storedFavorites = localStorage.getItem(
                `favorites_${userId}`
              );
              return storedFavorites ? JSON.parse(storedFavorites).length : 0;
            })()
          : 0;

        setData({
          ...json,
          stats: {
            ...json.stats,
            favoriteItems: favoriteCount,
          },
        });
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(180deg, #1A1110 0%, #0A0A0A 100%)",
        }}
      >
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
    <div className="bg-[#FAF3E0] rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl space-y-4 sm:space-y-6 lg:space-y-10 border border-[#B87333]/20">
      {/* PAGE HEADING */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-[#B87333] to-[#CD7F32] rounded-full" />
        <h1
          className="text-2xl sm:text-3xl font-bold text-[#2e211a]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          My Dashboard
        </h1>
        <div className="flex-1 h-px bg-gradient-to-r from-[#B87333]/30 to-transparent" />
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-br from-[#B87333]/10 to-[#CD7F32]/10 p-6 rounded-2xl border border-[#B87333]/30">
        <h2
          className="text-xl sm:text-2xl font-bold text-[#2e211a] mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Welcome back, {user?.name}!
        </h2>
        <p className="text-sm text-[#6b4a2f]">
          Here's a summary of your coffee journey with Rabuste
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Total Orders */}
        <div className="group bg-[#FFFDF2] p-3 sm:p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 border border-[#B87333]/20 hover:border-[#B87333]/40">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-semibold text-[#6b4a2f] uppercase tracking-wider">
              Total Orders
            </p>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center flex-shrink-0">
              <ShoppingBag
                size={14}
                className="sm:w-4 sm:h-4"
                style={{ color: "#FFF" }}
              />
            </div>
          </div>
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2e211a] mt-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {data?.stats.totalOrders || 0}
          </h2>
          <div className="mt-2 sm:mt-3 text-xs text-[#8B6F47] opacity-70">
            Lifetime orders
          </div>
        </div>

        {/* Favorite Items */}
        {/* <div className="group bg-[#FFFDF2] p-3 sm:p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 border border-[#B87333]/20 hover:border-[#B87333]/40">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-semibold text-[#6b4a2f] uppercase tracking-wider">
              Favorites
            </p>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#DC2626] to-[#B91C1C] flex items-center justify-center flex-shrink-0">
              <Heart
                size={14}
                className="sm:w-4 sm:h-4"
                style={{ color: "#FFF" }}
              />
            </div>
          </div>
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2e211a] mt-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {data?.stats.favoriteItems || 0}
          </h2>
          <div className="mt-2 sm:mt-3 text-xs text-[#8B6F47] opacity-70">
            Saved items
          </div>
        </div> */}

        {/* Most Ordered */}
        <div className="group bg-[#FFFDF2] p-3 sm:p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 border border-[#B87333]/20 hover:border-[#B87333]/40">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-semibold text-[#6b4a2f] uppercase tracking-wider">
              Top Choice
            </p>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center flex-shrink-0">
              <TrendingUp
                size={14}
                className="sm:w-4 sm:h-4"
                style={{ color: "#FFF" }}
              />
            </div>
          </div>
          <h2
            className="text-base sm:text-lg font-bold text-[#2e211a] mt-2 line-clamp-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {data?.stats.mostOrderedItem?.name || "N/A"}
          </h2>
          <div className="mt-2 sm:mt-3 text-xs text-[#8B6F47] opacity-70">
            {data?.stats.mostOrderedItem
              ? `${data.stats.mostOrderedItem.count} orders`
              : "No orders yet"}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2
          className="text-lg font-semibold text-[#2e211a] mb-4 flex items-center gap-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <Clock size={20} style={{ color: "#B87333" }} />
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
                      <Package size={16} style={{ color: "#B87333" }} />
                      <span className="text-sm font-semibold text-[#6b4a2f]">
                        Order #{order._id.slice(-6)}
                      </span>
                    </div>
                    <p className="text-xs text-[#8B6F47]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#2e211a]">
                        ₹{order.totalAmount}
                      </p>
                      <p className="text-xs text-[#8B6F47]">
                        {order.items.length} items
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "assigned"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
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
              <Package
                size={48}
                className="mx-auto mb-4"
                style={{ color: "#B87333", opacity: 0.5 }}
              />
              <p className="text-[#6b4a2f]">No orders yet</p>
              <p className="text-sm text-[#8B6F47] mt-2">
                Start your coffee journey today!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2
          className="text-lg font-semibold text-[#2e211a] mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
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

      {/* Help & Support Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={20} style={{ color: "#B87333" }} />
          <h2
            className="text-lg font-semibold text-[#2e211a]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Need Help?
          </h2>
        </div>

        <div className="bg-gradient-to-br from-[#B87333]/10 to-[#CD7F32]/10 p-6 rounded-2xl border border-[#B87333]/30">
          <p className="text-sm text-[#6b4a2f] mb-6">
            Having issues with your order or need assistance? We're here to
            help! Reach out to us through any of the following channels:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email Support */}
            <a
              href="mailto:support@rabuste.com"
              className="group bg-[#FFFDF2] p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#B87333]/20 hover:border-[#B87333]/40"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center flex-shrink-0">
                  <Mail size={18} style={{ color: "#FFF" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-semibold text-[#2e211a] mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Email Us
                  </h3>
                  <p className="text-xs text-[#8B6F47] break-all">
                    support@rabuste.com
                  </p>
                  <p className="text-xs text-[#6b4a2f] mt-2 opacity-70">
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </a>

            {/* Phone Support */}
            <a
              href="tel:+911234567890"
              className="group bg-[#FFFDF2] p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#B87333]/20 hover:border-[#B87333]/40"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5E7D4C] to-[#4A6339] flex items-center justify-center flex-shrink-0">
                  <Phone size={18} style={{ color: "#FFF" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-semibold text-[#2e211a] mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Call Us
                  </h3>
                  <p className="text-xs text-[#8B6F47]">+91 123 456 7890</p>
                  <p className="text-xs text-[#6b4a2f] mt-2 opacity-70">
                    Mon-Sat, 9 AM - 8 PM
                  </p>
                </div>
              </div>
            </a>

            {/* WhatsApp Support */}
            <a
              href="https://wa.me/911234567890?text=Hi%20Rabuste,%20I%20need%20help%20with"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#FFFDF2] p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#B87333]/20 hover:border-[#B87333]/40"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={18} style={{ color: "#FFF" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-semibold text-[#2e211a] mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    WhatsApp
                  </h3>
                  <p className="text-xs text-[#8B6F47]">Chat with us</p>
                  <p className="text-xs text-[#6b4a2f] mt-2 opacity-70">
                    Instant support
                  </p>
                </div>
              </div>
            </a>
          </div>

          {/* Feedback Link */}
          <div className="mt-6 pt-6 border-t border-[#B87333]/20 text-center">
            <p className="text-xs text-[#6b4a2f] mb-3">
              Want to share your experience or suggestions?
            </p>
            <a
              href="/feedback"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#3a2618] to-[#2a1a12] text-[#fffbd6] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#B87333]/30 hover:border-[#B87333]/50 text-sm font-medium"
              style={{
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.05em",
              }}
            >
              <MessageCircle size={16} />
              SUBMIT FEEDBACK
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
