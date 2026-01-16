'use client';

import { motion } from 'framer-motion';
import ComparisonWheel from '@/components/ComparisonWheel';

export default function ComparisonPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)',
        }}
      />

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Content */}
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="section-label mb-4"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#B87333',
                fontWeight: 600,
              }}
            >
              BEAN COMPARISON
            </p>
            <h1
              className="text-5xl md:text-7xl mb-6"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 400,
                letterSpacing: '0.05em',
                color: '#FFFEF9',
              }}
            >
              ARABICA VS ROBUSTA
            </h1>
            <div
              className="w-24 h-1 mx-auto mb-6"
              style={{
                background: 'linear-gradient(90deg, transparent, #B87333, #CD7F32, #B87333, transparent)',
              }}
            />
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto"
              style={{
                color: '#D4A574',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.7,
              }}
            >
              Explore the unique characteristics of each coffee bean variety.
              <br />
              Click on any sector to discover detailed insights.
            </p>
          </motion.div>
        </div>

        {/* Comparison Wheel */}
        <div className="flex justify-center items-center min-h-[700px]">
          <ComparisonWheel size={600} />
        </div>

        {/* Additional Info Section */}
        <div className="mt-32 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div
            className="brutal-card p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(232, 195, 158, 0.1), rgba(212, 165, 116, 0.05))',
              border: '2px solid rgba(232, 195, 158, 0.3)',
            }}
          >
            <h3
              className="text-2xl mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#E8C39E',
                letterSpacing: '0.1em',
              }}
            >
              ARABICA BEANS
            </h3>
            <p
              className="leading-relaxed"
              style={{ color: '#F5F1E8', fontFamily: 'var(--font-body)' }}
            >
              Known for their smooth, sweet flavor profile with delicate aromatic notes. 
              Arabica beans are cultivated at higher altitudes and are prized for their 
              refined taste and natural sweetness. Perfect for those who appreciate 
              nuanced coffee experiences.
            </p>
          </div>

          <div
            className="brutal-card p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(42, 24, 16, 0.6), rgba(61, 43, 31, 0.4))',
              border: '2px solid rgba(184, 115, 51, 0.4)',
            }}
          >
            <h3
              className="text-2xl mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#B87333',
                letterSpacing: '0.1em',
              }}
            >
              ROBUSTA BEANS
            </h3>
            <p
              className="leading-relaxed"
              style={{ color: '#F5F1E8', fontFamily: 'var(--font-body)' }}
            >
              Robust and powerful with double the caffeine content. Robusta beans deliver 
              a strong, earthy flavor with exceptional energy-boosting properties. Ideal 
              for those seeking maximum performance, extended energy, and bold taste at 
              an excellent value.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
