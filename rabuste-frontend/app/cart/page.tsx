"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
};

type Cart = {
  items: CartItem[];
  totalAmount: number;
};

function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
    setLoading(false);
  }

  if (loading) {
    return <p style={{ padding: 24 }}>Loading cart…</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <button onClick={() => router.push("/menu")}>
          Go to Menu
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Your Cart</h1>

      {cart.items.map((item) => (
        <div
          key={item.menuItem}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "12px 0",
          }}
        >
          <strong>{item.name}</strong>
          <div>
            ₹{item.price} × {item.quantity}
          </div>
          <div>Subtotal: ₹{item.price * item.quantity}</div>
        </div>
      ))}

      <h2 style={{ marginTop: 24 }}>
        Total: ₹{cart.totalAmount}
      </h2>
      <button
  onClick={async () => {
    await fetch("/api/cart", { method: "DELETE" });
    window.location.reload();
  }}
>
  Clear Cart
</button>

<button
  onClick={() => {
    if (!isLoggedIn()) {
      router.push("/auth?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  }}
>
  Proceed to Checkout
</button>

    </div>
  );
}
