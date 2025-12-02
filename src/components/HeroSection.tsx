import { ArrowDown, Zap } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const HeroSection = () => {
  const scrollToDashboard = () => {
    document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[200vh] flex flex-col items-center px-6 pt-20">
      {/* Glowing orb behind title */}
      <div className="absolute top-[25vh] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Fixed Hero Content */}
      <div className="sticky top-[20vh] z-10 text-center max-w-4xl mx-auto fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 fade-in-delay-1">
          <Zap className="w-4 h-4 text-cloud-light" />
          <span className="text-sm text-cloud-light font-medium">AI-Powered Monitoring</span>
        </div>

        {/* Main Title */}
        <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black tracking-tight mb-12 chrome-text-3d fade-in-delay-2">
          cloudpulse
        </h1>

        {/* ScrollReveal Text */}
        <div className="max-w-3xl mx-auto space-y-6">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={3}
            blurStrength={8}
            containerClassName="text-muted-foreground"
            textClassName="text-lg"
          >
            Where intelligence meets infrastructure
          </ScrollReveal>

          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={2}
            blurStrength={6}
            containerClassName="text-muted-foreground"
            textClassName="text-lg"
          >
            AI-powered monitoring for AWS, Azure, and OpenAI with real-time alerts and automated remediation. Unified visibility for DevOps teams.
          </ScrollReveal>
        </div>

        {/* CTA Button */}
        <button
          onClick={scrollToDashboard}
          className="group glass-card px-8 py-4 text-lg font-semibold text-cloud-light hover:bg-primary/30 transition-all inline-flex items-center gap-3 mt-12 fade-in-delay-3"
        >
          Explore Dashboard
          <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 rounded-full border-2 border-cloud-blue/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-cloud-light rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
