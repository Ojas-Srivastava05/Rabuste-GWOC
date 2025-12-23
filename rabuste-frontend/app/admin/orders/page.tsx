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
      body: JSON.stringify({ status: "completed" }), // lowercase to match your schema
    });

    if (!res.ok) {
      const err = await res.json();
      console.error(err);
    } else {
      const updated = await res.json();
      console.log("Order updated:", updated);

      // Update the local orders state immediately
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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">☕ Admin – Orders</h1>

      <div className="space-y-4">
        {orders.length === 0 && <p>No orders yet.</p>}

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{order.customerName}</h2>
              <span
                className={`px-2 py-1 rounded-md text-sm font-medium ${
                  order.status === "pending"
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-green-500 text-gray-900"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <p className="mb-2">Email: {order.customerEmail}</p>

            <div className="mb-2">
              <p className="font-semibold">Items:</p>
              <ul className="list-disc list-inside">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x {item.quantity} = ₹
                    {item.price * item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <p className="font-semibold mb-2">Total: ₹{order.totalAmount}</p>

            {order.status === "pending" && (
              <button
                onClick={() => markCompleted(order._id)}
                className="px-4 py-2 bg-amber-500 text-gray-900 font-semibold rounded-md hover:bg-amber-600"
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
