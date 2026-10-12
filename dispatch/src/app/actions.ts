"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import {
  getCompany,
  getContact,
  getFundingEvent,
  getGiftOption,
  wouldExceedBudget,
} from "@/lib/queries";

const ACTOR = "Angad Singh";

function asError(error: unknown): { ok: false; error: string } {
  const message = error instanceof Error ? error.message : "Something went wrong.";
  console.error(error);
  return { ok: false, error: message };
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/approvals");
  revalidatePath("/sends");
  revalidatePath("/impact");
}

export async function submitGiftRequest(input: {
  contactId: number;
  companyId: number;
  giftOptionId: number;
  fundingEventId: number;
  note: string;
  shippingAddress: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const contact = getContact(input.contactId);
  const company = getCompany(input.companyId);
  const gift = getGiftOption(input.giftOptionId);
  const event = getFundingEvent(input.fundingEventId);
  if (!contact || !company || !gift || !event) {
    return { ok: false, error: "Missing recipient, gift, or funding event." };
  }
  if (contact.companyId !== company.id || event.companyId !== company.id) {
    return { ok: false, error: "Recipient and trigger must belong to the same company." };
  }
  if (!input.note.trim() || !input.shippingAddress.trim()) {
    return { ok: false, error: "Note and shipping address are required." };
  }

  try {
    getDb()
      .prepare(
        `
        INSERT INTO gift_sends (
          contactId, companyId, giftOptionId, fundingEventId, status, note,
          requestedBy, requestedAt, shippingAddress
        ) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?)
      `,
      )
      .run(
        input.contactId,
        input.companyId,
        input.giftOptionId,
        input.fundingEventId,
        input.note.trim(),
        ACTOR,
        new Date().toISOString(),
        input.shippingAddress.trim(),
      );
  } catch (error) {
    return asError(error);
  }

  revalidateAll();
  return { ok: true };
}

export async function approveGift(
  id: number,
  confirmedOverBudget = false,
): Promise<{ ok: true } | { ok: false; error: string; needsConfirm?: boolean; giftCost?: number }> {
  const db = getDb();
  const row = db
    .prepare(
      `
      SELECT gs.id, gs.status, g.costUsd
      FROM gift_sends gs
      JOIN gift_options g ON g.id = gs.giftOptionId
      WHERE gs.id = ?
    `,
    )
    .get(id) as { id: number; status: string; costUsd: number } | undefined;

  if (!row || row.status !== "pending") {
    return { ok: false, error: "This request is no longer pending." };
  }

  if (wouldExceedBudget(row.costUsd) && !confirmedOverBudget) {
    return { ok: false, needsConfirm: true, giftCost: row.costUsd, error: "Over budget" };
  }

  try {
    db.prepare(
      `
      UPDATE gift_sends
      SET status = 'approved', decidedBy = ?, decidedAt = ?, rejectionReason = NULL
      WHERE id = ? AND status = 'pending'
    `,
    ).run(ACTOR, new Date().toISOString(), id);
  } catch (error) {
    return asError(error);
  }

  revalidateAll();
  return { ok: true };
}

export async function rejectGift(
  id: number,
  reason: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!reason.trim()) return { ok: false, error: "A rejection reason is required." };
  const db = getDb();
  const row = db.prepare("SELECT status FROM gift_sends WHERE id = ?").get(id) as
    | { status: string }
    | undefined;
  if (!row || row.status !== "pending") {
    return { ok: false, error: "This request is no longer pending." };
  }
  try {
    db.prepare(
      `
      UPDATE gift_sends
      SET status = 'rejected', decidedBy = ?, decidedAt = ?, rejectionReason = ?
      WHERE id = ? AND status = 'pending'
    `,
    ).run(ACTOR, new Date().toISOString(), reason.trim(), id);
  } catch (error) {
    return asError(error);
  }
  revalidateAll();
  return { ok: true };
}

export async function markShipped(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = getDb();
  const row = db.prepare("SELECT status FROM gift_sends WHERE id = ?").get(id) as
    | { status: string }
    | undefined;
  if (!row || row.status !== "approved") {
    return { ok: false, error: "Only approved gifts can be marked shipped." };
  }
  const tracking = `1Z999AA10${String(Math.floor(100000000 + Math.random() * 900000000))}`;
  try {
    db.prepare(
      `
      UPDATE gift_sends
      SET status = 'shipped', trackingNumber = ?, shippedAt = ?
      WHERE id = ?
    `,
    ).run(tracking, new Date().toISOString(), id);
  } catch (error) {
    return asError(error);
  }
  revalidateAll();
  return { ok: true };
}

export async function markDelivered(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = getDb();
  const row = db.prepare("SELECT status FROM gift_sends WHERE id = ?").get(id) as
    | { status: string }
    | undefined;
  if (!row || row.status !== "shipped") {
    return { ok: false, error: "Only shipped gifts can be marked delivered." };
  }
  try {
    db.prepare(
      `
      UPDATE gift_sends
      SET status = 'delivered', deliveredAt = ?
      WHERE id = ?
    `,
    ).run(new Date().toISOString(), id);
  } catch (error) {
    return asError(error);
  }
  revalidateAll();
  return { ok: true };
}

export async function logOutcome(input: {
  giftSendId: number;
  replied: boolean;
  meetingBooked: boolean;
  meetingDate: string | null;
  opportunityValueUsd: number | null;
  stage: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = getDb();
  const row = db.prepare("SELECT status FROM gift_sends WHERE id = ?").get(input.giftSendId) as
    | { status: string }
    | undefined;
  if (!row || row.status !== "delivered") {
    return { ok: false, error: "Outcomes can only be logged on delivered gifts." };
  }

  const now = new Date().toISOString();
  const repliedAt = input.replied ? now : null;
  const meetingDate = input.meetingBooked ? input.meetingDate : null;
  const existing = db.prepare("SELECT id FROM outcomes WHERE giftSendId = ?").get(input.giftSendId) as
    | { id: number }
    | undefined;

  try {
    if (existing) {
      db.prepare(
        `
        UPDATE outcomes
        SET replied = ?, repliedAt = ?, meetingBooked = ?, meetingDate = ?,
            opportunityValueUsd = ?, stage = ?
        WHERE giftSendId = ?
      `,
      ).run(
        input.replied ? 1 : 0,
        repliedAt,
        input.meetingBooked ? 1 : 0,
        meetingDate,
        input.opportunityValueUsd,
        input.stage,
        input.giftSendId,
      );
    } else {
      db.prepare(
        `
        INSERT INTO outcomes (giftSendId, replied, repliedAt, meetingBooked, meetingDate, opportunityValueUsd, stage)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      ).run(
        input.giftSendId,
        input.replied ? 1 : 0,
        repliedAt,
        input.meetingBooked ? 1 : 0,
        meetingDate,
        input.opportunityValueUsd,
        input.stage,
      );
    }
  } catch (error) {
    return asError(error);
  }

  revalidateAll();
  return { ok: true };
}
