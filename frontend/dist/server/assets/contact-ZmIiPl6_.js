import { t as Button } from "./button-DRsC1qZi.js";
import { t as Logo } from "./logo-CDC2jnoK.js";
import { t as Badge } from "./badge-Cc0IblCb.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Code2, GraduationCap, Mail } from "lucide-react";
//#region src/routes/contact.tsx?tsr-split=component
var stack = [
	"React",
	"TypeScript",
	"TanStack Router",
	"Flask",
	"MongoDB",
	"Gemini AI"
];
function ContactPage() {
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
				/* @__PURE__ */ jsx("section", {
					className: "glass-strong overflow-hidden rounded-2xl p-6 sm:p-8",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx(Logo, {}),
							/* @__PURE__ */ jsx("h1", {
								className: "mt-6 text-3xl font-bold tracking-tight sm:text-4xl",
								children: "Contact Us"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground",
								children: "EduVault AI is built as a university-ready study platform for uploading notes, generating summaries, practicing MCQs, taking quizzes, and chatting with course material."
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "rounded-2xl border border-border/60 bg-background/45 p-5",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white",
									children: /* @__PURE__ */ jsx(GraduationCap, { className: "h-6 w-6" })
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "mt-4 text-xl font-semibold",
									children: "Abhay Kumar"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-muted-foreground",
									children: "Developer"
								}),
								/* @__PURE__ */ jsx(Button, {
									asChild: true,
									className: "mt-4 bg-gradient-brand text-white",
									children: /* @__PURE__ */ jsxs("a", {
										href: "mailto:abhayrajputg0007@gmail.com",
										children: [/* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }), "Email Developer"]
									})
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "grid gap-4 md:grid-cols-[1fr_1.2fr]",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "glass rounded-2xl p-5",
						children: [
							/* @__PURE__ */ jsx(Code2, { className: "h-5 w-5 text-primary" }),
							/* @__PURE__ */ jsx("h2", {
								className: "mt-3 text-lg font-semibold",
								children: "Project Name"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "EduVault AI"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "glass rounded-2xl p-5",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-semibold",
							children: "Technology Stack"
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: stack.map((item) => /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								children: item
							}, item))
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { ContactPage as component };
