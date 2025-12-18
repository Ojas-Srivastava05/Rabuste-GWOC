"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

type NavButtonProps = {
  href: string;
  children: ReactNode;
  bg: string;
};

export default function Navbar() {
  return (
    <nav
      className="w-full py-6 px-8 relative"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* main flex row for left / right groups; logo is absolutely centered */}
      <div className="flex items-center justify-between">
        {/* LEFT (flex-1 keeps space for centered logo) */}
        <div className="flex gap-6 flex-1">
          <NavButton href="#faqs" bg="bg-[#C89B7B]">
            Menu
          </NavButton>
          <NavButton href="#about" bg="bg-[#E6C9A8]">
            Art
          </NavButton>
        </div>

        {/* RIGHT (flex-1 to balance layout) */}
        <div className="flex gap-6 flex-1 justify-end">
          <NavButton href="#contact" bg="bg-[#B57A5A]">
            Workshop
          </NavButton>
          <NavButton href="#add-venue" bg="bg-[#8B5E3C]">
            Franchise
          </NavButton>
          <NavButton href="#add-venue" bg="bg-[#8B5E3C]">
            Login/Signup
          </NavButton>
        </div>
      </div>

      {/* Center logo: absolute, exactly centered in the navbar */}
      <div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
        style={{ left: '49.5%' }} /* nudge logo slightly right; change 52% to taste */
        aria-hidden={false}
      >
        <Link href="/" aria-label="Home">
          <div className="h-14 w-14 rounded-full bg-[#4A2825] border-4 border-[#2B1412] flex items-center justify-center shadow-[0_6px_0_#2B1412] cursor-pointer">
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
    </nav>
  );
}

function NavButton({ href, children, bg }: NavButtonProps) {
  return (
    <Link
      href={href}
      className={`
        ${bg}
        px-8 py-3
        rounded-full
        font-extrabold
        text-[#4A2825]
        border-2 border-[#2B1412]
        shadow-[0_6px_0_#2B1412]
        hover:translate-y-[2px]
        hover:shadow-[0_4px_0_#2B1412]
        active:translate-y-[4px]
        active:shadow-[0_2px_0_#2B1412]
        transition-all
      `}
    >
      {children}
    </Link>
  );
}
