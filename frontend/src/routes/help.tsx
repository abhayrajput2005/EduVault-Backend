import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, FileUp, HelpCircle, ListChecks, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const guides = [
  {
    icon: FileUp,
    title: "Upload Guide",
    text: "Choose a PDF, PPT, or PPTX file, add the subject and unit, then upload it into your repository.",
  },
  {
    icon: Sparkles,
    title: "Summary Guide",
    text: "Open any note from the repository and select Summary to generate or regenerate key study points.",
  },
  {
    icon: ListChecks,
    title: "MCQ and Quiz Guide",
    text: "Generate MCQs after a summary exists, then start a timed practice quiz and review your score.",
  },
  {
    icon: MessageSquare,
    title: "Chat Guide",
    text: "Use AI Tutor from a note card to ask focused questions about that file's content.",
  },
];

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center | EduVault AI" },
      { name: "description", content: "FAQ and usage guides for EduVault AI." },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
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
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Help Center</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Quick answers for uploading notes, generating study material, taking quizzes, and contacting support.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <article key={guide.title} className="glass rounded-2xl p-5">
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="mt-3 font-semibold">{guide.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.text}</p>
              </article>
            );
          })}
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="h-5 w-5" />
            FAQ
          </h2>
          <Accordion type="single" collapsible className="mt-3">
            <AccordionItem value="formats">
              <AccordionTrigger>Which file formats are supported?</AccordionTrigger>
              <AccordionContent>PDF, PPT, and PPTX uploads are accepted. Text extraction is strongest for PDF and PPTX.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="summary-first">
              <AccordionTrigger>Why do MCQs ask me to generate a summary first?</AccordionTrigger>
              <AccordionContent>MCQs are generated from the cached summary so the questions stay aligned with the note content.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="support">
              <AccordionTrigger>How do I contact support?</AccordionTrigger>
              <AccordionContent>
                Use the Contact page or email abhayrajputg0007@gmail.com with the issue and note filename.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </main>
  );
}
