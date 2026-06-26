//#region src/lib/api.ts
var API_URL = "http://127.0.0.1:5000/api".replace(/\/$/, "");
function getToken() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("eduvault_token");
}
function setSession(token, user) {
	if (typeof window === "undefined") return;
	localStorage.setItem("eduvault_token", token);
	if (user) localStorage.setItem("eduvault_user", JSON.stringify(user));
}
function clearSession() {
	if (typeof window === "undefined") return;
	localStorage.removeItem("eduvault_token");
	localStorage.removeItem("eduvault_user");
}
function getStoredUser() {
	if (typeof window === "undefined") return null;
	const raw = localStorage.getItem("eduvault_user");
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
async function apiFetch(path, init = {}) {
	const token = getToken();
	const headers = new Headers(init.headers);
	headers.set("Accept", "application/json");
	if (!(init.body instanceof FormData) && init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
	if (token) headers.set("Authorization", `Bearer ${token}`);
	const res = await fetch(`${API_URL}${path}`, {
		...init,
		headers
	});
	const text = await res.text();
	let data = null;
	if (text) try {
		data = JSON.parse(text);
	} catch {
		if (!res.ok) throw new Error(`Request failed (${res.status})`);
		throw new Error("Invalid response from server");
	}
	if (!res.ok) {
		const payload = data;
		throw new Error(payload?.message || payload?.error || `Request failed (${res.status})`);
	}
	return data;
}
//#endregion
export { getToken as a, getStoredUser as i, apiFetch as n, setSession as o, clearSession as r, API_URL as t };
