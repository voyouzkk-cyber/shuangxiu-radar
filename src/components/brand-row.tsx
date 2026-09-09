import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { restShare, voteTotal, type Brand } from "@/lib/brands-shared";
import { StatusBadge } from "@/components/status-mark";

const rowClass =
  "flex w-full items-center gap-3 rounded-lg bg-card px-3 py-3 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:shadow-[var(--shadow-border-hover)] active:scale-[0.99]";

export function BrandRow({
  brand,
  onSelect,
}: {
  brand: Brand;
  onSelect?: (brand: Brand) => void;
}) {
  const share = restShare(brand);
  const total = voteTotal(brand);

  const inner = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted font-display text-lg font-semibold text-foreground">
        {brand.name.slice(0, 1)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-medium">{brand.name}</span>
          <StatusBadge brand={brand} />
        </span>
        <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{brand.category}</span>
          <span className="tabular-nums">{total} 票</span>
        </span>
        <span className="mt-2 block h-1 overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full rounded-full bg-rest"
            style={{ width: `${Math.round(share * 100)}%` }}
          />
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </>
  );

  if (onSelect) {
    return (
      <button type="button" className={rowClass} onClick={() => onSelect(brand)}>
        {inner}
      </button>
    );
  }

  return (
    <Link to="/brands/$id" params={{ id: String(brand.id) }} className={rowClass}>
      {inner}
    </Link>
  );
}
