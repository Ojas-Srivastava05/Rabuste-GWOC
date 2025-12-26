'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function DiagonalProducts() {
  const ref = useRef(null);
  const router = useRouter();
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const products = [
    {
      name: 'Single Origin Espresso',
      desc: 'Pure intensity, dark chocolate notes',
      price: '₹140',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=90',
    },
    {
      name: 'Cold Brew Reserve',
      desc: 'Smooth 18-hour cold extraction',
      price: '₹220',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=90',
    },
    {
      name: 'Signature Latte',
      desc: 'Velvety perfection in every sip',
      price: '₹180',
      image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&q=90',
    },
  ];

  return (
    <section
      ref={ref}
      className="section"
      style={{ 
        background: 'linear-gradient(180deg, #141414 0%, #0A0A0A 100%)',
      }}
    >
      <div className="container px-6">
        {/* Header - Large */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-24 max-w-4xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="gold-line" />
            <span className="section-label">Signature Collection</span>
          </div>
          
          <h2 
            className="mb-6"
            style={{
              color: '#F5F1E8',
              fontWeight: 200,
            }}
          >
            Masterfully
            <br />
            <span className="gradient-text">Crafted</span>
          </h2>
          
          <p 
            className="text-lg md:text-xl max-w-2xl"
            style={{ color: '#8B6F47', lineHeight: 1.7 }}
          >
            Each cup is a testament to our dedication to quality. 
            Premium beans, expert roasting, precise brewing.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              {/* Image */}
              <div 
                className="relative overflow-hidden mb-6"
                style={{
                  aspectRatio: '4/5',
                  border: '1px solid rgba(201, 168, 106, 0.15)',
                  borderRadius: '4px',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(10, 10, 10, 0.8) 100%)',
                  }}
                />

                {/* Price badge */}
                <div 
                  className="absolute top-6 right-6 px-5 py-3"
                  style={{
                    background: 'rgba(10, 10, 10, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    borderRadius: '2px',
                  }}
                >
                  <span 
                    className="text-xl gradient-text"
                    style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}
                  >
                    {product.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 
                  className="text-2xl"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                    fontWeight: 300,
                  }}
                >
                  {product.name}
                </h3>
                
                <p 
                  className="text-sm"
                  style={{
                    color: '#8B6F47',
                    lineHeight: 1.6,
                  }}
                >
                  {product.desc}
                </p>

                <button
                  onClick={() => router.push('/menu')}
                  className="inline-flex items-center gap-2 text-sm uppercase tracking-widest transition-all duration-300 group-hover:gap-4"
                  style={{
                    color: '#C9A86A',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  Order Now
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <button
            onClick={() => router.push('/menu')}
            className="btn btn-primary group"
          >
            View Full Menu
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}