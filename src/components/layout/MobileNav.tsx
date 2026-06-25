"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Home, 
  Calendar, 
  Plus, 
  TrendingUp, 
  Settings,
  Moon,
  Dumbbell,
  Brain,
  Smile,
  Smartphone,
  BookOpen,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileNav() {
  const pathname = usePathname();
  const [isLogOpen, setIsLogOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Plan", href: "/plan", icon: Calendar },
    { name: "Log", href: "#log", icon: Plus, isAction: true },
    { name: "Insights", href: "/insights", icon: TrendingUp },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const logLinks = [
    { name: "Sleep", href: "/track/sleep", icon: Moon, bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { name: "Workout", href: "/track/workout", icon: Dumbbell, bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { name: "Deep Work", href: "/track/deep-work", icon: Brain, bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    { name: "Mood & Energy", href: "/track/mood", icon: Smile, bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { name: "Screen Time", href: "/track/screen-time", icon: Smartphone, bg: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    { name: "Content", href: "/track/content", icon: BookOpen, bg: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
  ];

  return (
    <>
      {/* Bottom Sticky Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-lg flex items-center justify-around px-4 z-40 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.isAction) {
            return (
              <button
                key={item.name}
                onClick={() => setIsLogOpen(true)}
                className="relative -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 active:scale-95 transition-all border border-indigo-500"
              >
                <Plus className="w-6 h-6" />
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] tracking-wide transition-all ${
                active ? "text-indigo-400 font-semibold" : "text-zinc-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Quick Log Floating Sheet */}
      <AnimatePresence>
        {isLogOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Content Drawer Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed bottom-0 left-0 right-0 rounded-t-3xl bg-zinc-900 border-t border-zinc-800 p-6 z-50 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-zinc-100">Log Metrics</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Select a category to record today's stats</p>
                </div>
                <button
                  onClick={() => setIsLogOpen(false)}
                  className="p-2 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 active:scale-95 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of Trackers */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {logLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsLogOpen(false)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border text-center transition-all active:scale-98 ${link.bg}`}
                    >
                      <div className="h-10 w-10 rounded-xl bg-zinc-950 flex items-center justify-center border border-white/5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold font-display text-zinc-200">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
