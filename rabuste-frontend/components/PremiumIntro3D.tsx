"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Environment, 
  Center,
  ContactShadows,
  Text
} from "@react-three/drei";
import { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

function CoffeeCup({ onComplete }: { onComplete: () => void }) {
  const cupRef = useRef<THREE.Group>(null);
  const coffeeRef = useRef<THREE.Group>(null);
  const [fillProgress, setFillProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const startTime = useRef(0);

  useEffect(() => {
    const fillTimer = setTimeout(() => setPhase(1), 1200);
    const pauseTimer = setTimeout(() => setPhase(2), 1400);
    const completeTimer = setTimeout(() => onComplete(), 2400);

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(pauseTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  useFrame((state) => {
    if (!cupRef.current || !coffeeRef.current) return;

    if (startTime.current === 0) {
      startTime.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - startTime.current;

    // Coffee fill - smooth and visible
    if (phase === 0) {
      const progress = Math.min(elapsed / 1.2, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      setFillProgress(easedProgress);
      
      // Coffee height: 0.9 max (stays inside 1.3 tall cup)
      coffeeRef.current.scale.y = easedProgress;
      coffeeRef.current.position.y = -0.6 + (easedProgress * 0.9) / 2;
    }

    // Zoom
    if (phase === 2) {
      const zoomStart = 1.4;
      const zoomDuration = 1.0;
      const zoomProgress = Math.min((elapsed - zoomStart) / zoomDuration, 1);
      const easedZoom = 1 - Math.pow(1 - zoomProgress, 4);
      
      const scale = 1 + easedZoom * 12;
      cupRef.current.scale.setScalar(scale);
      
      state.camera.position.z = 5 - easedZoom * 4.7;
    }

    // Slow rotation to show wrapped text
    cupRef.current.rotation.y = elapsed * 0.2;
  });

  // Generate curved text positions around cup
  const letters = "RABUSTE".split("");
  const radius = 0.47;
  const totalAngle = Math.PI * 1.2; // 216 degrees
  const angleStep = totalAngle / (letters.length - 1);

  return (
    <Center>
      <group ref={cupRef}>
        {/* Warm orange glow */}
        <pointLight position={[0, 0, 0]} intensity={0.8} color="#FF7400" distance={3.5} />
        
        {/* TRANSPARENT GLASS CUP - SEE-THROUGH */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.4, 1.3, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.05}
            metalness={0}
            transparent
            opacity={0.15}
            transmission={0.95}
            thickness={0.3}
            ior={1.5}
          />
        </mesh>

        {/* WRAPPED TEXT AROUND CUP - CURVED */}
        {letters.map((letter, i) => {
          const angle = -totalAngle / 2 + i * angleStep;
          return (
            <Text
              key={i}
              position={[
                Math.sin(angle) * radius,
                0.05,
                Math.cos(angle) * radius
              ]}
              rotation={[0, -angle, 0]}
              fontSize={0.1}
              color="#FF7400"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.002}
              outlineColor="#FF7400"
            >
              {letter}
            </Text>
          );
        })}

        {/* Simple black lid */}
        <group position={[0, 0.65, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.47, 0.45, 0.08, 64]} />
            <meshPhysicalMaterial color="#0a0a0a" roughness={0.6} />
          </mesh>
        </group>

        {/* Cup bottom */}
        <mesh position={[0, -0.67, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.4, 64]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.4} />
        </mesh>

        {/* COFFEE - VISIBLE THROUGH TRANSPARENT CUP, DOESN'T OVERFLOW */}
        <group ref={coffeeRef} position={[0, -0.6, 0]} scale={[1, 0, 1]}>
          {/* Coffee body - rich brown */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.43, 0.38, 0.9, 64]} />
            <meshPhysicalMaterial
              color="#4a2c1a"
              roughness={0.2}
              metalness={0.3}
              emissive="#3d1f10"
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Coffee surface */}
          <mesh position={[0, 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.43, 64]} />
            <meshPhysicalMaterial
              color="#5d3520"
              roughness={0.05}
              metalness={0.9}
            />
          </mesh>
        </group>

        <ContactShadows
          position={[0, -0.75, 0]}
          opacity={0.25}
          scale={1.3}
          blur={2}
          far={0.4}
        />
      </group>
    </Center>
  );
}

export default function PremiumIntro3D({ onFinish }: { onFinish: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-[#FFFBD6] z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Brand text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.4, 
            duration: 1.0, 
            ease: [0.19, 1.0, 0.22, 1.0]
          }}
          className="text-[#FF7400] font-bold text-7xl tracking-[0.35em]"
          style={{
            textShadow: "0 2px 20px rgba(255, 116, 0, 0.2)",
          }}
        >
          RABUSTE
        </motion.div>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 0.1, 5], fov: 32 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#FFFBD6"]} />
        
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-2, 2, -1]} intensity={0.8} color="#FF7400" />
        <pointLight position={[2, -1, 2]} intensity={0.5} color="#ffffff" />
        
        <Suspense fallback={null}>
          <Environment preset="apartment" environmentIntensity={0.4} />
          <CoffeeCup onComplete={onFinish} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
