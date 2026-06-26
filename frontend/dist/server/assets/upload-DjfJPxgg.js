import { n as cn, t as Button } from "./button-DRsC1qZi.js";
import { n as apiFetch } from "./api-D3Wg_S4P.js";
import { t as Input } from "./input-DicJzR9-.js";
import { t as Label } from "./label-B4PTMSG2.js";
import { r as isAuthenticated } from "./auth-z1u2-BCU.js";
import { t as Progress } from "./progress-Crx1Tb8I.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, FileUp, Loader2, UploadCloud, X } from "lucide-react";
//#region src/services/upload.ts
async function uploadNote(formData) {
	return apiFetch("/upload/upload", {
		method: "POST",
		body: formData
	});
}
//#endregion
//#region src/components/upload/upload-zone.tsx
var allowed = [
	".pdf",
	".ppt",
	".pptx"
];
function UploadZone() {
	const inputRef = useRef(null);
	const [subject, setSubject] = useState("");
	const [unit, setUnit] = useState("");
	const [file, setFile] = useState(null);
	const [dragging, setDragging] = useState(false);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const fileError = useMemo(() => {
		if (!file) return null;
		const lower = file.name.toLowerCase();
		if (!allowed.some((ext) => lower.endsWith(ext))) return "Upload a PDF, PPT, or PPTX file.";
		if (file.size > 25 * 1024 * 1024) return "File must be 25 MB or smaller.";
		return null;
	}, [file]);
	function pick(next) {
		setFile(next);
		setProgress(0);
	}
	async function submit() {
		if (!file) {
			toast.error("Choose a file first");
			return;
		}
		if (fileError) {
			toast.error(fileError);
			return;
		}
		if (!subject.trim() || !unit.trim()) {
			toast.error("Subject and unit are required");
			return;
		}
		const form = new FormData();
		form.append("file", file);
		form.append("subject", subject.trim());
		form.append("unit", unit.trim());
		try {
			setLoading(true);
			setProgress(35);
			const timer = window.setInterval(() => {
				setProgress((p) => Math.min(p + 12, 88));
			}, 250);
			const data = await uploadNote(form);
			window.clearInterval(timer);
			setProgress(100);
			toast.success(data.message || "Upload successful");
			pick(null);
			if (inputRef.current) inputRef.current.value = "";
		} catch (err) {
			setProgress(0);
			toast.error(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "glass-strong rounded-2xl p-5 sm:p-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "subject",
					children: "Subject"
				}), /* @__PURE__ */ jsx(Input, {
					id: "subject",
					placeholder: "Data Structures",
					value: subject,
					onChange: (e) => setSubject(e.target.value)
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "unit",
					children: "Unit"
				}), /* @__PURE__ */ jsx(Input, {
					id: "unit",
					placeholder: "Unit 1",
					value: unit,
					onChange: (e) => setUnit(e.target.value)
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: cn("mt-5 grid min-h-64 place-items-center rounded-2xl border border-dashed p-6 text-center transition-colors", dragging ? "border-primary bg-primary/10" : "border-border bg-background/35"),
			onDragOver: (e) => {
				e.preventDefault();
				setDragging(true);
			},
			onDragLeave: () => setDragging(false),
			onDrop: (e) => {
				e.preventDefault();
				setDragging(false);
				pick(e.dataTransfer.files?.[0] ?? null);
			},
			children: [/* @__PURE__ */ jsx("input", {
				ref: inputRef,
				hidden: true,
				type: "file",
				accept: ".pdf,.ppt,.pptx",
				onChange: (e) => pick(e.target.files?.[0] ?? null)
			}), /* @__PURE__ */ jsxs("div", {
				className: "max-w-md",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white",
						children: /* @__PURE__ */ jsx(UploadCloud, { className: "h-7 w-7" })
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-4 text-xl font-semibold",
						children: "Drop your notes here"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "PDF, PPT, and PPTX files up to 25 MB are supported."
					}),
					file && /* @__PURE__ */ jsxs("div", {
						className: "mt-5 flex items-center justify-between gap-3 rounded-xl bg-background/60 p-3 text-left",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ jsx(FileUp, { className: "h-5 w-5 shrink-0 text-primary" }), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("p", {
									className: "truncate text-sm font-medium",
									children: file.name
								}), /* @__PURE__ */ jsx("p", {
									className: cn("text-xs", fileError ? "text-destructive" : "text-muted-foreground"),
									children: fileError || `${(file.size / 1024 / 1024).toFixed(2)} MB`
								})]
							})]
						}), /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => pick(null),
							"aria-label": "Remove file",
							children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
						})]
					}),
					loading && /* @__PURE__ */ jsx(Progress, {
						value: progress,
						className: "mt-5"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 flex flex-wrap justify-center gap-3",
						children: [/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							onClick: () => inputRef.current?.click(),
							disabled: loading,
							children: [/* @__PURE__ */ jsx(FileUp, { className: "h-4 w-4" }), "Choose file"]
						}), /* @__PURE__ */ jsxs(Button, {
							onClick: submit,
							disabled: loading || !!fileError,
							className: "bg-gradient-brand text-white",
							children: [loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), "Upload"]
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/routes/upload.tsx?tsr-split=component
function UploadPage() {
	const navigate = useNavigate();
	useEffect(() => {
		if (!isAuthenticated()) navigate({
			to: "/login",
			replace: true
		});
	}, [navigate]);
	return /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-4xl space-y-6",
			children: [
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "ghost",
					className: "px-0",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/dashboard",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), "Dashboard"]
					})
				}),
				/* @__PURE__ */ jsx("header", {
					className: "glass-strong rounded-2xl p-6",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-white",
							children: /* @__PURE__ */ jsx(UploadCloud, { className: "h-6 w-6" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
							className: "text-3xl font-bold tracking-tight",
							children: "Upload notes"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Add your study material with subject and unit metadata so EduVault can summarize, quiz, and organize it."
						})] })]
					})
				}),
				/* @__PURE__ */ jsx(UploadZone, {})
			]
		})
	});
}
//#endregion
export { UploadPage as component };
