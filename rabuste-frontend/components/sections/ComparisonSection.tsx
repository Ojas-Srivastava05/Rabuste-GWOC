'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap } from 'lucide-react';

const comparisons = [
  { feature: 'Caffeine Content', robusta: '2.7%', arabica: '1.5%', winner: 'robusta' },
  { feature: 'Energy Duration', robusta: '6-8 hours', arabica: '3-4 hours', winner: 'robusta' },
  { feature: 'Antioxidants (CGA)', robusta: '7-10%', arabica: '5.5-8%', winner: 'robusta' },
  { feature: 'Price per Cup', robusta: '₹140', arabica: '₹180+', winner: 'robusta' },
  { feature: 'Bold Flavor', robusta: 'Intense & Strong', arabica: 'Mild & Acidic', winner: 'robusta' },
  { feature: 'Performance Boost', robusta: '+15%', arabica: '+8%', winner: 'robusta' },
];

export default function ComparisonSection() {
  return (
    <section className="section relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="copper-line" />
            <span className="section-label">THE TRUTH</span>
            <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
          </div>

          <h2
            className="text-5xl md:text-7xl mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 400,
              lineHeight: 1,
              color: '#FFFEF9',
            }}
          >
            ROBUSTA VS
            <br />
            <span style={{ color: '#8B6F47' }}>ARABICA</span>
          </h2>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{ color: '#B87333', lineHeight: 1.8 }}
          >
            The numbers don't lie. See why Robusta dominates.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* Table Header */}
          <div
            className="grid grid-cols-3 gap-4 mb-2 px-8 py-6"
            style={{
              background: 'rgba(184, 115, 51, 0.1)',
              border: '2px solid rgba(184, 115, 51, 0.3)',
            }}
          >
            <div
              className="text-sm uppercase tracking-[0.2em]"
              style={{ color: '#8B6F47' }}
            >
              Feature
            </div>
            <div
              className="text-center text-xl font-bold"
              style={{
                color: '#B87333',
                fontFamily: 'var(--font-heading)',
              }}
            >
              ROBUSTA
            </div>
            <div
              className="text-center text-xl"
              style={{
                color: '#6B5744',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Arabica
            </div>
          </div>

          {/* Table Rows */}
          {comparisons.map((item, index) => (
            <motion.div
              key={item.feature}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-4 px-8 py-6 mb-2"
              style={{
                background: 'rgba(20, 20, 20, 0.6)',
                border: '1px solid rgba(184, 115, 51, 0.1)',
              }}
            >
              <div
                className="font-medium"
                style={{ color: '#D4A574' }}
              >
                {item.feature}
              </div>
              <div
                className="text-center flex items-center justify-center gap-2"
                style={{
                  color: item.winner === 'robusta' ? '#B87333' : '#8B6F47',
                  fontWeight: item.winner === 'robusta' ? 'bold' : 'normal',
                }}
              >
                {item.winner === 'robusta' && (
                  <Check size={20} style={{ color: '#B87333' }} />
                )}
                {item.robusta}
              </div>
              <div
                className="text-center flex items-center justify-center gap-2"
                style={{
                  color: '#6B5744',
                }}
              >
                {item.winner === 'robusta' && (
                  <X size={20} style={{ color: '#6B5744', opacity: 0.5 }} />
                )}
                {item.arabica}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p
            className="text-2xl mb-8"
            style={{
              color: '#B87333',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Ready to upgrade your coffee game?
          </p>
          <a href="/menu" className="btn btn-primary group">
            ORDER NOW
            <Zap size={18} className="transition-transform group-hover:scale-125" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}