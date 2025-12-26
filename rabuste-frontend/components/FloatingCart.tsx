"use client";

import { useCartStore } from "@/app/store/cartStore";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingCart() {
  const { items, total } = useCartStore();
  const router = useRouter();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push("/cart")}
        className="fixed bottom-8 right-8 z-[100]"
        style={{
          background: "linear-gradient(135deg, #B87333, #CD7F32)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
          width: "72px",
          height: "72px",
          boxShadow: "0 10px 40px rgba(184, 115, 51, 0.6), 0 0 0 4px rgba(184, 115, 51, 0.15)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <ShoppingCart size={32} color="#000000" strokeWidth={2.5} />
        
        {/* Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1"
          style={{
            background: "#000000",
            color: "#B87333",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
            fontWeight: 700,
            border: "2px solid #B87333",
          }}
        >
          {itemCount}
        </motion.div>

        {/* Pulse animation */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            inset: -10,
            borderRadius: "50%",
            border: "3px solid #B87333",
            pointerEvents: "none",
          }}
        />
      </motion.button>
    </AnimatePresence>
  );
}