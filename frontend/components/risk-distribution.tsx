import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  analytics: number;
  marketing: number;
  essential: number;
  unknown: number;
  total: number;
  highRisk?: number;
};

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export default function RiskDistribution({
  analytics,
  marketing,
  essential,
  unknown,
  total,
  highRisk = 0,
}: Props) {
  const safeHighRisk = Math.min(highRisk, total);
  const nonHighRisk = Math.max(total - safeHighRisk, 0);

  const exposureRows = [
    { label: "High Risk", value: safeHighRisk, color: "bg-rose-500" },
    { label: "Other Cookies", value: nonHighRisk, color: "bg-cyan-400" },
  ];

  const categoryRows = [
    { label: "Essential", value: essential, color: "bg-cyan-400" },
    { label: "Analytics", value: analytics, color: "bg-indigo-400" },
    { label: "Marketing", value: marketing, color: "bg-sky-500" },
    { label: "Unknown", value: unknown, color: "bg-amber-400" },
  ];

  return (
    <Card className="dex-card rounded-3xl border-border/80 bg-transparent">
      <CardHeader className="pb-3">
        <div className="dex-label">Risk Distribution</div>
        <CardTitle className="dex-panel-title">Exposure Profile</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-2xl border border-border bg-slate-950/40 p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-slate-400">High-Risk Cookies</div>
              <div className="mt-1 text-3xl font-semibold tracking-tight text-rose-400 tabular-nums">
                {safeHighRisk}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Exposure
              </div>
              <div className="mt-1 text-lg font-medium text-slate-100 tabular-nums">
                {percent(safeHighRisk, total)}%
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {exposureRows.map((row) => (
              <div key={row.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{row.label}</span>
                  <span className="tabular-nums text-slate-400">
                    {row.value} / {percent(row.value, total)}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-900/80">
                  <div
                    className={`h-full rounded-full ${row.color}`}
                    style={{ width: `${percent(row.value, total)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 dex-label">Cookie Categories</div>
          <div className="space-y-4">
            {categoryRows.map((row) => (
              <div key={row.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{row.label}</span>
                  <span className="tabular-nums text-slate-400">
                    {row.value} / {percent(row.value, total)}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-900/80">
                  <div
                    className={`h-full rounded-full ${row.color}`}
                    style={{ width: `${percent(row.value, total)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categoryRows.map((row) => (
            <div
              key={row.label}
              className="rounded-2xl border border-border bg-slate-950/40 px-4 py-3"
            >
              <div className="dex-label">{row.label}</div>
              <div className="mt-1 text-sm font-semibold text-slate-100 tabular-nums">
                {row.value} cookies
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {percent(row.value, total)}% of total
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}