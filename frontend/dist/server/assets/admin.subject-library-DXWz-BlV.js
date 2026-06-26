import { t as Button } from "./button-DRsC1qZi.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.js";
import { t as Badge } from "./badge-Cc0IblCb.js";
import { t as Skeleton } from "./skeleton-wE5XVTSu.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BQuBX6bn.js";
import { n as apiFetch } from "./api-D3Wg_S4P.js";
import { t as Input } from "./input-DicJzR9-.js";
import { t as Label } from "./label-B4PTMSG2.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.js";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.js";
import { a as fetchSubjectFiles, n as FILE_CATEGORY_ORDER, t as FILE_CATEGORY_LABELS } from "./subject-library-DukdGpDv.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, Check, Pencil, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
//#region src/lib/admin-subject-library.ts
async function fetchAdminLibrarySubjects(opts) {
	const qs = new URLSearchParams({
		page: String(opts?.page ?? 1),
		limit: "20"
	});
	if (opts?.q) qs.set("q", opts.q);
	return apiFetch(`/admin/library/subjects?${qs}`, { signal: opts?.signal });
}
async function createAdminLibrarySubject(payload) {
	return apiFetch("/admin/library/subjects", {
		method: "POST",
		body: JSON.stringify(payload)
	});
}
async function updateAdminLibrarySubject(subjectId, payload) {
	return apiFetch(`/admin/library/subjects/${subjectId}`, {
		method: "PATCH",
		body: JSON.stringify(payload)
	});
}
async function deleteAdminLibrarySubject(subjectId) {
	return apiFetch(`/admin/library/subjects/${subjectId}`, { method: "DELETE" });
}
async function uploadAdminLibraryFile(subjectId, formData) {
	return apiFetch(`/admin/library/subjects/${subjectId}/files`, {
		method: "POST",
		body: formData
	});
}
async function updateAdminLibraryFile(fileId, payload) {
	return apiFetch(`/admin/library/files/${fileId}`, {
		method: "PATCH",
		body: JSON.stringify(payload)
	});
}
async function replaceAdminLibraryFile(fileId, formData) {
	return apiFetch(`/admin/library/files/${fileId}`, {
		method: "PUT",
		body: formData
	});
}
async function deleteAdminLibraryFile(fileId) {
	return apiFetch(`/admin/library/files/${fileId}`, { method: "DELETE" });
}
async function fetchAdminMaterialRequests(opts) {
	return apiFetch(`/admin/library/requests?${new URLSearchParams({
		page: String(opts?.page ?? 1),
		limit: "20",
		status: opts?.status ?? "pending"
	})}`, { signal: opts?.signal });
}
async function resolveAdminMaterialRequest(requestId, status = "resolved") {
	return apiFetch(`/admin/library/requests/${requestId}`, {
		method: "PATCH",
		body: JSON.stringify({ status })
	});
}
//#endregion
//#region src/routes/admin.subject-library.tsx?tsr-split=component
function AdminSubjectLibraryPage() {
	const [subjects, setSubjects] = useState([]);
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedSubject, setSelectedSubject] = useState(null);
	const [subjectFiles, setSubjectFiles] = useState([]);
	const [filesLoading, setFilesLoading] = useState(false);
	const [filesKey, setFilesKey] = useState(0);
	const [createOpen, setCreateOpen] = useState(false);
	const [editSubject, setEditSubject] = useState(null);
	const [uploadOpen, setUploadOpen] = useState(false);
	const [replaceFileId, setReplaceFileId] = useState(null);
	const fileInputRef = useRef(null);
	const replaceInputRef = useRef(null);
	const [form, setForm] = useState({
		subject_code: "",
		subject_name: "",
		semester: "",
		department: "",
		unit: "",
		keywords: ""
	});
	const [uploadCategory, setUploadCategory] = useState("pdf");
	const [uploadUnit, setUploadUnit] = useState("");
	const [uploading, setUploading] = useState(false);
	const load = useCallback(async (signal) => {
		setLoading(true);
		try {
			const [subjectsRes, requestsRes] = await Promise.all([fetchAdminLibrarySubjects({ signal }), fetchAdminMaterialRequests({ signal })]);
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
		load(controller.signal);
		return () => controller.abort();
	}, [load]);
	useEffect(() => {
		if (!selectedSubject) {
			setSubjectFiles([]);
			return;
		}
		setFilesLoading(true);
		fetchSubjectFiles(selectedSubject.subject_code).then((data) => setSubjectFiles(data.files)).catch(() => setSubjectFiles([])).finally(() => setFilesLoading(false));
	}, [selectedSubject, filesKey]);
	function resetForm() {
		setForm({
			subject_code: "",
			subject_name: "",
			semester: "",
			department: "",
			unit: "",
			keywords: ""
		});
	}
	async function handleCreateSubject() {
		try {
			await createAdminLibrarySubject({
				...form,
				subject_code: form.subject_code.toUpperCase(),
				keywords: form.keywords.split(",").map((item) => item.trim()).filter(Boolean)
			});
			toast.success("Subject created");
			setCreateOpen(false);
			resetForm();
			load();
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
				keywords: form.keywords.split(",").map((item) => item.trim()).filter(Boolean)
			});
			toast.success("Subject updated");
			setEditSubject(null);
			resetForm();
			load();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Update failed");
		}
	}
	async function handleDeleteSubject(id, code) {
		if (!window.confirm(`Delete subject ${code} and all its files?`)) return;
		try {
			await deleteAdminLibrarySubject(id);
			toast.success("Subject deleted");
			if (selectedSubject?.id === id) setSelectedSubject(null);
			load();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Delete failed");
		}
	}
	async function handleUpload(files) {
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
			load();
			setFilesKey((k) => k + 1);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setUploading(false);
		}
	}
	async function handleReplace(file) {
		if (!replaceFileId) return;
		const fd = new FormData();
		fd.append("file", file);
		fd.append("category", uploadCategory);
		try {
			await replaceAdminLibraryFile(replaceFileId, fd);
			toast.success("File replaced");
			setReplaceFileId(null);
			load();
			setFilesKey((k) => k + 1);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Replace failed");
		}
	}
	async function handleDeleteFile(fileId, name) {
		if (!window.confirm(`Delete ${name}?`)) return;
		try {
			await deleteAdminLibraryFile(fileId);
			toast.success("File deleted");
			load();
			setFilesKey((k) => k + 1);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Delete failed");
		}
	}
	async function handleResolveRequest(id) {
		try {
			await resolveAdminMaterialRequest(id);
			toast.success("Request marked resolved");
			load();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Update failed");
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						className: "mb-2 -ml-2",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/admin",
							children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), "Admin Dashboard"]
						})
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-bold tracking-tight",
						children: "Subject Library Management"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Create subjects, upload materials, and review student requests."
					})
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						onClick: () => void load(),
						children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" }), "Refresh"]
					}), /* @__PURE__ */ jsxs(Button, {
						className: "bg-gradient-brand text-white",
						onClick: () => {
							resetForm();
							setCreateOpen(true);
						},
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "New Subject"]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs(Tabs, {
				defaultValue: "subjects",
				children: [
					/* @__PURE__ */ jsxs(TabsList, { children: [/* @__PURE__ */ jsx(TabsTrigger, {
						value: "subjects",
						children: "Subjects"
					}), /* @__PURE__ */ jsxs(TabsTrigger, {
						value: "requests",
						children: ["Requests", requests.length > 0 && /* @__PURE__ */ jsx(Badge, {
							className: "ml-2",
							variant: "secondary",
							children: requests.length
						})]
					})] }),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "subjects",
						className: "mt-4 space-y-4",
						children: loading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-64 rounded-2xl" }) : /* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 lg:grid-cols-[1fr_1.2fr]",
							children: [/* @__PURE__ */ jsx("div", {
								className: "glass-strong overflow-hidden rounded-2xl border",
								children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
									/* @__PURE__ */ jsx(TableHead, { children: "Code" }),
									/* @__PURE__ */ jsx(TableHead, { children: "Name" }),
									/* @__PURE__ */ jsx(TableHead, {
										className: "text-right",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ jsx(TableBody, { children: subjects.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
									colSpan: 3,
									className: "text-center text-muted-foreground",
									children: "No subjects yet. Create one to get started."
								}) }) : subjects.map((s) => /* @__PURE__ */ jsxs(TableRow, {
									className: selectedSubject?.id === s.id ? "bg-accent/30" : "cursor-pointer",
									onClick: () => setSelectedSubject(s),
									children: [
										/* @__PURE__ */ jsx(TableCell, {
											className: "font-mono font-semibold",
											children: s.subject_code
										}),
										/* @__PURE__ */ jsx(TableCell, { children: s.subject_name }),
										/* @__PURE__ */ jsx(TableCell, {
											className: "text-right",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex justify-end gap-1",
												children: [/* @__PURE__ */ jsx(Button, {
													size: "icon",
													variant: "ghost",
													onClick: (e) => {
														e.stopPropagation();
														setForm({
															subject_code: s.subject_code,
															subject_name: s.subject_name,
															semester: s.semester,
															department: s.department,
															unit: s.unit,
															keywords: s.keywords?.join(", ") ?? ""
														});
														setEditSubject(s);
													},
													children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
												}), /* @__PURE__ */ jsx(Button, {
													size: "icon",
													variant: "ghost",
													onClick: (e) => {
														e.stopPropagation();
														handleDeleteSubject(s.id, s.subject_code);
													},
													children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" })
												})]
											})
										})
									]
								}, s.id)) })] })
							}), /* @__PURE__ */ jsx("div", {
								className: "glass-strong rounded-2xl p-5",
								children: !selectedSubject ? /* @__PURE__ */ jsxs("div", {
									className: "flex h-full min-h-[280px] flex-col items-center justify-center text-center text-muted-foreground",
									children: [/* @__PURE__ */ jsx(BookOpen, { className: "mb-3 h-8 w-8 opacity-50" }), /* @__PURE__ */ jsx("p", { children: "Select a subject to manage files" })]
								}) : /* @__PURE__ */ jsxs(Fragment, { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-start justify-between gap-3",
										children: [/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx(Badge, {
												className: "bg-gradient-brand border-0 text-white",
												children: selectedSubject.subject_code
											}),
											/* @__PURE__ */ jsx("h2", {
												className: "mt-2 text-lg font-semibold",
												children: selectedSubject.subject_name
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-sm text-muted-foreground",
												children: [selectedSubject.department, selectedSubject.semester && `Sem ${selectedSubject.semester}`].filter(Boolean).join(" · ")
											})
										] }), /* @__PURE__ */ jsxs(Button, {
											size: "sm",
											className: "bg-gradient-brand text-white",
											onClick: () => setUploadOpen(true),
											children: [/* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }), "Upload file"]
										})]
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "mt-4 text-sm text-muted-foreground",
										children: [selectedSubject.file_count, " file(s) · Use upload to add PDF, PPT, DOCX, lab manuals, or past papers."]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: "Uploaded files sync with Summary, Quiz, and AI Tutor automatically."
									}),
									filesLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "mt-4 h-32 rounded-xl" }) : subjectFiles.length === 0 ? /* @__PURE__ */ jsx("p", {
										className: "mt-4 rounded-xl border border-dashed p-4 text-sm text-muted-foreground",
										children: "No files uploaded yet."
									}) : /* @__PURE__ */ jsx("div", {
										className: "mt-4 space-y-2",
										children: subjectFiles.map((file) => /* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-background/40 p-3",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ jsx("div", {
													className: "truncate text-sm font-medium",
													children: file.original_name
												}), /* @__PURE__ */ jsxs("div", {
													className: "text-xs text-muted-foreground",
													children: [file.category_label, file.unit ? ` · ${file.unit}` : ""]
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex gap-1",
												children: [
													/* @__PURE__ */ jsxs(Select, {
														value: file.category,
														onValueChange: (v) => updateAdminLibraryFile(file.id, { category: v }).then(() => {
															toast.success("Category updated");
															setFilesKey((k) => k + 1);
															load();
														}).catch((err) => toast.error(err instanceof Error ? err.message : "Update failed")),
														children: [/* @__PURE__ */ jsx(SelectTrigger, {
															className: "h-8 w-[140px]",
															children: /* @__PURE__ */ jsx(SelectValue, {})
														}), /* @__PURE__ */ jsx(SelectContent, { children: FILE_CATEGORY_ORDER.map((cat) => /* @__PURE__ */ jsx(SelectItem, {
															value: cat,
															children: FILE_CATEGORY_LABELS[cat]
														}, cat)) })]
													}),
													/* @__PURE__ */ jsx(Button, {
														size: "sm",
														variant: "outline",
														onClick: () => {
															setReplaceFileId(file.id);
															setUploadCategory(file.category);
															replaceInputRef.current?.click();
														},
														children: "Replace"
													}),
													/* @__PURE__ */ jsx(Button, {
														size: "icon",
														variant: "ghost",
														onClick: () => void handleDeleteFile(file.id, file.original_name),
														children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" })
													})
												]
											})]
										}, file.id))
									})
								] })
							})]
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "requests",
						className: "mt-4",
						children: loading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-64 rounded-2xl" }) : /* @__PURE__ */ jsx("div", {
							className: "glass-strong overflow-hidden rounded-2xl border",
							children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
								/* @__PURE__ */ jsx(TableHead, { children: "Subject" }),
								/* @__PURE__ */ jsx(TableHead, { children: "Student" }),
								/* @__PURE__ */ jsx(TableHead, { children: "Message" }),
								/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
								/* @__PURE__ */ jsx(TableHead, {
									className: "text-right",
									children: "Action"
								})
							] }) }), /* @__PURE__ */ jsx(TableBody, { children: requests.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
								colSpan: 5,
								className: "text-center text-muted-foreground",
								children: "No pending requests."
							}) }) : requests.map((req) => /* @__PURE__ */ jsxs(TableRow, { children: [
								/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
									className: "font-mono font-semibold",
									children: req.subject_code
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs text-muted-foreground",
									children: req.subject_name
								})] }),
								/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", { children: req.student_name || "—" }), /* @__PURE__ */ jsx("div", {
									className: "text-xs text-muted-foreground",
									children: req.student_email
								})] }),
								/* @__PURE__ */ jsx(TableCell, {
									className: "max-w-[200px] truncate",
									children: req.message || "—"
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-xs text-muted-foreground",
									children: new Date(req.created_at).toLocaleDateString()
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-right",
									children: /* @__PURE__ */ jsxs(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => void handleResolveRequest(req.id),
										children: [/* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }), "Resolve"]
									})
								})
							] }, req.id)) })] })
						})
					})
				]
			}),
			/* @__PURE__ */ jsx("input", {
				ref: fileInputRef,
				type: "file",
				className: "hidden",
				accept: ".pdf,.ppt,.pptx,.docx,.doc,.txt",
				multiple: true,
				onChange: (e) => {
					const files = Array.from(e.target.files ?? []);
					if (files.length) handleUpload(files);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ jsx("input", {
				ref: replaceInputRef,
				type: "file",
				className: "hidden",
				accept: ".pdf,.ppt,.pptx,.docx,.doc,.txt",
				onChange: (e) => {
					const file = e.target.files?.[0];
					if (file) handleReplace(file);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ jsx(SubjectDialog, {
				open: createOpen,
				title: "Create subject",
				form,
				onChange: setForm,
				onClose: () => setCreateOpen(false),
				onSubmit: () => void handleCreateSubject()
			}),
			/* @__PURE__ */ jsx(SubjectDialog, {
				open: !!editSubject,
				title: "Edit subject",
				form,
				onChange: setForm,
				onClose: () => setEditSubject(null),
				onSubmit: () => void handleUpdateSubject()
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: uploadOpen,
				onOpenChange: setUploadOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: ["Upload file — ", selectedSubject?.subject_code] }) }),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Category" }), /* @__PURE__ */ jsxs(Select, {
								value: uploadCategory,
								onValueChange: (v) => setUploadCategory(v),
								children: [/* @__PURE__ */ jsx(SelectTrigger, {
									className: "mt-1",
									children: /* @__PURE__ */ jsx(SelectValue, {})
								}), /* @__PURE__ */ jsx(SelectContent, { children: FILE_CATEGORY_ORDER.map((cat) => /* @__PURE__ */ jsx(SelectItem, {
									value: cat,
									children: FILE_CATEGORY_LABELS[cat]
								}, cat)) })]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Unit (optional)" }), /* @__PURE__ */ jsx(Input, {
								value: uploadUnit,
								onChange: (e) => setUploadUnit(e.target.value),
								placeholder: "Unit 1",
								className: "mt-1"
							})] }),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => fileInputRef.current?.click(),
								onDragOver: (event) => event.preventDefault(),
								onDrop: (event) => {
									event.preventDefault();
									const files = Array.from(event.dataTransfer.files ?? []);
									if (files.length) handleUpload(files);
								},
								className: "flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-background/40 p-5 text-center text-sm text-muted-foreground transition hover:bg-accent/40",
								disabled: uploading,
								children: [/* @__PURE__ */ jsx(Upload, { className: "mb-2 h-5 w-5" }), uploading ? "Uploading to Cloudinary..." : "Drag & drop files here or select multiple files"]
							})
						]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setUploadOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						className: "bg-gradient-brand text-white",
						onClick: () => fileInputRef.current?.click(),
						disabled: uploading,
						children: uploading ? "Uploading..." : "Choose files"
					})] })
				] })
			})
		]
	});
}
function SubjectDialog({ open, title, form, onChange, onClose, onSubmit }) {
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, { children: [
			/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: title }) }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Subject code" }), /* @__PURE__ */ jsx(Input, {
						value: form.subject_code,
						onChange: (e) => onChange({
							...form,
							subject_code: e.target.value.toUpperCase()
						}),
						className: "mt-1 uppercase",
						placeholder: "CSE316"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Subject name" }), /* @__PURE__ */ jsx(Input, {
						value: form.subject_name,
						onChange: (e) => onChange({
							...form,
							subject_name: e.target.value
						}),
						className: "mt-1",
						placeholder: "Operating Systems"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Department" }), /* @__PURE__ */ jsx(Input, {
						value: form.department,
						onChange: (e) => onChange({
							...form,
							department: e.target.value
						}),
						className: "mt-1"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Semester" }), /* @__PURE__ */ jsx(Input, {
						value: form.semester,
						onChange: (e) => onChange({
							...form,
							semester: e.target.value
						}),
						className: "mt-1"
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ jsx(Label, { children: "Default unit" }), /* @__PURE__ */ jsx(Input, {
							value: form.unit,
							onChange: (e) => onChange({
								...form,
								unit: e.target.value
							}),
							className: "mt-1"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ jsx(Label, { children: "Keywords" }), /* @__PURE__ */ jsx(Input, {
							value: form.keywords,
							onChange: (e) => onChange({
								...form,
								keywords: e.target.value
							}),
							className: "mt-1",
							placeholder: "algorithms, lab, midterm"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
				variant: "outline",
				onClick: onClose,
				children: "Cancel"
			}), /* @__PURE__ */ jsx(Button, {
				className: "bg-gradient-brand text-white",
				onClick: onSubmit,
				children: "Save"
			})] })
		] })
	});
}
//#endregion
export { AdminSubjectLibraryPage as component };
