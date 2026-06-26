import { apiFetch, API_URL, getToken } from "@/lib/api";

export type FileCategory =
  | "ppt"
  | "pptx"
  | "pdf"
  | "doc"
  | "docx"
  | "lab_manual"
  | "previous_year_papers";

export const FILE_CATEGORY_LABELS: Record<FileCategory, string> = {
  ppt: "PPT",
  pptx: "PPTX",
  pdf: "PDF",
  doc: "DOC",
  docx: "DOCX",
  lab_manual: "Lab Manual",
  previous_year_papers: "Previous Year Papers",
};

export const FILE_CATEGORY_ORDER: FileCategory[] = [
  "ppt",
  "pptx",
  "pdf",
  "doc",
  "docx",
  "lab_manual",
  "previous_year_papers",
];

export type LibrarySubject = {
  id: string;
  subject_code: string;
  subject_name: string;
  semester: string;
  department: string;
  unit: string;
  keywords: string[];
  file_count: number;
  downloads: number;
  views: number;
  average_rating: number;
  total_ratings: number;
  last_updated: string;
  created_at: string;
  bookmarked: boolean;
};

export type LibraryFile = {
  id: string;
  subject_id: string;
  subject_code: string;
  subject_name: string;
  filename: string;
  original_name: string;
  category: FileCategory;
  category_label: string;
  unit: string;
  semester: string;
  department: string;
  file_type: string;
  file_size: number;
  upload_date: string;
  updated_at: string;
  cloudinary_url: string;
  downloads: number;
  views: number;
  summary_generations: number;
  quiz_generations: number;
  tutor_sessions: number;
  average_rating: number;
  total_ratings: number;
  user_rating: number | null;
  has_summary: boolean;
  has_mcqs: boolean;
  download_url: string;
  preview_url: string;
};

export type LibrarySections = {
  trending: LibrarySubject[];
  recently_added: LibrarySubject[];
  bookmarked: LibrarySubject[];
};

export type FileRatings = {
  average_rating: number;
  total_ratings: number;
  reviews: Array<{
    id: string;
    rating: number;
    feedback: string;
    student_name: string;
    created_at: string;
    mine: boolean;
  }>;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pages: number;
};

export type SubjectFilesResponse = {
  subject: LibrarySubject | null;
  groups: Record<FileCategory, LibraryFile[]>;
  files: LibraryFile[];
  total: number;
  page: number;
  pages: number;
};

export async function searchSubjects(
  query: string,
  page = 1,
  signal?: AbortSignal,
) {
  const qs = new URLSearchParams({
    q: query,
    page: String(page),
    limit: "10",
  });
  return apiFetch<Paginated<LibrarySubject>>(`/library/subjects/search?${qs}`, { signal });
}

export async function fetchSubjectSuggestions(query: string, signal?: AbortSignal) {
  const qs = new URLSearchParams({ q: query });
  return apiFetch<string[]>(`/library/subjects/suggestions?${qs}`, { signal });
}

export async function fetchSubjectSections(signal?: AbortSignal) {
  return apiFetch<LibrarySections>("/library/subjects/sections", { signal });
}

export async function fetchSubjectFiles(
  subjectCode: string,
  opts?: { category?: string; page?: number; signal?: AbortSignal },
) {
  const qs = new URLSearchParams({ page: String(opts?.page ?? 1), limit: "20" });
  if (opts?.category) qs.set("category", opts.category);
  return apiFetch<SubjectFilesResponse>(
    `/library/subjects/${encodeURIComponent(subjectCode)}/files?${qs}`,
    { signal: opts?.signal },
  );
}

export async function submitMaterialRequest(payload: {
  subject_code: string;
  subject_name?: string;
  message?: string;
}) {
  return apiFetch<{ message: string }>("/library/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function setSubjectBookmark(subjectId: string, bookmarked: boolean) {
  return apiFetch<{ bookmarked: boolean }>(`/library/subjects/${subjectId}/bookmark`, {
    method: bookmarked ? "POST" : "DELETE",
  });
}

export async function fetchFileRatings(fileId: string, signal?: AbortSignal) {
  return apiFetch<FileRatings>(`/library/files/${fileId}/ratings`, { signal });
}

export async function rateLibraryFile(fileId: string, payload: { rating: number; feedback?: string }) {
  return apiFetch<{ message: string }>(`/library/files/${fileId}/ratings`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function libraryDownloadUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function downloadLibraryFile(file: LibraryFile) {
  const url = libraryDownloadUrl(file.download_url);
  const token = getToken();
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = file.original_name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

export function formatFileSize(bytes: number) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
