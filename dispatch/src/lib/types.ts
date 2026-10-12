export const GIFT_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "shipped",
  "delivered",
] as const;

export type GiftStatus = (typeof GIFT_STATUSES)[number];

export const OUTCOME_STAGES = [
  "none",
  "meeting_booked",
  "qualified",
  "closed_won",
  "closed_lost",
] as const;

export type OutcomeStage = (typeof OUTCOME_STAGES)[number];

export const ROUNDS = ["Seed", "Series A", "Series B", "Series C"] as const;
export type Round = (typeof ROUNDS)[number];

export const INDUSTRIES = [
  "fintech",
  "dev tools",
  "ecommerce infrastructure",
  "creator tools",
  "logistics",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export type Company = {
  id: number;
  name: string;
  domain: string;
  industry: string;
  hqAddress: string;
  city: string;
  state: string;
  employeeCount: number;
  mrrBand: string;
};

export type FundingEvent = {
  id: number;
  companyId: number;
  round: string;
  amountUsd: number;
  announcedOn: string;
  leadInvestor: string;
  sourceUrl: string;
};

export type Contact = {
  id: number;
  companyId: number;
  fullName: string;
  title: string;
  linkedinUrl: string;
  email: string;
  isDecisionMaker: number;
};

export type GiftOption = {
  id: number;
  name: string;
  costUsd: number;
  description: string;
  leadTimeDays: number;
  emoji: string;
};

export type GiftSend = {
  id: number;
  contactId: number;
  companyId: number;
  giftOptionId: number;
  fundingEventId: number;
  status: GiftStatus;
  note: string;
  requestedBy: string;
  requestedAt: string;
  decidedBy: string | null;
  decidedAt: string | null;
  rejectionReason: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  shippingAddress: string;
};

export type Outcome = {
  id: number;
  giftSendId: number;
  replied: number;
  repliedAt: string | null;
  meetingBooked: number;
  meetingDate: string | null;
  opportunityValueUsd: number | null;
  stage: OutcomeStage;
};

export type Budget = {
  id: number;
  month: string;
  allocatedUsd: number;
};

export type SignalCard = FundingEvent & {
  companyName: string;
  domain: string;
  industry: string;
  hqAddress: string;
  city: string;
  state: string;
  employeeCount: number;
  mrrBand: string;
  contacts: Contact[];
};

export type ApprovalRow = GiftSend & {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  giftName: string;
  giftCost: number;
  giftEmoji: string;
  round: string;
  amountUsd: number;
  leadInvestor: string;
  announcedOn: string;
};

export type SendRow = GiftSend & {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  giftName: string;
  giftCost: number;
  giftEmoji: string;
  replied: number | null;
  meetingBooked: number | null;
  meetingDate: string | null;
  opportunityValueUsd: number | null;
  stage: OutcomeStage | null;
};

export type BudgetSnapshot = {
  month: string;
  allocatedUsd: number;
  committedUsd: number;
  spentUsd: number;
  remainingUsd: number;
};

export type ImpactStats = {
  giftsSent: number;
  totalSpend: number;
  replyRate: number | null;
  meetingsBooked: number;
  pipelineCreated: number;
  costPerMeeting: number | null;
};

export type MonthlyImpact = {
  month: string;
  spend: number;
  pipeline: number;
};

export type GiftTypeImpact = {
  giftOptionId: number;
  name: string;
  emoji: string;
  delivered: number;
  replied: number;
  meetings: number;
  replyRate: number | null;
  meetingRate: number | null;
};
