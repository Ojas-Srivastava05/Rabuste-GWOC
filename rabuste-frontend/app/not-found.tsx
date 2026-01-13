"use client";

import Image from "next/image";
import Link from "next/link";
import { Coffee, Home, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A1110] via-[#2B1810] to-[#000000]">
      {/* Animated Background Gradient Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #B87333, transparent)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #CD7F32, transparent)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Coffee Cups */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        >
          <Coffee
            size={40 + i * 8}
            style={{
              color: i % 2 === 0 ? "#B87333" : "#CD7F32",
              opacity: 0.15,
            }}
          />
        </motion.div>
      ))}

      {/* Sparkle Effects */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        >
          <Sparkles size={12} style={{ color: "#D4A574" }} />
        </motion.div>
      ))}

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Glitch 404 Text */}
        <div className="relative mb-8">
          <motion.h1
            className="text-[15rem] md:text-[20rem] font-black leading-none tracking-tighter"
            style={{
              fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, #B87333, #CD7F32, #D4A574)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            animate={{
              textShadow: [
                "0 0 20px rgba(184, 115, 51, 0.5)",
                "0 0 40px rgba(205, 127, 50, 0.8)",
                "0 0 20px rgba(184, 115, 51, 0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            404
          </motion.h1>

          {/* Glitch Effect Layers */}
          <motion.h1
            className="absolute inset-0 text-[15rem] md:text-[20rem] font-black leading-none tracking-tighter opacity-20"
            style={{
              fontFamily: "var(--font-display)",
              color: "#CD7F32",
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
            }}
            animate={{
              x: [-2, 2, -2],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            404
          </motion.h1>

          <motion.h1
            className="absolute inset-0 text-[15rem] md:text-[20rem] font-black leading-none tracking-tighter opacity-20"
            style={{
              fontFamily: "var(--font-display)",
              color: "#B87333",
              clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
            }}
            animate={{
              x: [2, -2, 2],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            404
          </motion.h1>
        </div>

        {/* Coffee Cup Logo with Bounce */}
        <motion.div
          className="flex justify-center mb-8"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.1 }}
        >
          <div
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #B87333, #CD7F32)",
              boxShadow: "0 20px 60px rgba(184, 115, 51, 0.4), 0 0 40px rgba(205, 127, 50, 0.3)",
            }}
          >
            <Image
              src="/Rabuste logo.png"
              alt="Rabuste Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Funky Title */}
        <motion.h2
          className="text-4xl md:text-6xl font-black mb-4 uppercase"
          style={{
            fontFamily: "var(--font-heading)",
            color: "#FFFEF9",
            letterSpacing: "0.05em",
            textShadow: "0 4px 20px rgba(184, 115, 51, 0.3)",
          }}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Brew-tal Error!
        </motion.h2>

        {/* Description with fun copy */}
        <motion.p
          className="text-lg md:text-2xl mb-4"
          style={{
            color: "#D4A574",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Looks like this page took a coffee break... ☕
        </motion.p>

        <motion.p
          className="text-base md:text-xl mb-8"
          style={{
            color: "#8B6F47",
            fontFamily: "var(--font-body)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          We couldn't find what you were brewing for!
        </motion.p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <Link
              href="/"
              className="group relative px-8 py-4 overflow-hidden flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, #B87333, #CD7F32)",
                color: "#000000",
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                boxShadow: "0 10px 30px rgba(184, 115, 51, 0.4)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Home size={20} />
                Go Home
              </span>
              <ArrowRight
                size={20}
                className="relative z-10 transition-transform group-hover:translate-x-2"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#CD7F32] to-[#D4A574]"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/menu"
              className="group relative px-8 py-4 overflow-hidden flex items-center gap-3 border-2"
              style={{
                background: "rgba(184, 115, 51, 0.1)",
                borderColor: "#B87333",
                color: "#FFFEF9",
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                backdropFilter: "blur(10px)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Coffee size={20} />
                Browse Menu
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#B87333] to-[#CD7F32]"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        </div>

        {/* Fun Error Codes */}
        <motion.div
          className="mt-12 flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {["No Coffee Found", "Espresso Yourself Elsewhere", "Latte Art Lost"].map(
            (text, i) => (
              <motion.div
                key={i}
                className="px-4 py-2 text-xs md:text-sm uppercase tracking-wider"
                style={{
                  background: "rgba(184, 115, 51, 0.15)",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  color: "#B87333",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(184, 115, 51, 0.25)",
                }}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                {text}
              </motion.div>
            )
          )}
        </motion.div>
      </motion.div>

      {/* Cursor Follow Effect */}
      {isHovering && (
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            x: "-50%",
            y: "-50%",
          }}
        >
          <motion.div
            className="w-8 h-8 rounded-full"
            style={{
              background: "radial-gradient(circle, #B87333, transparent)",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        </motion.div>
      )}

      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: "2px solid transparent",
          borderImage: "linear-gradient(90deg, #B87333, #CD7F32, #D4A574, #B87333) 1",
        }}
        animate={{
          borderImageSlice: [1, 1, 1, 1],
        }}
      />
    </div>
  );
}