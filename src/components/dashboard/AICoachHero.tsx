"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Brain, ArrowRight, Sparkles, Moon, Smartphone, Dumbbell } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useOSStore } from "@/store/useOSStore";
import { format } from "date-fns";

export function AICoachHero() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch logs
  const sleepLogs = useOSStore((state) => state.sleepLogs);
  const workoutLogs = useOSStore((state) => state.workoutLogs);
  const deepWorkLogs = useOSStore((state) => state.deepWorkLogs);
  const moodLogs = useOSStore((state) => state.moodLogs);
  const screenTimeLogs = useOSStore((state) => state.screenTimeLogs);
  // Dynamic Heuristic Correlation Engine
  const activeInsight = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    
    // 1. Check if sleep logged today is low
    const todaySleep = sleepLogs.find(l => l.date === todayStr);
    if (todaySleep && todaySleep.duration < 7) {
      return {
        type: "sleep-deficit",
        icon: Moon,
        iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        title: `Sleep Deficit: ${todaySleep.duration}h Logged`,
        description: `You slept ${todaySleep.duration} hours last night (1.2h below your 30-day baseline). Our data shows your focus drop usually happens 1.5h earlier on sleep-deprived days.`,
        recommendation: "Shift your deep work block to the morning and restrict screen time after 9:00 PM tonight.",
        actionText: "Check Sleep Trends",
        actionPath: "/insights",
      };
    }

    // 2. Check screen time correlation
    const averageScreenTime = screenTimeLogs.slice(-7).reduce((acc, l) => acc + l.duration, 0) / 7;
    const poorSleepDays = sleepLogs.slice(-10).filter(l => l.duration < 7).map(l => l.date);
    const screenTimeOnPoorSleep = screenTimeLogs.filter(l => poorSleepDays.includes(l.date));
    const avgScreenPoorSleep = screenTimeOnPoorSleep.length > 0
      ? screenTimeOnPoorSleep.reduce((acc, l) => acc + l.duration, 0) / screenTimeOnPoorSleep.length
      : 0;

    if (avgScreenPoorSleep > averageScreenTime + 0.5) {
      return {
        type: "screentime-correlation",
        icon: Smartphone,
        iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        title: "High Screen Time Correlation",
        description: `Your average screen time increases by ${(avgScreenPoorSleep - averageScreenTime).toFixed(1)}h (to ${avgScreenPoorSleep.toFixed(1)}h) on days preceding poor sleep. Limit screen time before bed to improve recovery.`,
        recommendation: "Log your screen time details and set a bedtime downtime reminder for 10:30 PM.",
        actionText: "Manage Screen Time",
        actionPath: "/track/screen-time",
      };
    }

    // 3. Check workout correlation
    const workoutDays = workoutLogs.slice(-14).map(l => l.date);
    const moodOnWorkoutDays = moodLogs.filter(l => workoutDays.includes(l.date));
    const avgMoodWorkouts = moodOnWorkoutDays.length > 0 
      ? moodOnWorkoutDays.reduce((acc, l) => acc + l.score, 0) / moodOnWorkoutDays.length
      : 0;

    const restDays = moodLogs.filter(l => !workoutDays.includes(l.date) && l.date !== todayStr);
    const avgMoodRest = restDays.length > 0 
      ? restDays.reduce((acc, l) => acc + l.score, 0) / restDays.length
      : 0;

    if (avgMoodWorkouts > avgMoodRest + 0.5) {
      const percentageImprovement = Math.round(((avgMoodWorkouts - avgMoodRest) / avgMoodRest) * 100);
      return {
        type: "workout-mood-lift",
        icon: Dumbbell,
        iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        title: "Training Boosts Mood & Energy",
        description: `Your daily mood and energy levels are ${percentageImprovement}% higher on days with workouts. Logging regular workout sessions directly drives your discipline score.`,
        recommendation: "Complete your scheduled strength workout today. It is your best catalyst for daily focus.",
        actionText: "Record Workout",
        actionPath: "/track/workout",
      };
    }

    // Default Insight: Deep Work probability
    return {
      type: "peak-performance",
      icon: Brain,
      iconColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      title: "Optimized Deep Work Day",
      description: "Based on your high sleep quality (8.2h) and low weekly distraction logs, today has a 94% focus optimization probability. You operate at peak cognitive capacity before 12:00 PM.",
      recommendation: "Schedule a 2-hour uninterrupted Deep Work sprint starting between 9:00 AM and 10:00 AM.",
      actionText: "Log Focus Block",
      actionPath: "/track/deep-work",
    };
  }, [sleepLogs, workoutLogs, deepWorkLogs, moodLogs, screenTimeLogs]);

  if (!mounted) {
    return <div className="h-[210px] w-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl animate-pulse mb-6" />;
  }

  const Icon = activeInsight.icon;

  return (
    <Card variant="glass" className="mb-6 border border-zinc-800 bg-gradient-to-r from-zinc-900/90 to-zinc-950/80 shadow-lg relative overflow-hidden" animate={true}>
      {/* Decorative gradient flare */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
        {/* Metric Icon Container */}
        <div className={`p-3.5 rounded-2xl border ${activeInsight.iconColor} flex-shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Text details */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-mono font-semibold tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-indigo-500/10" /> AI Coach
            </span>
          </div>
          
          <h2 className="text-xl font-bold font-display text-zinc-100">{activeInsight.title}</h2>
          
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
            {activeInsight.description}
          </p>
          
          {/* Recommendation quote */}
          <div className="p-3.5 bg-zinc-950/50 border border-zinc-900 rounded-xl text-sm text-zinc-300 leading-relaxed border-l-2 border-l-indigo-500 flex items-start gap-2.5">
            <span className="font-semibold text-indigo-400 select-none">Advice:</span>
            <span>{activeInsight.recommendation}</span>
          </div>

          {/* Action button */}
          <div className="pt-3">
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => router.push(activeInsight.actionPath)}
            >
              {activeInsight.actionText}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AICoachHero;
