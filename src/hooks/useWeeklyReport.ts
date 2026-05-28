import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ML_CLASSIFIER_URL = "https://cloudpulse-ml-classifier.hf.space";

export interface WeeklyReport {
  period_start: string;
  period_end: string;
  total_incidents: number;
  summary: string;
  aggregation?: Record<string, unknown> | null;
}

export interface WeeklyStats {
  total: number;
  criticalHigh: number;
  resolved: number;
}

interface UseWeeklyReportResult {
  report: WeeklyReport | null;
  stats: WeeklyStats | null;
  loading: boolean;
  error: string | null;
  periodStart: Date;
  periodEnd: Date;
}

const CRITICAL_HIGH_SEVERITIES = new Set([
  "critical", "outage", "severe", "high", "major", "error",
]);

export function useWeeklyReport(weekOffset = 0): UseWeeklyReportResult {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stable dates for the return value (re-derived from weekOffset each render)
  const periodEnd = new Date();
  periodEnd.setDate(periodEnd.getDate() - weekOffset * 7);
  const periodStart = new Date(periodEnd);
  periodStart.setDate(periodEnd.getDate() - 7);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      setReport(null);
      setStats(null);
      setError(null);
      try {
        const end = new Date();
        end.setDate(end.getDate() - weekOffset * 7);
        const start = new Date(end);
        start.setDate(end.getDate() - 7);

        const { data, error: fetchError } = await supabase
          .from("incidents")
          .select("id, provider, severity, status, service, description, raw_json")
          .gte("started_at", start.toISOString())
          .lte("started_at", end.toISOString())
          .not("provider_incident_id", "like", "azure-mock-%")
          .not("provider_incident_id", "like", "aws-mock-%");

        if (fetchError) throw new Error(fetchError.message);

        const rows = data ?? [];
        setStats({
          total: rows.length,
          criticalHigh: rows.filter((r) =>
            CRITICAL_HIGH_SEVERITIES.has((r.severity ?? "").toLowerCase())
          ).length,
          resolved: rows.filter((r) => r.status?.toLowerCase() === "resolved").length,
        });

        const incidents = rows.map((row) => ({
          incident_id: row.id,
          provider: row.provider ?? "unknown",
          final_severity: row.severity ?? "low",
          service: row.service ?? undefined,
          description:
            ((row.raw_json as Record<string, unknown> | null)?.description as string | undefined) ??
            row.description ??
            undefined,
        }));

        const res = await fetch(`${ML_CLASSIFIER_URL}/weekly`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            period_start: start.toISOString().split("T")[0],
            period_end: end.toISOString().split("T")[0],
            incidents,
          }),
        });

        if (!res.ok) throw new Error(`/weekly returned ${res.status}`);
        const reportData: WeeklyReport = await res.json();
        setReport(reportData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load weekly report";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [weekOffset]);

  return { report, stats, loading, error, periodStart, periodEnd };
}
