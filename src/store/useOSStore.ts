import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format, subDays } from "date-fns";
import { v4 as uuidv4 } from "uuid";

// Define Data Models
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: "deep-work" | "workout" | "sleep" | "mood" | "screen-time" | "content" | "general";
  createdAt: string; // YYYY-MM-DD
}

export interface SleepLog {
  id: string;
  date: string; // YYYY-MM-DD
  duration: number; // hours
  quality: number; // 1-10
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  type: "Strength" | "Cardio" | "Flexibility" | "Active Recovery";
  duration: number; // minutes
  intensity: number; // 1-10
  notes?: string;
}

export interface DeepWorkLog {
  id: string;
  date: string; // YYYY-MM-DD
  duration: number; // hours
  focusScore: number; // 1-10
  distractions: number; // count
}

export interface MoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  score: number; // 1-10
  energy: number; // 1-10
  notes?: string;
}

export interface ScreenTimeLog {
  id: string;
  date: string; // YYYY-MM-DD
  duration: number; // hours
  pickups: number;
  notes?: string;
}

export interface ContentLog {
  id: string;
  date: string; // YYYY-MM-DD
  type: "Book" | "Article" | "Video" | "Podcast";
  title: string;
  duration: number; // minutes
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  category: string;
  completed: boolean;
}

interface OSState {
  streak: number;
  tasks: Task[];
  sleepLogs: SleepLog[];
  workoutLogs: WorkoutLog[];
  deepWorkLogs: DeepWorkLog[];
  moodLogs: MoodLog[];
  screenTimeLogs: ScreenTimeLog[];
  contentLogs: ContentLog[];
  goals: Goal[];
  
  // Actions
  addTask: (title: string, category: Task["category"]) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  generateDefaultTasks: () => void;
  
  logSleep: (log: Omit<SleepLog, "id" | "date">) => void;
  logWorkout: (log: Omit<WorkoutLog, "id" | "date">) => void;
  logDeepWork: (log: Omit<DeepWorkLog, "id" | "date">) => void;
  logMood: (log: Omit<MoodLog, "id" | "date">) => void;
  logScreenTime: (log: Omit<ScreenTimeLog, "id" | "date">) => void;
  logContent: (log: Omit<ContentLog, "id" | "date">) => void;
  
  updateGoalProgress: (id: string, progress: number) => void;
  addGoal: (title: string, target: number, unit: string, category: string) => void;
  
  // Dynamic Calculators
  getTodayScore: () => number;
  getWeeklyAverage: (metric: string) => number;
}

// Generate 30 days of high-fidelity pre-seeded data
const generateSeedData = () => {
  const tasks: Task[] = [];
  const sleepLogs: SleepLog[] = [];
  const workoutLogs: WorkoutLog[] = [];
  const deepWorkLogs: DeepWorkLog[] = [];
  const moodLogs: MoodLog[] = [];
  const screenTimeLogs: ScreenTimeLog[] = [];
  const contentLogs: ContentLog[] = [];

  const todayStr = format(new Date(), "yyyy-MM-dd");

  for (let i = 30; i >= 1; i--) {
    const currentDate = subDays(new Date(), i);
    const dateStr = format(currentDate, "yyyy-MM-dd");

    // Sleep (highly correlated with mood & deep work)
    // We seed better sleep on weekends (Fri-Sat nights)
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const sleepSeed = isWeekend ? 8.2 - Math.random() : 7.2 - Math.random();
    const sleepDuration = parseFloat(sleepSeed.toFixed(1));
    const sleepQuality = Math.min(10, Math.round(sleepDuration * 1.1 + (Math.random() - 0.5) * 2));

    sleepLogs.push({
      id: uuidv4(),
      date: dateStr,
      duration: sleepDuration,
      quality: sleepQuality,
      notes: sleepQuality > 7 ? "Felt rested." : "Slightly groggy.",
    });

    // Workout (roughly 4 times a week: Monday, Wednesday, Friday, Sunday)
    const day = currentDate.getDay();
    if (day === 1 || day === 3 || day === 5 || day === 0) {
      const types: WorkoutLog["type"][] = ["Strength", "Cardio", "Flexibility", "Active Recovery"];
      const wType = types[day % types.length];
      workoutLogs.push({
        id: uuidv4(),
        date: dateStr,
        type: wType,
        duration: wType === "Strength" ? 60 : 45,
        intensity: Math.round(7 + Math.random() * 2),
        notes: "Good session.",
      });
    }

    // Deep Work (higher duration on sleep >= 7.5 hours)
    const focusBonus = sleepDuration > 7.5 ? 1.5 : -1;
    const deepDuration = Math.max(0, parseFloat((4.5 + focusBonus + (Math.random() - 0.5) * 2).toFixed(1)));
    const focusScore = Math.min(10, Math.round(7 + (focusBonus > 0 ? 1 : -1) + Math.random()));
    if (deepDuration > 0) {
      deepWorkLogs.push({
        id: uuidv4(),
        date: dateStr,
        duration: deepDuration,
        focusScore,
        distractions: Math.round(3 + Math.random() * 5 + (focusBonus < 0 ? 5 : 0)),
      });
    }

    // Mood & Energy (strongly correlated with workout & sleep duration)
    const hadWorkout = workoutLogs.some(w => w.date === dateStr);
    const moodScore = Math.min(10, Math.round(6 + (sleepDuration > 7.5 ? 1.5 : 0) + (hadWorkout ? 1 : 0) + (Math.random() - 0.5) * 2));
    const energyScore = Math.min(10, Math.round(5 + (sleepDuration > 7.2 ? 2 : 0) + (hadWorkout ? 1 : -0.5) + (Math.random() - 0.5) * 2));
    moodLogs.push({
      id: uuidv4(),
      date: dateStr,
      score: moodScore,
      energy: energyScore,
      notes: hadWorkout ? "Energized after training." : "Standard day.",
    });

    // Screen Time (often higher when sleep was poor the previous night)
    const screenHours = parseFloat((3.8 + (sleepDuration < 7 ? 1.5 : -0.5) + Math.random() * 1.5).toFixed(1));
    screenTimeLogs.push({
      id: uuidv4(),
      date: dateStr,
      duration: screenHours,
      pickups: Math.round(40 + screenHours * 10 + Math.random() * 20),
    });

    // Content
    if (Math.random() > 0.4) {
      const contentTypes: ContentLog["type"][] = ["Book", "Article", "Podcast", "Video"];
      contentLogs.push({
        id: uuidv4(),
        date: dateStr,
        type: contentTypes[Math.round(Math.random() * 3)],
        title: `Seeded Learning Block ${i}`,
        duration: Math.round(15 + Math.random() * 45),
      });
    }

    // Historical Tasks
    tasks.push({
      id: uuidv4(),
      title: "Complete daily deep work block",
      completed: Math.random() > 0.2,
      category: "deep-work",
      createdAt: dateStr,
    });
    tasks.push({
      id: uuidv4(),
      title: "Log Sleep",
      completed: true,
      category: "sleep",
      createdAt: dateStr,
    });
    if (hadWorkout) {
      tasks.push({
        id: uuidv4(),
        title: "Workout",
        completed: true,
        category: "workout",
        createdAt: dateStr,
      });
    }
  }

  // Pre-seed today's pending tasks
  tasks.push({
    id: uuidv4(),
    title: "Finish Deep Work Block",
    completed: false,
    category: "deep-work",
    createdAt: todayStr,
  });
  tasks.push({
    id: uuidv4(),
    title: "Workout (Leg Day)",
    completed: false,
    category: "workout",
    createdAt: todayStr,
  });
  tasks.push({
    id: uuidv4(),
    title: "Record Sleep Log",
    completed: false,
    category: "sleep",
    createdAt: todayStr,
  });
  tasks.push({
    id: uuidv4(),
    title: "Complete Evening Reflections",
    completed: false,
    category: "mood",
    createdAt: todayStr,
  });

  return { tasks, sleepLogs, workoutLogs, deepWorkLogs, moodLogs, screenTimeLogs, contentLogs };
};

const seeds = generateSeedData();

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      streak: 12,
      tasks: seeds.tasks,
      sleepLogs: seeds.sleepLogs,
      workoutLogs: seeds.workoutLogs,
      deepWorkLogs: seeds.deepWorkLogs,
      moodLogs: seeds.moodLogs,
      screenTimeLogs: seeds.screenTimeLogs,
      contentLogs: seeds.contentLogs,
      goals: [
        { id: "g1", title: "Sleep average 7.5h+", target: 7.5, current: 7.3, unit: "hrs", category: "sleep", completed: false },
        { id: "g2", title: "Deep work sessions", target: 20, current: 14, unit: "sessions", category: "deep-work", completed: false },
        { id: "g3", title: "Workout 4x weekly", target: 16, current: 13, unit: "workouts", category: "workout", completed: false },
      ],

      // Tasks Actions
      addTask: (title, category) => {
        const todayStr = format(new Date(), "yyyy-MM-dd");
        const newTask: Task = {
          id: uuidv4(),
          title,
          completed: false,
          category,
          createdAt: todayStr,
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      generateDefaultTasks: () => {
        const todayStr = format(new Date(), "yyyy-MM-dd");
        // Check if today already has tasks
        const hasTodayTasks = get().tasks.some(t => t.createdAt === todayStr);
        if (hasTodayTasks) return;

        const defaultTasks: Task[] = [
          { id: uuidv4(), title: "Finish Deep Work Block", completed: false, category: "deep-work", createdAt: todayStr },
          { id: uuidv4(), title: "Log Workout Session", completed: false, category: "workout", createdAt: todayStr },
          { id: uuidv4(), title: "Record Sleep Log", completed: false, category: "sleep", createdAt: todayStr },
          { id: uuidv4(), title: "Reflect on Mood & Energy", completed: false, category: "mood", createdAt: todayStr },
        ];
        set((state) => ({ tasks: [...state.tasks, ...defaultTasks] }));
      },

      // Logging Actions
      logSleep: (log) => {
        const todayStr = format(new Date(), "yyyy-MM-dd");
        const existing = get().sleepLogs.find((l) => l.date === todayStr);

        if (existing) {
          set((state) => ({
            sleepLogs: state.sleepLogs.map((l) =>
              l.date === todayStr ? { ...l, ...log } : l
            ),
          }));
        } else {
          const newLog: SleepLog = { ...log, id: uuidv4(), date: todayStr };
          set((state) => ({ sleepLogs: [...state.sleepLogs, newLog] }));
        }

        // Auto-check corresponding sleep tasks for today
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.createdAt === todayStr && t.category === "sleep" ? { ...t, completed: true } : t
          ),
        }));
      },

      logWorkout: (log) => {
        const todayStr = format(new Date(), "yyyy-MM-dd");
        const existing = get().workoutLogs.find((l) => l.date === todayStr);

        if (existing) {
          set((state) => ({
            workoutLogs: state.workoutLogs.map((l) =>
              l.date === todayStr ? { ...l, ...log } : l
            ),
          }));
        } else {
          const newLog: WorkoutLog = { ...log, id: uuidv4(), date: todayStr };
          set((state) => ({ workoutLogs: [...state.workoutLogs, newLog] }));
          
          // Increment Workout Goal progress
          set((state) => ({
            goals: state.goals.map((g) =>
              g.category === "workout" ? { ...g, current: Math.min(g.target, g.current + 1) } : g
            )
          }));
        }

        // Auto-check corresponding workout tasks for today
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.createdAt === todayStr && t.category === "workout" ? { ...t, completed: true } : t
          ),
        }));
      },

      logDeepWork: (log) => {
        const todayStr = format(new Date(), "yyyy-MM-dd");
        const existing = get().deepWorkLogs.find((l) => l.date === todayStr);

        if (existing) {
          set((state) => ({
            deepWorkLogs: state.deepWorkLogs.map((l) =>
              l.date === todayStr ? { ...l, ...log } : l
            ),
          }));
        } else {
          const newLog: DeepWorkLog = { ...log, id: uuidv4(), date: todayStr };
          set((state) => ({ deepWorkLogs: [...state.deepWorkLogs, newLog] }));

          // Increment Deep Work Goal progress
          set((state) => ({
            goals: state.goals.map((g) =>
              g.category === "deep-work" ? { ...g, current: Math.min(g.target, g.current + 1) } : g
            )
          }));
        }

        // Auto-check corresponding deep work tasks for today
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.createdAt === todayStr && t.category === "deep-work" ? { ...t, completed: true } : t
          ),
        }));
      },

      logMood: (log) => {
        const todayStr = format(new Date(), "yyyy-MM-dd");
        const existing = get().moodLogs.find((l) => l.date === todayStr);

        if (existing) {
          set((state) => ({
            moodLogs: state.moodLogs.map((l) =>
              l.date === todayStr ? { ...l, ...log } : l
            ),
          }));
        } else {
          const newLog: MoodLog = { ...log, id: uuidv4(), date: todayStr };
          set((state) => ({ moodLogs: [...state.moodLogs, newLog] }));
        }

        // Auto-check corresponding mood tasks for today
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.createdAt === todayStr && t.category === "mood" ? { ...t, completed: true } : t
          ),
        }));
      },

      logScreenTime: (log) => {
        const todayStr = format(new Date(), "yyyy-MM-dd");
        const existing = get().screenTimeLogs.find((l) => l.date === todayStr);

        if (existing) {
          set((state) => ({
            screenTimeLogs: state.screenTimeLogs.map((l) =>
              l.date === todayStr ? { ...l, ...log } : l
            ),
          }));
        } else {
          const newLog: ScreenTimeLog = { ...log, id: uuidv4(), date: todayStr };
          set((state) => ({ screenTimeLogs: [...state.screenTimeLogs, newLog] }));
        }

        // Auto-check screen time tasks
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.createdAt === todayStr && t.category === "screen-time" ? { ...t, completed: true } : t
          ),
        }));
      },

      logContent: (log) => {
        const todayStr = format(new Date(), "yyyy-MM-dd");
        const newLog: ContentLog = { ...log, id: uuidv4(), date: todayStr };
        set((state) => ({ contentLogs: [...state.contentLogs, newLog] }));

        // Auto-check content tasks
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.createdAt === todayStr && t.category === "content" ? { ...t, completed: true } : t
          ),
        }));
      },

      updateGoalProgress: (id, progress) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, current: progress, completed: progress >= g.target } : g
          ),
        }));
      },

      addGoal: (title, target, unit, category) => {
        const newGoal: Goal = {
          id: uuidv4(),
          title,
          target,
          current: 0,
          unit,
          category,
          completed: false,
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      // Dynamic Score Calculator based on daily completions
      getTodayScore: () => {
        const todayStr = format(new Date(), "yyyy-MM-dd");
        let score = 0;

        // 1. Task completions (max 30 points)
        const todayTasks = get().tasks.filter((t) => t.createdAt === todayStr);
        if (todayTasks.length > 0) {
          const completedTasks = todayTasks.filter((t) => t.completed).length;
          score += Math.round((completedTasks / todayTasks.length) * 30);
        } else {
          score += 30; // Free points if no tasks generated
        }

        // 2. Sleep logged and duration >= 7h (max 20 points)
        const sleep = get().sleepLogs.find((l) => l.date === todayStr);
        if (sleep) {
          score += 10; // Logged
          if (sleep.duration >= 7) score += 10; // Healthy duration
        }

        // 3. Workout logged (max 20 points)
        const workout = get().workoutLogs.find((l) => l.date === todayStr);
        if (workout) {
          score += 20;
        }

        // 4. Deep Work logged and focus score >= 7 (max 20 points)
        const deep = get().deepWorkLogs.find((l) => l.date === todayStr);
        if (deep) {
          score += 10;
          if (deep.focusScore >= 7) score += 10;
        }

        // 5. Mood logged (max 10 points)
        const mood = get().moodLogs.find((l) => l.date === todayStr);
        if (mood) {
          score += 10;
        }

        return Math.min(100, score);
      },

      // Calculate weekly averages for insights
      getWeeklyAverage: (metric) => {
        const pastWeek = Array.from({ length: 7 }).map((_, i) =>
          format(subDays(new Date(), i + 1), "yyyy-MM-dd")
        );

        let sum = 0;
        let count = 0;

        if (metric === "sleep") {
          get().sleepLogs.forEach((l) => {
            if (pastWeek.includes(l.date)) {
              sum += l.duration;
              count++;
            }
          });
        } else if (metric === "deepwork") {
          get().deepWorkLogs.forEach((l) => {
            if (pastWeek.includes(l.date)) {
              sum += l.duration;
              count++;
            }
          });
        } else if (metric === "mood") {
          get().moodLogs.forEach((l) => {
            if (pastWeek.includes(l.date)) {
              sum += l.score;
              count++;
            }
          });
        } else if (metric === "screentime") {
          get().screenTimeLogs.forEach((l) => {
            if (pastWeek.includes(l.date)) {
              sum += l.duration;
              count++;
            }
          });
        }

        return count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
      },
    }),
    {
      name: "momentum-store",
      partialize: (state) => ({
        streak: state.streak,
        tasks: state.tasks,
        sleepLogs: state.sleepLogs,
        workoutLogs: state.workoutLogs,
        deepWorkLogs: state.deepWorkLogs,
        moodLogs: state.moodLogs,
        screenTimeLogs: state.screenTimeLogs,
        contentLogs: state.contentLogs,
        goals: state.goals,
      }),
    }
  )
);
