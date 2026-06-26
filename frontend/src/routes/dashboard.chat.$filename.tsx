import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Send, RotateCcw, Bot, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/summary/breadcrumbs";
import { MarkdownContent } from "@/components/shared/markdown-content";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchChatHistory, sendChatMessage, type ChatMessage } from "@/lib/chat";

export const Route = createFileRoute("/dashboard/chat/$filename")({
  component: ChatPage,
});

function ChatPage() {
  const { filename } = Route.useParams();
  const decoded = safeDecode(filename);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingAnswer, setTypingAnswer] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingAnswer, scrollToBottom]);

  const loadHistory = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchChatHistory(decoded, signal);
      setMessages(data.messages ?? []);
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [decoded]);

  useEffect(() => {
    const controller = new AbortController();
    void loadHistory(controller.signal);
    return () => controller.abort();
  }, [loadHistory]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const question = input.trim();
    if (!question || sending) return;

    setInput("");
    setSending(true);
    setError(null);
    setMessages((prev) => [...prev, { question, answer: "" }]);

    try {
      const res = await sendChatMessage(decoded, question);
      setTypingAnswer(res.answer);
      let i = 0;
      const text = res.answer;
      const interval = setInterval(() => {
        i += 3;
        if (i >= text.length) {
          clearInterval(interval);
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { question, answer: text };
            return next;
          });
          setTypingAnswer(null);
        } else {
          setTypingAnswer(text.slice(0, i));
        }
      }, 16);
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1));
      toast.error(err instanceof Error ? err.message : "Failed to send message");
      setInput(question);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col space-y-4">
      <Breadcrumbs
        items={[
          { label: "Repository", to: "/dashboard/repository" },
          { label: `Chat · ${decoded}` },
        ]}
      />

      <div className="glass-strong flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl">
        <div className="border-b border-border/60 px-5 py-4">
          <h1 className="text-lg font-semibold">AI Tutor</h1>
          <p className="text-sm text-muted-foreground">
            Ask questions about <span className="font-medium">{decoded}</span>
          </p>
        </div>

        <ScrollArea className="flex-1 px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading conversation…
            </div>
          ) : error ? (
            <div className="space-y-3 py-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={() => loadHistory()}>
                <RotateCcw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : messages.length === 0 && !typingAnswer ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Start a conversation — ask anything about your notes.
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-3">
                  <MessageBubble role="user" content={msg.question} />
                  {(msg.answer || (idx === messages.length - 1 && typingAnswer)) && (
                    <MessageBubble
                      role="assistant"
                      content={
                        idx === messages.length - 1 && typingAnswer
                          ? typingAnswer
                          : msg.answer
                      }
                      streaming={idx === messages.length - 1 && !!typingAnswer}
                    />
                  )}
                </div>
              ))}
              {sending && !typingAnswer && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>

        <form
          onSubmit={handleSend}
          className="flex gap-2 border-t border-border/60 p-4"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your notes…"
            className="min-h-[44px] max-h-32 resize-none border-0 bg-background/40"
            rows={1}
            disabled={sending || loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
          />
          <Button
            type="submit"
            className="shrink-0 bg-gradient-brand text-white"
            disabled={!input.trim() || sending || loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  streaming,
}: {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
          isUser ? "bg-muted" : "bg-gradient-brand text-white"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
          isUser ? "bg-muted/80" : "glass"
        }`}
      >
        {isUser ? (
          <p className="leading-relaxed">{content}</p>
        ) : (
          <>
            <MarkdownContent content={content || "…"} />
            {streaming && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground" />
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}
