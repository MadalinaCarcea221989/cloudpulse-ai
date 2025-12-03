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
      <footer className="relative z-10 py-8 px-6 border-t border-cloud-blue/20">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 CloudPulse. Where intelligence meets infrastructure.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
