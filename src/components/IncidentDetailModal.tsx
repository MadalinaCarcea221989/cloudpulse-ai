import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Incident } from "./IncidentCard";
import { AlertTriangle, Activity, Clock, CheckCircle, Zap, Copy, Check } from "lucide-react";
import { useState } from "react";

interface IncidentDetailModalProps {
  incident: Incident | null;
  open: boolean;
  onClose: () => void;
}

const statusSteps = ["detected", "investigating", "monitoring", "resolved"];

const IncidentDetailModal = ({ incident, open, onClose }: IncidentDetailModalProps) => {
  const [showRemediation, setShowRemediation] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!incident) return null;

  const currentStepIndex = statusSteps.indexOf(incident.status);

  const copyCommand = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const remediationActions = {
    immediate: [
      { cmd: `aws lambda update-function-configuration --function-name ${incident.service} --timeout 30`, time: "2 min" },
      { cmd: `aws cloudwatch put-metric-alarm --alarm-name "${incident.service}-errors"`, time: "1 min" },
    ],
    shortTerm: [
      "Implement circuit breaker pattern for downstream calls",
      "Add request throttling at API Gateway level",
    ],
    longTerm: [
      "Migrate to provisioned concurrency for predictable workloads",
      "Implement multi-region failover architecture",
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-cloud-dark border-cloud-blue/20 text-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-cloud-light flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            {incident.service}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Timeline */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Incident Timeline</h3>
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      index <= currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step === "detected" && <AlertTriangle className="w-4 h-4" />}
                    {step === "investigating" && <Activity className="w-4 h-4" />}
                    {step === "monitoring" && <Clock className="w-4 h-4" />}
                    {step === "resolved" && <CheckCircle className="w-4 h-4" />}
                  </div>
                  <span className="text-xs capitalize text-muted-foreground">{step}</span>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`absolute h-0.5 w-full top-4 left-1/2 ${
                        index < currentStepIndex ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-cloud-light" />
              <h3 className="text-sm font-semibold text-cloud-light">AI Analysis</h3>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">What broke:</strong> The {incident.service} function in {incident.region} experienced 
                elevated error rates due to timeout issues connecting to downstream services.
              </p>
              <p>
                <strong className="text-foreground">User impact:</strong> Approximately 15% of API requests failed during peak traffic, 
                affecting real-time data processing pipelines.
              </p>
              <p>
                <strong className="text-foreground">What to monitor:</strong> Watch CloudWatch metrics for Lambda duration and 
                concurrent executions. Alert if p99 latency exceeds 5 seconds.
              </p>
            </div>
          </div>

          {/* Impact Analysis */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Impact Analysis</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">23.4%</div>
                <div className="text-xs text-muted-foreground">Error Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">4.2s</div>
                <div className="text-xs text-muted-foreground">Avg Latency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">1.2K</div>
                <div className="text-xs text-muted-foreground">Affected Requests</div>
              </div>
            </div>
          </div>

          {/* Remediation Button */}
          {!showRemediation && (
            <button
              onClick={() => setShowRemediation(true)}
              className="w-full glass-card py-3 text-cloud-light font-semibold hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Generate Remediation Plan
            </button>
          )}

          {/* Remediation Panel */}
          {showRemediation && (
            <div className="glass-card p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-semibold text-green-400">AI Remediation Plan</h3>
              </div>

              {/* Immediate Actions */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">IMMEDIATE ACTIONS</h4>
                <div className="space-y-2">
                  {remediationActions.immediate.map((action, index) => (
                    <div key={index} className="bg-cloud-navy/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-xs text-cloud-light flex-1 overflow-x-auto">{action.cmd}</code>
                        <button
                          onClick={() => copyCommand(action.cmd, index)}
                          className="ml-2 p-1 hover:bg-white/10 rounded"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground">Est. time: {action.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Short-term Actions */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">SHORT-TERM ACTIONS</h4>
                <ul className="space-y-2">
                  {remediationActions.shortTerm.map((action, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-cloud-sky">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Long-term Actions */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">LONG-TERM ACTIONS</h4>
                <ul className="space-y-2">
                  {remediationActions.longTerm.map((action, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-cloud-sky">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetailModal;
