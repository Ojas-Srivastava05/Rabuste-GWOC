'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function DiagonalProducts() {
  const ref = useRef(null);
  const router = useRouter();
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const products = [
    {
      name: 'POWER SHOT',
      desc: 'Double Robusta espresso. Maximum caffeine. Pure strength.',
      price: '₹140',
      image: 'https://pixabay.com/get/gb3d8841ad2ff4736b3af62072b3c326fecd7a775e03243a9b409a82bd0a6958a69b2acc168a8b3e05ddb7fc4001888d2.png',
      badge: '2X CAFFEINE',
    },
    {
      name: 'DARK REIGN',
      desc: '20-hour cold brew. Bold, intense, unforgiving.',
      price: '₹220',
      image: 'https://pixabay.com/get/g4f71354e1832cd2ac2563e2a095f1b2884e004f01274147bd39dc92ae817f4a010da4494bd4c85888e40e70af7da7fcb.jpg',
      badge: 'COLD BREW',
    },
    {
      name: 'BRUTAL LATTE',
      desc: 'Thick, rich, powerful. Not for the weak.',
      price: '₹180',
      image: 'https://images.unsplash.com/photo-1575280112131-b69021e70471?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxtYXNjdWxpbmUlMjBjb2ZmZWUlMjBjdXAlMjB3aXRoJTIwc3RlYW0lMkMlMjBkYXJrJTIwbW9vZHklMjBsaWdodGluZyUyQyUyMGJvbGQlMjBjb21wb3NpdGlvbiUyQyUyMHN0cmVuZ3RoJTIwYW5kJTIwcG93ZXJ8ZW58MHwxfHxibGFja3wxNzY2NzU3NzQzfDA&ixlib=rb-4.1.0&q=85',
      badge: 'SIGNATURE',
    },
  ];

  return (
    <section
      ref={ref}
      className="section"
      style={{ 
        background: 'linear-gradient(180deg, #000000 0%, #0A0A0A 100%)',
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
            <div className="copper-line" />
            <span className="section-label">POWER MENU</span>
          </div>
          
          <h2 
            className="mb-6"
            style={{
              color: '#FFFEF9',
              fontWeight: 400,
            }}
          >
            FUEL YOUR
            <br />
            <span className="gradient-copper">AMBITION</span>
          </h2>
          
          <p 
            className="text-lg md:text-xl max-w-2xl"
            style={{ color: '#B87333', lineHeight: 1.7, fontWeight: 500 }}
          >
            Premium Robusta. Expertly roasted. Unapologetically intense.
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
                  border: '2px solid rgba(184, 115, 51, 0.2)',
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading={index < 3 ? "eager" : "lazy"}
                  quality={85}
                  priority={index === 0}
                />
                
                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.9) 100%)',
                  }}
                />

                {/* Badge */}
                <div 
                  className="absolute top-6 left-6 px-4 py-2"
                  style={{
                    background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                    color: '#000000',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    fontWeight: 400,
                  }}
                >
                  {product.badge}
                </div>

                {/* Price badge */}
                <div 
                  className="absolute top-6 right-6 px-5 py-3"
                  style={{
                    background: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(184, 115, 51, 0.5)',
                  }}
                >
                  <span 
                    className="text-xl gradient-copper"
                    style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}
                  >
                    {product.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 
                  className="text-2xl mb-3"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#FFFEF9',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                  }}
                >
                  {product.name}
                </h3>
                
                <p 
                  className="text-sm mb-6"
                  style={{
                    color: '#8B6F47',
                    lineHeight: 1.7,
                  }}
                >
                  {product.desc}
                </p>

                <button
                  onClick={() => router.push('/menu')}
                  className="inline-flex items-center gap-3 text-xs uppercase tracking-wider transition-all duration-300 group-hover:gap-5 px-6 py-3"
                  style={{
                    color: '#000000',
                    background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 400,
                    letterSpacing: '0.15em',
                  }}
                >
                  ORDER NOW
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