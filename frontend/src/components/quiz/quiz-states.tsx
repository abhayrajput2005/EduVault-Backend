import { motion } from "framer-motion";
import { AlertTriangle, FileQuestion, RefreshCw, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function QuizErrorState({
  message,
  onRetry,
  filename,
}: {
  message?: string;
  onRetry?: () => void;
  filename?: string;
}) {
  const needsSummary = message?.toLowerCase().includes("summary");
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl p-10 text-center"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-destructive/15 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Couldn't load this quiz</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {message ?? "Something went wrong while reaching the AI service."}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {onRetry && (
          <Button size="sm" className="bg-gradient-brand text-white" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>
        )}
        {needsSummary && filename && (
          <Button asChild size="sm" variant="outline" className="glass border-0">
            <Link to="/dashboard/summary/$filename" params={{ filename }}>
              Generate summary first
            </Link>
          </Button>
        )}
        <Button asChild size="sm" variant="outline" className="glass border-0">
          <Link to="/dashboard/repository">
            <ArrowLeft className="h-4 w-4" /> Back to Repository
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

export function QuizEmptyState({ filename }: { filename: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl p-10 text-center"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-indigo-500/30">
        <FileQuestion className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No quiz available yet</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        We couldn't find any MCQs for{" "}
        <span className="font-medium text-foreground">{filename}</span>. The quiz may still be
        generating or hasn't been created.
      </p>
      <Button asChild size="sm" variant="outline" className="glass mt-5 border-0">
        <Link to="/dashboard/repository">
          <ArrowLeft className="h-4 w-4" /> Back to Repository
        </Link>
      </Button>
    </motion.div>
  );
}
