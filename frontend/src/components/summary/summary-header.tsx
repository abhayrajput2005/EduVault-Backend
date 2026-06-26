import { motion } from "framer-motion";
import { Check, Copy, Download, Printer, ArrowLeft, ListChecks, RotateCcw, FileDown } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SummaryHeader({
  filename,
  subject,
  unit,
  onCopy,
  onDownload,
  onDownloadPdf,
  onPrint,
  onRegenerate,
  regenerating,
  actionsDisabled,
}: {
  filename: string;
  subject?: string;
  unit?: string;
  onCopy: () => Promise<boolean> | boolean;
  onDownload: () => void;
  onDownloadPdf?: () => void;
  onPrint: () => void;
  onRegenerate?: () => void;
  regenerating?: boolean;
  actionsDisabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await onCopy();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl" />

      <div className="flex flex-col gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {subject && (
              <Badge className="bg-gradient-brand border-0 text-[10px] font-semibold uppercase tracking-wider text-white">
                {subject}
              </Badge>
            )}
            {unit && (
              <Badge variant="outline" className="glass border-0 text-xs font-medium">
                {unit}
              </Badge>
            )}
          </div>
          <h1
            className="mt-3 break-words text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
            title={filename}
          >
            {filename}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            AI-generated summary · review, copy, download, or print for offline study.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 print:hidden">
          <Button asChild variant="outline" size="sm" className="glass border-0">
            <Link to="/dashboard/repository">
              <ArrowLeft className="h-4 w-4" />
              Back to Repository
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-gradient-brand text-white shadow-md shadow-indigo-500/30 hover:opacity-95"
          >
            <Link
              to="/dashboard/quiz/$filename"
              params={{ filename }}
              aria-label={`Practice MCQs for ${filename}`}
            >
              <ListChecks className="h-4 w-4" />
              Practice MCQs
            </Link>
          </Button>

          <div className="ml-auto flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="glass border-0"
              onClick={handleCopy}
              disabled={actionsDisabled}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy Summary
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="glass border-0"
              onClick={onDownload}
              disabled={actionsDisabled}
            >
              <Download className="h-4 w-4" /> Download TXT
            </Button>
            {onDownloadPdf && (
              <Button
                size="sm"
                variant="outline"
                className="glass border-0"
                onClick={onDownloadPdf}
                disabled={actionsDisabled}
              >
                <FileDown className="h-4 w-4" /> Download PDF
              </Button>
            )}
            {onRegenerate && (
              <Button
                size="sm"
                variant="outline"
                className="glass border-0"
                onClick={onRegenerate}
                disabled={actionsDisabled || regenerating}
              >
                <RotateCcw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
                Regenerate
              </Button>
            )}
            <Button
              size="sm"
              className="bg-gradient-brand text-white shadow-md shadow-indigo-500/30 hover:opacity-95"
              onClick={onPrint}
              disabled={actionsDisabled}
            >
              <Printer className="h-4 w-4" /> Print
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
