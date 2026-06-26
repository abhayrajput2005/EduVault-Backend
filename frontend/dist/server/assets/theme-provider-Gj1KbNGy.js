import { createContext, useContext, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/components/theme-provider.tsx
var ThemeContext = createContext(null);
var STORAGE_KEY = "eduvault-theme";
function ThemeProvider({ children }) {
	const [theme, setThemeState] = useState("dark");
	useEffect(() => {
		const stored = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) || null;
		const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
		setThemeState(stored ?? (prefersDark ? "dark" : "light"));
	}, []);
	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {}
	}, [theme]);
	const setTheme = (t) => setThemeState(t);
	const toggle = () => setThemeState((t) => t === "dark" ? "light" : "dark");
	return /* @__PURE__ */ jsx(ThemeContext.Provider, {
		value: {
			theme,
			toggle,
			setTheme
		},
		children
	});
}
function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
}
//#endregion
export { useTheme as n, ThemeProvider as t };
