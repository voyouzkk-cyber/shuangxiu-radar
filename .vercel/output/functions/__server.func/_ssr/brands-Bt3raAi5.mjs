import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as ensureSeed, t as CATEGORIES } from "./seed-BVZ69uL3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brands-Bt3raAi5.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function asIso(value) {
	if (typeof value === "string") return value;
	if (value instanceof Date) return value.toISOString();
	return String(value ?? "");
}
function mapBrand(row) {
	return {
		id: Number(row.id),
		name: row.name,
		name_en: row.name_en ?? "",
		aliases: row.aliases ?? "",
		weekend_off: Boolean(row.weekend_off),
		category: row.category,
		note: row.note ?? "",
		weekend_votes: Number(row.weekend_votes ?? 0),
		no_weekend_votes: Number(row.no_weekend_votes ?? 0),
		created_at: asIso(row.created_at),
		updated_at: asIso(row.updated_at)
	};
}
var SELECT_COLS = `
  id, name, name_en, aliases, weekend_off, category, note,
  weekend_votes, no_weekend_votes, created_at, updated_at
`;
async function loadAllBrands(sql) {
	await ensureSeed(sql);
	return (await sql.query(`select ${SELECT_COLS} from brands order by weekend_votes + no_weekend_votes desc, name asc`)).map(mapBrand);
}
var listBrands = createServerFn({ method: "GET" }).handler(createSsrRpc("a3dc4f60a28321aee2acbad438333f84c28b6922d6f82775654b07a751f27075"));
var getBrand = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("531efddae779d9a86c140ef176dcdf1e082693db698d2735c86f6be245670928"));
var createBrand = createServerFn({ method: "POST" }).validator((input) => {
	const name = input.name.trim();
	if (name.length < 2 || name.length > 40) throw new Error("品牌名需要 2–40 个字");
	const category = CATEGORIES.includes(input.category) ? input.category : "其他";
	const note = (input.note ?? "").trim().slice(0, 160);
	return {
		name,
		name_en: (input.name_en ?? "").trim().slice(0, 60),
		aliases: (input.aliases ?? "").trim().slice(0, 120),
		weekend_off: Boolean(input.weekend_off),
		category,
		note
	};
}).handler(createSsrRpc("0303c5ce53a551dba4a1bfdf49fa2a48f62749c0023971e9b8a984d1c667479c"));
var voteBrand = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("096f9adc6d97fc50868a108f6afa6c1d4769157e07fec8a82cd618508060eb46"));
//#endregion
export { loadAllBrands as a, listBrands as i, createSsrRpc as n, voteBrand as o, getBrand as r, createBrand as t };
