import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { RotateCcw, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/quiz/circular-progress";
import { performanceMessage, type Quiz, type QuizScore, type QuizSubmitReview } from "@/lib/quiz";

export function QuizResult({
  quiz,
  score,
  serverReview,
  onReview,
  onRetry,
}: {
  quiz: Quiz;
  score: QuizScore;
  serverReview?: QuizSubmitReview[] | null;
  onReview: () => void;
  onRetry: () => void;
}) {
  const displayScore = serverReview
    ? {
        ...score,
        percentage: Math.round(
          (serverReview.filter((r) => r.is_correct).length / serverReview.length) * 100,
        ),
        correct: serverReview.filter((r) => r.is_correct).length,
        scored: serverReview.length,
        wrong: serverReview.filter((r) => !r.is_correct && r.selected).length,
      }
    : score;
  const msg = performanceMessage(displayScore.percentage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10"
    >
      <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-gradient-brand opacity-20 blur-3xl" />

      <div className="flex flex-col items-center text-center">
        <span className="rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground">
          Quiz complete
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Your <span className="text-gradient-brand">results</span>
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{msg.title}</p>

        <div className="mt-8">
          <CircularProgress
            value={displayScore.percentage}
            size={180}
            stroke={14}
            label={
              <span className="text-4xl font-bold tabular-nums tracking-tight">
                {displayScore.percentage}
                <span className="text-base font-medium text-muted-foreground">%</span>
              </span>
            }
            sublabel={
              <span className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                Score
              </span>
            }
          />
        </div>

        <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-3">
          <Stat label="Score" value={`${displayScore.correct}/${displayScore.scored || displayScore.total}`} tone="brand" />
          <Stat label="Correct" value={`${displayScore.correct}`} tone="good" />
          <Stat label="Wrong" value={`${displayScore.wrong}`} tone="bad" />
        </div>

        {displayScore.unanswered > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            {displayScore.unanswered} unanswered · not counted toward your score
          </p>
        )}

        {serverReview && (
          <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Results saved to your quiz history
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button
            size="lg"
            className="bg-gradient-brand text-white shadow-md shadow-indigo-500/30 hover:opacity-95"
            onClick={onReview}
          >
            <Eye className="h-4 w-4" />
            Review Answers
          </Button>
          <Button size="lg" variant="outline" className="glass border-0" onClick={onRetry}>
            <RotateCcw className="h-4 w-4" />
            Practice Again
          </Button>
          <Button asChild size="lg" variant="outline" className="glass border-0">
            <Link to="/dashboard/repository">
              <ArrowLeft className="h-4 w-4" />
              Back to Repository
            </Link>
          </Button>
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground">
          {quiz.questions.length} questions · {quiz.estimatedMinutes} min estimated
        </p>
      </div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "brand" | "good" | "bad";
}) {
  const dot =
    tone === "good"
      ? "bg-emerald-500"
      : tone === "bad"
        ? "bg-rose-500"
        : "bg-gradient-brand";
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}
