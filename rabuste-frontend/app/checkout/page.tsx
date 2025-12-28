"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShoppingBag, CheckCircle, Loader2, Package } from "lucide-react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMockPayment() {
    if (!cart) return;
  
    setPaying(true);
  
    // simulate payment delay
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          router.push("/auth?redirect=/checkout");
          return;
        }
  
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 🔥 REQUIRED
          },
          body: JSON.stringify({
            items: cart.items,
            totalAmount,
          }),
        });
  
        if (!res.ok) {
          throw new Error("Order creation failed");
        }
  
        // redirect to order status page
        router.push("/order-status");
      } catch (err) {
        console.error("Checkout error:", err);
        alert("Something went wrong while placing your order.");
      } finally {
        setPaying(false);
      }
    }, 2000);
  }
  

  if (loading) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="section-label">Loading checkout...</p>
          </div>
        </div>
      </>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            <div 
              className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.2))',
                border: '2px solid rgba(184, 115, 51, 0.4)',
              }}
            >
              <Package size={60} className="text-[#B87333]" />
            </div>
            <h1 
              className="text-5xl md:text-7xl mb-6"
              style={{
                fontFamily: 'var(--font-heading)',
                lineHeight: 0.9,
                color: '#F5F1E8',
              }}
            >
              EMPTY CART
            </h1>
            <p className="text-xl mb-12" style={{ color: '#B87333' }}>
              Add items to your cart before checking out
            </p>
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

            <p className="text-xl" style={{ color: '#B87333' }}>
              Complete your order securely
            </p>
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
                          letterSpacing: '0.05em',
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

              <p className="text-lg mb-8" style={{ color: '#8B6F47', lineHeight: 1.7 }}>
                This is a demo checkout. No actual payment will be processed.
              </p>

              <button
                onClick={handleMockPayment}
                disabled={paying}
                className="btn btn-primary w-full"
                style={{
                  fontSize: '20px',
                  padding: '24px 50px',
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