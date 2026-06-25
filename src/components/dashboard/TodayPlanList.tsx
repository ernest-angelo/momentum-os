"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, Trash2, ArrowUpRight, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useOSStore, Task } from "@/store/useOSStore";
import { format } from "date-fns";

export function TodayPlanList() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch tasks and actions from store
  const tasks = useOSStore((state) => state.tasks);
  const toggleTask = useOSStore((state) => state.toggleTask);
  const deleteTask = useOSStore((state) => state.deleteTask);
  const addTask = useOSStore((state) => state.addTask);

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Task["category"]>("general");

  const todayStr = format(new Date(), "yyyy-MM-dd");

  if (!mounted) {
    return <div className="h-[400px] w-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl animate-pulse" />;
  }
  
  // Filter today's tasks
  const todayTasks = tasks.filter((t) => t.createdAt === todayStr);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle, newCategory);
    setNewTitle("");
  };

  const getCategoryColor = (cat: Task["category"]) => {
    switch (cat) {
      case "sleep":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "workout":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "deep-work":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "mood":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "screen-time":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "content":
        return "bg-teal-500/10 text-teal-400 border border-teal-500/20";
      default:
        return "bg-zinc-800 text-zinc-400 border border-zinc-700/50";
    }
  };

  // Maps task categories to target track routes for quick action logging
  const getQuickActionPath = (cat: Task["category"]) => {
    if (cat === "general") return null;
    return `/track/${cat}`;
  };

  return (
    <Card variant="glass" className="h-full flex flex-col min-h-[400px]">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-indigo-400" />
          <h3 className="font-display font-bold text-lg text-zinc-100">Today's Focus Plan</h3>
        </div>
        <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full text-zinc-500 font-mono">
          {todayTasks.filter(t => t.completed).length} / {todayTasks.length} Done
        </span>
      </div>

      {/* Task List */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[320px] mb-6 pr-1">
        <AnimatePresence initial={false}>
          {todayTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-zinc-500 text-sm font-medium"
            >
              No priority tasks set for today. Add one below.
            </motion.div>
          ) : (
            todayTasks.map((task) => {
              const actionPath = getQuickActionPath(task.category);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    task.completed
                      ? "bg-zinc-950/20 border-zinc-900 text-zinc-600"
                      : "bg-zinc-900/60 border-zinc-850 text-zinc-200 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Custom Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`h-5 w-5 rounded-md border flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${
                        task.completed
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    
                    <span className={`text-sm truncate font-medium ${task.completed ? "line-through" : ""}`}>
                      {task.title}
                    </span>
                  </div>

                  {/* Task category and quick actions */}
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize font-semibold ${getCategoryColor(task.category)}`}>
                      {task.category.replace("-", " ")}
                    </span>

                    {/* Quick Log Action */}
                    {!task.completed && actionPath && (
                      <button
                        onClick={() => router.push(actionPath)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 bg-indigo-500/5 hover:bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/10 cursor-pointer"
                      >
                        Log <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}

                    {/* Delete Task */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-zinc-600 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/5 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleAddTask} className="border-t border-zinc-900 pt-5 mt-auto flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new custom task..."
          className="flex-1 px-4 py-2.5 glass-input text-sm text-zinc-100 placeholder:text-zinc-600"
        />
        
        {/* Category Picker */}
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as Task["category"])}
          className="px-3 py-2.5 glass-input text-xs font-semibold text-zinc-300 font-display cursor-pointer"
        >
          <option value="general">General</option>
          <option value="deep-work">Deep Work</option>
          <option value="workout">Workout</option>
          <option value="sleep">Sleep</option>
          <option value="mood">Mood</option>
          <option value="screen-time">Screen Time</option>
          <option value="content">Content</option>
        </select>

        <Button
          type="submit"
          variant="secondary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          className="h-10"
        >
          Add
        </Button>
      </form>
    </Card>
  );
}

export default TodayPlanList;
