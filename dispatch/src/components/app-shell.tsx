"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Gift, Inbox, Menu, Radio, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/", label: "Signal Feed", icon: Radio },
  { href: "/approvals", label: "Approvals", icon: Inbox },
  { href: "/sends", label: "Sends", icon: Gift },
  { href: "/impact", label: "Impact", icon: BarChart3 },
];

export function AppShell({
  children,
  pendingCount,
}: {
  children: React.ReactNode;
  pendingCount: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = (
    <nav className="flex flex-col gap-0.5 px-2">
      {nav.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
              active
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.href === "/approvals" && pendingCount > 0 ? (
              <span
                className={cn(
                  "tabular-nums rounded-full px-1.5 py-px text-[10px] font-semibold",
                  active ? "bg-white/20 text-white" : "bg-zinc-900 text-white",
                )}
              >
                {pendingCount}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-zinc-200 bg-white md:flex md:flex-col">
        <div className="flex h-14 items-center gap-2 px-4">
          <div className="flex size-6 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-semibold text-white">
            D
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">Dispatch</div>
            <div className="text-[11px] text-zinc-500">Gift outbound</div>
          </div>
        </div>
        {items}
        <div className="mt-auto border-t border-zinc-200 px-4 py-3">
          <p className="text-[11px] text-zinc-500">Local mock · no auth</p>
        </div>
      </aside>

      <div className="flex h-14 items-center gap-2 border-b border-zinc-200 bg-white px-3 md:hidden">
        <Button variant="ghost" size="icon-sm" onClick={() => setOpen((v) => !v)}>
          {open ? <X /> : <Menu />}
        </Button>
        <span className="text-sm font-semibold">Dispatch</span>
      </div>
      {open ? (
        <div className="border-b border-zinc-200 bg-white py-2 md:hidden">{items}</div>
      ) : null}

      <main className="md:pl-56">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</div>
      </main>
    </div>
  );
}
