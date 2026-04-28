import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VendorExposureItem } from "@/lib/api";

type Props = {
  vendors: VendorExposureItem[];
};

export default function VendorPanel({ vendors }: Props) {
  const max = Math.max(...vendors.map((v) => v.cookieCount), 1);

  return (
    <Card className="dex-card rounded-3xl border-border/80 bg-transparent">
      <CardHeader className="pb-3">
        <div className="dex-label">Top Tracking Vendors</div>
        <CardTitle className="dex-panel-title">Vendor Exposure</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {vendors.length === 0 ? (
          <div className="rounded-2xl border border-border bg-slate-950/40 px-4 py-3 text-sm text-slate-400">
            No vendors detected.
          </div>
        ) : (
          vendors.map((vendor) => (
            <div
              key={vendor.vendor}
              className="rounded-2xl border border-border bg-slate-950/40 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {vendor.vendor}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {vendor.domainCoverage} domains · {vendor.risk}
                  </div>
                </div>
                <div className="text-sm tabular-nums text-cyan-400">
                  {vendor.cookieCount}
                </div>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900/80">
                <div
                  className={`h-full rounded-full ${
                    vendor.risk === "High"
                      ? "bg-rose-500"
                      : vendor.risk === "Medium"
                        ? "bg-indigo-400"
                        : "bg-cyan-400"
                  }`}
                  style={{ width: `${(vendor.cookieCount / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}