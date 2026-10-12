import { SendsTable } from "@/components/sends-table";
import { listSends } from "@/lib/queries";
import type { GiftStatus } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function SendsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "all";
  const sort =
    params.sort === "cost" || params.sort === "status" || params.sort === "company"
      ? params.sort
      : "requestedAt";
  const dir = params.dir === "asc" ? "asc" : "desc";

  const rows = listSends({
    status: status as GiftStatus | "all",
    sort,
    dir,
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Sends</h1>
        <p className="text-sm text-zinc-600">
          Every gift request. Ship it, confirm delivery, then log whether it turned
          into a reply or a meeting.
        </p>
      </header>
      <SendsTable rows={rows} />
    </div>
  );
}
