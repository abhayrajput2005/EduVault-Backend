import { apiFetch } from "@/lib/api";

// Types and fetcher for the AI Summary page.
// Wire to Flask: GET /api/ai/summary/{filename}
//
// Expected response (flexible — normalized below):
// {
//   filename: string,
//   subject?: string,
//   unit?: string,
//   summary: string | string[],          // markdown or paragraph list
//   key_points?: string[],
//   important_topics?: string[],
// }

export type AiSummary = {
  filename: string;
  subject?: string;
  unit?: string;
  summary: string[]; // normalized to paragraphs
  summary_markdown?: string;
  key_points: string[];
  important_topics: string[];
};

export type AiSummaryRaw = {
  filename?: string;
  subject?: string;
  unit?: string;
  summary?: string | string[];
  summary_markdown?: string;
  key_points?: string[];
  important_topics?: string[];
};

export async function fetchSummary(
  filename: string,
  signal?: AbortSignal,
  regenerate = false,
): Promise<AiSummary> {
  const qs = regenerate ? "?regenerate=true" : "";
  const data = await apiFetch<AiSummaryRaw>(`/ai/summary/${encodeURIComponent(filename)}${qs}`, {
    signal,
  });
  return normalizeSummary(filename, data);
}

export function normalizeSummary(filename: string, data: AiSummaryRaw): AiSummary {
  const raw = data?.summary;
  let paragraphs: string[] = [];
  if (Array.isArray(raw)) paragraphs = raw.map((p) => String(p).trim()).filter(Boolean);
  else if (typeof raw === "string")
    paragraphs = raw
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

  return {
    filename: data?.filename ?? filename,
    subject: data?.subject,
    unit: data?.unit,
    summary: paragraphs,
    summary_markdown: data?.summary_markdown,
    key_points: Array.isArray(data?.key_points) ? data!.key_points.filter(Boolean) : [],
    important_topics: Array.isArray(data?.important_topics)
      ? data!.important_topics.filter(Boolean)
      : [],
  };
}

export function summaryToPlainText(s: AiSummary): string {
  const lines: string[] = [];
  lines.push(s.filename);
  if (s.subject || s.unit)
    lines.push([s.subject, s.unit].filter(Boolean).join(" · "));
  lines.push("");
  lines.push("AI SUMMARY");
  lines.push("----------");
  lines.push(s.summary.join("\n\n"));
  if (s.key_points.length) {
    lines.push("");
    lines.push("KEY POINTS");
    lines.push("----------");
    s.key_points.forEach((p) => lines.push(`• ${p}`));
  }
  if (s.important_topics.length) {
    lines.push("");
    lines.push("IMPORTANT TOPICS");
    lines.push("----------------");
    s.important_topics.forEach((t) => lines.push(`• ${t}`));
  }
  return lines.join("\n");
}
