"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, ShoppingBag, Heart, TrendingUp, Ticket, LogOut } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

export default function UserLayout({ children }: Props) {
  const router = useRouter();
  const { user, isLoading, checkAuth, logout } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Guard user routes: require token
  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [user, checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/auth?redirect=/user");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return null; // avoid flashing user UI before redirect
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(180deg, #1A1110 0%, #000000 100%)' }}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.9), rgba(205, 127, 50, 0.9))',
          border: '2px solid rgba(184, 115, 51, 0.3)',
          boxShadow: '0 4px 20px rgba(184, 115, 51, 0.4)',
        }}
      >
        {sidebarOpen ? (
          <X size={24} style={{ color: '#1A1110' }} />
        ) : (
          <Menu size={24} style={{ color: '#1A1110' }} />
        )}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          width: '288px',
          background: 'linear-gradient(180deg, rgba(42, 24, 16, 0.98), rgba(26, 17, 16, 0.98))',
          borderRight: '2px solid rgba(184, 115, 51, 0.2)',
          boxShadow: sidebarOpen ? '4px 0 24px rgba(0, 0, 0, 0.3)' : 'none',
        }}
      >
        <div
          className="p-8 border-b-2"
          style={{ borderColor: 'rgba(184, 115, 51, 0.2)' }}
        >
          <Link 
            href="/"
            className="block mb-4 transition-all duration-300 hover:scale-105"
          >
            <div 
              className="flex items-center justify-center w-16 h-16 mx-auto cursor-pointer rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
                border: '2px solid rgba(184, 115, 51, 0.4)',
                boxShadow: '0 8px 24px rgba(184, 115, 51, 0.5)',
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
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            RABUSTE
          </h1>
          <p className="section-label text-center text-sm" style={{ opacity: 0.8 }}>MY DASHBOARD</p>
          {user && (
            <p className="text-center text-sm mt-2" style={{ color: '#B87333' }}>
              Welcome, {user.name}
            </p>
          )}
        </div>

        <nav className="flex-1 p-6 space-y-3">
          <NavLink href="/user" icon={<TrendingUp size={18} />} onClick={() => setSidebarOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink href="/user/profile" icon={<User size={18} />} onClick={() => setSidebarOpen(false)}>
            My Profile
          </NavLink>
          <NavLink href="/user/orders" icon={<ShoppingBag size={18} />} onClick={() => setSidebarOpen(false)}>
            My Orders
          </NavLink>
          <NavLink href="/user/favorites" icon={<Heart size={18} />} onClick={() => setSidebarOpen(false)}>
            My Favorites
          </NavLink>
          <NavLink href="/user/most-ordered" icon={<TrendingUp size={18} />} onClick={() => setSidebarOpen(false)}>
            Most Ordered
          </NavLink>
          <NavLink href="/user/coupons" icon={<Ticket size={18} />} onClick={() => setSidebarOpen(false)}>
            Available Coupons
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="m-6 btn transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(185, 28, 28, 0.3))',
            border: '2px solid rgba(220, 38, 38, 0.4)',
            color: '#FCA5A5',
            padding: '16px',
            fontSize: '14px',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(185, 28, 28, 0.4))';
            e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.6)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(185, 28, 28, 0.3))';
            e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.4)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(220, 38, 38, 0.3)';
          }}
        >
          <LogOut size={18} />
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
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group block px-6 py-4 transition-all duration-300 rounded-xl relative overflow-hidden"
      style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '15px',
        letterSpacing: '0.1em',
        color: '#F5F1E8',
        background: 'transparent',
        border: '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(184, 115, 51, 0.15)';
        e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.3)';
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <span className="relative z-10 flex items-center gap-3">
        <span style={{ color: '#B87333' }}>{icon}</span>
        {children}
      </span>
    </Link>
  );
}