import { ApprovalActions } from "@/components/approval-actions";
import { BudgetBar } from "@/components/budget-bar";
import { formatCompactUsd, formatDate, formatDateTime, formatUsd } from "@/lib/format";
import { getBudgetSnapshot, listApprovals, wouldExceedBudget } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function ApprovalsPage() {
  const rows = listApprovals();
  const budget = getBudgetSnapshot();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Approval queue</h1>
        <p className="text-sm text-zinc-600">
          Pending gift requests, newest first. Over-budget approvals warn twice and
          still let you decide.
        </p>
      </header>

      <BudgetBar budget={budget} />

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium">Queue is clear.</p>
          <p className="mt-1 text-sm text-zinc-500">
            Draft a gift from the signal feed and it will land here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <article
              key={row.id}
              className="rounded-lg border border-zinc-200 bg-white p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h2 className="text-[15px] font-semibold">{row.recipientName}</h2>
                    <span className="text-[13px] text-zinc-500">{row.recipientTitle}</span>
                    <span className="text-[13px] text-zinc-400">·</span>
                    <span className="text-[13px] font-medium">{row.companyName}</span>
                  </div>
                  <p className="text-[13px] text-zinc-600">
                    Trigger: {row.round} {formatCompactUsd(row.amountUsd)} led by{" "}
                    {row.leadInvestor} · {formatDate(row.announcedOn)}
                  </p>
                  <p className="text-sm">
                    {row.giftEmoji} {row.giftName}{" "}
                    <span className="tabular-nums font-medium">
                      {formatUsd(row.giftCost)}
                    </span>
                    <span className="text-zinc-500">
                      {" "}
                      · requested {formatDateTime(row.requestedAt)} by {row.requestedBy}
                    </span>
                  </p>
                  <blockquote className="rounded-md border border-zinc-100 bg-zinc-50 px-3 py-2 text-[13px] leading-relaxed text-zinc-700">
                    {row.note}
                  </blockquote>
                </div>
                <ApprovalActions
                  id={row.id}
                  giftCost={row.giftCost}
                  overBudget={wouldExceedBudget(row.giftCost)}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
