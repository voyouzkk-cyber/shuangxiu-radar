import { CATEGORIES, type Brand } from "@/lib/brands-shared";
import { getSql, type Sql } from "@/lib/db";
import { sanitizeNote } from "@/lib/privacy";
import { ensureSeed } from "@/lib/server/seed";
import { createServerFn } from "@tanstack/react-start";

type BrandRow = {
  id: number;
  name: string;
  name_en: string;
  aliases: string;
  weekend_off: boolean;
  category: string;
  note: string;
  weekend_votes: number;
  no_weekend_votes: number;
  created_at: unknown;
  updated_at: unknown;
};

function asIso(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return String(value ?? "");
}

function mapBrand(row: BrandRow): Brand {
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
    updated_at: asIso(row.updated_at),
  };
}

const SELECT_COLS = `
  id, name, name_en, aliases, weekend_off, category, note,
  weekend_votes, no_weekend_votes, created_at, updated_at
`;

export async function loadAllBrands(sql: Sql): Promise<Brand[]> {
  await ensureSeed(sql);
  const rows = await sql.query<BrandRow>(
    `select ${SELECT_COLS} from brands order by weekend_votes + no_weekend_votes desc, name asc`,
  );
  return rows.map(mapBrand);
}

export const listBrands = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return loadAllBrands(sql);
});

export const getBrand = createServerFn({ method: "POST" })
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await ensureSeed(sql);
    const rows = await sql.query<BrandRow>(
      `select ${SELECT_COLS} from brands where id = $1`,
      [data.id],
    );
    return rows[0] ? mapBrand(rows[0]) : null;
  });

export const createBrand = createServerFn({ method: "POST" })
  .validator((input: {
    name: string;
    name_en?: string;
    aliases?: string;
    weekend_off: boolean;
    category: string;
    note?: string;
  }) => {
    const name = input.name.trim();
    if (name.length < 2 || name.length > 40) {
      throw new Error("品牌名需要 2–40 个字");
    }
    const category = CATEGORIES.includes(input.category as (typeof CATEGORIES)[number])
      ? input.category
      : "其他";
    const note = sanitizeNote(input.note ?? "");
    const name_en = (input.name_en ?? "").trim().slice(0, 60);
    const aliases = (input.aliases ?? "").trim().slice(0, 120);
    return {
      name,
      name_en,
      aliases,
      weekend_off: Boolean(input.weekend_off),
      category,
      note,
    };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    await ensureSeed(sql);
    const existing = await sql.query<BrandRow>(
      `select ${SELECT_COLS} from brands
       where lower(name) = lower($1)
          or ($2 <> '' and lower(name_en) = lower($2))
       limit 1`,
      [data.name, data.name_en],
    );
    if (existing[0]) {
      return { ok: false as const, reason: "exists" as const, brand: mapBrand(existing[0]) };
    }
    const inserted = await sql.query<BrandRow>(
      `insert into brands (name, name_en, aliases, weekend_off, category, note, weekend_votes, no_weekend_votes)
       values ($1, $2, $3, $4, $5, $6, $7, $8)
       returning ${SELECT_COLS}`,
      [
        data.name,
        data.name_en,
        data.aliases,
        data.weekend_off,
        data.category,
        data.note,
        data.weekend_off ? 1 : 0,
        data.weekend_off ? 0 : 1,
      ],
    );
    return { ok: true as const, brand: mapBrand(inserted[0]!) };
  });

export const voteBrand = createServerFn({ method: "POST" })
  .validator((input: { id: number; weekend_off: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = data.weekend_off
      ? await sql.query<BrandRow>(
          `update brands
           set weekend_votes = weekend_votes + 1, updated_at = now()
           where id = $1
           returning ${SELECT_COLS}`,
          [data.id],
        )
      : await sql.query<BrandRow>(
          `update brands
           set no_weekend_votes = no_weekend_votes + 1, updated_at = now()
           where id = $1
           returning ${SELECT_COLS}`,
          [data.id],
        );
    return rows[0] ? mapBrand(rows[0]) : null;
  });
