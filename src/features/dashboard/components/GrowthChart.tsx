import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchMemberGrowth, type MemberGrowthPoint } from "@/lib/supabase/members";

export function GrowthChart() {
  
  const [growthData, setGrowthData] = useState<MemberGrowthPoint[]>([]);
  const [growthLoading, setGrowthLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchMemberGrowth(6)
      .then((data) => {
        if (!cancelled) setGrowthData(data);
      })
      .catch((err) => console.error("Failed to load member growth:", err))
      .finally(() => {
        if (!cancelled) setGrowthLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-md border border-field-border bg-white p-5 lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base italic text-text-primary">Growth, last 6 months</h2>
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" /> Members
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-text-primary" /> Subscribers
          </span>
        </div>
      </div>
      <div className="h-56 w-full">
        {growthLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-text-muted">
            Loading growth data…
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="membersFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F7CF13" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#F7CF13" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="subsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#053261" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#053261" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e8eef7" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#7a9cc4" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#7a9cc4" }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #c8d2e0", fontSize: 12 }} />
            <Area type="monotone" dataKey="members" stroke="#FFA000" strokeWidth={2} fill="url(#membersFill)" />
            <Area type="monotone" dataKey="subscribers" stroke="#053261" strokeWidth={2} fill="url(#subsFill)" />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}