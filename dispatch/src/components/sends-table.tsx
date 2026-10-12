"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { logOutcome, markDelivered, markShipped } from "@/app/actions";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatUsd, stageLabel } from "@/lib/format";
import type { GiftStatus, OutcomeStage, SendRow } from "@/lib/types";
import { GIFT_STATUSES, OUTCOME_STAGES } from "@/lib/types";

export function SendsTable({ rows }: { rows: SendRow[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [outcomeRow, setOutcomeRow] = useState<SendRow | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const status = (params.get("status") as GiftStatus | "all") || "all";
  const sort = params.get("sort") || "requestedAt";
  const dir = params.get("dir") || "desc";

  function patch(updates: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (!v || v === "all") next.delete(k);
      else next.set(k, v);
    }
    router.replace(`${pathname}?${next.toString()}`);
  }

  function toggleSort(key: string) {
    const nextDir = sort === key && dir === "desc" ? "asc" : "desc";
    patch({ sort: key, dir: nextDir });
  }

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setActionError(null);
    startTransition(async () => {
      try {
        const result = await fn();
        if (!result.ok) setActionError(result.error ?? "That action did not complete.");
      } catch {
        setActionError("Could not update this send. Refresh the page and try again.");
      }
    });
  }

  const selectClass =
    "h-8 rounded-md border border-zinc-200 bg-white px-2 text-[13px]";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <select
          className={selectClass}
          value={status}
          onChange={(e) => patch({ status: e.target.value })}
        >
          <option value="all">All statuses</option>
          {GIFT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <p className="text-[13px] text-zinc-500">
          {rows.length} send{rows.length === 1 ? "" : "s"}
        </p>
        {actionError ? <p className="text-[13px] text-red-700">{actionError}</p> : null}
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <SortHead label="Recipient" onClick={() => toggleSort("company")} />
              <TableHead>Gift</TableHead>
              <SortHead label="Cost" onClick={() => toggleSort("cost")} />
              <SortHead label="Status" onClick={() => toggleSort("status")} />
              <SortHead label="Requested" onClick={() => toggleSort("requestedAt")} />
              <TableHead>Tracking</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-zinc-500">
                  No sends match this filter.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="font-medium">{row.recipientName}</div>
                    <div className="text-[12px] text-zinc-500">
                      {row.recipientTitle} · {row.companyName}
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.giftEmoji} {row.giftName}
                  </TableCell>
                  <TableCell className="tabular-nums">{formatUsd(row.giftCost)}</TableCell>
                  <TableCell>
                    <StatusPill status={row.status} />
                  </TableCell>
                  <TableCell className="tabular-nums text-zinc-600">
                    {formatDateTime(row.requestedAt)}
                  </TableCell>
                  <TableCell className="font-mono text-[12px] text-zinc-600">
                    {row.trackingNumber ?? "—"}
                  </TableCell>
                  <TableCell className="text-[12px] text-zinc-600">
                    <OutcomeSummary row={row} />
                  </TableCell>
                  <TableCell className="text-right">
                    {row.status === "approved" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() => run(() => markShipped(row.id))}
                      >
                        Mark shipped
                      </Button>
                    ) : null}
                    {row.status === "shipped" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() => run(() => markDelivered(row.id))}
                      >
                        Mark delivered
                      </Button>
                    ) : null}
                    {row.status === "delivered" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOutcomeRow(row)}
                      >
                        Log outcome
                      </Button>
                    ) : null}
                    {row.status === "pending" ? (
                      <Link
                        href="/approvals"
                        className="text-[12px] font-medium text-zinc-700 underline-offset-2 hover:underline"
                      >
                        In queue
                      </Link>
                    ) : null}
                    {row.status === "rejected" && row.rejectionReason ? (
                      <span className="text-[12px] text-zinc-500">Rejected</span>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {outcomeRow ? (
        <OutcomeDialog
          row={outcomeRow}
          onClose={() => setOutcomeRow(null)}
        />
      ) : null}
    </div>
  );
}

function SortHead({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <TableHead>
      <button type="button" onClick={onClick} className="hover:text-zinc-950">
        {label}
      </button>
    </TableHead>
  );
}

function OutcomeSummary({ row }: { row: SendRow }) {
  if (row.status !== "delivered") return <span>—</span>;
  if (row.stage && row.stage !== "none") {
    return (
      <span>
        {stageLabel(row.stage)}
        {row.opportunityValueUsd
          ? ` · ${formatUsd(row.opportunityValueUsd)}`
          : ""}
      </span>
    );
  }
  if (row.replied) return <span>Replied</span>;
  return <span>No reply yet</span>;
}

function OutcomeDialog({
  row,
  onClose,
}: {
  row: SendRow;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [replied, setReplied] = useState(Boolean(row.replied));
  const [meetingBooked, setMeetingBooked] = useState(Boolean(row.meetingBooked));
  const [meetingDate, setMeetingDate] = useState(row.meetingDate ?? "");
  const [value, setValue] = useState(
    row.opportunityValueUsd != null ? String(row.opportunityValueUsd) : "",
  );
  const [stage, setStage] = useState<OutcomeStage>(row.stage ?? "none");
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await logOutcome({
          giftSendId: row.id,
          replied,
          meetingBooked,
          meetingDate: meetingDate || null,
          opportunityValueUsd: value ? Number(value) : null,
          stage,
        });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        onClose();
      } catch {
        setError("Could not save outcome. Refresh the page and try again.");
      }
    });
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log outcome</DialogTitle>
          <DialogDescription>
            {row.giftName} to {row.recipientName} at {row.companyName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              className="size-3.5 accent-zinc-900"
              checked={replied}
              onChange={(e) => setReplied(e.target.checked)}
            />
            Replied
          </label>
          <label className="flex items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              className="size-3.5 accent-zinc-900"
              checked={meetingBooked}
              onChange={(e) => {
                setMeetingBooked(e.target.checked);
                if (e.target.checked && stage === "none") setStage("meeting_booked");
              }}
            />
            Meeting booked
          </label>
          <div className="space-y-1.5">
            <Label htmlFor="meetingDate">Meeting date</Label>
            <Input
              id="meetingDate"
              type="date"
              value={meetingDate}
              disabled={!meetingBooked}
              onChange={(e) => setMeetingDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="opp">Opportunity value (USD)</Label>
            <Input
              id="opp"
              inputMode="numeric"
              className="tabular-nums"
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="0"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="stage">Stage</Label>
            <select
              id="stage"
              className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-[13px]"
              value={stage}
              onChange={(e) => setStage(e.target.value as OutcomeStage)}
            >
              {OUTCOME_STAGES.map((s) => (
                <option key={s} value={s}>
                  {stageLabel(s)}
                </option>
              ))}
            </select>
          </div>
          {error ? <p className="text-[13px] text-red-700">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={pending}>
            Save outcome
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
