import { n as cn, t as Button } from "./button-DRsC1qZi.js";
import * as React from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, BookOpen, ChevronDown, FileUp, HelpCircle, ListChecks, MessageSquare, Sparkles } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
//#region src/components/ui/accordion.tsx
var Accordion = AccordionPrimitive.Root;
var AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, {
	className: "flex",
	children: /* @__PURE__ */ jsxs(AccordionPrimitive.Trigger, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
var AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Content, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ jsx("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
//#endregion
//#region src/routes/help.tsx?tsr-split=component
var guides = [
	{
		icon: FileUp,
		title: "Upload Guide",
		text: "Choose a PDF, PPT, or PPTX file, add the subject and unit, then upload it into your repository."
	},
	{
		icon: Sparkles,
		title: "Summary Guide",
		text: "Open any note from the repository and select Summary to generate or regenerate key study points."
	},
	{
		icon: ListChecks,
		title: "MCQ and Quiz Guide",
		text: "Generate MCQs after a summary exists, then start a timed practice quiz and review your score."
	},
	{
		icon: MessageSquare,
		title: "Chat Guide",
		text: "Use AI Tutor from a note card to ask focused questions about that file's content."
	}
];
function HelpPage() {
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
						/* @__PURE__ */ jsx("div", {
							className: "grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white",
							children: /* @__PURE__ */ jsx(HelpCircle, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-5 text-3xl font-bold tracking-tight sm:text-4xl",
							children: "Help Center"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground",
							children: "Quick answers for uploading notes, generating study material, taking quizzes, and contacting support."
						})
					]
				}),
				/* @__PURE__ */ jsx("section", {
					className: "grid gap-4 sm:grid-cols-2",
					children: guides.map((guide) => {
						const Icon = guide.icon;
						return /* @__PURE__ */ jsxs("article", {
							className: "glass rounded-2xl p-5",
							children: [
								/* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-primary" }),
								/* @__PURE__ */ jsx("h2", {
									className: "mt-3 font-semibold",
									children: guide.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground",
									children: guide.text
								})
							]
						}, guide.title);
					})
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "glass rounded-2xl p-5",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "flex items-center gap-2 text-lg font-semibold",
						children: [/* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5" }), "FAQ"]
					}), /* @__PURE__ */ jsxs(Accordion, {
						type: "single",
						collapsible: true,
						className: "mt-3",
						children: [
							/* @__PURE__ */ jsxs(AccordionItem, {
								value: "formats",
								children: [/* @__PURE__ */ jsx(AccordionTrigger, { children: "Which file formats are supported?" }), /* @__PURE__ */ jsx(AccordionContent, { children: "PDF, PPT, and PPTX uploads are accepted. Text extraction is strongest for PDF and PPTX." })]
							}),
							/* @__PURE__ */ jsxs(AccordionItem, {
								value: "summary-first",
								children: [/* @__PURE__ */ jsx(AccordionTrigger, { children: "Why do MCQs ask me to generate a summary first?" }), /* @__PURE__ */ jsx(AccordionContent, { children: "MCQs are generated from the cached summary so the questions stay aligned with the note content." })]
							}),
							/* @__PURE__ */ jsxs(AccordionItem, {
								value: "support",
								children: [/* @__PURE__ */ jsx(AccordionTrigger, { children: "How do I contact support?" }), /* @__PURE__ */ jsx(AccordionContent, { children: "Use the Contact page or email abhayrajputg0007@gmail.com with the issue and note filename." })]
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { HelpPage as component };
