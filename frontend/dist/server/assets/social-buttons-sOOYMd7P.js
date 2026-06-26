import { n as cn, t as Button } from "./button-DRsC1qZi.js";
import { t as Logo } from "./logo-CDC2jnoK.js";
import { t as ThemeToggle } from "./theme-toggle-sbVVzOrz.js";
import * as React from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft } from "lucide-react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
//#region src/components/ui/alert.tsx
var alertVariants = cva("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7", {
	variants: { variant: {
		default: "bg-background text-foreground",
		destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
var Alert = React.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	role: "alert",
	className: cn(alertVariants({ variant }), className),
	...props
}));
Alert.displayName = "Alert";
var AlertTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("h5", {
	ref,
	className: cn("mb-1 font-medium leading-none tracking-tight", className),
	...props
}));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("text-sm [&_p]:leading-relaxed", className),
	...props
}));
AlertDescription.displayName = "AlertDescription";
//#endregion
//#region src/components/ui/separator.tsx
var Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(SeparatorPrimitive.Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = SeparatorPrimitive.Root.displayName;
//#endregion
//#region src/components/auth/auth-shell.tsx
function AuthShell({ title, subtitle, children, footer }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "aurora relative min-h-screen",
		children: [
			/* @__PURE__ */ jsx("div", { className: "aurora-bg" }),
			/* @__PURE__ */ jsxs("header", {
				className: "flex items-center justify-between px-6 py-5",
				children: [/* @__PURE__ */ jsx(Logo, {}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs(Link, {
						to: "/",
						className: "hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline-flex",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), " Back home"]
					}), /* @__PURE__ */ jsx(ThemeToggle, {})]
				})]
			}),
			/* @__PURE__ */ jsx("main", {
				className: "flex items-center justify-center px-4 pb-16 pt-6",
				children: /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .4 },
					className: "glass-strong w-full max-w-md rounded-3xl p-8",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-6 text-center",
							children: [/* @__PURE__ */ jsx("h1", {
								className: "text-2xl font-bold tracking-tight",
								children: title
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1.5 text-sm text-muted-foreground",
								children: subtitle
							})]
						}),
						children,
						footer && /* @__PURE__ */ jsx("div", {
							className: "mt-6 text-center text-sm text-muted-foreground",
							children: footer
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region src/components/auth/social-buttons.tsx
function SocialButtons() {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid grid-cols-2 gap-3",
		children: [/* @__PURE__ */ jsxs(Button, {
			type: "button",
			variant: "outline",
			className: "glass border-0",
			children: [/* @__PURE__ */ jsx("svg", {
				className: "mr-2 h-4 w-4",
				viewBox: "0 0 24 24",
				"aria-hidden": true,
				children: /* @__PURE__ */ jsx("path", {
					fill: "currentColor",
					d: "M21.35 11.1H12v2.96h5.36c-.23 1.5-1.7 4.4-5.36 4.4-3.22 0-5.85-2.66-5.85-5.96S8.78 6.55 12 6.55c1.83 0 3.06.78 3.77 1.45l2.57-2.48C16.7 3.97 14.55 3 12 3 6.98 3 2.92 7.04 2.92 12s4.06 9 9.08 9c5.24 0 8.7-3.68 8.7-8.86 0-.6-.06-1.04-.15-1.04z"
				})
			}), "Google"]
		}), /* @__PURE__ */ jsxs(Button, {
			type: "button",
			variant: "outline",
			className: "glass border-0",
			children: [/* @__PURE__ */ jsx("svg", {
				className: "mr-2 h-4 w-4",
				viewBox: "0 0 24 24",
				"aria-hidden": true,
				children: /* @__PURE__ */ jsx("path", {
					fill: "currentColor",
					d: "M16.36 1.43c0 1.14-.42 2.21-1.12 3-.78.9-2.07 1.62-3.13 1.54-.14-1.11.42-2.27 1.08-3.01.74-.84 2.01-1.46 3.17-1.53zM20.5 17.3c-.56 1.27-.83 1.84-1.55 2.97-1 1.58-2.42 3.55-4.18 3.57-1.56.02-1.96-1.02-4.07-1-2.11.01-2.55 1.02-4.11 1-1.76-.02-3.1-1.8-4.1-3.38C-.4 16.66-.7 11.6 1.45 8.88c1.5-1.94 3.87-3.07 6.09-3.07 2.27 0 3.7 1.24 5.57 1.24 1.81 0 2.92-1.24 5.54-1.24 1.99 0 4.1 1.09 5.61 2.96-4.93 2.7-4.13 9.74.24 8.53z"
				})
			}), "Apple"]
		})]
	});
}
//#endregion
export { AlertDescription as a, Alert as i, AuthShell as n, Separator as r, SocialButtons as t };
