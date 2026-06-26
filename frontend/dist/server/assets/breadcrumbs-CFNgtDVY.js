import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronRight, Home } from "lucide-react";
//#region src/components/summary/breadcrumbs.tsx
function Breadcrumbs({ items }) {
	return /* @__PURE__ */ jsxs("nav", {
		"aria-label": "Breadcrumb",
		className: "flex items-center gap-1.5 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ jsxs(Link, {
			to: "/dashboard",
			className: "flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-accent/60 hover:text-foreground",
			children: [/* @__PURE__ */ jsx(Home, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: "Dashboard"
			})]
		}), items.map((c, i) => {
			const last = i === items.length - 1;
			return /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5 opacity-60" }), c.to && !last ? /* @__PURE__ */ jsx(Link, {
					to: c.to,
					className: "max-w-[12rem] truncate rounded-md px-1.5 py-1 hover:bg-accent/60 hover:text-foreground",
					children: c.label
				}) : /* @__PURE__ */ jsx("span", {
					className: "max-w-[16rem] truncate rounded-md px-1.5 py-1 font-medium text-foreground",
					"aria-current": last ? "page" : void 0,
					title: c.label,
					children: c.label
				})]
			}, `${c.label}-${i}`);
		})]
	});
}
//#endregion
export { Breadcrumbs as t };
