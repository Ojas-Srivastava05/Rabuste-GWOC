"use client";

import { useState } from "react";
import { useCartStore } from "../store/cartStore";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [popupType, setPopupType] = useState<"success" | "error" | null>(null);
  const [popupMessage, setPopupMessage] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [instructions, setInstructions] = useState("");

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!customerName || !customerEmail || items.length === 0) {
      setPopupType("error");
      setPopupMessage("Please fill all details and add items to cart.");
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
          instructions,
          items,
          totalAmount,
        }),
      });

      setPopupType("success");
      setPopupMessage("Your coffee order has been placed ☕");

      clearCart();
      setCustomerName("");
      setCustomerEmail("");
      setInstructions("");
    } catch {
      setPopupType("error");
      setPopupMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#1b120a] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#2b1d14] text-[#f3e9dc] rounded-2xl shadow-2xl border border-[#3a2618] p-6">
          <h1 className="text-3xl font-extrabold mb-1 text-center text-[#e6c9a8]">
            Checkout
          </h1>
          <p className="text-center text-sm text-[#cbb39a] mb-6">
            Confirm your coffee order
          </p>

          {/* CUSTOMER INFO */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                className="w-full px-3 py-2 bg-[#1b120a] border border-[#3a2618] rounded-lg"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-[#1b120a] border border-[#3a2618] rounded-lg"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Special Instructions</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 bg-[#1b120a] border border-[#3a2618] rounded-lg resize-none"
                placeholder="Extra hot, less sugar…"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Your Order</h2>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between bg-[#24160e] px-3 py-2 rounded-lg"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL */}
          <div className="mt-6 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="mt-6 w-full py-3 bg-amber-600 text-black font-bold rounded-xl"
          >
            {loading ? "Brewing your coffee…" : "Place Order"}
          </button>
        </div>
      </div>

      {/* POPUP */}
      {popupType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#2b1d14] p-6 rounded-2xl w-80 text-center">
            <h2 className="text-2xl font-bold mb-2">
              {popupType === "success" ? "☕ Order Placed" : "⚠️ Error"}
            </h2>
            <p className="mb-4">{popupMessage}</p>
            <button
              onClick={() => setPopupType(null)}
              className="px-4 py-2 bg-amber-600 text-black font-semibold rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
