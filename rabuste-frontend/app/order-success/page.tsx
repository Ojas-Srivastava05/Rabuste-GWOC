"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Hash, Receipt, ArrowRight, Loader2, Coffee } from "lucide-react";
import { formatTokenForDisplay } from "@/lib/tokenUtils";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";
import confetti from "canvas-confetti";

type Order = {
  _id: string;
  token?: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  createdAt: string;
  couponCode?: string | null;
  couponDiscount?: number;
};

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      router.push("/order-status");
    }
  }, [orderId]);

  useEffect(() => {
    // Trigger confetti on success
    if (order) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B87333', '#CD7F32', '#D4A574'],
      });
    }
  }, [order]);

  async function fetchOrder() {
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

      if (!res.ok) {
        throw new Error("Failed to fetch order");
      }

      const orders: Order[] = await res.json();
      const foundOrder = orders.find((o) => o._id === orderId);

      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        router.push("/order-status");
      }
    } catch (err) {
      console.error(err);
      router.push("/order-status");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '120px', background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Loader2
              size={48}
              className="animate-spin mx-auto mb-4"
              style={{ color: '#B87333' }}
            />
            <p
              className="text-xl"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#B87333',
                letterSpacing: '0.1em',
              }}
            >
              LOADING...
            </p>
          </motion.div>
        </div>
      </>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <>
      <Navbar />
      <DynamicBackground />
      
      <div className="min-h-screen flex items-center justify-center px-4" style={{ paddingTop: '120px', paddingBottom: '80px', background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(94, 125, 76, 0.3), rgba(94, 125, 76, 0.2))',
                border: '3px solid rgba(94, 125, 76, 0.5)',
                boxShadow: '0 10px 40px rgba(94, 125, 76, 0.3)',
              }}
            >
              <CheckCircle size={48} style={{ color: '#5E7D4C' }} />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1
              className="text-5xl md:text-7xl mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#F5F1E8',
                letterSpacing: '0.05em',
                lineHeight: 0.9,
              }}
            >
              ORDER <span className="gradient-text">PLACED!</span>
            </h1>
            <p className="text-lg md:text-xl mb-2" style={{ color: '#8B6F47' }}>
              Your order has been successfully placed
            </p>
          </motion.div>

          {/* Order Token Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="brutal-card p-8 mb-6"
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Hash size={24} style={{ color: '#B87333' }} />
                <h2
                  className="text-2xl"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                    letterSpacing: '0.1em',
                  }}
                >
                  YOUR ORDER TOKEN
                </h2>
              </div>
              
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="inline-block px-8 py-6 mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.2))',
                  border: '3px solid rgba(184, 115, 51, 0.5)',
                  boxShadow: '0 8px 32px rgba(184, 115, 51, 0.3)',
                }}
              >
                <p
                  className="text-5xl md:text-6xl font-bold tracking-wider"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    background: 'linear-gradient(135deg, #B87333, #CD7F32, #D4A574)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {order.token ? formatTokenForDisplay(order.token, order.createdAt) : 'N/A'}
                </p>
              </motion.div>

              <p className="text-sm" style={{ color: '#8B6F47' }}>
                Please use this token to collect your order
              </p>
            </div>

            {/* Quick Summary */}
            <div className="pt-6 mt-6"
              style={{ borderTop: '2px solid rgba(184, 115, 51, 0.2)' }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm" style={{ color: '#8B6F47' }}>
                  Total Items
                </span>
                <span className="text-lg gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#8B6F47' }}>
                  Total Amount
                </span>
                <span className="text-2xl gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <button
              onClick={() => router.push(`/receipt/${order._id}`)}
              className="flex items-center justify-center gap-2 py-4 px-6 transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                color: '#000',
                fontFamily: 'var(--font-heading)',
                fontSize: '16px',
                fontWeight: 900,
                letterSpacing: '0.1em',
                boxShadow: '0 4px 20px rgba(184, 115, 51, 0.4)',
              }}
            >
              <Receipt size={20} />
              VIEW RECEIPT
            </button>

            <button
              onClick={() => router.push("/order-status")}
              className="flex items-center justify-center gap-2 py-4 px-6 transition-all hover:scale-105"
              style={{
                background: 'rgba(184, 115, 51, 0.2)',
                border: '2px solid rgba(184, 115, 51, 0.4)',
                color: '#D4A574',
                fontFamily: 'var(--font-heading)',
                fontSize: '16px',
                fontWeight: 900,
                letterSpacing: '0.1em',
              }}
            >
              TRACK ORDER
              <ArrowRight size={20} />
            </button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8 p-6"
            style={{
              background: 'rgba(255, 183, 77, 0.1)',
              border: '1px solid rgba(255, 183, 77, 0.3)',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coffee size={20} style={{ color: '#FFB74D' }} />
              <p className="text-sm" style={{ color: '#FFB74D', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                ORDER CONFIRMATION
              </p>
            </div>
            <p className="text-sm" style={{ color: '#8B6F47' }}>
              A confirmation email has been sent to your registered email address
            </p>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}
