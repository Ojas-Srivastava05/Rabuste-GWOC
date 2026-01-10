"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import SectionTracker from '@/components/SectionTracker';

interface InstagramPost {
  _id: string;
  instagramId: string;
  imageUrl: string;
  caption: string;
  permalink: string;
  likes: number;
  timestamp: string;
  mediaType: string;
}

export default function InstagramShowcase() {
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/instagram');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts');
        }
        
        const posts = await response.json();
        setInstagramPosts(posts);
        setError(null);
      } catch (err) {
        console.error('Error fetching Instagram posts:', err);
        setError('Unable to load Instagram posts');
        // Fallback to empty array or placeholder posts
        setInstagramPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

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
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl bg-gradient-to-br from-amber-900/20 to-zinc-900/40 animate-pulse flex items-center justify-center"
                  style={{
                    border: '2px solid rgba(184, 115, 51, 0.3)',
                  }}
                >
                  <Instagram size={48} style={{ color: '#B87333', opacity: 0.3 }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg mb-4" style={{ color: '#B87333' }}>
                {error}
              </p>
              <p className="text-sm" style={{ color: 'rgba(184, 115, 51, 0.7)' }}>
                Follow us on Instagram to see our latest updates!
              </p>
            </div>
          ) : instagramPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg mb-4" style={{ color: '#B87333' }}>
                No Instagram posts available yet
              </p>
              <p className="text-sm" style={{ color: 'rgba(184, 115, 51, 0.7)' }}>
                Follow us on Instagram to see our latest updates!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
              {instagramPosts.map((post, index) => (
                <motion.div
                  key={post._id || post.instagramId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setIsHovered(post._id || post.instagramId)}
                  onMouseLeave={() => setIsHovered(null)}
                  className="relative group cursor-pointer aspect-square overflow-hidden rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.1))',
                    border: '2px solid rgba(184, 115, 51, 0.3)',
                  }}
                >
                  {/* Instagram Image */}
                  <div 
                    className="w-full h-full bg-gradient-to-br from-amber-900/20 to-zinc-900/40 flex items-center justify-center relative"
                    style={{
                      backgroundImage: post.imageUrl && !post.imageUrl.includes('instagram.com/p/') ? `url(${post.imageUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {(!post.imageUrl || post.imageUrl.includes('instagram.com/p/')) && (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <div className="text-center">
                          <Instagram size={48} className="mx-auto mb-3" style={{ color: '#B87333', opacity: 0.8 }} />
                          <p className="text-sm font-semibold" style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}>
                            Instagram Post
                          </p>
                          {post.caption && (
                            <p className="text-xs mt-2 line-clamp-2 px-2" style={{ color: '#D4A574', opacity: 0.9 }}>
                              {post.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Overlay on Hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered === (post._id || post.instagramId) ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-4"
                  >
                    <div className="text-center">
                      <p className="text-white font-bold mb-2 text-sm line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        {post.caption || 'Instagram Post'}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-white/80">
                        <Instagram size={16} />
                        <span className="text-sm">{post.likes || 0} likes</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Click to view on Instagram - Only if permalink exists */}
                  {post.permalink && (
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-10"
                      aria-label="View on Instagram"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>
    </SectionTracker>
  );
}
