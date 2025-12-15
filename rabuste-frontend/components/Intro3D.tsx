"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Center, Sparkles, Text } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

function SteamParticles({ active }: { active: boolean }) {
  const points = useRef<THREE.Points>(null);
  const count = 80;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 0.3;
      const angle = Math.random() * Math.PI * 2;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = 0.7 + Math.random() * 0.2;
      positions[i3 + 2] = Math.sin(angle) * radius;
      
      velocities[i3] = (Math.random() - 0.5) * 0.008;
      velocities[i3 + 1] = 0.015 + Math.random() * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.008;
    }
    
    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (!points.current || !active) return;
    
    const positions = points.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      positions[i3] += particles.velocities[i3];
      positions[i3 + 1] += particles.velocities[i3 + 1];
      positions[i3 + 2] += particles.velocities[i3 + 2];
      
      if (positions[i3 + 1] > 2.5) {
        const radius = Math.random() * 0.3;
        const angle = Math.random() * Math.PI * 2;
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = 0.7;
        positions[i3 + 2] = Math.sin(angle) * radius;
      }
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ToGoCoffeeCup({ onComplete }: { onComplete: () => void }) {
  const cupRef = useRef<THREE.Group>(null);
  const coffeeGroupRef = useRef<THREE.Group>(null);
  const sleeveGroupRef = useRef<THREE.Group>(null);
  const [fillProgress, setFillProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [showSteam, setShowSteam] = useState(false);
  const startTime = useRef(0);

  useEffect(() => {
    const fillTimer = setTimeout(() => {
      setPhase(1);
      setShowSteam(true);
    }, 1400);
    const pauseTimer = setTimeout(() => setPhase(2), 1700);
    const completeTimer = setTimeout(() => onComplete(), 2600);

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(pauseTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  useFrame((state) => {
    if (!cupRef.current || !coffeeGroupRef.current) return;

    if (startTime.current === 0) {
      startTime.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - startTime.current;

    if (phase === 0) {
      const progress = Math.min(elapsed / 1.4, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      setFillProgress(easedProgress);
      
      const maxHeight = 1.0;
      coffeeGroupRef.current.scale.y = easedProgress;
      coffeeGroupRef.current.position.y = -0.6 + (easedProgress * maxHeight) / 2;
    }

    if (phase === 2) {
      const zoomStart = 1.7;
      const zoomDuration = 0.9;
      const zoomProgress = Math.min((elapsed - zoomStart) / zoomDuration, 1);
      const easedZoom = zoomProgress * zoomProgress * (3 - 2 * zoomProgress);
      
      const scale = 1 + easedZoom * 8;
      cupRef.current.scale.setScalar(scale);
      
      state.camera.position.z = 5 - easedZoom * 4.2;
      state.camera.position.y = easedZoom * 0.3;
    }

    cupRef.current.rotation.y = Math.sin(elapsed * 0.35) * 0.12;
    cupRef.current.position.y = Math.sin(elapsed * 0.6) * 0.04;
    
    // Rotate sleeve group for text wrap effect
    if (sleeveGroupRef.current) {
      sleeveGroupRef.current.rotation.y = elapsed * 0.15;
    }
  });

  // Create wrapped text around sleeve
  const textPositions = useMemo(() => {
    const positions = [];
    const radius = 0.47;
    const text = "RABUSTE";
    const angleStep = (Math.PI * 2) / text.length;
    
    for (let i = 0; i < text.length; i++) {
      const angle = i * angleStep;
      positions.push({
        char: text[i],
        x: Math.sin(angle) * radius,
        z: Math.cos(angle) * radius,
        rotation: -angle,
      });
    }
    return positions;
  }, []);

  return (
    <Center>
      <group ref={cupRef}>
        <pointLight position={[0, 0, 0]} intensity={0.8} color="#ff8800" distance={3} />
        
        {/* Transparent Cup Body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.4, 1.4, 64]} />
          <meshPhysicalMaterial
            color="#f8f4f0"
            roughness={0.2}
            metalness={0.05}
            transparent
            opacity={0.3}
            transmission={0.9}
            thickness={0.5}
            clearcoat={0.3}
          />
        </mesh>

        {/* Cap/Lid Assembly */}
        <group position={[0, 0.7, 0]}>
          {/* Main lid dome */}
          <mesh castShadow>
            <cylinderGeometry args={[0.52, 0.5, 0.12, 64]} />
            <meshPhysicalMaterial
              color="#1a1a1a"
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
          
          {/* Lid rim */}
          <mesh position={[0, -0.04, 0]}>
            <torusGeometry args={[0.51, 0.02, 16, 64]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          
          {/* Drinking spout/hole cover */}
          <mesh position={[0.15, 0.08, 0]} rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.06, 0.08, 0.08, 32]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
          
          {/* Small drinking hole */}
          <mesh position={[0.15, 0.06, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
        </group>

        {/* Cup Bottom */}
        <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.4, 64]} />
          <meshStandardMaterial 
            color="#f8f4f0" 
            roughness={0.4}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Coffee Sleeve with wrapped text */}
        <group ref={sleeveGroupRef} position={[0, -0.1, 0]}>
          {/* Sleeve band */}
          <mesh castShadow>
            <cylinderGeometry args={[0.46, 0.42, 0.5, 64, 1, true]} />
            <meshStandardMaterial
              color="#8b6f47"
              roughness={0.85}
              metalness={0.02}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Wrapped text around sleeve */}
          {textPositions.map((pos, i) => (
            <Text
              key={i}
              position={[pos.x, 0, pos.z]}
              rotation={[0, pos.rotation, 0]}
              fontSize={0.08}
              color="#2d2d2d"
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter-bold.woff"
              letterSpacing={0.1}
            >
              {pos.char}
            </Text>
          ))}
        </group>

        {/* Coffee Liquid */}
        <group ref={coffeeGroupRef} position={[0, -0.6, 0]} scale={[1, 0, 1]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.48, 0.38, 1.0, 64]} />
            <meshPhysicalMaterial
              color="#2d1810"
              roughness={0.2}
              metalness={0.6}
              emissive="#3d1f10"
              emissiveIntensity={0.6}
              transparent
              opacity={0.95}
            />
          </mesh>

          {/* Coffee Surface */}
          <mesh position={[0, 1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.48, 64]} />
            <meshPhysicalMaterial
              color="#3d2317"
              roughness={0.1}
              metalness={0.8}
              emissive="#2d1810"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>

        {/* Steam */}
        {showSteam && fillProgress > 0.7 && (
          <group position={[0, 0.75, 0]}>
            <SteamParticles active={true} />
          </group>
        )}
        
        {/* Sparkles */}
        {fillProgress > 0.5 && (
          <Sparkles
            count={35}
            scale={2}
            size={2}
            speed={0.35}
            opacity={0.35}
            color="#ff8800"
          />
        )}
      </group>
    </Center>
  );
}

export default function Intro3D({ onFinish }: { onFinish: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-b from-[#000000] via-[#0a0a0a] to-[#1a1410] z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* RABUSTE Brand Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-white font-serif font-bold text-5xl md:text-6xl tracking-[0.3em] drop-shadow-2xl"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow: "0 0 40px rgba(255, 136, 0, 0.4), 0 0 80px rgba(255, 136, 0, 0.2)",
          }}
        >
          RABUSTE
        </motion.div>
      </div>

      {/* Film grain */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
        onCreated={({ gl }) => {
          console.log("Canvas created successfully");
        }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#0a0a0a", 8, 15]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[4, 6, 5]}
          intensity={2.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-3, 2, -2]} intensity={1.5} color="#ff6600" />
        <pointLight position={[3, -1, 2]} intensity={1} color="#0088ff" />
        <spotLight 
          position={[0, 5, 0]} 
          intensity={1.5} 
          angle={0.6} 
          penumbra={1}
          castShadow
        />
        
        <Suspense fallback={null}>
          <Environment preset="warehouse" environmentIntensity={0.4} />
          <ToGoCoffeeCup onComplete={onFinish} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
