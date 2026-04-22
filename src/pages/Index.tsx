import CloudBackground from "@/components/CloudBackground";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import DashboardSection from "@/components/DashboardSection";
import TeamSection from "@/components/TeamSection";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen">
      <CloudBackground />
      <Navigation />

      <main className="relative z-10">
        <HeroSection />
        {user && (
          <>
            <DashboardSection />
            <TeamSection />
          </>
        )}
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

export default Index;
