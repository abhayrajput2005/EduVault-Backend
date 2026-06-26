import { a as getToken, i as getStoredUser, n as apiFetch, o as setSession, r as clearSession } from "./api-D3Wg_S4P.js";
//#region src/services/auth.ts
function parseJwtPayload(token) {
	try {
		const segment = token.split(".")[1];
		if (!segment) return null;
		const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
		const json = atob(normalized);
		return JSON.parse(json);
	} catch {
		return null;
	}
}
function isAuthenticated() {
	return Boolean(getToken());
}
function currentUser() {
	return getStoredUser();
}
async function refreshCurrentUser() {
	if (!isAuthenticated()) return null;
	try {
		const data = await apiFetch("/auth/me");
		const token = getToken();
		if (token && data.user) setSession(token, data.user);
		return data.user;
	} catch {
		return currentUser();
	}
}
async function login(email, password) {
	const data = await apiFetch("/auth/login", {
		method: "POST",
		body: JSON.stringify({
			email,
			password
		})
	});
	setSession(data.token, data.user);
	return data;
}
async function register(payload) {
	const name = `${payload.firstName} ${payload.lastName}`.trim();
	const data = await apiFetch("/auth/register", {
		method: "POST",
		body: JSON.stringify({
			email: payload.email,
			password: payload.password,
			name
		})
	});
	setSession(data.token, data.user);
	return data;
}
function logout() {
	clearSession();
}
function isAdmin() {
	if (currentUser()?.isAdmin) return true;
	const token = getToken();
	if (!token) return false;
	const payload = parseJwtPayload(token);
	return Boolean(payload?.is_admin);
}
//#endregion
export { logout as a, login as i, isAdmin as n, refreshCurrentUser as o, isAuthenticated as r, register as s, currentUser as t };
