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

interface UseWeeklyReportResult {
  report: WeeklyReport | null;
  loading: boolean;
  error: string | null;
}

export function useWeeklyReport(): UseWeeklyReportResult {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      setError(null);
      try {
        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const periodStart = weekAgo.toISOString().split("T")[0];
        const periodEnd = now.toISOString().split("T")[0];

        const { data, error: fetchError } = await supabase
          .from("incidents")
          .select("id, provider, severity, service, description, raw_json")
          .gte("created_at", weekAgo.toISOString())
          .lte("created_at", now.toISOString());

        if (fetchError) throw new Error(fetchError.message);

        const incidents = (data ?? []).map((row) => ({
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
          body: JSON.stringify({ period_start: periodStart, period_end: periodEnd, incidents }),
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
  }, []);

  return { report, loading, error };
}
