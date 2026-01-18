"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Plus, Minus, ShoppingCart, Search, X, SlidersHorizontal, Star, Flame, Clock, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";
import ArtCategoryCarousel from "@/components/ArtCategoryCarousel";
import { trackAddToCart, trackRemoveFromCart, trackArtItemView } from "@/lib/analytics";

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

type QuickFilter = "all" | "bestseller" | "trending" | "limited";

// Deterministic hash for consistent flags
const hashCode = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

const getArtworkFlags = (artwork: ArtItem) => {
  const seed = `${artwork._id}-${artwork.title}-${artwork.artist}`;
  const hash = hashCode(seed);

  return {
    isBestseller: hash % 10 < 3,
    isTrending: hash % 11 < 2,
    isLimited: artwork.stock <= 5,
    editionsLeft: artwork.stock,
    yearHighlight: artwork.year && artwork.year >= 2024,
  };
};

function ArtGalleryPageContent() {
  const router = useRouter();
  const [gallery, setGallery] = useState<ArtItem[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "name" | "rating" | "new">("default");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedHeroArt, setSelectedHeroArt] = useState<ArtItem | null>(null);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const contentRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const panelOpacity = useTransform(scrollY, [0, 200], [1, 1]);
  const panelX = useTransform(scrollY, [0, 200], [0, 0]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    fetchGallery();
    fetchCart();
  }, []);

  async function fetchGallery() {
    try {
      const res = await fetch("/api/art");
      const data = await res.json();
      setGallery(data);
      if (!selectedHeroArt && data.length > 0) {
        setSelectedHeroArt(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch gallery, using empty fallback", err);
      setGallery([]);
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

  // Helper functions
  const categories = ["All", ...Array.from(new Set(gallery.map((item: ArtItem) => item.category)))];
  
  let filtered = gallery.filter((item: ArtItem) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const search = searchQuery.trim().toLowerCase();
    const matchesSearch =
      search === "" ||
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.artist.toLowerCase().includes(search) ||
      (item.medium && item.medium.toLowerCase().includes(search)) ||
      item.category.toLowerCase().includes(search);

    const flags = getArtworkFlags(item);
    if (quickFilter === "bestseller" && !flags.isBestseller) return false;
    if (quickFilter === "trending" && !flags.isTrending) return false;
    if (quickFilter === "limited" && !flags.isLimited) return false;

    return matchesCategory && matchesSearch;
  });

  if (sortBy === "price-low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "new") {
    filtered = [...filtered].sort((a, b) => (b.year || 0) - (a.year || 0));
  }

  const getQty = (itemId: string) => {
    const item = cart?.items.find((i: CartItem) => i.artItem === itemId && i.itemType === "art");
    return item?.quantity || 0;
  };

  const totalItems = cart?.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0;
  const totalPrice = cart?.totalAmount || 0;

  const addToCart = async (itemId: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artItemId: itemId, quantity: 1 }),
      });
      if (res.ok) {
        await fetchCart();
        const item = gallery.find((i) => i._id === itemId);
        if (item) {
          trackAddToCart(item.title, item.price, "art");
        }
      }
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  const removeFromCart = (itemId: string) => {
    console.log("Remove from cart:", itemId);
  };

  const openArtModal = (art: ArtItem) => {
    console.log("Open modal:", art);
  };

  return (
    <>
      <Navbar />
      <DynamicBackground />

      <div className="noise-overlay" />

      <div
        className="fixed top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, #B87333, #CD7F32, #D4A574, #CD7F32, #B87333, transparent)",
          zIndex: 100,
          boxShadow: "0 0 20px rgba(184, 115, 51, 0.5)",
        }}
      />

      <main className="lg:flex" style={{ background: "transparent", position: "relative", zIndex: 2, minHeight: "100vh" }}>
        <section
          className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0"
          style={{
            zIndex: 10,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(184, 115, 51, 0.1) 0%, transparent 50%, rgba(26, 17, 16, 0.3) 100%)",
              zIndex: -1,
            }}
          />

          {selectedHeroArt && (
            <div className="flex flex-col items-center relative overflow-hidden pt-24 md:pt-28 lg:pt-32 pb-10 px-6 lg:px-10">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(184, 115, 51, 0.2) 0%, transparent 50%)",
                }}
              />

              <div className="w-full max-w-lg relative z-10 flex flex-col items-center">
                {/* Heading First */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.h1
                    className="gradient-text mb-3"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(2.5rem, 6vw, 4rem)",
                      lineHeight: "0.95",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    The Gallery
                  </motion.h1>
                  <motion.p
                    className="text-sm md:text-base"
                    style={{
                      color: "#B87333",
                      fontFamily: "var(--font-body)",
                      lineHeight: "1.6",
                      maxWidth: "400px",
                      margin: "0 auto",
                    }}
                  >
                    Combining metal, wood, and found objects to create three-dimensional narratives
                  </motion.p>
                </motion.div>

                {/* Big Circle - Artwork */}
                <motion.div
                  className="relative flex items-center justify-center mb-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedHeroArt._id}
                      className="relative"
                      style={{
                        width: "clamp(280px, 35vw, 380px)",
                        height: "clamp(280px, 35vw, 380px)",
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          borderRadius: "50%",
                          background: "radial-gradient(circle, rgba(184, 115, 51, 0.3) 0%, transparent 70%)",
                          filter: "blur(20px)",
                          transform: "scale(1.1)",
                        }}
                      />

                      <div
                        className="relative overflow-hidden"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          border: "4px solid rgba(184, 115, 51, 0.4)",
                          boxShadow: "0 15px 45px rgba(0, 0, 0, 0.6)",
                        }}
                      >
                        <Image
                          key={`${selectedHeroArt._id}-${selectedHeroArt.images?.[0]}`}
                          src={selectedHeroArt.images?.[0] || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"}
                          alt={selectedHeroArt.title}
                          fill
                          sizes="(max-width: 768px) 280px, 400px"
                          className="object-cover"
                          priority
                        />
                      </div>

                      <motion.div
                        className="absolute bottom-0 right-0"
                        style={{
                          background: "linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)",
                          borderRadius: "16px",
                          padding: "12px 20px",
                          boxShadow: "0 8px 24px rgba(184, 115, 51, 0.4)",
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <p
                          className="text-base font-bold mb-1"
                          style={{ color: "#000000", fontFamily: "var(--font-heading)" }}
                        >
                          {selectedHeroArt.title}
                        </p>
                        <div className="flex items-center justify-between gap-3">
                          <p
                            className="text-xl font-bold"
                            style={{ color: "#000000", fontFamily: "var(--font-heading)" }}
                          >
                            ₹{selectedHeroArt.price.toLocaleString()}
                          </p>
                          <span className="text-xs" style={{ color: "#000" }}>
                            {selectedHeroArt.year || "Limited"}
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Details and CTA Buttons Under Circle */}
                <motion.div
                  className="text-center w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.p
                    className="text-sm md:text-base mb-3"
                    style={{
                      color: "#F5F1E8",
                      fontFamily: "var(--font-body)",
                      lineHeight: "1.6",
                      maxWidth: "420px",
                      margin: "0 auto",
                    }}
                  >
                    {selectedHeroArt.description}
                  </motion.p>

                  <div className="flex items-center justify-center gap-3 text-xs mb-6" style={{ color: "#B87333" }}>
                    <span>{selectedHeroArt.artist}</span>
                    <span>•</span>
                    <span>{selectedHeroArt.medium || "Mixed Media"}</span>
                    {selectedHeroArt.year && <span>• {selectedHeroArt.year}</span>}
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => addToCart(selectedHeroArt._id)}
                      className="px-6 py-3 rounded-lg transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: "linear-gradient(135deg, #B87333 0%, #CD7F32 100%)",
                        border: "1px solid rgba(184, 115, 51, 0.8)",
                        color: "#000",
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(184, 115, 51, 0.3)",
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </section>

        <motion.section
          ref={contentRef}
          className="w-full lg:w-1/2 lg:h-screen lg:overflow-y-auto"
          style={{
            zIndex: 20,
            opacity: panelOpacity,
            x: panelX,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(26, 17, 16, 0.5) 0%, transparent 50%, rgba(184, 115, 51, 0.1) 100%)",
              zIndex: -1,
            }}
          />

          <div className="pt-24 md:pt-28 lg:pt-32 px-6 pb-20">
            <div className="mb-8">
              <motion.p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: "#B87333", fontFamily: "var(--font-body)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Curated Collection
              </motion.p>

              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl mb-4"
                style={{
                  fontFamily: "var(--font-heading)",
                  lineHeight: 0.9,
                  color: "#F5F1E8",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="gradient-text">Art Menu</span>
              </motion.h1>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <div
                className="relative"
                style={{
                  background: "rgba(26, 17, 16, 0.8)",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#B87333" }}
                />
                <input
                  type="text"
                  placeholder="Search artworks, artists, styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-transparent outline-none text-sm"
                  style={{ color: "#F5F1E8", fontFamily: "var(--font-body)" }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 transition-transform active:scale-90"
                  >
                    <X size={18} style={{ color: "#B87333" }} />
                  </button>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                onClick={() => {
                  setQuickFilter("all");
                  setActiveCategory("All");
                }}
                className="px-3 py-1.5 flex items-center gap-2 transition-all whitespace-nowrap text-xs"
                style={{
                  background:
                    quickFilter === "all" && activeCategory === "All"
                      ? "rgba(184, 115, 51, 0.3)"
                      : "rgba(26, 17, 16, 0.8)",
                  border: `1px solid ${
                    quickFilter === "all" && activeCategory === "All"
                      ? "rgba(184, 115, 51, 0.6)"
                      : "rgba(184, 115, 51, 0.3)"
                  }`,
                  color:
                    quickFilter === "all" && activeCategory === "All" ? "#D4A574" : "#B87333",
                  fontFamily: "var(--font-heading)",
                }}
              >
                ALL
              </button>
              <button
                onClick={() => setQuickFilter("bestseller")}
                className="px-3 py-1.5 flex items-center gap-2 transition-all whitespace-nowrap text-xs"
                style={{
                  background: quickFilter === "bestseller" ? "rgba(184, 115, 51, 0.3)" : "rgba(26, 17, 16, 0.8)",
                  border: `1px solid ${
                    quickFilter === "bestseller" ? "rgba(184, 115, 51, 0.6)" : "rgba(184, 115, 51, 0.3)"
                  }`,
                  color: quickFilter === "bestseller" ? "#D4A574" : "#B87333",
                  fontFamily: "var(--font-heading)",
                }}
              >
                <Star size={12} fill={quickFilter === "bestseller" ? "#D4A574" : "none"} />
                BEST
              </button>
              <button
                onClick={() => setQuickFilter("trending")}
                className="px-3 py-1.5 flex items-center gap-2 transition-all whitespace-nowrap text-xs"
                style={{
                  background: quickFilter === "trending" ? "rgba(255, 107, 107, 0.3)" : "rgba(26, 17, 16, 0.8)",
                  border: `1px solid ${
                    quickFilter === "trending" ? "rgba(255, 107, 107, 0.6)" : "rgba(184, 115, 51, 0.3)"
                  }`,
                  color: quickFilter === "trending" ? "#FF6B6B" : "#B87333",
                  fontFamily: "var(--font-heading)",
                }}
              >
                <Flame size={12} />
                HOT
              </button>
              <button
                onClick={() => setQuickFilter("limited")}
                className="px-3 py-1.5 flex items-center gap-2 transition-all whitespace-nowrap text-xs"
                style={{
                  background: quickFilter === "limited" ? "rgba(255, 183, 77, 0.3)" : "rgba(26, 17, 16, 0.8)",
                  border: `1px solid ${
                    quickFilter === "limited" ? "rgba(255, 183, 77, 0.6)" : "rgba(184, 115, 51, 0.3)"
                  }`,
                  color: quickFilter === "limited" ? "#FFB74D" : "#B87333",
                  fontFamily: "var(--font-heading)",
                }}
              >
                <Clock size={12} />
                LIMITED
              </button>
            </motion.div>

            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="mb-4 px-4 py-2 flex items-center gap-2 text-sm w-full"
              style={{
                background: showFilters ? "rgba(184, 115, 51, 0.3)" : "rgba(26, 17, 16, 0.8)",
                border: "1px solid rgba(184, 115, 51, 0.3)",
                color: "#B87333",
                fontFamily: "var(--font-body)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SlidersHorizontal size={16} />
              <span>Filters & Sort</span>
            </motion.button>

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
                      background: "rgba(26, 17, 16, 0.8)",
                      border: "1px solid rgba(184, 115, 51, 0.3)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="mb-4">
                      <label className="text-xs mb-2 block" style={{ color: "#8B6F47", letterSpacing: "0.1em" }}>
                        CATEGORY
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((c: string) => (
                          <button
                            key={c}
                            onClick={() => setActiveCategory(c)}
                            className="px-2 py-1 text-xs transition-all"
                            style={{
                              background:
                                activeCategory === c ? "rgba(184, 115, 51, 0.3)" : "rgba(61, 43, 31, 0.5)",
                              border: `1px solid ${
                                activeCategory === c ? "rgba(184, 115, 51, 0.6)" : "rgba(184, 115, 51, 0.2)"
                              }`,
                              color: activeCategory === c ? "#D4A574" : "#B87333",
                              fontFamily: "var(--font-body)",
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs mb-2 block" style={{ color: "#8B6F47", letterSpacing: "0.1em" }}>
                        SORT BY
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "default", label: "Featured" },
                          { value: "price-low", label: "Price ↑" },
                          { value: "price-high", label: "Price ↓" },
                          { value: "name", label: "Alphabetical" },
                        ].map((sort) => (
                          <button
                            key={sort.value}
                            onClick={() => setSortBy(sort.value as "default" | "price-low" | "price-high" | "name")}
                            className="px-2 py-1 text-xs transition-all"
                            style={{
                              background:
                                sortBy === sort.value ? "rgba(184, 115, 51, 0.3)" : "rgba(61, 43, 31, 0.5)",
                              border: `1px solid ${
                                sortBy === sort.value ? "rgba(184, 115, 51, 0.6)" : "rgba(184, 115, 51, 0.2)"
                              }`,
                              color: sortBy === sort.value ? "#D4A574" : "#B87333",
                              fontFamily: "var(--font-body)",
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

            {filtered.length > 0 ? (
              activeCategory === "All" ? (
                categories
                  .filter((c: string) => c !== "All")
                  .map((category: string) => {
                    const categoryItems = filtered.filter((item: ArtItem) => item.category === category);
                    if (categoryItems.length === 0) return null;

                    return (
                      <ArtCategoryCarousel
                        key={category}
                        title={category}
                        items={categoryItems}
                        getQuantity={getQty}
                        onAdd={addToCart}
                        onRemove={removeFromCart}
                        onView={openArtModal}
                        onHover={setSelectedHeroArt}
                      />
                    );
                  })
              ) : (
                <ArtCategoryCarousel
                  title={activeCategory}
                  items={filtered}
                  getQuantity={getQty}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                  onView={openArtModal}
                  onHover={setSelectedHeroArt}
                />
              )
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <p className="text-xl mb-2" style={{ color: "#8B6F47", fontFamily: "var(--font-heading)" }}>
                  NO ARTWORKS FOUND
                </p>
                <p className="text-sm" style={{ color: "#8B6F47" }}>
                  Try adjusting your search or filters
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>
      </main>

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
              background: "linear-gradient(135deg, #B87333 0%, #CD7F32 100%)",
              boxShadow: "0 10px 40px rgba(184, 115, 51, 0.5)",
              color: "#000",
              fontFamily: "var(--font-heading)",
              fontSize: "14px",
              letterSpacing: "0.1em",
            }}
          >
            <ShoppingCart size={20} />
            <span className="font-bold">{totalItems}</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Page() {
  return <ArtGalleryPageContent />;
}
