import { useState, useEffect } from "react";
import { Brain, Server, Cloud as CloudIcon, Cpu, Sparkles } from "lucide-react";
import IncidentCard, { Incident } from "./IncidentCard";
import IncidentDetailModal from "./IncidentDetailModal";
import ConnectInfrastructureModal from "./ConnectInfrastructureModal";
import { toast } from "sonner";

const mockIncidents: Incident[] = [
  // AWS
  {
    id: "aws-1",
    service: "Lambda - OrderProcessor",
    region: "us-east-1",
    severity: "critical",
    status: "investigating",
    title: "Function timeouts exceeding threshold, 23% error rate detected",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    provider: "aws",
  },
  {
    id: "aws-2",
    service: "RDS - ProductionDB",
    region: "eu-west-1",
    severity: "high",
    status: "monitoring",
    title: "High CPU utilization at 94%, read replica lag increasing",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    provider: "aws",
  },
  {
    id: "aws-3",
    service: "S3 - MediaBucket",
    region: "ap-southeast-1",
    severity: "low",
    status: "resolved",
    title: "Temporary access latency resolved after bucket policy update",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    provider: "aws",
  },
  // Azure
  {
    id: "azure-1",
    service: "App Service - WebAPI",
    region: "East US",
    severity: "high",
    status: "investigating",
    title: "Memory pressure causing frequent restarts, autoscale triggered",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    provider: "azure",
  },
  {
    id: "azure-2",
    service: "Cosmos DB",
    region: "West Europe",
    severity: "medium",
    status: "monitoring",
    title: "Elevated RU consumption detected, throttling possible",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    provider: "azure",
  },
  {
    id: "azure-3",
    service: "Functions - DataSync",
    region: "Central US",
    severity: "low",
    status: "resolved",
    title: "Cold start optimization applied, latency normalized",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    provider: "azure",
  },
  // OpenAI
  {
    id: "openai-1",
    service: "GPT-4 API",
    region: "Global",
    severity: "medium",
    status: "monitoring",
    title: "Elevated response times during peak hours, 2.3s avg latency",
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    provider: "openai",
  },
  {
    id: "openai-2",
    service: "Embeddings API",
    region: "Global",
    severity: "low",
    status: "resolved",
    title: "Rate limit adjustments completed, throughput normalized",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    provider: "openai",
  },
];

const providerConfig = {
  aws: { icon: Server, label: "AWS", color: "text-orange-400" },
  azure: { icon: CloudIcon, label: "Azure", color: "text-blue-400" },
  openai: { icon: Cpu, label: "OpenAI", color: "text-green-400" },
};

const DashboardSection = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [hasTriggeredDemo, setHasTriggeredDemo] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  // Demo mode - trigger notification after 3 seconds
  useEffect(() => {
    if (hasTriggeredDemo) return;

    const timer = setTimeout(() => {
      toast.error("New Critical Incident Detected", {
        description: "Lambda - OrderProcessor experiencing elevated error rates in us-east-1",
        action: {
          label: "View",
          onClick: () => setSelectedIncident(mockIncidents[0]),
        },
      });
      setHasTriggeredDemo(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasTriggeredDemo]);

  const groupedIncidents = {
    aws: mockIncidents.filter((i) => i.provider === "aws"),
    azure: mockIncidents.filter((i) => i.provider === "azure"),
    openai: mockIncidents.filter((i) => i.provider === "openai"),
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
              <h3 className="eyebrow">Worst Performing</h3>
              <p className="text-foreground font-medium text-lg">AWS Lambda</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                12 incidents this week, primarily timeout-related in us-east-1
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="eyebrow">Service Hotspot</h3>
              <p className="text-foreground font-medium text-lg">Database Services</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                RDS and Cosmos DB showing 40% increased load patterns
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="eyebrow">Detected Pattern</h3>
              <p className="text-foreground font-medium text-lg">Peak Hour Correlation</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                78% of incidents occur between 9AM–11AM EST during deployments
              </p>
            </div>
          </div>
        </div>

        {/* Provider Columns */}
        <div className="grid md:grid-cols-3 gap-6">
          {(["aws", "azure", "openai"] as const).map((provider) => {
            const config = providerConfig[provider];
            const ProviderIcon = config.icon;
            const incidents = groupedIncidents[provider];

            return (
              <div key={provider} className="space-y-4">
                {/* Provider Header */}
                <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                  <ProviderIcon className={`w-4 h-4 ${config.color}`} />
                  <h3 className="font-semibold text-foreground text-sm tracking-wide">{config.label}</h3>
                  <span className="ml-auto text-xs text-muted-foreground">{incidents.length} incidents</span>
                </div>

                {/* Incident Cards */}
                <div className="space-y-3">
                  {incidents.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                      onClick={() => setSelectedIncident(incident)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Incident Detail Modal */}
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
