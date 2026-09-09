import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { o as restShare, s as voteTotal } from "./seed-BVZ69uL3.mjs";
import { s as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as StatusBadge } from "./status-mark-CQgE6Uvl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-row-DPbpmyu_.js
var import_jsx_runtime = require_jsx_runtime();
function BrandRow({ brand }) {
	const share = restShare(brand);
	const total = voteTotal(brand);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/brands/$id",
		params: { id: String(brand.id) },
		className: "flex items-center gap-3 rounded-lg bg-card px-3 py-3 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:shadow-[var(--shadow-border-hover)] active:scale-[0.99]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex size-11 shrink-0 items-center justify-center rounded-md bg-muted font-display text-lg font-semibold text-foreground",
				children: brand.name.slice(0, 1)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-medium",
							children: brand.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { brand })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 flex items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: brand.category
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [total, " 票"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-2 block h-1 overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block h-full rounded-full bg-rest",
							style: { width: `${Math.round(share * 100)}%` }
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-muted-foreground" })
		]
	});
}
//#endregion
export { BrandRow as t };
