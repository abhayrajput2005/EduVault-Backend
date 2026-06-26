import { Logo } from "@/components/brand/logo";
import { Link } from "@tanstack/react-router";

const columns = [
  {
    title: "Product",
    items: [
      { label: "Upload Notes", to: "/upload" },
      { label: "Repository", to: "/dashboard/repository" },
      { label: "Help Center", to: "/help" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Developer", to: "/contact" },
    ],
  },
  {
    title: "Study",
    items: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Settings", to: "/dashboard/settings" },
      { label: "Admin", to: "/admin" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            AI-powered learning, structured for the way you actually study.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <div className="text-sm font-semibold">{col.title}</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link className="hover:text-foreground" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} EduVault AI. All rights reserved.
      </div>
    </footer>
  );
}
