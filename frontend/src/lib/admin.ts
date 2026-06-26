import { apiFetch } from "@/lib/api";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
};

export type AdminUpload = {
  id: string;
  userId: string;
  filename: string;
  subject: string;
  unit: string;
  fileType: string;
  approved: boolean;
  hasSummary: boolean;
  hasMcqs: boolean;
  uploadDate: string;
};

export type AdminAnalytics = {
  users: number;
  uploads: number;
  approved_uploads: number;
  pending_uploads: number;
  quiz_attempts: number;
  average_quiz_score: number;
  total_subjects: number;
  total_files: number;
  total_downloads: number;
  summaries_generated: number;
  quizzes_generated: number;
  ai_tutor_sessions: number;
  pending_requests: number;
  library_activity: number;
  recent_uploads: Array<{
    id: string;
    subject_code: string;
    subject_name: string;
    original_name: string;
    category: string;
    created_at: string;
  }>;
  trending_subjects: Array<{
    id: string;
    subject_code: string;
    subject_name: string;
    downloads: number;
    file_count: number;
  }>;
};

export async function fetchAdminUsers(signal?: AbortSignal) {
  return apiFetch<AdminUser[]>("/admin/users", { signal });
}

export async function fetchAdminUploads(signal?: AbortSignal) {
  return apiFetch<AdminUpload[]>("/admin/uploads", { signal });
}

export async function fetchAdminAnalytics(signal?: AbortSignal) {
  return apiFetch<AdminAnalytics>("/admin/analytics", { signal });
}

export async function approveAdminUpload(noteId: string) {
  return apiFetch<{ message: string }>(`/admin/uploads/${noteId}/approve`, { method: "PATCH" });
}

export async function deleteAdminUpload(noteId: string) {
  return apiFetch<{ message: string }>(`/admin/uploads/${noteId}`, { method: "DELETE" });
}
