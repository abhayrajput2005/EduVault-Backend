import { t as Button } from "./button-DRsC1qZi.js";
import { t as Logo } from "./logo-CDC2jnoK.js";
import { r as fetchAdminAnalytics } from "./admin-ChwDnqOW.js";
import { n as isAdmin, o as refreshCurrentUser, r as isAuthenticated } from "./auth-z1u2-BCU.js";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ArrowLeft, Shield } from "lucide-react";
//#region src/routes/admin.tsx?tsr-split=component
function AdminLayout() {
	const navigate = useNavigate();
	const [verified, setVerified] = useState(null);
	useEffect(() => {
		if (!isAuthenticated()) {
			navigate({
				to: "/login",
				replace: true
			});
			return;
		}
		const controller = new AbortController();
		refreshCurrentUser().then(() => {
			if (!isAdmin()) {
				toast.error("Admin access required");
				navigate({
					to: "/dashboard",
					replace: true
				});
				return;
			}
			return fetchAdminAnalytics(controller.signal).then(() => setVerified(true)).catch((err) => {
				toast.error(err instanceof Error ? err.message : "Admin access denied");
				navigate({
					to: "/dashboard",
					replace: true
				});
			});
		}).catch(() => {
			navigate({
				to: "/login",
				replace: true
			});
		});
		return () => controller.abort();
	}, [navigate]);
	if (verified === null) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: "Verifying admin access…"
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--brand-blue)_18%,transparent),transparent_34%)]" }),
			/* @__PURE__ */ jsx("header", {
				className: "border-b border-border/60 bg-card/40 backdrop-blur-md",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ jsx(Logo, { to: "/admin" }), /* @__PURE__ */ jsxs("span", {
							className: "hidden items-center gap-1.5 rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-white sm:inline-flex",
							children: [/* @__PURE__ */ jsx(Shield, { className: "h-3.5 w-3.5" }), "Admin"]
						})]
					}), /* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/dashboard",
							children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to App"]
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx("main", {
				className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsx(Outlet, {})
			})
		]
	});
}
//#endregion
export { AdminLayout as component };
