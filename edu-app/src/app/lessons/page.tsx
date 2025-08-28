"use client";
import { motion } from "framer-motion";
import { Button } from "@components/ui/Button";

export default function LessonsPage() {
  return (
    <div className="relative min-h-[70vh] p-6 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.25),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.25),transparent_50%)]" />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center space-y-4 max-w-xl">
        <h1 className="text-3xl font-bold">Gamified Lessons</h1>
        <p className="text-gray-600">Coming soon: interactive modules with points, streaks, and badges.</p>
        <Button className="mt-2 shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:shadow-[0_0_45px_rgba(59,130,246,0.55)]">Play Game (Preview)</Button>
      </motion.div>
    </div>
  );
}


