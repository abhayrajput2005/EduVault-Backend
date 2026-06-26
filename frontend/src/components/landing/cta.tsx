import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="aurora glass-strong relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12">
          <div className="aurora-bg" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Your next breakthrough <span className="text-gradient-brand">is one upload away.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join learners, students and professionals using EduVault AI to study smarter every day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gradient-brand text-white shadow-lg shadow-indigo-500/30 hover:opacity-95">
              <Link to="/signup">
                Create your free account
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="glass border-0">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
