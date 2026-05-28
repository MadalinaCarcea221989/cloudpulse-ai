import { Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
      {/* Soft glow behind title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[480px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto fade-in">
        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 mb-10 fade-in-delay-1">
          <Sparkles className="w-3.5 h-3.5 text-cloud-light" />
          <span className="text-xs text-cloud-light/90 font-medium tracking-wide">AI-Powered Cloud Monitoring</span>
        </div>

        {/* Main Title */}
        <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black tracking-tighter mb-8 chrome-text-3d fade-in-delay-2">
          CloudPulse
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-cloud-sky/90 font-light mb-5 fade-in-delay-2">
          Where intelligence meets infrastructure.
        </p>

        {/* Description */}
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-10 fade-in-delay-3 leading-relaxed">
          One place to catch issues across multiple cloud providers like AWS, Azure, and GCP, and fix them faster with your team.
        </p>

        {/* Provider chips */}
        <div className="flex items-center justify-center gap-2 fade-in-delay-3">
          {["AWS", "Azure", "GCP", "Cloudflare", "DigitalOcean", "Atlassian"].map((p) => (
            <span
              key={p}
              className="glass-pill px-3.5 py-1 text-xs font-medium text-muted-foreground tracking-wide"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-9 rounded-full border border-cloud-blue/40 flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 bg-cloud-light/80 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
