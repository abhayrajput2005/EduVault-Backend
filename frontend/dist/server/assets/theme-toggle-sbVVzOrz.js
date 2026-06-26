import { n as useTheme } from "./theme-provider-Gj1KbNGy.js";
import { t as Button } from "./button-DRsC1qZi.js";
import { jsx } from "react/jsx-runtime";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
//#region src/components/theme-toggle.tsx
function ThemeToggle() {
	const { theme, toggle } = useTheme();
	const Icon = theme === "dark" ? Sun : Moon;
	return /* @__PURE__ */ jsx(Button, {
		variant: "ghost",
		size: "icon",
		onClick: toggle,
		"aria-label": "Toggle theme",
		className: "relative h-9 w-9 rounded-full glass",
		children: /* @__PURE__ */ jsx(AnimatePresence, {
			mode: "wait",
			initial: false,
			children: /* @__PURE__ */ jsx(motion.span, {
				initial: {
					rotate: -90,
					opacity: 0,
					scale: .6
				},
				animate: {
					rotate: 0,
					opacity: 1,
					scale: 1
				},
				exit: {
					rotate: 90,
					opacity: 0,
					scale: .6
				},
				transition: { duration: .2 },
				className: "absolute inset-0 flex items-center justify-center",
				children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
			}, theme)
		})
	});
}
//#endregion
export { ThemeToggle as t };
