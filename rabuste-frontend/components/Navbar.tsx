"use client";

import Link from "next/link";
import Image from "next/image";
import React, { ReactNode, useState } from "react";

type NavButtonProps = {
  href: string;
  children: ReactNode;
  bg?: string;
  mobile?: boolean;
  onClick?: () => void;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="w-full py-5 px-6 md:px-12 relative"
      style={{ 
        fontFamily: "'Josefin Sans', sans-serif",
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201, 168, 106, 0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      {/* top row - left/right groups, center logo */}
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* LEFT (hidden on small screens) */}
        <div className="hidden md:flex gap-6 flex-1">
          <NavButton href="/menu" bg="bg-[#C89B7B]">
            Menu
          </NavButton>
          <NavButton href="/gallery" bg="bg-[#E6C9A8]">
            Art
          </NavButton>
        </div>

        {/* MOBILE: hamburger on left (keeps logo visually centered) */}
        <div className="flex md:hidden items-center gap-3 flex-1">
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-transparent border border-[#C9A86A] text-[#C9A86A] hover:bg-[#C9A86A] hover:text-[#0A0A0A] transition"
            type="button"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Center logo: absolute centering, responsive */}
        <div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          style={{ left: "50%" }}
          aria-hidden={false}
        >
          <Link href="/" aria-label="Home">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-sm flex items-center justify-center cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #8B6F47 0%, #C9A86A 100%)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                boxShadow: '0 4px 12px rgba(201, 168, 106, 0.3)',
              }}
            >
              <Image
                src="/Rabuste logo.png"
                alt="Brand Logo"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* RIGHT (hidden on small screens) */}
        <div className="hidden md:flex gap-6 flex-1 justify-end">
          
          
          <NavButton href="/workshops" bg="bg-[#B57A5A]">
            Workshop
          </NavButton>
          <NavButton href="/franchise" bg="bg-[#8B5E3C]">
            Franchise
          </NavButton>
          <NavButton href="/auth" bg="bg-[#8B5E3C]">
            Login/Signup
          </NavButton>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-x-4 top-20 z-50 transform-gpu transition-all duration-200 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="rounded-sm border border-[#C9A86A]/20 p-4 shadow-lg"
          style={{
            background: 'rgba(20, 20, 20, 0.98)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex flex-col gap-3">
            <NavButton
              href="#faqs"
              mobile
              onClick={() => setOpen(false)}
              bg="bg-[#C89B7B]"
            >
              Menu
            </NavButton>
            <NavButton
              href="/gallery"
              mobile
              onClick={() => setOpen(false)}
              bg="bg-[#E6C9A8]"
            >
              Art
            </NavButton>
            <NavButton
              href="#contact"
              mobile
              onClick={() => setOpen(false)}
              bg="bg-[#B57A5A]"
            >
              Workshop
            </NavButton>
            <NavButton
              href="/franchise"
              mobile
              onClick={() => setOpen(false)}
              bg="bg-[#8B5E3C]"
            >
              Franchise
            </NavButton>
            <NavButton
              href="/auth"
              mobile
              onClick={() => setOpen(false)}
              bg="bg-[#8B5E3C]"
            >
              Login / Signup
            </NavButton>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavButton({
  href,
  children,
  bg = "bg-transparent",
  mobile = false,
  onClick,
}: NavButtonProps) {
  const base = `
    ${bg}
    px-5 py-2.5
    rounded-sm
    font-light
    text-[#F5F1E8]
    border border-[#C9A86A]/20
    transition-all
    inline-flex items-center justify-center
    text-sm
    tracking-wider
    uppercase
  `;

  if (mobile) {
    return (
      <Link
        href={href}
        onClick={(e: any) => {
          onClick?.();
        }}
        className={`${base} w-full text-center`}
      >
        <span className="text-sm">{children}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={(e: any) => {
        onClick?.();
      }}
      className={`${base} hover:bg-[#C9A86A]/10 hover:border-[#C9A86A]/40`}
    >
      {children}
    </Link>
  );
}
