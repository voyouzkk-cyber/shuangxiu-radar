import { resolvedWeekend, isDisputed, type Brand } from "@/lib/brands-shared";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ brand }: { brand: Brand }) {
  const rest = resolvedWeekend(brand);
  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge variant={rest ? "rest" : "overtime"}>
        {rest ? "双休" : "非双休"}
      </Badge>
      {isDisputed(brand) ? <Badge>有争议</Badge> : null}
    </span>
  );
}

export function VerdictPanel({ brand }: { brand: Brand }) {
  const rest = resolvedWeekend(brand);
  return (
    <div
      className={cn(
        "rounded-xl px-5 py-8 text-center",
        rest ? "bg-rest text-rest-foreground" : "bg-overtime text-overtime-foreground",
      )}
    >
      <p className="text-xs font-medium tracking-widest opacity-80">
        社区登记
      </p>
      <p className="font-display mt-2 text-5xl font-semibold tracking-tight">
        {rest ? "双休" : "非双休"}
      </p>
      <p className="mt-3 text-sm leading-relaxed opacity-90">
        {rest
          ? "社区记为双休。仅供参考，请自行判断。"
          : "社区记为未实行稳定双休。仅供参考，请自行判断。"}
      </p>
    </div>
  );
}
