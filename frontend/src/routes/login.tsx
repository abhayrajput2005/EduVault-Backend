import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AuthShell } from "@/components/auth/auth-shell";
import { SocialButtons } from "@/components/auth/social-buttons";
import { login } from "@/services/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · EduVault AI" },
      { name: "description", content: "Sign in to your EduVault AI account." },
    ],
  }),
  component: LoginPage,
});
function LoginPage() {
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      const result = await login(email, password);
      await navigate({ to: result.user.isAdmin ? "/admin" : "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue learning with EduVault AI."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-foreground hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <SocialButtons />
      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or with email</span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@school.edu" required autoComplete="email" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox id="remember" />
          Remember me for 30 days
        </label>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-brand text-white shadow-lg shadow-indigo-500/30 hover:opacity-95"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
