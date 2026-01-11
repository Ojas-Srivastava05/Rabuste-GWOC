"use client";

import { useEffect, useState } from "react";
import { Package, Clock, MapPin, CreditCard } from "lucide-react";

type Order = {
  _id: string;
  items: Array<{
    itemId: string;
    quantity: number;
    name?: string;
    price?: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  pickupSlot?: string;
  paymentStatus?: string;
  instructions?: string;
};

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: HeadersInit = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/user/orders", {
          headers: {
            ...getAuthHeaders(),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError("Unable to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #1A1110 0%, #0A0A0A 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="section-label">Loading Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF3E0] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6 border border-[#B87333]/20">
      {/* PAGE HEADING */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-[#B87333] to-[#CD7F32] rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2e211a]" style={{ fontFamily: 'var(--font-heading)' }}>
          My Orders
        </h1>
        <div className="flex-1 h-px bg-gradient-to-r from-[#B87333]/30 to-transparent" />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-[#FFFDF2] p-6 rounded-2xl shadow-lg border border-[#B87333]/20 hover:border-[#B87333]/40 transition-all duration-300 hover:shadow-xl"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#B87333]/20">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={20} style={{ color: '#B87333' }} />
                    <h3 className="text-lg font-bold text-[#2e211a]" style={{ fontFamily: 'var(--font-heading)' }}>
                      Order #{order._id.slice(-8)}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6b4a2f]">
                    <Clock size={14} />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'assigned'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                  <div className="text-2xl font-bold text-[#B87333]" style={{ fontFamily: 'var(--font-heading)' }}>
                    ₹{order.totalAmount}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                <p className="text-sm font-semibold text-[#6b4a2f] uppercase tracking-wider mb-2">Order Items</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                    <span className="text-[#2e211a]">
                      {item.name || `Item ${item.itemId.slice(-6)}`} × {item.quantity}
                    </span>
                    {item.price && (
                      <span className="text-[#B87333] font-semibold">₹{item.price * item.quantity}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#B87333]/20">
                {order.pickupSlot && (
                  <div className="flex items-start gap-3">
                    <Clock size={18} style={{ color: '#B87333' }} className="flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-semibold text-[#6b4a2f] uppercase tracking-wider">Pickup Time</p>
                      <p className="text-sm text-[#2e211a] font-medium">{order.pickupSlot}</p>
                    </div>
                  </div>
                )}
                {order.paymentStatus && (
                  <div className="flex items-start gap-3">
                    <CreditCard size={18} style={{ color: '#B87333' }} className="flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-semibold text-[#6b4a2f] uppercase tracking-wider">Payment</p>
                      <p className="text-sm text-[#2e211a] font-medium capitalize">{order.paymentStatus}</p>
                    </div>
                  </div>
                )}
              </div>

              {order.instructions && (
                <div className="mt-4 pt-4 border-t border-[#B87333]/20">
                  <p className="text-xs font-semibold text-[#6b4a2f] uppercase tracking-wider mb-2">Special Instructions</p>
                  <p className="text-sm text-[#2e211a] bg-white/50 p-3 rounded-lg">{order.instructions}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-[#FFFDF2] p-12 rounded-2xl text-center border border-[#B87333]/20">
            <Package size={64} className="mx-auto mb-4" style={{ color: '#B87333', opacity: 0.5 }} />
            <h3 className="text-xl font-bold text-[#2e211a] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              No Orders Yet
            </h3>
            <p className="text-[#6b4a2f] mb-6">Start your coffee journey by placing your first order!</p>
            <a
              href="/menu"
              className="inline-block bg-gradient-to-r from-[#B87333] to-[#CD7F32] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Browse Menu
            </a>
          </div>
        )}
      </div>
    </div>
  );
}