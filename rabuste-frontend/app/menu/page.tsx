"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ShoppingCart, Search, X, Grid3x3, List, SlidersHorizontal, TrendingUp, Flame, Star, Clock, ArrowUp } from "lucide-react";
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

// Upselling logic - suggest premium alternatives or add-ons
const getUpsellSuggestions = (item: MenuItem, allItems: MenuItem[]) => {
  const suggestions: MenuItem[] = [];
  
  // If it's a Blend item, suggest Robusta premium version
  if (item.name.includes("Blend")) {
    const robustaVersion = allItems.find(i => 
      i.name.replace("Robusta", "Blend") === item.name && i.name.includes("Robusta")
    );
    if (robustaVersion && robustaVersion._id !== item._id) {
      suggestions.push(robustaVersion);
    }
  }
  
  // Suggest bakery items with coffee
  if (item.category.includes("Coffee") || item.category.includes("Brew")) {
    const bakeryItems = allItems.filter(i => 
      i.category === "Bakery" && Math.abs(hashCode(i.name) % 3) === 0
    ).slice(0, 2);
    suggestions.push(...bakeryItems);
  }
  
  // Suggest shakes with bakery
  if (item.category === "Bakery") {
    const shakes = allItems.filter(i => i.category === "Shake").slice(0, 1);
    suggestions.push(...shakes);
  }
  
  return suggestions.slice(0, 2);
};

// Consistent hash function for flags (deterministic, won't change on reload)
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Generate consistent flags based on item name
const getItemFlags = (item: MenuItem) => {
  const hash = hashCode(item.name);
  const flags: {
    isBestseller?: boolean;
    isTrending?: boolean;
    soldToday?: number;
    stockLeft?: number;
  } = {};
  
  // Bestseller (30% of items)
  if (hash % 10 < 3) {
    flags.isBestseller = true;
  }
  
  // Trending (20% of items, different from bestsellers)
  if (hash % 11 < 2 && !flags.isBestseller) {
    flags.isTrending = true;
  }
  
  // Sold today (50% of items)
  if (hash % 2 === 0) {
    flags.soldToday = 5 + (hash % 20);
  }
  
  // Limited stock (15% of items)
  if (hash % 7 === 0) {
    flags.stockLeft = 3 + (hash % 5);
  }
  
  return flags;
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
  const [upsellModal, setUpsellModal] = useState<{ item: MenuItem; suggestions: MenuItem[] } | null>(null);
  const [quickFilter, setQuickFilter] = useState<"all" | "trending" | "bestseller" | "limited">("all");

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

  async function addToCart(menuItemId: string, showUpsell = true) {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId, quantity: 1 }),
    });
    fetchCart();
    
    // Show upsell suggestions after adding to cart
    if (showUpsell) {
      const item = menu.find(i => i._id === menuItemId);
      if (item) {
        const suggestions = getUpsellSuggestions(item, menu);
        if (suggestions.length > 0) {
          setUpsellModal({ item, suggestions });
        }
      }
    }
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
    
    // Quick filter logic
    if (quickFilter !== "all") {
      const flags = getItemFlags(item);
      if (quickFilter === "trending" && !flags.isTrending) return false;
      if (quickFilter === "bestseller" && !flags.isBestseller) return false;
      if (quickFilter === "limited" && !flags.stockLeft) return false;
    }
    
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

          {/* Quick Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap gap-3"
          >
            <button
              onClick={() => setQuickFilter("all")}
              className={`px-4 py-2 flex items-center gap-2 transition-all`}
              style={{
                background: quickFilter === "all" ? 'rgba(184, 115, 51, 0.3)' : 'rgba(26, 17, 16, 0.8)',
                border: `2px solid ${quickFilter === "all" ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                color: quickFilter === "all" ? '#D4A574' : '#B87333',
                fontFamily: 'var(--font-heading)',
                fontSize: '14px',
                letterSpacing: '0.05em',
              }}
            >
              ALL ITEMS
            </button>
            <button
              onClick={() => setQuickFilter("bestseller")}
              className={`px-4 py-2 flex items-center gap-2 transition-all`}
              style={{
                background: quickFilter === "bestseller" ? 'rgba(184, 115, 51, 0.3)' : 'rgba(26, 17, 16, 0.8)',
                border: `2px solid ${quickFilter === "bestseller" ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                color: quickFilter === "bestseller" ? '#D4A574' : '#B87333',
                fontFamily: 'var(--font-heading)',
                fontSize: '14px',
                letterSpacing: '0.05em',
              }}
            >
              <Star size={16} fill={quickFilter === "bestseller" ? '#D4A574' : 'none'} />
              BESTSELLERS
            </button>
            <button
              onClick={() => setQuickFilter("trending")}
              className={`px-4 py-2 flex items-center gap-2 transition-all`}
              style={{
                background: quickFilter === "trending" ? 'rgba(255, 107, 107, 0.3)' : 'rgba(26, 17, 16, 0.8)',
                border: `2px solid ${quickFilter === "trending" ? 'rgba(255, 107, 107, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                color: quickFilter === "trending" ? '#FF6B6B' : '#B87333',
                fontFamily: 'var(--font-heading)',
                fontSize: '14px',
                letterSpacing: '0.05em',
              }}
            >
              <Flame size={16} />
              TRENDING
            </button>
            <button
              onClick={() => setQuickFilter("limited")}
              className={`px-4 py-2 flex items-center gap-2 transition-all`}
              style={{
                background: quickFilter === "limited" ? 'rgba(255, 183, 77, 0.3)' : 'rgba(26, 17, 16, 0.8)',
                border: `2px solid ${quickFilter === "limited" ? 'rgba(255, 183, 77, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                color: quickFilter === "limited" ? '#FFB74D' : '#B87333',
                fontFamily: 'var(--font-heading)',
                fontSize: '14px',
                letterSpacing: '0.05em',
              }}
            >
              <Clock size={16} />
              LIMITED STOCK
            </button>
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
            activeCategory === "All" ? (
              // Show category-separated view for "All"
              <div className="space-y-12">
                {categories.filter(c => c !== "All").map((category) => {
                  const categoryItems = filtered.filter(item => item.category === category);
                  if (categoryItems.length === 0) return null;
                  
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {/* Category Header */}
                      <div className="mb-6 text-center">
                        <div className="inline-flex items-center gap-4">
                          <div 
                            className="w-16 h-px"
                            style={{ background: 'linear-gradient(90deg, transparent, #B87333)' }}
                          />
                          <h2
                            className="text-2xl md:text-4xl"
                            style={{
                              fontFamily: 'var(--font-heading)',
                              color: '#F5F1E8',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {category}
                          </h2>
                          <div 
                            className="w-16 h-px"
                            style={{ background: 'linear-gradient(90deg, #B87333, transparent)' }}
                          />
                        </div>
                        <p className="text-xs mt-2" style={{ color: '#8B6F47' }}>
                          {categoryItems.length} items
                        </p>
                      </div>

                      {/* Category Items Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {categoryItems.map((item, index) => (
                          <GridMenuItem
                            key={item._id}
                            item={item}
                            quantity={getQty(item._id)}
                            onAdd={() => addToCart(item._id)}
                            onRemove={() => removeFromCart(item._id)}
                            index={index}
                            flags={getItemFlags(item)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // Show normal grid/list for specific category
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
                      flags={getItemFlags(item)}
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
                      flags={getItemFlags(item)}
                    />
                  ))}
                </div>
              )
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

          {/* Upsell Modal */}
      <AnimatePresence>
        {upsellModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)' }}
            onClick={() => setUpsellModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(42, 24, 16, 0.98), rgba(26, 17, 16, 0.98))',
                border: '2px solid rgba(184, 115, 51, 0.4)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={24} style={{ color: '#B87333' }} />
                <h3
                  className="text-2xl"
                  style={{ fontFamily: 'var(--font-heading)', color: '#F5F1E8' }}
                >
                  COMPLETE YOUR ORDER
                </h3>
              </div>

              <p className="text-sm mb-6" style={{ color: '#8B6F47' }}>
                Customers who ordered <span className="gradient-text font-bold">{upsellModal.item.name}</span> also loved:
              </p>

              <div className="grid gap-4 mb-6">
                {upsellModal.suggestions.map((suggestion) => {
                  const suggestionQty = getQty(suggestion._id);
                  return (
                    <div
                      key={suggestion._id}
                      className="flex gap-4 p-4"
                      style={{
                        background: 'rgba(61, 43, 31, 0.5)',
                        border: '1px solid rgba(184, 115, 51, 0.3)',
                      }}
                    >
                      <img
                        src={suggestion.image}
                        alt={suggestion.name}
                        className="w-20 h-20 object-cover"
                      />
                      <div className="flex-1">
                        <h4
                          className="text-base mb-1"
                          style={{ fontFamily: 'var(--font-heading)', color: '#F5F1E8' }}
                        >
                          {suggestion.name}
                        </h4>
                        <p className="text-xs mb-2" style={{ color: '#8B6F47' }}>
                          {suggestion.description}
                        </p>
                        <span className="text-lg gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
                          ₹{suggestion.price}
                        </span>
                      </div>
                      {suggestionQty > 0 ? (
                        <div
                          className="flex items-center gap-3 self-center"
                          style={{
                            background: 'rgba(184, 115, 51, 0.3)',
                            padding: '6px 12px',
                            border: '1px solid rgba(184, 115, 51, 0.5)',
                          }}
                        >
                          <button
                            onClick={() => removeFromCart(suggestion._id)}
                            className="text-[#B87333] hover:text-[#D4A574]"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-sm font-bold gradient-text" style={{ minWidth: '20px', textAlign: 'center' }}>
                            {suggestionQty}
                          </span>
                          <button
                            onClick={() => addToCart(suggestion._id, false)}
                            className="text-[#B87333] hover:text-[#D4A574]"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(suggestion._id, false)}
                          className="px-4 py-2 self-center"
                          style={{
                            background: 'rgba(184, 115, 51, 0.3)',
                            border: '1px solid rgba(184, 115, 51, 0.5)',
                            color: '#D4A574',
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                          }}
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setUpsellModal(null)}
                className="w-full py-3"
                style={{
                  background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
                  color: '#000',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.1em',
                }}
              >
                CONTINUE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

// Grid View Component with Flags
function GridMenuItem({
  item,
  quantity,
  onAdd,
  onRemove,
  index,
  flags,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  index: number;
  flags: any;
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
        
        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {flags.isBestseller && (
            <div
              className="px-2 py-1 text-xs flex items-center gap-1"
              style={{
                background: 'rgba(184, 115, 51, 0.95)',
                color: '#000',
                fontFamily: 'var(--font-heading)',
                fontSize: '10px',
                letterSpacing: '0.1em',
              }}
            >
              <Star size={10} fill="#000" />
              BESTSELLER
            </div>
          )}
          {flags.isTrending && (
            <div
              className="px-2 py-1 text-xs flex items-center gap-1"
              style={{
                background: 'rgba(255, 107, 107, 0.95)',
                color: '#000',
                fontFamily: 'var(--font-heading)',
                fontSize: '10px',
                letterSpacing: '0.1em',
              }}
            >
              <Flame size={10} />
              TRENDING
            </div>
          )}
        </div>

        {/* Category Badge */}
        <div
          className="absolute bottom-2 left-2 px-2 py-1 text-xs"
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

        {/* Activity Indicators */}
        <div className="flex flex-wrap gap-2 mb-3 text-xs">
          {flags.soldToday && (
            <div className="flex items-center gap-1" style={{ color: '#B87333' }}>
              <TrendingUp size={12} />
              <span>{flags.soldToday} sold today</span>
            </div>
          )}
          {flags.stockLeft && (
            <div className="flex items-center gap-1" style={{ color: '#FF6B6B' }}>
              <Clock size={12} />
              <span>Only {flags.stockLeft} left!</span>
            </div>
          )}
        </div>

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
              className="px-3 py-1.5 text-xs flex items-center gap-1"
              style={{
                background: 'rgba(184, 115, 51, 0.2)',
                border: '1px solid rgba(184, 115, 51, 0.4)',
                color: '#D4A574',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
              }}
            >
              <Plus size={12} />
              ADD
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// List View Component with Flags
function ListMenuItem({
  item,
  quantity,
  onAdd,
  onRemove,
  index,
  flags,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  index: number;
  flags: any;
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
              <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                {flags.isBestseller && (
                  <span
                    className="text-xs px-2 py-0.5 flex items-center gap-1"
                    style={{
                      background: 'rgba(184, 115, 51, 0.3)',
                      border: '1px solid rgba(184, 115, 51, 0.5)',
                      color: '#D4A574',
                      fontSize: '10px',
                    }}
                  >
                    <Star size={10} fill="#D4A574" />
                    BESTSELLER
                  </span>
                )}
                {flags.isTrending && (
                  <span
                    className="text-xs px-2 py-0.5 flex items-center gap-1"
                    style={{
                      background: 'rgba(255, 107, 107, 0.3)',
                      border: '1px solid rgba(255, 107, 107, 0.5)',
                      color: '#FF6B6B',
                      fontSize: '10px',
                    }}
                  >
                    <Flame size={10} />
                    TRENDING
                  </span>
                )}
              </div>
              <p className="text-xs line-clamp-2 mb-2" style={{ color: '#8B6F47', lineHeight: 1.4 }}>
                {item.description}
              </p>
              
              {/* Activity */}
              <div className="flex flex-wrap gap-3 text-xs">
                <span
                  className="px-2 py-0.5"
                  style={{
                    background: 'rgba(184, 115, 51, 0.2)',
                    color: '#B87333',
                    fontSize: '10px',
                  }}
                >
                  {item.category}
                </span>
                {flags.soldToday && (
                  <span className="flex items-center gap-1" style={{ color: '#B87333' }}>
                    <TrendingUp size={10} />
                    {flags.soldToday} sold today
                  </span>
                )}
                {flags.stockLeft && (
                  <span className="flex items-center gap-1" style={{ color: '#FF6B6B' }}>
                    <Clock size={10} />
                    Only {flags.stockLeft} left!
                  </span>
                )}
              </div>
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