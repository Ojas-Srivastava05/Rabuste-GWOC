"use client";

import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */
// Strong typing instead of `any`
type MenuItem = {
  _id: string;
  name: string;
  price: number;
  inStock: boolean;
};

/* ---------------- COMPONENT ---------------- */
export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /* ---------------- FETCH MENU ---------------- */
  useEffect(() => {
    const loadMenu = async () => {
      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/menu`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch menu");

        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error loading menu:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  /* ---------------- TOGGLE STOCK ---------------- */
  const toggleStock = async (id: string, inStock: boolean) => {
    if (!confirm("Change stock status for this item?")) return;

    const token = localStorage.getItem("token");
    setActionLoading(id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/menu/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ inStock: !inStock }),
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error("Toggle stock failed");

      // Optimistic UI update
      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, inStock: !inStock } : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update stock");
    } finally {
      setActionLoading(null);
    }
  };

  /* ---------------- DELETE ITEM ---------------- */
  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const token = localStorage.getItem("token");
    setActionLoading(id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/menu/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    } finally {
      setActionLoading(null);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 text-[#fffbd6]">
      {/* Page title */}
      <h1 className="text-2xl font-bold mb-6">Menu Items</h1>

      {/* Loading state */}
      {loading && (
        <p className="text-[#e6d8c6]">Loading menu items...</p>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <p className="text-[#e6d8c6]">
          No menu items found.
        </p>
      )}

      {/* Menu cards */}
      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="
              bg-[#3a2618]          /* Espresso Brown (card bg) */
              border border-[#4a3325] /* Mocha Brown (border) */
              p-4 rounded-lg
            "
          >
            {/* Item name */}
            <h2 className="font-semibold text-lg">
              {item.name}
            </h2>

            {/* Price */}
            <p className="text-[#e6d8c6]">
              ₹{item.price}
            </p>

            {/* Stock status */}
            <p
              className={`font-medium ${
                item.inStock
                  ? "text-[#3fb950]" // Matcha Green (In stock)
                  : "text-[#dc2626]" // Cherry Red (Out of stock)
              }`}
            >
              {item.inStock ? "In stock" : "Out of stock"}
            </p>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => toggleStock(item._id, item.inStock)}
                disabled={actionLoading === item._id}
                className="
                  px-3 py-1 rounded text-[#2e211a]
                  bg-[#c68642] hover:bg-[#b57738]
                  disabled:opacity-50
                "
              >
                Toggle Stock
              </button>

              <button
                onClick={() => deleteItem(item._id)}
                disabled={actionLoading === item._id}
                className="
                  px-3 py-1 rounded text-white
                  bg-[#dc2626] hover:bg-[#b91c1c]
                  disabled:opacity-50
                "
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
