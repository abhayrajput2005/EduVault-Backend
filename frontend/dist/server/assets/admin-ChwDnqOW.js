import { n as apiFetch } from "./api-D3Wg_S4P.js";
//#region src/lib/admin.ts
async function fetchAdminUsers(signal) {
	return apiFetch("/admin/users", { signal });
}
async function fetchAdminUploads(signal) {
	return apiFetch("/admin/uploads", { signal });
}
async function fetchAdminAnalytics(signal) {
	return apiFetch("/admin/analytics", { signal });
}
async function approveAdminUpload(noteId) {
	return apiFetch(`/admin/uploads/${noteId}/approve`, { method: "PATCH" });
}
async function deleteAdminUpload(noteId) {
	return apiFetch(`/admin/uploads/${noteId}`, { method: "DELETE" });
}
//#endregion
export { fetchAdminUsers as a, fetchAdminUploads as i, deleteAdminUpload as n, fetchAdminAnalytics as r, approveAdminUpload as t };
