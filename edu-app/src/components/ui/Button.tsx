import React from "react";
import { motion } from "framer-motion";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className = "", variant = "primary", children, ...props }: Props) {
  const base = "px-4 py-2 rounded-md transition-all";
  const styles: Record<string, string> = {
    primary: "bg-black text-white hover:brightness-110 active:scale-[.98]",
    secondary: "bg-white text-black border hover:bg-gray-50 active:scale-[.98]",
    ghost: "bg-transparent hover:bg-black/10 dark:hover:bg-white/10",
  };
  return (
    <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </motion.button>
  );
}


