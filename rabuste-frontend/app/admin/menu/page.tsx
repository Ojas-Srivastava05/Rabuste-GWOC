import { requireAdmin } from "@/lib/requireAdmin";
import { redirect } from "next/navigation";

export default async function AdminMenuPage() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) redirect("/");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/menu`, {
    cache: "no-store",
  });

  const items = await res.json();

  return (
    <div className="p-6 text-[#f3e9dc]">
      <h1 className="text-2xl font-bold mb-4">Menu Items</h1>

      <div className="grid gap-4">
        {items.map((item: any) => (
          <div
            key={item._id}
            className="bg-[#2b1d14] p-4 rounded-lg border border-[#3a2618]"
          >
            <h2 className="font-semibold">{item.name}</h2>
            <p>₹{item.price}</p>
            <p>Status: {item.inStock ? "In stock" : "Out of stock"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
