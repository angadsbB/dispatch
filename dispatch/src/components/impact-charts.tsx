"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactUsd, formatUsd, monthLabel } from "@/lib/format";
import type { GiftTypeImpact, MonthlyImpact } from "@/lib/types";

export function SpendPipelineChart({ data }: { data: MonthlyImpact[] }) {
  const chartData = data.map((row) => ({
    month: monthLabel(row.month),
    Spend: row.spend,
    Pipeline: row.pipeline,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#52525b" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 12, fill: "#52525b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCompactUsd(Number(v))}
          />
          <Tooltip
            formatter={(value, name) => [formatUsd(Number(value)), String(name)]}
            contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#e4e4e7" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Spend" fill="#18181b" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Pipeline" fill="#6366f1" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MeetingsByGiftChart({ data }: { data: GiftTypeImpact[] }) {
  const chartData = data.map((row) => ({
    name: `${row.emoji} ${row.name}`,
    Meetings: row.meetings,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#52525b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tick={{ fontSize: 12, fill: "#52525b" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [Number(value), "Meetings"]}
            contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#e4e4e7" }}
          />
          <Bar dataKey="Meetings" fill="#6366f1" radius={[0, 3, 3, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
