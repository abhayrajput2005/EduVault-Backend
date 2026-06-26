import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Trophy,
  BarChart3,
  Trash2,
  Check,
  BookOpen,
  Download,
  Brain,
  MessageSquare,
  Library,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  approveAdminUpload,
  deleteAdminUpload,
  fetchAdminAnalytics,
  fetchAdminUploads,
  fetchAdminUsers,
  type AdminAnalytics,
  type AdminUpload,
  type AdminUser,
} from "@/lib/admin";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [uploads, setUploads] = useState<AdminUpload[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const [a, u, up] = await Promise.all([
        fetchAdminAnalytics(signal),
        fetchAdminUsers(signal),
        fetchAdminUploads(signal),
      ]);
      setAnalytics(a);
      setUsers(u);
      setUploads(up);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function handleApprove(id: string) {
    try {
      await approveAdminUpload(id);
      toast.success("Upload approved");
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Approve failed");
    }
  }

  async function handleDelete(id: string, filename: string) {
    if (!window.confirm(`Delete "${filename}" permanently?`)) return;
    try {
      await deleteAdminUpload(id);
      toast.success("Upload deleted");
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const stats = [
    { label: "Total Users", value: analytics?.users ?? 0, icon: Users },
    { label: "Total Subjects", value: analytics?.total_subjects ?? 0, icon: Library },
    { label: "Total Files", value: analytics?.total_files ?? 0, icon: FileText },
    { label: "Downloads", value: analytics?.total_downloads ?? 0, icon: Download },
    { label: "Summaries", value: analytics?.summaries_generated ?? 0, icon: Brain },
    { label: "Quizzes", value: analytics?.quizzes_generated ?? 0, icon: Trophy },
    { label: "Tutor Sessions", value: analytics?.ai_tutor_sessions ?? 0, icon: MessageSquare },
    { label: "Pending Requests", value: analytics?.pending_requests ?? 0, icon: Clock },
    { label: "User Uploads", value: analytics?.uploads ?? 0, icon: CheckCircle2 },
    { label: "Quiz Attempts", value: analytics?.quiz_attempts ?? 0, icon: BarChart3 },
    { label: "Avg Quiz Score", value: `${analytics?.average_quiz_score ?? 0}%`, icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage users, review uploads, and monitor platform analytics.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link to="/admin/subject-library">
            <BookOpen className="h-4 w-4" />
            Subject Library Management
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
          : stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="mt-1 text-2xl font-bold">{s.value}</p>
                    </div>
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );
            })}
      </section>

      {!loading && analytics && (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="glass-strong rounded-2xl p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Uploads
            </h2>
            <div className="mt-3 space-y-2">
              {analytics.recent_uploads.length === 0 ? (
                <p className="text-sm text-muted-foreground">No library uploads yet.</p>
              ) : (
                analytics.recent_uploads.map((item) => (
                  <div key={item.id} className="rounded-xl border bg-background/40 p-3">
                    <div className="truncate text-sm font-medium">{item.original_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.subject_code} · {item.subject_name}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Trending Subjects
            </h2>
            <div className="mt-3 space-y-2">
              {analytics.trending_subjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No subject activity yet.</p>
              ) : (
                analytics.trending_subjects.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border bg-background/40 p-3">
                    <div className="min-w-0">
                      <div className="font-mono text-sm font-semibold">{item.subject_code}</div>
                      <div className="truncate text-xs text-muted-foreground">{item.subject_name}</div>
                    </div>
                    <Badge variant="secondary">{item.downloads} downloads</Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      <Tabs defaultValue="uploads" className="glass-strong rounded-2xl p-4 sm:p-6">
        <TabsList>
          <TabsTrigger value="uploads">Uploaded Notes</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="uploads" className="mt-4">
          {loading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AI</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(uploads ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No uploads yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (uploads ?? []).map((note) => (
                      <TableRow key={note.id}>
                        <TableCell className="max-w-[200px] truncate font-medium">
                          {note.filename}
                        </TableCell>
                        <TableCell>
                          {note.subject} · {note.unit}
                        </TableCell>
                        <TableCell>
                          <Badge variant={note.approved ? "default" : "secondary"}>
                            {note.approved ? "Approved" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {note.hasSummary && "Summary "}
                          {note.hasMcqs && "MCQs"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {!note.approved && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleApprove(note.id)}
                                aria-label="Approve"
                              >
                                <Check className="h-4 w-4 text-emerald-600" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(note.id, note.filename)}
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          {loading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(users ?? []).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name || "—"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.isAdmin ? "default" : "outline"}>
                          {user.isAdmin ? "Admin" : "Student"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
