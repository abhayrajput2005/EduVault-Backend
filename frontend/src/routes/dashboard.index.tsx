import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, memo } from "react";
import {
  BookOpenCheck,
  FileText,
  HelpCircle,
  Library,
  ListChecks,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAnalytics, type UserAnalytics } from "@/lib/analytics";
import { currentUser } from "@/services/auth";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const user = currentUser();

  useEffect(() => {
    const controller = new AbortController();
    fetchAnalytics(controller.signal)
      .then(setAnalytics)
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name !== "AbortError") {
          setError(err instanceof Error ? err.message : "Unable to load dashboard");
        }
      });
    return () => controller.abort();
  }, []);

  const recent = analytics?.recent_uploads ?? [];

  const stats = useMemo(
    () => [
      { label: "Files Uploaded", value: analytics?.files_uploaded ?? 0, icon: FileText },
      {
        label: "Summaries Generated",
        value: analytics?.summaries_generated ?? 0,
        icon: Sparkles,
      },
      { label: "MCQs Generated", value: analytics?.mcqs_generated ?? 0, icon: ListChecks },
      { label: "Quiz Attempts", value: analytics?.quiz_attempts ?? 0, icon: BookOpenCheck },
      {
        label: "Average Quiz Score",
        value: `${analytics?.average_quiz_score ?? 0}%`,
        icon: TrendingUp,
      },
    ],
    [analytics],
  );

  const weeklyActivity = useMemo(() => {
    const days = analytics?.activity ?? [];
    return days.slice(-7).map((d) => ({
      ...d,
      label: new Date(d.date).toLocaleDateString(undefined, { weekday: "short" }),
    }));
  }, [analytics]);

  return (
    <div className="space-y-6">
      <section className="glass-strong overflow-hidden rounded-2xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Welcome back</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              {user?.name || user?.email || "Student"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Upload notes, generate study material, and jump back into your latest files.
            </p>
          </div>
          <Button asChild className="w-fit bg-gradient-brand text-white shadow-lg shadow-indigo-500/30">
            <Link to="/upload">
              <Plus className="h-4 w-4" />
              Upload notes
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {analytics === null && !error
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          : stats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
            ))}
      </section>

      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="glass-strong rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent uploads</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard/repository">View all</Link>
            </Button>
          </div>
          {analytics === null ? (
            <Skeleton className="h-40 rounded-xl" />
          ) : recent.length === 0 ? (
            <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
              No uploads yet. Add your first PDF or presentation to start studying.
            </p>
          ) : (
            <div className="divide-y">
              {recent.map((note) => (
                <div key={note.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{note.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[note.subject, note.unit, note.file_type].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/dashboard/summary/$filename" params={{ filename: note.file_name }}>
                      Summary
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Weekly activity</h2>
            {analytics === null ? (
              <Skeleton className="mt-4 h-48 rounded-xl" />
            ) : weeklyActivity.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No activity yet this week.</p>
            ) : (
              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="uploads" name="Uploads" fill="var(--brand-indigo)" radius={4} />
                    <Bar dataKey="quizzes" name="Quizzes" fill="var(--brand-purple)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="glass-strong rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Quick actions</h2>
            <div className="mt-4 grid gap-3">
              <Action to="/upload" icon={Plus} label="Upload new notes" />
              <Action to="/dashboard/repository" icon={Library} label="Browse repository" />
              <Action to="/dashboard/repository" icon={HelpCircle} label="Start a quiz" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const StatCard = memo(function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof FileText;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
});

function Action({ to, icon: Icon, label }: { to: string; icon: typeof Plus; label: string }) {
  return (
    <Button asChild variant="outline" className="justify-start">
      <Link to={to}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}
