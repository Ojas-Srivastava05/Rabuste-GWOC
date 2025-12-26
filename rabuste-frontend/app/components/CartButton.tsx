"use client";

import Link from "next/link";
import { useCartStore } from "../store/cartStore";

export default function CartButton() {
  const items = useCartStore((s) => s.items);

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (totalItems === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-amber-600 text-black px-5 py-3 rounded-full font-bold shadow-xl"
    >
      Cart ({totalItems})
    </Link>
  );
}
