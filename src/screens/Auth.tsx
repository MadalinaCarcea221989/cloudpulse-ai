"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield } from 'lucide-react';
import AuthIllustration from '@/components/auth/AuthIllustration';
import AuthButtons from '@/components/auth/AuthButtons';
import EmailAuthForm from '@/components/auth/EmailAuthForm';
import AccountTypeSelector from '@/components/auth/AccountTypeSelector';
import SSOModal from '@/components/auth/SSOModal';
import OnboardingStepper from '@/components/auth/OnboardingStepper';

const Auth = () => {
  const { user, loading, signInWithGoogle, signInWithMicrosoft } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [accountType, setAccountType] = useState<'individual' | 'company_partner'>('individual');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailMode, setEmailMode] = useState<'signin' | 'signup'>('signin');
  const [showSSOModal, setShowSSOModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      if (isNewUser) {
        setShowOnboarding(true);
      } else {
        router.push('/');
      }
    }
  }, [user, loading, router, isNewUser]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in with Google.';
      toast({
        title: 'Sign in failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setIsSigningIn(true);
    try {
      const { error } = await signInWithMicrosoft();
      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in with Microsoft.';
      toast({
        title: 'Sign in failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  // ── KEY FIX: now returns { success, requiresConfirmation } and always resets isSigningIn ──
  const handleEmailAuth = async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<{ success: boolean; requiresConfirmation?: boolean }> => {
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return { success: false };
    }

    setIsSigningIn(true);

    try {
      if (emailMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast({
            title: 'Sign in failed',
            description: error.message,
            variant: 'destructive',
          });
          return { success: false };
        }
        return { success: true };

      } else {
        if (password.length < 6) {
          toast({
            title: 'Password too short',
            description: 'Password must be at least 6 characters.',
            variant: 'destructive',
          });
          return { success: false };
        }

        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { full_name: fullName },
          },
        });

        if (error) {
          toast({
            title: 'Sign up failed',
            description: error.message,
            variant: 'destructive',
          });
          return { success: false };
        }

        // Don't show toast here — EmailAuthForm shows the confirmation screen instead
        setIsNewUser(true);
        return { success: true, requiresConfirmation: true };
      }

    } finally {
      // ── Always runs, always stops the spinner ──
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    const updateAccountType = async () => {
      if (!user) return;
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (profile?.account_type === accountType) {
          return;
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ account_type: accountType })
          .eq('user_id', user.id);

        if (updateError) {
          throw updateError;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to update account type.';
        toast({
          title: 'Update failed',
          description: message,
          variant: 'destructive',
        });
      }
    };
    updateAccountType();
  }, [user, accountType, toast]);

  const handleOnboardingComplete = async (data: {
    role: string;
    infoTypes: string[];
    preferences: object;
  }) => {
    toast({
      title: 'Setup complete!',
      description: 'Your preferences have been saved.',
    });
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (showOnboarding && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <OnboardingStepper onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%]">
        <AuthIllustration />
      </div>

      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[480px] space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-2xl mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to verify information with AI-powered accuracy
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-6">
            <AccountTypeSelector value={accountType} onChange={setAccountType} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card/50 px-3 text-muted-foreground">Continue with</span>
              </div>
            </div>

            {!showEmailForm ? (
              <AuthButtons
                onGoogleSignIn={handleGoogleSignIn}
                onMicrosoftSignIn={handleMicrosoftSignIn}
                onSSOClick={() => setShowSSOModal(true)}
                onEmailClick={() => setShowEmailForm(true)}
                isLoading={isSigningIn}
                showEmailForm={showEmailForm}
              />
            ) : (
              <EmailAuthForm
                mode={emailMode}
                onModeChange={setEmailMode}
                onSubmit={handleEmailAuth}
                onBack={() => setShowEmailForm(false)}
                isLoading={isSigningIn}
              />
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span>Your data remains secure. We never store your credentials.</span>
          </div>
        </div>
      </div>

      <SSOModal open={showSSOModal} onOpenChange={setShowSSOModal} />
    </div>
  );
};

export default Auth;