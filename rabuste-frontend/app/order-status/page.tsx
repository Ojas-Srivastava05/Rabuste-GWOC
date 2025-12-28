"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, Package, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";

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
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '120px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div
              className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-6"
              style={{
                borderColor: '#B87333',
                borderTopColor: 'transparent',
              }}
            />
            <p
              className="text-xl"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#B87333',
                letterSpacing: '0.1em',
              }}
            >
              LOADING ORDERS...
            </p>
          </motion.div>
        </div>
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center px-6" style={{ paddingTop: '120px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-8"
            >
              <Package
                size={80}
                style={{ color: '#B87333' }}
                className="mx-auto"
              />
            </motion.div>
            <h2
              className="text-4xl md:text-5xl mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#F5F1E8',
                letterSpacing: '0.05em',
              }}
            >
              NO ACTIVE ORDERS
            </h2>
            <p
              className="text-lg mb-8"
              style={{ color: '#8B6F47', lineHeight: 1.7 }}
            >
              You don't have any pending orders at the moment
            </p>
            <button
              onClick={() => router.push("/menu")}
              className="btn-primary"
            >
              EXPLORE MENU
            </button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <DynamicBackground />
      
      <div className="min-h-screen" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="container px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="copper-line" />
              <span className="section-label">TRACK YOUR ORDERS</span>
              <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
            </div>

            <h1
              className="text-6xl md:text-8xl mb-6"
              style={{
                fontFamily: 'var(--font-heading)',
                lineHeight: 0.9,
                color: '#F5F1E8',
              }}
            >
              YOUR <span className="gradient-text">ORDERS</span>
            </h1>
            
            <p 
              className="text-lg md:text-xl max-w-2xl mx-auto"
              style={{ 
                color: '#8B6F47',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.7 
              }}
            >
              View and track your active orders
            </p>
          </div>

          {/* Orders List */}
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="brutal-card p-8"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6"
                    style={{ borderBottom: '2px solid rgba(184, 115, 51, 0.2)' }}
                  >
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock size={20} style={{ color: '#B87333' }} />
                        <span
                          className="text-sm"
                          style={{
                            color: '#8B6F47',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p
                        className="text-xs"
                        style={{
                          color: '#8B6F47',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        Order ID: {order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div
                      className="inline-flex items-center gap-2 px-4 py-2"
                      style={{
                        background: 'rgba(184, 115, 51, 0.2)',
                        border: '2px solid rgba(184, 115, 51, 0.4)',
                      }}
                    >
                      <AlertCircle size={18} style={{ color: '#B87333' }} />
                      <span
                        className="text-sm gradient-text"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (i * 0.05) }}
                        className="flex justify-between items-center pb-4"
                        style={{
                          borderBottom: i < order.items.length - 1
                            ? '1px solid rgba(184, 115, 51, 0.15)'
                            : 'none',
                        }}
                      >
                        <div className="flex-1">
                          <h3
                            className="text-lg mb-1"
                            style={{
                              fontFamily: 'var(--font-heading)',
                              color: '#F5F1E8',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {item.name}
                          </h3>
                          <p
                            className="text-sm"
                            style={{ color: '#8B6F47' }}
                          >
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <div
                          className="text-xl gradient-text"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          ₹{item.price * item.quantity}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div
                    className="flex justify-between items-center pt-6"
                    style={{ borderTop: '2px solid rgba(184, 115, 51, 0.3)' }}
                  >
                    <span
                      className="text-2xl"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#F5F1E8',
                        letterSpacing: '0.05em',
                      }}
                    >
                      TOTAL
                    </span>
                    <span
                      className="text-3xl gradient-text"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}