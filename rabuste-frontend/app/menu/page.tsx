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

export default function MenuPage() {
  const router = useRouter();
  // server state
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // fetch menu and cart on mount
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

  // decrement: reuse cart POST with negative quantity
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
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="sticky top-20 z-40 py-6"
        style={{
          background: "rgba(10,10,10,.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="container px-6 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex gap-3 px-5 py-2.5 border border-[#C9A86A]/20"
            style={{ color: "#C9A86A" }}
          >
            <ArrowLeft size={20} /> Back
          </button>

          <h1 className="text-4xl md:text-6xl gradient-text">Menu</h1>

          {totalItems > 0 && (
            <button
              onClick={() => router.push("/cart")}
              className="relative flex gap-3 px-5 py-2.5"
              style={{ background: "linear-gradient(135deg,#8B6F47,#C9A86A)" }}
            >
              <ShoppingCart />₹{totalPrice}
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center bg-black text-[#C9A86A]">
                {totalItems}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="container px-6 py-8 flex gap-3 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className="px-6 py-3 border"
            style={{ color: "#C9A86A" }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Items (rendered from server) */}
      <div className="container px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item._id} className="elegant-card p-6 menu-item-card">
              <img src={item.image} className="rounded-sm mb-4" />
              <h3 className="text-xl mb-2">{item.name}</h3>
              <p className="text-sm text-[#8B6F47] mb-4">{item.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-2xl gradient-text">₹{item.price}</span>

                {getQty(item._id) > 0 ? (
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeFromCart(item._id)}>
                      <Minus size={16} />
                    </button>
                    <span>{getQty(item._id)}</span>
                    <button onClick={() => addToCart(item._id)}>
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(item._id)}>Add</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
