"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ShoppingCart, Search, X, Grid3x3, List, SlidersHorizontal, Palette, ImagePlus, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";

type ArtItem = {
  _id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  medium?: string;
  dimensions?: string;
  year?: number;
  stock: number;
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

export default function ArtGalleryPage() {
  const router = useRouter();
  const [gallery, setGallery] = useState<ArtItem[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "name">("default");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArt, setSelectedArt] = useState<ArtItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchGallery();
    fetchCart();
  }, []);

  async function fetchGallery() {
    try {
      const res = await fetch("/api/art");
      const data = await res.json();
      setGallery(data);
    } catch (err) {
      console.error("Failed to fetch gallery", err);
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

  async function addToCart(artItemId: string) {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artItemId, quantity: 1 }),
      });
      if (res.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  }

  async function removeFromCart(artItemId: string) {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artItemId, quantity: -1 }),
      });
      if (res.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error("Failed to remove from cart", err);
    }
  }

  function getQty(artItemId: string) {
    return cart?.items.find((i) => i.itemType === "art" && i.artItem === artItemId)?.quantity || 0;
  }

  const totalItems = cart?.items.filter((i) => i.itemType === "art").reduce((s, i) => s + i.quantity, 0) || 0;
  const totalPrice = cart?.items.filter((i) => i.itemType === "art").reduce((s, i) => s + (i.price * i.quantity), 0) || 0;

  const categories = ["All", ...Array.from(new Set(gallery.map((a) => a.category)))];
  
  // Filter and sort
  let filtered = gallery.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  }

  function openArtModal(art: ArtItem) {
    setSelectedArt(art);
    setCurrentImageIndex(0);
  }

  function closeArtModal() {
    setSelectedArt(null);
    setCurrentImageIndex(0);
  }

  function nextImage() {
    if (selectedArt && currentImageIndex < selectedArt.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  }

  function prevImage() {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  }

  return (
    <>
      <Navbar />
      <DynamicBackground />

      <div className="min-h-screen relative" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        {/* Premium Gradient Overlays */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(184, 115, 51, 0.03), transparent 50%), radial-gradient(ellipse at bottom, rgba(205, 127, 50, 0.02), transparent 50%)',
            zIndex: 1,
          }}
        />
        
        <div className="container px-4 md:px-6 relative z-10">
          {/* Premium Header */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16 text-center relative"
          >
            {/* Decorative Lines */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-px w-24 bg-gradient-to-r from-transparent via-[#B87333] to-transparent"
              />
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: '#B87333', fontWeight: 700 }}
              >
                CURATED COLLECTION
              </motion.span>
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-px w-24 bg-gradient-to-l from-transparent via-[#B87333] to-transparent"
              />
            </div>

            <h1
              className="text-6xl md:text-8xl mb-6 relative inline-block"
              style={{
                fontFamily: 'var(--font-heading)',
                lineHeight: 0.9,
                color: '#F5F1E8',
                letterSpacing: '-0.02em',
              }}
            >
              <span className="block mb-2">THE</span>
              <span className="gradient-text text-7xl md:text-9xl">GALLERY</span>
              
              {/* Premium Underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 w-32"
                style={{
                  background: 'linear-gradient(90deg, transparent, #B87333, #CD7F32, #B87333, transparent)',
                  boxShadow: '0 0 20px rgba(184, 115, 51, 0.5)',
                }}
              />
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-lg md:text-xl max-w-2xl mx-auto mt-8"
              style={{ color: '#8B6F47', lineHeight: 1.6 }}
            >
              Discover extraordinary artworks from visionary artists. Each piece tells a story of passion, 
              creativity, and the bold pursuit of artistic excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 flex items-center justify-center gap-8 text-sm"
              style={{ color: '#8B6F47' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#B87333] to-[#CD7F32]" />
                <span>{filtered.length} Artworks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#B87333] to-[#CD7F32]" />
                <span>{categories.length - 1} Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#B87333] to-[#CD7F32]" />
                <span>Handpicked Selection</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Premium Search and Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Premium Search */}
              <div 
                className="flex-1 relative group"
                style={{
                  background: 'linear-gradient(135deg, rgba(42, 24, 16, 0.6), rgba(26, 17, 16, 0.8))',
                  border: '2px solid rgba(184, 115, 51, 0.2)',
                  backdropFilter: 'blur(30px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)';
                  e.currentTarget.style.boxShadow = '0 12px 48px rgba(184, 115, 51, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.2)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
                }}
              >
                <Search 
                  size={20} 
                  className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#B87333' }}
                />
                <input
                  type="text"
                  placeholder="Discover artworks, artists, and masterpieces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-12 py-5 bg-transparent outline-none text-base"
                  style={{
                    color: '#F5F1E8',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                  >
                    <X size={18} style={{ color: '#B87333' }} />
                  </button>
                )}
              </div>

              {/* Premium Controls */}
              <div className="flex gap-3">
                {/* View Mode */}
                <div 
                  className="flex overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(42, 24, 16, 0.6), rgba(26, 17, 16, 0.8))',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                    backdropFilter: 'blur(30px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <button
                    onClick={() => setViewMode("grid")}
                    className="px-5 py-5 transition-all duration-300"
                    style={{
                      background: viewMode === "grid" 
                        ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.2))' 
                        : 'transparent',
                      borderRight: '1px solid rgba(184, 115, 51, 0.2)',
                    }}
                  >
                    <Grid3x3 size={20} style={{ color: viewMode === "grid" ? '#D4A574' : '#8B6F47' }} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className="px-5 py-5 transition-all duration-300"
                    style={{
                      background: viewMode === "list" 
                        ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.2))' 
                        : 'transparent',
                    }}
                  >
                    <List size={20} style={{ color: viewMode === "list" ? '#D4A574' : '#8B6F47' }} />
                  </button>
                </div>

                {/* Filters Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-5 flex items-center gap-3 transition-all duration-300"
                  style={{
                    background: showFilters 
                      ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.2))' 
                      : 'linear-gradient(135deg, rgba(42, 24, 16, 0.6), rgba(26, 17, 16, 0.8))',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                    backdropFilter: 'blur(30px)',
                    boxShadow: showFilters 
                      ? '0 12px 48px rgba(184, 115, 51, 0.3)' 
                      : '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <SlidersHorizontal size={20} style={{ color: showFilters ? '#D4A574' : '#B87333' }} />
                  <span 
                    className="text-sm hidden sm:inline uppercase tracking-wider font-medium" 
                    style={{ 
                      color: showFilters ? '#D4A574' : '#B87333',
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    Filters
                  </span>
                </button>
              </div>
            </div>

            {/* Premium Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -20 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div 
                    className="mt-6 p-8"
                    style={{
                      background: 'linear-gradient(135deg, rgba(42, 24, 16, 0.8), rgba(26, 17, 16, 0.9))',
                      border: '2px solid rgba(184, 115, 51, 0.3)',
                      backdropFilter: 'blur(30px)',
                      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {/* Categories */}
                    <div className="mb-8">
                      <label 
                        className="text-sm mb-4 block uppercase tracking-widest font-semibold flex items-center gap-2" 
                        style={{ 
                          color: '#D4A574', 
                          letterSpacing: '0.15em',
                          fontFamily: 'var(--font-heading)',
                        }}
                      >
                        <Palette size={16} />
                        CATEGORY
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {categories.map((c) => (
                          <button
                            key={c}
                            onClick={() => setActiveCategory(c)}
                            className="px-5 py-3 text-sm transition-all duration-300 hover:scale-105"
                            style={{
                              background: activeCategory === c 
                                ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.4), rgba(205, 127, 50, 0.3))' 
                                : 'rgba(61, 43, 31, 0.4)',
                              border: `2px solid ${activeCategory === c ? 'rgba(184, 115, 51, 0.8)' : 'rgba(184, 115, 51, 0.2)'}`,
                              color: activeCategory === c ? '#F5F1E8' : '#B87333',
                              fontFamily: 'var(--font-body)',
                              fontWeight: activeCategory === c ? '600' : '400',
                              textTransform: 'capitalize',
                              boxShadow: activeCategory === c ? '0 4px 16px rgba(184, 115, 51, 0.3)' : 'none',
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div 
                      className="h-px mb-8"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.3), transparent)',
                      }}
                    />

                    {/* Sort */}
                    <div>
                      <label 
                        className="text-sm mb-4 block uppercase tracking-widest font-semibold" 
                        style={{ 
                          color: '#D4A574', 
                          letterSpacing: '0.15em',
                          fontFamily: 'var(--font-heading)',
                        }}
                      >
                        SORT BY
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { value: "default", label: "Featured" },
                          { value: "price-low", label: "Price: Low to High" },
                          { value: "price-high", label: "Price: High to Low" },
                          { value: "name", label: "Alphabetical" },
                        ].map((sort) => (
                          <button
                            key={sort.value}
                            onClick={() => setSortBy(sort.value as any)}
                            className="px-5 py-3 text-sm transition-all duration-300 hover:scale-105"
                            style={{
                              background: sortBy === sort.value 
                                ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.4), rgba(205, 127, 50, 0.3))' 
                                : 'rgba(61, 43, 31, 0.4)',
                              border: `2px solid ${sortBy === sort.value ? 'rgba(184, 115, 51, 0.8)' : 'rgba(184, 115, 51, 0.2)'}`,
                              color: sortBy === sort.value ? '#F5F1E8' : '#B87333',
                              fontFamily: 'var(--font-body)',
                              fontWeight: sortBy === sort.value ? '600' : '400',
                              boxShadow: sortBy === sort.value ? '0 4px 16px rgba(184, 115, 51, 0.3)' : 'none',
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
                <span>₹{totalPrice.toLocaleString()}</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Gallery Items */}
          {filtered.length > 0 ? (
            viewMode === "grid" ? (
              activeCategory === "All" ? (
                // Show category-separated grid view for "All"
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
                        {/* Premium Category Header */}
                        <div className="mb-10 text-center relative">
                          <motion.div 
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="inline-flex items-center gap-6 relative"
                          >
                            <div 
                              className="w-24 h-0.5"
                              style={{ 
                                background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.6), #B87333)',
                                boxShadow: '0 0 10px rgba(184, 115, 51, 0.3)',
                              }}
                            />
                            <div className="relative">
                              <h2
                                className="text-3xl md:text-5xl uppercase relative z-10"
                                style={{
                                  fontFamily: 'var(--font-heading)',
                                  background: 'linear-gradient(135deg, #F5F1E8 0%, #D4A574 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  letterSpacing: '0.08em',
                                  fontWeight: 700,
                                }}
                              >
                                {category}
                              </h2>
                              {/* Text shadow effect */}
                              <div 
                                className="absolute inset-0 blur-xl"
                                style={{
                                  background: 'radial-gradient(ellipse, rgba(184, 115, 51, 0.3), transparent 70%)',
                                }}
                              />
                            </div>
                            <div 
                              className="w-24 h-0.5"
                              style={{ 
                                background: 'linear-gradient(90deg, #B87333, rgba(184, 115, 51, 0.6), transparent)',
                                boxShadow: '0 0 10px rgba(184, 115, 51, 0.3)',
                              }}
                            />
                          </motion.div>
                          <p 
                            className="text-sm mt-4 uppercase tracking-widest" 
                            style={{ 
                              color: '#8B6F47',
                              fontFamily: 'var(--font-heading)',
                              letterSpacing: '0.2em',
                            }}
                          >
                            {categoryItems.length} Masterpiece{categoryItems.length !== 1 ? 's' : ''}
                          </p>
                        </div>

                        {/* Category Items Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {categoryItems.map((item, index) => (
                            <GridArtItem
                              key={item._id}
                              item={item}
                              quantity={getQty(item._id)}
                              onAdd={() => addToCart(item._id)}
                              onRemove={() => removeFromCart(item._id)}
                              onView={() => openArtModal(item)}
                              index={index}
                            />
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                // Show normal grid for specific category
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map((item, index) => (
                    <GridArtItem
                      key={item._id}
                      item={item}
                      quantity={getQty(item._id)}
                      onAdd={() => addToCart(item._id)}
                      onRemove={() => removeFromCart(item._id)}
                      onView={() => openArtModal(item)}
                      index={index}
                    />
                  ))}
                </div>
              )
            ) : (
              // List view
              <div className="space-y-3 max-w-4xl mx-auto">
                {filtered.map((item, index) => (
                  <ListArtItem
                    key={item._id}
                    item={item}
                    quantity={getQty(item._id)}
                    onAdd={() => addToCart(item._id)}
                    onRemove={() => removeFromCart(item._id)}
                    onView={() => openArtModal(item)}
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
                NO ARTWORKS FOUND
              </p>
              <p className="text-sm" style={{ color: '#8B6F47' }}>
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Art Detail Modal */}
      <AnimatePresence>
        {selectedArt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.95)', backdropFilter: 'blur(10px)' }}
            onClick={closeArtModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(42, 24, 16, 0.98), rgba(26, 17, 16, 0.98))',
                border: '2px solid rgba(184, 115, 51, 0.4)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="p-6">
                {/* Close Button */}
                <button
                  onClick={closeArtModal}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                >
                  <X size={24} style={{ color: '#B87333' }} />
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image Gallery */}
                  <div>
                    <div className="relative aspect-square overflow-hidden rounded-sm mb-4">
                      <img
                        src={selectedArt.images[currentImageIndex]}
                        alt={selectedArt.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {selectedArt.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            disabled={currentImageIndex === 0}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors"
                          >
                            <ChevronLeft size={24} style={{ color: '#B87333' }} />
                          </button>
                          <button
                            onClick={nextImage}
                            disabled={currentImageIndex === selectedArt.images.length - 1}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors"
                          >
                            <ChevronRight size={24} style={{ color: '#B87333' }} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Navigation */}
                    {selectedArt.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedArt.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-sm"
                            style={{
                              border: idx === currentImageIndex ? '2px solid #B87333' : '2px solid transparent',
                              opacity: idx === currentImageIndex ? 1 : 0.6,
                            }}
                          >
                            <img
                              src={img}
                              alt={`${selectedArt.title} - ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <span
                      className="text-xs uppercase tracking-widest mb-2 block"
                      style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}
                    >
                      {selectedArt.category}
                    </span>

                    <h2
                      className="text-3xl md:text-4xl mb-2"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#F5F1E8',
                      }}
                    >
                      {selectedArt.title}
                    </h2>

                    <p className="text-lg mb-4" style={{ color: '#B87333' }}>
                      by {selectedArt.artist}
                    </p>

                    <p className="text-base mb-6" style={{ color: '#8B6F47', lineHeight: 1.6 }}>
                      {selectedArt.description}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4" style={{ background: 'rgba(61, 43, 31, 0.5)' }}>
                      {selectedArt.medium && (
                        <div>
                          <div className="text-xs uppercase tracking-wide mb-1" style={{ color: '#8B6F47' }}>
                            Medium
                          </div>
                          <div className="text-sm" style={{ color: '#F5F1E8' }}>
                            {selectedArt.medium}
                          </div>
                        </div>
                      )}
                      {selectedArt.dimensions && (
                        <div>
                          <div className="text-xs uppercase tracking-wide mb-1" style={{ color: '#8B6F47' }}>
                            Dimensions
                          </div>
                          <div className="text-sm" style={{ color: '#F5F1E8' }}>
                            {selectedArt.dimensions}
                          </div>
                        </div>
                      )}
                      {selectedArt.year && (
                        <div>
                          <div className="text-xs uppercase tracking-wide mb-1" style={{ color: '#8B6F47' }}>
                            Year
                          </div>
                          <div className="text-sm" style={{ color: '#F5F1E8' }}>
                            {selectedArt.year}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs uppercase tracking-wide mb-1" style={{ color: '#8B6F47' }}>
                          Stock
                        </div>
                        <div className="text-sm" style={{ color: selectedArt.stock > 0 ? '#4ADE80' : '#FF6B6B' }}>
                          {selectedArt.stock > 0 ? `${selectedArt.stock} available` : 'Out of stock'}
                        </div>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className="text-4xl gradient-text"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        ₹{selectedArt.price.toLocaleString()}
                      </span>
                    </div>

                    {selectedArt.stock > 0 ? (
                      getQty(selectedArt._id) > 0 ? (
                        <div
                          className="flex items-center justify-center gap-6 p-4"
                          style={{
                            background: 'rgba(184, 115, 51, 0.2)',
                            border: '2px solid rgba(184, 115, 51, 0.5)',
                          }}
                        >
                          <button
                            onClick={() => removeFromCart(selectedArt._id)}
                            className="text-[#B87333] hover:text-[#D4A574] transition-colors"
                          >
                            <Minus size={24} />
                          </button>
                          <span className="text-2xl font-bold gradient-text" style={{ minWidth: '40px', textAlign: 'center' }}>
                            {getQty(selectedArt._id)}
                          </span>
                          <button
                            onClick={() => addToCart(selectedArt._id)}
                            className="text-[#B87333] hover:text-[#D4A574] transition-colors"
                          >
                            <Plus size={24} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(selectedArt._id)}
                          className="w-full py-4 flex items-center justify-center gap-3"
                          style={{
                            background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
                            color: '#000',
                            fontFamily: 'var(--font-heading)',
                            letterSpacing: '0.1em',
                            fontSize: '16px',
                          }}
                        >
                          <Plus size={20} />
                          ADD TO CART
                        </button>
                      )
                    ) : (
                      <div
                        className="w-full py-4 text-center"
                        style={{
                          background: 'rgba(220, 38, 38, 0.2)',
                          border: '2px solid rgba(220, 38, 38, 0.5)',
                          color: '#FCA5A5',
                          fontFamily: 'var(--font-heading)',
                          letterSpacing: '0.1em',
                        }}
                      >
                        OUT OF STOCK
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

// Premium Grid View Component
function GridArtItem({
  item,
  quantity,
  onAdd,
  onRemove,
  onView,
  index,
}: {
  item: ArtItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onView: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative cursor-pointer overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(42, 24, 16, 0.6), rgba(26, 17, 16, 0.8))',
        border: '2px solid rgba(184, 115, 51, 0.2)',
        backdropFilter: 'blur(30px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      onClick={onView}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.6)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(184, 115, 51, 0.25), 0 0 0 1px rgba(184, 115, 51, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.2)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.6)';
      }}
    >
      {/* Premium Image Container */}
      <div className="aspect-[3/4] overflow-hidden relative">
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
          }}
        />
        
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Premium Badges */}
        {item.images.length > 1 && (
          <div
            className="absolute top-3 right-3 px-3 py-2 text-xs flex items-center gap-2 z-20"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              border: '1px solid rgba(184, 115, 51, 0.5)',
              backdropFilter: 'blur(10px)',
              color: '#D4A574',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.05em',
            }}
          >
            <ImagePlus size={14} />
            {item.images.length} Photos
          </div>
        )}

        {/* Category Badge */}
        <div
          className="absolute top-3 left-3 px-3 py-2 text-xs uppercase z-20"
          style={{
            background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.9), rgba(205, 127, 50, 0.8))',
            color: '#000',
            fontFamily: 'var(--font-heading)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(184, 115, 51, 0.4)',
          }}
        >
          {item.category}
        </div>
      </div>

      {/* Premium Content */}
      <div className="p-6">
        <h3
          className="text-lg mb-2 line-clamp-1 group-hover:text-[#D4A574] transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#F5F1E8',
            letterSpacing: '0.02em',
            fontWeight: 600,
          }}
        >
          {item.title}
        </h3>
        <p 
          className="text-sm mb-4" 
          style={{ 
            color: '#B87333',
            fontWeight: 300,
            fontStyle: 'italic',
          }}
        >
          by {item.artist}
        </p>

        {/* Price and Action */}
        <div className="flex justify-between items-center pt-4 border-t border-[#B87333]/20">
          <div>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#8B6F47' }}>
              Price
            </div>
            <span
              className="text-2xl gradient-text font-bold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              ₹{item.price.toLocaleString()}
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {item.stock > 0 ? (
              quantity > 0 ? (
                <div
                  className="flex items-center gap-3 px-3 py-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.2))',
                    border: '2px solid rgba(184, 115, 51, 0.5)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(184, 115, 51, 0.2)',
                  }}
                >
                  <button 
                    onClick={onRemove} 
                    className="text-[#B87333] hover:text-[#D4A574] hover:scale-110 transition-all"
                  >
                    <Minus size={16} strokeWidth={3} />
                  </button>
                  <span 
                    className="text-base font-bold gradient-text" 
                    style={{ minWidth: '20px', textAlign: 'center' }}
                  >
                    {quantity}
                  </span>
                  <button 
                    onClick={onAdd} 
                    className="text-[#B87333] hover:text-[#D4A574] hover:scale-110 transition-all"
                  >
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAdd}
                  className="px-5 py-3 text-sm flex items-center gap-2 hover:scale-105 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.2))',
                    border: '2px solid rgba(184, 115, 51, 0.5)',
                    color: '#F5F1E8',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(184, 115, 51, 0.2)',
                  }}
                >
                  <Plus size={16} strokeWidth={3} />
                  ADD
                </button>
              )
            ) : (
              <span 
                className="text-xs px-3 py-2 uppercase tracking-wider" 
                style={{ 
                  color: '#FF6B6B',
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                }}
              >
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Premium Corner Accent */}
      <div 
        className="absolute bottom-0 right-0 w-16 h-16 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, #B87333 50%)',
        }}
      />
    </motion.div>
  );
}

// List View Component
function ListArtItem({
  item,
  quantity,
  onAdd,
  onRemove,
  onView,
  index,
}: {
  item: ArtItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onView: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ x: 4 }}
      className="group relative cursor-pointer"
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(42, 24, 16, 0.9), rgba(26, 17, 16, 0.9))',
        border: '1px solid rgba(184, 115, 51, 0.2)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
      onClick={onView}
    >
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="w-32 h-32 flex-shrink-0 overflow-hidden relative rounded-sm">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {item.images.length > 1 && (
            <div
              className="absolute bottom-1 right-1 px-1.5 py-0.5 text-xs flex items-center gap-1"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#D4A574',
                fontSize: '10px',
              }}
            >
              <ImagePlus size={10} />
              {item.images.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h3
                className="text-lg mb-1"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#F5F1E8',
                  letterSpacing: '0.03em',
                }}
              >
                {item.title}
              </h3>
              <p className="text-sm mb-2" style={{ color: '#B87333' }}>
                by {item.artist}
              </p>
              <p className="text-xs line-clamp-2 mb-2" style={{ color: '#8B6F47', lineHeight: 1.4 }}>
                {item.description}
              </p>
              
              <div className="flex flex-wrap gap-2 text-xs">
                <span
                  className="px-2 py-0.5 uppercase"
                  style={{
                    background: 'rgba(184, 115, 51, 0.2)',
                    color: '#B87333',
                    fontSize: '10px',
                  }}
                >
                  {item.category}
                </span>
                {item.stock > 0 ? (
                  <span style={{ color: '#4ADE80' }}>
                    {item.stock} in stock
                  </span>
                ) : (
                  <span style={{ color: '#FF6B6B' }}>
                    Out of stock
                  </span>
                )}
              </div>
            </div>

            <span
              className="text-2xl gradient-text flex-shrink-0"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              ₹{item.price.toLocaleString()}
            </span>
          </div>

          {/* Action */}
          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
            {item.stock > 0 ? (
              quantity > 0 ? (
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
              )
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}