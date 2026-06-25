"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { Flame, Zap, Sparkles } from "lucide-react";
import { useOSStore } from "@/store/useOSStore";

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const streak = useOSStore((state) => state.streak);
  const todayScore = useOSStore((state) => state.getTodayScore());

  // Dynamic titles based on routes
  const getHeaderDetails = () => {
    switch (pathname) {
      case "/":
        return {
          title: "Welcome back",
          subtitle: "Focus high, sleep moderate. Ready to build momentum.",
          isHome: true,
        };
      case "/plan":
        return {
          title: "Today's Plan",
          subtitle: "Schedule blocks and configure priorities.",
          isHome: false,
        };
      case "/insights":
        return {
          title: "Insights Center",
          subtitle: "Analyze performance correlations, consistency, and patterns.",
          isHome: false,
        };
      case "/history":
        return {
          title: "History Logs",
          subtitle: "Browse previous habits and metrics database.",
          isHome: false,
        };
      case "/goals":
        return {
          title: "Goals & Milestones",
          subtitle: "Set milestones and trace habit consistency.",
          isHome: false,
        };
      case "/settings":
        return {
          title: "Settings",
          subtitle: "Configure integrations, preferences, and details.",
          isHome: false,
        };
      default:
        if (pathname?.startsWith("/track/")) {
          const metric = pathname.split("/").pop();
          const cleanMetric = metric
            ? metric.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())
            : "Tracker";
          return {
            title: `Track ${cleanMetric}`,
            subtitle: `Record and log data parameters for your ${cleanMetric.toLowerCase()}.`,
            isHome: false,
          };
        }
        return {
          title: "Momentum",
          subtitle: "AI Personal Operating System",
          isHome: false,
        };
    }
  };

  const { title, subtitle, isHome } = getHeaderDetails();
  const dateStr = format(new Date(), "EEEE, d MMMM yyyy");

  return (
    <header className="px-6 py-6 md:px-8 md:py-8 border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Title / Greeting Block */}
      <div>
        <div className="text-xs text-zinc-500 font-medium font-mono mb-1">
          {mounted ? dateStr : "Loading Date..."}
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight font-display">
            {isHome ? `${title}, Workspace User` : title}
          </h1>
          {isHome && <Sparkles className="w-5 h-5 text-indigo-400 fill-indigo-500/10" />}
        </div>
        <p className="text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">{subtitle}</p>
      </div>

      {/* Quick Score Panel (only visible on desktop header since mobile has bottom nav/side indicators) */}
      <div className="hidden md:flex items-center gap-4">
        {/* Streak HUD */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800/80 shadow-inner">
          <div className="h-9 w-9 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-500">
            <Flame className="w-5 h-5 fill-orange-500/10" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider font-mono">Streak</div>
            <div className="text-sm font-bold text-zinc-200">{mounted ? `${streak} Days` : "-- Days"}</div>
          </div>
        </div>

        {/* Score HUD */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800/80 shadow-inner">
          <div className="h-9 w-9 rounded-xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-yellow-500">
            <Zap className="w-5 h-5 fill-yellow-500/10" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider font-mono">Today's Score</div>
            <div className="text-sm font-bold text-zinc-200">{mounted ? todayScore : "--"} <span className="text-[10px] text-zinc-600 font-normal">/ 100</span></div>
          </div>
        </div>
      </div>
    </header>
  );
}
