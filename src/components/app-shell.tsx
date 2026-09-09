import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, PenLine, Search } from "lucide-react";
import { DisclaimerGate } from "@/components/disclaimer";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const TABS = [
  { to: "/brands", label: "品牌库", icon: BookOpen, center: false },
  { to: "/", label: "查询", icon: Search, center: true },
  { to: "/register", label: "登记", icon: PenLine, center: false },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh justify-center bg-inset">
      <div className="relative flex h-dvh w-full max-w-md flex-col bg-background text-foreground">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
        <nav
          className="shrink-0 border-t border-border bg-card px-6 pt-2"
          style={{ paddingBottom: "max(0.6rem, env(safe-area-inset-bottom))" }}
        >
          <ul className="grid grid-cols-3 items-end">
            {TABS.map((tab) => {
              const active =
                tab.to === "/"
                  ? pathname === "/"
                  : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
              const Icon = tab.icon;
              return (
                <li key={tab.to} className="flex justify-center">
                  <Link
                    to={tab.to}
                    className={cn(
                      "flex min-h-11 min-w-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors duration-150",
                      tab.center && "-mt-5",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center transition-transform duration-150",
                        tab.center
                          ? cn(
                              "size-14 rounded-full shadow-[var(--shadow-border)]",
                              active
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground",
                            )
                          : "size-6",
                      )}
                    >
                      <Icon
                        className={tab.center ? "size-6" : "size-5"}
                        strokeWidth={1.75}
                      />
                    </span>
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <DisclaimerGate />
      </div>
    </div>
  );
}
