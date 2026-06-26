import { apiFetch } from "@/lib/api";

export type ChatMessage = {
  question: string;
  answer: string;
  created_at?: string;
};

export type ChatHistoryResponse = {
  filename: string;
  messages: ChatMessage[];
};

export type ChatResponse = {
  answer: string;
  filename: string;
};

export async function fetchChatHistory(filename: string, signal?: AbortSignal) {
  return apiFetch<ChatHistoryResponse>(`/ai/chat/history/${encodeURIComponent(filename)}`, { signal });
}

export async function sendChatMessage(filename: string, question: string, signal?: AbortSignal) {
  return apiFetch<ChatResponse>(`/ai/chat/${encodeURIComponent(filename)}`, {
    method: "POST",
    body: JSON.stringify({ question }),
    signal,
  });
}
