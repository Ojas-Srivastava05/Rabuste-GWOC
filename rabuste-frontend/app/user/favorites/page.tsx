"use client";

import { useEffect, useState } from "react";
import { Heart, Clock, TrendingUp } from "lucide-react";

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brewTime: number;
  category: string;
  inStock: boolean;
};

export default function UserFavorites() {
  const [favorites, setFavorites] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, load favorites from localStorage
    // In future, this could be fetched from backend
    const loadFavorites = async () => {
      try {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
          const favoriteIds = JSON.parse(storedFavorites);
          
          // Fetch menu items
          const res = await fetch("/api/menu");
          if (res.ok) {
            const data = await res.json();
            const menuItems = Array.isArray(data) ? data : data?.items || [];
            const favItems = menuItems.filter((item: MenuItem) => favoriteIds.includes(item._id));
            setFavorites(favItems);
          }
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = (id: string) => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      const favoriteIds = JSON.parse(storedFavorites);
      const updated = favoriteIds.filter((fid: string) => fid !== id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setFavorites(favorites.filter(item => item._id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #1A1110 0%, #0A0A0A 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="section-label">Loading Favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF3E0] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6 border border-[#B87333]/20">
      {/* PAGE HEADING */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-[#B87333] to-[#CD7F32] rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2e211a]" style={{ fontFamily: 'var(--font-heading)' }}>
          My Favorites
        </h1>
        <div className="flex-1 h-px bg-gradient-to-r from-[#B87333]/30 to-transparent" />
      </div>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div
              key={item._id}
              className="bg-[#FFFDF2] rounded-2xl shadow-lg overflow-hidden border border-[#B87333]/20 hover:border-[#B87333]/40 transition-all duration-300 hover:shadow-xl group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button
                  onClick={() => removeFavorite(item._id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <Heart size={20} fill="#DC2626" color="#DC2626" />
                </button>
                {!item.inStock && (
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#2e211a] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.name}
                </h3>
                <p className="text-sm text-[#6b4a2f] mb-4 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-[#B87333]" style={{ fontFamily: 'var(--font-heading)' }}>
                    ₹{item.price}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#6b4a2f]">
                    <Clock size={14} />
                    <span>{item.brewTime} min</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href="/menu"
                    className={`flex-1 text-center py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      item.inStock
                        ? 'bg-gradient-to-r from-[#B87333] to-[#CD7F32] text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Order Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFDF2] p-12 rounded-2xl text-center border border-[#B87333]/20">
          <Heart size={64} className="mx-auto mb-4" style={{ color: '#B87333', opacity: 0.5 }} />
          <h3 className="text-xl font-bold text-[#2e211a] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            No Favorites Yet
          </h3>
          <p className="text-[#6b4a2f] mb-6">Start adding items to your favorites!</p>
          <a
            href="/menu"
            className="inline-block bg-gradient-to-r from-[#B87333] to-[#CD7F32] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Browse Menu
          </a>
        </div>
      )}
    </div>
  );
}