import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Brain, GraduationCap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="aurora relative pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="aurora-bg" />
      <div className="mx-auto max-w-5xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium"
        >
          <Sparkles className="h-3.5 w-3.5 text-gradient-brand" />
          <span>Introducing EduVault AI · Built for modern learners</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          Learn anything,
          <br />
          <span className="text-gradient-brand">faster with AI.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg"
        >
          EduVault AI turns lectures, textbooks and your own notes into adaptive lessons,
          summaries and personalized study plans — so you spend less time searching and more
          time understanding.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="bg-gradient-brand text-white shadow-lg shadow-indigo-500/30 hover:opacity-95">
            <Link to="/signup">
              Start learning free
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="glass border-0">
            <Link to="/login">I already have an account</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative mx-auto mt-20 max-w-4xl"
        >
          <div className="glass-strong rounded-3xl p-2">
            <div className="rounded-2xl bg-gradient-to-br from-background/60 to-background/20 p-6 sm:p-10">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: BookOpen, title: "Smart Library", desc: "Upload anything, get instant structure." },
                  { icon: Brain, title: "AI Tutor", desc: "Ask follow-ups, get grounded answers." },
                  { icon: GraduationCap, title: "Study Plans", desc: "Adaptive paths tuned to your goal." },
                ].map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.08 }}
                    className="glass rounded-2xl p-5 text-left"
                  >
                    <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div className="font-semibold">{f.title}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
