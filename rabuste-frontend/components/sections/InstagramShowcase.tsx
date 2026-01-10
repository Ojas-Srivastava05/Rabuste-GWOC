"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import SectionTracker from '@/components/SectionTracker';

export default function InstagramShowcase() {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  // Sample Instagram posts - In production, you'd fetch these from Instagram API
  // For now, using placeholder structure
  const instagramPosts = [
    { id: 1, image: '/instagram-placeholder-1.jpg', caption: 'Premium Robusta Coffee', likes: 234 },
    { id: 2, image: '/instagram-placeholder-2.jpg', caption: 'Cafe Ambience', likes: 189 },
    { id: 3, image: '/instagram-placeholder-3.jpg', caption: 'Fresh Brew', likes: 312 },
    { id: 4, image: '/instagram-placeholder-4.jpg', caption: 'Coffee Art', likes: 267 },
    { id: 5, image: '/instagram-placeholder-5.jpg', caption: 'Workshop Session', likes: 198 },
    { id: 6, image: '/instagram-placeholder-6.jpg', caption: 'Customer Moments', likes: 245 },
  ];

  return (
    <SectionTracker sectionName="instagram_showcase">
      <section className="relative py-24 px-4 md:px-6 overflow-hidden" style={{ background: 'transparent' }}>
        {/* Background Gradient */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(184, 115, 51, 0.05), transparent 70%)',
          }}
        />

        <div className="container mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B87333]" />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}>
                FOLLOW US
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B87333]" />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl mb-6"
              style={{
                fontFamily: 'var(--font-heading)',
                lineHeight: 0.9,
                color: '#F5F1E8',
              }}
            >
              <span className="gradient-text">INSTAGRAM</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-8"
              style={{ color: '#B87333' }}
            >
              Follow us on Instagram for daily coffee inspiration, behind-the-scenes content, and exclusive updates
            </motion.p>

            <motion.a
              href="https://www.instagram.com/rabuste.coffee/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}
            >
              <Instagram size={24} />
              @rabuste.coffee
              <ExternalLink size={18} />
            </motion.a>
          </motion.div>

          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {instagramPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setIsHovered(post.id)}
                onMouseLeave={() => setIsHovered(null)}
                className="relative group cursor-pointer aspect-square overflow-hidden rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.1))',
                  border: '2px solid rgba(184, 115, 51, 0.3)',
                }}
              >
                {/* Placeholder Image - Replace with actual Instagram images */}
                <div 
                  className="w-full h-full bg-gradient-to-br from-amber-900/20 to-zinc-900/40 flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${post.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!post.image.includes('placeholder') ? null : (
                    <div className="text-center p-4">
                      <Instagram size={48} className="mx-auto mb-2" style={{ color: '#B87333', opacity: 0.5 }} />
                      <p className="text-sm" style={{ color: '#B87333', opacity: 0.7 }}>
                        Instagram Post
                      </p>
                    </div>
                  )}
                </div>

                {/* Overlay on Hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered === post.id ? 1 : 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-4"
                >
                  <div className="text-center">
                    <p className="text-white font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      {post.caption}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-white/80">
                      <Instagram size={16} />
                      <span className="text-sm">{post.likes} likes</span>
                    </div>
                  </div>
                </motion.div>

                {/* Click to view on Instagram */}
                <a
                  href="https://www.instagram.com/rabuste.coffee/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label="View on Instagram"
                />
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <a
              href="https://www.instagram.com/rabuste.coffee/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg font-bold hover:gap-4 transition-all"
              style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}
            >
              View More on Instagram
              <ExternalLink size={20} />
            </a>
          </motion.div>
        </div>
      </section>
    </SectionTracker>
  );
}
