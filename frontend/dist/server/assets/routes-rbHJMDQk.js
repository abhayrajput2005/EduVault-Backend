import { n as cn, t as Button } from "./button-DRsC1qZi.js";
import { t as Logo } from "./logo-CDC2jnoK.js";
import { t as ThemeToggle } from "./theme-toggle-sbVVzOrz.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, BookOpen, Bot, Brain, FileText, GraduationCap, Layers, Menu, ShieldCheck, Sparkles, Target, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
//#region src/components/landing/site-navbar.tsx
var links = [
	{
		label: "Features",
		href: "#features"
	},
	{
		label: "About",
		to: "/about"
	},
	{
		label: "Help",
		to: "/help"
	},
	{
		label: "Contact",
		to: "/contact"
	}
];
function SiteNavbar() {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ jsx("header", {
		className: cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "py-2" : "py-4"),
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-6xl px-4",
			children: [/* @__PURE__ */ jsxs("nav", {
				className: cn("flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all", scrolled ? "glass-strong" : "glass"),
				children: [
					/* @__PURE__ */ jsx(Logo, {}),
					/* @__PURE__ */ jsx("div", {
						className: "hidden items-center gap-1 md:flex",
						children: links.map((l) => l.to ? /* @__PURE__ */ jsx(Link, {
							to: l.to,
							className: "rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: l.label
						}, l.label) : /* @__PURE__ */ jsx("a", {
							href: l.href,
							className: "rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: l.label
						}, l.label))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx(ThemeToggle, {}),
							/* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "ghost",
								size: "sm",
								className: "hidden sm:inline-flex",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/login",
									children: "Sign in"
								})
							}),
							/* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "sm",
								className: "hidden bg-gradient-brand text-white shadow-md shadow-indigo-500/30 hover:opacity-95 sm:inline-flex",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/signup",
									children: "Get started"
								})
							}),
							/* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "hidden lg:inline-flex",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/upload",
									children: "Upload Notes"
								})
							}),
							/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon",
								className: "md:hidden",
								onClick: () => setOpen((v) => !v),
								"aria-label": "Menu",
								children: open ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
							})
						]
					})
				]
			}), /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: -8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: -8
				},
				className: "glass-strong mt-2 rounded-2xl p-3 md:hidden",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col",
					children: [links.map((l) => l.to ? /* @__PURE__ */ jsx(Link, {
						to: l.to,
						onClick: () => setOpen(false),
						className: "rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/60",
						children: l.label
					}, l.label) : /* @__PURE__ */ jsx("a", {
						href: l.href,
						onClick: () => setOpen(false),
						className: "rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/60",
						children: l.label
					}, l.label)), /* @__PURE__ */ jsxs("div", {
						className: "mt-2 grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/login",
								children: "Sign in"
							})
						}), /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "sm",
							className: "bg-gradient-brand text-white",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/signup",
								children: "Sign up"
							})
						})]
					})]
				})
			}) })]
		})
	});
}
//#endregion
//#region src/components/landing/hero.tsx
function Hero() {
	return /* @__PURE__ */ jsxs("section", {
		className: "aurora relative pt-36 pb-24 sm:pt-44 sm:pb-32",
		children: [/* @__PURE__ */ jsx("div", { className: "aurora-bg" }), /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-5xl px-4 text-center",
			children: [
				/* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .5 },
					className: "mx-auto inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-gradient-brand" }), /* @__PURE__ */ jsx("span", { children: "Introducing EduVault AI · Built for modern learners" })]
				}),
				/* @__PURE__ */ jsxs(motion.h1, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .6,
						delay: .05
					},
					className: "mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl",
					children: [
						"Learn anything,",
						/* @__PURE__ */ jsx("br", {}),
						/* @__PURE__ */ jsx("span", {
							className: "text-gradient-brand",
							children: "faster with AI."
						})
					]
				}),
				/* @__PURE__ */ jsx(motion.p, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .6,
						delay: .1
					},
					className: "mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg",
					children: "EduVault AI turns lectures, textbooks and your own notes into adaptive lessons, summaries and personalized study plans — so you spend less time searching and more time understanding."
				}),
				/* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .6,
						delay: .15
					},
					className: "mt-9 flex flex-wrap items-center justify-center gap-3",
					children: [/* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "lg",
						className: "bg-gradient-brand text-white shadow-lg shadow-indigo-500/30 hover:opacity-95",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/signup",
							children: ["Start learning free", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
						})
					}), /* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "lg",
						variant: "outline",
						className: "glass border-0",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/login",
							children: "I already have an account"
						})
					})]
				}),
				/* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 24
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .7,
						delay: .25
					},
					className: "relative mx-auto mt-20 max-w-4xl",
					children: /* @__PURE__ */ jsx("div", {
						className: "glass-strong rounded-3xl p-2",
						children: /* @__PURE__ */ jsx("div", {
							className: "rounded-2xl bg-gradient-to-br from-background/60 to-background/20 p-6 sm:p-10",
							children: /* @__PURE__ */ jsx("div", {
								className: "grid gap-4 sm:grid-cols-3",
								children: [
									{
										icon: BookOpen,
										title: "Smart Library",
										desc: "Upload anything, get instant structure."
									},
									{
										icon: Brain,
										title: "AI Tutor",
										desc: "Ask follow-ups, get grounded answers."
									},
									{
										icon: GraduationCap,
										title: "Study Plans",
										desc: "Adaptive paths tuned to your goal."
									}
								].map((f, i) => /* @__PURE__ */ jsxs(motion.div, {
									initial: {
										opacity: 0,
										y: 10
									},
									animate: {
										opacity: 1,
										y: 0
									},
									transition: { delay: .35 + i * .08 },
									className: "glass rounded-2xl p-5 text-left",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white",
											children: /* @__PURE__ */ jsx(f.icon, { className: "h-5 w-5" })
										}),
										/* @__PURE__ */ jsx("div", {
											className: "font-semibold",
											children: f.title
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-1 text-sm text-muted-foreground",
											children: f.desc
										})
									]
								}, f.title))
							})
						})
					})
				})
			]
		})]
	});
}
//#endregion
//#region src/components/landing/features.tsx
var features = [
	{
		icon: Bot,
		title: "Conversational AI tutor",
		desc: "Ask questions across your materials and get cited, context-aware answers."
	},
	{
		icon: FileText,
		title: "Auto-summaries",
		desc: "Turn long PDFs, lectures or articles into clean, structured study notes."
	},
	{
		icon: Target,
		title: "Adaptive practice",
		desc: "Generate quizzes and flashcards calibrated to what you don't know yet."
	},
	{
		icon: Layers,
		title: "Unified library",
		desc: "One vault for documents, courses and highlights — searchable end-to-end."
	},
	{
		icon: Sparkles,
		title: "Personalized paths",
		desc: "Set a goal; EduVault assembles a step-by-step learning plan around it."
	},
	{
		icon: ShieldCheck,
		title: "Private by design",
		desc: "Your notes stay yours. Granular controls over what AI can access."
	}
];
function Features() {
	return /* @__PURE__ */ jsx("section", {
		id: "features",
		className: "relative py-24 sm:py-32",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-6xl px-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "inline-flex rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground",
						children: "Features"
					}),
					/* @__PURE__ */ jsxs("h2", {
						className: "mt-4 text-4xl font-bold tracking-tight sm:text-5xl",
						children: ["Everything you need to ", /* @__PURE__ */ jsx("span", {
							className: "text-gradient-brand",
							children: "master a subject"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-4 text-muted-foreground",
						children: "A focused toolkit that replaces a tab graveyard of PDFs, chats and apps."
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: features.map((f, i) => /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 14
					},
					whileInView: {
						opacity: 1,
						y: 0
					},
					viewport: {
						once: true,
						margin: "-80px"
					},
					transition: {
						duration: .4,
						delay: i * .04
					},
					className: "group glass relative overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-0.5",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white shadow-md shadow-indigo-500/30",
							children: /* @__PURE__ */ jsx(f.icon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold",
							children: f.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1.5 text-sm text-muted-foreground",
							children: f.desc
						}),
						/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-brand opacity-0 blur-3xl transition-opacity group-hover:opacity-20" })
					]
				}, f.title))
			})]
		})
	});
}
//#endregion
//#region src/components/landing/cta.tsx
function CTA() {
	return /* @__PURE__ */ jsx("section", {
		className: "relative py-24",
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto max-w-5xl px-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "aurora glass-strong relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12",
				children: [
					/* @__PURE__ */ jsx("div", { className: "aurora-bg" }),
					/* @__PURE__ */ jsxs("h2", {
						className: "text-3xl font-bold tracking-tight sm:text-5xl",
						children: ["Your next breakthrough ", /* @__PURE__ */ jsx("span", {
							className: "text-gradient-brand",
							children: "is one upload away."
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mx-auto mt-4 max-w-xl text-muted-foreground",
						children: "Join learners, students and professionals using EduVault AI to study smarter every day."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex flex-wrap justify-center gap-3",
						children: [/* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "lg",
							className: "bg-gradient-brand text-white shadow-lg shadow-indigo-500/30 hover:opacity-95",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/signup",
								children: ["Create your free account", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
							})
						}), /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "glass border-0",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/login",
								children: "Sign in"
							})
						})]
					})
				]
			})
		})
	});
}
//#endregion
//#region src/components/landing/footer.tsx
var columns = [
	{
		title: "Product",
		items: [
			{
				label: "Upload Notes",
				to: "/upload"
			},
			{
				label: "Repository",
				to: "/dashboard/repository"
			},
			{
				label: "Help Center",
				to: "/help"
			}
		]
	},
	{
		title: "Company",
		items: [
			{
				label: "About",
				to: "/about"
			},
			{
				label: "Contact",
				to: "/contact"
			},
			{
				label: "Developer",
				to: "/contact"
			}
		]
	},
	{
		title: "Study",
		items: [
			{
				label: "Dashboard",
				to: "/dashboard"
			},
			{
				label: "Settings",
				to: "/dashboard/settings"
			},
			{
				label: "Admin",
				to: "/admin"
			}
		]
	}
];
function SiteFooter() {
	return /* @__PURE__ */ jsxs("footer", {
		className: "border-t border-border/60 py-12",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsx(Logo, {}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "AI-powered learning, structured for the way you actually study."
				})]
			}), columns.map((col) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "text-sm font-semibold",
				children: col.title
			}), /* @__PURE__ */ jsx("ul", {
				className: "mt-3 space-y-2 text-sm text-muted-foreground",
				children: col.items.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
					className: "hover:text-foreground",
					to: item.to,
					children: item.label
				}) }, item.label))
			})] }, col.title))]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mx-auto mt-10 max-w-6xl px-4 text-xs text-muted-foreground",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" EduVault AI. All rights reserved."
			]
		})]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function LandingPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "relative min-h-screen overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsx(SiteNavbar, {}),
			/* @__PURE__ */ jsx(Hero, {}),
			/* @__PURE__ */ jsx(Features, {}),
			/* @__PURE__ */ jsx(CTA, {}),
			/* @__PURE__ */ jsx(SiteFooter, {})
		]
	});
}
//#endregion
export { LandingPage as component };
