'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const galleryImages = [
  {
    url: 'https://images.pexels.com/photos/3914189/pexels-photo-3914189.jpeg',
    alt: 'Roasted coffee beans texture by Roman Bengaiev on Pexels',
    title: 'Premium Beans',
    desc: 'Hand-selected robusta from finest plantations',
    span: 'col-span-1 row-span-2',
  },
  {
    url: 'https://images.unsplash.com/photo-1749104028313-a175107a5052?crop=entropy&cs=srgb&fm=jpg&q=85',
    alt: 'Coffee being poured by Gaia&Co on Unsplash',
    title: 'Brewing Perfection',
    desc: 'Artisan techniques for maximum flavor',
    span: 'col-span-2 row-span-1',
  },
  {
    url: 'https://images.pexels.com/photos/6278746/pexels-photo-6278746.jpeg',
    alt: 'Hand holding coffee cup by Artem Podrez on Pexels',
    title: 'Every Moment',
    desc: 'Coffee that fuels your ambitions',
    span: 'col-span-1 row-span-1',
  },
  {
    url: 'https://images.pexels.com/photos/6612601/pexels-photo-6612601.jpeg',
    alt: 'Espresso machine by Pavel Danilyuk on Pexels',
    title: 'Professional Grade',
    desc: 'Equipment-tested excellence',
    span: 'col-span-1 row-span-2',
  },
  {
    url: 'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg',
    alt: 'Modern coffee shop by Asad Photo Maldives on Pexels',
    title: 'Experience Space',
    desc: 'Where coffee meets community',
    span: 'col-span-2 row-span-1',
  },
  {
    url: 'https://images.pexels.com/photos/25547393/pexels-photo-25547393.jpeg',
    alt: 'Coffee beans close-up by Yunus Kılıç on Pexels',
    title: 'Rich Texture',
    desc: 'Complexity in every bean',
    span: 'col-span-1 row-span-1',
  },
  {
    url: 'https://images.pexels.com/photos/8091207/pexels-photo-8091207.jpeg',
    alt: 'Person working with coffee by PNW Production on Pexels',
    title: 'Productivity Fuel',
    desc: 'Your daily power source',
    span: 'col-span-2 row-span-2',
  },
  {
    url: 'https://images.pexels.com/photos/14464234/pexels-photo-14464234.jpeg',
    alt: 'Espresso shots by Dilan Aktay on Pexels',
    title: 'Double Shot',
    desc: '2X the caffeine, 2X the power',
    span: 'col-span-1 row-span-1',
  },
  {
    url: 'https://images.pexels.com/photos/20127371/pexels-photo-20127371.jpeg',
    alt: 'Latte art by Pelin Yılmaz on Pexels',
    title: 'Crafted Beauty',
    desc: 'Art in every cup',
    span: 'col-span-1 row-span-1',
  },
  {
    url: 'https://images.pexels.com/photos/5473269/pexels-photo-5473269.jpeg',
    alt: 'Café interior by Abdulla Bin Talib on Pexels',
    title: 'Design Matters',
    desc: 'Atmosphere crafted for focus',
    span: 'col-span-2 row-span-1',
  },
  {
    url: 'https://images.pexels.com/photos/7487359/pexels-photo-7487359.jpeg',
    alt: 'Coffee brewing process by Los Muertos Crew on Pexels',
    title: 'Extraction Science',
    desc: 'Precision in every drop',
    span: 'col-span-1 row-span-2',
  },
  {
    url: 'https://images.pexels.com/photos/31945549/pexels-photo-31945549.jpeg',
    alt: 'Roasted coffee beans by Anzor Dukaev on Pexels',
    title: 'Dark Roast',
    desc: 'Bold, intense, unforgettable',
    span: 'col-span-1 row-span-1',
  },
];

export default function GalleryPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => router.push('/')}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-gradient-to-r from-(--color-copper) to-(--color-bronze) text-black px-6 py-3 font-bold hover:scale-105 transition-transform"
          style={{
            background: 'linear-gradient(135deg, #B87333, #CD7F32)',
            fontFamily: 'Bebas Neue, sans-serif',
            letterSpacing: '0.1em',
          }}
        >
          <ArrowLeft size={20} />
          BACK
        </motion.button>

        {/* Diagonal Accent Line */}
        <div 
          className="absolute top-0 left-0 w-full h-2 opacity-60"
          style={{
            background: 'linear-gradient(90deg, transparent, #B87333, #CD7F32, #D4A574, transparent)',
            transform: 'skewY(-1deg)',
            transformOrigin: 'top left',
          }}
        />

        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                color: '#B87333',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                letterSpacing: '0.3em',
                fontWeight: 700,
                marginBottom: '1.5rem',
              }}
            >
              VISUAL JOURNEY
            </motion.p>
            
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              lineHeight: 0.85,
              color: '#FFFEF9',
              marginBottom: '1rem',
            }}>
              THE
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                RABUSTE
              </span>
              <br />
              STORY
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: 'rgba(255, 254, 249, 0.7)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Behind every cup is a story of passion, precision, and power
            </p>
          </motion.div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4 md:gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -8 }}
                onClick={() => setSelectedImage(index)}
                className={`${image.span} relative cursor-pointer group overflow-hidden`}
                style={{
                  background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(26, 17, 16, 0.8))',
                  border: '2px solid rgba(184, 115, 51, 0.2)',
                }}
              >
                {/* Image */}
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
                  }}
                >
                  <h3 style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                    color: '#B87333',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.05em',
                  }}>
                    {image.title}
                  </h3>
                  <p style={{
                    color: 'rgba(255, 254, 249, 0.8)',
                    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  }}>
                    {image.desc}
                  </p>
                </div>

                {/* Copper Corner Accent */}
                <div 
                  className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, transparent 50%, #B87333 50%)',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal View */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
            }}
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-6 right-6 z-[110] w-14 h-14 flex items-center justify-center hover:scale-110 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #B87333, #CD7F32)',
              }}
            >
              <X size={28} color="#000" strokeWidth={3} />
            </motion.button>

            {/* Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full"
            >
              <div 
                className="relative overflow-hidden"
                style={{
                  border: '3px solid rgba(184, 115, 51, 0.5)',
                }}
              >
                <img
                  src={galleryImages[selectedImage].url}
                  alt={galleryImages[selectedImage].alt}
                  className="w-full h-auto max-h-[85vh] object-contain"
                />

                {/* Info Overlay */}
                <div 
                  className="absolute bottom-0 left-0 right-0 p-8"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
                  }}
                >
                  <h2 style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    color: '#B87333',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.05em',
                  }}>
                    {galleryImages[selectedImage].title}
                  </h2>
                  <p style={{
                    color: 'rgba(255, 254, 249, 0.9)',
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    lineHeight: 1.6,
                  }}>
                    {galleryImages[selectedImage].desc}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}