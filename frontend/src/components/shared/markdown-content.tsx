import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-sm sm:prose-base max-w-none dark:prose-invert",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-p:leading-relaxed prose-li:leading-relaxed",
        "prose-pre:rounded-xl prose-pre:bg-muted/80 prose-pre:text-sm",
        "prose-code:rounded prose-code:bg-muted/60 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.9em]",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => (
            <pre className="overflow-x-auto border border-border/50 p-4">{children}</pre>
          ),
          code: ({ className: codeClass, children, ...props }) => {
            const isBlock = codeClass?.includes("language-");
            if (isBlock) {
              return (
                <code className={cn("block font-mono text-[13px]", codeClass)} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className="font-mono" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
