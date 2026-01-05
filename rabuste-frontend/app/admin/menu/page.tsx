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
        <div className="inline-flex items-center gap-4 mb-4 sm:mb-6">
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
      <div className="brutal-card p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
        <h2
          className="text-2xl sm:text-3xl mb-6 sm:mb-8 flex items-center gap-3"
          style={{
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
          }}
        >
          <Plus size={24} className="text-[#B87333]" />
          ADD NEW ITEM
        </h2>

        <form onSubmit={handleAddItem} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Item Name *
              </label>
              <input
                placeholder="e.g., Espresso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Category *
              </label>
              <input
                placeholder="e.g., Coffee, Snacks"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
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
            <input
              placeholder="Brief description of the item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide"
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
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
              >
                Image URL *
              </label>
              <input
                placeholder="https://example.com/image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                className="w-full bg-[#1A1110] border-2 border-[#B87333]/30 rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-[#F5F1E8] focus:outline-none focus:border-[#B87333] transition-all"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full sm:w-auto">
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
          <Coffee size={24} className="text-[#B87333]" />
          CURRENT MENU ITEMS
        </h2>

        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="section-label">Loading menu...</p>
          </div>
        )}

        {!loading && menu.length === 0 && (
          <div className="brutal-card p-8 sm:p-12 text-center">
            <p className="text-base sm:text-xl" style={{ color: '#8B6F47' }}>No menu items yet. Add your first item above.</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {menu.map((item) => (
              <div
                key={item._id}
                className="brutal-card p-4 sm:p-6"
                style={{
                  opacity: item.isAvailable ? 1 : 0.6,
                  position: 'relative',
                }}
              >
                {!item.isAvailable && (
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide"
                    style={{
                      background: 'rgba(220, 38, 38, 0.2)',
                      border: '2px solid rgba(220, 38, 38, 0.5)',
                      color: '#FCA5A5',
                    }}
                  >
                    Disabled
                  </div>
                )}

                <div className="aspect-square overflow-hidden mb-4 rounded-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mb-1">
                  <span
                    className="text-xs uppercase tracking-widest"
                    style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}
                  >
                    {item.category}
                  </span>
                </div>

                <h3
                  className="text-xl sm:text-2xl mb-2"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                  }}
                >
                  {item.name}
                </h3>

                <p className="text-sm mb-4" style={{ color: '#8B6F47' }}>
                  {item.description}
                </p>

                <div className="flex justify-between items-center mb-6">
                  <span
                    className="text-2xl sm:text-3xl gradient-text"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    ₹{item.price}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => toggleAvailability(item._id, item.isAvailable)}
                    className="flex-1 btn btn-secondary"
                    style={{
                      padding: '12px 16px',
                      fontSize: '12px sm:14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {item.isAvailable ? (
                      <>
                        <PowerOff size={16} />
                        DISABLE
                      </>
                    ) : (
                      <>
                        <Power size={16} />
                        ENABLE
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deleteItem(item._id)}
                    className="btn"
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(220, 38, 38, 0.2)',
                      border: '2px solid rgba(220, 38, 38, 0.5)',
                      color: '#FCA5A5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Trash2 size={16} />
                    DELETE
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