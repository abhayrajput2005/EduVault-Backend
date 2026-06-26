import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Flag, Timer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Breadcrumbs } from "@/components/summary/breadcrumbs";
import { Confetti } from "@/components/quiz/confetti";
import { QuizStart } from "@/components/quiz/quiz-start";
import { QuizQuestion } from "@/components/quiz/quiz-question";
import { QuizProgress } from "@/components/quiz/quiz-progress";
import { QuizResult } from "@/components/quiz/quiz-result";
import { QuizReview } from "@/components/quiz/quiz-review";
import { QuizSkeleton } from "@/components/quiz/quiz-skeleton";
import { QuizEmptyState, QuizErrorState } from "@/components/quiz/quiz-states";
import {
  fetchQuiz,
  scoreQuiz,
  submitQuiz,
  type Quiz,
  type QuizSubmitReview,
} from "@/lib/quiz";

type Phase = "start" | "questions" | "result" | "review";

export const Route = createFileRoute("/dashboard/quiz/$filename")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.filename} · Practice Quiz · EduVault AI` },
      {
        name: "description",
        content: `AI-generated practice quiz with multiple-choice questions for ${params.filename}.`,
      },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { filename } = Route.useParams();
  const decoded = safeDecode(filename);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [phase, setPhase] = useState<Phase>("start");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [serverReview, setServerReview] = useState<QuizSubmitReview[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setQuiz(null);
    setAnswers({});
    setCurrent(0);
    setPhase("start");
    setServerReview(null);

    fetchQuiz(decoded, controller.signal)
      .then((q) => setQuiz(q))
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [decoded, reloadKey]);

  const retry = () => setReloadKey((k) => k + 1);

  const score = useMemo(
    () => (quiz ? scoreQuiz(quiz, answers) : null),
    [quiz, answers],
  );

  const total = quiz?.questions.length ?? 0;
  const answeredCount = Object.values(answers).filter((v) => v !== undefined).length;
  const isLast = current === total - 1;
  const question = quiz?.questions[current];
  const timerMinutes = quiz?.estimatedMinutes ?? 10;

  const finish = useCallback(async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const answerTexts = quiz.questions.map((q) => {
      const idx = answers[q.id];
      return idx !== undefined ? q.options[idx] ?? "" : "";
    });

    const duration = startedAtRef.current
      ? Math.round((Date.now() - startedAtRef.current) / 1000)
      : undefined;

    try {
      const result = await submitQuiz({
        filename: decoded,
        answers: answerTexts,
        duration_seconds: duration,
      });
      setServerReview(result.review);
      setShowConfetti(result.percentage >= 60);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save quiz results");
    } finally {
      setSubmitting(false);
      setPhase("result");
    }
  }, [quiz, answers, decoded, submitting]);

  useEffect(() => {
    if (phase !== "questions") return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          void finish();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, finish]);

  const select = useCallback(
    (idx: number) => {
      if (!question) return;
      setAnswers((a) => ({ ...a, [question.id]: idx }));
    },
    [question],
  );

  const goPrev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const goNext = useCallback(
    () => setCurrent((c) => Math.min(total - 1, c + 1)),
    [total],
  );

  useEffect(() => {
    if (phase !== "questions" || !question) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key >= "1" && e.key <= "9") {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < question.options.length) {
          e.preventDefault();
          select(idx);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (!isLast) goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (isLast) void finish();
        else goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, question, isLast, select, goNext, goPrev, finish]);

  function startQuiz() {
    setAnswers({});
    setCurrent(0);
    setServerReview(null);
    setShowConfetti(false);
    startedAtRef.current = Date.now();
    setSecondsLeft(timerMinutes * 60);
    setPhase("questions");
  }

  const timerPct = timerMinutes > 0 ? (secondsLeft / (timerMinutes * 60)) * 100 : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Confetti active={showConfetti} />
      <Breadcrumbs
        items={[
          { label: "Repository", to: "/dashboard/repository" },
          { label: `Quiz · ${decoded}` },
        ]}
      />

      {loading ? (
        <QuizSkeleton />
      ) : error ? (
        <QuizErrorState message={error} onRetry={retry} filename={decoded} />
      ) : !quiz || quiz.questions.length === 0 ? (
        <QuizEmptyState filename={decoded} />
      ) : phase === "start" ? (
        <QuizStart quiz={quiz} onStart={startQuiz} />
      ) : phase === "result" && score ? (
        <QuizResult
          quiz={quiz}
          score={score}
          serverReview={serverReview}
          onReview={() => setPhase("review")}
          onRetry={() => startQuiz()}
        />
      ) : phase === "review" ? (
        <QuizReview
          quiz={quiz}
          answers={answers}
          serverReview={serverReview}
          onBack={() => setPhase("result")}
        />
      ) : (
        question && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong space-y-7 rounded-3xl p-6 sm:p-8"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  {formatTime(secondsLeft)} remaining
                </span>
                <span className="text-xs text-muted-foreground">Auto-submit when time runs out</span>
              </div>
              <Progress value={timerPct} className="h-2" />
            </div>

            <QuizProgress current={current + 1} total={total} answered={answeredCount} />
            <QuizQuestion
              question={question}
              selected={answers[question.id]}
              onSelect={select}
            />

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-5">
              <Button
                variant="outline"
                className="glass border-0"
                onClick={goPrev}
                disabled={current === 0}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <span className="hidden text-xs text-muted-foreground sm:block">
                {answers[question.id] === undefined ? "Pick an option to continue" : "Answer saved"}
              </span>

              {isLast ? (
                <Button
                  className="bg-gradient-brand text-white shadow-md shadow-indigo-500/30 hover:opacity-95"
                  onClick={() => void finish()}
                  disabled={submitting}
                >
                  <Flag className="h-4 w-4" />
                  {submitting ? "Submitting…" : "Finish Quiz"}
                </Button>
              ) : (
                <Button
                  className="bg-gradient-brand text-white shadow-md shadow-indigo-500/30 hover:opacity-95"
                  onClick={goNext}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}
