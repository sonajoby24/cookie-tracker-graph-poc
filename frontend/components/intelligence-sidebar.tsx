import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Database, Download, ShieldAlert } from "lucide-react";

type Props = {
  title: string;
  site: string;
  sourceStatus: "Live" | "Synthetic" | "Sample";
  totalCookies: number;
  uniqueDomains: number;
  thirdPartyCookies: number;
  trackingVendors: number;
  compositeRisk: number;
  confidence: string;
  updatedAt: string;
  whyThisMatters: string;
  whoControlsTheRail: string;
  downloadCsv: string;
  downloadJson: string;
};

export default function IntelligenceSidebar({
  title,
  site,
  sourceStatus,
  totalCookies,
  uniqueDomains,
  thirdPartyCookies,
  trackingVendors,
  compositeRisk,
  confidence,
  updatedAt,
  whyThisMatters,
  whoControlsTheRail,
  downloadCsv,
  downloadJson,
}: Props) {
  const isLive = sourceStatus === "Live";

  return (
    <aside className="space-y-6 xl:h-full">
      <Card className="dex-card rounded-3xl border-border/80 bg-transparent">
        <CardContent className="p-6">
          <div className="dex-label">Intelligence Sidebar</div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-100">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            High-signal tracking intelligence across site, vendor, domain,
            cookie, and category relationships.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-500">
            Target Site: {site}
          </p>
        </CardContent>
      </Card>

      <Card className="dex-card dex-glow rounded-3xl border-border/80 bg-transparent">
        <CardContent className="p-6">
          <div className="dex-label">Cookie Intelligence Signal</div>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-slate-400">Composite Privacy Risk</div>
              <div className="mt-1 text-5xl font-semibold tracking-tight text-cyan-400 tabular-nums">
                {compositeRisk}/100
              </div>
              <p className="mt-2 text-sm text-slate-400">
                3 anomaly flags · moderate exposure
              </p>
            </div>
            <ShieldAlert className="h-8 w-8 text-cyan-400/80" />
          </div>
        </CardContent>
      </Card>

      <Card className="dex-card rounded-3xl border-border/80 bg-transparent">
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <div className="dex-label">Scope Stats</div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Cookies</span>
                <span className="tabular-nums text-slate-100">{totalCookies}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Third-Party %</span>
                <span className="tabular-nums text-slate-100">
                  {totalCookies
                    ? Math.round((thirdPartyCookies / totalCookies) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 sm:pt-0">
            <div className="invisible dex-label sm:visible">Stats</div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Vendors</span>
                <span className="tabular-nums text-slate-100">
                  {trackingVendors}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Domains</span>
                <span className="tabular-nums text-slate-100">
                  {uniqueDomains}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dex-card rounded-3xl border-border/80 bg-transparent">
        <CardContent className="p-6">
          <div className="dex-label">Why This Matters</div>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {whyThisMatters}
          </p>
        </CardContent>
      </Card>

      <Card className="dex-card rounded-3xl border-border/80 bg-transparent">
        <CardContent className="p-6">
          <div className="dex-label">Who Controls the Rail</div>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {whoControlsTheRail}
          </p>
        </CardContent>
      </Card>

      <Card className="dex-card rounded-3xl border-border/80 bg-transparent">
        <CardContent className="p-6">
          <div className="dex-label">Data Source Status</div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${
                isLive ? "bg-cyan-400" : "bg-indigo-400"
              }`}
            />
            <Badge
              variant="secondary"
              className="rounded-full border border-border bg-slate-900/70 px-3 py-1 text-slate-200"
            >
              {sourceStatus}
            </Badge>
            <Badge
              variant="secondary"
              className="rounded-full border border-border bg-slate-900/70 px-3 py-1 text-slate-200"
            >
              Confidence: {confidence}
            </Badge>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-slate-950/50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-cyan-400" />
              <div className="space-y-1 text-sm text-slate-400">
                <div>{updatedAt}</div>
                <div>
                  Live when crawl output exists; synthetic fallback when scan
                  data is unavailable or empty.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button
              asChild
              className="h-11 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300"
            >
              <a
                href={downloadCsv}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl border-border bg-transparent text-slate-100 hover:bg-slate-900"
            >
              <a
                href={downloadJson}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Database className="mr-2 h-4 w-4" />
                Download JSON
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}