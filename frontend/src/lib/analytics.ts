import { apiFetch } from "@/lib/api";

export type ActivityDay = {
  date: string;
  uploads: number;
  quizzes: number;
};

export type RecentUpload = {
  id: string;
  file_name: string;
  subject: string;
  unit: string;
  file_type: string;
  upload_date: string;
};

export type UserAnalytics = {
  files_uploaded: number;
  summaries_generated: number;
  mcqs_generated: number;
  quiz_attempts: number;
  average_quiz_score: number;
  recent_uploads: RecentUpload[];
  activity: ActivityDay[];
};

export async function fetchAnalytics(signal?: AbortSignal) {
  return apiFetch<UserAnalytics>("/ai/analytics", { signal });
}
