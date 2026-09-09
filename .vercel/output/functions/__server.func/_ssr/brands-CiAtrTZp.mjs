import { t as createServerFn } from "./ssr.mjs";
import { n as getSql, t as createServerRpc } from "./db-CdpTbChX.mjs";
import { n as ensureSeed, t as CATEGORIES } from "./seed-BVZ69uL3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brands-CiAtrTZp.js
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
var listBrands_createServerFn_handler = createServerRpc({
	id: "a3dc4f60a28321aee2acbad438333f84c28b6922d6f82775654b07a751f27075",
	name: "listBrands",
	filename: "src/lib/server/brands.ts"
}, (opts) => listBrands.__executeServer(opts));
var listBrands = createServerFn({ method: "GET" }).handler(listBrands_createServerFn_handler, async () => {
	return loadAllBrands(await getSql());
});
var getBrand_createServerFn_handler = createServerRpc({
	id: "531efddae779d9a86c140ef176dcdf1e082693db698d2735c86f6be245670928",
	name: "getBrand",
	filename: "src/lib/server/brands.ts"
}, (opts) => getBrand.__executeServer(opts));
var getBrand = createServerFn({ method: "POST" }).validator((input) => input).handler(getBrand_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	const rows = await sql.query(`select ${SELECT_COLS} from brands where id = $1`, [data.id]);
	return rows[0] ? mapBrand(rows[0]) : null;
});
var createBrand_createServerFn_handler = createServerRpc({
	id: "0303c5ce53a551dba4a1bfdf49fa2a48f62749c0023971e9b8a984d1c667479c",
	name: "createBrand",
	filename: "src/lib/server/brands.ts"
}, (opts) => createBrand.__executeServer(opts));
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
}).handler(createBrand_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	const existing = await sql.query(`select ${SELECT_COLS} from brands
       where lower(name) = lower($1)
          or ($2 <> '' and lower(name_en) = lower($2))
       limit 1`, [data.name, data.name_en]);
	if (existing[0]) return {
		ok: false,
		reason: "exists",
		brand: mapBrand(existing[0])
	};
	return {
		ok: true,
		brand: mapBrand((await sql.query(`insert into brands (name, name_en, aliases, weekend_off, category, note, weekend_votes, no_weekend_votes)
       values ($1, $2, $3, $4, $5, $6, $7, $8)
       returning ${SELECT_COLS}`, [
			data.name,
			data.name_en,
			data.aliases,
			data.weekend_off,
			data.category,
			data.note,
			data.weekend_off ? 1 : 0,
			data.weekend_off ? 0 : 1
		]))[0])
	};
});
var voteBrand_createServerFn_handler = createServerRpc({
	id: "096f9adc6d97fc50868a108f6afa6c1d4769157e07fec8a82cd618508060eb46",
	name: "voteBrand",
	filename: "src/lib/server/brands.ts"
}, (opts) => voteBrand.__executeServer(opts));
var voteBrand = createServerFn({ method: "POST" }).validator((input) => input).handler(voteBrand_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rows = data.weekend_off ? await sql.query(`update brands
           set weekend_votes = weekend_votes + 1, updated_at = now()
           where id = $1
           returning ${SELECT_COLS}`, [data.id]) : await sql.query(`update brands
           set no_weekend_votes = no_weekend_votes + 1, updated_at = now()
           where id = $1
           returning ${SELECT_COLS}`, [data.id]);
	return rows[0] ? mapBrand(rows[0]) : null;
});
//#endregion
export { createBrand_createServerFn_handler, getBrand_createServerFn_handler, listBrands_createServerFn_handler, voteBrand_createServerFn_handler };
