import { apiFetch } from "@/lib/api";

export async function uploadNote(formData: FormData) {
  return apiFetch<{
    message: string;
    id: string;
    file_name: string;
    subject: string;
    unit: string;
  }>("/upload/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getRepository() {
  return apiFetch("/upload/repository");
}

export async function getStats() {
  return apiFetch("/upload/count");
}
