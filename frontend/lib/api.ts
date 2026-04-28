export type SourceStatus = "Live" | "Synthetic" | "Sample";

export type MetricPayload = {
  totalCookies: number;
  uniqueDomains: number;
  thirdPartyCookies: number;
  trackingVendors: number;
  highRiskCookies: number;
  unknownCookies: number;
  analyticsCookies: number;
  marketingCookies: number;
  essentialCookies: number;
};

export type GraphNodeType =
  | "site"
  | "domain"
  | "cookie"
  | "category"
  | "vendor";

export type GraphNode = {
  id: string;
  label: string;
  type: GraphNodeType | string;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
};

export type GraphStats = {
  nodeCount: number;
  edgeCount: number;
  thirdPartyLinks: number;
  mostConnectedDomain: string;
  riskDensity?: string;
};

export type GraphPayload = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: GraphStats;
};

export type SidebarPayload = {
  compositeRisk: number;
  highLevelMetric: number;
  whyThisMatters: string;
  whoControlsTheRail: string;
  confidence: string;
  updatedAt: string;
};

export type FilterOption = {
  label: string;
  value: string;
  active?: boolean;
};

export type FiltersPayload = {
  scope: string;
  chips: FilterOption[];
  consentEnabled: boolean;
};

export type WaterfallItem = {
  id: string;
  label: string;
  durationMs: number;
  type: "document" | "script" | "cookie" | "vendor" | "api";
  risk: "low" | "medium" | "high";
};

export type AnomalyItem = {
  id: string;
  name: string;
  affectedCount: number;
  severity: "Low" | "Medium" | "High";
};

export type VendorExposureItem = {
  vendor: string;
  cookieCount: number;
  domainCoverage: number;
  risk: "Low" | "Medium" | "High";
};

export type SignalChainStep = {
  id: string;
  label: string;
  state: "done" | "current" | "pending";
};

export type ConsentSummary = {
  consentPresent: number;
  consentMissing: number;
  firstParty: number;
  thirdParty: number;
  categorized: number;
  uncategorized: number;
};

export type PerformanceImpact = {
  requestCount: number;
  transferKb: number;
  blockingMs: number;
};

export type DashboardPayload = {
  title: string;
  site: string;
  sourceStatus: SourceStatus;
  metrics: MetricPayload;
  graph: GraphPayload;
  sidebar: SidebarPayload;
  filters: FiltersPayload;
  waterfall: WaterfallItem[];
  anomalies: AnomalyItem[];
  vendors: VendorExposureItem[];
  signalChain: SignalChainStep[];
  consentSummary: ConsentSummary;
  performance: PerformanceImpact;
  downloads: {
    csv: string;
    json: string;
  };
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

function normalizeSourceStatus(value?: string): SourceStatus {
  if (value === "Live" || value === "Synthetic" || value === "Sample") {
    return value;
  }
  return "Synthetic";
}

export async function getDashboard(): Promise<DashboardPayload> {
  const [summaryRes, graphRes, extraRes] = await Promise.all([
    fetchJson<{
      sourceStatus?: string;
      metrics?: MetricPayload;
      title?: string;
      site?: string;
      sidebar?: Partial<SidebarPayload>;
    }>("/summary"),
    fetchJson<{
      sourceStatus?: string;
      graph?: GraphPayload;
      title?: string;
      site?: string;
    }>("/graph"),
    fetchJson<Partial<DashboardPayload>>("/dashboard"),
  ]);

  const metrics: MetricPayload =
    summaryRes?.metrics ?? {
      totalCookies: 148,
      uniqueDomains: 19,
      thirdPartyCookies: 62,
      trackingVendors: 11,
      highRiskCookies: 18,
      unknownCookies: 9,
      analyticsCookies: 41,
      marketingCookies: 35,
      essentialCookies: 63,
    };

  const graph: GraphPayload =
    graphRes?.graph ?? {
      nodes: [
        { id: "site-1", label: "targetsite.com", type: "site" },
        { id: "domain-1", label: "targetsite.com", type: "domain" },
        { id: "cookie-1", label: "_ga", type: "cookie" },
        { id: "vendor-1", label: "Google Analytics", type: "vendor" },
        { id: "category-1", label: "Analytics", type: "category" },
      ],
      edges: [
        { id: "e1", source: "site-1", target: "domain-1" },
        { id: "e2", source: "domain-1", target: "cookie-1" },
        { id: "e3", source: "cookie-1", target: "vendor-1" },
        { id: "e4", source: "cookie-1", target: "category-1" },
      ],
      stats: {
        nodeCount: 5,
        edgeCount: 4,
        thirdPartyLinks: 2,
        mostConnectedDomain: "targetsite.com",
        riskDensity: "Moderate",
      },
    };

  const sourceStatus = normalizeSourceStatus(
    summaryRes?.sourceStatus ?? graphRes?.sourceStatus ?? extraRes?.sourceStatus
  );

  return {
    title:
      summaryRes?.title ??
      graphRes?.title ??
      extraRes?.title ??
      "Cookie Tracker Graph Intelligence",
    site:
      summaryRes?.site ??
      graphRes?.site ??
      extraRes?.site ??
      "targetsite.com",
    sourceStatus,
    metrics,
    graph,
    sidebar: {
      compositeRisk: extraRes?.sidebar?.compositeRisk ?? 48,
      highLevelMetric: summaryRes?.sidebar?.highLevelMetric ?? metrics.totalCookies,
      whyThisMatters:
        summaryRes?.sidebar?.whyThisMatters ??
        "Third-party cookie spread expands tracking surface across domains and vendors, while unknown classification reduces compliance visibility.",
      whoControlsTheRail:
        summaryRes?.sidebar?.whoControlsTheRail ??
        "Control is concentrated in embedded vendor scripts, analytics platforms, and tag-loaded third-party infrastructure rather than purely in first-party application logic.",
      confidence: extraRes?.sidebar?.confidence ?? "High",
      updatedAt: extraRes?.sidebar?.updatedAt ?? "Updated 2m ago",
    },
    filters: extraRes?.filters ?? {
      scope: "All Scans",
      consentEnabled: true,
      chips: [
        { label: "All Domains", value: "all-domains", active: true },
        { label: "Third-Party", value: "third-party" },
        { label: "High Risk", value: "high-risk" },
      ],
    },
    waterfall: extraRes?.waterfall ?? [
      {
        id: "w1",
        label: "Document Load",
        durationMs: 180,
        type: "document",
        risk: "low",
      },
      {
        id: "w2",
        label: "analytics.js",
        durationMs: 320,
        type: "script",
        risk: "medium",
      },
      {
        id: "w3",
        label: "_ga Cookie Set",
        durationMs: 90,
        type: "cookie",
        risk: "medium",
      },
      {
        id: "w4",
        label: "doubleclick.net",
        durationMs: 460,
        type: "vendor",
        risk: "high",
      },
    ],
    anomalies: extraRes?.anomalies ?? [
      {
        id: "a1",
        name: "THIRD_PARTY_UNKNOWN_CATEGORY",
        affectedCount: 5,
        severity: "High",
      },
      {
        id: "a2",
        name: "COOKIE_DOMAIN_MISMATCH",
        affectedCount: 3,
        severity: "Medium",
      },
      {
        id: "a3",
        name: "HIGH_VENDOR_CONCENTRATION",
        affectedCount: 2,
        severity: "Medium",
      },
      {
        id: "a4",
        name: "MISSING_CONSENT_SIGNAL",
        affectedCount: 4,
        severity: "High",
      },
    ],
    vendors: extraRes?.vendors ?? [
      {
        vendor: "Google Analytics",
        cookieCount: 18,
        domainCoverage: 7,
        risk: "Medium",
      },
      {
        vendor: "DoubleClick",
        cookieCount: 14,
        domainCoverage: 6,
        risk: "High",
      },
      {
        vendor: "Meta Pixel",
        cookieCount: 10,
        domainCoverage: 5,
        risk: "High",
      },
      {
        vendor: "Hotjar",
        cookieCount: 7,
        domainCoverage: 3,
        risk: "Medium",
      },
    ],
    signalChain: extraRes?.signalChain ?? [
      { id: "s1", label: "Page Load", state: "done" },
      { id: "s2", label: "Script Request", state: "done" },
      { id: "s3", label: "Cookie Set", state: "done" },
      { id: "s4", label: "Vendor Match", state: "current" },
      { id: "s5", label: "Category Assigned", state: "pending" },
      { id: "s6", label: "Consent Evaluated", state: "pending" },
    ],
    consentSummary: extraRes?.consentSummary ?? {
      consentPresent: 84,
      consentMissing: 64,
      firstParty: 86,
      thirdParty: 62,
      categorized: 139,
      uncategorized: 9,
    },
    performance: extraRes?.performance ?? {
      requestCount: 29,
      transferKb: 842,
      blockingMs: 188,
    },
    downloads: {
      csv: `${API_BASE}/download/csv`,
      json: `${API_BASE}/download/json`,
    },
  };
}