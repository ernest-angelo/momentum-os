"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Moon, 
  Dumbbell, 
  Brain, 
  Smile, 
  Smartphone, 
  BookOpen, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles 
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useOSStore } from "@/store/useOSStore";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface Props {
  params: Promise<{ metric: string }>;
}

export default function TrackMetricPage({ params }: Props) {
  const resolvedParams = use(params);
  const metric = resolvedParams.metric;
  const router = useRouter();

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const [success, setSuccess] = useState(false);

  // Store action hooks
  const logSleep = useOSStore((state) => state.logSleep);
  const logWorkout = useOSStore((state) => state.logWorkout);
  const logDeepWork = useOSStore((state) => state.logDeepWork);
  const logMood = useOSStore((state) => state.logMood);
  const logScreenTime = useOSStore((state) => state.logScreenTime);
  const logContent = useOSStore((state) => state.logContent);

  // Existing logs to pre-populate if logged today
  const existingSleep = useOSStore((state) => state.sleepLogs.find(l => l.date === todayStr));
  const existingWorkout = useOSStore((state) => state.workoutLogs.find(l => l.date === todayStr));
  const existingDeep = useOSStore((state) => state.deepWorkLogs.find(l => l.date === todayStr));
  const existingMood = useOSStore((state) => state.moodLogs.find(l => l.date === todayStr));
  const existingScreen = useOSStore((state) => state.screenTimeLogs.find(l => l.date === todayStr));

  // Form States
  const [sleepDuration, setSleepDuration] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState(7);
  const [sleepNotes, setSleepNotes] = useState("");

  const [workoutType, setWorkoutType] = useState<"Strength" | "Cardio" | "Flexibility" | "Active Recovery">("Strength");
  const [workoutDuration, setWorkoutDuration] = useState(60);
  const [workoutIntensity, setWorkoutIntensity] = useState(7);
  const [workoutNotes, setWorkoutNotes] = useState("");

  const [deepDuration, setDeepDuration] = useState(2.0);
  const [deepFocus, setDeepFocus] = useState(8);
  const [deepDistractions, setDeepDistractions] = useState(3);

  const [moodScore, setMoodScore] = useState(7);
  const [moodEnergy, setMoodEnergy] = useState(7);
  const [moodNotes, setMoodNotes] = useState("");

  const [screenHours, setScreenHours] = useState(4.0);
  const [screenPickups, setScreenPickups] = useState(50);
  const [screenNotes, setScreenNotes] = useState("");

  const [contentType, setContentType] = useState<"Book" | "Article" | "Video" | "Podcast">("Book");
  const [contentTitle, setContentTitle] = useState("");
  const [contentDuration, setContentDuration] = useState(30);

  // Pre-seed forms with existing logs if already logged today
  useEffect(() => {
    if (metric === "sleep" && existingSleep) {
      setSleepDuration(existingSleep.duration);
      setSleepQuality(existingSleep.quality);
      setSleepNotes(existingSleep.notes || "");
    } else if (metric === "workout" && existingWorkout) {
      setWorkoutType(existingWorkout.type);
      setWorkoutDuration(existingWorkout.duration);
      setWorkoutIntensity(existingWorkout.intensity);
      setWorkoutNotes(existingWorkout.notes || "");
    } else if (metric === "deep-work" && existingDeep) {
      setDeepDuration(existingDeep.duration);
      setDeepFocus(existingDeep.focusScore);
      setDeepDistractions(existingDeep.distractions);
    } else if (metric === "mood" && existingMood) {
      setMoodScore(existingMood.score);
      setMoodEnergy(existingMood.energy);
      setMoodNotes(existingMood.notes || "");
    } else if (metric === "screen-time" && existingScreen) {
      setScreenHours(existingScreen.duration);
      setScreenPickups(existingScreen.pickups);
      setScreenNotes(existingScreen.notes || "");
    }
  }, [metric, existingSleep, existingWorkout, existingDeep, existingMood, existingScreen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (metric === "sleep") {
      logSleep({ duration: sleepDuration, quality: sleepQuality, notes: sleepNotes });
    } else if (metric === "workout") {
      logWorkout({ type: workoutType, duration: workoutDuration, intensity: workoutIntensity, notes: workoutNotes });
    } else if (metric === "deep-work") {
      logDeepWork({ duration: deepDuration, focusScore: deepFocus, distractions: deepDistractions });
    } else if (metric === "mood") {
      logMood({ score: moodScore, energy: moodEnergy, notes: moodNotes });
    } else if (metric === "screen-time") {
      logScreenTime({ duration: screenHours, pickups: screenPickups, notes: screenNotes });
    } else if (metric === "content") {
      logContent({ type: contentType, title: contentTitle || "Self Development Session", duration: contentDuration });
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const getMetricConfig = () => {
    switch (metric) {
      case "sleep":
        return {
          title: "Sleep & Recovery",
          description: "Tracks overnight recovery parameters. Highly correlates with subsequent daily focus capacity.",
          icon: Moon,
          color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
        };
      case "workout":
        return {
          title: "Workout & Physical Activity",
          description: "Tracks physical exertion, duration, and cardiovascular loading.",
          icon: Dumbbell,
          color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
        };
      case "deep-work":
        return {
          title: "Deep Work Block",
          description: "Logs highly focused, distraction-free productivity periods.",
          icon: Brain,
          color: "text-purple-400 border-purple-500/20 bg-purple-500/5",
        };
      case "mood":
        return {
          title: "Mood & Energy Reflections",
          description: "Logs daily psychological wellbeing and nervous system energy parameters.",
          icon: Smile,
          color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
        };
      case "screen-time":
        return {
          title: "Screen Time & Digital Intake",
          description: "Tracks cumulative screen usage and frequency of physical phone pickups.",
          icon: Smartphone,
          color: "text-rose-400 border-rose-500/20 bg-rose-500/5",
        };
      case "content":
        return {
          title: "Content & Focus Consumption",
          description: "Tracks conscious learning through reading, audio, or podcasts.",
          icon: BookOpen,
          color: "text-teal-400 border-teal-500/20 bg-teal-500/5",
        };
      default:
        return {
          title: "Generic Tracker",
          description: "Input tracker data.",
          icon: Sparkles,
          color: "text-zinc-400 border-zinc-800 bg-zinc-900/50",
        };
    }
  };

  const config = getMetricConfig();
  const Icon = config.icon;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"
        >
          <CheckCircle className="w-8 h-8" />
        </motion.div>
        <h2 className="text-xl font-bold font-display text-zinc-100">Metric Logged Successfully</h2>
        <p className="text-sm text-zinc-500 font-mono">Redirecting to Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Back Button */}
      <button 
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 text-xs font-semibold font-mono cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Main Form Card */}
      <Card variant="glass" className="border border-zinc-800">
        {/* Header Section */}
        <div className="flex items-center gap-4 pb-4 border-b border-zinc-900 mb-6">
          <div className={`p-3 rounded-2xl border ${config.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-zinc-100">{config.title}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{config.description}</p>
          </div>
        </div>

        {/* Dynamic Forms */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SLEEP FORM */}
          {metric === "sleep" && (
            <div className="space-y-5">
              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <label className="text-zinc-300">Sleep Duration</label>
                  <span className="text-indigo-400 font-mono text-xs">{sleepDuration} hours</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.1"
                  value={sleepDuration}
                  onChange={(e) => setSleepDuration(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Quality Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <label className="text-zinc-300">Sleep Quality</label>
                  <span className="text-indigo-400 font-mono text-xs">{sleepQuality} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 block">Reflection Notes</label>
                <textarea
                  value={sleepNotes}
                  onChange={(e) => setSleepNotes(e.target.value)}
                  placeholder="E.g., Woke up once, felt refreshed, had a dream..."
                  className="w-full h-24 p-3.5 glass-input text-sm text-zinc-200 placeholder:text-zinc-600 resize-none"
                />
              </div>
            </div>
          )}

          {/* WORKOUT FORM */}
          {metric === "workout" && (
            <div className="space-y-5">
              {/* Workout Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 block">Workout Category</label>
                <select
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value as any)}
                  className="w-full p-3.5 glass-input text-sm text-zinc-200 font-display cursor-pointer"
                >
                  <option value="Strength">💪 Strength Training</option>
                  <option value="Cardio">🏃 Cardiovascular Exertion</option>
                  <option value="Flexibility">🧘 Yoga & Mobility</option>
                  <option value="Active Recovery">🚶 Active Recovery Walks</option>
                </select>
              </div>

              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <label className="text-zinc-300">Duration</label>
                  <span className="text-indigo-400 font-mono text-xs">{workoutDuration} minutes</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="185"
                  step="5"
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Intensity Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <label className="text-zinc-300">RPE Intensity</label>
                  <span className="text-indigo-400 font-mono text-xs">{workoutIntensity} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={workoutIntensity}
                  onChange={(e) => setWorkoutIntensity(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 block">Exercises & Session Notes</label>
                <textarea
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="E.g., Squats 3x5 100kg, Pullups, Bench..."
                  className="w-full h-24 p-3.5 glass-input text-sm text-zinc-200 placeholder:text-zinc-600 resize-none"
                />
              </div>
            </div>
          )}

          {/* DEEP WORK FORM */}
          {metric === "deep-work" && (
            <div className="space-y-5">
              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <label className="text-zinc-300">Deep Work Duration</label>
                  <span className="text-indigo-400 font-mono text-xs">{deepDuration} hours</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.5"
                  value={deepDuration}
                  onChange={(e) => setDeepDuration(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Focus score Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <label className="text-zinc-300">Focus Score</label>
                  <span className="text-indigo-400 font-mono text-xs">{deepFocus} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={deepFocus}
                  onChange={(e) => setDeepFocus(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Distractions count */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 block">External Distraction Incidents</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={deepDistractions}
                  onChange={(e) => setDeepDistractions(parseInt(e.target.value) || 0)}
                  className="w-full p-3.5 glass-input text-sm text-zinc-200"
                />
              </div>
            </div>
          )}

          {/* MOOD & ENERGY FORM */}
          {metric === "mood" && (
            <div className="space-y-5">
              {/* Mood Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <label className="text-zinc-300">Psychological Mood</label>
                  <span className="text-indigo-400 font-mono text-xs">{moodScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={moodScore}
                  onChange={(e) => setMoodScore(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Energy Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <label className="text-zinc-300">Physical Energy</label>
                  <span className="text-indigo-400 font-mono text-xs">{moodEnergy} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={moodEnergy}
                  onChange={(e) => setMoodEnergy(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 block">Gratitude or Mental Reflections</label>
                <textarea
                  value={moodNotes}
                  onChange={(e) => setMoodNotes(e.target.value)}
                  placeholder="What is top of mind today? Wrote down gratitude blocks..."
                  className="w-full h-24 p-3.5 glass-input text-sm text-zinc-200 placeholder:text-zinc-600 resize-none"
                />
              </div>
            </div>
          )}

          {/* SCREEN TIME FORM */}
          {metric === "screen-time" && (
            <div className="space-y-5">
              {/* Screen Hours Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <label className="text-zinc-300">Total Screen Time</label>
                  <span className="text-indigo-400 font-mono text-xs">{screenHours} hours</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="12.0"
                  step="0.5"
                  value={screenHours}
                  onChange={(e) => setScreenHours(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Pickups */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 block">Device Pickups</label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={screenPickups}
                  onChange={(e) => setScreenPickups(parseInt(e.target.value) || 0)}
                  className="w-full p-3.5 glass-input text-sm text-zinc-200"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 block">General usage details</label>
                <textarea
                  value={screenNotes}
                  onChange={(e) => setScreenNotes(e.target.value)}
                  placeholder="E.g., Social media, work research, messaging..."
                  className="w-full h-24 p-3.5 glass-input text-sm text-zinc-200 placeholder:text-zinc-600 resize-none"
                />
              </div>
            </div>
          )}

          {/* CONTENT FORM */}
          {metric === "content" && (
            <div className="space-y-5">
              {/* Content Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 block">Content Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as any)}
                  className="w-full p-3.5 glass-input text-sm text-zinc-200 font-display cursor-pointer"
                >
                  <option value="Book">📖 Book Reading</option>
                  <option value="Article">📄 Articles / Research Papers</option>
                  <option value="Podcast">🎙️ Podcasts / Audio Books</option>
                  <option value="Video">🎥 Educational Video / Lecture</option>
                </select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 block">Content Title / Topic</label>
                <input
                  type="text"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  placeholder="E.g., Atomic Habits, Huberman Lab podcast..."
                  className="w-full p-3.5 glass-input text-sm text-zinc-200 placeholder:text-zinc-600"
                  required
                />
              </div>

              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <label className="text-zinc-300">Duration</label>
                  <span className="text-indigo-400 font-mono text-xs">{contentDuration} minutes</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={contentDuration}
                  onChange={(e) => setContentDuration(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 flex justify-end gap-3 border-t border-zinc-900">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/")}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="cursor-pointer"
            >
              Save Log entry
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
