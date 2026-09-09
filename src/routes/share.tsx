import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { QrMark } from "@/components/qr-mark";
import { Button } from "@/components/ui/button";
import { shareApp } from "@/lib/privacy";

export const Route = createFileRoute("/share")({
  component: SharePage,
});

function SharePage() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  return (
    <div className="px-5 pb-8 pt-6">
      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        返回
      </Link>

      <p className="mt-4 text-xs font-medium tracking-widest text-muted-foreground">扫码打开</p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">发给朋友</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        这是普通网页，不是微信小程序，不用过微信审核。微信扫一扫即可打开。
      </p>

      <div className="mx-auto mt-6 w-56 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <QrMark value={url} label="双休雷达访问二维码" />
      </div>

      <p className="mt-4 break-all text-center text-xs text-muted-foreground">{url || "读取地址…"}</p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!url) return;
            void navigator.clipboard.writeText(url).then(
              () => toast.success("链接已复制"),
              () => toast.error("复制失败，请长按地址栏"),
            );
          }}
        >
          <Copy />
          复制链接
        </Button>
        <Button
          type="button"
          onClick={() => {
            void shareApp().then((how) => {
              if (how === "copied") toast.success("链接已复制");
              if (how === "failed") toast.error("请改用复制链接");
            });
          }}
        >
          <Share2 />
          系统分享
        </Button>
      </div>

      <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          截图这个码，发到微信。朋友用「扫一扫」打开，不用装小程序，也不用过微信审核。
        </p>
        <p>
          若你还在预览里，请先点发布，再用发布后的页面打开本页去截图。预览地址朋友打不开。
        </p>
        <p>
          国内若打不开这个域名，把网页放到国内能访问的空间，用那个地址生成二维码。网页本身不用审核。
        </p>
      </div>
    </div>
  );
}
