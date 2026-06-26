import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, KeyRound, BookOpen } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/summary/breadcrumbs";
import { SummaryHeader } from "@/components/summary/summary-header";
import { SectionCard } from "@/components/summary/section-card";
import { SummarySkeleton } from "@/components/summary/summary-skeleton";
import { SummaryErrorState, SummaryEmptyState } from "@/components/summary/summary-states";
import { MarkdownContent } from "@/components/shared/markdown-content";
import { fetchSummary, summaryToPlainText, type AiSummary } from "@/lib/summary";

export const Route = createFileRoute("/dashboard/summary/$filename")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.filename} · AI Summary · EduVault AI` },
      {
        name: "description",
        content: `AI-generated summary, key points and important topics for ${params.filename}.`,
      },
    ],
  }),
  component: SummaryPage,
});

function SummaryPage() {
  const { filename } = Route.useParams();
  const decoded = safeDecode(filename);

  const [data, setData] = useState<AiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const loadSummary = useCallback(
    async (regenerate: boolean, signal?: AbortSignal) => {
      if (regenerate) setRegenerating(true);
      else {
        setLoading(true);
        setData(null);
      }
      setError(null);

      try {
        const s = await fetchSummary(decoded, signal, regenerate);
        setData(s);
        if (regenerate) toast.success("Summary regenerated");
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
        setRegenerating(false);
      }
    },
    [decoded],
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadSummary(false, controller.signal);
    return () => controller.abort();
  }, [decoded, reloadKey, loadSummary]);

  const retry = () => setReloadKey((k) => k + 1);
  const regenerate = () => void loadSummary(true);

  const isEmpty =
    !!data &&
    data.summary.length === 0 &&
    !data.summary_markdown &&
    data.key_points.length === 0 &&
    data.important_topics.length === 0;

  async function handleCopy() {
    if (!data) return false;
    try {
      await navigator.clipboard.writeText(summaryToPlainText(data));
      return true;
    } catch {
      return false;
    }
  }

  function handleDownload() {
    if (!data) return;
    const blob = new Blob([summaryToPlainText(data)], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `${stripExt(data.filename)}-summary.txt`);
  }

  function handleDownloadPdf() {
    if (!data) return;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(summaryToPlainText(data), 180);
    doc.setFontSize(12);
    doc.text(lines, 14, 20);
    doc.save(`${stripExt(data.filename)}-summary.pdf`);
  }

  function handlePrint() {
    window.print();
  }

  const markdownContent =
    data?.summary_markdown || (data?.summary.length ? data.summary.join("\n\n") : "");

  return (
    <div className="mx-auto max-w-4xl space-y-6 print:max-w-none print:space-y-4">
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Repository", to: "/dashboard/repository" },
            { label: decoded },
          ]}
        />
      </div>

      {loading ? (
        <SummarySkeleton />
      ) : error ? (
        <SummaryErrorState message={error} onRetry={retry} />
      ) : !data ? (
        <SummaryEmptyState filename={decoded} />
      ) : (
        <>
          <SummaryHeader
            filename={data.filename}
            subject={data.subject}
            unit={data.unit}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onDownloadPdf={handleDownloadPdf}
            onPrint={handlePrint}
            onRegenerate={regenerate}
            regenerating={regenerating}
          />

          {isEmpty ? (
            <SummaryEmptyState filename={data.filename} />
          ) : (
            <>
              {markdownContent && (
                <SectionCard
                  icon={Sparkles}
                  title="AI Summary"
                  description="A concise overview generated from your notes."
                  delay={0.05}
                >
                  <MarkdownContent content={markdownContent} />
                </SectionCard>
              )}

              {data.key_points.length > 0 && (
                <SectionCard
                  icon={KeyRound}
                  title="Key Points"
                  description="The essentials you should remember."
                  delay={0.1}
                >
                  <ul className="space-y-3">
                    {data.key_points.map((p, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-2 grid h-1.5 w-1.5 shrink-0 place-items-center rounded-full bg-gradient-brand" />
                        <span className="text-[15px] leading-relaxed text-foreground/90">{p}</span>
                      </motion.li>
                    ))}
                  </ul>
                </SectionCard>
              )}

              {data.important_topics.length > 0 && (
                <SectionCard
                  icon={BookOpen}
                  title="Important Topics"
                  description="High-yield areas worth deeper review."
                  delay={0.15}
                >
                  <div className="flex flex-wrap gap-2">
                    {data.important_topics.map((t, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: 0.15 + i * 0.03 }}
                        className="glass rounded-full border-0 px-3.5 py-1.5 text-sm font-medium"
                      >
                        {t}
                      </motion.span>
                    ))}
                  </div>
                </SectionCard>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

function stripExt(name: string) {
  return name.replace(/\.[a-z0-9]+$/i, "");
}
