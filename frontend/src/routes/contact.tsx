import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Code2, GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/logo";

const stack = ["React", "TypeScript", "TanStack Router", "Flask", "MongoDB", "Gemini AI"];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | EduVault AI" },
      { name: "description", content: "Contact the EduVault AI developer and view project details." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Button asChild variant="ghost" className="px-0">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </Button>

        <section className="glass-strong overflow-hidden rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Logo />
              <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                EduVault AI is built as a university-ready study platform for uploading notes,
                generating summaries, practicing MCQs, taking quizzes, and chatting with course material.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/45 p-5">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Abhay Kumar</h2>
              <p className="text-sm text-muted-foreground">Developer</p>
              <Button asChild className="mt-4 bg-gradient-brand text-white">
                <a href="mailto:abhayrajputg0007@gmail.com">
                  <Mail className="h-4 w-4" />
                  Email Developer
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
          <div className="glass rounded-2xl p-5">
            <Code2 className="h-5 w-5 text-primary" />
            <h2 className="mt-3 text-lg font-semibold">Project Name</h2>
            <p className="mt-1 text-sm text-muted-foreground">EduVault AI</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Technology Stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {stack.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
