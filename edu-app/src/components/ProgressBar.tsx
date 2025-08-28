import React from "react";
import { motion } from "framer-motion";

export function ProgressBar({ percent, color }: { percent: number; color?: "green" | "yellow" | "red" }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const palette: Record<string, string> = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };
  const barColor = palette[color || (clamped >= 70 ? "green" : clamped >= 40 ? "yellow" : "red")];
  return (
    <div className="w-full h-3 bg-gray-200/60 rounded">
      <motion.div initial={{ width: 0 }} animate={{ width: `${clamped}%` }} transition={{ duration: 0.6, ease: "easeOut" }} className={`h-3 ${barColor} rounded`} />
    </div>
  );
}


