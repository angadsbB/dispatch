import { statusLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { GiftStatus } from "@/lib/types";

const styles: Record<GiftStatus, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-sky-50 text-sky-800 ring-sky-200",
  rejected: "bg-red-50 text-red-800 ring-red-200",
  shipped: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  delivered: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export function StatusPill({ status }: { status: GiftStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset tabular-nums",
        styles[status],
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
