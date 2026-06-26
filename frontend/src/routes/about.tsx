import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bot, FileText, Library, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

const highlights = [
  {
    icon: FileText,
    title: "AI summaries",
    text: "Extracts study-friendly summaries, key points, and important topics from uploaded notes.",
  },
  {
    icon: Library,
    title: "Repository",
    text: "Organizes PDFs and presentations by subject and unit with search, filters, preview, and download.",
  },
  {
    icon: Bot,
    title: "AI tutor",
    text: "Lets students ask contextual questions against their own notes and continue prior conversations.",
  },
  {
    icon: ShieldCheck,
    title: "Admin control",
    text: "Provides moderation, user visibility, analytics, and approval workflows for managed deployments.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | EduVault AI" },
      { name: "description", content: "Learn about EduVault AI and its AI-powered study workflow." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Button asChild variant="ghost" className="px-0">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </Button>

        <section className="glass-strong rounded-2xl p-6 sm:p-8">
          <Logo />
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">About EduVault AI</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            EduVault AI is an AI-powered study platform for students who want one place to store
            course notes, generate learning material, practice quizzes, and revisit progress.
            It combines a React frontend with a Flask, MongoDB, and Gemini-backed API.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="glass rounded-2xl p-5">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
