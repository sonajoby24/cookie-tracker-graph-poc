"use client";

import { useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import { ArcLayer, ScatterplotLayer, TextLayer } from "@deck.gl/layers";
import MapLibreMap, { NavigationControl, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Download, Network } from "lucide-react";

import type { GraphPayload } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type MapNode = {
  id: string;
  label: string;
  type: string;
  lng: number;
  lat: number;
  color: [number, number, number];
  radius: number;
};

type MapEdge = {
  id: string;
  source: string;
  target: string;
  sourcePosition: [number, number];
  targetPosition: [number, number];
  color: [number, number, number];
};

const DARK_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const TYPE_STYLES: Record<string, { color: [number, number, number]; radius: number }> = {
  site: { color: [34, 211, 238], radius: 90000 },
  domain: { color: [56, 189, 248], radius: 70000 },
  cookie: { color: [125, 211, 252], radius: 52000 },
  category: { color: [129, 140, 248], radius: 76000 },
  vendor: { color: [96, 165, 250], radius: 62000 },
};

const GEO_RING: [number, number][] = [
  [-122.4194, 37.7749],
  [-74.006, 40.7128],
  [-0.1276, 51.5072],
  [2.3522, 48.8566],
  [13.405, 52.52],
  [72.8777, 19.076],
  [77.1025, 28.7041],
  [103.8198, 1.3521],
  [139.6917, 35.6895],
  [151.2093, -33.8688],
  [-46.6333, -23.5505],
  [18.4241, -33.9249],
];

function LegendItem({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-300">
      <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
      <span>{label}</span>
    </div>
  );
}

export default function GraphStage({ graph }: { graph: GraphPayload }) {
  const [selected, setSelected] = useState<MapNode | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [highlightThirdParty, setHighlightThirdParty] = useState(true);
  const [physicsOn, setPhysicsOn] = useState(false);

  const handleDownloadSampleData = () => {
    window.open("http://127.0.0.1:8000/download/csv", "_blank");
  };

  const { nodes, edges } = useMemo(() => {
    const mappedNodes: MapNode[] = graph.nodes.map((node, index) => {
      const position = GEO_RING[index % GEO_RING.length];
      const style = TYPE_STYLES[node.type] ?? TYPE_STYLES.cookie;

      return {
        ...node,
        lng: position[0],
        lat: position[1],
        color: style.color,
        radius: style.radius,
      };
    });

    const byId = new Map<string, MapNode>(
      mappedNodes.map((node) => [node.id, node] as const)
    );

    const mappedEdges: MapEdge[] = graph.edges
      .map((edge) => {
        const source = byId.get(edge.source);
        const target = byId.get(edge.target);

        if (!source || !target) return null;

        return {
          id: edge.id,
          source: source.id,
          target: target.id,
          sourcePosition: [source.lng, source.lat],
          targetPosition: [target.lng, target.lat],
          color: target.type === "category" ? [129, 140, 248] : [56, 189, 248],
        };
      })
      .filter((edge): edge is MapEdge => edge !== null);

    return { nodes: mappedNodes, edges: mappedEdges };
  }, [graph]);

  const layers = useMemo(() => {
    const list: any[] = [
      new ArcLayer<MapEdge>({
        id: "cookie-arcs",
        data: edges,
        getSourcePosition: (d) => d.sourcePosition,
        getTargetPosition: (d) => d.targetPosition,
        getSourceColor: (d) => [...d.color, highlightThirdParty ? 100 : 50],
        getTargetColor: (d) => [...d.color, highlightThirdParty ? 210 : 100],
        getWidth: () => (physicsOn ? 3 : 2),
        pickable: false,
        greatCircle: true,
      }),
      new ScatterplotLayer<MapNode>({
        id: "cookie-nodes",
        data: nodes,
        pickable: true,
        stroked: true,
        filled: true,
        radiusUnits: "meters",
        lineWidthMinPixels: 1,
        getPosition: (d) => [d.lng, d.lat],
        getRadius: (d) => d.radius,
        getFillColor: (d) => [...d.color, 195],
        getLineColor: () => [15, 23, 42, 255],
        onClick: (info) => setSelected((info.object as MapNode) ?? null),
      }),
    ];

    if (showLabels) {
      list.push(
        new TextLayer<MapNode>({
          id: "cookie-labels",
          data: nodes,
          pickable: false,
          getPosition: (d) => [d.lng, d.lat],
          getText: (d) => d.label,
          getSize: 10,
          getColor: () => [229, 238, 247, 220],
          getPixelOffset: [0, 14],
          getTextAnchor: "middle",
          getAlignmentBaseline: "top",
          fontFamily: "Inter, sans-serif",
        })
      );
    }

    return list;
  }, [edges, nodes, showLabels, highlightThirdParty, physicsOn]);

  return (
    <Card className="dex-card dex-glow rounded-3xl border-border/80 bg-transparent">
      <CardContent className="p-4 xl:p-6">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="dex-label">Interactive Graph Stage</div>
            <h2 className="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-100">
              <Network className="h-5 w-5 text-cyan-300" />
              Cookie Tracker Graph
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Network-view intelligence across site, domain, cookie, vendor, and category relationships.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/10">
              Deck.gl
            </Badge>
            <Badge className="border border-indigo-400/20 bg-indigo-400/10 text-indigo-300 hover:bg-indigo-400/10">
              MapLibre
            </Badge>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="h-9 rounded-xl border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
              onClick={handleDownloadSampleData}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Sample Data
            </Button>

            <Button
              variant="outline"
              className="h-9 rounded-xl border-border bg-slate-950/40 text-slate-200 hover:bg-slate-900"
              onClick={() => setSelected(null)}
            >
              Reset
            </Button>

            <Button
              variant="outline"
              className={`h-9 rounded-xl border-border hover:bg-slate-900 ${
                highlightThirdParty ? "bg-cyan-400/10 text-cyan-300" : "bg-slate-950/40 text-slate-200"
              }`}
              onClick={() => setHighlightThirdParty((v) => !v)}
            >
              {highlightThirdParty ? "Highlight 3P On" : "Highlight 3P Off"}
            </Button>

            <Button
              variant="outline"
              className="h-9 rounded-xl border-border bg-slate-950/40 text-slate-200 hover:bg-slate-900"
              onClick={() => setShowLabels((v) => !v)}
            >
              {showLabels ? "Hide Labels" : "Show Labels"}
            </Button>

            <Button
              variant="outline"
              className="h-9 rounded-xl border-border bg-slate-950/40 text-slate-200 hover:bg-slate-900"
              onClick={() => setPhysicsOn((v) => !v)}
            >
              {physicsOn ? "Physics Off" : "Physics On"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 rounded-2xl border border-border bg-slate-950/40 px-4 py-3">
            <LegendItem label="Domain" colorClass="bg-sky-400" />
            <LegendItem label="Cookie" colorClass="bg-cyan-300" />
            <LegendItem label="Vendor" colorClass="bg-blue-400" />
            <LegendItem label="Category" colorClass="bg-indigo-400" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border bg-[#02060F]">
          <div className="dex-grid pointer-events-none absolute inset-0 z-10 opacity-40" />

          <div className="h-[560px] w-full">
            <DeckGL
              initialViewState={{
                longitude: 20,
                latitude: 18,
                zoom: 0.65,
                pitch: 18,
                bearing: 0,
              }}
              controller={true}
              layers={layers}
            >
              <MapLibreMap mapStyle={DARK_STYLE} reuseMaps>
                <NavigationControl position="top-right" />
                {selected && (
                  <Popup
                    longitude={selected.lng}
                    latitude={selected.lat}
                    anchor="top"
                    onClose={() => setSelected(null)}
                    closeButton
                    closeOnClick={false}
                  >
                    <div className="space-y-1">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        {selected.type}
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {selected.label}
                      </div>
                      <div className="text-xs text-slate-500">
                        Node ID: {selected.id}
                      </div>
                    </div>
                  </Popup>
                )}
              </MapLibreMap>
            </DeckGL>
          </div>

          <div className="absolute bottom-3 left-3 z-20 rounded-xl border border-border bg-slate-950/75 px-3 py-2 text-xs text-slate-300 backdrop-blur">
            Select a node to inspect graph relationships
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-5">
          <div className="rounded-2xl border border-border bg-slate-950/50 px-4 py-3">
            <div className="dex-label">Nodes</div>
            <div className="mt-1 text-lg font-semibold text-cyan-400 tabular-nums">
              {graph.stats.nodeCount}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-slate-950/50 px-4 py-3">
            <div className="dex-label">Edges</div>
            <div className="mt-1 text-lg font-semibold text-cyan-400 tabular-nums">
              {graph.stats.edgeCount}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-slate-950/50 px-4 py-3">
            <div className="dex-label">3P Links</div>
            <div className="mt-1 text-lg font-semibold text-cyan-400 tabular-nums">
              {graph.stats.thirdPartyLinks}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-slate-950/50 px-4 py-3">
            <div className="dex-label">Most Connected</div>
            <div className="mt-1 truncate text-sm font-semibold text-cyan-400">
              {graph.stats.mostConnectedDomain}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-slate-950/50 px-4 py-3">
            <div className="dex-label">Risk Density</div>
            <div className="mt-1 text-sm font-semibold text-cyan-400">
              {graph.stats.riskDensity ?? "Moderate"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}