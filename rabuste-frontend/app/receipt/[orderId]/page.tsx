"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatTokenForDisplay } from "@/lib/tokenUtils";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";
import OrderReceipt from "@/components/OrderReceipt";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  itemType?: "menu" | "art";
};

type Order = {
  _id: string;
  token?: string;
  items: OrderItem[];
  totalAmount: number;
  couponCode?: string | null;
  couponDiscount?: number;
  customerName?: string;
  customerEmail?: string;
  createdAt: string;
  status: "pending" | "completed";
};

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

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

      if (!foundOrder) {
        setError("Order not found");
        return;
      }

      setOrder(foundOrder);
    } catch (err) {
      console.error(err);
      setError("Failed to load order");
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
              LOADING RECEIPT...
            </p>
          </motion.div>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center px-6" style={{ paddingTop: '120px', background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
          <div className="text-center max-w-md">
            <h2
              className="text-4xl md:text-5xl mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#F5F1E8',
                letterSpacing: '0.05em',
              }}
            >
              {error || "ORDER NOT FOUND"}
            </h2>
            <p className="text-lg mb-8" style={{ color: '#8B6F47' }}>
              Unable to load the receipt
            </p>
            <button
              onClick={() => router.push("/order-status")}
              className="btn btn-primary"
            >
              GO TO ORDERS
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <DynamicBackground />
      
      <div className="min-h-screen" style={{ paddingTop: '120px', paddingBottom: '80px', background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
        <div className="container px-6 mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push("/order-status")}
            className="flex items-center gap-2 mb-8 px-4 py-2 transition-all hover:scale-105"
            style={{
              background: 'rgba(184, 115, 51, 0.2)',
              border: '2px solid rgba(184, 115, 51, 0.4)',
              color: '#D4A574',
              fontFamily: 'var(--font-heading)',
              fontSize: '14px',
              letterSpacing: '0.05em',
            }}
          >
            <ArrowLeft size={18} />
            BACK TO ORDERS
          </motion.button>

          {/* Receipt */}
          <OrderReceipt
            token={order.token || '999'}
            orderDate={order.createdAt}
            items={order.items}
            totalAmount={order.totalAmount}
            couponCode={order.couponCode}
            couponDiscount={order.couponDiscount}
            customerName={order.customerName}
            customerEmail={order.customerEmail}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
