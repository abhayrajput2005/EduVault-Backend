import { n as cn, t as Button } from "./button-DRsC1qZi.js";
import { t as Logo } from "./logo-CDC2jnoK.js";
import { t as Input } from "./input-DicJzR9-.js";
import { a as logout, n as isAdmin, o as refreshCurrentUser, r as isAuthenticated, t as currentUser } from "./auth-z1u2-BCU.js";
import { t as ThemeToggle } from "./theme-toggle-sbVVzOrz.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { BookOpen, Check, ChevronRight, Circle, FolderGit2, HelpCircle, LayoutDashboard, LogOut, Mail, Menu, MessageSquare, Search, Settings, Shield, UserRound } from "lucide-react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
//#region src/components/ui/avatar.tsx
var Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Root, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = AvatarPrimitive.Root.displayName;
var AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Image, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
var AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Fallback, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
//#endregion
//#region src/components/ui/dropdown-menu.tsx
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.RadioItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
//#endregion
//#region src/components/dashboard/navbar.tsx
function DashboardNavbar({ onMenu }) {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();
	const user = currentUser();
	const admin = isAdmin();
	const initials = (user?.name || user?.email || "EduVault").split(/\s|@/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "EV";
	function submitSearch() {
		const value = query.trim();
		if (!value) return;
		sessionStorage.setItem("eduvault_repository_search", value);
		navigate({ to: "/dashboard/repository" });
	}
	function handleLogout() {
		logout();
		navigate({
			to: "/login",
			replace: true
		});
	}
	return /* @__PURE__ */ jsx("header", {
		className: "sticky top-0 z-20 px-3 pt-3",
		children: /* @__PURE__ */ jsxs("div", {
			className: "glass-strong flex items-center gap-3 rounded-2xl px-3 py-2.5",
			children: [
				/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					size: "icon",
					onClick: onMenu,
					className: "md:hidden",
					"aria-label": "Menu",
					children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search your library, notes, courses...",
						className: "h-9 border-0 bg-background/40 pl-9 focus-visible:ring-1",
						onKeyDown: (e) => {
							if (e.key === "Enter") submitSearch();
						}
					})]
				}),
				/* @__PURE__ */ jsx(ThemeToggle, {}),
				/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "icon",
						className: "rounded-full",
						"aria-label": "Profile menu",
						children: /* @__PURE__ */ jsx(Avatar, {
							className: "h-9 w-9 ring-2 ring-border",
							children: /* @__PURE__ */ jsx(AvatarFallback, {
								className: "bg-gradient-brand text-xs font-semibold text-white",
								children: initials
							})
						})
					})
				}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
					align: "end",
					className: "w-56",
					children: [
						/* @__PURE__ */ jsxs(DropdownMenuLabel, { children: [/* @__PURE__ */ jsx("span", {
							className: "block truncate",
							children: user?.name || "Student"
						}), /* @__PURE__ */ jsx("span", {
							className: "block truncate text-xs font-normal text-muted-foreground",
							children: user?.email || "EduVault AI"
						})] }),
						/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							asChild: true,
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/dashboard/settings",
								children: [/* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }), "Settings"]
							})
						}),
						admin && /* @__PURE__ */ jsx(DropdownMenuItem, {
							asChild: true,
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/admin",
								children: [/* @__PURE__ */ jsx(Shield, { className: "h-4 w-4" }), "Admin Dashboard"]
							})
						}),
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							asChild: true,
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/dashboard/settings",
								children: [/* @__PURE__ */ jsx(UserRound, { className: "h-4 w-4" }), "Profile"]
							})
						}),
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							asChild: true,
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/help",
								children: [/* @__PURE__ */ jsx(HelpCircle, { className: "h-4 w-4" }), "Help Center"]
							})
						}),
						/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
						/* @__PURE__ */ jsxs(DropdownMenuItem, {
							onClick: handleLogout,
							className: "text-destructive focus:text-destructive",
							children: [/* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }), "Logout"]
						})
					]
				})] })
			]
		})
	});
}
//#endregion
//#region src/components/dashboard/sidebar.tsx
var main = [
	{
		label: "Overview",
		to: "/dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		label: "Repository",
		to: "/dashboard/repository",
		icon: FolderGit2
	},
	{
		label: "Subject Library",
		to: "/dashboard/subject-library",
		icon: BookOpen
	},
	{
		label: "AI Tutor",
		to: "/dashboard/repository",
		icon: MessageSquare
	}
];
function DashboardSidebar({ open, onClose }) {
	const path = useRouterState({ select: (r) => r.location.pathname });
	const secondary = [
		...isAdmin() ? [{
			label: "Admin Dashboard",
			to: "/admin",
			icon: Shield
		}] : [],
		{
			label: "Settings",
			to: "/dashboard/settings",
			icon: Settings
		},
		{
			label: "Help",
			to: "/help",
			icon: HelpCircle
		},
		{
			label: "Contact Us",
			to: "/contact",
			icon: Mail
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
		onClick: onClose,
		className: cn("fixed inset-0 z-30 bg-background/60 backdrop-blur-sm transition-opacity md:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")
	}), /* @__PURE__ */ jsx("aside", {
		className: cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-2 p-3 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0", open ? "translate-x-0" : "-translate-x-full"),
		children: /* @__PURE__ */ jsxs("div", {
			className: "glass-strong flex h-full flex-col rounded-2xl p-4",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "px-1 py-1",
					children: /* @__PURE__ */ jsx(Logo, { to: "/dashboard" })
				}),
				/* @__PURE__ */ jsxs("nav", {
					className: "mt-6 flex flex-1 flex-col gap-1",
					children: [
						/* @__PURE__ */ jsx(SectionLabel, { children: "Workspace" }),
						main.map((item) => /* @__PURE__ */ jsx(NavLink, {
							item,
							active: item.exact ? path === item.to : path.startsWith(item.to)
						}, item.label)),
						/* @__PURE__ */ jsx(SectionLabel, {
							className: "mt-6",
							children: "Account"
						}),
						secondary.map((item) => /* @__PURE__ */ jsx(NavLink, {
							item,
							active: path.startsWith(item.to) && item.to !== "/dashboard"
						}, item.label))
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-3 rounded-xl bg-gradient-brand p-px",
					children: /* @__PURE__ */ jsxs("div", {
						className: "rounded-[11px] bg-card/80 p-3 text-sm",
						children: [/* @__PURE__ */ jsx("div", {
							className: "font-semibold",
							children: "Study smarter"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: "Upload notes and let AI generate summaries, MCQs, and quizzes."
						})]
					})
				})
			]
		})
	})] });
}
function SectionLabel({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", className),
		children
	});
}
function NavLink({ item, active }) {
	const Icon = item.icon;
	return /* @__PURE__ */ jsxs(Link, {
		to: item.to,
		className: cn("group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "bg-gradient-brand text-white shadow-md shadow-indigo-500/30" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"),
		children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }), item.label]
	});
}
//#endregion
//#region src/routes/dashboard.tsx?tsr-split=component
function DashboardLayout() {
	const [open, setOpen] = useState(false);
	const [sessionReady, setSessionReady] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		if (!isAuthenticated()) {
			navigate({
				to: "/login",
				replace: true
			});
			return;
		}
		refreshCurrentUser().finally(() => setSessionReady(true));
	}, [navigate]);
	if (!sessionReady) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading workspace…"
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--brand-blue)_18%,transparent),transparent_34%),radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--brand-purple)_14%,transparent),transparent_32%)]" }), /* @__PURE__ */ jsxs("div", {
			className: "flex",
			children: [/* @__PURE__ */ jsx(DashboardSidebar, {
				open,
				onClose: () => setOpen(false)
			}), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ jsx(DashboardNavbar, { onMenu: () => setOpen(true) }), /* @__PURE__ */ jsx("main", {
					className: "mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8",
					children: /* @__PURE__ */ jsx(Outlet, {})
				})]
			})]
		})]
	});
}
//#endregion
export { DashboardLayout as component };
