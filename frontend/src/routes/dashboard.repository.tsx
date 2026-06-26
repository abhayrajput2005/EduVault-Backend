import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, FolderGit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NoteCard } from "@/components/repositry/note-card";
import { NoteCardSkeleton } from "@/components/repositry/note-card-skeleton";
import { EmptyState, ErrorState, NoResultsState } from "@/components/repositry/states";
import { fetchRepository, type RepositoryNote } from "@/lib/repository";

export const Route = createFileRoute("/dashboard/repository")({
  head: () => ({
    meta: [
      { title: "Repository · EduVault AI" },
      {
        name: "description",
        content:
          "Browse, search and filter your uploaded notes by subject and unit in the EduVault AI repository.",
      },
    ],
  }),
  component: RepositoryPage,
});

const ALL_SUBJECTS = "__all__";
const ALL_UNITS = "__all__";
const PAGE_SIZE = 8;

function RepositoryPage() {
  const [notes, setNotes] = useState<RepositoryNote[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string>(ALL_SUBJECTS);
  const [unit, setUnit] = useState<string>(ALL_UNITS);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const saved = sessionStorage.getItem("eduvault_repository_search");
    if (!saved) return;
    setQuery(saved);
    sessionStorage.removeItem("eduvault_repository_search");
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchRepository(controller.signal)
      .then((data) => setNotes(data))
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setNotes([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [reloadKey]);

  const subjects = useMemo(() => {
    if (!notes) return [];
    return Array.from(new Set(notes.map((n) => n.subject).filter(Boolean))).sort();
  }, [notes]);

  const units = useMemo(() => {
    if (!notes) return [];
    return Array.from(
      new Set(
        notes
          .filter((n) => subject === ALL_SUBJECTS || n.subject === subject)
          .map((n) => n.unit)
          .filter(Boolean),
      ),
    ).sort();
  }, [notes, subject]);

  const filtered = useMemo(() => {
    if (!notes) return [];
    const q = query.trim().toLowerCase();
    return notes.filter((n) => {
      const matchesSubject = subject === ALL_SUBJECTS || n.subject === subject;
      const matchesUnit = unit === ALL_UNITS || n.unit === unit;
      if (!matchesSubject || !matchesUnit) return false;
      if (!q) return true;
      return (
        n.subject?.toLowerCase().includes(q) ||
        n.unit?.toLowerCase().includes(q) ||
        n.file_name?.toLowerCase().includes(q)
      );
    });
  }, [notes, query, subject, unit]);

  useEffect(() => {
    setPage(1);
  }, [query, subject, unit]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageNotes = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const retry = () => setReloadKey((k) => k + 1);

  return (
    <div className="space-y-6">
      <Header total={notes?.length ?? null} />

      <Toolbar
        query={query}
        onQuery={setQuery}
        subject={subject}
        onSubject={(value) => {
          setSubject(value);
          setUnit(ALL_UNITS);
        }}
        subjects={subjects}
        unit={unit}
        onUnit={setUnit}
        units={units}
        disabled={loading || !!error}
      />

      <section
        aria-live="polite"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`sk-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <NoteCardSkeleton />
              </motion.div>
            ))
          ) : error ? (
            <ErrorState key="error" message={error} onRetry={retry} />
          ) : (notes?.length ?? 0) === 0 ? (
            <EmptyState key="empty" onRetry={retry} />
          ) : filtered.length === 0 ? (
            <NoResultsState key="no-results" query={query} />
          ) : (
            pageNotes.map((note, i) => (
              <NoteCard
                key={String(note.id ?? `${note.subject}-${note.file_name}-${i}`)}
                note={note}
                index={(page - 1) * PAGE_SIZE + i}
                onDeleted={retry}
              />
            ))
          )}
        </AnimatePresence>
      </section>

      {!loading && !error && filtered.length > PAGE_SIZE && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function Header({ total }: { total: number | null }) {
  return (
    <div className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-indigo-500/30">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Repository</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your knowledge vault — search, filter and study every note in one place.
            </p>
          </div>
        </div>
        {total !== null && (
          <Badge variant="outline" className="glass w-fit border-0 text-xs font-medium">
            {total} {total === 1 ? "note" : "notes"}
          </Badge>
        )}
      </div>
    </div>
  );
}

function Toolbar({
  query,
  onQuery,
  subject,
  onSubject,
  subjects,
  unit,
  onUnit,
  units,
  disabled,
}: {
  query: string;
  onQuery: (v: string) => void;
  subject: string;
  onSubject: (v: string) => void;
  subjects: string[];
  unit: string;
  onUnit: (v: string) => void;
  units: string[];
  disabled: boolean;
}) {
  return (
    <div className="glass-strong grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-3 sm:flex sm:flex-wrap">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search by subject, unit or file name…"
          className="h-10 border-0 bg-background/40 pl-9 focus-visible:ring-1"
          disabled={disabled && !query}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <SlidersHorizontal className="hidden h-4 w-4 text-muted-foreground sm:block" />
        <Select value={subject} onValueChange={onSubject} disabled={disabled || subjects.length === 0}>
          <SelectTrigger className="h-10 min-w-[10rem] border-0 bg-background/40">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_SUBJECTS}>All subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={unit} onValueChange={onUnit} disabled={disabled || units.length === 0}>
          <SelectTrigger className="h-10 min-w-[8rem] border-0 bg-background/40">
            <SelectValue placeholder="All units" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_UNITS}>All units</SelectItem>
            {units.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
