import { n as cn } from "./button-DRsC1qZi.js";
import { jsx } from "react/jsx-runtime";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
//#region src/components/shared/markdown-content.tsx
function MarkdownContent({ content, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("prose prose-sm sm:prose-base max-w-none dark:prose-invert", "prose-headings:font-semibold prose-headings:tracking-tight", "prose-p:leading-relaxed prose-li:leading-relaxed", "prose-pre:rounded-xl prose-pre:bg-muted/80 prose-pre:text-sm", "prose-code:rounded prose-code:bg-muted/60 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.9em]", className),
		children: /* @__PURE__ */ jsx(ReactMarkdown, {
			remarkPlugins: [remarkGfm],
			components: {
				pre: ({ children }) => /* @__PURE__ */ jsx("pre", {
					className: "overflow-x-auto border border-border/50 p-4",
					children
				}),
				code: ({ className: codeClass, children, ...props }) => {
					if (codeClass?.includes("language-")) return /* @__PURE__ */ jsx("code", {
						className: cn("block font-mono text-[13px]", codeClass),
						...props,
						children
					});
					return /* @__PURE__ */ jsx("code", {
						className: "font-mono",
						...props,
						children
					});
				}
			},
			children: content
		})
	});
}
//#endregion
export { MarkdownContent as t };
