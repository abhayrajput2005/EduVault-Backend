import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { isAuthenticated, refreshCurrentUser } from "@/services/auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      void navigate({ to: "/login", replace: true });
      return;
    }

    void refreshCurrentUser().finally(() => setSessionReady(true));
  }, [navigate]);

  if (!sessionReady) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-sm text-muted-foreground">Loading workspace…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--brand-blue)_18%,transparent),transparent_34%),radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--brand-purple)_14%,transparent),transparent_32%)]" />
      <div className="flex">
        <DashboardSidebar open={open} onClose={() => setOpen(false)} />
        <div className="min-w-0 flex-1">
          <DashboardNavbar onMenu={() => setOpen(true)} />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
