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
      className="glass-card p-4 cursor-pointer hover:bg-white/5 transition-all hover:scale-[1.02] group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-4 h-4 ${statusConfig[incident.status].color}`} />
          <span className="text-sm text-muted-foreground capitalize">{incident.status}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${severityConfig[incident.severity].class}`}>
          {severityConfig[incident.severity].label}
        </span>
      </div>

      {/* Service & Title */}
      <h4 className="font-semibold text-foreground mb-1 group-hover:text-cloud-light transition-colors">
        {incident.service}
      </h4>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{incident.title}</p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{incident.region}</span>
        <span>{formatDistanceToNow(incident.timestamp, { addSuffix: true })}</span>
      </div>
    </div>
  );
};

export default IncidentCard;
