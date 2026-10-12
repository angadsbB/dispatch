"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SignalFilters({
  rounds,
  industries,
}: {
  rounds: string[];
  industries: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  }

  const selectClass =
    "h-8 rounded-md border border-zinc-200 bg-white px-2 text-[13px] text-zinc-800 outline-none focus:border-zinc-400";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${pending ? "opacity-70" : ""}`}
    >
      <select
        className={selectClass}
        value={params.get("round") ?? "all"}
        onChange={(e) => setParam("round", e.target.value)}
      >
        <option value="all">All rounds</option>
        {rounds.map((round) => (
          <option key={round} value={round}>
            {round}
          </option>
        ))}
      </select>
      <select
        className={selectClass}
        value={params.get("min") ?? "all"}
        onChange={(e) => setParam("min", e.target.value)}
      >
        <option value="all">Any raise size</option>
        <option value="5000000">$5M+</option>
        <option value="10000000">$10M+</option>
        <option value="25000000">$25M+</option>
        <option value="50000000">$50M+</option>
      </select>
      <select
        className={selectClass}
        value={params.get("industry") ?? "all"}
        onChange={(e) => setParam("industry", e.target.value)}
      >
        <option value="all">All industries</option>
        {industries.map((industry) => (
          <option key={industry} value={industry}>
            {industry}
          </option>
        ))}
      </select>
      <label className="ml-1 flex items-center gap-2 text-[13px] text-zinc-600">
        <input
          type="checkbox"
          className="size-3.5 accent-zinc-900"
          checked={params.get("hideGifted") === "1"}
          onChange={(e) => setParam("hideGifted", e.target.checked ? "1" : "")}
        />
        Hide companies gifted in the last 90 days
      </label>
    </div>
  );
}
