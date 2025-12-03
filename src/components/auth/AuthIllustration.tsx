import { Shield, CheckCircle, Search, FileCheck, Globe } from 'lucide-react';

const AuthIllustration = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-lilac/10 via-lilac-light to-secondary overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-lilac/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-lilac-muted/30 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96">
          {/* Central shield */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-card rounded-3xl shadow-elevated flex items-center justify-center">
            <Shield className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>

          {/* Orbiting elements */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-card rounded-2xl shadow-card flex items-center justify-center animate-float">
            <CheckCircle className="w-8 h-8 text-severity-low" strokeWidth={1.5} />
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 left-4 w-14 h-14 bg-card rounded-2xl shadow-card flex items-center justify-center animate-float-slow">
            <Search className="w-7 h-7 text-primary" strokeWidth={1.5} />
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-4 w-14 h-14 bg-card rounded-2xl shadow-card flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
            <FileCheck className="w-7 h-7 text-lilac-dark" strokeWidth={1.5} />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-card rounded-2xl shadow-card flex items-center justify-center animate-float-slow" style={{ animationDelay: '1s' }}>
            <Globe className="w-8 h-8 text-cloud-sky" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-12 left-0 right-0 text-center px-8">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Verify Information with Confidence
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          AI-powered accuracy checking to help you distinguish fact from fiction
        </p>
      </div>
    </div>
  );
};

export default AuthIllustration;
