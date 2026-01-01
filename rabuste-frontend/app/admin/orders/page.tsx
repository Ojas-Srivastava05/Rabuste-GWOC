"use client";
import { useEffect, useState } from "react";
import { Package, CheckCircle2, Clock, Mail, FileText } from "lucide-react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  itemType?: "menu" | "art";
}

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "completed";
  createdAt: string;
  instructions?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

const res = await fetch("/api/orders", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await res.json();

if (!Array.isArray(data)) {
  console.error("Expected orders array, got:", data);
  setOrders([]);
  return;
}

setOrders(data);

  };

  const markCompleted = async (orderId: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "completed" }),
    });

    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updated._id
            ? { ...order, status: updated.status }
            : order
        )
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const completedOrders = orders.filter((o) => o.status === "completed");

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: 'linear-gradient(180deg, #1A1110 0%, #0A0A0A 100%)',
        color: '#F5F1E8',
      }}
    >
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="copper-line" />
          <span className="section-label">ADMIN PANEL</span>
          <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
        </div>
        <h1
          className="text-5xl md:text-7xl"
          style={{
            fontFamily: 'var(--font-heading)',
            lineHeight: 0.9,
          }}
        >
          ORDER <span className="gradient-text">MANAGEMENT</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl">
        <div className="brutal-card p-6">
          <div className="flex items-center gap-4 mb-3">
            <Clock size={28} className="text-[#B87333]" />
            <span className="section-label">PENDING</span>
          </div>
          <p
            className="text-5xl gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {pendingOrders.length}
          </p>
        </div>

        <div className="brutal-card p-6">
          <div className="flex items-center gap-4 mb-3">
            <CheckCircle2 size={28} className="text-[#6f8f72]" />
            <span className="section-label">COMPLETED</span>
          </div>
          <p
            className="text-5xl"
            style={{ fontFamily: 'var(--font-heading)', color: '#6f8f72' }}
          >
            {completedOrders.length}
          </p>
        </div>

        <div className="brutal-card p-6">
          <div className="flex items-center gap-4 mb-3">
            <Package size={28} className="text-[#B87333]" />
            <span className="section-label">TOTAL</span>
          </div>
          <p
            className="text-5xl gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {orders.length}
          </p>
        </div>
      </div>

      {orders.length === 0 && (
        <div className="brutal-card p-12 text-center max-w-2xl mx-auto">
          <Package size={64} className="text-[#B87333] mx-auto mb-6" />
          <p className="text-xl" style={{ color: '#8B6F47' }}>
            No orders yet. Orders will appear here once customers place them.
          </p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="brutal-card p-8"
            style={{
              background:
                order.status === "pending"
                  ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(42, 24, 16, 0.8))'
                  : 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(42, 24, 16, 0.8))',
            }}
          >
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <h2
                  className="text-3xl mb-2"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                  }}
                >
                  {order.customerName}
                </h2>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#8B6F47' }}>
                  <Mail size={16} />
                  {order.customerEmail}
                </div>
                <div className="text-xs mt-2" style={{ color: '#8B6F47' }}>
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              <div
                className="px-5 py-2 rounded-full uppercase tracking-widest text-sm font-bold"
                style={{
                  fontFamily: 'var(--font-heading)',
                  background:
                    order.status === "pending"
                      ? 'linear-gradient(135deg, #B87333, #CD7F32)'
                      : 'rgba(111, 143, 114, 0.3)',
                  color: order.status === "pending" ? '#000000' : '#6f8f72',
                  border: order.status === "completed" ? '2px solid #6f8f72' : 'none',
                }}
              >
                {order.status}
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3
                className="text-xl mb-4 flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#B87333',
                  letterSpacing: '0.1em',
                }}
              >
                <FileText size={20} />
                ORDER ITEMS
              </h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 rounded-lg"
                    style={{
                      background: item.itemType === 'art' 
                        ? 'rgba(184, 115, 51, 0.15)' 
                        : 'rgba(0, 0, 0, 0.3)',
                      border: `2px solid ${item.itemType === 'art' 
                        ? 'rgba(184, 115, 51, 0.4)' 
                        : 'rgba(184, 115, 51, 0.2)'}`,
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg" style={{ color: '#F5F1E8' }}>
                          {item.name}
                        </span>
                        {item.itemType === 'art' && (
                          <span 
                            className="text-xs px-2 py-1 uppercase"
                            style={{
                              background: 'rgba(184, 115, 51, 0.3)',
                              color: '#D4A574',
                              border: '1px solid rgba(184, 115, 51, 0.5)',
                              fontFamily: 'var(--font-heading)',
                              letterSpacing: '0.1em',
                            }}
                          >
                            🎨 ARTWORK
                          </span>
                        )}
                        {item.itemType === 'menu' && (
                          <span 
                            className="text-xs px-2 py-1 uppercase"
                            style={{
                              background: 'rgba(139, 111, 71, 0.2)',
                              color: '#8B6F47',
                              border: '1px solid rgba(139, 111, 71, 0.4)',
                              fontFamily: 'var(--font-heading)',
                              letterSpacing: '0.1em',
                            }}
                          >
                            ☕ MENU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm" style={{ color: '#8B6F47' }}>
                        <span>× {item.quantity}</span>
                        {item.itemType === 'art' && (
                          <span className="text-xs" style={{ color: '#B87333' }}>
                            • Ready for pickup
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xl gradient-text font-bold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {order.instructions && (
              <div
                className="mb-6 p-4 rounded-lg"
                style={{
                  background: 'rgba(184, 115, 51, 0.1)',
                  border: '1px solid rgba(184, 115, 51, 0.3)',
                }}
              >
                <p className="text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#B87333' }}>
                  Special Instructions
                </p>
                <p style={{ color: '#D4A574' }}>{order.instructions}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-6 border-t-2 border-[#B87333]/30">
              <span
                className="text-2xl"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#F5F1E8',
                }}
              >
                TOTAL
              </span>
              <span
                className="text-4xl gradient-text"
                style={{
                  fontFamily: 'var(--font-heading)',
                }}
              >
                ₹{order.totalAmount}
              </span>
            </div>

            {order.status === "pending" && (
              <button
                onClick={() => markCompleted(order._id)}
                className="btn btn-primary w-full mt-6"
              >
                <CheckCircle2 size={20} />
                MARK AS COMPLETED
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}