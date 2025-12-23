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
      {/* PAGE BACKGROUND */}
      <div className="min-h-screen bg-[#1b120a] flex items-center justify-center px-4">
        {/* ORDER CARD */}
        <div className="w-full max-w-md bg-[#2b1d14] text-[#f3e9dc] rounded-2xl shadow-2xl border border-[#3a2618] p-6">
          <h1 className="text-3xl font-extrabold mb-1 text-center text-[#e6c9a8]">
            Coffee Order
          </h1>
          <p className="text-center text-sm text-[#cbb39a] mb-6">
            Freshly brewed, just for you
          </p>

          {/* CUSTOMER INFO */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-[#e6c9a8]">Name</label>
              <input
                className="w-full px-3 py-2 bg-[#1b120a] border border-[#3a2618] rounded-lg text-[#f3e9dc] focus:ring-2 focus:ring-amber-600 outline-none"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-[#e6c9a8]">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-[#1b120a] border border-[#3a2618] rounded-lg text-[#f3e9dc] focus:ring-2 focus:ring-amber-600 outline-none"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-[#e6c9a8]">
                Special Instructions
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 bg-[#1b120a] border border-[#3a2618] rounded-lg text-[#f3e9dc] resize-none focus:ring-2 focus:ring-amber-600 outline-none"
                placeholder="Extra hot, less sugar, no foam…"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>

          {/* MENU */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#e6c9a8] mb-3">Menu</h2>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between bg-[#24160e] border border-[#3a2618] rounded-lg px-3 py-2"
                >
                  <span>
                    {item.name}{" "}
                    <span className="text-sm text-[#cbb39a]">
                      ₹{item.price}
                    </span>
                  </span>
                  <input
                    type="number"
                    min={0}
                    className="w-16 px-2 py-1 bg-[#1b120a] border border-[#3a2618] rounded text-[#f3e9dc] focus:ring-2 focus:ring-amber-600 outline-none"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, Number(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL */}
          <div className="mt-6 flex justify-between text-lg font-bold text-[#e6c9a8]">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          {/* CTA */}
          <button
            onClick={placeOrder}
            disabled={loading}
            className="mt-6 w-full py-3 bg-amber-600 text-[#1b120a] font-bold rounded-xl hover:bg-amber-700 transition disabled:opacity-50"
          >
            {loading ? "Brewing your coffee…" : "Place Order"}
          </button>
        </div>
      </div>

      {/* POPUP */}
      {popupType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#2b1d14] text-[#f3e9dc] p-6 rounded-2xl shadow-xl w-80 text-center border border-[#3a2618]">
            <h2 className="text-2xl font-bold mb-2 text-[#e6c9a8]">
              {popupType === "success" ? "☕ Order Placed" : "⚠️ Error"}
            </h2>

            <p className="mb-4 text-[#cbb39a]">{popupMessage}</p>

            <button
              onClick={() => setPopupType(null)}
              className="px-4 py-2 bg-amber-600 text-[#1b120a] font-semibold rounded hover:bg-amber-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
