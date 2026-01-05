"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const { user, isLoading, checkAuth } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg"
        style={{
          background: 'rgba(42, 24, 16, 0.95)',
          border: '2px solid rgba(184, 115, 51, 0.3)',
        }}
      >
        {sidebarOpen ? (
          <X size={24} style={{ color: '#F5F1E8' }} />
        ) : (
          <Menu size={24} style={{ color: '#F5F1E8' }} />
        )}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          width: '288px',
          background: 'linear-gradient(180deg, rgba(42, 24, 16, 0.95), rgba(26, 17, 16, 0.95))',
          borderRight: '2px solid rgba(184, 115, 51, 0.3)',
        }}
      >
        <div
          className="p-8 border-b-2"
          style={{ borderColor: 'rgba(184, 115, 51, 0.3)' }}
        >
          <Link 
            href="/"
            className="block mb-4 transition-transform hover:scale-105 duration-300"
          >
            <div 
              className="flex items-center justify-center w-16 h-16 mx-auto cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
                border: '2px solid rgba(184, 115, 51, 0.4)',
                boxShadow: '0 4px 16px rgba(184, 115, 51, 0.4)',
              }}
            >
              <Image
                src="/Rabuste logo.png"
                alt="Rabuste Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <h1
            className="text-3xl mb-2 text-center"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#F5F1E8',
              letterSpacing: '0.1em',
            }}
          >
            RABUSTE
          </h1>
          <p className="section-label text-center">ADMIN PANEL</p>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          <NavLink href="/admin" onClick={() => setSidebarOpen(false)}>Dashboard</NavLink>
          <NavLink href="/admin/orders" onClick={() => setSidebarOpen(false)}>Orders</NavLink>
          <NavLink href="/admin/menu" onClick={() => setSidebarOpen(false)}>Menu</NavLink>
          <NavLink href="/admin/gallery" onClick={() => setSidebarOpen(false)}>Gallery</NavLink>
          <NavLink href="/admin/workshops" onClick={() => setSidebarOpen(false)}>Workshops</NavLink>
          <NavLink href="/admin/coupons" onClick={() => setSidebarOpen(false)}>Coupons</NavLink>
          <NavLink href="/admin/users" onClick={() => setSidebarOpen(false)}>Users</NavLink>
          <NavLink href="/admin/ai-settings" onClick={() => setSidebarOpen(false)}> AI Settings</NavLink>

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
      <main className="flex-1 overflow-y-auto lg:pl-0 pt-20 lg:pt-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
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
