'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import DynamicBackground from '@/components/DynamicBackground'; // ✅ ADDED

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
      <Navbar />

      {/* ✅ ADDED: Dynamic Background */}
      <div className="fixed inset-0 -z-10">
        <DynamicBackground />
      </div>

      <div
        className="min-h-screen relative z-10"
        style={{
          paddingTop: '120px',
          paddingBottom: '80px',
        }}
      >
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 overflow-hidden">

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

          <div className="relative z-10 max-w-[1800px] mx-auto">
            {/* Header */}
            {/* --- unchanged header + grid code --- */}
          </div>
        </section>
      </div>

      {/* Modal View (unchanged) */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{ background: 'rgba(0, 0, 0, 0.95)' }}
            onClick={() => setSelectedImage(null)}
          >
            {/* modal content unchanged */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
