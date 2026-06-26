import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/dashboard.summary.$filename.tsx
var $$splitComponentImporter = () => import("./dashboard.summary._filename-xNCfYNzk.js");
var Route = createFileRoute("/dashboard/summary/$filename")({
	head: ({ params }) => ({ meta: [{ title: `${params.filename} · AI Summary · EduVault AI` }, {
		name: "description",
		content: `AI-generated summary, key points and important topics for ${params.filename}.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
