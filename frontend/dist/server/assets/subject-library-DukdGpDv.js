import { a as getToken, n as apiFetch, t as API_URL } from "./api-D3Wg_S4P.js";
//#region src/lib/subject-library.ts
var FILE_CATEGORY_LABELS = {
	ppt: "PPT",
	pptx: "PPTX",
	pdf: "PDF",
	doc: "DOC",
	docx: "DOCX",
	lab_manual: "Lab Manual",
	previous_year_papers: "Previous Year Papers"
};
var FILE_CATEGORY_ORDER = [
	"ppt",
	"pptx",
	"pdf",
	"doc",
	"docx",
	"lab_manual",
	"previous_year_papers"
];
async function searchSubjects(query, page = 1, signal) {
	return apiFetch(`/library/subjects/search?${new URLSearchParams({
		q: query,
		page: String(page),
		limit: "10"
	})}`, { signal });
}
async function fetchSubjectSuggestions(query, signal) {
	return apiFetch(`/library/subjects/suggestions?${new URLSearchParams({ q: query })}`, { signal });
}
async function fetchSubjectSections(signal) {
	return apiFetch("/library/subjects/sections", { signal });
}
async function fetchSubjectFiles(subjectCode, opts) {
	const qs = new URLSearchParams({
		page: String(opts?.page ?? 1),
		limit: "20"
	});
	if (opts?.category) qs.set("category", opts.category);
	return apiFetch(`/library/subjects/${encodeURIComponent(subjectCode)}/files?${qs}`, { signal: opts?.signal });
}
async function submitMaterialRequest(payload) {
	return apiFetch("/library/requests", {
		method: "POST",
		body: JSON.stringify(payload)
	});
}
async function setSubjectBookmark(subjectId, bookmarked) {
	return apiFetch(`/library/subjects/${subjectId}/bookmark`, { method: bookmarked ? "POST" : "DELETE" });
}
async function fetchFileRatings(fileId, signal) {
	return apiFetch(`/library/files/${fileId}/ratings`, { signal });
}
async function rateLibraryFile(fileId, payload) {
	return apiFetch(`/library/files/${fileId}/ratings`, {
		method: "POST",
		body: JSON.stringify(payload)
	});
}
function libraryDownloadUrl(path) {
	if (/^https?:\/\//i.test(path)) return path;
	return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
async function downloadLibraryFile(file) {
	const url = libraryDownloadUrl(file.download_url);
	const token = getToken();
	const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
	if (!res.ok) throw new Error(`Download failed (${res.status})`);
	const blob = await res.blob();
	const objectUrl = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = objectUrl;
	link.download = file.original_name;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(objectUrl);
}
function formatFileSize(bytes) {
	if (!bytes) return "—";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
//#endregion
export { fetchSubjectFiles as a, formatFileSize as c, setSubjectBookmark as d, submitMaterialRequest as f, fetchFileRatings as i, rateLibraryFile as l, FILE_CATEGORY_ORDER as n, fetchSubjectSections as o, downloadLibraryFile as r, fetchSubjectSuggestions as s, FILE_CATEGORY_LABELS as t, searchSubjects as u };
