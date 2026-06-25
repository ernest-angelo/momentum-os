"use client";

import { useState, useEffect } from "react";
import { 
  CalendarRange, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sun, 
  Sunset, 
  Moon, 
  Sparkles, 
  Brain,
  Dumbbell
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useOSStore } from "@/store/useOSStore";
import { format } from "date-fns";

export default function PlanPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tasks = useOSStore((state) => state.tasks);
  const toggleTask = useOSStore((state) => state.toggleTask);
  const addTask = useOSStore((state) => state.addTask);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayTasks = tasks.filter((t) => t.createdAt === todayStr);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [priorities, setPriorities] = useState<string[]>([
    "Complete Q3 Product Architecture Doc",
    "60-minute Strength Session (Pull focus)",
    "Restrict blue-light exposure post 9:30 PM",
  ]);
  const [editingPriorityIdx, setEditingPriorityIdx] = useState<number | null>(null);
  const [priorityInput, setPriorityInput] = useState("");

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <span className="text-xs text-zinc-500 font-mono">Loading Scheduler...</span>
      </div>
    );
  }

  const timeBlocks = [
    { time: "07:00 AM - 09:00 AM", title: "Morning Routine & Reading", category: "Routine", icon: Sun, color: "text-amber-400 bg-amber-500/5 border-amber-500/10" },
    { time: "09:00 AM - 12:00 PM", title: "Core Deep Work Block (Uninterrupted)", category: "Deep Work", icon: Brain, color: "text-purple-400 bg-purple-500/5 border-purple-500/10" },
    { time: "01:30 PM - 03:00 PM", title: "Collaborative Work & Emails", category: "Admin", icon: Clock, color: "text-blue-400 bg-blue-500/5 border-blue-500/10" },
    { time: "05:00 PM - 06:30 PM", title: "Fitness Training & Recovery", category: "Workout", icon: Dumbbell, customIcon: "💪", color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" },
    { time: "09:00 PM - 10:00 PM", title: "Evening Reflection & Reading", category: "Routine", icon: Moon, color: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10" },
  ];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle, "general");
    setNewTaskTitle("");
  };

  const handleUpdatePriority = (idx: number) => {
    if (!priorityInput.trim()) return;
    const updated = [...priorities];
    updated[idx] = priorityInput;
    setPriorities(updated);
    setEditingPriorityIdx(null);
    setPriorityInput("");
  };

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left 2 Columns: Time Blocks & Scheduler */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass" className="h-full flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
              <div className="flex items-center gap-2">
                <CalendarRange className="w-5 h-5 text-indigo-400" />
                <h3 className="font-display font-bold text-lg text-zinc-100">Time Blocking Scheduler</h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Today's Schedule</span>
            </div>

            {/* Timeline */}
            <div className="flex-1 space-y-4 relative pl-4 border-l border-zinc-800/80 ml-2">
              {timeBlocks.map((block, idx) => {
                const Icon = block.icon;
                return (
                  <motion.div
                    key={block.time}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="group relative flex items-start gap-4"
                  >
                    {/* Circle Node Indicator */}
                    <div className="absolute -left-[25px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-zinc-850 bg-background group-hover:border-indigo-500 transition-colors flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-700 group-hover:bg-indigo-500" />
                    </div>

                    {/* Time block detail */}
                    <div className="flex-1 p-4 rounded-2xl border border-zinc-900 bg-zinc-950/20 hover:border-zinc-850 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-zinc-500 font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-zinc-600" />
                          {block.time}
                        </div>
                        <h4 className="text-sm font-bold font-display text-zinc-200 mt-1">{block.title}</h4>
                      </div>
                      
                      {/* Tag */}
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${block.color} self-start sm:self-auto flex items-center gap-1.5`}>
                        {block.customIcon ? (
                          <span className="mr-0.5">{block.customIcon}</span>
                        ) : (
                          <Icon className="w-3 h-3" />
                        )}
                        {block.category}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right 1 Column: Strategic Priorities & Custom Checklist */}
        <div className="lg:col-span-1 space-y-6">
          {/* Priorities Card */}
          <Card variant="glass" className="border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-500/5 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400 fill-indigo-500/10" />
              <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Top 3 Focus Pillars</h3>
            </div>
            
            <div className="space-y-3.5">
              {priorities.map((priority, idx) => (
                <div key={idx} className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-xl text-xs relative group flex justify-between items-center gap-2">
                  {editingPriorityIdx === idx ? (
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        value={priorityInput}
                        onChange={(e) => setPriorityInput(e.target.value)}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdatePriority(idx)}
                        className="text-indigo-400 font-bold hover:text-indigo-300 cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2.5 items-start">
                        <span className="font-mono text-zinc-600 font-bold">{idx + 1}.</span>
                        <span className="text-zinc-300 font-medium leading-relaxed">{priority}</span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingPriorityIdx(idx);
                          setPriorityInput(priority);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-opacity"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Core Plan Checklist Box */}
          <Card variant="glass" className="space-y-4">
            <h3 className="font-display font-bold text-sm text-zinc-100">Tasks Checklist</h3>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {todayTasks.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className="flex items-center gap-2.5 text-xs text-zinc-300 hover:text-zinc-100 cursor-pointer group py-1"
                >
                  {t.completed ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4.5 h-4.5 text-zinc-650 group-hover:text-zinc-400 flex-shrink-0" />
                  )}
                  <span className={`truncate ${t.completed ? "line-through text-zinc-600" : ""}`}>{t.title}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2 pt-2 border-t border-zinc-900">
              <input
                type="text"
                placeholder="Add custom task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-800"
              />
              <button 
                type="submit"
                className="h-8 w-8 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center hover:text-white cursor-pointer active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </Card>
        </div>

      </div>
    </div>
  );
}
