import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { a as resolvedWeekend } from "./seed-BVZ69uL3.mjs";
import { i as listBrands } from "./brands-Bt3raAi5.mjs";
import { r as Search } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as cn } from "./router-BXn27Hmh.mjs";
import { t as BrandRow } from "./brand-row-DPbpmyu_.mjs";
import { t as Input } from "./input-CAXLiSD_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brands.index-BqY9-Zcf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BrandsPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const { data, isPending } = useQuery({
		queryKey: ["brands"],
		queryFn: () => listBrands()
	});
	const brands = data ?? [];
	const filtered = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return brands.filter((brand) => {
			const rest = resolvedWeekend(brand);
			if (filter === "rest" && !rest) return false;
			if (filter === "overtime" && rest) return false;
			if (!needle) return true;
			return brand.name.toLowerCase().includes(needle) || brand.name_en.toLowerCase().includes(needle) || brand.aliases.toLowerCase().includes(needle) || brand.category.includes(q.trim());
		});
	}, [
		brands,
		filter,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pb-8 pt-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-muted-foreground",
					children: "社区库"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-3xl font-semibold tracking-tight",
					children: "品牌库"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted-foreground",
					children: "按双休 / 非双休浏览。数据来自大家登记，可投票校正。"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "relative mt-6 block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "搜索品牌、英文名、别名",
					"aria-label": "搜索品牌",
					className: "pl-10"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						current: filter,
						value: "all",
						onSelect: setFilter,
						count: brands.length,
						children: "全部"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						current: filter,
						value: "rest",
						onSelect: setFilter,
						count: brands.filter((b) => resolvedWeekend(b)).length,
						children: "双休"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						current: filter,
						value: "overtime",
						onSelect: setFilter,
						count: brands.filter((b) => !resolvedWeekend(b)).length,
						children: "非双休"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-2",
				children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingList, {}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg bg-card px-4 py-6 text-center text-sm text-muted-foreground shadow-[var(--shadow-border)]",
					children: "没有匹配的品牌。"
				}) : filtered.map((brand) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandRow, { brand }, brand.id))
			})
		]
	});
}
function FilterChip({ current, value, onSelect, count, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onSelect(value),
		className: cn("inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors duration-150", current === value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums opacity-80",
			children: count
		})]
	});
}
function LoadingList() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-lg bg-muted" }, i))
	});
}
//#endregion
export { BrandsPage as component };
