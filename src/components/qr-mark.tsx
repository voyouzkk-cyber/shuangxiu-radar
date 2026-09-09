import { encode } from "uqr";

export function QrMark({ value, label }: { value: string; label: string }) {
  if (!value) {
    return <div className="aspect-square w-full animate-pulse rounded-lg bg-muted" />;
  }

  const qr = encode(value, { ecc: "M", border: 2 });
  let path = "";
  for (let y = 0; y < qr.size; y += 1) {
    const row = qr.data[y];
    if (!row) continue;
    for (let x = 0; x < qr.size; x += 1) {
      if (row[x]) path += `M${x} ${y}h1v1h-1z`;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${qr.size} ${qr.size}`}
      className="size-full text-foreground"
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <rect width={qr.size} height={qr.size} fill="var(--color-card)" />
      <path d={path} fill="currentColor" />
    </svg>
  );
}
