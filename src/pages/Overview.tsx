import { Link } from "react-router-dom";
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
  Sparkles
} from "lucide-react";

const Overview = () => {
  const features = [
    {
      icon: AlertTriangle,
      title: "Real-Time Incident Monitoring",
      description: "Aggregate incidents from AWS, Azure, and OpenAI in a unified dashboard with live updates."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Get automatic AI summaries and root cause analysis for every incident."
    },
    {
      icon: Cpu,
      title: "Automated Remediation",
      description: "Receive step-by-step remediation guidance with CLI commands you can copy and execute."
    },
    {
      icon: BarChart3,
      title: "Impact Analysis",
      description: "Understand the blast radius with affected services, metrics comparison, and revenue impact estimates."
    },
    {
      icon: Clock,
      title: "Incident Timeline",
      description: "Track incident progression from detection through resolution with visual status indicators."
    },
    {
      icon: Layers,
      title: "Weekly Intelligence",
      description: "AI-generated trend analysis identifying worst-performing providers and service hotspots."
    }
  ];

  const providers = [
    { name: "AWS", color: "from-orange-500 to-yellow-500" },
    { name: "Azure", color: "from-blue-500 to-cyan-500" },
    { name: "OpenAI", color: "from-green-500 to-emerald-500" }
  ];

  return (
    <div className="relative min-h-screen">
      <CloudBackground />
      <Navigation />
      
      <main className="relative z-10 pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-6 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8">
              <Shield className="w-4 h-4 text-cloud-light" />
              <span className="text-sm text-cloud-light font-medium">Platform Overview</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              What is <span className="text-primary">CloudPulse</span>?
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              CloudPulse is an AI-powered multi-cloud incident monitoring dashboard designed for SREs and DevOps teams. 
              We aggregate incidents from multiple cloud providers, providing real-time monitoring, AI analysis, and automated remediation guidance.
            </p>

            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold transition-all"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Providers Section */}
        <section className="px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
              Unified Monitoring Across Providers
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <div key={provider.name} className="glass-card p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${provider.color} flex items-center justify-center`}>
                    <span className="text-2xl font-bold text-white">{provider.name[0]}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{provider.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    Real-time incident tracking and status monitoring
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">
              Key Features
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Everything you need to monitor, analyze, and resolve cloud incidents faster.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="glass-card p-6 hover:bg-card/60 transition-colors">
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
              How CloudPulse Works
            </h2>
            
            <div className="space-y-6">
              {[
                { step: 1, title: "Connect Your Infrastructure", description: "Link your AWS, Azure, or OpenAI accounts to start monitoring." },
                { step: 2, title: "Incidents Are Detected", description: "CloudPulse aggregates and displays incidents in real-time across all providers." },
                { step: 3, title: "AI Analyzes Each Incident", description: "Our AI generates summaries, root cause analysis, and impact assessments." },
                { step: 4, title: "Get Remediation Guidance", description: "Receive step-by-step recovery plans with immediate, short-term, and long-term actions." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start glass-card p-6">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Teams Section */}
        <section className="px-6 mb-20">
          <div className="max-w-4xl mx-auto glass-card p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Built for SREs & DevOps</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Reduce MTTR with AI-powered insights",
                "Unified view across all cloud providers",
                "Copy-paste CLI commands for quick fixes",
                "Track incident patterns over time",
                "Revenue impact estimation",
                "Team collaboration features"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Ready to Monitor Smarter?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join DevOps teams who trust CloudPulse for their incident management.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold transition-all"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-cloud-blue/20">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 CloudPulse. Where intelligence meets infrastructure.</p>
        </div>
      </footer>
    </div>
  );
};

export default Overview;
