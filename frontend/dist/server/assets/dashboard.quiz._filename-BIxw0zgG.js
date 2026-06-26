import { t as Route } from "./dashboard.quiz._filename-ChBwbNoh.js";
import { n as cn, t as Button } from "./button-DRsC1qZi.js";
import { t as Badge } from "./badge-Cc0IblCb.js";
import { t as Breadcrumbs } from "./breadcrumbs-CFNgtDVY.js";
import { a as QuizEmptyState, i as submitQuiz, n as performanceMessage, o as QuizErrorState, r as scoreQuiz, s as QuizSkeleton, t as fetchQuiz } from "./quiz-CvF0X0xo.js";
import { t as Progress } from "./progress-Crx1Tb8I.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Clock, Eye, FileText, Flag, HelpCircle, ListOrdered, Play, RotateCcw, Timer, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
//#region src/components/quiz/confetti.tsx
function Confetti({ active }) {
	const pieces = useMemo(() => Array.from({ length: 48 }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		delay: Math.random() * .4,
		duration: 1.8 + Math.random() * 1.2,
		color: [
			"#6366f1",
			"#a855f7",
			"#22c55e",
			"#f59e0b",
			"#ec4899"
		][i % 5],
		rotate: Math.random() * 360
	})), []);
	if (!active) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "pointer-events-none fixed inset-0 z-50 overflow-hidden",
		children: pieces.map((p) => /* @__PURE__ */ jsx(motion.span, {
			initial: {
				opacity: 1,
				y: -20,
				x: `${p.x}vw`,
				rotate: 0
			},
			animate: {
				opacity: 0,
				y: "110vh",
				rotate: p.rotate + 720
			},
			transition: {
				duration: p.duration,
				delay: p.delay,
				ease: "easeOut"
			},
			className: "absolute top-0 h-3 w-2 rounded-sm",
			style: { backgroundColor: p.color }
		}, p.id))
	});
}
//#endregion
//#region src/components/quiz/quiz-start.tsx
function QuizStart({ quiz, onStart }) {
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 12
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: "glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10",
		children: [
			/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-brand opacity-25 blur-3xl" }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-start gap-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [quiz.subject && /* @__PURE__ */ jsx(Badge, {
							className: "bg-gradient-brand border-0 text-[10px] font-semibold uppercase tracking-wider text-white",
							children: quiz.subject
						}), quiz.unit && /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: "glass border-0 text-xs font-medium",
							children: quiz.unit
						})]
					}),
					/* @__PURE__ */ jsxs("h1", {
						className: "text-3xl font-bold tracking-tight sm:text-4xl",
						children: ["Practice ", /* @__PURE__ */ jsx("span", {
							className: "text-gradient-brand",
							children: "Quiz"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ jsx(FileText, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
							className: "break-words",
							title: quiz.filename,
							children: quiz.filename
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsx(Stat$1, {
					icon: /* @__PURE__ */ jsx(ListOrdered, { className: "h-4 w-4" }),
					label: "Questions",
					value: `${quiz.questions.length}`
				}), /* @__PURE__ */ jsx(Stat$1, {
					icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
					label: "Estimated time",
					value: `${quiz.estimatedMinutes} min`
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ jsxs(Button, {
					size: "lg",
					className: "bg-gradient-brand text-white shadow-lg shadow-indigo-500/30 hover:opacity-95",
					onClick: onStart,
					children: [/* @__PURE__ */ jsx(Play, { className: "h-4 w-4" }), "Start Practice"]
				}), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					size: "lg",
					variant: "outline",
					className: "glass border-0",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/dashboard/repository",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to Repository"]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-6 text-xs text-muted-foreground",
				children: [
					"Tip: use ",
					/* @__PURE__ */ jsx(Kbd, { children: "1-4" }),
					" to select an option, ",
					/* @__PURE__ */ jsx(Kbd, { children: "←" }),
					" / ",
					/* @__PURE__ */ jsx(Kbd, { children: "→" }),
					" to navigate, and",
					" ",
					/* @__PURE__ */ jsx(Kbd, { children: "Enter" }),
					" to continue."
				]
			})
		]
	});
}
function Stat$1({ icon, label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "glass flex items-center gap-3 rounded-2xl p-4",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white",
			children: icon
		}), /* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-xs text-muted-foreground",
				children: label
			}), /* @__PURE__ */ jsx("div", {
				className: "truncate text-lg font-semibold",
				children: value
			})]
		})]
	});
}
function Kbd({ children }) {
	return /* @__PURE__ */ jsx("kbd", {
		className: "rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-foreground",
		children
	});
}
//#endregion
//#region src/components/quiz/quiz-question.tsx
var OPTION_LETTERS = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F"
];
function QuizQuestion({ question, selected, onSelect }) {
	return /* @__PURE__ */ jsx(AnimatePresence, {
		mode: "wait",
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				y: 16
			},
			animate: {
				opacity: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				y: -16
			},
			transition: { duration: .3 },
			className: "space-y-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-2",
					children: [question.difficulty && /* @__PURE__ */ jsx(Badge, {
						variant: "outline",
						className: "text-xs",
						children: question.difficulty
					}), question.topic && /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "text-xs",
						children: question.topic
					})]
				}), /* @__PURE__ */ jsx("h2", {
					className: "text-xl font-semibold leading-snug tracking-tight sm:text-2xl",
					children: question.question
				})]
			}), /* @__PURE__ */ jsx("ul", {
				className: "grid gap-3",
				role: "radiogroup",
				"aria-label": "Answer options",
				children: question.options.map((opt, i) => {
					const isSelected = selected === i;
					return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
						type: "button",
						role: "radio",
						"aria-checked": isSelected,
						onClick: () => onSelect(i),
						className: cn("group flex w-full items-center gap-3 rounded-2xl border border-transparent p-4 text-left transition-all", "glass hover:-translate-y-0.5", isSelected && "border-transparent bg-gradient-to-br from-[color:color-mix(in_oklab,var(--brand-indigo)_18%,transparent)] to-[color:color-mix(in_oklab,var(--brand-purple)_18%,transparent)] shadow-md shadow-indigo-500/20 ring-2 ring-[color:var(--brand-indigo)]"),
						children: [/* @__PURE__ */ jsx("span", {
							className: cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-semibold transition-colors", isSelected ? "bg-gradient-brand text-white" : "bg-muted/60 text-foreground group-hover:bg-muted"),
							children: isSelected ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) : OPTION_LETTERS[i]
						}), /* @__PURE__ */ jsx("span", {
							className: "min-w-0 flex-1 text-[15px] leading-relaxed",
							children: opt
						})]
					}) }, i);
				})
			})]
		}, question.id)
	});
}
//#endregion
//#region src/components/quiz/quiz-progress.tsx
function QuizProgress({ current, total, answered }) {
	const pct = total > 0 ? current / total * 100 : 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between text-xs text-muted-foreground",
			children: [/* @__PURE__ */ jsxs("span", {
				className: "font-medium text-foreground",
				children: [
					"Question ",
					current,
					" ",
					/* @__PURE__ */ jsxs("span", {
						className: "text-muted-foreground",
						children: ["of ", total]
					})
				]
			}), /* @__PURE__ */ jsxs("span", { children: [
				answered,
				"/",
				total,
				" answered"
			] })]
		}), /* @__PURE__ */ jsx("div", {
			className: "relative h-2 w-full overflow-hidden rounded-full bg-muted/50",
			children: /* @__PURE__ */ jsx(motion.div, {
				className: "absolute inset-y-0 left-0 rounded-full bg-gradient-brand",
				initial: false,
				animate: { width: `${pct}%` },
				transition: {
					type: "spring",
					stiffness: 140,
					damping: 22
				}
			})
		})]
	});
}
//#endregion
//#region src/components/quiz/circular-progress.tsx
function CircularProgress({ value, size = 160, stroke = 12, label, sublabel }) {
	const clamped = Math.max(0, Math.min(100, value));
	const r = (size - stroke) / 2;
	const c = 2 * Math.PI * r;
	const offset = c - clamped / 100 * c;
	return /* @__PURE__ */ jsxs("div", {
		className: "relative grid place-items-center",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ jsxs("svg", {
			width: size,
			height: size,
			className: "-rotate-90",
			children: [
				/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", {
					id: "quizProgressGrad",
					x1: "0%",
					y1: "0%",
					x2: "100%",
					y2: "100%",
					children: [
						/* @__PURE__ */ jsx("stop", {
							offset: "0%",
							stopColor: "var(--brand-blue)"
						}),
						/* @__PURE__ */ jsx("stop", {
							offset: "50%",
							stopColor: "var(--brand-indigo)"
						}),
						/* @__PURE__ */ jsx("stop", {
							offset: "100%",
							stopColor: "var(--brand-purple)"
						})
					]
				}) }),
				/* @__PURE__ */ jsx("circle", {
					cx: size / 2,
					cy: size / 2,
					r,
					fill: "none",
					stroke: "currentColor",
					strokeWidth: stroke,
					className: "text-muted/40",
					opacity: .25
				}),
				/* @__PURE__ */ jsx(motion.circle, {
					cx: size / 2,
					cy: size / 2,
					r,
					fill: "none",
					stroke: "url(#quizProgressGrad)",
					strokeWidth: stroke,
					strokeLinecap: "round",
					strokeDasharray: c,
					initial: { strokeDashoffset: c },
					animate: { strokeDashoffset: offset },
					transition: {
						duration: 1.1,
						ease: "easeOut"
					}
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center text-center",
			children: [label, sublabel]
		})]
	});
}
//#endregion
//#region src/components/quiz/quiz-result.tsx
function QuizResult({ quiz, score, serverReview, onReview, onRetry }) {
	const displayScore = serverReview ? {
		...score,
		percentage: Math.round(serverReview.filter((r) => r.is_correct).length / serverReview.length * 100),
		correct: serverReview.filter((r) => r.is_correct).length,
		scored: serverReview.length,
		wrong: serverReview.filter((r) => !r.is_correct && r.selected).length
	} : score;
	const msg = performanceMessage(displayScore.percentage);
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 12
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: "glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10",
		children: [/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-gradient-brand opacity-20 blur-3xl" }), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center text-center",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground",
					children: "Quiz complete"
				}),
				/* @__PURE__ */ jsxs("h1", {
					className: "mt-3 text-2xl font-bold tracking-tight sm:text-3xl",
					children: ["Your ", /* @__PURE__ */ jsx("span", {
						className: "text-gradient-brand",
						children: "results"
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 max-w-md text-sm text-muted-foreground",
					children: msg.title
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-8",
					children: /* @__PURE__ */ jsx(CircularProgress, {
						value: displayScore.percentage,
						size: 180,
						stroke: 14,
						label: /* @__PURE__ */ jsxs("span", {
							className: "text-4xl font-bold tabular-nums tracking-tight",
							children: [displayScore.percentage, /* @__PURE__ */ jsx("span", {
								className: "text-base font-medium text-muted-foreground",
								children: "%"
							})]
						}),
						sublabel: /* @__PURE__ */ jsx("span", {
							className: "mt-1 text-xs uppercase tracking-wider text-muted-foreground",
							children: "Score"
						})
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 grid w-full max-w-md grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ jsx(Stat, {
							label: "Score",
							value: `${displayScore.correct}/${displayScore.scored || displayScore.total}`,
							tone: "brand"
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Correct",
							value: `${displayScore.correct}`,
							tone: "good"
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Wrong",
							value: `${displayScore.wrong}`,
							tone: "bad"
						})
					]
				}),
				displayScore.unanswered > 0 && /* @__PURE__ */ jsxs("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: [displayScore.unanswered, " unanswered · not counted toward your score"]
				}),
				serverReview && /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400",
					children: "Results saved to your quiz history"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 flex flex-wrap justify-center gap-2",
					children: [
						/* @__PURE__ */ jsxs(Button, {
							size: "lg",
							className: "bg-gradient-brand text-white shadow-md shadow-indigo-500/30 hover:opacity-95",
							onClick: onReview,
							children: [/* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }), "Review Answers"]
						}),
						/* @__PURE__ */ jsxs(Button, {
							size: "lg",
							variant: "outline",
							className: "glass border-0",
							onClick: onRetry,
							children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" }), "Practice Again"]
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "glass border-0",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/dashboard/repository",
								children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to Repository"]
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-6 text-[11px] text-muted-foreground",
					children: [
						quiz.questions.length,
						" questions · ",
						quiz.estimatedMinutes,
						" min estimated"
					]
				})
			]
		})]
	});
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "glass rounded-2xl p-4 text-center",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground",
			children: [/* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full ${tone === "good" ? "bg-emerald-500" : tone === "bad" ? "bg-rose-500" : "bg-gradient-brand"}` }), label]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-1.5 text-2xl font-bold tabular-nums",
			children: value
		})]
	});
}
//#endregion
//#region src/components/quiz/quiz-review.tsx
var LETTERS = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F"
];
function QuizReview({ quiz, answers, serverReview, onBack }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Review answers"
			}), /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				className: "glass border-0",
				onClick: onBack,
				children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to results"]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: quiz.questions.map((q, qi) => {
				const picked = answers[q.id];
				const server = serverReview?.[qi];
				const hasKey = server ? true : q.correctIndex >= 0;
				const isCorrect = server ? server.is_correct : hasKey && picked === q.correctIndex;
				const isWrong = server ? !server.is_correct && !!server.selected : hasKey && picked !== void 0 && picked !== q.correctIndex;
				const isUnanswered = server ? !server.selected : picked === void 0;
				const explanation = server?.explanation || q.explanation;
				return /* @__PURE__ */ jsxs(motion.section, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .3,
						delay: Math.min(qi, 8) * .03
					},
					className: "glass-strong rounded-2xl p-5 sm:p-6",
					children: [
						/* @__PURE__ */ jsxs("header", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted/60 text-xs font-semibold",
									children: qi + 1
								}), /* @__PURE__ */ jsx("h3", {
									className: "text-base font-semibold leading-snug sm:text-lg",
									children: q.question
								})]
							}), /* @__PURE__ */ jsx(StatusPill, { state: isCorrect ? "correct" : isWrong ? "wrong" : isUnanswered ? "skipped" : "unscored" })]
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "mt-4 grid gap-2",
							children: q.options.map((opt, i) => {
								const wasPicked = picked === i;
								const correctText = server?.correct ?? (hasKey ? q.options[q.correctIndex] : "");
								const isAnswer = server ? opt === correctText : hasKey && q.correctIndex === i;
								return /* @__PURE__ */ jsxs("li", {
									className: cn("flex items-start gap-3 rounded-xl border border-transparent p-3 text-sm", isAnswer && "border-emerald-500/40 bg-emerald-500/10", wasPicked && !isAnswer && "border-rose-500/40 bg-rose-500/10", !wasPicked && !isAnswer && "bg-muted/30"),
									children: [/* @__PURE__ */ jsx("span", {
										className: cn("grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-semibold", isAnswer ? "bg-emerald-500 text-white" : wasPicked ? "bg-rose-500 text-white" : "bg-muted/60"),
										children: isAnswer ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }) : wasPicked ? /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }) : LETTERS[i]
									}), /* @__PURE__ */ jsx("span", {
										className: "leading-relaxed",
										children: opt
									})]
								}, i);
							})
						}),
						explanation && /* @__PURE__ */ jsxs("p", {
							className: "mt-4 rounded-xl border border-border/60 bg-muted/30 p-3 text-sm leading-relaxed text-muted-foreground",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-semibold text-foreground",
								children: "Explanation: "
							}), explanation]
						}),
						server?.topic && /* @__PURE__ */ jsxs("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								"Topic: ",
								server.topic,
								server.difficulty ? ` · ${server.difficulty}` : ""
							]
						})
					]
				}, q.id);
			})
		})]
	});
}
function StatusPill({ state }) {
	const { label, className, Icon } = {
		correct: {
			label: "Correct",
			className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
			Icon: Check
		},
		wrong: {
			label: "Wrong",
			className: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
			Icon: X
		},
		skipped: {
			label: "Skipped",
			className: "bg-muted text-muted-foreground",
			Icon: HelpCircle
		},
		unscored: {
			label: "Unscored",
			className: "bg-muted text-muted-foreground",
			Icon: HelpCircle
		}
	}[state];
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider", className),
		children: [/* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }), label]
	});
}
//#endregion
//#region src/routes/dashboard.quiz.$filename.tsx?tsr-split=component
function QuizPage() {
	const { filename } = Route.useParams();
	const decoded = safeDecode(filename);
	const [quiz, setQuiz] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [reloadKey, setReloadKey] = useState(0);
	const [phase, setPhase] = useState("start");
	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState({});
	const [serverReview, setServerReview] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [secondsLeft, setSecondsLeft] = useState(0);
	const timerRef = useRef(null);
	const startedAtRef = useRef(null);
	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		setError(null);
		setQuiz(null);
		setAnswers({});
		setCurrent(0);
		setPhase("start");
		setServerReview(null);
		fetchQuiz(decoded, controller.signal).then((q) => setQuiz(q)).catch((err) => {
			if (err?.name === "AbortError") return;
			setError(err instanceof Error ? err.message : "Unknown error");
		}).finally(() => setLoading(false));
		return () => controller.abort();
	}, [decoded, reloadKey]);
	const retry = () => setReloadKey((k) => k + 1);
	const score = useMemo(() => quiz ? scoreQuiz(quiz, answers) : null, [quiz, answers]);
	const total = quiz?.questions.length ?? 0;
	const answeredCount = Object.values(answers).filter((v) => v !== void 0).length;
	const isLast = current === total - 1;
	const question = quiz?.questions[current];
	const timerMinutes = quiz?.estimatedMinutes ?? 10;
	const finish = useCallback(async () => {
		if (!quiz || submitting) return;
		setSubmitting(true);
		if (timerRef.current) clearInterval(timerRef.current);
		const answerTexts = quiz.questions.map((q) => {
			const idx = answers[q.id];
			return idx !== void 0 ? q.options[idx] ?? "" : "";
		});
		const duration = startedAtRef.current ? Math.round((Date.now() - startedAtRef.current) / 1e3) : void 0;
		try {
			const result = await submitQuiz({
				filename: decoded,
				answers: answerTexts,
				duration_seconds: duration
			});
			setServerReview(result.review);
			setShowConfetti(result.percentage >= 60);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to save quiz results");
		} finally {
			setSubmitting(false);
			setPhase("result");
		}
	}, [
		quiz,
		answers,
		decoded,
		submitting
	]);
	useEffect(() => {
		if (phase !== "questions") return;
		timerRef.current = setInterval(() => {
			setSecondsLeft((s) => {
				if (s <= 1) {
					finish();
					return 0;
				}
				return s - 1;
			});
		}, 1e3);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [phase, finish]);
	const select = useCallback((idx) => {
		if (!question) return;
		setAnswers((a) => ({
			...a,
			[question.id]: idx
		}));
	}, [question]);
	const goPrev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
	const goNext = useCallback(() => setCurrent((c) => Math.min(total - 1, c + 1)), [total]);
	useEffect(() => {
		if (phase !== "questions" || !question) return;
		const onKey = (e) => {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (e.key >= "1" && e.key <= "9") {
				const idx = parseInt(e.key, 10) - 1;
				if (idx < question.options.length) {
					e.preventDefault();
					select(idx);
				}
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				if (!isLast) goNext();
			} else if (e.key === "ArrowLeft") {
				e.preventDefault();
				goPrev();
			} else if (e.key === "Enter") {
				e.preventDefault();
				if (isLast) finish();
				else goNext();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		phase,
		question,
		isLast,
		select,
		goNext,
		goPrev,
		finish
	]);
	function startQuiz() {
		setAnswers({});
		setCurrent(0);
		setServerReview(null);
		setShowConfetti(false);
		startedAtRef.current = Date.now();
		setSecondsLeft(timerMinutes * 60);
		setPhase("questions");
	}
	const timerPct = timerMinutes > 0 ? secondsLeft / (timerMinutes * 60) * 100 : 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-3xl space-y-6",
		children: [
			/* @__PURE__ */ jsx(Confetti, { active: showConfetti }),
			/* @__PURE__ */ jsx(Breadcrumbs, { items: [{
				label: "Repository",
				to: "/dashboard/repository"
			}, { label: `Quiz · ${decoded}` }] }),
			loading ? /* @__PURE__ */ jsx(QuizSkeleton, {}) : error ? /* @__PURE__ */ jsx(QuizErrorState, {
				message: error,
				onRetry: retry,
				filename: decoded
			}) : !quiz || quiz.questions.length === 0 ? /* @__PURE__ */ jsx(QuizEmptyState, { filename: decoded }) : phase === "start" ? /* @__PURE__ */ jsx(QuizStart, {
				quiz,
				onStart: startQuiz
			}) : phase === "result" && score ? /* @__PURE__ */ jsx(QuizResult, {
				quiz,
				score,
				serverReview,
				onReview: () => setPhase("review"),
				onRetry: () => startQuiz()
			}) : phase === "review" ? /* @__PURE__ */ jsx(QuizReview, {
				quiz,
				answers,
				serverReview,
				onBack: () => setPhase("result")
			}) : question && /* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "glass-strong space-y-7 rounded-3xl p-6 sm:p-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1.5 text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx(Timer, { className: "h-4 w-4" }),
									formatTime(secondsLeft),
									" remaining"
								]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs text-muted-foreground",
								children: "Auto-submit when time runs out"
							})]
						}), /* @__PURE__ */ jsx(Progress, {
							value: timerPct,
							className: "h-2"
						})]
					}),
					/* @__PURE__ */ jsx(QuizProgress, {
						current: current + 1,
						total,
						answered: answeredCount
					}),
					/* @__PURE__ */ jsx(QuizQuestion, {
						question,
						selected: answers[question.id],
						onSelect: select
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-5",
						children: [
							/* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								className: "glass border-0",
								onClick: goPrev,
								disabled: current === 0,
								children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), "Previous"]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "hidden text-xs text-muted-foreground sm:block",
								children: answers[question.id] === void 0 ? "Pick an option to continue" : "Answer saved"
							}),
							isLast ? /* @__PURE__ */ jsxs(Button, {
								className: "bg-gradient-brand text-white shadow-md shadow-indigo-500/30 hover:opacity-95",
								onClick: () => void finish(),
								disabled: submitting,
								children: [/* @__PURE__ */ jsx(Flag, { className: "h-4 w-4" }), submitting ? "Submitting…" : "Finish Quiz"]
							}) : /* @__PURE__ */ jsxs(Button, {
								className: "bg-gradient-brand text-white shadow-md shadow-indigo-500/30 hover:opacity-95",
								onClick: goNext,
								children: ["Next", /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })]
							})
						]
					})
				]
			})
		]
	});
}
function formatTime(seconds) {
	return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
}
function safeDecode(v) {
	try {
		return decodeURIComponent(v);
	} catch {
		return v;
	}
}
//#endregion
export { QuizPage as component };
