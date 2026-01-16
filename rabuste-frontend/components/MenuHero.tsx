"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, TrendingUp } from "lucide-react";
import Image from "next/image";

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

interface MenuHeroProps {
  menuItem: MenuItem;
  onAddToCart: () => void;
  hasAIDiscount?: boolean;
  discountedPrice?: number;
  originalPrice?: number;
  discountPercent?: number;
}

export default function MenuHero({ 
  menuItem, 
  onAddToCart,
  hasAIDiscount = false,
  discountedPrice,
  originalPrice,
  discountPercent = 0
}: MenuHeroProps) {
  return (
    <div className="h-full flex items-start justify-end relative overflow-hidden pt-24 md:pt-28 lg:pt-32 px-6 md:px-12 lg:px-16">
      {/* Background gradient with splash effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 70% 30%, rgba(184, 115, 51, 0.2) 0%, transparent 50%)',
        }}
      />
      
      {/* Right Side - Menu Item Display with Details Below */}
      <motion.div
        className="relative flex flex-col items-center max-w-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={menuItem._id}
            className="relative mb-6"
            initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 5, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            {/* Circular frame with glow */}
            <div 
              className="relative"
              style={{
                width: 'clamp(280px, 40vw, 400px)',
                height: 'clamp(280px, 40vw, 400px)',
              }}
            >
              {/* Outer glow */}
              <div
                className="absolute inset-0"
                style={{
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                  transform: 'scale(1.1)',
                }}
              />
              
              {/* Main circular image */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '4px solid rgba(184, 115, 51, 0.4)',
                  boxShadow: '0 15px 45px rgba(0, 0, 0, 0.6)',
                }}
              >
                <Image
                  src={menuItem.image}
                  alt={menuItem.name}
                  fill
                  sizes="(max-width: 768px) 280px, 400px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Category Badge */}
              <motion.div
                className="absolute top-4 right-4"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(184, 115, 51, 0.4)',
                  borderRadius: '12px',
                  padding: '8px 16px',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <p 
                  className="text-xs font-bold"
                  style={{ 
                    color: '#D4A574',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {menuItem.category}
                </p>
              </motion.div>

              {/* Rating Badge */}
              <motion.div
                className="absolute bottom-4 left-4 flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 4px 12px rgba(184, 115, 51, 0.4)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <Star 
                  style={{ 
                    width: 16, 
                    height: 16, 
                    fill: '#000000',
                    color: '#000000',
                  }} 
                />
                <span 
                  className="text-sm font-bold"
                  style={{ color: '#000000', fontFamily: 'var(--font-heading)' }}
                >
                  4.8
                </span>
              </motion.div>

              {/* AI Discount Badge */}
              {hasAIDiscount && (
                <motion.div
                  className="absolute top-4 left-4 px-3 py-2 flex items-center gap-2"
                  style={{
                    background: 'rgba(76, 175, 80, 0.95)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <TrendingUp size={14} style={{ color: '#000' }} />
                  <span 
                    className="text-xs font-bold"
                    style={{ color: '#000', letterSpacing: '0.05em' }}
                  >
                    AI {discountPercent}% OFF
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Product Details Below Circle */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`details-${menuItem._id}`}
            className="w-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Product Name */}
            <motion.h2
              className="mb-3"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                lineHeight: '1.1',
                color: '#F5F1E8',
                textTransform: 'uppercase',
              }}
            >
              {menuItem.name}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-sm md:text-base mb-4 px-4"
              style={{
                color: '#B87333',
                fontFamily: 'var(--font-body)',
                lineHeight: '1.6',
                maxWidth: '500px',
                margin: '0 auto 1rem',
              }}
            >
              {menuItem.description}
            </motion.p>

            {/* Price */}
            <div className="mb-6">
              {hasAIDiscount ? (
                <div className="flex items-center justify-center gap-3">
                  <p 
                    className="text-2xl md:text-3xl line-through opacity-70"
                    style={{ 
                      color: '#8B6F47',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    ₹{originalPrice}
                  </p>
                  <p 
                    className="text-3xl md:text-4xl font-bold gradient-text"
                    style={{ 
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    ₹{discountedPrice}
                  </p>
                  <span
                    className="px-3 py-1 text-sm"
                    style={{
                      background: 'rgba(76, 175, 80, 0.2)',
                      border: '1px solid rgba(76, 175, 80, 0.5)',
                      color: '#4CAF50',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    SAVE {discountPercent}%
                  </span>
                </div>
              ) : (
                <p 
                  className="text-3xl md:text-4xl font-bold gradient-text"
                  style={{ 
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  ₹{menuItem.price}
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              className="btn btn-primary group px-8 py-4 text-base md:text-lg"
              onClick={onAddToCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                maxWidth: '320px',
              }}
            >
              <ShoppingCart style={{ width: 20, height: 20 }} />
              <span>Add to Cart</span>
            </motion.button>

            {/* Special Offer Message */}
            {hasAIDiscount && (
              <motion.p
                className="mt-4 text-sm"
                style={{
                  color: '#4CAF50',
                  fontFamily: 'var(--font-body)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                🤖 AI-powered special discount just for you!
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
