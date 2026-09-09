export const CATEGORIES = [
  "食品饮料",
  "日化洗护",
  "服装运动",
  "数码家电",
  "美妆个护",
  "餐饮零售",
  "汽车出行",
  "医药健康",
  "其他",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Brand = {
  id: number;
  name: string;
  name_en: string;
  aliases: string;
  weekend_off: boolean;
  category: string;
  note: string;
  weekend_votes: number;
  no_weekend_votes: number;
  created_at: string;
  updated_at: string;
};

export function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[（）()[\]【】·・._\-—/,，。!！?？'"“”‘’]/g, "")
    .replace(
      /股份有限公司|有限责任公司|有限公司|集团公司|集团|控股|company|incorporated|corporation|inc|ltd|llc|co/g,
      "",
    );
}

export function aliasList(brand: Pick<Brand, "name" | "name_en" | "aliases">): string[] {
  return [brand.name, brand.name_en, ...brand.aliases.split(/[,，、;/|]/)]
    .map((part) => part.trim())
    .filter(Boolean);
}

export function scoreMatch(query: string, brand: Pick<Brand, "name" | "name_en" | "aliases">): number {
  const q = normalizeName(query);
  if (q.length < 2) return 0;
  let best = 0;
  for (const raw of aliasList(brand)) {
    const n = normalizeName(raw);
    if (!n) continue;
    if (n === q) {
      best = Math.max(best, 100);
      continue;
    }
    if (n.includes(q) || q.includes(n)) {
      const ratio = Math.min(n.length, q.length) / Math.max(n.length, q.length);
      best = Math.max(best, Math.round(55 + 40 * ratio));
    }
  }
  return best;
}

export function matchBrand(
  queries: string[],
  brands: Brand[],
): { brand: Brand; score: number } | null {
  let best: { brand: Brand; score: number } | null = null;
  for (const brand of brands) {
    let score = 0;
    for (const query of queries) {
      score = Math.max(score, scoreMatch(query, brand));
    }
    if (!best || score > best.score) best = { brand, score };
  }
  if (!best || best.score < 72) return null;
  return best;
}

export function searchBrands(query: string, brands: Brand[], limit = 8): Brand[] {
  const q = query.trim();
  if (q.length < 1) return [];
  return brands
    .map((brand) => ({
      brand,
      score: Math.max(
        scoreMatch(q, brand),
        brand.name.includes(q) ? 70 : 0,
        brand.name_en.toLowerCase().includes(q.toLowerCase()) ? 68 : 0,
        brand.aliases.includes(q) ? 66 : 0,
      ),
    }))
    .filter((row) => row.score >= 66)
    .sort((a, b) => b.score - a.score || a.brand.name.localeCompare(b.brand.name, "zh"))
    .slice(0, limit)
    .map((row) => row.brand);
}

export function resolvedWeekend(brand: Brand): boolean {
  const total = brand.weekend_votes + brand.no_weekend_votes;
  if (total < 3) return brand.weekend_off;
  return brand.weekend_votes >= brand.no_weekend_votes;
}

export function isDisputed(brand: Brand): boolean {
  const total = brand.weekend_votes + brand.no_weekend_votes;
  if (total < 8) return false;
  const ratio = brand.weekend_votes / total;
  return ratio > 0.32 && ratio < 0.68;
}

export function voteTotal(brand: Brand): number {
  return brand.weekend_votes + brand.no_weekend_votes;
}

export function restShare(brand: Brand): number {
  const total = voteTotal(brand);
  if (total === 0) return brand.weekend_off ? 1 : 0;
  return brand.weekend_votes / total;
}

/** Same-category brands marked 双休. Used when the current one is 非双休. */
export function suggestAlternatives(brand: Brand, all: Brand[], limit = 4): Brand[] {
  return all
    .filter((item) => item.id !== brand.id && item.category === brand.category && resolvedWeekend(item))
    .sort((a, b) => voteTotal(b) - voteTotal(a) || restShare(b) - restShare(a))
    .slice(0, limit);
}
