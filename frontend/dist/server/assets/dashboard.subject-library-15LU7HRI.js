import { t as Button } from "./button-DRsC1qZi.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.js";
import { t as Badge } from "./badge-Cc0IblCb.js";
import { t as Skeleton } from "./skeleton-wE5XVTSu.js";
import { t as Input } from "./input-DicJzR9-.js";
import { t as Label } from "./label-B4PTMSG2.js";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.js";
import { a as fetchSubjectFiles, c as formatFileSize, d as setSubjectBookmark, f as submitMaterialRequest, i as fetchFileRatings, l as rateLibraryFile, n as FILE_CATEGORY_ORDER, o as fetchSubjectSections, r as downloadLibraryFile, s as fetchSubjectSuggestions, t as FILE_CATEGORY_LABELS, u as searchSubjects } from "./subject-library-DukdGpDv.js";
import { t as Textarea } from "./textarea-DBn9CRiI.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { BookOpen, Bookmark, Building2, Calendar, Download, Eye, FileText, ListChecks, MessageSquare, Search, Send, Sparkles, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
//#region src/routes/dashboard.subject-library.tsx?tsr-split=component
function SubjectLibraryPage() {
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [searchResults, setSearchResults] = useState([]);
	const [selectedCode, setSelectedCode] = useState(null);
	const [subject, setSubject] = useState(null);
	const [groups, setGroups] = useState(null);
	const [loading, setLoading] = useState(false);
	const [filesLoading, setFilesLoading] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(0);
	const [requestOpen, setRequestOpen] = useState(false);
	const [requestMessage, setRequestMessage] = useState("");
	const [submittingRequest, setSubmittingRequest] = useState(false);
	const [previewFile, setPreviewFile] = useState(null);
	const [ratingFile, setRatingFile] = useState(null);
	const [sections, setSections] = useState(null);
	useEffect(() => {
		const controller = new AbortController();
		fetchSubjectSections(controller.signal).then(setSections).catch(() => setSections(null));
		return () => controller.abort();
	}, []);
	useEffect(() => {
		if (query.trim().length < 2) {
			setSuggestions([]);
			return;
		}
		const controller = new AbortController();
		const timer = setTimeout(() => {
			fetchSubjectSuggestions(query.trim(), controller.signal).then(setSuggestions).catch(() => setSuggestions([]));
		}, 250);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [query]);
	const runSearch = useCallback(async (code, pageNum = 1) => {
		const normalized = code.trim().toUpperCase();
		if (!normalized) return;
		setLoading(true);
		setError(null);
		setSelectedCode(normalized);
		setShowSuggestions(false);
		try {
			const result = await searchSubjects(normalized, pageNum);
			setSearchResults(result.items);
			if (result.items.length === 1) await loadSubjectFiles(result.items[0].subject_code, 1);
			else if (result.items.length === 0) {
				setSubject(null);
				setGroups(null);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Search failed");
			setSearchResults([]);
		} finally {
			setLoading(false);
		}
	}, []);
	const loadSubjectFiles = useCallback(async (code, pageNum = 1) => {
		setFilesLoading(true);
		setError(null);
		setSelectedCode(code);
		try {
			const data = await fetchSubjectFiles(code, { page: pageNum });
			setSubject(data.subject);
			setGroups(data.groups);
			setPage(data.page);
			setPages(data.pages);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to load files");
			setSubject(null);
			setGroups(null);
		} finally {
			setFilesLoading(false);
		}
	}, []);
	const totalFiles = useMemo(() => {
		if (!groups) return 0;
		return FILE_CATEGORY_ORDER.reduce((sum, key) => sum + (groups[key]?.length ?? 0), 0);
	}, [groups]);
	async function handleRequest() {
		if (!selectedCode) return;
		setSubmittingRequest(true);
		try {
			await submitMaterialRequest({
				subject_code: selectedCode,
				subject_name: subject?.subject_name,
				message: requestMessage
			});
			toast.success("Request submitted for admin review");
			setRequestOpen(false);
			setRequestMessage("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Request failed");
		} finally {
			setSubmittingRequest(false);
		}
	}
	async function toggleBookmark(subjectItem) {
		try {
			const next = !subjectItem.bookmarked;
			await setSubjectBookmark(subjectItem.id, next);
			toast.success(next ? "Subject bookmarked" : "Bookmark removed");
			setSections(await fetchSubjectSections());
			if (subject?.id === subjectItem.id) setSubject({
				...subject,
				bookmarked: next
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Bookmark update failed");
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8",
				children: [
					/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl" }),
					/* @__PURE__ */ jsx("div", {
						className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-indigo-500/30",
								children: /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
								className: "text-2xl font-bold tracking-tight sm:text-3xl",
								children: "Subject Library"
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Search by subject code (e.g. CSE316) to browse official study materials."
							})] })]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative mt-6 max-w-xl",
						children: [
							/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
							/* @__PURE__ */ jsx(Input, {
								value: query,
								onChange: (e) => {
									setQuery(e.target.value.toUpperCase());
									setShowSuggestions(true);
								},
								onKeyDown: (e) => {
									if (e.key === "Enter") runSearch(query);
								},
								placeholder: "Enter subject code, e.g. CSE316",
								className: "h-11 border-0 bg-background/40 pl-9 uppercase focus-visible:ring-1"
							}),
							showSuggestions && suggestions.length > 0 && /* @__PURE__ */ jsx("div", {
								className: "absolute z-20 mt-1 w-full overflow-hidden rounded-xl border bg-popover shadow-lg",
								children: suggestions.map((code) => /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "block w-full px-4 py-2 text-left text-sm hover:bg-accent",
									onClick: () => {
										setQuery(code);
										runSearch(code.split(" - ")[0]);
									},
									children: code
								}, code))
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ jsx(Button, {
							className: "bg-gradient-brand text-white",
							onClick: () => void runSearch(query),
							disabled: !query.trim() || loading,
							children: "Search"
						}), selectedCode && /* @__PURE__ */ jsx(Button, {
							variant: "outline",
							onClick: () => setRequestOpen(true),
							children: "Request Material"
						})]
					})
				]
			}),
			!selectedCode && sections && /* @__PURE__ */ jsxs("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ jsx(SubjectSection, {
						title: "Trending Subjects",
						subjects: sections.trending,
						onOpen: (code) => void loadSubjectFiles(code),
						onBookmark: (item) => void toggleBookmark(item)
					}),
					/* @__PURE__ */ jsx(SubjectSection, {
						title: "Recently Added",
						subjects: sections.recently_added,
						onOpen: (code) => void loadSubjectFiles(code),
						onBookmark: (item) => void toggleBookmark(item)
					}),
					/* @__PURE__ */ jsx(SubjectSection, {
						title: "Bookmarked Subjects",
						subjects: sections.bookmarked,
						empty: "Bookmarked subjects will appear here.",
						onOpen: (code) => void loadSubjectFiles(code),
						onBookmark: (item) => void toggleBookmark(item)
					})
				]
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive",
				children: error
			}),
			loading && /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-24 rounded-2xl" }, i))
			}),
			!loading && searchResults.length > 1 && !subject && /* @__PURE__ */ jsxs("section", {
				className: "glass-strong rounded-2xl p-4",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Matching subjects"
				}), /* @__PURE__ */ jsx("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: searchResults.map((item) => /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => void loadSubjectFiles(item.subject_code),
						className: "glass rounded-xl p-4 text-left transition hover:bg-accent/40",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "font-semibold",
								children: item.subject_code
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-sm text-muted-foreground",
								children: item.subject_name
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									item.file_count,
									" file",
									item.file_count === 1 ? "" : "s"
								]
							})
						]
					}, item.id))
				})]
			}),
			filesLoading && /* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-64 rounded-xl" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-40 rounded-2xl" })]
			}),
			!filesLoading && selectedCode && subject && groups && /* @__PURE__ */ jsxs("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "glass-strong rounded-2xl p-5",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx(Badge, {
									className: "bg-gradient-brand border-0 text-white",
									children: subject.subject_code
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "mt-2 text-xl font-bold",
									children: subject.subject_name
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [
										subject.department,
										subject.semester && `Sem ${subject.semester}`,
										subject.unit
									].filter(Boolean).join(" · ")
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }),
												subject.downloads,
												" downloads"
											]
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5" }),
												subject.average_rating || "0",
												" (",
												subject.total_ratings,
												")"
											]
										}),
										subject.last_updated && /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5" }), new Date(subject.last_updated).toLocaleDateString()]
										})
									]
								})
							] }), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsxs(Badge, {
									variant: "outline",
									children: [totalFiles, " materials"]
								}), /* @__PURE__ */ jsx(Button, {
									variant: "outline",
									size: "icon",
									onClick: () => void toggleBookmark(subject),
									"aria-label": subject.bookmarked ? "Remove bookmark" : "Bookmark subject",
									children: /* @__PURE__ */ jsx(Bookmark, { className: subject.bookmarked ? "h-4 w-4 fill-current" : "h-4 w-4" })
								})]
							})]
						})
					}),
					totalFiles === 0 ? /* @__PURE__ */ jsx(EmptyMaterialsState, {
						subjectCode: subject.subject_code,
						onRequest: () => setRequestOpen(true)
					}) : /* @__PURE__ */ jsxs(Tabs, {
						defaultValue: FILE_CATEGORY_ORDER.find((k) => groups[k]?.length) ?? "pdf",
						children: [/* @__PURE__ */ jsx(TabsList, {
							className: "flex h-auto flex-wrap gap-1",
							children: FILE_CATEGORY_ORDER.map((cat) => /* @__PURE__ */ jsxs(TabsTrigger, {
								value: cat,
								disabled: !groups[cat]?.length,
								children: [
									FILE_CATEGORY_LABELS[cat],
									" (",
									groups[cat]?.length ?? 0,
									")"
								]
							}, cat))
						}), FILE_CATEGORY_ORDER.map((cat) => /* @__PURE__ */ jsx(TabsContent, {
							value: cat,
							className: "mt-4",
							children: /* @__PURE__ */ jsx("div", {
								className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
								children: /* @__PURE__ */ jsx(AnimatePresence, {
									mode: "popLayout",
									children: (groups[cat] ?? []).map((file, i) => /* @__PURE__ */ jsx(FileCard, {
										file,
										index: i,
										onPreview: () => setPreviewFile(file),
										onRate: () => setRatingFile(file)
									}, file.id))
								})
							})
						}, cat))]
					}),
					pages > 1 && /* @__PURE__ */ jsxs("div", {
						className: "flex justify-center gap-3",
						children: [
							/* @__PURE__ */ jsx(Button, {
								variant: "outline",
								disabled: page <= 1,
								onClick: () => subject && void loadSubjectFiles(subject.subject_code, page - 1),
								children: "Previous"
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "self-center text-sm text-muted-foreground",
								children: [
									"Page ",
									page,
									" of ",
									pages
								]
							}),
							/* @__PURE__ */ jsx(Button, {
								variant: "outline",
								disabled: page >= pages,
								onClick: () => subject && void loadSubjectFiles(subject.subject_code, page + 1),
								children: "Next"
							})
						]
					})
				]
			}),
			!loading && !filesLoading && selectedCode && !subject && searchResults.length <= 1 && /* @__PURE__ */ jsx(EmptyMaterialsState, {
				subjectCode: selectedCode,
				onRequest: () => setRequestOpen(true)
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: requestOpen,
				onOpenChange: setRequestOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Request study material" }) }),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Subject code" }), /* @__PURE__ */ jsx(Input, {
							value: selectedCode ?? "",
							readOnly: true,
							className: "mt-1 uppercase"
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
							htmlFor: "request-message",
							children: "Message (optional)"
						}), /* @__PURE__ */ jsx(Textarea, {
							id: "request-message",
							value: requestMessage,
							onChange: (e) => setRequestMessage(e.target.value),
							placeholder: "Describe what you need — unit notes, lab manual, past papers…",
							className: "mt-1 min-h-[100px]"
						})] })]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setRequestOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ jsxs(Button, {
						className: "bg-gradient-brand text-white",
						onClick: () => void handleRequest(),
						disabled: submittingRequest,
						children: [/* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }), submittingRequest ? "Submitting…" : "Submit request"]
					})] })
				] })
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!previewFile,
				onOpenChange: (open) => !open && setPreviewFile(null),
				children: /* @__PURE__ */ jsx(DialogContent, {
					className: "max-w-lg",
					children: previewFile && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, {
						className: "truncate pr-6",
						children: previewFile.original_name
					}) }), /* @__PURE__ */ jsxs("div", {
						className: "space-y-3 text-sm",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ jsx(Badge, { children: previewFile.category_label }),
								/* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									children: previewFile.file_type
								}),
								/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									children: formatFileSize(previewFile.file_size)
								})
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-muted-foreground",
							children: "Use Download to save this file, or open AI tools below."
						})]
					})] })
				})
			}),
			/* @__PURE__ */ jsx(RatingDialog, {
				file: ratingFile,
				onClose: () => setRatingFile(null)
			})
		]
	});
}
function FileCard({ file, index, onPreview, onRate }) {
	return /* @__PURE__ */ jsxs(motion.article, {
		initial: {
			opacity: 0,
			y: 12
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: { opacity: 0 },
		transition: { delay: Math.min(index, 6) * .04 },
		className: "glass flex h-full flex-col rounded-2xl p-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ jsx("div", {
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white",
				children: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" })
			}), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "line-clamp-2 text-sm font-semibold leading-snug",
						title: file.original_name,
						children: file.original_name
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							file.unit || file.category_label,
							" · ",
							formatFileSize(file.file_size)
						]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-1 flex items-center gap-1 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5" }),
							file.average_rating || "0",
							" (",
							file.total_ratings,
							") · ",
							file.downloads,
							" downloads"
						]
					})
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-4 grid grid-cols-2 gap-2",
			children: [
				/* @__PURE__ */ jsxs(Button, {
					size: "sm",
					variant: "outline",
					className: "text-xs",
					onClick: onPreview,
					children: [/* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }), "View"]
				}),
				/* @__PURE__ */ jsxs(Button, {
					size: "sm",
					variant: "outline",
					className: "text-xs",
					onClick: () => downloadLibraryFile(file).catch((err) => toast.error(err instanceof Error ? err.message : "Download failed")),
					children: [/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }), "Download"]
				}),
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					size: "sm",
					variant: "outline",
					className: "text-xs",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/dashboard/summary/$filename",
						params: { filename: file.filename },
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), "Summary"]
					})
				}),
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					size: "sm",
					variant: "outline",
					className: "text-xs",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/dashboard/quiz/$filename",
						params: { filename: file.filename },
						children: [/* @__PURE__ */ jsx(ListChecks, { className: "h-3.5 w-3.5" }), "Quiz"]
					})
				}),
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					size: "sm",
					className: "col-span-2 bg-gradient-brand text-xs text-white",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/dashboard/chat/$filename",
						params: { filename: file.filename },
						children: [/* @__PURE__ */ jsx(MessageSquare, { className: "h-3.5 w-3.5" }), "Ask AI"]
					})
				}),
				/* @__PURE__ */ jsxs(Button, {
					size: "sm",
					variant: "outline",
					className: "col-span-2 text-xs",
					onClick: onRate,
					children: [/* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5" }), "Rating & Feedback"]
				})
			]
		})]
	});
}
function SubjectSection({ title, subjects, empty = "No subjects yet.", onOpen, onBookmark }) {
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
		className: "mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground",
		children: title
	}), subjects.length === 0 ? /* @__PURE__ */ jsx("p", {
		className: "rounded-2xl border border-dashed p-5 text-sm text-muted-foreground",
		children: empty
	}) : /* @__PURE__ */ jsx("div", {
		className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
		children: subjects.map((subject) => /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => onOpen(subject.subject_code),
			className: "glass rounded-2xl p-4 text-left transition hover:bg-accent/40",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Badge, {
					className: "bg-gradient-brand border-0 text-white",
					children: subject.subject_code
				}), /* @__PURE__ */ jsx("h3", {
					className: "mt-2 font-semibold",
					children: subject.subject_name
				})] }), /* @__PURE__ */ jsx("span", {
					role: "button",
					tabIndex: 0,
					onClick: (event) => {
						event.stopPropagation();
						onBookmark(subject);
					},
					onKeyDown: (event) => {
						if (event.key === "Enter") {
							event.stopPropagation();
							onBookmark(subject);
						}
					},
					className: "rounded-lg border p-2 text-muted-foreground hover:text-foreground",
					"aria-label": subject.bookmarked ? "Remove bookmark" : "Bookmark subject",
					children: /* @__PURE__ */ jsx(Bookmark, { className: subject.bookmarked ? "h-4 w-4 fill-current" : "h-4 w-4" })
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-3 grid gap-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1",
						children: [/* @__PURE__ */ jsx(Building2, { className: "h-3.5 w-3.5" }), [subject.department, subject.semester && `Sem ${subject.semester}`].filter(Boolean).join(" · ") || "General"]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1",
						children: [
							/* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }),
							subject.file_count,
							" files"
						]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1",
						children: [
							/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }),
							subject.downloads,
							" downloads"
						]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1",
						children: [
							/* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5" }),
							subject.average_rating || "0",
							" average rating"
						]
					})
				]
			})]
		}, subject.id))
	})] });
}
function RatingDialog({ file, onClose }) {
	const [ratings, setRatings] = useState(null);
	const [rating, setRating] = useState(5);
	const [feedback, setFeedback] = useState("");
	const [submitting, setSubmitting] = useState(false);
	useEffect(() => {
		if (!file) return;
		const controller = new AbortController();
		fetchFileRatings(file.id, controller.signal).then(setRatings).catch(() => setRatings(null));
		return () => controller.abort();
	}, [file]);
	async function submit() {
		if (!file) return;
		setSubmitting(true);
		try {
			await rateLibraryFile(file.id, {
				rating,
				feedback
			});
			toast.success("Thanks for the feedback");
			setRatings(await fetchFileRatings(file.id));
			setFeedback("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Rating failed");
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ jsx(Dialog, {
		open: !!file,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, { children: [
			/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Rating & Feedback" }) }),
			file && /* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "truncate text-sm font-medium",
						children: file.original_name
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-xs text-muted-foreground",
						children: [
							ratings?.average_rating ?? file.average_rating,
							" average ·",
							" ",
							ratings?.total_ratings ?? file.total_ratings,
							" ratings"
						]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Rating" }), /* @__PURE__ */ jsxs(Select, {
						value: String(rating),
						onValueChange: (value) => setRating(Number(value)),
						children: [/* @__PURE__ */ jsx(SelectTrigger, {
							className: "mt-1",
							children: /* @__PURE__ */ jsx(SelectValue, {})
						}), /* @__PURE__ */ jsx(SelectContent, { children: [
							5,
							4,
							3,
							2,
							1
						].map((value) => /* @__PURE__ */ jsxs(SelectItem, {
							value: String(value),
							children: [
								value,
								" star",
								value === 1 ? "" : "s"
							]
						}, value)) })]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "file-feedback",
						children: "Feedback"
					}), /* @__PURE__ */ jsx(Textarea, {
						id: "file-feedback",
						value: feedback,
						onChange: (event) => setFeedback(event.target.value),
						className: "mt-1",
						placeholder: "Share what helped or what could be improved."
					})] }),
					/* @__PURE__ */ jsx("div", {
						className: "max-h-40 space-y-2 overflow-y-auto",
						children: (ratings?.reviews ?? []).map((review) => /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border p-3 text-sm",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-medium",
									children: review.student_name
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-xs text-muted-foreground",
									children: [review.rating, "/5"]
								})]
							}), review.feedback && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-muted-foreground",
								children: review.feedback
							})]
						}, review.id))
					})
				]
			}),
			/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
				variant: "outline",
				onClick: onClose,
				children: "Close"
			}), /* @__PURE__ */ jsx(Button, {
				className: "bg-gradient-brand text-white",
				onClick: () => void submit(),
				disabled: submitting,
				children: "Submit"
			})] })
		] })
	});
}
function EmptyMaterialsState({ subjectCode, onRequest }) {
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: "glass-strong flex flex-col items-center rounded-3xl px-6 py-14 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground",
				children: /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ jsxs("h3", {
				className: "mt-4 text-lg font-semibold",
				children: ["No materials yet for ", subjectCode]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 max-w-md text-sm text-muted-foreground",
				children: "We could not find uploaded study materials for this subject code. You can request them and an admin will review your request."
			}),
			/* @__PURE__ */ jsx(Button, {
				className: "mt-5 bg-gradient-brand text-white",
				onClick: onRequest,
				children: "Request Material"
			})
		]
	});
}
//#endregion
export { SubjectLibraryPage as component };
