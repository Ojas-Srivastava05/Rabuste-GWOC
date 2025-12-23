"use client";

import { useEffect, useState } from "react";

export default function AdminMenuPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch menu");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error loading menu:", err);
      }
    };
    load();
  }, []);

  const toggleStock = async (id: string, inStock: boolean) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ inStock: !inStock }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Toggle stock failed");
      // optimistically update local state
      setItems((prev) => prev.map((it) => (it._id === id ? { ...it, inStock: !inStock } : it)));
    } catch (err) {
      console.error(err);
      alert("Failed to update stock");
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete item?")) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Delete failed");
      setItems((prev) => prev.filter((it) => it._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  return (
    <div className="p-6 text-[#f3e9dc]">
      <h1 className="text-2xl font-bold mb-4">Menu Items</h1>

      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-[#2b1d14] p-4 rounded-lg border border-[#3a2618]"
          >
            <h2 className="font-semibold">{item.name}</h2>
            <p>₹{item.price}</p>
            <p>Status: {item.inStock ? "In stock" : "Out of stock"}</p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => toggleStock(item._id, item.inStock)}
                className="px-3 py-1 bg-[#c68642] text-black rounded"
              >
                Toggle Stock
              </button>

              <button
                onClick={() => deleteItem(item._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
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
