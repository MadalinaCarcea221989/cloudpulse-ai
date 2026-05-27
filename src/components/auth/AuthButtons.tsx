import { Button } from '@/components/ui/button';
import { Shield, Mail } from 'lucide-react';

interface AuthButtonsProps {
  onGoogleSignIn: () => void;
  onMicrosoftSignIn: () => void;
  onSSOClick: () => void;
  onEmailClick: () => void;
  isLoading: boolean;
  showEmailForm: boolean;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#F25022" d="M1 1h10v10H1z"/>
    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
    <path fill="#FFB900" d="M13 13h10v10H13z"/>
  </svg>
);

const AuthButtons = ({
  onGoogleSignIn,
  onMicrosoftSignIn,
  onSSOClick,
  onEmailClick,
  isLoading,
  showEmailForm,
}: AuthButtonsProps) => {
  return (
    <div className="space-y-3">
      {/* SSO Button - Primary */}
      <Button
        onClick={onSSOClick}
        disabled={isLoading}
        variant="outline"
        data-testid="auth-sso-button"
        className="w-full h-14 bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/50 text-foreground font-medium transition-all duration-200 group"
      >
        <Shield className="w-5 h-5 mr-3 text-primary group-hover:scale-110 transition-transform" />
        <div className="flex flex-col items-start">
          <span>Sign in with SSO</span>
          <span className="text-xs text-muted-foreground font-normal">Use your organization's secure login</span>
        </div>
      </Button>

      {/* Google Button */}
      <Button
        onClick={onGoogleSignIn}
        disabled={isLoading}
        variant="outline"
        data-testid="auth-google-button"
        className="w-full h-12 bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/50 text-foreground font-medium transition-all duration-200"
      >
        <GoogleIcon />
        <span className="ml-3">Sign in with Google</span>
      </Button>

      {/* Microsoft Button */}
      <Button
        onClick={onMicrosoftSignIn}
        disabled={isLoading}
        variant="outline"
        data-testid="auth-microsoft-button"
        className="w-full h-12 bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/50 text-foreground font-medium transition-all duration-200"
      >
        <MicrosoftIcon />
        <span className="ml-3">Sign in with Microsoft</span>
      </Button>

      {/* Email Button */}
      {!showEmailForm && (
        <Button
          onClick={onEmailClick}
          disabled={isLoading}
          variant="outline"
          data-testid="auth-email-button"
          className="w-full h-12 bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/50 text-foreground font-medium transition-all duration-200"
        >
          <Mail className="w-5 h-5 mr-3 text-muted-foreground" />
          <span>Sign in with Email</span>
        </Button>
      )}
    </div>
  );
};

export default AuthButtons;
