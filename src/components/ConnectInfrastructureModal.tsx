import { useState } from "react";
import { Server, Cloud as CloudIcon, Cpu, Database, Plus, Trash2, X, Check, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCloudConnections, type CloudProvider, type CloudConnection } from "@/hooks/useCloudConnections";

interface ProviderFormConfig {
  provider: CloudProvider;
  label: string;
  icon: React.ElementType;
  color: string;
  fields: { key: string; label: string; placeholder: string; isIdentifier?: boolean }[];
}

const providers: ProviderFormConfig[] = [
  {
    provider: "aws",
    label: "AWS",
    icon: Server,
    color: "text-orange-400",
    fields: [
      { key: "display_name", label: "Display Name", placeholder: "Production AWS" },
      { key: "account_identifier", label: "Account ID", placeholder: "123456789012", isIdentifier: true },
      { key: "region", label: "Default Region", placeholder: "us-east-1" },
    ],
  },
  {
    provider: "azure",
    label: "Azure",
    icon: CloudIcon,
    color: "text-blue-400",
    fields: [
      { key: "display_name", label: "Display Name", placeholder: "Production Azure" },
      { key: "account_identifier", label: "Subscription ID", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", isIdentifier: true },
      { key: "region", label: "Default Region", placeholder: "East US" },
    ],
  },
  {
    provider: "openai",
    label: "OpenAI",
    icon: Cpu,
    color: "text-green-400",
    fields: [
      { key: "display_name", label: "Display Name", placeholder: "OpenAI Production" },
      { key: "account_identifier", label: "Organization ID", placeholder: "org-...", isIdentifier: true },
    ],
  },
  {
    provider: "gcp",
    label: "GCP",
    icon: Database,
    color: "text-yellow-400",
    fields: [
      { key: "display_name", label: "Display Name", placeholder: "Production GCP" },
      { key: "account_identifier", label: "Project ID", placeholder: "my-project-123456", isIdentifier: true },
      { key: "region", label: "Default Region", placeholder: "us-central1" },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const ConnectInfrastructureModal = ({ open, onClose }: Props) => {
  const { connections, addConnection, removeConnection, loading } = useCloudConnections();
  const [activeTab, setActiveTab] = useState<CloudProvider>("aws");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (config: ProviderFormConfig) => {
    const displayName = formValues.display_name;
    if (!displayName?.trim()) return;

    setSubmitting(true);

    const identifierField = config.fields.find((f) => f.isIdentifier);
    const metaFields = config.fields.filter((f) => f.key !== "display_name" && !f.isIdentifier && f.key !== "region");
    const metadata: Record<string, unknown> = {};
    metaFields.forEach((f) => {
      if (formValues[f.key]) metadata[f.key] = formValues[f.key];
    });

    await addConnection({
      provider: config.provider,
      display_name: displayName.trim(),
      account_identifier: identifierField ? formValues[identifierField.key] : undefined,
      region: formValues.region,
      metadata,
    });

    setFormValues({});
    setSubmitting(false);
  };

  const providerConnections = (provider: CloudProvider) =>
    connections.filter((c) => c.provider === provider);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-card border-cloud-blue/30 sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-cloud-light text-xl flex items-center gap-2">
            <CloudIcon className="w-5 h-5" />
            Connect Infrastructure
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as CloudProvider); setFormValues({}); }}>
          <TabsList className="grid grid-cols-4 bg-secondary/50">
            {providers.map((p) => {
              const Icon = p.icon;
              const count = providerConnections(p.provider).length;
              return (
                <TabsTrigger key={p.provider} value={p.provider} className="flex items-center gap-1.5 text-xs">
                  <Icon className={`w-4 h-4 ${p.color}`} />
                  {p.label}
                  {count > 0 && (
                    <span className="ml-1 bg-primary/30 text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {providers.map((config) => (
            <TabsContent key={config.provider} value={config.provider} className="space-y-4 mt-4">
              {/* Existing connections */}
              {providerConnections(config.provider).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm text-muted-foreground">Active Connections</h4>
                  {providerConnections(config.provider).map((conn) => (
                    <ConnectionRow key={conn.id} connection={conn} onRemove={removeConnection} />
                  ))}
                </div>
              )}

              {/* Add new */}
              <div className="space-y-3 pt-2 border-t border-cloud-blue/20">
                <h4 className="text-sm text-muted-foreground flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Connection
                </h4>
                {config.fields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{field.label}</Label>
                    <Input
                      placeholder={field.placeholder}
                      value={formValues[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="bg-secondary/50 border-cloud-blue/20 text-foreground h-9 text-sm"
                    />
                  </div>
                ))}
                <Button
                  onClick={() => handleSubmit(config)}
                  disabled={submitting || !formValues.display_name?.trim()}
                  className="w-full mt-2"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Connect {config.label}
                </Button>
              </div>
            </TabsContent>
          ))}</Tabs>
      </DialogContent>
    </Dialog>
  );
};

function ConnectionRow({ connection, onRemove }: { connection: CloudConnection; onRemove: (id: string) => Promise<boolean> }) {
  const [removing, setRemoving] = useState(false);

  return (
    <div className="glass-card p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Check className="w-4 h-4 text-green-400" />
        <div>
          <p className="text-sm font-medium text-foreground">{connection.display_name}</p>
          <p className="text-xs text-muted-foreground">
            {connection.account_identifier && <span>{connection.account_identifier}</span>}
            {connection.region && <span> · {connection.region}</span>}
          </p>
        </div>
      </div>
      <button
        onClick={async () => { setRemoving(true); await onRemove(connection.id); setRemoving(false); }}
        className="text-muted-foreground hover:text-destructive transition-colors"
        disabled={removing}
      >
        {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default ConnectInfrastructureModal;
