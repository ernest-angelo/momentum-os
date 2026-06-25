"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd"> {
  children: React.ReactNode;
  variant?: "glass" | "bordered" | "flat" | "glow";
  hoverable?: boolean;
  animate?: boolean;
  delay?: number;
}

export function Card({
  children,
  className = "",
  variant = "glass",
  hoverable = false,
  animate = false,
  delay = 0,
  ...props
}: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "bordered":
        return "bg-zinc-900/40 border border-zinc-800/80 rounded-2xl";
      case "flat":
        return "bg-zinc-900 border border-zinc-800 rounded-2xl";
      case "glow":
        return "bg-zinc-900/60 border border-zinc-800/80 rounded-2xl shadow-lg shadow-primary/5 hover:border-primary/30";
      case "glass":
      default:
        return "glass-card";
    }
  };

  const baseStyles = `${getVariantStyles()} ${className} overflow-hidden p-6 relative`;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay }}
        whileHover={hoverable ? { y: -4, transition: { duration: 0.2 } } : undefined}
        className={baseStyles}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseStyles} {...props}>
      {children}
    </div>
  );
}

export default Card;
