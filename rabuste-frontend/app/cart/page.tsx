"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";

type CartItem = {
  menuItem?: string;
  artItem?: string;
  itemType: "menu" | "art";
  name: string;
  price: number;
  quantity: number;
};

type Cart = {
  items: CartItem[];
  totalAmount: number;
};

function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <DynamicBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="section-label">Loading your cart...</p>
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
              Your cart is waiting to be filled with bold flavors
            </p>
            <button
              onClick={() => router.push("/menu")}
              className="btn btn-primary"
            >
              EXPLORE MENU
              <ArrowRight size={20} />
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
      
      <div className="min-h-screen" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="container px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="copper-line" />
              <span className="section-label">YOUR ORDER</span>
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
              SHOPPING <span className="gradient-text">CART</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item, index) => (
                <div
                  key={item.menuItem || item.artItem || index}
                  className="brutal-card p-6"
                  style={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'center',
                  }}
                >
                  <div className="flex-1">
                    <h3 
                      className="text-2xl mb-2"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#F5F1E8',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-4 text-lg">
                      <span className="gradient-text font-bold">₹{item.price}</span>
                      <span style={{ color: '#8B6F47' }}>×</span>
                      <span style={{ color: '#B87333' }}>{item.quantity}</span>
                    </div>
                  </div>

                  <div 
                    className="text-2xl font-bold gradient-text"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      minWidth: '120px',
                      textAlign: 'right',
                    }}
                  >
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div 
                className="sticky top-32 brutal-card p-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.9), rgba(42, 24, 16, 0.9))',
                }}
              >
                <h2 
                  className="text-3xl mb-8"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                    letterSpacing: '0.1em',
                  }}
                >
                  ORDER SUMMARY
                </h2>

                <div className="space-y-4 mb-8 pb-6">
                  <p className="text-sm text-center" style={{ color: '#8B6F47' }}>
                    All prices are inclusive of taxes
                  </p>
                </div>

                <div className="flex justify-between items-center mb-8 pt-6 border-t-2 border-[#B87333]/30">
                  <span 
                    className="text-3xl"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#F5F1E8',
                      letterSpacing: '0.05em',
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
                    ₹{cart.totalAmount}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (!isLoggedIn()) {
                      router.push("/auth?redirect=/checkout");
                    } else {
                      router.push("/checkout");
                    }
                  }}
                  className="btn btn-primary w-full mb-4"
                >
                  PROCEED TO CHECKOUT
                  <ArrowRight size={20} />
                </button>

                <button
                  onClick={async () => {
                    await fetch("/api/cart", { method: "DELETE" });
                    window.location.reload();
                  }}
                  className="btn btn-secondary w-full"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                  }}
                >
                  <Trash2 size={18} />
                  CLEAR CART
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}