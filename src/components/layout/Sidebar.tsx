"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Home, 
  Calendar, 
  Moon, 
  Dumbbell, 
  Brain, 
  Smile, 
  Smartphone, 
  BookOpen, 
  TrendingUp, 
  History, 
  Target, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Flame,
  Zap,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/store/useOSStore";

export function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const streak = useOSStore((state) => state.streak);
  const todayScore = useOSStore((state) => state.getTodayScore());
  
  const [isTrackOpen, setIsTrackOpen] = useState(true);

  const isActive = (path: string) => pathname === path;

  const coreLinks = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Today's Plan", href: "/plan", icon: Calendar },
  ];

  const trackLinks = [
    { name: "Sleep", href: "/track/sleep", icon: Moon, color: "text-blue-400" },
    { name: "Workout", href: "/track/workout", icon: Dumbbell, color: "text-emerald-400" },
    { name: "Deep Work", href: "/track/deep-work", icon: Brain, color: "text-purple-400" },
    { name: "Mood & Energy", href: "/track/mood", icon: Smile, color: "text-amber-400" },
    { name: "Screen Time", href: "/track/screen-time", icon: Smartphone, color: "text-rose-400" },
    { name: "Content", href: "/track/content", icon: BookOpen, color: "text-teal-400" },
  ];

  const secondaryLinks = [
    { name: "Insights", href: "/insights", icon: TrendingUp },
    { name: "History", href: "/history", icon: History },
    { name: "Goals", href: "/goals", icon: Target },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950 flex flex-col h-screen sticky top-0 text-zinc-400 overflow-y-auto selection:bg-primary/20">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <span className="font-display font-bold text-sm">M</span>
          </div>
          <span className="font-display font-bold text-lg text-zinc-100 tracking-tight">Momentum</span>
        </Link>
        
        {/* Version Badge */}
        <span className="text-[10px] bg-zinc-900 text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full font-mono">
          v1.0
        </span>
      </div>

      {/* User Quick Progress HUD */}
      <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-950/40 grid grid-cols-2 gap-2 text-xs">
        <div className="flex flex-col p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/50">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-medium">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/10" /> Streak
          </span>
          <span className="text-sm font-bold text-zinc-200">{mounted ? `${streak} Days` : "-- Days"}</span>
        </div>
        <div className="flex flex-col p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/50">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-medium">
            <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/10" /> Today's Score
          </span>
          <span className="text-sm font-bold text-zinc-200">{mounted ? todayScore : "--"}</span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-4 py-6 space-y-7">
        {/* Core Pages */}
        <div className="space-y-1.5">
          <span className="px-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider font-display">
            Core
          </span>
          <div className="space-y-0.5">
            {coreLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all relative ${
                    active 
                      ? "text-white font-medium bg-zinc-900 border border-zinc-800/50" 
                      : "hover:text-zinc-200 hover:bg-zinc-900/30"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-indigo-400" : "text-zinc-500"}`} />
                  {link.name}
                  {active && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-md"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tracking Collapsible */}
        <div className="space-y-1.5">
          <div 
            onClick={() => setIsTrackOpen(!isTrackOpen)}
            className="px-3 flex items-center justify-between cursor-pointer hover:text-zinc-200 transition-colors group"
          >
            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider font-display flex items-center gap-1">
              Trackers
            </span>
            {isTrackOpen ? (
              <ChevronDown className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
            )}
          </div>
          <AnimatePresence initial={false}>
            {isTrackOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="overflow-hidden space-y-0.5"
              >
                {trackLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all border border-transparent ${
                        active 
                          ? "text-white font-medium bg-zinc-900/60 border-zinc-800" 
                          : "hover:text-zinc-200 hover:bg-zinc-900/20"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${link.color} ${active ? "opacity-100" : "opacity-60"}`} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Insights & Growth */}
        <div className="space-y-1.5">
          <span className="px-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider font-display">
            Insights & Grow
          </span>
          <div className="space-y-0.5">
            {secondaryLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all relative ${
                    active 
                      ? "text-white font-medium bg-zinc-900 border border-zinc-800/50" 
                      : "hover:text-zinc-200 hover:bg-zinc-900/30"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-indigo-400" : "text-zinc-500"}`} />
                  {link.name}
                  {active && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-md"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer Profile Block */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase shadow-sm">
          ME
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-zinc-200 truncate font-display">Workspace User</span>
          <span className="text-[10px] text-zinc-500 truncate">personal-os@momentum.io</span>
        </div>
      </div>
    </aside>
  );
}
