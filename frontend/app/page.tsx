import FilterBar from "@/components/filter-bar";
import GraphStage from "@/components/graph-stage";
import IntelligenceSidebar from "@/components/intelligence-sidebar";
import MetricStrip from "@/components/metric-strip";
import RiskDistribution from "@/components/risk-distribution";
import AnomalyPanel from "@/components/anomaly-panel";
import VendorPanel from "@/components/vendor-panel";
import SignalChainPanel from "@/components/signal-chain-panel";
import WaterfallPanel from "@/components/waterfall-panel";
import { getDashboard } from "@/lib/api";

export default async function HomePage() {
  const dashboard = await getDashboard();
  const metrics = dashboard.metrics;
  const graph = dashboard.graph;
  const sidebar = dashboard.sidebar;

  return (
    <main className="dex-shell px-6 py-8 xl:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-cyan-400">
              DEXTERE / Privacy Intelligence Rail
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-100 xl:text-5xl">
              {dashboard.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Interactive cookie relationship intelligence across scan output,
              normalized metrics, and export-ready sample data.
            </p>
          </div>

          <div className="rounded-full border border-border bg-slate-950/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-400">
            Source Status:
            <span className="ml-2 font-medium text-cyan-400">
              {dashboard.sourceStatus}
            </span>
          </div>
        </header>

        <FilterBar
          filters={dashboard.filters}
          downloadCsv={dashboard.downloads.csv}
          downloadJson={dashboard.downloads.json}
        />

        <div className="mt-6">
          <MetricStrip metrics={metrics} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)]">
          <section className="space-y-6">
            <GraphStage graph={graph} />

            <AnomalyPanel anomalies={dashboard.anomalies} />

            <RiskDistribution
              analytics={metrics.analyticsCookies}
              marketing={metrics.marketingCookies}
              essential={metrics.essentialCookies}
              unknown={metrics.unknownCookies}
              total={metrics.totalCookies}
              highRisk={metrics.highRiskCookies}
            />

            <WaterfallPanel waterfall={dashboard.waterfall} />
          </section>

          <div className="space-y-6">
            <IntelligenceSidebar
              title={dashboard.title}
              site={dashboard.site}
              sourceStatus={dashboard.sourceStatus}
              totalCookies={sidebar.highLevelMetric}
              uniqueDomains={metrics.uniqueDomains}
              thirdPartyCookies={metrics.thirdPartyCookies}
              trackingVendors={metrics.trackingVendors}
              compositeRisk={sidebar.compositeRisk}
              confidence={sidebar.confidence}
              updatedAt={sidebar.updatedAt}
              whyThisMatters={sidebar.whyThisMatters}
              whoControlsTheRail={sidebar.whoControlsTheRail}
              downloadCsv={dashboard.downloads.csv}
              downloadJson={dashboard.downloads.json}
            />

            <VendorPanel vendors={dashboard.vendors} />

            <SignalChainPanel steps={dashboard.signalChain} />
          </div>
        </div>
      </div>
    </main>
  );
}