import { useState, useEffect } from "react";
import {
  Brain,
  Server,
  Cloud as CloudIcon,
  Cpu,
  Sparkles,
  Loader2,
  Globe,
  Database,
  Zap,
  Shield,
  Activity,
} from "lucide-react";
import IncidentCard, { Incident } from "./IncidentCard";
import IncidentDetailModal from "./IncidentDetailModal";
import ConnectInfrastructureModal from "./ConnectInfrastructureModal";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useIncidents } from "@/hooks/useIncidents";
import { useWeeklyReport } from "@/hooks/useWeeklyReport";

const PROVIDER_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  aws: { label: "AWS", color: "text-orange-400", icon: Server },
  azure: { label: "Azure", color: "text-blue-400", icon: CloudIcon },
  microsoft: { label: "Azure", color: "text-blue-400", icon: CloudIcon },
  openai: { label: "OpenAI", color: "text-green-400", icon: Cpu },
  github: { label: "GitHub", color: "text-purple-400", icon: Shield },
  cloudflare: { label: "Cloudflare", color: "text-orange-300", icon: Globe },
  vercel: { label: "Vercel", color: "text-white", icon: Zap },
  twilio: { label: "Twilio", color: "text-red-400", icon: Activity },
  digitalocean: { label: "DigitalOcean", color: "text-blue-300", icon: Database },
  datadog: { label: "Datadog", color: "text-purple-300", icon: Activity },
  discord: { label: "Discord", color: "text-indigo-400", icon: Globe },
  mongodb: { label: "MongoDB", color: "text-green-300", icon: Database },
  sendgrid: { label: "SendGrid", color: "text-blue-400", icon: Globe },
  hubspot: { label: "HubSpot", color: "text-orange-400", icon: Globe },
  zoom: { label: "Zoom", color: "text-blue-400", icon: Activity },
  typeform: { label: "Typeform", color: "text-pink-400", icon: Globe },
  circleci: { label: "CircleCI", color: "text-green-400", icon: Activity },
  "new relic": { label: "New Relic", color: "text-teal-400", icon: Activity },
};

function getProviderConfig(provider: string) {
  const key = provider.toLowerCase();
  return (
    PROVIDER_CONFIG[key] ?? {
      label: provider.charAt(0).toUpperCase() + provider.slice(1),
      color: "text-muted-foreground",
      icon: Globe,
    }
  );
}

const DashboardSection = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

  const [weekOffset, setWeekOffset] = useState(0);

  const { incidents, loading, error } = useIncidents(200);
  const {
    report: weeklyReport,
    stats: weeklyStats,
    loading: weeklyLoading,
    periodStart: weeklyStartDate,
    periodEnd: weeklyEndDate,
  } = useWeeklyReport(weekOffset);

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();

  useEffect(() => {
    const newCritical = incidents.find(
      (i) => i.severity === "critical" && !notifiedIds.has(i.id)
    );
    if (newCritical) {
      toast.error("New Critical Incident Detected", {
        description: `${newCritical.service} — ${newCritical.title.slice(0, 80)}`,
        action: {
          label: "View",
          onClick: () => setSelectedIncident(newCritical),
        },
      });
      setNotifiedIds((prev) => new Set([...prev, newCritical.id]));
    }
  }, [incidents, notifiedIds]);

  const providerGroups = incidents.reduce<Record<string, Incident[]>>((acc, incident) => {
    const key = incident.provider.toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(incident);
    return acc;
  }, {});

  const sortedProviders = Object.entries(providerGroups)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6);

  const criticalCount = incidents.filter(
    (i) => i.severity === "critical" || i.severity === "high"
  ).length;
  const resolvedCount = incidents.filter((i) => i.status === "resolved").length;

  return (
    <section id="dashboard" className="relative py-32 px-6 overflow-hidden">
      <span className="section-watermark top-8" aria-hidden="true">incidents</span>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="eyebrow">Live operations</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mt-3 mb-3">
            Your infrastructure, <span className="chrome-text">in one pane</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Real-time incident streams from every cloud, triaged by AI before you even look.
          </p>
        </div>

        <div className="glass-card p-6 md:p-8 mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-4 h-4 text-cloud-light" />
            <h2 className="text-sm font-semibold text-cloud-light tracking-wide uppercase">
              Weekly Intelligence
            </h2>
            <Sparkles className="w-3.5 h-3.5 text-cloud-sky ml-1" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-1.5">
              <h3 className="eyebrow">Total Incidents</h3>
              <p className="text-foreground font-medium text-lg">{weeklyStats?.total ?? incidents.length}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Live count across {sortedProviders.length} providers
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="eyebrow">Critical / High</h3>
              <p className="text-foreground font-medium text-lg">{weeklyStats?.criticalHigh ?? criticalCount}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Incidents requiring immediate attention
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="eyebrow">Resolved</h3>
              <p className="text-foreground font-medium text-lg">{weeklyStats?.resolved ?? resolvedCount}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Incidents resolved in current dataset
              </p>
            </div>
          </div>

          {(weeklyLoading || weeklyReport?.summary) && (
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="eyebrow"><span>7-DAY INTELLIGENCE REPORT</span></h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 ml-2">
                  <button
                    onClick={() => setWeekOffset((w) => Math.min(w + 1, 8))}
                    disabled={weekOffset >= 8}
                    className="hover:text-white disabled:opacity-30 transition-colors"
                  >
                    ← Prev
                  </button>
                  <span>{fmtDate(weeklyStartDate)} – {fmtDate(weeklyEndDate)}</span>
                  <button
                    onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                    disabled={weekOffset === 0}
                    className="hover:text-white disabled:opacity-30 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
              {weeklyLoading ? (
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted/40 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-muted/40 rounded animate-pulse" />
                  <div className="h-3 w-4/6 bg-muted/40 rounded animate-pulse" />
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none space-y-4
                  [&>h1]:text-lg [&>h1]:font-bold [&>h1]:text-white [&>h1]:border-b [&>h1]:border-white/10 [&>h1]:pb-2
                  [&>h2]:text-base [&>h2]:font-semibold [&>h2]:text-blue-300 [&>h2]:mt-4
                  [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:text-blue-200
                  [&>p]:text-gray-300 [&>p]:leading-relaxed
                  [&>ul]:space-y-1 [&>ul>li]:text-gray-300
                  [&>strong]:text-white">
                  <ReactMarkdown>{weeklyReport!.summary}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading live incidents…</span>
          </div>
        )}

        {error && !loading && (
          <div className="glass-card p-6 text-center text-red-400 text-sm">
            Failed to load incidents: {error}
          </div>
        )}

        {!loading && !error && incidents.length === 0 && (
          <div className="glass-card p-6 text-center text-muted-foreground text-sm">
            No incidents found. The pipeline may still be syncing data.
          </div>
        )}

        {!loading && sortedProviders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProviders.map(([providerKey, providerIncidents]) => {
              const config = getProviderConfig(providerKey);
              const ProviderIcon = config.icon;
              const visibleCount = visibleCounts[providerKey] ?? 10;
              const remainingCount = providerIncidents.length - visibleCount;

              return (
                <div key={providerKey} className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                    <ProviderIcon className={`w-4 h-4 ${config.color}`} />
                    <h3 className="font-semibold text-foreground text-sm tracking-wide">
                      {config.label}
                    </h3>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {providerIncidents.length} incidents
                    </span>
                  </div>
                  <div className="space-y-3">
                    {providerIncidents.slice(0, visibleCount).map((incident) => (
                      <IncidentCard
                        key={incident.id}
                        incident={incident}
                        onClick={() => setSelectedIncident(incident)}
                      />
                    ))}
                    {remainingCount > 0 && (
                      <button
                        onClick={() =>
                          setVisibleCounts((prev) => ({
                            ...prev,
                            [providerKey]: (prev[providerKey] ?? 10) + 10,
                          }))
                        }
                        data-testid={`show-more-incidents-${providerKey}`}
                        className="w-full text-xs text-muted-foreground border border-white/[0.08] rounded-lg py-2 transition-colors hover:text-foreground hover:border-white/[0.2]"
                      >
                        Show more incidents (+{remainingCount} remaining)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <IncidentDetailModal
        incident={selectedIncident}
        open={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
      <ConnectInfrastructureModal
        open={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />
    </section>
  );
};

export default DashboardSection;
