"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Clock, Award } from "lucide-react";

type MostOrderedItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brewTime: number;
  category: string;
  inStock: boolean;
  orderCount: number;
};

export default function MostOrdered() {
  const [items, setItems] = useState<MostOrderedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: HeadersInit = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const fetchMostOrdered = async () => {
      try {
        const res = await fetch("/api/user/most-ordered", {
          headers: {
            ...getAuthHeaders(),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        setError("Unable to load most ordered items");
      } finally {
        setLoading(false);
      }
    };

    fetchMostOrdered();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #1A1110 0%, #0A0A0A 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="section-label">Loading Your Favorites...</p>
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
          Most Ordered Items
        </h1>
        <div className="flex-1 h-px bg-gradient-to-r from-[#B87333]/30 to-transparent" />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Most Ordered Items */}
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item._id}
              className="bg-[#FFFDF2] rounded-2xl shadow-lg overflow-hidden border border-[#B87333]/20 hover:border-[#B87333]/40 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-6">
                {/* Rank Badge */}
                <div className="flex sm:flex-col items-center sm:items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                    style={{
                      background: index === 0 
                        ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                        : index === 1
                        ? 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)'
                        : index === 2
                        ? 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)'
                        : 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
                      color: '#FFF',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                </div>

                {/* Image */}
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#2e211a] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.name}
                  </h3>
                  <p className="text-sm text-[#6b4a2f] mb-3">{item.description}</p>

                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 bg-[#B87333]/10 px-3 py-1 rounded-full">
                      <TrendingUp size={14} style={{ color: '#B87333' }} />
                      <span className="text-sm font-semibold text-[#B87333]">Ordered {item.orderCount} times</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#6b4a2f]">
                      <Clock size={14} />
                      <span>{item.brewTime} min</span>
                    </div>
                    <span className="text-xs bg-[#B87333]/20 text-[#B87333] px-2 py-1 rounded-full font-semibold uppercase">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                  <div className="text-2xl font-bold text-[#B87333]" style={{ fontFamily: 'var(--font-heading)' }}>
                    ₹{item.price}
                  </div>
                  <a
                    href="/menu"
                    className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                      item.inStock
                        ? 'bg-gradient-to-r from-[#B87333] to-[#CD7F32] text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Order Again
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFDF2] p-12 rounded-2xl text-center border border-[#B87333]/20">
          <Award size={64} className="mx-auto mb-4" style={{ color: '#B87333', opacity: 0.5 }} />
          <h3 className="text-xl font-bold text-[#2e211a] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            No Order History
          </h3>
          <p className="text-[#6b4a2f] mb-6">Place some orders to see your most ordered items!</p>
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