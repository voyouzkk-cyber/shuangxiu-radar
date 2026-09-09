import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { o as restShare, s as voteTotal } from "./seed-BVZ69uL3.mjs";
import { r as getBrand } from "./brands-Bt3raAi5.mjs";
import { u as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Route } from "./router-BXn27Hmh.mjs";
import { n as VerdictPanel } from "./status-mark-CQgE6Uvl.mjs";
import { t as VoteBar } from "./vote-bar-B144BkAp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brands._id-BfjaT9qw.js
var import_jsx_runtime = require_jsx_runtime();
function BrandDetailPage() {
	const { id } = Route.useParams();
	const numericId = Number(id);
	const { data, isPending } = useQuery({
		queryKey: ["brand", numericId],
		queryFn: () => getBrand({ data: { id: numericId } }),
		enabled: Number.isFinite(numericId)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-20 animate-pulse rounded-sm bg-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-10 w-40 animate-pulse rounded-sm bg-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-5 h-40 animate-pulse rounded-xl bg-muted" })
		]
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl font-semibold",
			children: "没有这条记录"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/brands",
			className: "mt-3 inline-block text-sm text-muted-foreground underline",
			children: "返回品牌库"
		})]
	});
	const share = Math.round(restShare(data) * 100);
	const total = voteTotal(data);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pb-8 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/brands",
				className: "inline-flex min-h-11 items-center gap-1 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "品牌库"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted font-display text-2xl font-semibold",
					children: data.name.slice(0, 1)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl leading-tight font-semibold tracking-tight",
						children: data.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [data.name_en ? `${data.name_en} · ` : "", data.category]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictPanel, { brand: data })
			}),
			data.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-sm leading-relaxed text-muted-foreground",
				children: data.note
			}) : null,
			data.aliases ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: ["别名 ", data.aliases]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-lg bg-card px-4 py-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "双休票占比" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums font-medium",
							children: [share, "%"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-1.5 overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-rest",
							style: { width: `${share}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs tabular-nums text-muted-foreground",
						children: [
							data.weekend_votes,
							" 双休 · ",
							data.no_weekend_votes,
							" 非双休 · ",
							total,
							" 票"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoteBar, { brand: data })
			})
		]
	});
}
//#endregion
export { BrandDetailPage as component };
