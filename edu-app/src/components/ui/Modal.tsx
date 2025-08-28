"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 8 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 8 }} transition={{ duration: 0.25 }} className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-2xl border border-white/20">
            {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


