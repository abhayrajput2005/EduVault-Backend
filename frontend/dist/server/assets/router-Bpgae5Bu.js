import { t as ThemeProvider } from "./theme-provider-Gj1KbNGy.js";
import { t as Route$16 } from "./dashboard.summary._filename-CxHUKzgO.js";
import { t as Route$17 } from "./dashboard.quiz._filename-ChBwbNoh.js";
import { t as Route$18 } from "./dashboard.mcq._filename-0Cw45kEP.js";
import { t as Route$19 } from "./dashboard.chat._filename-c81zgU6Q.js";
import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
//#region src/styles.css?url
var styles_default = "/assets/styles-DtvUT-tc.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "EduVault AI" },
			{
				name: "description",
				content: "AI-powered learning platform."
			},
			{
				property: "og:title",
				content: "EduVault AI"
			},
			{
				property: "og:description",
				content: "AI-powered learning platform."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "EduVault AI"
			},
			{
				name: "twitter:description",
				content: "AI-powered learning platform."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5378e3d1-acac-407e-bc7e-0ae7daff7ddb/id-preview-e725f27c--e4d04d99-7de6-4107-8200-24e8c6feab0b.lovable.app-1782395936528.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5378e3d1-acac-407e-bc7e-0ae7daff7ddb/id-preview-e725f27c--e4d04d99-7de6-4107-8200-24e8c6feab0b.lovable.app-1782395936528.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsxs(ThemeProvider, { children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Toaster$1, {})] })
	});
}
//#endregion
//#region src/routes/upload.tsx
var $$splitComponentImporter$14 = () => import("./upload-DjfJPxgg.js");
var Route$14 = createFileRoute("/upload")({
	head: () => ({ meta: [{ title: "Upload Notes · EduVault AI" }, {
		name: "description",
		content: "Upload PDF, PPT, and PPTX study notes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
//#endregion
//#region src/routes/signup.tsx
var $$splitComponentImporter$13 = () => import("./signup-D5HJYoUv.js");
var Route$13 = createFileRoute("/signup")({
	head: () => ({ meta: [{ title: "Create account · EduVault AI" }, {
		name: "description",
		content: "Create your EduVault AI account and start learning."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
//#endregion
//#region src/routes/login.tsx
var $$splitComponentImporter$12 = () => import("./login-8jW_40I4.js");
var Route$12 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Sign in · EduVault AI" }, {
		name: "description",
		content: "Sign in to your EduVault AI account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
//#endregion
//#region src/routes/help.tsx
var $$splitComponentImporter$11 = () => import("./help-CjcY2N6g.js");
var Route$11 = createFileRoute("/help")({
	head: () => ({ meta: [{ title: "Help Center | EduVault AI" }, {
		name: "description",
		content: "FAQ and usage guides for EduVault AI."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
//#endregion
//#region src/routes/dashboard.tsx
var $$splitComponentImporter$10 = () => import("./dashboard-UQHco7nf.js");
var Route$10 = createFileRoute("/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
//#endregion
//#region src/routes/contact.tsx
var $$splitComponentImporter$9 = () => import("./contact-ZmIiPl6_.js");
var Route$9 = createFileRoute("/contact")({
	head: () => ({ meta: [{ title: "Contact Us | EduVault AI" }, {
		name: "description",
		content: "Contact the EduVault AI developer and view project details."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/admin.tsx
var $$splitComponentImporter$8 = () => import("./admin-BlpTjA67.js");
var Route$8 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
//#endregion
//#region src/routes/about.tsx
var $$splitComponentImporter$7 = () => import("./about-CfPhbXM1.js");
var Route$7 = createFileRoute("/about")({
	head: () => ({ meta: [{ title: "About | EduVault AI" }, {
		name: "description",
		content: "Learn about EduVault AI and its AI-powered study workflow."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$6 = () => import("./routes-rbHJMDQk.js");
var Route$6 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "EduVault AI — Learn anything, faster with AI" },
		{
			name: "description",
			content: "EduVault AI turns your notes, lectures and textbooks into adaptive lessons, summaries and study plans."
		},
		{
			property: "og:title",
			content: "EduVault AI"
		},
		{
			property: "og:description",
			content: "AI-powered learning platform for students and lifelong learners."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/dashboard.index.tsx
var $$splitComponentImporter$5 = () => import("./dashboard.index-DAS_nTPX.js");
var Route$5 = createFileRoute("/dashboard/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
//#endregion
//#region src/routes/admin.index.tsx
var $$splitComponentImporter$4 = () => import("./admin.index-3UW-L9Vv.js");
var Route$4 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
//#endregion
//#region src/routes/dashboard.subject-library.tsx
var $$splitComponentImporter$3 = () => import("./dashboard.subject-library-15LU7HRI.js");
var Route$3 = createFileRoute("/dashboard/subject-library")({
	head: () => ({ meta: [{ title: "Subject Library · EduVault AI" }, {
		name: "description",
		content: "Search study materials by subject code — PPT, PDF, lab manuals, and past papers."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/dashboard.settings.tsx
var $$splitComponentImporter$2 = () => import("./dashboard.settings-CNOtLYuu.js");
var Route$2 = createFileRoute("/dashboard/settings")({
	head: () => ({ meta: [{ title: "Settings | EduVault AI" }, {
		name: "description",
		content: "Manage EduVault AI profile, theme, and account actions."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/dashboard.repository.tsx
var $$splitComponentImporter$1 = () => import("./dashboard.repository-C6-TGI4o.js");
var Route$1 = createFileRoute("/dashboard/repository")({
	head: () => ({ meta: [{ title: "Repository · EduVault AI" }, {
		name: "description",
		content: "Browse, search and filter your uploaded notes by subject and unit in the EduVault AI repository."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/admin.subject-library.tsx
var $$splitComponentImporter = () => import("./admin.subject-library-DXWz-BlV.js");
var Route = createFileRoute("/admin/subject-library")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var UploadRoute = Route$14.update({
	id: "/upload",
	path: "/upload",
	getParentRoute: () => Route$15
});
var SignupRoute = Route$13.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$15
});
var LoginRoute = Route$12.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$15
});
var HelpRoute = Route$11.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => Route$15
});
var DashboardRoute = Route$10.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$15
});
var ContactRoute = Route$9.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$15
});
var AdminRoute = Route$8.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$15
});
var AboutRoute = Route$7.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$15
});
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$15
});
var DashboardIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRoute
});
var AdminIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var DashboardSubjectLibraryRoute = Route$3.update({
	id: "/subject-library",
	path: "/subject-library",
	getParentRoute: () => DashboardRoute
});
var DashboardSettingsRoute = Route$2.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DashboardRoute
});
var DashboardRepositoryRoute = Route$1.update({
	id: "/repository",
	path: "/repository",
	getParentRoute: () => DashboardRoute
});
var AdminSubjectLibraryRoute = Route.update({
	id: "/subject-library",
	path: "/subject-library",
	getParentRoute: () => AdminRoute
});
var DashboardSummaryFilenameRoute = Route$16.update({
	id: "/summary/$filename",
	path: "/summary/$filename",
	getParentRoute: () => DashboardRoute
});
var DashboardQuizFilenameRoute = Route$17.update({
	id: "/quiz/$filename",
	path: "/quiz/$filename",
	getParentRoute: () => DashboardRoute
});
var DashboardMcqFilenameRoute = Route$18.update({
	id: "/mcq/$filename",
	path: "/mcq/$filename",
	getParentRoute: () => DashboardRoute
});
var DashboardChatFilenameRoute = Route$19.update({
	id: "/chat/$filename",
	path: "/chat/$filename",
	getParentRoute: () => DashboardRoute
});
var AdminRouteChildren = {
	AdminSubjectLibraryRoute,
	AdminIndexRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var DashboardRouteChildren = {
	DashboardRepositoryRoute,
	DashboardSettingsRoute,
	DashboardSubjectLibraryRoute,
	DashboardIndexRoute,
	DashboardChatFilenameRoute,
	DashboardMcqFilenameRoute,
	DashboardQuizFilenameRoute,
	DashboardSummaryFilenameRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AdminRoute: AdminRouteWithChildren,
	ContactRoute,
	DashboardRoute: DashboardRoute._addFileChildren(DashboardRouteChildren),
	HelpRoute,
	LoginRoute,
	SignupRoute,
	UploadRoute
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
