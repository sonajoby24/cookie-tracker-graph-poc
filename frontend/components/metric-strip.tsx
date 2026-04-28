import { Card, CardContent } from "@/components/ui/card";

type Metrics = {
  totalCookies: number;
  uniqueDomains: number;
  thirdPartyCookies: number;
  trackingVendors: number;
  highRiskCookies: number;
  unknownCookies: number;
};

export default function MetricStrip({ metrics }: { metrics: Metrics }) {
  const items = [
    { label: "Total Cookies", value: metrics.totalCookies },
    { label: "Unique Domains", value: metrics.uniqueDomains },
    { label: "Third-Party", value: metrics.thirdPartyCookies },
    { label: "Vendors", value: metrics.trackingVendors },
    { label: "High Risk", value: metrics.highRiskCookies },
    { label: "Unknown Category", value: metrics.unknownCookies },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <Card
          key={item.label}
          className="dex-card rounded-3xl border-border/80 bg-transparent"
        >
          <CardContent className="p-4">
            <div className="dex-label">{item.label}</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-cyan-400 tabular-nums">
              {item.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}