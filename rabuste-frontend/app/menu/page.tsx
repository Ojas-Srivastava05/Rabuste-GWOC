"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ShoppingCart, Search, X, Grid3x3, List, SlidersHorizontal, TrendingUp, Flame, Star, Clock, CheckCircle, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useUser } from "@/contexts/UserContext";

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type CartItem = {
  menuItem?: string;
  artItem?: string;
  itemType: "menu" | "art";
  name: string;
  price: number;
  quantity: number;
  image?: string;
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
import { trackAddToCart, trackRemoveFromCart, trackMenuItemView, trackSearch } from "@/lib/analytics";

export default function MenuPage() {
  const router = useRouter();
  const { user } = useUser();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [aiDiscount, setAiDiscount] = useState<{ enableDiscountAI: boolean; discountItemId: string | null; discountPercent: number }>(
    { enableDiscountAI: false, discountItemId: null, discountPercent: 0 }
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "name">("default");
  const [showFilters, setShowFilters] = useState(false);
  const [upsellModal, setUpsellModal] = useState<{ item: MenuItem; suggestions: MenuItem[] } | null>(null);
  const [quickFilter, setQuickFilter] = useState<"all" | "trending" | "bestseller" | "limited">("all");
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addedToast, setAddedToast] = useState<{ show: boolean; itemName: string }>({ show: false, itemName: '' });
  const [additionCount, setAdditionCount] = useState(0);

  useEffect(() => {
    // Parallel fetch for better performance
    Promise.all([
      fetchMenu(),
      fetchCart(),
      fetchAIDiscount(),
    ]).catch(err => console.error('Failed to fetch initial data:', err));
    
    // Load addition count from session storage
    const count = sessionStorage.getItem('additionCount');
    if (count) {
      setAdditionCount(parseInt(count, 10));
    }

    // Load favorites from localStorage based on user ID
    if (user?.id) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user?.id]);

  // Handle scrolling to specific item from hash
  useEffect(() => {
    const handleHashScroll = () => {
      if (menu.length > 0 && typeof window !== 'undefined') {
        const hash = window.location.hash;
        if (hash.startsWith('#item-')) {
          const itemId = hash.replace('#item-', '');
          // Wait for DOM to render and ensure menu items are loaded
          setTimeout(() => {
            const element = document.getElementById(`item-${itemId}`);
            if (element) {
              // Scroll to element with offset for navbar
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset for navbar
              
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
              
              // Set highlighted item for premium animation
              setHighlightedItemId(itemId);
              // Remove highlight after 4 seconds
              setTimeout(() => {
                setHighlightedItemId(null);
              }, 4000);
            }
          }, 800); // Increased timeout to ensure DOM is ready
        }
      }
    };

    // Handle initial hash
    handleHashScroll();

    // Handle hash changes
    const handleHashChange = () => {
      handleHashScroll();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [menu]);

  async function fetchMenu() {
    try {
      const res = await fetch("/api/menu", { 
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      console.error("Failed to fetch menu", err);
    }
  }

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart", { 
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  }

  async function fetchAIDiscount() {
    try {
      const res = await fetch("/api/ai-discount", { 
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      const data = await res.json();
      // Ensure discountItemId is converted to string
      setAiDiscount({
        enableDiscountAI: data.enableDiscountAI || false,
        discountItemId: data.discountItemId ? String(data.discountItemId) : null,
        discountPercent: data.discountPercent || 0,
      });
    } catch (err) {
      console.error("Failed to fetch AI discount", err);
    }
  }

  async function addToCart(menuItemId: string, showUpsell = true) {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId, quantity: 1 }),
    });
    fetchCart();
    
    const item = menu.find(i => i._id === menuItemId);
    
    // Track add to cart
    if (item) {
      trackAddToCart({
        itemId: item._id,
        itemName: item.name,
        itemType: 'menu',
        price: item.price,
        quantity: 1,
        category: item.category,
      });
    }
    
    // Check user preference for upselling
    const disableUpsell = localStorage.getItem('disableUpsell') === 'true';
    
    if (showUpsell && !disableUpsell && item) {
      // Increment addition count
      const newCount = additionCount + 1;
      setAdditionCount(newCount);
      sessionStorage.setItem('additionCount', newCount.toString());
      
      // Only show upsell modal every 3rd addition
      if (newCount % 3 === 0) {
        const suggestions = getUpsellSuggestions(item, menu);
        if (suggestions.length > 0) {
          setUpsellModal({ item, suggestions });
          return;
        }
      }
    }
    
    // Show subtle success toast for all other additions
    if (item) {
      setAddedToast({ show: true, itemName: item.name });
      setTimeout(() => {
        setAddedToast({ show: false, itemName: '' });
      }, 2000);
    }
  }

  async function removeFromCart(menuItemId: string) {
    const item = menu.find(i => i._id === menuItemId);
    
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId, quantity: -1 }),
    });
    fetchCart();
    
    // Track remove from cart
    if (item) {
      trackRemoveFromCart(item._id, item.name, 'menu');
    }
  }

  function getQty(menuItemId: string) {
    return cart?.items.find((i) => i.itemType === "menu" && i.menuItem === menuItemId)?.quantity || 0;
  }

  // AI Discount helper functions
  function hasAIDiscount(itemId: string): boolean {
    if (!aiDiscount.enableDiscountAI || !aiDiscount.discountItemId || aiDiscount.discountPercent <= 0) {
      return false;
    }
    // Ensure both are strings for comparison (handle ObjectId conversion)
    const discountId = String(aiDiscount.discountItemId);
    const itemIdStr = String(itemId);
    return discountId === itemIdStr;
  }

  function getDiscountedPrice(item: MenuItem): number {
    if (hasAIDiscount(item._id)) {
      const discounted = item.price * (1 - aiDiscount.discountPercent / 100);
      return Math.ceil(discounted); // Round up to nearest integer
    }
    return item.price;
  }

  function getOriginalPrice(item: MenuItem): number {
    return item.price;
  }

  // Favorite functions - user-specific
  const toggleFavorite = (itemId: string) => {
    if (!user?.id) {
      // If not logged in, redirect to login
      router.push('/auth?redirect=/menu');
      return;
    }

    const storageKey = `favorites_${user.id}`;
    const storedFavorites = localStorage.getItem(storageKey);
    let favoriteIds: string[] = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    if (favoriteIds.includes(itemId)) {
      favoriteIds = favoriteIds.filter(id => id !== itemId);
    } else {
      favoriteIds.push(itemId);
    }
    
    localStorage.setItem(storageKey, JSON.stringify(favoriteIds));
    setFavorites(favoriteIds);
  };

  const isFavorite = (itemId: string): boolean => {
    if (!user?.id) return false;
    return favorites.includes(itemId);
  };

  const totalItems = cart?.items.filter((i) => i.itemType === "menu").reduce((s, i) => s + i.quantity, 0) || 0;
  const totalPrice = cart?.items.filter((i) => i.itemType === "menu").reduce((s, i) => s + (i.price * i.quantity), 0) || 0;

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

  // Generate Product Schema for menu items
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: menu.slice(0, 10).map((item, index) => ({
      '@type': 'Product',
      position: index + 1,
      name: item.name,
      description: item.description,
      image: item.image,
      category: item.category,
      offers: {
        '@type': 'Offer',
        price: item.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/menu#item-${item._id}`,
      },
      brand: {
        '@type': 'Brand',
        name: 'Rabuste',
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Coffee Type',
          value: 'Robusta Coffee',
        },
        {
          '@type': 'PropertyValue',
          name: 'Caffeine Content',
          value: '2X Caffeine',
        },
      ],
    })),
  };

  return (
    <>
      {/* Product Schema for SEO */}
      <Script
        id="menu-products-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <Navbar />
      <DynamicBackground />

      <div className="min-h-screen" style={{ paddingTop: '120px', paddingBottom: '80px', background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
        <div className="container px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-4 mb-6"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B87333]" />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}>
                PREMIUM ROBUSTA COFFEE
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B87333]" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                lineHeight: 0.9,
                color: '#F5F1E8',
              }}
            >
              <span className="gradient-text">RABUSTE COFFEE MENU</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg"
              style={{ color: '#B87333' }}
            >
              Premium Robusta Coffee - {filtered.length} {filtered.length === 1 ? 'item' : 'items'} available. Buy the best Robusta coffee online with 2x caffeine.
            </motion.p>
          </div>

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
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery && searchQuery !== lastSearchQuery) {
                      trackSearch(searchQuery, filtered.length);
                      setLastSearchQuery(searchQuery);
                    }
                  }}
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
            className="mb-6 space-y-4"
          >
            {/* Special Filters Row */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button
                onClick={() => {
                  setQuickFilter("all");
                  setActiveCategory("All");
                }}
                className={`px-4 py-2 flex items-center gap-2 transition-all`}
                style={{
                  background: quickFilter === "all" && activeCategory === "All" ? 'rgba(184, 115, 51, 0.3)' : 'rgba(26, 17, 16, 0.8)',
                  border: `2px solid ${quickFilter === "all" && activeCategory === "All" ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                  color: quickFilter === "all" && activeCategory === "All" ? '#D4A574' : '#B87333',
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
            </div>

            {/* Category Filters Row */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="h-px flex-1"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.3))' }}
                />
                <span 
                  className="text-xs uppercase tracking-wider whitespace-nowrap"
                  style={{ color: '#8B6F47', fontFamily: 'var(--font-body)' }}
                >
                  BROWSE BY CATEGORY
                </span>
                <div 
                  className="h-px flex-1"
                  style={{ background: 'linear-gradient(90deg, rgba(184, 115, 51, 0.3), transparent)' }}
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {categories.filter(c => c !== "All").map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setQuickFilter("all");
                    }}
                    className={`px-4 py-2 transition-all whitespace-nowrap flex-shrink-0`}
                    style={{
                      background: activeCategory === category ? 'rgba(205, 127, 50, 0.3)' : 'rgba(26, 17, 16, 0.8)',
                      border: `2px solid ${activeCategory === category ? 'rgba(205, 127, 50, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                      color: activeCategory === category ? '#F5F1E8' : '#B87333',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '14px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
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
              activeCategory === "All" ? (
                // Show horizontal scrolling view for "All" category on mobile
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

                        {/* Category Items - Horizontal scrolling on mobile, grid on desktop */}
                        <div className="md:hidden flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          {categoryItems.map((item, index) => (
                            <div key={item._id} className="flex-shrink-0 snap-start" style={{ width: 'calc(50% - 6px)' }}>
                              <GridMenuItem
                                item={item}
                                quantity={getQty(item._id)}
                                onAdd={() => addToCart(item._id)}
                                onRemove={() => removeFromCart(item._id)}
                                onFavorite={user?.id ? () => toggleFavorite(item._id) : undefined}
                                isFavorite={isFavorite(item._id)}
                                index={index}
                                flags={getItemFlags(item)}
                                isHighlighted={highlightedItemId === item._id}
                                hasAIDiscount={hasAIDiscount(item._id)}
                                discountedPrice={getDiscountedPrice(item)}
                                originalPrice={getOriginalPrice(item)}
                                discountPercent={aiDiscount.discountPercent}
                              />
                            </div>
                          ))}
                        </div>
                        {/* Desktop grid view */}
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {categoryItems.map((item, index) => (
                            <GridMenuItem
                              key={item._id}
                              item={item}
                              quantity={getQty(item._id)}
                              onAdd={() => addToCart(item._id)}
                              onRemove={() => removeFromCart(item._id)}
                              onFavorite={() => toggleFavorite(item._id)}
                              isFavorite={isFavorite(item._id)}
                              index={index}
                              flags={getItemFlags(item)}
                              isHighlighted={highlightedItemId === item._id}
                              hasAIDiscount={hasAIDiscount(item._id)}
                              discountedPrice={getDiscountedPrice(item)}
                              originalPrice={getOriginalPrice(item)}
                              discountPercent={aiDiscount.discountPercent}
                            />
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                // Show grid for specific category (2 cols on mobile, more on desktop)
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {filtered.map((item, index) => (
                    <GridMenuItem
                      key={item._id}
                      item={item}
                      quantity={getQty(item._id)}
                      onAdd={() => addToCart(item._id)}
                      onRemove={() => removeFromCart(item._id)}
                      onFavorite={() => toggleFavorite(item._id)}
                      isFavorite={isFavorite(item._id)}
                      index={index}
                      flags={getItemFlags(item)}
                      isHighlighted={highlightedItemId === item._id}
                      hasAIDiscount={hasAIDiscount(item._id)}
                      discountedPrice={getDiscountedPrice(item)}
                      originalPrice={getOriginalPrice(item)}
                      discountPercent={aiDiscount.discountPercent}
                    />
                  ))}
                </div>
              )
            ) : (
              // List view - works for all categories
              <div className="space-y-3 max-w-4xl mx-auto">
                {filtered.map((item, index) => (
                  <ListMenuItem
                    key={item._id}
                    item={item}
                    quantity={getQty(item._id)}
                    onAdd={() => addToCart(item._id)}
                    onRemove={() => removeFromCart(item._id)}
                    onFavorite={user?.id ? () => toggleFavorite(item._id) : undefined}
                    isFavorite={isFavorite(item._id)}
                    index={index}
                    flags={getItemFlags(item)}
                    isHighlighted={highlightedItemId === item._id}
                    hasAIDiscount={hasAIDiscount(item._id)}
                    discountedPrice={getDiscountedPrice(item)}
                    originalPrice={getOriginalPrice(item)}
                    discountPercent={aiDiscount.discountPercent}
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

          {/* Success Toast */}
      <AnimatePresence>
        {addedToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 right-6 z-[100] flex items-center gap-3 px-6 py-4 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(42, 24, 16, 0.98), rgba(26, 17, 16, 0.98))',
              border: '2px solid rgba(111, 143, 114, 0.6)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
              maxWidth: '400px',
            }}
          >
            <CheckCircle size={20} style={{ color: '#5E7D4C' }} />
            <p style={{ color: '#F5F1E8', fontFamily: 'var(--font-body)' }}>
              <strong className="gradient-text">{addedToast.itemName}</strong> added to cart
            </p>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp size={24} style={{ color: '#B87333' }} />
                  <h3
                    className="text-2xl"
                    style={{ fontFamily: 'var(--font-heading)', color: '#F5F1E8' }}
                  >
                    COMPLETE YOUR ORDER
                  </h3>
                </div>
                <button
                  onClick={() => setUpsellModal(null)}
                  className="text-[#8B6F47] hover:text-[#B87333] transition-colors"
                >
                  <X size={24} />
                </button>
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

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    localStorage.setItem('disableUpsell', 'true');
                    setUpsellModal(null);
                  }}
                  className="flex-1 py-3 text-sm"
                  style={{
                    background: 'rgba(139, 111, 71, 0.2)',
                    border: '1px solid rgba(139, 111, 71, 0.4)',
                    color: '#8B6F47',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Don't show again
                </button>
                <button
                  onClick={() => setUpsellModal(null)}
                  className="flex-1 py-3"
                  style={{
                    background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
                    color: '#000',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.1em',
                }}
              >
                CONTINUE
              </button>
              </div>
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
  onFavorite,
  isFavorite,
  index,
  flags,
  isHighlighted,
  hasAIDiscount,
  discountedPrice,
  originalPrice,
  discountPercent,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onFavorite?: () => void;
  isFavorite: boolean;
  index: number;
  flags: any;
  isHighlighted?: boolean;
  hasAIDiscount?: boolean;
  discountedPrice?: number;
  originalPrice?: number;
  discountPercent?: number;
}) {
  return (
    <motion.div
      id={`item-${item._id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isHighlighted ? [1, 1.05, 1.02, 1] : 1,
      }}
      transition={{ 
        delay: index * 0.03,
        scale: { duration: 0.6, ease: "easeOut" }
      }}
      whileHover={{ scale: 1.02 }}
      className="group relative flex flex-col h-full"
      style={{
        ...(isHighlighted ? {
          backgroundImage: 'linear-gradient(135deg, rgba(61, 43, 31, 0.95), rgba(42, 24, 16, 0.95)), linear-gradient(135deg, #B87333, #CD7F32, #D4A574, #B87333)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          border: '3px solid transparent',
          boxShadow: '0 0 0 1px rgba(184, 115, 51, 0.3), 0 0 40px rgba(184, 115, 51, 0.6), 0 0 80px rgba(205, 127, 50, 0.4), 0 20px 60px rgba(0, 0, 0, 0.8), inset 0 0 60px rgba(184, 115, 51, 0.15)',
        } : {
          backgroundImage: 'linear-gradient(135deg, rgba(42, 24, 16, 0.9), rgba(26, 17, 16, 0.9))',
          border: '1px solid rgba(184, 115, 51, 0.2)',
        }),
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      {/* Premium Highlight Glow Overlay */}
      {isHighlighted && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0.15] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(212, 165, 116, 0.4), rgba(184, 115, 51, 0.2), transparent 70%)',
              zIndex: 1,
            }}
          />
          <motion.div
            animate={{ 
              rotate: [0, 360],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(184, 115, 51, 0.3), transparent, rgba(205, 127, 50, 0.3), transparent)',
              zIndex: 0,
            }}
          />
        </>
      )}
      {/* Image */}
      <div className="w-full h-40 overflow-hidden relative flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Favorite Button - Only show if logged in */}
        {onFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onFavorite();
            }}
            className="absolute top-2 right-2 p-2 rounded-full transition-all hover:scale-110"
            style={{
              background: isFavorite ? 'rgba(220, 38, 38, 0.9)' : 'rgba(0, 0, 0, 0.6)',
              border: `2px solid ${isFavorite ? '#DC2626' : 'rgba(184, 115, 51, 0.4)'}`,
              backdropFilter: 'blur(10px)',
              zIndex: 20,
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
          >
            <Heart size={16} fill={isFavorite ? '#FFFFFF' : 'transparent'} color={isFavorite ? '#FFFFFF' : '#B87333'} strokeWidth={2.5} />
          </button>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasAIDiscount && (
            <div
              className="px-2 py-1 text-xs flex items-center gap-1"
              style={{
                background: 'rgba(76, 175, 80, 0.95)',
                color: '#000',
                fontFamily: 'var(--font-heading)',
                fontSize: '10px',
                letterSpacing: '0.1em',
              }}
            >
              🤖 {discountPercent}% OFF
            </div>
          )}
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
      <div className="p-4 flex flex-col flex-1" style={{ position: 'relative', zIndex: 10 }}>
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
        <p className="text-xs mb-3 line-clamp-2" style={{ color: '#8B6F47', lineHeight: 1.4, minHeight: '32px' }}>
          {item.description}
        </p>

        {/* Activity Indicators */}
        <div className="flex flex-wrap gap-2 mb-3 text-xs min-h-[20px]">
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
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            {hasAIDiscount ? (
              <>
                <span
                  className="text-xl gradient-text"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  ₹{Math.ceil(discountedPrice || 0)}
                </span>
                <span
                  className="text-sm line-through opacity-60"
                  style={{ color: '#8B6F47' }}
                >
                  ₹{originalPrice}
                </span>
              </>
            ) : (
              <span
                className="text-xl gradient-text"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                ₹{item.price}
              </span>
            )}
          </div>

          {quantity > 0 ? (
            <div
              className="flex items-center gap-2"
              style={{
                background: 'rgba(184, 115, 51, 0.2)',
                padding: '4px 8px',
                border: '1px solid rgba(184, 115, 51, 0.4)',
                position: 'relative',
                zIndex: 10,
              }}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onRemove();
                }} 
                className="text-[#B87333] hover:text-[#D4A574]"
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-bold gradient-text" style={{ minWidth: '16px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onAdd();
                }} 
                className="text-[#B87333] hover:text-[#D4A574]"
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onAdd();
              }}
              className="px-3 py-1.5 text-xs flex items-center gap-1"
              style={{
                background: 'rgba(184, 115, 51, 0.2)',
                border: '1px solid rgba(184, 115, 51, 0.4)',
                color: '#D4A574',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                pointerEvents: 'auto',
                position: 'relative',
                zIndex: 10,
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
  onFavorite,
  isFavorite,
  index,
  flags,
  isHighlighted,
  hasAIDiscount,
  discountedPrice,
  originalPrice,
  discountPercent,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onFavorite?: () => void;
  isFavorite: boolean;
  index: number;
  flags: any;
  isHighlighted?: boolean;
  hasAIDiscount?: boolean;
  discountedPrice?: number;
  originalPrice?: number;
  discountPercent?: number;
}) {
  return (
    <motion.div
      id={`item-${item._id}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        scale: isHighlighted ? [1, 1.02, 1.01, 1] : 1,
      }}
      transition={{ 
        delay: index * 0.03,
        scale: { duration: 0.6, ease: "easeOut" }
      }}
      whileHover={{ scale: 1.01 }}
      className="group relative"
      style={{
        ...(isHighlighted ? {
          backgroundImage: 'linear-gradient(90deg, rgba(61, 43, 31, 0.95), rgba(42, 24, 16, 0.95)), linear-gradient(135deg, #B87333, #CD7F32, #D4A574, #B87333)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          border: '3px solid transparent',
          boxShadow: '0 0 0 1px rgba(184, 115, 51, 0.3), 0 0 40px rgba(184, 115, 51, 0.6), 0 0 80px rgba(205, 127, 50, 0.4), 0 20px 60px rgba(0, 0, 0, 0.8), inset 0 0 60px rgba(184, 115, 51, 0.15)',
        } : {
          backgroundImage: 'linear-gradient(90deg, rgba(42, 24, 16, 0.9), rgba(26, 17, 16, 0.9))',
          border: '1px solid rgba(184, 115, 51, 0.2)',
        }),
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Premium Highlight Glow Overlay */}
      {isHighlighted && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0.15] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(212, 165, 116, 0.4), rgba(184, 115, 51, 0.2), transparent 70%)',
              zIndex: 1,
            }}
          />
          <motion.div
            animate={{ 
              rotate: [0, 360],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(184, 115, 51, 0.3), transparent, rgba(205, 127, 50, 0.3), transparent)',
              zIndex: 0,
            }}
          />
        </>
      )}
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Favorite Button - Only show if logged in */}
          {onFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onFavorite();
              }}
              className="absolute top-1 right-1 p-1.5 rounded-full transition-all hover:scale-110"
              style={{
                background: isFavorite ? 'rgba(220, 38, 38, 0.9)' : 'rgba(0, 0, 0, 0.6)',
                border: `1.5px solid ${isFavorite ? '#DC2626' : 'rgba(184, 115, 51, 0.4)'}`,
                backdropFilter: 'blur(10px)',
                zIndex: 20,
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
            >
              <Heart size={12} fill={isFavorite ? '#FFFFFF' : 'transparent'} color={isFavorite ? '#FFFFFF' : '#B87333'} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0" style={{ position: 'relative', zIndex: 10 }}>
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

            <div className="flex-shrink-0 text-right">
              {hasAIDiscount ? (
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm line-through opacity-70"
                      style={{ color: '#8B6F47' }}
                    >
                      ₹{originalPrice}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 bg-green-600 text-white rounded-full"
                      style={{ fontSize: '10px' }}
                    >
                      {discountPercent}% OFF
                    </span>
                  </div>
                  <span
                    className="text-xl gradient-text"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    ₹{Math.ceil(discountedPrice || 0)}
                  </span>
                </div>
              ) : (
                <span
                  className="text-xl gradient-text"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  ₹{item.price}
                </span>
              )}
            </div>
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
                  position: 'relative',
                  zIndex: 10,
                }}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onRemove();
                  }} 
                  className="text-[#B87333] hover:text-[#D4A574]"
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-bold gradient-text" style={{ minWidth: '20px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onAdd();
                  }} 
                  className="text-[#B87333] hover:text-[#D4A574]"
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onAdd();
                }}
                className="px-4 py-2 text-xs"
                style={{
                  background: 'rgba(184, 115, 51, 0.2)',
                  border: '1px solid rgba(184, 115, 51, 0.4)',
                  color: '#D4A574',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 10,
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