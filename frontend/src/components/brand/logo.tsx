import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
        <Sparkles className="h-4 w-4 text-white" strokeWidth={2.4} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-base font-bold tracking-tight">EduVault</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gradient-brand">
          AI
        </span>
      </span>
    </Link>
  );
}
