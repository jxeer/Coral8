/**
 * Wave Animation Component
 * Coral8 brand logo featuring oceanic wave patterns
 * Inspired by Yemaya (ocean goddess) with flowing, rhythmic animations
 * Uses Framer Motion for smooth, continuous wave-like movements
 * Represents the connection between culture, community, and economic flow
 */

import { motion } from "framer-motion";

/**
 * Animated wave logo component with layered motion effects
 * Features gradient backgrounds and pulsing animations to represent ocean waves
 * @returns JSX element with animated wave logo
 */
export function WaveAnimation() {
  return (
    <div className="w-12 h-12 relative overflow-hidden rounded-full bg-gradient-to-br from-seafoam to-ocean-teal">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-pearl-white/30 to-transparent"
        animate={{
          x: [-48, 48, -48],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-ocean-blue to-deep-navy"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-seafoam"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}