import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, type Category } from "@/lib/brands-shared";
import { createBrand } from "@/lib/server/brands";
import { cn } from "@/lib/utils";

type RegisterSearch = { name?: string; category?: string };

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => ({
    name: typeof search.name === "string" ? search.name : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { name: prefill, category: prefillCategory } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState(prefill ?? "");
  const [nameEn, setNameEn] = useState("");
  const [aliases, setAliases] = useState("");
  const [category, setCategory] = useState<Category>(
    CATEGORIES.includes(prefillCategory as Category)
      ? (prefillCategory as Category)
      : "食品饮料",
  );
  const [weekendOff, setWeekendOff] = useState<boolean | null>(null);
  const [note, setNote] = useState("");
  const [thanks, setThanks] = useState<{ id: number; name: string } | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      if (weekendOff === null) throw new Error("请选择双休或非双休");
      return createBrand({
        data: {
          name,
          name_en: nameEn,
          aliases,
          category,
          weekend_off: weekendOff,
          note,
        },
      });
    },
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: ["brands"] });
      if (res.ok) {
        setThanks({ id: res.brand.id, name: res.brand.name });
        return;
      }
      toast.message("这个品牌已经在库里，带你去校正");
      void navigate({ to: "/brands/$id", params: { id: String(res.brand.id) } });
    },
    onError: (err: Error) => toast.error(err.message || "登记失败"),
  });

  function resetForm() {
    setName("");
    setNameEn("");
    setAliases("");
    setWeekendOff(null);
    setNote("");
    setThanks(null);
  }

  return (
    <div className="px-5 pb-8 pt-7">
      <header>
        <p className="text-xs font-medium tracking-widest text-muted-foreground">
          众包
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">登记品牌</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          在这家公司上班，或常买它的产品？把品牌名记下来。提交后进入公共库，后面打开这个网页的人都能查到。不记你是谁。
        </p>
      </header>

      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <Field label="品牌名" htmlFor="name">
          <Input
            id="name"
            required
            minLength={2}
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="包装上的名字，例如 农夫山泉"
          />
        </Field>

        <Field label="英文名（选填）" htmlFor="nameEn">
          <Input
            id="nameEn"
            maxLength={60}
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="Nongfu Spring"
          />
        </Field>

        <Field label="别名，逗号分隔（选填）" htmlFor="aliases">
          <Input
            id="aliases"
            maxLength={120}
            value={aliases}
            onChange={(e) => setAliases(e.target.value)}
            placeholder="农夫, Nongfu"
          />
        </Field>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">品类</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    "h-9 rounded-full px-3 text-sm font-medium transition-colors duration-150",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">双休情况</legend>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWeekendOff(true)}
              className={cn(
                "h-14 rounded-lg text-sm font-medium transition-colors duration-150",
                weekendOff === true
                  ? "bg-rest text-rest-foreground"
                  : "bg-card text-foreground shadow-[var(--shadow-border)]",
              )}
            >
              双休
            </button>
            <button
              type="button"
              onClick={() => setWeekendOff(false)}
              className={cn(
                "h-14 rounded-lg text-sm font-medium transition-colors duration-150",
                weekendOff === false
                  ? "bg-overtime text-overtime-foreground"
                  : "bg-card text-foreground shadow-[var(--shadow-border)]",
              )}
            >
              非双休
            </button>
          </div>
        </fieldset>

        <Field label="补充说明（选填）" htmlFor="note">
          <Textarea
            id="note"
            maxLength={160}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="只写排班情况。不要填姓名、工号、电话或微信号。"
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "提交中…" : "提交到公共库"}
        </Button>
      </form>

      {thanks ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-inset/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="thanks-title"
            className="w-full max-w-md rounded-xl bg-card px-5 py-6 text-card-foreground shadow-[var(--shadow-border)]"
          >
            <p className="text-xs font-medium tracking-widest text-muted-foreground">谢谢</p>
            <h2 id="thanks-title" className="font-display mt-2 text-2xl font-semibold tracking-tight">
              谢谢你补上这一条
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              「{thanks.name}」已经写入公共库。后面打开的人都能查到。不记你是谁。
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                再登记一个
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const id = thanks.id;
                  setThanks(null);
                  void navigate({ to: "/brands/$id", params: { id: String(id) } });
                }}
              >
                去看这条
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
