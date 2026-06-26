import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { label: "Features", href: "#features" },
  { label: "About", to: "/about" },
  { label: "Help", to: "/help" },
  { label: "Contact", to: "/contact" },
];

export function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="mx-auto max-w-6xl px-4">
        <nav
          className={cn(
            "flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all",
            scrolled ? "glass-strong" : "glass",
          )}
        >
          <Logo />

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              l.to ? (
              <Link
                key={l.label}
                to={l.to}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              >
                {l.label}
              </Link>
              ) : (
              <a
                key={l.label}
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              >
                {l.label}
              </a>
              )
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="hidden bg-gradient-brand text-white shadow-md shadow-indigo-500/30 hover:opacity-95 sm:inline-flex">
              <Link to="/signup">Get started</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex">
              <Link to="/upload">Upload Notes</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass-strong mt-2 rounded-2xl p-3 md:hidden"
            >
              <div className="flex flex-col">
                {links.map((l) => (
                  l.to ? (
                    <Link
                      key={l.label}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/60"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/60"
                    >
                      {l.label}
                    </a>
                  )
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-gradient-brand text-white">
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
