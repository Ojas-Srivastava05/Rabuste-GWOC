"use client";

import Link from "next/link";
import Image from "next/image";
import React, { ReactNode, useState, useEffect } from "react";

type NavButtonProps = {
  href: string;
  children: ReactNode;
  mobile?: boolean;
  onClick?: () => void;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`w-full px-6 md:px-12 relative transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
      style={{ 
        fontFamily: "'Work Sans', sans-serif",
        background: scrolled 
          ? 'linear-gradient(180deg, rgba(26, 15, 10, 0.98), rgba(42, 24, 16, 0.95))' 
          : 'linear-gradient(180deg, rgba(26, 15, 10, 0.96), rgba(42, 24, 16, 0.92))',
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
          <NavButton href="/menu">MENU</NavButton>
          <NavButton href="/gallery">GALLERY</NavButton>
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
        <div className="hidden md:flex gap-4 flex-1 justify-end">
          <NavButton href="/workshops">WORKSHOP</NavButton>
          <NavButton href="/franchise">FRANCHISE</NavButton>
          <NavButton href="/auth">LOGIN</NavButton>
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
          <div className="flex flex-col gap-3">
            <NavButton href="/menu" mobile onClick={() => setOpen(false)}>
              MENU
            </NavButton>
            <NavButton href="/gallery" mobile onClick={() => setOpen(false)}>
              GALLERY
            </NavButton>
            <NavButton href="/workshops" mobile onClick={() => setOpen(false)}>
              WORKSHOP
            </NavButton>
            <NavButton href="/franchise" mobile onClick={() => setOpen(false)}>
              FRANCHISE
            </NavButton>
            <NavButton href="/auth" mobile onClick={() => setOpen(false)}>
              LOGIN
            </NavButton>
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
}: NavButtonProps) {
  const base = `
    px-5 py-2.5
    font-medium
    text-[#FFFEF9]
    border border-transparent
    transition-all duration-300
    inline-flex items-center justify-center
    text-xs
    tracking-[0.2em]
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

  if (mobile) {
    return (
      <Link
        href={href}
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
      href={href}
      onClick={(e: any) => {
        onClick?.();
      }}
      className={`${base} ${hoverStyles}`}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}