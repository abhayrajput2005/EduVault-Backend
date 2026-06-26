import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  delay = 0,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-brand opacity-10 blur-3xl" />
      <header className="mb-5 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white shadow-md shadow-indigo-500/30">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
      </header>
      {children}
    </motion.section>
  );
}
