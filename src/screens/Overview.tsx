import Link from "next/link";
import CloudBackground from "@/components/CloudBackground";
import Navigation from "@/components/Navigation";
import {
  Shield,
  Zap,
  BarChart3,
  AlertTriangle,
  Cpu,
  Clock,
  ArrowRight,
  CheckCircle,
  Layers,
  Sparkles,
} from "lucide-react";

const Overview = () => {
  const features = [
    {
      icon: AlertTriangle,
      title: "Real-Time Incident Monitoring",
      description: "Aggregate incidents from AWS, Azure, and GCP in a unified dashboard with live updates.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Get automatic AI summaries and root cause analysis for every incident.",
    },
    {
      icon: Cpu,
      title: "Automated Remediation",
      description: "Receive step-by-step remediation guidance with CLI commands you can copy and execute.",
    },
    {
      icon: BarChart3,
      title: "Impact Analysis",
      description: "Understand the blast radius with affected services, metrics comparison, and revenue impact estimates.",
    },
    {
      icon: Clock,
      title: "Incident Timeline",
      description: "Track incident progression from detection through resolution with visual status indicators.",
    },
    {
      icon: Layers,
      title: "Weekly Intelligence",
      description: "AI-generated trend analysis identifying worst-performing providers and service hotspots.",
    },
  ];

  const providers = [
    { name: "AWS", color: "from-orange-500 to-yellow-500" },
    { name: "Azure", color: "from-blue-500 to-cyan-500" },
    { name: "GCP", color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="relative min-h-screen">
      <CloudBackground />
      <Navigation />

      <main className="relative z-10 pt-28 pb-16">
        {/* Hero */}
        <section className="relative px-6 py-24 overflow-hidden">
          <span className="section-watermark top-12" aria-hidden="true">overview</span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[400px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 mb-8 fade-in-delay-1">
              <Shield className="w-3.5 h-3.5 text-cloud-light" />
              <span className="text-xs text-cloud-light/90 font-medium tracking-wide">Platform Overview</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground fade-in-delay-2">
              What is <span className="chrome-text">CloudPulse</span>?
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed fade-in-delay-3">
              An AI-powered multi-cloud incident monitoring dashboard for SREs and DevOps teams.
              Aggregate incidents across providers with real-time monitoring, AI analysis, and automated remediation guidance.
            </p>

            <Link
              href="/auth"
              className="inline-flex items-center gap-2 glass-pill px-6 py-3 text-sm font-medium text-cloud-light hover:bg-primary/20 transition-all fade-in-delay-3"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Providers */}
        <section className="relative px-6 py-24 overflow-hidden">
          <span className="section-watermark top-8" aria-hidden="true">clouds</span>
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="eyebrow">Providers</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mt-3">
                Unified across <span className="chrome-text">every cloud</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <div key={provider.name} className="glass-card p-8 text-center hover:border-white/[0.12] transition-all">
                  <div className={`w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${provider.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-xl font-bold text-white">{provider.name[0]}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1.5">{provider.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Real-time incident tracking and status monitoring
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative px-6 py-24 overflow-hidden">
          <span className="section-watermark top-8" aria-hidden="true">features</span>
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="eyebrow">Capabilities</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mt-3 mb-3">
                Everything you need to <span className="chrome-text">resolve faster</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
                Monitor, analyze, and remediate cloud incidents from a single intelligent surface.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature) => (
                <div key={feature.title} className="glass-card p-6 hover:border-white/[0.12] transition-all">
                  <feature.icon className="w-5 h-5 text-cloud-light mb-4" />
                  <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="relative px-6 py-24 overflow-hidden">
          <span className="section-watermark top-8" aria-hidden="true">workflow</span>
          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <span className="eyebrow">How it works</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mt-3">
                From signal to <span className="chrome-text">solution</span>
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { step: 1, title: "Connect Your Infrastructure", description: "Link your AWS, Azure, or GCP accounts to start monitoring." },
                { step: 2, title: "Incidents Are Detected", description: "CloudPulse aggregates and displays incidents in real-time across all providers." },
                { step: 3, title: "AI Analyzes Each Incident", description: "Our AI generates summaries, root cause analysis, and impact assessments." },
                { step: 4, title: "Get Remediation Guidance", description: "Receive step-by-step recovery plans with immediate, short-term, and long-term actions." },
              ].map((item) => (
                <div key={item.step} className="flex gap-5 items-start glass-card p-6 hover:border-white/[0.12] transition-all">
                  <div className="w-9 h-9 rounded-full bg-primary/15 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <span className="text-cloud-light font-semibold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Under the Hood */}
        <section className="relative px-6 py-24 overflow-hidden">
          <span className="section-watermark top-8" aria-hidden="true">engine</span>
          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <span className="eyebrow">Under the hood</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mt-3">
                How the <span className="chrome-text">data and AI</span> work
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="glass-card p-6">
                <Layers className="w-5 h-5 text-cloud-light mb-4" />
                <h3 className="text-base font-semibold text-foreground mb-2">The data engineering layer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Once you link an AWS, Azure or GCP account, CloudPulse pulls signals from each provider's native APIs (CloudWatch, Azure Monitor, Cloud Operations) on a schedule. The raw events flow into a normalised schema in our backend, so a Lambda timeout in us-east-1 and a Cosmos DB throttle in West Europe end up in the same shape. From there we group related events into incidents, attach metadata like region, service and severity, and store a rolling window of metrics so the dashboard, timeline and weekly intelligence panel can all read from one source of truth.
                </p>
              </div>

              <div className="glass-card p-6">
                <Sparkles className="w-5 h-5 text-cloud-light mb-4" />
                <h3 className="text-base font-semibold text-foreground mb-2">The AI layer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Each normalised incident is sent to a large language model through a backend function, together with the relevant logs and metrics as context. The model is prompted to act like a senior SRE and return a structured response: a short summary of what broke, the likely root cause, the user impact, what to keep watching, and a remediation plan split into immediate, short-term and long-term actions. CLI commands come back as ready-to-copy snippets. The weekly intelligence view runs a second pass over the last seven days of incidents to surface patterns, hotspots and worst-performing services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Teams */}
        <section className="relative px-6 py-24 overflow-hidden">
          <div className="relative max-w-4xl mx-auto glass-card p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-5 h-5 text-cloud-light" />
              <span className="eyebrow">For your team</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-8">
              Built for SREs & DevOps
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Reduce MTTR with AI-powered insights",
                "Unified view across all cloud providers",
                "Copy-paste CLI commands for quick fixes",
                "Track incident patterns over time",
                "Revenue impact estimation",
                "Team collaboration features",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-cloud-light/80 flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative px-6 py-24 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Ready to monitor <span className="chrome-text">smarter</span>?
            </h2>
            <p className="text-muted-foreground mb-10 text-sm md:text-base">
              Join DevOps teams who trust CloudPulse for their incident management.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 glass-pill px-6 py-3 text-sm font-medium text-cloud-light hover:bg-primary/20 transition-all"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/80">
          <p className="tracking-wide">© 2025 CloudPulse</p>
          <p className="tracking-wide">Where intelligence meets infrastructure.</p>
        </div>
      </footer>
    </div>
  );
};

export default Overview;
