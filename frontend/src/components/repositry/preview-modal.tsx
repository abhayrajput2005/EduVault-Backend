import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatUploadDate, type RepositoryNote } from "@/lib/repository";

export const PreviewModal = memo(function PreviewModal({
  note,
  open,
  onOpenChange,
}: {
  note: RepositoryNote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">{note.file_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{note.subject}</Badge>
            <Badge variant="secondary">{note.unit}</Badge>
            {note.file_type && <Badge>{note.file_type}</Badge>}
          </div>
          <dl className="grid grid-cols-2 gap-3 rounded-xl bg-muted/30 p-4">
            <div>
              <dt className="text-xs text-muted-foreground">Uploaded</dt>
              <dd className="font-medium">{formatUploadDate(note.upload_date)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Quiz attempts</dt>
              <dd className="font-medium">{note.quiz_attempts ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Summary</dt>
              <dd className="font-medium">{note.has_summary ? "Ready" : "Not generated"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">MCQs</dt>
              <dd className="font-medium">{note.has_mcqs ? "Ready" : "Not generated"}</dd>
            </div>
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
});
