import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="aurora relative min-h-screen">
      <div className="aurora-bg" />
      <header className="flex items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex items-center justify-center px-4 pb-16 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-strong w-full max-w-md rounded-3xl p-8"
        >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </motion.div>
      </main>
    </div>
  );
}
