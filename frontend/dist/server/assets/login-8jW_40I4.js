import { n as cn, t as Button } from "./button-DRsC1qZi.js";
import { t as Input } from "./input-DicJzR9-.js";
import { t as Label } from "./label-B4PTMSG2.js";
import { i as login } from "./auth-z1u2-BCU.js";
import { a as AlertDescription, i as Alert, n as AuthShell, r as Separator, t as SocialButtons } from "./social-buttons-sOOYMd7P.js";
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
//#region src/components/ui/checkbox.tsx
var Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(CheckboxPrimitive.Root, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ jsx(CheckboxPrimitive.Indicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
//#endregion
//#region src/routes/login.tsx?tsr-split=component
function LoginPage() {
	const [show, setShow] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setSubmitting(true);
		const form = new FormData(e.currentTarget);
		const email = String(form.get("email") || "");
		const password = String(form.get("password") || "");
		try {
			await navigate({ to: (await login(email, password)).user.isAdmin ? "/admin" : "/dashboard" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ jsxs(AuthShell, {
		title: "Welcome back",
		subtitle: "Sign in to continue learning with EduVault AI.",
		footer: /* @__PURE__ */ jsxs(Fragment, { children: [
			"Don't have an account?",
			" ",
			/* @__PURE__ */ jsx(Link, {
				to: "/signup",
				className: "font-medium text-foreground hover:underline",
				children: "Create one"
			})
		] }),
		children: [
			/* @__PURE__ */ jsx(SocialButtons, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "my-6 flex items-center gap-3",
				children: [
					/* @__PURE__ */ jsx(Separator, { className: "flex-1" }),
					/* @__PURE__ */ jsx("span", {
						className: "text-xs text-muted-foreground",
						children: "or with email"
					}),
					/* @__PURE__ */ jsx(Separator, { className: "flex-1" })
				]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit,
				className: "space-y-4",
				children: [
					error && /* @__PURE__ */ jsx(Alert, {
						variant: "destructive",
						children: /* @__PURE__ */ jsx(AlertDescription, { children: error })
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ jsx(Label, {
							htmlFor: "email",
							children: "Email"
						}), /* @__PURE__ */ jsx(Input, {
							id: "email",
							name: "email",
							type: "email",
							placeholder: "you@school.edu",
							required: true,
							autoComplete: "email"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "password",
								children: "Password"
							}), /* @__PURE__ */ jsx(Link, {
								to: "/contact",
								className: "text-xs text-muted-foreground hover:text-foreground",
								children: "Forgot?"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx(Input, {
								id: "password",
								name: "password",
								type: show ? "text" : "password",
								placeholder: "••••••••",
								required: true,
								autoComplete: "current-password",
								className: "pr-10"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShow((v) => !v),
								className: "absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground",
								"aria-label": show ? "Hide password" : "Show password",
								children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ jsx(Checkbox, { id: "remember" }), "Remember me for 30 days"]
					}),
					/* @__PURE__ */ jsx(Button, {
						type: "submit",
						disabled: submitting,
						className: "w-full bg-gradient-brand text-white shadow-lg shadow-indigo-500/30 hover:opacity-95",
						children: submitting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Sign in"
					})
				]
			})
		]
	});
}
//#endregion
export { LoginPage as component };
