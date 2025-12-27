"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShoppingBag, CheckCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

type Cart = {
  items: CartItem[];
  totalAmount: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
  }

  async function handleMockPayment() {
    setPaying(true);

    // simulate payment delay
    setTimeout(async () => {
      // create order
      await fetch("/api/order", { method: "POST" });

      // redirect to status page
      router.push("/order-status");
    }, 2000);
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <p className="section-label mb-4">Cart is empty</p>
            <button onClick={() => router.push("/menu")} className="btn btn-primary">
              GO TO MENU
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const taxAmount = Math.round(cart.totalAmount * 0.05);
  const totalAmount = cart.totalAmount + taxAmount;

  return (
    <>
      <Navbar />
      <DynamicBackground />

      <div className="min-h-screen" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="container px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="copper-line" />
              <span className="section-label">SECURE PAYMENT</span>
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
              CHECK<span className="gradient-text">OUT</span>
            </h1>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Order Summary Card */}
            <div className="brutal-card p-8 mb-8">
              <h2
                className="text-3xl mb-8 flex items-center gap-3"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#F5F1E8',
                  letterSpacing: '0.1em',
                }}
              >
                <ShoppingBag size={32} className="text-[#B87333]" />
                YOUR ORDER
              </h2>

              <div className="space-y-4 mb-8">
                {cart.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center pb-4 border-b border-[#B87333]/20"
                  >
                    <div>
                      <h3
                        className="text-xl mb-1"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: '#F5F1E8',
                        }}
                      >
                        {item.name}
                      </h3>
                      <p style={{ color: '#8B6F47' }}>
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-2xl gradient-text font-bold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t-2 border-[#B87333]/30">
                <div className="flex justify-between items-center text-lg">
                  <span style={{ color: '#8B6F47' }}>Subtotal</span>
                  <span className="gradient-text font-bold">₹{cart.totalAmount}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span style={{ color: '#8B6F47' }}>Tax (5%)</span>
                  <span className="gradient-text font-bold">₹{taxAmount}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-[#B87333]/30">
                  <span
                    className="text-3xl"
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
                    ₹{totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="brutal-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.3))',
                    border: '2px solid rgba(184, 115, 51, 0.5)',
                  }}
                >
                  <CreditCard size={24} className="text-[#B87333]" />
                </div>
                <h2
                  className="text-3xl"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                    letterSpacing: '0.1em',
                  }}
                >
                  PAYMENT METHOD
                </h2>
              </div>

              <p className="text-lg mb-8" style={{ color: '#8B6F47' }}>
                This is a demo checkout. No actual payment will be processed.
              </p>

              <button
                onClick={handleMockPayment}
                disabled={paying}
                className="btn btn-primary w-full"
                style={{
                  fontSize: '20px',
                  padding: '24px 50px',
                  position: 'relative',
                }}
              >
                {paying ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    PROCESSING PAYMENT...
                  </>
                ) : (
                  <>
                    <CreditCard size={24} />
                    PAY ₹{totalAmount}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-6" style={{ color: '#8B6F47' }}>
                <CheckCircle size={16} />
                <span className="text-sm">Secure & encrypted payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}