import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { HelpCircle, LogOut, Menu, Search, Settings, Shield, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currentUser, isAdmin, logout } from "@/services/auth";

export function DashboardNavbar({ onMenu }: { onMenu: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const user = currentUser();
  const admin = isAdmin();
  const initials =
    (user?.name || user?.email || "EduVault")
      .split(/\s|@/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "EV";

  function submitSearch() {
    const value = query.trim();
    if (!value) return;
    sessionStorage.setItem("eduvault_repository_search", value);
    void navigate({ to: "/dashboard/repository" });
  }

  function handleLogout() {
    logout();
    void navigate({ to: "/login", replace: true });
  }

  return (
    <header className="sticky top-0 z-20 px-3 pt-3">
      <div className="glass-strong flex items-center gap-3 rounded-2xl px-3 py-2.5">
        <Button variant="ghost" size="icon" onClick={onMenu} className="md:hidden" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your library, notes, courses..."
            className="h-9 border-0 bg-background/40 pl-9 focus-visible:ring-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
          />
        </div>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Profile menu">
              <Avatar className="h-9 w-9 ring-2 ring-border">
                <AvatarFallback className="bg-gradient-brand text-xs font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <span className="block truncate">{user?.name || "Student"}</span>
              <span className="block truncate text-xs font-normal text-muted-foreground">
                {user?.email || "EduVault AI"}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            {admin && (
              <DropdownMenuItem asChild>
                <Link to="/admin">
                  <Shield className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">
                <UserRound className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/help">
                <HelpCircle className="h-4 w-4" />
                Help Center
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
