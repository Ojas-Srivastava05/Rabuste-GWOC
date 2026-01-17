"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Plus, Minus, ShoppingCart, Search, X, SlidersHorizontal } from "lucide-react";
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

function ArtGalleryPageContent() {
  const router = useRouter();
  const [gallery, setGallery] = useState<ArtItem[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "name">("default");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedHeroArt, setSelectedHeroArt] = useState<ArtItem | null>(null);
  const contentRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const panelOpacity = useTransform(scrollY, [0, 200], [1, 1]);
  const panelX = useTransform(scrollY, [0, 200], [0, 0]);

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
  const categories = ["All", ...new Set(gallery.map((item: ArtItem) => item.category))];
  const filtered = gallery
    .filter((item: ArtItem) => {
      if (activeCategory !== "All" && item.category !== activeCategory) return false;
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a: ArtItem, b: ArtItem) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });

  const getQty = (itemId: string) => {
    const item = cart?.items.find((i: CartItem) => i.artItem === itemId && i.itemType === "art");
    return item?.quantity || 0;
  };

  const totalItems = cart?.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0;
  const totalPrice = cart?.totalAmount || 0;

  const addToCart = (itemId: string) => {
    console.log("Add to cart:", itemId);
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

      <main style={{ background: "transparent", position: "relative", zIndex: 2, minHeight: "100vh" }}>
        <section
          className="lg:fixed lg:top-0 lg:left-0"
          style={{
            width: "100%",
            height: "auto",
            ...(typeof window !== "undefined" && window.innerWidth >= 1024
              ? {
                  width: "50%",
                  height: "100vh",
                }
              : {}),
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
            <div className="flex items-center relative overflow-hidden pt-12 pb-10">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: "radial-gradient(circle at 70% 50%, rgba(184, 115, 51, 0.2) 0%, transparent 50%)",
                }}
              />

              <div className="px-6 lg:px-10 w-full relative z-10">
                <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10 items-center">
                  <motion.div
                    className="relative flex items-center justify-center"
                    initial={{ opacity: 0, x: -40, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div
                      className="relative"
                      style={{
                        width: "clamp(220px, 32vw, 340px)",
                        height: "clamp(220px, 32vw, 340px)",
                      }}
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
                          src={selectedHeroArt.images?.[0] || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"}
                          alt={selectedHeroArt.title}
                          fill
                          sizes="(max-width: 768px) 260px, 380px"
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
                        transition={{ delay: 0.5, type: "spring" }}
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
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <motion.h1
                      className="mb-4 gradient-text"
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(2.2rem, 7vw, 4.5rem)",
                        lineHeight: "0.95",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      The Gallery
                    </motion.h1>

                    <motion.p
                      className="text-sm md:text-base mb-3"
                      style={{
                        color: "#F5F1E8",
                        fontFamily: "var(--font-body)",
                        lineHeight: "1.6",
                        maxWidth: "420px",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {selectedHeroArt.description}
                    </motion.p>

                    <div className="flex items-center gap-3 text-xs mb-4" style={{ color: "#B87333" }}>
                      <span>{selectedHeroArt.artist}</span>
                      <span>•</span>
                      <span>{selectedHeroArt.medium || "Mixed Media"}</span>
                      {selectedHeroArt.year && <span>• {selectedHeroArt.year}</span>}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => openArtModal(selectedHeroArt)}
                        className="btn btn-primary"
                        style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                      >
                        View details
                      </button>
                      <button
                        onClick={() => addToCart(selectedHeroArt._id)}
                        className="px-4 py-2"
                        style={{
                          background: "rgba(184, 115, 51, 0.2)",
                          border: "1px solid rgba(184, 115, 51, 0.5)",
                          color: "#D4A574",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        Add to cart
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </section>

        <motion.section
          ref={contentRef}
          className="lg:fixed lg:right-0 lg:top-0 lg:overflow-y-auto"
          style={{
            ...(typeof window !== "undefined" && window.innerWidth >= 1024
              ? {
                  width: "50%",
                  height: "100vh",
                  overflow: "auto",
                  position: "fixed",
                  right: 0,
                  top: 0,
                }
              : {
                  width: "100%",
                  marginTop: "auto",
                }),
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
