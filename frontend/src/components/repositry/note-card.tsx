import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  Calendar,
  Sparkles,
  ListChecks,
  Download,
  Eye,
  MessageSquare,
  Trash2,
  Presentation,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PreviewModal } from "@/components/repositry/preview-modal";
import {
  deleteRepositoryNote,
  downloadRepositoryNote,
  formatUploadDate,
  type RepositoryNote,
} from "@/lib/repository";
import { useState } from "react";

function fileIcon(type?: string) {
  const t = (type ?? "").toLowerCase();
  if (t.includes("ppt")) return Presentation;
  return FileText;
}

export const NoteCard = memo(function NoteCard({
  note,
  index = 0,
  onDeleted,
}: {
  note: RepositoryNote;
  index?: number;
  onDeleted?: () => void;
}) {
  const filenameParam = note.file_name;
  const [previewOpen, setPreviewOpen] = useState(false);
  const FileIcon = fileIcon(note.file_type);

  const handleDownload = async () => {
    try {
      await downloadRepositoryNote(note);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${note.file_name}?`)) return;
    try {
      await deleteRepositoryNote(note.id);
      toast.success("Note deleted");
      onDeleted?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
        whileHover={{ y: -3 }}
        className="group glass relative flex h-full flex-col overflow-hidden rounded-2xl p-5"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-brand opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
        />

        <header className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white shadow-md shadow-indigo-500/30">
              <FileIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <Badge
                variant="outline"
                className="glass border-0 text-[10px] font-semibold uppercase tracking-wider"
              >
                {note.subject}
              </Badge>
              <div className="mt-1 truncate text-sm font-semibold text-muted-foreground">
                {note.unit}
              </div>
            </div>
          </div>
          <div className="flex gap-0.5">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 text-muted-foreground"
              onClick={() => setPreviewOpen(true)}
              aria-label={`Preview ${note.file_name}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              aria-label={`Delete ${note.file_name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="mt-4 flex items-start gap-2">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug" title={note.file_name}>
            {note.file_name}
          </h3>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatUploadDate(note.upload_date)}
          </span>
          {note.has_summary && (
            <Badge variant="secondary" className="text-[10px]">
              Summary
            </Badge>
          )}
          {note.has_mcqs && (
            <Badge variant="secondary" className="text-[10px]">
              MCQs
            </Badge>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Button asChild size="sm" variant="outline" className="glass border-0 text-xs">
            <Link to="/dashboard/summary/$filename" params={{ filename: filenameParam }}>
              <Sparkles className="h-3.5 w-3.5" />
              Summary
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="glass border-0 text-xs">
            <Link to="/dashboard/mcq/$filename" params={{ filename: filenameParam }}>
              <ListChecks className="h-3.5 w-3.5" />
              MCQs
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="glass border-0 text-xs">
            <Link to="/dashboard/chat/$filename" params={{ filename: filenameParam }}>
              <MessageSquare className="h-3.5 w-3.5" />
              Chat
            </Link>
          </Button>
          <Button
            size="sm"
            className="col-span-2 bg-gradient-brand text-xs text-white shadow-md shadow-indigo-500/30 hover:opacity-95 sm:col-span-3"
            onClick={handleDownload}
            disabled={!note.download_url}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </motion.article>

      <PreviewModal note={note} open={previewOpen} onOpenChange={setPreviewOpen} />
    </>
  );
});
