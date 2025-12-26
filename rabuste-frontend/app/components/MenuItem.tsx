"use client";

import { useCartStore } from "../store/cartStore";

type Props = {
  id: string;
  name: string;
  price: number;
};

export default function MenuItem({ id, name, price }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="flex justify-between items-center bg-[#24160e] p-3 rounded-lg border border-[#3a2618]">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-[#cbb39a]">₹{price}</p>
      </div>
      <button
        onClick={() => addItem({ id, name, price })}
        className="px-3 py-1 bg-amber-600 text-black rounded"
      >
        Add
      </button>
    </div>
  );
}
