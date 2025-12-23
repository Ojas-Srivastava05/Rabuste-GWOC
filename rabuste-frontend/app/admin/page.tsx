"use client";

import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-800 text-gray-100 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <ul className="space-y-3">
          <li>
            <Link
              href="/admin/orders"
              className="block px-4 py-2 bg-amber-500 text-gray-900 font-semibold rounded-md hover:bg-amber-600"
            >
              Manage Orders
            </Link>
          </li>
          <li>
            <Link
              href="/admin/workshops"
              className="block px-4 py-2 bg-amber-500 text-gray-900 font-semibold rounded-md hover:bg-amber-600"
            >
              Manage Workshops
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
