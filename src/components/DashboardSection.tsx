import { useState, useEffect } from "react";
import { Brain, Server, Cloud as CloudIcon, Cpu, Sparkles, Loader2 } from "lucide-react";
import IncidentCard, { Incident } from "./IncidentCard";
import IncidentDetailModal from "./IncidentDetailModal";
import ConnectInfrastructureModal from "./ConnectInfrastructureModal";
import { toast } from "sonner";
import { useIncidents } from "@/hooks/useIncidents";

const providerConfig = {
  aws: { icon: Server, label: "AWS", color: "text-orange-400" },
  azure: { icon: CloudIcon, label: "Azure", color: "text-blue-400" },
  openai: { icon: Cpu, label: "OpenAI", color: "text-green-400" },
};

const DashboardSection = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());

  // Live data from Supabase — replaces hardcoded mockIncidents
  const { incidents, loading, error } = useIncidents(50);

  // Notify on new critical incidents arriving via Realtime
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

  const groupedIncidents = {
    aws: incidents.filter((i) => i.provider === "aws"),
    azure: incidents.filter((i) => i.provider === "azure"),
    openai: incidents.filter((i) => i.provider === "openai"),
  };

  return (
    <section id="dashboard" className="relative py-32 px-6 overflow-hidden">
      {/* Watermark */}
      <span className="section-watermark top-8" aria-hidden="true">incidents</span>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="eyebrow">Live operations</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mt-3 mb-3">
            Your infrastructure, <span className="chrome-text">in one pane</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Real-time incident streams from every cloud, triaged by AI before you even look.
          </p>
        </div>

        {/* Weekly Intelligence Panel */}
        <div className="glass-card p-6 md:p-8 mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-4 h-4 text-cloud-light" />
            <h2 className="text-sm font-semibold text-cloud-light tracking-wide uppercase">Weekly Intelligence</h2>
            <Sparkles className="w-3.5 h-3.5 text-cloud-sky ml-1" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-1.5">
              <h3 className="eyebrow">Total Incidents</h3>
              <p className="text-foreground font-medium text-lg">{incidents.length}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Live count from all monitored providers
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="eyebrow">Critical / High</h3>
              <p className="text-foreground font-medium text-lg">
                {incidents.filter((i) => i.severity === "critical" || i.severity === "high").length}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Incidents requiring immediate attention
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="eyebrow">Resolved</h3>
              <p className="text-foreground font-medium text-lg">
                {incidents.filter((i) => i.status === "resolved").length}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Incidents resolved in current dataset
              </p>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading live incidents…</span>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="glass-card p-6 text-center text-red-400 text-sm">
            Failed to load incidents: {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && incidents.length === 0 && (
          <div className="glass-card p-6 text-center text-muted-foreground text-sm">
            No incidents found. The pipeline may still be syncing data.
          </div>
        )}

        {/* Provider Columns */}
        {!loading && incidents.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {(["aws", "azure", "openai"] as const).map((provider) => {
              const config = providerConfig[provider];
              const ProviderIcon = config.icon;
              const providerIncidents = groupedIncidents[provider];

              return (
                <div key={provider} className="space-y-4">
                  {/* Provider Header */}
                  <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                    <ProviderIcon className={`w-4 h-4 ${config.color}`} />
                    <h3 className="font-semibold text-foreground text-sm tracking-wide">{config.label}</h3>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {providerIncidents.length} incidents
                    </span>
                  </div>

                  {/* Incident Cards */}
                  <div className="space-y-3">
                    {providerIncidents.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4 text-center">
                        No incidents for this provider
                      </p>
                    ) : (
                      providerIncidents.map((incident) => (
                        <IncidentCard
                          key={incident.id}
                          incident={incident}
                          onClick={() => setSelectedIncident(incident)}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
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
