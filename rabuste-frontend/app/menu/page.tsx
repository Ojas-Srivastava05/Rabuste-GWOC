"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Plus, Minus, ShoppingCart, Search, X, SlidersHorizontal, TrendingUp, Flame, Star, Clock, CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Script from "next/script";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import MenuHero from "@/components/MenuHero";
import MenuCategoryCarousel from "@/components/MenuCategoryCarousel";
import Footer from "@/components/sections/footer";
import { trackAddToCart, trackRemoveFromCart, trackMenuItemView, trackSearch } from "@/lib/analytics";

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

function MenuPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [aiDiscount, setAiDiscount] = useState<{ enableDiscountAI: boolean; discountItemId: string | null; discountPercent: number }>(
    { enableDiscountAI: false, discountItemId: null, discountPercent: 0 }
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "name">("default");
  const [showFilters, setShowFilters] = useState(false);
  const [upsellModal, setUpsellModal] = useState<{ item: MenuItem; suggestions: MenuItem[] } | null>(null);
  const [quickFilter, setQuickFilter] = useState<"all" | "trending" | "bestseller" | "limited">("all");
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addedToast, setAddedToast] = useState<{ show: boolean; itemName: string }>({ show: false, itemName: '' });
  const [additionCount, setAdditionCount] = useState(0);
  const contentRef = useRef<HTMLElement>(null);
  
  // Track scroll position for carousel visibility
  const { scrollY } = useScroll();
  const carouselOpacity = useTransform(scrollY, [0, 200], [1, 1]);
  const carouselX = useTransform(scrollY, [0, 200], [0, 0]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

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

    // Auto-redirect to cart with coupon if coming from email
    const couponCode = searchParams.get('coupon');
    if (couponCode) {
      // Store coupon code in sessionStorage for cart page to auto-apply
      sessionStorage.setItem('autoApplyCoupon', couponCode);
      // Redirect to cart
      router.push('/cart');
    }
  }, [user?.id, searchParams, router]);

  // Set initial selected menu item when menu loads
  useEffect(() => {
    if (menu.length > 0 && !selectedMenuItem) {
      setSelectedMenuItem(menu[0]);
    }
  }, [menu, selectedMenuItem]);

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
            if (element && contentRef.current) {
              // Scroll within the content section
              const elementPosition = element.offsetTop;
              contentRef.current.scrollTo({
                top: elementPosition - 20,
                behavior: 'smooth'
              });
              
              // Set highlighted item for premium animation
              setHighlightedItemId(itemId);
              // Remove highlight after 4 seconds
              setTimeout(() => {
                setHighlightedItemId(null);
              }, 4000);
            }
          }, 800);
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

  const handleMenuItemHover = (item: MenuItem) => {
    setSelectedMenuItem(item);
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

      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Premium copper accent line */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, #B87333, #CD7F32, #D4A574, #CD7F32, #B87333, transparent)',
          zIndex: 100,
          boxShadow: '0 0 20px rgba(184, 115, 51, 0.5)',
        }}
      />

      <main style={{ background: 'transparent', position: 'relative', zIndex: 2, minHeight: '100vh' }}>
        {/* Fixed Hero Section on Left */}
        <section 
          className="fixed top-0 left-0"
          style={{ 
            width: '50%',
            height: '100vh',
            zIndex: 10,
          }}
        >
          {/* Left Side Gradient Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(184, 115, 51, 0.1) 0%, transparent 50%, rgba(26, 17, 16, 0.3) 100%)',
              zIndex: -1,
            }}
          />
          {selectedMenuItem && (
            <MenuHero 
              menuItem={selectedMenuItem}
              onAddToCart={() => addToCart(selectedMenuItem._id)}
              hasAIDiscount={hasAIDiscount(selectedMenuItem._id)}
              discountedPrice={getDiscountedPrice(selectedMenuItem)}
              originalPrice={getOriginalPrice(selectedMenuItem)}
              discountPercent={aiDiscount.discountPercent}
            />
          )}
        </section>

        {/* Right Carousel Section - Appears on scroll */}
        <motion.section 
          ref={contentRef}
          className="fixed right-0 top-0 overflow-y-auto"
          style={{
            width: '50%',
            height: '100vh',
            zIndex: 20,
            opacity: carouselOpacity,
            x: carouselX,
          }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(26, 17, 16, 0.5) 0%, transparent 50%, rgba(184, 115, 51, 0.1) 100%)',
              zIndex: -1,
            }}
          />

          <div className="pt-24 md:pt-28 lg:pt-32 px-6 pb-20">
            {/* Header */}
            <div className="mb-8">
              <motion.p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Browse Menu
              </motion.p>
              
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl mb-4"
                style={{
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 0.9,
                  color: '#F5F1E8',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="gradient-text">OUR MENU</span>
              </motion.h1>
            </div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div 
                className="relative"
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
                  className="w-full pl-11 pr-12 py-3 bg-transparent outline-none text-sm"
                  style={{
                    color: '#F5F1E8',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 transition-transform active:scale-90"
                  >
                    <X size={18} style={{ color: '#B87333' }} />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Quick Filter Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <button
                onClick={() => {
                  setQuickFilter("all");
                  setActiveCategory("All");
                }}
                className={`px-3 py-1.5 flex items-center gap-2 transition-all whitespace-nowrap text-xs`}
                style={{
                  background: quickFilter === "all" && activeCategory === "All" ? 'rgba(184, 115, 51, 0.3)' : 'rgba(26, 17, 16, 0.8)',
                  border: `1px solid ${quickFilter === "all" && activeCategory === "All" ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                  color: quickFilter === "all" && activeCategory === "All" ? '#D4A574' : '#B87333',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                ALL
              </button>
              <button
                onClick={() => setQuickFilter("bestseller")}
                className={`px-3 py-1.5 flex items-center gap-2 transition-all whitespace-nowrap text-xs`}
                style={{
                  background: quickFilter === "bestseller" ? 'rgba(184, 115, 51, 0.3)' : 'rgba(26, 17, 16, 0.8)',
                  border: `1px solid ${quickFilter === "bestseller" ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                  color: quickFilter === "bestseller" ? '#D4A574' : '#B87333',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <Star size={12} fill={quickFilter === "bestseller" ? '#D4A574' : 'none'} />
                BEST
              </button>
              <button
                onClick={() => setQuickFilter("trending")}
                className={`px-3 py-1.5 flex items-center gap-2 transition-all whitespace-nowrap text-xs`}
                style={{
                  background: quickFilter === "trending" ? 'rgba(255, 107, 107, 0.3)' : 'rgba(26, 17, 16, 0.8)',
                  border: `1px solid ${quickFilter === "trending" ? 'rgba(255, 107, 107, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                  color: quickFilter === "trending" ? '#FF6B6B' : '#B87333',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <Flame size={12} />
                HOT
              </button>
              <button
                onClick={() => setQuickFilter("limited")}
                className={`px-3 py-1.5 flex items-center gap-2 transition-all whitespace-nowrap text-xs`}
                style={{
                  background: quickFilter === "limited" ? 'rgba(255, 183, 77, 0.3)' : 'rgba(26, 17, 16, 0.8)',
                  border: `1px solid ${quickFilter === "limited" ? 'rgba(255, 183, 77, 0.6)' : 'rgba(184, 115, 51, 0.3)'}`,
                  color: quickFilter === "limited" ? '#FFB74D' : '#B87333',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <Clock size={12} />
                LIMITED
              </button>
            </motion.div>

            {/* Filter and Sort Button */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="mb-4 px-4 py-2 flex items-center gap-2 text-sm w-full"
              style={{
                background: showFilters ? 'rgba(184, 115, 51, 0.3)' : 'rgba(26, 17, 16, 0.8)',
                border: '1px solid rgba(184, 115, 51, 0.3)',
                color: '#B87333',
                fontFamily: 'var(--font-body)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SlidersHorizontal size={16} />
              <span>Filters & Sort</span>
            </motion.button>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div 
                    className="p-4"
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
                            onClick={() => {
                              setActiveCategory(c);
                              setQuickFilter("all");
                            }}
                            className={`px-2 py-1 text-xs transition-all`}
                            style={{
                              background: activeCategory === c ? 'rgba(184, 115, 51, 0.3)' : 'rgba(61, 43, 31, 0.5)',
                              border: `1px solid ${activeCategory === c ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.2)'}`,
                              color: activeCategory === c ? '#D4A574' : '#B87333',
                              fontFamily: 'var(--font-body)',
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
                          { value: "price-low", label: "Price ↑" },
                          { value: "price-high", label: "Price ↓" },
                          { value: "name", label: "Name" },
                        ].map((sort) => (
                          <button
                            key={sort.value}
                            onClick={() => setSortBy(sort.value as any)}
                            className={`px-2 py-1 text-xs transition-all`}
                            style={{
                              background: sortBy === sort.value ? 'rgba(184, 115, 51, 0.3)' : 'rgba(61, 43, 31, 0.5)',
                              border: `1px solid ${sortBy === sort.value ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.2)'}`,
                              color: sortBy === sort.value ? '#D4A574' : '#B87333',
                              fontFamily: 'var(--font-body)',
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

            {/* Menu Categories */}
            {categories.filter(c => c !== "All").map((category) => {
              const categoryItems = filtered.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;
              
              return (
                <MenuCategoryCarousel
                  key={category}
                  title={category}
                  items={categoryItems}
                  getQuantity={getQty}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                  onHover={handleMenuItemHover}
                  flags={Object.fromEntries(categoryItems.map(item => [item._id, getItemFlags(item)]))}
                  hasAIDiscount={hasAIDiscount}
                  getDiscountedPrice={getDiscountedPrice}
                  getOriginalPrice={getOriginalPrice}
                  discountPercent={aiDiscount.discountPercent}
                />
              );
            })}
          </div>
        </motion.section>
      </main>

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

      {/* Success Toast */}
      <AnimatePresence>
        {addedToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-6 z-[100] flex items-center gap-3 px-6 py-4 pointer-events-none"
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
              <strong className="gradient-text">{addedToast.itemName}</strong> added
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
                      <Image
                        src={suggestion.image}
                        alt={suggestion.name}
                        width={80}
                        height={80}
                        className="object-cover"
                        loading="lazy"
                        quality={75}
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

// Carousel Menu Item Component for left sidebar
function CarouselMenuItem({
  item,
  quantity,
  onAdd,
  onRemove,
  flags,
  hasAIDiscount,
  discountedPrice,
  originalPrice,
  discountPercent,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  flags: any;
  hasAIDiscount?: boolean;
  discountedPrice?: number;
  originalPrice?: number;
  discountPercent?: number;
}) {
  return (
    <motion.div
      id={`item-${item._id}`}
      whileHover={{ scale: 1.02, x: 10 }}
      className="group relative flex gap-3 cursor-pointer"
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(42, 24, 16, 0.8), rgba(26, 17, 16, 0.8))',
        border: '1px solid rgba(184, 115, 51, 0.2)',
        backdropFilter: 'blur(20px)',
        padding: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Image */}
      <div className="w-20 h-20 flex-shrink-0 overflow-hidden relative" style={{ borderRadius: '8px' }}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          quality={75}
        />
        
        {/* Badges */}
        <div className="absolute top-1 left-1 flex flex-col gap-1">
          {hasAIDiscount && (
            <div
              className="px-1 py-0.5 text-xs"
              style={{
                background: 'rgba(76, 175, 80, 0.95)',
                color: '#000',
                fontFamily: 'var(--font-heading)',
                fontSize: '8px',
                borderRadius: '4px',
              }}
            >
              🤖
            </div>
          )}
          {flags.isBestseller && (
            <div
              className="px-1 py-0.5"
              style={{
                background: 'rgba(184, 115, 51, 0.95)',
                borderRadius: '4px',
              }}
            >
              <Star size={8} fill="#000" color="#000" />
            </div>
          )}
          {flags.isTrending && (
            <div
              className="px-1 py-0.5"
              style={{
                background: 'rgba(255, 107, 107, 0.95)',
                borderRadius: '4px',
              }}
            >
              <Flame size={8} color="#000" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="text-sm mb-1 line-clamp-1"
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#F5F1E8',
            letterSpacing: '0.02em',
          }}
        >
          {item.name}
        </h3>
        <p className="text-xs mb-2 line-clamp-1" style={{ color: '#8B6F47' }}>
          {item.description}
        </p>

        {/* Price and Action */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {hasAIDiscount ? (
              <>
                <span
                  className="text-base gradient-text"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  ₹{Math.ceil(discountedPrice || 0)}
                </span>
                <span
                  className="text-xs line-through opacity-60"
                  style={{ color: '#8B6F47' }}
                >
                  ₹{originalPrice}
                </span>
              </>
            ) : (
              <span
                className="text-base gradient-text"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                ₹{item.price}
              </span>
            )}
          </div>

          {quantity > 0 ? (
            <div
              className="flex items-center gap-1"
              style={{
                background: 'rgba(184, 115, 51, 0.2)',
                padding: '4px 8px',
                border: '1px solid rgba(184, 115, 51, 0.4)',
                borderRadius: '6px',
              }}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }} 
                className="text-[#B87333] active:scale-95 transition-transform"
              >
                <Minus size={14} />
              </button>
              <span className="text-xs font-bold gradient-text" style={{ minWidth: '16px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }} 
                className="text-[#B87333] active:scale-95 transition-transform"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="px-3 py-1.5 text-xs flex items-center gap-1"
              style={{
                background: 'rgba(184, 115, 51, 0.2)',
                border: '1px solid rgba(184, 115, 51, 0.4)',
                color: '#D4A574',
                fontFamily: 'var(--font-body)',
                borderRadius: '6px',
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

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg" style={{ color: '#B87333' }}>Loading menu...</p>
        </div>
      </div>
    }>
      <MenuPageContent />
    </Suspense>
  );
}
