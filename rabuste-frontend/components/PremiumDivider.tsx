'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PremiumDivider() {
  return (
    <div className="flex items-center justify-center gap-6 my-20">
      <motion.div
        className="h-px flex-1 max-w-xs"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.6), transparent)',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      />
      
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div
          className="w-3 h-3 rotate-45"
          style={{
            background: 'linear-gradient(135deg, #B87333, #CD7F32)',
            boxShadow: '0 0 20px rgba(184, 115, 51, 0.6)',
          }}
        />
      </motion.div>
      
      <motion.div
        className="h-px flex-1 max-w-xs"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.6), transparent)',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      />
    </div>
  );
}