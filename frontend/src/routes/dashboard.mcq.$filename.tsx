import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Copy,
  Check,
  ListChecks,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/summary/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuizSkeleton } from "@/components/quiz/quiz-skeleton";
import { QuizEmptyState, QuizErrorState } from "@/components/quiz/quiz-states";
import { fetchQuiz, type McqQuestion } from "@/lib/quiz";

const BOOKMARK_KEY = "eduvault_mcq_bookmarks";

export const Route = createFileRoute("/dashboard/mcq/$filename")({
  component: McqBrowsePage,
});

function McqBrowsePage() {
  const { filename } = Route.useParams();
  const decoded = safeDecode(filename);

  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [meta, setMeta] = useState<{ subject?: string; unit?: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => loadBookmarks());
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchQuiz(decoded, controller.signal)
      .then((quiz) => {
        setQuestions(quiz.questions);
        setMeta({ subject: quiz.subject, unit: quiz.unit });
        setCurrent(0);
      })
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [decoded, reloadKey]);

  const q = questions[current];
  const isBookmarked = q ? bookmarks.has(q.id) : false;

  const toggleBookmark = useCallback(() => {
    if (!q) return;
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(q.id)) next.delete(q.id);
      else next.add(q.id);
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify([...next]));
      return next;
    });
  }, [q]);

  async function copyQuestion() {
    if (!q) return;
    const text = `${q.question}\n\n${q.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join("\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Question copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  }

  const difficultyColor = useMemo(() => {
    const d = q?.difficulty?.toLowerCase() ?? "";
    if (d.includes("hard")) return "destructive";
    if (d.includes("easy")) return "secondary";
    return "outline";
  }, [q?.difficulty]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumbs
        items={[
          { label: "Repository", to: "/dashboard/repository" },
          { label: `MCQs · ${decoded}` },
        ]}
      />

      {loading ? (
        <QuizSkeleton />
      ) : error ? (
        <QuizErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} filename={decoded} />
      ) : questions.length === 0 ? (
        <QuizEmptyState filename={decoded} />
      ) : (
        q && (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong space-y-6 rounded-3xl p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {meta.subject && <Badge className="bg-gradient-brand border-0 text-white">{meta.subject}</Badge>}
                {meta.unit && <Badge variant="outline">{meta.unit}</Badge>}
                {q.difficulty && <Badge variant={difficultyColor}>{q.difficulty}</Badge>}
                {q.topic && <Badge variant="secondary">{q.topic}</Badge>}
              </div>
              <span className="text-sm text-muted-foreground">
                {current + 1} / {questions.length}
              </span>
            </div>

            <h2 className="text-xl font-semibold leading-snug sm:text-2xl">{q.question}</h2>

            <ul className="grid gap-2">
              {q.options.map((opt, i) => (
                <li
                  key={i}
                  className="glass rounded-xl px-4 py-3 text-[15px] leading-relaxed"
                >
                  <span className="mr-2 font-semibold text-muted-foreground">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </li>
              ))}
            </ul>

            {q.explanation && (
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Explanation
                </p>
                <p className="mt-2 text-sm leading-relaxed">{q.explanation}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-5">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyQuestion}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={toggleBookmark}>
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current text-amber-500" : ""}`} />
                  {isBookmarked ? "Saved" : "Bookmark"}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  disabled={current === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  className="bg-gradient-brand text-white"
                  onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                  disabled={current === questions.length - 1}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/quiz/$filename" params={{ filename: decoded }}>
                <ListChecks className="h-4 w-4" />
                Start Practice Quiz
              </Link>
            </Button>
          </motion.div>
        )
      )}
    </div>
  );
}

function loadBookmarks(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}
