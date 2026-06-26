import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Play, Clock, ListOrdered, ArrowLeft, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Quiz } from "@/lib/quiz";

export function QuizStart({ quiz, onStart }: { quiz: Quiz; onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-brand opacity-25 blur-3xl" />

      <div className="flex flex-col items-start gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {quiz.subject && (
            <Badge className="bg-gradient-brand border-0 text-[10px] font-semibold uppercase tracking-wider text-white">
              {quiz.subject}
            </Badge>
          )}
          {quiz.unit && (
            <Badge variant="outline" className="glass border-0 text-xs font-medium">
              {quiz.unit}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Practice <span className="text-gradient-brand">Quiz</span>
        </h1>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <FileText className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="break-words" title={quiz.filename}>
            {quiz.filename}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Stat
          icon={<ListOrdered className="h-4 w-4" />}
          label="Questions"
          value={`${quiz.questions.length}`}
        />
        <Stat
          icon={<Clock className="h-4 w-4" />}
          label="Estimated time"
          value={`${quiz.estimatedMinutes} min`}
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          size="lg"
          className="bg-gradient-brand text-white shadow-lg shadow-indigo-500/30 hover:opacity-95"
          onClick={onStart}
        >
          <Play className="h-4 w-4" />
          Start Practice
        </Button>
        <Button asChild size="lg" variant="outline" className="glass border-0">
          <Link to="/dashboard/repository">
            <ArrowLeft className="h-4 w-4" />
            Back to Repository
          </Link>
        </Button>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Tip: use <Kbd>1-4</Kbd> to select an option, <Kbd>←</Kbd> / <Kbd>→</Kbd> to navigate, and{" "}
        <Kbd>Enter</Kbd> to continue.
      </p>
    </motion.div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-foreground">
      {children}
    </kbd>
  );
}
