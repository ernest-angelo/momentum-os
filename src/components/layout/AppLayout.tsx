"use client";

import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Header } from "./Header";
import { useOSStore } from "@/store/useOSStore";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const generateTasks = useOSStore((state) => state.generateDefaultTasks);

  // Auto-generate today's standard tasks on mount
  useEffect(() => {
    generateTasks();
  }, [generateTasks]);

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative pb-20 md:pb-0">
        {/* Background glow orbs for premium aesthetics */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] radial-glow opacity-30 z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-[200px] w-[600px] h-[600px] radial-glow opacity-20 z-0 pointer-events-none" />

        {/* Global Page Header */}
        <Header />

        {/* Render child pages */}
        <main className="flex-1 p-6 md:p-8 z-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Tab Bar (hidden on desktop) */}
      <MobileNav />
    </div>
  );
}
export default AppLayout;
