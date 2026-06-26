import { t as Route } from "./dashboard.summary._filename-CxHUKzgO.js";
import { t as Button } from "./button-DRsC1qZi.js";
import { t as Badge } from "./badge-Cc0IblCb.js";
import { n as apiFetch } from "./api-D3Wg_S4P.js";
import { t as Breadcrumbs } from "./breadcrumbs-CFNgtDVY.js";
import { t as MarkdownContent } from "./markdown-content-Dw9tB6zm.js";
import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, BookOpen, Check, Copy, Download, FileDown, FileQuestion, KeyRound, ListChecks, Printer, RefreshCw, RotateCcw, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
//#region src/components/summary/summary-header.tsx
function SummaryHeader({ filename, subject, unit, onCopy, onDownload, onDownloadPdf, onPrint, onRegenerate, regenerating, actionsDisabled }) {
	const [copied, setCopied] = useState(false);
	async function handleCopy() {
		if (await onCopy()) {
			setCopied(true);
			setTimeout(() => setCopied(false), 1800);
		}
	}
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .4 },
		className: "glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8",
		children: [/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl" }), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-5",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [subject && /* @__PURE__ */ jsx(Badge, {
							className: "bg-gradient-brand border-0 text-[10px] font-semibold uppercase tracking-wider text-white",
							children: subject
						}), unit && /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: "glass border-0 text-xs font-medium",
							children: unit
						})]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-3 break-words text-2xl font-bold leading-tight tracking-tight sm:text-3xl",
						title: filename,
						children: filename
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "AI-generated summary · review, copy, download, or print for offline study."
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-2 print:hidden",
				children: [
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						className: "glass border-0",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/dashboard/repository",
							children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to Repository"]
						})
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "sm",
						className: "bg-gradient-brand text-white shadow-md shadow-indigo-500/30 hover:opacity-95",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/dashboard/quiz/$filename",
							params: { filename },
							"aria-label": `Practice MCQs for ${filename}`,
							children: [/* @__PURE__ */ jsx(ListChecks, { className: "h-4 w-4" }), "Practice MCQs"]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ml-auto flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "outline",
								className: "glass border-0",
								onClick: handleCopy,
								disabled: actionsDisabled,
								children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-500" }), " Copied"] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }), " Copy Summary"] })
							}),
							/* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "outline",
								className: "glass border-0",
								onClick: onDownload,
								disabled: actionsDisabled,
								children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Download TXT"]
							}),
							onDownloadPdf && /* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "outline",
								className: "glass border-0",
								onClick: onDownloadPdf,
								disabled: actionsDisabled,
								children: [/* @__PURE__ */ jsx(FileDown, { className: "h-4 w-4" }), " Download PDF"]
							}),
							onRegenerate && /* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "outline",
								className: "glass border-0",
								onClick: onRegenerate,
								disabled: actionsDisabled || regenerating,
								children: [/* @__PURE__ */ jsx(RotateCcw, { className: `h-4 w-4 ${regenerating ? "animate-spin" : ""}` }), "Regenerate"]
							}),
							/* @__PURE__ */ jsxs(Button, {
								size: "sm",
								className: "bg-gradient-brand text-white shadow-md shadow-indigo-500/30 hover:opacity-95",
								onClick: onPrint,
								disabled: actionsDisabled,
								children: [/* @__PURE__ */ jsx(Printer, { className: "h-4 w-4" }), " Print"]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/components/summary/section-card.tsx
function SectionCard({ icon: Icon, title, description, children, delay = 0 }) {
	return /* @__PURE__ */ jsxs(motion.section, {
		initial: {
			opacity: 0,
			y: 14
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .45,
			delay
		},
		className: "glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8",
		children: [
			/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-brand opacity-10 blur-3xl" }),
			/* @__PURE__ */ jsxs("header", {
				className: "mb-5 flex items-start gap-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white shadow-md shadow-indigo-500/30",
					children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
				}), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-semibold tracking-tight sm:text-xl",
						children: title
					}), description && /* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-sm text-muted-foreground",
						children: description
					})]
				})]
			}),
			children
		]
	});
}
//#endregion
//#region src/components/summary/summary-skeleton.tsx
function SummarySkeleton() {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "glass-strong rounded-3xl p-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsx("div", { className: "h-5 w-24 animate-pulse rounded-full bg-muted/60" }), /* @__PURE__ */ jsx("div", { className: "h-5 w-16 animate-pulse rounded-full bg-muted/40" })]
				}),
				/* @__PURE__ */ jsx("div", { className: "mt-4 h-8 w-2/3 animate-pulse rounded-md bg-muted/60" }),
				/* @__PURE__ */ jsx("div", { className: "mt-2 h-4 w-1/3 animate-pulse rounded-md bg-muted/40" }),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 flex flex-wrap gap-2",
					children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-9 w-28 animate-pulse rounded-md bg-muted/50" }, i))
				})
			]
		}), Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxs("div", {
			className: "glass-strong rounded-3xl p-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-pulse rounded-xl bg-muted/60" }), /* @__PURE__ */ jsx("div", { className: "h-5 w-40 animate-pulse rounded-md bg-muted/60" })]
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-6 space-y-3",
				children: Array.from({ length: i === 0 ? 6 : 4 }).map((_, j) => /* @__PURE__ */ jsx("div", {
					className: "h-3 animate-pulse rounded-full bg-muted/40",
					style: { width: `${60 + j * 13 % 35}%` }
				}, j))
			})]
		}, i))]
	});
}
//#endregion
//#region src/components/summary/summary-states.tsx
function SummaryErrorState({ message, onRetry }) {
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
				children: "Couldn't load this summary"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1.5 max-w-sm text-sm text-muted-foreground",
				children: message ?? "Something went wrong while contacting the AI service."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 flex flex-wrap justify-center gap-2",
				children: [onRetry && /* @__PURE__ */ jsxs(Button, {
					size: "sm",
					className: "bg-gradient-brand text-white",
					onClick: onRetry,
					children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" }), " Try again"]
				}), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					size: "sm",
					variant: "outline",
					className: "glass border-0",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/dashboard/repository",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to Repository"]
					})
				})]
			})
		]
	});
}
function SummaryEmptyState({ filename }) {
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
				children: "No summary available yet"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-1.5 max-w-sm text-sm text-muted-foreground",
				children: [
					"We couldn't find an AI summary for",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "font-medium text-foreground",
						children: filename
					}),
					". It may still be processing or hasn't been generated."
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
//#region src/lib/summary.ts
async function fetchSummary(filename, signal, regenerate = false) {
	return normalizeSummary(filename, await apiFetch(`/ai/summary/${encodeURIComponent(filename)}${regenerate ? "?regenerate=true" : ""}`, { signal }));
}
function normalizeSummary(filename, data) {
	const raw = data?.summary;
	let paragraphs = [];
	if (Array.isArray(raw)) paragraphs = raw.map((p) => String(p).trim()).filter(Boolean);
	else if (typeof raw === "string") paragraphs = raw.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
	return {
		filename: data?.filename ?? filename,
		subject: data?.subject,
		unit: data?.unit,
		summary: paragraphs,
		summary_markdown: data?.summary_markdown,
		key_points: Array.isArray(data?.key_points) ? data.key_points.filter(Boolean) : [],
		important_topics: Array.isArray(data?.important_topics) ? data.important_topics.filter(Boolean) : []
	};
}
function summaryToPlainText(s) {
	const lines = [];
	lines.push(s.filename);
	if (s.subject || s.unit) lines.push([s.subject, s.unit].filter(Boolean).join(" · "));
	lines.push("");
	lines.push("AI SUMMARY");
	lines.push("----------");
	lines.push(s.summary.join("\n\n"));
	if (s.key_points.length) {
		lines.push("");
		lines.push("KEY POINTS");
		lines.push("----------");
		s.key_points.forEach((p) => lines.push(`• ${p}`));
	}
	if (s.important_topics.length) {
		lines.push("");
		lines.push("IMPORTANT TOPICS");
		lines.push("----------------");
		s.important_topics.forEach((t) => lines.push(`• ${t}`));
	}
	return lines.join("\n");
}
//#endregion
//#region src/routes/dashboard.summary.$filename.tsx?tsr-split=component
function SummaryPage() {
	const { filename } = Route.useParams();
	const decoded = safeDecode(filename);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [regenerating, setRegenerating] = useState(false);
	const [error, setError] = useState(null);
	const [reloadKey, setReloadKey] = useState(0);
	const loadSummary = useCallback(async (regenerate, signal) => {
		if (regenerate) setRegenerating(true);
		else {
			setLoading(true);
			setData(null);
		}
		setError(null);
		try {
			setData(await fetchSummary(decoded, signal, regenerate));
			if (regenerate) toast.success("Summary regenerated");
		} catch (err) {
			if (err?.name === "AbortError") return;
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
			setRegenerating(false);
		}
	}, [decoded]);
	useEffect(() => {
		const controller = new AbortController();
		loadSummary(false, controller.signal);
		return () => controller.abort();
	}, [
		decoded,
		reloadKey,
		loadSummary
	]);
	const retry = () => setReloadKey((k) => k + 1);
	const regenerate = () => void loadSummary(true);
	const isEmpty = !!data && data.summary.length === 0 && !data.summary_markdown && data.key_points.length === 0 && data.important_topics.length === 0;
	async function handleCopy() {
		if (!data) return false;
		try {
			await navigator.clipboard.writeText(summaryToPlainText(data));
			return true;
		} catch {
			return false;
		}
	}
	function handleDownload() {
		if (!data) return;
		downloadBlob(new Blob([summaryToPlainText(data)], { type: "text/plain;charset=utf-8" }), `${stripExt(data.filename)}-summary.txt`);
	}
	function handleDownloadPdf() {
		if (!data) return;
		const doc = new jsPDF();
		const lines = doc.splitTextToSize(summaryToPlainText(data), 180);
		doc.setFontSize(12);
		doc.text(lines, 14, 20);
		doc.save(`${stripExt(data.filename)}-summary.pdf`);
	}
	function handlePrint() {
		window.print();
	}
	const markdownContent = data?.summary_markdown || (data?.summary.length ? data.summary.join("\n\n") : "");
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl space-y-6 print:max-w-none print:space-y-4",
		children: [/* @__PURE__ */ jsx("div", {
			className: "print:hidden",
			children: /* @__PURE__ */ jsx(Breadcrumbs, { items: [{
				label: "Repository",
				to: "/dashboard/repository"
			}, { label: decoded }] })
		}), loading ? /* @__PURE__ */ jsx(SummarySkeleton, {}) : error ? /* @__PURE__ */ jsx(SummaryErrorState, {
			message: error,
			onRetry: retry
		}) : !data ? /* @__PURE__ */ jsx(SummaryEmptyState, { filename: decoded }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SummaryHeader, {
			filename: data.filename,
			subject: data.subject,
			unit: data.unit,
			onCopy: handleCopy,
			onDownload: handleDownload,
			onDownloadPdf: handleDownloadPdf,
			onPrint: handlePrint,
			onRegenerate: regenerate,
			regenerating
		}), isEmpty ? /* @__PURE__ */ jsx(SummaryEmptyState, { filename: data.filename }) : /* @__PURE__ */ jsxs(Fragment, { children: [
			markdownContent && /* @__PURE__ */ jsx(SectionCard, {
				icon: Sparkles,
				title: "AI Summary",
				description: "A concise overview generated from your notes.",
				delay: .05,
				children: /* @__PURE__ */ jsx(MarkdownContent, { content: markdownContent })
			}),
			data.key_points.length > 0 && /* @__PURE__ */ jsx(SectionCard, {
				icon: KeyRound,
				title: "Key Points",
				description: "The essentials you should remember.",
				delay: .1,
				children: /* @__PURE__ */ jsx("ul", {
					className: "space-y-3",
					children: data.key_points.map((p, i) => /* @__PURE__ */ jsxs(motion.li, {
						initial: {
							opacity: 0,
							x: -6
						},
						animate: {
							opacity: 1,
							x: 0
						},
						transition: {
							duration: .3,
							delay: .1 + i * .04
						},
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ jsx("span", { className: "mt-2 grid h-1.5 w-1.5 shrink-0 place-items-center rounded-full bg-gradient-brand" }), /* @__PURE__ */ jsx("span", {
							className: "text-[15px] leading-relaxed text-foreground/90",
							children: p
						})]
					}, i))
				})
			}),
			data.important_topics.length > 0 && /* @__PURE__ */ jsx(SectionCard, {
				icon: BookOpen,
				title: "Important Topics",
				description: "High-yield areas worth deeper review.",
				delay: .15,
				children: /* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-2",
					children: data.important_topics.map((t, i) => /* @__PURE__ */ jsx(motion.span, {
						initial: {
							opacity: 0,
							scale: .96
						},
						animate: {
							opacity: 1,
							scale: 1
						},
						transition: {
							duration: .25,
							delay: .15 + i * .03
						},
						className: "glass rounded-full border-0 px-3.5 py-1.5 text-sm font-medium",
						children: t
					}, i))
				})
			})
		] })] })]
	});
}
function downloadBlob(blob, name) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
function safeDecode(v) {
	try {
		return decodeURIComponent(v);
	} catch {
		return v;
	}
}
function stripExt(name) {
	return name.replace(/\.[a-z0-9]+$/i, "");
}
//#endregion
export { SummaryPage as component };
