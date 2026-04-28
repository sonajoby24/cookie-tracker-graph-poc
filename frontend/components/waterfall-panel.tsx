import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WaterfallItem } from "@/lib/api";

type Props = {
  waterfall: WaterfallItem[];
};

export default function WaterfallPanel({ waterfall }: Props) {
  const max = Math.max(...waterfall.map((item) => item.durationMs), 1);

  return (
    <Card className="dex-card rounded-3xl border-border/80 bg-transparent">
      <CardHeader className="pb-3">
        <div className="dex-label">Performance Waterfall</div>
        <CardTitle className="dex-panel-title">Request Timing</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {waterfall.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-border bg-slate-950/40 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-100">
                  {item.label}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                  {item.type} · {item.risk}
                </div>
              </div>
              <div className="text-sm tabular-nums text-cyan-400">
                {item.durationMs}ms
              </div>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900/80">
              <div
                className={`h-full rounded-full ${
                  item.risk === "high"
                    ? "bg-rose-500"
                    : item.risk === "medium"
                      ? "bg-indigo-400"
                      : "bg-cyan-400"
                }`}
                style={{ width: `${(item.durationMs / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}