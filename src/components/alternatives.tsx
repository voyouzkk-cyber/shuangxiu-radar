import { Link } from "@tanstack/react-router";
import { BrandRow } from "@/components/brand-row";
import { resolvedWeekend, suggestAlternatives, type Brand } from "@/lib/brands-shared";

export function Alternatives({
  brand,
  all,
  onPick,
}: {
  brand: Brand;
  all: Brand[];
  onPick?: (brand: Brand) => void;
}) {
  if (resolvedWeekend(brand)) return null;

  const alts = suggestAlternatives(brand, all);

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight">同类里记为双休的</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          同是「{brand.category}」。是否更换，由你自己决定。
        </p>
      </div>
      {alts.length === 0 ? (
        <div className="rounded-lg bg-card px-4 py-4 text-sm text-muted-foreground shadow-[var(--shadow-border)]">
          这个品类还没有双休品牌。
          <Link
            to="/register"
            search={{ category: brand.category }}
            className="ml-1 font-medium text-foreground underline-offset-2 hover:underline"
          >
            去登记一家
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {alts.map((item) => (
            <BrandRow key={item.id} brand={item} onSelect={onPick} />
          ))}
        </div>
      )}
    </section>
  );
}
