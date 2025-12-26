"use client";

import Link from "next/link";
import { useCartStore } from "../store/cartStore";

export default function CartPage() {
  const { items, updateItem, total } = useCartStore();

  return (
    <div className="min-h-screen bg-[#1b120a] text-[#f3e9dc] p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 && <p>Your cart is empty.</p>}

      {items.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center mb-4 bg-[#24160e] p-3 rounded"
        >
          <div>
            <p>{item.name}</p>
            <p className="text-sm text-[#cbb39a]">₹{item.price}</p>
          </div>

          <input
            type="number"
            min={0}
            value={item.quantity}
            onChange={(e) =>
              updateItem(item.id, Number(e.target.value))
            }
            className="w-16 text-black px-2 py-1 rounded"
          />
        </div>
      ))}

      <p className="font-bold mt-6">Total: ₹{total()}</p>

      {items.length > 0 && (
        <Link
          href="/checkout"
          className="block mt-6 bg-amber-600 text-black py-3 text-center rounded"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}
