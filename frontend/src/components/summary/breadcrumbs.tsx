import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-accent/60 hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Dashboard</span>
      </Link>
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <div key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            {c.to && !last ? (
              <Link
                to={c.to}
                className="max-w-[12rem] truncate rounded-md px-1.5 py-1 hover:bg-accent/60 hover:text-foreground"
              >
                {c.label}
              </Link>
            ) : (
              <span
                className="max-w-[16rem] truncate rounded-md px-1.5 py-1 font-medium text-foreground"
                aria-current={last ? "page" : undefined}
                title={c.label}
              >
                {c.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
