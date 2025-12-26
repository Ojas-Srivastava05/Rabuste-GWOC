"use client";

import { useState } from "react";
import CartButton from "../components/CartButton";
import { useCartStore } from "../store/cartStore";

const MENU = [
  {
    title: "Robusta Speciality Coffee (Cold) – Non-Milk",
    items: [
      { id: "rs-cold-americano", name: "Iced Americano", price: 160 },
      { id: "rs-cold-espresso", name: "Iced Espresso", price: 130 },
      {
        id: "rs-tonic",
        name: "Iced Espresso (Tonic / Ginger Ale / Orange)",
        price: 250,
      },
      { id: "rs-redbull", name: "Iced Espresso (Redbull)", price: 290 },
      { id: "rs-cranberry-tonic", name: "Cranberry Tonic", price: 270 },
    ],
  },
  {
    title: "Robusta Speciality Coffee (Cold) – Milk Based",
    items: [
      { id: "rs-iced-latte", name: "Iced Latte", price: 220 },
      { id: "rs-affogato", name: "Affogato", price: 250 },
      { id: "rs-classic-frappe", name: "Classic Frappe", price: 250 },
      { id: "rs-hazelnut", name: "Hazelnut", price: 260 },
      { id: "rs-caramel", name: "Caramel", price: 260 },
      { id: "rs-mocha", name: "Mocha", price: 270 },
      { id: "rs-biscoff", name: "Biscoff", price: 270 },
      { id: "rs-vietnamese", name: "Vietnamese", price: 240 },
      { id: "rs-cafe-suda", name: "Café Suda", price: 250 },
      { id: "rs-robco", name: "Robco", price: 290 },
    ],
  },
  {
    title: "Robusta Speciality Coffee (Hot)",
    items: [
      { id: "rs-hot-americano", name: "Hot Americano", price: 150 },
      { id: "rs-hot-espresso", name: "Hot Espresso", price: 130 },
      { id: "rs-hot-latte", name: "Hot Latte", price: 190 },
      { id: "rs-hot-flatwhite", name: "Hot Flat White", price: 180 },
      { id: "rs-hot-cappuccino", name: "Hot Cappuccino", price: 180 },
      { id: "rs-hot-mocha", name: "Hot Mocha", price: 230 },
    ],
  },
  {
    title: "Blend Coffee (Cold)",
    items: [
      { id: "blend-cold-americano", name: "Iced Americano", price: 150 },
      { id: "blend-cold-espresso", name: "Iced Espresso", price: 120 },
      {
        id: "blend-tonic",
        name: "Iced Espresso (Tonic / Ginger Ale / Orange)",
        price: 230,
      },
      { id: "blend-redbull", name: "Iced Espresso (Redbull)", price: 270 },
      { id: "blend-cranberry-tonic", name: "Cranberry Tonic", price: 250 },
      { id: "blend-iced-latte", name: "Iced Latte", price: 210 },
      { id: "blend-affogato", name: "Affogato", price: 240 },
      { id: "blend-classic-frappe", name: "Classic Frappe", price: 240 },
      { id: "blend-hazelnut", name: "Hazelnut", price: 250 },
      { id: "blend-caramel", name: "Caramel", price: 250 },
      { id: "blend-mocha", name: "Mocha", price: 260 },
      { id: "blend-biscoff", name: "Biscoff", price: 260 },
    ],
  },
  {
    title: "Blend Coffee (Hot)",
    items: [
      { id: "blend-hot-americano", name: "Hot Americano", price: 140 },
      { id: "blend-hot-espresso", name: "Hot Espresso", price: 120 },
      { id: "blend-hot-latte", name: "Hot Latte", price: 180 },
      { id: "blend-hot-flatwhite", name: "Hot Flat White", price: 170 },
      { id: "blend-hot-cappuccino", name: "Hot Cappuccino", price: 170 },
      { id: "blend-hot-mocha", name: "Mocha", price: 220 },
    ],
  },
  {
    title: "Manual Brew (Robusta – Peaberry Special)",
    items: [
      { id: "cold-brew", name: "Classic Cold Brew", price: 220 },
      {
        id: "cold-brew-tonic",
        name: "Cold Brew (Tonic / Ginger Ale / Orange)",
        price: 270,
      },
      { id: "cold-brew-redbull", name: "Cold Brew (Redbull)", price: 290 },
      { id: "v60-hot", name: "V60 Pour Over (Hot)", price: 220 },
      {
        id: "cranberry-cold-brew",
        name: "Cranberry Cold Brew Tonic",
        price: 280,
      },
    ],
  },
  {
    title: "Shakes",
    items: [
      { id: "shake-chocolate", name: "Chocolate Shake", price: 220 },
      { id: "shake-biscoff", name: "Biscoff Shake", price: 250 },
      { id: "shake-nutella", name: "Nutella Shake", price: 260 },
    ],
  },
  {
    title: "Cold Tea",
    items: [
      { id: "lemon-ice-tea", name: "Lemon Ice Tea", price: 210 },
      { id: "peach-ice-tea", name: "Peach Ice Tea", price: 210 },
      { id: "ginger-fizz", name: "Ginger Fizz", price: 250 },
      { id: "orange-mint", name: "Classic Orange Mint", price: 250 },
    ],
  },
  {
    title: "Food",
    items: [
      { id: "fries", name: "Fries", price: 150 },
      { id: "potato-wedges", name: "Potato Wedges", price: 170 },
      { id: "veg-nuggets", name: "Veg Nuggets", price: 190 },
      { id: "pizza", name: "Pizza", price: 300 },
      { id: "bagel", name: "Bagel", price: 100 },
      { id: "cream-cheese-bagel", name: "Cream Cheese Bagel", price: 150 },
      { id: "jalapeno-bagel", name: "Jalapeno Cheese Bagel", price: 200 },
      { id: "pesto-bagel", name: "Pesto Bagel", price: 230 },
      { id: "butter-croissant", name: "Butter Croissant", price: 150 },
      { id: "nutella-croissant", name: "Nutella Croissant", price: 200 },
      {
        id: "cream-cheese-croissant",
        name: "Cream Cheese Croissant",
        price: 240,
      },
    ],
  },
];

export default function MenuPage() {
  const addToCart = useCartStore((state) => state.addItem);

  const [modalItem, setModalItem] = useState<null | {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>(null);

  const openModal = (item: { id: string; name: string; price: number }) => {
    setModalItem({ ...item, quantity: 1 });
  };

  const closeModal = () => setModalItem(null);

  const changeQuantity = (delta: number) => {
    if (!modalItem) return;
    const newQty = modalItem.quantity + delta;
    if (newQty < 1) return;
    setModalItem({ ...modalItem, quantity: newQty });
  };

  const addToCartFromModal = () => {
    if (!modalItem) return;
    addToCart({
      id: modalItem.id,
      name: modalItem.name,
      price: modalItem.price,
      quantity: modalItem.quantity,
    });
    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#1b120a] text-[#f3e9dc] p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Menu</h1>

      {/* Categories as Cards */}
      <div className="grid gap-6">
        {MENU.map((section) => (
          <div
            key={section.title}
            className="bg-[#24160e] rounded-2xl p-4 shadow-lg border border-[#3a2618]"
          >
            <h2 className="text-xl font-bold mb-4">{section.title}</h2>

            {/* Items as Bold Square Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#2b1d14] border border-[#3a2618] rounded-lg cursor-pointer hover:shadow-xl transition flex flex-col justify-between p-4"
                  onClick={() => openModal(item)}
                >
                  {/* Image as perfect square */}
                  <div className="bg-[#3a2618] aspect-square w-full rounded-lg mb-3 flex items-center justify-center text-[#cbb39a] text-lg font-bold">
                    Image
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-bold">{item.name}</span>
                    <span className="text-[#cbb39a] font-semibold">
                      ₹{item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CartButton />

      {/* Modal */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#2b1d14] p-6 rounded-2xl shadow-xl w-80 text-center border border-[#3a2618]">
            <h2 className="text-2xl font-bold mb-2 text-[#e6c9a8]">
              {modalItem.name}
            </h2>
            <p className="text-[#cbb39a] mb-4">Price: ₹{modalItem.price}</p>

            <div className="flex justify-center items-center gap-4 mb-4">
              <button
                onClick={() => changeQuantity(-1)}
                className="px-4 py-1 bg-[#3a2618] rounded hover:bg-[#4a331f] transition"
              >
                −
              </button>
              <span className="text-lg font-bold">{modalItem.quantity}</span>
              <button
                onClick={() => changeQuantity(1)}
                className="px-4 py-1 bg-[#3a2618] rounded hover:bg-[#4a331f] transition"
              >
                +
              </button>
            </div>

            <button
              onClick={addToCartFromModal}
              className="w-full py-2 bg-amber-600 rounded-xl font-bold text-[#1b120a] hover:bg-amber-700 transition mb-2"
            >
              Add to Cart
            </button>

            <button
              onClick={closeModal}
              className="w-full py-2 bg-[#3a2618] rounded-xl font-semibold hover:bg-[#4a331f] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
