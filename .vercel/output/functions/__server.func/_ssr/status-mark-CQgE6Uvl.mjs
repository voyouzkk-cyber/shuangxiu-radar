import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { a as resolvedWeekend, r as isDisputed } from "./seed-BVZ69uL3.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./router-BXn27Hmh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-mark-CQgE6Uvl.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-muted text-muted-foreground",
		rest: "bg-rest-soft text-rest",
		overtime: "bg-overtime-soft text-overtime",
		ink: "bg-primary text-primary-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function StatusBadge({ brand }) {
	const rest = resolvedWeekend(brand);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: rest ? "rest" : "overtime",
			children: rest ? "双休" : "非双休"
		}), isDisputed(brand) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "有争议" }) : null]
	});
}
function VerdictPanel({ brand }) {
	const rest = resolvedWeekend(brand);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-xl px-5 py-8 text-center", rest ? "bg-rest text-rest-foreground" : "bg-overtime text-overtime-foreground"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest opacity-80",
				children: "社区登记"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display mt-2 text-5xl font-semibold tracking-tight",
				children: rest ? "双休" : "非双休"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed opacity-90",
				children: rest ? "可以买。用消费支持给员工周末的公司。" : "可以不买。用钱包投票，比吐槽更有效。"
			})
		]
	});
}
//#endregion
export { VerdictPanel as n, StatusBadge as t };
