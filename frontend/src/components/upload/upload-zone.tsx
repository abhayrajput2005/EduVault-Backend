import { useMemo, useRef, useState } from "react";
import { CheckCircle2, FileUp, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { uploadNote } from "@/services/upload";
import { cn } from "@/lib/utils";

const allowed = [".pdf", ".ppt", ".pptx"];

export default function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileError = useMemo(() => {
    if (!file) return null;
    const lower = file.name.toLowerCase();
    if (!allowed.some((ext) => lower.endsWith(ext))) return "Upload a PDF, PPT, or PPTX file.";
    if (file.size > 25 * 1024 * 1024) return "File must be 25 MB or smaller.";
    return null;
  }, [file]);

  function pick(next: File | null) {
    setFile(next);
    setProgress(0);
  }

  async function submit() {
    if (!file) {
      toast.error("Choose a file first");
      return;
    }
    if (fileError) {
      toast.error(fileError);
      return;
    }
    if (!subject.trim() || !unit.trim()) {
      toast.error("Subject and unit are required");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("subject", subject.trim());
    form.append("unit", unit.trim());

    try {
      setLoading(true);
      setProgress(35);
      const timer = window.setInterval(() => {
        setProgress((p) => Math.min(p + 12, 88));
      }, 250);
      const data = await uploadNote(form);
      window.clearInterval(timer);
      setProgress(100);
      toast.success(data.message || "Upload successful");
      pick(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setProgress(0);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Data Structures"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            placeholder="Unit 1"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>
      </div>

      <div
        className={cn(
          "mt-5 grid min-h-64 place-items-center rounded-2xl border border-dashed p-6 text-center transition-colors",
          dragging ? "border-primary bg-primary/10" : "border-border bg-background/35",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files?.[0] ?? null);
        }}
      >
        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".pdf,.ppt,.pptx"
          onChange={(e) => pick(e.target.files?.[0] ?? null)}
        />

        <div className="max-w-md">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white">
            <UploadCloud className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Drop your notes here</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            PDF, PPT, and PPTX files up to 25 MB are supported.
          </p>

          {file && (
            <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-background/60 p-3 text-left">
              <div className="flex min-w-0 items-center gap-3">
                <FileUp className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className={cn("text-xs", fileError ? "text-destructive" : "text-muted-foreground")}>
                    {fileError || `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => pick(null)} aria-label="Remove file">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {loading && <Progress value={progress} className="mt-5" />}

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => inputRef.current?.click()} disabled={loading}>
              <FileUp className="h-4 w-4" />
              Choose file
            </Button>
            <Button onClick={submit} disabled={loading || !!fileError} className="bg-gradient-brand text-white">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
