"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const { user, isLoading, checkAuth } = useUser();

  // Guard admin routes: require token + admin role
  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [user, checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role !== "admin") {
      router.replace("/auth?redirect=/admin");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || user.role !== "admin") {
    return null; // avoid flashing admin UI before redirect
  }

  // useEffect(() => {
  //   // Get token & user from localStorage
  //   const token = localStorage.getItem("token");
  //   const user = localStorage.getItem("user");

  //   if (!token || !user) {
  //     router.push("/auth");
  //     return;
  //   }

  //   try {
  //     const parsedUser = JSON.parse(user);

  //     // check admin role
  //     if (parsedUser.role !== "admin") {
  //       router.push("/");
  //     }
  //   } catch (err) {
  //     router.push("/auth");
  //   }
  // }, [router]);

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(180deg, #1A1110 0%, #000000 100%)' }}>
      {/* SIDEBAR */}
      <aside
        className="w-72 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, rgba(42, 24, 16, 0.95), rgba(26, 17, 16, 0.95))',
          borderRight: '2px solid rgba(184, 115, 51, 0.3)',
        }}
      >
        <div
          className="p-8 border-b-2"
          style={{ borderColor: 'rgba(184, 115, 51, 0.3)' }}
        >
          <h1
            className="text-3xl mb-2"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#F5F1E8',
              letterSpacing: '0.1em',
            }}
          >
            RABUSTE
          </h1>
          <p className="section-label">ADMIN PANEL</p>
        </div>

        <nav className="flex-1 p-6 space-y-3">
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
            router.push("/auth");
          }}
          className="m-6 btn"
          style={{
            background: 'rgba(220, 38, 38, 0.2)',
            border: '2px solid rgba(220, 38, 38, 0.5)',
            color: '#FCA5A5',
            padding: '16px',
            fontSize: '14px',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
          }}
        >
          LOGOUT
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">{children}</main>
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
      className="block px-6 py-4 transition-all duration-300 rounded-lg"
      style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '16px',
        letterSpacing: '0.1em',
        color: '#F5F1E8',
        background: 'transparent',
        border: '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(184, 115, 51, 0.2)';
        e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      {children}
    </Link>
  );
}
