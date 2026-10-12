import { DraftGiftSheet } from "@/components/draft-gift-sheet";
import { SignalFilters } from "@/components/signal-filters";
import { formatCompactUsd, formatDate } from "@/lib/format";
import { listGiftOptions, listIndustries, getSignalFeed } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function SignalFeedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const round = typeof params.round === "string" ? params.round : undefined;
  const industry = typeof params.industry === "string" ? params.industry : undefined;
  const min =
    typeof params.min === "string" && params.min ? Number(params.min) : undefined;
  const hideGifted90 = params.hideGifted === "1";

  const signals = getSignalFeed({
    round,
    industry,
    minAmount: Number.isFinite(min) ? min : undefined,
    hideGifted90,
  });
  const gifts = listGiftOptions();
  const rounds = ["Seed", "Series A", "Series B", "Series C"];
  const industries = listIndustries();

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Signal feed</h1>
        <p className="text-sm text-zinc-600">
          Funding events at target accounts, newest first. Draft a gift from the
          trigger before the congratulations thread goes cold.
        </p>
      </header>

      <SignalFilters rounds={rounds} industries={industries} />

      {signals.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium">No signals match these filters.</p>
          <p className="mt-1 text-sm text-zinc-500">
            Clear a filter or turn off the 90-day gift hide to see more accounts.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {signals.map((signal) => (
            <article
              key={signal.id}
              className="rounded-lg border border-zinc-200 bg-white p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h2 className="text-[15px] font-semibold tracking-tight">
                      {signal.companyName}
                    </h2>
                    <span className="text-[13px] text-zinc-500">{signal.domain}</span>
                  </div>
                  <p className="text-sm text-zinc-800">
                    <span className="font-medium">{signal.round}</span>
                    <span className="tabular-nums">
                      {" "}
                      · {formatCompactUsd(signal.amountUsd)}
                    </span>
                    <span> · {formatDate(signal.announcedOn)}</span>
                    <span> · led by {signal.leadInvestor}</span>
                  </p>
                  <p className="text-[13px] text-zinc-500">
                    {signal.industry} ·{" "}
                    <span className="tabular-nums">
                      {signal.employeeCount.toLocaleString()}
                    </span>{" "}
                    employees · {signal.city}, {signal.state}
                  </p>
                  <ul className="flex flex-wrap gap-1.5 pt-1">
                    {signal.contacts.map((contact) => (
                      <li
                        key={contact.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2 py-0.5 text-[12px] text-zinc-700"
                      >
                        <span className="font-medium">{contact.fullName}</span>
                        <span className="text-zinc-500">{contact.title}</span>
                        {contact.isDecisionMaker ? (
                          <span className="rounded-full bg-zinc-900 px-1.5 py-px text-[10px] font-semibold text-white">
                            DM
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="shrink-0">
                  <DraftGiftSheet
                    companyId={signal.companyId}
                    companyName={signal.companyName}
                    industry={signal.industry}
                    fundingEventId={signal.id}
                    round={signal.round}
                    amountUsd={signal.amountUsd}
                    leadInvestor={signal.leadInvestor}
                    hqAddress={signal.hqAddress}
                    city={signal.city}
                    state={signal.state}
                    contacts={signal.contacts}
                    gifts={gifts}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
