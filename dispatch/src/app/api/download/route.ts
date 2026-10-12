import { execFileSync } from "node:child_process";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const zip = execFileSync("git", ["archive", "--format=zip", "--prefix=dispatch/", "HEAD"], {
    cwd: process.cwd(),
    maxBuffer: 20_000_000,
  });

  return new NextResponse(zip, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="dispatch-github.zip"',
      "Cache-Control": "no-store",
    },
  });
}
