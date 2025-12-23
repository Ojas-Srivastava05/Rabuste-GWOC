"use client";

import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-[#1b120a] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#2b1d14] text-[#f3e9dc] rounded-xl shadow-xl p-6 border border-[#3a2618]">
        <h1 className="text-2xl font-bold mb-4 text-[#e6c9a8]">Admin Panel</h1>

        <ul className="space-y-3">
          <li>
            <Link
              href="/admin/orders"
              className="block px-4 py-2 bg-[#c68642] text-[#1b120a] font-semibold rounded-md hover:bg-[#a9713a] transition"
            >
              Manage Orders
            </Link>
          </li>

          <li>
            <Link
              href="/admin/workshops"
              className="block px-4 py-2 bg-[#c68642] text-[#1b120a] font-semibold rounded-md hover:bg-[#a9713a] transition"
            >
              Manage Workshops
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
