import { apiFetch } from "@/lib/api";
import type { FileCategory, LibraryFile, LibrarySubject, Paginated } from "@/lib/subject-library";

export type MaterialRequest = {
  id: string;
  subject_code: string;
  subject_name: string;
  student_email: string;
  student_name: string;
  message: string;
  status: string;
  created_at: string;
};

export async function fetchAdminLibrarySubjects(
  opts?: { q?: string; page?: number; signal?: AbortSignal },
) {
  const qs = new URLSearchParams({
    page: String(opts?.page ?? 1),
    limit: "20",
  });
  if (opts?.q) qs.set("q", opts.q);
  return apiFetch<Paginated<LibrarySubject>>(`/admin/library/subjects?${qs}`, {
    signal: opts?.signal,
  });
}

export async function createAdminLibrarySubject(payload: {
  subject_code: string;
  subject_name: string;
  semester?: string;
  department?: string;
  unit?: string;
  keywords?: string[];
}) {
  return apiFetch<LibrarySubject>("/admin/library/subjects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminLibrarySubject(
  subjectId: string,
  payload: Partial<{
    subject_code: string;
    subject_name: string;
    semester: string;
    department: string;
    unit: string;
    keywords: string[];
  }>,
) {
  return apiFetch<LibrarySubject>(`/admin/library/subjects/${subjectId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminLibrarySubject(subjectId: string) {
  return apiFetch<{ message: string }>(`/admin/library/subjects/${subjectId}`, {
    method: "DELETE",
  });
}

export async function uploadAdminLibraryFile(
  subjectId: string,
  formData: FormData,
) {
  return apiFetch<LibraryFile | { items: LibraryFile[]; total: number }>(`/admin/library/subjects/${subjectId}/files`, {
    method: "POST",
    body: formData,
  });
}

export async function updateAdminLibraryFile(
  fileId: string,
  payload: Partial<{ category: FileCategory; unit: string; original_name: string }>,
) {
  return apiFetch<LibraryFile>(`/admin/library/files/${fileId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function replaceAdminLibraryFile(fileId: string, formData: FormData) {
  return apiFetch<LibraryFile>(`/admin/library/files/${fileId}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteAdminLibraryFile(fileId: string) {
  return apiFetch<{ message: string }>(`/admin/library/files/${fileId}`, {
    method: "DELETE",
  });
}

export async function fetchAdminMaterialRequests(
  opts?: { status?: string; page?: number; signal?: AbortSignal },
) {
  const qs = new URLSearchParams({
    page: String(opts?.page ?? 1),
    limit: "20",
    status: opts?.status ?? "pending",
  });
  return apiFetch<Paginated<MaterialRequest>>(`/admin/library/requests?${qs}`, {
    signal: opts?.signal,
  });
}

export async function resolveAdminMaterialRequest(requestId: string, status = "resolved") {
  return apiFetch<{ message: string }>(`/admin/library/requests/${requestId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
