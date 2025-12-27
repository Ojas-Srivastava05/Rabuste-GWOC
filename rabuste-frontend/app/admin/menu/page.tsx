"use client";

import { useEffect, useState } from "react";

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

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  // fetch menu
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

    // reset form
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setCategory("");

    // refresh list
    fetchMenu();
  }

  // delete a menu item then refresh list
  async function deleteItem(id: string) {
    await fetch(`/api/menu/${id}`, {
      method: "DELETE",
    });
    fetchMenu();
  }

  // toggle availability flag on a menu item then refresh list
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
      style={{
        padding: "32px",
        background: "#0A0A0A",
        color: "#FFF",
        minHeight: "100vh",
      }}
    >
      <h1>Admin Menu</h1>

      {/* ADD FORM */}
      <form onSubmit={handleAddItem} style={{ marginBottom: "24px" }}>
        <h3>Add Menu Item</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 8,
            background: "#0F0F0F",
            color: "#fff",
            border: "1px solid #2b2b2b",
            borderRadius: 6,
          }}
        />
        <br />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 8,
            background: "#0F0F0F",
            color: "#fff",
            border: "1px solid #2b2b2b",
            borderRadius: 6,
          }}
        />
        <br />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 8,
            background: "#0F0F0F",
            color: "#fff",
            border: "1px solid #2b2b2b",
            borderRadius: 6,
          }}
        />
        <br />

        <input
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 8,
            background: "#0F0F0F",
            color: "#fff",
            border: "1px solid #2b2b2b",
            borderRadius: 6,
          }}
        />
        <br />

        <input
          placeholder="Category (Coffee / Snacks)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 8,
            background: "#0F0F0F",
            color: "#fff",
            border: "1px solid #2b2b2b",
            borderRadius: 6,
          }}
        />
        <br />
        <br />

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            background: "linear-gradient(135deg,#8B6F47,#C9A86A)",
            color: "#000",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Add Item
        </button>
      </form>

      {/* MENU LIST */}
      <h3>Menu Items</h3>

      {loading && <p>Loading...</p>}

      {!loading && menu.length === 0 && <p>No menu items</p>}

      {!loading &&
        menu.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "8px",
              opacity: item.isAvailable ? 1 : 0.5,
            }}
          >
            <strong>{item.name}</strong> — ₹{item.price}
            <br />
            <small>{item.category}</small>
            <br />
            <span>{item.description}</span>
            <br />
            <br />

            <button
              onClick={() => toggleAvailability(item._id, item.isAvailable)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                background: item.isAvailable ? "#4b5563" : "#10b981",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              {item.isAvailable ? "Disable" : "Enable"}
            </button>

            <button
              onClick={() => deleteItem(item._id)}
              style={{
                marginLeft: "8px",
                padding: "6px 10px",
                borderRadius: 6,
                background: "#111827",
                color: "salmon",
                border: "1px solid rgba(255,99,71,0.15)",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
    </div>
  );
}
