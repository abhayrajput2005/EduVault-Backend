import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import type { McqQuestion } from "@/lib/quiz";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizQuestion({
  question,
  selected,
  onSelect,
}: {
  question: McqQuestion;
  selected: number | undefined;
  onSelect: (index: number) => void;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {question.difficulty && (
              <Badge variant="outline" className="text-xs">
                {question.difficulty}
              </Badge>
            )}
            {question.topic && (
              <Badge variant="secondary" className="text-xs">
                {question.topic}
              </Badge>
            )}
          </div>
          <h2 className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
            {question.question}
          </h2>
        </div>

        <ul className="grid gap-3" role="radiogroup" aria-label="Answer options">
          {question.options.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelect(i)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-2xl border border-transparent p-4 text-left transition-all",
                    "glass hover:-translate-y-0.5",
                    isSelected &&
                      "border-transparent bg-gradient-to-br from-[color:color-mix(in_oklab,var(--brand-indigo)_18%,transparent)] to-[color:color-mix(in_oklab,var(--brand-purple)_18%,transparent)] shadow-md shadow-indigo-500/20 ring-2 ring-[color:var(--brand-indigo)]",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-semibold transition-colors",
                      isSelected
                        ? "bg-gradient-brand text-white"
                        : "bg-muted/60 text-foreground group-hover:bg-muted",
                    )}
                  >
                    {isSelected ? <Check className="h-4 w-4" /> : OPTION_LETTERS[i]}
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] leading-relaxed">{opt}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}
