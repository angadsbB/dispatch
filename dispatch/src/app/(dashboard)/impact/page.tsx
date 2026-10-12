import { MeetingsByGiftChart, SpendPipelineChart } from "@/components/impact-charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPct, formatUsd } from "@/lib/format";
import { getGiftTypeImpact, getImpactStats, getMonthlyImpact } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function ImpactPage() {
  const stats = getImpactStats();
  const monthly = getMonthlyImpact();
  const byGift = getGiftTypeImpact();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Impact</h1>
        <p className="text-sm text-zinc-600">
          The page that defends the budget. Reply rate, meetings, and which gift is
          actually worth repeating.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Gifts sent" value={String(stats.giftsSent)} />
        <StatCard label="Total spend" value={formatUsd(stats.totalSpend)} />
        <StatCard label="Reply rate" value={formatPct(stats.replyRate)} />
        <StatCard label="Meetings booked" value={String(stats.meetingsBooked)} />
        <StatCard label="Pipeline created" value={formatUsd(stats.pipelineCreated)} />
        <StatCard
          label="Cost per meeting"
          value={
            stats.costPerMeeting == null ? "—" : formatUsd(Math.round(stats.costPerMeeting))
          }
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold">Spend vs pipeline</h2>
          <p className="mb-3 text-[12px] text-zinc-500">Grouped by month of delivery / meeting.</p>
          <SpendPipelineChart data={monthly} />
        </section>
        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold">Meetings by gift type</h2>
          <p className="mb-3 text-[12px] text-zinc-500">
            Cookie box should be the obvious repeat. Steak is expensive noise.
          </p>
          <MeetingsByGiftChart data={byGift} />
        </section>
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold">Reply and meeting rate by gift</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gift</TableHead>
              <TableHead className="text-right">Delivered</TableHead>
              <TableHead className="text-right">Reply rate</TableHead>
              <TableHead className="text-right">Meeting rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {byGift.map((row) => (
              <TableRow key={row.giftOptionId}>
                <TableCell>
                  {row.emoji} {row.name}
                </TableCell>
                <TableCell className="text-right tabular-nums">{row.delivered}</TableCell>
                <TableCell className="text-right tabular-nums">{formatPct(row.replyRate)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatPct(row.meetingRate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 font-mono text-xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
    </div>
  );
}
