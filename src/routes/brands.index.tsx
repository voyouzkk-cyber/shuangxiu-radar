import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandRow } from "@/components/brand-row";
import { Input } from "@/components/ui/input";
import { listBrands } from "@/lib/server/brands";
import { resolvedWeekend, type Brand } from "@/lib/brands-shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/brands/")({
  component: BrandsPage,
});

type Filter = "all" | "rest" | "overtime";

function BrandsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { data, isPending } = useQuery({
    queryKey: ["brands"],
    queryFn: () => listBrands(),
  });

  const brands = data ?? [];
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return brands.filter((brand) => {
      const rest = resolvedWeekend(brand);
      if (filter === "rest" && !rest) return false;
      if (filter === "overtime" && rest) return false;
      if (!needle) return true;
      return (
        brand.name.toLowerCase().includes(needle) ||
        brand.name_en.toLowerCase().includes(needle) ||
        brand.aliases.toLowerCase().includes(needle) ||
        brand.category.includes(q.trim())
      );
    });
  }, [brands, filter, q]);

  return (
    <div className="px-5 pb-8 pt-7">
      <header>
        <p className="text-xs font-medium tracking-widest text-muted-foreground">
          社区库
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">品牌库</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          按双休 / 非双休浏览。有人登记或投票后，所有打开这个网页的人都能看到。
        </p>
      </header>

      <label className="relative mt-6 block">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索品牌、英文名、别名"
          aria-label="搜索品牌"
          className="pl-10"
        />
      </label>

      <div className="mt-3 flex gap-2">
        <FilterChip current={filter} value="all" onSelect={setFilter} count={brands.length}>
          全部
        </FilterChip>
        <FilterChip
          current={filter}
          value="rest"
          onSelect={setFilter}
          count={brands.filter((b) => resolvedWeekend(b)).length}
        >
          双休
        </FilterChip>
        <FilterChip
          current={filter}
          value="overtime"
          onSelect={setFilter}
          count={brands.filter((b) => !resolvedWeekend(b)).length}
        >
          非双休
        </FilterChip>
      </div>

      <div className="mt-5 space-y-2">
        {isPending ? (
          <LoadingList />
        ) : filtered.length === 0 ? (
          <p className="rounded-lg bg-card px-4 py-6 text-center text-sm text-muted-foreground shadow-[var(--shadow-border)]">
            没有匹配的品牌。
          </p>
        ) : (
          filtered.map((brand: Brand) => <BrandRow key={brand.id} brand={brand} />)
        )}
      </div>
    </div>
  );
}

function FilterChip({
  current,
  value,
  onSelect,
  count,
  children,
}: {
  current: Filter;
  value: Filter;
  onSelect: (v: Filter) => void;
  count: number;
  children: string;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors duration-150",
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
      )}
    >
      {children}
      <span className="tabular-nums opacity-80">{count}</span>
    </button>
  );
}

function LoadingList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  );
}
