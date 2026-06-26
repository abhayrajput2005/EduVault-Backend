import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  BookOpen,
  Trash2,
  Upload,
  Plus,
  RefreshCw,
  Check,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createAdminLibrarySubject,
  deleteAdminLibraryFile,
  deleteAdminLibrarySubject,
  fetchAdminLibrarySubjects,
  fetchAdminMaterialRequests,
  replaceAdminLibraryFile,
  resolveAdminMaterialRequest,
  updateAdminLibraryFile,
  updateAdminLibrarySubject,
  uploadAdminLibraryFile,
  type MaterialRequest,
} from "@/lib/admin-subject-library";
import {
  FILE_CATEGORY_LABELS,
  FILE_CATEGORY_ORDER,
  fetchSubjectFiles,
  type FileCategory,
  type LibraryFile,
  type LibrarySubject,
} from "@/lib/subject-library";

export const Route = createFileRoute("/admin/subject-library")({
  component: AdminSubjectLibraryPage,
});

function AdminSubjectLibraryPage() {
  const [subjects, setSubjects] = useState<LibrarySubject[]>([]);
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<LibrarySubject | null>(null);
  const [subjectFiles, setSubjectFiles] = useState<LibraryFile[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesKey, setFilesKey] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<LibrarySubject | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [replaceFileId, setReplaceFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    subject_code: "",
    subject_name: "",
    semester: "",
    department: "",
    unit: "",
    keywords: "",
  });
  const [uploadCategory, setUploadCategory] = useState<FileCategory>("pdf");
  const [uploadUnit, setUploadUnit] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const [subjectsRes, requestsRes] = await Promise.all([
        fetchAdminLibrarySubjects({ signal }),
        fetchAdminMaterialRequests({ signal }),
      ]);
      setSubjects(subjectsRes.items);
      setRequests(requestsRes.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load library data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => {
    if (!selectedSubject) {
      setSubjectFiles([]);
      return;
    }
    setFilesLoading(true);
    fetchSubjectFiles(selectedSubject.subject_code)
      .then((data) => setSubjectFiles(data.files))
      .catch(() => setSubjectFiles([]))
      .finally(() => setFilesLoading(false));
  }, [selectedSubject, filesKey]);

  function resetForm() {
    setForm({ subject_code: "", subject_name: "", semester: "", department: "", unit: "", keywords: "" });
  }

  async function handleCreateSubject() {
    try {
      await createAdminLibrarySubject({
        ...form,
        subject_code: form.subject_code.toUpperCase(),
        keywords: form.keywords.split(",").map((item) => item.trim()).filter(Boolean),
      });
      toast.success("Subject created");
      setCreateOpen(false);
      resetForm();
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Create failed");
    }
  }

  async function handleUpdateSubject() {
    if (!editSubject) return;
    try {
      await updateAdminLibrarySubject(editSubject.id, {
        ...form,
        subject_code: form.subject_code.toUpperCase(),
        keywords: form.keywords.split(",").map((item) => item.trim()).filter(Boolean),
      });
      toast.success("Subject updated");
      setEditSubject(null);
      resetForm();
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function handleDeleteSubject(id: string, code: string) {
    if (!window.confirm(`Delete subject ${code} and all its files?`)) return;
    try {
      await deleteAdminLibrarySubject(id);
      toast.success("Subject deleted");
      if (selectedSubject?.id === id) setSelectedSubject(null);
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function handleUpload(files: File[]) {
    if (!selectedSubject) return;
    const fd = new FormData();
    files.forEach((file) => fd.append("files", file));
    fd.append("category", uploadCategory);
    if (uploadUnit) fd.append("unit", uploadUnit);
    setUploading(true);
    try {
      await uploadAdminLibraryFile(selectedSubject.id, fd);
      toast.success(files.length === 1 ? "File uploaded" : `${files.length} files uploaded`);
      setUploadOpen(false);
      void load();
      setFilesKey((k) => k + 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleReplace(file: File) {
    if (!replaceFileId) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", uploadCategory);
    try {
      await replaceAdminLibraryFile(replaceFileId, fd);
      toast.success("File replaced");
      setReplaceFileId(null);
      void load();
      setFilesKey((k) => k + 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Replace failed");
    }
  }

  async function handleDeleteFile(fileId: string, name: string) {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await deleteAdminLibraryFile(fileId);
      toast.success("File deleted");
      void load();
      setFilesKey((k) => k + 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function handleResolveRequest(id: string) {
    try {
      await resolveAdminMaterialRequest(id);
      toast.success("Request marked resolved");
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4" />
              Admin Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Subject Library Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create subjects, upload materials, and review student requests.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="bg-gradient-brand text-white" onClick={() => { resetForm(); setCreateOpen(true); }}>
            <Plus className="h-4 w-4" />
            New Subject
          </Button>
        </div>
      </div>

      <Tabs defaultValue="subjects">
        <TabsList>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {requests.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {requests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="mt-4 space-y-4">
          {loading ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : (
            <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
              <div className="glass-strong overflow-hidden rounded-2xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No subjects yet. Create one to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      subjects.map((s) => (
                        <TableRow
                          key={s.id}
                          className={selectedSubject?.id === s.id ? "bg-accent/30" : "cursor-pointer"}
                          onClick={() => setSelectedSubject(s)}
                        >
                          <TableCell className="font-mono font-semibold">{s.subject_code}</TableCell>
                          <TableCell>{s.subject_name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setForm({
                                    subject_code: s.subject_code,
                                    subject_name: s.subject_name,
                                    semester: s.semester,
                                    department: s.department,
                                    unit: s.unit,
                                    keywords: s.keywords?.join(", ") ?? "",
                                  });
                                  setEditSubject(s);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void handleDeleteSubject(s.id, s.subject_code);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="glass-strong rounded-2xl p-5">
                {!selectedSubject ? (
                  <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-muted-foreground">
                    <BookOpen className="mb-3 h-8 w-8 opacity-50" />
                    <p>Select a subject to manage files</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <Badge className="bg-gradient-brand border-0 text-white">
                          {selectedSubject.subject_code}
                        </Badge>
                        <h2 className="mt-2 text-lg font-semibold">{selectedSubject.subject_name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {[selectedSubject.department, selectedSubject.semester && `Sem ${selectedSubject.semester}`]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-brand text-white"
                        onClick={() => setUploadOpen(true)}
                      >
                        <Upload className="h-4 w-4" />
                        Upload file
                      </Button>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {selectedSubject.file_count} file(s) · Use upload to add PDF, PPT, DOCX, lab manuals, or past papers.
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Uploaded files sync with Summary, Quiz, and AI Tutor automatically.
                    </p>

                    {filesLoading ? (
                      <Skeleton className="mt-4 h-32 rounded-xl" />
                    ) : subjectFiles.length === 0 ? (
                      <p className="mt-4 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                        No files uploaded yet.
                      </p>
                    ) : (
                      <div className="mt-4 space-y-2">
                        {subjectFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-background/40 p-3"
                          >
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium">{file.original_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {file.category_label}
                                {file.unit ? ` · ${file.unit}` : ""}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Select
                                value={file.category}
                                onValueChange={(v) =>
                                  updateAdminLibraryFile(file.id, { category: v as FileCategory })
                                    .then(() => {
                                      toast.success("Category updated");
                                      setFilesKey((k) => k + 1);
                                      void load();
                                    })
                                    .catch((err) =>
                                      toast.error(err instanceof Error ? err.message : "Update failed"),
                                    )
                                }
                              >
                                <SelectTrigger className="h-8 w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {FILE_CATEGORY_ORDER.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                      {FILE_CATEGORY_LABELS[cat]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplaceFileId(file.id);
                                  setUploadCategory(file.category);
                                  replaceInputRef.current?.click();
                                }}
                              >
                                Replace
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => void handleDeleteFile(file.id, file.original_name)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          {loading ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : (
            <div className="glass-strong overflow-hidden rounded-2xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No pending requests.
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="font-mono font-semibold">{req.subject_code}</div>
                          <div className="text-xs text-muted-foreground">{req.subject_name}</div>
                        </TableCell>
                        <TableCell>
                          <div>{req.student_name || "—"}</div>
                          <div className="text-xs text-muted-foreground">{req.student_email}</div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{req.message || "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(req.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => void handleResolveRequest(req.id)}>
                            <Check className="h-4 w-4" />
                            Resolve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.ppt,.pptx,.docx,.doc,.txt"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) void handleUpload(files);
          e.target.value = "";
        }}
      />
      <input
        ref={replaceInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.ppt,.pptx,.docx,.doc,.txt"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleReplace(file);
          e.target.value = "";
        }}
      />

      <SubjectDialog
        open={createOpen}
        title="Create subject"
        form={form}
        onChange={setForm}
        onClose={() => setCreateOpen(false)}
        onSubmit={() => void handleCreateSubject()}
      />

      <SubjectDialog
        open={!!editSubject}
        title="Edit subject"
        form={form}
        onChange={setForm}
        onClose={() => setEditSubject(null)}
        onSubmit={() => void handleUpdateSubject()}
      />

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload file — {selectedSubject?.subject_code}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Category</Label>
              <Select value={uploadCategory} onValueChange={(v) => setUploadCategory(v as FileCategory)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILE_CATEGORY_ORDER.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {FILE_CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Unit (optional)</Label>
              <Input
                value={uploadUnit}
                onChange={(e) => setUploadUnit(e.target.value)}
                placeholder="Unit 1"
                className="mt-1"
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const files = Array.from(event.dataTransfer.files ?? []);
                if (files.length) void handleUpload(files);
              }}
              className="flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-background/40 p-5 text-center text-sm text-muted-foreground transition hover:bg-accent/40"
              disabled={uploading}
            >
              <Upload className="mb-2 h-5 w-5" />
              {uploading ? "Uploading to Cloudinary..." : "Drag & drop files here or select multiple files"}
            </button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-brand text-white"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Choose files"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SubjectDialog({
  open,
  title,
  form,
  onChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  form: {
    subject_code: string;
    subject_name: string;
    semester: string;
    department: string;
    unit: string;
    keywords: string;
  };
  onChange: (v: typeof form) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Subject code</Label>
            <Input
              value={form.subject_code}
              onChange={(e) => onChange({ ...form, subject_code: e.target.value.toUpperCase() })}
              className="mt-1 uppercase"
              placeholder="CSE316"
            />
          </div>
          <div>
            <Label>Subject name</Label>
            <Input
              value={form.subject_name}
              onChange={(e) => onChange({ ...form, subject_name: e.target.value })}
              className="mt-1"
              placeholder="Operating Systems"
            />
          </div>
          <div>
            <Label>Department</Label>
            <Input
              value={form.department}
              onChange={(e) => onChange({ ...form, department: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Semester</Label>
            <Input
              value={form.semester}
              onChange={(e) => onChange({ ...form, semester: e.target.value })}
              className="mt-1"
            />
          </div>
            <div className="sm:col-span-2">
              <Label>Default unit</Label>
              <Input
                value={form.unit}
                onChange={(e) => onChange({ ...form, unit: e.target.value })}
                className="mt-1"
              />
            </div>
          <div className="sm:col-span-2">
            <Label>Keywords</Label>
            <Input
              value={form.keywords}
              onChange={(e) => onChange({ ...form, keywords: e.target.value })}
              className="mt-1"
              placeholder="algorithms, lab, midterm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-gradient-brand text-white" onClick={onSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
