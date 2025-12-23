"use client";

import { useState } from "react";

type Item = {
  name: string;
  price: number;
  quantity: number;
};

export default function OrderPage() {
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [items, setItems] = useState<Item[]>([
    { name: "Latte", price: 150, quantity: 0 },
    { name: "Cappuccino", price: 120, quantity: 0 },
    { name: "Espresso", price: 100, quantity: 0 },
  ]);

  const handleQuantityChange = (index: number, qty: number) => {
    const newItems = [...items];
    newItems[index].quantity = qty;
    setItems(newItems);
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!customerName || !customerEmail || totalAmount === 0) {
      alert("Please fill your name, email, and select at least one item.");
      return;
    }

    setLoading(true);

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        customerEmail,
        items: items.filter((i) => i.quantity > 0),
        totalAmount,
      }),
    });

    alert("✅ Order placed successfully!");
    setCustomerName("");
    setCustomerEmail("");
    setItems(items.map((i) => ({ ...i, quantity: 0 })));
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-900 text-gray-100 rounded-lg shadow-lg font-sans">
      <h1 className="text-2xl font-bold mb-4">☕ Order Coffee</h1>

      <div className="mb-4">
        <label className="block mb-1">Name:</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Email:</label>
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">Menu:</h2>
      {items.map((item, index) => (
        <div key={item.name} className="flex justify-between items-center mb-2">
          <span>
            {item.name} - ₹{item.price}
          </span>
          <input
            type="number"
            min={0}
            value={item.quantity}
            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 rounded-md bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      ))}

      <h3 className="text-lg font-semibold mt-4">Total: ₹{totalAmount}</h3>

      <button
        onClick={placeOrder}
        disabled={loading}
        className="mt-4 w-full py-2 bg-amber-500 text-gray-900 font-bold rounded-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
