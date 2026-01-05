"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Power, PowerOff, Coffee } from "lucide-react";

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
};

export default function AdminMenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    setLoading(true);
    const res = await fetch("/api/menu");
    const data = await res.json();
    setMenu(data);
    setLoading(false);
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        price: Number(price),
        image,
        category,
      }),
    });

    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setCategory("");

    fetchMenu();
  }

  async function deleteItem(id: string) {
    await fetch(`/api/menu/${id}`, {
      method: "DELETE",
    });
    fetchMenu();
  }

  async function toggleAvailability(id: string, current: boolean) {
    await fetch(`/api/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !current }),
    });
    fetchMenu();
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
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl"
          style={{
            fontFamily: 'var(--font-heading)',
            lineHeight: 0.9,
          }}
        >
          MENU <span className="gradient-text">MANAGEMENT</span>
        </h1>
      </div>

      {/* Add Form */}
      <div className="brutal-card p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 border border-[#B87333]/20 shadow-2xl">
        <h2
          className="text-2xl sm:text-3xl mb-6 sm:mb-8 flex items-center gap-3"
          style={{
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
          }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center">
            <Plus size={16} style={{ color: '#1A1110' }} />
          </div>
          ADD NEW ITEM
        </h2>

        <form onSubmit={handleAddItem} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="group">
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide transition-colors group-hover:text-[#CD7F32]"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Item Name *
              </label>
              <input
                placeholder="e.g., Espresso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] focus:shadow-lg focus:shadow-[#B87333]/20 transition-all duration-300 placeholder-[#8B6F47]"
              />
            </div>

            <div className="group">
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide transition-colors group-hover:text-[#CD7F32]"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Category *
              </label>
              <input
                placeholder="e.g., Coffee, Snacks"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] focus:shadow-lg focus:shadow-[#B87333]/20 transition-all duration-300 placeholder-[#8B6F47]"
              />
            </div>
          </div>

          <div className="group">
            <label
              className="block text-sm font-bold mb-3 uppercase tracking-wide transition-colors group-hover:text-[#CD7F32]"
              style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
            >
              Description *
            </label>
            <input
              placeholder="Brief description of the item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] focus:shadow-lg focus:shadow-[#B87333]/20 transition-all duration-300 placeholder-[#8B6F47]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="group">
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide transition-colors group-hover:text-[#CD7F32]"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Price (₹) *
              </label>
              <input
                placeholder="e.g., 150"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] focus:shadow-lg focus:shadow-[#B87333]/20 transition-all duration-300 placeholder-[#8B6F47]"
              />
            </div>

            <div className="group">
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide transition-colors group-hover:text-[#CD7F32]"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Image URL *
              </label>
              <input
                placeholder="https://example.com/image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] focus:shadow-lg focus:shadow-[#B87333]/20 transition-all duration-300 placeholder-[#8B6F47]"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #B87333, #CD7F32)',
              boxShadow: '0 4px 16px rgba(184, 115, 51, 0.4)',
            }}
          >
            <Plus size={20} />
            ADD ITEM TO MENU
          </button>
        </form>
      </div>

      {/* Menu List */}
      <div>
        <h2
          className="text-2xl sm:text-3xl mb-6 sm:mb-8 flex items-center gap-3"
          style={{
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
          }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center">
            <Coffee size={16} style={{ color: '#1A1110' }} />
          </div>
          CURRENT MENU ITEMS
        </h2>

        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="section-label">Loading menu...</p>
          </div>
        )}

        {!loading && menu.length === 0 && (
          <div className="brutal-card p-8 sm:p-12 text-center border border-[#B87333]/20">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B87333]/20 to-[#CD7F32]/20 flex items-center justify-center mx-auto mb-4">
              <Coffee size={32} className="text-[#B87333]" />
            </div>
            <p className="text-base sm:text-xl" style={{ color: '#8B6F47' }}>No menu items yet. Add your first item above.</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {menu.map((item) => (
              <div
                key={item._id}
                className="group brutal-card p-3 sm:p-4 border border-[#B87333]/20 hover:border-[#B87333]/40 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
                style={{
                  opacity: item.isAvailable ? 1 : 0.6,
                  position: 'relative',
                }}
              >
                {!item.isAvailable && (
                  <div
                    className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(185, 28, 28, 0.4))',
                      border: '2px solid rgba(220, 38, 38, 0.5)',
                      color: '#FCA5A5',
                    }}
                  >
                    Disabled
                  </div>
                )}

                <div className="aspect-square overflow-hidden mb-3 rounded-lg group-hover:shadow-lg transition-all duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="mb-1">
                  <span
                    className="text-xs uppercase tracking-widest px-2 py-1 rounded-full"
                    style={{ 
                      color: '#8B6F47', 
                      fontFamily: 'var(--font-heading)',
                      background: 'rgba(184, 115, 51, 0.1)',
                      border: '1px solid rgba(184, 115, 51, 0.2)'
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                <h3
                  className="text-lg sm:text-xl mb-1 group-hover:text-[#CD7F32] transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                  }}
                >
                  {item.name}
                </h3>

                <p className="text-xs sm:text-sm mb-3 line-clamp-2" style={{ color: '#8B6F47' }}>
                  {item.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span
                    className="text-lg sm:text-xl gradient-text font-bold"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    ₹{item.price}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAvailability(item._id, item.isAvailable)}
                    className="flex-1 btn btn-secondary transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-xs"
                    style={{
                      padding: '8px 12px',
                      fontSize: '10px sm:12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    {item.isAvailable ? (
                      <>
                        <PowerOff size={14} />
                        <span className="hidden sm:inline">DISABLE</span>
                        <span className="sm:hidden">OFF</span>
                      </>
                    ) : (
                      <>
                        <Power size={14} />
                        <span className="hidden sm:inline">ENABLE</span>
                        <span className="sm:hidden">ON</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deleteItem(item._id)}
                    className="btn transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-xs"
                    style={{
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(185, 28, 28, 0.3))',
                      border: '2px solid rgba(220, 38, 38, 0.4)',
                      color: '#FCA5A5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}