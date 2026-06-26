import { t as Button } from "./button-DRsC1qZi.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.js";
import { t as Badge } from "./badge-Cc0IblCb.js";
import { t as Skeleton } from "./skeleton-wE5XVTSu.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BQuBX6bn.js";
import { a as fetchAdminUsers, i as fetchAdminUploads, n as deleteAdminUpload, r as fetchAdminAnalytics, t as approveAdminUpload } from "./admin-ChwDnqOW.js";
import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { BarChart3, BookOpen, Brain, Check, CheckCircle2, Clock, Download, FileText, Library, MessageSquare, Trash2, Trophy, Users } from "lucide-react";
//#region src/routes/admin.index.tsx?tsr-split=component
function AdminDashboard() {
	const [analytics, setAnalytics] = useState(null);
	const [users, setUsers] = useState(null);
	const [uploads, setUploads] = useState(null);
	const [loading, setLoading] = useState(true);
	const load = useCallback(async (signal) => {
		setLoading(true);
		try {
			const [a, u, up] = await Promise.all([
				fetchAdminAnalytics(signal),
				fetchAdminUsers(signal),
				fetchAdminUploads(signal)
			]);
			setAnalytics(a);
			setUsers(u);
			setUploads(up);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to load admin data");
		} finally {
			setLoading(false);
		}
	}, []);
	useEffect(() => {
		const controller = new AbortController();
		load(controller.signal);
		return () => controller.abort();
	}, [load]);
	async function handleApprove(id) {
		try {
			await approveAdminUpload(id);
			toast.success("Upload approved");
			load();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Approve failed");
		}
	}
	async function handleDelete(id, filename) {
		if (!window.confirm(`Delete "${filename}" permanently?`)) return;
		try {
			await deleteAdminUpload(id);
			toast.success("Upload deleted");
			load();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Delete failed");
		}
	}
	const stats = [
		{
			label: "Total Users",
			value: analytics?.users ?? 0,
			icon: Users
		},
		{
			label: "Total Subjects",
			value: analytics?.total_subjects ?? 0,
			icon: Library
		},
		{
			label: "Total Files",
			value: analytics?.total_files ?? 0,
			icon: FileText
		},
		{
			label: "Downloads",
			value: analytics?.total_downloads ?? 0,
			icon: Download
		},
		{
			label: "Summaries",
			value: analytics?.summaries_generated ?? 0,
			icon: Brain
		},
		{
			label: "Quizzes",
			value: analytics?.quizzes_generated ?? 0,
			icon: Trophy
		},
		{
			label: "Tutor Sessions",
			value: analytics?.ai_tutor_sessions ?? 0,
			icon: MessageSquare
		},
		{
			label: "Pending Requests",
			value: analytics?.pending_requests ?? 0,
			icon: Clock
		},
		{
			label: "User Uploads",
			value: analytics?.uploads ?? 0,
			icon: CheckCircle2
		},
		{
			label: "Quiz Attempts",
			value: analytics?.quiz_attempts ?? 0,
			icon: BarChart3
		},
		{
			label: "Avg Quiz Score",
			value: `${analytics?.average_quiz_score ?? 0}%`,
			icon: BarChart3
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("section", { children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-bold tracking-tight",
					children: "Admin Dashboard"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Manage users, review uploads, and monitor platform analytics."
				}),
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					className: "mt-3",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/admin/subject-library",
						children: [/* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4" }), "Subject Library Management"]
					})
				})
			] }),
			/* @__PURE__ */ jsx("section", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: loading ? Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-24 rounded-2xl" }, i)) : stats.map((s) => {
					const Icon = s.icon;
					return /* @__PURE__ */ jsx("div", {
						className: "glass rounded-2xl p-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: s.label
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-2xl font-bold",
								children: s.value
							})] }), /* @__PURE__ */ jsx("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white",
								children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
							})]
						})
					}, s.label);
				})
			}),
			!loading && analytics && /* @__PURE__ */ jsxs("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "glass-strong rounded-2xl p-4",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Recent Uploads"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3 space-y-2",
						children: analytics.recent_uploads.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "No library uploads yet."
						}) : analytics.recent_uploads.map((item) => /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border bg-background/40 p-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "truncate text-sm font-medium",
								children: item.original_name
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-muted-foreground",
								children: [
									item.subject_code,
									" · ",
									item.subject_name
								]
							})]
						}, item.id))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "glass-strong rounded-2xl p-4",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Trending Subjects"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3 space-y-2",
						children: analytics.trending_subjects.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "No subject activity yet."
						}) : analytics.trending_subjects.map((item) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-3 rounded-xl border bg-background/40 p-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "font-mono text-sm font-semibold",
									children: item.subject_code
								}), /* @__PURE__ */ jsx("div", {
									className: "truncate text-xs text-muted-foreground",
									children: item.subject_name
								})]
							}), /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								children: [item.downloads, " downloads"]
							})]
						}, item.id))
					})]
				})]
			}),
			/* @__PURE__ */ jsxs(Tabs, {
				defaultValue: "uploads",
				className: "glass-strong rounded-2xl p-4 sm:p-6",
				children: [
					/* @__PURE__ */ jsxs(TabsList, { children: [/* @__PURE__ */ jsx(TabsTrigger, {
						value: "uploads",
						children: "Uploaded Notes"
					}), /* @__PURE__ */ jsx(TabsTrigger, {
						value: "users",
						children: "Users"
					})] }),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "uploads",
						className: "mt-4",
						children: loading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-64 w-full rounded-xl" }) : /* @__PURE__ */ jsx("div", {
							className: "overflow-x-auto rounded-xl border",
							children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
								/* @__PURE__ */ jsx(TableHead, { children: "File" }),
								/* @__PURE__ */ jsx(TableHead, { children: "Subject" }),
								/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
								/* @__PURE__ */ jsx(TableHead, { children: "AI" }),
								/* @__PURE__ */ jsx(TableHead, {
									className: "text-right",
									children: "Actions"
								})
							] }) }), /* @__PURE__ */ jsx(TableBody, { children: (uploads ?? []).length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
								colSpan: 5,
								className: "text-center text-muted-foreground",
								children: "No uploads yet."
							}) }) : (uploads ?? []).map((note) => /* @__PURE__ */ jsxs(TableRow, { children: [
								/* @__PURE__ */ jsx(TableCell, {
									className: "max-w-[200px] truncate font-medium",
									children: note.filename
								}),
								/* @__PURE__ */ jsxs(TableCell, { children: [
									note.subject,
									" · ",
									note.unit
								] }),
								/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
									variant: note.approved ? "default" : "secondary",
									children: note.approved ? "Approved" : "Pending"
								}) }),
								/* @__PURE__ */ jsxs(TableCell, {
									className: "text-xs text-muted-foreground",
									children: [note.hasSummary && "Summary ", note.hasMcqs && "MCQs"]
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-right",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex justify-end gap-1",
										children: [!note.approved && /* @__PURE__ */ jsx(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => handleApprove(note.id),
											"aria-label": "Approve",
											children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-600" })
										}), /* @__PURE__ */ jsx(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => handleDelete(note.id, note.filename),
											"aria-label": "Delete",
											children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" })
										})]
									})
								})
							] }, note.id)) })] })
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "users",
						className: "mt-4",
						children: loading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-64 w-full rounded-xl" }) : /* @__PURE__ */ jsx("div", {
							className: "overflow-x-auto rounded-xl border",
							children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
								/* @__PURE__ */ jsx(TableHead, { children: "Name" }),
								/* @__PURE__ */ jsx(TableHead, { children: "Email" }),
								/* @__PURE__ */ jsx(TableHead, { children: "Role" })
							] }) }), /* @__PURE__ */ jsx(TableBody, { children: (users ?? []).map((user) => /* @__PURE__ */ jsxs(TableRow, { children: [
								/* @__PURE__ */ jsx(TableCell, {
									className: "font-medium",
									children: user.name || "—"
								}),
								/* @__PURE__ */ jsx(TableCell, { children: user.email }),
								/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
									variant: user.isAdmin ? "default" : "outline",
									children: user.isAdmin ? "Admin" : "Student"
								}) })
							] }, user.id)) })] })
						})
					})
				]
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };
