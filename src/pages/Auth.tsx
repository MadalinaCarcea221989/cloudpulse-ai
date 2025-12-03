import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Building2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const { user, loading, signInWithGoogle, signInWithMicrosoft } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [accountType, setAccountType] = useState<'individual' | 'company_partner'>('individual');

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsSigningIn(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setIsSigningIn(true);
    const { error } = await signInWithMicrosoft();
    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsSigningIn(false);
    }
  };

  // Update profile with account type after successful OAuth
  useEffect(() => {
    const updateAccountType = async () => {
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ account_type: accountType })
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error updating account type:', error);
        }
      }
    };
    
    if (user) {
      updateAccountType();
    }
  }, [user, accountType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Cloud className="w-12 h-12 text-cloud-light" />
          <h1 className="text-2xl font-bold text-foreground">CloudPulse</h1>
          <p className="text-muted-foreground text-center">
            AI-powered cloud monitoring dashboard
          </p>
        </div>

        {/* Account Type Selection */}
        <Card className="glass-card border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">Choose Account Type</CardTitle>
            <CardDescription>Select how you want to use CloudPulse</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAccountType('individual')}
                className={`p-4 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                  accountType === 'individual'
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="text-sm font-medium">Individual</span>
              </button>
              <button
                onClick={() => setAccountType('company_partner')}
                className={`p-4 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                  accountType === 'company_partner'
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10'
                }`}
              >
                <Building2 className="w-6 h-6" />
                <span className="text-sm font-medium">Company Partner</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Sign In Options */}
        <Card className="glass-card border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">Sign In</CardTitle>
            <CardDescription>
              {accountType === 'company_partner' 
                ? 'Sign in with your company account'
                : 'Sign in with your personal account'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
            
            <Button
              onClick={handleMicrosoftSignIn}
              disabled={isSigningIn}
              className="w-full bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              Continue with Microsoft
            </Button>

            <p className="text-xs text-muted-foreground text-center pt-2">
              {accountType === 'company_partner' 
                ? 'Use your work or school account to sign in as a company partner'
                : 'Sign in to access your personal dashboard'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
