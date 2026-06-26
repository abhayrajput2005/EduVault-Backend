import { apiFetch } from "@/lib/api";

// Types and fetcher for the AI Practice Quiz.
// Wire to Flask: GET /api/ai/mcq/{filename}
//
// Expected response (flexible — normalized below):
// {
//   filename: string,
//   subject?: string,
//   unit?: string,
//   estimated_time?: number, // minutes
//   questions: [
//     {
//       id?: string|number,
//       question: string,
//       options: string[],        // 4 options
//       correct_index?: number,   // 0-based
//       correct_answer?: string,  // OR the literal correct option text
//       explanation?: string,
//     }
//   ]
// }

export type McqQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number; // -1 if unknown (server hasn't supplied)
  explanation?: string;
  difficulty?: string;
  topic?: string;
};

export type Quiz = {
  filename: string;
  subject?: string;
  unit?: string;
  estimatedMinutes: number;
  questions: McqQuestion[];
};

export type QuizRaw = {
  filename?: string;
  subject?: string;
  unit?: string;
  estimated_time?: number;
  questions?: Array<{
    id?: string | number;
    question?: string;
    options?: string[];
    correct_index?: number;
    correct_answer?: string;
    explanation?: string;
  }>;
  mcqs?: Array<{
    question?: string;
    options?: string[];
    answer?: string;
    correct_answer?: string;
    explanation?: string;
    difficulty?: string;
    topic?: string;
  }>;
};

export async function fetchQuiz(filename: string, signal?: AbortSignal, regenerate = false): Promise<Quiz> {
  const qs = regenerate ? "?regenerate=true" : "";
  const data = await apiFetch<QuizRaw>(`/ai/mcq/${encodeURIComponent(filename)}${qs}`, { signal });
  return normalizeQuiz(filename, data);
}

function resolveCorrectIndex(
  opts: string[],
  correctAnswer?: string,
  correctIndex?: number,
): number {
  if (typeof correctIndex === "number" && correctIndex >= 0 && correctIndex < opts.length) {
    return correctIndex;
  }
  if (typeof correctAnswer !== "string" || !correctAnswer.trim()) return -1;

  const normalizedAnswer = correctAnswer.trim().toLowerCase();
  const exact = opts.findIndex((o) => o.trim().toLowerCase() === normalizedAnswer);
  if (exact >= 0) return exact;

  const letterMatch = normalizedAnswer.match(/^([a-d])[).:\s]?/i);
  if (letterMatch) {
    const idx = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
    if (idx >= 0 && idx < opts.length) return idx;
  }

  const partial = opts.findIndex(
    (o) =>
      o.trim().toLowerCase().includes(normalizedAnswer) ||
      normalizedAnswer.includes(o.trim().toLowerCase()),
  );
  return partial;
}

export function normalizeQuiz(filename: string, data: QuizRaw): Quiz {
  const raw = Array.isArray(data?.questions)
    ? data!.questions
    : Array.isArray(data?.mcqs)
      ? data!.mcqs.map((q) => ({
          question: q.question,
          options: q.options,
          correct_answer: q.answer || q.correct_answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          topic: q.topic,
        }))
      : [];
  const questions: McqQuestion[] = raw
    .map((q, i) => {
      const opts = Array.isArray(q?.options) ? q.options.map((o) => String(o)) : [];
      const correctIndex = resolveCorrectIndex(
        opts,
        q?.correct_answer,
        typeof q?.correct_index === "number" ? q.correct_index : undefined,
      );
      return {
        id: String(q?.id ?? i),
        question: String(q?.question ?? "").trim(),
        options: opts,
        correctIndex,
        explanation: q?.explanation,
        difficulty: (q as { difficulty?: string }).difficulty,
        topic: (q as { topic?: string }).topic,
      };
    })
    .filter((q) => q.question && q.options.length >= 2);

  const estimated =
    typeof data?.estimated_time === "number" && data.estimated_time > 0
      ? Math.round(data.estimated_time)
      : Math.max(1, Math.ceil(questions.length * 0.75)); // ~45s/question fallback

  return {
    filename: data?.filename ?? filename,
    subject: data?.subject,
    unit: data?.unit,
    estimatedMinutes: estimated,
    questions,
  };
}

export type QuizScore = {
  total: number;
  scored: number; // questions with known correct answer
  correct: number;
  wrong: number;
  unanswered: number;
  percentage: number; // 0-100
};

export function scoreQuiz(quiz: Quiz, answers: Record<string, number | undefined>): QuizScore {
  const total = quiz.questions.length;
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
  let scored = 0;

  for (const q of quiz.questions) {
    const a = answers[q.id];
    if (a === undefined) {
      unanswered += 1;
      continue;
    }
    if (q.correctIndex < 0) continue; // can't score this one
    scored += 1;
    if (a === q.correctIndex) correct += 1;
    else wrong += 1;
  }

  const percentage = scored > 0 ? Math.round((correct / scored) * 100) : 0;
  return { total, scored, correct, wrong, unanswered, percentage };
}

export function performanceMessage(p: number): { title: string; tone: "great" | "good" | "ok" | "low" } {
  if (p >= 90) return { title: "Outstanding work — you've mastered this.", tone: "great" };
  if (p >= 75) return { title: "Great job — you're nearly there.", tone: "good" };
  if (p >= 50) return { title: "Solid effort — a quick review will lock it in.", tone: "ok" };
  return { title: "Keep going — review the notes and try again.", tone: "low" };
}

export type QuizSubmitReview = {
  question: string;
  selected: string;
  correct: string;
  is_correct: boolean;
  explanation: string;
  difficulty: string;
  topic: string;
};

export type QuizSubmitResult = {
  filename: string;
  score: number;
  total: number;
  percentage: number;
  performance: string;
  review: QuizSubmitReview[];
};

export type QuizHistoryEntry = {
  id: string;
  filename: string;
  score: number;
  total: number;
  percentage: number;
  performance: string;
  submitted_at: string;
};

export async function submitQuiz(payload: {
  filename: string;
  answers: string[];
  duration_seconds?: number;
}) {
  return apiFetch<QuizSubmitResult>("/ai/quiz/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchQuizHistory(signal?: AbortSignal) {
  return apiFetch<QuizHistoryEntry[]>("/ai/quiz/history", { signal });
}

