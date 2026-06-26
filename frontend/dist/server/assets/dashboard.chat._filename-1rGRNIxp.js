import { t as Route } from "./dashboard.chat._filename-c81zgU6Q.js";
import { n as cn, t as Button } from "./button-DRsC1qZi.js";
import { n as apiFetch } from "./api-D3Wg_S4P.js";
import { t as Breadcrumbs } from "./breadcrumbs-CFNgtDVY.js";
import { t as MarkdownContent } from "./markdown-content-Dw9tB6zm.js";
import { t as Textarea } from "./textarea-DBn9CRiI.js";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Bot, Loader2, RotateCcw, Send, User } from "lucide-react";
import { motion } from "framer-motion";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
//#region src/components/ui/scroll-area.tsx
var ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(ScrollAreaPrimitive.Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ jsx(ScrollBar, {}),
		/* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
	]
}));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
var ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
//#endregion
//#region src/lib/chat.ts
async function fetchChatHistory(filename, signal) {
	return apiFetch(`/ai/chat/history/${encodeURIComponent(filename)}`, { signal });
}
async function sendChatMessage(filename, question, signal) {
	return apiFetch(`/ai/chat/${encodeURIComponent(filename)}`, {
		method: "POST",
		body: JSON.stringify({ question }),
		signal
	});
}
//#endregion
//#region src/routes/dashboard.chat.$filename.tsx?tsr-split=component
function ChatPage() {
	const { filename } = Route.useParams();
	const decoded = safeDecode(filename);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState(null);
	const [typingAnswer, setTypingAnswer] = useState(null);
	const bottomRef = useRef(null);
	const scrollToBottom = useCallback(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);
	useEffect(() => {
		scrollToBottom();
	}, [
		messages,
		typingAnswer,
		scrollToBottom
	]);
	const loadHistory = useCallback(async (signal) => {
		setLoading(true);
		setError(null);
		try {
			setMessages((await fetchChatHistory(decoded, signal)).messages ?? []);
		} catch (err) {
			if (err?.name === "AbortError") return;
			setError(err instanceof Error ? err.message : "Failed to load chat");
		} finally {
			setLoading(false);
		}
	}, [decoded]);
	useEffect(() => {
		const controller = new AbortController();
		loadHistory(controller.signal);
		return () => controller.abort();
	}, [loadHistory]);
	async function handleSend(e) {
		e?.preventDefault();
		const question = input.trim();
		if (!question || sending) return;
		setInput("");
		setSending(true);
		setError(null);
		setMessages((prev) => [...prev, {
			question,
			answer: ""
		}]);
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
						next[next.length - 1] = {
							question,
							answer: text
						};
						return next;
					});
					setTypingAnswer(null);
				} else setTypingAnswer(text.slice(0, i));
			}, 16);
		} catch (err) {
			setMessages((prev) => prev.slice(0, -1));
			toast.error(err instanceof Error ? err.message : "Failed to send message");
			setInput(question);
		} finally {
			setSending(false);
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col space-y-4",
		children: [/* @__PURE__ */ jsx(Breadcrumbs, { items: [{
			label: "Repository",
			to: "/dashboard/repository"
		}, { label: `Chat · ${decoded}` }] }), /* @__PURE__ */ jsxs("div", {
			className: "glass-strong flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "border-b border-border/60 px-5 py-4",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-lg font-semibold",
						children: "AI Tutor"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-sm text-muted-foreground",
						children: ["Ask questions about ", /* @__PURE__ */ jsx("span", {
							className: "font-medium",
							children: decoded
						})]
					})]
				}),
				/* @__PURE__ */ jsx(ScrollArea, {
					className: "flex-1 px-5 py-4",
					children: loading ? /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-center py-12 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Loading conversation…"]
					}) : error ? /* @__PURE__ */ jsxs("div", {
						className: "space-y-3 py-8 text-center",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm text-destructive",
							children: error
						}), /* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => loadHistory(),
							children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" }), "Retry"]
						})]
					}) : messages.length === 0 && !typingAnswer ? /* @__PURE__ */ jsx("div", {
						className: "py-12 text-center text-sm text-muted-foreground",
						children: "Start a conversation — ask anything about your notes."
					}) : /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [
							messages.map((msg, idx) => /* @__PURE__ */ jsxs("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ jsx(MessageBubble, {
									role: "user",
									content: msg.question
								}), (msg.answer || idx === messages.length - 1 && typingAnswer) && /* @__PURE__ */ jsx(MessageBubble, {
									role: "assistant",
									content: idx === messages.length - 1 && typingAnswer ? typingAnswer : msg.answer,
									streaming: idx === messages.length - 1 && !!typingAnswer
								})]
							}, idx)),
							sending && !typingAnswer && /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), "Thinking…"]
							}),
							/* @__PURE__ */ jsx("div", { ref: bottomRef })
						]
					})
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSend,
					className: "flex gap-2 border-t border-border/60 p-4",
					children: [/* @__PURE__ */ jsx(Textarea, {
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: "Ask a question about your notes…",
						className: "min-h-[44px] max-h-32 resize-none border-0 bg-background/40",
						rows: 1,
						disabled: sending || loading,
						onKeyDown: (e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSend();
							}
						}
					}), /* @__PURE__ */ jsx(Button, {
						type: "submit",
						className: "shrink-0 bg-gradient-brand text-white",
						disabled: !input.trim() || sending || loading,
						children: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
					})]
				})
			]
		})]
	});
}
function MessageBubble({ role, content, streaming }) {
	const isUser = role === "user";
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 6
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: `flex gap-3 ${isUser ? "flex-row-reverse" : ""}`,
		children: [/* @__PURE__ */ jsx("div", {
			className: `grid h-8 w-8 shrink-0 place-items-center rounded-full ${isUser ? "bg-muted" : "bg-gradient-brand text-white"}`,
			children: isUser ? /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4" })
		}), /* @__PURE__ */ jsx("div", {
			className: `max-w-[85%] rounded-2xl px-4 py-3 text-sm ${isUser ? "bg-muted/80" : "glass"}`,
			children: isUser ? /* @__PURE__ */ jsx("p", {
				className: "leading-relaxed",
				children: content
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(MarkdownContent, { content: content || "…" }), streaming && /* @__PURE__ */ jsx("span", { className: "ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground" })] })
		})]
	});
}
function safeDecode(v) {
	try {
		return decodeURIComponent(v);
	} catch {
		return v;
	}
}
//#endregion
export { ChatPage as component };
