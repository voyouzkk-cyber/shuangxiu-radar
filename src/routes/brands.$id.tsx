import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Alternatives } from "@/components/alternatives";
import { VerdictPanel } from "@/components/status-mark";
import { VoteBar } from "@/components/vote-bar";
import { listBrands } from "@/lib/server/brands";
import { restShare, voteTotal } from "@/lib/brands-shared";

export const Route = createFileRoute("/brands/$id")({
  component: BrandDetailPage,
});

function BrandDetailPage() {
  const { id } = Route.useParams();
  const numericId = Number(id);
  const { data, isPending } = useQuery({
    queryKey: ["brands"],
    queryFn: () => listBrands(),
  });

  const brand = data?.find((item) => item.id === numericId);

  if (isPending) {
    return (
      <div className="px-5 pt-7">
        <div className="h-8 w-20 animate-pulse rounded-sm bg-muted" />
        <div className="mt-6 h-10 w-40 animate-pulse rounded-sm bg-muted" />
        <div className="mt-5 h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="px-5 pt-10">
        <p className="font-display text-2xl font-semibold">没有这条记录</p>
        <Link to="/brands" className="mt-3 inline-block text-sm text-muted-foreground underline">
          返回品牌库
        </Link>
      </div>
    );
  }

  const share = Math.round(restShare(brand) * 100);
  const total = voteTotal(brand);

  return (
    <div className="px-5 pb-8 pt-6">
      <Link
        to="/brands"
        className="inline-flex min-h-11 items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        品牌库
      </Link>

      <div className="mt-3 flex items-start gap-3">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted font-display text-2xl font-semibold">
          {brand.name.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight">
            {brand.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {brand.name_en ? `${brand.name_en} · ` : ""}
            {brand.category}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <VerdictPanel brand={brand} />
      </div>

      {brand.note ? (
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{brand.note}</p>
      ) : null}

      {brand.aliases ? (
        <p className="mt-3 text-xs text-muted-foreground">别名 {brand.aliases}</p>
      ) : null}

      <div className="mt-6 rounded-lg bg-card px-4 py-4 shadow-[var(--shadow-border)]">
        <div className="flex items-baseline justify-between text-sm">
          <span>双休票占比</span>
          <span className="tabular-nums font-medium">{share}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-rest"
            style={{ width: `${share}%` }}
          />
        </div>
        <p className="mt-2 text-xs tabular-nums text-muted-foreground">
          {brand.weekend_votes} 双休 · {brand.no_weekend_votes} 非双休 · {total} 票
        </p>
      </div>

      <div className="mt-6">
        <Alternatives brand={brand} all={data ?? []} />
      </div>

      <div className="mt-6">
        <VoteBar brand={brand} />
      </div>
    </div>
  );
}
