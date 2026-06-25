"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0 to max
  max?: number;
  type?: "linear" | "circular";
  size?: "sm" | "md" | "lg"; // for circular
  color?: "primary" | "success" | "warning" | "danger";
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  type = "linear",
  size = "md",
  color = "primary",
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const getColorHex = () => {
    switch (color) {
      case "success":
        return "rgb(16, 185, 129)"; // emerald-500
      case "warning":
        return "rgb(245, 158, 11)"; // amber-500
      case "danger":
        return "rgb(244, 63, 94)"; // rose-500
      case "primary":
      default:
        return "rgb(99, 102, 241)"; // indigo-500
    }
  };

  const getColorClass = () => {
    switch (color) {
      case "success":
        return "bg-emerald-500";
      case "warning":
        return "bg-amber-500";
      case "danger":
        return "bg-rose-500";
      case "primary":
      default:
        return "bg-indigo-500";
    }
  };

  const getTrackColorClass = () => {
    switch (color) {
      case "success":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "warning":
        return "bg-amber-500/10 border-amber-500/20";
      case "danger":
        return "bg-rose-500/10 border-rose-500/20";
      case "primary":
      default:
        return "bg-indigo-500/10 border-indigo-500/20";
    }
  };

  if (type === "circular") {
    const sizePixels = size === "sm" ? 64 : size === "lg" ? 120 : 88;
    const strokeWidth = size === "sm" ? 5 : size === "lg" ? 9 : 7;
    const radius = (sizePixels - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex flex-col items-center justify-center">
        <svg width={sizePixels} height={sizePixels} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={sizePixels / 2}
            cy={sizePixels / 2}
            r={radius}
            fill="none"
            stroke="rgba(39, 39, 42, 0.4)"
            strokeWidth={strokeWidth}
          />
          {/* Animated Progress circle */}
          <motion.circle
            cx={sizePixels / 2}
            cy={sizePixels / 2}
            r={radius}
            fill="none"
            stroke={getColorHex()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        {/* Label in center */}
        {showLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-bold text-sm text-zinc-100">{percentage}%</span>
          </div>
        )}
      </div>
    );
  }

  // Linear Progress Bar
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5 font-medium font-mono text-zinc-500">
        {showLabel && <span>Progress</span>}
        {showLabel && <span>{percentage}%</span>}
      </div>
      <div className="w-full h-2.5 rounded-full bg-zinc-900 border border-zinc-800/80 overflow-hidden relative">
        <motion.div
          className={`h-full ${getColorClass()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
