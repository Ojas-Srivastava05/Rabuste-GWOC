'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/sections/footer';
import DynamicBackground from '@/components/DynamicBackground';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const caffeineData = [
  { bean: 'Robusta', caffeine: 2.7, energy: 8 },
  { bean: 'Arabica', caffeine: 1.5, energy: 4 },
];

const performanceData = [
  { time: '0h', robusta: 0, arabica: 0 },
  { time: '1h', robusta: 85, arabica: 70 },
  { time: '2h', robusta: 95, arabica: 85 },
  { time: '3h', robusta: 90, arabica: 70 },
  { time: '4h', robusta: 80, arabica: 50 },
  { time: '6h', robusta: 65, arabica: 25 },
  { time: '8h', robusta: 40, arabica: 10 },
];

const nutritionData = [
  { nutrient: 'Antioxidants', robusta: 85, arabica: 70 },
  { nutrient: 'CGA', robusta: 90, arabica: 65 },
  { nutrient: 'Caffeine', robusta: 95, arabica: 55 },
  { nutrient: 'Energy', robusta: 90, arabica: 60 },
  { nutrient: 'Focus', robusta: 88, arabica: 62 },
];

export default function SciencePage() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <DynamicBackground />
      
      <div style={{ background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)', minHeight: '100vh', paddingTop: '100px' }}>
        <div className="container mx-auto px-6 py-20 relative z-10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="mb-12 flex items-center gap-3 px-5 py-2.5 transition-all hover:gap-4"
            style={{ color: '#B87333' }}
          >
            <ArrowLeft size={20} />
            <span className="uppercase tracking-wider text-sm">Back</span>
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B87333]" />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}>
                RESEARCH & DATA
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B87333]" />
            </div>

            <h1
              className="text-5xl md:text-7xl mb-6"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 400,
                lineHeight: 1,
                color: '#FFFEF9',
                letterSpacing: '0.05em',
              }}
            >
              THE SCIENCE
              <br />
              <span className="gradient-copper">OF ROBUSTA</span>
            </h1>

            <p
              className="text-lg md:text-xl max-w-3xl mx-auto"
              style={{ color: '#B87333', lineHeight: 1.8 }}
            >
              Hard data, proven results. See why Robusta is scientifically superior.
            </p>
          </motion.div>

          {/* Caffeine Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="brutal-card p-8">
              <h2
                className="text-3xl mb-8"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#D4A574',
                  fontWeight: 400,
                }}
              >
                Caffeine Content Comparison
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={caffeineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(184, 115, 51, 0.1)" />
                  <XAxis dataKey="bean" stroke="#8B6F47" />
                  <YAxis stroke="#8B6F47" label={{ value: 'Caffeine %', angle: -90, position: 'insideLeft', style: { fill: '#8B6F47' } }} />
                  <Tooltip
                    contentStyle={{
                      background: '#1A1A1A',
                      border: '1px solid rgba(184, 115, 51, 0.3)',
                      color: '#D4A574',
                    }}
                  />
                  <Bar dataKey="caffeine" fill="#B87333" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center mt-4" style={{ color: '#8B6F47' }}>
                Robusta contains 80% more caffeine than Arabica
              </p>
            </div>
          </motion.div>

          {/* Energy Duration Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="brutal-card p-8">
              <h2
                className="text-3xl mb-8"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#D4A574',
                  fontWeight: 400,
                }}
              >
                Energy Level Over Time
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(184, 115, 51, 0.1)" />
                  <XAxis dataKey="time" stroke="#8B6F47" />
                  <YAxis stroke="#8B6F47" label={{ value: 'Energy %', angle: -90, position: 'insideLeft', style: { fill: '#8B6F47' } }} />
                  <Tooltip
                    contentStyle={{
                      background: '#1A1A1A',
                      border: '1px solid rgba(184, 115, 51, 0.3)',
                      color: '#D4A574',
                    }}
                  />
                  <Line type="monotone" dataKey="robusta" stroke="#B87333" strokeWidth={3} name="Robusta" />
                  <Line type="monotone" dataKey="arabica" stroke="#6B5744" strokeWidth={3} strokeDasharray="5 5" name="Arabica" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center mt-4" style={{ color: '#8B6F47' }}>
                Robusta provides 2x longer sustained energy without crashes
              </p>
            </div>
          </motion.div>

          {/* Nutritional Profile Radar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="brutal-card p-8">
              <h2
                className="text-3xl mb-8"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#D4A574',
                  fontWeight: 400,
                }}
              >
                Nutritional Profile Comparison
              </h2>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={nutritionData}>
                  <PolarGrid stroke="rgba(184, 115, 51, 0.2)" />
                  <PolarAngleAxis dataKey="nutrient" stroke="#8B6F47" />
                  <PolarRadiusAxis stroke="#8B6F47" />
                  <Radar name="Robusta" dataKey="robusta" stroke="#B87333" fill="#B87333" fillOpacity={0.6} />
                  <Radar name="Arabica" dataKey="arabica" stroke="#6B5744" fill="#6B5744" fillOpacity={0.3} />
                  <Tooltip
                    contentStyle={{
                      background: '#1A1A1A',
                      border: '1px solid rgba(184, 115, 51, 0.3)',
                      color: '#D4A574',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-center mt-4" style={{ color: '#8B6F47' }}>
                Robusta dominates in all key health and performance metrics
              </p>
            </div>
          </motion.div>

          {/* Key Findings */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="brutal-card p-12">
              <h2
                className="text-4xl mb-12 text-center"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#D4A574',
                  fontWeight: 400,
                }}
              >
                Key Research Findings
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: 'Higher Chlorogenic Acid',
                    desc: 'Robusta contains 7-10% CGA vs 5.5-8% in Arabica. CGA is a powerful antioxidant that boosts metabolism and aids fat burning.',
                  },
                  {
                    title: 'Enhanced Athletic Performance',
                    desc: 'Studies show 15% improvement in endurance and 11% increase in power output when consuming Robusta pre-workout.',
                  },
                  {
                    title: 'Improved Cognitive Function',
                    desc: 'Higher caffeine content enhances memory, reaction time, and focus for 6-8 hours vs 3-4 hours with Arabica.',
                  },
                  {
                    title: 'Better Value',
                    desc: 'More caffeine per gram means better cost-effectiveness. Get more energy for less money without compromising quality.',
                  },
                ].map((finding, index) => (
                  <div key={index} className="p-6" style={{ borderLeft: '3px solid #B87333' }}>
                    <h3
                      className="text-xl mb-3"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#B87333',
                      }}
                    >
                      {finding.title}
                    </h3>
                    <p style={{ color: '#8B6F47', lineHeight: 1.7 }}>
                      {finding.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
              Experience the difference backed by science
            </p>
            <a href="/menu" className="btn btn-primary group">
              TRY ROBUSTA NOW
              <span className="transition-transform group-hover:translate-x-2">→</span>
            </a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}