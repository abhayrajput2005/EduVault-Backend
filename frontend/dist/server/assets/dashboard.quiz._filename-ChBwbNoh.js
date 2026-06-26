import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/dashboard.quiz.$filename.tsx
var $$splitComponentImporter = () => import("./dashboard.quiz._filename-BIxw0zgG.js");
var Route = createFileRoute("/dashboard/quiz/$filename")({
	head: ({ params }) => ({ meta: [{ title: `${params.filename} · Practice Quiz · EduVault AI` }, {
		name: "description",
		content: `AI-generated practice quiz with multiple-choice questions for ${params.filename}.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
