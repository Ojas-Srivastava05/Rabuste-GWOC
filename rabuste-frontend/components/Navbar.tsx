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
      className="w-full py-4 px-4 md:px-8 relative"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* top row - left/right groups, center logo */}
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* LEFT (hidden on small screens) */}
        <div className="hidden md:flex gap-6 flex-1">
          <NavButton href="#faqs" bg="bg-[#C89B7B]">
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
            className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white/6 backdrop-blur-sm border border-white/6 text-[#f6e6dc] hover:bg-white/8 transition"
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
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-[#4A2825] border-4 border-[#2B1412] flex items-center justify-center shadow-[0_6px_0_#2B1412] cursor-pointer">
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
          <NavButton href="#add-venue" bg="bg-[#8B5E3C]">
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
        <div className="rounded-xl backdrop-blur-sm bg-white/6 border border-white/6 p-4 shadow-lg">
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
              href="#about"
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
              href="#add-venue"
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
    px-6 py-2
    rounded-full
    font-extrabold
    text-[#4A2825]
    border-2 border-[#2B1412]
    shadow-[0_6px_0_#2B1412]
    transition-all
    inline-flex items-center justify-center
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
      className={`${base} hover:translate-y-[2px] hover:shadow-[0_4px_0_#2B1412] active:translate-y-[4px] active:shadow-[0_2px_0_#2B1412]`}
    >
      {children}
    </Link>
  );
}
