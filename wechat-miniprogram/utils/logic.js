const baked = require("../data/brands.js");

const EXTRA_KEY = "sx-local-brands";
const PICK_KEY = "sx-votes";
const COUNT_KEY = "sx-vote-counts";

const CATEGORIES = [
  "食品饮料",
  "日化洗护",
  "服装运动",
  "数码家电",
  "美妆个护",
  "餐饮零售",
  "汽车出行",
  "医药健康",
  "其他",
];

function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[（）()[\]【】·・._\-—/,，。!！?？'"“”‘’]/g, "")
    .replace(
      /股份有限公司|有限责任公司|有限公司|集团公司|集团|控股|company|incorporated|corporation|inc|ltd|llc|co/g,
      "",
    );
}

function aliasList(brand) {
  return [brand.name, brand.name_en, ...(brand.aliases || "").split(/[,，、;/|]/)]
    .map((part) => String(part).trim())
    .filter(Boolean);
}

function scoreMatch(query, brand) {
  const q = normalizeName(query);
  if (q.length < 2) return 0;
  let best = 0;
  aliasList(brand).forEach((raw) => {
    const n = normalizeName(raw);
    if (!n) return;
    if (n === q) best = Math.max(best, 100);
    else if (n.includes(q) || q.includes(n)) {
      const ratio = Math.min(n.length, q.length) / Math.max(n.length, q.length);
      best = Math.max(best, Math.round(55 + 40 * ratio));
    }
  });
  return best;
}

function sanitizeNote(raw) {
  return String(raw || "")
    .trim()
    .slice(0, 160)
    .replace(/1[3-9]\d{9}/g, "[已略]")
    .replace(/\d{17}[\dXx]/g, "[已略]")
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, "[已略]")
    .replace(/微信号?\s*[:：]?\s*[\w\-]+/gi, "[已略]")
    .replace(/https?:\/\/\S+/gi, "[已略]");
}

function requireGate() {
  if (wx.getStorageSync("sx-disclaimer-ok") === "1") return true;
  wx.reLaunch({ url: "/pages/gate/gate" });
  return false;
}
  try {
    const raw = wx.getStorageSync(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJson(key, value) {
  wx.setStorageSync(key, JSON.stringify(value));
}

function voteTotal(brand) {
  return (brand.weekend_votes || 0) + (brand.no_weekend_votes || 0);
}

function resolvedWeekend(brand) {
  const total = voteTotal(brand);
  if (total < 3) return !!brand.weekend_off;
  return brand.weekend_votes >= brand.no_weekend_votes;
}

function restShare(brand) {
  const total = voteTotal(brand);
  if (total === 0) return brand.weekend_off ? 1 : 0;
  return brand.weekend_votes / total;
}

function listCatalog() {
  const extras = readJson(EXTRA_KEY, []);
  const counts = readJson(COUNT_KEY, {});
  return baked.concat(extras).map((brand) => {
    const patch = counts[String(brand.id)];
    return patch ? Object.assign({}, brand, patch) : brand;
  });
}

function searchBrands(query, brands) {
  const q = String(query || "").trim();
  if (!q) return [];
  return brands
    .map((brand) => ({
      brand,
      score: Math.max(
        scoreMatch(q, brand),
        brand.name.indexOf(q) >= 0 ? 70 : 0,
        String(brand.name_en).toLowerCase().indexOf(q.toLowerCase()) >= 0 ? 68 : 0,
        String(brand.aliases).indexOf(q) >= 0 ? 66 : 0,
      ),
    }))
    .filter((row) => row.score >= 66)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((row) => decorate(row.brand));
}

function decorate(brand) {
  const rest = resolvedWeekend(brand);
  return Object.assign({}, brand, {
    rest,
    statusText: rest ? "双休" : "非双休",
    sharePct: Math.round(restShare(brand) * 100),
    total: voteTotal(brand),
  });
}

function suggestAlternatives(brand, all) {
  if (resolvedWeekend(brand)) return [];
  return all
    .filter((item) => item.id !== brand.id && item.category === brand.category && resolvedWeekend(item))
    .sort((a, b) => voteTotal(b) - voteTotal(a))
    .slice(0, 4)
    .map(decorate);
}

function pickedVote(id) {
  return readJson(PICK_KEY, {})[String(id)] || "";
}

function voteCatalog(id, weekendOff) {
  const brand = listCatalog().find((b) => b.id === id);
  if (!brand || pickedVote(id)) return decorate(brand || {});
  const next = {
    weekend_votes: brand.weekend_votes + (weekendOff ? 1 : 0),
    no_weekend_votes: brand.no_weekend_votes + (weekendOff ? 0 : 1),
  };
  const counts = readJson(COUNT_KEY, {});
  counts[String(id)] = next;
  writeJson(COUNT_KEY, counts);
  const picks = readJson(PICK_KEY, {});
  picks[String(id)] = weekendOff ? "rest" : "overtime";
  writeJson(PICK_KEY, picks);
  return decorate(Object.assign({}, brand, next));
}

function createBrand(input) {
  const name = String(input.name || "").trim();
  if (name.length < 2 || name.length > 40) throw new Error("品牌名需要 2–40 个字");
  const all = listCatalog();
  const existing = all.find(
    (b) => b.name.toLowerCase() === name.toLowerCase(),
  );
  if (existing) return { ok: false, brand: decorate(existing) };
  const brand = {
    id: Date.now(),
    name,
    name_en: String(input.name_en || "").trim(),
    aliases: String(input.aliases || "").trim(),
    weekend_off: !!input.weekend_off,
    category: CATEGORIES.indexOf(input.category) >= 0 ? input.category : "其他",
    note: sanitizeNote(input.note),
    weekend_votes: input.weekend_off ? 1 : 0,
    no_weekend_votes: input.weekend_off ? 0 : 1,
  };
  writeJson(EXTRA_KEY, readJson(EXTRA_KEY, []).concat([brand]));
  return { ok: true, brand: decorate(brand) };
}

function stats(brands) {
  const rest = brands.filter(resolvedWeekend).length;
  return { total: brands.length, rest, overtime: brands.length - rest };
}

module.exports = {
  CATEGORIES,
  listCatalog,
  searchBrands,
  suggestAlternatives,
  decorate,
  pickedVote,
  voteCatalog,
  createBrand,
  stats,
  requireGate,
  sanitizeNote,
};
