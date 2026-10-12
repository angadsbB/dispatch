import { getDb } from "./db";
import { currentMonthKey } from "./format";
import type {
  ApprovalRow,
  BudgetSnapshot,
  Company,
  Contact,
  FundingEvent,
  GiftOption,
  GiftStatus,
  GiftTypeImpact,
  ImpactStats,
  MonthlyImpact,
  SendRow,
  SignalCard,
} from "./types";

export type SignalFilters = {
  round?: string;
  minAmount?: number;
  industry?: string;
  hideGifted90?: boolean;
};

export function listGiftOptions(): GiftOption[] {
  return getDb().prepare("SELECT * FROM gift_options ORDER BY costUsd ASC").all() as GiftOption[];
}

export function listIndustries(): string[] {
  const rows = getDb()
    .prepare("SELECT DISTINCT industry FROM companies ORDER BY industry")
    .all() as { industry: string }[];
  return rows.map((r) => r.industry);
}

export function listRounds(): string[] {
  const rows = getDb()
    .prepare("SELECT DISTINCT round FROM funding_events ORDER BY announcedOn DESC")
    .all() as { round: string }[];
  return [...new Set(rows.map((r) => r.round))];
}

export function getSignalFeed(filters: SignalFilters): SignalCard[] {
  const db = getDb();
  const where: string[] = [];
  const params: Record<string, string | number> = {};

  if (filters.round) {
    where.push("e.round = @round");
    params.round = filters.round;
  }
  if (filters.minAmount) {
    where.push("e.amountUsd >= @minAmount");
    params.minAmount = filters.minAmount;
  }
  if (filters.industry) {
    where.push("c.industry = @industry");
    params.industry = filters.industry;
  }
  if (filters.hideGifted90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    where.push(`c.id NOT IN (
      SELECT DISTINCT gs.companyId FROM gift_sends gs
      WHERE gs.status = 'delivered'
        AND gs.deliveredAt IS NOT NULL
        AND gs.deliveredAt >= @giftedCutoff
    )`);
    params.giftedCutoff = cutoff.toISOString();
  }

  const sql = `
    SELECT
      e.*,
      c.name AS companyName,
      c.domain,
      c.industry,
      c.hqAddress,
      c.city,
      c.state,
      c.employeeCount,
      c.mrrBand
    FROM funding_events e
    JOIN companies c ON c.id = e.companyId
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY e.announcedOn DESC, e.id DESC
  `;

  const events = db.prepare(sql).all(params) as Omit<SignalCard, "contacts">[];
  const contacts = db.prepare("SELECT * FROM contacts ORDER BY isDecisionMaker DESC, fullName").all() as Contact[];
  const byCompany = new Map<number, Contact[]>();
  for (const contact of contacts) {
    const list = byCompany.get(contact.companyId) ?? [];
    list.push(contact);
    byCompany.set(contact.companyId, list);
  }

  return events.map((event) => ({
    ...event,
    contacts: byCompany.get(event.companyId) ?? [],
  }));
}

export function getCompany(id: number): Company | undefined {
  return getDb().prepare("SELECT * FROM companies WHERE id = ?").get(id) as Company | undefined;
}

export function getFundingEvent(id: number): FundingEvent | undefined {
  return getDb().prepare("SELECT * FROM funding_events WHERE id = ?").get(id) as FundingEvent | undefined;
}

export function getContact(id: number): Contact | undefined {
  return getDb().prepare("SELECT * FROM contacts WHERE id = ?").get(id) as Contact | undefined;
}

export function getGiftOption(id: number): GiftOption | undefined {
  return getDb().prepare("SELECT * FROM gift_options WHERE id = ?").get(id) as GiftOption | undefined;
}

export function pendingCount(): number {
  const row = getDb().prepare("SELECT COUNT(*) AS c FROM gift_sends WHERE status = 'pending'").get() as { c: number };
  return row.c;
}

export function listApprovals(): ApprovalRow[] {
  return getDb()
    .prepare(
      `
      SELECT
        gs.*,
        ct.fullName AS recipientName,
        ct.title AS recipientTitle,
        c.name AS companyName,
        g.name AS giftName,
        g.costUsd AS giftCost,
        g.emoji AS giftEmoji,
        e.round,
        e.amountUsd,
        e.leadInvestor,
        e.announcedOn
      FROM gift_sends gs
      JOIN contacts ct ON ct.id = gs.contactId
      JOIN companies c ON c.id = gs.companyId
      JOIN gift_options g ON g.id = gs.giftOptionId
      JOIN funding_events e ON e.id = gs.fundingEventId
      WHERE gs.status = 'pending'
      ORDER BY gs.requestedAt DESC
    `,
    )
    .all() as ApprovalRow[];
}

export function getBudgetSnapshot(month = currentMonthKey()): BudgetSnapshot {
  const db = getDb();
  const budget = db.prepare("SELECT * FROM budgets WHERE month = ?").get(month) as
    | { allocatedUsd: number }
    | undefined;
  const allocatedUsd = budget?.allocatedUsd ?? 0;

  const spent = db
    .prepare(
      `
      SELECT COALESCE(SUM(g.costUsd), 0) AS total
      FROM gift_sends gs
      JOIN gift_options g ON g.id = gs.giftOptionId
      WHERE gs.status = 'delivered'
        AND gs.deliveredAt IS NOT NULL
        AND substr(gs.deliveredAt, 1, 7) = ?
    `,
    )
    .get(month) as { total: number };

  const committed = db
    .prepare(
      `
      SELECT COALESCE(SUM(g.costUsd), 0) AS total
      FROM gift_sends gs
      JOIN gift_options g ON g.id = gs.giftOptionId
      WHERE gs.status IN ('approved', 'shipped')
        AND gs.decidedAt IS NOT NULL
        AND substr(gs.decidedAt, 1, 7) = ?
    `,
    )
    .get(month) as { total: number };

  const committedUsd = committed.total;
  const spentUsd = spent.total;
  return {
    month,
    allocatedUsd,
    committedUsd,
    spentUsd,
    remainingUsd: allocatedUsd - committedUsd - spentUsd,
  };
}

export function wouldExceedBudget(giftCostUsd: number, month = currentMonthKey()): boolean {
  const snap = getBudgetSnapshot(month);
  return snap.committedUsd + snap.spentUsd + giftCostUsd > snap.allocatedUsd;
}

export type SendFilters = {
  status?: GiftStatus | "all";
  sort?: "requestedAt" | "cost" | "status" | "company";
  dir?: "asc" | "desc";
};

export function listSends(filters: SendFilters = {}): SendRow[] {
  const sortMap = {
    requestedAt: "gs.requestedAt",
    cost: "g.costUsd",
    status: "gs.status",
    company: "c.name",
  } as const;
  const sortCol = sortMap[filters.sort ?? "requestedAt"] ?? "gs.requestedAt";
  const dir = filters.dir === "asc" ? "ASC" : "DESC";
  const where = filters.status && filters.status !== "all" ? "WHERE gs.status = @status" : "";

  return getDb()
    .prepare(
      `
      SELECT
        gs.*,
        ct.fullName AS recipientName,
        ct.title AS recipientTitle,
        c.name AS companyName,
        g.name AS giftName,
        g.costUsd AS giftCost,
        g.emoji AS giftEmoji,
        o.replied,
        o.meetingBooked,
        o.meetingDate,
        o.opportunityValueUsd,
        o.stage
      FROM gift_sends gs
      JOIN contacts ct ON ct.id = gs.contactId
      JOIN companies c ON c.id = gs.companyId
      JOIN gift_options g ON g.id = gs.giftOptionId
      LEFT JOIN outcomes o ON o.giftSendId = gs.id
      ${where}
      ORDER BY ${sortCol} ${dir}, gs.id DESC
    `,
    )
    .all(filters.status && filters.status !== "all" ? { status: filters.status } : {}) as SendRow[];
}

export function getImpactStats(): ImpactStats {
  const db = getDb();
  const delivered = db
    .prepare(
      `
      SELECT
        COUNT(*) AS giftsSent,
        COALESCE(SUM(g.costUsd), 0) AS totalSpend
      FROM gift_sends gs
      JOIN gift_options g ON g.id = gs.giftOptionId
      WHERE gs.status = 'delivered'
    `,
    )
    .get() as { giftsSent: number; totalSpend: number };

  const outcomes = db
    .prepare(
      `
      SELECT
        SUM(CASE WHEN o.replied = 1 THEN 1 ELSE 0 END) AS replied,
        SUM(CASE WHEN o.meetingBooked = 1 THEN 1 ELSE 0 END) AS meetings,
        COALESCE(SUM(o.opportunityValueUsd), 0) AS pipeline
      FROM outcomes o
      JOIN gift_sends gs ON gs.id = o.giftSendId
      WHERE gs.status = 'delivered'
    `,
    )
    .get() as { replied: number; meetings: number; pipeline: number };

  const meetingsBooked = outcomes.meetings ?? 0;
  return {
    giftsSent: delivered.giftsSent,
    totalSpend: delivered.totalSpend,
    replyRate: delivered.giftsSent ? (outcomes.replied ?? 0) / delivered.giftsSent : null,
    meetingsBooked,
    pipelineCreated: outcomes.pipeline ?? 0,
    costPerMeeting: meetingsBooked ? delivered.totalSpend / meetingsBooked : null,
  };
}

export function getMonthlyImpact(): MonthlyImpact[] {
  const rows = getDb()
    .prepare(
      `
      SELECT month FROM budgets ORDER BY month
    `,
    )
    .all() as { month: string }[];

  return rows.map(({ month }) => {
    const spend = getDb()
      .prepare(
        `
        SELECT COALESCE(SUM(g.costUsd), 0) AS total
        FROM gift_sends gs
        JOIN gift_options g ON g.id = gs.giftOptionId
        WHERE gs.status = 'delivered' AND substr(gs.deliveredAt, 1, 7) = ?
      `,
      )
      .get(month) as { total: number };
    const pipeline = getDb()
      .prepare(
        `
        SELECT COALESCE(SUM(o.opportunityValueUsd), 0) AS total
        FROM outcomes o
        JOIN gift_sends gs ON gs.id = o.giftSendId
        WHERE gs.status = 'delivered'
          AND o.meetingDate IS NOT NULL
          AND substr(o.meetingDate, 1, 7) = ?
      `,
      )
      .get(month) as { total: number };
    return { month, spend: spend.total, pipeline: pipeline.total };
  });
}

export function getGiftTypeImpact(): GiftTypeImpact[] {
  return getDb()
    .prepare(
      `
      SELECT
        g.id AS giftOptionId,
        g.name,
        g.emoji,
        COUNT(gs.id) AS delivered,
        SUM(CASE WHEN o.replied = 1 THEN 1 ELSE 0 END) AS replied,
        SUM(CASE WHEN o.meetingBooked = 1 THEN 1 ELSE 0 END) AS meetings
      FROM gift_options g
      LEFT JOIN gift_sends gs ON gs.giftOptionId = g.id AND gs.status = 'delivered'
      LEFT JOIN outcomes o ON o.giftSendId = gs.id
      GROUP BY g.id
      ORDER BY meetings DESC, delivered DESC, g.costUsd ASC
    `,
    )
    .all()
    .map((row) => {
      const r = row as {
        giftOptionId: number;
        name: string;
        emoji: string;
        delivered: number;
        replied: number | null;
        meetings: number | null;
      };
      const delivered = r.delivered ?? 0;
      const replied = r.replied ?? 0;
      const meetings = r.meetings ?? 0;
      return {
        giftOptionId: r.giftOptionId,
        name: r.name,
        emoji: r.emoji,
        delivered,
        replied,
        meetings,
        replyRate: delivered ? replied / delivered : null,
        meetingRate: delivered ? meetings / delivered : null,
      };
    });
}
