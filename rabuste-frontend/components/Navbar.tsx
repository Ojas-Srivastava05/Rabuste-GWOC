"use client";

import Link from "next/link";
import Image from "next/image";
import React, { ReactNode, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { User, LogOut, ShoppingBag, Settings, Edit } from "lucide-react";

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
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

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
        <div className="flex md:hidden items-center gap-3 flex-1">
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="inline-flex items-center justify-center w-10 h-10 bg-transparent border-2 border-[#B87333] text-[#B87333] hover:bg-[#B87333] hover:text-[#000000] transition-all duration-300"
            type="button"
          >
            <svg
              className="w-5 h-5"
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
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          style={{ left: "50%" }}
          aria-hidden={false}
        >
          <Link href="/" aria-label="Home">
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
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-4 py-2.5 flex items-center gap-2 border-2 border-[#B87333]/40 text-[#FFFEF9] hover:bg-[#B87333]/20 transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.1em',
                  fontSize: '12px',
                }}
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
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

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

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-x-4 top-20 z-50 transform-gpu transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div 
          className="border border-[#B87333]/30 p-4 shadow-2xl"
          style={{
            background: 'rgba(0, 0, 0, 0.98)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Mobile User Info */}
          {user && (
            <div className="mb-4 pb-4 border-b border-[#B87333]/20">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-10 h-10 flex items-center justify-center text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                    color: '#000000',
                  }}
                >
                  {getInitials(user.name)}
                </div>
                <div className="flex-1">
                  <p 
                    className="font-medium text-sm"
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
              {user.role && (
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
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <NavButton href="/profile/edit" mobile onClick={() => setOpen(false)}>
              EDIT PROFILE
            </NavButton>
            <NavButton href="/franchise" mobile onClick={() => setOpen(false)}>
              FRANCHISE
            </NavButton>
            <NavButton href="/workshops" mobile onClick={() => setOpen(false)}>
              WORKSHOP
            </NavButton>
            <NavButton href="/order-status" mobile onClick={() => setOpen(false)}>
              ORDERS
            </NavButton>
            <NavButton href="/menu" mobile onClick={() => setOpen(false)}>
              MENU
            </NavButton>
            <NavButton href="/art" mobile onClick={() => setOpen(false)}>
              GALLERY
            </NavButton>
            
            {user ? (
              <>
                {user.role === 'admin' && (
                  <NavButton href="/admin" mobile onClick={() => setOpen(false)}>
                    ADMIN PANEL
                  </NavButton>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-2.5 text-xs tracking-[0.2em] uppercase border border-red-700/50 bg-red-950/30 text-red-400 hover:bg-red-950/50 transition-all duration-300"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <NavButton href="/auth" mobile onClick={() => setOpen(false)}>
                LOGIN
              </NavButton>
            )}
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