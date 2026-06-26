import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FolderGit2, MessageSquare, Settings, Shield, HelpCircle, Mail, BookOpen, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { isAdmin } from "@/services/auth";

type Item = { label: string; to: string; icon: LucideIcon; exact?: boolean };

const main: Item[] = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Repository", to: "/dashboard/repository", icon: FolderGit2 },
  { label: "Subject Library", to: "/dashboard/subject-library", icon: BookOpen },
  { label: "AI Tutor", to: "/dashboard/repository", icon: MessageSquare },
];

export function DashboardSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const admin = isAdmin();

  const secondary: Item[] = [
    ...(admin ? [{ label: "Admin Dashboard", to: "/admin", icon: Shield }] : []),
    { label: "Settings", to: "/dashboard/settings", icon: Settings },
    { label: "Help", to: "/help", icon: HelpCircle },
    { label: "Contact Us", to: "/contact", icon: Mail },
  ];

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-background/60 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-2 p-3 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="glass-strong flex h-full flex-col rounded-2xl p-4">
          <div className="px-1 py-1">
            <Logo to="/dashboard" />
          </div>

          <nav className="mt-6 flex flex-1 flex-col gap-1">
            <SectionLabel>Workspace</SectionLabel>
            {main.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                active={item.exact ? path === item.to : path.startsWith(item.to)}
              />
            ))}

            <SectionLabel className="mt-6">Account</SectionLabel>
            {secondary.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                active={path.startsWith(item.to) && item.to !== "/dashboard"}
              />
            ))}
          </nav>

          <div className="mt-3 rounded-xl bg-gradient-brand p-px">
            <div className="rounded-[11px] bg-card/80 p-3 text-sm">
              <div className="font-semibold">Study smarter</div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Upload notes and let AI generate summaries, MCQs, and quizzes.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

function NavLink({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-gradient-brand text-white shadow-md shadow-indigo-500/30"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}
