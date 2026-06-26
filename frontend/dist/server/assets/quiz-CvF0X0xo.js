import { t as Button } from "./button-DRsC1qZi.js";
import { n as apiFetch } from "./api-D3Wg_S4P.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, ArrowLeft, FileQuestion, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
//#region src/components/quiz/quiz-skeleton.tsx
function QuizSkeleton() {
	return /* @__PURE__ */ jsxs("div", {
		className: "glass-strong space-y-6 rounded-3xl p-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ jsx("div", { className: "h-5 w-20 animate-pulse rounded-full bg-muted/60" }), /* @__PURE__ */ jsx("div", { className: "h-5 w-16 animate-pulse rounded-full bg-muted/40" })]
			}),
			/* @__PURE__ */ jsx("div", { className: "h-8 w-3/4 animate-pulse rounded-md bg-muted/60" }),
			/* @__PURE__ */ jsx("div", { className: "h-4 w-1/2 animate-pulse rounded-md bg-muted/40" }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsx("div", { className: "h-16 animate-pulse rounded-2xl bg-muted/40" }), /* @__PURE__ */ jsx("div", { className: "h-16 animate-pulse rounded-2xl bg-muted/40" })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "space-y-3 pt-2",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-14 animate-pulse rounded-2xl bg-muted/40" }, i))
			})
		]
	});
}
//#endregion
//#region src/components/quiz/quiz-states.tsx
function QuizErrorState({ message, onRetry, filename }) {
	const needsSummary = message?.toLowerCase().includes("summary");
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: "glass-strong mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl p-10 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid h-14 w-14 place-items-center rounded-2xl bg-destructive/15 text-destructive",
				children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "mt-4 text-lg font-semibold",
				children: "Couldn't load this quiz"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1.5 max-w-sm text-sm text-muted-foreground",
				children: message ?? "Something went wrong while reaching the AI service."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 flex flex-wrap justify-center gap-2",
				children: [
					onRetry && /* @__PURE__ */ jsxs(Button, {
						size: "sm",
						className: "bg-gradient-brand text-white",
						onClick: onRetry,
						children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" }), " Try again"]
					}),
					needsSummary && filename && /* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						className: "glass border-0",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/dashboard/summary/$filename",
							params: { filename },
							children: "Generate summary first"
						})
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						className: "glass border-0",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/dashboard/repository",
							children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to Repository"]
						})
					})
				]
			})
		]
	});
}
function QuizEmptyState({ filename }) {
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: "glass-strong mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl p-10 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-indigo-500/30",
				children: /* @__PURE__ */ jsx(FileQuestion, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "mt-4 text-lg font-semibold",
				children: "No quiz available yet"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-1.5 max-w-sm text-sm text-muted-foreground",
				children: [
					"We couldn't find any MCQs for",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "font-medium text-foreground",
						children: filename
					}),
					". The quiz may still be generating or hasn't been created."
				]
			}),
			/* @__PURE__ */ jsx(Button, {
				asChild: true,
				size: "sm",
				variant: "outline",
				className: "glass mt-5 border-0",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/dashboard/repository",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to Repository"]
				})
			})
		]
	});
}
//#endregion
//#region src/lib/quiz.ts
async function fetchQuiz(filename, signal, regenerate = false) {
	return normalizeQuiz(filename, await apiFetch(`/ai/mcq/${encodeURIComponent(filename)}${regenerate ? "?regenerate=true" : ""}`, { signal }));
}
function resolveCorrectIndex(opts, correctAnswer, correctIndex) {
	if (typeof correctIndex === "number" && correctIndex >= 0 && correctIndex < opts.length) return correctIndex;
	if (typeof correctAnswer !== "string" || !correctAnswer.trim()) return -1;
	const normalizedAnswer = correctAnswer.trim().toLowerCase();
	const exact = opts.findIndex((o) => o.trim().toLowerCase() === normalizedAnswer);
	if (exact >= 0) return exact;
	const letterMatch = normalizedAnswer.match(/^([a-d])[).:\s]?/i);
	if (letterMatch) {
		const idx = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
		if (idx >= 0 && idx < opts.length) return idx;
	}
	return opts.findIndex((o) => o.trim().toLowerCase().includes(normalizedAnswer) || normalizedAnswer.includes(o.trim().toLowerCase()));
}
function normalizeQuiz(filename, data) {
	const questions = (Array.isArray(data?.questions) ? data.questions : Array.isArray(data?.mcqs) ? data.mcqs.map((q) => ({
		question: q.question,
		options: q.options,
		correct_answer: q.answer || q.correct_answer,
		explanation: q.explanation,
		difficulty: q.difficulty,
		topic: q.topic
	})) : []).map((q, i) => {
		const opts = Array.isArray(q?.options) ? q.options.map((o) => String(o)) : [];
		const correctIndex = resolveCorrectIndex(opts, q?.correct_answer, typeof q?.correct_index === "number" ? q.correct_index : void 0);
		return {
			id: String(q?.id ?? i),
			question: String(q?.question ?? "").trim(),
			options: opts,
			correctIndex,
			explanation: q?.explanation,
			difficulty: q.difficulty,
			topic: q.topic
		};
	}).filter((q) => q.question && q.options.length >= 2);
	const estimated = typeof data?.estimated_time === "number" && data.estimated_time > 0 ? Math.round(data.estimated_time) : Math.max(1, Math.ceil(questions.length * .75));
	return {
		filename: data?.filename ?? filename,
		subject: data?.subject,
		unit: data?.unit,
		estimatedMinutes: estimated,
		questions
	};
}
function scoreQuiz(quiz, answers) {
	const total = quiz.questions.length;
	let correct = 0;
	let wrong = 0;
	let unanswered = 0;
	let scored = 0;
	for (const q of quiz.questions) {
		const a = answers[q.id];
		if (a === void 0) {
			unanswered += 1;
			continue;
		}
		if (q.correctIndex < 0) continue;
		scored += 1;
		if (a === q.correctIndex) correct += 1;
		else wrong += 1;
	}
	const percentage = scored > 0 ? Math.round(correct / scored * 100) : 0;
	return {
		total,
		scored,
		correct,
		wrong,
		unanswered,
		percentage
	};
}
function performanceMessage(p) {
	if (p >= 90) return {
		title: "Outstanding work — you've mastered this.",
		tone: "great"
	};
	if (p >= 75) return {
		title: "Great job — you're nearly there.",
		tone: "good"
	};
	if (p >= 50) return {
		title: "Solid effort — a quick review will lock it in.",
		tone: "ok"
	};
	return {
		title: "Keep going — review the notes and try again.",
		tone: "low"
	};
}
async function submitQuiz(payload) {
	return apiFetch("/ai/quiz/submit", {
		method: "POST",
		body: JSON.stringify(payload)
	});
}
//#endregion
export { QuizEmptyState as a, submitQuiz as i, performanceMessage as n, QuizErrorState as o, scoreQuiz as r, QuizSkeleton as s, fetchQuiz as t };
