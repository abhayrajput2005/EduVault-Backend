import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, UploadCloud } from "lucide-react";
import UploadZone from "@/components/upload/upload-zone";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/services/auth";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Notes · EduVault AI" },
      { name: "description", content: "Upload PDF, PPT, and PPTX study notes." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) void navigate({ to: "/login", replace: true });
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Button asChild variant="ghost" className="px-0">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>

        <header className="glass-strong rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-white">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Upload notes</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Add your study material with subject and unit metadata so EduVault can summarize, quiz, and organize it.
              </p>
            </div>
          </div>
        </header>

        <UploadZone />
      </div>
    </main>
  );
}
