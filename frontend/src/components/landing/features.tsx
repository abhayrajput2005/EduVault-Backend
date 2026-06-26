import { motion } from "framer-motion";
import {
  Bot,
  FileText,
  Sparkles,
  Target,
  Layers,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Conversational AI tutor",
    desc: "Ask questions across your materials and get cited, context-aware answers.",
  },
  {
    icon: FileText,
    title: "Auto-summaries",
    desc: "Turn long PDFs, lectures or articles into clean, structured study notes.",
  },
  {
    icon: Target,
    title: "Adaptive practice",
    desc: "Generate quizzes and flashcards calibrated to what you don't know yet.",
  },
  {
    icon: Layers,
    title: "Unified library",
    desc: "One vault for documents, courses and highlights — searchable end-to-end.",
  },
  {
    icon: Sparkles,
    title: "Personalized paths",
    desc: "Set a goal; EduVault assembles a step-by-step learning plan around it.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    desc: "Your notes stay yours. Granular controls over what AI can access.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground">
            Features
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Everything you need to <span className="text-gradient-brand">master a subject</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A focused toolkit that replaces a tab graveyard of PDFs, chats and apps.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group glass relative overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white shadow-md shadow-indigo-500/30">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-brand opacity-0 blur-3xl transition-opacity group-hover:opacity-20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
