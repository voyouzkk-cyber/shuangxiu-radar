import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, t as Root } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as CATEGORIES } from "./seed-BVZ69uL3.mjs";
import { t as createBrand } from "./brands-Bt3raAi5.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as cn, r as Route$2 } from "./router-BXn27Hmh.mjs";
import { t as Button } from "./button-B5s3ZOLT.mjs";
import { t as Input } from "./input-CAXLiSD_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-DndSNERg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
	...props
}));
Label.displayName = Root.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground shadow-[var(--shadow-border)] transition-[box-shadow,border-color] duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function RegisterPage() {
	const { name: prefill } = Route$2.useSearch();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)(prefill ?? "");
	const [nameEn, setNameEn] = (0, import_react.useState)("");
	const [aliases, setAliases] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("食品饮料");
	const [weekendOff, setWeekendOff] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const mutation = useMutation({
		mutationFn: () => {
			if (weekendOff === null) throw new Error("请选择双休或非双休");
			return createBrand({ data: {
				name,
				name_en: nameEn,
				aliases,
				category,
				weekend_off: weekendOff,
				note
			} });
		},
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["brands"] });
			if (res.ok) toast.success("已登记，感谢补充");
			else toast.message("这个品牌已经在库里，带你去校正");
			navigate({
				to: "/brands/$id",
				params: { id: String(res.brand.id) }
			});
		},
		onError: (err) => toast.error(err.message || "登记失败")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pb-8 pt-7",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-muted-foreground",
				children: "众包"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-3xl font-semibold tracking-tight",
				children: "登记品牌"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted-foreground",
				children: "只记一件事：这家公司给不给双休。不需要姓名，不收集个人信息。"
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-6 space-y-5",
			onSubmit: (e) => {
				e.preventDefault();
				mutation.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "品牌名",
					htmlFor: "name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						required: true,
						minLength: 2,
						maxLength: 40,
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "例如 农夫山泉"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "英文名（选填）",
					htmlFor: "nameEn",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "nameEn",
						maxLength: 60,
						value: nameEn,
						onChange: (e) => setNameEn(e.target.value),
						placeholder: "Nongfu Spring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "别名，逗号分隔（选填）",
					htmlFor: "aliases",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "aliases",
						maxLength: 120,
						value: aliases,
						onChange: (e) => setAliases(e.target.value),
						placeholder: "农夫, Nongfu"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "mb-2 text-sm font-medium",
					children: "品类"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: CATEGORIES.map((item) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCategory(item),
							className: cn("h-9 rounded-full px-3 text-sm font-medium transition-colors duration-150", category === item ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
							children: item
						}, item);
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "mb-2 text-sm font-medium",
					children: "双休情况"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setWeekendOff(true),
						className: cn("h-14 rounded-lg text-sm font-medium transition-colors duration-150", weekendOff === true ? "bg-rest text-rest-foreground" : "bg-card text-foreground shadow-[var(--shadow-border)]"),
						children: "双休"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setWeekendOff(false),
						className: cn("h-14 rounded-lg text-sm font-medium transition-colors duration-150", weekendOff === false ? "bg-overtime text-overtime-foreground" : "bg-card text-foreground shadow-[var(--shadow-border)]"),
						children: "非双休"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "补充说明（选填）",
					htmlFor: "note",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "note",
						maxLength: 160,
						value: note,
						onChange: (e) => setNote(e.target.value),
						placeholder: "例如：总部双休，工厂单休。不要填写个人姓名或联系方式。"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "lg",
					className: "w-full",
					disabled: mutation.isPending,
					children: mutation.isPending ? "提交中…" : "提交登记"
				})
			]
		})]
	});
}
function Field({ label, htmlFor, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor,
			children: label
		}), children]
	});
}
//#endregion
export { RegisterPage as component };
