import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { s as voteTotal } from "./seed-BVZ69uL3.mjs";
import { o as voteBrand } from "./brands-Bt3raAi5.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as cn } from "./router-BXn27Hmh.mjs";
import { t as Button } from "./button-B5s3ZOLT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vote-bar-B144BkAp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "sx-votes";
function readVotes() {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}
function writeVote(id, value) {
	const next = {
		...readVotes(),
		[String(id)]: value
	};
	localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
function VoteBar({ brand }) {
	const queryClient = useQueryClient();
	const [current, setCurrent] = (0, import_react.useState)(brand);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const total = voteTotal(current);
	(0, import_react.useEffect)(() => {
		setCurrent(brand);
		setPicked(readVotes()[String(brand.id)] ?? null);
	}, [brand]);
	const mutation = useMutation({
		mutationFn: (weekend_off) => voteBrand({ data: {
			id: brand.id,
			weekend_off
		} }),
		onSuccess: (data, weekend_off) => {
			const value = weekend_off ? "rest" : "overtime";
			writeVote(brand.id, value);
			setPicked(value);
			if (data) setCurrent(data);
			queryClient.invalidateQueries({ queryKey: ["brands"] });
			queryClient.invalidateQueries({ queryKey: ["brand", brand.id] });
		},
		onError: () => toast.error("投票没成功，请稍后再试")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "这是你了解的情况吗"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tabular-nums text-muted-foreground",
					children: [total, " 人登记"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: picked === "rest" ? "rest" : "outline",
					disabled: picked !== null || mutation.isPending,
					onClick: () => mutation.mutate(true),
					className: cn(picked === "overtime" && "opacity-50"),
					children: ["双休 ", current.weekend_votes]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: picked === "overtime" ? "overtime" : "outline",
					disabled: picked !== null || mutation.isPending,
					onClick: () => mutation.mutate(false),
					className: cn(picked === "rest" && "opacity-50"),
					children: ["非双休 ", current.no_weekend_votes]
				})]
			}),
			picked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "本机已投过票，避免重复灌水。"
			}) : null
		]
	});
}
//#endregion
export { VoteBar as t };
