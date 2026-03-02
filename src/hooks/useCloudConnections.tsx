import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type CloudProvider = "aws" | "azure" | "openai" | "gcp";
export type ConnectionStatus = "connected" | "disconnected" | "error";

export interface CloudConnection {
  id: string;
  provider: CloudProvider;
  display_name: string;
  account_identifier: string | null;
  region: string | null;
  status: ConnectionStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface NewConnectionInput {
  provider: CloudProvider;
  display_name: string;
  account_identifier?: string;
  region?: string;
  metadata?: Record<string, unknown>;
}

export function useCloudConnections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<CloudConnection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    if (!user) {
      setConnections([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cloud_connections")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch connections:", error);
      toast.error("Failed to load connections");
    } else {
      setConnections((data as unknown as CloudConnection[]) ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const addConnection = async (input: NewConnectionInput) => {
    if (!user) return null;

    const row = {
      user_id: user.id,
      provider: input.provider as string,
      display_name: input.display_name,
      account_identifier: input.account_identifier || null,
      region: input.region || null,
      metadata: (input.metadata || {}) as Record<string, unknown>,
      status: "connected" as const,
    };

    const { data, error } = await supabase
      .from("cloud_connections")
      .insert(row as any)
      .select()
      .single();

    if (error) {
      console.error("Failed to add connection:", error);
      toast.error("Failed to add connection");
      return null;
    }

    toast.success(`${input.display_name} connected successfully`);
    await fetchConnections();
    return data as unknown as CloudConnection;
  };

  const removeConnection = async (id: string) => {
    const { error } = await supabase
      .from("cloud_connections")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to remove connection:", error);
      toast.error("Failed to remove connection");
      return false;
    }

    toast.success("Connection removed");
    await fetchConnections();
    return true;
  };

  const getConnectionsByProvider = (provider: CloudProvider) =>
    connections.filter((c) => c.provider === provider);

  return {
    connections,
    loading,
    addConnection,
    removeConnection,
    getConnectionsByProvider,
    refetch: fetchConnections,
  };
}
