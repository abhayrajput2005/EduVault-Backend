import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  ListChecks,
  MessageSquare,
  Search,
  Sparkles,
  Send,
  Star,
  Bookmark,
  Calendar,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  downloadLibraryFile,
  fetchFileRatings,
  fetchSubjectSections,
  fetchSubjectFiles,
  fetchSubjectSuggestions,
  FILE_CATEGORY_LABELS,
  FILE_CATEGORY_ORDER,
  formatFileSize,
  rateLibraryFile,
  searchSubjects,
  setSubjectBookmark,
  submitMaterialRequest,
  type FileRatings,
  type LibrarySections,
  type FileCategory,
  type LibraryFile,
  type LibrarySubject,
} from "@/lib/subject-library";

export const Route = createFileRoute("/dashboard/subject-library")({
  head: () => ({
    meta: [
      { title: "Subject Library · EduVault AI" },
      {
        name: "description",
        content: "Search study materials by subject code — PPT, PDF, lab manuals, and past papers.",
      },
    ],
  }),
  component: SubjectLibraryPage,
});

function SubjectLibraryPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<LibrarySubject[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [subject, setSubject] = useState<LibrarySubject | null>(null);
  const [groups, setGroups] = useState<Record<FileCategory, LibraryFile[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [previewFile, setPreviewFile] = useState<LibraryFile | null>(null);
  const [ratingFile, setRatingFile] = useState<LibraryFile | null>(null);
  const [sections, setSections] = useState<LibrarySections | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchSubjectSections(controller.signal)
      .then(setSections)
      .catch(() => setSections(null));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchSubjectSuggestions(query.trim(), controller.signal)
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const runSearch = useCallback(async (code: string, pageNum = 1) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;

    setLoading(true);
    setError(null);
    setSelectedCode(normalized);
    setShowSuggestions(false);

    try {
      const result = await searchSubjects(normalized, pageNum);
      setSearchResults(result.items);
      if (result.items.length === 1) {
        await loadSubjectFiles(result.items[0].subject_code, 1);
      } else if (result.items.length === 0) {
        setSubject(null);
        setGroups(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubjectFiles = useCallback(async (code: string, pageNum = 1) => {
    setFilesLoading(true);
    setError(null);
    setSelectedCode(code);

    try {
      const data = await fetchSubjectFiles(code, { page: pageNum });
      setSubject(data.subject);
      setGroups(data.groups);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load files");
      setSubject(null);
      setGroups(null);
    } finally {
      setFilesLoading(false);
    }
  }, []);

  const totalFiles = useMemo(() => {
    if (!groups) return 0;
    return FILE_CATEGORY_ORDER.reduce((sum, key) => sum + (groups[key]?.length ?? 0), 0);
  }, [groups]);

  async function handleRequest() {
    if (!selectedCode) return;
    setSubmittingRequest(true);
    try {
      await submitMaterialRequest({
        subject_code: selectedCode,
        subject_name: subject?.subject_name,
        message: requestMessage,
      });
      toast.success("Request submitted for admin review");
      setRequestOpen(false);
      setRequestMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSubmittingRequest(false);
    }
  }

  async function toggleBookmark(subjectItem: LibrarySubject) {
    try {
      const next = !subjectItem.bookmarked;
      await setSubjectBookmark(subjectItem.id, next);
      toast.success(next ? "Subject bookmarked" : "Bookmark removed");
      const freshSections = await fetchSubjectSections();
      setSections(freshSections);
      if (subject?.id === subjectItem.id) {
        setSubject({ ...subject, bookmarked: next });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bookmark update failed");
    }
  }

  return (
    <div className="space-y-6">
      <section className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-indigo-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Subject Library</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Search by subject code (e.g. CSE316) to browse official study materials.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-6 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value.toUpperCase());
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") void runSearch(query);
            }}
            placeholder="Enter subject code, e.g. CSE316"
            className="h-11 border-0 bg-background/40 pl-9 uppercase focus-visible:ring-1"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border bg-popover shadow-lg">
              {suggestions.map((code) => (
                <button
                  key={code}
                  type="button"
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => {
                    setQuery(code);
                    void runSearch(code.split(" - ")[0]);
                  }}
                >
                  {code}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            className="bg-gradient-brand text-white"
            onClick={() => void runSearch(query)}
            disabled={!query.trim() || loading}
          >
            Search
          </Button>
          {selectedCode && (
            <Button variant="outline" onClick={() => setRequestOpen(true)}>
              Request Material
            </Button>
          )}
        </div>
      </section>

      {!selectedCode && sections && (
        <div className="space-y-5">
          <SubjectSection
            title="Trending Subjects"
            subjects={sections.trending}
            onOpen={(code) => void loadSubjectFiles(code)}
            onBookmark={(item) => void toggleBookmark(item)}
          />
          <SubjectSection
            title="Recently Added"
            subjects={sections.recently_added}
            onOpen={(code) => void loadSubjectFiles(code)}
            onBookmark={(item) => void toggleBookmark(item)}
          />
          <SubjectSection
            title="Bookmarked Subjects"
            subjects={sections.bookmarked}
            empty="Bookmarked subjects will appear here."
            onOpen={(code) => void loadSubjectFiles(code)}
            onBookmark={(item) => void toggleBookmark(item)}
          />
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && searchResults.length > 1 && !subject && (
        <section className="glass-strong rounded-2xl p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Matching subjects
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {searchResults.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void loadSubjectFiles(item.subject_code)}
                className="glass rounded-xl p-4 text-left transition hover:bg-accent/40"
              >
                <div className="font-semibold">{item.subject_code}</div>
                <div className="text-sm text-muted-foreground">{item.subject_name}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {item.file_count} file{item.file_count === 1 ? "" : "s"}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {filesLoading && (
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      )}

      {!filesLoading && selectedCode && subject && groups && (
        <section className="space-y-4">
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Badge className="bg-gradient-brand border-0 text-white">{subject.subject_code}</Badge>
                <h2 className="mt-2 text-xl font-bold">{subject.subject_name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {[subject.department, subject.semester && `Sem ${subject.semester}`, subject.unit]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" />
                    {subject.downloads} downloads
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" />
                    {subject.average_rating || "0"} ({subject.total_ratings})
                  </span>
                  {subject.last_updated && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(subject.last_updated).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{totalFiles} materials</Badge>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => void toggleBookmark(subject)}
                  aria-label={subject.bookmarked ? "Remove bookmark" : "Bookmark subject"}
                >
                  <Bookmark className={subject.bookmarked ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                </Button>
              </div>
            </div>
          </div>

          {totalFiles === 0 ? (
            <EmptyMaterialsState
              subjectCode={subject.subject_code}
              onRequest={() => setRequestOpen(true)}
            />
          ) : (
            <Tabs defaultValue={FILE_CATEGORY_ORDER.find((k) => groups[k]?.length) ?? "pdf"}>
              <TabsList className="flex h-auto flex-wrap gap-1">
                {FILE_CATEGORY_ORDER.map((cat) => (
                  <TabsTrigger key={cat} value={cat} disabled={!groups[cat]?.length}>
                    {FILE_CATEGORY_LABELS[cat]} ({groups[cat]?.length ?? 0})
                  </TabsTrigger>
                ))}
              </TabsList>
              {FILE_CATEGORY_ORDER.map((cat) => (
                <TabsContent key={cat} value={cat} className="mt-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                      {(groups[cat] ?? []).map((file, i) => (
                        <FileCard
                          key={file.id}
                          file={file}
                          index={i}
                          onPreview={() => setPreviewFile(file)}
                          onRate={() => setRatingFile(file)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}

          {pages > 1 && (
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => subject && void loadSubjectFiles(subject.subject_code, page - 1)}
              >
                Previous
              </Button>
              <span className="self-center text-sm text-muted-foreground">
                Page {page} of {pages}
              </span>
              <Button
                variant="outline"
                disabled={page >= pages}
                onClick={() => subject && void loadSubjectFiles(subject.subject_code, page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </section>
      )}

      {!loading && !filesLoading && selectedCode && !subject && searchResults.length <= 1 && (
        <EmptyMaterialsState subjectCode={selectedCode} onRequest={() => setRequestOpen(true)} />
      )}

      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request study material</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Subject code</Label>
              <Input value={selectedCode ?? ""} readOnly className="mt-1 uppercase" />
            </div>
            <div>
              <Label htmlFor="request-message">Message (optional)</Label>
              <Textarea
                id="request-message"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Describe what you need — unit notes, lab manual, past papers…"
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-brand text-white"
              onClick={() => void handleRequest()}
              disabled={submittingRequest}
            >
              <Send className="h-4 w-4" />
              {submittingRequest ? "Submitting…" : "Submit request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
        <DialogContent className="max-w-lg">
          {previewFile && (
            <>
              <DialogHeader>
                <DialogTitle className="truncate pr-6">{previewFile.original_name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Badge>{previewFile.category_label}</Badge>
                  <Badge variant="outline">{previewFile.file_type}</Badge>
                  <Badge variant="secondary">{formatFileSize(previewFile.file_size)}</Badge>
                </div>
                <p className="text-muted-foreground">
                  Use Download to save this file, or open AI tools below.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <RatingDialog file={ratingFile} onClose={() => setRatingFile(null)} />
    </div>
  );
}

function FileCard({
  file,
  index,
  onPreview,
  onRate,
}: {
  file: LibraryFile;
  index: number;
  onPreview: () => void;
  onRate: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.04 }}
      className="glass flex h-full flex-col rounded-2xl p-4"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug" title={file.original_name}>
            {file.original_name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {file.unit || file.category_label} · {formatFileSize(file.file_size)}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5" />
            {file.average_rating || "0"} ({file.total_ratings}) · {file.downloads} downloads
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" className="text-xs" onClick={onPreview}>
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={() =>
            downloadLibraryFile(file).catch((err) =>
              toast.error(err instanceof Error ? err.message : "Download failed"),
            )
          }
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </Button>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link to="/dashboard/summary/$filename" params={{ filename: file.filename }}>
            <Sparkles className="h-3.5 w-3.5" />
            Summary
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link to="/dashboard/quiz/$filename" params={{ filename: file.filename }}>
            <ListChecks className="h-3.5 w-3.5" />
            Quiz
          </Link>
        </Button>
        <Button asChild size="sm" className="col-span-2 bg-gradient-brand text-xs text-white">
          <Link to="/dashboard/chat/$filename" params={{ filename: file.filename }}>
            <MessageSquare className="h-3.5 w-3.5" />
            Ask AI
          </Link>
        </Button>
        <Button size="sm" variant="outline" className="col-span-2 text-xs" onClick={onRate}>
          <Star className="h-3.5 w-3.5" />
          Rating & Feedback
        </Button>
      </div>
    </motion.article>
  );
}

function SubjectSection({
  title,
  subjects,
  empty = "No subjects yet.",
  onOpen,
  onBookmark,
}: {
  title: string;
  subjects: LibrarySubject[];
  empty?: string;
  onOpen: (code: string) => void;
  onBookmark: (subject: LibrarySubject) => void;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      {subjects.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              type="button"
              onClick={() => onOpen(subject.subject_code)}
              className="glass rounded-2xl p-4 text-left transition hover:bg-accent/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge className="bg-gradient-brand border-0 text-white">{subject.subject_code}</Badge>
                  <h3 className="mt-2 font-semibold">{subject.subject_name}</h3>
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    onBookmark(subject);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.stopPropagation();
                      onBookmark(subject);
                    }
                  }}
                  className="rounded-lg border p-2 text-muted-foreground hover:text-foreground"
                  aria-label={subject.bookmarked ? "Remove bookmark" : "Bookmark subject"}
                >
                  <Bookmark className={subject.bookmarked ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {[subject.department, subject.semester && `Sem ${subject.semester}`]
                    .filter(Boolean)
                    .join(" · ") || "General"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  {subject.file_count} files
                </span>
                <span className="inline-flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" />
                  {subject.downloads} downloads
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" />
                  {subject.average_rating || "0"} average rating
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function RatingDialog({ file, onClose }: { file: LibraryFile | null; onClose: () => void }) {
  const [ratings, setRatings] = useState<FileRatings | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!file) return;
    const controller = new AbortController();
    fetchFileRatings(file.id, controller.signal)
      .then(setRatings)
      .catch(() => setRatings(null));
    return () => controller.abort();
  }, [file]);

  async function submit() {
    if (!file) return;
    setSubmitting(true);
    try {
      await rateLibraryFile(file.id, { rating, feedback });
      toast.success("Thanks for the feedback");
      const fresh = await fetchFileRatings(file.id);
      setRatings(fresh);
      setFeedback("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Rating failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rating & Feedback</DialogTitle>
        </DialogHeader>
        {file && (
          <div className="space-y-4">
            <div>
              <div className="truncate text-sm font-medium">{file.original_name}</div>
              <div className="text-xs text-muted-foreground">
                {ratings?.average_rating ?? file.average_rating} average ·{" "}
                {ratings?.total_ratings ?? file.total_ratings} ratings
              </div>
            </div>
            <div>
              <Label>Rating</Label>
              <Select value={String(rating)} onValueChange={(value) => setRating(Number(value))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value} star{value === 1 ? "" : "s"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file-feedback">Feedback</Label>
              <Textarea
                id="file-feedback"
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                className="mt-1"
                placeholder="Share what helped or what could be improved."
              />
            </div>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {(ratings?.reviews ?? []).map((review) => (
                <div key={review.id} className="rounded-xl border p-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="font-medium">{review.student_name}</span>
                    <span className="text-xs text-muted-foreground">{review.rating}/5</span>
                  </div>
                  {review.feedback && <p className="mt-1 text-muted-foreground">{review.feedback}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-gradient-brand text-white" onClick={() => void submit()} disabled={submitting}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EmptyMaterialsState({
  subjectCode,
  onRequest,
}: {
  subjectCode: string;
  onRequest: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong flex flex-col items-center rounded-3xl px-6 py-14 text-center"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <BookOpen className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No materials yet for {subjectCode}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We could not find uploaded study materials for this subject code. You can request them and
        an admin will review your request.
      </p>
      <Button className="mt-5 bg-gradient-brand text-white" onClick={onRequest}>
        Request Material
      </Button>
    </motion.div>
  );
}
