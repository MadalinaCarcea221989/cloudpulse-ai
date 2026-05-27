import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Eye, EyeOff, ArrowLeft, CheckCircle, Clock } from 'lucide-react';

interface EmailAuthFormProps {
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
  onSubmit: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; requiresConfirmation?: boolean }>;
  onBack: () => void;
  isLoading: boolean;
}

const EmailAuthForm = ({ mode, onModeChange, onSubmit, onBack, isLoading }: EmailAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setShowPassword(false);
  };

  const handleModeChange = (newMode: 'signin' | 'signup') => {
    resetFields();
    onModeChange(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await onSubmit(email, password, mode === 'signup' ? fullName : undefined);
    if (mode === 'signup' && result?.success) {
      setSubmittedEmail(email);
      setSignupComplete(true);
    }
  };

  // ── Post-signup confirmation screen ──────────────────────────────────────
  if (signupComplete) {
    return (
      <div className="space-y-6 animate-fade-in text-center">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Check your email</h3>
          <p className="text-sm text-muted-foreground">We sent a confirmation link to</p>
          <p className="text-sm font-semibold text-primary break-all">{submittedEmail}</p>
        </div>

        <div className="bg-secondary/30 rounded-xl p-4 text-left space-y-3 border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Next steps
          </p>
          {[
            { icon: Mail, text: "Open the email from CloudPulse" },
            { icon: CheckCircle, text: 'Click "Confirm your account"' },
            { icon: Clock, text: "You'll be signed in automatically" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-sm text-foreground">{text}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Can't find it? Check your <span className="text-foreground font-medium">spam or junk</span> folder.
        </p>

        <button
          onClick={() => {
            setSignupComplete(false);
            resetFields();
            onModeChange('signin');
          }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </button>
      </div>
    );
  }

  // ── Normal auth form ──────────────────────────────────────────────────────
  return (
    <div className="space-y-4 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all options
      </button>

      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
        <button
          onClick={() => handleModeChange('signin')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            mode === 'signin'
              ? 'bg-card text-foreground shadow-sm border border-border'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => handleModeChange('signup')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            mode === 'signup'
              ? 'bg-card text-foreground shadow-sm border border-border'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12 bg-secondary/50 border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 bg-secondary/50 border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            {mode === 'signin' && (
              <button
                type="button"
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-secondary/50 border-border focus:border-primary pr-12 text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default EmailAuthForm;