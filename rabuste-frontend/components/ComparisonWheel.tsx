'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Clock, Shield, Coffee, DollarSign, TrendingUp } from 'lucide-react';

// Feature data structure
interface Feature {
  id: string;
  name: string;
  icon: typeof Zap;
  arabica: {
    value: string;
    description: string;
    percentage: number;
  };
  robusta: {
    value: string;
    description: string;
    percentage: number;
  };
  color: string;
}

const features: Feature[] = [
  {
    id: 'caffeine',
    name: 'Caffeine Content',
    icon: Zap,
    arabica: {
      value: '1.2%',
      description: 'Moderate caffeine levels for a smooth, gentle boost without jitters',
      percentage: 40,
    },
    robusta: {
      value: '2.4%',
      description: 'Double the caffeine power - 2x stronger kick for maximum energy',
      percentage: 100,
    },
    color: '#B87333',
  },
  {
    id: 'energy',
    name: 'Energy Duration',
    icon: Clock,
    arabica: {
      value: '2-3 hours',
      description: 'Steady, sustained energy release for comfortable productivity',
      percentage: 50,
    },
    robusta: {
      value: '4-6 hours',
      description: 'Extended energy boost that keeps you powered throughout the day',
      percentage: 100,
    },
    color: '#CD7F32',
  },
  {
    id: 'antioxidant',
    name: 'Antioxidants',
    icon: Shield,
    arabica: {
      value: 'High',
      description: 'Rich in chlorogenic acids with excellent health benefits',
      percentage: 100,
    },
    robusta: {
      value: 'Moderate',
      description: 'Good antioxidant levels with focus on strength and performance',
      percentage: 60,
    },
    color: '#D4A574',
  },
  {
    id: 'flavour',
    name: 'Bold Flavour',
    icon: Coffee,
    arabica: {
      value: 'Smooth & Sweet',
      description: 'Delicate, aromatic notes with natural sweetness and fruity undertones',
      percentage: 50,
    },
    robusta: {
      value: 'Strong & Intense',
      description: 'Bold, earthy, and full-bodied taste with powerful character',
      percentage: 100,
    },
    color: '#8B6F47',
  },
  {
    id: 'price',
    name: 'Price Value',
    icon: DollarSign,
    arabica: {
      value: 'Premium',
      description: 'Higher cost reflecting refined taste and selective cultivation',
      percentage: 40,
    },
    robusta: {
      value: 'Best Value',
      description: 'Superior value - more caffeine and energy at a better price point',
      percentage: 100,
    },
    color: '#B87333',
  },
  {
    id: 'performance',
    name: 'Performance Boost',
    icon: TrendingUp,
    arabica: {
      value: 'Moderate',
      description: 'Enhanced focus and mental clarity for creative tasks',
      percentage: 55,
    },
    robusta: {
      value: 'Maximum',
      description: 'Peak performance enhancement - ideal for intense workouts and productivity',
      percentage: 100,
    },
    color: '#CD7F32',
  },
];

interface ComparisonWheelProps {
  size?: number;
  showInfo?: boolean;
  responsive?: boolean;
}

export default function ComparisonWheel({ size = 600, showInfo = true, responsive = true }: ComparisonWheelProps) {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [computedSize, setComputedSize] = useState<number>(size);
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Responsive resize handling
  useEffect(() => {
    if (!responsive || !containerRef.current || !mounted) return;

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width || 0;
      // derive a base size from container width, clamped
      const base = Math.max(300, Math.min(700, Math.floor(w * 0.7)));
      setComputedSize(base);
    });

    ro.observe(containerRef.current);
    // initial measure
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width) setComputedSize(Math.max(300, Math.min(700, Math.floor(rect.width * 0.7))));

    return () => ro.disconnect();
  }, [responsive, mounted]);

  const effectiveSize = responsive ? computedSize : size;
  const svgSize = effectiveSize + 200;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  const outerRadius = effectiveSize * 0.38;
  const middleRadius = effectiveSize * 0.25;
  const innerRadius = effectiveSize * 0.13;
  const anglePerSector = 360 / features.length;

  // Create SVG path for a sector
  const createSectorPath = (
    startAngle: number,
    endAngle: number,
    outerR: number,
    innerR: number
  ): string => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = centerX + outerR * Math.cos(startRad);
    const y1 = centerY + outerR * Math.sin(startRad);
    const x2 = centerX + outerR * Math.cos(endRad);
    const y2 = centerY + outerR * Math.sin(endRad);
    const x3 = centerX + innerR * Math.cos(endRad);
    const y3 = centerY + innerR * Math.sin(endRad);
    const x4 = centerX + innerR * Math.cos(startRad);
    const y4 = centerY + innerR * Math.sin(startRad);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  };

  // Calculate label position - Round to prevent hydration mismatches
  const getLabelPosition = (index: number, radius: number) => {
    const angle = index * anglePerSector + anglePerSector / 2;
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: Math.round((centerX + radius * Math.cos(rad)) * 100) / 100,
      y: Math.round((centerY + radius * Math.sin(rad)) * 100) / 100,
    };
  };

  const handleSectorClick = (feature: Feature) => {
    setSelectedFeature(feature);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedFeature(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full"
      style={{ paddingBottom: `${Math.max(140, effectiveSize * 0.35)}px`, zIndex: 10 }}
      suppressHydrationWarning
    >
      {/* Wheel Container */}
      <div className="relative" style={{ width: `${svgSize}px`, height: `${svgSize}px`, zIndex: 20 }}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={outerRadius}
            fill="rgba(26, 17, 16, 0.5)"
            stroke="rgba(184, 115, 51, 0.2)"
            strokeWidth="2"
          />

          {/* Render sectors */}
          {features.map((feature, index) => {
            const startAngle = index * anglePerSector;
            const endAngle = startAngle + anglePerSector;
            const isHovered = hoveredSector === feature.id;

            return (
              <g key={feature.id}>
                {/* Robusta outer sector */}
                <motion.path
                  d={createSectorPath(startAngle, endAngle, outerRadius, middleRadius)}
                  fill={`rgba(42, 24, 16, ${isHovered ? 0.9 : 0.7})`}
                  stroke="rgba(184, 115, 51, 0.4)"
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSectorClick(feature)}
                  onMouseEnter={() => setHoveredSector(feature.id)}
                  onMouseLeave={() => setHoveredSector(null)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Arabica inner sector */}
                <motion.path
                  d={createSectorPath(startAngle, endAngle, middleRadius, innerRadius)}
                  fill={`rgba(232, 195, 158, ${isHovered ? 0.9 : 0.7})`}
                  stroke="rgba(184, 115, 51, 0.4)"
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSectorClick(feature)}
                  onMouseEnter={() => setHoveredSector(feature.id)}
                  onMouseLeave={() => setHoveredSector(null)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Feature label */}
                <text
                  {...getLabelPosition(index, outerRadius + 60)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#B87333"
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="var(--font-body)"
                  style={{ 
                    pointerEvents: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                  }}
                >
                  {feature.name.split(' ').map((word, i) => (
                    <tspan
                      key={i}
                      x={getLabelPosition(index, outerRadius + 60).x}
                      dy={i === 0 ? 0 : '1.4em'}
                    >
                      {word}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}

          {/* Center circle with labels */}
          <circle
            cx={centerX}
            cy={centerY}
            r={innerRadius}
            fill="rgba(26, 17, 16, 0.9)"
            stroke="rgba(184, 115, 51, 0.6)"
            strokeWidth="3"
          />

          {/* Arabica label in center */}
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#E8C39E"
            fontSize="26"
            fontWeight="700"
            fontFamily="var(--font-heading)"
            style={{ letterSpacing: '0.12em' }}
          >
            ARABICA
          </text>
          
          <text
            x={centerX}
            y={centerY + 18}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#8B6F47"
            fontSize="12"
            fontFamily="var(--font-body)"
            style={{ letterSpacing: '0.05em' }}
          >
            Inner Ring
          </text>

          {/* Divider lines between sectors */}
          {features.map((_, index) => {
            const angle = index * anglePerSector;
            const rad = (angle - 90) * (Math.PI / 180);
            const x1 = centerX + innerRadius * Math.cos(rad);
            const y1 = centerY + innerRadius * Math.sin(rad);
            const x2 = centerX + outerRadius * Math.cos(rad);
            const y2 = centerY + outerRadius * Math.sin(rad);

            return (
              <line
                key={`divider-${index}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(184, 115, 51, 0.3)"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Legend - placed below the SVG to avoid overlapping other content */}
        <div className="relative mt-6 flex items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 border-2"
              style={{
                background: 'rgba(232, 195, 158, 0.7)',
                borderColor: 'rgba(184, 115, 51, 0.4)',
              }}
            />
            <span
              className="text-base font-bold uppercase tracking-wider"
              style={{ color: '#E8C39E', fontFamily: 'var(--font-body)' }}
            >
              Arabica
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 border-2"
              style={{
                background: 'rgba(42, 24, 16, 0.7)',
                borderColor: 'rgba(184, 115, 51, 0.4)',
              }}
            />
            <span
              className="text-base font-bold uppercase tracking-wider"
              style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}
            >
              Robusta
            </span>
          </div>
        </div>
      </div>

      {/* Optional info/caption below the wheel */}
      {showInfo && (
        <p
          className="mt-8 text-center text-base tracking-wider"
          style={{ color: '#8B6F47', maxWidth: '600px', fontFamily: 'var(--font-body)' }}
        >
          Click on any sector to explore the detailed comparison between Arabica and Robusta beans
        </p>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-md"
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                type: 'spring',
                stiffness: 100,
              }}
              className="fixed left-1/2 top-1/2 z-[9999] w-[90%] max-w-3xl -translate-x-1/2 -translate-y-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative overflow-hidden p-8 md:p-12 max-h-[90vh] overflow-y-auto"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(61, 43, 31, 0.95), rgba(42, 24, 16, 0.95))',
                  border: '3px solid rgba(184, 115, 51, 0.4)',
                  boxShadow:
                    '0 30px 100px rgba(0, 0, 0, 0.9), 0 0 80px rgba(184, 115, 51, 0.3)',
                }}
              >
                {/* Animated Background Glow */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                  }}
                />

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 rounded-full transition-all duration-300 hover:rotate-90"
                  style={{
                    color: '#B87333',
                    padding: '10px',
                    minWidth: '44px',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(184, 115, 51, 0.1)',
                    border: '1px solid rgba(184, 115, 51, 0.3)',
                  }}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.6,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="mb-6 flex justify-center"
                  >
                    <div
                      className="relative p-6"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(115, 54, 53, 0.2))',
                        border: '2px solid rgba(184, 115, 51, 0.4)',
                      }}
                    >
                      <selectedFeature.icon size={48} style={{ color: selectedFeature.color }} />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-8 text-center text-4xl md:text-5xl"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 400,
                      letterSpacing: '0.05em',
                      color: '#FFFEF9',
                    }}
                  >
                    {selectedFeature.name.toUpperCase()}
                  </motion.h2>

                  {/* Comparison Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Arabica Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="p-6 rounded-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(232, 195, 158, 0.15), rgba(212, 165, 116, 0.1))',
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
                        ARABICA
                      </h3>
                      <div
                        className="text-3xl font-bold mb-4"
                        style={{ color: '#D4A574' }}
                      >
                        {selectedFeature.arabica.value}
                      </div>
                      <p
                        className="text-sm leading-relaxed mb-4"
                        style={{ color: '#F5F1E8' }}
                      >
                        {selectedFeature.arabica.description}
                      </p>
                      {/* Progress bar */}
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedFeature.arabica.percentage}%` }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                          className="h-full"
                          style={{
                            background: 'linear-gradient(90deg, #E8C39E, #D4A574)',
                          }}
                        />
                      </div>
                      <div
                        className="text-xs mt-2 text-right"
                        style={{ color: '#8B6F47' }}
                      >
                        {selectedFeature.arabica.percentage}%
                      </div>
                    </motion.div>

                    {/* Robusta Card */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="p-6 rounded-none"
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
                        ROBUSTA
                      </h3>
                      <div
                        className="text-3xl font-bold mb-4"
                        style={{ color: '#CD7F32' }}
                      >
                        {selectedFeature.robusta.value}
                      </div>
                      <p
                        className="text-sm leading-relaxed mb-4"
                        style={{ color: '#F5F1E8' }}
                      >
                        {selectedFeature.robusta.description}
                      </p>
                      {/* Progress bar */}
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedFeature.robusta.percentage}%` }}
                          transition={{ delay: 0.7, duration: 0.8 }}
                          className="h-full"
                          style={{
                            background: 'linear-gradient(90deg, #B87333, #CD7F32)',
                          }}
                        />
                      </div>
                      <div
                        className="text-xs mt-2 text-right"
                        style={{ color: '#8B6F47' }}
                      >
                        {selectedFeature.robusta.percentage}%
                      </div>
                    </motion.div>
                  </div>

                  {/* Divider */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100px' }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mx-auto mb-6 h-1"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, #B87333, #CD7F32, #B87333, transparent)',
                    }}
                  />

                  {/* Bottom note */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="text-center text-xs tracking-wider"
                    style={{ color: '#8B6F47' }}
                  >
                    DISCOVER THE UNIQUE CHARACTERISTICS OF EACH BEAN TYPE
                  </motion.p>
                </div>

                {/* Corner Decorations */}
                <div
                  className="absolute top-0 left-0 w-20 h-20"
                  style={{
                    borderTop: '3px solid rgba(184, 115, 51, 0.3)',
                    borderLeft: '3px solid rgba(184, 115, 51, 0.3)',
                  }}
                />
                <div
                  className="absolute bottom-0 right-0 w-20 h-20"
                  style={{
                    borderBottom: '3px solid rgba(184, 115, 51, 0.3)',
                    borderRight: '3px solid rgba(184, 115, 51, 0.3)',
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
