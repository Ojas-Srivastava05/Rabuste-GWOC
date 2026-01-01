"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight, Sparkles, Palette, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  itemType?: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
};

export default function ArtOrderStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  async function fetchOrder() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error("Failed to fetch order", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '100px' }}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="section-label">Loading order details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
          <div className="brutal-card p-12 text-center max-w-2xl">
            <AlertCircle size={64} className="mx-auto mb-6" style={{ color: '#B87333' }} />
            <h1 className="text-3xl mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#F5F1E8' }}>
              ORDER NOT FOUND
            </h1>
            <p className="mb-8" style={{ color: '#8B6F47' }}>
              We couldn&apos;t find the order you&apos;re looking for.
            </p>
            <button
              onClick={() => router.push('/art')}
              className="btn btn-primary"
            >
              BACK TO GALLERY
            </button>
          </div>
        </div>
      </>
    );
  }

  const artItems = order.items.filter(item => item.itemType === 'art');
  const hasArtItems = artItems.length > 0;

  return (
    <>
      <Navbar />
      <DynamicBackground />

      <div className="min-h-screen" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(184, 115, 51, 0.3), transparent)',
                }}
              />
              <CheckCircle2 
                size={64} 
                style={{ color: '#B87333' }}
                strokeWidth={2.5}
              />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#F5F1E8',
                lineHeight: 1.1,
              }}
            >
              ORDER <span className="gradient-text">CONFIRMED!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg mb-2"
              style={{ color: '#8B6F47' }}
            >
              Thank you for your purchase, <span style={{ color: '#B87333', fontWeight: 600 }}>{order.customerName}</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm"
              style={{ color: '#8B6F47' }}
            >
              Order ID: <span style={{ color: '#D4A574' }}>{order._id}</span>
            </motion.p>
          </motion.div>

          {hasArtItems && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="brutal-card p-8 mb-8"
              style={{
                background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.1), rgba(205, 127, 50, 0.05))',
                border: '2px solid rgba(184, 115, 51, 0.3)',
              }}
            >
              <div className="flex items-start gap-4">
                <Palette size={32} className="flex-shrink-0 mt-1" style={{ color: '#B87333' }} />
                <div>
                  <h2 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-heading)', color: '#F5F1E8' }}>
                    Artwork Ready for Pickup
                  </h2>
                  <p className="mb-4" style={{ color: '#8B6F47', lineHeight: 1.6 }}>
                    Your selected artwork is ready for immediate pickup. No preparation time needed! 
                    Visit our gallery during business hours to collect your beautiful piece.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} style={{ color: '#B87333' }} />
                      <span style={{ color: '#D4A574' }}>Gallery Hours: 9 AM - 8 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package size={16} style={{ color: '#B87333' }} />
                      <span style={{ color: '#D4A574' }}>Ready to Collect</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="brutal-card p-8 mb-8"
          >
            <h2 className="text-2xl mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: '#F5F1E8' }}>
              <Package size={28} style={{ color: '#B87333' }} />
              ORDER DETAILS
            </h2>

            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4"
                  style={{
                    background: 'rgba(61, 43, 31, 0.3)',
                    border: '1px solid rgba(184, 115, 51, 0.2)',
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base" style={{ color: '#F5F1E8', fontFamily: 'var(--font-heading)' }}>
                        {item.name}
                      </h3>
                      {item.itemType === 'art' && (
                        <span 
                          className="text-xs px-2 py-0.5 uppercase"
                          style={{
                            background: 'rgba(184, 115, 51, 0.2)',
                            color: '#B87333',
                            border: '1px solid rgba(184, 115, 51, 0.4)',
                          }}
                        >
                          ARTWORK
                        </span>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: '#8B6F47' }}>
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-[#B87333]/30 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xl" style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}>
                  TOTAL AMOUNT
                </span>
                <span className="text-3xl gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => router.push('/art')}
              className="btn btn-primary flex-1"
            >
              <Palette size={20} />
              BROWSE MORE ARTWORKS
            </button>
            <button
              onClick={() => router.push('/order-status')}
              className="btn btn-secondary flex-1"
            >
              <ArrowRight size={20} />
              VIEW ALL ORDERS
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-sm mb-2" style={{ color: '#8B6F47' }}>
              A confirmation email has been sent to <span style={{ color: '#B87333' }}>{order.customerEmail}</span>
            </p>
            <p className="text-xs" style={{ color: '#8B6F47' }}>
              Need help? Contact us at support@rabuste.com
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}