"use client";

import { useMemo } from "react";
import { Brain, Zap, Clock, Trophy } from "lucide-react";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { useOSStore } from "@/store/useOSStore";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

export function QuickStatsGrid() {
  const deepWorkLogs = useOSStore((state) => state.deepWorkLogs);
  const moodLogs = useOSStore((state) => state.moodLogs);
  const workoutLogs = useOSStore((state) => state.workoutLogs);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const stats = useMemo(() => {
    // 1. Focus Score (Today's score if exists, else average of last 7 sessions)
    const todayDeepLog = deepWorkLogs.find((l) => l.date === todayStr);
    let focusScore = 0;
    if (todayDeepLog) {
      focusScore = todayDeepLog.focusScore * 10; // Convert 1-10 to percentage
    } else {
      const last7 = deepWorkLogs.slice(-7);
      const avg = last7.length > 0 ? last7.reduce((acc, l) => acc + l.focusScore, 0) / last7.length : 8;
      focusScore = Math.round(avg * 10);
    }

    // 2. Energy Level (Today's energy score if exists, else average of last 7 entries)
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
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    const endOfCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 }); // Sunday
    
    const weeklyWorkouts = workoutLogs.filter((w) => {
      const workoutDate = new Date(w.date);
      return isWithinInterval(workoutDate, { start: startOfCurrentWeek, end: endOfCurrentWeek });
    }).length;
    
    const targetWorkouts = 4;

    return [
      {
        name: "Focus Score",
        value: `${focusScore}%`,
        subText: todayDeepLog ? "Logged today" : "7-day average",
        icon: Brain,
        color: "primary" as const,
        progressVal: focusScore,
        progressMax: 100,
      },
      {
        name: "Energy Level",
        value: `${energyLevel}%`,
        subText: todayMoodLog ? "Logged today" : "7-day average",
        icon: Zap,
        color: "warning" as const,
        progressVal: energyLevel,
        progressMax: 100,
      },
      {
        name: "Deep Work",
        value: `${todayDeepDuration}h`,
        subText: `Target: ${targetDeepHours}h`,
        icon: Clock,
        color: "success" as const,
        progressVal: todayDeepDuration,
        progressMax: targetDeepHours,
      },
      {
        name: "Workouts",
        value: `${weeklyWorkouts} / ${targetWorkouts}`,
        subText: "This calendar week",
        icon: Trophy,
        color: "success" as const,
        progressVal: weeklyWorkouts,
        progressMax: targetWorkouts,
      },
    ];
  }, [deepWorkLogs, moodLogs, workoutLogs, todayStr]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        
        // Colors configurations
        const iconColors = {
          primary: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          danger: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        };

        return (
          <Card
            key={stat.name}
            variant="glass"
            className="flex flex-col items-center justify-between text-center p-5 border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800 hover:bg-zinc-900/10"
            hoverable={true}
            animate={true}
            delay={idx * 0.05}
          >
            {/* Header info */}
            <div className="flex flex-col items-center gap-1.5 w-full">
              <div className={`p-2 rounded-xl border ${iconColors[stat.color]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider font-mono mt-1">
                {stat.name}
              </span>
            </div>

            {/* Circular Progress Meter */}
            <div className="my-5">
              <ProgressBar
                type="circular"
                value={stat.progressVal}
                max={stat.progressMax}
                color={stat.color}
                size="md"
              />
            </div>

            {/* Values */}
            <div className="w-full">
              <div className="text-xl font-bold font-display text-zinc-100">{stat.value}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{stat.subText}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default QuickStatsGrid;
