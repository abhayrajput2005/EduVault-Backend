import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { isAuthenticated, isAdmin, refreshCurrentUser } from "@/services/auth";
import { fetchAdminAnalytics } from "@/lib/admin";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      void navigate({ to: "/login", replace: true });
      return;
    }

    const controller = new AbortController();

    void refreshCurrentUser()
      .then(() => {
        if (!isAdmin()) {
          toast.error("Admin access required");
          void navigate({ to: "/dashboard", replace: true });
          return;
        }

        return fetchAdminAnalytics(controller.signal)
          .then(() => setVerified(true))
          .catch((err: unknown) => {
            toast.error(err instanceof Error ? err.message : "Admin access denied");
            void navigate({ to: "/dashboard", replace: true });
          });
      })
      .catch(() => {
        void navigate({ to: "/login", replace: true });
      });

    return () => controller.abort();
  }, [navigate]);

  if (verified === null) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-sm text-muted-foreground">Verifying admin access…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--brand-blue)_18%,transparent),transparent_34%)]" />
      <header className="border-b border-border/60 bg-card/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo to="/admin" />
            <span className="hidden items-center gap-1.5 rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-white sm:inline-flex">
              <Shield className="h-3.5 w-3.5" />
              Admin
            </span>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to App
            </Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
