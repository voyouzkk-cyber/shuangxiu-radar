import { t as createServerFn } from "./ssr.mjs";
import { n as getSql, t as createServerRpc } from "./db-CdpTbChX.mjs";
import { i as matchBrand } from "./seed-BVZ69uL3.mjs";
import { a as loadAllBrands } from "./brands-Bt3raAi5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-BS11awVb.js
function extractJson(text) {
	const trimmed = text.trim();
	const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
	const raw = fenced ? fenced[1].trim() : trimmed;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("模型没有返回可解析结果");
	return JSON.parse(raw.slice(start, end + 1));
}
function asHit(value) {
	const o = value ?? {};
	const aliases = Array.isArray(o.aliases) ? o.aliases.map((item) => String(item).trim()).filter(Boolean).slice(0, 8) : [];
	const confidence = Number(o.confidence);
	return {
		brand: String(o.brand ?? "").trim().slice(0, 40),
		brand_en: String(o.brand_en ?? "").trim().slice(0, 60),
		product: String(o.product ?? "").trim().slice(0, 40),
		aliases,
		confidence: Number.isFinite(confidence) ? Math.min(1, Math.max(0, confidence)) : 0,
		visible_text: String(o.visible_text ?? "").trim().slice(0, 120)
	};
}
var scanProduct_createServerFn_handler = createServerRpc({
	id: "0be617605c00d0b15928f7977680ae9630a46b296800d30f37dcb30745c9f1d2",
	name: "scanProduct",
	filename: "src/lib/server/scan.ts"
}, (opts) => scanProduct.__executeServer(opts));
var scanProduct = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input.image !== "string" || !input.image.startsWith("data:image/")) throw new Error("请上传商品照片");
	if (input.image.length > 18e5) throw new Error("照片太大，请换一张更近的包装特写");
	return input;
}).handler(scanProduct_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "识图暂时不可用，请改用品牌名搜索。"
	};
	const sql = await getSql();
	const brands = await loadAllBrands(sql);
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: 0,
			max_tokens: 280,
			messages: [{
				role: "system",
				content: "你是商品包装品牌识别器。只根据照片识别最主要的消费品牌。只返回 JSON，不要解释。"
			}, {
				role: "user",
				content: [{
					type: "image_url",
					image_url: { url: data.image }
				}, {
					type: "text",
					text: `识别这张商品包装/商标照片里最主要的品牌。返回 JSON：
{"brand":"中文品牌名，没有则用常见中文译名","brand_en":"英文品牌名或空字符串","product":"品类如矿泉水/手机/运动鞋","aliases":["别名"],"confidence":0到1的小数,"visible_text":"包装上关键文字"}
若完全无法判断品牌，brand 置空字符串，confidence 为 0。不要返回多个品牌。`
				}]
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: "识图失败，请再拍一张更清楚的商标特写。"
	};
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	let hit;
	try {
		hit = asHit(extractJson(text));
	} catch {
		return {
			ok: false,
			error: "没有识别出品牌，请对准商标再拍一次。"
		};
	}
	if (!hit.brand || hit.confidence < .18) return {
		ok: true,
		hit,
		matched: null,
		score: 0
	};
	const queries = [
		hit.brand,
		hit.brand_en,
		...hit.aliases,
		...hit.visible_text.split(/[\s,，、/|]+/)
	].filter((q) => q && q.length >= 2);
	const matched = matchBrand(queries, brands);
	return {
		ok: true,
		hit,
		matched: matched?.brand ?? null,
		score: matched?.score ?? 0
	};
});
//#endregion
export { scanProduct_createServerFn_handler };
