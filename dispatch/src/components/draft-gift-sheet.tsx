"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { submitGiftRequest } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { formatUsd } from "@/lib/format";
import { generateNote } from "@/lib/notes";
import { cn } from "@/lib/utils";
import type { Contact, GiftOption } from "@/lib/types";

export function DraftGiftSheet({
  companyId,
  companyName,
  industry,
  fundingEventId,
  round,
  amountUsd,
  leadInvestor,
  hqAddress,
  city,
  state,
  contacts,
  gifts,
}: {
  companyId: number;
  companyName: string;
  industry: string;
  fundingEventId: number;
  round: string;
  amountUsd: number;
  leadInvestor: string;
  hqAddress: string;
  city: string;
  state: string;
  contacts: Contact[];
  gifts: GiftOption[];
}) {
  const defaultContact =
    contacts.find((c) => c.isDecisionMaker) ?? contacts[0];
  const [open, setOpen] = useState(false);
  const [giftId, setGiftId] = useState(gifts[0]?.id ?? 0);
  const [contactId, setContactId] = useState(defaultContact?.id ?? 0);
  const [address, setAddress] = useState(`${hqAddress}, ${city}, ${state}`);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;
    setNote(
      generateNote(contact, { name: companyName, industry }, { round, amountUsd, leadInvestor }),
    );
  }, [open, contactId, contacts, companyName, industry, round, amountUsd, leadInvestor]);

  const selectedGift = useMemo(
    () => gifts.find((g) => g.id === giftId),
    [gifts, giftId],
  );

  function onSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await submitGiftRequest({
          contactId,
          companyId,
          giftOptionId: giftId,
          fundingEventId,
          note,
          shippingAddress: address,
        });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setOpen(false);
      } catch {
        setError("Could not submit. Refresh the page and try again.");
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button size="sm" />}>Draft a gift</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg"
        showCloseButton
      >
        <SheetHeader>
          <SheetTitle>Draft a gift</SheetTitle>
          <SheetDescription>
            {companyName} · request lands in the approval queue as pending.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4">
          <div>
            <Label className="mb-2 block text-[12px] uppercase tracking-wide text-zinc-500">
              Gift
            </Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {gifts.map((gift) => (
                <button
                  key={gift.id}
                  type="button"
                  onClick={() => setGiftId(gift.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left transition-colors",
                    giftId === gift.id
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-200 hover:border-zinc-300",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg leading-none">{gift.emoji}</span>
                    <span className="tabular-nums text-[12px] text-zinc-500">
                      {gift.leadTimeDays}d
                    </span>
                  </div>
                  <div className="mt-1.5 text-[13px] font-medium">{gift.name}</div>
                  <div className="tabular-nums text-[13px] text-zinc-600">
                    {formatUsd(gift.costUsd)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="recipient">Recipient</Label>
            <select
              id="recipient"
              className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-[13px]"
              value={contactId}
              onChange={(e) => setContactId(Number(e.target.value))}
            >
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.fullName} · {contact.title}
                  {contact.isDecisionMaker ? " (decision maker)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Shipping address</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">Personalized note</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
            />
            {selectedGift ? (
              <p className="text-[12px] text-zinc-500">
                {selectedGift.name} · {formatUsd(selectedGift.costUsd)} ·{" "}
                {selectedGift.leadTimeDays} day lead
              </p>
            ) : null}
          </div>
          {error ? <p className="text-[13px] text-red-700">{error}</p> : null}
        </div>
        <SheetFooter>
          <Button onClick={onSubmit} disabled={pending || !giftId || !contactId}>
            {pending ? "Submitting…" : "Submit for approval"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
