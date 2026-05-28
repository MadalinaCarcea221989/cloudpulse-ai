import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Incident } from "./IncidentCard";
import { AlertTriangle, Activity, Clock, CheckCircle, Zap, Copy, Check, Loader2, Brain } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IncidentDetailModalProps {
  incident: Incident | null;
  open: boolean;
  onClose: () => void;
}

const ML_CLASSIFIER_URL = "https://cloudpulse-ml-classifier.hf.space";

interface ClassificationExplanation {
  predicted_class?: string;
  top_contributions?: unknown;
  expected_value_for_class?: unknown;
}

interface ClassificationData {
  category?: string;
  incident_type?: string;
  label?: string;
  explanation?: string | ClassificationExplanation | null;
  confidence?: number;
  score?: number;
}

interface AnalysisData {
  whatBroke: string;
  userImpact: string;
  whatToMonitor: string;
  revenueLossEstimate?: string;
}

interface RemediationData {
  immediateActions: { cmd: string; time: string }[];
  shortTerm: string[];
  longTerm: string[];
}

const statusSteps = ["detected", "investigating", "monitoring", "resolved"];

const IncidentDetailModal = ({ incident, open, onClose }: IncidentDetailModalProps) => {
  const [showRemediation, setShowRemediation] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();

  // AI Analysis states
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // ML Classification states
  const [classification, setClassification] = useState<ClassificationData | null>(null);
  const [classificationLoading, setClassificationLoading] = useState(false);

  // Remediation states
  const [remediation, setRemediation] = useState<RemediationData | null>(null);
  const [remediationLoading, setRemediationLoading] = useState(false);
  const [remediationError, setRemediationError] = useState<string | null>(null);

  const mapOriginalImpact = (impact: string | null | undefined): "none" | "minor" | "major" | "critical" => {
    if (!impact) return "none";
    const lower = impact.toLowerCase();
    if (lower.includes("critical") || lower.includes("high")) return "critical";
    if (lower.includes("major") || lower.includes("significant")) return "major";
    if (lower.includes("minor") || lower.includes("low")) return "minor";
    return "none";
  };

  const fetchClassification = useCallback(async (inc: Incident) => {
    setClassificationLoading(true);
    try {
      const res = await fetch(`${ML_CLASSIFIER_URL}/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incident_id: inc.id,
          description: (inc.raw_json as Record<string, unknown>)?.description as string ?? inc.title ?? "",
          original_impact: mapOriginalImpact((inc.raw_json as Record<string, unknown>)?.original_impact as string),
          provider: inc.provider ?? "",
          service: inc.service ?? "",
          affected_services_count: (inc.raw_json as Record<string, unknown>)?.affected_services_count as number ?? 1,
          service_impact: (inc.raw_json as Record<string, unknown>)?.service_impact as string ?? "",
        }),
      });
      if (!res.ok) throw new Error(`classify returned ${res.status}`);
      const data: ClassificationData = await res.json();
      setClassification(data);
    } catch (err) {
      console.error("ML classify error:", err);
    } finally {
      setClassificationLoading(false);
    }
  }, []);

  const fetchAnalysis = useCallback(async (inc: Incident) => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-incident', {
        body: { incident: inc, includeRemediation: false }
      });

      if (error) throw error;
      setAnalysis(data as AnalysisData);
    } catch (err) {
      console.error('Failed to fetch analysis:', err);
      setAnalysisError("Analysis unavailable — check back shortly");
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  const generateRemediation = async () => {
    if (!incident) return;
    setRemediationLoading(true);
    setRemediationError(null);
    setShowRemediation(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-incident', {
        body: { incident, includeRemediation: true }
      });

      if (error) throw error;
      setRemediation(data as RemediationData);
    } catch (err) {
      console.error('Failed to generate remediation:', err);
      setRemediationError("Remediation plan unavailable");
    } finally {
      setRemediationLoading(false);
    }
  };

  useEffect(() => {
    if (open && incident) {
      fetchAnalysis(incident);
      fetchClassification(incident);
      setRemediation(null);
      setShowRemediation(false);
      setRemediationError(null);
      setClassification(null);
    }
  }, [open, incident, fetchAnalysis, fetchClassification]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = null;
      }
    };
  }, []);

  if (!incident) return null;

  const currentStepIndex = statusSteps.indexOf(incident.status);

  const copyCommand = async (cmd: string, index: number) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedIndex(index);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Command copied",
        description: "CLI command copied to clipboard.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to copy command.";
      toast({
        title: "Copy failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  // Impact Analysis logic
  const errorRate = incident.raw_json?.impact?.error_rate || incident.raw_json?.error_rate || "N/A";
  const avgLatency = incident.raw_json?.impact?.latency_p99 || incident.raw_json?.latency || "N/A";
  const affectedRequests = incident.raw_json?.impact?.affected_requests || incident.raw_json?.affected || "N/A";
  
  const showImpactAnalysis = errorRate !== "N/A" || avgLatency !== "N/A" || affectedRequests !== "N/A";

  const AnalysisSkeleton = () => (
    <div className="space-y-3">
      <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
      <div className="h-4 w-5/6 bg-muted/50 rounded animate-pulse" />
      <div className="h-4 w-4/6 bg-muted/50 rounded animate-pulse" />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl bg-cloud-dark border-cloud-blue/20 text-foreground max-h-[90vh] overflow-hidden flex flex-col p-0"
        data-testid="incident-detail-modal"
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-cloud-blue/10 shrink-0">
          <DialogTitle className="text-xl font-bold text-cloud-light flex items-center gap-2" data-testid="incident-modal-title">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            {incident.service}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">

          {/* Status Timeline */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Incident Timeline</h3>
            <div className="relative flex items-start justify-between">
              <div className="absolute top-4 left-0 right-0 flex px-4">
                {statusSteps.slice(0, -1).map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-0.5 mx-1 ${
                      index < currentStepIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {statusSteps.map((step, index) => (
                <div
                  key={step}
                  className="relative flex flex-col items-center flex-1 z-10"
                  data-testid={`timeline-step-${step}`}
                  data-active={index <= currentStepIndex}
                >
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
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis */}
          <div className="glass-card p-4 min-h-[140px]">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-cloud-light" />
              <h3 className="text-sm font-semibold text-cloud-light">AI Analysis</h3>
              {analysisLoading && <Loader2 className="w-3 h-3 animate-spin text-cloud-sky" />}
            </div>
            
            {analysisLoading ? (
              <AnalysisSkeleton />
            ) : analysisError ? (
              <p className="text-sm text-red-400/80 italic">{analysisError}</p>
            ) : analysis ? (
              <div className="space-y-3 text-sm text-muted-foreground animate-fade-in">
                <p>
                  <strong className="text-foreground">What broke:</strong> {analysis.whatBroke}
                </p>
                <p>
                  <strong className="text-foreground">User impact:</strong> {analysis.userImpact}
                </p>
                <p>
                  <strong className="text-foreground">What to monitor:</strong> {analysis.whatToMonitor}
                </p>
                {analysis.revenueLossEstimate && analysis.revenueLossEstimate !== "Minimal" && (
                  <p className="pt-2 border-t border-white/5">
                    <strong className="text-red-400">Estimated Revenue Impact:</strong> {analysis.revenueLossEstimate}
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {/* ML Classification */}
          {(classificationLoading || classification) && (() => {
            try {
              return (
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-cloud-sky" />
                    <h3 className="text-sm font-semibold text-cloud-sky">ML Classification</h3>
                    {classificationLoading && <Loader2 className="w-3 h-3 animate-spin text-cloud-sky" />}
                  </div>
                  {classificationLoading ? (
                    <AnalysisSkeleton />
                  ) : classification ? (
                    <div className="space-y-2 text-sm animate-fade-in">
                      {(classification.category ?? classification.incident_type ?? classification.label) && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cloud-sky/10 text-cloud-sky border border-cloud-sky/20">
                            {classification.category ?? classification.incident_type ?? classification.label}
                          </span>
                          {(classification.confidence ?? classification.score) != null && (
                            <span className="text-xs text-muted-foreground ml-auto">
                              {Math.round(((classification.confidence ?? classification.score)!) * 100)}% confidence
                            </span>
                          )}
                        </div>
                      )}
                      {classification.explanation != null && (
                        typeof classification.explanation === "object" ? (
                          <div className="text-sm text-muted-foreground space-y-1">
                            {classification.explanation.predicted_class && (
                              <p><strong className="text-foreground">Predicted class:</strong> {classification.explanation.predicted_class}</p>
                            )}
                            {classification.explanation.top_contributions != null && (
                              <p><strong className="text-foreground">Top contributions:</strong> {JSON.stringify(classification.explanation.top_contributions)}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground leading-relaxed">{classification.explanation}</p>
                        )
                      )}
                    </div>
                  ) : null}
                </div>
              );
            } catch {
              return null;
            }
          })()}

          {/* Impact Analysis */}
          {showImpactAnalysis && (
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Impact Analysis</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{errorRate}</div>
                  <div className="text-xs text-muted-foreground">Error Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{avgLatency}</div>
                  <div className="text-xs text-muted-foreground">Avg Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{affectedRequests}</div>
                  <div className="text-xs text-muted-foreground">Affected Requests</div>
                </div>
              </div>
            </div>
          )}

          {/* Remediation Button */}
          {!showRemediation && (
            <button
              onClick={generateRemediation}
              disabled={remediationLoading}
              data-testid="remediation-toggle"
              className="w-full glass-card py-3 text-cloud-light font-semibold hover:bg-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {remediationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Generate Remediation Plan
            </button>
          )}

          {/* Remediation Panel */}
          {showRemediation && (
            <div className="glass-card p-4 space-y-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-semibold text-green-400">AI Remediation Plan</h3>
                {remediationLoading && <Loader2 className="w-3 h-3 animate-spin text-green-400" />}
              </div>

              {remediationLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-cloud-navy/50 rounded-lg p-3 animate-pulse">
                      <div className="h-4 bg-muted/30 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted/20 rounded w-1/4" />
                    </div>
                  ))}
                </div>
              ) : remediationError ? (
                <p className="text-sm text-red-400/80 italic">{remediationError}</p>
              ) : remediation ? (
                <>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2">IMMEDIATE ACTIONS</h4>
                    <div className="space-y-2">
                      {remediation.immediateActions.map((action, index) => (
                        <div key={index} className="bg-cloud-navy/50 rounded-lg p-3 group">
                          <div className="flex items-center justify-between mb-1">
                            <code className="text-xs text-cloud-light flex-1 overflow-x-auto scrollbar-hide">{action.cmd}</code>
                            <button
                              onClick={() => copyCommand(action.cmd, index)}
                              data-testid={`copy-command-${index}`}
                              className="ml-2 p-1 hover:bg-white/10 rounded shrink-0 transition-colors"
                            >
                              {copiedIndex === index ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-muted-foreground group-hover:text-cloud-light" />
                              )}
                            </button>
                          </div>
                          <span className="text-xs text-muted-foreground">Est. time: {action.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2">SHORT-TERM ACTIONS</h4>
                    <ul className="space-y-2">
                      {remediation.shortTerm.map((action, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-cloud-sky">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2">LONG-TERM ACTIONS</h4>
                    <ul className="space-y-2">
                      {remediation.longTerm.map((action, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-cloud-sky">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : null}
            </div>
          )}

          <div className="h-2" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetailModal;