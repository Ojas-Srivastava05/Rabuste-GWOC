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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/cart")}
        className="fixed bottom-6 right-6 z-50"
        style={{
          background: "linear-gradient(135deg, #926644, #C89B7B)",
          border: "none",
          borderRadius: "50%",
          width: "64px",
          height: "64px",
          boxShadow: "0 8px 32px rgba(146, 102, 68, 0.4), 0 0 0 4px rgba(146, 102, 68, 0.1)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <ShoppingCart size={28} color="#ffffff" strokeWidth={2.5} />
        
        {/* Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1"
          style={{
            background: "#592720",
            color: "#ffffff",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 700,
            border: "2px solid #0a0a0a",
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
            inset: -8,
            borderRadius: "50%",
            border: "2px solid #926644",
            pointerEvents: "none",
          }}
        />
      </motion.button>
    </AnimatePresence>
  );
}