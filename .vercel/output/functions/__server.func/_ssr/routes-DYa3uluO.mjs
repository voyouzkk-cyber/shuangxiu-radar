import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { a as resolvedWeekend, i as matchBrand } from "./seed-BVZ69uL3.mjs";
import { i as listBrands, n as createSsrRpc } from "./brands-Bt3raAi5.mjs";
import { a as LoaderCircle, c as Camera, o as ImagePlus, r as Search, t as X } from "../_libs/lucide-react.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as cn } from "./router-BXn27Hmh.mjs";
import { n as VerdictPanel } from "./status-mark-CQgE6Uvl.mjs";
import { t as Button } from "./button-B5s3ZOLT.mjs";
import { t as VoteBar } from "./vote-bar-B144BkAp.mjs";
import { t as BrandRow } from "./brand-row-DPbpmyu_.mjs";
import { t as Input } from "./input-CAXLiSD_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DYa3uluO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function compressImage(file) {
	if (!file.type.startsWith("image/")) throw new Error("请选择一张商品照片");
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 960 / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("无法处理这张照片");
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	const dataUrl = canvas.toDataURL("image/jpeg", .72);
	if (dataUrl.length > 17e5) {
		const tighter = canvas.toDataURL("image/jpeg", .55);
		if (tighter.length > 17e5) throw new Error("照片太大，请换一张更近的包装特写");
		return tighter;
	}
	return dataUrl;
}
var scanProduct = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input.image !== "string" || !input.image.startsWith("data:image/")) throw new Error("请上传商品照片");
	if (input.image.length > 18e5) throw new Error("照片太大，请换一张更近的包装特写");
	return input;
}).handler(createSsrRpc("0be617605c00d0b15928f7977680ae9630a46b296800d30f37dcb30745c9f1d2"));
function ScanStage() {
	const cameraRef = (0, import_react.useRef)(null);
	const albumRef = (0, import_react.useRef)(null);
	const outcomeRef = (0, import_react.useRef)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const brands = useQuery({
		queryKey: ["brands"],
		queryFn: () => listBrands()
	}).data ?? [];
	const stats = (0, import_react.useMemo)(() => {
		const rest = brands.filter((b) => resolvedWeekend(b)).length;
		return {
			total: brands.length,
			rest,
			overtime: brands.length - rest
		};
	}, [brands]);
	const searchHits = (0, import_react.useMemo)(() => {
		const q = query.trim();
		if (q.length < 1) return [];
		return brands.map((brand) => ({
			brand,
			score: matchBrand([q], [brand])?.score ?? 0
		})).filter((row) => row.score >= 72 || row.brand.name.includes(q) || row.brand.name_en.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.score - a.score).slice(0, 6).map((row) => row.brand);
	}, [brands, query]);
	const mutation = useMutation({
		mutationFn: (image) => scanProduct({ data: { image } }),
		onSuccess: (data) => setResult(data),
		onError: (err) => {
			toast.error(err.message || "识图失败");
			setPreview(null);
		}
	});
	async function onFile(file) {
		if (!file) return;
		try {
			const image = await compressImage(file);
			setPreview(image);
			setResult(null);
			mutation.mutate(image);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "无法读取这张照片");
		}
	}
	function reset() {
		setPreview(null);
		setResult(null);
		mutation.reset();
		if (cameraRef.current) cameraRef.current.value = "";
		if (albumRef.current) albumRef.current.value = "";
	}
	const scanning = mutation.isPending;
	const matched = result?.ok ? result.matched : null;
	const hit = result?.ok ? result.hit : null;
	const showingOutcome = Boolean(hit) && !scanning;
	(0, import_react.useEffect)(() => {
		if (!showingOutcome) return;
		outcomeRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}, [showingOutcome]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pb-8 pt-7",
		children: [
			showingOutcome ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-muted-foreground",
					children: "消费投票"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-4xl leading-tight font-semibold tracking-tight",
					children: "双休雷达"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground",
					children: "拍商品包装，查这家公司双不双休。再决定买，还是不买。"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: showingOutcome ? "mt-1" : "mt-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("relative overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]", showingOutcome ? "h-44" : "aspect-square"),
						children: [
							preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: preview,
								alt: "待识别的商品照片",
								className: "size-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdleShutter, {}),
							scanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 bg-foreground/25",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "scan-line absolute inset-x-6 h-px bg-card" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-x-0 bottom-0 flex items-center gap-2 bg-foreground/70 px-4 py-3 text-sm text-primary-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "正在识别品牌"]
								})]
							}) : null,
							preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: reset,
								className: "absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-[var(--shadow-border)]",
								"aria-label": "关闭照片",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							}) : null
						]
					}),
					showingOutcome ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						className: "mt-3 w-full",
						onClick: reset,
						children: "再拍一张"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "lg",
							onClick: () => cameraRef.current?.click(),
							disabled: scanning,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {}), "拍照识别"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "lg",
							variant: "outline",
							onClick: () => albumRef.current?.click(),
							disabled: scanning,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {}), "相册"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: cameraRef,
						type: "file",
						accept: "image/*",
						capture: "environment",
						className: "sr-only",
						"aria-hidden": "true",
						tabIndex: -1,
						onChange: (e) => void onFile(e.target.files?.[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: albumRef,
						type: "file",
						accept: "image/*",
						className: "sr-only",
						"aria-hidden": "true",
						tabIndex: -1,
						onChange: (e) => void onFile(e.target.files?.[0])
					})
				]
			}),
			result && !result.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-lg bg-overtime-soft px-3 py-3 text-sm text-overtime",
				children: result.error
			}) : null,
			hit && !scanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: outcomeRef,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanOutcome, {
					hitName: hit.brand,
					product: hit.product,
					matched
				})
			}) : null,
			showingOutcome ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "或不拍照，直接搜品牌名",
							"aria-label": "搜索品牌名",
							className: "pl-10"
						})]
					}), query.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-2",
						children: searchHits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-card px-4 py-4 text-sm text-muted-foreground shadow-[var(--shadow-border)]",
							children: [
								"还没有「",
								query.trim(),
								"」。",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/register",
									search: { name: query.trim() },
									className: "ml-1 font-medium text-foreground underline-offset-2 hover:underline",
									children: "去登记"
								})
							]
						}) : searchHits.map((brand) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandRow, { brand }, brand.id))
					}) : null]
				}),
				query.trim() ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-8 grid grid-cols-3 gap-2 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "已收录",
							value: stats.total
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "双休",
							value: stats.rest,
							tone: "rest"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "非双休",
							value: stats.overtime,
							tone: "overtime"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs leading-relaxed text-muted-foreground",
					children: "信息来自社区登记，不是公司官方声明。同一品牌不同岗位、时期可能不同。请自行判断。"
				})
			] })
		]
	});
}
function IdleShutter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex size-full flex-col items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex size-40 items-center justify-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "radar-pulse absolute inset-3 rounded-full border border-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "radar-pulse absolute inset-0 rounded-full border border-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "relative flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
						className: "size-9",
						strokeWidth: 1.5
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-5 text-sm text-muted-foreground",
			children: "对准包装上的商标"
		})]
	});
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-card px-2 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("font-display text-2xl font-semibold tabular-nums", tone === "rest" && "text-rest", tone === "overtime" && "text-overtime"),
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-xs text-muted-foreground",
			children: label
		})]
	});
}
function ScanOutcome({ hitName, product, matched }) {
	if (matched) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"识别到",
					product ? ` ${product} · ` : " ",
					matched.name_en || hitName
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-1 text-2xl font-semibold",
				children: matched.name
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictPanel, { brand: matched }),
			matched.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted-foreground",
				children: matched.note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoteBar, { brand: matched }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				className: "w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/brands/$id",
					params: { id: String(matched.id) },
					children: "查看完整记录"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 rounded-xl bg-card px-4 py-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "识别到品牌，库里还没有"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-1 text-2xl font-semibold",
				children: hitName || "未命名品牌"
			}),
			product ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: product
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-4 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/register",
					search: { name: hitName },
					children: "去登记双休情况"
				})
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanStage, {});
}
//#endregion
export { Home as component };
