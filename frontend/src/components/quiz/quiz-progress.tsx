import { motion } from "framer-motion";

export function QuizProgress({
  current,
  total,
  answered,
}: {
  current: number; // 1-based
  total: number;
  answered: number;
}) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          Question {current} <span className="text-muted-foreground">of {total}</span>
        </span>
        <span>
          {answered}/{total} answered
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/50">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-brand"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
        />
      </div>
    </div>
  );
}
