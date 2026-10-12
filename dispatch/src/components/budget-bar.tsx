import { formatUsd } from "@/lib/format";
import type { BudgetSnapshot } from "@/lib/types";

export function BudgetBar({ budget }: { budget: BudgetSnapshot }) {
  const used = budget.committedUsd + budget.spentUsd;
  const spentPct =
    budget.allocatedUsd > 0 ? (budget.spentUsd / budget.allocatedUsd) * 100 : 0;
  const committedPct =
    budget.allocatedUsd > 0 ? (budget.committedUsd / budget.allocatedUsd) * 100 : 0;
  const over = used > budget.allocatedUsd;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-wide text-zinc-500">
            {budget.month} budget
          </p>
          <p className="mt-0.5 text-sm text-zinc-600">
            Allocated{" "}
            <span className="tabular-nums font-medium text-zinc-950">
              {formatUsd(budget.allocatedUsd)}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-[13px]">
          <Stat label="Spent" value={formatUsd(budget.spentUsd)} />
          <Stat label="Committed" value={formatUsd(budget.committedUsd)} />
          <Stat
            label="Remaining"
            value={formatUsd(budget.remainingUsd)}
            warn={over}
          />
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div className="flex h-full w-full">
          <div
            className="h-full bg-zinc-900"
            style={{ width: `${Math.min(spentPct, 100)}%` }}
          />
          <div
            className="h-full bg-zinc-400"
            style={{ width: `${Math.min(committedPct, Math.max(0, 100 - spentPct))}%` }}
          />
        </div>
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">
        Dark = delivered this month. Grey = approved or shipped, not yet delivered.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div
        className={`tabular-nums text-sm font-medium ${warn ? "text-red-700" : "text-zinc-950"}`}
      >
        {value}
      </div>
    </div>
  );
}
