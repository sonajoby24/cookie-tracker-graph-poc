import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SignalChainStep } from "@/lib/api";

type Props = {
  steps: SignalChainStep[];
};

export default function SignalChainPanel({ steps }: Props) {
  return (
    <Card className="dex-card rounded-3xl border-border/80 bg-transparent">
      <CardHeader className="pb-3">
        <div className="dex-label">Cookie Signal Chain</div>
        <CardTitle className="dex-panel-title">Event Flow</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {steps.length === 0 ? (
          <div className="rounded-2xl border border-border bg-slate-950/40 px-4 py-3 text-sm text-slate-400">
            No signal chain steps available.
          </div>
        ) : (
          steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-start gap-3 rounded-2xl border border-border bg-slate-950/40 px-4 py-3"
            >
              <div
                className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                  step.state === "done"
                    ? "bg-cyan-400 text-slate-950"
                    : step.state === "current"
                      ? "bg-indigo-400 text-slate-950"
                      : "bg-slate-800 text-slate-400"
                }`}
              >
                {index + 1}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-100">
                  {step.label}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                  {step.state}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}