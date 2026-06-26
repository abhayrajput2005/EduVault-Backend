import { t as Button } from "./button-DRsC1qZi.js";
import { t as Input } from "./input-DicJzR9-.js";
import { t as Label } from "./label-B4PTMSG2.js";
import { s as register } from "./auth-z1u2-BCU.js";
import { a as AlertDescription, i as Alert, n as AuthShell, r as Separator, t as SocialButtons } from "./social-buttons-sOOYMd7P.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Eye, EyeOff, Loader2 } from "lucide-react";
//#region src/routes/signup.tsx?tsr-split=component
function SignupPage() {
	const [show, setShow] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setSubmitting(true);
		const form = new FormData(e.currentTarget);
		try {
			await register({
				firstName: String(form.get("firstName") || ""),
				lastName: String(form.get("lastName") || ""),
				email: String(form.get("email") || ""),
				password: String(form.get("password") || "")
			});
			await navigate({ to: "/dashboard" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ jsxs(AuthShell, {
		title: "Create your account",
		subtitle: "Start learning smarter in under a minute.",
		footer: /* @__PURE__ */ jsxs(Fragment, { children: [
			"Already have an account?",
			" ",
			/* @__PURE__ */ jsx(Link, {
				to: "/login",
				className: "font-medium text-foreground hover:underline",
				children: "Sign in"
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
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "first",
								children: "First name"
							}), /* @__PURE__ */ jsx(Input, {
								id: "first",
								name: "firstName",
								required: true,
								autoComplete: "given-name"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "last",
								children: "Last name"
							}), /* @__PURE__ */ jsx(Input, {
								id: "last",
								name: "lastName",
								required: true,
								autoComplete: "family-name"
							})]
						})]
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
						children: [/* @__PURE__ */ jsx(Label, {
							htmlFor: "password",
							children: "Password"
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx(Input, {
								id: "password",
								name: "password",
								type: show ? "text" : "password",
								placeholder: "At least 8 characters",
								required: true,
								minLength: 8,
								autoComplete: "new-password",
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
					/* @__PURE__ */ jsxs("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"By creating an account, you agree to our",
							" ",
							/* @__PURE__ */ jsx(Link, {
								to: "/about",
								className: "underline hover:text-foreground",
								children: "Terms"
							}),
							" and",
							" ",
							/* @__PURE__ */ jsx(Link, {
								to: "/help",
								className: "underline hover:text-foreground",
								children: "Privacy Policy"
							}),
							"."
						]
					}),
					/* @__PURE__ */ jsx(Button, {
						type: "submit",
						disabled: submitting,
						className: "w-full bg-gradient-brand text-white shadow-lg shadow-indigo-500/30 hover:opacity-95",
						children: submitting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Create account"
					})
				]
			})
		]
	});
}
//#endregion
export { SignupPage as component };
