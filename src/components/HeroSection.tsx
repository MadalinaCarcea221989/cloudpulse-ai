import { Zap } from "lucide-react";

const HeroSection = () => {

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
      {/* Glowing orb behind title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 fade-in-delay-1">
          <Zap className="w-4 h-4 text-cloud-light" />
          <span className="text-sm text-cloud-light font-medium">AI-Powered Monitoring</span>
        </div>

        {/* Main Title */}
        <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black tracking-tight mb-6 chrome-text-3d fade-in-delay-2">
          cloudpulse
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-cloud-sky font-light mb-4 fade-in-delay-2">
          Where intelligence meets infrastructure
        </p>

        {/* Description */}
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12 fade-in-delay-3">
          AI-powered monitoring for AWS, Azure, and GCP with real-time alerts
          and automated remediation. Unified visibility for DevOps teams.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-cloud-blue/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-cloud-light rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
