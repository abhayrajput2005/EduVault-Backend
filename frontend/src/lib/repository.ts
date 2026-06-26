import { apiFetch, API_URL, getToken } from "@/lib/api";

export type RepositoryNote = {
  id: string | number;
  subject: string;
  unit: string;
  file_name: string;
  upload_date: string; // ISO string preferred
  // Optional fields the UI will use if present:
  summary_url?: string;
  mcq_url?: string;
  download_url?: string;
  file_size?: number;
  file_type?: string;
  has_summary?: boolean;
  has_mcqs?: boolean;
  preview_url?: string;
  quiz_attempts?: number;
};

export type RepositoryResponse = {
  notes: RepositoryNote[];
};

export async function fetchRepository(signal?: AbortSignal): Promise<RepositoryNote[]> {
  const data = await apiFetch<RepositoryResponse | RepositoryNote[]>("/upload/repository", { signal });
  return Array.isArray(data) ? data : (data?.notes ?? []);
}

export async function deleteRepositoryNote(id: string | number) {
  return apiFetch<{ message: string }>(`/upload/note/${id}`, { method: "DELETE" });
}

function downloadUrl(path?: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function downloadRepositoryNote(note: RepositoryNote) {
  const url = downloadUrl(note.download_url);
  if (!url) throw new Error("Download is not available");

  const token = getToken();
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) throw new Error(`Download failed (${res.status})`);

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = note.file_name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

export function formatUploadDate(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
