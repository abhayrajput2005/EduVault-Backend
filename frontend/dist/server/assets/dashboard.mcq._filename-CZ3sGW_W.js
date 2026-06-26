import { t as Route } from "./dashboard.mcq._filename-0Cw45kEP.js";
import { t as Button } from "./button-DRsC1qZi.js";
import { t as Badge } from "./badge-Cc0IblCb.js";
import { t as Breadcrumbs } from "./breadcrumbs-CFNgtDVY.js";
import { a as QuizEmptyState, o as QuizErrorState, s as QuizSkeleton, t as fetchQuiz } from "./quiz-CvF0X0xo.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Bookmark, Check, Copy, ListChecks } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/dashboard.mcq.$filename.tsx?tsr-split=component
var BOOKMARK_KEY = "eduvault_mcq_bookmarks";
function McqBrowsePage() {
	const { filename } = Route.useParams();
	const decoded = safeDecode(filename);
	const [questions, setQuestions] = useState([]);
	const [meta, setMeta] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [current, setCurrent] = useState(0);
	const [copied, setCopied] = useState(false);
	const [bookmarks, setBookmarks] = useState(() => loadBookmarks());
	const [reloadKey, setReloadKey] = useState(0);
	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		setError(null);
		fetchQuiz(decoded, controller.signal).then((quiz) => {
			setQuestions(quiz.questions);
			setMeta({
				subject: quiz.subject,
				unit: quiz.unit
			});
			setCurrent(0);
		}).catch((err) => {
			if (err?.name === "AbortError") return;
			setError(err instanceof Error ? err.message : "Unknown error");
		}).finally(() => setLoading(false));
		return () => controller.abort();
	}, [decoded, reloadKey]);
	const q = questions[current];
	const isBookmarked = q ? bookmarks.has(q.id) : false;
	const toggleBookmark = useCallback(() => {
		if (!q) return;
		setBookmarks((prev) => {
			const next = new Set(prev);
			if (next.has(q.id)) next.delete(q.id);
			else next.add(q.id);
			localStorage.setItem(BOOKMARK_KEY, JSON.stringify([...next]));
			return next;
		});
	}, [q]);
	async function copyQuestion() {
		if (!q) return;
		const text = `${q.question}\n\n${q.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join("\n")}`;
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			toast.success("Question copied");
			setTimeout(() => setCopied(false), 1500);
		} catch {
			toast.error("Copy failed");
		}
	}
	const difficultyColor = useMemo(() => {
		const d = q?.difficulty?.toLowerCase() ?? "";
		if (d.includes("hard")) return "destructive";
		if (d.includes("easy")) return "secondary";
		return "outline";
	}, [q?.difficulty]);
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-3xl space-y-6",
		children: [/* @__PURE__ */ jsx(Breadcrumbs, { items: [{
			label: "Repository",
			to: "/dashboard/repository"
		}, { label: `MCQs · ${decoded}` }] }), loading ? /* @__PURE__ */ jsx(QuizSkeleton, {}) : error ? /* @__PURE__ */ jsx(QuizErrorState, {
			message: error,
			onRetry: () => setReloadKey((k) => k + 1),
			filename: decoded
		}) : questions.length === 0 ? /* @__PURE__ */ jsx(QuizEmptyState, { filename: decoded }) : q && /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				y: 10
			},
			animate: {
				opacity: 1,
				y: 0
			},
			className: "glass-strong space-y-6 rounded-3xl p-6 sm:p-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-2",
						children: [
							meta.subject && /* @__PURE__ */ jsx(Badge, {
								className: "bg-gradient-brand border-0 text-white",
								children: meta.subject
							}),
							meta.unit && /* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								children: meta.unit
							}),
							q.difficulty && /* @__PURE__ */ jsx(Badge, {
								variant: difficultyColor,
								children: q.difficulty
							}),
							q.topic && /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								children: q.topic
							})
						]
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-sm text-muted-foreground",
						children: [
							current + 1,
							" / ",
							questions.length
						]
					})]
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-semibold leading-snug sm:text-2xl",
					children: q.question
				}),
				/* @__PURE__ */ jsx("ul", {
					className: "grid gap-2",
					children: q.options.map((opt, i) => /* @__PURE__ */ jsxs("li", {
						className: "glass rounded-xl px-4 py-3 text-[15px] leading-relaxed",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "mr-2 font-semibold text-muted-foreground",
							children: [String.fromCharCode(65 + i), "."]
						}), opt]
					}, i))
				}),
				q.explanation && /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border/60 bg-muted/30 p-4",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Explanation"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm leading-relaxed",
						children: q.explanation
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							size: "sm",
							onClick: copyQuestion,
							children: [copied ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }), "Copy"]
						}), /* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							size: "sm",
							onClick: toggleBookmark,
							children: [/* @__PURE__ */ jsx(Bookmark, { className: `h-4 w-4 ${isBookmarked ? "fill-current text-amber-500" : ""}` }), isBookmarked ? "Saved" : "Bookmark"]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							onClick: () => setCurrent((c) => Math.max(0, c - 1)),
							disabled: current === 0,
							children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), "Previous"]
						}), /* @__PURE__ */ jsxs(Button, {
							className: "bg-gradient-brand text-white",
							onClick: () => setCurrent((c) => Math.min(questions.length - 1, c + 1)),
							disabled: current === questions.length - 1,
							children: ["Next", /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })]
						})]
					})]
				}),
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "outline",
					className: "w-full",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/dashboard/quiz/$filename",
						params: { filename: decoded },
						children: [/* @__PURE__ */ jsx(ListChecks, { className: "h-4 w-4" }), "Start Practice Quiz"]
					})
				})
			]
		}, q.id)]
	});
}
function loadBookmarks() {
	if (typeof window === "undefined") return /* @__PURE__ */ new Set();
	try {
		const raw = localStorage.getItem(BOOKMARK_KEY);
		return new Set(raw ? JSON.parse(raw) : []);
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function safeDecode(v) {
	try {
		return decodeURIComponent(v);
	} catch {
		return v;
	}
}
//#endregion
export { McqBrowsePage as component };
