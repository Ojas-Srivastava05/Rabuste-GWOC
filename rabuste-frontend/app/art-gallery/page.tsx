"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, X, SlidersHorizontal, Star, Flame, Clock, Sparkles } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import ArtGalleryHero from "@/components/ArtGalleryHero";
import Footer from "@/components/sections/footer";
import { artworkData } from "@/data/artworkData";
import { ArtworkItem } from "@/types/artwork";

type QuickFilter = "all" | "bestseller" | "trending" | "limited";
type SortOption = "default" | "price-low" | "price-high" | "rating" | "name" | "new";

// Deterministic hash to keep flags stable across renders
const hashCode = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

const getArtworkFlags = (artwork: ArtworkItem) => {
  const seed = `${artwork.id}-${artwork.title}-${artwork.artist}`;
  const hash = hashCode(seed);

  return {
    isBestseller: hash % 10 < 3,
    isTrending: hash % 11 < 2,
    isLimited: hash % 7 === 0,
    editionsLeft: (hash % 5) + 1,
    yearHighlight: artwork.year >= 2024,
  };
};

function ArtGalleryPageContent() {
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem>(artworkData[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);
  const contentRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const panelOpacity = useTransform(scrollY, [0, 200], [1, 1]);
  const panelX = useTransform(scrollY, [0, 200], [0, 0]);

  // Scroll to top on mount and hydrate hero
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setSelectedArtwork(artworkData[0]);
  }, []);

  const categories = ["All", ...Array.from(new Set(artworkData.map((art) => art.category)))];

  let filtered = artworkData.filter((art) => {
    const matchesCategory = activeCategory === "All" || art.category === activeCategory;
    const search = searchQuery.trim().toLowerCase();
    const matchesSearch =
      search === "" ||
      art.title.toLowerCase().includes(search) ||
      art.description.toLowerCase().includes(search) ||
      art.artist.toLowerCase().includes(search) ||
      art.medium.toLowerCase().includes(search) ||
      art.category.toLowerCase().includes(search);

    const flags = getArtworkFlags(art);
    if (quickFilter === "bestseller" && !flags.isBestseller) return false;
    if (quickFilter === "trending" && !flags.isTrending) return false;
    if (quickFilter === "limited" && !flags.isLimited) return false;

    return matchesCategory && matchesSearch;
  });

  if (sortBy === "price-low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "name") {
    filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "new") {
    filtered = [...filtered].sort((a, b) => b.year - a.year);
  }

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
          {selectedArtwork && <ArtGalleryHero artwork={selectedArtwork} />}
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
                Curated for Collectors
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
                <span className="gradient-text">ART GALLERY</span>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery && searchQuery !== lastSearchQuery) {
                      setLastSearchQuery(searchQuery);
                    }
                  }}
                  className="w-full pl-11 pr-12 py-3 bg-transparent outline-none text-sm"
                  style={{
                    color: "#F5F1E8",
                    fontFamily: "var(--font-body)",
                  }}
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
                        {categories.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setActiveCategory(c);
                              setQuickFilter("all");
                            }}
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
                          { value: "default", label: "Curated" },
                          { value: "price-low", label: "Price ↑" },
                          { value: "price-high", label: "Price ↓" },
                          { value: "rating", label: "Rating" },
                          { value: "new", label: "Newest" },
                          { value: "name", label: "Name" },
                        ].map((sort) => (
                          <button
                            key={sort.value}
                            onClick={() => setSortBy(sort.value as SortOption)}
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

            {categories
              .filter((c) => c !== "All")
              .map((category) => {
                const categoryItems = filtered.filter((art) => art.category === category);
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category} className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className="text-xl md:text-2xl"
                        style={{ fontFamily: "var(--font-heading)", color: "#F5F1E8" }}
                      >
                        {category}
                      </h3>
                      <div className="flex items-center gap-2 text-xs" style={{ color: "#B87333" }}>
                        <Sparkles size={14} />
                        Curated picks
                      </div>
                    </div>

                    <div className="space-y-3">
                      {categoryItems.map((art) => (
                        <ArtworkListItem
                          key={art.id}
                          artwork={art}
                          flags={getArtworkFlags(art)}
                          onHover={() => setSelectedArtwork(art)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.section>
      </main>

      <Footer />
    </>
  );
}

function ArtworkListItem({
  artwork,
  flags,
  onHover,
}: {
  artwork: ArtworkItem;
  flags: ReturnType<typeof getArtworkFlags>;
  onHover: () => void;
}) {
  return (
    <motion.div
      id={`art-${artwork.id}`}
      whileHover={{ scale: 1.02, x: 10 }}
      className="group relative flex gap-4 cursor-pointer"
      style={{
        backgroundImage: "linear-gradient(90deg, rgba(42, 24, 16, 0.8), rgba(26, 17, 16, 0.8))",
        border: "1px solid rgba(184, 115, 51, 0.2)",
        backdropFilter: "blur(20px)",
        padding: "14px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        borderRadius: "12px",
      }}
      onMouseEnter={onHover}
    >
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden relative" style={{ borderRadius: "10px" }}>
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          sizes="96px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          quality={80}
        />

        <div className="absolute top-1 left-1 flex flex-col gap-1">
          {flags.isLimited && (
            <span
              className="px-2 py-0.5 text-[10px]"
              style={{
                background: "rgba(255, 183, 77, 0.95)",
                color: "#000",
                borderRadius: "6px",
                fontFamily: "var(--font-heading)",
              }}
            >
              {flags.editionsLeft} left
            </span>
          )}
          {flags.isBestseller && (
            <span
              className="px-2 py-0.5 text-[10px]"
              style={{
                background: "rgba(184, 115, 51, 0.95)",
                color: "#000",
                borderRadius: "6px",
                fontFamily: "var(--font-heading)",
              }}
            >
              Bestseller
            </span>
          )}
          {flags.isTrending && (
            <span
              className="px-2 py-0.5 text-[10px]"
              style={{
                background: "rgba(255, 107, 107, 0.95)",
                color: "#000",
                borderRadius: "6px",
                fontFamily: "var(--font-heading)",
              }}
            >
              Trending
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm md:text-base mb-1 line-clamp-1"
            style={{ fontFamily: "var(--font-heading)", color: "#F5F1E8", letterSpacing: "0.02em" }}
          >
            {artwork.title}
          </h3>
          <span className="text-xs" style={{ color: "#B87333" }}>
            {artwork.year}
          </span>
        </div>

        <p className="text-xs mb-1 line-clamp-2" style={{ color: "#8B6F47" }}>
          {artwork.description}
        </p>

        <div className="flex items-center gap-3 text-xs mb-2" style={{ color: "#B87333" }}>
          <span>{artwork.artist}</span>
          <span>•</span>
          <span>{artwork.medium}</span>
          {flags.yearHighlight && <span style={{ color: "#D4A574" }}>New</span>}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <span className="text-base gradient-text" style={{ fontFamily: "var(--font-heading)" }}>
              ₹{artwork.price}
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: "#B87333" }}>
              <Star size={12} fill="#B87333" />
              {artwork.rating}
            </span>
          </div>

          <a
            href="/art"
            className="px-3 py-1.5 text-xs flex items-center gap-1"
            style={{
              background: "rgba(184, 115, 51, 0.2)",
              border: "1px solid rgba(184, 115, 51, 0.4)",
              color: "#D4A574",
              fontFamily: "var(--font-body)",
              borderRadius: "6px",
            }}
          >
            View piece
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ArtGalleryLandingPage() {
  return <ArtGalleryPageContent />;
}
