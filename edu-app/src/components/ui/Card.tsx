import React from "react";
import { motion } from "framer-motion";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-2xl border border-white/20 bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}


