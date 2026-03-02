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
    <section id="dashboard" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Weekly Intelligence Panel */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-cloud-light" />
            <h2 className="text-lg font-semibold text-cloud-light">Weekly Intelligence</h2>
            <Sparkles className="w-4 h-4 text-cloud-sky ml-1" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm text-muted-foreground">Worst Performing</h3>
              <p className="text-foreground font-medium">AWS Lambda</p>
              <p className="text-xs text-muted-foreground">
                12 incidents this week, primarily timeout-related in us-east-1
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-muted-foreground">Service Hotspot</h3>
              <p className="text-foreground font-medium">Database Services</p>
              <p className="text-xs text-muted-foreground">
                RDS and Cosmos DB showing 40% increased load patterns
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-muted-foreground">Detected Pattern</h3>
              <p className="text-foreground font-medium">Peak Hour Correlation</p>
              <p className="text-xs text-muted-foreground">
                78% of incidents occur between 9AM-11AM EST during deployments
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
                <div className="flex items-center gap-2 pb-2 border-b border-cloud-blue/20">
                  <ProviderIcon className={`w-5 h-5 ${config.color}`} />
                  <h3 className="font-semibold text-foreground">{config.label}</h3>
                  <span className="ml-auto text-sm text-muted-foreground">{incidents.length} incidents</span>
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

        {/* Connect Infrastructure Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setConnectModalOpen(true)}
            className="glass-card px-8 py-4 text-lg font-semibold text-cloud-light hover:bg-primary/30 transition-all inline-flex items-center gap-3"
          >
            <CloudIcon className="w-5 h-5" />
            Connect Your Infrastructure
          </button>
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
