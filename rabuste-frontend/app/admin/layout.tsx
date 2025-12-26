"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    // Get token & user from localStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/auth/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(user);

      // check admin role
      if (parsedUser.role !== "admin") {
        router.push("/");
      }
    } catch (err) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#f8f5f2]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#2e211a] text-[#fffbd6] flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-[#fffbd633]">
          Rabuste Admin
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink href="/admin">Dashboard</NavLink>
          <NavLink href="/admin/orders">Orders</NavLink>
          <NavLink href="/admin/menu">Menu</NavLink>
          <NavLink href="/admin/workshops">Workshops</NavLink>
          <NavLink href="/admin/users">Users</NavLink>
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/auth/login");
          }}
          className="m-4 rounded bg-red-600 py-2 text-sm font-semibold hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block rounded px-4 py-2 text-sm font-medium hover:bg-[#fffbd620]"
    >
      {children}
    </Link>
  );
}
