import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AuthShell } from "@/components/auth/auth-shell";
import { SocialButtons } from "@/components/auth/social-buttons";
import { register } from "@/services/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account · EduVault AI" },
      { name: "description", content: "Create your EduVault AI account and start learning." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    try {
      await register({
        firstName: String(form.get("firstName") || ""),
        lastName: String(form.get("lastName") || ""),
        email: String(form.get("email") || ""),
        password: String(form.get("password") || ""),
      });
      await navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start learning smarter in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground hover:underline">
            Sign in
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
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="first">First name</Label>
            <Input id="first" name="firstName" required autoComplete="given-name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" name="lastName" required autoComplete="family-name" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@school.edu" required autoComplete="email" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              placeholder="At least 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
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

        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link to="/about" className="underline hover:text-foreground">Terms</Link> and{" "}
          <Link to="/help" className="underline hover:text-foreground">Privacy Policy</Link>.
        </p>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-brand text-white shadow-lg shadow-indigo-500/30 hover:opacity-95"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
