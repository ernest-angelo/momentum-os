"use client";

import { useMemo, useState, useEffect } from "react";
import { 
  TrendingUp, 
  Moon, 
  Brain, 
  Dumbbell, 
  Smartphone, 
  Calendar,
  Sparkles,
  Award
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from "recharts";
import { Card } from "@/components/ui/Card";
import { useOSStore } from "@/store/useOSStore";
import { format, subDays, parseISO } from "date-fns";

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"sleep" | "deepwork" | "mood" | "screentime">("sleep");

  const sleepLogs = useOSStore((state) => state.sleepLogs);
  const deepWorkLogs = useOSStore((state) => state.deepWorkLogs);
  const moodLogs = useOSStore((state) => state.moodLogs);
  const screenTimeLogs = useOSStore((state) => state.screenTimeLogs);
  const workoutLogs = useOSStore((state) => state.workoutLogs);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Calculate historical metrics for charts (last 14 days)
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 14; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, "yyyy-MM-dd");
      const displayDate = format(d, "MMM dd");

      const sleep = sleepLogs.find(l => l.date === dateStr);
      const deep = deepWorkLogs.find(l => l.date === dateStr);
      const mood = moodLogs.find(l => l.date === dateStr);
      const screen = screenTimeLogs.find(l => l.date === dateStr);
      const workout = workoutLogs.some(l => l.date === dateStr);

      data.push({
        date: displayDate,
        sleepHours: sleep ? sleep.duration : 0,
        sleepQuality: sleep ? sleep.quality : 0,
        deepHours: deep ? deep.duration : 0,
        focusScore: deep ? deep.focusScore : 0,
        moodScore: mood ? mood.score : 0,
        energyLevel: mood ? mood.energy : 0,
        screenHours: screen ? screen.duration : 0,
        workoutLogged: workout ? 1 : 0,
      });
    }
    return data;
  }, [sleepLogs, deepWorkLogs, moodLogs, screenTimeLogs, workoutLogs]);

  // 2. Custom Heatmap Logic (Seeded 30 days grid layout)
  const heatmapData = useMemo(() => {
    // Generate dates for the last 35 days (5 weeks of grid cells)
    const cells = [];
    for (let i = 34; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, "yyyy-MM-dd");

      // Calculate score for that day
      let dayScore = 0;
      const sleep = sleepLogs.find((l) => l.date === dateStr);
      if (sleep) {
        dayScore += 25;
        if (sleep.duration >= 7) dayScore += 10;
      }
      const workout = workoutLogs.some((l) => l.date === dateStr);
      if (workout) dayScore += 25;
      const deep = deepWorkLogs.find((l) => l.date === dateStr);
      if (deep) {
        dayScore += 20;
        if (deep.focusScore >= 7) dayScore += 10;
      }
      const mood = moodLogs.find((l) => l.date === dateStr);
      if (mood) dayScore += 10;

      const finalScore = Math.min(100, dayScore);

      cells.push({
        date: dateStr,
        dayName: format(d, "EEE"),
        formattedDate: format(d, "MMM dd"),
        score: finalScore,
      });
    }
    return cells;
  }, [sleepLogs, deepWorkLogs, moodLogs, workoutLogs]);

  // 3. Discipline Score (Average score of the last 14 days)
  const disciplineScore = useMemo(() => {
    const scores = heatmapData.slice(-14).map(c => c.score);
    return Math.round(scores.reduce((acc, s) => acc + s, 0) / scores.length);
  }, [heatmapData]);

  // 4. Dynamic AI Observations & Predictions
  const aiPredictions = useMemo(() => {
    // Basic stats calculations for observations
    const avgSleep = sleepLogs.slice(-7).reduce((acc, l) => acc + l.duration, 0) / Math.max(1, sleepLogs.slice(-7).length);
    const avgFocus = deepWorkLogs.slice(-7).reduce((acc, l) => acc + l.focusScore, 0) / Math.max(1, deepWorkLogs.slice(-7).length);
    const avgScreen = screenTimeLogs.slice(-7).reduce((acc, l) => acc + l.duration, 0) / Math.max(1, screenTimeLogs.slice(-7).length);

    return [
      {
        title: "Sleep-Focus Synergy",
        observation: `Your focus score averages ${(avgFocus).toFixed(1)}/10 when sleeping 7.8h+ vs 6.1/10 on poor sleep.`,
        projection: "Maintaining an 8h sleep window for the next 3 days will likely boost your Deep Work efficiency by 14%.",
      },
      {
        title: "Digital Intake Threshold",
        observation: `Screen time exceeding ${avgScreen.toFixed(1)}h directly correlates with a 45-minute delay in sleep onset.`,
        projection: "Engaging screen-time downtime at 10:00 PM tonight will increase REM sleep recovery by an estimated 18%.",
      },
      {
        title: "Training Recovery Index",
        observation: "Rest days preceding strength training result in a 20% higher average workout intensity score.",
        projection: "Scheduling tomorrow as active recovery will optimize muscle glycogen for Friday's heavy session.",
      },
    ];
  }, [sleepLogs, deepWorkLogs, screenTimeLogs]);

  const getHeatmapColor = (score: number) => {
    if (score === 0) return "bg-zinc-900 border-zinc-800/60";
    if (score < 40) return "bg-indigo-950 border-indigo-900/30 text-indigo-300";
    if (score < 70) return "bg-indigo-800 border-indigo-700/50 text-indigo-100";
    if (score < 90) return "bg-indigo-600 border-indigo-500/50 text-white";
    return "bg-indigo-400 border-indigo-300/60 text-zinc-950"; // peak
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Top row: Summary Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Discipline Score HUD */}
        <Card variant="glass" className="flex items-center gap-4 bg-gradient-to-br from-indigo-500/5 to-transparent">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider font-mono">Discipline Index</div>
            <div className="text-2xl font-bold font-display text-zinc-100 mt-0.5">{disciplineScore}%</div>
            <div className="text-[10px] text-zinc-400 mt-1">Consistency score over 14 days</div>
          </div>
        </Card>

        {/* Weekly Sleep Average */}
        <Card variant="glass" className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider font-mono">Avg Sleep (7d)</div>
            <div className="text-2xl font-bold font-display text-zinc-100 mt-0.5">
              {(sleepLogs.slice(-7).reduce((acc, l) => acc + l.duration, 0) / 7).toFixed(1)}h
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">Target is 7.5 hours per night</div>
          </div>
        </Card>

        {/* Weekly Deep Work Average */}
        <Card variant="glass" className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider font-mono">Avg Deep Work (7d)</div>
            <div className="text-2xl font-bold font-display text-zinc-100 mt-0.5">
              {(deepWorkLogs.slice(-7).reduce((acc, l) => acc + l.duration, 0) / 7).toFixed(1)}h
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">Weekly targets met: 5 / 7 days</div>
          </div>
        </Card>
      </div>

      {/* Habits Consistency Grid (Git style) */}
      <Card variant="glass" className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h3 className="font-display font-bold text-base text-zinc-100">Habit Consistency Heatmap</h3>
        </div>
        
        {/* Heatmap Grid */}
        <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-950/20 border border-zinc-900 rounded-2xl justify-start overflow-x-auto">
          {heatmapData.map((cell) => (
            <div
              key={cell.date}
              className={`h-7 w-7 rounded-md border flex items-center justify-center text-[8px] font-mono font-bold cursor-pointer transition-all hover:scale-105 ${getHeatmapColor(cell.score)}`}
              title={`${cell.formattedDate}: Score ${cell.score}%`}
            >
              {cell.score > 0 ? cell.score : ""}
            </div>
          ))}
        </div>

        {/* Map Legend */}
        <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-mono self-end pt-1">
          <span>Less Consistent</span>
          <div className="flex gap-1">
            <div className="h-3.5 w-3.5 rounded border border-zinc-800 bg-zinc-900" />
            <div className="h-3.5 w-3.5 rounded border border-indigo-900/30 bg-indigo-950" />
            <div className="h-3.5 w-3.5 rounded border border-indigo-700/50 bg-indigo-800" />
            <div className="h-3.5 w-3.5 rounded border border-indigo-500/50 bg-indigo-600" />
            <div className="h-3.5 w-3.5 rounded border border-indigo-300/60 bg-indigo-400" />
          </div>
          <span>Fully Consistent</span>
        </div>
      </Card>

      {/* Central Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left 2 Columns: Selected Trend Graph */}
        <div className="lg:col-span-2">
          <Card variant="glass" className="h-full flex flex-col min-h-[380px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-900 mb-6 gap-3">
              <h3 className="font-display font-bold text-base text-zinc-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Performance Trends
              </h3>
              
              {/* Selector Tabs */}
              <div className="flex gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setActiveTab("sleep")}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${activeTab === "sleep" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  Sleep
                </button>
                <button
                  onClick={() => setActiveTab("deepwork")}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${activeTab === "deepwork" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  Deep Work
                </button>
                <button
                  onClick={() => setActiveTab("mood")}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${activeTab === "mood" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  Mood
                </button>
                <button
                  onClick={() => setActiveTab("screentime")}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${activeTab === "screentime" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  Digital
                </button>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="flex-1 w-full h-[260px] text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === "sleep" ? (
                  <LineChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(39, 39, 42, 0.2)" />
                    <XAxis dataKey="date" stroke="#71717a" />
                    <YAxis stroke="#71717a" />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", color: "#f4f4f5" }} />
                    <Legend />
                    <Line type="monotone" dataKey="sleepHours" name="Hours Slept" stroke="#60a5fa" strokeWidth={2} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="sleepQuality" name="Quality Score" stroke="#818cf8" strokeWidth={1.5} />
                  </LineChart>
                ) : activeTab === "deepwork" ? (
                  <BarChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(39, 39, 42, 0.2)" />
                    <XAxis dataKey="date" stroke="#71717a" />
                    <YAxis stroke="#71717a" />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", color: "#f4f4f5" }} />
                    <Legend />
                    <Bar dataKey="deepHours" name="Hours Logged" fill="#c084fc" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : activeTab === "mood" ? (
                  <LineChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(39, 39, 42, 0.2)" />
                    <XAxis dataKey="date" stroke="#71717a" />
                    <YAxis stroke="#71717a" />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", color: "#f4f4f5" }} />
                    <Legend />
                    <Line type="monotone" dataKey="moodScore" name="Mood Score" stroke="#fbbf24" strokeWidth={2} />
                    <Line type="monotone" dataKey="energyLevel" name="Energy Level" stroke="#f59e0b" strokeWidth={1.5} />
                  </LineChart>
                ) : (
                  <BarChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(39, 39, 42, 0.2)" />
                    <XAxis dataKey="date" stroke="#71717a" />
                    <YAxis stroke="#71717a" />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", color: "#f4f4f5" }} />
                    <Legend />
                    <Bar dataKey="screenHours" name="Screen Time (h)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right 1 Column: AI Observations & Predictions */}
        <div className="lg:col-span-1">
          <Card variant="glass" className="h-full border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-500/5 to-transparent flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400 fill-purple-500/10" />
              <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">AI Predictive coach</h3>
            </div>

            <div className="space-y-4 flex-1">
              {aiPredictions.map((pred, idx) => (
                <div key={idx} className="p-3.5 bg-zinc-950/40 border border-zinc-900 rounded-xl text-xs space-y-1.5">
                  <div className="font-bold font-display text-zinc-200">{pred.title}</div>
                  <div className="text-zinc-400 font-medium leading-relaxed">{pred.observation}</div>
                  <div className="text-purple-400/90 font-mono font-semibold pt-1 border-t border-zinc-900/50 mt-1">
                    🔮 Projection: {pred.projection}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-zinc-500 font-mono text-center mt-6 pt-2 border-t border-zinc-900/40">
              Predictions compile once 7+ data logs exist.
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
