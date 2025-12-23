"use client";
import { useEffect, useState } from "react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
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
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  const markCompleted = async (orderId: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
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

  return (
    <div className="min-h-screen bg-[#1b120a] text-[#f3e9dc] p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#e6c9a8]">Admin – Orders</h1>

      <div className="space-y-4">
        {orders.length === 0 && (
          <p className="text-[#c9b8a3]">No orders yet.</p>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-[#2b1d14] p-4 rounded-xl shadow-xl border border-[#3a2618]"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-[#f0dbc4]">
                {order.customerName}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === "pending"
                    ? "bg-[#c68642] text-[#1b120a]"
                    : "bg-[#6f8f72] text-[#1b120a]"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <p className="mb-2 text-[#d6c4ae]">Email: {order.customerEmail}</p>

            <div className="mb-2">
              <p className="font-semibold text-[#e6c9a8]">Items:</p>
              <ul className="list-disc list-inside text-[#d6c4ae]">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.quantity} = ₹
                    {item.price * item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <p className="font-semibold text-[#e6c9a8] mb-2">
              Total: ₹{order.totalAmount}
            </p>

            {order.instructions && (
              <p className="mt-2 italic text-[#cbb59d]">
                📝 <strong>Instructions:</strong> {order.instructions}
              </p>
            )}

            {order.status === "pending" && (
              <button
                onClick={() => markCompleted(order._id)}
                className="mt-3 px-4 py-2 bg-[#c68642] text-[#1b120a] font-semibold rounded-md hover:bg-[#a9713a] transition"
              >
                Mark Completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
