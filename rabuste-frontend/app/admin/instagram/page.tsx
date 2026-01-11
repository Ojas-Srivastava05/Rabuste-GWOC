"use client";

import { useEffect, useState } from "react";
import { Instagram, RefreshCw, Plus, Trash2, ExternalLink, Download, Upload, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

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

  // Manual post form state
  const [showManualPost, setShowManualPost] = useState(false);
  const [manualForm, setManualForm] = useState({
    imageUrl: "", // Cloudinary image URL
    permalink: "", // Instagram post URL for redirection
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

  const handleAddManualPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.imageUrl.trim()) {
      setError("Cloudinary image URL is required");
      return;
    }
    if (!manualForm.permalink.trim()) {
      setError("Instagram post URL is required for redirection");
      return;
    }

    // Validate Cloudinary URL
    if (!manualForm.imageUrl.includes('cloudinary.com') && !manualForm.imageUrl.match(/^https?:\/\/.+/)) {
      setError("Please provide a valid Cloudinary image URL (e.g., https://res.cloudinary.com/...)");
      return;
    }

    // Validate Instagram URL
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

  if (loading) {
    return (
      <div className="bg-[#FAF3E0] rounded-2xl p-8 shadow-2xl border border-[#B87333]/20">
        <p className="text-[#2e211a]">Loading Instagram posts...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{
        background: 'linear-gradient(180deg, #1A1110 0%, #0A0A0A 100%)',
        color: '#F5F1E8',
      }}
    >
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <div className="copper-line" />
          <span className="section-label text-sm sm:text-base">ADMIN PANEL</span>
          <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
        </div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl"
            style={{
              fontFamily: 'var(--font-heading)',
              lineHeight: 0.9,
            }}
          >
            INSTAGRAM
            <br />
            <span className="text-[#B87333]">MANAGEMENT</span>
          </h1>
          <button
            onClick={handleRefresh}
            disabled={fetching}
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.9), rgba(205, 127, 50, 0.9))',
              border: '2px solid rgba(184, 115, 51, 0.3)',
              color: '#1A1110',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.1em',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(184, 115, 51, 0.4)',
            }}
          >
            <RefreshCw size={20} className={fetching ? "animate-spin" : ""} />
            REFRESH
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/30 border-2 border-red-800/50 text-red-300">
          <p className="font-semibold">Error: {error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-950/30 border-2 border-green-800/50 text-green-300">
          <p className="font-semibold">Success: {success}</p>
        </div>
      )}

      {/* Action Button */}
      <div className="mb-8">
        <button
          onClick={() => {
            setShowManualPost(!showManualPost);
          }}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg w-full md:w-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(131, 58, 180, 0.9), rgba(253, 29, 29, 0.9), rgba(252, 175, 69, 0.9))',
            border: '2px solid rgba(184, 115, 51, 0.3)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(184, 115, 51, 0.4)',
          }}
        >
          <Plus size={24} />
          ADD INSTAGRAM POST
        </button>
      </div>

      {/* Manual Post Form */}
      {showManualPost && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#FFFDF2] to-[#FFF8E8] border-2 border-[#B87333]/30 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-[#2e211a]" style={{ fontFamily: 'var(--font-heading)' }}>
            Add Instagram Post
          </h2>
          <form onSubmit={handleAddManualPost} className="space-y-5">
            {/* Cloudinary Image URL */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#6b4a2f] flex items-center gap-2">
                <ImageIcon size={16} />
                Cloudinary Image URL *
              </label>
              <input
                type="url"
                value={manualForm.imageUrl}
                onChange={(e) => setManualForm({ ...manualForm, imageUrl: e.target.value })}
                placeholder="https://res.cloudinary.com/your-cloud/image/upload/v1234567/your-image.jpg"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#B87333]/30 bg-white text-[#2e211a] focus:border-[#B87333] focus:outline-none font-mono text-sm"
                required
              />
              <p className="mt-2 text-xs text-[#8B6F47]">
                Upload your image to Cloudinary and paste the direct image URL here. This ensures high-quality display on your website.
              </p>
              <div className="mt-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold mb-1">💡 How to get Cloudinary URL:</p>
                <ol className="text-xs text-blue-600 list-decimal list-inside space-y-1">
                  <li>Upload your image to Cloudinary dashboard</li>
                  <li>Copy the "Secure URL" or "URL" from the image details</li>
                  <li>Paste it in the field above</li>
                </ol>
                <a 
                  href="https://cloudinary.com/documentation/upload_images" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 underline mt-2 inline-block"
                >
                  Learn more about Cloudinary →
                </a>
              </div>
              {manualForm.imageUrl && manualForm.imageUrl.includes('cloudinary.com') && (
                <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-xs text-green-700 font-semibold mb-2">✓ Valid Cloudinary URL detected</p>
                  <img 
                    src={manualForm.imageUrl} 
                    alt="Preview" 
                    className="max-w-full h-32 object-cover rounded border border-green-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Instagram Post URL */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#6b4a2f] flex items-center gap-2">
                <LinkIcon size={16} />
                Instagram Post URL *
              </label>
              <input
                type="url"
                value={manualForm.permalink}
                onChange={(e) => setManualForm({ ...manualForm, permalink: e.target.value })}
                placeholder="https://www.instagram.com/p/ABC123/"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#B87333]/30 bg-white text-[#2e211a] focus:border-[#B87333] focus:outline-none"
                required
              />
              <p className="mt-2 text-xs text-[#8B6F47]">
                Paste the Instagram post URL. Users will be redirected to this link when they click on the post.
              </p>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#6b4a2f]">
                Caption
              </label>
              <textarea
                value={manualForm.caption}
                onChange={(e) => setManualForm({ ...manualForm, caption: e.target.value })}
                placeholder="Copy and paste the Instagram post caption here..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#B87333]/30 bg-white text-[#2e211a] focus:border-[#B87333] focus:outline-none resize-none"
              />
              <p className="mt-2 text-xs text-[#8B6F47]">
                Copy and paste the caption from Instagram. This will be displayed when users hover over the post.
              </p>
            </div>

            {/* Likes (Optional) */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#6b4a2f]">
                Likes (Optional)
              </label>
              <input
                type="number"
                value={manualForm.likes}
                onChange={(e) => setManualForm({ ...manualForm, likes: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#B87333]/30 bg-white text-[#2e211a] focus:border-[#B87333] focus:outline-none"
              />
              <p className="mt-2 text-xs text-[#8B6F47]">
                Enter the number of likes for this post (optional).
              </p>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={fetching}
                className="px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                }}
              >
                {fetching ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Add Post
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowManualPost(false);
                  setManualForm({ imageUrl: "", permalink: "", caption: "", likes: 0 });
                }}
                className="px-6 py-3 rounded-lg border-2 border-[#B87333]/50 text-[#6b4a2f] hover:bg-[#B87333]/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Instagram size={20} className="text-[#B87333]" />
            <span className="section-label text-xs">TOTAL POSTS</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
            {posts.length}
          </p>
        </div>

        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Instagram size={20} className="text-[#833AB4]" />
            <span className="section-label text-xs">AUTO SYNC</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#833AB4' }}>
            {posts.filter(p => !p.isManual).length}
          </p>
        </div>

        <div className="brutal-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Upload size={20} className="text-[#D4A574]" />
            <span className="section-label text-xs">MANUAL</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#D4A574' }}>
            {posts.filter(p => p.isManual).length}
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          INSTAGRAM POSTS
        </h2>
        {posts.length === 0 ? (
          <div className="brutal-card p-12 text-center">
            <Instagram size={64} className="mx-auto mb-6 text-[#B87333]" />
            <p className="text-xl mb-2" style={{ color: '#8B6F47' }}>No Instagram posts yet</p>
            <p className="text-sm" style={{ color: '#8B6F47' }}>Click the button above to add Instagram posts</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="brutal-card p-0 overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden">
                  {post.imageUrl && !post.imageUrl.includes('instagram.com/p/') ? (
                    <img
                      src={post.imageUrl}
                      alt={post.caption || "Instagram post"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-900/20 to-zinc-900/40 flex items-center justify-center">
                      <div className="text-center p-4">
                        <Instagram size={48} className="mx-auto mb-2 text-[#B87333] opacity-70" />
                        <p className="text-xs text-[#B87333] opacity-80">Instagram Post</p>
                        {post.caption && (
                          <p className="text-xs mt-2 line-clamp-2 text-[#D4A574] opacity-90">{post.caption.substring(0, 60)}...</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <div className="text-center text-white">
                      <p className="text-sm font-semibold mb-2 line-clamp-2">{post.caption || "No caption"}</p>
                      <div className="flex items-center justify-center gap-2 text-white/80">
                        <Instagram size={16} />
                        <span className="text-sm">{post.likes} likes</span>
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  {post.isManual && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-[#B87333] text-white text-xs font-semibold">
                      Manual
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: '#8B6F47' }}>
                      {new Date(post.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(184, 115, 51, 0.2)', color: '#B87333' }}>
                      {post.mediaType}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2 mb-3" style={{ color: '#F5F1E8' }}>
                    {post.caption || "No caption"}
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all hover:scale-105 text-sm font-semibold"
                      style={{
                        background: 'rgba(184, 115, 51, 0.2)',
                        border: '2px solid rgba(184, 115, 51, 0.4)',
                        color: '#B87333',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      <ExternalLink size={14} />
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="py-2 px-3 rounded-lg transition-all hover:scale-105 text-sm font-semibold"
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
