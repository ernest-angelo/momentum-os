"use client";

import { AICoachHero } from "@/components/dashboard/AICoachHero";
import { TodayPlanList } from "@/components/dashboard/TodayPlanList";
import { QuickStatsCard } from "@/components/dashboard/QuickStatsCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* AI Coach Suggestion Hero Card */}
      <AICoachHero />

      {/* Main Grid: Today's Plan + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <TodayPlanList />
        </div>
        <div className="lg:col-span-1">
          <QuickStatsCard />
        </div>
      </div>
    </div>
  );
}
