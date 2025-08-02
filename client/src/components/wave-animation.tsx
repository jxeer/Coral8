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
      <svg className="w-6 h-6 text-deep-navy" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83z"/>
      </svg>
    </motion.div>
  );
}
