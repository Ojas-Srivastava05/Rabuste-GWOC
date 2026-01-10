"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Power, PowerOff, Palette, ImagePlus, X } from "lucide-react";

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
  isAvailable: boolean;
  stock: number;
};

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<ArtItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [category, setCategory] = useState("painting");
  const [medium, setMedium] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [year, setYear] = useState("");
  const [stock, setStock] = useState("1");

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    setLoading(true);
    const res = await fetch("/api/art");
    const data = await res.json();
    setGallery(data);
    setLoading(false);
  }

  function addImageField() {
    setImages([...images, ""]);
  }

  function removeImageField(index: number) {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  }

  function updateImageField(index: number, value: string) {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();

    const filteredImages = images.filter(img => img.trim() !== "");
    
    if (filteredImages.length === 0) {
      alert("Please add at least one image URL");
      return;
    }

    await fetch("/api/art", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        artist,
        description,
        price: Number(price),
        images: filteredImages,
        category,
        medium: medium || undefined,
        dimensions: dimensions || undefined,
        year: year ? Number(year) : undefined,
        stock: Number(stock),
      }),
    });

    // Reset form
    setTitle("");
    setArtist("");
    setDescription("");
    setPrice("");
    setImages([""]);
    setCategory("painting");
    setMedium("");
    setDimensions("");
    setYear("");
    setStock("1");

    fetchGallery();
  }

  async function deleteItem(id: string) {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    
    await fetch(`/api/art/${id}`, {
      method: "DELETE",
    });
    fetchGallery();
  }

  async function toggleAvailability(id: string, current: boolean) {
    await fetch(`/api/art/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !current }),
    });
    fetchGallery();
  }

  const categories = ["painting", "sculpture", "photography", "digital", "mixed-media", "print"];

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: 'linear-gradient(180deg, #1A1110 0%, #0A0A0A 100%)',
        color: '#F5F1E8',
      }}
    >
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="copper-line" />
          <span className="section-label">ADMIN PANEL</span>
          <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
        </div>
        <h1
          className="text-5xl md:text-7xl"
          style={{
            fontFamily: 'var(--font-heading)',
            lineHeight: 0.9,
          }}
        >
          GALLERY <span className="gradient-text">MANAGEMENT</span>
        </h1>
      </div>

      {/* Add Form */}
      <div className="brutal-card p-8 mb-12 max-w-4xl">
        <h2
          className="text-3xl mb-8 flex items-center gap-3"
          style={{
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
          }}
        >
          <Plus size={32} className="text-[#B87333]" />
          ADD NEW ARTWORK
        </h2>

        <form onSubmit={handleAddItem} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Artwork Title *
              </label>
              <input
                placeholder="e.g., Sunset Over Mountains"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-5 py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Artist Name *
              </label>
              <input
                placeholder="e.g., John Doe"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                required
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-5 py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-bold mb-3 uppercase tracking-wide"
              style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
            >
              Description *
            </label>
            <textarea
              placeholder="Detailed description of the artwork"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-5 py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all resize-none"
            />
          </div>

          {/* Images Section */}
          <div>
            <label
              className="block text-sm font-bold mb-3 uppercase tracking-wide"
              style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
            >
              Image URLs * (at least one required)
            </label>
            <div className="space-y-3">
              {images.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    placeholder="https://example.com/image.jpg"
                    value={img}
                    onChange={(e) => updateImageField(index, e.target.value)}
                    className="flex-1 bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-5 py-3 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-4 py-3 bg-red-900/20 border-2 border-red-700/40 rounded-lg hover:bg-red-900/30 transition-colors"
                    >
                      <X size={18} className="text-red-400" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="flex items-center gap-2 px-4 py-2 bg-[#B87333]/20 border-2 border-[#B87333]/40 rounded-lg hover:bg-[#B87333]/30 transition-colors text-sm"
                style={{ color: '#D4A574', fontFamily: 'var(--font-heading)' }}
              >
                <ImagePlus size={16} />
                ADD ANOTHER IMAGE
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Price (₹) *
              </label>
              <input
                placeholder="e.g., 25000"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-5 py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-5 py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-[#1A1110]">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Medium
              </label>
              <input
                placeholder="e.g., Oil on Canvas"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-5 py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Dimensions
              </label>
              <input
                placeholder="e.g., 24x36 inches"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-5 py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Year
              </label>
              <input
                placeholder="e.g., 2024"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-5 py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
              />
            </div>
          </div>

          <div className="max-w-xs">
            <label
              className="block text-sm font-bold mb-3 uppercase tracking-wide"
              style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
            >
              Stock *
            </label>
            <input
              placeholder="e.g., 1"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-5 py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full md:w-auto">
            <Plus size={20} />
            ADD ARTWORK TO GALLERY
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Palette size={20} className="text-[#B87333]" />
            <span className="section-label text-xs">TOTAL</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
            {gallery.length}
          </p>
        </div>

        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Power size={20} className="text-[#5E7D4C]" />
            <span className="section-label text-xs">AVAILABLE</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#5E7D4C' }}>
            {gallery.filter(g => g.isAvailable).length}
          </p>
        </div>

        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <PowerOff size={20} className="text-red-500" />
            <span className="section-label text-xs">DISABLED</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#EF4444' }}>
            {gallery.filter(g => !g.isAvailable).length}
          </p>
        </div>

        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Palette size={20} className="text-[#D4A574]" />
            <span className="section-label text-xs">IN STOCK</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#D4A574' }}>
            {gallery.reduce((sum, g) => sum + g.stock, 0)}
          </p>
        </div>
      </div>

      {/* Gallery List */}
      <div>
        <h2
          className="text-2xl sm:text-3xl mb-6 sm:mb-8 flex items-center gap-3"
          style={{
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
          }}
        >
          <Palette size={28} className="text-[#B87333]" />
          CURRENT GALLERY ITEMS
        </h2>

        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="section-label">Loading gallery...</p>
          </div>
        )}

        {!loading && gallery.length === 0 && (
          <div className="brutal-card p-12 text-center">
            <Palette size={64} className="text-[#B87333] mx-auto mb-6" />
            <p className="text-xl" style={{ color: '#8B6F47' }}>No artworks yet. Add your first piece above.</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {gallery.map((item) => (
              <div
                key={item._id}
                className="brutal-card p-0 overflow-hidden flex flex-col"
                style={{
                  opacity: item.isAvailable ? 1 : 0.6,
                  position: 'relative',
                }}
              >
                {!item.isAvailable && (
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide z-10"
                    style={{
                      background: 'rgba(220, 38, 38, 0.2)',
                      border: '2px solid rgba(220, 38, 38, 0.5)',
                      color: '#FCA5A5',
                    }}
                  >
                    Disabled
                  </div>
                )}

                {/* Image Gallery */}
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.images.length > 1 && (
                    <div
                      className="absolute top-2 right-2 px-2 py-1 text-xs flex items-center gap-1 rounded"
                      style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(184, 115, 51, 0.4)',
                        color: '#D4A574',
                      }}
                    >
                      <ImagePlus size={12} />
                      {item.images.length}
                    </div>
                  )}
                  {!item.isAvailable && (
                    <div
                      className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold uppercase"
                      style={{
                        background: 'rgba(220, 38, 38, 0.9)',
                        color: '#FFFFFF',
                      }}
                    >
                      Disabled
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className="text-xs uppercase tracking-widest px-2 py-1 rounded"
                      style={{ 
                        background: 'rgba(184, 115, 51, 0.2)',
                        color: '#8B6F47', 
                        fontFamily: 'var(--font-heading)' 
                      }}
                    >
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: '#B87333' }}>
                      Stock: {item.stock}
                    </span>
                  </div>

                  <h3
                    className="text-lg sm:text-xl mb-1 font-bold"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#F5F1E8',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-sm mb-2" style={{ color: '#B87333' }}>
                    by {item.artist}
                  </p>

                  <p className="text-xs mb-3 line-clamp-2" style={{ color: '#8B6F47' }}>
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center mb-4 mt-auto">
                    <span
                      className="text-xl sm:text-2xl gradient-text font-bold"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAvailability(item._id, item.isAvailable)}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{
                        background: item.isAvailable
                          ? 'rgba(220, 38, 38, 0.2)'
                          : 'rgba(94, 125, 76, 0.3)',
                        border: `2px solid ${item.isAvailable ? 'rgba(220, 38, 38, 0.5)' : 'rgba(94, 125, 76, 0.5)'}`,
                        color: item.isAvailable ? '#FCA5A5' : '#5E7D4C',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {item.isAvailable ? (
                        <>
                          <PowerOff size={14} className="inline mr-1" />
                          OFF
                        </>
                      ) : (
                        <>
                          <Power size={14} className="inline mr-1" />
                          ON
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => deleteItem(item._id)}
                      className="py-2 px-3 rounded-lg transition-all hover:scale-105"
                      style={{
                        background: 'rgba(220, 38, 38, 0.2)',
                        border: '2px solid rgba(220, 38, 38, 0.5)',
                        color: '#FCA5A5',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}