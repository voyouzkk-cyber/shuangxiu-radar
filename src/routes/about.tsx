import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="px-5 pb-8 pt-6">
      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        返回
      </Link>
      <p className="mt-4 text-xs font-medium tracking-widest text-muted-foreground">说明</p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">双休雷达</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          用来查日常品牌有没有被登记为双休。查询本身不连模型。有人登记或投票后，会写入公共库，后面打开这个网页的人都能看到。
        </p>
        <p>
          不收集姓名、手机号、微信号、位置，不设账号。别人能看到品牌条目，看不到是谁写的。
        </p>
        <p>
          同一公司不同岗位、时期、地区可能不同。条目可能不准。本工具不对任何公司作指控，也不号召抵制。
        </p>
        <p>
          请勿在说明里填写姓名、工号、电话或内部资料。发现这类内容会被抹掉。
        </p>
        <p>
          没有站方客服、没有主办人主页。这是一份公开备忘工具，不是实名举报平台。
        </p>
      </div>
    </div>
  );
}
