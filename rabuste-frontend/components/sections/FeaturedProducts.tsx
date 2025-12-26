'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Flame, Snowflake, Sparkles } from 'lucide-react';

export default function FeaturedProducts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const products = [
    {
      name: 'Signature Espresso',
      description: 'Bold and intense, our premium Robusta extraction',
      price: '₹140',
      image: 'https://images.pexels.com/photos/9050522/pexels-photo-9050522.jpeg?w=600&q=85',
      attribution: 'Mike Jones on Pexels',
      icon: <Flame size={24} />,
      accent: '#592720',
    },
    {
      name: 'Iced Cold Brew',
      description: '18-hour cold extraction for smooth perfection',
      price: '₹220',
      image: 'https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg?w=600&q=85',
      attribution: 'Marta Dzedyshko on Pexels',
      icon: <Snowflake size={24} />,
      accent: '#3D2B1F',
    },
    {
      name: 'Artisan Latte',
      description: 'Handcrafted latte art with velvety microfoam',
      price: '₹180',
      image: 'https://images.pexels.com/photos/15801079/pexels-photo-15801079.jpeg?w=600&q=85',
      attribution: 'Arya Bajra on Pexels',
      icon: <Sparkles size={24} />,
      accent: '#926644',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1110 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-20 left-20 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(146, 102, 68, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(89, 39, 32, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span 
            className="text-sm uppercase tracking-widest font-semibold mb-4 block"
            style={{ 
              color: '#926644',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Featured Selection
          </span>
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
            }}
          >
            <span className="gradient-text">Our Signature Brews</span>
          </h2>
          <p 
            className="text-xl max-w-2xl mx-auto"
            style={{ color: '#D0B5A2' }}
          >
            Handpicked favorites, crafted to perfection for the ultimate coffee experience
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative"
            >
              {/* Card */}
              <div 
                className="relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105"
                style={{
                  background: 'rgba(26, 26, 26, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(146, 102, 68, 0.2)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={product.image}
                    alt={`${product.name} - ${product.attribution}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, transparent 0%, ${product.accent}40 100%)`,
                    }}
                  />
                  
                  {/* Icon badge */}
                  <div 
                    className="absolute top-4 right-4 p-3 rounded-full"
                    style={{
                      background: 'rgba(146, 102, 68, 0.9)',
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff',
                    }}
                  >
                    {product.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 
                    className="text-2xl font-bold mb-2"
                    style={{ 
                      color: '#E6C9A8',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {product.name}
                  </h3>
                  <p 
                    className="mb-4"
                    style={{ color: '#D0B5A2', fontSize: '0.95rem' }}
                  >
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span 
                      className="text-3xl font-bold"
                      style={{ color: '#926644' }}
                    >
                      {product.price}
                    </span>
                    <button
                      className="px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #926644, #C89B7B)',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => window.location.href = '/menu'}
            className="group px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105"
            style={{
              background: 'rgba(146, 102, 68, 0.1)',
              color: '#E6C9A8',
              border: '2px solid rgba(146, 102, 68, 0.5)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
            }}
          >
            View Full Menu
          </button>
        </motion.div>
      </div>
    </section>
  );
}