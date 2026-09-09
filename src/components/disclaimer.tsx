import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DISCLAIMER_KEY } from "@/lib/privacy";

export function DisclaimerGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setOpen(localStorage.getItem(DISCLAIMER_KEY) !== "1");
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-inset/70 p-4 sm:items-center">
      <div className="mx-auto w-full max-w-md rounded-xl bg-card px-5 py-6 text-card-foreground shadow-[var(--shadow-border)]">
        <p className="text-xs font-medium tracking-widest text-muted-foreground">使用前</p>
        <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight">这是匿名备忘，不是黑名单</h2>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
          <p>双休情况来自众包登记，可能过时或不准。不是公司官方声明，也不构成对任何企业的指控或抵制号召。</p>
          <p>本工具不收集姓名、手机号、微信号，不设账号。请勿填写能识别个人的信息。你登记的品牌会进入公共名单，后面打开的人都能查到。</p>
          <p>是否购买，请你自己判断。</p>
        </div>
        <Button
          className="mt-5 w-full"
          size="lg"
          onClick={() => {
            try {
              localStorage.setItem(DISCLAIMER_KEY, "1");
            } catch {
              /* ignore */
            }
            setOpen(false);
          }}
        >
          我知道了
        </Button>
        <Link
          to="/about"
          className="mt-3 block text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          说明与隐私
        </Link>
      </div>
    </div>
  );
}
