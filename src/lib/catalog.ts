const PICK_KEY = "sx-votes";

type PickMap = Record<string, "rest" | "overtime">;

function readPicks(): PickMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PICK_KEY);
    return raw ? (JSON.parse(raw) as PickMap) : {};
  } catch {
    return {};
  }
}

export function pickedVote(id: number): "rest" | "overtime" | null {
  return readPicks()[String(id)] ?? null;
}

export function markPickedVote(id: number, value: "rest" | "overtime") {
  const next = { ...readPicks(), [String(id)]: value };
  localStorage.setItem(PICK_KEY, JSON.stringify(next));
}
