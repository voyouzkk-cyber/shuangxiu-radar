export const DISCLAIMER_KEY = "sx-disclaimer-ok";

export function sanitizeNote(raw: string): string {
  return raw
    .trim()
    .slice(0, 160)
    .replace(/1[3-9]\d{9}/g, "[已略]")
    .replace(/\d{17}[\dXx]/g, "[已略]")
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, "[已略]")
    .replace(/微信号?\s*[:：]?\s*[\w\-]+/gi, "[已略]")
    .replace(/https?:\/\/\S+/gi, "[已略]");
}

export async function shareApp(): Promise<"shared" | "copied" | "failed"> {
  const url = window.location.origin;
  const title = "双休雷达";
  const text = "查品牌是否双休。众包备忘，不是官方名单。";
  try {
    if (typeof navigator.share === "function") {
      await navigator.share({ title, text, url });
      return "shared";
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return "failed";
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}
