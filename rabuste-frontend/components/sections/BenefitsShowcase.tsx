'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Dumbbell, Clock, TrendingUp, Award } from 'lucide-react';

const benefits = [
  {
    icon: <Zap size={32} />,
    title: '2X Caffeine Power',
    value: '2.7%',
    comparison: 'vs 1.5% in Arabica',
    desc: 'Double the energy for your day',
    color: '#B87333',
  },
  {
    icon: <Brain size={32} />,
    title: 'Enhanced Focus',
    value: '4-6hrs',
    comparison: 'sustained energy',
    desc: 'Stay sharp throughout your workday',
    color: '#CD7F32',
  },
  {
    icon: <Dumbbell size={32} />,
    title: 'Performance Boost',
    value: '+15%',
    comparison: 'athletic performance',
    desc: 'Perfect pre-workout fuel',
    color: '#D4A574',
  },
  {
    icon: <Clock size={32} />,
    title: 'Longer Lasting',
    value: '6-8hrs',
    comparison: 'energy duration',
    desc: 'No mid-day crashes',
    color: '#B87333',
  },
  {
    icon: <TrendingUp size={32} />,
    title: 'Metabolism Boost',
    value: '+11%',
    comparison: 'metabolic rate',
    desc: 'Burns more calories naturally',
    color: '#CD7F32',
  },
  {
    icon: <Award size={32} />,
    title: 'Antioxidants',
    value: '7-10%',
    comparison: 'more CGA',
    desc: 'Superior health benefits',
    color: '#D4A574',
  },
];

export default function BenefitsShowcase() {
  return (
    <section className="section relative overflow-hidden">
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
            <span className="section-label">WHY ROBUSTA WINS</span>
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
            SCIENCE-BACKED
            <br />
            <span className="gradient-copper">BENEFITS</span>
          </h2>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{ color: '#B87333', lineHeight: 1.8 }}
          >
            Not just coffee. A performance enhancer backed by research.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="brutal-card p-8 group hover:scale-105 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="w-16 h-16 mb-6 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${benefit.color}20, ${benefit.color}10)`,
                  border: `2px solid ${benefit.color}40`,
                  color: benefit.color,
                }}
              >
                {benefit.icon}
              </div>

              {/* Title */}
              <h3
                className="text-2xl mb-4"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#D4A574',
                  fontWeight: 400,
                }}
              >
                {benefit.title}
              </h3>

              {/* Stats */}
              <div className="mb-4">
                <div
                  className="text-4xl font-bold mb-1"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: benefit.color,
                  }}
                >
                  {benefit.value}
                </div>
                <div
                  className="text-sm uppercase tracking-wider"
                  style={{ color: '#8B6F47' }}
                >
                  {benefit.comparison}
                </div>
              </div>

              {/* Description */}
              <p style={{ color: '#B87333', lineHeight: 1.6 }}>
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a href="/science" className="btn btn-primary group">
            SEE THE RESEARCH
            <span className="transition-transform group-hover:translate-x-2">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}