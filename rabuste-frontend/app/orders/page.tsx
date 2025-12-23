"use client";

import { useState } from "react";

type Item = {
  name: string;
  price: number;
  quantity: number;
};

export default function OrderPage() {
  const [loading, setLoading] = useState(false);

  const [popupType, setPopupType] = useState<"success" | "error" | null>(null);
  const [popupMessage, setPopupMessage] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [instructions, setInstructions] = useState("");

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
      setPopupType("error");
      setPopupMessage("Please fill all details and select at least one item.");
      return;
    }

    try {
      setLoading(true);

      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          items: items.filter((i) => i.quantity > 0),
          totalAmount,
          instructions,
        }),
      });

      setPopupType("success");
      setPopupMessage("Your coffee order has been placed ☕");

      setCustomerName("");
      setCustomerEmail("");
      setInstructions("");
      setItems(items.map((i) => ({ ...i, quantity: 0 })));
    } catch {
      setPopupType("error");
      setPopupMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ORDER FORM */}
      <div className="max-w-md mx-auto mt-10 p-6 bg-[#241a15] text-amber-200 rounded-xl shadow-xl border border-[#3a2a22]">
        <h1 className="text-3xl font-extrabold mb-6 text-amber-300 text-center">
          ☕ Coffee Order
        </h1>

        <div className="mb-4">
          <label className="block mb-1 text-amber-300">Name</label>
          <input
            className="w-full p-2 bg-[#1b1410] border border-[#3a2a22] rounded text-amber-200 focus:ring-2 focus:ring-amber-500 outline-none"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-amber-300">Email</label>
          <input
            type="email"
            className="w-full p-2 bg-[#1b1410] border border-[#3a2a22] rounded text-amber-200 focus:ring-2 focus:ring-amber-500 outline-none"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-amber-300">
            Special Instructions
          </label>
          <textarea
            rows={3}
            className="w-full p-2 bg-[#1b1410] border border-[#3a2a22] rounded text-amber-200 resize-none focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Less sugar, extra hot, no foam..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <h2 className="text-lg font-semibold mb-2 text-amber-300">Menu</h2>

        {items.map((item, index) => (
          <div key={item.name} className="flex justify-between mb-2">
            <span>
              {item.name} – ₹{item.price}
            </span>
            <input
              type="number"
              min={0}
              className="w-16 p-1 bg-[#1b1410] border border-[#3a2a22] rounded text-amber-200 focus:ring-2 focus:ring-amber-500 outline-none"
              value={item.quantity}
              onChange={(e) =>
                handleQuantityChange(index, Number(e.target.value))
              }
            />
          </div>
        ))}

        <p className="mt-4 font-bold text-amber-300">
          Total: ₹{totalAmount}
        </p>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="mt-5 w-full py-2 bg-amber-600 text-[#1b1410] font-bold rounded-lg hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? "Brewing..." : "Place Order"}
        </button>
      </div>

      {/* POPUP */}
      {popupType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#241a15] text-amber-200 p-6 rounded-xl shadow-xl w-80 text-center border border-[#3a2a22]">
            <h2 className="text-2xl font-bold mb-2 text-amber-300">
              {popupType === "success" ? "☕ Order Placed" : "⚠️ Error"}
            </h2>

            <p className="mb-4">{popupMessage}</p>

            <button
              onClick={() => setPopupType(null)}
              className="px-4 py-2 bg-amber-600 text-[#1b1410] font-semibold rounded hover:bg-amber-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
