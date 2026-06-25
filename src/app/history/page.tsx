"use client";

import { useMemo, useState, useEffect } from "react";
import { 
  History, 
  Moon, 
  Dumbbell, 
  Brain, 
  Smile, 
  Smartphone, 
  BookOpen, 
  Calendar,
  CheckCircle,
  FileText
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useOSStore } from "@/store/useOSStore";
import { format, subDays, parseISO } from "date-fns";

export default function HistoryPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sleepLogs = useOSStore((state) => state.sleepLogs);
  const workoutLogs = useOSStore((state) => state.workoutLogs);
  const deepWorkLogs = useOSStore((state) => state.deepWorkLogs);
  const moodLogs = useOSStore((state) => state.moodLogs);
  const screenTimeLogs = useOSStore((state) => state.screenTimeLogs);

  const contentLogs = useOSStore((state) => state.contentLogs);
  const tasks = useOSStore((state) => state.tasks);

  // Group historical entries by date for the last 14 days
  const historyEntries = useMemo(() => {
    const entries = [];
    for (let i = 0; i < 14; i++) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, "yyyy-MM-dd");
      const displayDate = format(d, "EEEE, MMMM d, yyyy");

      const sleep = sleepLogs.find(l => l.date === dateStr);
      const workout = workoutLogs.find(l => l.date === dateStr);
      const deep = deepWorkLogs.find(l => l.date === dateStr);
      const mood = moodLogs.find(l => l.date === dateStr);
      const screen = screenTimeLogs.find(l => l.date === dateStr);
      const content = contentLogs.filter(l => l.date === dateStr);
      const completedTasks = tasks.filter(t => t.createdAt === dateStr && t.completed);

      // Check if anything was logged for this day
      const hasLogs = sleep || workout || deep || mood || screen || content.length > 0 || completedTasks.length > 0;

      if (hasLogs) {
        entries.push({
          date: dateStr,
          displayDate,
          sleep,
          workout,
          deep,
          mood,
          screen,
          content,
          completedTasksCount: completedTasks.length,
        });
      }
    }
    return entries;
  }, [sleepLogs, workoutLogs, deepWorkLogs, moodLogs, screenTimeLogs, contentLogs, tasks]);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <span className="text-xs text-zinc-500 font-mono">Loading History Feed...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-900 mb-6">
        <div className="p-2.5 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-indigo-400">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-zinc-100">Historical Journal</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Browse chronological logs and daily completions.</p>
        </div>
      </div>

      {/* History Timeline */}
      <div className="space-y-6 relative pl-6 border-l border-zinc-800/80 ml-3">
        {historyEntries.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 font-mono text-sm">
            No historical entries found.
          </div>
        ) : (
          historyEntries.map((entry, idx) => (
            <div key={entry.date} className="relative space-y-3">
              {/* Timeline circle indicator */}
              <div className="absolute -left-[32px] mt-1.5 h-4.5 w-4.5 rounded-full border-4 border-background bg-zinc-900 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              </div>

              {/* Date Card Title */}
              <div className="text-xs font-mono font-semibold text-zinc-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                {entry.displayDate}
              </div>

              {/* Aggregated Daily Log Card */}
              <Card variant="glass" className="p-5 border border-zinc-900 bg-zinc-950/20 hover:border-zinc-850">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Core Tracker Details */}
                  <div className="space-y-3">
                    
                    {/* Sleep */}
                    {entry.sleep && (
                      <div className="flex items-start gap-2.5 text-xs">
                        <Moon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-zinc-300 font-display">Sleep:</span>{" "}
                          <span className="text-zinc-400 font-mono">{entry.sleep.duration}h</span>{" "}
                          <span className="text-zinc-500 font-mono">(Quality: {entry.sleep.quality}/10)</span>
                          {entry.sleep.notes && (
                            <p className="text-[10px] text-zinc-500 italic mt-0.5">"{entry.sleep.notes}"</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Deep Work */}
                    {entry.deep && (
                      <div className="flex items-start gap-2.5 text-xs">
                        <Brain className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-zinc-300 font-display">Deep Work:</span>{" "}
                          <span className="text-zinc-400 font-mono">{entry.deep.duration}h</span>{" "}
                          <span className="text-zinc-500 font-mono">(Focus: {entry.deep.focusScore}/10, Distractions: {entry.deep.distractions})</span>
                        </div>
                      </div>
                    )}

                    {/* Workout */}
                    {entry.workout && (
                      <div className="flex items-start gap-2.5 text-xs">
                        <Dumbbell className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-zinc-300 font-display">Workout:</span>{" "}
                          <span className="text-zinc-400">{entry.workout.type}</span>{" "}
                          <span className="text-zinc-500 font-mono">({entry.workout.duration}m, Intensity: {entry.workout.intensity}/10)</span>
                          {entry.workout.notes && (
                            <p className="text-[10px] text-zinc-500 italic mt-0.5">"{entry.workout.notes}"</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Other logs & tasks completed */}
                  <div className="space-y-3">
                    {/* Mood & Energy */}
                    {entry.mood && (
                      <div className="flex items-start gap-2.5 text-xs">
                        <Smile className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-zinc-300 font-display">Mood & Energy:</span>{" "}
                          <span className="text-zinc-400 font-mono">Mood {entry.mood.score}/10, Energy {entry.mood.energy}/10</span>
                          {entry.mood.notes && (
                            <p className="text-[10px] text-zinc-500 italic mt-0.5">"{entry.mood.notes}"</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Screen Time */}
                    {entry.screen && (
                      <div className="flex items-start gap-2.5 text-xs">
                        <Smartphone className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-zinc-300 font-display">Screen Time:</span>{" "}
                          <span className="text-zinc-400 font-mono">{entry.screen.duration}h</span>{" "}
                          <span className="text-zinc-500 font-mono">({entry.screen.pickups} pickups)</span>
                        </div>
                      </div>
                    )}

                    {/* Tasks completed */}
                    {entry.completedTasksCount > 0 && (
                      <div className="flex items-center gap-2.5 text-xs">
                        <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-zinc-300 font-display">Tasks Done:</span>{" "}
                          <span className="text-zinc-400 font-mono">{entry.completedTasksCount} priority actions finished</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
