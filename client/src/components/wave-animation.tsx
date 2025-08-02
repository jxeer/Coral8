import { motion } from "framer-motion";

export function WaveAnimation({ className }: { className?: string }) {
  return (
    <motion.div
      className={`w-10 h-10 bg-gradient-to-br from-ocean-teal to-seafoam rounded-full flex items-center justify-center ${className}`}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <svg className="w-6 h-6 text-deep-navy" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/>
        <path d="M2 16c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/>
        <circle cx="12" cy="8" r="2" fill="currentColor"/>
      </svg>
    </motion.div>
  );
}
