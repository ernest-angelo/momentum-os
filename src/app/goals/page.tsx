"use client";

import { useState, useEffect } from "react";
import { 
  Target, 
  Plus, 
  Trophy, 
  Trash2, 
  PlusCircle, 
  MinusCircle, 
  Sparkles 
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useOSStore } from "@/store/useOSStore";

export default function GoalsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goals = useOSStore((state) => state.goals);
  const addGoal = useOSStore((state) => state.addGoal);
  const updateGoalProgress = useOSStore((state) => state.updateGoalProgress);

  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState<number>(10);
  const [newUnit, setNewUnit] = useState("sessions");
  const [newCategory, setNewCategory] = useState("deep-work");

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <span className="text-xs text-zinc-500 font-mono">Loading Goals Tracker...</span>
      </div>
    );
  }

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newTarget <= 0) return;
    addGoal(newTitle, newTarget, newUnit, newCategory);
    setNewTitle("");
    setNewTarget(10);
    setNewUnit("sessions");
  };

  const handleIncrement = (id: string, current: number, target: number) => {
    updateGoalProgress(id, Math.min(target, current + 1));
  };

  const handleDecrement = (id: string, current: number) => {
    updateGoalProgress(id, Math.max(0, current - 1));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-900 mb-6">
        <div className="p-2.5 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-indigo-400">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-zinc-100">Goals & Objectives</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Define strategic milestones and trace habit consistency.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Goals list */}
        <div className="lg:col-span-2 space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-mono text-sm">
              No active goals established yet. Add one on the right.
            </div>
          ) : (
            goals.map((goal) => {
              const isDone = goal.current >= goal.target;
              return (
                <Card 
                  key={goal.id} 
                  variant="glass" 
                  className={`p-5 border border-zinc-900 ${isDone ? "border-l-4 border-l-emerald-500 bg-emerald-500/5" : "hover:border-zinc-850"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Goal Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <Trophy className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Target className="w-4 h-4 text-indigo-400" />
                        )}
                        <h4 className={`text-sm font-bold font-display ${isDone ? "text-emerald-400" : "text-zinc-200"}`}>
                          {goal.title}
                        </h4>
                      </div>
                      
                      {/* Progress Bar */}
                      <ProgressBar
                        type="linear"
                        value={goal.current}
                        max={goal.target}
                        color={isDone ? "success" : "primary"}
                        showLabel={false}
                      />

                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span>Progress: {goal.current} / {goal.target} {goal.unit}</span>
                        <span>{Math.round((goal.current / goal.target) * 100)}% Complete</span>
                      </div>
                    </div>

                    {/* Progress Adjusters */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleDecrement(goal.id, goal.current)}
                        className="p-1 text-zinc-500 hover:text-zinc-300 active:scale-90 transition-all cursor-pointer"
                        title="Decrement progress"
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-bold font-mono text-zinc-200 min-w-8 text-center bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-lg">
                        {goal.current}
                      </span>
                      <button
                        onClick={() => handleIncrement(goal.id, goal.current, goal.target)}
                        className="p-1 text-indigo-400 hover:text-indigo-300 active:scale-90 transition-all cursor-pointer"
                        title="Increment progress"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Right 1 Column: Create Goal Form */}
        <div className="lg:col-span-1">
          <Card variant="glass" className="space-y-4">
            <h3 className="font-display font-bold text-sm text-zinc-100 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-400" /> Establish New Goal
            </h3>

            <form onSubmit={handleAddGoal} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 block">Goal Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g., Read 3 books, Run 50km..."
                  className="w-full p-2.5 glass-input text-xs text-zinc-200 placeholder:text-zinc-600"
                  required
                />
              </div>

              {/* Target & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 block">Target Value</label>
                  <input
                    type="number"
                    min="1"
                    value={newTarget}
                    onChange={(e) => setNewTarget(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 glass-input text-xs text-zinc-200"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 block">Unit</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="E.g., hours, workouts"
                    className="w-full p-2.5 glass-input text-xs text-zinc-200 placeholder:text-zinc-600"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 glass-input text-xs text-zinc-300 font-display cursor-pointer"
                >
                  <option value="deep-work">🧠 Deep Work</option>
                  <option value="workout">💪 Workout</option>
                  <option value="sleep">🌙 Sleep</option>
                  <option value="mood">😊 Mood</option>
                  <option value="general">⚙️ General</option>
                </select>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full text-xs py-2.5 cursor-pointer"
                >
                  Establish Goal
                </Button>
              </div>
            </form>
          </Card>
        </div>

      </div>
    </div>
  );
}
