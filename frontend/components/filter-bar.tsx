import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Filter, Search } from "lucide-react";
import type { FiltersPayload } from "@/lib/api";

type Props = {
  filters: FiltersPayload;
  downloadCsv: string;
  downloadJson: string;
};

export default function FilterBar({ filters, downloadCsv, downloadJson }: Props) {
  return (
    <Card className="dex-card rounded-3xl border-border/80 bg-transparent">
      <CardContent className="flex flex-col gap-4 p-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="rounded-full border border-border bg-slate-950/50 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-400">
            Scope: <span className="text-cyan-400">{filters.scope}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.chips.map((chip) => (
              <Badge
                key={chip.value}
                className={`rounded-full border px-3 py-1 text-xs ${
                  chip.active
                    ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                    : "border-border bg-slate-950/40 text-slate-300"
                }`}
              >
                {chip.label}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-slate-950/50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              aria-label="Search filters"
              placeholder="Search domains, vendors, cookies"
              className="w-56 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
            />
          </div>

          <Button
            variant="outline"
            className="h-10 rounded-xl border-border bg-transparent text-slate-200 hover:bg-slate-900"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            className="h-10 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300"
          >
            <a href={downloadCsv} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-10 rounded-xl border-border bg-transparent text-slate-100 hover:bg-slate-900"
          >
            <a href={downloadJson} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}