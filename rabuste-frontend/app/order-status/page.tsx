"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "completed";
  createdAt: string;
};

export default function OrderStatusPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth");
        return;
      }

      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: Order[] = await res.json();

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      // ✅ ONLY SHOW PENDING ORDERS
      const pendingOrders = data.filter(
        (order) => order.status === "pending"
      );

      setOrders(pendingOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading orders...</p>
        </div>
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p>No active orders found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 pt-32">
        <h1 className="text-4xl mb-8">Your Active Orders</h1>

        {orders.map((order) => (
          <div
            key={order._id}
            className="mb-10 border-b pb-6"
          >
            <p className="mb-2 text-sm text-gray-500">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <p className="mb-4">
              Status: <b>{order.status}</b>
            </p>

            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b pb-2"
                >
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p>₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-xl">
              Total: ₹{order.totalAmount}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
