"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ShoppingCart, Search, X, Grid3x3, List, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

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

import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";

export default function MenuPage() {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "name">("default");
  const [showFilters, setShowFilters] = useState(false);

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
  
  // Filter and sort
  let filtered = menu.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort
  if (sortBy === "price-low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <>
      <Navbar />
      <DynamicBackground />

      <div className="min-h-screen" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        <div className="container px-4 md:px-6">
          {/* Compact Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1
              className="text-4xl md:text-6xl mb-3 text-center"
              style={{
                fontFamily: 'var(--font-heading)',
                lineHeight: 1,
                color: '#F5F1E8',
              }}
            >
              <span className="gradient-text">MENU</span>
            </h1>
            <p className="text-center text-sm" style={{ color: '#8B6F47' }}>
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'} available
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div 
                className="flex-1 relative"
                style={{
                  background: 'rgba(26, 17, 16, 0.8)',
                  border: '1px solid rgba(184, 115, 51, 0.3)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Search 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#B87333' }}
                />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-transparent outline-none text-sm"
                  style={{
                    color: '#F5F1E8',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                  >
                    <X size={16} style={{ color: '#B87333' }} />
                  </button>
                )}
              </div>

              {/* View Toggle and Filter */}
              <div className="flex gap-2">
                {/* View Mode */}
                <div 
                  className="flex"
                  style={{
                    background: 'rgba(26, 17, 16, 0.8)',
                    border: '1px solid rgba(184, 115, 51, 0.3)',
                  }}
                >
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-3 transition-colors ${viewMode === "grid" ? 'bg-copper-gradient' : ''}`}
                    style={{
                      background: viewMode === "grid" ? 'rgba(184, 115, 51, 0.3)' : 'transparent',
                    }}
                  >
                    <Grid3x3 size={18} style={{ color: viewMode === "grid" ? '#D4A574' : '#B87333' }} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-3 transition-colors`}
                    style={{
                      background: viewMode === "list" ? 'rgba(184, 115, 51, 0.3)' : 'transparent',
                      borderLeft: '1px solid rgba(184, 115, 51, 0.2)',
                    }}
                  >
                    <List size={18} style={{ color: viewMode === "list" ? '#D4A574' : '#B87333' }} />
                  </button>
                </div>

                {/* Filters Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-3 flex items-center gap-2"
                  style={{
                    background: showFilters ? 'rgba(184, 115, 51, 0.3)' : 'rgba(26, 17, 16, 0.8)',
                    border: '1px solid rgba(184, 115, 51, 0.3)',
                  }}
                >
                  <SlidersHorizontal size={18} style={{ color: '#B87333' }} />
                  <span className="text-sm hidden sm:inline" style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}>
                    Filters
                  </span>
                </button>
              </div>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div 
                    className="mt-3 p-4"
                    style={{
                      background: 'rgba(26, 17, 16, 0.8)',
                      border: '1px solid rgba(184, 115, 51, 0.3)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* Categories */}
                    <div className="mb-4">
                      <label className="text-xs mb-2 block" style={{ color: '#8B6F47', letterSpacing: '0.1em' }}>
                        CATEGORY
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((c) => (
                          <button
                            key={c}
                            onClick={() => setActiveCategory(c)}
                            className={`px-3 py-1.5 text-xs transition-all`}
                            style={{
                              background: activeCategory === c ? 'rgba(184, 115, 51, 0.3)' : 'rgba(61, 43, 31, 0.5)',
                              border: `1px solid ${activeCategory === c ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.2)'}`,
                              color: activeCategory === c ? '#D4A574' : '#B87333',
                              fontFamily: 'var(--font-body)',
                              fontWeight: activeCategory === c ? '600' : '400',
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="text-xs mb-2 block" style={{ color: '#8B6F47', letterSpacing: '0.1em' }}>
                        SORT BY
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "default", label: "Default" },
                          { value: "price-low", label: "Price: Low to High" },
                          { value: "price-high", label: "Price: High to Low" },
                          { value: "name", label: "Name" },
                        ].map((sort) => (
                          <button
                            key={sort.value}
                            onClick={() => setSortBy(sort.value as any)}
                            className={`px-3 py-1.5 text-xs transition-all`}
                            style={{
                              background: sortBy === sort.value ? 'rgba(184, 115, 51, 0.3)' : 'rgba(61, 43, 31, 0.5)',
                              border: `1px solid ${sortBy === sort.value ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.2)'}`,
                              color: sortBy === sort.value ? '#D4A574' : '#B87333',
                              fontFamily: 'var(--font-body)',
                              fontWeight: sortBy === sort.value ? '600' : '400',
                            }}
                          >
                            {sort.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Cart Float Button */}
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/cart")}
                className="fixed bottom-6 right-6 z-50 px-6 py-4 flex items-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
                  boxShadow: '0 10px 40px rgba(184, 115, 51, 0.5)',
                  color: '#000',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '14px',
                  letterSpacing: '0.1em',
                }}
              >
                <ShoppingCart size={20} />
                <span className="font-bold">{totalItems}</span>
                <span>₹{totalPrice}</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Menu Items */}
          {filtered.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((item, index) => (
                  <GridMenuItem
                    key={item._id}
                    item={item}
                    quantity={getQty(item._id)}
                    onAdd={() => addToCart(item._id)}
                    onRemove={() => removeFromCart(item._id)}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-w-4xl mx-auto">
                {filtered.map((item, index) => (
                  <ListMenuItem
                    key={item._id}
                    item={item}
                    quantity={getQty(item._id)}
                    onAdd={() => addToCart(item._id)}
                    onRemove={() => removeFromCart(item._id)}
                    index={index}
                  />
                ))}
              </div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl mb-2" style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}>
                NO ITEMS FOUND
              </p>
              <p className="text-sm" style={{ color: '#8B6F47' }}>
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

// Grid View Component - Compact and Modern
function GridMenuItem({
  item,
  quantity,
  onAdd,
  onRemove,
  index,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className="group relative"
      style={{
        background: 'linear-gradient(135deg, rgba(42, 24, 16, 0.9), rgba(26, 17, 16, 0.9))',
        border: '1px solid rgba(184, 115, 51, 0.2)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        <div
          className="absolute top-2 left-2 px-2 py-1 text-xs"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(184, 115, 51, 0.4)',
            color: '#D4A574',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            letterSpacing: '0.1em',
          }}
        >
          {item.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="text-base mb-1 line-clamp-1"
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#F5F1E8',
            letterSpacing: '0.03em',
          }}
        >
          {item.name}
        </h3>
        <p className="text-xs mb-3 line-clamp-2" style={{ color: '#8B6F47', lineHeight: 1.4 }}>
          {item.description}
        </p>

        {/* Price and Action */}
        <div className="flex justify-between items-center">
          <span
            className="text-xl gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ₹{item.price}
          </span>

          {quantity > 0 ? (
            <div
              className="flex items-center gap-2"
              style={{
                background: 'rgba(184, 115, 51, 0.2)',
                padding: '4px 8px',
                border: '1px solid rgba(184, 115, 51, 0.4)',
              }}
            >
              <button onClick={onRemove} className="text-[#B87333] hover:text-[#D4A574]">
                <Minus size={14} />
              </button>
              <span className="text-sm font-bold gradient-text" style={{ minWidth: '16px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button onClick={onAdd} className="text-[#B87333] hover:text-[#D4A574]">
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="px-3 py-1.5 text-xs"
              style={{
                background: 'rgba(184, 115, 51, 0.2)',
                border: '1px solid rgba(184, 115, 51, 0.4)',
                color: '#D4A574',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
              }}
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// List View Component - Sleek and Detailed
function ListMenuItem({
  item,
  quantity,
  onAdd,
  onRemove,
  index,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ x: 4 }}
      className="group"
      style={{
        background: 'linear-gradient(90deg, rgba(42, 24, 16, 0.9), rgba(26, 17, 16, 0.9))',
        border: '1px solid rgba(184, 115, 51, 0.2)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="text-base"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                    letterSpacing: '0.03em',
                  }}
                >
                  {item.name}
                </h3>
                <span
                  className="text-xs px-2 py-0.5"
                  style={{
                    background: 'rgba(184, 115, 51, 0.2)',
                    border: '1px solid rgba(184, 115, 51, 0.3)',
                    color: '#D4A574',
                    fontSize: '10px',
                  }}
                >
                  {item.category}
                </span>
              </div>
              <p className="text-xs line-clamp-2" style={{ color: '#8B6F47', lineHeight: 1.4 }}>
                {item.description}
              </p>
            </div>

            <span
              className="text-xl gradient-text flex-shrink-0"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              ₹{item.price}
            </span>
          </div>

          {/* Action */}
          <div className="flex justify-end">
            {quantity > 0 ? (
              <div
                className="flex items-center gap-3"
                style={{
                  background: 'rgba(184, 115, 51, 0.2)',
                  padding: '6px 12px',
                  border: '1px solid rgba(184, 115, 51, 0.4)',
                }}
              >
                <button onClick={onRemove} className="text-[#B87333] hover:text-[#D4A574]">
                  <Minus size={16} />
                </button>
                <span className="text-sm font-bold gradient-text" style={{ minWidth: '20px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button onClick={onAdd} className="text-[#B87333] hover:text-[#D4A574]">
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={onAdd}
                className="px-4 py-2 text-xs"
                style={{
                  background: 'rgba(184, 115, 51, 0.2)',
                  border: '1px solid rgba(184, 115, 51, 0.4)',
                  color: '#D4A574',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.05em',
                }}
              >
                ADD TO CART
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}