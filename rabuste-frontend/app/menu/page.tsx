"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

// using server-backed menu & cart instead of local store/static data

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type CartItem = {
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
};

type Cart = {
  items: CartItem[];
  totalAmount: number;
};

// removed static menuData — menu will be fetched from /api/menu

import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";

export default function MenuPage() {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchMenu();
    fetchCart();
  }, []);

  async function fetchMenu() {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      console.error("Failed to fetch menu", err);
    }
  }

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  }

  async function addToCart(menuItemId: string) {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId, quantity: 1 }),
    });
    fetchCart();
  }

  async function removeFromCart(menuItemId: string) {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId, quantity: -1 }),
    });
    fetchCart();
  }

  function getQty(menuItemId: string) {
    return cart?.items.find((i) => i.menuItem === menuItemId)?.quantity || 0;
  }

  const totalItems = cart?.items.reduce((s, i) => s + i.quantity, 0) || 0;
  const totalPrice = cart?.totalAmount || 0;

  const categories = ["All", ...Array.from(new Set(menu.map((m) => m.category)))];
  const filtered =
    activeCategory === "All" ? menu : menu.filter((m) => m.category === activeCategory);

  return (
    <>
      <Navbar />
      <DynamicBackground />

      <div className="min-h-screen" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        {/* Header */}
        <div className="container px-6 mb-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="copper-line" />
              <span className="section-label">BOLD SELECTION</span>
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
              OUR <span className="gradient-text">MENU</span>
            </h1>
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-4 justify-center flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-6 py-3 transition-all duration-300 ${
                  activeCategory === c ? 'btn-primary' : 'btn-secondary'
                }`}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '16px',
                  letterSpacing: '0.1em',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Cart Float Button */}
        {totalItems > 0 && (
          <button
            onClick={() => router.push("/cart")}
            className="fixed bottom-8 right-8 z-50 btn btn-primary"
            style={{
              boxShadow: '0 20px 60px rgba(184, 115, 51, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <ShoppingCart size={20} />
            <span>{totalItems} Items</span>
            <span>₹{totalPrice}</span>
          </button>
        )}

        {/* Menu Items */}
        <div className="container px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="brutal-card p-6 group"
              >
                <div className="aspect-square overflow-hidden mb-4 rounded-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

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
                <p className="text-sm mb-4" style={{ color: '#8B6F47', lineHeight: 1.6 }}>
                  {item.description}
                </p>

                <div className="flex justify-between items-center">
                  <span
                    className="text-3xl gradient-text"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    ₹{item.price}
                  </span>

                  {getQty(item._id) > 0 ? (
                    <div className="flex items-center gap-4" style={{ 
                      background: 'rgba(184, 115, 51, 0.2)',
                      padding: '8px 16px',
                      border: '2px solid rgba(184, 115, 51, 0.4)',
                    }}>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-[#B87333] hover:text-[#D4A574] transition-colors"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="text-lg font-bold gradient-text" style={{ minWidth: '24px', textAlign: 'center' }}>
                        {getQty(item._id)}
                      </span>
                      <button
                        onClick={() => addToCart(item._id)}
                        className="text-[#B87333] hover:text-[#D4A574] transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item._id)}
                      className="btn-secondary"
                      style={{
                        padding: '12px 24px',
                        fontSize: '14px',
                      }}
                    >
                      ADD TO CART
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
