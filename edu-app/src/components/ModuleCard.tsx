import React from "react";
import { motion } from "framer-motion";
import { ProgressBar } from "@components/ProgressBar";
import { BookOpen } from "lucide-react";

export function ModuleCard({ title, percent }: { title: string; percent: number }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl border border-white/20 bg-white/60 dark:bg-black/40 backdrop-blur shadow-md space-y-3">
      <div className="flex items-center gap-2 font-medium">
        <BookOpen className="w-4 h-4" /> {title}
      </div>
      <ProgressBar percent={percent} />
      <div className="text-sm text-gray-600">{percent}% complete</div>
    </motion.div>
  );
}


