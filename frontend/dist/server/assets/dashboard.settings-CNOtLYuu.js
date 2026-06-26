import { t as Button } from "./button-DRsC1qZi.js";
import { a as logout, t as currentUser } from "./auth-z1u2-BCU.js";
import { t as ThemeToggle } from "./theme-toggle-sbVVzOrz.js";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { LogOut, Mail, Settings, UserRound } from "lucide-react";
//#region src/routes/dashboard.settings.tsx?tsr-split=component
function SettingsPage() {
	const navigate = useNavigate();
	const user = currentUser();
	function handleLogout() {
		logout();
		navigate({
			to: "/login",
			replace: true
		});
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl space-y-6",
		children: [
			/* @__PURE__ */ jsx("section", {
				className: "glass-strong rounded-2xl p-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white",
						children: /* @__PURE__ */ jsx(Settings, { className: "h-6 w-6" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-bold tracking-tight",
						children: "Settings"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Manage your EduVault profile, display preference, and account actions."
					})] })]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "glass rounded-2xl p-5",
					children: [
						/* @__PURE__ */ jsx(UserRound, { className: "h-5 w-5 text-primary" }),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-3 text-lg font-semibold",
							children: "Profile"
						}),
						/* @__PURE__ */ jsxs("dl", {
							className: "mt-4 space-y-3 text-sm",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
									className: "text-muted-foreground",
									children: "Name"
								}), /* @__PURE__ */ jsx("dd", {
									className: "font-medium",
									children: user?.name || "Student"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
									className: "text-muted-foreground",
									children: "Email"
								}), /* @__PURE__ */ jsx("dd", {
									className: "font-medium",
									children: user?.email || "Not available"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
									className: "text-muted-foreground",
									children: "Role"
								}), /* @__PURE__ */ jsx("dd", {
									className: "font-medium",
									children: user?.isAdmin ? "Admin" : "Student"
								})] })
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "glass rounded-2xl p-5",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-semibold",
							children: "Appearance"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 flex items-center justify-between rounded-xl bg-background/45 p-4",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm text-muted-foreground",
								children: "Theme"
							}), /* @__PURE__ */ jsx(ThemeToggle, {})]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-6 text-lg font-semibold",
							children: "Support"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 grid gap-2",
							children: [/* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "outline",
								className: "justify-start",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/help",
									children: "Help Center"
								})
							}), /* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "outline",
								className: "justify-start",
								children: /* @__PURE__ */ jsxs(Link, {
									to: "/contact",
									children: [/* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }), "Contact Us"]
								})
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "glass rounded-2xl p-5",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-semibold",
						children: "Account"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Logging out clears your local session token on this device."
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "destructive",
						className: "mt-4",
						onClick: handleLogout,
						children: [/* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }), "Logout"]
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
