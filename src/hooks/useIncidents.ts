/**
 * useIncidents — live incident feed from Supabase with Realtime updates.
 *
 * Replaces the hardcoded mockIncidents array in DashboardSection.tsx.
 * Subscribes to INSERT and UPDATE events on the incidents table so the
 * dashboard updates without polling.
 *
 * Usage:
 *   const { incidents, loading, error } = useIncidents();
 */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Incident } from "@/components/IncidentCard";

// ---------------------------------------------------------------------------
// Severity / status mappers
// ---------------------------------------------------------------------------

type SupabaseSeverity = string | null;
type SupabaseStatus = string | null;

function mapSeverity(raw: SupabaseSeverity): Incident["severity"] {
  switch (raw?.toLowerCase()) {
    case "critical":
    case "outage":
    case "severe":
      return "critical";
    case "high":
    case "major":
    case "error":
      return "high";
    case "medium":
    case "moderate":
    case "warning":
      return "medium";
    default:
      return "low";
  }
}

function mapStatus(raw: SupabaseStatus): Incident["status"] {
  switch (raw?.toLowerCase()) {
    case "investigating":
      return "investigating";
    case "resolved":
      return "resolved";
    default:
      return "monitoring";
  }
}

function mapProvider(raw: string | null): Incident["provider"] {
  switch (raw?.toLowerCase()) {
    case "aws":
      return "aws";
    case "azure":
    case "microsoft":
      return "azure";
    case "openai":
      return "openai";
    default:
      // Fall back to "aws" for unknown providers so the UI doesn't break.
      // Extend providerConfig in DashboardSection.tsx to add new providers.
      return "aws";
  }
}

// ---------------------------------------------------------------------------
// Row → Incident transformer
// ---------------------------------------------------------------------------

// Mirrors the Supabase incidents table shape from TimescaleDB pipeline
interface SupabaseIncidentRow {
  incident_id?: string; // Optional if using standard id
  id: string;
  provider: string | null;
  service: string | null;
  region: string | null;
  severity: string | null;
  title: string | null;
  status: string | null;
  started_at: string | null;
  created_at: string;
  updated_at?: string;
  raw_json: Record<string, unknown> | null;
}

function toIncident(row: SupabaseIncidentRow): Incident {
  return {
    id: row.incident_id ?? row.id,
    service: row.service ?? "Unknown Service",
    region: row.region ?? "Unknown Region",
    severity: mapSeverity(row.severity),
    status: mapStatus(row.status),
    title: row.title ?? "No description available",
    timestamp: new Date(row.started_at ?? row.created_at),
    provider: (row.provider ?? "unknown").toLowerCase(),
    raw_json: row.raw_json,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseIncidentsResult {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
}

export function useIncidents(limit = 50): UseIncidentsResult {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- Initial fetch ---
    async function fetchIncidents() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("incidents")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit);

        if (fetchError) {
          setError(fetchError.message);
          return;
        }
        
        setIncidents((data ?? []).map(toIncident));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load incidents.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();

    // --- Realtime subscription ---
    const channel = supabase
      .channel("incidents-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "incidents" },
        (payload) => {
          const newIncident = toIncident(payload.new as SupabaseIncidentRow);
          setIncidents((prev) => [newIncident, ...prev].slice(0, limit));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "incidents" },
        (payload) => {
          const updated = toIncident(payload.new as SupabaseIncidentRow);
          setIncidents((prev) =>
            prev.map((inc) => (inc.id === updated.id ? updated : inc))
          );
        }
      )
      .subscribe();

    // --- Cleanup ---
    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return { incidents, loading, error };
}
