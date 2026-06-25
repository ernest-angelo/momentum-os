"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-850 hover:text-white hover:border-zinc-700";
      case "danger":
        return "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-600";
      case "ghost":
        return "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50";
      case "primary":
      default:
        return "bg-indigo-600 border border-indigo-500 text-white hover:bg-indigo-500 hover:border-indigo-400 shadow-md shadow-indigo-600/15";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-xs rounded-lg gap-1.5";
      case "lg":
        return "px-6 py-3 text-base rounded-2xl gap-2.5";
      case "md":
      default:
        return "px-4.5 py-2 text-sm rounded-xl gap-2";
    }
  };

  const baseStyles = `inline-flex items-center justify-center font-semibold font-display transition-all duration-200 cursor-pointer select-none hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${getVariantStyles()} ${getSizeStyles()} ${className}`;

  return (
    <button className={baseStyles} {...props}>
      {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}

export default Button;
