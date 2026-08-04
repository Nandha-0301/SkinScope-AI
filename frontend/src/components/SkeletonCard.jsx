import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { shimmerDuration, smoothEase } from "./home/motionSystem.js";

function SkeletonCard({ className = "", lines = 3, delay = 200 }) {
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) {
      setVisible(true);
      return undefined;
    }

    const timer = window.setTimeout(() => setVisible(true), delay);

    return () => window.clearTimeout(timer);
  }, [delay]);

  if (!visible) {
    return null;
  }

  return (
    <motion.div
      className={`theme-surface relative overflow-hidden rounded-xl p-5 ${className}`.trim()}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: smoothEase }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ["-120%", "120%"] }}
        transition={{ duration: shimmerDuration, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative">
        <div className="mb-4 h-6 w-2/3 rounded bg-white/10" />
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`mb-2 h-4 rounded bg-white/10 ${index === lines - 1 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default SkeletonCard;
