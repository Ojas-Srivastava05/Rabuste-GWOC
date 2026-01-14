"use client";

import { useEffect, useState } from "react";
import { Instagram, RefreshCw, Plus, Trash2, ExternalLink, Upload, Image as ImageIcon, Link as LinkIcon, X } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/imageUpload";

interface InstagramPost {
  _id: string;
  instagramId: string;
  imageUrl: string;
  caption: string;
  permalink: string;
  likes: number;
  timestamp: string;
  mediaType: string;
  isManual: boolean;
}

export default function AdminInstagramPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showManualPost, setShowManualPost] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [manualForm, setManualForm] = useState({
    imageUrl: "",
    permalink: "",
    caption: "",
    likes: 0,
  });

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/instagram", {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        let errorText = "Failed to fetch posts";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            const err = await res.json();
            errorText = err.message || err.error || errorText;
          } else {
            errorText = await res.text();
          }
        } catch {
          // ignore parsing errors
        }
        throw new Error(errorText);
      }

      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err: any) {
      console.error("Failed to fetch Instagram posts:", err);
      setError(err.message || "Unable to load Instagram posts");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setManualForm({ ...manualForm, imageUrl });
      setImagePreview(imageUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddManualPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.imageUrl.trim()) {
      setError("Image is required");
      return;
    }
    if (!manualForm.permalink.trim()) {
      setError("Instagram post URL is required");
      return;
    }

    // Validate Instagram URL format
    if (!manualForm.permalink.includes('instagram.com')) {
      setError("Please provide a valid Instagram post URL");
      return;
    }

    try {
      setFetching(true);
      setError("");
      setSuccess("");

      const res = await fetch("/api/admin/instagram", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: "manual",
          imageUrl: manualForm.imageUrl.trim(),
          permalink: manualForm.permalink.trim(),
          caption: manualForm.caption.trim(),
          likes: manualForm.likes || 0,
        }),
      });

      if (!res.ok) {
        let errorText = "Failed to add post";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            const err = await res.json();
            errorText = err.message || err.error || errorText;
          } else {
            errorText = await res.text();
          }
        } catch {
          // ignore parsing errors
        }
        throw new Error(errorText);
      }

      setSuccess("Post added successfully!");
      setManualForm({ imageUrl: "", permalink: "", caption: "", likes: 0 });
      setImagePreview("");
      setShowManualPost(false);
      await fetchPosts();
    } catch (err: any) {
      console.error("Failed to add manual post:", err);
      setError(err.message || "Failed to add post");
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this Instagram post?")) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      const res = await fetch(`/api/admin/instagram?postId=${postId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        let errorText = "Failed to delete post";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            const err = await res.json();
            errorText = err.message || err.error || errorText;
          } else {
            errorText = await res.text();
          }
        } catch {
          // ignore parsing errors
        }
        throw new Error(errorText);
      }

      setSuccess("Post deleted successfully!");
      await fetchPosts();
    } catch (err: any) {
      console.error("Failed to delete post:", err);
      setError(err.message || "Failed to delete post");
    }
  };

  const handleRefresh = async () => {
    await fetchPosts();
    setSuccess("Posts refreshed!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const stats = {
    total: posts.length,
    autoSync: posts.filter(p => !p.isManual).length,
    manual: posts.filter(p => p.isManual).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Instagram Management</h1>
          <p className="text-black mt-1">Manage Instagram posts and gallery</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={fetching}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            <RefreshCw size={18} className={fetching ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setShowManualPost(!showManualPost)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all"
          >
            <Plus size={18} />
            Add Post
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error: {error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          <p className="font-semibold">Success: {success}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Total Posts</p>
              <p className="text-2xl font-bold text-black">{stats.total}</p>
            </div>
            <div className="p-3 bg-black rounded-lg">
              <Instagram size={20} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Auto Sync</p>
              <p className="text-2xl font-bold text-purple-600">{stats.autoSync}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Instagram size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black mb-1">Manual</p>
              <p className="text-2xl font-bold text-black">{stats.manual}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Upload size={20} className="text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Manual Post Form */}
      {showManualPost && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-slideUp">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Add Instagram Post</h2>
            <button
              onClick={() => {
                setShowManualPost(false);
                setManualForm({ imageUrl: "", permalink: "", caption: "", likes: 0 });
                setImagePreview("");
                setError("");
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-black" />
            </button>
          </div>
          <form onSubmit={handleAddManualPost} className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2 flex items-center gap-2">
                <ImageIcon size={16} />
                Image *
              </label>
              <div className="space-y-2">
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors">
                  <Upload size={20} className="mr-2 text-black" />
                  <span className="text-sm text-black">
                    {uploading ? "Uploading..." : "Click to upload image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setManualForm({ ...manualForm, imageUrl: "" });
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <div className="text-xs text-black">Or enter image URL:</div>
                <input
                  type="url"
                  value={manualForm.imageUrl}
                  onChange={(e) => {
                    setManualForm({ ...manualForm, imageUrl: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>
            </div>

            {/* Instagram Post URL */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2 flex items-center gap-2">
                <LinkIcon size={16} />
                Instagram Post URL *
              </label>
              <input
                type="url"
                value={manualForm.permalink}
                onChange={(e) => setManualForm({ ...manualForm, permalink: e.target.value })}
                placeholder="https://www.instagram.com/p/ABC123/"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                required
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Caption</label>
              <textarea
                value={manualForm.caption}
                onChange={(e) => setManualForm({ ...manualForm, caption: e.target.value })}
                placeholder="Copy and paste the Instagram post caption here..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
              />
            </div>

            {/* Likes */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Likes (Optional)</label>
              <input
                type="number"
                value={manualForm.likes}
                onChange={(e) => setManualForm({ ...manualForm, likes: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={fetching || uploading}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50"
              >
                {fetching ? "Adding..." : "Add Post"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowManualPost(false);
                  setManualForm({ imageUrl: "", permalink: "", caption: "", likes: 0 });
                  setImagePreview("");
                }}
                className="px-6 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-black">Loading Instagram posts...</p>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Instagram size={64} className="mx-auto mb-4 text-black" />
          <p className="text-black">No Instagram posts yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                {post.imageUrl && !post.imageUrl.includes('instagram.com/p/') ? (
                  <img
                    src={post.imageUrl}
                    alt={post.caption || "Instagram post"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Instagram size={48} className="text-black" />
                  </div>
                )}
                {post.isManual && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black text-white text-xs font-semibold rounded">
                    Manual
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-black">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-black rounded">
                    {post.mediaType}
                  </span>
                </div>
                <p className="text-sm text-black line-clamp-2 mb-3">
                  {post.caption || "No caption"}
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all text-sm font-semibold"
                  >
                    <ExternalLink size={14} />
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="py-2 px-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
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
