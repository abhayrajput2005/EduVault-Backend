import { t as Button } from "./button-DRsC1qZi.js";
import { t as Badge } from "./badge-Cc0IblCb.js";
import { a as getToken, n as apiFetch, t as API_URL } from "./api-D3Wg_S4P.js";
import { t as Input } from "./input-DicJzR9-.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.js";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog-BpdftUtE.js";
import { memo, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { AlertTriangle, Calendar, Download, Eye, FileText, FolderGit2, FolderOpen, ListChecks, MessageSquare, Presentation, RefreshCw, Search, SlidersHorizontal, Sparkles, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
//#region src/lib/repository.ts
async function fetchRepository(signal) {
	const data = await apiFetch("/upload/repository", { signal });
	return Array.isArray(data) ? data : data?.notes ?? [];
}
async function deleteRepositoryNote(id) {
	return apiFetch(`/upload/note/${id}`, { method: "DELETE" });
}
function downloadUrl(path) {
	if (!path) return "";
	if (/^https?:\/\//i.test(path)) return path;
	return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
async function downloadRepositoryNote(note) {
	const url = downloadUrl(note.download_url);
	if (!url) throw new Error("Download is not available");
	const token = getToken();
	const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
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
function formatUploadDate(input) {
	const d = new Date(input);
	if (Number.isNaN(d.getTime())) return input;
	return d.toLocaleDateString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
//#endregion
//#region src/components/repositry/preview-modal.tsx
var PreviewModal = memo(function PreviewModal({ note, open, onOpenChange }) {
	if (!note) return null;
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-lg",
			children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, {
				className: "truncate pr-6",
				children: note.file_name
			}) }), /* @__PURE__ */ jsxs("div", {
				className: "space-y-4 text-sm",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							children: note.subject
						}),
						/* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							children: note.unit
						}),
						note.file_type && /* @__PURE__ */ jsx(Badge, { children: note.file_type })
					]
				}), /* @__PURE__ */ jsxs("dl", {
					className: "grid grid-cols-2 gap-3 rounded-xl bg-muted/30 p-4",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
							className: "text-xs text-muted-foreground",
							children: "Uploaded"
						}), /* @__PURE__ */ jsx("dd", {
							className: "font-medium",
							children: formatUploadDate(note.upload_date)
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
							className: "text-xs text-muted-foreground",
							children: "Quiz attempts"
						}), /* @__PURE__ */ jsx("dd", {
							className: "font-medium",
							children: note.quiz_attempts ?? 0
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
							className: "text-xs text-muted-foreground",
							children: "Summary"
						}), /* @__PURE__ */ jsx("dd", {
							className: "font-medium",
							children: note.has_summary ? "Ready" : "Not generated"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
							className: "text-xs text-muted-foreground",
							children: "MCQs"
						}), /* @__PURE__ */ jsx("dd", {
							className: "font-medium",
							children: note.has_mcqs ? "Ready" : "Not generated"
						})] })
					]
				})]
			})]
		})
	});
});
//#endregion
//#region src/components/repositry/note-card.tsx
function fileIcon(type) {
	if ((type ?? "").toLowerCase().includes("ppt")) return Presentation;
	return FileText;
}
var NoteCard = memo(function NoteCard({ note, index = 0, onDeleted }) {
	const filenameParam = note.file_name;
	const [previewOpen, setPreviewOpen] = useState(false);
	const FileIcon = fileIcon(note.file_type);
	const handleDownload = async () => {
		try {
			await downloadRepositoryNote(note);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Download failed");
		}
	};
	const handleDelete = async () => {
		if (!window.confirm(`Delete ${note.file_name}?`)) return;
		try {
			await deleteRepositoryNote(note.id);
			toast.success("Note deleted");
			onDeleted?.();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Delete failed");
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(motion.article, {
		initial: {
			opacity: 0,
			y: 14
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .35,
			delay: Math.min(index, 8) * .04
		},
		whileHover: { y: -3 },
		className: "group glass relative flex h-full flex-col overflow-hidden rounded-2xl p-5",
		children: [
			/* @__PURE__ */ jsx("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-brand opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
			}),
			/* @__PURE__ */ jsxs("header", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white shadow-md shadow-indigo-500/30",
						children: /* @__PURE__ */ jsx(FileIcon, { className: "h-5 w-5" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: "glass border-0 text-[10px] font-semibold uppercase tracking-wider",
							children: note.subject
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-1 truncate text-sm font-semibold text-muted-foreground",
							children: note.unit
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-0.5",
					children: [/* @__PURE__ */ jsx(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8 shrink-0 text-muted-foreground",
						onClick: () => setPreviewOpen(true),
						"aria-label": `Preview ${note.file_name}`,
						children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
					}), /* @__PURE__ */ jsx(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive",
						onClick: handleDelete,
						"aria-label": `Delete ${note.file_name}`,
						children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-4 flex items-start gap-2",
				children: /* @__PURE__ */ jsx("h3", {
					className: "line-clamp-2 text-base font-semibold leading-snug",
					title: note.file_name,
					children: note.file_name
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5" }), formatUploadDate(note.upload_date)]
					}),
					note.has_summary && /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "text-[10px]",
						children: "Summary"
					}),
					note.has_mcqs && /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "text-[10px]",
						children: "MCQs"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						className: "glass border-0 text-xs",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/dashboard/summary/$filename",
							params: { filename: filenameParam },
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), "Summary"]
						})
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						className: "glass border-0 text-xs",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/dashboard/mcq/$filename",
							params: { filename: filenameParam },
							children: [/* @__PURE__ */ jsx(ListChecks, { className: "h-3.5 w-3.5" }), "MCQs"]
						})
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						className: "glass border-0 text-xs",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/dashboard/chat/$filename",
							params: { filename: filenameParam },
							children: [/* @__PURE__ */ jsx(MessageSquare, { className: "h-3.5 w-3.5" }), "Chat"]
						})
					}),
					/* @__PURE__ */ jsxs(Button, {
						size: "sm",
						className: "col-span-2 bg-gradient-brand text-xs text-white shadow-md shadow-indigo-500/30 hover:opacity-95 sm:col-span-3",
						onClick: handleDownload,
						disabled: !note.download_url,
						children: [/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }), "Download"]
					})
				]
			})
		]
	}), /* @__PURE__ */ jsx(PreviewModal, {
		note,
		open: previewOpen,
		onOpenChange: setPreviewOpen
	})] });
});
//#endregion
//#region src/components/repositry/note-card-skeleton.tsx
function NoteCardSkeleton() {
	return /* @__PURE__ */ jsxs("div", {
		className: "glass relative h-full overflow-hidden rounded-2xl p-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ jsx("div", { className: "h-11 w-11 shrink-0 animate-pulse rounded-xl bg-muted/60" }), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0 flex-1 space-y-2",
					children: [/* @__PURE__ */ jsx("div", { className: "h-3 w-20 animate-pulse rounded-full bg-muted/60" }), /* @__PURE__ */ jsx("div", { className: "h-3 w-32 animate-pulse rounded-full bg-muted/40" })]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 space-y-2",
				children: [/* @__PURE__ */ jsx("div", { className: "h-4 w-4/5 animate-pulse rounded-md bg-muted/60" }), /* @__PURE__ */ jsx("div", { className: "h-4 w-3/5 animate-pulse rounded-md bg-muted/40" })]
			}),
			/* @__PURE__ */ jsx("div", { className: "mt-4 h-3 w-28 animate-pulse rounded-full bg-muted/40" }),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ jsx("div", { className: "h-9 animate-pulse rounded-md bg-muted/50" }),
					/* @__PURE__ */ jsx("div", { className: "h-9 animate-pulse rounded-md bg-muted/50" }),
					/* @__PURE__ */ jsx("div", { className: "h-9 animate-pulse rounded-md bg-muted/60" })
				]
			}),
			/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.8s_infinite]" }),
			/* @__PURE__ */ jsx("style", { children: `@keyframes shimmer { 100% { transform: translateX(100%); } }` })
		]
	});
}
//#endregion
//#region src/components/repositry/states.tsx
function EmptyState({ title = "No notes in your repository yet", description = "When notes are uploaded, they'll appear here organized by subject and unit.", onRetry }) {
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: "glass-strong col-span-full mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl p-10 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-indigo-500/30",
				children: /* @__PURE__ */ jsx(FolderOpen, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "mt-4 text-lg font-semibold",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1.5 max-w-sm text-sm text-muted-foreground",
				children: description
			}),
			onRetry && /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				className: "glass mt-5 border-0",
				onClick: onRetry,
				children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" }), " Refresh"]
			})
		]
	});
}
function NoResultsState({ query }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "glass col-span-full mx-auto flex w-full max-w-md flex-col items-center rounded-2xl p-8 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid h-12 w-12 place-items-center rounded-xl bg-muted/60",
				children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 text-muted-foreground" })
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "mt-3 font-semibold",
				children: "No matches found"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					"Nothing in your repository matches",
					" ",
					/* @__PURE__ */ jsxs("span", {
						className: "font-medium text-foreground",
						children: [
							"\"",
							query,
							"\""
						]
					}),
					"."
				]
			})
		]
	});
}
function ErrorState({ message, onRetry }) {
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: "glass-strong col-span-full mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl p-10 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid h-14 w-14 place-items-center rounded-2xl bg-destructive/15 text-destructive",
				children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "mt-4 text-lg font-semibold",
				children: "Couldn't load your repository"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1.5 max-w-sm text-sm text-muted-foreground",
				children: message ?? "Something went wrong while reaching the server."
			}),
			onRetry && /* @__PURE__ */ jsxs(Button, {
				size: "sm",
				className: "mt-5 bg-gradient-brand text-white",
				onClick: onRetry,
				children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" }), " Try again"]
			})
		]
	});
}
//#endregion
//#region src/routes/dashboard.repository.tsx?tsr-split=component
var ALL_SUBJECTS = "__all__";
var ALL_UNITS = "__all__";
var PAGE_SIZE = 8;
function RepositoryPage() {
	const [notes, setNotes] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [query, setQuery] = useState("");
	const [subject, setSubject] = useState(ALL_SUBJECTS);
	const [unit, setUnit] = useState(ALL_UNITS);
	const [page, setPage] = useState(1);
	const [reloadKey, setReloadKey] = useState(0);
	useEffect(() => {
		const saved = sessionStorage.getItem("eduvault_repository_search");
		if (!saved) return;
		setQuery(saved);
		sessionStorage.removeItem("eduvault_repository_search");
	}, []);
	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		setError(null);
		fetchRepository(controller.signal).then((data) => setNotes(data)).catch((err) => {
			if (err?.name === "AbortError") return;
			setError(err instanceof Error ? err.message : "Unknown error");
			setNotes([]);
		}).finally(() => setLoading(false));
		return () => controller.abort();
	}, [reloadKey]);
	const subjects = useMemo(() => {
		if (!notes) return [];
		return Array.from(new Set(notes.map((n) => n.subject).filter(Boolean))).sort();
	}, [notes]);
	const units = useMemo(() => {
		if (!notes) return [];
		return Array.from(new Set(notes.filter((n) => subject === ALL_SUBJECTS || n.subject === subject).map((n) => n.unit).filter(Boolean))).sort();
	}, [notes, subject]);
	const filtered = useMemo(() => {
		if (!notes) return [];
		const q = query.trim().toLowerCase();
		return notes.filter((n) => {
			const matchesSubject = subject === ALL_SUBJECTS || n.subject === subject;
			const matchesUnit = unit === ALL_UNITS || n.unit === unit;
			if (!matchesSubject || !matchesUnit) return false;
			if (!q) return true;
			return n.subject?.toLowerCase().includes(q) || n.unit?.toLowerCase().includes(q) || n.file_name?.toLowerCase().includes(q);
		});
	}, [
		notes,
		query,
		subject,
		unit
	]);
	useEffect(() => {
		setPage(1);
	}, [
		query,
		subject,
		unit
	]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const pageNotes = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const retry = () => setReloadKey((k) => k + 1);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(Header, { total: notes?.length ?? null }),
			/* @__PURE__ */ jsx(Toolbar, {
				query,
				onQuery: setQuery,
				subject,
				onSubject: (value) => {
					setSubject(value);
					setUnit(ALL_UNITS);
				},
				subjects,
				unit,
				onUnit: setUnit,
				units,
				disabled: loading || !!error
			}),
			/* @__PURE__ */ jsx("section", {
				"aria-live": "polite",
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: /* @__PURE__ */ jsx(AnimatePresence, {
					mode: "popLayout",
					children: loading ? Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						exit: { opacity: 0 },
						children: /* @__PURE__ */ jsx(NoteCardSkeleton, {})
					}, `sk-${i}`)) : error ? /* @__PURE__ */ jsx(ErrorState, {
						message: error,
						onRetry: retry
					}, "error") : (notes?.length ?? 0) === 0 ? /* @__PURE__ */ jsx(EmptyState, { onRetry: retry }, "empty") : filtered.length === 0 ? /* @__PURE__ */ jsx(NoResultsState, { query }, "no-results") : pageNotes.map((note, i) => /* @__PURE__ */ jsx(NoteCard, {
						note,
						index: (page - 1) * PAGE_SIZE + i,
						onDeleted: retry
					}, String(note.id ?? `${note.subject}-${note.file_name}-${i}`)))
				})
			}),
			!loading && !error && filtered.length > PAGE_SIZE && /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-center gap-3",
				children: [
					/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setPage((p) => Math.max(1, p - 1)),
						disabled: page === 1,
						children: "Previous"
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "text-sm text-muted-foreground",
						children: [
							"Page ",
							page,
							" of ",
							totalPages
						]
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
						disabled: page === totalPages,
						children: "Next"
					})
				]
			})
		]
	});
}
function Header({ total }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8",
		children: [/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl" }), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-start gap-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-indigo-500/30",
					children: /* @__PURE__ */ jsx(FolderGit2, { className: "h-5 w-5" })
				}), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold tracking-tight sm:text-3xl",
						children: "Repository"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Your knowledge vault — search, filter and study every note in one place."
					})]
				})]
			}), total !== null && /* @__PURE__ */ jsxs(Badge, {
				variant: "outline",
				className: "glass w-fit border-0 text-xs font-medium",
				children: [
					total,
					" ",
					total === 1 ? "note" : "notes"
				]
			})]
		})]
	});
}
function Toolbar({ query, onQuery, subject, onSubject, subjects, unit, onUnit, units, disabled }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "glass-strong grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-3 sm:flex sm:flex-wrap",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative min-w-0 flex-1",
			children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
				value: query,
				onChange: (e) => onQuery(e.target.value),
				placeholder: "Search by subject, unit or file name…",
				className: "h-10 border-0 bg-background/40 pl-9 focus-visible:ring-1",
				disabled: disabled && !query
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex shrink-0 items-center gap-2",
			children: [
				/* @__PURE__ */ jsx(SlidersHorizontal, { className: "hidden h-4 w-4 text-muted-foreground sm:block" }),
				/* @__PURE__ */ jsxs(Select, {
					value: subject,
					onValueChange: onSubject,
					disabled: disabled || subjects.length === 0,
					children: [/* @__PURE__ */ jsx(SelectTrigger, {
						className: "h-10 min-w-[10rem] border-0 bg-background/40",
						children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "All subjects" })
					}), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
						value: ALL_SUBJECTS,
						children: "All subjects"
					}), subjects.map((s) => /* @__PURE__ */ jsx(SelectItem, {
						value: s,
						children: s
					}, s))] })]
				}),
				/* @__PURE__ */ jsxs(Select, {
					value: unit,
					onValueChange: onUnit,
					disabled: disabled || units.length === 0,
					children: [/* @__PURE__ */ jsx(SelectTrigger, {
						className: "h-10 min-w-[8rem] border-0 bg-background/40",
						children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "All units" })
					}), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
						value: ALL_UNITS,
						children: "All units"
					}), units.map((u) => /* @__PURE__ */ jsx(SelectItem, {
						value: u,
						children: u
					}, u))] })]
				})
			]
		})]
	});
}
//#endregion
export { RepositoryPage as component };
