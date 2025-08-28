"use client";
import React from "react";
import { useStore } from "@lib/mockStore";
import { ModuleCard } from "@components/ModuleCard";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";

export default function StudentDashboard() {
  const { students } = useStore();
  const me = students[0];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Student Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link href="/lessons" className="text-blue-600">Gamified Lessons →</Link>
          <SignOutButton>
            <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border hover:bg-black/5 dark:hover:bg-white/5">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
      <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} className="grid md:grid-cols-2 gap-4">
        {me.modules.map(m => (
          <motion.div key={m.moduleId} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
            <ModuleCard title={m.title} percent={m.percent} />
          </motion.div>
        ))}
      </motion.div>
      {me.modules.every(m => m.percent >= 100) && (
        <div className="flex items-center gap-2 text-green-600"><PartyPopper className="w-5 h-5" /> Great job! You completed all lessons.</div>
      )}
    </div>
  );
}


