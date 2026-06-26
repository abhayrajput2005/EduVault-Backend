import { FolderOpen, RefreshCw, AlertTriangle, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "No notes in your repository yet",
  description = "When notes are uploaded, they'll appear here organized by subject and unit.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong col-span-full mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl p-10 text-center"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-indigo-500/30">
        <FolderOpen className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="glass mt-5 border-0" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      )}
    </motion.div>
  );
}

export function NoResultsState({ query }: { query: string }) {
  return (
    <div className="glass col-span-full mx-auto flex w-full max-w-md flex-col items-center rounded-2xl p-8 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted/60">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="mt-3 font-semibold">No matches found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Nothing in your repository matches{" "}
        <span className="font-medium text-foreground">"{query}"</span>.
      </p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong col-span-full mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl p-10 text-center"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-destructive/15 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Couldn't load your repository</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {message ?? "Something went wrong while reaching the server."}
      </p>
      {onRetry && (
        <Button size="sm" className="mt-5 bg-gradient-brand text-white" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" /> Try again
        </Button>
      )}
    </motion.div>
  );
}
