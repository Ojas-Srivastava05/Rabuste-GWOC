"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Power, PowerOff, Palette, ImagePlus, X, Upload, Search, Filter } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/imageUpload";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
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

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImageToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedUrls]);
      setImageFiles([...imageFiles, ...Array.from(files)]);
    } catch (error) {
      console.error("Failed to upload images:", error);
      alert("Failed to upload some images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please add at least one image");
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
        images,
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
    setImages([]);
    setImageFiles([]);
    setCategory("painting");
    setMedium("");
    setDimensions("");
    setYear("");
    setStock("1");
    setShowAddForm(false);
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
  const allCategories = Array.from(new Set(gallery.map(g => g.category)));

  const filteredGallery = gallery
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort: available items first, then disabled items at bottom
      // If one is available and the other isn't, available comes first
      if (a.isAvailable !== b.isAvailable) {
        return a.isAvailable ? -1 : 1;
      }
      // If both have same availability, sort by title alphabetically
      return a.title.localeCompare(b.title);
    });

  const stats = {
    total: gallery.length,
    available: gallery.filter(g => g.isAvailable).length,
    disabled: gallery.filter(g => !g.isAvailable).length,
    inStock: gallery.reduce((sum, g) => sum + g.stock, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Gallery Management</h1>
          <p className="text-black mt-1">Manage artwork and gallery items</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all"
        >
          <Plus size={18} />
          Add Artwork
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Total Items</p>
              <p className="text-2xl font-bold text-black">{stats.total}</p>
            </div>
            <div className="p-3 bg-black rounded-lg">
              <Palette size={20} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Power size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Disabled</p>
              <p className="text-2xl font-bold text-red-600">{stats.disabled}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <PowerOff size={20} className="text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">In Stock</p>
              <p className="text-2xl font-bold text-black">{stats.inStock}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Palette size={20} className="text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-slideUp">
          <h2 className="text-xl font-bold text-black mb-6">Add New Artwork</h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Artwork Title *</label>
                <input
                  placeholder="e.g., Sunset Over Mountains"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Artist Name *</label>
                <input
                  placeholder="e.g., John Doe"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Description *</label>
              <textarea
                placeholder="Detailed description of the artwork"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
              />
            </div>

            {/* Images Section */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Images * (at least one required)</label>
              <div className="space-y-3">
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors">
                  <Upload size={20} className="mr-2 text-black" />
                  <span className="text-sm text-black">
                    {uploading ? "Uploading..." : "Click to upload images or drag and drop"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Price (₹) *</label>
                <input
                  placeholder="e.g., 25000"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Medium</label>
                <input
                  placeholder="e.g., Oil on Canvas"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Dimensions</label>
                <input
                  placeholder="e.g., 24x36 inches"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Year</label>
                <input
                  placeholder="e.g., 2024"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>
            </div>

            <div className="max-w-xs">
              <label className="block text-sm font-semibold text-black mb-2">Stock *</label>
              <input
                placeholder="e.g., 1"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Add Artwork"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setTitle("");
                  setArtist("");
                  setDescription("");
                  setPrice("");
                  setImages([]);
                  setImageFiles([]);
                  setCategory("painting");
                  setMedium("");
                  setDimensions("");
                  setYear("");
                  setStock("1");
                }}
                className="px-6 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" size={18} />
            <input
              type="text"
              placeholder="Search artwork..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder:text-black"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
          >
            <option value="">All Categories</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-black">Loading gallery...</p>
          </div>
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Palette size={64} className="mx-auto mb-4 text-black" />
          <p className="text-black">No artworks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg ${
                item.isAvailable ? 'border-gray-200' : 'border-gray-300 opacity-50'
              }`}
              style={!item.isAvailable ? { 
                filter: 'grayscale(100%)',
                textDecoration: 'line-through'
              } : {}}
            >
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                {item.images[0] ? (
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImagePlus size={48} className="text-black" />
                  </div>
                )}
                {!item.isAvailable && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">
                    Disabled
                  </div>
                )}
                {item.images.length > 1 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                    +{item.images.length - 1} more
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-black rounded">{item.category}</span>
                  <span className="text-xs font-semibold text-black">Stock: {item.stock}</span>
                </div>
                <h3 className="font-bold text-black mb-1">{item.title}</h3>
                <p className="text-sm text-black mb-2">by {item.artist}</p>
                <p className="text-xs text-black mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-black">₹{item.price.toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAvailability(item._id, item.isAvailable)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      item.isAvailable
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {item.isAvailable ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
