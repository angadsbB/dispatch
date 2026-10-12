import { AppShell } from "@/components/app-shell";
import { pendingCount } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell pendingCount={pendingCount()}>{children}</AppShell>;
}
