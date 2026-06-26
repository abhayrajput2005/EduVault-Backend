import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Sparkles } from "lucide-react";
//#region src/components/brand/logo.tsx
function Logo({ to = "/" }) {
	return /* @__PURE__ */ jsxs(Link, {
		to,
		className: "flex items-center gap-2 group",
		children: [/* @__PURE__ */ jsx("span", {
			className: "relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105",
			children: /* @__PURE__ */ jsx(Sparkles, {
				className: "h-4 w-4 text-white",
				strokeWidth: 2.4
			})
		}), /* @__PURE__ */ jsxs("span", {
			className: "flex flex-col leading-none",
			children: [/* @__PURE__ */ jsx("span", {
				className: "font-display text-base font-bold tracking-tight",
				children: "EduVault"
			}), /* @__PURE__ */ jsx("span", {
				className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-gradient-brand",
				children: "AI"
			})]
		})]
	});
}
//#endregion
export { Logo as t };
