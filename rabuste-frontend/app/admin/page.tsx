"use client";

import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminHomePage() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) redirect("/");

  return (
    <div className="min-h-screen bg-[#1b120a] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#2b1d14] text-[#f3e9dc] rounded-xl shadow-xl p-6 border border-[#3a2618]">
        <h1 className="text-2xl font-bold mb-4 text-[#e6c9a8]">Admin Panel</h1>

        <ul className="space-y-3">
          <li>
            <Link href="/admin/orders" className="btn">
              Manage Orders
            </Link>
          </li>

          <li>
            <Link href="/admin/menu" className="btn">
              Manage Menu
            </Link>
          </li>

          <li>
            <Link href="/admin/workshops" className="btn">
              Manage Workshops
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
