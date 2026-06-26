import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Mail, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { currentUser, logout } from "@/services/auth";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings | EduVault AI" },
      { name: "description", content: "Manage EduVault AI profile, theme, and account actions." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const user = currentUser();

  function handleLogout() {
    logout();
    void navigate({ to: "/login", replace: true });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="glass-strong rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your EduVault profile, display preference, and account actions.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <UserRound className="h-5 w-5 text-primary" />
          <h2 className="mt-3 text-lg font-semibold">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{user?.name || "Student"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{user?.email || "Not available"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-medium">{user?.isAdmin ? "Admin" : "Student"}</dd>
            </div>
          </dl>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-background/45 p-4">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>

          <h2 className="mt-6 text-lg font-semibold">Support</h2>
          <div className="mt-3 grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/help">Help Center</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/contact">
                <Mail className="h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="glass rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Logging out clears your local session token on this device.
        </p>
        <Button variant="destructive" className="mt-4" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </section>
    </div>
  );
}
