import { t as Button } from "./button-DRsC1qZi.js";
import { t as Skeleton } from "./skeleton-wE5XVTSu.js";
import { n as apiFetch } from "./api-D3Wg_S4P.js";
import { t as currentUser } from "./auth-z1u2-BCU.js";
import { memo, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BookOpenCheck, FileText, HelpCircle, Library, ListChecks, Plus, Sparkles, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/lib/analytics.ts
async function fetchAnalytics(signal) {
	return apiFetch("/ai/analytics", { signal });
}
//#endregion
//#region src/routes/dashboard.index.tsx?tsr-split=component
function DashboardHome() {
	const [analytics, setAnalytics] = useState(null);
	const [error, setError] = useState(null);
	const user = currentUser();
	useEffect(() => {
		const controller = new AbortController();
		fetchAnalytics(controller.signal).then(setAnalytics).catch((err) => {
			if (err?.name !== "AbortError") setError(err instanceof Error ? err.message : "Unable to load dashboard");
		});
		return () => controller.abort();
	}, []);
	const recent = analytics?.recent_uploads ?? [];
	const stats = useMemo(() => [
		{
			label: "Files Uploaded",
			value: analytics?.files_uploaded ?? 0,
			icon: FileText
		},
		{
			label: "Summaries Generated",
			value: analytics?.summaries_generated ?? 0,
			icon: Sparkles
		},
		{
			label: "MCQs Generated",
			value: analytics?.mcqs_generated ?? 0,
			icon: ListChecks
		},
		{
			label: "Quiz Attempts",
			value: analytics?.quiz_attempts ?? 0,
			icon: BookOpenCheck
		},
		{
			label: "Average Quiz Score",
			value: `${analytics?.average_quiz_score ?? 0}%`,
			icon: TrendingUp
		}
	], [analytics]);
	const weeklyActivity = useMemo(() => {
		return (analytics?.activity ?? []).slice(-7).map((d) => ({
			...d,
			label: new Date(d.date).toLocaleDateString(void 0, { weekday: "short" })
		}));
	}, [analytics]);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx("section", {
				className: "glass-strong overflow-hidden rounded-2xl p-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium text-muted-foreground",
							children: "Welcome back"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-1 text-3xl font-bold tracking-tight",
							children: user?.name || user?.email || "Student"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 max-w-2xl text-sm text-muted-foreground",
							children: "Upload notes, generate study material, and jump back into your latest files."
						})
					] }), /* @__PURE__ */ jsx(Button, {
						asChild: true,
						className: "w-fit bg-gradient-brand text-white shadow-lg shadow-indigo-500/30",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/upload",
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "Upload notes"]
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
				children: analytics === null && !error ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-28 rounded-2xl" }, i)) : stats.map((stat) => /* @__PURE__ */ jsx(StatCard, {
					label: stat.label,
					value: stat.value,
					icon: stat.icon
				}, stat.label))
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive",
				children: error
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-6 lg:grid-cols-[1.5fr_1fr]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "glass-strong rounded-2xl p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-semibold",
							children: "Recent uploads"
						}), /* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/dashboard/repository",
								children: "View all"
							})
						})]
					}), analytics === null ? /* @__PURE__ */ jsx(Skeleton, { className: "h-40 rounded-xl" }) : recent.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "rounded-xl border border-dashed p-6 text-sm text-muted-foreground",
						children: "No uploads yet. Add your first PDF or presentation to start studying."
					}) : /* @__PURE__ */ jsx("div", {
						className: "divide-y",
						children: recent.map((note) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-4 py-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("p", {
									className: "truncate text-sm font-medium",
									children: note.file_name
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: [
										note.subject,
										note.unit,
										note.file_type
									].filter(Boolean).join(" · ")
								})]
							}), /* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "ghost",
								size: "sm",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/dashboard/summary/$filename",
									params: { filename: note.file_name },
									children: "Summary"
								})
							})]
						}, note.id))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "glass-strong rounded-2xl p-5",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-semibold",
							children: "Weekly activity"
						}), analytics === null ? /* @__PURE__ */ jsx(Skeleton, { className: "mt-4 h-48 rounded-xl" }) : weeklyActivity.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: "No activity yet this week."
						}) : /* @__PURE__ */ jsx("div", {
							className: "mt-4 h-48",
							children: /* @__PURE__ */ jsx(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ jsxs(BarChart, {
									data: weeklyActivity,
									children: [
										/* @__PURE__ */ jsx(CartesianGrid, {
											strokeDasharray: "3 3",
											className: "stroke-border/50"
										}),
										/* @__PURE__ */ jsx(XAxis, {
											dataKey: "label",
											tick: { fontSize: 11 }
										}),
										/* @__PURE__ */ jsx(YAxis, {
											allowDecimals: false,
											tick: { fontSize: 11 }
										}),
										/* @__PURE__ */ jsx(Tooltip, {}),
										/* @__PURE__ */ jsx(Bar, {
											dataKey: "uploads",
											name: "Uploads",
											fill: "var(--brand-indigo)",
											radius: 4
										}),
										/* @__PURE__ */ jsx(Bar, {
											dataKey: "quizzes",
											name: "Quizzes",
											fill: "var(--brand-purple)",
											radius: 4
										})
									]
								})
							})
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "glass-strong rounded-2xl p-5",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-semibold",
							children: "Quick actions"
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-4 grid gap-3",
							children: [
								/* @__PURE__ */ jsx(Action, {
									to: "/upload",
									icon: Plus,
									label: "Upload new notes"
								}),
								/* @__PURE__ */ jsx(Action, {
									to: "/dashboard/repository",
									icon: Library,
									label: "Browse repository"
								}),
								/* @__PURE__ */ jsx(Action, {
									to: "/dashboard/repository",
									icon: HelpCircle,
									label: "Start a quiz"
								})
							]
						})]
					})]
				})]
			})
		]
	});
}
var StatCard = memo(function StatCard({ label, value, icon: Icon }) {
	return /* @__PURE__ */ jsx("div", {
		className: "glass rounded-2xl p-5",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: label
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-3xl font-bold",
				children: value
			})] }), /* @__PURE__ */ jsx("div", {
				className: "grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white",
				children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
			})]
		})
	});
});
function Action({ to, icon: Icon, label }) {
	return /* @__PURE__ */ jsx(Button, {
		asChild: true,
		variant: "outline",
		className: "justify-start",
		children: /* @__PURE__ */ jsxs(Link, {
			to,
			children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }), label]
		})
	});
}
//#endregion
export { DashboardHome as component };
