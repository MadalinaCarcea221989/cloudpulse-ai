import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SSOModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularDomains = [
  'microsoft.com',
  'google.com',
  'amazon.com',
  'salesforce.com',
];

const SSOModal = ({ open, onOpenChange }: SSOModalProps) => {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredSuggestions = domain.length > 0
    ? popularDomains.filter(d => d.includes(domain.toLowerCase()))
    : [];

  const handleSSOLogin = async () => {
    if (!domain.trim()) {
      toast({
        title: 'Domain required',
        description: 'Please enter your company email domain.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: 'SSO Configuration Required',
        description: `SSO for ${domain} needs to be configured by your administrator.`,
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-elevated">
        <DialogHeader className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl text-foreground">Company SSO Login</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Enter your company email domain to sign in with your organization's identity provider.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Input
              placeholder="company.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="h-12 pl-4 pr-4 text-base bg-secondary/50 border-border focus:border-primary text-foreground"
            />

            {filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-card overflow-hidden z-10">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setDomain(suggestion)}
                    className="w-full px-4 py-2.5 text-left hover:bg-secondary/50 transition-colors text-sm text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSSOLogin}
            disabled={isLoading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue to SSO
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>

          <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border">
            <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Your credentials are handled by your organization's identity provider. We never store your SSO password.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SSOModal;
