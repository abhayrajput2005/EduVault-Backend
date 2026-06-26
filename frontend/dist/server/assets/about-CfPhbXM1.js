import { t as Button } from "./button-DRsC1qZi.js";
import { t as Logo } from "./logo-CDC2jnoK.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Bot, FileText, Library, ShieldCheck } from "lucide-react";
//#region src/routes/about.tsx?tsr-split=component
var highlights = [
	{
		icon: FileText,
		title: "AI summaries",
		text: "Extracts study-friendly summaries, key points, and important topics from uploaded notes."
	},
	{
		icon: Library,
		title: "Repository",
		text: "Organizes PDFs and presentations by subject and unit with search, filters, preview, and download."
	},
	{
		icon: Bot,
		title: "AI tutor",
		text: "Lets students ask contextual questions against their own notes and continue prior conversations."
	},
	{
		icon: ShieldCheck,
		title: "Admin control",
		text: "Provides moderation, user visibility, analytics, and approval workflows for managed deployments."
	}
];
function AboutPage() {
	return /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-5xl space-y-6",
			children: [
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "ghost",
					className: "px-0",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), "Home"]
					})
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "glass-strong rounded-2xl p-6 sm:p-8",
					children: [
						/* @__PURE__ */ jsx(Logo, {}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-6 text-3xl font-bold tracking-tight sm:text-4xl",
							children: "About EduVault AI"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground",
							children: "EduVault AI is an AI-powered study platform for students who want one place to store course notes, generate learning material, practice quizzes, and revisit progress. It combines a React frontend with a Flask, MongoDB, and Gemini-backed API."
						})
					]
				}),
				/* @__PURE__ */ jsx("section", {
					className: "grid gap-4 sm:grid-cols-2",
					children: highlights.map((item) => {
						const Icon = item.icon;
						return /* @__PURE__ */ jsxs("article", {
							className: "glass rounded-2xl p-5",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white",
									children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "mt-4 text-lg font-semibold",
									children: item.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground",
									children: item.text
								})
							]
						}, item.title);
					})
				})
			]
		})
	});
}
//#endregion
export { AboutPage as component };
