import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { markPickedVote, pickedVote } from "@/lib/catalog";
import { voteBrand } from "@/lib/server/brands";
import { voteTotal, type Brand } from "@/lib/brands-shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function VoteBar({ brand }: { brand: Brand }) {
  const queryClient = useQueryClient();
  const [current, setCurrent] = useState(brand);
  const [picked, setPicked] = useState<"rest" | "overtime" | null>(null);
  const total = voteTotal(current);

  useEffect(() => {
    setCurrent(brand);
    setPicked(pickedVote(brand.id));
  }, [brand]);

  const mutation = useMutation({
    mutationFn: (weekendOff: boolean) =>
      voteBrand({ data: { id: brand.id, weekend_off: weekendOff } }),
    onSuccess: (data, weekendOff) => {
      const value = weekendOff ? "rest" : "overtime";
      markPickedVote(brand.id, value);
      setPicked(value);
      if (data) setCurrent(data);
      void queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: () => toast.error("投票没成功，请稍后再试"),
  });

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium">这是你了解的情况吗</p>
        <p className="text-xs tabular-nums text-muted-foreground">{total} 人登记</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={picked === "rest" ? "rest" : "outline"}
          disabled={picked !== null || mutation.isPending}
          onClick={() => mutation.mutate(true)}
          className={cn(picked === "overtime" && "opacity-50")}
        >
          双休 {current.weekend_votes}
        </Button>
        <Button
          type="button"
          variant={picked === "overtime" ? "overtime" : "outline"}
          disabled={picked !== null || mutation.isPending}
          onClick={() => mutation.mutate(false)}
          className={cn(picked === "rest" && "opacity-50")}
        >
          非双休 {current.no_weekend_votes}
        </Button>
      </div>
      {picked ? (
        <p className="text-xs text-muted-foreground">本机已投过票，避免重复灌水。</p>
      ) : null}
    </div>
  );
}
