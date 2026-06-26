import { createFileRoute } from "@tanstack/react-router";
import { SiteNavbar } from "@/components/landing/site-navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { CTA } from "@/components/landing/cta";
import { SiteFooter } from "@/components/landing/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduVault AI — Learn anything, faster with AI" },
      {
        name: "description",
        content:
          "EduVault AI turns your notes, lectures and textbooks into adaptive lessons, summaries and study plans.",
      },
      { property: "og:title", content: "EduVault AI" },
      {
        property: "og:description",
        content: "AI-powered learning platform for students and lifelong learners.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SiteNavbar />
      <Hero />
      <Features />
      <CTA />
      <SiteFooter />
    </div>
  );
}
