"use client";

import { useState, useTransition } from "react";
import { approveGift, rejectGift } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatUsd } from "@/lib/format";

export function ApprovalActions({
  id,
  giftCost,
  overBudget,
}: {
  id: number;
  giftCost: number;
  overBudget: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmOver, setConfirmOver] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onApprove() {
    setError(null);
    if (overBudget && !confirmOver) {
      setConfirmOver(true);
      return;
    }
    startTransition(async () => {
      try {
        const result = await approveGift(id, confirmOver || !overBudget);
        if (!result.ok) {
          if (result.needsConfirm) {
            setConfirmOver(true);
            return;
          }
          setError(result.error);
        }
      } catch {
        setError("Could not approve. Refresh the page and try again.");
      }
    });
  }

  function onReject() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await rejectGift(id, reason);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setRejectOpen(false);
      } catch {
        setError("Could not reject. Refresh the page and try again.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          variant={confirmOver ? "destructive" : "default"}
          size="sm"
          onClick={onApprove}
          disabled={pending}
        >
          {confirmOver ? "Approve over budget" : "Approve"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRejectOpen(true)}
          disabled={pending}
        >
          Reject
        </Button>
      </div>
      {overBudget ? (
        <p className="max-w-xs text-right text-[12px] text-amber-800">
          {confirmOver
            ? `Second click confirms. This ${formatUsd(giftCost)} gift puts the month over budget.`
            : `Approving this ${formatUsd(giftCost)} gift would exceed the monthly budget. Click again to confirm.`}
        </p>
      ) : null}
      {error ? <p className="text-[12px] text-red-700">{error}</p> : null}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject gift</DialogTitle>
            <DialogDescription>
              The reason is stored on the send so the requester can see why it was stopped.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Why are you rejecting this?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onReject}
              disabled={pending || !reason.trim()}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
