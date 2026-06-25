"use client";

import { useMemo, useState, useEffect } from "react";
import { Brain, Zap, Clock, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { useOSStore } from "@/store/useOSStore";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

export function QuickStatsCard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const deepWorkLogs = useOSStore((state) => state.deepWorkLogs);
  const moodLogs = useOSStore((state) => state.moodLogs);
  const workoutLogs = useOSStore((state) => state.workoutLogs);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const stats = useMemo(() => {
    // 1. Focus Score
    const todayDeepLog = deepWorkLogs.find((l) => l.date === todayStr);
    let focusScore = 0;
    if (todayDeepLog) {
      focusScore = todayDeepLog.focusScore * 10;
    } else {
      const last7 = deepWorkLogs.slice(-7);
      const avg = last7.length > 0 ? last7.reduce((acc, l) => acc + l.focusScore, 0) / last7.length : 8;
      focusScore = Math.round(avg * 10);
    }

    // 2. Energy Level
    const todayMoodLog = moodLogs.find((l) => l.date === todayStr);
    let energyLevel = 0;
    if (todayMoodLog) {
      energyLevel = todayMoodLog.energy * 10;
    } else {
      const last7 = moodLogs.slice(-7);
      const avg = last7.length > 0 ? last7.reduce((acc, l) => acc + l.energy, 0) / last7.length : 7;
      energyLevel = Math.round(avg * 10);
    }

    // 3. Deep Work Time (Today's hours vs 4 hours target)
    const todayDeepDuration = todayDeepLog ? todayDeepLog.duration : 0;
    const targetDeepHours = 4;

    // 4. Workout Progress (Workouts logged this week vs 4 workouts target)
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
    const weeklyWorkouts = workoutLogs.filter((w) => {
      const workoutDate = new Date(w.date);
      return isWithinInterval(workoutDate, { start: startOfCurrentWeek, end: endOfCurrentWeek });
    }).length;
    const targetWorkouts = 4;

    return [
      {
        name: "Focus Score",
        value: `${focusScore}%`,
        icon: Brain,
        color: "primary" as const,
        val: focusScore,
        max: 100,
      },
      {
        name: "Energy Level",
        value: `${energyLevel}%`,
        icon: Zap,
        color: "warning" as const,
        val: energyLevel,
        max: 100,
      },
      {
        name: "Deep Work Time",
        value: `${todayDeepDuration}h / ${targetDeepHours}h`,
        icon: Clock,
        color: "success" as const,
        val: todayDeepDuration,
        max: targetDeepHours,
      },
      {
        name: "Workout Progress",
        value: `${weeklyWorkouts} / ${targetWorkouts}d`,
        icon: Trophy,
        color: "success" as const,
        val: weeklyWorkouts,
        max: targetWorkouts,
      },
    ];
  }, [deepWorkLogs, moodLogs, workoutLogs, todayStr]);

  if (!mounted) {
    return <div className="h-[400px] w-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl animate-pulse" />;
  }

  const colors = {
    primary: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10",
    success: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
    warning: "text-amber-400 bg-amber-500/5 border-amber-500/10",
    danger: "text-rose-400 bg-rose-500/5 border-rose-500/10",
  };

  return (
    <Card variant="glass" className="h-full flex flex-col min-h-[400px]">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
        <h3 className="font-display font-bold text-lg text-zinc-100">Quick Stats</h3>
        <Link 
          href="/insights" 
          className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1 font-medium cursor-pointer group"
        >
          Insights <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Stacked indicators */}
      <div className="flex-1 space-y-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg border ${colors[stat.color]}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 font-display">{stat.name}</span>
                </div>
                <span className="text-xs font-bold text-zinc-100 font-mono">{stat.value}</span>
              </div>
              
              {/* Progress Bar */}
              <ProgressBar
                type="linear"
                value={stat.val}
                max={stat.max}
                color={stat.color}
                showLabel={false}
              />
            </div>
          );
        })}
      </div>

      {/* Info footer */}
      <div className="mt-6 pt-4 border-t border-zinc-900 text-[10px] text-zinc-500 text-center font-mono">
        Updates automatically upon logging metrics.
      </div>
    </Card>
  );
}

export default QuickStatsCard;
