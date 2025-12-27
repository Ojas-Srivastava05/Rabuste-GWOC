"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

type Cart = {
  items: CartItem[];
  totalAmount: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
  }

  async function handleMockPayment() {
    setPaying(true);

    // simulate payment delay
    setTimeout(async () => {
      // create order
      await fetch("/api/order", { method: "POST" });

      // redirect to status page
      router.push("/order-status");
    }, 2000);
  }

  if (!cart || cart.items.length === 0) {
    return <p style={{ padding: 24 }}>Cart is empty</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Checkout</h1>

      {cart.items.map((item, i) => (
        <div key={i}>
          {item.name} × {item.quantity} = ₹
          {item.price * item.quantity}
        </div>
      ))}

      <h2>Total: ₹{cart.totalAmount}</h2>

      <button
        onClick={handleMockPayment}
        disabled={paying}
        style={{ marginTop: 16 }}
      >
        {paying ? "Processing..." : `Pay ₹${cart.totalAmount}`}
      </button>
    </div>
  );
}
