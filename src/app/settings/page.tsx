"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  User, 
  Sparkles, 
  Trash2, 
  RefreshCw, 
  ShieldAlert,
  Paintbrush
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useOSStore } from "@/store/useOSStore";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const streak = useOSStore((state) => state.streak);

  const [username, setUsername] = useState("Workspace User");
  const [email, setEmail] = useState("personal-os@momentum.io");
  const [productName, setProductName] = useState("Momentum");
  const [sleepTarget, setSleepTarget] = useState(7.5);
  const [deepWorkTarget, setDeepWorkTarget] = useState(4.0);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <span className="text-xs text-zinc-500 font-mono">Loading Settings...</span>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Configurations saved locally.");
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to clear all custom entries and reset back to pre-seeded mock templates? This will overwrite current entries.")) {
      localStorage.removeItem("momentum-store");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-900 mb-6">
        <div className="p-2.5 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-indigo-400">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-zinc-100">Settings</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Configure integrations, product defaults, and data.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card variant="glass" className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">User Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Preferred Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2.5 glass-input text-xs text-zinc-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 glass-input text-xs text-zinc-200"
              />
            </div>
          </div>
        </Card>

        {/* Branding Configuration */}
        <Card variant="glass" className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Paintbrush className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Product Repositioning</h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Rename Application (Premium SaaS Theme)</label>
              <select
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2.5 glass-input text-xs text-zinc-300 font-display cursor-pointer"
              >
                <option value="Momentum">Momentum (Recommended - Focus velocity theme)</option>
                <option value="Stride">Stride (Progress & consistent action theme)</option>
                <option value="FocusOS">FocusOS (Analytical optimization theme)</option>
                <option value="Atlas">Atlas (Personal growth mapping theme)</option>
                <option value="Pulse">Pulse (Biometric rhythm tracking theme)</option>
              </select>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">
              Note: Changing names resets local title styling across layout sidebars.
            </p>
          </div>
        </Card>

        {/* Targets Configuration */}
        <Card variant="glass" className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Base Configurations</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Daily Sleep Target (Hours)</label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="10"
                value={sleepTarget}
                onChange={(e) => setSleepTarget(parseFloat(e.target.value) || 7.5)}
                className="w-full p-2.5 glass-input text-xs text-zinc-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Daily Deep Work Target (Hours)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="8"
                value={deepWorkTarget}
                onChange={(e) => setDeepWorkTarget(parseFloat(e.target.value) || 4.0)}
                className="w-full p-2.5 glass-input text-xs text-zinc-200"
              />
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            variant="primary"
            className="text-xs py-2.5 px-6 cursor-pointer"
          >
            Save configurations
          </Button>
        </div>
      </form>

      {/* System Actions Area */}
      <Card variant="glass" className="border-t-4 border-t-rose-500/80 bg-rose-500/5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4.5 h-4.5 text-rose-400" />
          <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Danger Zone</h3>
        </div>
        
        <p className="text-xs text-zinc-400 leading-relaxed">
          Resetting database logs deletes custom tasks, sleep logs, workouts, focus scores, and goals entered since setup. Preloaded data blocks will be restored to re-populate graphs.
        </p>

        <div className="pt-2">
          <Button
            type="button"
            variant="danger"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={handleResetData}
            className="text-xs cursor-pointer"
          >
            Clear Data & Reset seeds
          </Button>
        </div>
      </Card>
    </div>
  );
}
