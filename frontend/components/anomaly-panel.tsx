import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnomalyItem } from "@/lib/api";

type Props = {
  anomalies: AnomalyItem[];
};

const severityClass: Record<AnomalyItem["severity"], string> = {
  Low: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  Medium: "border-indigo-400/20 bg-indigo-400/10 text-indigo-300",
  High: "border-rose-400/20 bg-rose-400/10 text-rose-300",
};

export default function AnomalyPanel({ anomalies }: Props) {
  return (
    <Card className="dex-card rounded-3xl border-border/80 bg-transparent">
      <CardHeader className="pb-3">
        <div className="dex-label">Anomaly Detection</div>
        <CardTitle className="dex-panel-title">Flagged Exposure Patterns</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {anomalies.length === 0 ? (
          <div className="rounded-2xl border border-border bg-slate-950/40 px-4 py-3 text-sm text-slate-400">
            No anomalies detected.
          </div>
        ) : (
          anomalies.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-slate-950/40 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {item.name}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                    Affected Count: {item.affectedCount}
                  </div>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${severityClass[item.severity]}`}
                >
                  {item.severity}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}