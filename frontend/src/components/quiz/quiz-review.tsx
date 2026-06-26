import { motion } from "framer-motion";
import { ArrowLeft, Check, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Quiz, QuizSubmitReview } from "@/lib/quiz";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizReview({
  quiz,
  answers,
  serverReview,
  onBack,
}: {
  quiz: Quiz;
  answers: Record<string, number | undefined>;
  serverReview?: QuizSubmitReview[] | null;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Review answers</h1>
        <Button variant="outline" size="sm" className="glass border-0" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back to results
        </Button>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((q, qi) => {
          const picked = answers[q.id];
          const server = serverReview?.[qi];
          const hasKey = server ? true : q.correctIndex >= 0;
          const isCorrect = server ? server.is_correct : hasKey && picked === q.correctIndex;
          const isWrong = server
            ? !server.is_correct && !!server.selected
            : hasKey && picked !== undefined && picked !== q.correctIndex;
          const isUnanswered = server ? !server.selected : picked === undefined;
          const explanation = server?.explanation || q.explanation;

          return (
            <motion.section
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(qi, 8) * 0.03 }}
              className="glass-strong rounded-2xl p-5 sm:p-6"
            >
              <header className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted/60 text-xs font-semibold">
                    {qi + 1}
                  </span>
                  <h3 className="text-base font-semibold leading-snug sm:text-lg">{q.question}</h3>
                </div>
                <StatusPill state={isCorrect ? "correct" : isWrong ? "wrong" : isUnanswered ? "skipped" : "unscored"} />
              </header>

              <ul className="mt-4 grid gap-2">
                {q.options.map((opt, i) => {
                  const wasPicked = picked === i;
                  const correctText = server?.correct ?? (hasKey ? q.options[q.correctIndex] : "");
                  const isAnswer = server
                    ? opt === correctText
                    : hasKey && q.correctIndex === i;
                  return (
                    <li
                      key={i}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border border-transparent p-3 text-sm",
                        isAnswer && "border-emerald-500/40 bg-emerald-500/10",
                        wasPicked && !isAnswer && "border-rose-500/40 bg-rose-500/10",
                        !wasPicked && !isAnswer && "bg-muted/30",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-semibold",
                          isAnswer
                            ? "bg-emerald-500 text-white"
                            : wasPicked
                              ? "bg-rose-500 text-white"
                              : "bg-muted/60",
                        )}
                      >
                        {isAnswer ? <Check className="h-3.5 w-3.5" /> : wasPicked ? <X className="h-3.5 w-3.5" /> : LETTERS[i]}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </li>
                  );
                })}
              </ul>

              {explanation && (
                <p className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Explanation: </span>
                  {explanation}
                </p>
              )}
              {server?.topic && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Topic: {server.topic}
                  {server.difficulty ? ` · ${server.difficulty}` : ""}
                </p>
              )}
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}

function StatusPill({ state }: { state: "correct" | "wrong" | "skipped" | "unscored" }) {
  const map = {
    correct: { label: "Correct", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", Icon: Check },
    wrong: { label: "Wrong", className: "bg-rose-500/15 text-rose-600 dark:text-rose-400", Icon: X },
    skipped: { label: "Skipped", className: "bg-muted text-muted-foreground", Icon: HelpCircle },
    unscored: { label: "Unscored", className: "bg-muted text-muted-foreground", Icon: HelpCircle },
  } as const;
  const { label, className, Icon } = map[state];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
