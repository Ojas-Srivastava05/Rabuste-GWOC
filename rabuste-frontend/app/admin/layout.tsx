"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LayoutDashboard, ShoppingBag, Utensils, ImageIcon, GraduationCap, Ticket, Users, MessageSquare, Instagram, Brain, LogOut, Bell } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/menu", label: "Menu", icon: Utensils },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/workshops", label: "Workshops", icon: GraduationCap },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/admin/instagram", label: "Instagram", icon: Instagram },
  { href: "/admin/ai-settings", label: "AI Settings", icon: Brain },
];

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
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
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-black text-white rounded-lg shadow-lg hover:bg-gray-900 transition-all"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col bg-black text-white transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: '280px' }}
      >
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="block mb-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-white rounded-lg">
              <Image
                src="/Rabuste logo.png"
                alt="Rabuste Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <h1 className="text-xl font-bold text-center text-white">RABUSTE</h1>
          <p className="text-xs text-center text-gray-400 mt-1">ADMIN PANEL</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            return (
              <NavLink
                key={item.href}
                href={item.href}
                isActive={isActive}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              router.push("/auth");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-900 transition-all"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  children,
  isActive,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive
          ? 'bg-white text-black font-semibold'
          : 'text-gray-300 hover:bg-gray-900 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}
