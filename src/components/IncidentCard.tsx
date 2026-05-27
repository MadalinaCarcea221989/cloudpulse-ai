import { Clock, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface Incident {
  id: string;
  service: string;
  region: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "detected" | "investigating" | "monitoring" | "resolved";
  title: string;
  timestamp: Date;
  provider: "aws" | "azure" | "openai";
  raw_json?: any;
}

interface IncidentCardProps {
  incident: Incident;
  onClick: () => void;
}

const severityConfig = {
  critical: { class: "severity-critical", label: "Critical" },
  high: { class: "severity-high", label: "High" },
  medium: { class: "severity-medium", label: "Medium" },
  low: { class: "severity-low", label: "Low" },
};

const statusConfig = {
  detected: { icon: AlertTriangle, color: "text-red-400" },
  investigating: { icon: Activity, color: "text-orange-400" },
  monitoring: { icon: Clock, color: "text-yellow-400" },
  resolved: { icon: CheckCircle, color: "text-green-400" },
};

const IncidentCard = ({ incident, onClick }: IncidentCardProps) => {
  const StatusIcon = statusConfig[incident.status].icon;

  return (
    <div
      onClick={onClick}
      data-testid={`incident-card-${incident.id}`}
      className="glass-card p-5 cursor-pointer hover:bg-white/[0.03] hover:border-white/[0.12] transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <StatusIcon className={`w-3.5 h-3.5 ${statusConfig[incident.status].color}`} />
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground capitalize">{incident.status}</span>
        </div>
        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${severityConfig[incident.severity].class}`}>
          {severityConfig[incident.severity].label}
        </span>
      </div>

      {/* Service & Title */}
      <h4 className="font-semibold text-foreground text-sm mb-1.5 group-hover:text-cloud-light transition-colors">
        {incident.service}
      </h4>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{incident.title}</p>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground/80">
        <span>{incident.region}</span>
        <span>{formatDistanceToNow(incident.timestamp, { addSuffix: true })}</span>
      </div>
    </div>
  );
};

export default IncidentCard;
