import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Search, Share2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alternatives } from "@/components/alternatives";
import { BrandRow } from "@/components/brand-row";
import { VerdictPanel } from "@/components/status-mark";
import { VoteBar } from "@/components/vote-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listBrands } from "@/lib/server/brands";
import { resolvedWeekend, searchBrands, type Brand } from "@/lib/brands-shared";
import { cn } from "@/lib/utils";

const HOT = ["农夫山泉", "三只松鼠", "安踏", "立白", "星巴克", "华为"];

export function LookupStage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Brand | null>(null);

  const brandsQuery = useQuery({
    queryKey: ["brands"],
    queryFn: () => listBrands(),
  });
  const brands = brandsQuery.data ?? [];

  const stats = useMemo(() => {
    const rest = brands.filter((b) => resolvedWeekend(b)).length;
    return { total: brands.length, rest, overtime: brands.length - rest };
  }, [brands]);

  const hits = useMemo(() => searchBrands(query, brands), [brands, query]);

  const livePicked = picked
    ? (brands.find((b) => b.id === picked.id) ?? picked)
    : null;

  useEffect(() => {
    if (picked || brands.length === 0) return;
    const q = query.trim();
    if (!q) return;
    const exact = brands.find(
      (b) => b.name === q || b.name_en.toLowerCase() === q.toLowerCase(),
    );
    if (exact) setPicked(exact);
    else if (hits.length === 1) setPicked(hits[0]);
  }, [brands, query, picked, hits]);

  function choose(brand: Brand) {
    setPicked(brand);
    setQuery(brand.name);
  }

  function clear() {
    setPicked(null);
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="px-5 pb-8 pt-7">
      {livePicked ? null : (
        <header>
          <p className="text-xs font-medium tracking-widest text-muted-foreground">
            排班备忘
          </p>
          <h1 className="font-display mt-2 text-4xl leading-tight font-semibold tracking-tight">
            双休雷达
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            输入品牌名。有人登记过就能查到。新登记会进公共库，后面的人也能用。不是官方名单。
          </p>
        </header>
      )}

      <label className={cn("relative block", livePicked ? "mt-1" : "mt-6")}>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPicked(null);
          }}
          placeholder="输入品牌名，如 农夫山泉、乐事"
          aria-label="查询品牌名"
          className="h-12 pl-10 pr-11"
        />
        {query ? (
          <button
            type="button"
            onClick={clear}
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            aria-label="清除"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </label>

      {livePicked ? (
        <LookupResult brand={livePicked} all={brands} onClear={clear} onPick={choose} />
      ) : query.trim() ? (
        <section className="mt-4 space-y-2">
          {hits.length === 0 ? (
            <div className="rounded-lg bg-card px-4 py-4 text-sm leading-relaxed text-muted-foreground shadow-[var(--shadow-border)]">
              还没有「{query.trim()}」。在这家公司上班，或买过它的人，可以登记。
              <Link
                to="/register"
                search={{ name: query.trim() }}
                className="ml-1 font-medium text-foreground underline-offset-2 hover:underline"
              >
                去登记
              </Link>
            </div>
          ) : (
            hits.map((brand) => (
              <BrandRow key={brand.id} brand={brand} onSelect={choose} />
            ))
          )}
        </section>
      ) : (
        <>
          <section className="mt-6">
            <p className="text-xs font-medium tracking-widest text-muted-foreground">
              热门查询
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {HOT.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    const found = brands.find((b) => b.name === name);
                    if (found) choose(found);
                    else setQuery(name);
                  }}
                  className="h-9 rounded-full bg-muted px-3 text-sm font-medium text-foreground"
                >
                  {name}
                </button>
              ))}
            </div>
          </section>

          <dl className="mt-8 grid grid-cols-3 gap-2 text-center">
            <Stat label="已收录" value={stats.total} />
            <Stat label="双休" value={stats.rest} tone="rest" />
            <Stat label="非双休" value={stats.overtime} tone="overtime" />
          </dl>

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            众包备忘，不是公司官方声明。请自行判断。
            <Link to="/about" className="ml-1 font-medium text-foreground underline-offset-2 hover:underline">
              说明与隐私
            </Link>
          </p>
          <div className="mt-4 flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/share">
                <Share2 />
                扫码分享
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function LookupResult({
  brand,
  all,
  onClear,
  onPick,
}: {
  brand: Brand;
  all: Brand[];
  onClear: () => void;
  onPick: (brand: Brand) => void;
}) {
  return (
    <div className="mt-5 space-y-5">
      <div className="flex items-start gap-3">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted font-display text-2xl font-semibold">
          {brand.name.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-2xl leading-tight font-semibold tracking-tight">
            {brand.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {brand.name_en ? `${brand.name_en} · ` : ""}
            {brand.category}
          </p>
        </div>
      </div>

      <VerdictPanel brand={brand} />

      {brand.note ? (
        <p className="text-sm leading-relaxed text-muted-foreground">{brand.note}</p>
      ) : null}

      <Alternatives brand={brand} all={all} onPick={onPick} />

      <VoteBar brand={brand} />

      <Button asChild variant="outline" className="w-full">
        <Link to="/brands/$id" params={{ id: String(brand.id) }}>
          查看完整记录
        </Link>
      </Button>
      <Button type="button" variant="ghost" className="w-full" onClick={onClear}>
        查另一个品牌
      </Button>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "rest" | "overtime";
}) {
  return (
    <div className="rounded-lg bg-card px-2 py-3 shadow-[var(--shadow-border)]">
      <div
        className={cn(
          "font-display text-2xl font-semibold tabular-nums",
          tone === "rest" && "text-rest",
          tone === "overtime" && "text-overtime",
        )}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
