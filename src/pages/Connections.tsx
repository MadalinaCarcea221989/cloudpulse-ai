import { useState } from "react";
import { Server, Cloud as CloudIcon, Cpu, Database, Plus, Trash2, Check, Loader2, Cable, Search } from "lucide-react";
import CloudBackground from "@/components/CloudBackground";
import Navigation from "@/components/Navigation";
import { useCloudConnections, type CloudProvider, type CloudConnection } from "@/hooks/useCloudConnections";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConnectInfrastructureModal from "@/components/ConnectInfrastructureModal";
import { Navigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const providerMeta: Record<CloudProvider, { icon: React.ElementType; label: string; color: string; bgColor: string }> = {
  aws: { icon: Server, label: "AWS", color: "text-orange-400", bgColor: "bg-orange-400/10 border-orange-400/20" },
  azure: { icon: CloudIcon, label: "Azure", color: "text-blue-400", bgColor: "bg-blue-400/10 border-blue-400/20" },
  openai: { icon: Cpu, label: "OpenAI", color: "text-green-400", bgColor: "bg-green-400/10 border-green-400/20" },
  gcp: { icon: Database, label: "GCP", color: "text-yellow-400", bgColor: "bg-yellow-400/10 border-yellow-400/20" },
};

const Connections = () => {
  const { user, loading: authLoading } = useAuth();
  const { connections, loading, removeConnection } = useCloudConnections();
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  const filtered = connections.filter(
    (c) =>
      c.display_name.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase()) ||
      (c.account_identifier?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const grouped = (["aws", "azure", "openai", "gcp"] as CloudProvider[]).reduce(
    (acc, p) => {
      const items = filtered.filter((c) => c.provider === p);
      if (items.length > 0) acc[p] = items;
      return acc;
    },
    {} as Record<CloudProvider, CloudConnection[]>
  );

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    await removeConnection(id);
    setRemovingId(null);
  };

  return (
    <div className="relative min-h-screen">
      <CloudBackground />
      <Navigation />

      <main className="relative z-10 pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Cable className="w-6 h-6 text-cloud-light" />
                Infrastructure Connections
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage all your connected cloud providers in one place
              </p>
            </div>
            <Button onClick={() => setConnectModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Connection
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {(["aws", "azure", "openai", "gcp"] as CloudProvider[]).map((p) => {
              const meta = providerMeta[p];
              const Icon = meta.icon;
              const count = connections.filter((c) => c.provider === p).length;
              return (
                <div key={p} className={`glass-card p-4 border ${meta.bgColor}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${meta.color}`} />
                    <span className="text-sm font-medium text-foreground">{meta.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground">{count === 1 ? "connection" : "connections"}</p>
                </div>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search connections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary/50 border-cloud-blue/20"
            />
          </div>

          {/* Connection list */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : connections.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Cable className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No connections yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Connect your cloud infrastructure to start monitoring.
              </p>
              <Button onClick={() => setConnectModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Connection
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-muted-foreground">No connections match your search.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([provider, items]) => {
                const meta = providerMeta[provider as CloudProvider];
                const Icon = meta.icon;
                return (
                  <div key={provider}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`w-4 h-4 ${meta.color}`} />
                      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                        {meta.label}
                      </h2>
                      <span className="text-xs text-muted-foreground">({items.length})</span>
                    </div>
                    <div className="space-y-2">
                      {items.map((conn) => (
                        <div
                          key={conn.id}
                          className="glass-card p-4 flex items-center justify-between group hover:border-cloud-blue/40 transition-colors"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.bgColor}`}>
                              <Check className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {conn.display_name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {conn.account_identifier && <span className="truncate">{conn.account_identifier}</span>}
                                {conn.region && (
                                  <>
                                    <span className="text-cloud-blue/40">·</span>
                                    <span>{conn.region}</span>
                                  </>
                                )}
                                <span className="text-cloud-blue/40">·</span>
                                <span>Added {formatDistanceToNow(new Date(conn.created_at), { addSuffix: true })}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(conn.id)}
                            disabled={removingId === conn.id}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          >
                            {removingId === conn.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <ConnectInfrastructureModal open={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
    </div>
  );
};

export default Connections;
