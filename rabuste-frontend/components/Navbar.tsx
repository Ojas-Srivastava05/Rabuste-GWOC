"use client";

import Link from "next/link";
import Image from "next/image";
import React, { ReactNode, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { 
  User, LogOut, ShoppingBag, Settings, Edit, Menu as MenuIcon, 
  Coffee, Palette, Calendar, Store, MessageSquare, FlaskConical,
  Sparkles, ShoppingCart, Package, FileText, Heart, Gift,
  BarChart3, Users, Image as ImageIcon, Instagram, Ticket,
  Brain, Home, ArrowRight
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

type NavButtonProps = {
  href?: string;
  children: ReactNode;
  mobile?: boolean;
  onClick?: () => void;
  isButton?: boolean;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showDropdown]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    setShowDropdown(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={`w-full px-6 md:px-12 relative transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
      style={{ 
        fontFamily: 'var(--font-heading)',
        background: scrolled 
          ? 'linear-gradient(180deg, rgba(0, 0, 0, 0.98), rgba(26, 17, 16, 0.95))' 
          : 'linear-gradient(180deg, rgba(0, 0, 0, 0.92), rgba(26, 17, 16, 0.88))',
        backdropFilter: 'blur(30px) saturate(180%)',
        borderBottom: scrolled 
          ? '2px solid rgba(184, 115, 51, 0.3)' 
          : '1px solid rgba(184, 115, 51, 0.15)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: scrolled 
          ? '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(184, 115, 51, 0.2), inset 0 1px 0 rgba(184, 115, 51, 0.1)' 
          : '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 115, 51, 0.05)',
      }}
    >
      {/* Subtle animated gradient background */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.05), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmerNav 8s ease-in-out infinite',
        }}
      />

      {/* top row - left/right groups, center logo */}
      <div className="flex items-center justify-between max-w-7xl mx-auto relative z-10">
        {/* LEFT (hidden on small screens) */}
        <div className="hidden md:flex gap-4 flex-1">
          <NavButton href="/franchise">FRANCHISE</NavButton>
          <NavButton href="/workshops">WORKSHOP</NavButton>
          <NavButton href="/order-status">MY ORDERS</NavButton>
          <NavButton href="/feedback">FEEDBACK</NavButton>
        </div>

        {/* MOBILE: hamburger on left */}
        <div className="flex md:hidden items-center gap-3 flex-1 z-50 relative">
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setOpen((s) => !s);
            }}
            className="inline-flex items-center justify-center w-11 h-11 bg-transparent border-2 border-[#B87333] text-[#B87333] hover:bg-[#B87333] hover:text-[#000000] active:bg-[#B87333] active:text-[#000000] transition-all duration-300 touch-manipulation"
            style={{ 
              minWidth: '44px', 
              minHeight: '44px',
              boxShadow: open ? '0 0 15px rgba(184, 115, 51, 0.5)' : 'none',
            }}
            type="button"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Center logo */}
        <div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10"
          style={{ left: "50%" }}
          aria-hidden={false}
        >
          <Link 
            href="/" 
            aria-label="Home"
            onClick={(e) => {
              // If already on home page, prevent navigation and just scroll to top
              if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              }
            }}
          >
            <div 
              className={`flex items-center justify-center cursor-pointer transition-all duration-300 ${
                scrolled ? 'h-9 w-9 md:h-10 md:w-10' : 'h-10 w-10 md:h-12 md:w-12'
              }`}
              style={{
                background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
                border: '2px solid rgba(184, 115, 51, 0.4)',
                boxShadow: '0 4px 16px rgba(184, 115, 51, 0.4)',
              }}
            >
              <Image
                src="/Rabuste logo.png"
                alt="Brand Logo"
                width={scrolled ? 24 : 28}
                height={scrolled ? 24 : 28}
                className="object-contain transition-all duration-300"
                priority
              />
            </div>
          </Link>
        </div>

        {/* RIGHT (hidden on small screens) */}
        <div className="hidden md:flex gap-4 flex-1 justify-end items-center">
          <NavButton href="/menu">MENU</NavButton>
          <NavButton href="/art">GALLERY</NavButton>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-0 border-2 border-[#B87333]/40 hover:bg-[#B87333]/20 transition-all duration-300">
                <button
                  onClick={() => {
                    router.push('/user');
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2.5 flex items-center gap-2 text-[#FFFEF9] hover:bg-[#B87333]/10 transition-all duration-300 flex-1"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.1em',
                    fontSize: '12px',
                  }}
                  title="Go to Dashboard"
                >
                  <div 
                    className="w-7 h-7 flex items-center justify-center text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                      color: '#000000',
                    }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <span className="uppercase">{user.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="px-2 py-2.5 border-l-2 border-[#B87333]/40 hover:bg-[#B87333]/10 transition-all duration-300"
                  title="Toggle menu"
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: '#FFFEF9' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-72 border-2 border-[#B87333]/40 shadow-2xl"
                  style={{
                    background: 'rgba(0, 0, 0, 0.98)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* User Info Section */}
                  <div className="p-4 border-b border-[#B87333]/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-12 h-12 flex items-center justify-center text-lg font-bold"
                        style={{
                          background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                          color: '#000000',
                        }}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="flex-1">
                        <p 
                          className="font-medium text-sm mb-1"
                          style={{ 
                            color: '#FFFEF9',
                            fontFamily: 'var(--font-heading)',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {user.name}
                        </p>
                        <p className="text-xs" style={{ color: '#8B6F47' }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {user.phone && (
                      <p className="text-xs flex items-center gap-2" style={{ color: '#8B6F47' }}>
                        <span>📞</span>
                        {user.phone.fullNumber}
                      </p>
                    )}
                    {user.role && (
                      <div className="mt-2">
                        <span 
                          className="inline-block px-2 py-1 text-xs uppercase"
                          style={{
                            background: user.role === 'admin' 
                              ? 'rgba(184, 115, 51, 0.2)' 
                              : 'rgba(139, 111, 71, 0.2)',
                            color: user.role === 'admin' ? '#B87333' : '#8B6F47',
                            border: `1px solid ${user.role === 'admin' ? '#B87333' : '#8B6F47'}`,
                            letterSpacing: '0.1em',
                          }}
                        >
                          {user.role}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        router.push('/profile/edit');
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#B87333]/10 transition-colors text-left"
                    >
                      <Edit size={18} style={{ color: '#B87333' }} />
                      <span 
                        className="text-sm"
                        style={{ 
                          color: '#FFFEF9',
                          fontFamily: 'var(--font-heading)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        EDIT PROFILE
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        router.push('/order-status');
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#B87333]/10 transition-colors text-left"
                    >
                      <ShoppingBag size={18} style={{ color: '#B87333' }} />
                      <span 
                        className="text-sm"
                        style={{ 
                          color: '#FFFEF9',
                          fontFamily: 'var(--font-heading)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        MY ORDERS
                      </span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          router.push('/admin');
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#B87333]/10 transition-colors text-left"
                      >
                        <Settings size={18} style={{ color: '#B87333' }} />
                        <span 
                          className="text-sm"
                          style={{ 
                            color: '#FFFEF9',
                            fontFamily: 'var(--font-heading)',
                            letterSpacing: '0.05em',
                          }}
                        >
                          ADMIN PANEL
                        </span>
                      </button>
                    )}

                    <div className="my-2 mx-4" style={{ height: '1px', background: 'rgba(184, 115, 51, 0.2)' }} />

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-950/30 transition-colors text-left"
                    >
                      <LogOut size={18} style={{ color: '#ef4444' }} />
                      <span 
                        className="text-sm"
                        style={{ 
                          color: '#ef4444',
                          fontFamily: 'var(--font-heading)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        LOGOUT
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavButton href="/auth">LOGIN</NavButton>
          )}
        </div>
      </div>

      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {open && (
          <div
            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
            onTouchStart={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
            style={{ touchAction: "none" }}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu overlay - Full height scrollable */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 right-0 z-50 transform-gpu transition-all duration-300 ease-out ${
          open
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-full pointer-events-none"
        }`}
        aria-hidden={!open}
        style={{
          top: scrolled ? '60px' : '70px',
          maxHeight: `calc(100vh - ${scrolled ? '60px' : '70px'})`,
        }}
      >
        <div 
          className="h-full overflow-y-auto"
          style={{
            background: 'rgba(0, 0, 0, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(184, 115, 51, 0.3)',
          }}
        >
          {/* Close Button Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-[#B87333]/20" style={{
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
          }}>
            <h2 
              className="text-lg uppercase tracking-wider"
              style={{
                color: '#B87333',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.15em',
                fontWeight: 600,
              }}
            >
              MENU
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 flex items-center justify-center border border-[#B87333]/40 hover:bg-[#B87333]/20 transition-all duration-300"
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ color: '#B87333' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-4 sm:p-6">
          {/* Mobile User Info */}
          {user && (
              <div className="mb-6 pb-6 border-b border-[#B87333]/20">
              <button
                onClick={() => {
                  router.push('/user');
                  setOpen(false);
                }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-[#B87333]/10 transition-all duration-300"
                  style={{
                    background: 'rgba(26, 17, 16, 0.6)',
                    border: '1px solid rgba(184, 115, 51, 0.2)',
                  }}
              >
                <div 
                    className="w-12 h-12 flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                    color: '#000000',
                  }}
                >
                  {getInitials(user.name)}
                </div>
                  <div className="flex-1 text-left min-w-0">
                  <p 
                      className="font-medium text-sm mb-1 truncate"
                    style={{ 
                      color: '#FFFEF9',
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {user.name}
                  </p>
                    <p className="text-xs truncate" style={{ color: '#8B6F47' }}>
                    {user.email}
                  </p>
                </div>
                  <ArrowRight size={18} style={{ color: '#B87333', flexShrink: 0 }} />
              </button>
              {user.role && (
                  <div className="mt-3">
                <span 
                      className="inline-block px-3 py-1.5 text-xs uppercase"
                  style={{
                    background: user.role === 'admin' 
                      ? 'rgba(184, 115, 51, 0.2)' 
                      : 'rgba(139, 111, 71, 0.2)',
                    color: user.role === 'admin' ? '#B87333' : '#8B6F47',
                    border: `1px solid ${user.role === 'admin' ? '#B87333' : '#8B6F47'}`,
                    letterSpacing: '0.1em',
                        fontFamily: 'var(--font-heading)',
                  }}
                >
                  {user.role}
                </span>
                  </div>
              )}
            </div>
          )}

            {/* Menu Sections */}
            <div className="space-y-6">
              {/* Main Navigation */}
              <div>
                <h3 
                  className="text-xs uppercase mb-3 px-2"
                  style={{
                    color: '#8B6F47',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.15em',
                    fontWeight: 600,
                  }}
                >
                  NAVIGATION
                </h3>
                <div className="space-y-1">
                  <MobileNavItem 
                    href="/" 
                    icon={Home} 
                    label="HOME"
                    onClick={() => setOpen(false)}
                  />
                  <MobileNavItem 
                    href="/menu" 
                    icon={Coffee} 
                    label="MENU"
                    onClick={() => setOpen(false)}
                  />
                  <MobileNavItem 
                    href="/art" 
                    icon={Palette} 
                    label="ART GALLERY"
                    onClick={() => setOpen(false)}
                  />
                  <MobileNavItem 
                    href="/workshops" 
                    icon={Calendar} 
                    label="WORKSHOPS"
                    onClick={() => setOpen(false)}
                  />
                  <MobileNavItem 
                    href="/franchise" 
                    icon={Store} 
                    label="FRANCHISE"
                    onClick={() => setOpen(false)}
                  />
                  <MobileNavItem 
                    href="/science" 
                    icon={FlaskConical} 
                    label="SCIENCE"
                    onClick={() => setOpen(false)}
                  />
                  <MobileNavItem 
                    href="/moodBrewer" 
                    icon={Sparkles} 
                    label="MOOD BREWER"
                    onClick={() => setOpen(false)}
                  />
                </div>
              </div>

              {/* Shopping */}
              <div>
                <h3 
                  className="text-xs uppercase mb-3 px-2"
                  style={{
                    color: '#8B6F47',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.15em',
                    fontWeight: 600,
                  }}
                >
                  SHOPPING
                </h3>
                <div className="space-y-1">
                  <MobileNavItem 
                    href="/cart" 
                    icon={ShoppingCart} 
                    label="CART"
                    onClick={() => setOpen(false)}
                  />
                  <MobileNavItem 
                    href="/order-status" 
                    icon={Package} 
                    label="MY ORDERS"
                    onClick={() => setOpen(false)}
                  />
                  <MobileNavItem 
                    href="/art-order-status" 
                    icon={FileText} 
                    label="ART ORDERS"
                    onClick={() => setOpen(false)}
                  />
                  {user && (
                    <MobileNavItem 
                      href="/user/coupons" 
                      icon={Ticket} 
                      label="MY COUPONS"
                      onClick={() => setOpen(false)}
                    />
                  )}
                </div>
              </div>

              {/* Account */}
            {user ? (
                <div>
                  <h3 
                    className="text-xs uppercase mb-3 px-2"
                    style={{
                      color: '#8B6F47',
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.15em',
                      fontWeight: 600,
                    }}
                  >
                    ACCOUNT
                  </h3>
                  <div className="space-y-1">
                    <MobileNavItem 
                      href="/user" 
                      icon={User} 
                      label="DASHBOARD"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/profile/edit" 
                      icon={Edit} 
                      label="EDIT PROFILE"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/user/favorites" 
                      icon={Heart} 
                      label="FAVORITES"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/user/most-ordered" 
                      icon={Gift} 
                      label="MOST ORDERED"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/feedback" 
                      icon={MessageSquare} 
                      label="FEEDBACK"
                      onClick={() => setOpen(false)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 
                    className="text-xs uppercase mb-3 px-2"
                    style={{
                      color: '#8B6F47',
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.15em',
                      fontWeight: 600,
                    }}
                  >
                    ACCOUNT
                  </h3>
                  <div className="space-y-1">
                    <MobileNavItem 
                      href="/auth" 
                      icon={User} 
                      label="LOGIN / SIGNUP"
                      onClick={() => setOpen(false)}
                    />
                  </div>
                </div>
              )}

              {/* Admin Panel */}
              {user?.role === 'admin' && (
                <div>
                  <h3 
                    className="text-xs uppercase mb-3 px-2"
                    style={{
                      color: '#8B6F47',
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.15em',
                      fontWeight: 600,
                    }}
                  >
                    ADMIN
                  </h3>
                  <div className="space-y-1">
                    <MobileNavItem 
                      href="/admin" 
                      icon={BarChart3} 
                      label="DASHBOARD"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/admin/orders" 
                      icon={Package} 
                      label="ORDERS"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/admin/menu" 
                      icon={Coffee} 
                      label="MENU"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/admin/gallery" 
                      icon={ImageIcon} 
                      label="GALLERY"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/admin/workshops" 
                      icon={Calendar} 
                      label="WORKSHOPS"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/admin/users" 
                      icon={Users} 
                      label="USERS"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/admin/coupons" 
                      icon={Ticket} 
                      label="COUPONS"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/admin/feedback" 
                      icon={MessageSquare} 
                      label="FEEDBACK"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/admin/instagram" 
                      icon={Instagram} 
                      label="INSTAGRAM"
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavItem 
                      href="/admin/ai-settings" 
                      icon={Brain} 
                      label="AI SETTINGS"
                      onClick={() => setOpen(false)}
                    />
                  </div>
                </div>
              )}

              {/* Logout Button */}
              {user && (
                <div className="pt-4 border-t border-[#B87333]/20">
                <button
                  onClick={handleLogout}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-red-950/30 transition-all duration-300"
                    style={{
                      background: 'rgba(220, 38, 38, 0.1)',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    <LogOut size={18} style={{ color: '#ef4444' }} />
                    <span 
                      className="text-sm uppercase tracking-wider"
                      style={{ 
                        color: '#ef4444',
                        letterSpacing: '0.1em',
                      }}
                >
                  LOGOUT
                    </span>
                </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmerNav {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </nav>
  );
}

function NavButton({
  href,
  children,
  mobile = false,
  onClick,
  isButton = false,
}: NavButtonProps) {
  const base = `
    px-5 py-2.5
    text-[#FFFEF9]
    border border-transparent
    transition-all duration-300
    inline-flex items-center justify-center
    text-sm
    tracking-[0.1em]
    uppercase
    relative
    overflow-hidden
    group
  `;

  const hoverStyles = `
    hover:text-[#000000]
    before:absolute before:inset-0
    before:bg-gradient-to-r before:from-[#B87333] before:to-[#CD7F32]
    before:translate-y-full before:transition-transform before:duration-300
    hover:before:translate-y-0
  `;

  if (isButton) {
    return (
      <button
        onClick={onClick}
        className={`${base} ${hoverStyles} ${mobile ? 'w-full text-center border-[#B87333]/20' : ''}`}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }

  if (mobile) {
    return (
      <Link
        href={href || "#"}
        onClick={(e: any) => {
          onClick?.();
        }}
        className={`${base} ${hoverStyles} w-full text-center border-[#B87333]/20`}
      >
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href || "#"}
      onClick={(e: any) => {
        onClick?.();
      }}
      className={`${base} ${hoverStyles}`}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

// Mobile Nav Item Component
function MobileNavItem({ 
  href, 
  icon: Icon, 
  label, 
  onClick 
}: { 
  href: string; 
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; 
  label: string; 
  onClick: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="block"
    >
      <div
        className="flex items-center gap-3 px-3 py-3 transition-all duration-300 group"
        style={{
          background: isActive 
            ? 'rgba(184, 115, 51, 0.15)' 
            : 'transparent',
          border: isActive 
            ? '1px solid rgba(184, 115, 51, 0.4)' 
            : '1px solid transparent',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'rgba(184, 115, 51, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }
        }}
      >
        <div
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
          style={{
            background: isActive 
              ? '#B87333' 
              : 'rgba(184, 115, 51, 0.1)',
            border: `1px solid ${isActive ? '#B87333' : 'rgba(184, 115, 51, 0.2)'}`,
          }}
        >
          <Icon 
            size={18} 
            style={{ 
              color: isActive ? '#000000' : '#B87333',
            }} 
          />
        </div>
        <span
          className="flex-1 text-sm uppercase tracking-wider"
          style={{
            color: isActive ? '#B87333' : '#FFFEF9',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
          }}
        >
          {label}
        </span>
        <ArrowRight 
          size={16} 
          className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
          style={{ color: '#B87333', flexShrink: 0 }}
        />
      </div>
    </Link>
  );
}